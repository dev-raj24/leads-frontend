import type React from "react";

interface PageHeadProps {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
  actions?: React.ReactNode;
}

/** Serif page title with optional eyebrow, sub-line and action buttons. */
export function PageHead({ eyebrow, title, sub, actions }: PageHeadProps) {
  return (
    <div className="ph">
      <div>
        {eyebrow && <div className="ph-eyebrow">{eyebrow}</div>}
        <h1 className="ph-title">{title}</h1>
        {sub && <p className="ph-sub">{sub}</p>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  );
}
