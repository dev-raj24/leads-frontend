"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MatchSiteFields } from "@/components/portal/MatchSiteFields";
import { WidgetPreview } from "@/components/portal/WidgetPreview";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import type { ChatDesign, Site } from "@/types/models";

export const DEFAULT_CHAT_DESIGN: ChatDesign = {
  title: "Chat with us",
  subtitle: "We usually reply in a few minutes",
  greeting: "Hi! How can we help you today?",
  color: "auto",
  position: "right",
  launcher: "icon",
  launcherLabel: "Chat with us",
  fontFamily: "system",
  radius: "rounded",
  customCss: "",
};

const SWATCHES = ["#0b5d4b", "#1d4ed8", "#7c3aed", "#be123c", "#c2410c", "#121a26"];

export function readChatDesign(site: Site | null): ChatDesign {
  const raw = (site?.settings?.widgetDesign ?? {}) as Partial<ChatDesign>;
  return { ...DEFAULT_CHAT_DESIGN, ...raw };
}

export function ChatDesignForm({ site }: { site: Site }) {
  const update = useUpdateSiteSettings();
  const [design, setDesign] = useState<ChatDesign>(() => readChatDesign(site));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDesign(readChatDesign(site));
  }, [site]);

  const set = <K extends keyof ChatDesign>(key: K, value: ChatDesign[K]) => {
    setSaved(false);
    setDesign((d) => ({ ...d, [key]: value }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    update.mutate(
      { siteId: site.id, settings: { ...site.settings, widgetDesign: design } },
      { onSuccess: () => setSaved(true) },
    );
  }

  return (
    <div className="split">
      <form className="pnl pad" onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label className="flabel" htmlFor="cd-title">Window title</label>
            <input id="cd-title" className="finput" maxLength={40} value={design.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="cd-sub">Subtitle</label>
            <input id="cd-sub" className="finput" maxLength={80} value={design.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          </div>
          <div className="field full">
            <label className="flabel" htmlFor="cd-greet">Greeting message</label>
            <textarea id="cd-greet" className="finput" rows={2} maxLength={300} value={design.greeting} onChange={(e) => set("greeting", e.target.value)} />
            <p className="hint" style={{ margin: "6px 0 0" }}>The first thing a visitor sees. It should ask for their name and phone or email — that&apos;s what turns the chat into a lead.</p>
          </div>

          <div className="field full">
            <span className="flabel">Colour</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className={`pill-opt ${design.color === "auto" ? "on" : ""}`} onClick={() => set("color", "auto")}>Match my website</button>
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Use ${c}`}
                  onClick={() => set("color", c)}
                  style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: design.color === c ? "3px solid var(--lime, #d9f99d)" : "2px solid #fff", boxShadow: "0 0 0 1px #d5d2ca", cursor: "pointer" }}
                />
              ))}
              <input type="color" aria-label="Custom colour" value={design.color === "auto" ? "#0b5d4b" : design.color} onChange={(e) => set("color", e.target.value)} style={{ width: 44, height: 32, border: "1px solid #d5d2ca", borderRadius: 8, background: "#fff", padding: 2, cursor: "pointer" }} />
            </div>
            {design.color === "auto" && (
              <p className="hint" style={{ margin: "6px 0 0" }}>Uses the main colour your website already has (its theme colour, buttons or header), and picks readable text on top. This preview can&apos;t see your site, so it shows the default green; on your real pages you&apos;ll see your own colour. If nothing is found it falls back to green.</p>
            )}
          </div>

          <div className="field">
            <span className="flabel">Position</span>
            <div className="pill-row">
              {(["right", "left"] as const).map((p) => (
                <button type="button" key={p} className={`pill-opt ${design.position === p ? "on" : ""}`} onClick={() => set("position", p)}>
                  Bottom {p}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="flabel">Launcher button</span>
            <div className="pill-row">
              <button type="button" className={`pill-opt ${design.launcher === "icon" ? "on" : ""}`} onClick={() => set("launcher", "icon")}>Icon only</button>
              <button type="button" className={`pill-opt ${design.launcher === "label" ? "on" : ""}`} onClick={() => set("launcher", "label")}>Icon + text</button>
            </div>
          </div>
          {design.launcher === "label" && (
            <div className="field full">
              <label className="flabel" htmlFor="cd-label">Launcher text</label>
              <input id="cd-label" className="finput" maxLength={24} value={design.launcherLabel} onChange={(e) => set("launcherLabel", e.target.value)} />
            </div>
          )}

          <MatchSiteFields
            kind="chat"
            fontFamily={design.fontFamily}
            radius={design.radius}
            customCss={design.customCss}
            onChange={(patch) => {
              setSaved(false);
              setDesign((d) => ({ ...d, ...patch } as ChatDesign));
            }}
          />
        </div>

        {update.isError && <div className="auth-err">Couldn&apos;t save — please try again.</div>}
        <div className="form-foot">
          <Button type="submit" loading={update.isPending} loadingText="Saving…">Save design</Button>
          <Button type="button" variant="secondary" onClick={() => { setDesign(DEFAULT_CHAT_DESIGN); setSaved(false); }}>Reset</Button>
          {saved && <span className="hint" style={{ margin: 0 }}>Saved — visitors see it from their next page load.</span>}
        </div>
      </form>

      <div>
        <div className="sec-t" style={{ marginTop: 0 }}>Live preview</div>
        <WidgetPreview chat={design} height={470} />
      </div>
    </div>
  );
}
