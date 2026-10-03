// lib/errors.ts — turn API failures into short, user-facing messages.
import { ApiError } from "@/utils/apiUtils";

export function apiErrorCode(err: unknown): string | null {
  if (err instanceof ApiError) return (err.body as { error?: string })?.error ?? `http_${err.status}`;
  return null;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Wrong email or password.",
  email_in_use: "An account with this email already exists. Try logging in.",
  weak_password: "Password must be 8 to 72 characters.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
  invalid_email: "Please enter a valid email address.",
  missing_business_name: "Please enter your business name.",
  business_name_too_long: "Business name must be 120 characters or fewer.",
  invalid_or_expired_token: "This reset link is invalid or has expired. Please request a new one.",
  missing_industry: "Please choose what kind of business this is.",
  invalid_plan: "Please choose a plan.",
  database_not_configured: "The backend has no database configured yet — see leadworks-api/.env.example.",
  wrong_current_password: "Your current password is incorrect.",
  missing_current_password: "Please enter your current password.",
  pro_required: "This feature is only available on the Pro plan.",
  not_manual: "This follow-up isn't waiting to be sent manually anymore.",
  no_email_on_file: "This contact doesn't have an email on file — copy the message and send it yourself.",
  mail_not_configured: "Email sending isn't set up yet — copy the message and send it yourself.",
  send_failed: "Couldn't send the email — copy the message and send it yourself.",
  missing_text: "Write a reply before sending.",
  payment_required: "Upgrading to Pro goes through checkout. Open Account → Subscription.",
  billing_not_configured: "Payments aren't switched on yet. Please check back soon.",
  payment_provider_error: "The payment provider couldn't start checkout. Please try again in a moment.",
  already_subscribed: "You're already on Pro.",
  no_active_subscription: "There's no active subscription to cancel.",
  domain_not_allowed: "That website isn't on your allowed list.",
  text_too_long: "That reply is too long — keep it under 4000 characters.",
};

export function authErrorMessage(err: unknown): string {
  const code = apiErrorCode(err);
  if (code && MESSAGES[code]) return MESSAGES[code];
  return code ? "Something went wrong. Please try again." : "Couldn't reach the server. Is leadworks-api running?";
}
