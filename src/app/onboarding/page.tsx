"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { useSignup } from "@/hooks/auth/mutation";
import { authErrorMessage } from "@/lib/errors";

export default function OnboardingPage() {
  const router = useRouter();
  const signup = useSignup();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [servicesInfo, setServicesInfo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    signup.mutate(
      { businessName, email, password, servicesInfo: servicesInfo.trim() || undefined },
      { onSuccess: () => router.push("/dashboard") }
    );
  }

  return (
    <AuthShell>
        <h2>
          Set up your <em>workspace.</em>
        </h2>
        <div className="auth-sub">Two minutes, no card. Your AI learns your business from this.</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="flabel" htmlFor="business">Business name</label>
            <input id="business" className="finput" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Sharma Dental Clinic" required />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="email">Work email</label>
            <input id="email" className="finput" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.in" required />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="password">Password</label>
            <input id="password" className="finput" type="password" autoComplete="new-password" minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="services">What do you offer? <span style={{ color: "var(--faint)", fontWeight: 500 }}>(optional)</span></label>
            <textarea
              id="services"
              className="finput"
              rows={3}
              value={servicesInfo}
              onChange={(e) => setServicesInfo(e.target.value)}
              placeholder="Services, prices, timings — the AI uses this to reply to your leads."
              style={{ resize: "vertical" }}
            />
          </div>

          {signup.isError && <div className="auth-err">{authErrorMessage(signup.error)}</div>}

          <button type="submit" disabled={signup.isPending} className="big" style={{ width: "100%", opacity: signup.isPending ? 0.7 : 1 }}>
            {signup.isPending ? "Setting things up…" : "Create my workspace →"}
          </button>
        </form>

        <div className="auth-alt">
          Already have an account? <Link href="/login">Log in</Link>
        </div>
    </AuthShell>
  );
}
