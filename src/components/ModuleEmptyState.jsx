import React from "react";
import { COLORS } from "../config/theme";

export default function ModuleEmptyState({ moduleName, moduleDescription }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center" }} aria-label={moduleName || "Module empty state"}>
      <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.58 }}>🗂️</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.navy, marginBottom: 10 }}>
        No investigations published yet
      </div>
      <p style={{ margin: "0 auto", maxWidth: 620, fontSize: 15, color: COLORS.muted, lineHeight: 1.7 }}>
        {moduleDescription || "Content for this module is being researched and verified. Check back soon."}
      </p>
      <div style={{ marginTop: 16, fontSize: 13, color: COLORS.textSoft, lineHeight: 1.55 }}>
        HSV Civic Watch publishes only verified, sourced investigations. We do not publish until the record is solid.
      </div>
    </div>
  );
}
