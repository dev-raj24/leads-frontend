"use client";

import { useState } from "react";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { env } from "@/config/env";

interface Platform {
  id: string;
  label: string;
  who: string;
  code?: (key: string) => string;
  steps: string[];
}

const plainScript = (key: string) =>
  `<script src="${env.apiUrl}/widget.js"\n  data-site-key="${key}"\n  data-api="${env.apiUrl}">\n</script>`;

const nextScript = (key: string) =>
  `import Script from "next/script";\n\n<Script\n  src="${env.apiUrl}/widget.js"\n  data-site-key="${key}"\n  data-api="${env.apiUrl}"\n  strategy="afterInteractive"\n/>`;

const PLATFORMS: Platform[] = [
  {
    id: "html",
    label: "Any website",
    who: "A site made of plain pages, or built by a developer or an agency.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "Open the page file of your site, or the shared footer file if there is one, and find the very end, just above </body>.",
      "Paste the code there and save. Pasting it in the shared footer covers every page at once.",
    ],
  },
  {
    id: "wordpress",
    label: "WordPress",
    who: "Sites made with WordPress, including Elementor and Divi.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "In your WordPress dashboard open Plugins, then Add New, search for \"WPCode\", then Install and Activate.",
      "Open Code Snippets, then Header & Footer. Paste the code in the Footer box and press Save.",
      "You never need to touch theme files. The code stays even when you change the theme.",
    ],
  },
  {
    id: "shopify",
    label: "Shopify",
    who: "Online stores on Shopify.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "In Shopify admin open Online Store, then Themes. Next to your live theme press the three dots and choose Edit code.",
      "Under Layout open theme.liquid. Scroll to the bottom and paste the code just above </body>.",
      "Press Save. Open your store in a new tab to check.",
    ],
  },
  {
    id: "wix",
    label: "Wix",
    who: "Sites on Wix. Needs a paid Wix plan with your own domain.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "In Wix open Settings, then Custom code (under Advanced).",
      "Press Add custom code and paste it. Choose All pages and place it in Body - end.",
      "Press Apply, then publish your site.",
    ],
  },
  {
    id: "builders",
    label: "Squarespace / Webflow",
    who: "Squarespace and Webflow sites.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "Squarespace: Settings, then Developer tools, then Code injection, and paste it in the Footer box.",
      "Webflow: Project settings, then Custom code, and paste it in Footer code.",
      "Save and publish your site.",
    ],
  },
  {
    id: "react",
    label: "React / Vite",
    who: "Apps built with React, Vite or Create React App.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "Open index.html. In Create React App it is inside the public folder; in Vite it is in the project root.",
      "Paste the code just above </body> and deploy again.",
      "The chat and offers stay on screen as visitors move between pages.",
    ],
  },
  {
    id: "next",
    label: "Next.js",
    who: "Sites built with Next.js.",
    code: nextScript,
    steps: [
      "Copy the code above.",
      "App router: open app/layout.tsx. Pages router: open pages/_app.tsx.",
      "Add the import at the top, and the Script tag inside the page, just before the closing body tag.",
      "Deploy. Because of strategy afterInteractive it loads once and survives page changes.",
    ],
  },
  {
    id: "gtm",
    label: "Google Tag Manager",
    who: "Sites that already use Tag Manager and cannot be edited directly.",
    code: plainScript,
    steps: [
      "Copy the code above.",
      "In Tag Manager choose Tags, then New, then Custom HTML, and paste the code.",
      "For the trigger pick All Pages, save, then Submit and publish the container.",
      "If \"Is it installed?\" stays grey after a few minutes, paste the code straight into the site instead.",
    ],
  },
];

const FREE_PARTS = ["Enquiry form", "Contact button", "Catch your existing forms"];
const PRO_PARTS = ["AI chat", "Offers and popups", "Blog on your site", "SEO fixes on the page"];

const developerMessage = (key: string, platform: Platform) =>
  [
    "Please add this one line to our website, just before the closing </body> tag, on every page.",
    "",
    platform.code ? platform.code(key) : plainScript(key),
    "",
    `Site type: ${platform.label}.`,
    "It is a single third-party script. It loads asynchronously and does not change the design of the site.",
  ].join("\n");

export function InstallGuide({ apiKey, isPro }: { apiKey: string; isPro: boolean }) {
  const [id, setId] = useState("html");
  const [copied, setCopied] = useState(false);
  const platform = PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];

  function copyForDeveloper() {
    navigator.clipboard?.writeText(developerMessage(apiKey, platform));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="pnl pad" style={{ display: "grid", gap: 20 }}>
      <div>
        <div className="module-t">One code for everything</div>
        <p className="module-d" style={{ margin: "6px 0 0" }}>
          You paste one small piece of code on your website, one time. After that you never touch the site again. Chat, offers, blog and the enquiry form
          are all switched on and off from this dashboard, and your plan decides which of them show.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="part" style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 14 }}>
          <div className="part-h"><div className="module-t">Free</div><span className={`pp ${isPro ? "c" : "w"}`}>{isPro ? "INCLUDED" : "YOUR PLAN"}</span></div>
          <ul className="module-d" style={{ margin: "8px 0 0", paddingLeft: 18, listStyle: "disc" }}>
            {FREE_PARTS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="part" style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 14 }}>
          <div className="part-h"><div className="module-t">Pro</div><span className={`pp ${isPro ? "p" : "c"}`}>{isPro ? "YOUR PLAN" : "UPGRADE"}</span></div>
          <ul className="module-d" style={{ margin: "8px 0 0", paddingLeft: 18, listStyle: "disc", opacity: isPro ? 1 : 0.65 }}>
            {PRO_PARTS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>

      <div>
        <div className="flabel" style={{ marginBottom: 8 }}>What is your website made with?</div>
        <div className="seg" role="tablist" style={{ flexWrap: "wrap" }}>
          {PLATFORMS.map((p) => (
            <button key={p.id} role="tab" aria-selected={id === p.id} className={id === p.id ? "on" : ""} onClick={() => setId(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <p className="hint" style={{ margin: "10px 0 0" }}>{platform.who} Not sure? Pick &ldquo;Any website&rdquo; and send the message below to whoever built your site.</p>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {platform.code && <CodeSnippet code={platform.code(apiKey)} />}
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, listStyle: "decimal" }}>
          {platform.steps.map((s) => (
            <li key={s} className="module-d" style={{ margin: 0 }}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="pill-opt" onClick={copyForDeveloper}>
          {copied ? "Copied. Now paste it in WhatsApp or email" : "Copy a message for my developer"}
        </button>
        <span className="hint" style={{ margin: 0 }}>It has the code and exact instructions in plain words.</span>
      </div>
    </div>
  );
}
