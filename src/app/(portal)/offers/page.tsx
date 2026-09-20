"use client";

import { useState } from "react";
import { IconEdit, IconPlus, IconTag, IconTrash } from "@/components/icons";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Table, type Column } from "@/components/ui/Table";
import { useGetOffers } from "@/hooks/offer/query";
import { useDeleteOffer, useUpdateOffer } from "@/hooks/offer/mutation";
import type { Offer } from "@/types/models";

const ACTION_LABEL: Record<string, string> = { link: "Opens a link", whatsapp: "WhatsApp chat", promo: "Shows promo code" };
const PLACEMENT_LABEL: Record<string, string> = { top: "Top banner", "bottom-left": "Bottom corner", none: "Hidden" };

export default function OffersPage() {
  const { data, isLoading } = useGetOffers();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const [deleting, setDeleting] = useState<Offer | null>(null);
  const offers: Offer[] = data?.offers ?? [];

  const columns: Column<Offer>[] = [
    {
      key: "offer",
      header: "Offer",
      width: "minmax(0, 1.8fr)",
      sort: (o) => o.title.toLowerCase(),
      cell: (o) => (
        <div className="cell-t">
          <strong>{o.title}</strong>
          <small>{o.body || "No description"}</small>
        </div>
      ),
    },
    {
      key: "placement",
      header: "Placement",
      width: "minmax(0, 1fr)",
      hideOnMobile: true,
      sort: (o) => o.displayMode ?? "top",
      cell: (o) => <span className="src">{PLACEMENT_LABEL[o.displayMode ?? "top"] ?? o.displayMode}</span>,
    },
    {
      key: "action",
      header: "On tap",
      width: "minmax(0, 1fr)",
      hideOnMobile: true,
      cell: (o) => <span className="src">{ACTION_LABEL[o.actionType ?? "link"] ?? o.actionType}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      sort: (o) => (o.active ? 0 : 1),
      cell: (o) => <span className={`pp ${o.active ? "w" : "c"}`}>{o.active ? "● LIVE" : "PAUSED"}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "190px",
      align: "right",
      cell: (o) => (
        <div className="row-actions">
          <button
            className={`tgl ${o.active ? "on" : ""}`}
            onClick={() => updateOffer.mutate({ id: o.id, active: !o.active })}
            role="switch"
            aria-checked={o.active}
            aria-label={o.active ? "Pause offer" : "Activate offer"}
          />
          <Button href={`/offers/new?id=${o.id}`} variant="secondary" size="sm" icon={<IconEdit size={14} />}>Edit</Button>
          <Button variant="ghost" size="sm" iconOnly ariaLabel="Delete offer" icon={<IconTrash size={16} />} onClick={() => setDeleting(o)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHead
        eyebrow="Promotions"
        title="Offers"
        sub="Banners and discounts shown live on your website."
        actions={<Button href="/offers/new" icon={<IconPlus size={15} />}>Create offer</Button>}
      />

      {isLoading && <ListSkeleton />}

      {!isLoading && offers.length === 0 && (
        <div className="pnl">
          <EmptyState
            icon={<IconTag size={26} />}
            title="No offers yet"
            text="Create an offer to showcase a discount, an announcement or a booking badge on your site."
            action={<Button href="/offers/new" icon={<IconPlus size={15} />}>Create offer</Button>}
          />
        </div>
      )}

      {!isLoading && offers.length > 0 && (
        <Table columns={columns} rows={offers} rowKey={(o) => o.id} pageSize={10} itemLabel="offers" />
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete this offer?"
        message={deleting ? `"${deleting.title}" will be removed from your site. This can't be undone.` : ""}
        confirmText="Delete offer"
        isLoading={deleteOffer.isPending}
        onConfirm={() => deleting && deleteOffer.mutate(deleting.id, { onSettled: () => setDeleting(null) })}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
