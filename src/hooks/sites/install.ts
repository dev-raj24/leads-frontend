import { useQuery } from "@tanstack/react-query";
import { fetchInstallStatusService } from "@/services/sites";

export const useInstallStatus = () =>
  useQuery({
    queryKey: ["site", "install"],
    queryFn: fetchInstallStatusService,
    refetchInterval: 15_000,
    retry: false,
  });
