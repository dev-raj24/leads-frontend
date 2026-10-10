"use client";

import { useEffect, useMemo, useState } from "react";
import { IconLock, IconSearch } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { useStartSeoAudit } from "@/hooks/seo/mutation";
import { useSeoAudit, useSeoAudits } from "@/hooks/seo/query";
import { useTenant } from "@/hooks/tenant/query";
import { authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import type { SeoIssue, SeoPageReport } from "@/types/models";

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

function PageCard({ page }: { page: SeoPageReport }) {
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
    <div className="pnl seo-page">
      <button type="button" className="seo-page-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={`seo-dot ${tone(page.score)}`}>{page.score}</span>
        <span className="seo-page-t">
          <strong>{page.title || path}</strong>
          <small>{path} · {page.issues.length === 0 ? "no problems" : `${page.issues.length} to look at`}</small>
        </span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="seo-page-b">
          {page.issues.length === 0 && <p className="hint">Nothing to fix on this page.</p>}
          {page.issues.map((i) => <IssueRow key={i.id} issue={i} />)}
        </div>
      )}
    </div>
  );
}

export default function SeoPage() {
  const { data: tenantData } = useTenant();
  const { data: list } = useSeoAudits();
  const start = useStartSeoAudit();
  const [url, setUrl] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: active } = useSeoAudit(activeId);

  const isPro = tenantData?.tenant.plan === "pro";
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
  const delta = audit?.score != null && previous?.score != null ? audit.score - previous.score : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    start.mutate(url.trim(), { onSuccess: (res) => setActiveId(res.audit.id) });
  }

  if (tenantData && !isPro) {
    return (
      <>
        <PageHead eyebrow="Growth" title={<>SEO <em>check</em></>} sub="See how search engines read your website and what to fix first." />
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="The SEO check is a Pro feature"
            text="Scan your website, get a score out of 100, and a plain list of what to fix to rank better."
            action={<Button href="/account">View plans</Button>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead eyebrow="Growth" title={<>SEO <em>check</em></>} sub="We read your website the way a search engine does and tell you what to fix first." />

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

          <div className="sec-t">Page by page</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[...report.pages].sort((a, b) => a.score - b.score).map((p) => <PageCard key={p.url} page={p} />)}
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
