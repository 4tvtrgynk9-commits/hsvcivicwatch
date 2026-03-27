import React, { useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

function NavButton({ item, active, hovered, onHover, onLeave, onClick, featured = false }) {
  const isLit = active || hovered;
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: featured
          ? isLit
            ? "linear-gradient(135deg, rgba(198,170,87,0.22), rgba(255,255,255,0.06))"
            : "linear-gradient(135deg, rgba(198,170,87,0.10), rgba(255,255,255,0.03))"
          : isLit
            ? "rgba(255,255,255,0.04)"
            : "transparent",
        color: COLORS.sidebarText,
        border: featured
          ? `1px solid ${isLit ? COLORS.borderStrong : "rgba(198,170,87,0.30)"}`
          : `1px solid ${isLit ? COLORS.borderStrong : "transparent"}`,
        boxShadow: isLit ? "0 0 0 1px rgba(198,170,87,0.18), inset 0 0 0 1px rgba(198,170,87,0.10)" : "none",
        borderRadius: 14,
        textAlign: "left",
        padding: "11px 12px",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: active ? 900 : 700,
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "all 160ms ease",
      }}
    >
      <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{item.emoji}</span>
      <span style={{ lineHeight: 1.25 }}>{item.label}</span>
    </button>
  );
}

export default function Sidebar({ activeId, onNavigate, isMobile, onHome }) {
  const [hoveredId, setHoveredId] = useState(null);
  const grouped = useMemo(() => NAV, []);

  return (
    <aside style={{
      width: isMobile ? 96 : 330,
      background: COLORS.sidebarBg,
      color: COLORS.sidebarText,
      padding: isMobile ? 14 : 20,
      overflowY: "auto",
      flexShrink: 0,
      borderRight: `1px solid rgba(255,255,255,0.08)`,
      position: "sticky",
      top: 0,
      height: "100vh"
    }}>
      <button
        onClick={onHome}
        style={{
          display: "block",
          width: "100%",
          background: "transparent",
          border: "none",
          color: COLORS.sidebarText,
          textAlign: "left",
          cursor: "pointer",
          padding: 0,
          marginBottom: 20,
        }}
      >
        {isMobile ? (
          <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>HCI</div>
        ) : (
          <>
            <div style={{ fontSize: 50, fontWeight: 1000, lineHeight: 0.92, marginBottom: 4, letterSpacing: -0.6 }}>HUNTSVILLE</div>
            <div style={{ fontSize: 50, fontWeight: 1000, lineHeight: 0.92, marginBottom: 12, letterSpacing: -0.6 }}>CIVIC INVESTIGATOR</div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1.6, color: COLORS.gold, textTransform: "uppercase", marginBottom: 6 }}>
              The truth about your city
            </div>
            <div style={{ fontSize: 12, color: COLORS.sidebarTextSoft, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Madison County</span>
              <span style={{ opacity: 0.45 }}>•</span>
              <span>Est. 2026</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 8 }}>v1.1</div>
          </>
        )}
      </button>

      {grouped.map((section) => (
        <div key={section.group} style={{ marginBottom: 22 }}>
          {!isMobile && (
            <div style={{
              fontSize: 11,
              fontWeight: 900,
              color: COLORS.gold,
              textTransform: "uppercase",
              letterSpacing: 1.15,
              marginBottom: 10
            }}>
              {section.group}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.items.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={item.id === activeId}
                hovered={hoveredId === item.id}
                onHover={() => setHoveredId(item.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => onNavigate(item.id)}
                featured={item.featured}
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid rgba(255,255,255,0.10)` }}>
        <NavButton
          item={BOTTOM_NAV}
          active={activeId === BOTTOM_NAV.id}
          hovered={hoveredId === BOTTOM_NAV.id}
          onHover={() => setHoveredId(BOTTOM_NAV.id)}
          onLeave={() => setHoveredId(null)}
          onClick={() => onNavigate(BOTTOM_NAV.id)}
          featured
        />
      </div>
    </aside>
  );
}
