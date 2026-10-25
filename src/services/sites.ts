import { callApi } from "@/utils/apiUtils";
import sitesEndpoints from "@/utils/apiUtils/endpoints/sites";
import { ApiEndpoint } from "@/types/api";
import type { InstallStatus, Site, SiteInspection } from "@/types/models";

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

export async function fetchInstallStatusService(): Promise<{ status: InstallStatus; allowedDomains: string[] }> {
  return callApi({
    uriEndPoint: { ...sitesEndpoints.install.v1 } as ApiEndpoint,
  });
}

export async function inspectSiteService(url: string): Promise<{ inspection: SiteInspection }> {
  return callApi({
    uriEndPoint: { ...sitesEndpoints.inspect.v1 } as ApiEndpoint,
    body: { url },
  });
}
