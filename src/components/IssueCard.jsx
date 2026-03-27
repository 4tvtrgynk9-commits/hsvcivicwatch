import React, { useState } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [decoded, setDecoded] = useState(false);

  const long = (issue.details || issue.summary || "").length > 300;
  const body = expanded || !long ? (issue.details || issue.summary) : (issue.summary || "").slice(0, 300) + "...";

  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      boxShadow: "0 1px 0 rgba(25,49,80,0.03)"
    }}>
      {issue.label ? (
        <div style={{ fontSize: 12, fontWeight: 800, color: issue.labelColor || COLORS.navy, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
          {issue.label}
        </div>
      ) : null}

      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, marginBottom: 8, lineHeight: 1.2 }}>
        {issue.title}
      </div>

      <div style={{ fontSize: 17, color: COLORS.textSoft, lineHeight: 1.75 }}>
        {body}
      </div>

      {long ? (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: COLORS.gold,
            fontSize: 14,
            fontWeight: 800,
            marginTop: 10
          }}
        >
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setDecoded(!decoded)}
          style={{
            background: COLORS.gold,
            color: COLORS.navyDark,
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 900
          }}
        >
          Decode This 🔎
        </button>
      </div>

      {decoded ? (
        <CivicDecoderPanel analysis={issue.decoder} onHide={() => setDecoded(false)} />
      ) : null}
    </div>
  );
}
