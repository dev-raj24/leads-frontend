import type React from "react";
import { IconArrowDown, IconArrowUp } from "@/components/icons";
import { formatPercent } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  hint?: string;
  trend?: number | null;
  trendLabel?: string;
  featured?: boolean;
  loading?: boolean;
}

export function StatCard({ label, value, icon, hint, trend, trendLabel, featured = false, loading = false }: StatCardProps) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className={`stat ${featured ? "f" : ""}`}>
      <div className="stat-top">
        <span className="stat-l">{label}</span>
        <span className="stat-ic">{icon}</span>
      </div>
      <div className="stat-v">{loading ? "–" : value}</div>
      <div className="stat-foot">
        {!loading && trend !== undefined && trend !== null && (
          <span className={`trend ${up ? "up" : "down"}`}>
            {up ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />}
            {formatPercent(Math.abs(trend))}
          </span>
        )}
        {!loading && trend === null && <span className="trend up">New</span>}
        <span className="stat-h">{trendLabel ?? hint}</span>
      </div>
    </div>
  );
}
