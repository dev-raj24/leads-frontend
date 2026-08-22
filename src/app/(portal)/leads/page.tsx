"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconPlus, IconGlobe, IconWhatsapp, IconChat } from "@/components/icons";
import { ApiError } from "@/utils/apiUtils";
import { useLeads } from "@/hooks/leads/query";
import { timeAgo, statusLabel, sourceLabel } from "@/lib/format";
import LeadImportModal from "./LeadImportModal";

const sourceIcon: Record<string, typeof IconGlobe> = {
  form: IconGlobe,
  whatsapp: IconWhatsapp,
  chat_widget: IconChat,
  missed_call: IconGlobe,
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "replied", label: "Pending" },
  { key: "won", label: "Won" },
];

export default function LeadsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showImport, setShowImport] = useState(false);

  const { data, isLoading: loading, error: queryError, refetch } = useLeads();
  const leads = data?.leads ?? [];
  const error = queryError
    ? queryError instanceof ApiError
      ? (queryError.body as { error?: string })?.error ?? "network_error"
      : "network_error"
    : null;

  const visible = useMemo(() => {
    return leads
      .filter((l) => filter === "all" || l.status === filter)
      .filter((l) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (l.name ?? "").toLowerCase().includes(q) || (l.message ?? "").toLowerCase().includes(q);
      });
  }, [leads, filter, search]);

  return (
    <>
      <div className="p-mh">
        <span className="p-mt">Leads</span>
        <div className="p-tools">
          <span className="p-srch">
            <IconSearch size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads…"
              style={{ border: "none", outline: "none", background: "none", font: "inherit", width: 120 }}
            />
          </span>
          <button className="p-add" onClick={() => setShowImport(true)}>
            <IconPlus size={14} />Import Leads
          </button>
        </div>
      </div>

      {showImport && (
        <LeadImportModal
          onClose={() => setShowImport(false)}
          onImported={() => {
            setShowImport(false);
            refetch();
          }}
        />
      )}

      <div className="p-filts">
        {FILTERS.map((f) => (
          <span key={f.key} className={`p-fl ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)} style={{ cursor: "pointer" }}>
            {f.label}
          </span>
        ))}
      </div>

      {loading && <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>Loading leads…</div>}

      {!loading && error && (
        <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#D92D20" }}>
          {error === "database_not_configured"
            ? "Backend has no database configured yet — see leadworks-api/.env.example."
            : "Couldn't reach the API. Make sure leadworks-api is running."}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="p-card" style={{ padding: 20, fontSize: 13, color: "#98A2B3" }}>
          No leads yet. Once your site's widget or form starts sending enquiries, they'll show up here.
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="p-card">
          <div className="p-rw h"><span>Lead</span><span>Source</span><span>Status</span><span style={{ textAlign: "right" }}>Time</span></div>
          {visible.map((lead, i) => {
            const SourceIcon = sourceIcon[lead.source] ?? IconGlobe;
            const [label, cls] = statusLabel(lead.status);
            return (
              <Link key={lead.id} href={`/leads/${lead.id}`} className={`p-rw ${i === 0 ? "hl" : ""}`}>
                <div>
                  <div className="p-nm">{lead.name ?? lead.contact}</div>
                  <div className="p-ms">{lead.message ?? "—"}</div>
                </div>
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
