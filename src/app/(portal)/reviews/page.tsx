"use client";

import { useState } from "react";
import { IconChart, IconRefresh, IconSearch, IconSparkle, IconStar } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import {
  useChooseBusiness,
  useCopyReviewReply,
  useDisconnectReviews,
  useRegenerateReviewDraft,
  useSearchBusiness,
  useSkipReview,
  useSyncReviews,
} from "@/hooks/reviews/mutation";
import { useReviewStatus, useReviews } from "@/hooks/reviews/query";
import { useTenant } from "@/hooks/tenant/query";
import { authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import type { GoogleReview } from "@/types/models";

const ago = (iso: string | null) => {
  if (!iso) return "";
  const t = timeAgo(iso);
  return t === "just now" ? t : `${t} ago`;
};

function Stars({ rating }: { rating: number | null }) {
  const n = rating ?? 0;
  return (
    <span className="rv-stars" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} size={15} style={{ fill: i <= n ? "currentColor" : "none", opacity: i <= n ? 1 : 0.35 }} />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [text, setText] = useState(review.aiDraft ?? "");
  const [copied, setCopied] = useState(false);
  const regenerate = useRegenerateReviewDraft();
  const copy = useCopyReviewReply();
  const skip = useSkipReview();
  const pending = review.status === "pending";
  const busy = regenerate.isPending || copy.isPending || skip.isPending;

  function doCopy() {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    copy.mutate({ id: review.id, text: text.trim() }, { onSettled: () => setTimeout(() => setCopied(false), 1800) });
  }

  return (
    <div className="pnl pad" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <div>
          <b>{review.reviewerName ?? "A Google customer"}</b>
          <div style={{ marginTop: 4 }}><Stars rating={review.rating} /></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`pp ${review.status === "sent" ? "w" : review.status === "skipped" ? "n" : "p"}`}>
            {review.status === "sent" ? "COPIED" : review.status === "skipped" ? "SKIPPED" : "NEEDS A REPLY"}
          </span>
          <div className="hint" style={{ marginTop: 4 }}>{ago(review.createTime)}</div>
        </div>
      </div>

      {review.comment && <p style={{ margin: "0 0 12px" }}>&ldquo;{review.comment}&rdquo;</p>}

      {review.status === "sent" && review.sentReply && (
        <div className="fu-draft"><span>What you copied: &ldquo;{review.sentReply}&rdquo;</span></div>
      )}

      {pending && (
        <>
          <div className="field">
            <label className="flabel" htmlFor={`rv-${review.id}`}>Reply (AI-drafted — read it before copying)</label>
            <textarea
              id={`rv-${review.id}`}
              className="finput"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a reply, or draft one with AI."
            />
          </div>
          {regenerate.isError && <p className="hint" style={{ color: "var(--red)", margin: "0 0 8px" }}>{authErrorMessage(regenerate.error)}</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              size="sm"
              variant="secondary"
              icon={<IconSparkle size={14} />}
              disabled={busy}
              loading={regenerate.isPending}
              loadingText="Writing…"
              onClick={() => regenerate.mutate(review.id, { onSuccess: (r) => setText(r.review.aiDraft ?? "") })}
            >
              {text ? "Redraft with AI" : "Draft with AI"}
            </Button>
            <Button size="sm" disabled={busy || !text.trim()} onClick={doCopy}>
              {copied ? "Copied!" : "Copy reply"}
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} loading={skip.isPending} onClick={() => skip.mutate(review.id)}>
              Skip
            </Button>
          </div>
          <p className="hint" style={{ margin: "10px 0 0" }}>
            Copies it, then open the Google Business Profile app (or business.google.com) and paste it as your reply — only the verified owner can post there, so Leadworks can&apos;t do that last step for you.
          </p>
        </>
      )}
    </div>
  );
}

function ReviewsConnected() {
  const { data, isLoading, isError, error } = useReviews(true);
  const sync = useSyncReviews();
  const disconnect = useDisconnectReviews();
  const reviews = data?.reviews ?? [];
  const pending = reviews.filter((r) => r.status === "pending");
  const done = reviews.filter((r) => r.status !== "pending");

  return (
    <>
      <div className="toolbar">
        <span className="hint">{pending.length > 0 ? `${pending.length} ${pending.length === 1 ? "review" : "reviews"} waiting for a reply` : "You're all caught up"}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <Button size="sm" variant="secondary" icon={<IconRefresh size={14} />} loading={sync.isPending} loadingText="Checking…" onClick={() => sync.mutate()}>Check for new reviews</Button>
          <Button size="sm" variant="ghost" loading={disconnect.isPending} onClick={() => disconnect.mutate()}>Disconnect</Button>
        </div>
      </div>

      {isLoading && <div className="pnl pad">Loading your reviews…</div>}
      {isError && <div className="state-err">{authErrorMessage(error)}</div>}
      {sync.isError && <div className="auth-err" style={{ marginBottom: 14 }}>{authErrorMessage(sync.error)}</div>}

      {!isLoading && reviews.length === 0 && (
        <div className="pnl">
          <EmptyState icon={<IconStar size={26} />} title="No reviews yet" text="We'll check for new Google reviews every 15 minutes and draft a reply with AI for each one." />
        </div>
      )}

      {pending.map((r) => <ReviewCard key={r.id} review={r} />)}
      {done.length > 0 && (
        <>
          {pending.length > 0 && <div className="sec-t">Already handled</div>}
          {done.map((r) => <ReviewCard key={r.id} review={r} />)}
        </>
      )}
    </>
  );
}

function BusinessPicker() {
  const [q, setQ] = useState("");
  const [searched, setSearched] = useState(false);
  const search = useSearchBusiness();
  const choose = useChooseBusiness();
  const matches = search.data?.matches ?? [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearched(true);
    search.mutate(q.trim());
  }

  return (
    <div className="pnl pad">
      <h3 style={{ margin: "0 0 6px" }}>Which business?</h3>
      <p className="hint" style={{ margin: "0 0 14px" }}>
        Search for your business the way it appears on Google Maps — name plus city works best.
      </p>
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input className="finput" style={{ flex: 1, minWidth: 220 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Smile Dental, Indore" />
        <Button type="submit" icon={<IconSearch size={14} />} loading={search.isPending} loadingText="Searching…" disabled={!q.trim()}>Search</Button>
      </form>

      {search.isError && <div className="auth-err" style={{ marginBottom: 12 }}>{authErrorMessage(search.error)}</div>}
      {searched && !search.isPending && matches.length === 0 && !search.isError && (
        <p className="hint">No match found on Google Maps. Try just the business name, or add the city.</p>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {matches.map((m) => (
          <button
            key={m.dataId}
            type="button"
            className="pnl pad"
            style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--line)" }}
            disabled={choose.isPending}
            onClick={() => choose.mutate(m)}
          >
            <b>{m.title}</b>
            <div className="hint" style={{ marginTop: 2 }}>
              {m.address}
              {m.rating != null && ` · ${m.rating}★`}
              {m.reviewCount != null && ` (${m.reviewCount} reviews)`}
            </div>
          </button>
        ))}
      </div>
      {choose.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(choose.error)}</div>}
    </div>
  );
}

export default function ReviewsPage() {
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const { data: statusData, isLoading } = useReviewStatus();
  const status = statusData?.status;

  if (tenantData && !isPro) {
    return (
      <>
        <PageHead eyebrow="Reputation" title={<>Google <em>reviews</em></>} sub="See new reviews as they come in and reply with an AI-drafted response you approve." />
        <div className="pnl">
          <EmptyState icon={<IconChart size={26} />} title="Review replies are a Pro feature" text="See your Google reviews, get an AI-drafted reply for every new one, and copy it across in one click after you check it." action={<Button href="/account">View plans</Button>} />
        </div>
      </>
    );
  }

  if (isLoading || !status) return null;

  const ready = status.connected;

  return (
    <>
      <PageHead eyebrow="Reputation" title={<>Google <em>reviews</em></>} sub="A reply drafted by AI for every new review — you read it, edit if needed, and copy it across." />

      {!status.configured && (
        <div className="pnl">
          <EmptyState icon={<IconChart size={26} />} title="Review lookup isn't switched on yet" text="This server doesn't have a review lookup key set up. Add SERPAPI_KEY to the backend settings, then come back." />
        </div>
      )}

      {status.configured && (!ready ? <BusinessPicker /> : <ReviewsConnected />)}
    </>
  );
}
