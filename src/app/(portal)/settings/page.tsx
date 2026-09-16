"use client";

import { useEffect, useState } from "react";
import { useMySite } from "@/hooks/sites/query";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";

const MODULES = [
  { key: "alerts", label: "⚡ Instant alerts", desc: "Get notified on WhatsApp + email", def: true },
  { key: "autoreply", label: "🤖 AI auto-reply", desc: "AI sends the first response", def: true },
  { key: "widget", label: "💬 AI site chat widget", desc: "24/7 chat + lead capture on your site", def: false },
  { key: "offers", label: "🎯 Offers & banners", desc: "Show offers on your website", def: true },
  { key: "autofollow", label: "🔁 Auto follow-up", desc: "Send without asking first", def: false },
];

export default function SettingsPage() {
  const { data, isLoading: loading } = useMySite();
  const updateSettingsMutation = useUpdateSiteSettings();
  const site = data?.site ?? null;

  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((m) => [m.key, m.def]))
  );
  const [copied, setCopied] = useState(false);
  const [blogCopied, setBlogCopied] = useState(false);

  useEffect(() => {
    if (site) {
      const saved = site.settings as Record<string, boolean>;
      setState((s) => ({ ...s, ...saved }));
    }
  }, [site]);

  const apiKey = site?.apiKey ?? "connect-your-database";
  const snippet = `<script src="https://leadworks.app/widget.js"\n  data-site-key="${apiKey}">\n</script>`;
  const blogSnippet = `<script src="https://leadworks.app/blog.js"\n  data-site-key="${apiKey}">\n</script>`;

  function toggle(key: string) {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    if (!site) return;
    updateSettingsMutation.mutate(
      { siteId: site.id, settings: next },
      { onError: () => setState(state) }
    );
  }

  return (
    <>
      <div className="p-mh">
        <span className="p-mt">Settings</span>
        <span className="pp p">PRO</span>
      </div>

      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#475467", marginBottom: 6 }}>
        Add this snippet to your website
      </div>
      <div style={{ background: "#14161A", color: "#9BB8FF", borderRadius: 11, padding: "12px 14px", fontFamily: "'Courier New',monospace", fontSize: 11, lineHeight: 1.7, position: "relative", marginBottom: 8 }}>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          style={{ position: "absolute", top: 8, right: 10, fontSize: 9, color: "#fff", background: "#2C3240", padding: "3px 9px", borderRadius: 6, border: "none", cursor: "pointer" }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{snippet}</pre>
      </div>
      {!loading && !site && (
        <div style={{ fontSize: 11, color: "#98A2B3", marginBottom: 20 }}>
          This is a placeholder key — connect leadworks-api to a database and log in to get your real site key.
        </div>
      )}
      {site && <div style={{ marginBottom: 20 }} />}

      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#475467", marginBottom: 6 }}>
        Add your AI blog to a page on your site
      </div>
      <div style={{ background: "#14161A", color: "#9BB8FF", borderRadius: 11, padding: "12px 14px", fontFamily: "'Courier New',monospace", fontSize: 11, lineHeight: 1.7, position: "relative", marginBottom: 8 }}>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(blogSnippet);
            setBlogCopied(true);
            setTimeout(() => setBlogCopied(false), 1500);
          }}
          style={{ position: "absolute", top: 8, right: 10, fontSize: 9, color: "#fff", background: "#2C3240", padding: "3px 9px", borderRadius: 6, border: "none", cursor: "pointer" }}
        >
          {blogCopied ? "COPIED" : "COPY"}
        </button>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{blogSnippet}</pre>
      </div>
      <div style={{ fontSize: 11, color: "#98A2B3", marginBottom: 20 }}>
        Paste on your Blog page — every post you publish from AI Blog shows up there automatically.
      </div>

      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#475467", marginBottom: 6 }}>
        Modules {updateSettingsMutation.isPending && <span style={{ color: "#98A2B3", textTransform: "none", fontWeight: 400 }}>· saving…</span>}
      </div>
      {MODULES.map((m) => (
        <div key={m.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1.5px dashed #E4E7EC" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 1 }}>{m.desc}</div>
          </div>
          <button
            onClick={() => toggle(m.key)}
            style={{
              width: 34, height: 19, borderRadius: 100, border: "1.5px solid #14161A",
              background: state[m.key] ? "#C9F2DB" : "#F2F4F7", position: "relative", cursor: "pointer",
            }}
          >
            <div style={{
              position: "absolute", top: 1.5, width: 13, height: 13, borderRadius: "50%",
              background: state[m.key] ? "#14161A" : "#98A2B3",
              left: state[m.key] ? "auto" : 1.5, right: state[m.key] ? 1.5 : "auto",
            }} />
          </button>
        </div>
      ))}

      <div style={{ fontSize: 10.5, color: "#98A2B3", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 14 }}>
        One flag on/off = one module on/off — that&apos;s the flexible platform we&apos;re building.
      </div>
    </>
  );
}
