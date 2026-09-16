        </div>

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