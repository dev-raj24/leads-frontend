"use client";

import { useState } from "react";

interface Point {
  label: string;
  value: number;
  secondary?: number;
}

interface BarChartProps {
  data: Point[];
  primaryLabel: string;
  secondaryLabel?: string;
  height?: number;
}

const niceMax = (value: number) => {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value / 4) ?? 10;
  return Math.ceil(value / (step * pow)) * step * pow;
};

export function BarChart({ data, primaryLabel, secondaryLabel, height = 240 }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const pad = { top: 16, right: 8, bottom: 30, left: 32 };
  const innerW = W - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.min(28, slot * 0.58);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;
  const showEvery = data.length > 20 ? 4 : data.length > 10 ? 2 : 1;
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="chart" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={`${primaryLabel} per day`} preserveAspectRatio="none">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} className="chart-grid" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="chart-axis">{Math.round(t)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.left + slot * i + (slot - barW) / 2;
          const h = Math.max(d.value > 0 ? 3 : 0, (d.value / max) * innerH);
          const wonH = d.secondary ? Math.max(3, (d.secondary / max) * innerH) : 0;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill="transparent" />
              <rect x={x} y={pad.top + innerH - h} width={barW} height={h} rx={5} className={hover === i ? "bar on" : "bar"} />
              {wonH > 0 && <rect x={x} y={pad.top + innerH - wonH} width={barW} height={wonH} rx={5} className="bar-2" />}
              {i % showEvery === 0 && (
                <text x={x + barW / 2} y={height - 10} textAnchor="middle" className="chart-axis">{d.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      {active && hover !== null && (
        <div className="chart-tip" style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}>
          <strong>{active.label}</strong>
          <span><i className="dot g" />{primaryLabel}: {active.value}</span>
          {secondaryLabel !== undefined && <span><i className="dot l" />{secondaryLabel}: {active.secondary ?? 0}</span>}
        </div>
      )}
      <div className="chart-legend">
        <span><i className="dot g" />{primaryLabel}</span>
        {secondaryLabel && <span><i className="dot l" />{secondaryLabel}</span>}
      </div>
    </div>
  );
}
