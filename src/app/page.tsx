import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PricingSection } from "@/components/PricingSection";
import {
  IconSparkle, IconArrowRight, IconPlay, IconBolt, IconRobot, IconRefresh,
  IconInbox, IconTag, IconChat, IconMail, IconClock, IconQuestion, IconPhone,
  IconRupee, IconWhatsapp, IconChart, IconClose, IconCheck,
} from "@/components/icons";

export default function MarketingHome() {
  return (
    <>
      <nav className="nav">
        <div className="nwrap">
          <div className="brand"><Logo size={27} /></div>
          <div className="lnk">
            <Link href="#why">Why</Link>
            <Link href="#features">Features</Link>
            <Link href="#how">How it works</Link>
            <Link href="#voices">Customers</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
          </div>
          <Link href="/login"><button className="ncta">Start free</button></Link>
        </div>
      </nav>

      <header className="hero dots">
        <div className="hwrap">
          <div className="hcol">
            <span className="eb"><IconSparkle size={15} /> The AI lead platform for small business</span>
            <h1>
              Every lead,<br />
              <span className="ser">
                one place.
                <svg className="scrib" viewBox="0 0 200 12" preserveAspectRatio="none" height="11">
                  <path d="M3,9 C40,3 80,10 120,5 C155,1 180,7 197,4" fill="none" stroke="#155EEF" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="sub">
              Your website, WhatsApp and forms — every enquiry lands in <b>one inbox</b>. AI sends
              the first reply in seconds and never forgets a follow-up. You just close the deal.
            </p>
            <div className="ctas">
              <Link href="/login"><button className="big">Start free <IconArrowRight size={16} /></button></Link>
              <button className="gho"><IconPlay size={14} style={{ marginRight: 4 }} />or watch the 2-min demo</button>
            </div>
            <div className="trust">No code needed &nbsp;·&nbsp; 5-minute setup &nbsp;·&nbsp; Cancel anytime</div>
          </div>

          <div className="stk">
            <div className="ly t1">
              <div className="lh2"><span>Rohit Sharma</span><span className="pp n">NEW</span></div>
              <div className="lm">How much does a root canal cost? · Website · 2 min ago</div>
              <div className="ait"><IconRobot size={15} /> AI replied in 10 seconds ✓</div>
            </div>
            <div className="ly t2">
              <div className="lh2"><span>Priya Nair</span><span className="pp w">WON</span></div>
              <div className="lm">Can I get an appointment tomorrow? · WhatsApp · 40 min</div>
            </div>
            <div className="ly t3">
              <div className="lh2"><span>Aman Gupta</span><span className="pp r">REPLIED</span></div>
              <div className="lm">Need a braces consultation · AI chat · 1 hr</div>
            </div>
          </div>
        </div>

        <div className="statbar">
          <div className="sb"><div className="sbv">10<em>sec</em></div><div className="sbl">Average first reply time</div></div>
          <div className="sb"><div className="sbv">78%</div><div className="sbl">of customers choose whoever replies first</div></div>
          <div className="sb"><div className="sbv">0</div><div className="sbl">leads lost in email again</div></div>
          <div className="sb"><div className="sbv">2<em>×</em></div><div className="sbl">more deals closed with instant follow-up</div></div>
        </div>
      </header>

      <div className="strip">
        <span>ONE INBOX</span><span className="s">instant alerts</span><span>AI AUTO-REPLY</span>
        <span className="s">follow-ups on autopilot</span><span>WHATSAPP CAPTURE</span>
        <span className="s">daily summary</span><span>OFFERS &amp; BANNERS</span>
        <span className="s">ask your AI anything</span><span>ONE INBOX</span>
      </div>

      <section className="sec" id="why">
        <div className="sechead"><h2>Sound <em>familiar?</em></h2></div>
        <p className="seclede">
          You paid for a website. Enquiries go to an email you check twice a week. By the time you
          reply, the customer has already booked with someone else. Here&apos;s what changes:
        </p>
        <div className="ba">
          <div className="bacol bad">
            <div className="bat"><IconClose size={20} style={{ color: "#D92D20" }} />Life before Leadworks</div>
            <div className="bali"><IconMail size={16} /><span>Enquiries buried in an <b>email inbox</b> you rarely open</span></div>
            <div className="bali"><IconClock size={16} /><span>First reply after <b>4–6 hours</b> — the lead has gone cold</span></div>
            <div className="bali"><IconQuestion size={16} /><span>&quot;Did anyone follow up with that customer?&quot; — <b>nobody knows</b></span></div>
            <div className="bali"><IconPhone size={16} /><span>WhatsApp enquiries lost in <b>personal chats</b></span></div>
            <div className="bali"><IconRupee size={16} /><span>Every missed lead is <b>money handed to a competitor</b></span></div>
          </div>
          <div className="bacol good">
            <div className="bat"><IconCheck size={20} style={{ color: "#155EEF" }} />Life with Leadworks</div>
            <div className="bali"><IconInbox size={16} /><span>Every lead from every source in <b>one clean inbox</b></span></div>
            <div className="bali"><IconBolt size={16} /><span>AI replies in <b>10 seconds</b> — even at 2am</span></div>
            <div className="bali"><IconRefresh size={16} /><span>Follow-ups <b>scheduled automatically</b> — nothing forgotten</span></div>
            <div className="bali"><IconWhatsapp size={16} /><span>WhatsApp enquiries <b>captured into the same inbox</b></span></div>
            <div className="bali"><IconChart size={16} /><span>A morning summary tells you <b>exactly who to call today</b></span></div>
          </div>
        </div>
      </section>

      <section className="sec" id="features" style={{ paddingTop: 0 }}>
        <div className="sechead"><h2>The work you forget,<br /><em>AI never does.</em></h2></div>
        <p className="seclede">
          Six things Leadworks quietly handles for you every single day — so you can run your
          business instead of chasing your inbox.
        </p>
        <div className="fgrid">
          <div className="fc pop"><div className="fi"><IconBolt size={22} style={{ color: "#155EEF" }} /></div><div className="ft">Instant alerts</div><div className="fd">The moment a lead arrives, it&apos;s on your WhatsApp and email. Day or night, weekend or holiday — nothing slips through.</div></div>
          <div className="fc"><div className="fi"><IconRobot size={22} style={{ color: "#155EEF" }} /></div><div className="ft">AI auto-reply</div><div className="fd">AI sends a warm, personal first response in 10 seconds — with your services, prices and timings. Customers think you never sleep.</div></div>
          <div className="fc"><div className="fi"><IconRefresh size={22} style={{ color: "#155EEF" }} /></div><div className="ft">Follow-ups on autopilot</div><div className="fd">No reply after 2 days? AI drafts a gentle nudge and sends it with your approval. Cold leads come back warm.</div></div>
          <div className="fc"><div className="fi"><IconInbox size={22} style={{ color: "#155EEF" }} /></div><div className="ft">One inbox, every source</div><div className="fd">Website forms, WhatsApp messages, AI chat conversations — every lead in one place with full history and status.</div></div>
          <div className="fc"><div className="fi"><IconTag size={22} style={{ color: "#155EEF" }} /></div><div className="ft">Offers &amp; banners</div><div className="fd">Running a weekend discount? Push a banner to your website in one click from your phone. No developer, no waiting.</div></div>
          <div className="fc"><div className="fi"><IconChat size={22} style={{ color: "#155EEF" }} /></div><div className="ft">Ask your AI anything</div><div className="fd">&quot;How many leads this week?&quot; &quot;Who should I call first?&quot; — plain-language answers from your own business data.</div></div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="sec">
          <div className="sechead"><h2>Three steps, <em>that&apos;s it.</em></h2></div>
          <div className="steps">
            <div className="step"><div className="snum">1.</div><div className="stt">Connect your site</div><div className="sdd">Paste one tiny snippet into your website — takes 5 minutes, zero code. Got old leads in email or Excel? Import them in one go.</div></div>
            <div className="step"><div className="snum">2.</div><div className="stt">Teach the AI</div><div className="sdd">Answer a few questions about your business — what you do, your services, timings and prices. That&apos;s all the AI needs to speak for you.</div></div>
            <div className="step"><div className="snum">3.</div><div className="stt">Close deals</div><div className="sdd">Leads flow in, AI replies instantly, follow-ups happen on time. Every morning a summary lands on your WhatsApp: who&apos;s hot, who to call.</div></div>
          </div>
        </div>
      </section>

      <section className="sec" id="voices">
        <div className="sechead"><h2>People who stopped <em>losing leads.</em></h2></div>
        <div className="tgrid">
          <div className="tc">
            <div className="stars">★★★★★</div>
            <p className="tq">&quot;I used to check email once a day. Turns out I was replying to enquiries <b>6 hours late</b>. Now the AI answers before I even see my phone — bookings doubled in two months.&quot;</p>
            <div className="twho"><span className="tav" style={{ background: "#155EEF" }}>RM</span><div><div className="tn">Dr. Rachit Mehra</div><div className="tb">Dental clinic, Indore</div></div></div>
          </div>
          <div className="tc">
            <div className="stars">★★★★★</div>
            <p className="tq">&quot;The morning WhatsApp summary is my favourite thing. Tea in one hand, phone in the other — I know <b>exactly who to call</b> before 10am. It&apos;s like having a receptionist who never takes leave.&quot;</p>
            <div className="twho"><span className="tav" style={{ background: "#14161A" }}>SK</span><div><div className="tn">Shalini Kapoor</div><div className="tb">Salon owner, Pune</div></div></div>
          </div>
          <div className="tc">
            <div className="stars">★★★★★</div>
            <p className="tq">&quot;Half my enquiries came on WhatsApp and got lost between family chats. Now everything sits in one inbox with a status. Last month I closed <b>9 deals from old leads</b> the follow-up AI revived.&quot;</p>
            <div className="twho"><span className="tav" style={{ background: "#0E9F6E" }}>AV</span><div><div className="tn">Arjun Verma</div><div className="tb">Real estate consultant, Jaipur</div></div></div>
          </div>
        </div>
      </section>

      <section className="sec" id="pricing" style={{ paddingTop: 0 }}>
        <div className="sechead"><h2>Honest <em>pricing.</em></h2></div>
        <p className="seclede">Start free. Upgrade when the leads do. No contracts, no surprises — cancel in two clicks.</p>
        <PricingSection />
      </section>

      <section className="sec" id="faq" style={{ paddingTop: 0 }}>
        <div className="sechead"><h2>Fair <em>questions.</em></h2></div>
        <div className="faq">
          <details className="qa" open>
            <summary>Will this work with my existing website? <IconArrowRight size={16} /></summary>
            <p>Yes — that&apos;s the whole point. Whether your site was built in WordPress, Wix, or hand-coded years ago, you paste one small snippet and your existing contact form starts sending leads to your inbox. Nothing about your site changes.</p>
          </details>
          <details className="qa">
            <summary>What if the AI says something wrong to my customer? <IconArrowRight size={16} /></summary>
            <p>The AI only uses the information you give it — your services, prices, timings. It never invents answers. For anything it&apos;s unsure about, it politely says the owner will call back, and pings you. You can also review every follow-up before it&apos;s sent.</p>
          </details>
          <details className="qa">
            <summary>I get most enquiries on WhatsApp, not my website. Does this help? <IconArrowRight size={16} /></summary>
            <p>Yes — on the Growth plan, your WhatsApp business number connects to the same inbox. Website, WhatsApp and chat leads all live together, so nothing gets lost between personal chats.</p>
          </details>
          <details className="qa">
            <summary>Do I need to install anything or hire a developer? <IconArrowRight size={16} /></summary>
            <p>No installs, no developer. If you can copy-paste, you can set up Leadworks in about 5 minutes. And if you get stuck, we&apos;ll do the setup with you on a call — free.</p>
          </details>
          <details className="qa">
            <summary>What happens to my data if I cancel? <IconArrowRight size={16} /></summary>
            <p>Your leads are yours. Export everything to Excel/CSV in one click, any time — including after you cancel. We keep your data for 30 days post-cancellation in case you change your mind, then delete it permanently.</p>
          </details>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="note">
          <span className="pin">📌</span>
          <p>
            &quot;We build websites for small businesses. The sites looked great — but we kept
            watching owners lose enquiries in messy inboxes and forgotten chats. Leadworks is the
            tool we wished existed for our own clients. So we built it.&quot;
          </p>
          <div className="sig">— Rajdeep, Founder</div>
          <div className="sigr">Leadworks · built in India, for small businesses everywhere</div>
        </div>
      </section>

      <section className="endcta dots">
        <h2>Don&apos;t miss <em>the next lead.</em></h2>
        <p className="endsub">Your next customer is filling the form right now. Be the first to reply.</p>
        <div className="ctas" style={{ justifyContent: "center", marginTop: 26 }}>
          <Link href="/login"><button className="big">Start free <IconArrowRight size={16} /></button></Link>
          <button className="gho">watch the demo</button>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Leadworks</span>
        <span className="serif" style={{ color: "#475467" }}>small business, big dreams.</span>
        <span>Privacy · Terms · Contact</span>
      </footer>
    </>
  );
}
