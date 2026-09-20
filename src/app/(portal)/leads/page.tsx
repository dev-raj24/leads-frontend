"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconInbox, IconPlus, IconSearch } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { LeadTable } from "@/components/portal/LeadTable";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLeads } from "@/hooks/leads/query";
import { apiErrorCode } from "@/lib/errors";
import LeadImportModal from "./LeadImportModal";
import { Button } from "@/components/ui/Button";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "replied", label: "Replied" },
  { key: "won", label: "Won" },
  { key: "closed", label: "Closed" },
];

function LeadsContent() {
  const params = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState(params.get("q") ?? "");
  useEffect(() => setSearch(params.get("q") ?? ""), [params]);
  const [showImport, setShowImport] = useState(false);
  const { data, isLoading, error, refetch } = useLeads();

  const leads = useMemo(() => data?.leads ?? [], [data]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => filter === "all" || l.status === filter)
      .filter(
        (l) =>
          !q ||
          (l.name ?? "").toLowerCase().includes(q) ||
          l.contact.toLowerCase().includes(q) ||
          (l.message ?? "").toLowerCase().includes(q)
      );
  }, [leads, filter, search]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: leads.length };
    for (const l of leads) result[l.status] = (result[l.status] ?? 0) + 1;
    for (const f of FILTERS) result[f.key] ??= 0;
    return result;
  }, [leads]);

  const errCode = error ? apiErrorCode(error) ?? "network_error" : null;

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Leads"
        sub={isLoading ? "Loading your enquiries…" : `${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"} across every source.`}
        actions={<Button icon={<IconPlus size={15} />} onClick={() => setShowImport(true)}>Import leads</Button>}
      />

      {showImport && (
        <LeadImportModal
          onClose={() => setShowImport(false)}
          onImported={() => {
            setShowImport(false);
            refetch();
          }}
        />
      )}

      <div className="toolbar">
        <div className="seg" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.key} className={filter === f.key ? "on" : ""} onClick={() => setFilter(f.key)}>
              {f.label}
              {counts[f.key] !== undefined && <em className="seg-n">{counts[f.key]}</em>}
            </button>
          ))}
        </div>
        <label className="search">
          <IconSearch size={15} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, contact, message" />
        </label>
      </div>

      {isLoading && (
        <div className="pnl pad">{[60, 80, 50, 70].map((w, i) => <Skeleton key={i} height={16} width={`${w}%`} style={{ marginBottom: 18 }} />)}</div>
      )}
      {!isLoading && errCode && (
        <div className="state-err">
          {errCode === "database_not_configured"
            ? "The backend has no database configured yet — see leadworks-api/.env.example."
            : "Couldn't reach the API. Make sure leadworks-api is running."}
        </div>
      )}
      {!isLoading && !errCode && visible.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconInbox size={26} />}
            title={leads.length === 0 ? "No leads yet" : "Nothing matches"}
            text={leads.length === 0 ? "Once your site's widget or form sends enquiries — or you import a sheet — they'll show up here." : "Try a different filter or search term."}
            action={leads.length === 0 ? <Button icon={<IconPlus size={15} />} onClick={() => setShowImport(true)}>Import leads</Button> : undefined}
          />
        </div>
      )}
      {!isLoading && !errCode && visible.length > 0 && <LeadTable leads={visible} pageSize={10} />}
    </>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsContent />
    </Suspense>
  );
}
