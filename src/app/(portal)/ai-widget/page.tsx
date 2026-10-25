"use client";

import { useState } from "react";
import { IconLock, IconTag } from "@/components/icons";
import { ChatDesignForm } from "@/components/portal/ChatDesignForm";
import { EmptyState } from "@/components/portal/EmptyState";
import { InstallGuide } from "@/components/portal/InstallGuide";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import { useMySite } from "@/hooks/sites/query";
import { useTenant } from "@/hooks/tenant/query";

const STEPS = [
  ["A chat page with your link", "Share one link on Instagram, WhatsApp or your Google profile. Visitors open it and start chatting, no app or sign-up."],
  ["Answers 24/7", "Visitors get instant answers about services, prices and timings, even at 2am, from the same AI that knows your business."],
  ["A chat becomes a lead when they share contact details", "Visitors can just ask. Once they give a phone number or email, the chat shows up in Leads and you get an alert."],
];

const pageLink = (path: string) => `${typeof window === "undefined" ? "" : window.location.origin}${path}`;

type TabKey = "design" | "install" | "share";

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
        <PageHead eyebrow="Module" title={<>Website <em>chat</em></>} sub="Talks to your visitors and captures their details as leads." />
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="Website chat is a Pro feature"
            text="Upgrade to Pro for a 24/7 chat page that answers visitors and turns conversations into leads."
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
          title={<>Website <em>chat</em></>}
          sub="Talks to your visitors and captures their details as leads."
          actions={
            <Button
              loading={update.isPending}
              loadingText="Turning on…"
              onClick={() => update.mutate({ siteId: site.id, settings: { ...site.settings, widget: true } })}
            >
              Turn on chat
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
    ["share", "Share link"],
  ];

  return (
    <>
      <PageHead
        eyebrow="Module"
        title={<>Website <em>chat</em></>}
        sub="Make the chat look like your brand, then add the script or share the chat link. Conversations are in Chats."
        actions={
          <>
            <Button href="/chats" variant="secondary" size="sm">Open chats</Button>
            {site && (
              <Button
                variant="secondary"
                size="sm"
                loading={update.isPending}
                loadingText="Turning off…"
                onClick={() => update.mutate({ siteId: site.id, settings: { ...site.settings, widget: false } })}
              >
                Turn off
              </Button>
            )}
            <span className="pp w">● LIVE</span>
          </>
        }
      />

      <div className="seg" role="tablist" style={{ marginBottom: 24 }}>
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "design" && site && <ChatDesignForm site={site} />}
      {tab === "install" && <InstallGuide apiKey={site?.apiKey ?? "connect-your-database"} isPro={isPro} />}
      {tab === "share" && (
        <div className="pnl pad" style={{ maxWidth: 760 }}>
          <div className="sec-t" style={{ marginTop: 0 }}>Your chat link</div>
          <CodeSnippet code={site ? pageLink(`/c/${site.apiKey}`) : "Loading…"} />
          <p className="hint">Put this link in your Instagram bio, WhatsApp status or business profile, or behind a &ldquo;Chat with us&rdquo; button on your website. No script or install needed.</p>
        </div>
      )}
    </>
  );
}
