import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { PLANS } from "@/config/plans";

export function PricingSection() {
  return (
    <div className="pricing">
      {PLANS.map((p) => (
        <div key={p.id} className={`plan rv ${p.featured ? "feat" : ""}`}>
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
            {p.featured ? "Get Pro" : "Start free"} <IconArrowRight size={15} />
          </Link>
        </div>
      ))}
    </div>
  );
}
