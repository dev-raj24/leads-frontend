import { useMutation } from "@tanstack/react-query";
import {
  changeEmailService,
  changePasswordService,
  forgotPasswordService,
  loginService,
  resendVerificationService,
  resetPasswordService,
  verifyEmailService,
  signupService,
  type LoginPayload,
  type SignupPayload,
} from "@/services/auth";
import { setSession, setUser } from "@/lib/session";

export const useSignup = () =>
  useMutation({
    mutationFn: (body: SignupPayload) => signupService(body),
    onSuccess: (res) => setSession(res.token, res.user, res.tenant),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginPayload) => loginService(body),
    onSuccess: (res) => setSession(res.token, res.user, res.tenant),
  });

export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => forgotPasswordService(email) });

export const useResetPassword = () =>
  useMutation({ mutationFn: ({ token, password }: { token: string; password: string }) => resetPasswordService(token, password) });

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePasswordService(currentPassword, newPassword),
  });

export const useChangeEmail = () =>
  useMutation({
    mutationFn: ({ newEmail, currentPassword }: { newEmail: string; currentPassword: string }) =>
      changeEmailService(newEmail, currentPassword),
    onSuccess: (res) => setUser(res.user),
  });

export const useResendVerification = () => useMutation({ mutationFn: () => resendVerificationService() });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (token: string) => verifyEmailService(token),
    onSuccess: (res) => setUser(res.user),
  });
