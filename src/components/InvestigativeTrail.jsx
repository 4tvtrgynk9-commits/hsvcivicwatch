import React, { useState } from "react";
import { COLORS } from "../config/theme";

export default function InvestigativeTrail({ entries = [] }) {
  const [open, setOpen] = useState(false);
  if (!entries.length) return null;

  return (
    <section style={{
      marginTop: 18,
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: 12
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 999,
          padding: "5px 9px",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 800,
          color: COLORS.textSoft
        }}
      >
        Investigative Trail {open ? "▲" : "▼"}
      </button>

      {open ? (
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {entries.map((entry, i) => (
            <div key={i} style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.text }}>
              {entry.label ? <strong>{entry.label}: </strong> : null}
              {entry.href ? <a href={entry.href} target="_blank" rel="noreferrer">{entry.text || entry.href}</a> : (entry.text || "")}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
