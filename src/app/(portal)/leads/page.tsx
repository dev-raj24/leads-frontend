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
import { nextStepFor } from "@/lib/format";
import LeadImportModal from "./LeadImportModal";
import { Button } from "@/components/ui/Button";

const FILTERS = [
  { key: "needs", label: "Needs you" },
  { key: "waiting", label: "Waiting on them" },
  { key: "done", label: "Won / closed" },
  { key: "all", label: "All" },
];

const inFilter = (key: string, lead: Parameters<typeof nextStepFor>[0]) => {
  const step = nextStepFor(lead);
  if (key === "needs") return step.needsYou;
  if (key === "waiting") return !step.needsYou && step.key !== "won" && step.key !== "closed";
  if (key === "done") return step.key === "won" || step.key === "closed";
  return true;
};

function LeadsContent() {
  const params = useSearchParams();
  const [filter, setFilter] = useState("needs");
  const [search, setSearch] = useState(params.get("q") ?? "");
  useEffect(() => setSearch(params.get("q") ?? ""), [params]);
  const [showImport, setShowImport] = useState(false);
  const { data, isLoading, error, refetch } = useLeads();

  const leads = useMemo(() => data?.leads ?? [], [data]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => inFilter(filter, l))
      .filter(
        (l) =>
          !q ||
          (l.name ?? "").toLowerCase().includes(q) ||
          l.contact.toLowerCase().includes(q) ||
          (l.message ?? "").toLowerCase().includes(q)
      );
  }, [leads, filter, search]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const f of FILTERS) result[f.key] = leads.filter((l) => inFilter(f.key, l)).length;
    return result;
  }, [leads]);

  const errCode = error ? apiErrorCode(error) ?? "network_error" : null;

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Leads"
        sub={isLoading ? "Loading your enquiries…" : (counts.needs ?? 0) > 0 ? `${counts.needs} ${counts.needs === 1 ? "lead needs" : "leads need"} you right now. Everything else is handled or waiting on the customer.` : "Nobody is waiting on you. New enquiries and replies show up here by themselves."}
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
            title={leads.length === 0 ? "No leads yet" : filter === "needs" && !search.trim() ? "You are all caught up" : "Nothing matches"}
            text={leads.length === 0 ? "Once your site's widget or form sends enquiries — or you import a sheet — they'll show up here." : filter === "needs" && !search.trim() ? "Nothing needs a reply or a call. Check Waiting on them to see who has gone quiet." : "Try a different filter or search term."}
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
