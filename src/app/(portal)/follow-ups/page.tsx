"use client";

import Link from "next/link";
import { IconRefresh } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFollowups } from "@/hooks/followups/query";
import { initials } from "@/lib/format";

const STATUS_PILL = { pending: ["p", "SCHEDULED"], sent: ["w", "SENT"], cancelled: ["c", "CANCELLED"] } as const;

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function FollowUpsPage() {
  const { data, isLoading, isError } = useFollowups();
  const followups = data?.followups ?? [];
  const scheduled = followups.filter((f) => f.status === "pending").length;

  return (
    <>
      <PageHead
        eyebrow="Nurture"
        title="Follow-ups"
        sub={isLoading ? "Loading…" : `${scheduled} scheduled — so no lead goes cold.`}
      />

      {isLoading && (
        <div className="pnl fu"><Skeleton width="30%" height={18} /><Skeleton width="60%" height={14} style={{ marginTop: 12 }} /></div>
      )}
      {isError && <div className="state-err">Couldn&apos;t load follow-ups — make sure leadworks-api is running.</div>}

      {!isLoading && !isError && followups.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconRefresh size={26} />}
            title="Nothing scheduled"
            text="Follow-ups scheduled for your leads will appear here."
          />
        </div>
      )}

      {followups.length > 0 && (
        <div className="pnl">
          {followups.map((f) => {
            const [cls, label] = STATUS_PILL[f.status];
            return (
              <div key={f.id} className="fu">
                <div className="fu-top">
                  <Link href={`/leads/${f.leadId}`} className="who">
                    <span className="av">{initials(f.leadName)}</span>
                    <div className="who-t"><strong>{f.leadName}</strong></div>
                  </Link>
                  <span className={`pp ${cls}`}>{label}</span>
                </div>
                <div className="fu-why">{formatWhen(f.runAt)}</div>
                {f.template && <div className="fu-draft"><span>&ldquo;{f.template}&rdquo;</span></div>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
