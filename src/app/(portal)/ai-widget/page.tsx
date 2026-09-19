import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";

const STEPS = [
  ["Bubble on your site", "A chat bubble appears on every page, powered by the same AI that knows your business."],
  ["Answers 24/7", "Visitors get instant answers about services, prices and timings — even at 2am."],
  ["Every chat becomes a lead", "Conversations are captured automatically into your inbox with full history."],
];

export default function AiWidgetPage() {
  return (
    <>
      <PageHead eyebrow="Module" title={<>AI chat <em>widget</em></>} sub="Talks to your visitors and captures their details as leads." actions={<Button href="/settings">Turn it on in Settings</Button>} />
      <div className="pnl">
        {STEPS.map(([t, d], i) => (
          <div key={t} className="li">
            <span className="av display" style={{ fontSize: 20 }}>{i + 1}</span>
            <div className="li-main"><div className="li-title">{t}</div><div className="li-sub" style={{ whiteSpace: "normal" }}>{d}</div></div>
          </div>
        ))}
      </div>
      <p className="hint">Available on the Pro plan.</p>
    </>
  );
}
