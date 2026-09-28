"use client";

import { use, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconChat, IconGlobe, IconPhone, IconRobot, IconSparkle, IconWhatsapp } from "@/components/icons";
import { useLead } from "@/hooks/leads/query";
import { useCreateFollowup } from "@/hooks/followups/mutation";
import { useDraftLeadReply, useSendLeadReply, useUpdateLeadStatus } from "@/hooks/leads/mutation";
import { Skeleton } from "@/components/ui/Skeleton";
import { apiErrorCode, authErrorMessage } from "@/lib/errors";
import { initials, sourceLabel, statusLabel, timeAgo } from "@/lib/format";
import type { LeadStatus } from "@/types/models";
import { Button } from "@/components/ui/Button";

const FOLLOWUP_OPTIONS: Array<[string, number]> = [["Tomorrow", 24], ["In 2 days", 48], ["Next week", 168]];

const SOURCE_ICON = { form: IconGlobe, whatsapp: IconWhatsapp, chat_widget: IconChat, missed_call: IconPhone } as const;

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useLead(id);
  const updateStatus = useUpdateLeadStatus();
  const draft = useDraftLeadReply();
  const sendReply = useSendLeadReply();
  const createFollowup = useCreateFollowup();
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState("");
  const [draftText, setDraftText] = useState("");
  const [copied, setCopied] = useState(false);
  const lead = data?.lead ?? null;
  const messages = data?.messages ?? [];

  const setStatus = (status: LeadStatus) => lead && updateStatus.mutate({ id: lead.id, status });

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
        <div className="state-err">{notFound ? "This lead doesn't exist." : "Couldn't load this lead — is leadworks-api running?"}</div>
      </>
    );
  }

  const [label, cls] = statusLabel(lead.status);
  const SourceIcon = SOURCE_ICON[lead.source] ?? IconGlobe;
  const isEmail = lead.contact.includes("@");
  const custom = Object.entries(lead.customFields ?? {});

  return (
    <>
      <Link href="/leads" className="back">← All leads</Link>

      <div className="grid">
        <div className="g-8">
          <div className="pnl">
            <div className="lead-h">
              <span className="av">{initials(lead.name ?? lead.contact)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2>{lead.name ?? "Unknown lead"}</h2>
                <small>
                  <SourceIcon size={13} style={{ verticalAlign: "-2px" }} /> {sourceLabel(lead.source)} · {timeAgo(lead.createdAt)} ago
                </small>
              </div>
              <span className={`pp ${cls}`}>{label}</span>
            </div>

            <div className="thread">
              <span className="thread-note">{new Date(lead.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
              {messages.length === 0 ? (
                <div className="bub in">{lead.message ?? "No message left."}</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`bub ${m.direction === "inbound" ? "in" : "out"}`}>
                    {m.body}
                    {m.aiGenerated && <time>AI reply · {timeAgo(m.createdAt)} ago</time>}
                  </div>
                ))
              )}
            </div>

            <div className="aidraft">
              <b><IconRobot size={16} style={{ color: "var(--primary)" }} /> Reply</b>
              <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                <textarea
                  className="finput"
                  rows={4}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Write your reply, or let AI draft one from your business profile."
                />
              </div>
              <div className="form-foot">
                <Button size="sm" variant="secondary" icon={<IconSparkle size={13} />} loading={draft.isPending} loadingText="Writing…" onClick={() => draft.mutate(lead.id, { onSuccess: (r) => setDraftText(r.reply) })}>
                  Draft with AI
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!draftText.trim()}
                  onClick={() => {
                    navigator.clipboard?.writeText(draftText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
                {isEmail && (
                  <Button
                    size="sm"
                    disabled={!draftText.trim()}
                    loading={sendReply.isPending}
                    loadingText="Sending…"
                    onClick={() => sendReply.mutate({ id: lead.id, text: draftText.trim() }, { onSuccess: () => setDraftText("") })}
                  >
                    Send reply
                  </Button>
                )}
              </div>
              {draft.isError && <div className="auth-err" style={{ marginTop: 12 }}>The AI isn&apos;t available right now. Check that an API key is configured.</div>}
              {sendReply.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(sendReply.error)}</div>}
              {sendReply.isSuccess && <p className="hint" style={{ marginTop: 12, color: "var(--primary)" }}>Reply sent.</p>}
              {!isEmail && <p className="hint" style={{ marginTop: 12 }}>No email on file for this contact — copy the message and send it via WhatsApp or a call instead.</p>}
            </div>
          </div>
        </div>

        <div className="g-4" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="sec-t">Details</div>
            <div className="pnl">
              <div className="dl">
                <div className="dl-r"><span>Contact</span><span>{isEmail ? <a href={`mailto:${lead.contact}`}>{lead.contact}</a> : <a href={`tel:${lead.contact}`}>{lead.contact}</a>}</span></div>
                <div className="dl-r"><span>Source</span><span>{sourceLabel(lead.source)}</span></div>
                <div className="dl-r"><span>Received</span><span>{timeAgo(lead.createdAt)} ago</span></div>
                <div className="dl-r"><span>Last activity</span><span>{timeAgo(lead.lastActivityAt)} ago</span></div>
                {custom.map(([k, v]) => <div className="dl-r" key={k}><span>{k}</span><span>{String(v)}</span></div>)}
              </div>
            </div>
            <Link href={`/customers/${encodeURIComponent(lead.contact)}`} className="hint" style={{ display: "block", marginTop: 10 }}>
              View full customer history →
            </Link>
          </div>

          <div>
            <div className="sec-t">Actions</div>
            <div className="pnl">
              <div className="side-acts">
              <Button block onClick={() => setStatus("won")} disabled={lead.status === "won"} loading={updateStatus.isPending} loadingText="Saving…">
                {lead.status === "won" ? "✓ Won" : "Mark as won"}
              </Button>
              {lead.status === "new" && <Button block variant="secondary" onClick={() => setStatus("replied")} disabled={updateStatus.isPending}>Mark as replied</Button>}
              {lead.status !== "closed" && lead.status !== "won" && <Button block variant="secondary" onClick={() => setStatus("closed")} disabled={updateStatus.isPending}>Close lead</Button>}
              {scheduling ? (
                <div className="pill-row">
                  {FOLLOWUP_OPTIONS.map(([label, hours]) => (
                    <button
                      key={label}
                      type="button"
                      className="pill-opt"
                      disabled={createFollowup.isPending}
                      onClick={() =>
                        createFollowup.mutate(
                          { leadId: lead.id, runAt: new Date(Date.now() + hours * 3600 * 1000).toISOString() },
                          { onSuccess: () => { setScheduling(false); setScheduled(label); } }
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <Button block variant="secondary" onClick={() => setScheduling(true)} iconRight={<IconArrowRight size={14} />}>Schedule follow-up</Button>
              )}
              {scheduled && <p className="hint" style={{ margin: 0 }}>Follow-up set for {scheduled.toLowerCase()} — approve it on the Follow-ups page.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
