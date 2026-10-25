"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { useForgotPassword } from "@/hooks/auth/mutation";

interface ForgotPasswordFields {
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFields>();

  function onSubmit(values: ForgotPasswordFields) {
    forgotPassword.mutate(values.email.trim().toLowerCase());
  }

  if (forgotPassword.isSuccess) {
    return (
      <AuthShell>
        <h2>Check your <em>email.</em></h2>
        <div className="auth-sub">
          If an account exists for <b>{getValues("email")}</b>, we&apos;ve sent a link to reset your password. It expires in 30 minutes.
        </div>
        <div className="auth-alt">
          <Link href="/login">← Back to log in</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h2>Forgot your <em>password?</em></h2>
      <div className="auth-sub">Enter your email and we&apos;ll send you a link to reset it.</div>

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

        {forgotPassword.isError && <div className="auth-err">Something went wrong. Please try again.</div>}

        <button type="submit" disabled={forgotPassword.isPending} className="big" style={{ width: "100%", opacity: forgotPassword.isPending ? 0.7 : 1 }}>
          {forgotPassword.isPending ? "Sending…" : "Send reset link →"}
        </button>
      </form>

      <div className="auth-alt">
        <Link href="/login">← Back to log in</Link>
      </div>
    </AuthShell>
  );
}
