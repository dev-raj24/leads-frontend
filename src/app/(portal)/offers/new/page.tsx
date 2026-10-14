"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLock, IconTag } from "@/components/icons";
import { EmptyState } from "@/components/portal/EmptyState";
import { MatchSiteFields } from "@/components/portal/MatchSiteFields";
import { PageHead } from "@/components/portal/PageHead";
import { WidgetPreview } from "@/components/portal/WidgetPreview";
import { Button } from "@/components/ui/Button";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { useGetOffers } from "@/hooks/offer/query";
import { useCreateOffer, useUpdateOffer } from "@/hooks/offer/mutation";
import { useTenant } from "@/hooks/tenant/query";
import type { OfferPayload } from "@/types/models";

const DISPLAY = [
  ["bottom-left", "Floating card"],
  ["modal", "Popup"],
  ["none", "Hidden"],
] as const;
const ACTIONS = [
  ["link", "Open a link"],
  ["whatsapp", "WhatsApp chat"],
  ["promo", "Show promo code"],
  ["form", "Collect lead details"],
] as const;
const STYLES = [
  ["solid", "Solid"],
  ["soft", "Soft tint"],
] as const;
const SWATCHES = ["#0b5d4b", "#1d4ed8", "#7c3aed", "#be123c", "#c2410c", "#121a26"];

const toLocalInput = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

type FormState = Required<Pick<OfferPayload, "title" | "body" | "displayMode" | "actionType" | "targetUrl" | "whatsappNumber" | "promoCode" | "color" | "textColor" | "buttonText" | "styleVariant" | "successMessage" | "modalDelay" | "fontFamily" | "radius" | "customCss">>;

const INITIAL: FormState = {
  title: "",
  body: "",
  displayMode: "bottom-left",
  actionType: "link",
  targetUrl: "",
  whatsappNumber: "",
  promoCode: "",
  color: "auto",
  textColor: "",
  buttonText: "",
  styleVariant: "solid",
  successMessage: "",
  modalDelay: 5,
  fontFamily: "system",
  radius: "rounded",
  customCss: "",
};

function OfferForm() {
  const router = useRouter();
  const editId = useSearchParams().get("id");
  const { data } = useGetOffers();
  const { data: tenantData } = useTenant();
  const isPro = tenantData?.tenant.plan === "pro";
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [active, setActive] = useState(true);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewInline, setPreviewInline] = useState(false);

  useEffect(() => {
    const existing = editId ? data?.offers.find((o) => o.id === editId) : undefined;
    if (!existing) return;
    setForm({
      title: existing.title,
      body: existing.body ?? "",
      displayMode: !existing.displayMode || existing.displayMode === "top" ? "bottom-left" : existing.displayMode,
      actionType: existing.actionType ?? "link",
      targetUrl: existing.targetUrl ?? "",
      whatsappNumber: existing.whatsappNumber ?? "",
      promoCode: existing.promoCode ?? "",
      color: existing.color ?? "#0b5d4b",
      textColor: existing.textColor ?? "",
      buttonText: existing.buttonText ?? "",
      styleVariant: existing.styleVariant ?? "solid",
      successMessage: existing.successMessage ?? "",
      modalDelay: existing.modalDelay ?? 5,
      fontFamily: existing.fontFamily ?? "system",
      radius: existing.radius ?? "rounded",
      customCss: existing.customCss ?? "",
    });
    setActive(existing.active);
    setStartsAt(toLocalInput(existing.startsAt));
    setEndsAt(toLocalInput(existing.endsAt));
  }, [editId, data]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const saving = createOffer.isPending || updateOffer.isPending;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Give your offer a title.");
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) return setError("The end time has to be after the start time.");
    setError(null);
    const schedule = { startsAt: startsAt ? new Date(startsAt).toISOString() : null, endsAt: endsAt ? new Date(endsAt).toISOString() : null };
    const opts = { onSuccess: () => router.push("/offers"), onError: () => setError("Couldn't save the offer — is leadworks-api running?") };
    if (editId) updateOffer.mutate({ id: editId, ...form, ...schedule, active }, opts);
    else createOffer.mutate({ ...form, ...schedule, active }, opts);
  }

  if (!editId && !isPro) {
    return (
      <>
        <Link href="/offers" className="back">← All offers</Link>
        <PageHead eyebrow="New" title={<>Create an <em>offer</em></>} sub="Design the offer and save it." />
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="Offers & banners is a Pro feature"
            text="Upgrade to Pro to create banners, popups, promo codes and lead-capture offers for your website."
            action={<Button href="/account" icon={<IconTag size={15} />}>View plans</Button>}
          />
        </div>
      </>
    );
  }

  const isForm = form.actionType === "form";
  const hidden = form.displayMode === "none";
  const embedCode = editId ? `<div data-leadworks-offer="${editId}"></div>` : "";

  return (
    <>
      <Link href="/offers" className="back">← All offers</Link>
      <PageHead eyebrow={editId ? "Editing" : "New"} title={editId ? "Edit offer" : <>Create an <em>offer</em></>} sub="A banner, a popup, or a form for your site." />

      <div className="split">
        <form className="pnl pad" onSubmit={submit}>
          <div className="form-grid">
            <div className="field full">
              <label className="flabel" htmlFor="title">Title</label>
              <input id="title" className="finput" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Weekend special — 20% off cleanings" required />
            </div>
            <div className="field full">
              <label className="flabel" htmlFor="body">Description</label>
              <textarea id="body" className="finput" rows={3} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Book before Sunday and get 20% off." />
            </div>

            <div className="field full">
              <span className="flabel">How it shows</span>
              <div className="pill-row">
                {DISPLAY.map(([v, l]) => <button type="button" key={v} className={`pill-opt ${form.displayMode === v ? "on" : ""}`} onClick={() => set("displayMode", v)}>{l}</button>)}
              </div>
              {form.displayMode === "modal" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <label className="flabel" htmlFor="delay" style={{ margin: 0 }}>Open after</label>
                  <input id="delay" className="finput" type="number" min={0} max={120} value={form.modalDelay} onChange={(e) => set("modalDelay", Math.max(0, Math.min(120, Number(e.target.value) || 0)))} style={{ width: 80 }} />
                  <span className="hint" style={{ margin: 0 }}>seconds · once a day per visitor</span>
                </div>
              )}
              {hidden && <p className="hint" style={{ margin: "8px 0 0" }}>Nothing shows automatically — use the inline embed below to place this offer yourself.</p>}
            </div>

            <div className="field full">
              <span className="flabel">When someone taps it</span>
              <div className="pill-row">
                {ACTIONS.map(([v, l]) => <button type="button" key={v} className={`pill-opt ${form.actionType === v ? "on" : ""}`} onClick={() => set("actionType", v)}>{l}</button>)}
              </div>
            </div>

            {form.actionType === "link" && (
              <div className="field full"><label className="flabel" htmlFor="url">Link</label><input id="url" className="finput" type="url" value={form.targetUrl} onChange={(e) => set("targetUrl", e.target.value)} placeholder="https://yoursite.in/book" /></div>
            )}
            {form.actionType === "whatsapp" && (
              <div className="field full"><label className="flabel" htmlFor="wa">WhatsApp number</label><input id="wa" className="finput" type="tel" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="+91 98765 43210" /></div>
            )}
            {form.actionType === "promo" && (
              <div className="field full"><label className="flabel" htmlFor="promo">Promo code</label><input id="promo" className="finput" value={form.promoCode} onChange={(e) => set("promoCode", e.target.value)} placeholder="WEEKEND20" /></div>
            )}
            {isForm && (
              <>
                <div className="field full">
                  <label className="flabel" htmlFor="success">Thank-you message</label>
                  <input id="success" className="finput" value={form.successMessage} onChange={(e) => set("successMessage", e.target.value)} placeholder="Thanks! We'll call you within an hour." />
                  <p className="hint" style={{ margin: "6px 0 0" }}>Visitors enter their name and phone or email. Each submission becomes a lead tagged &ldquo;Offer&rdquo; in your inbox, and you get an email.</p>
                </div>
                <div className="field full">
                  <label className="flabel" htmlFor="reward">Reward code <span className="hint" style={{ margin: 0 }}>(optional — shown only after they submit)</span></label>
                  <input id="reward" className="finput" value={form.promoCode} onChange={(e) => set("promoCode", e.target.value)} placeholder="WELCOME15" />
                </div>
              </>
            )}

            <div className="field full">
              <label className="flabel" htmlFor="btn">Button text <span className="hint" style={{ margin: 0 }}>(optional)</span></label>
              <input id="btn" className="finput" maxLength={24} value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} placeholder={isForm ? "Get this offer" : "Book now"} />
            </div>

            <div className="field full">
              <span className="flabel">Style</span>
              <div className="pill-row">
                {STYLES.map(([v, l]) => <button type="button" key={v} className={`pill-opt ${form.styleVariant === v ? "on" : ""}`} onClick={() => set("styleVariant", v)}>{l}</button>)}
              </div>
            </div>

            <div className="field full">
              <span className="flabel">Brand colour</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button type="button" className={`pill-opt ${form.color === "auto" ? "on" : ""}`} onClick={() => set("color", "auto")}>Match my website</button>
                {SWATCHES.map((c) => (
                  <button key={c} type="button" aria-label={`Use ${c}`} onClick={() => set("color", c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: form.color === c ? "3px solid #d9f99d" : "2px solid #fff", boxShadow: "0 0 0 1px #d5d2ca", cursor: "pointer" }} />
                ))}
                <input id="color" aria-label="Custom colour" type="color" value={form.color === "auto" ? "#0b5d4b" : form.color} onChange={(e) => set("color", e.target.value)} style={{ width: 44, height: 32, border: "1px solid #d5d2ca", borderRadius: 8, background: "#fff", padding: 2, cursor: "pointer" }} />
              </div>
              {form.color === "auto" && (
                <p className="hint" style={{ margin: "6px 0 0" }}>Uses the colour your website already has. The preview can&apos;t see your site, so it shows the default green; your real pages show your own colour.</p>
              )}
            </div>
            <div className="field">
              <label className="flabel" htmlFor="tcolor">Banner text colour <span className="hint" style={{ margin: 0 }}>(auto)</span></label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input id="tcolor" type="color" value={form.textColor || "#ffffff"} onChange={(e) => set("textColor", e.target.value)} style={{ width: 44, height: 32, border: "1px solid #d5d2ca", borderRadius: 8, background: "#fff", padding: 2, cursor: "pointer" }} />
                {form.textColor && <button type="button" className="hint" style={{ margin: 0, background: "none", border: 0, cursor: "pointer", textDecoration: "underline" }} onClick={() => set("textColor", "")}>Reset</button>}
              </div>
            </div>
            <div className="field" style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 22 }}>
              <button type="button" className={`tgl ${active ? "on" : ""}`} onClick={() => setActive((a) => !a)} role="switch" aria-checked={active} aria-label="Live" />
              <span className="flabel" style={{ margin: 0 }}>{active ? "Live on your site" : "Saved as paused"}</span>
            </div>

            <div className="sec-t full" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>Match your website</div>
            <MatchSiteFields
              kind="offer"
              fontFamily={form.fontFamily}
              radius={form.radius}
              customCss={form.customCss}
              onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            />

            <div className="sec-t full" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>Schedule</div>
            <div className="field">
              <label className="flabel" htmlFor="starts">Starts <span className="hint" style={{ margin: 0 }}>(optional)</span></label>
              <input id="starts" className="finput" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="ends">Ends <span className="hint" style={{ margin: 0 }}>(optional)</span></label>
              <input id="ends" className="finput" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>

          {error && <div className="auth-err">{error}</div>}
          <div className="form-foot">
            <Button type="submit" loading={saving} loadingText="Saving…">{editId ? "Save changes" : "Create offer"}</Button>
            <Button href="/offers" variant="secondary">Cancel</Button>
          </div>
        </form>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <div className="sec-t" style={{ margin: 0 }}>Live preview</div>
            {!hidden && (
              <div className="seg" role="tablist" style={{ margin: 0 }}>
                <button role="tab" aria-selected={!previewInline} className={!previewInline ? "on" : ""} onClick={() => setPreviewInline(false)}>On your site</button>
                <button role="tab" aria-selected={previewInline} className={previewInline ? "on" : ""} onClick={() => setPreviewInline(true)}>Inline</button>
              </div>
            )}
          </div>
          <WidgetPreview offer={form} inline={previewInline || hidden} height={form.displayMode === "modal" && !previewInline ? 520 : 360} />
          <p className="hint">Only the newest live offer inside its schedule shows automatically. This preview runs the real widget, including your custom CSS.</p>

          <div className="sec-t" style={{ marginTop: 20 }}>Put it anywhere on your page</div>
          {editId ? (
            <>
              <CodeSnippet code={embedCode} />
              <p className="hint">
                Paste this where you want the offer {isForm ? "form" : "card"} to appear. It needs your Leadworks snippet on the page (Settings → Website snippet). Leave the value empty — <code>data-leadworks-offer</code> — to always show your newest live offer.
              </p>
            </>
          ) : (
            <p className="hint">Save the offer first and you&apos;ll get its embed code here.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function NewOfferPage() {
  return (
    <Suspense fallback={null}>
      <OfferForm />
    </Suspense>
  );
}
