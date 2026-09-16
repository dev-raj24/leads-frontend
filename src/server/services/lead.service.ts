// services/lead.service.ts — business logic + RAW SQL.
// Rule (PROJECT_STRUCTURE.md): raw SQL lives ONLY here. Every query is
// parametrized ($1, $2 ...) and every leads query is scoped by tenant_id.

import { query } from "@/config/db";
import type { IngestLeadInput, Lead, LeadStatus } from "@/shared/types";

interface SiteRow {
  id: string;
  tenant_id: string;
}

interface LeadRow {
  id: string;
  tenant_id: string;
  site_id: string | null;
  name: string | null;
  contact: string;
  message: string | null;
  source: string;
  status: string;
  score: number;
  created_at: string;
  last_activity_at: string;
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    siteId: row.site_id,
    name: row.name,
    contact: row.contact,
    message: row.message,
    source: row.source as Lead["source"],
    status: row.status as LeadStatus,
    score: row.score,
    createdAt: row.created_at,
    lastActivityAt: row.last_activity_at,
  };
}

export class InvalidSiteKeyError extends Error {
  constructor() {
    super("Invalid or unknown site key.");
    this.name = "InvalidSiteKeyError";
  }
}

/**
 * A lead lands from a client's existing static site: the widget.js snippet
 * (or a swapped form action) POSTs here with the site's api_key. We resolve
 * the key to a tenant, insert a tenant-tagged lead, and log the event that
 * downstream jobs (alerts, AI auto-reply) react to.
 */
export async function createFromSite(input: IngestLeadInput): Promise<Lead> {
  // 1. GET — resolve site_key -> tenant (never trust a client-supplied tenant id)
  const sites = await query<SiteRow>(
    `select id, tenant_id from sites where api_key = $1 limit 1`,
    [input.siteKey]
  );
  const site = sites[0];
  if (!site) throw new InvalidSiteKeyError();

  // 2. USE — insert the lead, tenant-tagged
  const rows = await query<LeadRow>(
    `insert into leads (tenant_id, site_id, name, contact, message, source, status)
     values ($1, $2, $3, $4, $5, 'form', 'new')
     returning *`,
    [site.tenant_id, site.id, input.name ?? null, input.contact, input.message ?? null]
  );
  const lead = toLead(rows[0]);

  // 3. audit trail — downstream jobs (alerts / AI auto-reply) subscribe to
  // "lead.created" events; recording it here keeps the timeline authoritative
  // even before the job runner picks it up.
  await query(
    `insert into lead_events (lead_id, type, payload) values ($1, 'created', $2::jsonb)`,
    [lead.id, JSON.stringify({ source: "form", siteId: site.id })]
  );

  return lead;
}

export async function getLeadsForTenant(
  tenantId: string,
  status?: LeadStatus
): Promise<Lead[]> {
  const rows = status
    ? await query<LeadRow>(
        `select * from leads where tenant_id = $1 and status = $2 order by created_at desc`,
        [tenantId, status]
      )
    : await query<LeadRow>(
        `select * from leads where tenant_id = $1 order by created_at desc`,
        [tenantId]
      );
  return rows.map(toLead);
}

export async function updateLeadStatus(
  tenantId: string,
  leadId: string,
  status: LeadStatus
): Promise<Lead | null> {
  const rows = await query<LeadRow>(
    `update leads set status = $3, last_activity_at = now()
     where id = $2 and tenant_id = $1
     returning *`,
    [tenantId, leadId, status]
  );
  if (!rows[0]) return null;

  await query(
    `insert into lead_events (lead_id, type, payload) values ($1, 'status_changed', $2::jsonb)`,
    [leadId, JSON.stringify({ status })]
  );

  return toLead(rows[0]);
}
