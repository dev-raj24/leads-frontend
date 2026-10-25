"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconBolt,
  IconChart,
  IconInbox,
  IconPlus,
  IconRobot,
  IconSparkle,
  IconTrophy,
  IconUsers,
} from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { LeadTable } from "@/components/portal/LeadTable";
import { PageHead } from "@/components/portal/PageHead";
import { SetupChecklist } from "@/components/portal/SetupChecklist";
import { BarChart } from "@/components/ui/BarChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useFollowups } from "@/hooks/followups/query";
import { useLeads } from "@/hooks/leads/query";
import { useStats } from "@/hooks/stats/query";
import { formatDuration, formatPercent, greeting, initials, sourceLabel, statusLabel, timeAgo, trendPercent } from "@/lib/format";
import { getUser } from "@/lib/session";

const RANGES = [7, 14, 30];

const STATUS_COLORS: Record<string, string> = {
  new: "#4f7dff",
  replied: "#f5b942",
  won: "#34c98e",
  closed: "#c4c9dc",
  lost: "#ff6b6b",
};
const SOURCE_COLOR = ["#1f43b8", "#34c98e", "#f5b942", "#0e1630"];

const shortDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function DashboardPage() {
  const [days, setDays] = useState(14);
  const [handle, setHandle] = useState("");
  useEffect(() => setHandle(getUser()?.email.split("@")[0] ?? ""), []);

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useStats(days);
  const { data: leadsData, isLoading: leadsLoading, isError: leadsError } = useLeads();
  const { data: followupData } = useFollowups();

  const stats = statsData?.stats;
  const leads = useMemo(() => leadsData?.leads ?? [], [leadsData]);
  const hottest = leads.find((l) => l.status === "new");
  const dueSoon = (followupData?.followups ?? []).filter((f) => f.status === "pending" || f.status === "manual").slice(0, 4);
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const loading = statsLoading || leadsLoading;

  const chartData = (stats?.daily ?? []).map((d) => ({ label: shortDate(d.date), value: d.leads, secondary: d.won }));
  const statusSlices = (stats?.byStatus ?? []).map((s) => ({ label: statusLabel(s.status)[0].toLowerCase(), value: s.count, color: STATUS_COLORS[s.status] ?? "#a8a396" }));
  const sources = stats?.bySource ?? [];
  const sourceMax = Math.max(1, ...sources.map((s) => s.count));

  return (
    <>
      <PageHead
        eyebrow={dateLabel}
        title={<>{greeting()}{handle && <>, <em>{handle}.</em></>}</>}
        sub={
          loading || statsError || leadsError
            ? "Here's how your leads are doing."
            : stats && stats.totals.waiting > 0
              ? `${stats.totals.waiting} ${stats.totals.waiting === 1 ? "lead is" : "leads are"} waiting for a reply.`
              : "You're all caught up — no leads waiting."
        }
        actions={
          <>
            <div className="range" role="tablist" aria-label="Date range">
              {RANGES.map((r) => (
                <button key={r} className={days === r ? "on" : ""} onClick={() => setDays(r)}>{r} days</button>
              ))}
            </div>
            <Button href="/leads" icon={<IconPlus size={15} />}>Add leads</Button>
          </>
        }
      />

      {(statsError || leadsError) && <div className="state-err" style={{ marginBottom: 18 }}>Couldn&apos;t reach the API — make sure leadworks-api is running.</div>}

      <SetupChecklist />

      <div className="grid stats">
        <div className="g-3">
          <StatCard
            featured
            loading={statsLoading}
            label="Leads this week"
            icon={<IconUsers size={18} />}
            value={stats?.totals.last7Days}
            trend={stats ? trendPercent(stats.totals.last7Days, stats.totals.previous7Days) : undefined}
            trendLabel="vs previous 7 days"
          />
        </div>
        <div className="g-3">
          <StatCard loading={statsLoading} label="Waiting for reply" icon={<IconInbox size={18} />} value={stats?.totals.waiting} hint={`${stats?.totals.today ?? 0} new today`} />
        </div>
        <div className="g-3">
          <StatCard loading={statsLoading} label="Conversion rate" icon={<IconTrophy size={18} />} value={stats ? formatPercent(stats.conversionRate) : undefined} hint={`${stats?.totals.won ?? 0} deals won`} />
        </div>
        <div className="g-3">
          <StatCard
            loading={statsLoading}
            label="Avg first reply"
            icon={<IconBolt size={18} />}
            value={stats ? formatDuration(stats.avgFirstReplySeconds) : undefined}
            hint={`${stats?.aiReplies ?? 0} AI replies in 30 days`}
          />
        </div>
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

      <div className="grid">
        <div className="g-8">
          <Card title="Lead flow" subtitle={`New leads and deals won, last ${days} days`}>
            {statsLoading ? <Skeleton height={240} /> : <BarChart data={chartData} primaryLabel="New leads" secondaryLabel="Won" />}
          </Card>
        </div>
        <div className="g-4">
          <Card title="Pipeline" subtitle="Where your leads are now">
            {statsLoading ? <Skeleton height={240} /> : <DonutChart slices={statusSlices} centerLabel="leads" />}
          </Card>
        </div>
      </div>

      <div className="grid">
        <div className="g-8">
          <Card
            title="Recent leads"
            flush
            action={leads.length > 0 ? <Button href="/leads" variant="secondary" size="sm" iconRight={<IconArrowRight size={14} />}>View all</Button> : undefined}
          >
            {leadsLoading && <div style={{ padding: "8px 22px 22px" }}><Skeleton height={16} width="60%" /><Skeleton height={14} width="80%" style={{ marginTop: 14 }} /></div>}
            {!leadsLoading && leads.length === 0 && (
              <EmptyState
                icon={<IconInbox size={26} />}
                title="No leads yet"
                text="Once your widget or form starts capturing enquiries, they'll show up here."
                action={<Button href="/settings">Get your embed code</Button>}
              />
            )}
            {!leadsLoading && leads.length > 0 && <LeadTable leads={leads.slice(0, 6)} bare />}
          </Card>
        </div>

        <div className="g-4" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card title="Lead sources">
            {statsLoading ? (
              <Skeleton height={100} />
            ) : sources.length === 0 ? (
              <p className="hint" style={{ margin: 0 }}>Sources appear once you get your first lead.</p>
            ) : (
              <div className="bars">
                {sources.map((s, i) => (
                  <div key={s.source} className="bars-r">
                    <span>{sourceLabel(s.source)}</span>
                    <div className="bars-t"><i style={{ width: `${(s.count / sourceMax) * 100}%`, background: SOURCE_COLOR[i % SOURCE_COLOR.length] }} /></div>
                    <b>{s.count}</b>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Follow-ups waiting"
            subtitle={`${stats?.followupsOpen ?? 0} need action`}
            action={<Button href="/follow-ups" variant="ghost" size="sm" iconRight={<IconArrowRight size={14} />}>Open</Button>}
          >
            {dueSoon.length === 0 ? (
              <p className="hint" style={{ margin: 0 }}>Nothing to approve right now.</p>
            ) : (
              <ul className="qlist">
                {dueSoon.map((f) => (
                  <li key={f.id}>
                    <Link href="/follow-ups">
                      <span className="av" style={{ width: 34, height: 34, fontSize: 12.5 }}>{initials(f.leadName)}</span>
                      <div>
                        <strong>{f.leadName}</strong>
                        <small>{f.status === "manual" ? "Send manually" : "Needs approval"}</small>
                      </div>
                      <span className="when">{new Date(f.runAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <div className="who">
              <span className="av" style={{ background: "var(--lime)", color: "var(--primary)" }}><IconRobot size={18} /></span>
              <div className="who-t">
                <strong>AI has your back</strong>
                <small style={{ whiteSpace: "normal" }}>Teach it your services in Settings so replies sound like you.</small>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button href="/settings" variant="secondary" size="sm" icon={<IconChart size={14} />}>Business profile</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
