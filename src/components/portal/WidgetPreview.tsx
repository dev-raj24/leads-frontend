"use client";

import type { OfferPayload } from "@/types/models";

const ACTION_TEXT: Record<string, string> = { whatsapp: "Chat on WhatsApp", promo: "Get the code", link: "Claim offer", form: "Get this offer" };
const DEFAULT_BRAND = "#0b5d4b";

type PreviewOffer = Required<Pick<OfferPayload, "title" | "body" | "displayMode" | "actionType" | "targetUrl" | "whatsappNumber" | "promoCode" | "color" | "textColor" | "buttonText" | "styleVariant" | "successMessage" | "fontFamily" | "radius" | "customCss">>;

interface WidgetPreviewProps {
  offer?: PreviewOffer;
  height?: number;
  inline?: boolean;
}

const readable = (hex: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? "#111827" : "#ffffff";
};

export function WidgetPreview({ offer, height = 420, inline = false }: WidgetPreviewProps) {
  if (!offer) return <div className="pnl pad hint" style={{ minHeight: height }}>Fill in the offer to see it here.</div>;

  const base = offer.color && offer.color !== "auto" ? offer.color : DEFAULT_BRAND;
  const soft = offer.styleVariant === "soft";
  const bg = soft ? `${base}22` : base;
  const fg = offer.textColor || (soft ? base : readable(base));
  const radius = offer.radius === "square" ? 4 : 14;
  const label = offer.buttonText || ACTION_TEXT[offer.actionType] || ACTION_TEXT.link;
  const modal = offer.displayMode === "modal" && !inline;
  const hidden = offer.displayMode === "none" && !inline;

  const card = (
    <div style={{ background: modal ? "#fff" : bg, color: modal ? "#16301f" : fg, border: soft ? `1px solid ${base}55` : 0, borderRadius: radius, padding: "16px 18px", maxWidth: 340, boxShadow: "0 8px 28px rgba(0,0,0,0.18)", fontFamily: offer.fontFamily === "inherit" ? "inherit" : "system-ui, sans-serif" }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{offer.title || "Your offer title"}</div>
      {offer.body && <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>{offer.body}</div>}
      {offer.actionType === "form" && (
        <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
          <div style={{ background: "#fff", color: "#9ca3af", borderRadius: radius / 2, padding: "8px 10px", fontSize: 13 }}>Your name</div>
          <div style={{ background: "#fff", color: "#9ca3af", borderRadius: radius / 2, padding: "8px 10px", fontSize: 13 }}>Phone number or email</div>
        </div>
      )}
      <span style={{ display: "inline-block", background: modal ? base : soft ? base : "#d9f99d", color: modal ? readable(base) : soft ? readable(base) : "#121a26", borderRadius: offer.radius === "square" ? 4 : 999, padding: "8px 14px", fontWeight: 700, fontSize: 13 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ height, borderRadius: 14, border: "1px solid var(--line)", background: "repeating-linear-gradient(45deg,#f4f1ea,#f4f1ea 12px,#efebe1 12px,#efebe1 24px)", position: "relative", overflow: "hidden", padding: 18 }}>
      <div style={{ color: "#6b6558", fontFamily: "Georgia, serif" }}>
        <b style={{ display: "block", fontSize: 19, color: "#3d3a31", marginBottom: 6 }}>Your website</b>
        This is roughly how the offer looks on your page.
      </div>
      {hidden && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#6b6558" }}>Hidden. Only shown where you place it.</div>}
      {!hidden && inline && <div style={{ marginTop: 18 }}>{card}</div>}
      {!hidden && !inline && modal && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(16,21,28,0.45)", display: "grid", placeItems: "center", padding: 16 }}>{card}</div>
      )}
      {!hidden && !inline && !modal && <div style={{ position: "absolute", left: 16, bottom: 16 }}>{card}</div>}
    </div>
  );
}
