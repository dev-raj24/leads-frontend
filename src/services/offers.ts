import { callApi } from "@/utils/apiUtils";
import offersEndpoints from "@/utils/apiUtils/endpoints/offers";
import { ApiEndpoint } from "@/types/api";
import type { Offer, OfferPayload } from "@/types/models";

export async function fetchOffersService(): Promise<{ offers: Offer[] }> {
  return callApi({
    uriEndPoint: { ...offersEndpoints.list.v1 } as ApiEndpoint,
  });
}

export async function createOfferService(body: OfferPayload): Promise<{ offer: Offer }> {
  return callApi({
    uriEndPoint: { ...offersEndpoints.create.v1 } as ApiEndpoint,
    body: body as Record<string, unknown>,
  });
}

export async function updateOfferService(id: string, body: OfferPayload): Promise<{ offer: Offer }> {
  return callApi({
    uriEndPoint: { ...offersEndpoints.update.v1 } as ApiEndpoint,
    pathParams: { id },
    body: body as Record<string, unknown>,
  });
}

export async function deleteOfferService(id: string): Promise<{ ok: boolean }> {
  return callApi({
    uriEndPoint: { ...offersEndpoints.delete.v1 } as ApiEndpoint,
    pathParams: { id },
  });
}
