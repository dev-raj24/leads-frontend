"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconMenu, IconSearch, IconSparkle } from "@/components/icons";
import { Button } from "@/components/ui/Button";

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  chats: "Chats",
  customers: "Customers",
  "follow-ups": "Follow-ups",
  offers: "Offers",
  blog: "AI Blog",
  seo: "SEO check",
  "ai-widget": "Chat widget",
  settings: "Settings",
  account: "Account",
};

export function Topbar({ onMenu, onAsk }: { onMenu: () => void; onAsk: () => void }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [term, setTerm] = useState("");
  const section = pathname.split("/")[1] ?? "";
  const detail = pathname.split("/").length > 2;

  return (
    <header className="tb">
      <Button variant="ghost" iconOnly ariaLabel="Open menu" className="tb-menu" icon={<IconMenu size={20} />} onClick={onMenu} />
      <div className="tb-crumb">
        <span>Leadworks</span>
        <i>/</i>
        <b>{TITLES[section] ?? "Workspace"}</b>
        {detail && (
          <>
            <i>/</i>
            <b>{section === "leads" ? "Lead" : "Details"}</b>
          </>
        )}
      </div>

      <form
        className="tb-search"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(term.trim() ? `/leads?q=${encodeURIComponent(term.trim())}` : "/leads");
        }}
      >
        <IconSearch size={16} />
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search leads by name, contact or message" aria-label="Search leads" />
      </form>

      <Button variant="lime" size="sm" icon={<IconSparkle size={14} />} onClick={onAsk}>Ask AI</Button>
    </header>
  );
}
