import type React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, text, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty-ic">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
