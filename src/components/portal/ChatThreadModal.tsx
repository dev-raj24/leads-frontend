"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useChatThread } from "@/hooks/chatWidget/query";
import { useReplyToChat } from "@/hooks/chatWidget/mutation";
import { authErrorMessage } from "@/lib/errors";
import { initials, timeAgo } from "@/lib/format";

interface ChatThreadModalProps {
  leadId: string;
  onClose: () => void;
}

export function ChatThreadModal({ leadId, onClose }: ChatThreadModalProps) {
  const { data, isLoading } = useChatThread(leadId);
  const reply = useReplyToChat();
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const messages = data?.messages ?? [];
  const lead = data?.lead;
  const anonymous = lead ? lead.qualified === false : false;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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
    <>
      <div className={`drawer-bg ${shown ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer wide ${shown ? "open" : ""}`} aria-label="Chat conversation">
        <div className="drawer-h">
          <span className="av">{initials(lead?.name ?? (anonymous ? "Visitor" : lead?.contact ?? "V"))}</span>
          <div style={{ minWidth: 0 }}>
            <strong>{lead?.name || "Website visitor"}</strong>
            <small>{!lead ? "Loading…" : anonymous ? "No contact details yet" : lead.contact}</small>
          </div>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Close"><IconClose size={16} /></button>
        </div>

        <div className="drawer-body chat-body">
          {isLoading && <Skeleton height={48} />}
          {messages.map((m) => {
            const inbound = m.direction === "inbound";
            const who = inbound ? "Visitor" : m.aiGenerated ? "AI" : "Team";
            return (
              <div key={m.id} className={`bub ${inbound ? "in" : "out"} ${!inbound && !m.aiGenerated ? "team" : ""}`}>
                {m.body}
                <time>{who} · {timeAgo(m.createdAt)} ago</time>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="drawer-foot">
          <textarea
            id="chat-reply"
            className="finput"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e);
            }}
            aria-label="Reply as the team"
            placeholder="Reply as the team. The visitor sees it in their chat within seconds."
          />
          <p className="hint" style={{ margin: "8px 0 0" }}>
            When you reply, the AI stays quiet on this chat for 30 minutes.
          </p>
          {reply.isError && <p className="hint" style={{ color: "var(--red)" }}>{authErrorMessage(reply.error)}</p>}
          <div className="drawer-actions">
            <Link href={`/leads/${leadId}`} className="hint">{anonymous ? "Open details" : "Open lead"} →</Link>
            <Button type="submit" disabled={!text.trim()} loading={reply.isPending} loadingText="Sending…">Send reply</Button>
          </div>
        </form>
      </aside>
    </>
  );
}
