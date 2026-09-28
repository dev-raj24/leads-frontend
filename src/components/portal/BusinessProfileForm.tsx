"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { HoursPicker } from "@/components/portal/HoursPicker";
import { ServicesEditor } from "@/components/portal/ServicesEditor";
import { useSaveAiConfig } from "@/hooks/aiConfig/mutation";
import { useAiConfig } from "@/hooks/aiConfig/query";
import { useUpdateIndustry } from "@/hooks/tenant/mutation";
import { useTenant } from "@/hooks/tenant/query";
import type { BusinessProfile } from "@/types/models";

const EMPTY: BusinessProfile = { about: "", services: [], timings: "", tone: "", faqs: "" };

export const INDUSTRIES = [
  "Clinic / Healthcare",
  "Salon / Spa",
  "Real estate",
  "Coaching / Education",
  "Restaurant / Cafe",
  "Retail / E-commerce",
  "Home services",
  "Legal / Consulting",
  "Fitness / Gym",
  "Other",
];

const TONES = ["Warm & friendly", "Professional", "Casual & fun", "Formal", "Straight to the point"];

interface BusinessProfileFormProps {
  /** Onboarding mode: shows the industry picker and a "Continue" CTA instead of "Save". */
  onboarding?: boolean;
  onSaved?: () => void;
}

export function BusinessProfileForm({ onboarding = false, onSaved }: BusinessProfileFormProps) {
  const { data, isLoading } = useAiConfig();
  const { data: tenantData, isLoading: tenantLoading } = useTenant();
  const save = useSaveAiConfig();
  const updateIndustry = useUpdateIndustry();
  const [form, setForm] = useState<BusinessProfile>(EMPTY);
  const [industry, setIndustry] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.config) setForm(data.config);
  }, [data]);

  useEffect(() => {
    if (tenantData?.tenant.industry) setIndustry(tenantData.tenant.industry);
  }, [tenantData]);

  function set<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  const saving = save.isPending || updateIndustry.isPending;
  const loading = isLoading || (onboarding && tenantLoading);

  if (loading) {
    return (
      <div className="pnl pad">
        <Skeleton width="40%" height={16} />
        <Skeleton height={80} style={{ marginTop: 16 }} />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tasks: Promise<unknown>[] = [save.mutateAsync(form)];
    if (onboarding && industry) tasks.push(updateIndustry.mutateAsync(industry));
    try {
      await Promise.all(tasks);
      setSaved(true);
      onSaved?.();
    } catch {
      // surfaced via save.isError / updateIndustry.isError below
    }
  }

  return (
    <form className={onboarding ? undefined : "pnl pad"} onSubmit={handleSubmit}>
      <div className="form-grid">
        {onboarding && (
          <div className="field full">
            <label className="flabel" htmlFor="bp-industry">What kind of business is this?</label>
            <select id="bp-industry" className="finput" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
              <option value="" disabled>Choose one…</option>
              {INDUSTRIES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}
        <div className="field full">
          <label className="flabel" htmlFor="bp-about">About your business</label>
          <textarea id="bp-about" className="finput" rows={3} maxLength={3000} value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="Family dental clinic in Indore, 12 years, painless treatments…" />
        </div>
        <div className="field full">
          <label className="flabel">Services and prices</label>
          <ServicesEditor value={form.services} onChange={(services) => set("services", services)} />
        </div>
        <div className="field full">
          <label className="flabel">Opening hours</label>
          <HoursPicker value={form.timings} onChange={(summary) => set("timings", summary)} />
        </div>
        <div className="field full">
          <label className="flabel">Tone of voice</label>
          <div className="pill-row">
            {TONES.map((t) => (
              <button key={t} type="button" className={`pill-opt ${form.tone === t ? "on" : ""}`} onClick={() => set("tone", t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="field full">
          <label className="flabel" htmlFor="bp-faqs">Common questions and answers</label>
          <textarea id="bp-faqs" className="finput" rows={4} maxLength={4000} value={form.faqs} onChange={(e) => set("faqs", e.target.value)} placeholder={"Is there parking? Yes, free parking behind the building.\nDo you take insurance? Yes, most major plans."} />
        </div>
      </div>

      {(save.isError || updateIndustry.isError) && <div className="auth-err">Couldn&apos;t save — please try again.</div>}
      <div className="form-foot">
        <Button type="submit" loading={saving} loadingText="Saving…">{onboarding ? "Continue" : "Save business profile"}</Button>
        {saved && !onboarding && <span className="hint" style={{ margin: 0 }}>Saved — the AI now uses this.</span>}
      </div>
    </form>
  );
}
