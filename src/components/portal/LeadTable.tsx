import { Table, type Column } from "@/components/ui/Table";
import { IconChat, IconGlobe, IconPhone, IconTag, IconWhatsapp } from "@/components/icons";
import { initials, sourceLabel, statusLabel, timeAgo } from "@/lib/format";
import type { Lead } from "@/types/models";

const SOURCE_ICON: Record<string, typeof IconGlobe> = {
  form: IconGlobe,
  whatsapp: IconWhatsapp,
  chat_widget: IconChat,
  missed_call: IconPhone,
  offer: IconTag,
};

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
          <small>{lead.message ?? lead.contact}</small>
        </div>
      </div>
    ),
  },
  {
    key: "source",
    header: "Source",
    width: "minmax(0, 1fr)",
    hideOnMobile: true,
    sort: (l) => l.source,
    cell: (lead) => {
      const Icon = SOURCE_ICON[lead.source] ?? IconGlobe;
      return <span className="src"><Icon size={15} />{sourceLabel(lead.source)}</span>;
    },
  },
  {
    key: "status",
    header: "Status",
    width: "120px",
    sort: (l) => l.status,
    cell: (lead) => {
      const [label, cls] = statusLabel(lead.status);
      return <span className={`pp ${cls}`}>{label}</span>;
    },
  },
  {
    key: "received",
    header: "Received",
    width: "100px",
    align: "right",
    hideOnMobile: true,
    sort: (l) => new Date(l.createdAt).getTime(),
    cell: (lead) => <span className="ago">{timeAgo(lead.createdAt)}</span>,
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
