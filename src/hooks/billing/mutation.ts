import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSubscriptionService, subscribeService } from "@/services/billing";

const refreshPlan = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["billing"] });
  queryClient.invalidateQueries({ queryKey: ["tenant", "me"] });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribeService,
    onSuccess: (res) => {
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      refreshPlan(queryClient);
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscriptionService,
    onSuccess: () => refreshPlan(queryClient),
  });
};
