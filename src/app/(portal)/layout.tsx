import { PortalNav } from "@/components/portal/PortalNav";
import { AiPanel } from "@/components/portal/AiPanel";
import { PortalGuard } from "@/components/portal/PortalGuard";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalGuard>
      <div className="app-shell">
        <PortalNav />
        <main className="p-main">{children}</main>
        <AiPanel />
      </div>
    </PortalGuard>
  );
}
