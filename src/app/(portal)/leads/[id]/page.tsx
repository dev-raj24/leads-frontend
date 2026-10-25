"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { IconChat, IconGlobe, IconPhone, IconRobot, IconSparkle, IconTag, IconWhatsapp } from "@/components/icons";
import { FollowupModal } from "@/components/portal/FollowupModal";
import { formatWhen, STATUS_PILL } from "@/components/portal/FollowupTable";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCreateFollowup } from "@/hooks/followups/mutation";
import { useDraftLeadReply, useSendLeadReply, useUpdateLeadStatus } from "@/hooks/leads/mutation";
import { useLead } from "@/hooks/leads/query";
import { apiErrorCode, authErrorMessage } from "@/lib/errors";
import { eventLabel, initials, nextStepFor, sourceLabel, statusLabel, timeAgo } from "@/lib/format";
import type { Followup, LeadStatus } from "@/types/models";

const FOLLOWUP_OPTIONS: Array<[string, number]> = [["Tomorrow", 24], ["In 2 days", 48], ["Next week", 168]];
const SOURCE_ICON = { form: IconGlobe, whatsapp: IconWhatsapp, chat_widget: IconChat, missed_call: IconPhone, offer: IconTag } as const;
const CHANNEL_LABEL: Record<string, string> = { form: "Form", email: "Email", chat: "Chat", whatsapp: "WhatsApp" };

const whatsappLink = (contact: string) => {
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};

const fullTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useLead(id);
  const updateStatus = useUpdateLeadStatus();
  const draft = useDraftLeadReply();
  const sendReply = useSendLeadReply();
  const createFollowup = useCreateFollowup();
  const [scheduling, setScheduling] = useState(false);
  const [reviewing, setReviewing] = useState<Followup | null>(null);
  const [draftText, setDraftText] = useState("");

  const lead = data?.lead ?? null;
  const messages = useMemo(() => data?.messages ?? [], [data]);
  const followups = useMemo(() => data?.followups ?? [], [data]);
  const queued = followups.filter((f) => ["pending", "approved", "manual", "processing"].includes(f.status));

  const timeline = useMemo(
    () =>
      (data?.events ?? []).flatMap((e) => {
        const label = eventLabel(e.type, e.payload);
        return label ? [{ id: e.id, label, at: e.createdAt }] : [];
      }),
    [data],
  );

  const setStatus = (status: LeadStatus) => lead && updateStatus.mutate({ id: lead.id, status: status });

  if (isLoading) {
    return (
      <>
        <Skeleton width={90} height={14} style={{ marginBottom: 24 }} />
        <div className="grid">
          <div className="g-8"><div className="pnl pad"><Skeleton width="40%" height={32} /><Skeleton width="70%" height={14} style={{ marginTop: 18 }} /></div></div>
          <div className="g-4"><div className="pnl pad"><Skeleton height={160} /></div></div>
        </div>
      </>
    );
  }

  if (error || !lead) {
    const notFound = apiErrorCode(error) === "not_found";
    return (
      <>
        <Link href="/leads" className="back">← All leads</Link>
        <div className="state-err">{notFound ? "This lead doesn't exist." : "Couldn't load this lead. Is leadworks-api running?"}</div>
      </>
    );
  }

  const [label, cls] = statusLabel(lead.status);
  const SourceIcon = SOURCE_ICON[lead.source] ?? IconGlobe;
  const isEmail = lead.contact.includes("@");
  const wa = isEmail ? null : whatsappLink(lead.contact);
  const custom = Object.entries(lead.customFields ?? {});
  const step = nextStepFor({ ...lead, lastMessage: messages.length ? { direction: messages[messages.length - 1].direction, aiGenerated: messages[messages.length - 1].aiGenerated } : null, nextFollowup: queued[0] ? { at: queued[0].runAt, status: queued[0].status } : null });
  const closed = lead.status === "won" || lead.status === "lost" || lead.status === "closed";

  return (
    <>
      <Link href="/leads" className="back">← All leads</Link>

      <div className="grid">
        <div className="g-8" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="pnl">
            <div className="lead-h">
              <span className="av">{initials(lead.name ?? lead.contact)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2>{lead.name ?? "Unknown lead"}</h2>
                <small>
                  <SourceIcon size={13} style={{ verticalAlign: "-2px" }} /> {sourceLabel(lead.source)} · {fullTime(lead.createdAt)}
                </small>
              </div>
              <span className={`pp ${cls}`}>{label}</span>
            </div>
            <div className={`nextbar ${step.needsYou ? "act" : ""}`}>
              <b>{step.needsYou ? "Next step: " : "Status: "}{step.label}</b>
              <span>{step.hint}</span>
            </div>
          </div>

          <div>
            <div className="sec-t" style={{ marginTop: 0 }}>What they submitted</div>
            <div className="pnl">
              <div className="dl">
                <div className="dl-r"><span>Name</span><span>{lead.name ?? "Not given"}</span></div>
                <div className="dl-r"><span>{isEmail ? "Email" : "Phone"}</span><span>{isEmail ? <a href={`mailto:${lead.contact}`}>{lead.contact}</a> : <a href={`tel:${lead.contact}`}>{lead.contact}</a>}</span></div>
                {custom.map(([k, v]) => (
                  <div className="dl-r" key={k}><span>{k}</span><span>{String(v)}</span></div>
                ))}
                <div className="dl-r"><span>Message</span><span style={{ whiteSpace: "pre-wrap", textAlign: "right" }}>{lead.message ?? "No message left"}</span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="sec-t" style={{ marginTop: 0 }}>Conversation</div>
            <div className="pnl">
              <div className="thread">
                {messages.length === 0 && <span className="thread-note">No messages yet</span>}
                {messages.map((m) => {
                  const inbound = m.direction === "inbound";
                  const who = inbound ? "Customer" : m.aiGenerated ? "AI" : "You";
                  return (
                    <div key={m.id} className={`bub ${inbound ? "in" : "out"} ${!inbound && !m.aiGenerated ? "team" : ""}`}>
                      {m.body}
                      <time>{who} · {CHANNEL_LABEL[m.channel] ?? m.channel} · {fullTime(m.createdAt)}</time>
                    </div>
                  );
                })}
                {queued.map((f) => {
                  const [pcls, plabel] = STATUS_PILL[f.status];
                  return (
                    <div key={f.id} className="queued">
                      <div>
                        <b>Follow-up {f.status === "pending" ? "waiting for your OK" : "queued"}</b>
                        <small>Goes out {formatWhen(f.runAt)} if they have not answered by then</small>
                      </div>
                      <span className={`pp ${pcls}`}>{plabel}</span>
                      <Button size="sm" variant="secondary" onClick={() => setReviewing(f)}>{f.status === "pending" ? "Review" : "View"}</Button>
                    </div>
                  );
                })}
              </div>

              {isEmail ? (
                <div className="aidraft">
                  <b><IconRobot size={16} style={{ color: "var(--primary)" }} /> Reply by email to {lead.contact}</b>
                  <p className="hint" style={{ margin: "2px 0 10px" }}>
                    {data?.replyInPortal
                      ? "When they answer, the reply shows up in this conversation and we email you."
                      : "Their answer will go to your own email inbox. Turn on reply tracking to see it here."}
                  </p>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <textarea
                      className="finput"
                      rows={4}
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      aria-label="Your reply"
                      placeholder="Write your reply, or let AI draft one from your business profile."
                    />
                  </div>
                  <div className="form-foot">
                    <Button size="sm" variant="secondary" icon={<IconSparkle size={13} />} loading={draft.isPending} loadingText="Writing…" onClick={() => draft.mutate(lead.id, { onSuccess: (r) => setDraftText(r.reply) })}>
                      Draft with AI
                    </Button>
                    <Button
                      size="sm"
                      disabled={!draftText.trim()}
                      loading={sendReply.isPending}
                      loadingText="Sending…"
                      onClick={() => sendReply.mutate({ id: lead.id, text: draftText.trim() }, { onSuccess: () => setDraftText("") })}
                    >
                      Send email
                    </Button>
                  </div>
                  {draft.isError && <div className="auth-err" style={{ marginTop: 12 }}>The AI isn&apos;t available right now.</div>}
                  {sendReply.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(sendReply.error)}</div>}
                  {sendReply.isSuccess && <p className="hint" style={{ marginTop: 12, color: "var(--primary)" }}>Sent. It now shows in the conversation above.</p>}
                </div>
              ) : (
                <div className="aidraft">
                  <b><IconPhone size={16} style={{ color: "var(--primary)" }} /> Phone number only</b>
                  <p className="hint" style={{ margin: "2px 0 12px" }}>
                    There is no email address to reply to, so reach them yourself. Come back and mark them contacted so this list stays honest.
                  </p>
                  <div className="form-foot" style={{ marginTop: 0 }}>
                    <Button size="sm" href={`tel:${lead.contact}`} icon={<IconPhone size={14} />}>Call {lead.contact}</Button>
                    {wa && (
                      <a className="btn line sm" href={wa} target="_blank" rel="noreferrer">
                        <IconWhatsapp size={14} /> WhatsApp
                      </a>
                    )}
                    {lead.status === "new" && (
                      <Button size="sm" variant="secondary" loading={updateStatus.isPending} onClick={() => setStatus("replied")}>
                        I contacted them
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="g-4" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="sec-t" style={{ marginTop: 0 }}>Actions</div>
            <div className="pnl">
              <div className="side-acts">
                {!closed && (
                  <Button block onClick={() => setStatus("won")} loading={updateStatus.isPending} loadingText="Saving…">Mark as won</Button>
                )}
                {lead.status === "new" && <Button block variant="secondary" onClick={() => setStatus("replied")} disabled={updateStatus.isPending}>Mark as contacted</Button>}
                {!closed && <Button block variant="secondary" onClick={() => setStatus("lost")} disabled={updateStatus.isPending}>Mark as lost</Button>}
                {closed && <Button block variant="secondary" onClick={() => setStatus("new")} disabled={updateStatus.isPending}>Reopen this lead</Button>}
                {!closed && queued.length === 0 &&
                  (scheduling ? (
                    <div className="pill-row">
                      {FOLLOWUP_OPTIONS.map(([text, hours]) => (
                        <button
                          key={text}
                          type="button"
                          className="pill-opt"
                          disabled={createFollowup.isPending}
                          onClick={() =>
                            createFollowup.mutate(
                              { leadId: lead.id, runAt: new Date(Date.now() + hours * 3600 * 1000).toISOString() },
                              { onSuccess: () => setScheduling(false) },
                            )
                          }
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Button block variant="secondary" onClick={() => setScheduling(true)}>Schedule a follow-up</Button>
                  ))}
              </div>
            </div>
            <Link href={`/customers/${encodeURIComponent(lead.contact)}`} className="hint" style={{ display: "block", marginTop: 10 }}>
              All enquiries from this person →
            </Link>
          </div>

          {timeline.length > 0 && (
            <div>
              <div className="sec-t" style={{ marginTop: 0 }}>Timeline</div>
              <div className="pnl pad">
                <div className="tl">
                  {timeline.map((t) => (
                    <div className="tl-r" key={t.id}>
                      <i />
                      <span>
                        {t.label}
                        <small>{timeAgo(t.at)} ago</small>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {reviewing && <FollowupModal followup={reviewing} onClose={() => setReviewing(null)} />}
    </>
  );
}
