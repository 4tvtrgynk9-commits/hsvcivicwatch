import React from "react";
import { COLORS } from "../config/theme";

function StatCard({ label, value, sublabel, color }) {
  return (
    <div style={{
      background: "white",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: 16,
      minHeight: 122
    }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: color || COLORS.navy, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.45 }}>
        {sublabel}
      </div>
    </div>
  );
}

export default function TopVisual({ visual, stats = [] }) {
  if (visual && visual.type === "placeholder") {
    return (
      <section style={{
        background: "white",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 18,
        marginBottom: 20
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>
          {visual.title || "Top Visual"}
        </div>
        <div style={{ color: COLORS.muted, lineHeight: 1.7 }}>
          {visual.description || "A module-specific visual goes here."}
        </div>
      </section>
    );
  }

  if (!stats || !stats.length) return null;

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 12,
        marginBottom: 20
      }}
    >
      {stats.map((s, i) => (
        <StatCard
          key={i}
          label={Array.isArray(s) ? s[0] : s.label}
          value={Array.isArray(s) ? s[1] : s.value}
          sublabel={Array.isArray(s) ? s[2] : s.sublabel}
          color={Array.isArray(s) ? s[3] : s.color}
        />
      ))}
    </section>
  );
}