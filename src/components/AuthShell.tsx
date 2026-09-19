import Link from "next/link";
import { Logo } from "@/components/Logo";
import { IconCheck } from "@/components/icons";

const POINTS = ["Every enquiry in one inbox", "AI replies in about 10 seconds", "Follow-ups that never get forgotten"];

/** Shared split-screen frame for /login and /onboarding. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-wrap">
      <aside className="auth-aside">
        <Logo size={34} tone="light" />
        <div>
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
        <div className="auth-box">{children}</div>
      </main>
    </div>
  );
}
