import axios, { AxiosRequestConfig } from "axios";
import { hostname } from "./hostname";
import { ApiEndpoint } from "@/types/api";
import { getToken } from "@/lib/session";

const authHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const client = axios.create({
  baseURL: hostname(),
});

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`API request failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface CallApiParams {
  uriEndPoint: ApiEndpoint;
  body?: Record<string, unknown> | FormData;
  query?: Record<string, unknown> | string;
  pathParams?: Record<string, string>;
  additionalHeaders?: Record<string, string>;
  responseType?: AxiosRequestConfig["responseType"];
}

export const makeUrl = ({
  uri,
  pathParams,
  query,
}: {
  uri: string;
  pathParams?: Record<string, string>;
  query?: Record<string, unknown> | string;
}): string => {
  const queryString = query
    ? typeof query === "string"
      ? query
      : Object.keys(query)
          .filter((key) => query[key] !== undefined && query[key] !== null)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
          .join("&")
    : "";
  return `${uri
    .split("/")
    .map((param) =>
      param.charAt(0) === ":" && pathParams
        ? encodeURIComponent(pathParams[param.slice(1)])
        : param
    )
    .join("/")}${queryString ? `?${queryString}` : ""}`;
};

export const callApi = async ({
  uriEndPoint,
  body,
  query,
  pathParams,
  additionalHeaders,
  responseType,
}: CallApiParams): Promise<any> => {
  const url = makeUrl({
    uri: uriEndPoint.version + uriEndPoint.uri,
    pathParams,
    query,
  });
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const options: AxiosRequestConfig = {
    method: uriEndPoint.method,
    url,
    headers: {
      ...authHeader(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...additionalHeaders,
    },
    data: body,
    responseType,
  };

  try {
    const response = await client(options);
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      throw new ApiError(error.response.status, error.response.data);
    }
    throw error;
  }
};

export default client;
