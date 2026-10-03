"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { useSignup } from "@/hooks/auth/mutation";
import { authErrorMessage } from "@/lib/errors";

interface SignupFields {
  businessName: string;
  email: string;
  password: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OnboardingPage() {
  const router = useRouter();
  const signup = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFields>();

  function onSubmit(values: SignupFields) {
    signup.mutate(
      { businessName: values.businessName.trim(), email: values.email.trim().toLowerCase(), password: values.password },
      { onSuccess: () => router.push("/onboarding/business") }
    );
  }

  return (
    <AuthShell step={1}>
      <h2>
        Set up your <em>workspace.</em>
      </h2>
      <div className="auth-sub">Two minutes, no card. Next we&apos;ll teach the AI about your business.</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label className="flabel" htmlFor="business">Business name</label>
          <input
            id="business"
            className={`finput ${errors.businessName ? "err" : ""}`}
            placeholder="e.g. Sharma Dental Clinic"
            aria-invalid={!!errors.businessName}
            {...register("businessName", {
              required: "Please enter your business name.",
              maxLength: { value: 120, message: "Business name must be 120 characters or fewer." },
            })}
          />
          {errors.businessName && <div className="ferr">{errors.businessName.message}</div>}
        </div>
        <div className="field">
          <label className="flabel" htmlFor="email">Work email</label>
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
          <label className="flabel" htmlFor="password">Password</label>
          <input
            id="password"
            className={`finput ${errors.password ? "err" : ""}`}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            {...register("password", {
              required: "Please choose a password.",
              minLength: { value: 8, message: "Password must be at least 8 characters." },
              maxLength: { value: 72, message: "Password must be 72 characters or fewer." },
            })}
          />
          {errors.password && <div className="ferr">{errors.password.message}</div>}
        </div>

        {signup.isError && <div className="auth-err">{authErrorMessage(signup.error)}</div>}

        <p className="hint" style={{ margin: "0 0 14px" }}>
          By continuing you agree to the <Link href="/terms" target="_blank">Terms</Link> and <Link href="/privacy" target="_blank">Privacy policy</Link>.
        </p>

        <button type="submit" disabled={signup.isPending} className="big" style={{ width: "100%", opacity: signup.isPending ? 0.7 : 1 }}>
          {signup.isPending ? "Setting things up…" : "Continue →"}
        </button>
      </form>

      <div className="auth-alt">
        Already have an account? <Link href="/login">Log in</Link>
      </div>
    </AuthShell>
  );
}
