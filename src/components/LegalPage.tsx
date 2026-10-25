import Link from "next/link";
import "@/app/marketing.css";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="m" style={{ minHeight: "100vh" }}>
      <nav className="m-nav">
        <div className="m-wrap m-nav-in">
          <Link href="/"><Logo size={34} /></Link>
          <div className="m-nav-cta">
            <Link href="/login" className="m-login">Log in</Link>
            <Link href="/onboarding" className="m-btn solid sm">Start free</Link>
          </div>
        </div>
      </nav>
      <main className="m-wrap" style={{ maxWidth: 760, paddingTop: 56, paddingBottom: 80 }}>
        <h1 className="m-h2" style={{ marginBottom: 8 }}>{title}</h1>
        <p className="m-sub" style={{ marginTop: 0 }}>{intro}</p>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Last updated {site.updated}</p>
        <div className="legal">{children}</div>
        <p style={{ marginTop: 40, color: "var(--muted)", fontSize: 14 }}>
          Questions? Write to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
        </p>
      </main>
      <footer className="m-foot">
        <div className="m-wrap">
          <div className="m-foot-bar">
            <span>© 2026 {site.name}</span>
            <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/refunds">Refunds</Link></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
