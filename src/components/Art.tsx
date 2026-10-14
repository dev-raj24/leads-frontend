/** Small inline SVG illustrations used on the landing page. All decorative unless noted. */

type P = { className?: string };

/** Four-point sparkle. */
export function Spark({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 0c1.6 9.6 8 16 20 20-12 4-18.4 10.4-20 20-1.6-9.6-8-16-20-20C12 16 18.4 9.6 20 0z" fill="currentColor" />
    </svg>
  );
}

/** Concentric rings. */
export function Rings({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 160 160" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="80" cy="80" r="76" />
      <circle cx="80" cy="80" r="54" />
      <circle cx="80" cy="80" r="32" />
      <circle cx="80" cy="80" r="10" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Three soft waves. */
export function Waves({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 200 90" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M4 20c20-18 36 18 56 0s36 18 56 0 36 18 56 0 20 8 24 0" />
      <path d="M4 48c20-18 36 18 56 0s36 18 56 0 36 18 56 0 20 8 24 0" />
      <path d="M4 76c20-18 36 18 56 0s36 18 56 0 36 18 56 0 20 8 24 0" />
    </svg>
  );
}

/** Dot grid. */
export function DotGrid({ className }: P) {
  const dots = [];
  for (let y = 0; y < 5; y++) for (let x = 0; x < 7; x++) dots.push(<circle key={`${x}-${y}`} cx={8 + x * 18} cy={8 + y * 18} r="2.6" />);
  return (
    <svg className={className} viewBox="0 0 126 90" aria-hidden="true" fill="currentColor">
      {dots}
    </svg>
  );
}

/** A pile of unread mail with a red count: the "before". */
export function MailPile({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 120 96" aria-hidden="true">
      <g transform="rotate(-8 60 56)"><rect x="14" y="26" width="76" height="50" rx="10" fill="#fff" opacity="0.7" /></g>
      <g transform="rotate(6 60 56)"><rect x="22" y="22" width="76" height="50" rx="10" fill="#fff" opacity="0.85" /></g>
      <rect x="20" y="30" width="80" height="54" rx="11" fill="#fff" />
      <path d="M26 40l34 24 34-24" fill="none" stroke="#9a9fb5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="98" cy="28" r="15" fill="#e5484d" />
      <text x="98" y="33.5" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="sans-serif">47</text>
    </svg>
  );
}

/** A tidy inbox with a tick: the "after". */
export function MailDone({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 120 96" aria-hidden="true">
      <rect x="16" y="26" width="80" height="54" rx="11" fill="#fff" />
      <path d="M22 36l34 24 34-24" fill="none" stroke="#0d7a4d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="94" cy="30" r="17" fill="#0d7a4d" />
      <path d="M85.5 30.5l6 6 11-12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Speech bubble with a question mark, for the FAQ. */
export function AskBubble({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 140 120" aria-hidden="true">
      <path d="M22 10h96a14 14 0 0 1 14 14v52a14 14 0 0 1-14 14H64l-26 20v-20H22A14 14 0 0 1 8 76V24a14 14 0 0 1 14-14z" fill="currentColor" />
      <path d="M58 40c0-8 6-13 13-13s13 5 13 12c0 7-6 9-9 12-2 2-3 4-3 7" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <circle cx="72" cy="77" r="4.5" fill="#fff" />
    </svg>
  );
}

/** The SEO story as one picture: write it, see the Google preview, send the sitemap. */
export function SeoArt({ className }: P) {
  return (
    <div className={className} aria-hidden="true">
      <div className="sa-card sa-edit">
        <div className="sa-tag">Editor · SEO</div>
        <label>SEO title <b>52/60</b></label>
        <div className="sa-field">Root canal cost in India: a clear price guide</div>
        <div className="sa-bar"><i style={{ width: "86%" }} /></div>
        <label>SEO description <b>148/160</b></label>
        <div className="sa-field sm">What a root canal costs, what changes the price and how to book a slot at Smile Dental.</div>
        <div className="sa-bar"><i style={{ width: "92%" }} /></div>
      </div>

      <svg className="sa-arrow" viewBox="0 0 120 70">
        <path d="M6 10c44-8 78 6 96 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M92 50l10 8 8-11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="sa-card sa-serp">
        <div className="sa-tag">What Google shows</div>
        <div className="sa-site"><i>S</i><span>Smile Dental<small>leadworks.in › b › smile-dental › root-canal-cost</small></span></div>
        <div className="sa-title">Root canal cost in India: a clear price guide</div>
        <div className="sa-desc">What a root canal costs, what changes the price and how to book a slot at Smile Dental.</div>
        <div className="sa-chips"><span>Own page</span><span>Canonical link</span><span>Open Graph</span></div>
      </div>

      <div className="sa-map">
        <svg viewBox="0 0 40 48" width="30" height="36">
          <path d="M6 2h20l10 10v32a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" fill="#fff" />
          <path d="M26 2v10h10" fill="#dcefff" />
          <path d="M10 22h20M10 29h20M10 36h12" stroke="#32587a" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span>sitemap.xml<small>ready for Search Console</small></span>
      </div>

      <svg className="sa-glass" viewBox="0 0 64 64">
        <circle cx="26" cy="26" r="18" fill="#fff" stroke="currentColor" strokeWidth="6" />
        <path d="M40 40l18 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M17 26a9 9 0 0 1 9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
      <Spark className="sa-spark a" />
      <Spark className="sa-spark b" />
    </div>
  );
}
