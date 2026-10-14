"use client";

import { useMemo, useState } from "react";
import { IconTag } from "@/components/icons";
import { ChatThreadModal } from "@/components/portal/ChatThreadModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { Button } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Table, type Column } from "@/components/ui/Table";
import { useChatConversations } from "@/hooks/chatWidget/query";
import { initials, timeAgo } from "@/lib/format";
import type { ChatConversation } from "@/types/models";

const FROM_PILL: Record<ChatConversation["lastFrom"], [string, string]> = {
  visitor: ["r", "NEEDS REPLY"],
  ai: ["n", "AI REPLIED"],
  team: ["w", "TEAM REPLIED"],
};

export function Conversations() {
  const { data, isLoading } = useChatConversations();
  const [open, setOpen] = useState<string | null>(null);
  const rows = data?.conversations ?? [];

  const columns: Column<ChatConversation>[] = useMemo(
    () => [
      {
        key: "visitor",
        header: "Visitor",
        width: "minmax(150px, 1.2fr)",
        sort: (c) => (c.name ?? c.contact ?? "").toLowerCase(),
        cell: (c) => (
          <div className="who">
            <span className="av">{initials(c.name ?? c.contact ?? "Visitor")}</span>
            <div className="who-t">
              <strong>{c.name || "Website visitor"}</strong>
              <small>{c.isLead ? c.contact : "No contact yet"} · {c.messageCount} msgs</small>
            </div>
          </div>
        ),
      },
      {
        key: "last",
        header: "Last message",
        width: "minmax(0, 1.4fr)",
        hideOnMobile: true,
        cell: (c) => (
          <span className="ago" style={{ textAlign: "left", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.lastFrom === "visitor" ? "" : c.lastFrom === "team" ? "You: " : "AI: "}
            {c.lastMessage}
          </span>
        ),
      },
      {
        key: "state",
        header: "Status",
        width: "130px",
        sort: (c) => (c.needsReply ? 0 : 1),
        cell: (c) => {
          const [cls, label] = FROM_PILL[c.lastFrom];
          return <span className={`pp ${cls}`}>{label}</span>;
        },
      },
      {
        key: "when",
        header: "Active",
        width: "80px",
        align: "right",
        sort: (c) => new Date(c.lastMessageAt).getTime(),
        cell: (c) => <span className="ago">{timeAgo(c.lastMessageAt)}</span>,
      },
      {
        key: "open",
        header: "",
        width: "90px",
        align: "right",
        cell: (c) => (
          <div className="row-actions">
            <Button size="sm" variant={c.needsReply ? "primary" : "secondary"} onClick={() => setOpen(c.leadId)}>
              {c.needsReply ? "Reply" : "View"}
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      {isLoading && <ListSkeleton />}
      {!isLoading && rows.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconTag size={26} />}
            title="No chats yet"
            text="When a visitor chats through your Leadworks chat page, the whole conversation shows up here and you can jump in and reply."
          />
        </div>
      )}
      {!isLoading && rows.length > 0 && (
        <Table columns={columns} rows={rows} rowKey={(c) => c.leadId} pageSize={10} itemLabel="chats" defaultSort={{ key: "when", dir: "desc" }} />
      )}
      {open && <ChatThreadModal leadId={open} onClose={() => setOpen(null)} />}
    </>
  );
}

