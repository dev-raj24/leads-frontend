// lib/api.ts — the ONE place frontend calls the backend from.
// Backend is the separate leadworks-api (Express) project.
// Set NEXT_PUBLIC_API_URL in .env.local, e.g. http://localhost:4001

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

const TOKEN_KEY = "lw_token";

export interface Lead {
  id: string;
  tenantId: string;
  siteId: string | null;
  name: string | null;
  contact: string;
  message: string | null;
  source: "form" | "chat_widget" | "whatsapp" | "missed_call";
  status: "new" | "replied" | "closed" | "won" | "lost";
  score: number;
  customFields?: Record<string, unknown>;
  createdAt: string;
  lastActivityAt: string;
}

export interface Offer {
  id: string;
  tenantId: string;
  siteId: string | null;
  title: string;
  body: string | null;
  active: boolean;
  color?: string;
  displayMode?: string;
  styleVariant?: string;
  actionType?: string;
  promoCode?: string;
  targetUrl?: string;
  whatsappNumber?: string;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  role: string;
}

export interface Site {
  id: string;
  tenantId: string;
  domain: string | null;
  apiKey: string;
  settings: Record<string, unknown>;
  createdAt: string;
}

// ---- session storage (client-side only) ----------------------------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ---- fetch helper -----------------------------------------------------

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`API request failed: ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit, auth = true): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

// ---- auth ---------------------------------------------------------------

export async function signup(input: {
  businessName: string;
  email: string;
  password: string;
  servicesInfo?: string;
}): Promise<{ token: string; user: AuthUser; site: Site }> {
  const result = await apiFetch<{ token: string; user: AuthUser; site: Site }>(
    "/api/auth/signup",
    { method: "POST", body: JSON.stringify(input) },
    false
  );
  setToken(result.token);
  return result;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const result = await apiFetch<{ token: string; user: AuthUser }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify(input) },
    false
  );
  setToken(result.token);
  return result;
}

// ---- leads ----------------------------------------------------------------

export function fetchLeads(status?: string): Promise<{ leads: Lead[] }> {
  const qs = status ? `?status=${status}` : "";
  return apiFetch(`/api/leads${qs}`);
}

export function fetchLead(id: string): Promise<{ lead: Lead }> {
  return apiFetch(`/api/leads/${id}`);
}

export function updateLeadStatus(id: string, status: string): Promise<{ lead: Lead }> {
  return apiFetch(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function downloadLeadTemplate(): Promise<void> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/api/leads/template`, { headers });
  if (!res.ok) throw new Error("Failed to download template");
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads_template.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function uploadLeadPreview(file: File): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch(`${API_URL}/api/leads/upload-preview`, {
    method: "POST",
    headers, // Don't set Content-Type; let the browser set it with the boundary
    body: formData,
  });
  
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body);
  return body;
}

export function bulkCreateLeads(leads: any[]): Promise<{ ok: boolean; count: number }> {
  return apiFetch(`/api/leads/bulk`, {
    method: "POST",
    body: JSON.stringify({ leads }),
  });
}

// ---- site (embed snippet + module settings) -------------------------------

export function fetchMySite(): Promise<{ site: Site }> {
  return apiFetch(`/api/sites/me`);
}

export function updateSiteSettings(
  siteId: string,
  settings: Record<string, unknown>
): Promise<{ site: Site }> {
  return apiFetch(`/api/sites/${siteId}/settings`, {
    method: "PATCH",
    body: JSON.stringify({ settings }),
  });
}

// ---- offers ----------------------------------------------------------------

export function fetchOffers(): Promise<{ offers: Offer[] }> {
  return apiFetch(`/api/offers`);
}

export function createOffer(input: { title: string; body?: string; active?: boolean }): Promise<{ offer: Offer }> {
  return apiFetch(`/api/offers`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
