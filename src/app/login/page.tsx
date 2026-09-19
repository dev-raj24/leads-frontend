"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { useLogin } from "@/hooks/auth/mutation";
import { authErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => router.push("/dashboard") });
  }

  return (
    <AuthShell>
        <h2>
          Welcome <em>back.</em>
        </h2>
        <div className="auth-sub">Your leads have been waiting.</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="flabel" htmlFor="email">Email</label>
            <input
              id="email"
              className="finput"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourbusiness.in"
              required
            />
          </div>
          <div className="field">
            <label className="flabel" htmlFor="password">Password</label>
            <input
              id="password"
              className="finput"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {login.isError && <div className="auth-err">{authErrorMessage(login.error)}</div>}

          <button type="submit" disabled={login.isPending} className="big" style={{ width: "100%", opacity: login.isPending ? 0.7 : 1 }}>
            {login.isPending ? "Logging in…" : "Log in →"}
          </button>
        </form>

        <div className="orr">or</div>
        <button className="oauth-btn" disabled>Continue with Google</button>

        <div className="auth-alt">
          New here? <Link href="/onboarding">Start free</Link> — no card needed.
        </div>
    </AuthShell>
  );
}
