"use client";

import { useEffect, useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { Button } from "@/components/ui/Button";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { FormFieldsEditor } from "@/components/portal/FormFieldsEditor";
import { InstallGuide } from "@/components/portal/InstallGuide";
import { WebsiteReader } from "@/components/portal/WebsiteReader";
import { PageHead } from "@/components/portal/PageHead";
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    if (site) setState((s) => ({ ...s, ...(site.settings as Record<string, boolean>) }));
  }, [site]);

  const apiKey = site?.apiKey ?? "connect-your-database";
  const formButton = ((site?.settings as Record<string, unknown> | undefined)?.formButton ?? {}) as { enabled?: boolean; label?: string; position?: string };
  const buttonOn = formButton.enabled === true;
  const autoCaptureOn = (site?.settings as Record<string, unknown> | undefined)?.autoCapture === true;
  const [buttonLabel, setButtonLabel] = useState("Contact us");
  useEffect(() => setButtonLabel(formButton.label || "Contact us"), [formButton.label]);

  function saveButton(patch: { enabled?: boolean; label?: string }) {
    if (!site) return;
    const next = { enabled: buttonOn, label: buttonLabel || "Contact us", position: formButton.position ?? "right", ...patch };
    updateSettings.mutate({ siteId: site.id, settings: { ...site.settings, formButton: next } });
  }

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

      <div className="sec-t">Start with your website</div>
      <WebsiteReader initialUrl={install?.allowedDomains?.[0] ? `https://${install.allowedDomains[0]}` : ""} />

      <div className="sec-t">Teach your AI</div>
      <BusinessProfileForm />

      <div className="sec-t">Connect your website</div>
      <InstallGuide apiKey={apiKey} isPro={isPro} />
      {!isLoading && !site && (
        <p className="hint">This is a placeholder key. Connect leadworks-api to a database and log in to get your real site key.</p>
      )}

      <div className="sec-t">Turn things on or off</div>
      <div className="pnl pad">
        <p className="hint" style={{ margin: "0 0 14px" }}>
          Everything below runs from the one code you just installed — nothing more to paste. AI chat, offers and the blog work the same way: switch them on in Modules further down.
        </p>
        <div className="parts">
          <div className="part">
            <div className="part-h"><div className="module-t">Contact button</div><span className="pp w">FREE</span></div>
            <div className="module-d">A &quot;Contact us&quot; button on every page that opens your form.</div>
            <div className="btn-set">
              <button className={`tgl ${buttonOn ? "on" : ""}`} role="switch" aria-checked={buttonOn} aria-label="Contact button" onClick={() => saveButton({ enabled: !buttonOn })} />
              <input className="finput" aria-label="Button text" maxLength={30} value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} onBlur={() => buttonLabel !== (formButton.label ?? "Contact us") && saveButton({ label: buttonLabel })} placeholder="Contact us" />
            </div>
          </div>
          <div className="part">
            <div className="part-h"><div className="module-t">Catch my existing forms</div><span className="pp w">FREE</span></div>
            <div className="module-d">Already have a contact form? Switch this on and every enquiry sent through it is copied into your inbox automatically. Your own form and thank-you message stay as they are. Login, search and payment forms are never touched, and you can exclude one form with <code>data-leadworks-ignore</code>.</div>
            <div className="btn-set">
              <button className={`tgl ${autoCaptureOn ? "on" : ""}`} role="switch" aria-checked={autoCaptureOn} aria-label="Catch my existing forms" onClick={() => site && updateSettings.mutate({ siteId: site.id, settings: { ...site.settings, autoCapture: !autoCaptureOn } })} />
              <span className="hint">{autoCaptureOn ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen(!advancedOpen)}
        aria-expanded={advancedOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", padding: "18px 2px 8px", cursor: "pointer", textAlign: "left" }}
      >
        <span className="sec-t" style={{ margin: 0 }}>Put something in an exact spot (optional)</span>
        <span aria-hidden style={{ fontSize: 20, color: "var(--muted)" }}>{advancedOpen ? "−" : "+"}</span>
      </button>
      {!advancedOpen && (
        <p className="hint" style={{ margin: "0 0 8px" }}>
          Only open this if you want a form, the blog or an offer to appear inside a specific page, instead of floating automatically. Most people never need it.
        </p>
      )}
      {advancedOpen && (
        <div className="pnl pad">
          <div className="parts">
            <div className="part">
              <div className="part-h"><div className="module-t">Enquiry form on a page</div><span className="pp w">FREE</span></div>
              <div className="module-d">A contact form with the questions you choose below. Place this where you want it on a page.</div>
              <CodeSnippet code={FORM_MOUNT} />
            </div>
            <div className="part">
              <div className="part-h"><div className="module-t">No-website link</div><span className="pp w">FREE</span></div>
              <div className="module-d">No website, or only Instagram and WhatsApp? Share this link instead. It opens a ready form page with your questions, and every submission lands in your inbox.</div>
              <CodeSnippet code={hostedLink(apiKey)} />
            </div>
            <div className="part">
              <div className="part-h"><div className="module-t">Keep your own form&apos;s design</div><span className="pp w">FREE</span></div>
              <div className="module-d">Already have a form on your site? Keep its design and just add one attribute to the form tag. Every submission is copied into your inbox, and your own thank-you message keeps working.</div>
              <CodeSnippet code={FORM_CAPTURE} />
            </div>
            <div className="part">
              <div className="part-h"><div className="module-t">Blog on a page</div><span className="pp p">PRO</span></div>
              <div className="module-d">Every post you publish from AI Blog shows up here, each with its own page. Not needed just to publish — only if you want the blog list embedded on a page of your own.</div>
              <CodeSnippet code={BLOG_MOUNT} />
              <div className="module-d" style={{ marginTop: 6 }}>
                Want search engines to find your posts? Link to the page below from your site, or submit the sitemap in Google Search Console.
              </div>
              <CodeSnippet code={`Blog page: ${blogPageLink(site?.publicSlug ?? null)}\nSitemap:   ${blogPageLink(site?.publicSlug ?? null)}/sitemap.xml`} />
              {!isPro && <div><Button href="/account" variant="secondary" size="sm">Upgrade to turn on</Button></div>}
            </div>
            <div className="part">
              <div className="part-h"><div className="module-t">Offer inside a page</div><span className="pp p">PRO</span></div>
              <div className="module-d">Offers already float as a card or popup by themselves once Modules below is on. Only use this if you also want one pinned inside a specific page.</div>
              <CodeSnippet code={OFFER_MOUNT} />
              {!isPro && <div><Button href="/account" variant="secondary" size="sm">Upgrade to turn on</Button></div>}
            </div>
          </div>
        </div>
      )}

      <div className="sec-t">Form questions</div>
      {site ? <FormFieldsEditor site={site} /> : null}

      <div className="sec-t">Is your website connected?</div>
      <div className="pnl pad" style={{ display: "grid", gap: 14 }}>
        {install?.status.installed ? (
          <div>
            <div className="module-t"><span className="pp w" style={{ marginRight: 8 }}>● CONNECTED</span>Live on {install.status.lastSeenHost ?? "your site"}</div>
            <div className="module-d">Last seen {install.status.lastSeenAt ? `${timeAgo(install.status.lastSeenAt)} ago` : "just now"}.</div>
          </div>
        ) : (
          <div>
            <div className="module-t"><span className="pp c" style={{ marginRight: 8 }}>NOT CONNECTED YET</span>We haven&apos;t seen your website yet</div>
            <div className="module-d">Paste the code above before &lt;/body&gt;, then open any page of your site. This turns green within a minute. If you use a site builder, paste it into the &quot;custom code&quot; or &quot;footer&quot; box. No developer? Use &quot;Copy a message for my developer&quot; above and send it to whoever built your site.</div>
          </div>
        )}
        {(install?.status.blocked.length ?? 0) > 0 && (
          <div className="auth-err" style={{ margin: 0 }}>
            <b>Blocked recently:</b>{" "}
            {install!.status.blocked.map((b) => `${b.host} (${b.count}×, ${timeAgo(b.lastAt)} ago)`).join(", ")}. Visitors on these sites could not use your forms or chat. Add the site below if it is yours.
          </div>
        )}
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="flabel" htmlFor="allowed-domains">Websites allowed to connect</label>
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {m.key === "widget" && state[m.key] && <Button href="/ai-widget" variant="secondary" size="sm">Customize look</Button>}
                  <button className={`tgl ${state[m.key] ? "on" : ""}`} onClick={() => toggle(m.key)} role="switch" aria-checked={state[m.key]} aria-label={m.label} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
