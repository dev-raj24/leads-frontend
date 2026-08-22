"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  style = {},
  icon,
}: ButtonProps) {
  const getVariantStyles = (): { className: string; customStyle: React.CSSProperties } => {
    if (variant === "primary") {
      return {
        className: `p-add ${className}`.trim(),
        customStyle: style,
      };
    }

    if (variant === "secondary") {
      return {
        className: `${className}`.trim(),
        customStyle: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 700,
          color: "var(--ink)",
          background: "#F1F5F9",
          border: "1.5px solid var(--ink)",
          borderRadius: 100,
          padding: "6px 14px",
          textDecoration: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.12s ease",
          ...style,
        },
      };
    }

    // Outline variant
    return {
      className: `${className}`.trim(),
      customStyle: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        color: "#64748B",
        background: "#FFF",
        border: "1.5px solid #E2E8F0",
        borderRadius: 100,
        padding: "6px 14px",
        textDecoration: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.12s ease",
        ...style,
      },
    };
  };

  const { className: finalClass, customStyle } = getVariantStyles();

  if (href) {
    return (
      <Link href={href} className={finalClass} style={customStyle} onClick={onClick}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={finalClass} style={customStyle}>
      {icon}
      {children}
    </button>
  );
}
