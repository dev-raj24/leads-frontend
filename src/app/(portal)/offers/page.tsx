"use client";

import { useState } from "react";
import Link from "next/link";
import { IconPlus, IconSparkle, IconTrash, IconEdit } from "@/components/icons";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useGetOffers } from "@/hooks/offer/query";
import { useUpdateOffer, useDeleteOffer } from "@/hooks/offer/mutation";
import type { Offer } from "@/types/models";
import { OfferSkeleton } from "@/components/Skeleton";

export default function OffersOverviewPage() {
  const { data, isLoading: loading } = useGetOffers();
  const updateOfferMutation = useUpdateOffer();
  const deleteOfferMutation = useDeleteOffer();
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

  const offers: Offer[] = data?.offers || [];

  const handleToggleActive = (offer: Offer) => {
    updateOfferMutation.mutate({
      id: offer.id,
      active: !offer.active,
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingOffer) return;
    deleteOfferMutation.mutate(deletingOffer.id, {
      onSuccess: () => setDeletingOffer(null),
      onError: () => setDeletingOffer(null),
    });
  };

  return (
    <>
      <div className="p-mh">
        <span className="p-mt">
          Offers<em>live on your site</em>
        </span>
        <Button href="/offers/new" icon={<IconPlus size={14} />}>
          Create Offer
        </Button>
      </div>

      {loading && (
        <>
          <OfferSkeleton />
          <OfferSkeleton />
          <OfferSkeleton />
        </>
      )}

      {!loading && offers.length === 0 && (
        <div className="p-card" style={{ padding: 24, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>No offers created yet</div>
          <div style={{ fontSize: 13, color: "#98A2B3", marginBottom: 16 }}>
            Create an offer to showcase discounts, announcements, or booking badges on your site!
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button href="/offers/new" icon={<IconPlus size={14} />}>
              Create Offer
            </Button>
          </div>
        </div>
      )}

      {!loading && offers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-card"
              style={{
                padding: 16,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: offer.active ? "#F5F8FF" : "#fff",
                border: "1.5px solid var(--ink)",
                borderRadius: 14,
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  {offer.title}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 100,
                      background: offer.active ? "#DCFCE7" : "#F1F5F9",
                      color: offer.active ? "#15803D" : "#64748B",
                      border: "1px solid var(--ink)",
                    }}
                  >
                    {offer.active ? "● Live on Site" : "Paused"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  {offer.body ? offer.body : "No description"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button href={`/offers/new?id=${offer.id}`} variant="secondary" icon={<IconEdit size={14} />}>
                  Edit
                </Button>

                {/* Active/Pause Toggle */}
                <div
                  title={offer.active ? "Click to Pause" : "Click to Activate"}
                  onClick={() => handleToggleActive(offer)}
                  style={{
                    width: 40,
                    height: 24,
                    borderRadius: 100,
                    border: "1.5px solid #14161A",
                    background: offer.active ? "#C9F2DB" : "#F2F4F7",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: offer.active ? 19 : 2,
                      top: 2,
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: offer.active ? "#14161A" : "#98A2B3",
                      transition: "all 0.2s ease",
                    }}
                  />
                </div>

                {/* Open Custom Reusable Delete Confirmation Modal */}
                <button
                  onClick={() => setDeletingOffer(offer)}
                  title="Delete Offer"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                    color: "#98A2B3",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#D92D20")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#98A2B3")}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Reusable Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deletingOffer}
        title="Delete Offer"
        message={deletingOffer ? `Are you sure you want to delete "${deletingOffer.title}"? This action cannot be undone.` : ""}
        confirmText="Delete Offer"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteOfferMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingOffer(null)}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginTop: 24, fontSize: 12, color: "#475467" }}>
        <IconSparkle size={14} style={{ color: "#155EEF", flex: "none", marginTop: 2 }} />
        AI suggestion: &quot;Weekends are slow — want me to set up a 10% off offer?&quot;{" "}
        <Link href="/offers/new" style={{ color: "#155EEF", fontWeight: 700 }}>
          Create it now →
        </Link>
      </div>
    </>
  );
}
