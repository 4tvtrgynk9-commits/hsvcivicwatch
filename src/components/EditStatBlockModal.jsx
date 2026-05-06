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

function showSavedToast() {
  const toast = document.createElement("div");
  toast.textContent = "Stat block saved.";
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

function initialForm(statBlock) {
  const data = statBlock?.data && typeof statBlock.data === "object" ? statBlock.data : {};
  return {
    module: statBlock?.module || data.module || "equity",
    tab: statBlock?.tab || data.tab || "overview",
    type: statBlock?.type || data.type || "number",
    color: statBlock?.color || data.color || "gold",
    value: statBlock?.value ?? data.value ?? "",
    label: statBlock?.label || data.label || data.title || "",
    sublabel: statBlock?.sublabel || data.sublabel || data.context || "",
    strength_score: statBlock?.strength_score ?? "",
    show_on_overview: Boolean(statBlock?.show_on_overview),
  };
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: COLORS.textSoft, fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      {children}
    </label>
  );
}

export default function EditStatBlockModal({ statBlock, onClose, onSaved }) {
  const [form, setForm] = useState(() => initialForm(statBlock));
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
      strength_score: parseInt(form.strength_score, 10) || null,
      show_on_overview: Boolean(form.show_on_overview),
    };

    try {
      const response = await fetch("/api/update-stat-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: statBlock.id, updates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Save failed");
      onSaved(data.statBlock);
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
            <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 1000, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>Edit Stat Block</div>
            <div style={{ color: COLORS.text, fontSize: 20, fontWeight: 1000, lineHeight: 1.25 }}>{statBlock?.label || statBlock?.data?.label || "Untitled stat block"}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.text, width: 36, height: 36, cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: 22, overflowY: "auto", display: "grid", gap: 14 }}>
          {error ? (
            <div style={{ background: COLORS.redSoft, border: "1px solid " + COLORS.red, color: COLORS.redDark, borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 800 }}>
              {error}
            </div>
          ) : null}

          <Field label="Module">
            <select value={form.module} onChange={(event) => update("module", event.target.value)} style={inputStyle}>
              {MODULES.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
            </select>
          </Field>
          <Field label="Tab">
            <input value={form.tab} onChange={(event) => update("tab", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Type">
            <input value={form.type} onChange={(event) => update("type", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Color">
            <input value={form.color} onChange={(event) => update("color", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Value">
            <input value={form.value} onChange={(event) => update("value", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Label">
            <input value={form.label} onChange={(event) => update("label", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Sublabel">
            <input value={form.sublabel} onChange={(event) => update("sublabel", event.target.value)} style={inputStyle} />
          </Field>
          <Field label="Strength Score">
            <input type="number" min="1" max="10" value={form.strength_score} onChange={(event) => update("strength_score", event.target.value)} style={inputStyle} />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.text, fontSize: 14, fontWeight: 800 }}>
            <input type="checkbox" checked={form.show_on_overview} onChange={(event) => update("show_on_overview", event.target.checked)} />
            Show on overview
          </label>
        </div>

        <div style={{ padding: "16px 22px", borderTop: "1px solid " + COLORS.border, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} disabled={saving} style={{ background: "transparent", border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.textSoft, padding: "10px 16px", fontSize: 14, fontWeight: 900, cursor: saving ? "not-allowed" : "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ background: COLORS.navy, border: "1px solid " + COLORS.navy, borderRadius: 8, color: COLORS.white, padding: "10px 18px", fontSize: 14, fontWeight: 900, cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
