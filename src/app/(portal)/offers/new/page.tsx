"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconArrowRight } from "@/components/icons";
import { Button } from "@/components/Button";

export default function NewOfferPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/offers");
    }, 500);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Create New Offer</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, background: "white", padding: 24, borderRadius: 12, border: "1px solid #e4e7ec" }}>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Offer Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 20% Off First Visit"
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d5dd" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Description</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe your special offer..."
            rows={4}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d5dd" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            id="offerActive"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <label htmlFor="offerActive" style={{ fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Set as Active immediately</label>
        </div>

        <Button type="submit" disabled={isSaving} icon={<IconPlus size={14} />}>
          {isSaving ? "Saving Offer..." : "Save Offer"}
        </Button>
      </form>
    </div>
  );
}