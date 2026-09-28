"use client";

import { use } from "react";
import Link from "next/link";
import { IconChat, IconGlobe, IconPhone, IconWhatsapp } from "@/components/icons";
import { useCustomer } from "@/hooks/customers/query";
import { Skeleton } from "@/components/ui/Skeleton";
import { apiErrorCode } from "@/lib/errors";
import { initials, sourceLabel, statusLabel, timeAgo } from "@/lib/format";
import type { FollowupStatus } from "@/types/models";

const SOURCE_ICON = { form: IconGlobe, whatsapp: IconWhatsapp, chat_widget: IconChat, missed_call: IconPhone } as const;

const FOLLOWUP_STATUS: Record<FollowupStatus, [string, string]> = {
  pending: ["p", "NEEDS APPROVAL"],
  approved: ["n", "APPROVED"],
  processing: ["n", "SENDING"],
  manual: ["r", "SEND MANUALLY"],
  sent: ["w", "SENT"],
  cancelled: ["c", "CANCELLED"],
};

export default function CustomerDetailPage({ params }: { params: Promise<{ contact: string }> }) {
  const { contact: rawContact } = use(params);
  const contact = decodeURIComponent(rawContact);
  const { data, isLoading, error } = useCustomer(contact);

  if (isLoading) {
    return (
      <>
        <Skeleton width={90} height={14} style={{ marginBottom: 24 }} />
        <div className="grid">
          <div className="g-8"><div className="pnl pad"><Skeleton width="40%" height={32} /><Skeleton width="70%" height={14} style={{ marginTop: 18 }} /></div></div>
          <div className="g-4"><div className="pnl pad"><Skeleton height={160} /></div></div>
        </div>
      </>
    );
  }

  if (error || !data) {
    const notFound = apiErrorCode(error) === "customer_not_found";
    return (
      <>
        <Link href="/customers" className="back">← All customers</Link>
        <div className="state-err">{notFound ? "This customer doesn't exist." : "Couldn't load this customer — is leadworks-api running?"}</div>
      </>
    );
  }

  const { customer, leads, followups } = data;
  const isEmail = customer.contact.includes("@");
  const openFollowups = followups.filter((f) => f.status === "pending" || f.status === "approved" || f.status === "manual");

  return (
    <>
      <Link href="/customers" className="back">← All customers</Link>

      <div className="grid">
        <div className="g-8">
          <div className="pnl">
            <div className="lead-h">
              <span className="av">{initials(customer.name ?? customer.contact)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2>{customer.name ?? "Unknown contact"}</h2>
                <small>
                  {customer.leadCount} {customer.leadCount === 1 ? "enquiry" : "enquiries"} · first seen {timeAgo(customer.firstSeenAt)} ago
                </small>
              </div>
              <span className={`pp ${customer.isCustomer ? "w" : "c"}`}>{customer.isCustomer ? "CUSTOMER" : "LEAD"}</span>
            </div>

            <div className="sec-t" style={{ padding: "0 24px" }}>Enquiry history</div>
            <div className="pnl" style={{ border: "none", borderRadius: 0 }}>
              {leads.map((lead) => {
                const [label, cls] = statusLabel(lead.status);
                const SourceIcon = SOURCE_ICON[lead.source] ?? IconGlobe;
                return (
                  <Link key={lead.id} href={`/leads/${lead.id}`} className="fu" style={{ display: "block" }}>
                    <div className="fu-top">
                      <span className="src"><SourceIcon size={14} />{sourceLabel(lead.source)}</span>
                      <span className={`pp ${cls}`}>{label}</span>
                    </div>
                    <div className="fu-why">{lead.message ?? "No message left."}</div>
                    <div className="ago" style={{ marginTop: 6 }}>{timeAgo(lead.createdAt)} ago</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="g-4" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div className="sec-t">Details</div>
            <div className="pnl">
              <div className="dl">
                <div className="dl-r"><span>Contact</span><span>{isEmail ? <a href={`mailto:${customer.contact}`}>{customer.contact}</a> : <a href={`tel:${customer.contact}`}>{customer.contact}</a>}</span></div>
                <div className="dl-r"><span>Total enquiries</span><span>{customer.leadCount}</span></div>
                <div className="dl-r"><span>Won deals</span><span>{customer.wonCount}</span></div>
                <div className="dl-r"><span>First seen</span><span>{timeAgo(customer.firstSeenAt)} ago</span></div>
                <div className="dl-r"><span>Last activity</span><span>{timeAgo(customer.lastActivityAt)} ago</span></div>
              </div>
            </div>
          </div>

          {openFollowups.length > 0 && (
            <div>
              <div className="sec-t">Open follow-ups</div>
              <div className="pnl">
                {openFollowups.map((f) => {
                  const [cls, label] = FOLLOWUP_STATUS[f.status];
                  return (
                    <Link key={f.id} href={`/leads/${f.leadId}`} className="fu" style={{ display: "block" }}>
                      <div className="fu-top">
                        <span className="ago">Due {new Date(f.runAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        <span className={`pp ${cls}`}>{label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
