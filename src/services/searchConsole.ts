import { callApi } from "@/utils/apiUtils";
import endpoints from "@/utils/apiUtils/endpoints/searchConsole";
import { ApiEndpoint } from "@/types/api";
import type { RankTrendKeyword, SearchConsoleStatus, SearchPerformance } from "@/types/models";

const ep = (key: keyof typeof endpoints) => ({ ...endpoints[key].v1 }) as ApiEndpoint;

export async function fetchScStatusService(): Promise<{ status: SearchConsoleStatus }> {
  return callApi({ uriEndPoint: ep("status") });
}

export async function connectScService(): Promise<{ url: string }> {
  return callApi({ uriEndPoint: ep("connect") });
}

export async function fetchScPropertiesService(): Promise<{ properties: Array<{ siteUrl: string; permissionLevel: string }> }> {
  return callApi({ uriEndPoint: ep("properties") });
}

export async function chooseScPropertyService(siteUrl: string): Promise<{ status: SearchConsoleStatus }> {
  return callApi({ uriEndPoint: ep("choose"), body: { siteUrl } });
}

export async function fetchScPerformanceService(days: number, refresh = false): Promise<{ performance: SearchPerformance }> {
  return callApi({ uriEndPoint: ep("performance"), query: { days, ...(refresh ? { refresh: 1 } : {}) } });
}

export async function disconnectScService(): Promise<{ status: SearchConsoleStatus }> {
  return callApi({ uriEndPoint: ep("disconnect") });
}

export async function fetchScRankTrendService(days: number): Promise<{ keywords: RankTrendKeyword[] }> {
  return callApi({ uriEndPoint: ep("trend"), query: { days } });
}
