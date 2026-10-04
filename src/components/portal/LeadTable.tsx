import { Table, type Column } from "@/components/ui/Table";
import { IconChat, IconGlobe, IconPhone, IconTag, IconWhatsapp } from "@/components/icons";
import { initials, nextStepFor, sourceLabel, timeAgo } from "@/lib/format";
import type { Lead } from "@/types/models";

const SOURCE_ICON: Record<string, typeof IconGlobe> = {
  form: IconGlobe,
  whatsapp: IconWhatsapp,
  chat_widget: IconChat,
  missed_call: IconPhone,
  offer: IconTag,
};

const STEP_PILL: Record<string, string> = { reply: "r", call: "r", approve: "p", wait: "n", followup: "n", won: "w", closed: "c" };

const COLUMNS: Column<Lead>[] = [
  {
    key: "lead",
    header: "Lead",
    width: "minmax(0, 1.7fr)",
    sort: (l) => (l.name ?? l.contact).toLowerCase(),
    cell: (lead) => (
      <div className="who">
        <span className="av">{initials(lead.name ?? lead.contact)}</span>
        <div className="who-t">
          <strong>{lead.name ?? lead.contact}</strong>
          <small>
            {lead.lastMessage ? `${lead.lastMessage.direction === "inbound" ? "" : lead.lastMessage.aiGenerated ? "AI: " : "You: "}${lead.lastMessage.body}` : (lead.message ?? lead.contact)}
          </small>
        </div>
      </div>
    ),
  },
  {
    key: "source",
    header: "From",
    width: "minmax(0, 0.8fr)",
    hideOnMobile: true,
    sort: (l) => l.source,
    cell: (lead) => {
      const Icon = SOURCE_ICON[lead.source] ?? IconGlobe;
      return <span className="src"><Icon size={15} />{sourceLabel(lead.source)}</span>;
    },
  },
  {
    key: "next",
    header: "Next step",
    width: "minmax(0, 1.3fr)",
    sort: (l) => (nextStepFor(l).needsYou ? 0 : 1),
    cell: (lead) => {
      const step = nextStepFor(lead);
      return (
        <div className="step">
          <span className={`pp ${STEP_PILL[step.key]}`}>{step.label.toUpperCase()}</span>
          <small>{step.hint}</small>
        </div>
      );
    },
  },
  {
    key: "received",
    header: "Last activity",
    width: "110px",
    align: "right",
    hideOnMobile: true,
    sort: (l) => new Date(l.lastMessage?.at ?? l.lastActivityAt).getTime(),
    cell: (lead) => <span className="ago">{timeAgo(lead.lastMessage?.at ?? lead.lastActivityAt)}</span>,
  },
];

interface LeadTableProps {
  leads: Lead[];
  pageSize?: number;
  bare?: boolean;
}

export function LeadTable({ leads, pageSize, bare }: LeadTableProps) {
  return (
    <Table
      columns={COLUMNS}
      rows={leads}
      rowKey={(l) => l.id}
      rowHref={(l) => `/leads/${l.id}`}
      pageSize={pageSize}
      defaultSort={{ key: "received", dir: "desc" }}
      itemLabel="leads"
      bare={bare}
    />
  );
}
