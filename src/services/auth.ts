import { callApi } from "@/utils/apiUtils";
import authEndpoints from "@/utils/apiUtils/endpoints/auth";
import { ApiEndpoint } from "@/types/api";
import type { AuthUser, Site, Tenant } from "@/types/models";

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
): Promise<{ token: string; user: AuthUser; site: Site; tenant: Tenant }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.signup.v1 } as ApiEndpoint,
    body: body as unknown as Record<string, unknown>,
  });
}

export async function loginService(
  body: LoginPayload
): Promise<{ token: string; user: AuthUser; tenant: Tenant }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.login.v1 } as ApiEndpoint,
    body: body as unknown as Record<string, unknown>,
  });
}

export async function forgotPasswordService(email: string): Promise<{ ok: boolean }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.forgotPassword.v1 } as ApiEndpoint,
    body: { email },
  });
}

export async function resetPasswordService(token: string, password: string): Promise<{ ok: boolean }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.resetPassword.v1 } as ApiEndpoint,
    body: { token, password },
  });
}

export async function changePasswordService(currentPassword: string, newPassword: string): Promise<{ ok: boolean; token?: string }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.changePassword.v1 } as ApiEndpoint,
    body: { currentPassword, newPassword },
  });
}

export async function changeEmailService(newEmail: string, currentPassword: string): Promise<{ user: AuthUser }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.changeEmail.v1 } as ApiEndpoint,
    body: { newEmail, currentPassword },
  });
}

export async function verifyEmailService(token: string): Promise<{ user: AuthUser }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.verifyEmail.v1 } as ApiEndpoint,
    body: { token },
  });
}

export async function resendVerificationService(): Promise<{ ok: boolean }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.resendVerification.v1 } as ApiEndpoint,
  });
}

export async function fetchMeService(): Promise<{ user: AuthUser; tenant: Tenant }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.me.v1 } as ApiEndpoint,
  });
}

export async function logoutAllService(): Promise<{ ok: boolean; token: string }> {
  return callApi({
    uriEndPoint: { ...authEndpoints.logoutAll.v1 } as ApiEndpoint,
  });
}
