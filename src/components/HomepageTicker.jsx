import React from "react";
import { COLORS } from "../config/theme";

const TEXT = "SOME FIGURES ARE ESTIMATES BECAUSE THE EXACT NUMBERS ARE NOT PUBLICLY DISCLOSED. IF INSTITUTIONS WANT MORE PRECISE FIGURES USED, THEY CAN RELEASE THE RECORDS INSTEAD OF HIDING THEM BEHIND VAGUE REPORTING.";

export default function HomepageTicker() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100vw",
      background: COLORS.tickerBg,
      color: COLORS.gold,
      padding: "5px 0",
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderTop: "1px solid rgba(198,163,77,0.25)",
      zIndex: 100,
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
