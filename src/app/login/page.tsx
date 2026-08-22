"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { ApiError, login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Wrong email or password.");
      } else if (err instanceof ApiError && (err.body as { error?: string })?.error === "database_not_configured") {
        setError("Backend isn't connected to a database yet — see leadworks-api/.env.example.");
      } else {
        setError("Couldn't reach the server. Is leadworks-api running?");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap dots">
      <div className="auth-box">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LogoMark size={40} />
        </div>
        <h2>
          Welcome back, <em>boss.</em>
        </h2>
        <div className="auth-sub">Your leads have been waiting.</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="flabel">Email</label>
            <input
              className="finput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="raj@rajsclinic.in"
              required
            />
          </div>
          <div className="field">
            <label className="flabel">Password</label>
            <input
              className="finput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ color: "#D92D20", fontSize: 12.5, fontWeight: 700, marginTop: -4, marginBottom: 10 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="big"
            style={{ width: "100%", justifyContent: "center", display: "flex", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Logging in…" : "Log in →"}
          </button>
        </form>

        <div className="orr">or</div>
        <button className="oauth-btn" disabled>Continue with Google</button>

        <div style={{ marginTop: 22, fontSize: 12, color: "#98A2B3", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          New here?{" "}
          <Link href="/onboarding" style={{ color: "#155EEF", fontWeight: 700, fontStyle: "normal" }}>
            Start free
          </Link>{" "}
          — no card needed.
        </div>
      </div>
    </div>
  );
}
