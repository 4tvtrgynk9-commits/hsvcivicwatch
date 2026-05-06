import { useEffect, useState } from "react";
import { COLORS } from "../config/theme";

const MODULES = [
  { id: "equity", label: "The Two Huntsvilles" },
  { id: "utilities", label: "Utilities: Power Water & Gas" },
  { id: "health", label: "Healthcare & Hospital System" },
  { id: "insurance_burdens", label: "Insurance Burdens" },
  { id: "workers_childcare", label: "Worker Rights & Child Care" },
  { id: "taxation", label: "Taxation" },
  { id: "housing_crisis", label: "Housing Crisis" },
  { id: "officials_elections", label: "Officials & Elections" },
  { id: "boards_oversight", label: "Boards Directors & School Boards" },
  { id: "voting_rights", label: "The Ballot & Your Access" },
  { id: "criminal_justice", label: "Criminal Justice: Sentencing & Prisons" },
  { id: "policing", label: "Law Enforcement & Accountability" },
  { id: "data_collection", label: "Surveillance & Data Collection" },
  { id: "money", label: "Follow the Money" },
  { id: "landuse", label: "Land: Annexation Zoning & Development" },
  { id: "environment", label: "Environment" },
  { id: "information_warfare", label: "Information Warfare" },
  { id: "proposals", label: "A Better Huntsville: The Blueprint" },
  { id: "action", label: "Take Action" },
];

function initialForm(card) {
  return {
    module: card?.module || "equity",
    tab: card?.tab || (Array.isArray(card?.tabs) ? card.tabs[0] : "") || "overview",
    label: card?.label || "",
    title: card?.title || "",
    summary: card?.summary || "",
    details: card?.details || "",
    sources: Array.isArray(card?.sources) ? card.sources.join("\n") : card?.sources || "",
    shock_factor: card?.shock_factor ?? "",
    module_relevance: card?.module_relevance ?? "",
    visual_score: card?.visual_score ?? "",
    decoder_what: card?.decoder_what || card?.decoder?.whatsHappening || "",
    decoder_connections: card?.decoder_connections || card?.decoder?.connections || "",
    decoder_who_benefits: card?.decoder_who_benefits || card?.decoder?.whoBenefits || "",
    decoder_impact: card?.decoder_impact || card?.decoder?.impact || "",
    show_on_overview: Boolean(card?.show_on_overview),
  };
}

function showSavedToast() {
  const toast = document.createElement("div");
  toast.textContent = "Card saved.";
  Object.assign(toast.style, {
    position: "fixed",
    top: "18px",
    right: "18px",
    zIndex: "10000",
    background: COLORS.green,
    color: COLORS.white,
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
  });
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2800);
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: COLORS.textSoft, fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      {children}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 1000, letterSpacing: 1.6, textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: COLORS.bg,
  border: "1px solid " + COLORS.border,
  borderRadius: 8,
  color: COLORS.text,
  fontSize: 14,
  padding: "10px 12px",
  outline: "none",
};

export default function EditCardModal({ card, onClose, onSaved }) {
  const [form, setForm] = useState(() => initialForm(card));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    const updates = {
      ...form,
      shock_factor: parseInt(form.shock_factor, 10) || null,
      module_relevance: parseInt(form.module_relevance, 10) || null,
      visual_score: parseInt(form.visual_score, 10) || null,
      show_on_overview: Boolean(form.show_on_overview),
    };

    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id, updates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Save failed");
      onSaved(data.card);
      onClose();
      showSavedToast();
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(9, 16, 26, 0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "88vh",
          overflow: "hidden",
          borderRadius: 16,
          border: "1px solid " + COLORS.border,
          background: COLORS.panel,
          boxShadow: "0 24px 80px rgba(0,0,0,0.34)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px 22px", borderBottom: "1px solid " + COLORS.border, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 1000, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>Edit Issue Card</div>
            <div style={{ color: COLORS.text, fontSize: 20, fontWeight: 1000, lineHeight: 1.25 }}>{card?.title || "Untitled card"}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.text, width: 36, height: 36, cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: 22, overflowY: "auto", display: "grid", gap: 22 }}>
          {error ? (
            <div style={{ background: COLORS.redSoft, border: "1px solid " + COLORS.red, color: COLORS.redDark, borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 800 }}>
              {error}
            </div>
          ) : null}

          <Section title="Identity">
            <Field label="Module">
              <select value={form.module} onChange={(event) => update("module", event.target.value)} style={inputStyle}>
                {MODULES.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
              </select>
            </Field>
            <Field label="Tab">
              <input value={form.tab} onChange={(event) => update("tab", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Label">
              <input value={form.label} onChange={(event) => update("label", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Title">
              <input value={form.title} onChange={(event) => update("title", event.target.value)} style={inputStyle} />
            </Field>
          </Section>

          <Section title="Content">
            <Field label="Summary">
              <textarea rows={3} value={form.summary} onChange={(event) => update("summary", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Details">
              <textarea rows={6} value={form.details} onChange={(event) => update("details", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Sources">
              <textarea rows={3} value={form.sources} onChange={(event) => update("sources", event.target.value)} style={inputStyle} />
            </Field>
          </Section>

          <Section title="Scores">
            <Field label="Shock Factor">
              <input type="number" min="1" max="10" value={form.shock_factor} onChange={(event) => update("shock_factor", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Module Relevance">
              <input type="number" min="1" max="10" value={form.module_relevance} onChange={(event) => update("module_relevance", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Visual Score">
              <input type="number" min="1" max="10" value={form.visual_score} onChange={(event) => update("visual_score", event.target.value)} style={inputStyle} />
            </Field>
          </Section>

          <Section title="Decoder">
            <Field label="Decoder What">
              <textarea rows={3} value={form.decoder_what} onChange={(event) => update("decoder_what", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Decoder Connections">
              <textarea rows={3} value={form.decoder_connections} onChange={(event) => update("decoder_connections", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Decoder Who Benefits">
              <textarea rows={3} value={form.decoder_who_benefits} onChange={(event) => update("decoder_who_benefits", event.target.value)} style={inputStyle} />
            </Field>
            <Field label="Decoder Impact">
              <textarea rows={3} value={form.decoder_impact} onChange={(event) => update("decoder_impact", event.target.value)} style={inputStyle} />
            </Field>
          </Section>

          <Section title="Flags">
            <label style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.text, fontSize: 14, fontWeight: 800 }}>
              <input type="checkbox" checked={form.show_on_overview} onChange={(event) => update("show_on_overview", event.target.checked)} />
              Show on overview
            </label>
          </Section>
        </div>

        <div style={{ padding: "16px 22px", borderTop: "1px solid " + COLORS.border, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} disabled={saving} style={{ background: "transparent", border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.textSoft, padding: "10px 16px", fontSize: 14, fontWeight: 900, cursor: saving ? "not-allowed" : "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ background: COLORS.navy, border: "1px solid " + COLORS.navy, borderRadius: 8, color: COLORS.white, padding: "10px 18px", fontSize: 14, fontWeight: 900, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
