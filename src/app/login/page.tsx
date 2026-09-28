"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { useLogin } from "@/hooks/auth/mutation";
import { authErrorMessage } from "@/lib/errors";

interface LoginFields {
  email: string;
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  function onSubmit(values: LoginFields) {
    login.mutate(
      { email: values.email.trim().toLowerCase(), password: values.password },
      { onSuccess: (res) => router.push(res.tenant.onboardingCompleted ? "/dashboard" : "/onboarding/business") }
    );
  }

  return (
    <AuthShell>
      <h2>
        Welcome <em>back.</em>
      </h2>
      <div className="auth-sub">Your leads have been waiting.</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label className="flabel" htmlFor="email">Email</label>
          <input
            id="email"
            className={`finput ${errors.email ? "err" : ""}`}
            type="email"
            autoComplete="email"
            placeholder="you@yourbusiness.in"
            aria-invalid={!!errors.email}
            {...register("email", {
              required: "Please enter your email.",
              pattern: { value: EMAIL_RE, message: "Please enter a valid email address." },
            })}
          />
          {errors.email && <div className="ferr">{errors.email.message}</div>}
        </div>
        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label className="flabel" htmlFor="password">Password</label>
            <Link href="/forgot-password" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--primary)" }}>Forgot password?</Link>
          </div>
          <input
            id="password"
            className={`finput ${errors.password ? "err" : ""}`}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password", { required: "Please enter your password." })}
          />
          {errors.password && <div className="ferr">{errors.password.message}</div>}
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
