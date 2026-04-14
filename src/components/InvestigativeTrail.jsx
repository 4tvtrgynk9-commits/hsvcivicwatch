import React, { useState } from "react";
import { COLORS } from "../config/theme";

export default function InvestigativeTrail({ issues = [], entries = [] }) {
  const [open, setOpen] = useState(false);

  const sourceEntries = [];
  const seen = new Set();
  issues.forEach(issue => {
    const sources = issue.sources || [];
    sources.forEach(src => {
      const key = src.url || src.label;
      if (key && !seen.has(key)) {
        seen.add(key);
        sourceEntries.push({ label: src.label, href: src.url });
      }
    });
  });

  const allEntries = sourceEntries.length ? sourceEntries : entries;
  if (!allEntries.length) return null;

  return (
    <section style={{ marginTop: 16, background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: open ? COLORS.goldSoft : "transparent", border: `1px solid ${open ? COLORS.borderStrong : COLORS.border}`, borderRadius: 999, padding: "6px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 900, color: open ? COLORS.gold : COLORS.textSoft }}
      >
        Sources {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {allEntries.map((entry, i) => (
            <div key={i} style={{ fontSize: 12, lineHeight: 1.5, color: COLORS.textSoft }}>
              {entry.href ? (
                <a href={entry.href} target="_blank" rel="noreferrer" style={{ color: COLORS.gold, textDecoration: "none" }}>
                  {entry.label || entry.href}
                </a>
              ) : (
                <span style={{ color: COLORS.textSoft }}>{entry.label || entry.text || ""}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
