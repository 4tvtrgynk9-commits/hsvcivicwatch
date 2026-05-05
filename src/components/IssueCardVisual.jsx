import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

function formatMoney(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const amount = Number(value);
  if (Math.abs(amount) >= 1000000) return "$" + (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(amount) >= 1000) return "$" + (amount / 1000).toFixed(0) + "k";
  return "$" + Math.round(amount).toLocaleString();
}

function formatHourly(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return "$" + Number(value).toFixed(2) + "/hr";
}

export default function IssueCardVisual({ config }) {
  if (!config || !config.type || config.data == null) return null;

  const { type, title, data, baselineLabel, referenceValue, referenceLabel, referenceUnit } = config;

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

  if (type === "horizontal-bars") {
    const max = Math.max(...data.map((d) => d.value));
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        {data.map((d, i) => {
          const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = Math.round((d.value / max) * 100);
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                <span style={{ color, fontSize: 14, fontWeight: 900 }}>{fmtVal(d.value, d.unit)}</span>
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
        {data.map((d, i) => {
          const maxVal = Math.max(d.baselineValue, d.harmedValue);
          const basePct = Math.round((d.baselineValue / maxVal) * 100);
          const harmedPct = Math.round((d.harmedValue / maxVal) * 100);
          const heatColor = getHeatColor(d.baselineValue, d.harmedValue);
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 14 : 0 }}>
              <div style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 700, marginBottom: 5 }}>{d.metric}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ color: heatColor, fontSize: 13, fontWeight: 900, minWidth: 52 }}>{fmtVal(d.harmedValue, d.unit)}</span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 8 }}>
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

  if (type === "wage-bars") {
    const max = Math.max(...data.map((d) => d.value), referenceValue || 0);
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
        {data.map((d, i) => {
          const color = CHART_COLORS[d.color] || (d.value < (referenceValue || 0) ? "#B4473E" : "#3E8B5B");
          const pct = Math.round((d.value / max) * 100);
          const belowRef = referenceValue && d.value < referenceValue;
          return (
            <div key={i} style={{ marginBottom: i < data.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                <span style={{ color, fontSize: 13, fontWeight: 900 }}>{fmtVal(d.value, d.unit)}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 7, position: "relative" }}>
                <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 7 }} />
                {refPct !== null ? (
                  <div style={{ position: "absolute", left: refPct + "%", top: -3, width: 2, height: 13, background: "#B4473E", borderRadius: 1 }} />
                ) : null}
              </div>
              {belowRef && referenceValue ? (
                <div style={{ color: "#B4473E", fontSize: 10, marginTop: 2 }}>
                  Below threshold — {fmtVal(Math.round((referenceValue - d.value) * 100) / 100, d.unit)} gap
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

  if (type === "flow-chain") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          {data.map((d, i) => {
            const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <React.Fragment key={i}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid " + color, borderRadius: 8, padding: "8px 10px", minWidth: 80, maxWidth: 120 }}>
                  <div style={{ color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{d.label}</div>
                  {d.value ? <div style={{ color: "#fff", fontSize: 13, fontWeight: 900, lineHeight: 1.2, marginBottom: 3 }}>{d.value}</div> : null}
                  {d.fact ? <div style={{ color: "#9aaabb", fontSize: 10, lineHeight: 1.4 }}>{d.fact}</div> : null}
                </div>
                {i < data.length - 1 ? <div style={{ color: "#9aaabb", fontSize: 16, flexShrink: 0 }}>&#8594;</div> : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === "funnel") {
    const max = data[0]?.value || 1;
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        {data.map((d, i) => {
          const color = CHART_COLORS[d.color] || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const pct = Math.round((d.value / max) * 100);
          const dropoff = i > 0 ? data[i - 1].value - d.value : null;
          return (
            <div key={i} style={{ marginBottom: 6 }}>
              {dropoff !== null ? (
                <div style={{ color: "#B4473E", fontSize: 10, marginBottom: 3, paddingLeft: 8 }}>
                  &#8595; {dropoff.toLocaleString()} dropped ({Math.round((dropoff / data[i - 1].value) * 100)}%)
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

  if (type === "grouped-bars") {
    const allVals = data.flatMap((d) => d.values.map((v) => v.value));
    const max = Math.max(...allVals);
    const groupColors = data[0]?.values.map((v, i) => CHART_COLORS[v.color] || DEFAULT_COLORS[i]) || [];
    const legend = data[0]?.values.map((v, i) => ({ label: v.label, color: groupColors[i] })) || [];
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          {legend.map((legendItem, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: legendItem.color }} />
              <span style={{ color: "#9aaabb", fontSize: 10 }}>{legendItem.label}</span>
            </div>
          ))}
        </div>
        {data.map((d, i) => (
          <div key={i} style={{ marginBottom: i < data.length - 1 ? 10 : 0 }}>
            <div style={{ color: "#ddd5c4", fontSize: 11, marginBottom: 4 }}>{d.category}</div>
            <div style={{ display: "flex", gap: 4 }}>
              {d.values.map((v, j) => {
                const color = CHART_COLORS[v.color] || DEFAULT_COLORS[j % DEFAULT_COLORS.length];
                const pct = Math.round((v.value / max) * 100);
                return (
                  <div key={j} style={{ flex: 1 }}>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 24 }}>
                      <div style={{ width: pct + "%", background: color, borderRadius: 4, height: 24 }} />
                    </div>
                    <div style={{ color, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{fmtVal(v.value, v.unit)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "escalation") {
    const escColors = ["#3E8B5B", "#C6A34D", "#cf7b2f", "#B4473E", "#7A1F1A"];
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.map((d, i) => {
            const color = CHART_COLORS[d.color] || escColors[Math.min(i, escColors.length - 1)];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <div style={{ background: color + "22", border: "1px solid " + color, borderRadius: 6, padding: "8px 10px", minWidth: 100, flexShrink: 0 }}>
                  <div style={{ color, fontSize: 11, fontWeight: 700 }}>{d.trigger}</div>
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

  if (type === "scorecard-grid") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: "1 1 140px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ color: "#ddd5c4", fontSize: 12, fontWeight: 700, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 6 }}>{d.entity}</div>
              {(d.fields || []).map((field, j) => {
                const color = CHART_COLORS[field.color] || "#9aaabb";
                return (
                  <div key={j} style={{ marginBottom: 5 }}>
                    <div style={{ color: "#6b778a", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{field.label}</div>
                    <div style={{ color, fontSize: 13, fontWeight: 700 }}>{field.value}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "bar") {
    const unit = data[0]?.unit || "";
    const chartData = data.map((d) => ({ name: d.label, value: d.value, color: CHART_COLORS[d.color] || null }));
    function BarLabel(props) {
      const { x, y, width, value } = props;
      return <text x={x + width / 2} y={y - 5} fill="#ddd5c4" textAnchor="middle" fontSize={11} fontWeight={700}>{fmtVal(value, unit)}</text>;
    }
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 8, left: -20, bottom: 40 }}>
            <XAxis dataKey="name" tick={{ fill: "#9aaabb", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: "#9aaabb", fontSize: 10 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} label={<BarLabel />}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "trend") {
    const chartData = data.map((d) => ({ name: d.label, value: d.value }));
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

  if (type === "pie") {
    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart style={{ pointerEvents: "none" }}>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} strokeWidth={0} isAnimationActive={false}>
                {data.map((_, i) => <Cell key={i} fill={DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {data.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: DEFAULT_COLORS[i % DEFAULT_COLORS.length], flexShrink: 0 }} />
                <span style={{ color: "#9aaabb", fontSize: 12 }}>{d.label}{d.value ? " — " + d.value + "%" : ""}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "pay-comparison") {
    const executive = data.executive || {};
    const worker = data.worker || {};
    const ratio = Number(data.ratio || 0);
    const livingWage = Number(data.livingWage || 0);
    const workerHourly = Number(worker.hourly || 0);
    const workerAboveLiving = Boolean(data.workerAboveLiving);
    const capAt50 = data.capAt50 || {};
    const ratioColor = ratio > 50 ? "#B4473E" : ratio >= 20 ? "#C6A34D" : "#3E8B5B";
    const workerColor = workerAboveLiving ? "#3E8B5B" : "#B4473E";
    const gapColor = workerAboveLiving ? "#3E8B5B" : "#C6A34D";
    const capColor = capAt50.aboveLiving ? "#3E8B5B" : "#C6A34D";

    return (
      <div style={containerStyle}>
        {title ? <div style={titleStyle}>{title}</div> : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 14 }}>
          <div style={{ border: "2px solid #C6A34D", borderRadius: 10, padding: "12px 14px", background: "rgba(198,163,77,0.08)" }}>
            <div style={{ color: "#C6A34D", fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Executive</div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, lineHeight: 1.2 }}>{executive.name || "—"}</div>
            <div style={{ color: "#9aaabb", fontSize: 11, marginTop: 3 }}>{executive.title || "—"}</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 10 }}>{formatMoney(executive.annual)}</div>
            <div style={{ color: "#C6A34D", fontSize: 12, fontWeight: 700, marginTop: 2 }}>{formatHourly(executive.hourly)}</div>
          </div>

          <div style={{ border: "2px solid " + workerColor, borderRadius: 10, padding: "12px 14px", background: workerAboveLiving ? "rgba(62,139,91,0.08)" : "rgba(180,71,62,0.08)" }}>
            <div style={{ color: workerColor, fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Worker</div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, lineHeight: 1.2 }}>{worker.role || "—"}</div>
            <div style={{ color: "#9aaabb", fontSize: 11, marginTop: 3 }}>{worker.title || ""}</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginTop: 10 }}>{formatMoney(worker.annual)}</div>
            <div style={{ color: workerColor, fontSize: 12, fontWeight: 700, marginTop: 2 }}>{formatHourly(worker.hourly)}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ color: ratioColor, fontSize: 30, fontWeight: 1000, lineHeight: 1 }}>{ratio ? ratio.toFixed(ratio % 1 ? 1 : 0) : "—"}:1</div>
          <div style={{ color: "#ddd5c4", fontSize: 11, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginTop: 4 }}>Pay Ratio</div>
        </div>

        <div style={{ borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ color: "#9aaabb", fontSize: 10, fontWeight: 900, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 6 }}>Living Wage Check</div>
          <div style={{ color: "#ddd5c4", fontSize: 13, lineHeight: 1.5 }}>
            Worker pay: <span style={{ color: workerColor, fontWeight: 900 }}>{formatHourly(workerHourly)}</span>
            {" "}vs{" "}
            <span style={{ color: "#C6A34D", fontWeight: 900 }}>{data.livingWageLabel || "Living Wage"} {formatHourly(livingWage)}</span>
          </div>
          <div style={{ color: gapColor, fontSize: 11, fontWeight: 700, marginTop: 4 }}>
            {workerAboveLiving ? "Above living wage." : "Below living wage."}
          </div>
        </div>

        <div style={{ borderRadius: 10, background: capColor === "#3E8B5B" ? "rgba(62,139,91,0.10)" : "rgba(198,163,77,0.10)", border: "1px solid " + capColor + "55", padding: "10px 12px" }}>
          <div style={{ color: capColor, fontSize: 10, fontWeight: 900, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 6 }}>50:1 Cap Scenario</div>
          <div style={{ color: "#ddd5c4", fontSize: 13, lineHeight: 1.55 }}>
            If {executive.name || "the executive"}’s pay was capped at 50:1 — {capAt50.workerCount ?? 0} workers could receive +{formatHourly(capAt50.newHourly)}.
          </div>
          <div style={{ color: "#9aaabb", fontSize: 11, lineHeight: 1.5, marginTop: 4 }}>
            Freed: {formatMoney(capAt50.freed)} · Weekly gain: +{formatMoney(capAt50.gainPerWeek)}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
