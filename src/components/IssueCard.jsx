import React, { useState, useMemo, useRef, useEffect } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";
import IssueCardVisual from "./IssueCardVisual";

const PREVIEW_LIMIT = 300;

function truncateText(str, n) {
  return str && str.length > n ? str.slice(0, n).trim() + "\u2026" : str || "";
}

function cleanTruncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const chunk = text.slice(0, maxLen);
  const lastPeriod = Math.max(
    chunk.lastIndexOf(". "),
    chunk.lastIndexOf("! "),
    chunk.lastIndexOf("? ")
  );
  if (lastPeriod > maxLen * 0.5) return text.slice(0, lastPeriod + 1);
  return chunk.trimEnd();
}

function splitSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]?/g) || [];
}

function scoreSentence(sentence) {
  let score = 0;
  if (/\$|\b\d{2,}\b/.test(sentence)) score += 3;
  if (/\b(contract|vote|donation|developer|board|council|county|city|hospital|police|sheriff|lawsuit|million|billion)\b/i.test(sentence)) score += 3;
  if (/[A-Z][a-z]+ [A-Z][a-z]+/.test(sentence)) score += 2;
  if (sentence.length > 80) score += 1;
  return score;
}

function buildPunchyExcerpt(issue, maxLen = 220) {
  const homepageTeaser = cleanTruncate(issue?.homepage_teaser || "", maxLen);
  if (homepageTeaser) return homepageTeaser;

  const detailsSentences = splitSentences(issue?.details || "");
  if (detailsSentences.length) {
    const selected = detailsSentences
      .map((sentence, index) => ({ sentence: sentence.trim(), index, score: scoreSentence(sentence) }))
      .filter((item) => item.sentence)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index)
      .map((item) => item.sentence)
      .join(" ");

    if (selected) return cleanTruncate(selected, maxLen);
  }

  return cleanTruncate(issue?.summary || "", maxLen);
}

function buildShareText(issue, mode) {
  const ref = issue.ref_number || issue.id || "";
  const shortUrl = ref ? "https://hsvcivicwatch.org/c/" + ref : "https://hsvcivicwatch.org";
  const teaser = buildPunchyExcerpt(issue, mode === "sms" ? 240 : 220);
  
  if (mode === "sms") {
    return [
      teaser,
      "",
      shortUrl,
    ].join("\n");
  }

  return [
    issue.title ? issue.title.toUpperCase() : "",
    "",
    teaser,
    "",
    "Full investigation: " + shortUrl,
    "",
    "#HuntsvilleAL #CivicWatch #MadisonCounty #Alabama"
  ].join("\n");
}

function slugifyFilePart(value) {
  return String(value || "issue-card")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "issue-card";
}

function renderTextOnlyShareCard(issue, body) {
  return (
    <div style={{
      background: COLORS.panel,
      border: "1px solid " + COLORS.border,
      borderRadius: 20,
      padding: "24px 24px 20px",
      boxShadow: "0 12px 30px rgba(25,49,80,0.12)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {issue.label ? (
        <div style={{ display: "inline-block", background: "rgba(198,163,77,0.18)", color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 14 }}>
          {issue.label}
        </div>
      ) : null}
      <div style={{ color: COLORS.text, fontSize: 34, fontWeight: 900, lineHeight: 1.16, marginBottom: 16 }}>
        {truncateText(issue.title, 140)}
      </div>
      <div style={{ color: COLORS.text, fontSize: 21, lineHeight: 1.7 }}>
        {body}
      </div>
      <div style={{
        marginTop: 20,
        background: "rgba(62,139,91,0.12)",
        borderTop: "1px solid rgba(62,139,91,0.26)",
        borderRadius: 12,
        padding: "16px 18px",
      }}>
        <div style={{ color: COLORS.green, fontSize: 12, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase" }}>
          READ THE FULL INVESTIGATION
        </div>
        <div style={{ color: COLORS.green, fontSize: 24, fontWeight: 900, marginTop: 4, lineHeight: 1.3, wordBreak: "break-word" }}>
          hsvcivicwatch.org
        </div>
      </div>
    </div>
  );
}

function ShareIssueCard({ issue, cardRef, shareStatBlock }) {
  const body = buildPunchyExcerpt(issue, 210);
  const shareVisualConfig = issue?.visual_config && (issue?.visual_score || 0) >= 7
    ? issue.visual_config
    : shareStatBlock?.visual_config || null;

  return (
    <div ref={cardRef} style={{
      width: 800,
      background: COLORS.bg,
      padding: 20,
      boxSizing: "border-box",
      fontFamily: "Georgia, serif",
    }}>
      {shareVisualConfig ? (
        <div style={{
          background: COLORS.panel,
          border: "1px solid " + COLORS.border,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 14px 36px rgba(25,49,80,0.14)",
        }}>
          <div style={{ padding: 16, background: "#e8dfd2" }}>
            <div style={{ width: "100%", transform: "scale(1.06)", transformOrigin: "top center" }}>
              <IssueCardVisual config={shareVisualConfig} />
            </div>
          </div>
          <div style={{ padding: "24px 28px 22px" }}>
            {issue.label ? (
              <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                {issue.label}
              </div>
            ) : null}
            <div style={{ color: COLORS.text, fontSize: 38, fontWeight: 900, lineHeight: 1.08, marginBottom: 16 }}>
              {truncateText(issue.title, 150)}
            </div>
            <div style={{ color: COLORS.text, fontSize: 22, lineHeight: 1.65 }}>
              {body}
            </div>
          </div>
          <div style={{
            borderTop: "1px solid rgba(25,49,80,0.08)",
            background: "#efe6d8",
            padding: "16px 28px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}>
            <div style={{ color: COLORS.navy, fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
              HSV Civic Watch
            </div>
            <div style={{ color: COLORS.muted, fontSize: 20, fontWeight: 700 }}>
              hsvcivicwatch.org
            </div>
          </div>
        </div>
      ) : renderTextOnlyShareCard(issue, body)}
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

async function shareStoryCard(cardEl, issue) {
  if (!cardEl) return;
  await loadHtml2Canvas();
  const canvas = await window.html2canvas(cardEl, {
    width: 800,
    windowWidth: 800,
    windowHeight: 1500,
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: COLORS.bg,
  });
  const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
  if (!blob) return;
  const file = new File([blob], `hsvcivicwatch-${slugifyFilePart(issue?.title)}.png`, { type: "image/png" });
  const ref = issue?.ref_number || issue?.id || "";
  const shareUrl = ref ? "https://hsvcivicwatch.org/c/" + ref : "https://hsvcivicwatch.org";
  const shareText = buildShareText(issue, "social");
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: buildShareText(issue, "sms"),
    });
    return { shared: true };
  } else {
    const blobUrl = URL.createObjectURL(blob);
    const fbUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl);
    return {
      shared: false,
      blobUrl,
      shareText,
      shareUrl,
      fbUrl,
      fileName: file.name,
    };
  }
}

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [arrivalHighlight, setArrivalHighlight] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareOptions, setShareOptions] = useState({ blobUrl: "", shareText: "", shareUrl: "", fbUrl: "", fileName: "" });
  const [shareStatBlock, setShareStatBlock] = useState(null);
  const storyCardRef = useRef(null);
  const cardRef = useRef(null);
  const cardId = issue.id || issue.ref_number || issue.title;
  const issueRef = issue.ref_number || issue.id || "";
  const SCROLL_KEY = "hsv_last_card";
  const DECODER_KEY = "hsv_decoder_state";
  const SCROLL_TTL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const age = Date.now() - (saved.ts || 0);
      if (saved.id === cardId && age < SCROLL_TTL) {
        try {
          localStorage.removeItem(SCROLL_KEY);
        } catch (e) {}

        const scrollToCard = (behavior = "smooth") => {
          if (!cardRef.current) return;
          const isMobile = window.innerWidth < 960;
          const headerOffset = isMobile ? 84 : 20;
          const absoluteTop = cardRef.current.offsetTop - headerOffset;

          window.scrollTo({
            top: Math.max(absoluteTop, 0),
            behavior,
          });
        };

        setTimeout(() => scrollToCard("auto"), 160);
        setTimeout(() => scrollToCard("smooth"), 420);

        setTimeout(() => {
          setArrivalHighlight(true);
          setTimeout(() => setArrivalHighlight(false), 3200);
        }, 700);
      }
    } catch(e) {}
  }, [cardId]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DECODER_KEY) || "{}");
      const currentRoute = window.location.hash.replace("#", "") || "dashboard";
      if (saved.id === cardId && saved.route === currentRoute) {
        setDecoded(true);
      } else {
        setDecoded(false);
      }
    } catch(e) {}
  }, [cardId]);

  useEffect(() => {
    return () => {
      if (shareOptions.blobUrl) {
        URL.revokeObjectURL(shareOptions.blobUrl);
      }
    };
  }, [shareOptions.blobUrl]);

  const loadShareStatBlock = async () => {
    if (issue.visual_config && (issue.visual_score || 0) >= 7) return null;
    if (shareStatBlock) return shareStatBlock;
    if (!issue.ref_number) return null;
    const url = process.env.REACT_APP_SUPABASE_URL;
    const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;

    const query = `${url}/rest/v1/stat_blocks?select=*&card_ref=eq.${encodeURIComponent(issue.ref_number)}&order=strength_score.desc.nullslast&limit=1`;
    const res = await fetch(query, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    const topBlock = Array.isArray(rows) ? rows[0] || null : null;
    if (topBlock?.visual_config) {
      setShareStatBlock(topBlock);
      return topBlock;
    }
    return null;
  };

  const handleShare = async () => {
    if (!(issue.visual_config && (issue.visual_score || 0) >= 7)) {
      try {
        await loadShareStatBlock();
      } catch (e) {}
    }
    setStoryOpen(true);
    setSharing(true);
    await new Promise(r => setTimeout(r, 120));
    try {
      const result = await shareStoryCard(storyCardRef.current, issue);
      if (result && result.shared === false) {
        setShareOptions((prev) => {
          if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl);
          return result;
        });
        setShowShareOptions(true);
      }
    } catch(e) { console.error("Share failed:", e); }
    setSharing(false);
    setStoryOpen(false);
  };

  const closeShareOptions = () => {
    setShowShareOptions(false);
  };

  const handleDownloadShareImage = () => {
    if (!shareOptions.blobUrl) return;
    const a = document.createElement("a");
    a.href = shareOptions.blobUrl;
    a.download = shareOptions.fileName || `hsvcivicwatch-${slugifyFilePart(issue?.title)}.png`;
    a.click();
  };

  const fullText = useMemo(() => issue?.details || issue?.summary || "", [issue]);
  const long = fullText.length > PREVIEW_LIMIT;
  const body = expanded || !long ? fullText : fullText.slice(0, PREVIEW_LIMIT) + "...";

  return (
    <>
      <style>{`
        @keyframes hsvArrivalGlow {
          0% {
            box-shadow: 0 1px 0 rgba(25,49,80,0.03);
            border-color: ${COLORS.border};
            transform: translateX(0);
          }
          8% {
            box-shadow:
              0 0 0 4px rgba(47,93,138,0.30),
              0 0 0 11px rgba(47,93,138,0.16),
              0 0 30px rgba(47,93,138,0.24);
            border-color: rgba(47,93,138,0.65);
            transform: translateX(-2px);
          }
          16% { transform: translateX(2px); }
          24% { transform: translateX(-2px); }
          32% { transform: translateX(0); }

          40% {
            box-shadow:
              0 0 0 4px rgba(47,93,138,0.28),
              0 0 0 11px rgba(47,93,138,0.14),
              0 0 26px rgba(47,93,138,0.20);
            border-color: rgba(47,93,138,0.58);
            transform: translateX(-2px);
          }
          48% { transform: translateX(2px); }
          56% { transform: translateX(-2px); }
          64% { transform: translateX(0); }

          72% {
            box-shadow:
              0 0 0 4px rgba(47,93,138,0.24),
              0 0 0 10px rgba(47,93,138,0.12),
              0 0 22px rgba(47,93,138,0.18);
            border-color: rgba(47,93,138,0.50);
            transform: translateX(-2px);
          }
          80% { transform: translateX(2px); }
          88% { transform: translateX(-2px); }
          100% {
            box-shadow: 0 1px 0 rgba(25,49,80,0.03);
            border-color: ${COLORS.border};
            transform: translateX(0);
          }
        }
      `}</style>
    <div ref={cardRef} style={{
      background: COLORS.panel,
      border: "1px solid " + COLORS.border,
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 14,
      boxShadow: "0 1px 0 rgba(25,49,80,0.03)",
      animation: arrivalHighlight ? "hsvArrivalGlow 2.4s ease" : "none",
      transition: "box-shadow 0.25s ease, transform 0.25s ease",
    }}>
      {issue.label ? (
        <div style={{
          fontSize: 12, fontWeight: 900,
          color: issue.labelColor || COLORS.navy,
          letterSpacing: 1.2, marginBottom: 10, textTransform: "uppercase",
        }}>
          {issue.label}
        </div>
      ) : null}
      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.text, marginBottom: 10, lineHeight: 1.2 }}>
        {issue.title}
      </div>
      {issue.visual_config && (issue.visual_score || 0) >= 7 ? (
        <IssueCardVisual config={issue.visual_config} />
      ) : null}
      <div style={{ fontSize: 17, color: COLORS.text, lineHeight: 1.65 }}>
        {body}
      </div>
      {long ? (
        <button onClick={() => setExpanded(!expanded)} style={{
          background: "transparent", border: "none", padding: 0,
          cursor: "pointer", color: COLORS.gold, fontSize: 15, fontWeight: 800, marginTop: 10,
        }}>
          {expanded ? "Show less \u25b2" : "Read more \u25bc"}
        </button>
      ) : null}
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => {
            const next = !decoded;
            setDecoded(next);
            try {
              if (next) {
                sessionStorage.setItem(DECODER_KEY, JSON.stringify({
                  id: cardId,
                  route: window.location.hash.replace("#", "") || "dashboard",
                  ts: Date.now()
                }));
              } else {
                sessionStorage.removeItem(DECODER_KEY);
              }
            } catch(e) {}
          }}
          style={{
            background: COLORS.gold, color: COLORS.navyDark, border: "none",
            borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 15, fontWeight: 900,
          }}
        >
          {decoded ? "Hide Decoder \u25b2" : "Decode This \uD83D\uDD0E"}
        </button>
        <button onClick={handleShare} disabled={sharing} style={{
          background: sharing ? COLORS.muted : COLORS.green,
          color: "#fff", border: "none", borderRadius: 10,
          padding: "10px 16px", cursor: sharing ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 900,
        }}>
          {sharing ? "Preparing..." : "Share \u2197"}
        </button>
      </div>
      {storyOpen && (
        <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1 }}>
          <ShareIssueCard issue={issue} cardRef={storyCardRef} shareStatBlock={shareStatBlock} />
        </div>
      )}
      {showShareOptions ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,16,28,0.72)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#193150", color: "#f7f3ea", borderRadius: 16, border: `1px solid ${COLORS.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.35)", padding: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Share Options</div>
            <div style={{ fontSize: 14, color: "rgba(247,243,234,0.78)", lineHeight: 1.6, marginBottom: 16 }}>Choose how to share this issue card and deep link back to the full investigation.</div>
            <div style={{ display: "grid", gap: 10 }}>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(buildShareText(issue, "sms")); } catch (e) {} }}
                style={{ background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Copy for iMessage/SMS
              </button>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(buildShareText(issue, "social")); } catch (e) {} }}
                style={{ background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Copy for Social Media
              </button>
              <button
                onClick={() => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://hsvcivicwatch.org/c/" + issueRef), "_blank", "noopener,noreferrer")}
                style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Share to Facebook
              </button>
              <button
                onClick={handleDownloadShareImage}
                style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Download image
              </button>
              <button
                onClick={closeShareOptions}
                style={{ background: "transparent", color: "#f7f3ea", border: "1px solid rgba(247,243,234,0.22)", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {decoded ? (
        <CivicDecoderPanel
          analysis={issue.decoder}
          onHide={() => {
            setDecoded(false);
            try { sessionStorage.removeItem(DECODER_KEY); } catch(e) {}
          }}
        />
      ) : null}
    </div>
    </>
  );
}
