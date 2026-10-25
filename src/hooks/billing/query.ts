import { useQuery } from "@tanstack/react-query";
import { fetchBillingService } from "@/services/billing";
import { isLoggedIn } from "@/lib/session";

export const useBilling = () =>
  useQuery({
    queryKey: ["billing"],
    queryFn: fetchBillingService,
    enabled: isLoggedIn(),
    staleTime: 30_000,
  });
