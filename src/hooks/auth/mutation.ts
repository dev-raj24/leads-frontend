import { useMutation } from "@tanstack/react-query";
import { signupService, loginService, type SignupPayload, type LoginPayload } from "@/services/auth";
import { setSession } from "@/lib/session";

export const useSignup = () =>
  useMutation({
    mutationFn: (body: SignupPayload) => signupService(body),
    onSuccess: (res) => setSession(res.token, res.user),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (body: LoginPayload) => loginService(body),
    onSuccess: (res) => setSession(res.token, res.user),
  });
