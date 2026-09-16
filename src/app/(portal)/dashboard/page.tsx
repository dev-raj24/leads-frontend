"use client";

import { useMemo } from "react";
import Link from "next/link";
import { IconSparkle, IconGlobe, IconWhatsapp } from "@/components/icons";
import { useLeads } from "@/hooks/leads/query";
import { timeAgo, statusLabel, sourceLabel } from "@/lib/format";

const sourceIcon: Record<string, typeof IconGlobe> = {
  form: IconGlobe,
  whatsapp: IconWhatsapp,
  chat_widget: IconGlobe,
  missed_call: IconGlobe,
};

export default function DashboardPage() {
  const { data, isLoading: loading, isError: error } = useLeads();
  const leads = data?.leads ?? [];

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = leads.filter((l) => new Date(l.createdAt) >= today).length;
    const pending = leads.filter((l) => l.status === "new" || l.status === "replied").length;
    const won = leads.filter((l) => l.status === "won").length;
    return { todayCount, pending, won };
  }, [leads]);

  const hottest = leads.find((l) => l.status === "new");
  const recent = leads.slice(0, 5);

  return (
    <>
      <div className="p-mh">
        <span className="p-mt">
          Home<em>here&apos;s today at a glance</em>
        </span>
      </div>

      <div className="p-sts">
        <div className="p-st f"><div className="p-sl">TODAY</div><div className="p-sv">{loading ? "—" : stats.todayCount}</div></div>
        <div className="p-st"><div className="p-sl">PENDING</div><div className="p-sv">{loading ? "—" : stats.pending}</div></div>
        <div className="p-st"><div className="p-sl">WON</div><div className="p-sv">{loading ? "—" : stats.won}</div></div>
      </div>

      {hottest && (
        <div className="p-card" style={{ padding: 16, marginBottom: 16, background: "#F5F8FF", borderColor: "#14161A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
            <IconSparkle size={16} /> AI note
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: "#475467" }}>
            <b style={{ color: "#14161A" }}>{hottest.name ?? hottest.contact}</b> is a new lead
            {hottest.message ? <> — asked: &quot;{hottest.message}&quot;</> : null}, {timeAgo(hottest.createdAt)} ago.{" "}
            <Link href={`/leads/${hottest.id}`} style={{ color: "#155EEF", fontWeight: 800 }}>Open it →</Link>
          </div>
        </div>
      )}

      {loading && <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>Loading…</div>}

      {!loading && error && (
        <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#D92D20" }}>
          Couldn&apos;t reach the API — make sure leadworks-api is running and DATABASE_URL is set.
        </div>
      )}

      {!loading && !error && recent.length === 0 && (
        <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>
          No leads yet — once your widget/form starts capturing enquiries, they&apos;ll show up here.
        </div>
      )}

      {!loading && !error && recent.length > 0 && (
        <div className="p-card">
          <div className="p-rw h"><span>Lead</span><span>Source</span><span>Status</span><span style={{ textAlign: "right" }}>Time</span></div>
          {recent.map((lead, i) => {
            const SourceIcon = sourceIcon[lead.source] ?? IconGlobe;
            const [label, cls] = statusLabel(lead.status);
            return (
              <Link key={lead.id} href={`/leads/${lead.id}`} className={`p-rw ${i === 0 ? "hl" : ""}`}>
                <div><div className="p-nm">{lead.name ?? lead.contact}</div><div className="p-ms">{lead.message ?? "—"}</div></div>
                <span className="p-src"><SourceIcon size={15} />{sourceLabel(lead.source)}</span>
                <span className={`pp ${cls}`}>{label}</span>
                <span className="p-tm">{timeAgo(lead.createdAt)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
