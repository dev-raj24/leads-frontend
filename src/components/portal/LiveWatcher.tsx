"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatConversations } from "@/hooks/chatWidget/query";
import { useLeads } from "@/hooks/leads/query";

interface Toast {
  id: string;
  title: string;
  text: string;
  href: string;
}

const TOAST_MS = 9000;

/** Polls the inbox and tells the owner — toast, and a count in the browser tab — the moment something new lands. */
export function LiveWatcher() {
  const { data: leads } = useLeads();
  const { data: chats } = useChatConversations();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unseen, setUnseen] = useState(0);
  const baseTitle = useRef("");
  const seenLeads = useRef<Set<string> | null>(null);
  const seenChats = useRef<Set<string> | null>(null);

  const push = useCallback((toast: Toast) => {
    setToasts((t) => [...t.slice(-3), toast]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), TOAST_MS);
    if (document.hidden) setUnseen((n) => n + 1);
  }, []);

  useEffect(() => {
    baseTitle.current = document.title;
    const onVisible = () => {
      if (!document.hidden) setUnseen(0);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  useEffect(() => {
    if (!baseTitle.current) return;
    document.title = unseen > 0 ? `(${unseen}) New activity · Leadworks` : baseTitle.current;
  }, [unseen]);

  useEffect(() => {
    if (!leads) return;
    if (seenLeads.current === null) {
      seenLeads.current = new Set(leads.leads.map((l) => l.id));
      return;
    }
    for (const lead of leads.leads) {
      if (seenLeads.current.has(lead.id)) continue;
      seenLeads.current.add(lead.id);
      push({ id: `lead:${lead.id}`, title: "New lead", text: `${lead.name ?? lead.contact} just got in touch.`, href: `/leads/${lead.id}` });
    }
  }, [leads, push]);

  useEffect(() => {
    if (!chats) return;
    const known = seenChats.current;
    const currentKeys = chats.conversations.flatMap((c) => [`new:${c.leadId}`, ...(c.needsReply ? [`msg:${c.leadId}:${c.lastMessageAt}`] : [])]);
    if (known === null) {
      seenChats.current = new Set(currentKeys);
      return;
    }
    for (const c of chats.conversations) {
      const newKey = `new:${c.leadId}`;
      const msgKey = `msg:${c.leadId}:${c.lastMessageAt}`;
      if (!known.has(newKey)) {
        known.add(newKey);
        if (c.needsReply) known.add(msgKey);
        push({ id: newKey, title: "New chat on your site", text: c.lastMessage.slice(0, 90), href: "/chats" });
      } else if (c.needsReply && !known.has(msgKey)) {
        known.add(msgKey);
        push({ id: msgKey, title: "New chat message", text: c.lastMessage.slice(0, 90), href: "/chats" });
      }
    }
  }, [chats, push]);

  if (toasts.length === 0) return null;

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <Link key={t.id} href={t.href} className="toast" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}>
          <b>{t.title}</b>
          <span>{t.text}</span>
        </Link>
      ))}
    </div>
  );
}
