import { callApi } from "@/utils/apiUtils";
import endpoints from "@/utils/apiUtils/endpoints/reviews";
import { ApiEndpoint } from "@/types/api";
import type { BusinessMatch, GoogleReview, ReviewConnectionStatus } from "@/types/models";

const ep = (key: keyof typeof endpoints) => ({ ...endpoints[key].v1 }) as ApiEndpoint;

export async function fetchReviewStatusService(): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("status") });
}

export async function searchBusinessService(q: string): Promise<{ matches: BusinessMatch[] }> {
  return callApi({ uriEndPoint: ep("search"), query: { q } });
}

export async function chooseBusinessService(match: BusinessMatch): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("choose"), body: { dataId: match.dataId, title: match.title, address: match.address } });
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

export async function copyReviewReplyService(id: string, text: string): Promise<{ review: GoogleReview }> {
  return callApi({ uriEndPoint: ep("copy"), pathParams: { id }, body: { text } });
}

export async function disconnectReviewsService(): Promise<{ status: ReviewConnectionStatus }> {
  return callApi({ uriEndPoint: ep("disconnect") });
}
