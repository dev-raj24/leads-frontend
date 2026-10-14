"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { IconLogout } from "@/components/icons";
import { NavIcon, type NavIconName } from "@/components/portal/NavIcons";
import { useChatConversations } from "@/hooks/chatWidget/query";
import { useFollowups } from "@/hooks/followups/query";
import { useLeads } from "@/hooks/leads/query";
import { useTenant } from "@/hooks/tenant/query";
import { clearSession } from "@/lib/session";
import type { AuthUser } from "@/types/models";

interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
  tone: string;
  badge?: number;
}

export function Sidebar({ open, onNavigate, user }: { open: boolean; onNavigate: () => void; user: AuthUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: leads } = useLeads();
  const { data: followups } = useFollowups();
  const { data: tenantData } = useTenant();
  const { data: chats } = useChatConversations();

  const newLeads = leads?.leads.filter((l) => l.status === "new").length ?? 0;
  const chatsWaiting = chats?.conversations.filter((c) => c.needsReply).length ?? 0;
  const openFollowups = followups?.followups.filter((f) => f.status === "pending" || f.status === "manual").length ?? 0;

  const groups: Array<{ title: string; items: NavItem[] }> = [
    { title: "Overview", items: [{ href: "/dashboard", label: "Dashboard", icon: "dashboard", tone: "lilac" }] },
    {
      title: "Inbox",
      items: [
        { href: "/leads", label: "Leads", icon: "leads", tone: "rose", badge: newLeads },
        { href: "/chats", label: "Chats", icon: "chats", tone: "sky", badge: chatsWaiting },
        { href: "/customers", label: "Customers", icon: "customers", tone: "butter" },
        { href: "/follow-ups", label: "Follow-ups", icon: "followups", tone: "peach", badge: openFollowups },
      ],
    },
    {
      title: "Growth",
      items: [
        { href: "/offers", label: "Offers", icon: "offers", tone: "rose" },
        { href: "/blog", label: "AI Blog", icon: "blog", tone: "sky" },
        { href: "/ai-widget", label: "Website chat", icon: "widget", tone: "lilac" },
        { href: "/seo", label: "SEO check", icon: "seo", tone: "mint" },
      ],
    },
    {
      title: "Workspace",
      items: [
        { href: "/settings", label: "Settings", icon: "settings", tone: "grey" },
        { href: "/account", label: "Account", icon: "account", tone: "grey" },
      ],
    },
  ];

  const logout = () => {
    clearSession();
    queryClient.clear();
    router.push("/login");
  };

  const email = user?.email ?? "";

  return (
    <aside className={`sb ${open ? "open" : ""}`}>
      <div className="sb-brand"><Logo size={26} /></div>

      <nav className="sb-nav" aria-label="Main">
        {groups.map((group) => (
          <div key={group.title} className="sb-group">
            <div className="sb-title">{group.title}</div>
            {group.items.map(({ href, label, icon, tone, badge }) => (
              <Link key={href} href={href} onClick={onNavigate} className={`sb-link ${pathname?.startsWith(href) ? "on" : ""}`}>
                <span className={`sb-ic ${tone}`}><NavIcon name={icon} size={22} /></span>
                <span>{label}</span>
                {badge ? <b>{badge}</b> : null}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <Link href="/account" onClick={onNavigate} className={`sb-user ${pathname?.startsWith("/account") ? "on" : ""}`}>
        <span className="sb-av">{(email[0] ?? "?").toUpperCase()}</span>
        <div className="sb-user-t">
          <strong>{email.split("@")[0] || "Account"}</strong>
          <small>
            {user?.role === "staff" ? "Staff" : "Owner"} · {tenantData?.tenant.plan === "pro" ? "Pro plan" : "Free plan"}
          </small>
        </div>
        <button
          className="sb-out"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logout();
          }}
          aria-label="Log out"
          title="Log out"
        >
          <IconLogout size={17} />
        </button>
      </Link>
    </aside>
  );
}
