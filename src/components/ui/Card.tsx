import type React from "react";

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
  className?: string;
}

export function Card({ title, subtitle, action, children, flush = false, className = "" }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || action) && (
        <header className="card-h">
          <div>
            {title && <h3 className="card-t">{title}</h3>}
            {subtitle && <p className="card-s">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={flush ? "card-b flush" : "card-b"}>{children}</div>
    </section>
  );
}
