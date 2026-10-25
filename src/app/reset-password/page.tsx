"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { useResetPassword } from "@/hooks/auth/mutation";
import { authErrorMessage } from "@/lib/errors";

interface ResetPasswordFields {
  password: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>();

  function onSubmit(values: ResetPasswordFields) {
    resetPassword.mutate({ token, password: values.password }, { onSuccess: () => router.push("/login") });
  }

  if (!token) {
    return (
      <AuthShell>
        <h2>Invalid <em>link.</em></h2>
        <div className="auth-sub">This reset link is missing its token. Please request a new one.</div>
        <div className="auth-alt">
          <Link href="/forgot-password">Request a new link →</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h2>Choose a new <em>password.</em></h2>
      <div className="auth-sub">Make it something you haven&apos;t used here before.</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label className="flabel" htmlFor="password">New password</label>
          <input
            id="password"
            className={`finput ${errors.password ? "err" : ""}`}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            {...register("password", {
              required: "Please choose a new password.",
              minLength: { value: 8, message: "Password must be at least 8 characters." },
              maxLength: { value: 72, message: "Password must be 72 characters or fewer." },
            })}
          />
          {errors.password && <div className="ferr">{errors.password.message}</div>}
        </div>

        {resetPassword.isError && <div className="auth-err">{authErrorMessage(resetPassword.error)}</div>}

        <button type="submit" disabled={resetPassword.isPending} className="big" style={{ width: "100%", opacity: resetPassword.isPending ? 0.7 : 1 }}>
          {resetPassword.isPending ? "Saving…" : "Reset password →"}
        </button>
      </form>

      <div className="auth-alt">
        <Link href="/login">← Back to log in</Link>
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
