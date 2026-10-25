"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/session";
import { useTenant } from "@/hooks/tenant/query";

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { data, isLoading, isError } = useTenant();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (authChecked && data && !data.tenant.onboardingCompleted) {
      router.replace("/onboarding/business");
    }
  }, [authChecked, data, router]);

  if (!authChecked) return null;
  if (isLoading) return null;
  if (!isError && data && !data.tenant.onboardingCompleted) return null;

  return <>{children}</>;
}
