import Link from "next/link";
import "./marketing.css";
import { Logo } from "@/components/Logo";
import { PricingSection } from "@/components/PricingSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { IconArrowRight, IconCheck, IconClose } from "@/components/icons";
import { site } from "@/config/site";

const PROOF = [
  { n: "1", u: "inbox", t: "for website forms, chats and offers" },
  { n: "1", u: "script", t: "on your site, no developer needed" },
  { n: "₹0", u: "", t: "to start, no card" },
  { n: "24/7", u: "", t: "website chat that answers visitors, on Pro" },
];

const BEFORE = [
  <>Enquiries buried in an <b>email inbox</b> you rarely open</>,
  <>First reply after <b>4–6 hours</b> — the lead has gone cold</>,
  <>&ldquo;Did anyone follow up?&rdquo; — <b>nobody knows</b></>,
  <>Website chats and offer forms <b>nobody tracks</b></>,
  <>Every missed lead is <b>money handed to a competitor</b></>,
];
const AFTER = [
  <>Every lead from every source in <b>one clean inbox</b></>,
  <>AI replies in <b>seconds</b> on Pro — even at 2am</>,
  <>Follow-ups <b>scheduled automatically</b> — nothing forgotten</>,
  <>Website chats and offer forms <b>land in the same place</b></>,
  <>A clear list of <b>who is still waiting for a reply</b></>,
];

const STEPS = [
  { t: "Connect your site", d: "Paste one tiny snippet into your website — five minutes, zero code. Got old leads in Excel? Import them in one go." },
  { t: "Teach the AI", d: "Answer a few questions about your business — services, timings, prices. That's all the AI needs to speak for you." },
  { t: "Close deals", d: "Leads flow in and you get an email each time. On Pro, AI replies in seconds and follow-ups go out on time. You see exactly who is still waiting." },
];

const FAQ = [
  ["Will this work with my existing website?", "Yes. Whether your site is WordPress, Wix, Webflow or hand-coded, you paste one small snippet and your forms, chat and offers start sending leads to your inbox. The settings page tells you when it has detected the script."],
  ["What if the AI says something wrong to my customer?", "The AI only answers from what you tell it: your services, prices and hours. If something isn't covered, it says the team will follow up. It stays off until you have filled in your business profile, and you can see every reply it sent. Automatic follow-ups are off until you switch them on."],
  ["Does it work with WhatsApp?", "Not yet. Today Leadworks collects enquiries from your website forms, your website chat and your offers. WhatsApp is on our list, and we'd rather tell you that plainly than promise it."],
  ["Do I need a developer?", `No. If you can copy and paste, you can set it up in about five minutes. If you get stuck, write to ${site.supportEmail} and we will help.`],
  ["What happens to my data if I cancel?", "Your account moves to Free and your leads, chats and settings stay. Pro-only parts on your website, like the chat bubble and offers, stop showing. If you want everything deleted, write to us and we will delete it."],
  ["What happens if I go over 50 leads on the Free plan?", "Nothing is lost. Every lead is still saved and shown in your inbox. Paid automations such as AI replies pause until next month or until you upgrade."],
];

const USES = [
  { t: "Clinics and dentists", d: "Patients ask about prices and slots at night. The AI answers from your hours and price list, and the front desk sees who still needs a call in the morning." },
  { t: "Salons, studios and gyms", d: "Put a weekend offer on your site as a floating card with a sign-up form. Everyone who fills it lands in your inbox with the offer tagged." },
  { t: "Coaching, real estate and services", d: "Enquiries come from forms and chat. Each one gets an email alert, a reply, and a follow-up so a warm lead does not go cold." },
];

export default function MarketingHome() {
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
            <span className="m-pill"><b>New</b> AI writes the first reply in seconds</span>
            <h1>
              Every lead,<br />
              <em className="mark">in one place.</em>
            </h1>
            <p className="m-lede">
              Your website forms, chat and offers — every enquiry lands in <b>one inbox</b>. You get an email the moment it arrives, AI can send the
              first reply in seconds, and follow-ups don&apos;t get forgotten. You just close the deal.
            </p>
            <div className="m-hero-cta">
              <Link href="/onboarding" className="m-btn solid">Start free <IconArrowRight size={16} /></Link>
              <a href="#product" className="m-btn line">See how it works</a>
            </div>
            <div className="m-ticks">
              <span><IconCheck size={15} /> No code needed</span>
              <span><IconCheck size={15} /> 5-minute setup</span>
              <span><IconCheck size={15} /> Free to start</span>
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
            <div className="hv-chip"><i /> AI replied in seconds</div>
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
            <h2 className="m-h2">The work you forget,<br /><em>gets done for you.</em></h2>
          </div>
          <div className="bento">
            <div className="bt green s3 rv">
              <span className="bt-tag">AI auto-reply · Pro</span>
              <h3>A warm first reply, in seconds.</h3>
              <p>Pro. Uses your services, prices and timings, and sends it by email. Customers hear back while they are still interested.</p>
              <div className="bt-chat">
                <div className="bub in">Do you have weekend slots?<time>Sat 9:12</time></div>
                <div className="bub out">Yes! Saturdays 10 AM – 4 PM. Want me to hold 11:30 for you?<time>Sat 9:12 ✓✓</time></div>
              </div>
            </div>
            <div className="bt lime s3 rv">
              <span className="bt-tag">Instant alerts</span>
              <h3>Know the moment a lead lands.</h3>
              <p>An email for every new lead and every new chat, day or night. Free on every plan.</p>
              <div className="bt-big">1<small> email per lead</small></div>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">Follow-ups</span>
              <h3>Cold leads come back warm.</h3>
              <p>No reply in 2 days? A follow-up is ready for you to approve, or send automatically on Pro. It stops when they reply or opt out.</p>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">One inbox</span>
              <h3>Every source, one place.</h3>
              <p>Forms, website chat and offers, with the full conversation and status. Chats stay separate until the visitor shares contact details.</p>
            </div>
            <div className="bt s2 rv">
              <span className="bt-tag">Offers · Pro</span>
              <h3>Weekend discount? Live in a click.</h3>
              <p>A floating card or popup on your site, with an optional lead form. Colours match your website.</p>
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

      {/* USES */}
      <section className="m-sec" id="voices" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">Who it&apos;s for</span>
            <h2 className="m-h2">Built for businesses that <em>live on enquiries.</em></h2>
          </div>
          <div className="steps3">
            {USES.map((u) => (
              <div className="st rv" key={u.t}>
                <h3>{u.t}</h3>
                <p>{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="m-sec" id="pricing" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head center rv">
            <span className="m-kicker">Pricing</span>
            <h2 className="m-h2">Honest <em>pricing.</em></h2>
            <p className="m-sub">Start free. Upgrade when you want the AI to do the replying. No contracts: cancel from your account.</p>
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
            <p className="m-sub">Anything else? Write to {site.supportEmail} and a person replies.</p>
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
            <div><h4>Company</h4><ul><li><a href="#voices">Who it&apos;s for</a></li><li><a href="#faq">FAQ</a></li><li><a href={`mailto:${site.supportEmail}`}>Contact</a></li></ul></div>
            <div><h4>Account</h4><ul><li><Link href="/login">Log in</Link></li><li><Link href="/onboarding">Start free</Link></li></ul></div>
          </div>
          <div className="m-foot-bar"><span>© 2026 {site.name}</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/refunds">Refunds</Link></span></div>
        </div>
      </footer>
    </div>
  );
}
