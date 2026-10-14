import { useQuery } from "@tanstack/react-query";
import { fetchSeoAuditService, fetchSeoAuditsService } from "@/services/seo";

export const useSeoAudits = () => useQuery({ queryKey: ["seo-audits"], queryFn: fetchSeoAuditsService });

export const useSeoAudit = (id: string | null) =>
  useQuery({
    queryKey: ["seo-audit", id],
    queryFn: () => fetchSeoAuditService(id as string),
    enabled: !!id,
    refetchInterval: (query) => {
      const audit = query.state.data?.audit;
      if (!audit) return false;
      if (audit.status === "running") return 1500;
      const planMayArrive = audit.status === "done" && !audit.aiPlan && audit.finishedAt && Date.now() - new Date(audit.finishedAt).getTime() < 40_000;
      return planMayArrive ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });

