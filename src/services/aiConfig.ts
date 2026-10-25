import { callApi } from "@/utils/apiUtils";
import aiConfigEndpoints from "@/utils/apiUtils/endpoints/aiConfig";
import { ApiEndpoint } from "@/types/api";
import type { BusinessProfile } from "@/types/models";

export async function fetchAiConfigService(): Promise<{ config: BusinessProfile }> {
  return callApi({ uriEndPoint: { ...aiConfigEndpoints.get.v1 } as ApiEndpoint });
}

export async function saveAiConfigService(config: BusinessProfile): Promise<{ config: BusinessProfile }> {
  return callApi({
    uriEndPoint: { ...aiConfigEndpoints.save.v1 } as ApiEndpoint,
    body: config as unknown as Record<string, unknown>,
  });
}
