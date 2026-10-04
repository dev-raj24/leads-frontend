// lib/format.ts — small display helpers shared across portal pages.

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days`;
  return new Date(iso).toLocaleDateString();
}

const STATUS_LABEL: Record<string, [string, string]> = {
  new: ["NEW", "n"],
  replied: ["CONTACTED", "r"],
  closed: ["CLOSED", "c"],
  won: ["WON", "w"],
  lost: ["LOST", "c"],
};

export function statusLabel(status: string): [string, string] {
  return STATUS_LABEL[status] ?? [status.toUpperCase(), "n"];
}

const SOURCE_LABEL: Record<string, string> = {
  form: "Website",
  chat_widget: "Chat",
  whatsapp: "WhatsApp",
  missed_call: "Missed call",
  offer: "Offer",
};

export function sourceLabel(source: string): string {
  return SOURCE_LABEL[source] ?? source;
}

export function maskContact(contact: string): string {
  // Show enough to recognize, hide the rest — same idea as the phone mask
  // used in the lead-detail mockup.
  if (contact.includes("@")) return contact; // emails shown in full
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 6) return contact;
  return `${digits.slice(0, 4)}••• •${digits.slice(-3)}`;
}

export function initials(nameOrContact: string | null | undefined): string {
  const s = (nameOrContact ?? "").trim();
  if (!s) return "?";
  const parts = s.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[1][0] : "")).toUpperCase() || "?";
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  return h < 5 ? "Working late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function formatPercent(ratio: number, digits = 0): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
  return `${(seconds / 86400).toFixed(1)}d`;
}

export function trendPercent(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

const SKIP_REASON: Record<string, string> = {
  profile_incomplete: "your business profile is still empty",
  already_replied_today: "they already got an automatic reply today",
  unsubscribed: "they asked not to get automatic emails",
  automated_address: "it is a no-reply address",
  invalid_address: "there is no email address",
  ai_unavailable: "the AI took too long or was unavailable. You can still draft a reply with AI yourself",
  email_not_verified: "your email is not confirmed yet",
  monthly_limit: "the monthly lead limit was reached",
};

export function eventLabel(type: string, payload: Record<string, unknown>): string | null {
  const reason = typeof payload.reason === "string" ? (SKIP_REASON[payload.reason] ?? payload.reason) : "";
  switch (type) {
    case "created":
      return "Lead received";
    case "became_lead":
      return "Shared contact details, became a lead";
    case "owner_alerted":
      return "You were emailed about this lead";
    case "owner_alert_skipped":
      return `No alert emailed to you: ${reason}`;
    case "owner_alert_failed":
      return "We couldn't email you about this lead";
    case "ai_reply_sent":
      return payload.channel === "email" ? "AI replied by email" : "AI wrote a reply (not emailed: no email address to send it to)";
    case "ai_reply_skipped":
      return `AI reply skipped: ${reason}`;
    case "ai_reply_email_skipped":
      return `Automatic email not sent: ${reason}`;
    case "automation_paused":
      return `Automations paused: ${reason}`;
    case "manual_reply_sent":
      return "You replied by email";
    case "followup_sent":
      return "Follow-up sent";
    case "followup_skipped":
      return `Follow-up skipped: ${reason}`;
    case "offer_submitted":
      return typeof payload.title === "string" ? `Filled the offer form: ${payload.title}` : "Filled an offer form";
    case "status_changed":
      return typeof payload.status === "string" ? `Marked as ${payload.status}` : "Status changed";
    default:
      return null;
  }
}

export interface NextStep {
  key: "reply" | "call" | "approve" | "wait" | "followup" | "won" | "closed";
  label: string;
  hint: string;
  needsYou: boolean;
}

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { weekday: "short", hour: "numeric", minute: "2-digit" });

/** The one thing to do next for a lead, worked out from its status, last message and queued follow-up. */
export function nextStepFor(lead: {
  status: string;
  contact: string;
  lastMessage?: { direction: "inbound" | "outbound"; aiGenerated: boolean } | null;
  nextFollowup?: { at: string; status: string } | null;
}): NextStep {
  if (lead.status === "won") return { key: "won", label: "Won", hint: "Deal closed", needsYou: false };
  if (lead.status === "lost" || lead.status === "closed") return { key: "closed", label: "Closed", hint: lead.status === "lost" ? "Marked lost" : "Marked closed", needsYou: false };

  const hasEmail = lead.contact.includes("@");
  const customerSpokeLast = !lead.lastMessage || lead.lastMessage.direction === "inbound";

  if (!hasEmail && lead.status === "new") {
    return { key: "call", label: "Call them", hint: "Phone number only, no email to reply to", needsYou: true };
  }

  if (customerSpokeLast) {
    return hasEmail
      ? { key: "reply", label: "Reply now", hint: "They are waiting for an answer", needsYou: true }
      : { key: "call", label: "Call them", hint: "Phone number only, no email to reply to", needsYou: true };
  }
  if (lead.nextFollowup?.status === "pending") {
    return { key: "approve", label: "Approve follow-up", hint: `Goes out ${when(lead.nextFollowup.at)} once you approve`, needsYou: true };
  }
  if (lead.nextFollowup) {
    return { key: "followup", label: "Follow-up queued", hint: `Goes out ${when(lead.nextFollowup.at)}`, needsYou: false };
  }
  return {
    key: "wait",
    label: "Waiting for them",
    hint: lead.lastMessage?.aiGenerated ? "AI replied, no answer yet" : "You replied, no answer yet",
    needsYou: false,
  };
}
