import { callApi } from "@/utils/apiUtils";
import sitesEndpoints from "@/utils/apiUtils/endpoints/sites";
import { ApiEndpoint } from "@/types/api";
import type { Site } from "@/types/models";

export async function fetchMySiteService(): Promise<{ site: Site }> {
  return callApi({
    uriEndPoint: { ...sitesEndpoints.me.v1 } as ApiEndpoint,
  });
}

export async function updateSiteSettingsService(
  siteId: string,
  settings: Record<string, unknown>
): Promise<{ site: Site }> {
  return callApi({
    uriEndPoint: { ...sitesEndpoints.updateSettings.v1 } as ApiEndpoint,
    pathParams: { id: siteId },
    body: { settings },
  });
}
