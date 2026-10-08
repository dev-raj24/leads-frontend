"use client";

import { use, useEffect, useState } from "react";
import { env } from "@/config/env";

interface HostedForm {
  businessName: string;
  fields: Array<{ name: string; required: boolean; options: string[] }>;
  consent: string;
  poweredBy: boolean;
}

const VALID_CONTACT = (v: string) => v.includes("@") || /\d{6,}/.test(v);

const styles = {
  page: { minHeight: "100vh", background: "#f6f3ea", display: "grid", placeItems: "start center", padding: "40px 16px", color: "#16301f", fontFamily: "system-ui, sans-serif" } as const,
  card: { width: "100%", maxWidth: 520, background: "#fff", border: "1px solid #e6e3dc", borderRadius: 20, padding: "28px 24px", boxShadow: "0 12px 40px rgba(16,21,28,0.06)" } as const,
  label: { display: "grid", gap: 6, fontSize: 14, fontWeight: 600, marginBottom: 14 } as const,
  input: { width: "100%", border: "1px solid #d8d2c4", borderRadius: 12, padding: "11px 13px", fontSize: 15, background: "#fff", font: "inherit", fontWeight: 400, boxSizing: "border-box" } as const,
  button: { width: "100%", background: "#0b5d4b", color: "#fff", border: 0, borderRadius: 999, padding: "13px 18px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4 } as const,
  small: { fontSize: 12.5, color: "#6a707a", marginTop: 12 } as const,
};

export default function HostedFormPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  const [form, setForm] = useState<HostedForm | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "sending" | "done">("loading");
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");

  useEffect(() => {
    fetch(`${env.apiUrl}/api/public/form?siteKey=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: HostedForm) => {
        setForm(data);
        setState("ready");
        document.title = `Contact ${data.businessName}`;
      })
      .catch(() => setState("missing"));
  }, [key]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!VALID_CONTACT(contact.trim())) {
      setError("Please enter a valid phone number or email.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(`${env.apiUrl}/api/ingest/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site_key: key, name, contact: contact.trim(), message, fields: values, website: trap, source: "form", wait: false }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("ready");
    }
  }

  if (state === "loading") return <main style={styles.page} />;

  if (state === "missing" || !form) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={{ margin: 0, fontSize: 22 }}>This form isn&apos;t available</h1>
          <p style={{ color: "#4b5f52" }}>The link may be wrong or the form was removed. Please contact the business directly.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        {state === "done" ? (
          <>
            <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>Thank you!</h1>
            <p style={{ color: "#4b5f52", margin: 0 }}>{form.businessName} got your message and will reply very soon.</p>
          </>
        ) : (
          <form onSubmit={submit}>
            <h1 style={{ margin: "0 0 4px", fontSize: 24 }}>Contact {form.businessName}</h1>
            <p style={{ margin: "0 0 22px", color: "#4b5f52", fontSize: 15 }}>Leave your details and we will get back to you.</p>

            <label style={styles.label}>Your name<input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} /></label>
            <label style={styles.label}>Phone number or email<input style={styles.input} value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" required maxLength={160} /></label>
            {form.fields.map((f) => (
              <label key={f.name} style={styles.label}>
                {f.name}{f.required ? " *" : ""}
                {f.options.length > 0 ? (
                  <select style={styles.input} required={f.required} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                    <option value="">Choose one</option>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input style={styles.input} required={f.required} value={values[f.name] ?? ""} maxLength={500} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                )}
              </label>
            ))}
            <label style={styles.label}>Message<textarea style={{ ...styles.input, minHeight: 96, resize: "vertical" }} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} /></label>
            <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" style={{ position: "absolute", left: -9999, opacity: 0, height: 0, width: 0 }} />

            {error && <p style={{ color: "#b91c1c", fontSize: 14, margin: "0 0 10px" }}>{error}</p>}
            <button type="submit" style={{ ...styles.button, opacity: state === "sending" ? 0.7 : 1 }} disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send enquiry"}
            </button>
            <p style={styles.small}>{form.consent}</p>
          </form>
        )}
        {form.poweredBy && <p style={{ ...styles.small, textAlign: "center", marginBottom: 0 }}>Form by Leadworks</p>}
      </div>
    </main>
  );
}
