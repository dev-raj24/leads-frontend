export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";



export interface ApiEndpoint {
  method: HttpMethod;
  version: string;
  uri: string;
}
