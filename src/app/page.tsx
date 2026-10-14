import Link from "next/link";
import "./marketing.css";
import { Logo } from "@/components/Logo";
import { PricingSection } from "@/components/PricingSection";
import { AskBubble, DotGrid, MailDone, MailPile, Rings, SeoArt, Spark, Waves } from "@/components/Art";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  IconArrowRight,
  IconChart,
  IconBolt,
  IconChat,
  IconCheck,
  IconClock,
  IconClose,
  IconGlobe,
  IconInbox,
  IconMail,
  IconRefresh,
  IconRobot,
  IconSearch,
  IconSparkle,
  IconTag,
  IconTrophy,
  IconUsers,
} from "@/components/icons";
import { site } from "@/config/site";

const PROOF = [
  { n: "1", u: "inbox", t: "for every website enquiry" },
  { n: "1", u: "request", t: "from your form sends a lead here" },
  { n: "₹0", u: "", t: "to start, no card" },
  { n: "24/7", u: "", t: "alerts and AI first replies, on Pro" },
];

const BEFORE = [
  <>Enquiries buried in an <b>email inbox</b> you rarely open</>,
  <>First reply after <b>4–6 hours</b> — the lead has gone cold</>,
  <>&ldquo;Did anyone follow up?&rdquo; — <b>nobody knows</b></>,
  <>Enquiries split between forms, email and calls that <b>nobody tracks</b></>,
  <>Every missed lead is <b>money handed to a competitor</b></>,
];
const AFTER = [
  <>Every lead from every source in <b>one clean inbox</b></>,
  <>AI replies in <b>seconds</b> on Pro — even at 2am</>,
  <>Follow-ups <b>scheduled automatically</b> — nothing forgotten</>,
  <>Form enquiries and imported sheets <b>land in the same place</b></>,
  <>A clear list of <b>who is still waiting for a reply</b></>,
];

const STEPS = [
  { t: "Send your enquiries", d: "Your website form sends each enquiry to Leadworks with one small request (a developer adds it in minutes). Got old leads in Excel? Import them in one go." },
  { t: "Teach the AI", d: "Answer a few questions about your business — services, timings, prices. That's all the AI needs to speak for you." },
  { t: "Close deals", d: "Leads flow in and you get an email each time. On Pro, AI replies in seconds and follow-ups go out on time. You see exactly who is still waiting." },
  { t: "Get found on Google", d: "On Pro, scan your website, get a score out of 100 and ready-to-paste fixes, and watch the real searches that find you on Google." },
];

const FAQ = [
  ["Will this work with my existing website?", "Yes, as long as your contact form can send its details to a web address. A developer adds that one request, usually in minutes, and the enquiries land in your inbox. If you would rather not, you can import leads from an Excel sheet."],
  ["What if the AI says something wrong to my customer?", "The AI only answers from what you tell it: your services, prices and hours. If something isn't covered, it says the team will follow up. It stays off until you have filled in your business profile, and you can see every reply it sent. Automatic follow-ups are off until you switch them on."],
  ["Does it work with WhatsApp?", "Not yet. Today Leadworks collects enquiries from your website form and imported sheets. WhatsApp is on our list, and we'd rather tell you that plainly than promise it."],
  ["Will this help me show up on Google?", "The SEO check reads your pages the way a search engine does, scores them, and writes the title, description and other fixes ready to paste. Connect Google Search Console and you see the real searches that find you. Good content and time still decide where you rank, and nobody can promise a position."],
  ["Do I need a developer?", `Only once: someone adds the small request that sends your website form to Leadworks. Everything else happens in the dashboard. If you get stuck, write to ${site.supportEmail} and we will help.`],
  ["What happens to my data if I cancel?", "Your account moves to Free and your leads and settings stay. If you want everything deleted, write to us and we will delete it."],
  ["What happens if I go over 50 leads on the Free plan?", "Nothing is lost. Every lead is still saved and shown in your inbox. Paid automations such as AI replies pause until next month or until you upgrade."],
];

const USES = [
  { t: "Clinics and dentists", d: "Patients ask about prices and slots at night. The AI answers from your hours and price list, and the front desk sees who still needs a call in the morning." },
  { t: "Salons, studios and gyms", d: "Every booking enquiry lands in one inbox with a reply started, and anyone who goes quiet gets a follow-up so the slot does not stay empty." },
  { t: "Coaching, real estate and services", d: "Each enquiry gets an email alert, a reply, and a follow-up so a warm lead does not go cold." },
];

export default function MarketingHome() {
  return (
    <div className="m">
      <RevealOnScroll />

      <nav className="m-nav">
        <div className="m-wrap m-nav-in">
          <Logo size={30} />
          <div className="m-links">
            <a href="#features">Product</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="m-nav-cta">
            <Link href="/login" className="m-login">Log in</Link>
            <Link href="/onboarding" className="m-btn dark sm">Start free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="m-hero">
        <svg className="hero-dots" aria-hidden="true" width="520" height="420">
          <defs>
            <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="currentColor" /></pattern>
            <linearGradient id="dotsfade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" /></linearGradient>
            <mask id="dotsmask"><rect width="520" height="420" fill="url(#dotsfade)" /></mask>
          </defs>
          <rect width="520" height="420" fill="url(#dots)" mask="url(#dotsmask)" />
        </svg>
        <svg className="hero-blob" aria-hidden="true" viewBox="0 0 400 400">
          <path d="M318 62c52 40 70 118 38 176s-104 94-170 90S54 292 40 224 66 96 126 64s140-42 192-2z" fill="currentColor" />
        </svg>
        <div className="m-wrap m-hero-grid">
          <div className="m-hero-copy">
            <span className="m-badge"><IconSparkle size={14} /> AI replies in seconds</span>
            <h1>
              Every lead,<br />
              answered<br />
              <span className="hl">first.<Spark className="h1-spark" /></span>
            </h1>
            <p className="m-lede">
              Every enquiry from your website form lands in one inbox. We email you instantly, write the first reply, and remind you to follow up.
            </p>
            <div className="m-hero-cta">
              <Link href="/onboarding" className="m-btn solid lg">Start free</Link>
              <a href="#features" className="m-btn soft lg">See how it works</a>
            </div>
            <div className="m-trust">
              <div className="m-faces" aria-hidden="true"><i className="f1">RS</i><i className="f2">PN</i><i className="f3">AG</i><i className="f4">SK</i></div>
              <span>Made for clinics, salons, gyms and coaches</span>
            </div>
          </div>

          <div className="bx" aria-hidden="true">
            <Spark className="bx-spark s1" />
            <Spark className="bx-spark s2" />
            <div className="bx-t inbox">
              <div className="bx-h">Inbox <span className="pp w">3 new</span></div>
              <div className="bx-row"><span className="bx-av a">RS</span><div><b>Rohit Sharma</b><small>Root canal price?</small></div><IconMail size={16} /></div>
              <div className="bx-row"><span className="bx-av b">PN</span><div><b>Priya Nair</b><small>Appointment tomorrow?</small></div><IconChat size={16} /></div>
            </div>
            <div className="bx-t mint">
              <small><IconClock size={14} /> Reply time</small>
              <svg viewBox="0 0 120 40" className="bx-line"><path d="M2 32c14-2 18-18 32-16s16 14 30 8 18-26 34-22 16 6 20 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              <strong>42<span>s</span></strong>
            </div>
            <div className="bx-t peach">
              <small><IconRobot size={14} /> AI reply · sent</small>
              <p>Hi Rohit! A root canal starts at ₹4,500. Shall I hold 11 AM tomorrow?</p>
            </div>
            <div className="bx-t coral">
              <small>This week</small>
              <svg viewBox="0 0 84 36" className="bx-bars"><rect x="0" y="22" width="9" height="14" rx="3" /><rect x="13" y="14" width="9" height="22" rx="3" /><rect x="26" y="18" width="9" height="18" rx="3" /><rect x="39" y="8" width="9" height="28" rx="3" /><rect x="52" y="12" width="9" height="24" rx="3" /><rect x="65" y="2" width="9" height="34" rx="3" /></svg>
              <strong>128</strong>
              <em>leads captured</em>
            </div>
            <svg className="bx-arrow" viewBox="0 0 90 90" aria-hidden="true"><path d="M6 8c40 4 62 22 66 62" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" /><path d="M62 62l10 10 10-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="bx-chip c1"><IconBolt size={14} /> New lead · just now</div>
            <div className="bx-chip c2"><IconSparkle size={14} /> AI replied in 4s</div>
          </div>
        </div>
      </header>

      <div className="m-wrap">
        <div className="m-proof">
          {PROOF.map((p) => (
            <div key={p.t} className="rv">
              <div className="m-num">{p.n}<small>{p.u}</small></div>
              <p>{p.t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES — bento */}
      <section className="m-sec" id="features">
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">What you get</span>
            <h2 className="m-h2">The follow-up work, handled.</h2>
          </div>
          <div className="bento">
            <div className="bt rose s3 rv">
              <div>
                <span className="bt-ic"><IconSparkle size={22} /></span>
                <h3>A warm first reply, in seconds.</h3>
                <p>Uses your services, prices and hours. Customers hear back while they are still interested.</p>
              </div>
              <div className="bub in">Do you have weekend slots?<time>Sat 9:12</time></div>
              <div className="bub out">Yes! Saturdays 10 AM – 4 PM. Want me to hold 11:30?<time>Sat 9:12 ✓✓</time></div>
            </div>
            <div className="bt mint s3 rv">
              <div>
                <span className="bt-ic"><IconMail size={22} /></span>
                <h3>Know the moment a lead lands.</h3>
                <p>One email per new lead, day or night. Free on every plan.</p>
              </div>
              <div className="bt-big">1<small> email per lead</small></div>
            </div>
            <div className="bt peach s2 rv">
              <span className="bt-ic"><IconRefresh size={22} /></span>
              <h3>Cold leads come back warm.</h3>
              <p>No reply in 2 days? A follow-up is ready to approve, or sent for you on Pro.</p>
            </div>
            <div className="bt sky s2 rv">
              <span className="bt-ic"><IconInbox size={22} /></span>
              <h3>Every source, one inbox.</h3>
              <p>Form enquiries and imported sheets, with the full conversation and status.</p>
            </div>
            <div className="bt butter s2 rv">
              <span className="bt-ic"><IconTag size={22} /></span>
              <h3>An SEO check that writes the fixes.</h3>
              <p>Scan your site, get a score, and paste ready-made titles and descriptions. Pro.</p>
            </div>
            <div className="bt ink s6 rv">
              <div className="bt-split">
                <div>
                  <span className="bt-ic"><IconRobot size={22} /></span>
                  <h3>Ask your AI, in plain words.</h3>
                  <p>Who to call first, how the week went. Straight answers from your own data.</p>
                </div>
                <div className="qa-row">
                  <span className="qa-chip">How many leads this week?</span>
                  <span className="qa-chip a">14 — 9 replied, 3 won. Call Aman Gupta first.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="m-wrap seo-wrap" id="seo">
        <div className="seo rv">
          <Rings className="seo-ring" />
          <div className="seo-copy">
            <span className="m-kicker">SEO · Pro</span>
            <h2 className="m-h2">See what holds your site back. Then watch Google notice.</h2>
            <p className="m-sub">We scan your website, tell you what to fix in plain words, and show the real searches that find you.</p>
            <ul className="seo-list">
              <li><i><IconSparkle size={20} /></i><div><b>A score for every page</b><span>Title, description, headings, images, mobile set-up and more, out of 100.</span></div></li>
              <li><i><IconSearch size={20} /></i><div><b>Fixes written for you</b><span>Ready-to-paste titles, descriptions, social tags and business details for each page.</span></div></li>
              <li><i><IconGlobe size={20} /></i><div><b>Real Google numbers</b><span>Connect Search Console to see clicks, how often you show up, and your average position.</span></div></li>
              <li><i><IconChart size={20} /></i><div><b>Searches near page 1</b><span>The queries where you sit on page 2, so you know what is worth improving first.</span></div></li>
            </ul>
            <p className="seo-fine">Rankings depend on your content and time. We show what is in the way and what Google is really doing with your site.</p>
          </div>
          <SeoArt className="seo-art" />
        </div>
      </section>

      {/* WHY */}
      <section className="m-sec" id="why" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">Why Leadworks</span>
            <h2 className="m-h2">The difference is the reply.</h2>
            <p className="m-sub">You paid for a website. Enquiries go to an email you check twice a week. By the time you reply, the customer has booked with someone else.</p>
          </div>
          <div className="cmp rv">
            <div className="cmp-col before">
              <MailPile className="cmp-art" />
              <h3>Before</h3>
              <ul>{BEFORE.map((t, i) => <li key={i}><IconClose size={18} /><span>{t}</span></li>)}</ul>
            </div>
            <div className="cmp-col after">
              <MailDone className="cmp-art" />
              <h3>With Leadworks</h3>
              <ul>{AFTER.map((t, i) => <li key={i}><IconCheck size={18} /><span>{t}</span></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="m-sec" id="how" style={{ paddingTop: 0 }}>
        <div className="m-wrap">
          <div className="m-head rv">
            <span className="m-kicker">How it works</span>
            <h2 className="m-h2">Four steps, that&apos;s it.</h2>
          </div>
          <div className="steps3 four">
            {STEPS.map((s, i) => (
              <div className={`st ${["rose", "peach", "mint", "sky"][i]} rv`} key={s.t}>
                <Waves className="st-deco" />
                <span className="st-ic">{[<IconBolt key="a" size={26} />, <IconRobot key="b" size={26} />, <IconTrophy key="c" size={26} />, <IconGlobe key="d" size={26} />][i]}</span>
                <div className="m-num">{i + 1}</div>
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
            <h2 className="m-h2">Built for businesses that live on enquiries.</h2>
          </div>
          <div className="steps3 plain">
            {USES.map((u, i) => (
              <div className={`st ${["sky", "butter", "peach"][i]} rv`} key={u.t}>
                <DotGrid className="st-deco" />
                <span className="st-ic">{[<IconChat key="a" size={26} />, <IconTag key="b" size={26} />, <IconUsers key="c" size={26} />][i]}</span>
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
          <div className="m-head rv">
            <span className="m-kicker">Pricing</span>
            <h2 className="m-h2">Simple pricing.</h2>
            <p className="m-sub">Start free. Upgrade when you want the AI to do the replying. No contracts: cancel from your account.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="m-sec" id="faq" style={{ paddingTop: 0 }}>
        <div className="m-wrap faq2">
          <div className="m-head rv">
            <span className="m-kicker">FAQ</span>
            <h2 className="m-h2">Fair questions.</h2>
            <p className="m-sub">Anything else? Write to {site.supportEmail} and a person replies.</p>
            <AskBubble className="faq-art" />
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
          <Spark className="cta-spark a" />
          <Spark className="cta-spark b" />
          <Rings className="cta-ring" />
          <h2>Don&apos;t miss the next lead.</h2>
          <p>Your next customer is filling the form right now. Be the first to reply.</p>
          <div className="m-cta-btns">
            <Link href="/onboarding" className="m-btn peach lg">Start free <IconArrowRight size={16} /></Link>
            <Link href="/login" className="m-btn ghost lg">Log in</Link>
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
