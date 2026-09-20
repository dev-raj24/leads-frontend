"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import {
  IconBlog,
  IconChat,
  IconHome,
  IconLogout,
  IconRefresh,
  IconSettings,
  IconTag,
  IconUsers,
} from "@/components/icons";
import { useFollowups } from "@/hooks/followups/query";
import { useLeads } from "@/hooks/leads/query";
import { clearSession } from "@/lib/session";
import type { AuthUser } from "@/types/models";

interface NavItem {
  href: string;
  label: string;
  icon: typeof IconHome;
  badge?: number;
}

export function Sidebar({ open, onNavigate, user }: { open: boolean; onNavigate: () => void; user: AuthUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: leads } = useLeads();
  const { data: followups } = useFollowups();

  const newLeads = leads?.leads.filter((l) => l.status === "new").length ?? 0;
  const openFollowups = followups?.followups.filter((f) => f.status === "pending" || f.status === "manual").length ?? 0;

  const groups: Array<{ title: string; items: NavItem[] }> = [
    { title: "Overview", items: [{ href: "/dashboard", label: "Dashboard", icon: IconHome }] },
    {
      title: "Inbox",
      items: [
        { href: "/leads", label: "Leads", icon: IconUsers, badge: newLeads },
        { href: "/follow-ups", label: "Follow-ups", icon: IconRefresh, badge: openFollowups },
      ],
    },
    {
      title: "Growth",
      items: [
        { href: "/offers", label: "Offers", icon: IconTag },
        { href: "/blog", label: "AI Blog", icon: IconBlog },
        { href: "/ai-widget", label: "Chat widget", icon: IconChat },
      ],
    },
    { title: "Workspace", items: [{ href: "/settings", label: "Settings", icon: IconSettings }] },
  ];

  const logout = () => {
    clearSession();
    queryClient.clear();
    router.push("/login");
  };

  const email = user?.email ?? "";

  return (
    <aside className={`sb ${open ? "open" : ""}`}>
      <div className="sb-brand"><Logo size={30} tone="light" /></div>

      <nav className="sb-nav" aria-label="Main">
        {groups.map((group) => (
          <div key={group.title} className="sb-group">
            <div className="sb-title">{group.title}</div>
            {group.items.map(({ href, label, icon: Icon, badge }) => (
              <Link key={href} href={href} onClick={onNavigate} className={`sb-link ${pathname?.startsWith(href) ? "on" : ""}`}>
                <Icon size={18} />
                <span>{label}</span>
                {badge ? <b>{badge}</b> : null}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-user">
        <span className="sb-av">{(email[0] ?? "?").toUpperCase()}</span>
        <div className="sb-user-t">
          <strong>{email.split("@")[0] || "Account"}</strong>
          <small>{user?.role === "staff" ? "Staff" : "Owner"} · Pro plan</small>
        </div>
        <button className="sb-out" onClick={logout} aria-label="Log out" title="Log out"><IconLogout size={17} /></button>
      </div>
    </aside>
  );
}
