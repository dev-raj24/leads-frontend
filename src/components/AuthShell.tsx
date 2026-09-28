import Link from "next/link";
import { Logo } from "@/components/Logo";
import { IconCheck } from "@/components/icons";

const POINTS = ["Every enquiry in one inbox", "AI replies in about 10 seconds", "Follow-ups that never get forgotten"];
const STEPS = ["Account", "Your business", "Plan"];

interface AuthShellProps {
  children: React.ReactNode;
  /** 1-indexed step in the signup wizard. Omit outside onboarding (e.g. /login). */
  step?: 1 | 2 | 3;
  /** Wider content box for forms with more fields (e.g. the business-details step). */
  wide?: boolean;
}

/** Shared split-screen frame for auth and onboarding pages. */
export function AuthShell({ children, step, wide = false }: AuthShellProps) {
  return (
    <div className="auth-wrap">
      <aside className="auth-aside">
        <div className="auth-logo">
          <Logo size={34} tone="light" />
        </div>
        <div className="auth-mid">
          <p className="auth-quote">
            The customer who replies <em>first,</em> wins the deal.
          </p>
          <ul className="auth-points">
            {POINTS.map((p) => (
              <li key={p}>
                <IconCheck size={16} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-fine">
          © 2026 Leadworks · <Link href="/">Back to website</Link>
        </div>
      </aside>
      <main className="auth-main">
        <div className={`auth-box ${wide ? "wide" : ""}`}>
          {step && (
            <ol className="auth-steps">
              {STEPS.map((label, i) => {
                const n = i + 1;
                return (
                  <li key={label} className={n === step ? "on" : n < step ? "done" : ""}>
                    <span>{n < step ? <IconCheck size={12} /> : n}</span>
                    {label}
                  </li>
                );
              })}
            </ol>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
