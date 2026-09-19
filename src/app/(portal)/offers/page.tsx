"use client";

import { useState } from "react";
import { IconEdit, IconPlus, IconTag, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useGetOffers } from "@/hooks/offer/query";
import { useDeleteOffer, useUpdateOffer } from "@/hooks/offer/mutation";
import type { Offer } from "@/types/models";

export default function OffersPage() {
  const { data, isLoading } = useGetOffers();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const [deleting, setDeleting] = useState<Offer | null>(null);
  const offers: Offer[] = data?.offers ?? [];

  function confirmDelete() {
    if (!deleting) return;
    deleteOffer.mutate(deleting.id, { onSettled: () => setDeleting(null) });
  }

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
        <div className="pnl">
          {offers.map((offer) => (
            <div key={offer.id} className={`li ${offer.active ? "live" : ""}`}>
              <div className="li-main">
                <div className="li-title">
                  {offer.title}
                  <span className={`pp ${offer.active ? "w" : "c"}`}>{offer.active ? "● LIVE" : "PAUSED"}</span>
                </div>
                <div className="li-sub">{offer.body || "No description"}</div>
              </div>
              <div className="li-act">
                <Button href={`/offers/new?id=${offer.id}`} variant="secondary" size="sm" icon={<IconEdit size={14} />}>Edit</Button>
                <button
                  className={`tgl ${offer.active ? "on" : ""}`}
                  onClick={() => updateOffer.mutate({ id: offer.id, active: !offer.active })}
                  role="switch"
                  aria-checked={offer.active}
                  aria-label={offer.active ? "Pause offer" : "Activate offer"}
                />
                <button className="iconbtn" onClick={() => setDeleting(offer)} aria-label="Delete offer"><IconTrash size={17} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete this offer?"
        message={deleting ? `"${deleting.title}" will be removed from your site. This can't be undone.` : ""}
        confirmText="Delete offer"
        isLoading={deleteOffer.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
