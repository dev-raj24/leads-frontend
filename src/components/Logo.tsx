import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#155EEF" />
      <path
        d="M10 16L14 20L22 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 24, showText = true }: LogoProps) {
  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
      <LogoMark size={size} />
      {showText && (
        <span style={{ fontWeight: 800, fontSize: size * 0.75, letterSpacing: "-0.03em" }}>
          Leadworks
        </span>
      )}
    </Link>
  );
}

export default Logo;
