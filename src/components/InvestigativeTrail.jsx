import React, { useState } from "react";
import { COLORS } from "../config/theme";

export default function InvestigativeTrail({ entries = [] }) {
  const [open, setOpen] = useState(false);
  if (!entries.length) return null;

  return (
    <section style={{
      marginTop: 22,
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: 14
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 800,
          color: "#8da2d6"
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
