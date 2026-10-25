import { callApi } from "@/utils/apiUtils";
import seoEndpoints from "@/utils/apiUtils/endpoints/seo";
import { ApiEndpoint } from "@/types/api";
import type { SeoAppliedFix, SeoAudit, SeoFixPack } from "@/types/models";

export async function fetchSeoAuditsService(): Promise<{ audits: SeoAudit[]; suggestedUrl: string }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.list.v1 } as ApiEndpoint });
}

export async function fetchSeoAuditService(id: string): Promise<{ audit: SeoAudit }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.get.v1 } as ApiEndpoint, pathParams: { id } });
}

export async function startSeoAuditService(url: string): Promise<{ audit: SeoAudit }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.create.v1 } as ApiEndpoint, body: { url } });
}

export async function writeSeoFixesService(id: string, url: string): Promise<{ pack: SeoFixPack }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.fixes.v1 } as ApiEndpoint, pathParams: { id }, body: { url } });
}

export async function applySeoFixesService(id: string, url: string): Promise<{ override: SeoAppliedFix }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.apply.v1 } as ApiEndpoint, pathParams: { id }, body: { url } });
}

export async function fetchSeoOverridesService(): Promise<{ overrides: SeoAppliedFix[] }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.overrides.v1 } as ApiEndpoint });
}

export async function removeSeoOverrideService(path: string): Promise<{ ok: boolean }> {
  return callApi({ uriEndPoint: { ...seoEndpoints.removeOverride.v1 } as ApiEndpoint, body: { path } });
}
