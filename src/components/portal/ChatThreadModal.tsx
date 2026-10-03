"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChatThread } from "@/hooks/chatWidget/query";
import { useReplyToChat } from "@/hooks/chatWidget/mutation";
import { authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";

interface ChatThreadModalProps {
  leadId: string;
  onClose: () => void;
}

export function ChatThreadModal({ leadId, onClose }: ChatThreadModalProps) {
  const { data, isLoading } = useChatThread(leadId);
  const reply = useReplyToChat();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const messages = data?.messages ?? [];
  const lead = data?.lead;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    reply.mutate({ leadId, text: body }, { onSuccess: () => setText("") });
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560, position: "relative" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-h">
          <div>
            <h3 style={{ fontSize: 24 }}>{lead?.name || "Website visitor"}</h3>
            <p className="hint" style={{ margin: "2px 0 0" }}>{!lead ? "Loading…" : lead.qualified === false ? "No contact details yet" : lead.contact}</p>
          </div>
        </div>
        <button type="button" className="iconbtn" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 20, right: 20 }}>
          <IconClose size={16} />
        </button>

        <div className="thread" style={{ padding: 16, maxHeight: 340, overflowY: "auto", borderRadius: 12, marginTop: 12 }}>
          {isLoading && <Skeleton height={48} />}
          {messages.map((m) => {
            const inbound = m.direction === "inbound";
            return (
              <div key={m.id} className={`bub ${inbound ? "in" : "out"}`}>
                {m.body}
                <time>
                  {inbound ? "Visitor" : m.aiGenerated ? "AI reply" : "Team"} · {timeAgo(m.createdAt)} ago
                </time>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} style={{ marginTop: 14 }}>
          <div className="field" style={{ marginBottom: 8 }}>
            <label className="flabel" htmlFor="chat-reply">Reply as the team</label>
            <textarea
              id="chat-reply"
              className="finput"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a reply — the visitor sees it in their chat bubble within seconds."
            />
          </div>
          <p className="hint" style={{ margin: "0 0 4px" }}>
            Once you reply, the AI pauses on this chat for 30 minutes so it doesn&apos;t talk over you.
          </p>
          {reply.isError && <p className="hint" style={{ color: "var(--red)" }}>{authErrorMessage(reply.error)}</p>}
          <div className="modal-foot">
            <Link href={`/leads/${leadId}`} className="hint" style={{ marginRight: "auto" }}>Open lead →</Link>
            <Button type="submit" disabled={!text.trim()} loading={reply.isPending} loadingText="Sending…">Send reply</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
