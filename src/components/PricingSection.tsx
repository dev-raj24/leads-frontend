import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/icons";

const PLANS = [
  {
    name: "Starter",
    blurb: "For solo owners getting started with lead capture.",
    price: "₹0",
    per: "forever",
    features: ["Up to 50 leads / month", "Web chat widget", "Unified inbox", "Instant email alerts"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    blurb: "Everything on autopilot — replies, follow-ups and WhatsApp.",
    price: "₹999",
    per: "/ month",
    features: ["Unlimited leads", "AI instant responder", "WhatsApp integration", "Automated follow-ups", "AI blog & offer banners"],
    cta: "Get Pro",
    featured: true,
  },
];

export function PricingSection() {
  return (
    <div className="pricing">
      {PLANS.map((p) => (
        <div key={p.name} className={`plan rv ${p.featured ? "feat" : ""}`}>
          {p.featured && <span className="plan-tag">Most popular</span>}
          <h3>{p.name}</h3>
          <p className="plan-blurb">{p.blurb}</p>
          <div className="plan-price">
            {p.price} <span>{p.per}</span>
          </div>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <IconCheck size={17} /> {f}
              </li>
            ))}
          </ul>
          <Link href="/onboarding" className={`m-btn ${p.featured ? "lime" : "solid"}`}>
            {p.cta} <IconArrowRight size={15} />
          </Link>
        </div>
      ))}
    </div>
  );
}
