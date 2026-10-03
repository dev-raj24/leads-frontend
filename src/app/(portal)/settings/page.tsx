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
import { useInstallStatus } from "@/hooks/sites/install";
import { timeAgo } from "@/lib/format";

const MODULES = [
  { key: "alerts", label: "Instant alerts", desc: "Get an email the moment a lead or a new chat arrives", def: true, pro: false },
  { key: "autoreply", label: "AI auto-reply", desc: "AI writes the first reply within seconds and emails it to the lead", def: true, pro: true },
  { key: "widget", label: "AI site chat widget", desc: "A chat bubble on your website that answers visitors around the clock", def: false, pro: true },
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
  const { data: install } = useInstallStatus();
  const [domains, setDomains] = useState("");
  const [domainsDirty, setDomainsDirty] = useState(false);
  useEffect(() => {
    if (install && !domainsDirty) setDomains(install.allowedDomains.join("\n"));
  }, [install, domainsDirty]);

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

      <div className="sec-t">Is it installed?</div>
      <div className="pnl pad" style={{ display: "grid", gap: 14 }}>
        {install?.status.installed ? (
          <div>
            <div className="module-t"><span className="pp w" style={{ marginRight: 8 }}>● CONNECTED</span>The script is running on {install.status.lastSeenHost ?? "your site"}</div>
            <div className="module-d">Last seen {install.status.lastSeenAt ? `${timeAgo(install.status.lastSeenAt)} ago` : "just now"}.</div>
          </div>
        ) : (
          <div>
            <div className="module-t"><span className="pp c" style={{ marginRight: 8 }}>NOT SEEN YET</span>We haven&apos;t seen the script on any website</div>
            <div className="module-d">Paste the snippet above before &lt;/body&gt;, then open any page of your site. This turns green within a minute. If you use a site builder, paste it into the &quot;custom code&quot; or &quot;footer&quot; box.</div>
          </div>
        )}
        {(install?.status.blocked.length ?? 0) > 0 && (
          <div className="auth-err" style={{ margin: 0 }}>
            <b>Blocked recently:</b>{" "}
            {install!.status.blocked.map((b) => `${b.host} (${b.count}×, ${timeAgo(b.lastAt)} ago)`).join(", ")}. Visitors on these sites could not use your forms or chat. Add the site below if it is yours.
          </div>
        )}
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="flabel" htmlFor="allowed-domains">Websites allowed to use your script</label>
          <textarea
            id="allowed-domains"
            className="finput"
            rows={3}
            placeholder={"yourshop.com\nwww.yourshop.in"}
            value={domains}
            onChange={(e) => {
              setDomains(e.target.value);
              setDomainsDirty(true);
            }}
          />
          <p className="hint" style={{ marginTop: 6 }}>One per line. Leave it empty to allow any website. Subdomains are included, so yourshop.com also covers blog.yourshop.com.</p>
        </div>
        <div>
          <Button
            size="sm"
            disabled={!site || !domainsDirty}
            loading={updateSettings.isPending}
            loadingText="Saving…"
            onClick={() =>
              site &&
              updateSettings.mutate(
                { siteId: site.id, settings: { ...site.settings, allowedDomains: domains.split(/[\n,]/).map((d) => d.trim()).filter(Boolean) } },
                { onSuccess: () => setDomainsDirty(false) },
              )
            }
          >
            Save allowed websites
          </Button>
        </div>
      </div>

      <div className="sec-t">Chat widget</div>
      <div className="pnl pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="module-t">Conversations and design</div>
          <div className="module-d">Change the bubble&apos;s colours, title and greeting, and install it. Your conversations are in Chats.</div>
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
