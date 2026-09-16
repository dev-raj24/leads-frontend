import { IconChat } from "@/components/icons";

export default function AiWidgetPage() {
  return (
    <>
      <div className="p-mh">
        <span className="p-mt">AI chat widget<em>talks to visitors, captures leads</em></span>
      </div>
      <div className="p-card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
          <IconChat size={17} style={{ color: "#155EEF" }} /> How it works
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#475467" }}>
          A chat bubble appears on your website, powered by the same AI that knows your business.
          Visitors get answers 24/7 — and every conversation becomes a lead in your inbox
          automatically, even at 2am.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#475467", marginTop: 10 }}>
          Turn it on from <b>Settings → Modules</b> once you&apos;re ready. Available on the Growth
          plan.
        </p>
      </div>
    </>
  );
}
