import React from "react";
import Link from "next/link";

type Tone = "dark" | "light";

interface LogoProps {
  size?: number;
  showText?: boolean;
  tone?: Tone;
}

// Outlines of the italic "L" from Instrument Serif (the site's display face),
// so the mark is crisp at any size and never depends on a font loading.
const L_PATH =
  "M11.03 39.5Q10.43 39.5 10.43 39.07Q10.43 38.6 11.29 38.47L12.15 38.34Q13.1 38.21 13.47 37.89Q13.83 37.56 14.01 36.66L19.86 11.34Q20.08 10.44 19.86 10.14Q19.65 9.83 18.78 9.66L17.92 9.49Q17.36 9.36 17.36 9.02Q17.36 8.5 18.14 8.5H25.93Q26.58 8.5 26.45 9.02Q26.36 9.4 25.89 9.49L24.68 9.66Q23.74 9.79 23.39 10.14Q23.05 10.48 22.83 11.38L17.23 35.5Q16.89 37.05 17.66 37.73Q18.44 38.42 19.9 38.42Q21.54 38.42 23.26 37.17Q24.98 35.93 26.1 33.26L27.4 30.24Q27.61 29.68 28.08 29.68Q28.73 29.68 28.51 30.42L26.1 38.51Q25.85 39.5 24.81 39.5Z";

/**
 * Leadworks mark: the editorial italic "L" on a forest-green tile, closed with
 * a lime dot like a full stop — the same serif voice as the website headlines.
 */
export function LogoMark({ size = 32, tone = "dark" }: { size?: number; tone?: Tone }) {
  const light = tone === "light";
  const tile = light ? "#D9F470" : "#0B5D4B";
  const ink = light ? "#0B5D4B" : "#F7F6F2";
  const dot = light ? "#0B5D4B" : "#D9F470";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill={tile} />
      <path d={L_PATH} fill={ink} />
      <circle cx="33.97" cy="35.90" r="3.6" fill={dot} />
    </svg>
  );
}

export function Logo({ size = 32, showText = true, tone = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Leadworks home"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.32,
        textDecoration: "none",
        color: tone === "light" ? "#fff" : "var(--ink, #10151c)",
      }}
    >
      <LogoMark size={size} tone={tone} />
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: size * 0.98,
            lineHeight: 1,
            letterSpacing: "-0.012em",
            paddingBottom: size * 0.05,
          }}
        >
          Leadworks
        </span>
      )}
    </Link>
  );
}

export default Logo;
