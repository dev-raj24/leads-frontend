"use client";

import Link from "next/link";
import type React from "react";

export type ButtonVariant = "primary" | "secondary" | "ink" | "lime" | "danger" | "ghost";

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: "md" | "sm" | "lg";
  /** Renders a Next <Link> instead of a <button>. */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** Shows `loadingText` (if given) and disables the button. */
  loading?: boolean;
  loadingText?: string;
  /** Stretch to the full width of the parent. */
  block?: boolean;
  iconOnly?: boolean;
  ariaLabel?: string;
  title?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "solid",
  secondary: "line",
  ink: "ink",
  lime: "lime",
  danger: "danger",
  ghost: "ghost",
};

/** The one button used across the portal. Styles live in portal.css (`.btn`). */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
  block = false,
  iconOnly = false,
  ariaLabel,
  title,
  icon,
  iconRight,
  className = "",
  style,
}: ButtonProps) {
  const cls = ["btn", VARIANT_CLASS[variant], size === "md" ? "" : size, block ? "block" : "", iconOnly ? "icon" : "", className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {icon}
      {loading && loadingText ? loadingText : children}
      {iconRight}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={style} onClick={onClick} aria-label={ariaLabel} title={title}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} style={style} aria-label={ariaLabel} title={title}>
      {content}
    </button>
  );
}
