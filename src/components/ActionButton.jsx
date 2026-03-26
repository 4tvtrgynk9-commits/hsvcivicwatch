import React from "react";
import { COLORS } from "../config/theme";

export default function ActionButton({ kind = "link", label, href, onClick }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
    border: "none",
  };

  const palette = kind === "primary"
    ? { background: COLORS.navy, color: "white" }
    : kind === "gold"
    ? { background: "#c9a84c", color: COLORS.navyDark }
    : { background: "#f1f5f9", color: COLORS.text };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={{ ...baseStyle, ...palette }}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} style={{ ...baseStyle, ...palette }}>
      {label}
    </button>
  );
}