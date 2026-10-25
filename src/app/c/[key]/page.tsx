"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatPanel, type PanelMessage } from "@/components/ChatPanel";
import { env } from "@/config/env";
import type { ChatDesign } from "@/types/models";

interface ChatConfig {
  enabled: boolean;
  businessName: string;
  design: ChatDesign;
  consent: string;
  poweredBy: boolean;
}

interface ServerMessage {
  id: string;
  from: "visitor" | "ai" | "team";
  body: string;
  createdAt: string;
}

const POLL_MS = 4000;
const storeKey = (key: string) => `lw-chat-${key}`;

const readStored = (key: string): string | null => {
  try {
    return window.localStorage.getItem(storeKey(key));
  } catch {
    return null;
  }
};
const writeStored = (key: string, value: string | null) => {
  try {
    if (value) window.localStorage.setItem(storeKey(key), value);
    else window.localStorage.removeItem(storeKey(key));
  } catch {
    return;
  }
};

const pageStyle = { minHeight: "100dvh", background: "#f6f3ea", display: "grid", placeItems: "center", padding: "16px", boxSizing: "border-box" } as const;
const wrapStyle = { width: "100%", maxWidth: 440 } as const;
const smallInput = { flex: 1, minWidth: 0, border: "1px solid #d8d2c4", borderRadius: 10, padding: "8px 10px", fontSize: 14, font: "inherit", boxSizing: "border-box" } as const;

export default function HostedChatPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [server, setServer] = useState<ServerMessage[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const leadRef = useRef<string | null>(null);

  useEffect(() => {
    fetch(`${env.apiUrl}/api/public/chat/config?siteKey=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ChatConfig) => {
        setConfig(data);
        setState(data.enabled ? "ready" : "missing");
        document.title = `Chat with ${data.businessName}`;
        const stored = readStored(key);
        if (stored && data.enabled) {
          leadRef.current = stored;
          setLeadId(stored);
        }
      })
      .catch(() => setState("missing"));
  }, [key]);

  const refresh = useCallback(
    async (id: string) => {
      const res = await fetch(`${env.apiUrl}/api/public/chat/${id}/messages?siteKey=${encodeURIComponent(key)}`);
      if (res.status === 404) {
        writeStored(key, null);
        leadRef.current = null;
        setLeadId(null);
        setServer([]);
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { messages: ServerMessage[] };
      setServer(data.messages);
    },
    [key],
  );

  useEffect(() => {
    if (!leadId) return;
    refresh(leadId).catch(() => undefined);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh(leadId).catch(() => undefined);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [leadId, refresh]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setError("");
    setSending(true);
    setPending(body);
    setText("");
    try {
      const existing = leadRef.current;
      const url = existing ? `${env.apiUrl}/api/public/chat/${existing}/message` : `${env.apiUrl}/api/public/chat/start`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ siteKey: key, message: body, name: name.trim() || undefined, contact: contact.trim() || undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { leadId?: string };
      const id = existing ?? data.leadId ?? null;
      if (id && !existing) {
        leadRef.current = id;
        writeStored(key, id);
        setLeadId(id);
      }
      if (id) await refresh(id);
    } catch (err) {
      setText(body);
      setError(err instanceof Error && err.message === "429" ? "You're sending messages too fast. Please wait a moment." : "Your message didn't go through. Please try again.");
    } finally {
      setPending(null);
      setSending(false);
    }
  }

  const messages: PanelMessage[] = useMemo(() => {
    const out: PanelMessage[] = [];
    if (config) out.push({ id: "greeting", from: "ai", body: config.design.greeting });
    for (const m of server) out.push({ id: m.id, from: m.from, body: m.body });
    if (pending) out.push({ id: "pending", from: "visitor", body: pending });
    return out;
  }, [config, server, pending]);

  if (state === "loading") return <main style={pageStyle} />;

  if (state === "missing" || !config) {
    return (
      <main style={pageStyle}>
        <div style={{ ...wrapStyle, background: "#fff", border: "1px solid #e6e3dc", borderRadius: 20, padding: "28px 24px", color: "#16301f", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Chat isn&apos;t available</h1>
          <p style={{ color: "#4b5f52" }}>This chat is switched off or the link is wrong. Please contact the business directly.</p>
        </div>
      </main>
    );
  }

  const first = !leadId && server.length === 0;

  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <ChatPanel
          design={config.design}
          messages={messages}
          value={text}
          onValueChange={setText}
          onSend={send}
          sending={sending}
          error={error}
          consent={config.consent}
          poweredBy={config.poweredBy}
          intro={
            first ? (
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <input style={smallInput} placeholder="Your name (optional)" value={name} maxLength={120} autoComplete="name" onChange={(e) => setName(e.target.value)} aria-label="Your name" />
                <input style={smallInput} placeholder="Phone or email (optional)" value={contact} maxLength={160} autoComplete="email" onChange={(e) => setContact(e.target.value)} aria-label="Phone or email" />
              </div>
            ) : null
          }
        />
      </div>
    </main>
  );
}
