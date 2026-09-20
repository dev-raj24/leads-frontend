"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSaveAiConfig } from "@/hooks/aiConfig/mutation";
import { useAiConfig } from "@/hooks/aiConfig/query";
import type { BusinessProfile } from "@/types/models";

const EMPTY: BusinessProfile = { about: "", services: "", timings: "", tone: "", faqs: "" };

export function BusinessProfileForm() {
  const { data, isLoading } = useAiConfig();
  const save = useSaveAiConfig();
  const [form, setForm] = useState<BusinessProfile>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.config) setForm(data.config);
  }, [data]);

  const set = (key: keyof BusinessProfile, value: string) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="pnl pad">
        <Skeleton width="40%" height={16} />
        <Skeleton height={80} style={{ marginTop: 16 }} />
      </div>
    );
  }

  return (
    <form
      className="pnl pad"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(form, { onSuccess: () => setSaved(true) });
      }}
    >
      <div className="form-grid">
        <div className="field full">
          <label className="flabel" htmlFor="bp-about">About your business</label>
          <textarea id="bp-about" className="finput" rows={3} maxLength={3000} value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="Family dental clinic in Indore, 12 years, painless treatments…" />
        </div>
        <div className="field full">
          <label className="flabel" htmlFor="bp-services">Services and prices</label>
          <textarea id="bp-services" className="finput" rows={4} maxLength={3000} value={form.services} onChange={(e) => set("services", e.target.value)} placeholder={"Cleaning — ₹800\nRoot canal — from ₹4,500\nBraces consult — free"} />
        </div>
        <div className="field">
          <label className="flabel" htmlFor="bp-timings">Opening hours</label>
          <input id="bp-timings" className="finput" maxLength={500} value={form.timings} onChange={(e) => set("timings", e.target.value)} placeholder="Mon–Sat, 10am–7pm" />
        </div>
        <div className="field">
          <label className="flabel" htmlFor="bp-tone">Tone of voice</label>
          <input id="bp-tone" className="finput" maxLength={200} value={form.tone} onChange={(e) => set("tone", e.target.value)} placeholder="Warm, professional, short" />
        </div>
        <div className="field full">
          <label className="flabel" htmlFor="bp-faqs">Common questions and answers</label>
          <textarea id="bp-faqs" className="finput" rows={4} maxLength={4000} value={form.faqs} onChange={(e) => set("faqs", e.target.value)} placeholder={"Is there parking? Yes, free parking behind the building.\nDo you take insurance? Yes, most major plans."} />
        </div>
      </div>

      {save.isError && <div className="auth-err">Couldn&apos;t save — please try again.</div>}
      <div className="form-foot">
        <Button type="submit" loading={save.isPending} loadingText="Saving…">Save business profile</Button>
        {saved && <span className="hint" style={{ margin: 0 }}>Saved — the AI now uses this.</span>}
      </div>
    </form>
  );
}
