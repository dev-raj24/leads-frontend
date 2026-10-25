"use client";

interface MatchSiteFieldsProps {
  fontFamily: string;
  radius: string;
  customCss: string;
  onChange: (patch: { fontFamily?: string; radius?: string; customCss?: string }) => void;
  kind: "chat" | "offer";
}

const CLASSES: Record<MatchSiteFieldsProps["kind"], string[]> = {
  chat: [".lw-chat-launcher", ".lw-chat-panel", ".lw-chat-header", ".lw-chat-title", ".lw-chat-body", ".lw-msg-me", ".lw-msg-ai", ".lw-msg-team", ".lw-chat-input", ".lw-chat-send"],
  offer: [".lw-offer", ".lw-offer-title", ".lw-offer-body", ".lw-offer-btn", ".lw-overlay", ".lw-modal", ".lw-modal-title", ".lw-input", ".lw-submit", ".lw-code"],
};

const EXAMPLE: Record<MatchSiteFieldsProps["kind"], string> = {
  chat: ".lw-chat-launcher { box-shadow: none; }\n.lw-chat-header { letter-spacing: .02em; }",
  offer: ".lw-offer-btn { text-transform: uppercase; }\n.lw-modal { border-radius: 0; }",
};

/** Font, corner and raw-CSS controls so the widget can be made to look native on the owner's site. */
export function MatchSiteFields({ fontFamily, radius, customCss, onChange, kind }: MatchSiteFieldsProps) {
  return (
    <>
      <div className="field">
        <span className="flabel">Font</span>
        <div className="pill-row">
          <button type="button" className={`pill-opt ${fontFamily !== "inherit" ? "on" : ""}`} onClick={() => onChange({ fontFamily: "system" })}>Clean default</button>
          <button type="button" className={`pill-opt ${fontFamily === "inherit" ? "on" : ""}`} onClick={() => onChange({ fontFamily: "inherit" })}>Match my website</button>
        </div>
      </div>
      <div className="field">
        <span className="flabel">Corners</span>
        <div className="pill-row">
          <button type="button" className={`pill-opt ${radius !== "square" ? "on" : ""}`} onClick={() => onChange({ radius: "rounded" })}>Rounded</button>
          <button type="button" className={`pill-opt ${radius === "square" ? "on" : ""}`} onClick={() => onChange({ radius: "square" })}>Square</button>
        </div>
      </div>
      <div className="field full">
        <label className="flabel" htmlFor={`css-${kind}`}>Custom CSS <span className="hint" style={{ margin: 0 }}>(optional — for exact brand matching)</span></label>
        <textarea
          id={`css-${kind}`}
          className="finput"
          rows={5}
          maxLength={5000}
          spellCheck={false}
          value={customCss}
          onChange={(e) => onChange({ customCss: e.target.value })}
          placeholder={EXAMPLE[kind]}
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 }}
        />
        <details style={{ marginTop: 8 }}>
          <summary className="hint" style={{ margin: 0, cursor: "pointer" }}>Which classes can I style?</summary>
          <p className="hint" style={{ margin: "8px 0 0", lineHeight: 1.8 }}>
            {CLASSES[kind].map((c) => (
              <code key={c} style={{ marginRight: 8, whiteSpace: "nowrap" }}>{c}</code>
            ))}
          </p>
          <p className="hint" style={{ margin: "6px 0 0" }}>
            Variables: <code>--lw-accent</code> (brand colour), <code>--lw-radius</code>. The widget lives in its own shadow DOM, so your site&apos;s CSS never leaks in and this CSS never leaks out. JavaScript isn&apos;t supported, and <code>@import</code> is stripped.
          </p>
        </details>
      </div>
    </>
  );
}
