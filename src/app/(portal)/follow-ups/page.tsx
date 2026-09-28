"use client";

import { useMemo, useState } from "react";
import { IconRefresh, IconSearch } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { FollowupModal } from "@/components/portal/FollowupModal";
import { FollowupTable } from "@/components/portal/FollowupTable";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFollowups } from "@/hooks/followups/query";
import type { Followup, FollowupStatus } from "@/types/models";

const FILTERS: Array<{ key: string; label: string; statuses: FollowupStatus[] | null }> = [
  { key: "all", label: "All", statuses: null },
  { key: "pending", label: "Needs approval", statuses: ["pending"] },
  { key: "scheduled", label: "Scheduled", statuses: ["approved", "processing"] },
  { key: "manual", label: "Send manually", statuses: ["manual"] },
  { key: "done", label: "Done", statuses: ["sent", "cancelled"] },
];

export default function FollowUpsPage() {
  const { data, isLoading, isError } = useFollowups();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openFollowup, setOpenFollowup] = useState<Followup | null>(null);

  const followups = useMemo(() => data?.followups ?? [], [data]);
  const waiting = followups.filter((f) => f.status === "pending" || f.status === "manual").length;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const active = FILTERS.find((f) => f.key === filter);
    return followups
      .filter((f) => !active?.statuses || active.statuses.includes(f.status))
      .filter((f) => !q || f.leadName.toLowerCase().includes(q) || f.leadContact.toLowerCase().includes(q));
  }, [followups, filter, search]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const f of FILTERS) result[f.key] = f.statuses ? followups.filter((x: Followup) => f.statuses!.includes(x.status)).length : followups.length;
    return result;
  }, [followups]);

  return (
    <>
      <PageHead
        eyebrow="Nurture"
        title="Follow-ups"
        sub={isLoading ? "Loading…" : `${waiting} waiting on you. Approve a nudge and it goes out at the scheduled time.`}
      />

      <div className="toolbar">
        <div className="seg" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.key} className={filter === f.key ? "on" : ""} onClick={() => setFilter(f.key)}>
              {f.label}
              <em className="seg-n">{counts[f.key]}</em>
            </button>
          ))}
        </div>
        <label className="search">
          <IconSearch size={15} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or contact" />
        </label>
      </div>

      {isLoading && (
        <div className="pnl pad">{[60, 80, 50, 70].map((w, i) => <Skeleton key={i} height={16} width={`${w}%`} style={{ marginBottom: 18 }} />)}</div>
      )}
      {isError && <div className="state-err">Couldn&apos;t load follow-ups — make sure leadworks-api is running.</div>}

      {!isLoading && !isError && visible.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconRefresh size={26} />}
            title={followups.length === 0 ? "Nothing scheduled" : "Nothing matches"}
            text={followups.length === 0 ? "A follow-up is scheduled automatically for every new lead, and you can add more from a lead's page." : "Try a different filter or search term."}
          />
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && <FollowupTable followups={visible} pageSize={10} onOpen={setOpenFollowup} />}

      {openFollowup && <FollowupModal followup={openFollowup} onClose={() => setOpenFollowup(null)} />}
    </>
  );
}
