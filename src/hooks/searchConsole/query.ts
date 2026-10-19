import { useQuery } from "@tanstack/react-query";
import { fetchScPerformanceService, fetchScPropertiesService, fetchScRankTrendService, fetchScStatusService } from "@/services/searchConsole";

export const useScStatus = () => useQuery({ queryKey: ["sc-status"], queryFn: fetchScStatusService });

export const useScProperties = (enabled: boolean) =>
  useQuery({ queryKey: ["sc-properties"], queryFn: fetchScPropertiesService, enabled, retry: false });

export const useScPerformance = (days: number, enabled: boolean) =>
  useQuery({ queryKey: ["sc-performance", days], queryFn: () => fetchScPerformanceService(days), enabled, retry: false, staleTime: 5 * 60_000 });

export const useScRankTrend = (days: number, enabled: boolean) =>
  useQuery({ queryKey: ["sc-rank-trend", days], queryFn: () => fetchScRankTrendService(days), enabled, retry: false, staleTime: 5 * 60_000 });
