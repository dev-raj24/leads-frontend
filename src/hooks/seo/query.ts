import { useQuery } from "@tanstack/react-query";
import { fetchSeoAuditService, fetchSeoAuditsService } from "@/services/seo";

export const useSeoAudits = () => useQuery({ queryKey: ["seo-audits"], queryFn: fetchSeoAuditsService });

export const useSeoAudit = (id: string | null) =>
  useQuery({
    queryKey: ["seo-audit", id],
    queryFn: () => fetchSeoAuditService(id as string),
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.audit.status === "running" ? 1500 : false),
    refetchIntervalInBackground: true,
  });
