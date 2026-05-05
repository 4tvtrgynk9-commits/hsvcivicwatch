import React from "react";
import TopVisual from "./TopVisual";
import IssueCardVisual from "./IssueCardVisual";
import { COLORS } from "../config/theme";
import { toStatTuple } from "../lib/useSupabaseModule";

const VISUAL_TYPES = new Set([
  "horizontal-bars",
  "heatmap-comparison",
  "wage-bars",
  "flow-chain",
  "funnel",
  "grouped-bars",
  "escalation",
  "scorecard-grid",
  "bar",
  "trend",
  "pie",
  "pay-comparison",
]);

function formatValue(raw) {
  if (typeof raw !== "number") {
    const str = String(raw ?? "").trim();
    if (/^\d{4,}$/.test(str)) return formatNumber(parseInt(str, 10));
    return str;
  }
  return formatNumber(raw);
}

function formatNumber(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return sign + "$" + (abs / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6) return sign + "$" + (abs / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1000) return sign + (abs / 1000).toFixed(0) + "k";
  return sign + abs.toLocaleString();
}

function StatCard({ label, value, sublabel, color }) {
  const displayColor = color || COLORS.red;
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
        {formatValue(value)}
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
      {sublabel ? (
        <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}

function isLiveStatRow(item) {
  return Boolean(item) && typeof item === "object" && !Array.isArray(item);
}

function getSupportedVisualConfig(statBlock) {
  const visualConfig = statBlock?.visual_config;
  return visualConfig && VISUAL_TYPES.has(visualConfig.type) ? visualConfig : null;
}

function buildStatHref(statBlock) {
  const moduleName = statBlock?.module || statBlock?.data?.module || "";
  const cardRef = statBlock?.card_ref || statBlock?.issue_card_ref || null;
  if (cardRef && moduleName) {
    return "/?card=" + encodeURIComponent(cardRef) + "#" + moduleName;
  }
  if (moduleName) {
    return "/#" + moduleName;
  }
  return "/";
}

export default function VisualSwitcher({ visual, stats, rotationKey = 0 }) {
  const liveRows = Array.isArray(stats) ? stats.filter(isLiveStatRow) : [];
  if (!liveRows.length) {
    return <TopVisual visual={visual} stats={stats} rotationKey={rotationKey} />;
  }

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
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 20,
          animation: "hsvStatFadeIn 0.45s ease",
        }}
      >
        {liveRows.map((statBlock, index) => {
          const href = buildStatHref(statBlock);
          const visualConfig = getSupportedVisualConfig(statBlock);
          if (visualConfig) {
            return (
              <a
                key={statBlock.id || index}
                href={href}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <IssueCardVisual config={visualConfig} />
              </a>
            );
          }

          const [label, value, sublabel, color] = toStatTuple(statBlock);
          return (
            <a
              key={statBlock.id || index}
              href={href}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <StatCard label={label} value={value} sublabel={sublabel} color={color} />
            </a>
          );
        })}
      </section>
    </>
  );
}
