import React from "react";

export function Skeleton({ width = "100%", height = 16, style }: { width?: string | number; height?: number; style?: React.CSSProperties }) {
  return <div className="sk" style={{ width, height, ...style }} />;
}

/** Placeholder rows shown while a list loads. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="pnl">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="li">
          <div className="li-main">
            <Skeleton width="38%" height={18} />
            <Skeleton width="62%" height={13} style={{ marginTop: 10 }} />
          </div>
          <Skeleton width={72} height={32} style={{ borderRadius: 100 }} />
        </div>
      ))}
    </div>
  );
}
