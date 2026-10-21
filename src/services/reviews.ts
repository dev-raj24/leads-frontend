import { callApi } from "@/utils/apiUtils";
import endpoints from "@/utils/apiUtils/endpoints/reviews";
import { ApiEndpoint } from "@/types/api";
import type { GoogleLocation, GoogleReview, ReviewConnectionStatus } from "@/types/models";

const ep = (key: keyof typeof endpoints) => ({ ...endpoints[key].v1 }) as ApiEndpoint;

export async function fetchReviewStatusService(): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("status") });
}

export async function connectReviewsService(): Promise<{ url: string }> {
  return callApi({ uriEndPoint: ep("connect") });
}

export async function fetchReviewLocationsService(): Promise<{ locations: GoogleLocation[] }> {
  return callApi({ uriEndPoint: ep("locations") });
}

export async function chooseReviewLocationService(location: GoogleLocation): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("choose"), body: { accountId: location.accountId, locationId: location.locationId } });
}

export async function fetchReviewsService(): Promise<{ reviews: GoogleReview[] }> {
  return callApi({ uriEndPoint: ep("list") });
}

export async function syncReviewsService(): Promise<{ reviews: GoogleReview[] }> {
  return callApi({ uriEndPoint: ep("sync") });
}

export async function regenerateReviewDraftService(id: string): Promise<{ review: GoogleReview }> {
  return callApi({ uriEndPoint: ep("regenerate"), pathParams: { id } });
}

export async function skipReviewService(id: string): Promise<{ review: GoogleReview }> {
  return callApi({ uriEndPoint: ep("skip"), pathParams: { id } });
}

export async function sendReviewReplyService(id: string, text: string): Promise<{ review: GoogleReview }> {
  return callApi({ uriEndPoint: ep("send"), pathParams: { id }, body: { text } });
}

export async function disconnectReviewsService(): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("disconnect") });
}
