"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUpdateSiteSettings } from "@/hooks/sites/mutation";
import type { Site } from "@/types/models";

interface Row {
  name: string;
  required: boolean;
  options: string;
}

const toRows = (raw: unknown): Row[] =>
  Array.isArray(raw)
    ? raw.map((f) => ({
        name: typeof f?.name === "string" ? f.name : "",
        required: f?.required === true,
        options: Array.isArray(f?.options) ? f.options.join(", ") : "",
      }))
    : [];

export function FormFieldsEditor({ site }: { site: Site }) {
  const update = useUpdateSiteSettings();
  const [rows, setRows] = useState<Row[]>(() => toRows(site.settings.leadFields));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setRows(toRows(site.settings.leadFields));
  }, [site.settings.leadFields, dirty]);

  const edit = (i: number, patch: Partial<Row>) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
    setDirty(true);
  };

  function save() {
    const leadFields = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        name: r.name.trim(),
        required: r.required,
        options: r.options.split(",").map((o) => o.trim()).filter(Boolean),
      }));
    update.mutate({ siteId: site.id, settings: { ...site.settings, leadFields } }, { onSuccess: () => setDirty(false) });
  }

  return (
    <div className="pnl pad" style={{ display: "grid", gap: 14 }}>
      <p className="hint" style={{ margin: 0 }}>
        Every form always asks for name, phone or email, and a message. Add the extra questions you need, like which service they want. Their answers show on the lead.
      </p>
      {rows.map((row, i) => (
        <div key={i} className="ffe-row">
          <input className="finput" aria-label="Question" placeholder="Question, e.g. Service" value={row.name} maxLength={40} onChange={(e) => edit(i, { name: e.target.value })} />
          <input className="finput" aria-label="Choices" placeholder="Choices (optional): Braces, Whitening" value={row.options} onChange={(e) => edit(i, { options: e.target.value })} />
          <label className="ffe-req">
            <input type="checkbox" checked={row.required} onChange={(e) => edit(i, { required: e.target.checked })} /> Required
          </label>
          <Button size="sm" variant="ghost" onClick={() => { setRows((r) => r.filter((_, idx) => idx !== i)); setDirty(true); }}>Remove</Button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button size="sm" variant="secondary" disabled={rows.length >= 12} onClick={() => { setRows((r) => [...r, { name: "", required: false, options: "" }]); setDirty(true); }}>
          Add a question
        </Button>
        <Button size="sm" disabled={!dirty} loading={update.isPending} loadingText="Saving…" onClick={save}>Save form</Button>
      </div>
    </div>
  );
}
