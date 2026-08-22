// types/api.ts — the shape every endpoint definition follows.
// { method, version, uri } gets spread into callApi() to build a request.

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiEndpoint {
  method: HttpMethod;
  version: string;
  uri: string;
}
