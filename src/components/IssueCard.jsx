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
      background: "white",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: 18,
      marginBottom: 14
    }}>
      {issue.label ? (
        <div style={{ fontSize: 12, fontWeight: 800, color: issue.labelColor || COLORS.navy, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
          {issue.label}
        </div>
      ) : null}

      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, marginBottom: 8 }}>
        {issue.title}
      </div>

      <div style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.8 }}>
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
            color: "#c9a84c",
            fontSize: 14,
            fontWeight: 800,
            marginTop: 10
          }}
        >
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      ) : null}

      <div style={{ marginTop: 14 }}>
        <button
          onClick={() => setDecoded(!decoded)}
          style={{
            background: "#c9a84c",
            color: COLORS.navyDark,
            border: "none",
            borderRadius: 8,
            padding: "11px 15px",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 900
          }}
        >
          Decode This 🔍
        </button>
      </div>

      {decoded ? (
        <CivicDecoderPanel analysis={issue.decoder} onHide={() => setDecoded(false)} />
      ) : null}
    </div>
  );
}