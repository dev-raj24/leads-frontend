import { callApi } from "@/utils/apiUtils";
import followupsEndpoints from "@/utils/apiUtils/endpoints/followups";
import { ApiEndpoint } from "@/types/api";
import type { Followup } from "@/types/models";

export async function fetchFollowupsService(): Promise<{ followups: Followup[] }> {
  return callApi({ uriEndPoint: { ...followupsEndpoints.list.v1 } as ApiEndpoint });
}
