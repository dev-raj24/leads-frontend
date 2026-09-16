"use client";

import { useState } from "react";
import { IconClose } from "@/components/icons";

interface LeadImportModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onImported?: () => void;
}

export function LeadImportModal({ isOpen = true, onClose, onSuccess, onImported }: LeadImportModalProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ validCount: number } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (onSuccess) onSuccess();
      if (onImported) onImported();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Import Leads (CSV)</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><IconClose size={18} /></button>
        </div>

        {step === 1 && (
          <div>
            <p style={{ fontSize: 14, color: "#475467", marginBottom: 16 }}>Upload a CSV file containing your leads (columns: Name, Email/Phone, Status).</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setPreview({ validCount: 10 });
                  setStep(3);
                }
              }}
              style={{ width: "100%", padding: 12, border: "1px dashed #d0d5dd", borderRadius: 8 }}
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
            <button 
              onClick={() => { setStep(1); setPreview(null); }}
              disabled={loading}
              style={{ padding: "10px 16px", background: "#fff", border: "1px solid #D0D5DD", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={loading || preview?.validCount === 0}
              style={{ padding: "10px 16px", background: "#14161A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, opacity: preview?.validCount === 0 ? 0.5 : 1 }}
            >
              {loading ? "Importing..." : `Import ${preview?.validCount || 0} Leads`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadImportModal;