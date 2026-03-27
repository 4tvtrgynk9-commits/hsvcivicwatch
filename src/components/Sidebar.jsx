import React from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

export default function Sidebar({ activeId, onNavigate }) {
  return (
    <aside style={{
      width: 320,
      background: COLORS.navyDark,
      color: "white",
      padding: 20,
      overflowY: "auto",
      flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,.08)",
      position: "sticky",
      top: 0,
      height: "100vh"
    }}>
      <button
        onClick={() => onNavigate("dashboard")}
        style={{
          width: "100%",
          background: activeId === "dashboard" ? "rgba(255,255,255,.12)" : "transparent",
          color: "white",
          border: activeId === "dashboard" ? "1px solid rgba(255,255,255,.18)" : "1px solid rgba(255,255,255,.08)",
          borderRadius: 10,
          textAlign: "left",
          padding: "12px 14px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 900,
          marginBottom: 18,
        }}
      >
        ← Dashboard
      </button>

      <div style={{fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: "#c9a84c", marginBottom: 12}}>
        HUNTSVILLE CIVIC
      </div>
      <div style={{fontSize: 24, fontWeight: 900, lineHeight: 1.15, marginBottom: 20}}>
        Civic Decoder
      </div>

      {NAV.map((section) => (
        <div key={section.group} style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: "#c9a84c",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 10
          }}>
            {section.group}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.items.map((item) => {
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    background: active ? "rgba(255,255,255,.12)" : "transparent",
                    color: "white",
                    border: active ? "1px solid rgba(255,255,255,.15)" : "1px solid transparent",
                    borderRadius: 8,
                    textAlign: "left",
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: active ? 800 : 600
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <button
          onClick={() => onNavigate(BOTTOM_NAV.id)}
          style={{
            width: "100%",
            background: activeId === BOTTOM_NAV.id ? "#d7ba66" : "#c9a84c",
            color: COLORS.navyDark,
            border: "none",
            borderRadius: 8,
            textAlign: "left",
            padding: "12px 14px",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 900
          }}
        >
          {BOTTOM_NAV.label}
        </button>
      </div>
    </aside>
  );
}
