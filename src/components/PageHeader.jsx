import React from "react";
import { COLORS } from "../config/theme";

export default function PageHeader({ title, intro }) {
  return (
    <header style={{ marginBottom: 18 }}>
      <h1 style={{ margin: 0, color: COLORS.text, fontSize: 40, lineHeight: 1.12, fontWeight: 1000, textAlign: "center" }}>
        {title}
      </h1>
      {intro ? (
        <p style={{
          margin: "0 auto",
          color: COLORS.muted,
          fontSize: 17,
          lineHeight: 1.7,
          maxWidth: 980,
          textAlign: "center",
        }}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}
