// controllers/lead.controller.ts — req/res + input validation.
// Rule: NO SQL here. This layer only shapes HTTP in/out and calls services.

import { NextResponse } from "next/server";
import { DatabaseNotConfiguredError } from "@/config/db";
import * as leadService from "@/server/services/lead.service";
import { InvalidSiteKeyError } from "@/server/services/lead.service";
import type { IngestLeadInput } from "@/shared/types";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** POST /api/ingest/lead — a client site's form submits here. */
export async function ingest(req: Request): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const siteKey = body.site_key ?? body.siteKey;
  const contact = body.contact ?? body.phone ?? body.email;

  if (!isNonEmptyString(siteKey)) {
    return NextResponse.json({ error: "missing_site_key" }, { status: 400 });
  }
  if (!isNonEmptyString(contact)) {
    return NextResponse.json({ error: "missing_contact" }, { status: 400 });
  }

  const input: IngestLeadInput = {
    siteKey,
    contact,
    name: isNonEmptyString(body.name) ? body.name : undefined,
    message: isNonEmptyString(body.message) ? body.message : undefined,
  };

  try {
    const lead = await leadService.createFromSite(input);
    // TODO(next step): emit "lead.created" to the job runner (alerts + AI
    // auto-reply). Kept out of the request path so ingest stays fast.
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    if (err instanceof InvalidSiteKeyError) {
      return NextResponse.json({ error: "invalid_site_key" }, { status: 401 });
    }
    if (err instanceof DatabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "database_not_configured", detail: err.message },
        { status: 503 }
      );
    }
    console.error("[lead.controller.ingest]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

/** GET /api/leads?status=new — owner portal reads its own tenant's leads. */
export async function list(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const tenantId = req.headers.get("x-tenant-id"); // replaced by real session auth later
  const status = searchParams.get("status") ?? undefined;

  if (!isNonEmptyString(tenantId)) {
    return NextResponse.json({ error: "missing_tenant" }, { status: 401 });
  }

  try {
    const leads = await leadService.getLeadsForTenant(
      tenantId,
      status as never
    );
    return NextResponse.json({ leads });
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "database_not_configured", detail: err.message },
        { status: 503 }
      );
    }
    console.error("[lead.controller.list]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
