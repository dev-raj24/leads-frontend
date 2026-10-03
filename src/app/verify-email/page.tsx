"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { useVerifyEmail } from "@/hooks/auth/mutation";
import { isLoggedIn } from "@/lib/session";

function VerifyEmail() {
  const token = useSearchParams().get("token") ?? "";
  const verify = useVerifyEmail();
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    verify.mutate(token);
  }, [token, verify]);

  const next = isLoggedIn() ? { href: "/dashboard", label: "Go to your dashboard →" } : { href: "/login", label: "Log in →" };

  return (
    <AuthShell>
      {!token && (
        <>
          <h2>Link <em>missing.</em></h2>
          <div className="auth-sub">This confirmation link is incomplete. Open the email we sent you and use the button or link inside it.</div>
        </>
      )}
      {token && verify.isPending && <h2>Confirming your <em>email…</em></h2>}
      {token && verify.isSuccess && (
        <>
          <h2>Email <em>confirmed.</em></h2>
          <div className="auth-sub">You&apos;ll now get an alert the moment a new lead arrives.</div>
          <div className="auth-alt"><Link href={next.href}>{next.label}</Link></div>
        </>
      )}
      {token && verify.isError && (
        <>
          <h2>This link <em>didn&apos;t work.</em></h2>
          <div className="auth-sub">It may have expired or already been used. Log in and we&apos;ll send a fresh one from the banner at the top of your dashboard.</div>
          <div className="auth-alt"><Link href={next.href}>{next.label}</Link></div>
        </>
      )}
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
