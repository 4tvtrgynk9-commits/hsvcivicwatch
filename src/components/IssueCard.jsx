import React, { useState, useMemo, useRef, useEffect } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";

const PREVIEW_LIMIT = 300;


const SIDEBAR_BG = "#193150";
const GOLD = "#C6A34D";
const LAVENDER = "#7A4FA3";
const RED = "#B4473E";
const GREEN = "#3E8B5B";

function StoryCard({ issue, cardRef }) {
  const dec = issue.decoder || {};
  const truncate = (str, n) => str && str.length > n ? str.slice(0, n).trim() + "…" : str || "";
  return (
    <div ref={cardRef} style={{
      width: 400, height: 711,
      background: SIDEBAR_BG,
      display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Top bar */}
      <div style={{ height: 4, background: GOLD, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>HSV Civic Watch</div>
          <div style={{ color: "#6b778a", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>Huntsville, AL</div>
        </div>
        {issue.label && (
          <div style={{ marginTop: 6, display: "inline-block", background: "rgba(198,163,77,0.18)", color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "2px 8px", borderRadius: 3 }}>
            {issue.label}
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: "16px 20px 10px", flexShrink: 0 }}>
        <div style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>
          {truncate(issue.title, 100)}
        </div>
      </div>

      {/* Decoder sections */}
      <div style={{ flex: 1, padding: "0 20px 14px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>

        {dec.whatsHappening && (
          <div style={{ borderLeft: "3px solid " + GOLD, paddingLeft: 10 }}>
            <div style={{ color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>What&#39;s Happening</div>
            <div style={{ color: GOLD, fontSize: 11, lineHeight: 1.55 }}>{truncate(dec.whatsHappening, 180)}</div>
          </div>
        )}

        {dec.connections && (
          <div style={{ borderLeft: "3px solid #89C4E8", paddingLeft: 10 }}>
            <div style={{ color: "#89C4E8", fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>The Connections</div>
            <div style={{ color: "#89C4E8", fontSize: 11, lineHeight: 1.55 }}>{truncate(dec.connections, 180)}</div>
          </div>
        )}

        {dec.whoBenefits && (
          <div style={{ borderLeft: "3px solid " + LAVENDER, paddingLeft: 10 }}>
            <div style={{ color: LAVENDER, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Who Benefits</div>
            <div style={{ color: LAVENDER, fontSize: 11, lineHeight: 1.55 }}>{truncate(dec.whoBenefits, 160)}</div>
          </div>
        )}

        {dec.impact && (
          <div style={{ borderLeft: "3px solid " + RED, paddingLeft: 10 }}>
            <div style={{ color: RED, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>The Impact</div>
            <div style={{ color: RED, fontSize: 11, lineHeight: 1.55 }}>{truncate(dec.impact, 160)}</div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: "12px 20px", background: "rgba(62,139,91,0.15)", borderTop: "1px solid rgba(62,139,91,0.3)", flexShrink: 0 }}>
        <div style={{ color: GREEN, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>Full investigation + action steps at</div>
        <div style={{ color: GREEN, fontSize: 13, fontWeight: 700, marginTop: 2 }}>hsvcivicwatch.org</div>
      </div>

      {/* Bottom bar */}
      <div style={{ height: 4, background: GREEN, flexShrink: 0 }} />
    </div>
  );
}

async function loadHtml2Canvas() {
  if (window.html2canvas) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function shareStoryCard(cardEl, title) {
  await loadHtml2Canvas();
  const canvas = await window.html2canvas(cardEl, {
    scale: 3, useCORS: true, allowTaint: true,
    backgroundColor: "#193150", width: 400, height: 711,
  });
  const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
  const file = new File([blob], "hsvcivicwatch-story.png", { type: "image/png" });
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: title || "HSV Civic Watch" });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hsvcivicwatch-story.png"; a.click();
    URL.revokeObjectURL(url);
  }
}

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const storyCardRef = useRef(null);
  const cardRef = useRef(null);
  const cardId = issue.id || issue.ref_number || issue.title;
  const SCROLL_KEY = "hsv_last_card";
  const SCROLL_TTL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const age = Date.now() - (saved.ts || 0);
      if (saved.id === cardId && age < SCROLL_TTL) {
        setDecoded(true);
        setTimeout(() => {
          cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    } catch(e) {}
  }, [cardId]);

  const handleShare = async () => {
    setStoryOpen(true);
    setSharing(true);
    await new Promise(r => setTimeout(r, 120));
    try {
      await shareStoryCard(storyCardRef.current, issue.title);
    } catch(e) { console.error("Share failed:", e); }
    setSharing(false);
    setStoryOpen(false);
  };

  const fullText = useMemo(() => issue?.details || issue?.summary || "", [issue]);
  const long = fullText.length > PREVIEW_LIMIT;
  const body = expanded || !long ? fullText : fullText.slice(0, PREVIEW_LIMIT) + "...";

  return (
    <div style={{
      background: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 1px 0 rgba(25,49,80,0.03)",
    }}>
      {/* Label */}
      {issue.label ? (
        <div style={{
          fontSize: 12,
          fontWeight: 900,
          color: issue.labelColor || COLORS.navy,
          letterSpacing: 1.2,
          marginBottom: 10,
          textTransform: "uppercase",
        }}>
          {issue.label}
        </div>
      ) : null}

      {/* Title */}
      <div style={{
        fontSize: 22,
        fontWeight: 900,
        color: COLORS.text,
        marginBottom: 10,
        lineHeight: 1.2,
      }}>
        {issue.title}
      </div>

      {/* Body */}
      <div style={{
        fontSize: 17,
        color: COLORS.text,
        lineHeight: 1.65,
      }}>
        {body}
      </div>

      {/* Read more / Show less */}
      {long ? (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: COLORS.gold,
            fontSize: 15,
            fontWeight: 800,
            marginTop: 10,
          }}
        >
          {expanded ? "Show less \u25b2" : "Read more \u25bc"}
        </button>
      ) : null}

      {/* Decode + Share buttons */}
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => {
            const next = !decoded;
            setDecoded(next);
            if (next) {
              try {
                localStorage.setItem(SCROLL_KEY, JSON.stringify({ id: cardId, ts: Date.now() }));
              } catch(e) {}
            }
          }}
          style={{
            background: COLORS.gold,
            color: COLORS.navyDark,
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 900,
          }}
        >
          {decoded ? "Hide Decoder \u25b2" : "Decode This \uD83D\uDD0E"}
        </button>
        <button
          onClick={handleShare}
          disabled={sharing}
          style={{
            background: sharing ? COLORS.muted : COLORS.green,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: sharing ? "not-allowed" : "pointer",
            fontSize: 15,
            fontWeight: 900,
          }}
        >
          {sharing ? "Preparing..." : <span>Share <span style={{fontSize:"11px",fontFamily:"system-ui",verticalAlign:"middle"}}>↗</span></span>}
        </button>
      </div>
      {storyOpen && (
        <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1 }}>
          <StoryCard issue={issue} cardRef={storyCardRef} />
        </div>
      )}

      {decoded ? (
        <CivicDecoderPanel analysis={issue.decoder} onHide={() => setDecoded(false)} />
      ) : null}
    </div>
  );
}