// lib/session.ts — the ONE place the JWT + signed-in user live (client-side only).
// utils/apiUtils reads getToken() to build the Authorization header.

import type { AuthUser } from "@/types/models";

export const TOKEN_KEY = "lw_token";
const USER_KEY = "lw_user";

const canUseStorage = () => typeof window !== "undefined";

export function getToken(): string | null {
  return canUseStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function getUser(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
