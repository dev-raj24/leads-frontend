"use client";

import { useState } from "react";

/** Dark code block with a copy button — used for the widget / blog embed snippets. */
export function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="snip">
      <button onClick={copy} className={`snip-copy ${copied ? "done" : ""}`}>
        {copied ? "COPIED" : "COPY"}
      </button>
      <pre>{code}</pre>
    </div>
  );
}
