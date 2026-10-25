import { useQuery } from "@tanstack/react-query";
import { fetchMySiteService } from "@/services/sites";

export const useMySite = () =>
  useQuery({
    queryKey: ["site", "me"],
    queryFn: fetchMySiteService,
    retry: false,
  });
