import React, { useState, useEffect } from "react";
import { COLORS } from "../config/theme";

const FIELD_CONFIG = [
  { key: "label",                  label: "Label",              type: "text" },
  { key: "title",                  label: "Title",              type: "text" },
  { key: "tab",                    label: "Tab",                type: "text" },
  { key: "module",                 label: "Module ID",          type: "text" },
  { key: "summary",                label: "Summary",            type: "textarea" },
  { key: "details",                label: "Details",            type: "textarea" },
  { key: "sources",                label: "Sources (JSON)",     type: "textarea", json: true },
  { key: "decoder_what",           label: "Decoder: What's Happening",  type: "textarea" },
  { key: "decoder_connections",    label: "Decoder: Connections",        type: "textarea" },
  { key: "decoder_who_benefits",   label: "Decoder: Who Benefits",       type: "textarea" },
  { key: "decoder_impact",         label: "Decoder: Impact",             type: "textarea" },
  { key: "actions",                label: "Actions (JSON)",     type: "textarea", json: true },
  { key: "visual_config",          label: "Visual Config (JSON)", type: "textarea", json: true },
  { key: "shock_factor",           label: "Shock Factor (1-10)",   type: "number" },
  { key: "visual_score",           label: "Visual Score (1-10)",   type: "number" },
  { key: "module_relevance",       label: "Module Relevance (1-10)", type: "number" },
  { key: "homepage_score",         label: "Homepage Score",     type: "number" },
  { key: "show_on_overview",       label: "Show on Overview",   type: "boolean" },
];

function fieldToString(key, val, json) {
  if (val === null || val === undefined) return "";
  if (json) return JSON.stringify(val, null, 2);
  return String(val);
}

export default function CardEditModal({ card, onClose, onSaved }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!card) return;
    const init = {};
    FIELD_CONFIG.forEach(({ key, json }) => {
      init[key] = fieldToString(key, card[key], json);
    });
    setValues(init);
    setErrors({});
    setSaveError(null);
  }, [card]);

  if (!card) return null;

  const set = (key, val) => {
    setValues(v => ({ ...v, [key]: val }));
    setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    FIELD_CONFIG.forEach(({ key, json }) => {
      if (!json) return;
      const raw = values[key];
      if (!raw || !raw.trim()) return;
      try { JSON.parse(raw); } catch (_) { errs[key] = "Invalid JSON"; }
    });
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const updates = {};
    FIELD_CONFIG.forEach(({ key, type, json }) => {
      const raw = values[key];
      if (raw === "" || raw === null || raw === undefined) {
        updates[key] = null;
        return;
      }
      if (json) { try { updates[key] = JSON.parse(raw); } catch (_) {} return; }
      if (type === "number") { updates[key] = Number(raw); return; }
      if (type === "boolean") { updates[key] = raw === "true" || raw === true; return; }
      updates[key] = raw;
    });

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id, updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      onSaved(data.card);
      onClose();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const overlay = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(10,16,28,0.72)", backdropFilter: "blur(2px)",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "24px 12px", overflowY: "auto",
  };

  const modal = {
    background: "#f5f0e8", borderRadius: 14, width: "100%", maxWidth: 680,
    padding: "24px 24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    position: "relative",
  };

  const inputBase = {
    width: "100%", background: "#fff", border: "1px solid " + COLORS.border,
    borderRadius: 8, padding: "8px 10px", fontSize: 13, color: COLORS.text,
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>
              Edit Card
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              {card.ref_number || card.id}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.muted, lineHeight: 1 }}>
            &times;
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {FIELD_CONFIG.map(({ key, label, type, json }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                {label}
              </label>
              {type === "boolean" ? (
                <select
                  value={values[key] || "false"}
                  onChange={e => set(key, e.target.value)}
                  style={{ ...inputBase, width: "auto" }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : type === "textarea" ? (
                <textarea
                  value={values[key] || ""}
                  onChange={e => set(key, e.target.value)}
                  rows={json ? 6 : 4}
                  style={{ ...inputBase, resize: "vertical", fontFamily: json ? "monospace" : "inherit", fontSize: json ? 12 : 13 }}
                />
              ) : (
                <input
                  type={type === "number" ? "number" : "text"}
                  value={values[key] || ""}
                  onChange={e => set(key, e.target.value)}
                  style={inputBase}
                />
              )}
              {errors[key] && (
                <div style={{ fontSize: 11, color: COLORS.red, marginTop: 3 }}>{errors[key]}</div>
              )}
            </div>
          ))}
        </div>

        {saveError && (
          <div style={{ marginTop: 16, background: COLORS.redSoft, border: "1px solid " + COLORS.red, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: COLORS.red }}>
            {saveError}
          </div>
        )}

        <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid " + COLORS.border, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: COLORS.muted }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ background: saving ? COLORS.muted : COLORS.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 900, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
