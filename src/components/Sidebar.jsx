import React, { useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

function NavButton({ item, active, hovered, onHover, onLeave, onClick, featured = false, compact = false }) {
  const isActive = active;
  const isHover = hovered && !active;
  let background = "transparent";
  let border = "1px solid transparent";
  let color = COLORS.sidebarText;
  let boxShadow = "none";

  if (featured && !isActive) {
    background = "rgba(198,170,87,0.06)";
    border = "1px solid rgba(198,170,87,0.18)";
    color = COLORS.gold;
  }
  if (isHover) {
    background = "rgba(198,170,87,0.10)";
    border = `1px solid ${COLORS.borderStrong}`;
    boxShadow = "0 0 0 1px rgba(198,170,87,0.10)";
  }
  if (isActive) {
    background = "rgba(198,170,87,0.18)";
    border = `1px solid ${COLORS.borderStrong}`;
    color = COLORS.gold;
    boxShadow = "inset 0 0 0 1px rgba(198,170,87,0.10), 0 0 0 1px rgba(198,170,87,0.10)";
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        width: "100%",
        background,
        color,
        border,
        boxShadow,
        borderRadius: 12,
        textAlign: "left",
        padding: compact ? "7px 10px" : "8px 11px",
        cursor: "pointer",
        fontSize: compact ? 12 : 13,
        fontWeight: isActive ? 900 : 700,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 160ms ease",
      }}
    >
      <span style={{ fontSize: compact ? 14 : 15, width: 16, textAlign: "center", flexShrink: 0 }}>{item.emoji}</span>
      <span style={{ lineHeight: 1.16 }}>{item.label}</span>
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
        width: isMobile ? "min(82vw, 330px)" : 288,
        background: COLORS.sidebarBg,
        color: COLORS.sidebarText,
        padding: isMobile ? 16 : "16px 14px 12px",
        flexShrink: 0,
        borderRight: `1px solid rgba(255,255,255,0.08)`,
        height: isMobile ? "calc(100vh - 20px)" : "calc(100vh - 24px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: isMobile ? "0 18px 60px rgba(0,0,0,0.35)" : "none",
        borderRadius: isMobile ? 18 : 16,
        position: isMobile ? "relative" : "sticky",
        top: isMobile ? "auto" : 12,
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
          marginBottom: isMobile ? 16 : 14,
        }}
      >
        <div style={{ fontSize: isMobile ? 27 : 33, fontWeight: 1000, lineHeight: 0.92, marginBottom: 0, letterSpacing: -0.7 }}>HUNTSVILLE 🚀</div>
        <div style={{ fontSize: isMobile ? 25 : 31, fontWeight: 1000, lineHeight: 0.92, marginBottom: 8, letterSpacing: -0.7, color: COLORS.gold }}>CIVIC INVESTIGATOR</div>
        <div style={{ fontSize: isMobile ? 10.5 : 11, fontWeight: 800, letterSpacing: 1.0, color: "rgba(247,243,234,0.74)", textTransform: "uppercase", marginBottom: 4 }}>
          The truth about your city
        </div>
        <div style={{ fontSize: isMobile ? 11 : 11, color: COLORS.sidebarTextSoft, letterSpacing: 0.3 }}>Madison County · Est. 2026</div>
      </button>

      <div style={{ flex: 1, overflowY: isMobile ? "auto" : "hidden", overflowX: "hidden", display: "grid", alignContent: "start", gap: compact ? 8 : 8, paddingRight: isMobile ? 4 : 0 }}>
        {grouped.map((group) => (
          <div key={group.group}>
            <div style={{ fontSize: compact ? 10 : 10.5, fontWeight: 900, color: COLORS.gold, marginTop: compact ? 8 : 8, marginBottom: compact ? 8 : 8, textTransform: "uppercase", letterSpacing: 1.5 }}>
              {group.group}
            </div>
            <div style={{ display: "grid", gap: compact ? 4 : 6 }}>
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

      <div style={{ marginTop: compact ? 8 : 8 }}>
        <div style={{ fontSize: compact ? 10 : 10.5, fontWeight: 900, color: COLORS.gold, marginTop: compact ? 8 : 8, marginBottom: compact ? 8 : 8, textTransform: "uppercase", letterSpacing: 1.5 }}>
          {BOTTOM_NAV.group}
        </div>
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
        <div style={{ fontSize: 8, color: "rgba(247,243,234,0.28)", textAlign: "right", marginTop: 6 }}>v1.3</div>
      </div>
    </aside>
  );

  if (!isMobile) return sidebarContent;
  if (!mobileOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }}>
      <div
        onClick={onCloseMobile}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,16,28,0.24)",
          backdropFilter: "blur(1px)",
          pointerEvents: "auto",
        }}
      />
      <div style={{ position: "relative", pointerEvents: "auto", padding: 10 }}>{sidebarContent}</div>
    </div>
  );
}
