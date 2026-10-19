"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconChart, IconRefresh, IconSparkle, IconStar } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import {
  useChooseReviewLocation,
  useConnectReviews,
  useDisconnectReviews,
  useRegenerateReviewDraft,
  useSendReviewReply,
  useSkipReview,
  useSyncReviews,
} from "@/hooks/reviews/mutation";
import { useReviewLocations, useReviewStatus, useReviews } from "@/hooks/reviews/query";
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
  const regenerate = useRegenerateReviewDraft();
  const send = useSendReviewReply();
  const skip = useSkipReview();
  const pending = review.status === "pending";
  const busy = regenerate.isPending || send.isPending || skip.isPending;

  return (
    <div className="pnl pad" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <div>
          <b>{review.reviewerName ?? "A Google customer"}</b>
          <div style={{ marginTop: 4 }}><Stars rating={review.rating} /></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`pp ${review.status === "sent" ? "w" : review.status === "skipped" ? "n" : "p"}`}>
            {review.status === "sent" ? "REPLIED" : review.status === "skipped" ? "SKIPPED" : "NEEDS A REPLY"}
          </span>
          <div className="hint" style={{ marginTop: 4 }}>{ago(review.createTime)}</div>
        </div>
      </div>

      {review.comment && <p style={{ margin: "0 0 12px" }}>&ldquo;{review.comment}&rdquo;</p>}

      {review.status === "sent" && review.sentReply && (
        <div className="fu-draft"><span>Your reply: &ldquo;{review.sentReply}&rdquo;</span></div>
      )}

      {pending && (
        <>
          <div className="field">
            <label className="flabel" htmlFor={`rv-${review.id}`}>Reply (AI-drafted — read it before sending)</label>
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
          {send.isError && <p className="hint" style={{ color: "var(--red)", margin: "0 0 8px" }}>{authErrorMessage(send.error)}</p>}
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
            <Button
              size="sm"
              disabled={busy || !text.trim()}
              loading={send.isPending}
              loadingText="Posting…"
              onClick={() => send.mutate({ id: review.id, text: text.trim() })}
            >
              Send reply to Google
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} loading={skip.isPending} onClick={() => skip.mutate(review.id)}>
              Skip
            </Button>
          </div>
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
          <Button size="sm" variant="ghost" loading={disconnect.isPending} onClick={() => disconnect.mutate()}>Disconnect Google</Button>
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

function LocationPicker() {
  const { data, isLoading, error } = useReviewLocations(true);
  const choose = useChooseReviewLocation();
  const locations = data?.locations ?? [];

  return (
    <div className="pnl pad">
      <h3 style={{ margin: "0 0 6px" }}>Which business?</h3>
      <p className="hint" style={{ margin: "0 0 12px" }}>Pick the Google Business Profile listing whose reviews you want to manage here.</p>
      {isLoading && <p className="hint">Loading your Google Business listings…</p>}
      {error && <div className="auth-err">{authErrorMessage(error)}</div>}
      {!isLoading && !error && locations.length === 0 && (
        <p className="hint">This Google account has no Business Profile listing. Add and verify one at business.google.com, then reload this page.</p>
      )}
      <div style={{ display: "grid", gap: 8 }}>
        {locations.map((loc) => (
          <Button key={loc.locationId} variant="secondary" disabled={choose.isPending} onClick={() => choose.mutate(loc)}>
            {loc.title}
          </Button>
        ))}
      </div>
      {choose.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(choose.error)}</div>}
    </div>
  );
}

function ReviewsTabs() {
  const params = useSearchParams();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const { data: statusData, isLoading } = useReviewStatus();
  const connect = useConnectReviews();
  const status = statusData?.status;
  const justConnected = params.get("connected") === "1";
  const returnedError = params.get("error");

  if (tenantData && !isPro) {
    return (
      <>
        <PageHead eyebrow="Reputation" title={<>Google <em>reviews</em></>} sub="See new reviews as they come in and reply with an AI-drafted response you approve." />
        <div className="pnl">
          <EmptyState icon={<IconChart size={26} />} title="Review replies are a Pro feature" text="Connect your Google Business Profile, get an AI-drafted reply for every new review, and send it with one click after you check it." action={<Button href="/account">View plans</Button>} />
        </div>
      </>
    );
  }

  if (isLoading || !status) return null;

  const needsLocation = status.connected && !status.locationId && !status.needsReconnect;
  const reconnect = status.needsReconnect;
  const ready = status.connected && !!status.locationId && !reconnect;

  return (
    <>
      <PageHead eyebrow="Reputation" title={<>Google <em>reviews</em></>} sub="A reply drafted by AI for every new review — you read it, edit if needed, and send." />

      {!status.configured && (
        <div className="pnl">
          <EmptyState icon={<IconChart size={26} />} title="Google connection isn't switched on yet" text="This server doesn't have Google sign-in keys. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the backend settings, then come back." />
        </div>
      )}

      {status.configured && (
        <>
          {justConnected && needsLocation && <div className="notice warn" style={{ marginBottom: 14 }}>Google is connected. Choose which business below.</div>}
          {returnedError && <div className="state-err" style={{ marginBottom: 14 }}>We couldn&apos;t finish connecting to Google. Please try again.</div>}

          {(!status.connected || reconnect) && (
            <div className="pnl pad">
              <h3 style={{ margin: "0 0 6px" }}>{reconnect ? "Connect Google again" : "Connect your Google Business Profile"}</h3>
              <p className="hint" style={{ margin: "0 0 14px" }}>
                {reconnect ? "Google access was withdrawn or expired." : "We'll watch for new reviews and draft a reply for each with AI. Nothing posts to Google until you approve it."}
              </p>
              <Button loading={connect.isPending} loadingText="Opening Google…" onClick={() => connect.mutate()}>Connect Google Business Profile</Button>
              {connect.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(connect.error)}</div>}
            </div>
          )}

          {needsLocation && <LocationPicker />}
          {ready && <ReviewsConnected />}
        </>
      )}
    </>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={null}>
      <ReviewsTabs />
    </Suspense>
  );
}
