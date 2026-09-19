"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { IconSparkle } from "@/components/icons";
import { clearSession, getUser } from "@/lib/session";
import { useLeads } from "@/hooks/leads/query";
import type { AuthUser } from "@/types/models";
import { Button } from "@/components/ui/Button";

const TABS = [
  { href: "/dashboard", label: "Home" },
  { href: "/leads", label: "Leads" },
  { href: "/follow-ups", label: "Follow-ups" },
  { href: "/offers", label: "Offers" },
  { href: "/blog", label: "AI Blog" },
  { href: "/ai-widget", label: "Chat widget" },
  { href: "/settings", label: "Settings" },
];

export function PortalNav({ onOpenAi }: { onOpenAi: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useLeads();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // localStorage isn't available during SSR — read it after mount.
  useEffect(() => setUser(getUser()), []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  function logout() {
    clearSession();
    queryClient.clear();
    router.push("/login");
  }

  const newCount = data?.leads.filter((l) => l.status === "new").length ?? 0;
  const email = user?.email ?? "";

  return (
    <header className="ps-top">
      <div className="ps-top-in">
        <span className="ps-logo-text"><Logo size={31} /></span>

        <nav className="ps-nav" aria-label="Main">
          {TABS.map(({ href, label }) => (
            <Link key={href} href={href} className={`ps-tab ${pathname?.startsWith(href) ? "on" : ""}`}>
              {label}
              {href === "/leads" && newCount > 0 ? <span className="cnt">{newCount}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="ps-right">
          <Button variant="lime" size="sm" icon={<IconSparkle size={14} />} onClick={onOpenAi}>Ask AI</Button>
          <div className="ps-menu" ref={menuRef}>
            <button className="ps-av" onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu">
              {(email[0] ?? "?").toUpperCase()}
            </button>
            {menuOpen && (
              <div className="ps-pop">
                <div className="ps-pop-h">{email || "Signed in"}</div>
                <button onClick={() => router.push("/settings")}>Settings</button>
                <button onClick={logout}>Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
