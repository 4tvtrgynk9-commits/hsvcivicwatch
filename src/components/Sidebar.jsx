import React, { useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

function NavButton({
  item,
  active,
  hovered,
  onHover,
  onLeave,
  onClick,
  compact = false,
  featured = false,
}) {
  const isHover = hovered && !active;

  let background = "transparent";
  let border = "1px solid transparent";
  let color = COLORS.sidebarText;
  let boxShadow = "none";

  if (featured && !active) {
    background = COLORS.blueprintBg;
    border = `1px solid ${COLORS.blueprintBorder}`;
    color = COLORS.sidebarText;
  }

  if (isHover) {
    background = "rgba(198,163,77,0.10)";
    border = `1px solid ${COLORS.borderStrong}`;
    boxShadow = "0 0 0 1px rgba(198,163,77,0.08)";
  }

  if (active) {
    background = featured ? "rgba(62,139,91,0.18)" : "rgba(198,163,77,0.18)";
    border = featured ? `1px solid ${COLORS.blueprintBorder}` : `1px solid ${COLORS.borderStrong}`;
    color = featured ? COLORS.sidebarText : COLORS.gold;
    boxShadow = featured
      ? "inset 0 0 0 1px rgba(62,139,91,0.10), 0 0 0 1px rgba(62,139,91,0.08)"
      : "inset 0 0 0 1px rgba(198,163,77,0.10), 0 0 0 1px rgba(198,163,77,0.10)";
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
        padding: compact ? "8px 11px" : "9px 12px",
        cursor: "pointer",
        fontSize: compact ? 12.5 : 13.5,
        fontWeight: active ? 900 : 700,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 160ms ease",
      }}
    >
      <span
        style={{
          fontSize: compact ? 15 : 16,
          width: 16,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {item.emoji}
      </span>
      <span style={{ lineHeight: 1.18 }}>{item.label}</span>
    </button>
  );
}

export default function Sidebar({
  activeId,
  onNavigate,
  isMobile,
  onHome,
  mobileOpen = false,
  onCloseMobile,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const grouped = useMemo(() => NAV, []);
  const compact = !isMobile;

  const brandText = (
    <>
      <div
        style={{
          fontSize: isMobile ? 27 : 33,
          fontWeight: 1000,
          lineHeight: 0.92,
          marginBottom: 0,
          letterSpacing: -0.7,
        }}
      >
        HUNTSVILLE 🚀
      </div>
      <div
        style={{
          fontSize: isMobile ? 25 : 31,
          fontWeight: 1000,
          lineHeight: 0.92,
          marginBottom: 8,
          letterSpacing: -0.7,
          color: COLORS.gold,
        }}
      >
        CIVIC INVESTIGATOR
      </div>
      <div
        style={{
          fontSize: isMobile ? 10.5 : 11,
          fontWeight: 800,
          letterSpacing: 1,
          color: "rgba(247,243,234,0.74)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        The truth about your city
      </div>
      <div
        style={{
          fontSize: isMobile ? 11 : 11,
          color: COLORS.sidebarTextSoft,
          letterSpacing: 0.3,
        }}
      >
        Madison County · Est. 2026
      </div>
    </>
  );

  const asideStyle = {
    width: "100%",
    background: COLORS.sidebarBg,
    color: COLORS.sidebarText,
    padding: isMobile ? "10px 14px 12px" : "16px 14px 12px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: isMobile ? "100%" : "calc(100vh - 20px)",
    borderRadius: isMobile ? 0 : 18,
    boxShadow: isMobile ? "0 18px 60px rgba(0,0,0,0.35)" : "none",
    position: isMobile ? "relative" : "sticky",
    top: isMobile ? 0 : 10,
  };

  const sidebarContent = (
    <aside style={asideStyle}>
      {isMobile ? (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <button
              onClick={onCloseMobile}
              style={{
                width: 42,
                height: 42,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                border: `1px solid ${COLORS.borderStrong}`,
                background: COLORS.goldSoft,
                color: COLORS.gold,
                fontSize: 21,
                fontWeight: 900,
                lineHeight: 1,
                cursor: "pointer",
                flexShrink: 0,
                marginTop: 2,
              }}
              aria-label="Close menu"
            >
              ☰
            </button>

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
                margin: 0,
              }}
            >
              {brandText}
            </button>
          </div>
        </div>
      ) : (
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
            marginBottom: 14,
          }}
        >
          {brandText}
        </button>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "grid",
          alignContent: "start",
          gap: 10,
          paddingRight: 4,
          paddingBottom: 8,
        }}
      >
        {grouped.map((group) => (
          <div key={group.group}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 900,
                color: COLORS.gold,
                marginTop: compact ? 12 : 14,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1.7,
                lineHeight: 1.2,
              }}
            >
              {group.group}
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {group.items.map((item) => {
                const isBlueprint = item.id === "proposals";
                return (
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
                    compact={compact}
                    featured={isBlueprint}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 900,
              color: COLORS.gold,
              marginTop: 12,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: 1.7,
              lineHeight: 1.2,
            }}
          >
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
        </div>
      </div>

      <div
        style={{
          fontSize: 8,
          color: "rgba(247,243,234,0.28)",
          textAlign: "right",
          marginTop: 6,
        }}
      >
        v1.6
      </div>
    </aside>
  );

  if (!isMobile) {
    return (
      <div
        style={{
          width: 312,
          minWidth: 312,
          flexShrink: 0,
          height: "100%",
          minHeight: "100vh",
          paddingBottom: 8,
        }}
      >
        {sidebarContent}
      </div>
    );
  }

  if (!mobileOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
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
      <div
        style={{
          position: "relative",
          pointerEvents: "auto",
          width: "min(86vw, 350px)",
          height: "100%",
        }}
      >
        {sidebarContent}
      </div>
    </div>
  );
}
