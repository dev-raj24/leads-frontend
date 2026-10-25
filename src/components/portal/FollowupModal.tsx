"use client";

import { useState } from "react";
import Link from "next/link";
import { IconClose, IconSparkle } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import {
  useApproveFollowup,
  useCancelFollowup,
  useDraftFollowup,
  useMarkFollowupSent,
  useSendFollowupEmail,
} from "@/hooks/followups/mutation";
import { authErrorMessage } from "@/lib/errors";
import { formatWhen, STATUS_PILL } from "./FollowupTable";
import type { Followup } from "@/types/models";

interface FollowupModalProps {
  followup: Followup;
  onClose: () => void;
}

export function FollowupModal({ followup, onClose }: FollowupModalProps) {
  const approve = useApproveFollowup();
  const cancel = useCancelFollowup();
  const markSent = useMarkFollowupSent();
  const draft = useDraftFollowup();
  const sendEmail = useSendFollowupEmail();

  const [text, setText] = useState(followup.template ?? "");
  const [copied, setCopied] = useState(false);

  const editable = followup.status === "pending" || followup.status === "manual";
  const hasEmail = followup.leadContact.includes("@");
  const [cls, label] = STATUS_PILL[followup.status];
  const busy = approve.isPending || cancel.isPending || markSent.isPending || sendEmail.isPending;
  const anyError = approve.isError || sendEmail.isError;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520, position: "relative" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-h">
          <div>
            <h3 style={{ fontSize: 24 }}>{followup.leadName}</h3>
            <p className="hint" style={{ margin: "2px 0 0" }}>{followup.leadContact}</p>
          </div>
          <span className={`pp ${cls}`}>{label}</span>
        </div>
        <button type="button" className="iconbtn" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 20, right: 20 }}>
          <IconClose size={16} />
        </button>

        <p className="hint" style={{ marginBottom: 16 }}>
          {followup.status === "sent" && followup.sentAt ? `Sent ${formatWhen(followup.sentAt)}` : `Due ${formatWhen(followup.runAt)}`}
        </p>

        {editable ? (
          <>
            <div className="field">
              <label className="flabel" htmlFor="fu-text">Message</label>
              <textarea
                id="fu-text"
                className="finput"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Leave empty and the AI will draft it when it's due."
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              icon={<IconSparkle size={14} />}
              loading={draft.isPending}
              loadingText="Writing…"
              onClick={() => draft.mutate(followup.id, { onSuccess: (r) => setText(r.draft) })}
            >
              Draft with AI
            </Button>
            {draft.isError && <p className="hint" style={{ color: "var(--red)", marginTop: 8 }}>Couldn&apos;t reach the AI — check it&apos;s configured, or write the message yourself.</p>}
          </>
        ) : (
          followup.template && <div className="fu-draft"><span>&ldquo;{followup.template}&rdquo;</span></div>
        )}

        {anyError && (
          <p className="hint" style={{ color: "var(--red)", marginTop: 12 }}>
            {authErrorMessage(approve.error ?? sendEmail.error)}
          </p>
        )}

        <div className="modal-foot" style={{ flexWrap: "wrap" }}>
          <Link href={`/leads/${followup.leadId}`} className="hint" style={{ marginRight: "auto" }}>View lead →</Link>

          {(followup.status === "pending" || followup.status === "approved" || followup.status === "manual") && (
            <Button variant="secondary" disabled={busy} onClick={() => cancel.mutate(followup.id, { onSuccess: onClose })}>
              Cancel
            </Button>
          )}

          {followup.status === "pending" && (
            <Button disabled={busy} loading={approve.isPending} loadingText="Approving…" onClick={() => approve.mutate({ id: followup.id, template: text.trim() || undefined }, { onSuccess: onClose })}>
              Approve
            </Button>
          )}

          {followup.status === "manual" && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
              {hasEmail && (
                <Button
                  disabled={busy}
                  loading={sendEmail.isPending}
                  loadingText="Sending…"
                  onClick={() => sendEmail.mutate({ id: followup.id, template: text.trim() || undefined }, { onSuccess: onClose })}
                >
                  Send email
                </Button>
              )}
              <Button variant="secondary" disabled={busy} onClick={() => markSent.mutate({ id: followup.id, template: text.trim() || undefined }, { onSuccess: onClose })}>
                Mark as sent
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
