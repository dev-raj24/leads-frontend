import { useQuery } from "@tanstack/react-query";
import { fetchStatsService } from "@/services/stats";

export const useStats = (days: number) =>
  useQuery({ queryKey: ["stats", days], queryFn: () => fetchStatsService(days), staleTime: 30_000 });
