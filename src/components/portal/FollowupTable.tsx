"use client";

import Link from "next/link";
import { Table, type Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useCancelFollowup } from "@/hooks/followups/mutation";
import { initials } from "@/lib/format";
import type { Followup, FollowupStatus } from "@/types/models";

export const STATUS_PILL: Record<FollowupStatus, [string, string]> = {
  pending: ["p", "NEEDS APPROVAL"],
  approved: ["n", "APPROVED"],
  processing: ["n", "SENDING"],
  manual: ["r", "SEND MANUALLY"],
  sent: ["w", "SENT"],
  cancelled: ["c", "CANCELLED"],
};

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function FollowupActions({ followup, onOpen }: { followup: Followup; onOpen: (f: Followup) => void }) {
  const cancel = useCancelFollowup();

  if (followup.status === "sent" || followup.status === "cancelled") {
    return <span className="ago">—</span>;
  }

  if (followup.status === "approved" || followup.status === "processing") {
    return (
      <div className="row-actions">
        <Button size="sm" variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate(followup.id)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="row-actions">
      <Button size="sm" onClick={() => onOpen(followup)}>Review</Button>
    </div>
  );
}

function columnsFor(onOpen: (f: Followup) => void): Column<Followup>[] {
  return [
    {
      key: "lead",
      header: "Lead",
      width: "minmax(0, 1.5fr)",
      sort: (f) => f.leadName.toLowerCase(),
      cell: (f) => (
        <Link href={`/leads/${f.leadId}`} className="who">
          <span className="av">{initials(f.leadName)}</span>
          <div className="who-t">
            <strong>{f.leadName}</strong>
            <small>{f.leadContact}</small>
          </div>
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "150px",
      sort: (f) => f.status,
      cell: (f) => {
        const [cls, label] = STATUS_PILL[f.status];
        return <span className={`pp ${cls}`}>{label}</span>;
      },
    },
    {
      key: "message",
      header: "Message",
      width: "minmax(0, 1.6fr)",
      hideOnMobile: true,
      cell: (f) => <span className="ago" style={{ textAlign: "left" }}>{f.template ? `"${f.template}"` : "AI will draft it"}</span>,
    },
    {
      key: "when",
      header: "Due / Sent",
      width: "150px",
      align: "right",
      hideOnMobile: true,
      sort: (f) => new Date(f.status === "sent" && f.sentAt ? f.sentAt : f.runAt).getTime(),
      cell: (f) => <span className="ago">{formatWhen(f.status === "sent" && f.sentAt ? f.sentAt : f.runAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "130px",
      align: "right",
      cell: (f) => <FollowupActions followup={f} onOpen={onOpen} />,
    },
  ];
}

interface FollowupTableProps {
  followups: Followup[];
  pageSize?: number;
  onOpen: (f: Followup) => void;
}

export function FollowupTable({ followups, pageSize, onOpen }: FollowupTableProps) {
  return (
    <Table
      columns={columnsFor(onOpen)}
      rows={followups}
      rowKey={(f) => f.id}
      pageSize={pageSize}
      defaultSort={{ key: "when", dir: "asc" }}
      itemLabel="follow-ups"
    />
  );
}
