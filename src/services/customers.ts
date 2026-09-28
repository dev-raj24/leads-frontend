import { callApi } from "@/utils/apiUtils";
import customersEndpoints from "@/utils/apiUtils/endpoints/customers";
import { ApiEndpoint } from "@/types/api";
import type { CustomerSummary, Followup, Lead } from "@/types/models";

export async function fetchCustomersService(): Promise<{ customers: CustomerSummary[] }> {
  return callApi({ uriEndPoint: { ...customersEndpoints.list.v1 } as ApiEndpoint });
}

export async function fetchCustomerService(
  contact: string
): Promise<{ customer: CustomerSummary; leads: Lead[]; followups: Followup[] }> {
  return callApi({
    uriEndPoint: { ...customersEndpoints.get.v1 } as ApiEndpoint,
    pathParams: { contact },
  });
}
