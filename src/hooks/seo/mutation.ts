import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startSeoAuditService, writeSeoFixesService } from "@/services/seo";

export const useStartSeoAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => startSeoAuditService(url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-audits"] }),
  });
};

export const useWriteSeoFixes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => writeSeoFixesService(id, url),
    onSuccess: (_res, vars) => queryClient.invalidateQueries({ queryKey: ["seo-audit", vars.id] }),
  });
};
