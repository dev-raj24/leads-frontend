"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/marketing.css";
import { Logo } from "@/components/Logo";
import { IconCheck } from "@/components/icons";
import { useChoosePlan } from "@/hooks/tenant/mutation";
import { isLoggedIn } from "@/lib/session";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/types/models";

export default function OnboardingPlanPage() {
  const router = useRouter();
  const choosePlan = useChoosePlan();
  const [picking, setPicking] = useState<Plan | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/onboarding");
  }, [router]);

  function pick(plan: Plan) {
    setPicking(plan);
    choosePlan.mutate(plan, {
      onSuccess: () => router.push("/dashboard"),
      onSettled: () => setPicking(null),
    });
  }

  return (
    <div className="m" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="m-wrap" style={{ paddingTop: 40, paddingBottom: 64, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Logo size={32} />
        </div>
        <ol className="auth-steps" style={{ justifyContent: "center", marginBottom: 12 }}>
          <li className="done"><span><IconCheck size={12} /></span>Account</li>
          <li className="done"><span><IconCheck size={12} /></span>Your business</li>
          <li className="on"><span>3</span>Plan</li>
        </ol>
        <div className="m-head center" style={{ marginBottom: 32 }}>
          <h2 className="m-h2">One last step — <em>pick a plan.</em></h2>
          <p className="m-sub">Start free, no card needed. Upgrade to Pro whenever you're ready — you can change this later in Settings.</p>
        </div>

        <div className="pricing">
          {PLANS.map((p) => (
            <div key={p.id} className={`plan ${p.featured ? "feat" : ""}`}>
              {p.featured && <span className="plan-tag">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="plan-blurb">{p.blurb}</p>
              <div className="plan-price">
                {p.price} <span>{p.per}</span>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><IconCheck size={17} /> {f}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`m-btn ${p.featured ? "lime" : "solid"}`}
                disabled={choosePlan.isPending}
                onClick={() => pick(p.id)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {picking === p.id ? "Setting up…" : p.id === "free" ? "Continue with Free" : "Continue with Pro"}
              </button>
            </div>
          ))}
        </div>

        {choosePlan.isError && (
          <p className="hint" style={{ textAlign: "center", marginTop: 16 }}>Couldn&apos;t save your plan — please try again.</p>
        )}
      </div>
    </div>
  );
}
