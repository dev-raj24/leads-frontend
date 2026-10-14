// types/models.ts — domain types shared across services, hooks, and pages.
// Mirrors the shapes returned by leadworks-api.

export type LeadSource = "form" | "chat_widget" | "whatsapp" | "missed_call" | "offer";
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
  qualified?: boolean;
  customFields?: Record<string, unknown>;
  createdAt: string;
  lastActivityAt: string;
  lastMessage?: { body: string; direction: "inbound" | "outbound"; aiGenerated: boolean; at: string } | null;
  nextFollowup?: { at: string; status: string } | null;
}

export interface CustomerSummary {
  contact: string;
  name: string | null;
  leadCount: number;
  wonCount: number;
  isCustomer: boolean;
  lastSource: LeadSource;
  firstSeenAt: string;
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
  buttonText?: string;
  textColor?: string;
  successMessage?: string;
  modalDelay?: number;
  fontFamily?: string;
  radius?: string;
  customCss?: string;
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
  buttonText?: string;
  textColor?: string;
  successMessage?: string;
  modalDelay?: number;
  fontFamily?: string;
  radius?: string;
  customCss?: string;
  targetUrl?: string;
  whatsappNumber?: string;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface BlogPost {
  id: string;
  tenantId: string;
  siteId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
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
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPostPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: "draft" | "published";
  aiGenerated?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export interface Site {
  id: string;
  tenantId: string;
  domain: string | null;
  apiKey: string;
  publicSlug: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
}

export interface LeadImportRow {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
  data: {
    name?: string;
    contact: string;
    message?: string;
    source: LeadSource;
    customFields?: Record<string, unknown>;
  };
}

export interface LeadImportPreview {
  total: number;
  validCount: number;
  invalidCount: number;
  rows: LeadImportRow[];
}

export type FollowupStatus = "pending" | "approved" | "processing" | "sent" | "manual" | "cancelled";

export interface Followup {
  id: string;
  leadId: string;
  leadName: string;
  leadContact: string;
  runAt: string;
  status: FollowupStatus;
  template: string | null;
  channel: string | null;
  sentAt: string | null;
}

export interface ServiceItem {
  name: string;
  description: string;
  price: string;
  hidePrice: boolean;
}

export interface BusinessProfile {
  about: string;
  services: ServiceItem[];
  timings: string;
  tone: string;
  faqs: string;
}

export interface Message {
  id: string;
  leadId: string;
  channel: string;
  direction: "inbound" | "outbound";
  body: string;
  aiGenerated: boolean;
  createdAt: string;
}

export interface StatsOverview {
  totals: {
    leads: number;
    today: number;
    last7Days: number;
    previous7Days: number;
    won: number;
    waiting: number;
  };
  conversionRate: number;
  avgFirstReplySeconds: number | null;
  aiReplies: number;
  followupsOpen: number;
  daily: Array<{ date: string; leads: number; won: number }>;
  byStatus: Array<{ status: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
}

export type Plan = "free" | "pro";

export interface Tenant {
  id: string;
  name: string;
  plan: Plan;
  industry: string | null;
  onboardingCompleted: boolean;
  planStatus?: string;
  planRenewsAt?: string | null;
  createdAt: string;
}

export interface LeadEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface PlanDef {
  id: Plan;
  name: string;
  priceInr: number;
  leadsPerMonth: number;
  features: { aiReply: boolean; offers: boolean; blog: boolean; autoFollowup: boolean };
}

export interface Usage {
  plan: Plan;
  leadsThisMonth: number;
  leadsLimit: number;
  overLimit: boolean;
  nearLimit: boolean;
}

export interface BillingOverview {
  plan: Plan;
  planStatus: string;
  planRenewsAt: string | null;
  canSubscribe: boolean;
  billingConfigured: boolean;
  usage: Usage;
  plans: PlanDef[];
}

export interface SeoIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  fix: string;
  points: number;
}

export interface SeoPageReport {
  url: string;
  status: number;
  title: string;
  description: string;
  h1: number;
  words: number;
  images: number;
  imagesWithoutAlt: number;
  ms: number;
  score: number;
  jsRendered?: boolean;
  issues: SeoIssue[];
}

export interface SeoFixItem {
  id: string;
  label: string;
  kind: "html" | "text" | "steps";
  where: string;
  value: string;
  note?: string;
  data?: Record<string, unknown>;
}

export interface SeoFixPack {
  url: string;
  items: SeoFixItem[];
  aiUsed: boolean;
  generatedAt: string;
}

export interface SeoReport {
  score: number;
  pages: SeoPageReport[];
  siteIssues: SeoIssue[];
  counts: { critical: number; warning: number; info: number; passedChecks: number };
}

export interface SeoAudit {
  id: string;
  url: string;
  status: "running" | "done" | "failed";
  score: number | null;
  result?: SeoReport | null;
  pageCount?: number;
  fixes?: Record<string, SeoFixPack>;
  aiPlan: string | null;
  error: string | null;
  createdAt: string;
  finishedAt: string | null;
}

export interface SearchConsoleStatus {
  configured: boolean;
  connected: boolean;
  email: string | null;
  property: string | null;
  needsReconnect: boolean;
}

export interface SearchMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchPerformance {
  property: string;
  rangeDays: number;
  startDate: string;
  endDate: string;
  fetchedAt: string;
  totals: SearchMetrics;
  previous: SearchMetrics;
  daily: Array<{ date: string; clicks: number; impressions: number }>;
  queries: Array<SearchMetrics & { query: string }>;
  pages: Array<SearchMetrics & { page: string }>;
}

