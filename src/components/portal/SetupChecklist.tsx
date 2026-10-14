"use client";

import Link from "next/link";
import { IconCheck } from "@/components/icons";
import { useAiConfig } from "@/hooks/aiConfig/query";
import { useLeads } from "@/hooks/leads/query";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import type { BusinessProfile } from "@/types/models";

const profileReady = (p?: BusinessProfile) =>
  !!p && (p.about.trim().length >= 10 || p.services.length > 0 || p.timings.trim().length > 0 || p.faqs.trim().length >= 10);

export function SetupChecklist() {
  const { data: ai } = useAiConfig();
  const { data: leads } = useLeads();
  const [verified, setVerified] = useState(true);
  useEffect(() => setVerified(getUser()?.emailVerified !== false), []);

  const profile = ai?.config;
  const steps = [
    { done: verified, title: "Confirm your email", note: "So new-lead alerts reach you.", href: "/account", cta: "Open account" },
    { done: profileReady(profile), title: "Tell us about your business", note: "Hours, services and prices. This is what the AI answers from.", href: "/settings", cta: "Add details" },
    { done: (leads?.leads.length ?? 0) > 0, title: "Receive your first lead", note: "Submit your own form once to see the alert and the inbox work.", href: "/leads", cta: "Open leads" },
  ];

  if (!ai || !leads) return null;
  if (steps.every((s) => s.done)) return null;
  const left = steps.filter((s) => !s.done).length;

  return (
    <div className="pnl pad" style={{ marginBottom: 20 }}>
      <div className="sec-t" style={{ marginTop: 0 }}>Get set up · {left} {left === 1 ? "step" : "steps"} left</div>
      <div className="setup">
        {steps.map((s) => (
          <div key={s.title} className={`setup-row ${s.done ? "done" : ""}`}>
            <span className="setup-dot">{s.done && <IconCheck size={12} />}</span>
            <span className="setup-t">
              {s.title}
              {!s.done && <small>{s.note}</small>}
            </span>
            {!s.done && <Link href={s.href} className="notice-link" style={{ color: "var(--primary)" }}>{s.cta} →</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
