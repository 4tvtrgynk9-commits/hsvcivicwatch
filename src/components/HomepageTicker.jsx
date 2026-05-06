import React from "react";
import { COLORS } from "../config/theme";

const TEXT = "HSV CIVIC WATCH REPORTS ON PUBLIC OFFICIALS AND PUBLIC INSTITUTIONS USING PUBLICLY AVAILABLE RECORDS, GOVERNMENT DOCUMENTS, AND OPEN-SOURCE INFORMATION. ALL INDIVIDUALS COVERED ARE PUBLIC FIGURES ACTING IN THEIR PUBLIC CAPACITY. SALARY AND COMPENSATION FIGURES ARE DERIVED FROM PUBLIC FILINGS, GOVERNMENT DISCLOSURES, AND PUBLISHED REPORTS — ESTIMATED FIGURES ARE LABELED AS SUCH. NOTHING ON THIS SITE CONSTITUTES LEGAL OR FINANCIAL ADVICE. THIS SITE OPERATES UNDER FIRST AMENDMENT PRESS PROTECTIONS. FOR CORRECTIONS OR INQUIRIES CONTACT HSVCIVICWATCH.ORG.";

export default function HomepageTicker() {
  return (
    <div style={{
      width: "100%",
      background: COLORS.tickerBg,
      color: COLORS.gold,
      padding: "5px 0",
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderTop: "1px solid rgba(198,163,77,0.25)",
      marginTop: 0,
    }}>
      <style>{`
        @keyframes hciTicker {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <span style={{
        display: "inline-block",
        animation: "hciTicker 34s linear infinite",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}>
        {TEXT}
      </span>
    </div>
  );
}
