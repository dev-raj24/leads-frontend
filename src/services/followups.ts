import { callApi } from "@/utils/apiUtils";
import followupsEndpoints from "@/utils/apiUtils/endpoints/followups";
import { ApiEndpoint } from "@/types/api";
import type { Followup } from "@/types/models";

const endpoint = (key: keyof typeof followupsEndpoints) => ({ ...followupsEndpoints[key].v1 }) as ApiEndpoint;

export async function fetchFollowupsService(): Promise<{ followups: Followup[] }> {
  return callApi({ uriEndPoint: endpoint("list") });
}

export async function createFollowupService(leadId: string, runAt: string): Promise<{ followup: Followup }> {
  return callApi({ uriEndPoint: endpoint("create"), pathParams: { leadId }, body: { runAt } });
}

export async function approveFollowupService(id: string, template?: string): Promise<{ followup: Followup }> {
  return callApi({ uriEndPoint: endpoint("approve"), pathParams: { id }, body: template ? { template } : {} });
}

export async function cancelFollowupService(id: string): Promise<{ followup: Followup }> {
  return callApi({ uriEndPoint: endpoint("cancel"), pathParams: { id } });
}

export async function markFollowupSentService(id: string, template?: string): Promise<{ followup: Followup }> {
  return callApi({ uriEndPoint: endpoint("markSent"), pathParams: { id }, body: template ? { template } : {} });
}

export async function draftFollowupService(id: string): Promise<{ draft: string }> {
  return callApi({ uriEndPoint: endpoint("draft"), pathParams: { id } });
}

export async function sendFollowupEmailService(id: string, template?: string): Promise<{ followup: Followup }> {
  return callApi({ uriEndPoint: endpoint("sendEmail"), pathParams: { id }, body: template ? { template } : {} });
}
