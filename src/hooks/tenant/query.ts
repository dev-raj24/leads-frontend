import { useQuery } from "@tanstack/react-query";
import { fetchTenantMeService } from "@/services/tenant";
import { isLoggedIn } from "@/lib/session";

export const useTenant = () =>
  useQuery({
    queryKey: ["tenant", "me"],
    queryFn: fetchTenantMeService,
    enabled: isLoggedIn(),
    staleTime: 60_000,
  });
