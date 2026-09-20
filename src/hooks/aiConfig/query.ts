import { useQuery } from "@tanstack/react-query";
import { fetchAiConfigService } from "@/services/aiConfig";

export const useAiConfig = () => useQuery({ queryKey: ["ai-config"], queryFn: fetchAiConfigService });
