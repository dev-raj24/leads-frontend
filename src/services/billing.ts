import { callApi } from "@/utils/apiUtils";
import billingEndpoints from "@/utils/apiUtils/endpoints/billing";
import { ApiEndpoint } from "@/types/api";
import type { BillingOverview } from "@/types/models";

export async function fetchBillingService(): Promise<BillingOverview> {
  return callApi({
    uriEndPoint: { ...billingEndpoints.overview.v1 } as ApiEndpoint,
  });
}

export async function subscribeService(): Promise<{ url: string | null; activated: boolean }> {
  return callApi({
    uriEndPoint: { ...billingEndpoints.subscribe.v1 } as ApiEndpoint,
  });
}

export async function cancelSubscriptionService(): Promise<BillingOverview> {
  return callApi({
    uriEndPoint: { ...billingEndpoints.cancel.v1 } as ApiEndpoint,
  });
}
