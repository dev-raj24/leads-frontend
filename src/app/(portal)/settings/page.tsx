"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { FormFieldsEditor } from "@/components/portal/FormFieldsEditor";
import { WebsiteReader } from "@/components/portal/WebsiteReader";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { PageHead } from "@/components/portal/PageHead";
import { useMySite } from "@/hooks/sites/query";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import { useTenant } from "@/hooks/tenant/query";

const pageLink = (path: string) => `${typeof window === "undefined" ? "" : window.location.origin}${path}`;

const MODULES = [
  { key: "alerts", label: "Instant alerts", desc: "Get an email the moment a lead arrives", def: true, pro: false },
  { key: "autoreply", label: "AI auto-reply", desc: "AI writes the first reply within seconds and emails it to the lead", def: true, pro: true },
  { key: "autofollow", label: "Auto follow-up", desc: "Send scheduled follow-ups without waiting for your approval", def: false, pro: true },
];

export default function SettingsPage() {
  const { data } = useMySite();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const updateSettings = useUpdateSiteSettings();
  const site = data?.site ?? null;

  const [state, setState] = useState<Record<string, boolean>>(Object.fromEntries(MODULES.map((m) => [m.key, m.def])));

  useEffect(() => {
    if (site) setState((s) => ({ ...s, ...(site.settings as Record<string, boolean>) }));
  }, [site]);

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
        sub="Teach the AI about your business and choose which modules are on."
        actions={<span className={`pp ${isPro ? "p" : "c"}`}>{isPro ? "PRO" : "FREE"}</span>}
      />

      <div className="sec-t">Start with your website</div>
      <WebsiteReader initialUrl={site?.domain ? `https://${site.domain}` : ""} />

      <div className="sec-t">Teach your AI</div>
      <BusinessProfileForm />

      <div className="sec-t">Your public pages</div>
      <div className="pnl pad" style={{ display: "grid", gap: 16 }}>
        <div>
          <div className="module-t">Form page</div>
          <div className="module-d" style={{ marginBottom: 8 }}>A ready enquiry form with your questions. Share the link on Instagram, WhatsApp or your Google profile. Every submission lands in your inbox.</div>
          <CodeSnippet code={site ? pageLink(`/f/${site.apiKey}`) : "Loading…"} />
        </div>
        <div>
          <div className="module-t">Blog {!isPro && <span className="pp p" style={{ marginLeft: 6 }}>PRO</span>}</div>
          <div className="module-d" style={{ marginBottom: 8 }}>Every post you publish from AI Blog gets its own page with a proper title, description and sitemap. Link to it from your site menu or submit the sitemap in Google Search Console.</div>
          <CodeSnippet code={site ? `Blog page: ${pageLink(`/b/${site.publicSlug ?? "your-site"}`)}\nSitemap:   ${pageLink(`/b/${site.publicSlug ?? "your-site"}`)}/sitemap.xml` : "Loading…"} />
        </div>
      </div>

      <div className="sec-t">Form questions</div>
      {site ? <FormFieldsEditor site={site} /> : null}

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
