import React, { useState, useMemo, useRef, useEffect } from "react";
import { COLORS } from "../config/theme";
import CivicDecoderPanel from "./CivicDecoderPanel";
import {
  BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ReferenceLine
} from "recharts";

const PREVIEW_LIMIT = 300;
const CHART_COLORS = {
  red: "#B4473E",
  gold: "#C6A34D",
  blue: "#89C4E8",
  green: "#3E8B5B",
  lavender: "#7A4FA3",
  muted: "#6b778a",
  redDark: "#7A1F1A",
  orange: "#cf7b2f",
};
const DEFAULT_COLORS = ["#C6A34D", "#89C4E8", "#B4473E", "#3E8B5B", "#7A4FA3", "#cf7b2f", "#6b778a"];

function getHeatColor(baselineVal, harmedVal) {
  if (!baselineVal || !harmedVal) return "#B4473E";
  const gap = Math.abs(baselineVal - harmedVal) / Math.max(baselineVal, harmedVal);
  if (gap < 0.20) return "#3E8B5B";
  if (gap < 0.40) return "#C6A34D";
  if (gap < 0.65) return "#B4473E";
  return "#7A1F1A";
}

function fmtVal(v, unit) {
  if (v === null || v === undefined) return "";
  if (unit === "$") {
    return v >= 1000000
      ? "$" + (v / 1000000).toFixed(1) + "M"
      : v >= 1000
      ? "$" + (v / 1000).toFixed(0) + "k"
      : "$" + v;
  }
  if (unit === "%") return v + "%";
  return v + (unit || "");
}

function IssueCardVisual({ config }) {
  if (!config || !config.type || !config.data) return null;
  const { type, title, data, baselineLabel, referenceValue, referenceLabel, referenceUnit, stages } = config;

  const containerStyle = {
    background: "#193150",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 14,
  };
  const titleStyle = {
    color: "#9aaabb",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  // ── horizontal-bars ──────────────────────────────────────
  if (type === "horizontal-bars") {
    const max = Math.max(...data.map(d => d.value));
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        {data.map(function(d, i) {
          const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = Math.round((d.value / max) * 100);
          const display = fmtVal(d.value, d.unit);
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                <span style={{ color: color, fontSize: 14, fontWeight: 900 }}>{display}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 8 }}>
                <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 8 }} />
              </div>
              {d.context ? <div style={{ color: "#6b778a", fontSize: 11, marginTop: 3 }}>{d.context}</div> : null}
            </div>
          );
        })}
      </div>
    );
  }

  // ── heatmap-comparison ───────────────────────────────────
  // data: [{ metric, baselineValue, harmedValue, unit, context }]
  if (type === "heatmap-comparison") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#6b778a" }} />
            <span style={{ color: "#9aaabb", fontSize: 10 }}>{baselineLabel || "Baseline"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 40, height: 10, borderRadius: 2, background: "linear-gradient(90deg,#3E8B5B,#C6A34D,#B4473E,#7A1F1A)" }} />
            <span style={{ color: "#9aaabb", fontSize: 10 }}>Gap severity</span>
          </div>
        </div>
        {data.map(function(d, i) {
          const maxVal = Math.max(d.baselineValue, d.harmedValue);
          const basePct = Math.round((d.baselineValue / maxVal) * 100);
          const harmedPct = Math.round((d.harmedValue / maxVal) * 100);
          const heatColor = getHeatColor(d.baselineValue, d.harmedValue);
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 14 : 0 }}>
              <div style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 700, marginBottom: 5 }}>{d.metric}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ color: heatColor, fontSize: 13, fontWeight: 900, minWidth: 52 }}>{fmtVal(d.harmedValue, d.unit)}</span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 8, position: "relative" }}>
                  <div style={{ width: harmedPct + "%", background: heatColor, borderRadius: 4, height: 8 }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#6b778a", fontSize: 13, fontWeight: 900, minWidth: 52 }}>{fmtVal(d.baselineValue, d.unit)}</span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 8 }}>
                  <div style={{ width: basePct + "%", background: "#6b778a", borderRadius: 4, height: 8 }} />
                </div>
              </div>
              {d.context ? <div style={{ color: "#6b778a", fontSize: 11, marginTop: 4 }}>{d.context}</div> : null}
            </div>
          );
        })}
      </div>
    );
  }

  // ── wage-bars ─────────────────────────────────────────────
  // Horizontal bars with a reference line threshold
  // data: [{ label, value, unit }], referenceValue, referenceLabel, referenceUnit
  if (type === "wage-bars") {
    const max = Math.max(...data.map(d => d.value), referenceValue || 0);
    const refPct = referenceValue ? Math.round((referenceValue / max) * 100) : null;
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        {refPct !== null ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: refPct + "%", borderTop: "2px dashed #B4473E", position: "relative" }}>
              <span style={{ position: "absolute", right: 0, top: -18, color: "#B4473E", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                {referenceLabel || "Threshold"}: {fmtVal(referenceValue, referenceUnit)}
              </span>
            </div>
          </div>
        ) : null}
        {data.map(function(d, i) {
          const color = CHART_COLORS[d.color] || (d.value < (referenceValue || 0) ? "#B4473E" : "#3E8B5B");
          const pct = Math.round((d.value / max) * 100);
          const belowRef = referenceValue && d.value < referenceValue;
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                <span style={{ color: color, fontSize: 13, fontWeight: 900 }}>{fmtVal(d.value, d.unit)}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 7, position: "relative" }}>
                <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 7 }} />
                {refPct !== null ? (
                  <div style={{ position: "absolute", left: refPct + "%", top: -3, width: 2, height: 13, background: "#B4473E", borderRadius: 1 }} />
                ) : null}
              </div>
              {belowRef && referenceValue ? (
                <div style={{ color: "#B4473E", fontSize: 10, marginTop: 2 }}>
                  Below threshold &mdash; {fmtVal(Math.round((referenceValue - d.value) * 100) / 100, d.unit)} gap
                </div>
              ) : null}
            </div>
          );
        })}
        {referenceValue ? (
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6, color: "#6b778a", fontSize: 11 }}>
            Red line = {referenceLabel || "threshold"}: {fmtVal(referenceValue, referenceUnit)}
          </div>
        ) : null}
      </div>
    );
  }

  // ── flow-chain ────────────────────────────────────────────
  // Nodes connected by arrows, each with label, value, fact
  // data: [{ label, value, fact, color }]
  if (type === "flow-chain") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          {data.map(function(d, i) {
            const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <React.Fragment key={i}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid " + color, borderRadius: 8, padding: "8px 10px", minWidth: 80, maxWidth: 120 }}>
                  <div style={{ color: color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{d.label}</div>
                  {d.value ? <div style={{ color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1.2, marginBottom: 3 }}>{d.value}</div> : null}
                  {d.fact ? <div style={{ color: "#9aaabb", fontSize: 10, lineHeight: 1.4 }}>{d.fact}</div> : null}
                </div>
                {i < data.length - 1 ? (
                  <div style={{ color: "#9aaabb", fontSize: 16, flexShrink: 0 }}>&#8594;</div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // ── funnel ────────────────────────────────────────────────
  // Stages with progressive narrowing
  // data: [{ label, value, unit, color }]
  if (type === "funnel") {
    const max = data[0]?.value || 1;
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        {data.map(function(d, i) {
          const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = Math.round((d.value / max) * 100);
          const dropoff = i > 0 ? data[i - 1].value - d.value : null;
          return (
            <div key={i} style={{ marginBottom: 6 }}>
              {dropoff !== null ? (
                <div style={{ color: "#B4473E", fontSize: 10, marginBottom: 3, paddingLeft: 8 }}>
                  &#8595; {dropoff.toLocaleString()} dropped ({Math.round((dropoff / data[i-1].value) * 100)}%)
                </div>
              ) : null}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#9aaabb", fontSize: 11, minWidth: 120 }}>{d.label}</span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 20, position: "relative" }}>
                  <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 20, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>{fmtVal(d.value, d.unit)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── grouped-bars ──────────────────────────────────────────
  // Side-by-side bars per category (e.g. budgeted vs actual)
  // data: [{ category, values: [{ label, value, color, unit }] }]
  if (type === "grouped-bars") {
    const allVals = data.flatMap(d => d.values.map(v => v.value));
    const max = Math.max(...allVals);
    const groupColors = data[0]?.values.map((v, i) => CHART_COLORS[v.color] || DEFAULT_COLORS[i]) || [];
    const legend = data[0]?.values.map((v, i) => ({ label: v.label, color: groupColors[i] })) || [];
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          {legend.map(function(l, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ color: "#9aaabb", fontSize: 10 }}>{l.label}</span>
              </div>
            );
          })}
        </div>
        {data.map(function(d, i) {
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 10 : 0 }}>
              <div style={{ color: "#ddd5c4", fontSize: 11, marginBottom: 4 }}>{d.category}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {d.values.map(function(v, j) {
                  const color = CHART_COLORS[v.color] || DEFAULT_COLORS[j % DEFAULT_COLORS.length];
                  const pct = Math.round((v.value / max) * 100);
                  return (
                    <div key={j} style={{ flex: 1 }}>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 24, position: "relative" }}>
                        <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 24 }} />
                      </div>
                      <div style={{ color: color, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{fmtVal(v.value, v.unit)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── escalation ────────────────────────────────────────────
  // Severity ladder - rows escalate in color
  // data: [{ trigger, outcome, color }]
  if (type === "escalation") {
    const escColors = ["#3E8B5B", "#C6A34D", "#cf7b2f", "#B4473E", "#7A1F1A"];
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.map(function(d, i) {
            const color = CHART_COLORS[d.color] || escColors[Math.min(i, escColors.length - 1)];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <div style={{ background: color + "22", border: "1px solid " + color, borderRadius: 6, padding: "8px 10px", minWidth: 100, flexShrink: 0 }}>
                  <div style={{ color: color, fontSize: 11, fontWeight: 700 }}>{d.trigger}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", color: "#9aaabb", fontSize: 14 }}>&#8594;</div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "8px 10px", flex: 1 }}>
                  <div style={{ color: "#ddd5c4", fontSize: 12, lineHeight: 1.4 }}>{d.outcome}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── scorecard-grid ────────────────────────────────────────
  // Multiple entity cards with same fields
  // data: [{ entity, fields: [{ label, value, color }] }]
  if (type === "scorecard-grid") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {data.map(function(d, i) {
            return (
              <div key={i} style={{ flex: "1 1 140px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6 }}>{d.entity}</div>
                {(d.fields || []).map(function(f, j) {
                  const color = CHART_COLORS[f.color] || "#9aaabb";
                  return (
                    <div key={j} style={{ marginBottom: 5 }}>
                      <div style={{ color: "#6b778a", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
                      <div style={{ color: color, fontSize: 13, fontWeight: 700 }}>{f.value}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── bar (vertical) ────────────────────────────────────────
  if (type === "bar") {
    const unit = data[0]?.unit || "";
    const chartData = data.map(d => ({ name: d.label, value: d.value, color: CHART_COLORS[d.color] || null }));
    function BarLabel(props) {
      const { x, y, width, value } = props;
      return <text x={x + width/2} y={y - 5} fill="#ddd5c4" textAnchor="middle" fontSize={11} fontWeight={700}>{fmtVal(value, unit)}</text>;
    }
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 8, left: -20, bottom: 40 }}>
            <XAxis dataKey="name" tick={{ fill: "#9aaabb", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: "#9aaabb", fontSize: 10 }} />
            <Bar dataKey="value" radius={[4,4,0,0]} label={<BarLabel />}>
              {chartData.map(function(d, i) {
                return <Cell key={i} fill={d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── trend ─────────────────────────────────────────────────
  if (type === "trend") {
    const chartData = data.map(d => ({ name: d.label, value: d.value }));
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 24, right: 16, left: -20, bottom: 0 }} style={{ pointerEvents: "none" }}>
            <XAxis dataKey="name" tick={{ fill: "#9aaabb", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9aaabb", fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke="#C6A34D" strokeWidth={2} dot={{ fill: "#C6A34D", r: 4 }} isAnimationActive={false}>
              <LabelList dataKey="value" position="top" style={{ fill: "#ddd5c4", fontSize: 11, fontWeight: 700 }} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── pie ───────────────────────────────────────────────────
  if (type === "pie") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart style={{ pointerEvents: "none" }}>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} strokeWidth={0} isAnimationActive={false}>
                {data.map(function(_, i) {
                  return <Cell key={i} fill={DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {data.map(function(d, i) {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: DEFAULT_COLORS[i % DEFAULT_COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: "#9aaabb", fontSize: 12 }}>{d.label}{d.value ? " — " + d.value + "%" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function truncateText(str, n) {
  return str && str.length > n ? str.slice(0, n).trim() + "\u2026" : str || "";
}

function buildShareText(issue) {
  const cardId = issue.ref_number || issue.id || "";
  const module = issue.module || "";
  const deepLink = "https://hsvcivicwatch.org/#" + module + "?card=" + encodeURIComponent(cardId);
  const teaser = issue.homepage_teaser || issue.summary || "";
  const shortTeaser = teaser.length > 180 ? teaser.slice(0, 177) + "..." : teaser;
  return [
    issue.title ? issue.title.toUpperCase() : "HSV CIVIC WATCH",
    shortTeaser,
    "",
    "Full investigation + action steps:",
    deepLink,
    "",
    "#HuntsvilleAL #CivicWatch #MadisonCounty #Alabama"
  ].filter(s => s !== null && s !== undefined).join("\n");
}

function slugifyFilePart(value) {
  return String(value || "issue-card")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "issue-card";
}

function buildIssueDeepLink(issue) {
  return "https://hsvcivicwatch.org/#" + (issue?.module || "") + "?card=" + encodeURIComponent(issue?.ref_number || issue?.id || "");
}

function ShareIssueCard({ issue, cardRef }) {
  const deepLink = buildIssueDeepLink(issue);
  const teaser = issue?.homepage_teaser || "";
  const summary = issue?.summary || "";
  const body = teaser || truncateText(summary, 160);
  return (
    <div ref={cardRef} style={{
      width: 700,
      background: "#e8e1d0",
      padding: 28,
      boxSizing: "border-box",
      fontFamily: "Georgia, serif",
    }}>
      <div style={{
        background: COLORS.panel,
        border: "1px solid " + COLORS.border,
        borderRadius: 20,
        padding: "24px 24px 20px",
        boxShadow: "0 12px 30px rgba(25,49,80,0.12)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>HSV Civic Watch</div>
          <div style={{ color: COLORS.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Issue Card</div>
        </div>
        {issue.label && (
          <div style={{ display: "inline-block", background: "rgba(198,163,77,0.18)", color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 14 }}>
            {issue.label}
          </div>
        )}
        <div style={{ color: COLORS.text, fontSize: 34, fontWeight: 900, lineHeight: 1.16, marginBottom: 16 }}>
          {truncateText(issue.title, 140)}
        </div>
        {issue.visual_config && (issue.visual_score || 0) >= 7 ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ width: 700, overflow: "hidden", transform: "none" }}>
              <IssueCardVisual config={issue.visual_config} />
            </div>
          </div>
        ) : null}
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
            {deepLink}
          </div>
        </div>
      </div>
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
    width: 700,
    windowWidth: 700,
    windowHeight: 1200,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#e8e1d0",
  });
  const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
  if (!blob) return;
  const file = new File([blob], `hsvcivicwatch-${slugifyFilePart(issue?.title)}.png`, { type: "image/png" });
  const shareUrl = buildIssueDeepLink(issue);
  const shareText = buildShareText(issue);
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: shareText,
      url: shareUrl,
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
  const storyCardRef = useRef(null);
  const cardRef = useRef(null);
  const cardId = issue.id || issue.ref_number || issue.title;
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

  const handleShare = async () => {
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
          <ShareIssueCard issue={issue} cardRef={storyCardRef} />
        </div>
      )}
      {showShareOptions ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,16,28,0.72)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#193150", color: "#f7f3ea", borderRadius: 16, border: `1px solid ${COLORS.border}`, boxShadow: "0 24px 80px rgba(0,0,0,0.35)", padding: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Share Options</div>
            <div style={{ fontSize: 14, color: "rgba(247,243,234,0.78)", lineHeight: 1.6, marginBottom: 16 }}>Choose how to share this issue card and deep link back to the full investigation.</div>
            <div style={{ display: "grid", gap: 10 }}>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(shareOptions.shareUrl); } catch (e) {} }}
                style={{ background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Copy link
              </button>
              <button
                onClick={async () => { try { await navigator.clipboard.writeText(shareOptions.shareText); } catch (e) {} }}
                style={{ background: COLORS.gold, color: COLORS.navyDark, border: "none", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}
              >
                Copy caption
              </button>
              <button
                onClick={() => window.open(shareOptions.fbUrl, "_blank", "noopener,noreferrer")}
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
