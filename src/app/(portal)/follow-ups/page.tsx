"use client";

import { useState } from "react";
import Link from "next/link";
import { IconRefresh } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useApproveFollowup, useCancelFollowup, useMarkFollowupSent } from "@/hooks/followups/mutation";
import { useFollowups } from "@/hooks/followups/query";
import { initials } from "@/lib/format";
import type { Followup, FollowupStatus } from "@/types/models";

const STATUS_PILL: Record<FollowupStatus, [string, string]> = {
  pending: ["p", "NEEDS APPROVAL"],
  approved: ["n", "APPROVED"],
  processing: ["n", "SENDING"],
  manual: ["r", "SEND MANUALLY"],
  sent: ["w", "SENT"],
  cancelled: ["c", "CANCELLED"],
};

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function FollowupCard({ followup }: { followup: Followup }) {
  const approve = useApproveFollowup();
  const cancel = useCancelFollowup();
  const markSent = useMarkFollowupSent();
  const [text, setText] = useState(followup.template ?? "");
  const [copied, setCopied] = useState(false);
  const [cls, label] = STATUS_PILL[followup.status];
  const busy = approve.isPending || cancel.isPending || markSent.isPending;
  const active = followup.status === "pending" || followup.status === "approved" || followup.status === "manual";

  return (
    <div className="fu">
      <div className="fu-top">
        <Link href={`/leads/${followup.leadId}`} className="who">
          <span className="av">{initials(followup.leadName)}</span>
          <div className="who-t">
            <strong>{followup.leadName}</strong>
            <small>{followup.leadContact}</small>
          </div>
        </Link>
        <span className={`pp ${cls}`}>{label}</span>
      </div>

      <div className="fu-why">
        {followup.status === "sent" && followup.sentAt ? `Sent ${formatWhen(followup.sentAt)}` : `Due ${formatWhen(followup.runAt)}`}
        {followup.status === "pending" && " — the AI writes the message when it's due"}
      </div>

      {followup.status === "pending" && (
        <textarea
          className="finput"
          rows={2}
          style={{ marginTop: 14 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Optional: write the message yourself, or leave empty and let the AI draft it."
        />
      )}
      {(followup.status === "manual" || followup.status === "sent") && followup.template && (
        <div className="fu-draft"><span>&ldquo;{followup.template}&rdquo;</span></div>
      )}

      {active && (
        <div className="form-foot">
          {followup.status === "pending" && (
            <Button size="sm" disabled={busy} onClick={() => approve.mutate({ id: followup.id, template: text.trim() || undefined })}>Approve</Button>
          )}
          {followup.status === "manual" && (
            <>
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(followup.template ?? "");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copied" : "Copy message"}
              </Button>
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => markSent.mutate(followup.id)}>Mark as sent</Button>
            </>
          )}
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => cancel.mutate(followup.id)}>Cancel</Button>
        </div>
      )}
    </div>
  );
}

export default function FollowUpsPage() {
  const { data, isLoading, isError } = useFollowups();
  const followups = data?.followups ?? [];
  const open = followups.filter((f) => f.status === "pending" || f.status === "manual").length;

  return (
    <>
      <PageHead
        eyebrow="Nurture"
        title="Follow-ups"
        sub={isLoading ? "Loading…" : `${open} waiting on you. Approve a nudge and it goes out at the scheduled time.`}
      />

      {isLoading && <div className="pnl fu"><Skeleton width="30%" height={18} /><Skeleton width="60%" height={14} style={{ marginTop: 12 }} /></div>}
      {isError && <div className="state-err">Couldn&apos;t load follow-ups — make sure leadworks-api is running.</div>}

      {!isLoading && !isError && followups.length === 0 && (
        <div className="pnl">
          <EmptyState icon={<IconRefresh size={26} />} title="Nothing scheduled" text="A follow-up is scheduled automatically for every new lead, and you can add more from a lead's page." />
        </div>
      )}

      {followups.length > 0 && (
        <div className="pnl">
          {followups.map((f) => <FollowupCard key={f.id} followup={f} />)}
        </div>
      )}
    </>
  );
}
