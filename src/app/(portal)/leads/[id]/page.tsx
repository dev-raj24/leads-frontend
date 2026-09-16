"use client";

import { use } from "react";
import Link from "next/link";
import { IconGlobe, IconRobot, IconWhatsapp, IconArrowRight } from "@/components/icons";
import { ApiError } from "@/utils/apiUtils";
import { useLead } from "@/hooks/leads/query";
import { useUpdateLeadStatus } from "@/hooks/leads/mutation";
import { timeAgo, statusLabel, sourceLabel, maskContact } from "@/lib/format";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading: loading, error: queryError } = useLead(id);
  const lead = data?.lead ?? null;
  const updateStatusMutation = useUpdateLeadStatus();

  const error = queryError
    ? queryError instanceof ApiError && queryError.status === 404
      ? "not_found"
      : "network_error"
    : null;

  function markWon() {
    if (!lead) return;
    updateStatusMutation.mutate({ id: lead.id, status: "won" });
  }

  if (loading) {
    return <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>Loading…</div>;
  }
  if (error || !lead) {
    return (
      <>
        <div className="p-mh">
          <Link href="/leads" style={{ fontSize: 13, fontWeight: 700, color: "#475467" }}>← Leads</Link>
        </div>
        <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#D92D20" }}>
          {error === "not_found" ? "This lead doesn't exist." : "Couldn't load this lead — is leadworks-api running?"}
        </div>
      </>
    );
  }

  const [label, cls] = statusLabel(lead.status);
  const SourceIcon = lead.source === "whatsapp" ? IconWhatsapp : IconGlobe;

  return (
    <>
      <div className="p-mh">
        <Link href="/leads" style={{ fontSize: 13, fontWeight: 700, color: "#475467" }}>
          ← Leads
        </Link>
        <span className={`pp ${cls}`}>{label}</span>
      </div>

      <div className="p-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{lead.name ?? "Unknown"}</div>
        <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <SourceIcon size={14} /> {sourceLabel(lead.source)} · {maskContact(lead.contact)} · {timeAgo(lead.createdAt)} ago
        </div>
      </div>

      <div style={{ borderLeft: "2px dashed #E4E7EC", marginLeft: 8, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 11 }}>{(lead.name ?? "LEAD").toUpperCase()} · {timeAgo(lead.createdAt)} ago</div>
          <div style={{ color: "#475467", marginTop: 3, fontSize: 13.5, lineHeight: 1.5 }}>
            &quot;{lead.message ?? "No message left."}&quot;
          </div>
        </div>
      </div>

      <div className="p-card" style={{ padding: 16, background: "#FFFDF4", borderColor: "#14161A", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 800, fontSize: 12.5, marginBottom: 7 }}>
          <IconRobot size={15} style={{ color: "#155EEF" }} /> AI reply
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#475467" }}>
          AI auto-reply drafting isn&apos;t wired up yet in this build (see
          INTEGRATION_PLAN.md, Phase D) — this card will show a real drafted
          reply once <code>/api/ai/draft-reply</code> exists.
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="pbtn dark"
          style={{ flex: 1, fontSize: 12.5, opacity: updateStatusMutation.isPending ? 0.6 : 1 }}
          onClick={markWon}
          disabled={updateStatusMutation.isPending || lead.status === "won"}
        >
          {lead.status === "won" ? "✓ Won" : updateStatusMutation.isPending ? "Saving…" : "✓ Mark as Won"}
        </button>
        <button className="pbtn lite" style={{ flex: 1, fontSize: 12.5, border: "1.5px solid #14161A", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} disabled>
          Schedule follow-up <IconArrowRight size={13} />
        </button>
      </div>
    </>
  );
}
