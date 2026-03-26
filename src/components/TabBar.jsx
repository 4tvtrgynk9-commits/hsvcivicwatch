import React from "react";
import { COLORS } from "../config/theme";

export default function TabBar({ tabs = [], activeTabId, onChange }) {
  if (!tabs || tabs.length <= 1) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              borderRadius: 999,
              padding: "10px 14px",
              cursor: "pointer",
              border: active ? `1px solid ${COLORS.navy}` : `1px solid ${COLORS.border}`,
              background: active ? COLORS.navy : "white",
              color: active ? "white" : COLORS.text,
              fontSize: 14,
              fontWeight: 800
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}