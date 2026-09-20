"use client";

import { useEffect, useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { PageHead } from "@/components/portal/PageHead";
import { env } from "@/config/env";
import { useMySite } from "@/hooks/sites/query";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";

const MODULES = [
  { key: "alerts", label: "Instant alerts", desc: "Get an email the moment a lead arrives", def: true },
  { key: "autoreply", label: "AI auto-reply", desc: "AI writes the first reply within seconds and shows it in your website chat", def: true },
  { key: "widget", label: "AI site chat widget", desc: "24/7 chat and lead capture on your website", def: false },
  { key: "offers", label: "Offers & banners", desc: "Show your live offers on your website", def: true },
  { key: "autofollow", label: "Auto follow-up", desc: "Send scheduled follow-ups without waiting for your approval", def: false },
];

const embedSnippet = (script: string, apiKey: string) =>
  `<script src="https://leadworks.app/${script}"\n  data-site-key="${apiKey}"\n  data-api="${env.apiUrl}">\n</script>`;

export default function SettingsPage() {
  const { data, isLoading } = useMySite();
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
      <PageHead eyebrow="Workspace" title="Settings" sub="Teach the AI about your business, embed Leadworks on your site and choose which modules are on." actions={<span className="pp p">PRO</span>} />

      <div className="sec-t">Teach your AI</div>
      <BusinessProfileForm />

      <div className="sec-t">Website snippet</div>
      <CodeSnippet code={embedSnippet("widget.js", apiKey)} />
      <p className="hint">
        {!isLoading && !site
          ? "This is a placeholder key — connect leadworks-api to a database and log in to get your real site key."
          : "Paste this just before </body> on every page of your site."}
      </p>

      <div className="sec-t">AI blog embed</div>
      <CodeSnippet code={embedSnippet("blog.js", apiKey)} />
      <p className="hint">Paste on your Blog page — every post you publish from AI Blog shows up there automatically.</p>

      <div className="sec-t">
        Modules {updateSettings.isPending && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>· saving…</span>}
      </div>
      <div className="pnl">
        {MODULES.map((m) => (
          <div key={m.key} className="module">
            <div>
              <div className="module-t">{m.label}</div>
              <div className="module-d">{m.desc}</div>
            </div>
            <button className={`tgl ${state[m.key] ? "on" : ""}`} onClick={() => toggle(m.key)} role="switch" aria-checked={state[m.key]} aria-label={m.label} />
          </div>
        ))}
      </div>
    </>
  );
}
