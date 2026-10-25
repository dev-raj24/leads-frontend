"use client";

import { useMemo, useState } from "react";
import { IconSearch, IconUsers } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { CustomerTable } from "@/components/portal/CustomerTable";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomers } from "@/hooks/customers/query";
import { apiErrorCode } from "@/lib/errors";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "customer", label: "Customers" },
  { key: "lead", label: "Leads only" },
];

export default function CustomersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useCustomers();

  const customers = useMemo(() => data?.customers ?? [], [data]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers
      .filter((c) => filter === "all" || (filter === "customer" ? c.isCustomer : !c.isCustomer))
      .filter((c) => !q || (c.name ?? "").toLowerCase().includes(q) || c.contact.toLowerCase().includes(q));
  }, [customers, filter, search]);

  const counts = useMemo(() => {
    const won = customers.filter((c) => c.isCustomer).length;
    return { all: customers.length, customer: won, lead: customers.length - won };
  }, [customers]);

  const errCode = error ? apiErrorCode(error) ?? "network_error" : null;

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Customers"
        sub={isLoading ? "Loading your customer directory…" : `${customers.length} ${customers.length === 1 ? "contact" : "contacts"} across every enquiry.`}
      />

      <div className="toolbar">
        <div className="seg" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.key} className={filter === f.key ? "on" : ""} onClick={() => setFilter(f.key)}>
              {f.label}
              {counts[f.key as keyof typeof counts] !== undefined && <em className="seg-n">{counts[f.key as keyof typeof counts]}</em>}
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
            icon={<IconUsers size={26} />}
            title={customers.length === 0 ? "No customers yet" : "Nothing matches"}
            text={customers.length === 0 ? "Every contact who enquires shows up here automatically — no setup needed." : "Try a different filter or search term."}
          />
        </div>
      )}
      {!isLoading && !errCode && visible.length > 0 && <CustomerTable customers={visible} pageSize={10} />}
    </>
  );
}
