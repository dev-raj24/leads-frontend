import Link from "next/link";
import "./marketing.css";
import { Logo } from "@/components/Logo";
import { PricingSection } from "@/components/PricingSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IconArrowRight, IconCheck, IconClose } from "@/components/icons";

const PROOF = [
  { n: "10", u: "sec", t: "average first-reply time" },
  { n: "78", u: "%", t: "of customers pick whoever replies first" },
  { n: "0", u: "", t: "leads lost in a forgotten inbox" },
  { n: "2", u: "×", t: "more deals closed with instant follow-up" },
];

const BEFORE = [
  <>Enquiries buried in an <b>email inbox</b> you rarely open</>,
  <>First reply after <b>4–6 hours</b> — the lead has gone cold</>,
  <>&ldquo;Did anyone follow up?&rdquo; — <b>nobody knows</b></>,
  <>WhatsApp enquiries lost in <b>personal chats</b></>,
  <>Every missed lead is <b>money handed to a competitor</b></>,
];
const AFTER = [
  <>Every lead from every source in <b>one clean inbox</b></>,
  <>AI replies in <b>10 seconds</b> — even at 2am</>,
  <>Follow-ups <b>scheduled automatically</b> — nothing forgotten</>,
  <>WhatsApp enquiries <b>captured into the same inbox</b></>,
  <>A morning summary of <b>exactly who to call today</b></>,
];

const STEPS = [
  { t: "Connect your site", d: "Paste one tiny snippet into your website — five minutes, zero code. Got old leads in Excel? Import them in one go." },
  { t: "Teach the AI", d: "Answer a few questions about your business — services, timings, prices. That's all the AI needs to speak for you." },
  { t: "Close deals", d: "Leads flow in, AI replies instantly, follow-ups happen on time. Each morning a summary tells you who's hot." },
];

const FAQ = [
  ["Will this work with my existing website?", "Yes — that's the whole point. Whether your site is WordPress, Wix or hand-coded years ago, you paste one small snippet and your contact form starts sending leads to your inbox. Nothing about your site changes."],
  ["What if the AI says something wrong to my customer?", "The AI only uses what you tell it — your services, prices and timings. It never invents answers, and for anything it's unsure about it says the owner will call back and pings you. You can review every follow-up before it's sent."],
  ["I get most enquiries on WhatsApp. Does this help?", "Yes — on the Pro plan your WhatsApp business number connects to the same inbox. Website, WhatsApp and chat leads all live together."],
  ["Do I need a developer?", "No installs, no developer. If you can copy-paste, you can set up Leadworks in about five minutes — and if you get stuck, we'll do it with you on a call, free."],
  ["What happens to my data if I cancel?", "Your leads are yours. Export everything to Excel in one click, any time. We keep your data for 30 days after cancelling in case you change your mind, then delete it permanently."],
];

const QUOTES = [
  { q: "Turns out I was replying to enquiries six hours late. Now the AI answers before I even see my phone — bookings doubled in two months.", n: "Dr. Rachit Mehra", r: "Dental clinic, Indore", i: "RM", c: "#0b5d4b", big: true },
  { q: "The morning summary is my favourite thing. Tea in one hand, phone in the other — I know exactly who to call before 10am.", n: "Shalini Kapoor", r: "Salon owner, Pune", i: "SK", c: "#10151c" },
  { q: "Half my enquiries were lost between family chats. Last month I closed nine deals from old leads the follow-up AI revived.", n: "Arjun Verma", r: "Real estate consultant, Jaipur", i: "AV", c: "#8a5a12" },
];

export default function MarketingHome() {
  const feature = QUOTES[0];
  const rest = QUOTES.slice(1);

  return (
    <div className="m">
      <RevealOnScroll />

      <nav className="m-nav">
        <div className="m-wrap m-nav-in">
          <Logo size={34} />
          <div className="m-links">
            <a href="#why">Why Leadworks</a>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="m-nav-cta">
            <Link href="/login" className="m-login">Log in</Link>
            <Link href="/onboarding" className="m-btn solid sm">Start free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="m-hero">
        <div className="m-wrap m-hero-grid">
          <div className="m-hero-copy">
            <span className="m-pill"><b>New</b> AI replies to every lead in 10 seconds</span>
            <h1>
              Every lead,<br />
              <em className="mark">in one place.</em>
            </h1>
            <p className="m-lede">
              Your website, WhatsApp and forms — every enquiry lands in <b>one inbox</b>. AI sends the
              first reply in seconds and never forgets a follow-up. You just close the deal.
            </p>
            <div className="m-hero-cta">
              <Link href="/onboarding" className="m-btn solid">Start free <IconArrowRight size={16} /></Link>
              <a href="#product" className="m-btn line">See how it works</a>
            </div>
            <div className="m-ticks">
              <span><IconCheck size={15} /> No code needed</span>
              <span><IconCheck size={15} /> 5-minute setup</span>
              <span><IconCheck size={15} /> Cancel anytime</span>
            </div>
          </div>

          <div className="hv" id="product" aria-hidden="true">
            <div className="hv-inbox">
              <div className="hv-head">Inbox <small>3 new today</small></div>
              <div className="hv-row on"><span className="hv-av">RS</span><div><strong>Rohit Sharma</strong><small>How much is a root canal?</small></div><span className="pp n">NEW</span></div>
              <div className="hv-row"><span className="hv-av">PN</span><div><strong>Priya Nair</strong><small>Appointment tomorrow?</small></div><span className="pp w">WON</span></div>
              <div className="hv-row"><span className="hv-av">AG</span><div><strong>Aman Gupta</strong><small>Need a braces consultation</small></div><span className="pp r">REPLIED</span></div>
            </div>
            <div className="hv-chat">
              <div className="hv-chat-top"><span className="hv-av">RS</span><div>Rohit Sharma<small>via website form · 2:04 AM</small></div></div>
              <div className="hv-msgs">
                <div className="bub in">Hi, how much does a root canal cost?<time>2:04</time></div>
                <div className="bub out">Hi Rohit! A root canal starts at ₹4,500. Shall I book you a slot tomorrow at 11 AM?<time>2:04 ✓✓</time></div>
              </div>
            </div>
            <div className="hv-chip"><i /> AI replied in 9 seconds</div>
          </div>
        </div>
      </header>

      <div className="m-wrap">
        <div className="m-proof">
          {PROOF.map((p) => (
            <div key={p.t}>
              <div className="m-num">{p.n}<small>{p.u}</small></div>
              <p>{p.t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="m-sec" id="why">
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">The problem</span>
            <h2 className="m-h2">Sound <em>familiar?</em></h2>
            <p className="m-sub">You paid for a website. Enquiries go to an email you check twice a week. By the time you reply, the customer has booked with someone else.</p>
          </div>
          <div className="cmp rv">
            <div className="cmp-col before">
              <h3>Before</h3>
              <ul>{BEFORE.map((t, i) => <li key={i}><IconClose size={18} /><span>{t}</span></li>)}</ul>
            </div>
            <div className="cmp-col after">
              <h3>With Leadworks</h3>
              <ul>{AFTER.map((t, i) => <li key={i}><IconCheck size={18} /><span>{t}</span></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — bento */}
      <section className="m-sec" id="features" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">Features</span>
            <h2 className="m-h2">The work you forget,<br /><em>AI never does.</em></h2>
          </div>
          <div className="bento">
            <div className="bt green s3 rv">
              <span className="bt-tag">AI auto-reply</span>
              <h3>A warm first reply, in ten seconds.</h3>
              <p>Uses your services, prices and timings. Customers think you never sleep.</p>
              <div className="bt-chat">
                <div className="bub in">Do you have weekend slots?<time>Sat 9:12</time></div>
                <div className="bub out">Yes! Saturdays 10 AM – 4 PM. Want me to hold 11:30 for you?<time>Sat 9:12 ✓✓</time></div>
              </div>
            </div>
            <div className="bt lime s3 rv">
              <span className="bt-tag">Instant alerts</span>
              <h3>Know the moment a lead lands.</h3>
              <p>On WhatsApp and email — day or night, weekend or holiday.</p>
              <div className="bt-big">0<small> missed</small></div>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">Follow-ups</span>
              <h3>Cold leads come back warm.</h3>
              <p>No reply in 2 days? AI drafts a gentle nudge you approve in one tap.</p>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">One inbox</span>
              <h3>Every source, one place.</h3>
              <p>Forms, WhatsApp and chat — with full history and status.</p>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">Offers &amp; banners</span>
              <h3>Weekend discount? Live in a click.</h3>
              <p>Push a banner to your site from your phone. No developer.</p>
            </div>
            <div className="bt ink s6 rv">
              <div className="bt-split">
                <div>
                  <span className="bt-tag">Ask your AI</span>
                  <h3>Plain-language answers from your own business data.</h3>
                </div>
                <div className="qa-row">
                  <span className="qa-chip">How many leads this week?</span>
                  <span className="qa-chip a">14 — 9 replied, 3 won. Call Aman Gupta first.</span>
                  <span className="qa-chip">Who should I call first?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="m-sec" id="how" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">How it works</span>
            <h2 className="m-h2">Three steps, <em>that&apos;s it.</em></h2>
          </div>
          <div className="steps3">
            {STEPS.map((s, i) => (
              <div className="st rv" key={s.t}>
                <div className="m-num">0{i + 1}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="m-sec" id="voices" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">Customers</span>
            <h2 className="m-h2">People who stopped <em>losing leads.</em></h2>
          </div>
          <div className="quotes">
            <div className="q-feature rv">
              <blockquote>{feature.q}</blockquote>
              <div className="q-who">
                <span className="q-av" style={{ background: feature.c }}>{feature.i}</span>
                <div><strong>{feature.n}</strong><small>{feature.r}</small></div>
              </div>
            </div>
            <div className="q-side rv">
              {rest.map((q) => (
                <div key={q.n}>
                  <p>&ldquo;{q.q}&rdquo;</p>
                  <div className="q-who">
                    <span className="q-av" style={{ background: q.c }}>{q.i}</span>
                    <div><strong>{q.n}</strong><small>{q.r}</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="m-sec" id="pricing" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head center rv">
            <span className="m-kicker">Pricing</span>
            <h2 className="m-h2">Honest <em>pricing.</em></h2>
            <p className="m-sub">Start free. Upgrade when the leads do. No contracts — cancel in two clicks.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="m-sec" id="faq" style={{ paddingTop: 0 }}>
        <div className="m-wrap faq2">
          <div className="m-head rv" style={{ marginBottom: 0 }}>
            <span className="m-kicker">FAQ</span>
            <h2 className="m-h2">Fair <em>questions.</em></h2>
            <p className="m-sub">Anything else? Write to hello@leadworks.in and a human replies.</p>
          </div>
          <div className="faq2-list rv">
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="m-wrap" style={{ paddingBottom: 24 }}>
        <div className="m-cta rv">
          <h2>Don&apos;t miss <em>the next lead.</em></h2>
          <p>Your next customer is filling the form right now. Be the first to reply.</p>
          <div className="m-cta-btns">
            <Link href="/onboarding" className="m-btn lime">Start free <IconArrowRight size={16} /></Link>
            <Link href="/login" className="m-btn line">Log in</Link>
          </div>
        </div>
      </section>

      <footer className="m-foot">
        <div className="m-wrap">
          <div className="m-foot-grid">
            <div>
              <Logo size={30} />
              <p>The AI lead inbox for small businesses. Built in India, for small businesses everywhere.</p>
            </div>
            <div><h4>Product</h4><ul><li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#how">How it works</a></li></ul></div>
            <div><h4>Company</h4><ul><li><a href="#voices">Customers</a></li><li><a href="#faq">FAQ</a></li><li><a href="mailto:hello@leadworks.in">Contact</a></li></ul></div>
            <div><h4>Account</h4><ul><li><Link href="/login">Log in</Link></li><li><Link href="/onboarding">Start free</Link></li></ul></div>
          </div>
          <div className="m-foot-bar"><span>© 2026 Leadworks</span><span>Privacy · Terms</span></div>
        </div>
      </footer>
    </div>
  );
}
