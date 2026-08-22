"use client";

import { useState, useEffect } from "react";

type FollowUp = {
  id: string;
  name: string;
  when: string;
  reason: string;
  msg: string | null;
  sent: boolean;
};

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/followups')
      .then(res => res.json())
      .then(data => {
        setFollowups(data);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    // Optimistic update
    setFollowups((prev) => 
      prev.map((f) => 
        f.id === id 
          ? { 
              ...f, 
              sent: true, 
              when: "SENT ✓", 
              msg: null, 
              reason: f.reason + " — follow-up sent, awaiting reply" 
            } 
          : f
      )
    );

    // Call API
    await fetch('/api/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  };

  const scheduledCount = followups.filter((f) => !f.sent).length;

  if (loading) {
    return (
      <div className="p-mh" style={{ marginBottom: 26 }}>
        <span className="p-mt">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-mh" style={{ marginBottom: 26 }}>
        <span className="p-mt">Follow-ups<em>{scheduledCount} scheduled</em></span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {followups.map((f) => (
          <div key={f.id} className="p-card" style={{ padding: "20px 24px", transition: "all 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{f.name}</span>
              <span 
                className={`pp ${f.sent ? "" : "p"}`} 
                style={f.sent ? { borderColor: "var(--muted)", color: "var(--muted)", background: "transparent" } : {}}
              >
                {f.when}
              </span>
            </div>
            
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>
              {f.reason}
            </div>
            
            {f.msg && !f.sent && (
              <div style={{ 
                fontSize: 14, 
                color: "var(--grey)", 
                background: "#fafafa", 
                border: "1.5px dashed var(--line)", 
                borderRadius: 100, 
                padding: "8px 8px 8px 20px", 
                marginTop: 18, 
                fontFamily: "Georgia, serif", 
                fontStyle: "italic", 
                lineHeight: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16
              }}>
                <span>&quot;{f.msg}&quot;</span>
                <button 
                  onClick={() => handleApprove(f.id)}
                  style={{
                    background: "var(--ink)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    padding: "8px 18px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    flexShrink: 0,
                    fontFamily: "inherit",
                    fontStyle: "normal",
                    transition: "0.15s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, color: "var(--muted)", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 24, paddingLeft: 4 }}>
        AI drafts these, you approve them — or switch on auto-send in Settings.
      </div>
    </>
  );
}
