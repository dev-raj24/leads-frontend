"use client";

import Link from "next/link";
import { useState } from "react";
import { useBilling } from "@/hooks/billing/query";
import { useResendVerification } from "@/hooks/auth/mutation";
import { useSubscribe } from "@/hooks/billing/mutation";
import type { AuthUser } from "@/types/models";

export function Notices({ user }: { user: AuthUser | null }) {
  const { data: billing } = useBilling();
  const resend = useResendVerification();
  const subscribe = useSubscribe();
  const [hidden, setHidden] = useState<string | null>(null);

  const usage = billing?.usage;
  const notices: Array<{ key: string; tone: "warn" | "bad"; text: React.ReactNode }> = [];

  if (user && user.emailVerified === false) {
    notices.push({
      key: "verify",
      tone: "warn",
      text: (
        <>
          Confirm your email to get new-lead alerts. We sent a link to <b>{user.email}</b>.{" "}
          <button type="button" className="notice-link" disabled={resend.isPending || resend.isSuccess} onClick={() => resend.mutate()}>
            {resend.isSuccess ? "Sent — check your inbox" : resend.isPending ? "Sending…" : "Resend email"}
          </button>
        </>
      ),
    });
  }

  if (usage?.overLimit && billing?.plan === "free") {
    notices.push({
      key: "limit",
      tone: "bad",
      text: (
        <>
          You&apos;ve passed {usage.leadsLimit} leads this month. New leads are still saved and shown, but AI replies, automatic follow-ups and other automations are paused.{" "}
          <button type="button" className="notice-link" disabled={subscribe.isPending} onClick={() => subscribe.mutate()}>
            Upgrade to Pro
          </button>
        </>
      ),
    });
  } else if (usage?.nearLimit && billing?.plan === "free") {
    notices.push({
      key: "near",
      tone: "warn",
      text: (
        <>
          {usage.leadsThisMonth} of {usage.leadsLimit} free leads used this month. <Link href="/account" className="notice-link">See plans</Link>
        </>
      ),
    });
  }

  if (billing?.planStatus === "past_due") {
    notices.push({
      key: "due",
      tone: "bad",
      text: (
        <>
          Your last payment didn&apos;t go through. Pro stays on for a few days while we retry. <Link href="/account" className="notice-link">Check billing</Link>
        </>
      ),
    });
  }

  const shown = notices.filter((n) => n.key !== hidden);
  if (shown.length === 0) return null;

  return (
    <div className="notices">
      {shown.map((n) => (
        <div key={n.key} className={`notice ${n.tone}`} role="status">
          <span>{n.text}</span>
          {n.key !== "verify" && (
            <button type="button" className="notice-x" aria-label="Dismiss" onClick={() => setHidden(n.key)}>×</button>
          )}
        </div>
      ))}
    </div>
  );
}
