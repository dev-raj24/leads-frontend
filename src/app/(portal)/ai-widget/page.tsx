"use client";

import { useState } from "react";
import { IconLock, IconTag } from "@/components/icons";
import { ChatDesignForm } from "@/components/portal/ChatDesignForm";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { env } from "@/config/env";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import { useMySite } from "@/hooks/sites/query";
import { useTenant } from "@/hooks/tenant/query";

const STEPS = [
  ["Bubble on your site", "A chat bubble appears on every page, powered by the same AI that knows your business."],
  ["Answers 24/7", "Visitors get instant answers about services, prices and timings — even at 2am."],
  ["A chat becomes a lead when they share contact details", "Visitors can just ask. Once they give a phone number or email, the chat shows up in Leads and you get an alert."],
];

const embedSnippet = (apiKey: string) =>
  `<script src="${env.apiUrl}/widget.js"\n  data-site-key="${apiKey}"\n  data-api="${env.apiUrl}">\n</script>`;

type TabKey = "design" | "install";

export default function AiWidgetPage() {
  const { data: tenantData } = useTenant();
  const { data: siteData, isLoading } = useMySite();
  const update = useUpdateSiteSettings();
  const [tab, setTab] = useState<TabKey>("design");

  const isPro = tenantData?.tenant.plan === "pro";
  const site = siteData?.site ?? null;
  const enabled = isPro && (site?.settings as Record<string, unknown> | undefined)?.widget === true;

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
    ["design", "Design"],
    ["install", "Install"],
  ];

  return (
    <>
      <PageHead
        eyebrow="Module"
        title={<>AI chat <em>widget</em></>}
        sub="Make the bubble look like your brand and install it. Conversations are in Chats."
        actions={<><Button href="/chats" variant="secondary" size="sm">Open chats</Button><span className="pp w">● LIVE</span></>}
      />

      <div className="seg" role="tablist" style={{ marginBottom: 24 }}>
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

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
