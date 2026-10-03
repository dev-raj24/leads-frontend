"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AiPanel } from "@/components/portal/AiPanel";
import { LiveWatcher } from "@/components/portal/LiveWatcher";
import { Notices } from "@/components/portal/Notices";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { fetchMeService } from "@/services/auth";
import { getUser, onUserUpdated, setTenant, setUser } from "@/lib/session";
import type { AuthUser } from "@/types/models";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUserState(getUser());
    fetchMeService()
      .then((res) => {
        setUser(res.user);
        setTenant(res.tenant);
      })
      .catch(() => undefined);
    return onUserUpdated(setUserState);
  }, []);
  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <div className="ad">
      <div className={`sb-bg ${navOpen ? "open" : ""}`} onClick={() => setNavOpen(false)} />
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} user={user} />
      <div className="ad-main">
        <Topbar onMenu={() => setNavOpen(true)} onAsk={() => setAiOpen(true)} />
        <main className="ad-content">
          <Notices user={user} />
          {children}
        </main>
      </div>
      <LiveWatcher />
      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
