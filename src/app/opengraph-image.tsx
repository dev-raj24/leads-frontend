import { ImageResponse } from "next/og";

export const alt = "Leadworks — every lead, in one place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card (WhatsApp, LinkedIn, X …).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F7F6F2", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="13" fill="#0B5D4B" />
            <path d="M11.03 39.5Q10.43 39.5 10.43 39.07Q10.43 38.6 11.29 38.47L12.15 38.34Q13.1 38.21 13.47 37.89Q13.83 37.56 14.01 36.66L19.86 11.34Q20.08 10.44 19.86 10.14Q19.65 9.83 18.78 9.66L17.92 9.49Q17.36 9.36 17.36 9.02Q17.36 8.5 18.14 8.5H25.93Q26.58 8.5 26.45 9.02Q26.36 9.4 25.89 9.49L24.68 9.66Q23.74 9.79 23.39 10.14Q23.05 10.48 22.83 11.38L17.23 35.5Q16.89 37.05 17.66 37.73Q18.44 38.42 19.9 38.42Q21.54 38.42 23.26 37.17Q24.98 35.93 26.1 33.26L27.4 30.24Q27.61 29.68 28.08 29.68Q28.73 29.68 28.51 30.42L26.1 38.51Q25.85 39.5 24.81 39.5Z" fill="#F7F6F2" />
            <circle cx="33.97" cy="35.90" r="3.6" fill="#D9F470" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#10151C", letterSpacing: -1 }}>Leadworks</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 700, color: "#10151C", letterSpacing: -4 }}>Every lead,</div>
          <div style={{ display: "flex" }}>
            <div style={{ fontSize: 112, lineHeight: 1.1, fontWeight: 700, color: "#0B5D4B", letterSpacing: -4, background: "#D9F470", padding: "0 16px" }}>in one place.</div>
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#6A707A" }}>The AI lead inbox for small businesses.</div>
      </div>
    ),
    size
  );
}
