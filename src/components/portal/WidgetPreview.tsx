"use client";

import { useMemo } from "react";
import { env } from "@/config/env";
import { useDebounced } from "@/hooks/useDebounced";
import type { ChatDesign, OfferPayload } from "@/types/models";

const ACTION_TEXT: Record<string, string> = { whatsapp: "Chat on WhatsApp", promo: "Get the code", link: "Claim offer", form: "Get this offer" };

type PreviewOffer = Required<Pick<OfferPayload, "title" | "body" | "displayMode" | "actionType" | "targetUrl" | "whatsappNumber" | "promoCode" | "color" | "textColor" | "buttonText" | "styleVariant" | "successMessage" | "fontFamily" | "radius" | "customCss">>;

interface WidgetPreviewProps {
  offer?: PreviewOffer;
  chat?: ChatDesign;
  height?: number;
  /** Show the offer as an inline embed card instead of its normal placement. */
  inline?: boolean;
}

// Fresh fetch on every dashboard page load so the preview never runs a stale cached widget.js.
const LOADED_AT = Date.now();

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/'/g, "&#39;");

/**
 * Runs the real widget.js in an iframe in preview mode (no network calls, nothing owner-supplied is ever executed), so what the owner sees —
 * including their custom CSS — is exactly what visitors will get.
 */
export function WidgetPreview({ offer, chat, height = 420, inline = false }: WidgetPreviewProps) {
  const payload = useDebounced(
    useMemo(
      () => ({
        chat,
        offer: offer && {
          ...offer,
          id: "preview",
          displayMode: inline ? "inline" : offer.displayMode,
          actionText: offer.buttonText || ACTION_TEXT[offer.actionType] || ACTION_TEXT.link,
          modalDelay: 0,
        },
      }),
      [offer, chat, inline],
    ),
  );

  const srcDoc = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%}
body{background:repeating-linear-gradient(45deg,#f4f1ea,#f4f1ea 12px,#efebe1 12px,#efebe1 24px);font:15px Georgia,serif;color:#6b6558}
.fake{padding:22px 24px}.fake b{display:block;font-size:19px;color:#3d3a31;margin-bottom:6px}
</style></head><body><div class="fake"><b>Your website</b>This is how the widget sits on your page.</div>
<script src="${env.apiUrl}/widget.js?pv=${LOADED_AT}" data-preview='${attr(JSON.stringify(payload))}'></script></body></html>`,
    [payload],
  );

  return (
    <iframe
      title="Widget preview"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={srcDoc}
      style={{ width: "100%", height, border: "1px solid var(--line)", borderRadius: 14, background: "#f4f1ea", display: "block" }}
    />
  );
}
