import { callApi } from "@/utils/apiUtils";
import authEndpoints from "@/utils/apiUtils/endpoints/auth";
import { ApiEndpoint } from "@/types/api";
import type { AuthUser, Site } from "@/types/models";

export interface SignupPayload {
  businessName: string;
  email: string;
  password: string;
  servicesInfo?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function signupService(
  body: SignupPayload
): Promise<{ token: string; user: AuthUser; site: Site }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.signup.v1 } as ApiEndpoint,
    body: body as unknown as Record<string, unknown>,
  });
}

export async function loginService(
  body: LoginPayload
): Promise<{ token: string; user: AuthUser }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.login.v1 } as ApiEndpoint,
    body: body as unknown as Record<string, unknown>,
  });
}
