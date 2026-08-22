"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { IconHome, IconUsers, IconChat, IconTag, IconRefresh, IconSettings, IconBlog } from "@/components/icons";
import { clearToken, isLoggedIn } from "@/lib/session";
import { useLeads } from "@/hooks/leads/query";

const items = [
  { href: "/dashboard", label: "Home", icon: IconHome },
  { href: "/leads", label: "Leads", icon: IconUsers },
  { href: "/ai-widget", label: "AI chat widget", icon: IconChat },
  { href: "/blog", label: "AI Blog", icon: IconBlog },
  { href: "/offers", label: "Offers", icon: IconTag },
  { href: "/follow-ups", label: "Follow-ups", icon: IconRefresh, count: 3 },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [leadsCount, setLeadsCount] = useState<number>(0);

  useEffect(() => {
    // Only run if we have a token to avoid unnecessary 401s
    if (typeof window !== "undefined" && window.localStorage.getItem("lw_token")) {
      fetchLeads()
        .then(res => setLeadsCount(res.leads.length))
        .catch(() => {});
    }
  }, []);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <aside className="p-side">
      <div className="p-brand"><Logo size={22} /></div>
      <div className="p-hey">Welcome back, Raj 👋</div>
      {items.map(({ href, label, icon: Icon, count }) => {
        const active = pathname?.startsWith(href);
        const displayCount = href === "/leads" ? leadsCount : count;
        
        return (
          <Link key={href} href={href} className={`p-nav ${active ? "on" : ""}`}>
            <Icon size={17} />
            {label}
            {displayCount ? <span className="cnt">{displayCount}</span> : null}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        style={{
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
          fontSize: 11.5, fontWeight: 700, color: "#98A2B3", padding: "8px 4px", marginTop: 4,
        }}
      >
        Log out
      </button>
      <div className="p-usr">
        <span className="p-av">R</span>
        <span>
          Raj&apos;s Clinic
          <small>Pro plan</small>
        </span>
      </div>
    </aside>
  );
}
