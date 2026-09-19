"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { IconClose, IconSend, IconSparkle } from "@/components/icons";
import { useSendChat } from "@/hooks/chat/mutation";
import type { ChatTurn } from "@/services/chat";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = ["Show pending leads", "Who should I call first?", "Draft a follow-up"];

/** Slide-over AI co-pilot. */
export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sendChat = useSendChat();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendChat.isPending]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sendChat.isPending) return;

    const history: ChatTurn[] = [...messages.map(({ role, content }) => ({ role, content })), { role: "user", content }];
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content }]);
    setInput("");

    try {
      const { reply } = await sendChat.mutateAsync(history);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "Sorry, I'm having trouble connecting right now." },
      ]);
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      <div className={`drawer-bg ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="AI assistant">
        <div className="drawer-h">
          <span className="av"><IconSparkle size={16} /></span>
          <div>
            <strong>AI assistant</strong>
            <small>Your leads co-pilot</small>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><IconClose size={16} /></button>
        </div>

        <div className="drawer-body">
          {messages.length === 0 && !sendChat.isPending && (
            <div className="drawer-empty">
              <h4>Ask me <em style={{ color: "var(--primary)" }}>anything.</em></h4>
              <p>I can summarise your leads, draft replies and tell you who to call first.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`bub ${m.role === "user" ? "user" : "bot"}`}>{m.content}</div>
          ))}
          {sendChat.isPending && (
            <div className="bub bot"><span className="typing"><i /><i /><i /></span></div>
          )}
          <div ref={endRef} />
        </div>

        <div className="drawer-foot">
          {messages.length === 0 && (
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
          <div className="composer">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about your leads…"
            />
            <button onClick={() => send(input)} disabled={!input.trim() || sendChat.isPending} aria-label="Send">
              <IconSend size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
