import React from "react";

export function Skeleton({ width = "100%", height = "20px", borderRadius = "6px", style }: { width?: string; height?: string; borderRadius?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#e2e8f0",
        animation: "pulse 1.5s infinite ease-in-out",
        ...style,
      }}
    />
  );
}

export function OfferSkeleton() {
  return (
    <div style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px", background: "white" }}>
      <Skeleton height="24px" width="60%" style={{ marginBottom: "8px" }} />
      <Skeleton height="16px" width="80%" style={{ marginBottom: "12px" }} />
      <Skeleton height="14px" width="40%" />
    </div>
  );
}
