"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconInbox, IconSparkle } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { LeadTable } from "@/components/portal/LeadTable";
import { PageHead } from "@/components/portal/PageHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLeads } from "@/hooks/leads/query";
import { getUser } from "@/lib/session";
import { greeting, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { data, isLoading, isError } = useLeads();
  const [handle, setHandle] = useState("");
  useEffect(() => setHandle(getUser()?.email.split("@")[0] ?? ""), []);

  const leads = useMemo(() => data?.leads ?? [], [data]);

  const stats = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return {
      today: leads.filter((l) => new Date(l.createdAt) >= startOfDay).length,
      waiting: leads.filter((l) => l.status === "new").length,
      talking: leads.filter((l) => l.status === "replied").length,
      won: leads.filter((l) => l.status === "won").length,
    };
  }, [leads]);

  const hottest = leads.find((l) => l.status === "new");
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const v = (n: number) => (isLoading ? "–" : n);

  return (
    <>
      <PageHead
        eyebrow={dateLabel}
        title={<>{greeting()}{handle && <>, <em>{handle}.</em></>}</>}
        sub={
          isLoading || isError
            ? "Here's your workspace at a glance."
            : stats.waiting > 0
              ? `${stats.waiting} new ${stats.waiting === 1 ? "lead is" : "leads are"} waiting for you.`
              : "You're all caught up — no new leads waiting."
        }
      />

      <div className="kpis">
        <div className="kpi f"><div className="kpi-l">Today</div><div className="kpi-v">{v(stats.today)}</div><div className="kpi-d">new enquiries</div></div>
        <div className="kpi"><div className="kpi-l">Waiting</div><div className="kpi-v">{v(stats.waiting)}</div><div className="kpi-d">not yet replied</div></div>
        <div className="kpi"><div className="kpi-l">In conversation</div><div className="kpi-v">{v(stats.talking)}</div><div className="kpi-d">replied</div></div>
        <div className="kpi"><div className="kpi-l">Won</div><div className="kpi-v">{v(stats.won)}</div><div className="kpi-d">deals closed</div></div>
      </div>

      {hottest && (
        <div className="hot">
          <span className="hot-ic"><IconSparkle size={20} /></span>
          <div className="hot-t">
            <small>Reply first</small>
            <b>{hottest.name ?? hottest.contact}</b>
            {hottest.message ? <> asked &ldquo;{hottest.message}&rdquo;</> : " sent an enquiry"} · {timeAgo(hottest.createdAt)} ago
          </div>
          <Button href={`/leads/${hottest.id}`} variant="ink" size="sm" iconRight={<IconArrowRight size={14} />}>Open</Button>
        </div>
      )}

      <div className="toolbar" style={{ marginTop: 32 }}>
        <div className="sec-t" style={{ margin: 0 }}>Recent leads</div>
        {leads.length > 0 && <Button href="/leads" variant="secondary" size="sm" iconRight={<IconArrowRight size={14} />}>View all</Button>}
      </div>

      {isLoading && (
        <div className="pnl pad"><Skeleton height={18} width="40%" /><Skeleton height={14} width="70%" style={{ marginTop: 14 }} /><Skeleton height={14} width="55%" style={{ marginTop: 14 }} /></div>
      )}
      {isError && <div className="state-err">Couldn&apos;t reach the API — make sure leadworks-api is running and DATABASE_URL is set.</div>}
      {!isLoading && !isError && leads.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconInbox size={26} />}
            title="No leads yet"
            text="Once your widget or form starts capturing enquiries, they'll show up here."
            action={<Button href="/settings">Get your embed code</Button>}
          />
        </div>
      )}
      {!isLoading && !isError && leads.length > 0 && <LeadTable leads={leads.slice(0, 5)} />}
    </>
  );
}
