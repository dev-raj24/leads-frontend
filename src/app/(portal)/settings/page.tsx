"use client";

import { useEffect, useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Button } from "@/components/ui/Button";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { FormFieldsEditor } from "@/components/portal/FormFieldsEditor";
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
const FORM_MOUNT = "<div data-leadworks-form></div>";
const hostedLink = (key: string) => `${typeof window === "undefined" ? "" : window.location.origin}/f/${key}`;
const blogPageLink = (slug: string | null) => `${typeof window === "undefined" ? "" : window.location.origin}/b/${slug ?? "your-site"}`;
const FORM_CAPTURE = "<form data-leadworks-capture> ... your own fields ... </form>";

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

      <div className="sec-t">Your script</div>
      <CodeSnippet code={embedSnippet("widget.js", apiKey)} />
      <p className="hint">
        {!isLoading && !site
          ? "This is a placeholder key. Connect leadworks-api to a database and log in to get your real site key."
          : "One script for everything. Paste it just before </body> on every page of your site. What shows up depends on your plan and on where you place the pieces below."}
      </p>
      <div className="pnl pad">
        <div className="parts">
          <div className="part">
            <div className="part-h"><div className="module-t">Enquiry form</div><span className="pp w">FREE</span></div>
            <div className="module-d">A contact form with the questions you choose below. Place it where you want it on a page.</div>
            <CodeSnippet code={FORM_MOUNT} />
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Form page link</div><span className="pp w">FREE</span></div>
            <div className="module-d">No website, or only Instagram and WhatsApp? Share this link. It opens a ready form page with your questions, and every submission lands in your inbox.</div>
            <CodeSnippet code={hostedLink(apiKey)} />
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Your own form</div><span className="pp w">FREE</span></div>
            <div className="module-d">Already have a form on your site? Keep its design and just add one attribute to the form tag. Every submission is copied into your inbox, and your own thank-you message keeps working. Name, email or phone, and the message are found automatically; everything else shows on the lead.</div>
            <CodeSnippet code={FORM_CAPTURE} />
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Chat bubble</div><span className="pp p">PRO</span></div>
            <div className="module-d">Appears on every page by itself. Answers visitors and lets your team step in. Look and colours are in Chat widget.</div>
            {isPro ? <div><Button href="/ai-widget" variant="secondary" size="sm">Open chat widget</Button></div> : <div><Button href="/account" variant="secondary" size="sm">Upgrade to turn on</Button></div>}
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Blog</div><span className="pp p">PRO</span></div>
            <div className="module-d">Every post you publish from AI Blog shows up here, each with its own page.</div>
            <CodeSnippet code={BLOG_MOUNT} />
            <div className="module-d" style={{ marginTop: 6 }}>
              Want search engines to find your posts? Every post also has its own page with a proper title, description and sitemap. Link to it from your site, or submit the sitemap in Google Search Console.
            </div>
            <CodeSnippet code={`Blog page: ${blogPageLink(site?.publicSlug ?? null)}\nSitemap:   ${blogPageLink(site?.publicSlug ?? null)}/sitemap.xml`} />
            {!isPro && <div><Button href="/account" variant="secondary" size="sm">Upgrade to turn on</Button></div>}
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Offers</div><span className="pp p">PRO</span></div>
            <div className="module-d">A floating card or popup shows by itself. To also show an offer inside a page, place this. Each offer has its own pinned snippet too.</div>
            <CodeSnippet code={OFFER_MOUNT} />
            {!isPro && <div><Button href="/account" variant="secondary" size="sm">Upgrade to turn on</Button></div>}
          </div>
        </div>
      </div>

      <div className="sec-t">Form questions</div>
      {site ? <FormFieldsEditor site={site} /> : null}

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
