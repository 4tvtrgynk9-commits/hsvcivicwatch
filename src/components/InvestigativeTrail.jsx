import React, { useState } from "react";
import { COLORS } from "../config/theme";

export default function InvestigativeTrail({ entries = [] }) {
  const [open, setOpen] = useState(false);
  if (!entries.length) return null;

  return (
    <section style={{
      marginTop: 28,
      background: "white",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: 14
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 800,
          color: COLORS.navy
        }}
      >
        Investigative Trail {open ? "▲" : "▼"}
      </button>

      {open ? (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {entries.map((entry, i) => (
            <div key={i} style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.text }}>
              {entry.label ? <strong>{entry.label}: </strong> : null}
              {entry.href ? <a href={entry.href} target="_blank" rel="noreferrer">{entry.text || entry.href}</a> : (entry.text || "")}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}