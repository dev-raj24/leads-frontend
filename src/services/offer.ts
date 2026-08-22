import { callApi } from "@/utils/apiUtils";
import offers from "@/utils/apiUtils/endpoints/offers";
import { ApiEndpoint } from "@/types/api";

export interface OfferPayload {
  title?: string;
  body?: string;
  active?: boolean;
  color?: string;
  displayMode?: string;
  styleVariant?: string;
  actionType?: string;
  promoCode?: string;
  targetUrl?: string;
  whatsappNumber?: string;
}

export async function fetchOffersService() {
  return callApi({
    uriEndPoint: { ...offers.list.v1 } as ApiEndpoint,
  });
}

export async function createOfferService({ body }: { body: OfferPayload }) {
  return callApi({
    uriEndPoint: { ...offers.create.v1 } as ApiEndpoint,
    body: body as Record<string, unknown>,
  });
}

export async function updateOfferService({ pathParams, body }: { pathParams: { id: string }; body: OfferPayload }) {
  return callApi({
    uriEndPoint: { ...offers.update.v1 } as ApiEndpoint,
    pathParams,
    body: body as Record<string, unknown>,
  });
}

export async function deleteOfferService({ pathParams }: { pathParams: { id: string } }) {
  return callApi({
    uriEndPoint: { ...offers.delete.v1 } as ApiEndpoint,
    pathParams,
  });
}
