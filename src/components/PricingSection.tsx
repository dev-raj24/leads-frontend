import Link from "next/link";
import { IconCheck } from "@/components/icons";
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
          <Link href="/onboarding" className="m-btn solid lg">
            {p.featured ? "Get Pro" : "Start free"}
          </Link>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <IconCheck size={17} /> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
