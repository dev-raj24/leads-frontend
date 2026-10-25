"use client";

import { useEffect, useState } from "react";

interface DayState {
  open: boolean;
  is24h: boolean;
  from: string;
  to: string;
}

const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_OPEN: DayState = { open: true, is24h: false, from: "10:00", to: "19:00" };
const DEFAULT_CLOSED: DayState = { open: false, is24h: false, from: "", to: "" };

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

function to12h(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function from12h(t: string): string | null {
  const match = t.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${match[2]}`;
}

function stateLabel(d: DayState): string {
  if (!d.open) return "Closed";
  if (d.is24h) return "24 hours";
  return `${to12h(d.from)}–${to12h(d.to)}`;
}

function sameState(a: DayState, b: DayState): boolean {
  return a.open === b.open && a.is24h === b.is24h && (!a.open || a.is24h || (a.from === b.from && a.to === b.to));
}

export function summarizeHours(days: DayState[]): string {
  const groups: Array<{ start: number; end: number; state: DayState }> = [];
  days.forEach((d, i) => {
    const last = groups[groups.length - 1];
    if (last && sameState(last.state, d)) last.end = i;
    else groups.push({ start: i, end: i, state: d });
  });
  return groups
    .map((g) => {
      const range = g.start === g.end ? DAY_KEYS[g.start] : `${DAY_KEYS[g.start]}–${DAY_KEYS[g.end]}`;
      return `${range}: ${stateLabel(g.state)}`;
    })
    .join("; ");
}

function parseHours(text: string): DayState[] | null {
  if (!text.trim()) return null;
  const result: DayState[] = new Array(7);
  for (const clause of text.split(";").map((c) => c.trim())) {
    const sep = clause.indexOf(": ");
    if (sep === -1) return null;
    const range = clause.slice(0, sep).trim();
    const stateText = clause.slice(sep + 2).trim();
    if (!range || !stateText) return null;

    const [startKey, endKey] = range.split("–").map((s) => s.trim());
    const start = DAY_KEYS.indexOf(startKey as (typeof DAY_KEYS)[number]);
    const end = endKey ? DAY_KEYS.indexOf(endKey as (typeof DAY_KEYS)[number]) : start;
    if (start === -1 || end === -1) return null;

    let state: DayState;
    if (/^closed$/i.test(stateText)) state = DEFAULT_CLOSED;
    else if (/^24\s*hours?$/i.test(stateText)) state = { open: true, is24h: true, from: "", to: "" };
    else {
      const [fromText, toText] = stateText.split("–").map((s) => s.trim());
      const from = fromText && from12h(fromText);
      const to = toText && from12h(toText);
      if (!from || !to) return null;
      state = { open: true, is24h: false, from, to };
    }
    for (let i = start; i <= end; i++) result[i] = state;
  }
  return result.every(Boolean) ? result : null;
}

interface HoursPickerProps {
  value: string;
  onChange: (summary: string) => void;
}

export function HoursPicker({ value, onChange }: HoursPickerProps) {
  const [days, setDays] = useState<DayState[]>(
    () => parseHours(value) ?? DAY_KEYS.map((_, i) => (i === 6 ? DEFAULT_CLOSED : DEFAULT_OPEN))
  );

  // With no saved value yet, the defaults above are only local state — the parent form (and
  // the AI) wouldn't know about them until the owner touches a control. Sync once on mount so
  // what's displayed always matches what actually gets saved.
  useEffect(() => {
    if (!value.trim()) onChange(summarizeHours(days));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commit(next: DayState[]) {
    setDays(next);
    onChange(summarizeHours(next));
  }

  function update(index: number, patch: Partial<DayState>) {
    commit(days.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function copyToAll() {
    commit(days.map((d, i) => (i === 0 ? d : { ...days[0] })));
  }

  return (
    <div className="hrs">
      {DAY_KEYS.map((key, i) => {
        const d = days[i];
        return (
          <div key={key} className="hrow">
            <span className="hrow-day">{DAY_LABELS[i]}</span>
            <button
              type="button"
              className={`tgl ${d.open ? "on" : ""}`}
              role="switch"
              aria-checked={d.open}
              aria-label={`${DAY_LABELS[i]} open`}
              onClick={() => update(i, d.open ? DEFAULT_CLOSED : DEFAULT_OPEN)}
            />
            {!d.open && <span className="hrow-closed">Closed</span>}
            {d.open && (
              <>
                <label className="hrow-24">
                  <input type="checkbox" className="chk" checked={d.is24h} onChange={(e) => update(i, { is24h: e.target.checked, from: DEFAULT_OPEN.from, to: DEFAULT_OPEN.to })} />
                  24 hours
                </label>
                {!d.is24h && (
                  <div className="hrow-times">
                    <select className="finput" value={d.from} onChange={(e) => update(i, { from: e.target.value })}>
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{to12h(t)}</option>)}
                    </select>
                    <span>to</span>
                    <select className="finput" value={d.to} onChange={(e) => update(i, { to: e.target.value })}>
                      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{to12h(t)}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}
            {i === 0 && (
              <button type="button" className="hrow-copy" onClick={copyToAll}>
                Copy to all days
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
