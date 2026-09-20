import { callApi } from "@/utils/apiUtils";
import leadsEndpoints from "@/utils/apiUtils/endpoints/leads";
import { ApiEndpoint } from "@/types/api";
import type { Lead, LeadImportPreview, LeadImportRow, LeadStatus, Message } from "@/types/models";

export async function fetchLeadsService(status?: string): Promise<{ leads: Lead[] }> {
  return callApi({
    uriEndPoint: { ...leadsEndpoints.list.v1 } as ApiEndpoint,
    query: status ? { status } : undefined,
  });
}

export async function fetchLeadService(id: string): Promise<{ lead: Lead; messages: Message[] }> {
  return callApi({
    uriEndPoint: { ...leadsEndpoints.get.v1 } as ApiEndpoint,
    pathParams: { id },
  });
}

export async function updateLeadStatusService(id: string, status: LeadStatus): Promise<{ lead: Lead }> {
  return callApi({
    uriEndPoint: { ...leadsEndpoints.updateStatus.v1 } as ApiEndpoint,
    pathParams: { id },
    body: { status },
  });
}

/** Triggers a browser file download — not really "data", so it isn't wrapped in a query/mutation hook. */
export async function downloadLeadTemplateService(): Promise<void> {
  const blob: Blob = await callApi({
    uriEndPoint: { ...leadsEndpoints.template.v1 } as ApiEndpoint,
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads_template.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function uploadLeadPreviewService(file: File): Promise<LeadImportPreview> {
  const formData = new FormData();
  formData.append("file", file);
  return callApi({
    uriEndPoint: { ...leadsEndpoints.uploadPreview.v1 } as ApiEndpoint,
    body: formData,
  });
}

export async function bulkCreateLeadsService(leads: LeadImportRow["data"][]): Promise<{ ok: boolean; count: number }> {
  return callApi({
    uriEndPoint: { ...leadsEndpoints.bulk.v1 } as ApiEndpoint,
    body: { leads },
  });
}

export async function draftLeadReplyService(id: string): Promise<{ reply: string }> {
  return callApi({
    uriEndPoint: { ...leadsEndpoints.aiReply.v1 } as ApiEndpoint,
    pathParams: { id },
  });
}
