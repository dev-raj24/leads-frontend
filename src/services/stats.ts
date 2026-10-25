import { callApi } from "@/utils/apiUtils";
import statsEndpoints from "@/utils/apiUtils/endpoints/stats";
import { ApiEndpoint } from "@/types/api";
import type { StatsOverview } from "@/types/models";

export async function fetchStatsService(days: number): Promise<{ stats: StatsOverview }> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return callApi({
    uriEndPoint: { ...statsEndpoints.overview.v1 } as ApiEndpoint,
    query: { days, tz },
  });
}
