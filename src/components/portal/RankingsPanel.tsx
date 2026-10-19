"use client";

import { useMemo, useState } from "react";
import { IconChart } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { BarChart } from "@/components/ui/BarChart";
import { Button } from "@/components/ui/Button";
import { Table, type Column } from "@/components/ui/Table";
import { useChooseScProperty, useConnectSc, useDisconnectSc, useRefreshScPerformance } from "@/hooks/searchConsole/mutation";
import { useScPerformance, useScProperties, useScRankTrend, useScStatus } from "@/hooks/searchConsole/query";
import { apiErrorCode, authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import type { RankTrendKeyword, SearchMetrics } from "@/types/models";

const RANGES = [7, 28, 90];
const nf = (n: number) => n.toLocaleString("en-IN");

function change(now: number, before: number, lowerIsBetter = false) {
  if (before === 0 && now === 0) return null;
  const diff = now - before;
  if (diff === 0) return { text: "no change", good: null as boolean | null };
  const pct = before === 0 ? null : Math.round((Math.abs(diff) / before) * 100);
  const sign = diff > 0 ? "+" : "−";
  return { text: pct === null ? `${sign}${nf(Math.abs(diff))}` : `${sign}${pct}%`, good: lowerIsBetter ? diff < 0 : diff > 0 };
}

function Kpi({ label, value, delta, hint }: { label: string; value: string; delta: ReturnType<typeof change>; hint?: string }) {
  return (
    <div className="stat">
      <div className="stat-top"><span className="stat-l">{label}</span></div>
      <div className="stat-v">{value}</div>
      <div className="stat-foot">
        {delta && <span className={`trend ${delta.good === null ? "" : delta.good ? "up" : "down"}`}>{delta.text}</span>}
        <span className="stat-h">{hint ?? "vs the period before"}</span>
      </div>
    </div>
  );
}

const positionLabel = (p: number) => (p <= 3 ? "Top 3" : p <= 10 ? "Page 1" : p <= 20 ? "Page 2" : "Page 3+");

function MovementRow({ keyword }: { keyword: RankTrendKeyword }) {
  const improved = keyword.change > 0.4;
  const declined = keyword.change < -0.4;
  return (
    <div className="seo-issue">
      <span className={`pp ${improved ? "w" : declined ? "r" : "n"}`}>
        {improved ? `UP ${keyword.change.toFixed(1)}` : declined ? `DOWN ${Math.abs(keyword.change).toFixed(1)}` : "STEADY"}
      </span>
      <div>
        <b>{keyword.query}</b>
        <p>
          Was {keyword.earliest.toFixed(1)} ({positionLabel(keyword.earliest)}) on {keyword.points[0].date} · now {keyword.latest.toFixed(1)} ({positionLabel(keyword.latest)})
        </p>
      </div>
    </div>
  );
}

/** How tracked keywords moved over the last N days — the thing an owner actually wants: "are we climbing Google?" */
function RankMovement({ ready }: { ready: boolean }) {
  const { data, isLoading } = useScRankTrend(30, ready);
  const keywords = data?.keywords ?? [];
  if (!ready || isLoading) return null;
  if (keywords.length === 0) {
    return (
      <div className="pnl pad hint" style={{ marginBottom: 18 }}>
        Movement over time shows up here once we have a few days of history for your keywords — check back tomorrow.
      </div>
    );
  }
  const improving = keywords.filter((k) => k.change > 0.4);
  const slipping = [...keywords].filter((k) => k.change < -0.4).sort((a, b) => a.change - b.change);
  return (
    <>
      <div className="sec-t">Climbing Google (last 30 days)</div>
      <div className="pnl pad" style={{ marginBottom: 18 }}>
        {improving.length === 0 ? (
          <p className="hint">No keyword has moved up yet. Fixing SEO issues and getting more clicks helps this over a few weeks.</p>
        ) : (
          improving.slice(0, 8).map((k) => <MovementRow key={k.query} keyword={k} />)
        )}
      </div>
      {slipping.length > 0 && (
        <>
          <div className="sec-t">Slipping</div>
          <div className="pnl pad" style={{ marginBottom: 18 }}>
            {slipping.slice(0, 6).map((k) => <MovementRow key={k.query} keyword={k} />)}
          </div>
        </>
      )}
    </>
  );
}

export function RankingsPanel({ justConnected, returnedError }: { justConnected: boolean; returnedError: string | null }) {
  const { data: statusData, isLoading } = useScStatus();
  const status = statusData?.status;
  const connect = useConnectSc();
  const choose = useChooseScProperty();
  const disconnect = useDisconnectSc();
  const refresh = useRefreshScPerformance();
  const [days, setDays] = useState(28);
  const [picked, setPicked] = useState("");

  const ready = !!status?.connected && !!status.property && !status.needsReconnect;
  const needsProperty = !!status?.connected && !status.property && !status.needsReconnect;
  const { data: propertiesData, error: propertiesError } = useScProperties(needsProperty);
  const { data: perfData, isLoading: perfLoading, error: perfError } = useScPerformance(days, ready);
  const perf = perfData?.performance;

  const opportunities = useMemo(
    () => (perf?.queries ?? []).filter((q) => q.position > 10 && q.position <= 20 && q.impressions >= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 6),
    [perf],
  );

  const queryColumns: Column<SearchMetrics & { query: string }>[] = [
    { key: "q", header: "Search", width: "minmax(0, 2fr)", sort: (r) => r.query, cell: (r) => <span className="seo-q">{r.query}</span> },
    { key: "pos", header: "Position", width: "110px", align: "right", sort: (r) => r.position, cell: (r) => <span>{r.position.toFixed(1)} <small className="hint">{positionLabel(r.position)}</small></span> },
    { key: "clicks", header: "Clicks", width: "80px", align: "right", sort: (r) => r.clicks, cell: (r) => nf(r.clicks) },
    { key: "imp", header: "Shown", width: "90px", align: "right", hideOnMobile: true, sort: (r) => r.impressions, cell: (r) => nf(r.impressions) },
    { key: "ctr", header: "CTR", width: "70px", align: "right", hideOnMobile: true, sort: (r) => r.ctr, cell: (r) => `${r.ctr}%` },
  ];
  const pageColumns: Column<SearchMetrics & { page: string }>[] = [
    { key: "p", header: "Page", width: "minmax(0, 2fr)", sort: (r) => r.page, cell: (r) => <span className="seo-q">{r.page.replace(/^https?:\/\/[^/]+/, "") || "/"}</span> },
    { key: "pos", header: "Position", width: "110px", align: "right", sort: (r) => r.position, cell: (r) => r.position.toFixed(1) },
    { key: "clicks", header: "Clicks", width: "80px", align: "right", sort: (r) => r.clicks, cell: (r) => nf(r.clicks) },
    { key: "imp", header: "Shown", width: "90px", align: "right", hideOnMobile: true, sort: (r) => r.impressions, cell: (r) => nf(r.impressions) },
  ];

  if (isLoading || !status) return null;

  if (!status.configured) {
    return (
      <div className="pnl">
        <EmptyState icon={<IconChart size={26} />} title="Google connection isn't switched on yet" text="This server doesn't have Google sign-in keys. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the backend settings, then come back." />
      </div>
    );
  }

  const reconnect = status.needsReconnect || apiErrorCode(perfError) === "google_access_revoked";

  return (
    <>
      {justConnected && needsProperty && <div className="notice warn" style={{ marginBottom: 14 }}>Google is connected. Choose which website to show below.</div>}
      {returnedError && <div className="state-err" style={{ marginBottom: 14 }}>We couldn&apos;t finish connecting to Google. Please try again.</div>}

      {(!status.connected || reconnect) && (
        <div className="pnl pad">
          <h3 style={{ margin: "0 0 6px" }}>{reconnect ? "Connect Google again" : "See where you show up on Google"}</h3>
          <p className="hint" style={{ margin: "0 0 14px" }}>
            {reconnect
              ? "Google access was withdrawn or expired."
              : "Connect your Google Search Console and we show the real searches that bring people to your site, how many clicked, and where you rank. We only get read access."}
          </p>
          <Button loading={connect.isPending} loadingText="Opening Google…" onClick={() => connect.mutate()}>Connect Google Search Console</Button>
          {connect.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(connect.error)}</div>}
          <p className="hint" style={{ marginTop: 14 }}>You need to have your website added in Search Console first. If it isn&apos;t, add and verify it there, then come back.</p>
        </div>
      )}

      {needsProperty && (
        <div className="pnl pad">
          <h3 style={{ margin: "0 0 6px" }}>Which website?</h3>
          <p className="hint" style={{ margin: "0 0 12px" }}>Connected as {status.email ?? "your Google account"}.</p>
          {propertiesError && <div className="auth-err">{authErrorMessage(propertiesError)}</div>}
          {propertiesData && propertiesData.properties.length === 0 && (
            <p className="hint">This Google account has no verified website in Search Console. Add yours at search.google.com/search-console, verify it, then reload this page.</p>
          )}
          <div style={{ display: "grid", gap: 8 }}>
            {(propertiesData?.properties ?? []).map((p) => (
              <label key={p.siteUrl} className="seo-prop">
                <input type="radio" name="property" value={p.siteUrl} checked={picked === p.siteUrl} onChange={() => setPicked(p.siteUrl)} />
                <span>{p.siteUrl}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Button disabled={!picked} loading={choose.isPending} loadingText="Saving…" onClick={() => choose.mutate(picked)}>Show this website</Button>
          </div>
          {choose.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(choose.error)}</div>}
        </div>
      )}

      {ready && (
        <>
          <div className="toolbar">
            <div className="seg" role="tablist">
              {RANGES.map((r) => (
                <button key={r} className={days === r ? "on" : ""} onClick={() => setDays(r)}>Last {r} days</button>
              ))}
            </div>
            <span className="hint">{status.property}</span>
          </div>

          {perfLoading && <div className="pnl pad">Loading your Google numbers…</div>}
          {perfError && !reconnect && <div className="state-err">{authErrorMessage(perfError)}</div>}

          {perf && (
            <>
              <div className="grid stats" style={{ marginBottom: 18 }}>
                <div className="g-3"><Kpi label="Clicks" value={nf(perf.totals.clicks)} delta={change(perf.totals.clicks, perf.previous.clicks)} /></div>
                <div className="g-3"><Kpi label="Times shown" value={nf(perf.totals.impressions)} delta={change(perf.totals.impressions, perf.previous.impressions)} /></div>
                <div className="g-3"><Kpi label="Click rate" value={`${perf.totals.ctr}%`} delta={change(perf.totals.ctr, perf.previous.ctr)} /></div>
                <div className="g-3"><Kpi label="Average position" value={perf.totals.position ? perf.totals.position.toFixed(1) : "–"} delta={change(perf.totals.position, perf.previous.position, true)} hint="lower is better" /></div>
              </div>

              <div className="pnl pad" style={{ marginBottom: 18 }}>
                <div className="sec-t" style={{ marginTop: 0 }}>Clicks from Google, per day</div>
                <BarChart data={perf.daily.map((d) => ({ label: d.date.slice(5), value: d.clicks }))} primaryLabel="Clicks" />
              </div>

              {opportunities.length > 0 && (
                <>
                  <div className="sec-t">Close to page 1</div>
                  <div className="pnl pad" style={{ marginBottom: 18 }}>
                    <p className="hint" style={{ margin: "0 0 10px" }}>People searched for these and saw you on page 2. A better title or a fuller page can move them up.</p>
                    {opportunities.map((q) => (
                      <div key={q.query} className="seo-issue">
                        <span className="pp p">POS {q.position.toFixed(0)}</span>
                        <div><b>{q.query}</b><p>{nf(q.impressions)} times shown, {nf(q.clicks)} clicks</p></div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <RankMovement ready={ready} />

              <div className="sec-t">What people searched</div>
              {perf.queries.length === 0 ? (
                <div className="pnl pad hint">No searches yet in this period. New sites take a few weeks to show up. Google data is also about two days behind.</div>
              ) : (
                <Table columns={queryColumns} rows={perf.queries} rowKey={(r) => r.query} pageSize={10} itemLabel="searches" defaultSort={{ key: "clicks", dir: "desc" }} />
              )}

              {perf.pages.length > 0 && (
                <>
                  <div className="sec-t">Your pages on Google</div>
                  <Table columns={pageColumns} rows={perf.pages} rowKey={(r) => r.page} pageSize={8} itemLabel="pages" defaultSort={{ key: "clicks", dir: "desc" }} />
                </>
              )}

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 18 }}>
                <span className="hint">Updated {timeAgo(perf.fetchedAt) === "just now" ? "just now" : `${timeAgo(perf.fetchedAt)} ago`} · {perf.startDate} to {perf.endDate}</span>
                <Button size="sm" variant="secondary" loading={refresh.isPending} loadingText="Refreshing…" onClick={() => refresh.mutate(days)}>Refresh</Button>
                <Button size="sm" variant="ghost" loading={disconnect.isPending} onClick={() => disconnect.mutate()}>Disconnect Google</Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
