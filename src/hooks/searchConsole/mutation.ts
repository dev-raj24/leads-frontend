import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chooseScPropertyService, connectScService, disconnectScService, fetchScPerformanceService } from "@/services/searchConsole";

export const useConnectSc = () =>
  useMutation({
    mutationFn: connectScService,
    onSuccess: (res) => {
      window.location.href = res.url;
    },
  });

export const useChooseScProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteUrl: string) => chooseScPropertyService(siteUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sc-status"] });
      queryClient.invalidateQueries({ queryKey: ["sc-performance"] });
    },
  });
};

export const useRefreshScPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: number) => fetchScPerformanceService(days, true),
    onSuccess: (res, days) => queryClient.setQueryData(["sc-performance", days], res),
  });
};

export const useDisconnectSc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectScService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sc-status"] });
      queryClient.removeQueries({ queryKey: ["sc-performance"] });
    },
  });
};
