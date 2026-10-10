"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RankingsPanel } from "@/components/portal/RankingsPanel";
import { IconLock, IconSearch } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { useStartSeoAudit, useWriteSeoFixes } from "@/hooks/seo/mutation";
import { useSeoAudit, useSeoAudits } from "@/hooks/seo/query";
import { useTenant } from "@/hooks/tenant/query";
import { authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import type { SeoFixPack, SeoIssue, SeoPageReport } from "@/types/models";

const ago = (iso: string) => {
  const t = timeAgo(iso);
  return t === "just now" ? t : `${t} ago`;
};

const tone = (score: number) => (score >= 80 ? "good" : score >= 55 ? "ok" : "bad");
const verdict = (score: number) =>
  score >= 80 ? "Good shape. A few things left to polish." : score >= 55 ? "Fair. Fixing the red items will help most." : "Weak. Search engines have a hard time with this site.";

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" width={132} height={132} role="img" aria-label={`SEO score ${score} out of 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        className={`seo-arc ${tone(score)}`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor">{score}</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--muted)">out of 100</text>
    </svg>
  );
}

const SEVERITY_LABEL = { critical: "FIX FIRST", warning: "SHOULD FIX", info: "NICE TO HAVE" } as const;
const SEVERITY_PILL = { critical: "r", warning: "p", info: "c" } as const;

function IssueRow({ issue }: { issue: SeoIssue }) {
  return (
    <div className="seo-issue">
      <span className={`pp ${SEVERITY_PILL[issue.severity]}`}>{SEVERITY_LABEL[issue.severity]}</span>
      <div>
        <b>{issue.message}</b>
        <p>{issue.fix}</p>
      </div>
    </div>
  );
}

function FixList({ pack }: { pack: SeoFixPack }) {
  if (pack.items.length === 0) return <p className="hint">Nothing needs changing on this page.</p>;
  return (
    <div className="seo-fixes">
      {!pack.aiUsed && <p className="hint">The AI was busy, so only the fixes that don&apos;t need writing are shown. Try again in a minute for titles and descriptions.</p>}
      {pack.items.map((item) => (
        <div key={item.id} className="seo-fix">
          <div className="seo-fix-h">
            <b>{item.label}</b>
            <small>{item.where}</small>
          </div>
          {item.kind === "steps" ? <p className="seo-steps">{item.value}</p> : <CodeSnippet code={item.value} />}
          {item.note && <p className="hint" style={{ margin: "6px 0 0" }}>{item.note}</p>}
        </div>
      ))}
    </div>
  );
}

function PageCard({ page, auditId, pack, writing, onWrite }: { page: SeoPageReport; auditId: string; pack?: SeoFixPack; writing: boolean; onWrite: (url: string) => void }) {
  const [open, setOpen] = useState(page.issues.some((i) => i.severity === "critical"));
  const path = (() => {
    try {
      const u = new URL(page.url);
      return u.pathname + u.search || "/";
    } catch {
      return page.url;
    }
  })();
  return (
    <div className="pnl seo-page" data-audit={auditId}>
      <button type="button" className="seo-page-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={`seo-dot ${tone(page.score)}`}>{page.score}</span>
        <span className="seo-page-t">
          <strong>{page.title || path}</strong>
          <small>{path} · {page.issues.length === 0 ? "no problems" : `${page.issues.length} to look at`}{pack ? " · fixes ready" : ""}</small>
        </span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="seo-page-b">
          {page.issues.length === 0 && <p className="hint">Nothing to fix on this page.</p>}
          {page.issues.map((i) => <IssueRow key={i.id} issue={i} />)}
          {page.issues.length > 0 && !pack && (
            <div style={{ paddingTop: 12 }}>
              <Button size="sm" loading={writing} loadingText="Writing the fixes…" onClick={() => onWrite(page.url)}>Write the fixes for this page</Button>
            </div>
          )}
          {pack && (
            <>
              <div className="sec-t" style={{ marginTop: 18 }}>Ready-made fixes. Copy and paste.</div>
              <FixList pack={pack} />
              <div style={{ paddingTop: 10 }}>
                <Button size="sm" variant="secondary" loading={writing} loadingText="Writing again…" onClick={() => onWrite(page.url)}>Write them again</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function WebsiteCheck() {
  const { data: list } = useSeoAudits();
  const start = useStartSeoAudit();
  const writeFixes = useWriteSeoFixes();
  const [writingUrl, setWritingUrl] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const [url, setUrl] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: active } = useSeoAudit(activeId);

  const audits = list?.audits ?? [];

  useEffect(() => {
    if (!url && list?.suggestedUrl) setUrl(list.suggestedUrl);
  }, [list?.suggestedUrl, url]);

  useEffect(() => {
    if (!activeId && audits[0]) setActiveId(audits[0].id);
  }, [audits, activeId]);

  const audit = active?.audit;
  const report = audit?.result ?? null;
  const running = audit?.status === "running" || start.isPending;

  useEffect(() => {
    if (audit?.status === "done" || audit?.status === "failed") start.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audit?.status]);

  const previous = useMemo(() => audits.find((a) => a.id !== audit?.id && a.status === "done" && a.score !== null && audit && a.createdAt < audit.createdAt), [audits, audit]);
  const biggest = useMemo(() => {
    if (!report) return [];
    const groups = new Map<string, { issue: SeoIssue; pages: number; total: number }>();
    for (const page of report.pages) {
      for (const issue of page.issues) {
        const g = groups.get(issue.id) ?? { issue, pages: 0, total: 0 };
        g.pages += 1;
        g.total += issue.points;
        groups.set(issue.id, g);
      }
    }
    return [...groups.values()].sort((a, b) => b.total - a.total).slice(0, 5);
  }, [report]);
  const fixes = audit?.fixes ?? {};

  async function writeOne(url: string) {
    if (!audit) return;
    setWritingUrl(url);
    try {
      await writeFixes.mutateAsync({ id: audit.id, url });
    } finally {
      setWritingUrl(null);
    }
  }

  async function writeAll() {
    if (!audit || !report) return;
    const todo = report.pages.filter((p) => p.issues.length > 0 && !fixes[p.url]);
    setBulk({ done: 0, total: todo.length });
    for (const [i, page] of todo.entries()) {
      try {
        await writeFixes.mutateAsync({ id: audit.id, url: page.url });
      } catch {
        break;
      }
      setBulk({ done: i + 1, total: todo.length });
    }
    setBulk(null);
  }

  const pagesToFix = report ? report.pages.filter((p) => p.issues.length > 0 && !fixes[p.url]).length : 0;
  const delta = audit?.score != null && previous?.score != null ? audit.score - previous.score : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    start.mutate(url.trim(), { onSuccess: (res) => setActiveId(res.audit.id) });
  }

  return (
    <>
      <form className="pnl pad seo-form" onSubmit={submit}>
        <label className="field" style={{ margin: 0, flex: 1, minWidth: 220 }}>
          <span className="flabel">Your website address</span>
          <input className="finput" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourshop.com" inputMode="url" autoComplete="url" />
        </label>
        <Button type="submit" icon={<IconSearch size={15} />} loading={running} loadingText="Scanning…" disabled={!url.trim()}>
          Scan my website
        </Button>
      </form>
      {start.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(start.error)}</div>}

      {audit?.status === "running" && (
        <div className="pnl pad" style={{ marginTop: 18 }}>
          <b>Scanning {audit.url}</b>
          <p className="hint" style={{ margin: "6px 0 0" }}>We read the home page and up to nine pages it links to. This takes about half a minute.</p>
        </div>
      )}
      {audit?.status === "failed" && <div className="state-err" style={{ marginTop: 18 }}>The scan didn&apos;t finish: {audit.error ?? "unknown problem"}.</div>}

      {audit?.status === "done" && report && (
        <>
          <div className="pnl pad seo-hero" style={{ marginTop: 18 }}>
            <ScoreRing score={report.score} />
            <div className="seo-hero-t">
              <h2>{verdict(report.score)}</h2>
              <p className="hint" style={{ margin: "0 0 12px" }}>
                {audit.url} · {report.pages.length} {report.pages.length === 1 ? "page" : "pages"} scanned · {ago(audit.createdAt)}
                {delta !== null && delta !== 0 && <> · <b style={{ color: delta > 0 ? "var(--primary)" : "var(--red)" }}>{delta > 0 ? `+${delta}` : delta} since last scan</b></>}
              </p>
              <div className="seo-counts">
                <span className="pp r">{report.counts.critical} FIX FIRST</span>
                <span className="pp p">{report.counts.warning} SHOULD FIX</span>
                <span className="pp c">{report.counts.info} NICE TO HAVE</span>
                <span className="pp w">{report.counts.passedChecks} CHECKS PASSED</span>
              </div>
            </div>
          </div>

          {report.pages.some((p) => p.jsRendered) && (
            <div className="notice warn" style={{ marginTop: 18 }}>
              <span>
                <b>Your pages build their content in the browser.</b> A search engine that does not run JavaScript sees an almost empty page, so it cannot read your headings, text or links.
                Ask your developer to send the real content in the page source (server-side rendering). Open the fix for a page below for the exact steps.
              </span>
            </div>
          )}

          {audit.aiPlan ? (
            <>
              <div className="sec-t">Do these first</div>
              <div className="pnl pad seo-plan">{audit.aiPlan}</div>
            </>
          ) : (
            biggest.length > 0 && (
              <>
                <div className="sec-t">Biggest wins</div>
                <div className="pnl pad">
                  {biggest.map((g) => (
                    <div className="seo-issue" key={g.issue.id}>
                      <span className={`pp ${SEVERITY_PILL[g.issue.severity]}`}>{g.pages} {g.pages === 1 ? "PAGE" : "PAGES"}</span>
                      <div>
                        <b>{g.issue.message}</b>
                        <p>{g.issue.fix}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}

          {report.siteIssues.length > 0 && (
            <>
              <div className="sec-t">Whole site</div>
              <div className="pnl pad">{report.siteIssues.map((i) => <IssueRow key={i.id} issue={i} />)}</div>
            </>
          )}

          <div className="sec-t" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span>Page by page</span>
            {pagesToFix > 0 && (
              <Button size="sm" loading={!!bulk} loadingText={bulk ? `Writing fixes ${bulk.done} of ${bulk.total}…` : "Writing…"} onClick={writeAll}>
                Write the fixes for all {pagesToFix} {pagesToFix === 1 ? "page" : "pages"}
              </Button>
            )}
          </div>
          {writeFixes.isError && <div className="auth-err" style={{ marginBottom: 10 }}>{authErrorMessage(writeFixes.error)}</div>}
          <div style={{ display: "grid", gap: 10 }}>
            {[...report.pages].sort((a, b) => a.score - b.score).map((p) => (
              <PageCard key={p.url} page={p} auditId={audit.id} pack={fixes[p.url]} writing={writingUrl === p.url || (!!bulk && !fixes[p.url] && p.issues.length > 0 && writeFixes.isPending)} onWrite={writeOne} />
            ))}
          </div>

          <p className="hint" style={{ marginTop: 18 }}>
            This checks what is on your pages. It does not show where you rank on Google for a keyword, because that needs Google&apos;s own data.
          </p>
        </>
      )}

      {audits.length > 1 && (
        <>
          <div className="sec-t">Earlier scans</div>
          <div className="pnl">
            {audits.map((a) => (
              <button key={a.id} type="button" className={`seo-hist ${a.id === activeId ? "on" : ""}`} onClick={() => setActiveId(a.id)}>
                <span>{a.url}</span>
                <span className="ago">{ago(a.createdAt)}</span>
                <span className={`pp ${a.status === "done" ? "w" : a.status === "failed" ? "r" : "n"}`}>{a.status === "done" ? `${a.score}/100` : a.status.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function SeoTabs() {
  const params = useSearchParams();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const [tab, setTab] = useState<"check" | "rankings">(params.get("tab") === "rankings" ? "rankings" : "check");

  if (tenantData && !isPro) {
    return (
      <>
        <PageHead eyebrow="Growth" title={<>SEO <em>check</em></>} sub="See how search engines read your website and what to fix first." />
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="The SEO check is a Pro feature"
            text="Scan your website, get a score out of 100, ready-made fixes, and see the real searches that find you on Google."
            action={<Button href="/account">View plans</Button>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead eyebrow="Growth" title={<>SEO <em>check</em></>} sub="Fix what is holding your website back, and see how Google actually shows it." />
      <div className="seg" role="tablist" style={{ marginBottom: 20 }}>
        <button role="tab" aria-selected={tab === "check"} className={tab === "check" ? "on" : ""} onClick={() => setTab("check")}>Website check</button>
        <button role="tab" aria-selected={tab === "rankings"} className={tab === "rankings" ? "on" : ""} onClick={() => setTab("rankings")}>Google rankings</button>
      </div>
      {tab === "check" ? <WebsiteCheck /> : <RankingsPanel justConnected={params.get("connected") === "1"} returnedError={params.get("error")} />}
    </>
  );
}

export default function SeoPage() {
  return (
    <Suspense fallback={null}>
      <SeoTabs />
    </Suspense>
  );
}
