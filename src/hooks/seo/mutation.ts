import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applySeoFixesService, removeSeoOverrideService, startSeoAuditService, writeSeoFixesService } from "@/services/seo";

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

export const useApplySeoFixes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => applySeoFixesService(id, url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-overrides"] }),
  });
};

export const useRemoveSeoOverride = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => removeSeoOverrideService(path),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-overrides"] }),
  });
};
