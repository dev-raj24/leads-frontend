"use client";

import { use } from "react";
import Link from "next/link";
import { IconArrowRight, IconChat, IconGlobe, IconPhone, IconRobot, IconWhatsapp } from "@/components/icons";
import { useLead } from "@/hooks/leads/query";
import { useUpdateLeadStatus } from "@/hooks/leads/mutation";
import { Skeleton } from "@/components/ui/Skeleton";
import { apiErrorCode } from "@/lib/errors";
import { initials, sourceLabel, statusLabel, timeAgo } from "@/lib/format";
import type { LeadStatus } from "@/types/models";
import { Button } from "@/components/ui/Button";

const SOURCE_ICON = { form: IconGlobe, whatsapp: IconWhatsapp, chat_widget: IconChat, missed_call: IconPhone } as const;

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useLead(id);
  const updateStatus = useUpdateLeadStatus();
  const lead = data?.lead ?? null;

  const setStatus = (status: LeadStatus) => lead && updateStatus.mutate({ id: lead.id, status });

  if (isLoading) {
    return (
      <>
        <Skeleton width={90} height={14} style={{ marginBottom: 24 }} />
        <div className="pnl pad"><Skeleton width="40%" height={32} /><Skeleton width="70%" height={14} style={{ marginTop: 18 }} /></div>
      </>
    );
  }

  if (error || !lead) {
    const notFound = apiErrorCode(error) === "not_found";
    return (
      <>
        <Link href="/leads" className="back">← All leads</Link>
        <div className="state-err">{notFound ? "This lead doesn't exist." : "Couldn't load this lead — is leadworks-api running?"}</div>
      </>
    );
  }

  const [label, cls] = statusLabel(lead.status);
  const SourceIcon = SOURCE_ICON[lead.source] ?? IconGlobe;
  const isEmail = lead.contact.includes("@");
  const custom = Object.entries(lead.customFields ?? {});

  return (
    <>
      <Link href="/leads" className="back">← All leads</Link>

      <div className="ld">
        <div className="pnl">
          <div className="lead-h">
            <span className="av">{initials(lead.name ?? lead.contact)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2>{lead.name ?? "Unknown lead"}</h2>
              <small>
                <SourceIcon size={13} style={{ verticalAlign: "-2px" }} /> {sourceLabel(lead.source)} · {timeAgo(lead.createdAt)} ago
              </small>
            </div>
            <span className={`pp ${cls}`}>{label}</span>
          </div>

          <div className="thread">
            <span className="thread-note">{new Date(lead.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
            <div className="bub in">{lead.message ?? "No message left."}</div>
          </div>

          <div className="aidraft">
            <b><IconRobot size={16} style={{ color: "var(--primary)" }} /> AI reply</b>
            <p>Drafting replies with AI isn&apos;t switched on yet — once it is, a suggested response for this enquiry will appear here for you to send.</p>
          </div>
        </div>

        <div>
          <div className="pnl">
            <div className="dl">
              <div className="dl-r"><span>Contact</span><span>{isEmail ? <a href={`mailto:${lead.contact}`}>{lead.contact}</a> : <a href={`tel:${lead.contact}`}>{lead.contact}</a>}</span></div>
              <div className="dl-r"><span>Source</span><span>{sourceLabel(lead.source)}</span></div>
              <div className="dl-r"><span>Received</span><span>{timeAgo(lead.createdAt)} ago</span></div>
              <div className="dl-r"><span>Last activity</span><span>{timeAgo(lead.lastActivityAt)} ago</span></div>
              {custom.map(([k, v]) => <div className="dl-r" key={k}><span>{k}</span><span>{String(v)}</span></div>)}
            </div>
            <div className="side-acts">
              <Button block onClick={() => setStatus("won")} disabled={lead.status === "won"} loading={updateStatus.isPending} loadingText="Saving…">
                {lead.status === "won" ? "✓ Won" : "Mark as won"}
              </Button>
              {lead.status === "new" && <Button block variant="secondary" onClick={() => setStatus("replied")} disabled={updateStatus.isPending}>Mark as replied</Button>}
              {lead.status !== "closed" && lead.status !== "won" && <Button block variant="secondary" onClick={() => setStatus("closed")} disabled={updateStatus.isPending}>Close lead</Button>}
              <Button block variant="secondary" disabled iconRight={<IconArrowRight size={14} />}>Schedule follow-up</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
