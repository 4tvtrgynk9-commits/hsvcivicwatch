import React from "react";
import WhatYouCanDo from "./WhatYouCanDo";

// Sidebar blue background with readable section colors
// Colors are lightened slightly from theme for legibility on dark bg
const SECTION_STYLES = {
  "What's Happening": { color: "#E8C35A" },   // gold lightened for dark bg
  "The Connections":  { color: "#6BA3D6" },   // blue lightened for dark bg
  "Who Benefits":     { color: "#B98FD8" },   // lavender lightened for dark bg
  "The Impact":       { color: "#E07068" },   // red lightened for dark bg
};

const SIDEBAR_BG = "#193150";

export default function CivicDecoderPanel({ analysis, onHide }) {
  if (!analysis) return null;

  const sections = [
    ["What's Happening", analysis.whatsHappening],
    ["The Connections",  analysis.connections],
    ["Who Benefits",     analysis.benefits],
    ["The Impact",       analysis.impact],
  ].filter(([, value]) => value);

  return (
    <div style={{
      background: SIDEBAR_BG,
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 14,
      padding: "14px 16px",
      marginTop: 12,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 2,
        color: "#E8C35A",
        marginBottom: 14,
        textTransform: "uppercase",
      }}>
        Civic Investigator Analysis
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {sections.map(([title, text]) => {
          const style = SECTION_STYLES[title];
          return (
            <div key={title} style={{
              borderLeft: `3px solid ${style.color}`,
              paddingLeft: 12,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: style.color,
                marginBottom: 5,
              }}>
                {title}
              </div>
              <div style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: style.color,
              }}>
                {text}
              </div>
            </div>
          );
        })}

        <WhatYouCanDo data={analysis.actions} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onHide} style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "#E8C35A",
          fontSize: 13,
          fontWeight: 800,
        }}>
          Hide Investigation &#9650;
        </button>
      </div>
    </div>
  );
}