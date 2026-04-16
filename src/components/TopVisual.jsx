import React from "react";
import { COLORS } from "../config/theme";

// Smart number formatter -- converts raw numbers to human-readable
// If already a string like "$3.1M" or "295,000" it passes through untouched
function formatValue(raw) {
  if (typeof raw !== "number") {
    // Already a string -- clean up raw large numbers if someone typed them in
    const str = String(raw).trim();
    // If it looks like a plain large integer (no $, %, letters), format it
    if (/^\d{4,}$/.test(str)) {
      return formatNumber(parseInt(str, 10));
    }
    return str;
  }
  return formatNumber(raw);
}

function formatNumber(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9)  return sign + "$" + (abs / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6)  return sign + "$" + (abs / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1000) return sign + (abs / 1000).toFixed(0) + "k";
  return sign + abs.toLocaleString();
}

function StatCard({ label, value, sublabel, color }) {
  const displayColor = color || COLORS.red;
  const displayValue = formatValue(value);

  return (
    <div style={{
      background: "white",
      border: `1px solid ${COLORS.border}`,
      borderLeft: `4px solid ${displayColor}`,
      borderRadius: 8,
      padding: "16px 18px",
      minHeight: 110,
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        color: displayColor,
        marginBottom: 6,
        lineHeight: 1.1,
        fontFamily: "Georgia, serif",
        letterSpacing: -0.5,
      }}>
        {displayValue}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 900,
        color: COLORS.text,
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: 0.8,
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontSize: 13,
          color: COLORS.muted,
          lineHeight: 1.5,
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

export default function TopVisual({ visual, stats = [], rotationKey = 0 }) {
  if (visual && visual.type === "placeholder") {
    return (
      <section style={{
        background: "white",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 18,
        marginBottom: 20,
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
    <>
      <style>{`
        @keyframes hsvStatFadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <section
        key={rotationKey}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 20,
          animation: "hsvStatFadeIn 0.45s ease",
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
    </>
  );
}