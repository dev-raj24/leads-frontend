"use client";

import { useState } from "react";
import { IconClose } from "@/components/icons";
import { useBulkCreateLeads } from "@/hooks/leads/mutation";
import { downloadLeadTemplateService, uploadLeadPreviewService } from "@/services/leads";
import type { LeadImportPreview } from "@/types/models";
import { Button } from "@/components/ui/Button";

interface LeadImportModalProps {
  onClose: () => void;
  onImported?: () => void;
}

/** Excel import: pick a file → server validates it (preview) → confirm to save the valid rows. */
export function LeadImportModal({ onClose, onImported }: LeadImportModalProps) {
  const [preview, setPreview] = useState<LeadImportPreview | null>(null);
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bulk = useBulkCreateLeads();

  async function handleFile(file: File) {
    setError(null);
    setParsing(true);
    setFileName(file.name);
    try {
      setPreview(await uploadLeadPreviewService(file));
    } catch {
      setPreview(null);
      setError("Couldn't read that file. Please upload an .xlsx built from the template.");
    } finally {
      setParsing(false);
    }
  }

  function confirm() {
    if (!preview) return;
    const rows = preview.rows.filter((r) => r.isValid).map((r) => r.data);
    bulk.mutate(rows, {
      onSuccess: () => onImported?.(),
      onError: () => setError("Import failed — please try again."),
    });
  }

  const invalid = preview?.rows.filter((r) => !r.isValid) ?? [];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-h">
          <h3>Import leads</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><IconClose size={16} /></button>
        </div>
        <p className="lead">
          Upload an Excel sheet of existing enquiries.{" "}
          <Button variant="secondary" size="sm" style={{ marginLeft: 4 }} onClick={() => downloadLeadTemplateService()}>Download template</Button>
        </p>

        {!preview && (
          <label className="drop">
            <input type="file" accept=".xlsx" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <b>{parsing ? "Reading your file…" : "Choose an .xlsx file"}</b>
            {parsing ? fileName : "Columns: Name, Contact*, Message, Source"}
          </label>
        )}

        {preview && (
          <>
            <div className="stat-row">
              <div className="stat-chip">Rows<b>{preview.total}</b></div>
              <div className="stat-chip ok">Ready<b>{preview.validCount}</b></div>
              <div className="stat-chip bad">Skipped<b>{preview.invalidCount}</b></div>
            </div>
            {invalid.length > 0 && (
              <div className="errlist">
                {invalid.map((r) => (
                  <div key={r.rowNumber}><b>Row {r.rowNumber}</b> — {r.errors.join(", ")}</div>
                ))}
              </div>
            )}
          </>
        )}

        {error && <div className="auth-err" style={{ marginTop: 14 }}>{error}</div>}

        <div className="modal-foot">
          {preview ? (
            <>
              <Button variant="secondary" onClick={() => { setPreview(null); setError(null); }} disabled={bulk.isPending}>Choose another</Button>
              <Button onClick={confirm} disabled={preview.validCount === 0} loading={bulk.isPending} loadingText="Importing…">
                {`Import ${preview.validCount} lead${preview.validCount === 1 ? "" : "s"}`}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadImportModal;
