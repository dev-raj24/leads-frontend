import { useMutation } from "@tanstack/react-query";
import { inspectSiteService } from "@/services/sites";

export const useInspectSite = () => useMutation({ mutationFn: (url: string) => inspectSiteService(url) });
