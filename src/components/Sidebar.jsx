import React, { useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

function NavButton({ item, active, hovered, onHover, onLeave, onClick, featured = false, compact = false }) {
  const isLit = active || hovered;
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        width: "100%",
        background: featured
          ? isLit
            ? "linear-gradient(135deg, rgba(198,170,87,0.20), rgba(255,255,255,0.06))"
            : "linear-gradient(135deg, rgba(198,170,87,0.08), rgba(255,255,255,0.03))"
          : isLit
            ? "rgba(255,255,255,0.05)"
            : "transparent",
        color: COLORS.sidebarText,
        border: featured
          ? `1px solid ${isLit ? COLORS.borderStrong : "rgba(198,170,87,0.28)"}`
          : `1px solid ${isLit ? COLORS.borderStrong : "transparent"}`,
        boxShadow: isLit ? "0 0 0 1px rgba(198,170,87,0.14), inset 0 0 0 1px rgba(198,170,87,0.08)" : "none",
        borderRadius: 12,
        textAlign: "left",
        padding: compact ? "7px 9px" : "8px 10px",
        cursor: "pointer",
        fontSize: compact ? 12 : 13,
        fontWeight: active ? 900 : 700,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 160ms ease",
      }}
    >
      <span style={{ fontSize: compact ? 14 : 15, width: 16, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
      <span style={{ lineHeight: 1.2 }}>{item.label}</span>
    </button>
  );
}

export default function Sidebar({ activeId, onNavigate, isMobile, onHome, mobileOpen = false, onCloseMobile }) {
  const [hoveredId, setHoveredId] = useState(null);
  const grouped = useMemo(() => NAV, []);
  const compact = !isMobile;

  const sidebarContent = (
    <aside
      style={{
        width: isMobile ? "min(88vw, 330px)" : 292,
        background: COLORS.sidebarBg,
        color: COLORS.sidebarText,
        padding: isMobile ? 16 : "14px 14px 10px",
        flexShrink: 0,
        borderRight: `1px solid rgba(255,255,255,0.08)`,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile ? "0 18px 60px rgba(0,0,0,0.35)" : "none",
        borderRadius: isMobile ? 18 : 0,
      }}
    >
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
          marginBottom: isMobile ? 14 : 10,
        }}
      >
        <div style={{ fontSize: isMobile ? 30 : 34, fontWeight: 1000, lineHeight: 0.9, marginBottom: 2, letterSpacing: -0.6 }}>HUNTSVILLE</div>
        <div style={{ fontSize: isMobile ? 30 : 34, fontWeight: 1000, lineHeight: 0.9, marginBottom: isMobile ? 8 : 6, letterSpacing: -0.6 }}>CIVIC INVESTIGATOR</div>
        <div style={{ fontSize: isMobile ? 11 : 10, fontWeight: 900, letterSpacing: 1.4, color: COLORS.gold, textTransform: "uppercase", marginBottom: 4 }}>
          The truth about your city
        </div>
        <div style={{ fontSize: isMobile ? 12 : 11, color: COLORS.sidebarTextSoft, letterSpacing: 0.3 }}>Madison County · Est. 2026</div>
      </button>

      {isMobile ? (
        <button
          onClick={onCloseMobile}
          style={{
            alignSelf: "flex-end",
            marginBottom: 10,
            background: "rgba(255,255,255,0.06)",
            color: COLORS.sidebarText,
            border: `1px solid rgba(255,255,255,0.10)`,
            borderRadius: 999,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Close ✕
        </button>
      ) : null}

      <div style={{ flex: 1, overflow: "hidden", display: "grid", alignContent: "start", gap: compact ? 8 : 12 }}>
        {grouped.map((group) => (
          <div key={group.group}>
            <div style={{ fontSize: compact ? 9 : 10, fontWeight: 900, color: COLORS.sidebarTextSoft, marginBottom: compact ? 5 : 7, textTransform: "uppercase", letterSpacing: 1.35 }}>
              {group.group}
            </div>
            <div style={{ display: "grid", gap: compact ? 4 : 8 }}>
              {group.items.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  hovered={hoveredId === item.id}
                  onHover={() => setHoveredId(item.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => {
                    onNavigate(item.id);
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  featured={item.featured}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: compact ? 8 : 12 }}>
        <NavButton
          item={BOTTOM_NAV}
          active={activeId === BOTTOM_NAV.id}
          hovered={hoveredId === BOTTOM_NAV.id}
          onHover={() => setHoveredId(BOTTOM_NAV.id)}
          onLeave={() => setHoveredId(null)}
          onClick={() => {
            onNavigate(BOTTOM_NAV.id);
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          compact={compact}
        />
        <div style={{ fontSize: 9, color: "rgba(247,243,234,0.40)", textAlign: "right", marginTop: 6 }}>v1.2</div>
      </div>
    </aside>
  );

  if (!isMobile) return sidebarContent;
  if (!mobileOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        onClick={onCloseMobile}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,16,28,0.32)",
          backdropFilter: "blur(1px)",
          pointerEvents: "auto",
        }}
      />
      <div style={{ position: "relative", pointerEvents: "auto", padding: 10 }}>{sidebarContent}</div>
    </div>
  );
}
