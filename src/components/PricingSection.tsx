"use client";

import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/icons";

export function PricingSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 32 }}>
      {/* Starter Plan */}
      <div style={{ background: "#ffffff", border: "1px solid #e4e7ec", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Starter</h3>
        <p style={{ fontSize: 14, color: "#475467", marginBottom: 24 }}>Perfect for solopreneurs getting started with lead capture.</p>
        <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>
          ₹0 <span style={{ fontSize: 14, fontWeight: 500, color: "#667085" }}>/ forever</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> Up to 50 leads/month</li>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> Web chat widget</li>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> Unified Inbox</li>
        </ul>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "12px 20px", background: "#f2f4f7", color: "#344054", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Get Started Free</button>
        </Link>
      </div>

      {/* Pro Plan */}
      <div style={{ background: "#ffffff", border: "2px solid #155EEF", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", position: "relative" }}>
        <span style={{ position: "absolute", top: -14, right: 24, background: "#155EEF", color: "white", padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Popular</span>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Pro</h3>
        <p style={{ fontSize: 14, color: "#475467", marginBottom: 24 }}>AI-powered auto responses & smart lead follow-ups.</p>
        <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>
          ₹999 <span style={{ fontSize: 14, fontWeight: 500, color: "#667085" }}>/ month</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> Unlimited leads</li>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> AI Instant Responder</li>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> WhatsApp integration</li>
          <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#344054" }}><IconCheck size={16} color="#155EEF" /> Automated follow-ups</li>
        </ul>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "12px 20px", background: "#155EEF", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Start Free Trial <IconArrowRight size={16} /></button>
        </Link>
      </div>
    </div>
  );
}
