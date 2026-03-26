import React, { useEffect, useRef } from "react";
import WhatYouCanDo from "./WhatYouCanDo";
import { COLORS } from "../config/theme";

export default function CivicDecoderPanel({ analysis, onHide }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          onHide?.();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onHide]);

  if (!analysis) return null;

  const sections = [
    ["What’s Happening", analysis.whatsHappening],
    ["The Connections", analysis.connections],
    ["Who Benefits", analysis.benefits],
    ["The Impact", analysis.impact],
  ].filter(([, v]) => v);

  return (
    <div ref={ref} style={{
      background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
      color: "white",
      borderRadius: 8,
      padding: 18,
      marginTop: 12
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: "#c9a84c", marginBottom: 12 }}>
        Civic Investigator Analysis
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {sections.map(([title, text], i) => (
          <div key={i}>
            <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,.94)" }}>{text}</div>
          </div>
        ))}

        <WhatYouCanDo data={analysis.actions} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={onHide}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "#c9a84c",
            fontSize: 14,
            fontWeight: 800
          }}
        >
          Hide Investigation ▲
        </button>
      </div>
    </div>
  );
}