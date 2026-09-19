// lib/errors.ts — turn API failures into short, user-facing messages.
import { ApiError } from "@/utils/apiUtils";

export function apiErrorCode(err: unknown): string | null {
  if (err instanceof ApiError) return (err.body as { error?: string })?.error ?? `http_${err.status}`;
  return null;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Wrong email or password.",
  email_in_use: "An account with this email already exists. Try logging in.",
  weak_password: "Password must be at least 6 characters.",
  invalid_email: "Please enter a valid email address.",
  missing_business_name: "Please enter your business name.",
  database_not_configured: "The backend has no database configured yet — see leadworks-api/.env.example.",
};

export function authErrorMessage(err: unknown): string {
  const code = apiErrorCode(err);
  if (code && MESSAGES[code]) return MESSAGES[code];
  return code ? "Something went wrong. Please try again." : "Couldn't reach the server. Is leadworks-api running?";
}
