import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startSeoAuditService } from "@/services/seo";

export const useStartSeoAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => startSeoAuditService(url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-audits"] }),
  });
};
