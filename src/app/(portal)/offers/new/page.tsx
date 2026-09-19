"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHead } from "@/components/portal/PageHead";
import { useGetOffers } from "@/hooks/offer/query";
import { useCreateOffer, useUpdateOffer } from "@/hooks/offer/mutation";
import type { OfferPayload } from "@/types/models";
import { Button } from "@/components/ui/Button";

const DISPLAY = [
  ["top", "Top banner"],
  ["bottom-left", "Bottom corner"],
  ["none", "Hidden"],
] as const;
const ACTIONS = [
  ["link", "Open a link"],
  ["whatsapp", "WhatsApp chat"],
  ["promo", "Show promo code"],
] as const;

function OfferForm() {
  const router = useRouter();
  const editId = useSearchParams().get("id");
  const { data } = useGetOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();

  const [form, setForm] = useState<Required<Pick<OfferPayload, "title" | "body" | "displayMode" | "actionType" | "targetUrl" | "whatsappNumber" | "promoCode" | "color">>>({
    title: "", body: "", displayMode: "top", actionType: "link", targetUrl: "", whatsappNumber: "", promoCode: "", color: "#0b5d4b",
  });
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = editId ? data?.offers.find((o) => o.id === editId) : undefined;
    if (!existing) return;
    setForm({
      title: existing.title,
      body: existing.body ?? "",
      displayMode: existing.displayMode ?? "top",
      actionType: existing.actionType ?? "link",
      targetUrl: existing.targetUrl ?? "",
      whatsappNumber: existing.whatsappNumber ?? "",
      promoCode: existing.promoCode ?? "",
      color: existing.color ?? "#0b5d4b",
    });
    setActive(existing.active);
  }, [editId, data]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const saving = createOffer.isPending || updateOffer.isPending;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Give your offer a title.");
    setError(null);
    const opts = { onSuccess: () => router.push("/offers"), onError: () => setError("Couldn't save the offer — is leadworks-api running?") };
    if (editId) updateOffer.mutate({ id: editId, ...form, active }, opts);
    else createOffer.mutate({ ...form, active }, opts);
  }

  return (
    <>
      <Link href="/offers" className="back">← All offers</Link>
      <PageHead eyebrow={editId ? "Editing" : "New"} title={editId ? "Edit offer" : <>Create an <em>offer</em></>} sub="It appears on your website as soon as it's live." />

      <form className="pnl pad" onSubmit={submit} style={{ maxWidth: 760 }}>
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
            <span className="flabel">Where to show it</span>
            <div className="pill-row">
              {DISPLAY.map(([v, l]) => <button type="button" key={v} className={`pill-opt ${form.displayMode === v ? "on" : ""}`} onClick={() => set("displayMode", v)}>{l}</button>)}
            </div>
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

          <div className="field">
            <label className="flabel" htmlFor="color">Banner colour</label>
            <input id="color" type="color" value={form.color} onChange={(e) => set("color", e.target.value)} style={{ width: 64, height: 40, border: "1px solid #d5d2ca", borderRadius: 10, background: "#fff", padding: 3, cursor: "pointer" }} />
          </div>
          <div className="field" style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 22 }}>
            <button type="button" className={`tgl ${active ? "on" : ""}`} onClick={() => setActive((a) => !a)} role="switch" aria-checked={active} aria-label="Live" />
            <span className="flabel" style={{ margin: 0 }}>{active ? "Live on your site" : "Saved as paused"}</span>
          </div>
        </div>

        {error && <div className="auth-err">{error}</div>}
        <div className="form-foot">
          <Button type="submit" loading={saving} loadingText="Saving…">{editId ? "Save changes" : "Create offer"}</Button>
          <Button href="/offers" variant="secondary">Cancel</Button>
        </div>
      </form>
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
