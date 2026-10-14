"use client";

import { useEffect, useRef } from "react";
import type { ChatDesign } from "@/types/models";

export interface PanelMessage {
  id: string;
  from: "visitor" | "ai" | "team";
  body: string;
}

interface ChatPanelProps {
  design: ChatDesign;
  messages: PanelMessage[];
  value: string;
  onValueChange?: (v: string) => void;
  onSend?: () => void;
  sending?: boolean;
  error?: string;
  consent?: string;
  poweredBy?: boolean;
  height?: number | string;
  preview?: boolean;
  intro?: React.ReactNode;
}

const DEFAULT_BRAND = "#0b5d4b";

const readable = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? "#111827" : "#ffffff";
};

export function ChatPanel({ design, messages, value, onValueChange, onSend, sending, error, consent, poweredBy, height = "min(640px, 100dvh - 32px)", preview, intro }: ChatPanelProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const brand = design.color && design.color !== "auto" ? design.color : DEFAULT_BRAND;
  const ink = readable(brand);
  const round = design.radius === "square" ? 6 : 18;
  const bubbleRound = design.radius === "square" ? 4 : 14;

  useEffect(() => {
    if (!preview) endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, preview]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height, width: "100%", background: "#fff", border: "1px solid #e6e3dc", borderRadius: round, overflow: "hidden", boxShadow: "0 12px 40px rgba(16,21,28,0.08)", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#16301f" }}>
      <div style={{ background: brand, color: ink, padding: "16px 18px" }}>
        <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.25 }}>{design.title}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{design.subtitle}</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10, background: "#faf9f5" }}>
        {messages.map((m) => {
          const mine = m.from === "visitor";
          return (
            <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "82%" }}>
              {m.from === "team" && <div style={{ fontSize: 11, fontWeight: 700, color: "#6a707a", margin: "0 4px 3px" }}>Team</div>}
              <div style={{ background: mine ? brand : "#fff", color: mine ? ink : "#16301f", border: mine ? 0 : "1px solid #e6e3dc", borderRadius: bubbleRound, padding: "9px 13px", fontSize: 14.5, lineHeight: 1.45, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {m.body}
              </div>
            </div>
          );
        })}
        {sending && (
          <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid #e6e3dc", borderRadius: bubbleRound, padding: "9px 13px", fontSize: 14.5, color: "#6a707a" }}>…</div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!preview) onSend?.();
        }}
        style={{ borderTop: "1px solid #e6e3dc", padding: "12px 14px", background: "#fff" }}
      >
        {intro}
        {error && <p style={{ color: "#b91c1c", fontSize: 13, margin: "0 0 8px" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!preview) onSend?.();
              }
            }}
            readOnly={preview}
            rows={1}
            maxLength={2000}
            aria-label="Your message"
            placeholder="Type your message"
            style={{ flex: 1, resize: "none", border: "1px solid #d8d2c4", borderRadius: bubbleRound, padding: "10px 12px", fontSize: 15, font: "inherit", maxHeight: 110, minHeight: 42, boxSizing: "border-box" }}
          />
          <button
            type="submit"
            disabled={sending || (!preview && !value.trim())}
            style={{ background: brand, color: ink, border: 0, borderRadius: design.radius === "square" ? 6 : 999, padding: "0 18px", height: 42, fontWeight: 700, fontSize: 14.5, cursor: "pointer", opacity: sending || (!preview && !value.trim()) ? 0.55 : 1 }}
          >
            Send
          </button>
        </div>
        {consent && <p style={{ fontSize: 12, color: "#6a707a", margin: "8px 0 0" }}>{consent}</p>}
        {poweredBy && <p style={{ fontSize: 12, color: "#6a707a", margin: "6px 0 0", textAlign: "center" }}>Chat by Leadworks</p>}
      </form>
    </div>
  );
}
