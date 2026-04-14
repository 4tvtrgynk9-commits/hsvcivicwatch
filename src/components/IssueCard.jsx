import React, { useState, useMemo } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";

const PREVIEW_LIMIT = 300;

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [decoded, setDecoded] = useState(false);

  const fullText = useMemo(() => issue?.details || issue?.summary || "", [issue]);
  const long = fullText.length > PREVIEW_LIMIT;
  const body = expanded || !long ? fullText : fullText.slice(0, PREVIEW_LIMIT) + "...";

  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 1px 0 rgba(25,49,80,0.03)",
    }}>
      {/* Label */}
      {issue.label ? (
        <div style={{
          fontSize: 12,
          fontWeight: 900,
          color: issue.labelColor || COLORS.navy,
          letterSpacing: 1.2,
          marginBottom: 10,
          textTransform: "uppercase",
        }}>
          {issue.label}
        </div>
      ) : null}

      {/* Title */}
      <div style={{
        fontSize: 22,
        fontWeight: 900,
        color: COLORS.text,
        marginBottom: 10,
        lineHeight: 1.2,
      }}>
        {issue.title}
      </div>

      {/* Body */}
      <div style={{
        fontSize: 17,
        color: COLORS.text,
        lineHeight: 1.65,
      }}>
        {body}
      </div>

      {/* Read more / Show less */}
      {long ? (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: COLORS.gold,
            fontSize: 15,
            fontWeight: 800,
            marginTop: 10,
          }}
        >
          {expanded ? "Show less \u25b2" : "Read more \u25bc"}
        </button>
      ) : null}

      {/* Decode button */}
      <div style={{ marginTop: 14 }}>
        <button
          onClick={() => setDecoded(!decoded)}
          style={{
            background: COLORS.gold,
            color: COLORS.navyDark,
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 900,
          }}
        >
          {decoded ? "Hide Decoder \u25b2" : "Decode This \uD83D\uDD0E"}
        </button>
      </div>

      {decoded ? (
        <CivicDecoderPanel analysis={issue.decoder} onHide={() => setDecoded(false)} />
      ) : null}
    </div>
  );
}