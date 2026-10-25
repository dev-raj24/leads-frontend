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

export async function exportCustomerService(contact: string): Promise<Record<string, unknown>> {
  return callApi({
    uriEndPoint: { ...customersEndpoints.export.v1 } as ApiEndpoint,
    pathParams: { contact },
  });
}

export async function eraseCustomerService(contact: string): Promise<{ ok: boolean; removed: number }> {
  return callApi({
    uriEndPoint: { ...customersEndpoints.erase.v1 } as ApiEndpoint,
    pathParams: { contact },
  });
}
