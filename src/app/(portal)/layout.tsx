import "./portal.css";
import { PortalGuard } from "@/components/portal/PortalGuard";
import { PortalShell } from "@/components/portal/PortalShell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalGuard>
      <PortalShell>{children}</PortalShell>
    </PortalGuard>
  );
}
