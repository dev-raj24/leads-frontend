"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AiPanel } from "@/components/portal/AiPanel";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { getUser } from "@/lib/session";
import type { AuthUser } from "@/types/models";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => setUser(getUser()), []);
  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <div className="ad">
      <div className={`sb-bg ${navOpen ? "open" : ""}`} onClick={() => setNavOpen(false)} />
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} user={user} />
      <div className="ad-main">
        <Topbar onMenu={() => setNavOpen(true)} onAsk={() => setAiOpen(true)} />
        <main className="ad-content">{children}</main>
      </div>
      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
