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
  replied: ["REPLIED", "r"],
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
