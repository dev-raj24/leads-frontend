// shared/types.ts — types BOTH backend and frontend import.
// Keeps the "one definition of Lead" rule from PROJECT_STRUCTURE.md.

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
  createdAt: string;
  lastActivityAt: string;
}

export interface IngestLeadInput {
  siteKey: string;
  name?: string;
  contact: string;
  message?: string;
}
