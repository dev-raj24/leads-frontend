"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { IconSparkle, IconSend } from "@/components/icons";

type Message = {
  id: number;
  role: "user" | "assistant" | "summary";
  content: React.ReactNode;
};

// console.log

const initialMessages: Message[] = [];

export function AiPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:4001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({
                role: m.role === "assistant" || m.role === "summary" ? "assistant" : "user",
                content: typeof m.content === "string" ? m.content : "Data from UI",
              })),
              { role: "user", content: input.trim() }
            ]
          }),
        });

        const data = await response.json();

        if (response.ok && data.reply) {
          const assistantMessage: Message = {
            id: Date.now() + 1,
            role: "assistant",
            content: data.reply,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error(data.error || "Failed to fetch response");
        }
      } catch (error) {
        console.error("Chat Error:", error);
        const errorMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 50);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <aside className="p-ai" style={{ overflow: "hidden" }}>
      <div className="p-ait">
        <IconSparkle size={17} />
        AI assistant
        <span className="serif" style={{ fontSize: 12, color: "#98A2B3", marginLeft: "auto" }}>
          your co-pilot
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8, paddingRight: 4 }}>
        {messages.map((m) => {
          if (m.role === "summary") {
            return (
              <div key={m.id} className="p-sum">
                {m.content}
              </div>
            );
          }
          if (m.role === "user") {
            return (
              <div key={m.id} className="p-bub p-q" style={{ marginLeft: "auto", maxWidth: "88%" }}>
                {m.content}
              </div>
            );
          }
          return (
            <div key={m.id} className="p-bub p-a" style={{ maxWidth: "88%" }}>
              {m.content}
            </div>
          );
        })}
        {isTyping && (
          <div className="p-bub p-a" style={{ maxWidth: "88%" }}>
            <span style={{ opacity: 0.5 }}>Typing...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, flexShrink: 0 }}>
        <span className="p-sg" onClick={() => handleSuggestionClick("Show pending leads")}>Show pending leads</span>
        <span className="p-sg" onClick={() => handleSuggestionClick("This month's report")}>This month&apos;s report</span>
      </div>

      <div className="p-inp" style={{ flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your leads…"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--ink)", fontSize: "inherit", fontFamily: "inherit" }}
        />
        <IconSend size={16} onClick={handleSend} style={{ cursor: "pointer", flexShrink: 0 }} />
      </div>
    </aside>
  );
}
