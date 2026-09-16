import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSiteSettingsService } from "@/services/sites";

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ siteId, settings }: { siteId: string; settings: Record<string, unknown> }) =>
      updateSiteSettingsService(siteId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site", "me"] });
    },
  });
};
