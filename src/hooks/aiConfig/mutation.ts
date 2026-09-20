import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAiConfigService } from "@/services/aiConfig";
import type { BusinessProfile } from "@/types/models";

export const useSaveAiConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: BusinessProfile) => saveAiConfigService(config),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai-config"] }),
  });
};
