import { callApi } from "@/utils/apiUtils";
import tenantEndpoints from "@/utils/apiUtils/endpoints/tenant";
import { ApiEndpoint } from "@/types/api";
import type { Plan, Tenant } from "@/types/models";

export async function fetchTenantMeService(): Promise<{ tenant: Tenant }> {
  return callApi({ uriEndPoint: { ...tenantEndpoints.me.v1 } as ApiEndpoint });
}

export async function updateNameService(name: string): Promise<{ tenant: Tenant }> {
  return callApi({ uriEndPoint: { ...tenantEndpoints.updateName.v1 } as ApiEndpoint, body: { name } });
}

export async function updateIndustryService(industry: string): Promise<{ tenant: Tenant }> {
  return callApi({ uriEndPoint: { ...tenantEndpoints.updateIndustry.v1 } as ApiEndpoint, body: { industry } });
}

export async function choosePlanService(plan: Plan): Promise<{ tenant: Tenant }> {
  return callApi({ uriEndPoint: { ...tenantEndpoints.choosePlan.v1 } as ApiEndpoint, body: { plan } });
}
