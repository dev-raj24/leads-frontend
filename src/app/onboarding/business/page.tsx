"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/(portal)/portal.css";
import { AuthShell } from "@/components/AuthShell";
import { BusinessProfileForm } from "@/components/portal/BusinessProfileForm";
import { isLoggedIn } from "@/lib/session";

export default function OnboardingBusinessPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/onboarding");
  }, [router]);

  return (
    <AuthShell step={2} wide>
      <h2>
        Tell us about your <em>business.</em>
      </h2>
      <div className="auth-sub">This is what your AI reads before it replies to a lead — the more specific, the better.</div>

      <BusinessProfileForm onboarding onSaved={() => router.push("/onboarding/plan")} />

      <div className="auth-alt">
        <a onClick={() => router.push("/onboarding/plan")} style={{ cursor: "pointer", color: "var(--primary)", fontWeight: 700 }}>
          Skip for now →
        </a>
      </div>
    </AuthShell>
  );
}
