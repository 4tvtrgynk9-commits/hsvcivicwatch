import React from "react";
import WhatYouCanDo from "./WhatYouCanDo";
import { COLORS } from "../config/theme";

const SECTION_STYLES = {
  "What’s Happening": { color: COLORS.gold, background: COLORS.goldSoft, border: "rgba(198,163,77,0.22)" },
  "The Connections": { color: COLORS.blue, background: COLORS.blueSoft, border: "rgba(47,93,138,0.18)" },
  "Who Benefits": { color: COLORS.lavender, background: COLORS.lavenderSoft, border: "rgba(122,79,163,0.18)" },
  "The Impact": { color: COLORS.red, background: COLORS.redSoft, border: "rgba(180,71,62,0.18)" },
  "What You Can Do": { color: COLORS.green, background: COLORS.greenSoft, border: "rgba(62,139,91,0.18)" },
};

export default function CivicDecoderPanel({ analysis, onHide }) {
  if (!analysis) return null;

  const sections = [
    ["What’s Happening", analysis.whatsHappening],
    ["The Connections", analysis.connections],
    ["Who Benefits", analysis.benefits],
    ["The Impact", analysis.impact],
  ].filter(([, value]) => value);

  return (
    <div
      style={{
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 14,
        marginTop: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.4, color: COLORS.gold, marginBottom: 10, textTransform: "uppercase" }}>
        Civic Investigator Analysis
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {sections.map(([title, text]) => {
          const style = SECTION_STYLES[title];
          return (
            <div
              key={title}
              style={{
                background: style.background,
                border: `1px solid ${style.border}`,
                borderRadius: 12,
                padding: "12px 13px",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 5, color: style.color }}>{title}</div>
              <div style={{ fontSize: 15.5, lineHeight: 1.62, color: style.color }}>{text}</div>
            </div>
          );
        })}

        <WhatYouCanDo data={analysis.actions} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={onHide}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: COLORS.gold,
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          Hide Investigation ▲
        </button>
      </div>
    </div>
  );
}
