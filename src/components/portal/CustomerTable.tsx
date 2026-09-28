import { Table, type Column } from "@/components/ui/Table";
import { IconChat, IconGlobe, IconPhone, IconWhatsapp } from "@/components/icons";
import { initials, sourceLabel, timeAgo } from "@/lib/format";
import type { CustomerSummary } from "@/types/models";

const SOURCE_ICON: Record<string, typeof IconGlobe> = {
  form: IconGlobe,
  whatsapp: IconWhatsapp,
  chat_widget: IconChat,
  missed_call: IconPhone,
};

const COLUMNS: Column<CustomerSummary>[] = [
  {
    key: "customer",
    header: "Customer",
    width: "minmax(0, 1.7fr)",
    sort: (c) => (c.name ?? c.contact).toLowerCase(),
    cell: (c) => (
      <div className="who">
        <span className="av">{initials(c.name ?? c.contact)}</span>
        <div className="who-t">
          <strong>{c.name ?? c.contact}</strong>
          <small>{c.contact}</small>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "120px",
    sort: (c) => (c.isCustomer ? 1 : 0),
    cell: (c) => <span className={`pp ${c.isCustomer ? "w" : "c"}`}>{c.isCustomer ? "CUSTOMER" : "LEAD"}</span>,
  },
  {
    key: "enquiries",
    header: "Enquiries",
    width: "110px",
    align: "right",
    sort: (c) => c.leadCount,
    cell: (c) => <span className="ago" style={{ textAlign: "right" }}>{c.leadCount}</span>,
  },
  {
    key: "source",
    header: "Last source",
    width: "minmax(0, 1fr)",
    hideOnMobile: true,
    sort: (c) => c.lastSource,
    cell: (c) => {
      const Icon = SOURCE_ICON[c.lastSource] ?? IconGlobe;
      return <span className="src"><Icon size={15} />{sourceLabel(c.lastSource)}</span>;
    },
  },
  {
    key: "activity",
    header: "Last activity",
    width: "110px",
    align: "right",
    hideOnMobile: true,
    sort: (c) => new Date(c.lastActivityAt).getTime(),
    cell: (c) => <span className="ago">{timeAgo(c.lastActivityAt)}</span>,
  },
];

interface CustomerTableProps {
  customers: CustomerSummary[];
  pageSize?: number;
}

export function CustomerTable({ customers, pageSize }: CustomerTableProps) {
  return (
    <Table
      columns={COLUMNS}
      rows={customers}
      rowKey={(c) => c.contact}
      rowHref={(c) => `/customers/${encodeURIComponent(c.contact)}`}
      pageSize={pageSize}
      defaultSort={{ key: "activity", dir: "desc" }}
      itemLabel="customers"
    />
  );
}
