"use client";

import { useEffect, useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Button } from "@/components/ui/Button";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { PageHead } from "@/components/portal/PageHead";
import { env } from "@/config/env";
import { useMySite } from "@/hooks/sites/query";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import { useTenant } from "@/hooks/tenant/query";

const MODULES = [
  { key: "alerts", label: "Instant alerts", desc: "Get an email the moment a lead arrives", def: true, pro: false },
  { key: "autoreply", label: "AI auto-reply", desc: "AI writes the first reply within seconds and shows it in your website chat", def: true, pro: false },
  { key: "widget", label: "AI site chat widget", desc: "24/7 chat and lead capture on your website", def: false, pro: false },
  { key: "offers", label: "Offers & banners", desc: "Show your live offers on your website", def: true, pro: false },
  { key: "autofollow", label: "Auto follow-up", desc: "Send scheduled follow-ups without waiting for your approval", def: false, pro: true },
];

const BLOG_MOUNT = "<div data-leadworks-blog></div>";
const OFFER_MOUNT = "<div data-leadworks-offer></div>";

const embedSnippet = (script: string, apiKey: string) =>
  `<script src="${env.apiUrl}/${script}"\n  data-site-key="${apiKey}"\n  data-api="${env.apiUrl}">\n</script>`;

export default function SettingsPage() {
  const { data, isLoading } = useMySite();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const updateSettings = useUpdateSiteSettings();
  const site = data?.site ?? null;

  const [state, setState] = useState<Record<string, boolean>>(Object.fromEntries(MODULES.map((m) => [m.key, m.def])));

  useEffect(() => {
    if (site) setState((s) => ({ ...s, ...(site.settings as Record<string, boolean>) }));
  }, [site]);

  const apiKey = site?.apiKey ?? "connect-your-database";

  function toggle(key: string) {
    const previous = state;
    const next = { ...state, [key]: !state[key] };
    setState(next);
    if (!site) return;
    updateSettings.mutate({ siteId: site.id, settings: next }, { onError: () => setState(previous) });
  }

  return (
    <>
      <PageHead
        eyebrow="Workspace"
        title="Settings"
        sub="Teach the AI about your business, embed Leadworks on your site and choose which modules are on."
        actions={<span className={`pp ${isPro ? "p" : "c"}`}>{isPro ? "PRO" : "FREE"}</span>}
      />

      <div className="sec-t">Teach your AI</div>
      <BusinessProfileForm />

      <div className="sec-t">Website snippet</div>
      <CodeSnippet code={embedSnippet("widget.js", apiKey)} />
      <p className="hint">
        {!isLoading && !site
          ? "This is a placeholder key — connect leadworks-api to a database and log in to get your real site key."
          : "One script for everything — chat bubble, offers and your blog. Paste it just before </body> on every page of your site."}
      </p>

      <div className="sec-t">Chat widget</div>
      <div className="pnl pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="module-t">Conversations and design</div>
          <div className="module-d">See every website chat, reply as your team, and change the bubble&apos;s colours, title and greeting.</div>
        </div>
        <Button href="/ai-widget" variant="secondary" size="sm">Open chat widget</Button>
      </div>

      <div className="sec-t">Place things on a page</div>
      <p className="hint" style={{ marginTop: 0 }}>With the snippet above on the page, drop these wherever you want the content to appear.</p>
      <div className="pnl pad" style={{ display: "grid", gap: 16 }}>
        <div>
          <div className="module-t">Your blog</div>
          <div className="module-d" style={{ marginBottom: 8 }}>Every post you publish from AI Blog shows up here, with its own page.</div>
          <CodeSnippet code={BLOG_MOUNT} />
        </div>
        <div>
          <div className="module-t">An offer form</div>
          <div className="module-d" style={{ marginBottom: 8 }}>Shows your newest live offer as a card with its lead form. Each offer also has its own pinned snippet on its edit page.</div>
          <CodeSnippet code={OFFER_MOUNT} />
        </div>
      </div>

      <div className="sec-t">
        Modules {updateSettings.isPending && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>· saving…</span>}
      </div>
      <div className="pnl">
        {MODULES.map((m) => {
          const locked = m.pro && !isPro;
          return (
            <div key={m.key} className="module">
              <div>
                <div className="module-t">
                  {m.label} {m.pro && <span className="pp p" style={{ marginLeft: 6 }}>PRO</span>}
                </div>
                <div className="module-d">{m.desc}</div>
              </div>
              {locked ? (
                <Button href="/account" variant="secondary" size="sm">Upgrade</Button>
              ) : (
                <button className={`tgl ${state[m.key] ? "on" : ""}`} onClick={() => toggle(m.key)} role="switch" aria-checked={state[m.key]} aria-label={m.label} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
