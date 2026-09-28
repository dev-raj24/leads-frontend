// lib/session.ts — the ONE place the JWT + signed-in user/tenant live (client-side only).
// utils/apiUtils reads getToken() to build the Authorization header.

import type { AuthUser, Tenant } from "@/types/models";

export const TOKEN_KEY = "lw_token";
const USER_KEY = "lw_user";
const TENANT_KEY = "lw_tenant";

const canUseStorage = () => typeof window !== "undefined";

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return canUseStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function getUser(): AuthUser | null {
  return readJson<AuthUser>(USER_KEY);
}

export function getTenant(): Tenant | null {
  return readJson<Tenant>(TENANT_KEY);
}

export function setSession(token: string, user: AuthUser, tenant: Tenant) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
}

export function setTenant(tenant: Tenant) {
  window.localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
}

const USER_UPDATED_EVENT = "lw:user-updated";

export function setUser(user: AuthUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent<AuthUser>(USER_UPDATED_EVENT, { detail: user }));
}

/** Notifies other mounted components (e.g. the sidebar) when the signed-in user changes — same tab, no reload needed. */
export function onUserUpdated(cb: (user: AuthUser) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<AuthUser>).detail);
  window.addEventListener(USER_UPDATED_EVENT, handler);
  return () => window.removeEventListener(USER_UPDATED_EVENT, handler);
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(TENANT_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
