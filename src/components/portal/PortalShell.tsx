"use client";

import { useState } from "react";
import { AiPanel } from "@/components/portal/AiPanel";
import { PortalNav } from "@/components/portal/PortalNav";

/** Top-navigation workspace frame; the AI assistant lives in a slide-over drawer. */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="ps">
      <PortalNav onOpenAi={() => setAiOpen(true)} />
      <main className="ps-main">{children}</main>
      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
