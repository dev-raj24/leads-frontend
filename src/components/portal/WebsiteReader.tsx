"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSaveAiConfig } from "@/hooks/aiConfig/mutation";
import { useAiConfig } from "@/hooks/aiConfig/query";
import { useInspectSite } from "@/hooks/sites/inspect";
import { authErrorMessage } from "@/lib/errors";
import type { BusinessProfile } from "@/types/models";

function merge(current: BusinessProfile, draft: BusinessProfile): BusinessProfile {
  const known = new Set(current.services.map((s) => s.name.trim().toLowerCase()));
  const added = draft.services.filter((s) => !known.has(s.name.trim().toLowerCase()));
  return {
    about: current.about.trim() ? current.about : draft.about,
    timings: current.timings.trim() ? current.timings : draft.timings,
    tone: current.tone.trim() ? current.tone : draft.tone,
    faqs: current.faqs.trim() ? current.faqs : draft.faqs,
    services: [...current.services, ...added].slice(0, 30),
  };
}

export function WebsiteReader({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const inspect = useInspectSite();
  const { data: ai } = useAiConfig();
  const save = useSaveAiConfig();
  const result = inspect.data?.inspection;
  const draft = result?.draft ?? null;

  return (
    <div className="pnl pad" style={{ display: "grid", gap: 14 }}>
      <div className="seo-form" style={{ padding: 0 }}>
        <label className="field" style={{ margin: 0, flex: 1, minWidth: 220 }}>
          <span className="flabel">Your website address</span>
          <input className="finput" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourshop.com" inputMode="url" />
        </label>
        <Button loading={inspect.isPending} loadingText="Reading your site…" disabled={!url.trim()} onClick={() => inspect.mutate(url.trim())}>Read my website</Button>
      </div>
      {inspect.isError && <div className="auth-err">{authErrorMessage(inspect.error)}</div>}

      {result && !result.reachable && <div className="state-err">We couldn&apos;t open that address. Check it is spelled right and the site is online.</div>}

      {result?.reachable && (
        <>
          <div className="module-d">
            {result.scriptFound && result.keyMatches ? (
              <><span className="pp w" style={{ marginRight: 8 }}>● INSTALLED</span>Your Leadworks script is on this website and is using your key.</>
            ) : result.scriptFound ? (
              <><span className="pp r" style={{ marginRight: 8 }}>WRONG KEY</span>A Leadworks script is on this site, but with a different key. Copy the snippet from this page again.</>
            ) : (
              <><span className="pp c" style={{ marginRight: 8 }}>NOT FOUND</span>We could not see the Leadworks script on this page. Paste the snippet below before &lt;/body&gt; on every page.</>
            )}
          </div>
          {result.jsRendered && (
            <p className="hint" style={{ margin: 0 }}>This site builds its pages in the browser, so we could read very little of it.</p>
          )}

          {draft && (
            <div className="seo-apply">
              <div className="seo-fix-h"><b>What we found on your site</b><small>{result.pagesRead} {result.pagesRead === 1 ? "page" : "pages"} read</small></div>
              {draft.about && <p style={{ margin: "0 0 8px" }}>{draft.about}</p>}
              {draft.services.length > 0 && (
                <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
                  {draft.services.map((s) => <li key={s.name}><b>{s.name}</b>{s.price ? ` · ${s.price}` : ""}{s.description ? `: ${s.description}` : ""}</li>)}
                </ul>
              )}
              {draft.timings && <p style={{ margin: "0 0 8px" }}><b>Hours:</b> {draft.timings}</p>}
              <p className="hint" style={{ margin: "0 0 10px" }}>Check this before you use it. We only fill what is empty in your profile and add services you do not have yet. Nothing you wrote is replaced.</p>
              <Button size="sm" loading={save.isPending} loadingText="Saving…" disabled={!ai} onClick={() => ai && save.mutate(merge(ai.config, draft))}>
                {save.isSuccess ? "Saved to my profile" : "Use this for my business profile"}
              </Button>
              {save.isError && <div className="auth-err" style={{ marginTop: 10 }}>{authErrorMessage(save.error)}</div>}
            </div>
          )}
          {!draft && result.draftSkipped === "not_pro" && <p className="hint" style={{ margin: 0 }}>With Pro we can also read your site and fill in your business profile for you.</p>}
          {!draft && result.draftSkipped === "ai_unavailable" && <p className="hint" style={{ margin: 0 }}>The AI was busy and could not write your profile just now. Try again in a minute.</p>}
          {!draft && result.draftSkipped === "no_text" && !result.jsRendered && <p className="hint" style={{ margin: 0 }}>There was too little text on the page to build a profile from.</p>}
        </>
      )}
    </div>
  );
}
