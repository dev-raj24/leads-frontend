interface Slice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ slices, centerLabel }: { slices: Slice[]; centerLabel: string }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const R = 46;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="donut">
      <div className="donut-svg">
        <svg viewBox="0 0 120 120" role="img" aria-label={centerLabel}>
          <circle cx="60" cy="60" r={R} className="donut-track" />
          {total > 0 &&
            slices
              .filter((s) => s.value > 0)
              .map((s) => {
                const len = (s.value / total) * C;
                const seg = (
                  <circle
                    key={s.label}
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="14"
                    strokeDasharray={`${Math.max(0, len - 2)} ${C - Math.max(0, len - 2)}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 60 60)"
                  />
                );
                offset += len;
                return seg;
              })}
        </svg>
        <div className="donut-c">
          <strong>{total}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <ul className="donut-legend">
        {slices.map((s) => (
          <li key={s.label}>
            <i className="dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            <b>{s.value}</b>
            <em>{total ? `${Math.round((s.value / total) * 100)}%` : "0%"}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
