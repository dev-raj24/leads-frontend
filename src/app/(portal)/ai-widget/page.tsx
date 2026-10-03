"use client";

import { useMemo, useState } from "react";
import { IconLock, IconTag } from "@/components/icons";
import { ChatDesignForm } from "@/components/portal/ChatDesignForm";
import { ChatThreadModal } from "@/components/portal/ChatThreadModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Table, type Column } from "@/components/ui/Table";
import { env } from "@/config/env";
import { useChatConversations } from "@/hooks/chatWidget/query";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import { useMySite } from "@/hooks/sites/query";
import { useTenant } from "@/hooks/tenant/query";
import { initials, timeAgo } from "@/lib/format";
import type { ChatConversation } from "@/types/models";

const STEPS = [
  ["Bubble on your site", "A chat bubble appears on every page, powered by the same AI that knows your business."],
  ["Answers 24/7", "Visitors get instant answers about services, prices and timings — even at 2am."],
  ["Every chat becomes a lead", "Conversations are captured automatically into your inbox with full history."],
];

const embedSnippet = (apiKey: string) =>
  `<script src="${env.apiUrl}/widget.js"\n  data-site-key="${apiKey}"\n  data-api="${env.apiUrl}">\n</script>`;

const FROM_PILL: Record<ChatConversation["lastFrom"], [string, string]> = {
  visitor: ["r", "NEEDS REPLY"],
  ai: ["n", "AI REPLIED"],
  team: ["w", "TEAM REPLIED"],
};

type TabKey = "chats" | "design" | "install";

function Conversations() {
  const { data, isLoading } = useChatConversations();
  const [open, setOpen] = useState<string | null>(null);
  const rows = data?.conversations ?? [];

  const columns: Column<ChatConversation>[] = useMemo(
    () => [
      {
        key: "visitor",
        header: "Visitor",
        width: "minmax(150px, 1.2fr)",
        sort: (c) => (c.name ?? c.contact).toLowerCase(),
        cell: (c) => (
          <div className="who">
            <span className="av">{initials(c.name ?? c.contact)}</span>
            <div className="who-t">
              <strong>{c.name || "Website visitor"}</strong>
              <small>{c.contact} · {c.messageCount} msgs</small>
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
            text="When a visitor talks to the chat bubble on your site, the whole conversation shows up here and you can jump in and reply."
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

export default function AiWidgetPage() {
  const { data: tenantData } = useTenant();
  const { data: siteData, isLoading } = useMySite();
  const { data: convData } = useChatConversations();
  const update = useUpdateSiteSettings();
  const [tab, setTab] = useState<TabKey>("chats");

  const isPro = tenantData?.tenant.plan === "pro";
  const site = siteData?.site ?? null;
  const enabled = isPro && (site?.settings as Record<string, unknown> | undefined)?.widget === true;
  const needsReply = (convData?.conversations ?? []).filter((c) => c.needsReply).length;

  if (!isLoading && !isPro) {
    return (
      <>
        <PageHead eyebrow="Module" title={<>AI chat <em>widget</em></>} sub="Talks to your visitors and captures their details as leads." />
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="AI chat widget is a Pro feature"
            text="Upgrade to Pro for a 24/7 chat bubble on your site that answers visitors and turns conversations into leads."
            action={<Button href="/account" icon={<IconTag size={15} />}>View plans</Button>}
          />
        </div>
      </>
    );
  }

  if (!isLoading && isPro && !enabled && site) {
    return (
      <>
        <PageHead
          eyebrow="Module"
          title={<>AI chat <em>widget</em></>}
          sub="Talks to your visitors and captures their details as leads."
          actions={
            <Button
              loading={update.isPending}
              loadingText="Turning on…"
              onClick={() => update.mutate({ siteId: site.id, settings: { ...site.settings, widget: true } })}
            >
              Turn on chat widget
            </Button>
          }
        />
        <div className="pnl">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="li">
              <span className="av display" style={{ fontSize: 20 }}>{i + 1}</span>
              <div className="li-main"><div className="li-title">{t}</div><div className="li-sub" style={{ whiteSpace: "normal" }}>{d}</div></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  const tabs: Array<[TabKey, string]> = [
    ["chats", needsReply ? `Conversations (${needsReply})` : "Conversations"],
    ["design", "Design"],
    ["install", "Install"],
  ];

  return (
    <>
      <PageHead
        eyebrow="Module"
        title={<>AI chat <em>widget</em></>}
        sub="See every website chat, reply as the team, and make the bubble look like your brand."
        actions={<span className="pp w">● LIVE</span>}
      />

      <div className="seg" role="tablist" style={{ marginBottom: 24 }}>
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "chats" && <Conversations />}
      {tab === "design" && site && <ChatDesignForm site={site} />}
      {tab === "install" && (
        <div className="pnl pad" style={{ maxWidth: 760 }}>
          <div className="sec-t" style={{ marginTop: 0 }}>Website snippet</div>
          <CodeSnippet code={embedSnippet(site?.apiKey ?? "connect-your-database")} />
          <p className="hint">Paste this just before &lt;/body&gt; on every page. It's the only script you need — it also powers your offers and blog (see Settings for where to place those).</p>
        </div>
      )}
    </>
  );
}
