"use client";

import { IconPlus, IconTrash } from "@/components/icons";
import type { ServiceItem } from "@/types/models";

const EMPTY_SERVICE: ServiceItem = { name: "", description: "", price: "", hidePrice: false };

interface ServicesEditorProps {
  value: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}

export function ServicesEditor({ value, onChange }: ServicesEditorProps) {
  function update(index: number, patch: Partial<ServiceItem>) {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, { ...EMPTY_SERVICE }]);
  }

  return (
    <div className="svc-list">
      {value.map((s, i) => (
        <div key={i} className="svc-row">
          <div className="svc-top">
            <input
              className="finput"
              value={s.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Service name — e.g. Root canal"
              maxLength={100}
            />
            <input
              className="finput svc-price"
              value={s.price}
              onChange={(e) => update(i, { price: e.target.value })}
              placeholder={s.hidePrice ? "—" : "₹ price"}
              maxLength={50}
              disabled={s.hidePrice}
            />
            <button type="button" className="iconbtn" onClick={() => remove(i)} aria-label="Remove service">
              <IconTrash size={16} />
            </button>
          </div>
          <input
            className="finput svc-desc"
            value={s.description}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="Short description (optional)"
            maxLength={300}
          />
          <label className="svc-hide">
            <input type="checkbox" className="chk" checked={s.hidePrice} onChange={(e) => update(i, { hidePrice: e.target.checked, price: e.target.checked ? "" : s.price })} />
            Don&apos;t quote a price for this — tell the AI to ask the customer to get in touch instead
          </label>
        </div>
      ))}

      <button type="button" className="svc-add" onClick={add}>
        <IconPlus size={14} /> Add a service
      </button>
    </div>
  );
}
