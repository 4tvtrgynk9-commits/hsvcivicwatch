import React, { useState } from "react";
import { COLORS } from "../config/theme";

export default function InvestigativeTrail({ entries = [] }) {
  const [open, setOpen] = useState(false);
  if (!entries.length) return null;

  return (
    <section
      style={{
        marginTop: 16,
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: open ? COLORS.goldSoft : "transparent",
          border: `1px solid ${open ? COLORS.borderStrong : COLORS.border}`,
          borderRadius: 999,
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: 11.5,
          fontWeight: 900,
          color: open ? COLORS.gold : COLORS.textSoft,
        }}
      >
        Investigative Trail {open ? "▲" : "▼"}
      </button>

      {open ? (
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {entries.map((entry, i) => (
            <div
              key={i}
              style={{
                fontSize: 13.5,
                lineHeight: 1.58,
                color: COLORS.text,
                background: COLORS.panel,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "9px 10px",
              }}
            >
              {entry.label ? <strong>{entry.label}: </strong> : null}
              {entry.href ? (
                <a href={entry.href} target="_blank" rel="noreferrer">
                  {entry.text || entry.href}
                </a>
              ) : (
                entry.text || ""
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}