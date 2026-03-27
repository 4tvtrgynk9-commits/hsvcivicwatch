import React, { useMemo, useState } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";

const PREVIEW_LIMIT = 300;

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [decoded, setDecoded] = useState(false);

  const fullText = useMemo(() => issue?.details || issue?.summary || "", [issue]);
  const long = fullText.length > PREVIEW_LIMIT;
  const body = expanded || !long ? fullText : `${fullText.slice(0, PREVIEW_LIMIT)}...`;

  return (
    <div
      style={{
        background: COLORS.panelWarm,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        boxShadow: "0 1px 0 rgba(25,49,80,0.03)",
      }}
    >
      {issue.label ? (
        <div style={{ fontSize: 11.5, fontWeight: 800, color: issue.labelColor || COLORS.navy, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
          {issue.label}
        </div>
      ) : null}

      <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text, marginBottom: 8, lineHeight: 1.18 }}>
        {issue.title}
      </div>

      <div style={{ fontSize: 16.5, color: COLORS.text, lineHeight: 1.68 }}>
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
            marginTop: 10,
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
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          Decode This 🔎
        </button>
      </div>

      {decoded ? <CivicDecoderPanel analysis={issue.decoder} onHide={() => setDecoded(false)} /> : null}
    </div>
  );
}
