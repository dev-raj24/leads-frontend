"use client";

// PortalGuard — client-side gate for every (portal) page. There's no
// backend session cookie (frontend and API are different origins), so we
// check for the JWT in localStorage on mount and bounce to /login if it's
// missing. This runs once per portal page load, not per navigation inside
// the portal (Next.js keeps the layout mounted across client nav).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/api";

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
