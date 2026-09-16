// types/models.ts — domain types shared across services, hooks, and pages.
// Mirrors the shapes returned by leadworks-api.

export type LeadSource = "form" | "chat_widget" | "whatsapp" | "missed_call";
export type LeadStatus = "new" | "replied" | "closed" | "won" | "lost";

export interface Lead {
  id: string;
  tenantId: string;
  siteId: string | null;
  name: string | null;
  contact: string;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
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

export interface OfferPayload {
  title?: string;
  body?: string;
  active?: boolean;
  color?: string;
  displayMode?: string;
  styleVariant?: string;
  actionType?: string;
  promoCode?: string;
  targetUrl?: string;
  whatsappNumber?: string;
}

export interface BlogPost {
  id: string;
  tenantId: string;
  siteId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  aiGenerated: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDraft {
  title: string;
  excerpt: string;
  content: string;
}

export interface BlogPostPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: "draft" | "published";
  aiGenerated?: boolean;
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
