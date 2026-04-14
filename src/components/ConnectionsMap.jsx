/* eslint-disable */
import React, { useState, useRef, useEffect, useCallback } from "react";

const COLORS = {
  official: "#C6A34D",
  officialBg: "rgba(198,163,77,0.15)",
  donor: "#B98FD8",
  donorBg: "rgba(185,143,216,0.12)",
  decision: "#89C4E8",
  decisionBg: "rgba(137,196,232,0.12)",
  impact: "#E07068",
  impactBg: "rgba(224,112,104,0.12)",
  bg: "#193150",
  line: "rgba(255,255,255,0.15)",
};

const NODE_W = 148;
const NODE_H = 52;
const PAD = 24;

const OFFICIALS = {
  ivey: {
    id: "ivey", type: "official", name: "Gov. Kay Ivey", stat: "$940k+ from insurance & energy",
    detail: { title: "Gov. Kay Ivey", facts: [
      { k: "Office", v: "Governor of Alabama since 2017" },
      { k: "Direct donations", v: "$495,000 from insurance & energy sector" },
      { k: "PAC donations", v: "$445,000 through affiliated PACs" },
      { k: "Total", v: "$940,000+" },
    ]}
  },
  battle: {
    id: "battle", type: "official", name: "Mayor Tommy Battle", stat: "$380k+ from real estate & construction",
    detail: { title: "Mayor Tommy Battle", facts: [
      { k: "Office", v: "Mayor of Huntsville since 2008" },
      { k: "Direct donations", v: "$210,000 from real estate & developers" },
      { k: "PAC donations", v: "$170,000 through affiliated PACs" },
      { k: "Total", v: "$380,000+" },
    ]}
  },
  fowler: {
    id: "fowler", type: "official", name: "Comm. Mark Fowler", stat: "Appointed by Ivey — not elected",
    detail: { title: "Comm. Mark Fowler", facts: [
      { k: "Office", v: "AL Insurance Commissioner" },
      { k: "Appointed by", v: "Gov. Kay Ivey, 2019" },
      { k: "Key action", v: "Approved BCBS 19.3%, UHC 20%, Celtic 25% rate hikes" },
      { k: "Industry ties", v: "Prior insurance industry background" },
    ]}
  },
};

const ALL_NODES = {
  ivey: OFFICIALS.ivey,
  battle: OFFICIALS.battle,
  fowler: OFFICIALS.fowler,
  bcbs: {
    id: "bcbs", type: "donor", name: "Blue Cross Blue Shield AL", stat: "$220k to Ivey",
    officials: ["ivey", "fowler"],
    detail: { title: "Blue Cross Blue Shield AL", facts: [
      { k: "Direct to Ivey", v: "$220,000" },
      { k: "PAC contributions", v: "$180,000 through affiliated PACs" },
      { k: "Total", v: "$400,000+" },
      { k: "What followed", v: "Medicaid refused 10 years. 19.3% rate hike approved 2026." },
    ]}
  },
  protective: {
    id: "protective", type: "donor", name: "Protective Life Corp.", stat: "$95k to Ivey",
    officials: ["ivey"],
    detail: { title: "Protective Life Corp.", facts: [
      { k: "Direct to Ivey", v: "$95,000" },
      { k: "PAC contributions", v: "$60,000" },
      { k: "Total", v: "$155,000" },
      { k: "What followed", v: "No credit-based pricing reform. Rate review stays industry-friendly." },
    ]}
  },
  bca: {
    id: "bca", type: "donor", name: "Business Council of AL", stat: "$180k to Ivey",
    officials: ["ivey", "battle"],
    detail: { title: "Business Council of Alabama", facts: [
      { k: "Direct to Ivey", v: "$180,000" },
      { k: "Direct to Battle", v: "$45,000" },
      { k: "Total", v: "$225,000+" },
      { k: "What followed", v: "Minimum wage frozen at $7.25 since 2009. SB 88 passed blocking city wage increases." },
    ]}
  },
  hhhs: {
    id: "hhhs", type: "donor", name: "HHHS / VIVA Health", stat: "Aligned with BCBS via VIVA",
    officials: ["ivey", "battle"],
    detail: { title: "Huntsville Hospital Health System", facts: [
      { k: "BCBS alignment", v: "VIVA Health = BCBS subsidiary co-branded with HHHS" },
      { k: "Board appointed by", v: "Huntsville City Council (Mayor Battle oversight)" },
      { k: "City donations", v: "$63M/yr tax exemption as nonprofit" },
      { k: "What followed", v: "No Medicaid expansion = no competitor. HEMSI acquired Jan 2024." },
    ]}
  },
  rcp: {
    id: "rcp", type: "donor", name: "RCP Companies", stat: "$82k to Battle",
    officials: ["battle"],
    detail: { title: "RCP Companies", facts: [
      { k: "Direct to Battle", v: "$82,000" },
      { k: "PAC contributions", v: "$38,000" },
      { k: "Total", v: "$120,000+" },
      { k: "What followed", v: "Multiple development approvals in South Huntsville. North Huntsville road investment lagged." },
    ]}
  },
  medicaid: {
    id: "medicaid", type: "decision", name: "Medicaid not expanded", stat: "Refused since 2014",
    officials: ["ivey"],
    detail: { title: "Medicaid not expanded", facts: [
      { k: "Decision maker", v: "Gov. Kay Ivey — annual choice" },
      { k: "Federal funding refused", v: "$1.8B/yr left on table" },
      { k: "BCBS benefit", v: "No competition. Private market stays dominant." },
      { k: "HHHS benefit", v: "No Medicaid patients undercutting hospital pricing." },
    ]}
  },
  ratehike: {
    id: "ratehike", type: "decision", name: "19–25% rate hikes approved", stat: "2026 — no public challenge",
    officials: ["fowler", "ivey"],
    detail: { title: "ALDOI approves 19–25% premium increases", facts: [
      { k: "Approved by", v: "Comm. Fowler — appointed by Ivey" },
      { k: "BCBS increase", v: "+19.3% individual market 2026" },
      { k: "UHC increase", v: "+20.0% individual market 2026" },
      { k: "Public input", v: "None — no challenge process exists in Alabama" },
    ]}
  },
  wagefreeeze: {
    id: "wagefreeze", type: "decision", name: "Minimum wage frozen $7.25", stat: "Unchanged since 2009",
    officials: ["ivey"],
    detail: { title: "Alabama minimum wage frozen", facts: [
      { k: "Current rate", v: "$7.25/hr — federal floor since 2009" },
      { k: "SB 88 signed", v: "Ivey signed 2023 — blocks cities from raising wages" },
      { k: "BCA role", v: "$180k donated to Ivey. Lobbied for SB 88." },
      { k: "MIT living wage", v: "$20.18/hr for single adult in Madison County" },
    ]}
  },
  uninsured: {
    id: "uninsured", type: "impact", name: "12,000 uninsured — Huntsville", stat: "Medicaid gap",
    detail: { title: "12,000 Huntsville metro residents uninsured", facts: [
      { k: "Cause", v: "Alabama Medicaid gap — too poor for subsidies, no Medicaid" },
      { k: "Statewide", v: "~295,000 Alabamians in coverage gap" },
      { k: "Connection", v: "Ivey refuses expansion. BCBS donated $220k to Ivey." },
      { k: "Status", v: "Ongoing — no legislative action" },
    ]}
  },
  premiums: {
    id: "premiums", type: "impact", name: "+19% premiums 2026", stat: "No recourse for residents",
    detail: { title: "Premium increases hit individual market", facts: [
      { k: "Increase", v: "19–25% for individual market plans in 2026" },
      { k: "Madison County bronze", v: "$436–490/mo — among highest in AL" },
      { k: "After-subsidy avg", v: "$121/mo — tripled from $44 when credits expired" },
      { k: "Challenge process", v: "None — ALDOI approved with no public input" },
    ]}
  },
  northhsv: {
    id: "northhsv", type: "impact", name: "North HSV underinvested", stat: "Same tax rate, less investment",
    detail: { title: "North Huntsville receives less city investment", facts: [
      { k: "Road quality PCI", v: "North: 41/100 vs South: 72/100" },
      { k: "Developer donations", v: "RCP, MG Edwards concentrated in South HSV projects" },
      { k: "Battle donations", v: "$380k+ from real estate interests" },
      { k: "Result", v: "Capital investment skewed toward donor-aligned development zones" },
    ]}
  },
};

const EDGES = [
  { from: "bcbs", to: "ivey" }, { from: "bcbs", to: "fowler" },
  { from: "protective", to: "ivey" }, { from: "bca", to: "ivey" },
  { from: "bca", to: "battle" }, { from: "hhhs", to: "ivey" },
  { from: "hhhs", to: "battle" }, { from: "rcp", to: "battle" },
  { from: "ivey", to: "medicaid" }, { from: "ivey", to: "ratehike" },
  { from: "ivey", to: "wagefreeeze" }, { from: "fowler", to: "ratehike" },
  { from: "bcbs", to: "medicaid" }, { from: "hhhs", to: "medicaid" },
  { from: "bcbs", to: "ratehike" },
  { from: "medicaid", to: "uninsured" }, { from: "ratehike", to: "premiums" },
  { from: "wagefreeeze", to: "premiums" }, { from: "rcp", to: "northhsv" },
  { from: "battle", to: "northhsv" },
];

function getNodeColor(type) {
  return { official: COLORS.official, donor: COLORS.donor, decision: COLORS.decision, impact: COLORS.impact }[type] || COLORS.official;
}
function getNodeBg(type) {
  return { official: COLORS.officialBg, donor: COLORS.donorBg, decision: COLORS.decisionBg, impact: COLORS.impactBg }[type] || COLORS.officialBg;
}

function layoutNodes(activeOfficial, showAll) {
  const nodeIds = new Set();
  const nodeMap = { ...ALL_NODES };

  if (activeOfficial === "all") {
    Object.keys(nodeMap).forEach(id => nodeIds.add(id));
  } else {
    nodeIds.add(activeOfficial);
    EDGES.forEach(e => {
      if (e.from === activeOfficial) nodeIds.add(e.to);
      if (e.to === activeOfficial) nodeIds.add(e.from);
      if (nodeIds.has(e.from) && nodeIds.has(e.to)) return;
      if (e.from === activeOfficial || e.to === activeOfficial) {
        nodeIds.add(e.from);
        nodeIds.add(e.to);
      }
    });
    EDGES.forEach(e => {
      if (nodeIds.has(e.from) && nodeIds.has(e.to)) return;
    });
  }

  const ids = Array.from(nodeIds);
  const W = 700, H = 520;
  const cx = W / 2, cy = H / 2;

  const positions = {};
  const official = ids.find(id => nodeMap[id]?.type === "official" && (activeOfficial === "all" || id === activeOfficial));
  const donors = ids.filter(id => nodeMap[id]?.type === "donor");
  const decisions = ids.filter(id => nodeMap[id]?.type === "decision");
  const impacts = ids.filter(id => nodeMap[id]?.type === "impact");
  const otherOfficials = ids.filter(id => nodeMap[id]?.type === "official" && id !== activeOfficial);

  if (official) {
    positions[official] = { x: cx - NODE_W / 2, y: cy - NODE_H / 2 };
  }

  const placeGroup = (group, startAngle, endAngle, radius) => {
    group.forEach((id, i) => {
      const angle = group.length === 1
        ? (startAngle + endAngle) / 2
        : startAngle + (i / (group.length - 1)) * (endAngle - startAngle);
      const rad = angle * Math.PI / 180;
      positions[id] = {
        x: cx + Math.cos(rad) * radius - NODE_W / 2,
        y: cy + Math.sin(rad) * radius - NODE_H / 2,
      };
    });
  };

  placeGroup(donors, 180, 270, 210);
  placeGroup(decisions, -45, 45, 200);
  placeGroup(impacts, 80, 140, 220);
  placeGroup(otherOfficials, 230, 280, 180);

  // Collision resolution
  const allIds = Object.keys(positions);
  for (let iter = 0; iter < 50; iter++) {
    for (let i = 0; i < allIds.length; i++) {
      for (let j = i + 1; j < allIds.length; j++) {
        const a = positions[allIds[i]];
        const b = positions[allIds[j]];
        const overlapX = (NODE_W + PAD) - Math.abs(b.x - a.x);
        const overlapY = (NODE_H + PAD) - Math.abs(b.y - a.y);
        if (overlapX > 0 && overlapY > 0) {
          const pushX = overlapX / 2 + 2;
          const pushY = overlapY / 2 + 2;
          if (overlapX < overlapY) {
            if (b.x > a.x) { a.x -= pushX; b.x += pushX; } else { a.x += pushX; b.x -= pushX; }
          } else {
            if (b.y > a.y) { a.y -= pushY; b.y += pushY; } else { a.y += pushY; b.y -= pushY; }
          }
        }
      }
    }
  }

  // Clamp to canvas
  allIds.forEach(id => {
    positions[id].x = Math.max(8, Math.min(W - NODE_W - 8, positions[id].x));
    positions[id].y = Math.max(8, Math.min(H - NODE_H - 8, positions[id].y));
  });

  const visibleEdges = EDGES.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to));
  return { positions, nodeIds: ids, visibleEdges, nodeMap };
}

function edgePath(ax, ay, bx, by) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  return "M " + ax + " " + ay + " Q " + mx + " " + my + " " + bx + " " + by;
}

function getBoxEdgePoint(pos, targetX, targetY) {
  const cx = pos.x + NODE_W / 2;
  const cy = pos.y + NODE_H / 2;
  const dx = targetX - cx;
  const dy = targetY - cy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx === 0 && absDy === 0) return { x: cx, y: cy };
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  const scaleX = absDx > 0 ? hw / absDx : Infinity;
  const scaleY = absDy > 0 ? hh / absDy : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

export default function ConnectionsMap() {
  const [activeOfficial, setActiveOfficial] = useState("ivey");
  const [mode, setMode] = useState("official");
  const [popup, setPopup] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const { positions, nodeIds, visibleEdges, nodeMap } = layoutNodes(activeOfficial, showAll);

  const sharedNodeIds = nodeIds.filter(id => {
    const node = nodeMap[id];
    return node?.officials && node.officials.length > 1;
  });

  const donorNodes = nodeIds.filter(id => nodeMap[id]?.type === "donor");
  const topDonors = [...donorNodes].sort((a, b) => {
    const aAmt = parseInt((nodeMap[a]?.stat || "0").replace(/[^0-9]/g, "")) || 0;
    const bAmt = parseInt((nodeMap[b]?.stat || "0").replace(/[^0-9]/g, "")) || 0;
    return bAmt - aAmt;
  });
  const visibleDonors = showAll ? topDonors : topDonors.slice(0, 10);
  const visibleNodeIds = nodeIds.filter(id =>
    nodeMap[id]?.type !== "donor" || visibleDonors.includes(id)
  );

  return (
    <div style={{ background: COLORS.bg, borderRadius: 14, padding: 20, fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setMode("official")} style={{ background: mode === "official" ? "#C6A34D" : "rgba(255,255,255,0.06)", color: mode === "official" ? "#193150" : "#9aaabb", border: "1px solid " + (mode === "official" ? "#C6A34D" : "rgba(255,255,255,0.1)"), borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>By official</button>
        <button onClick={() => setMode("donor")} style={{ background: mode === "donor" ? "#B98FD8" : "rgba(255,255,255,0.06)", color: mode === "donor" ? "#193150" : "#9aaabb", border: "1px solid " + (mode === "donor" ? "#B98FD8" : "rgba(255,255,255,0.1)"), borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>By donor</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.values(OFFICIALS).map(off => (
          <button key={off.id} onClick={() => setActiveOfficial(off.id)} style={{ background: activeOfficial === off.id ? "rgba(198,163,77,0.2)" : "rgba(255,255,255,0.04)", color: activeOfficial === off.id ? "#C6A34D" : "#9aaabb", border: "1px solid " + (activeOfficial === off.id ? "#C6A34D" : "rgba(255,255,255,0.08)"), borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>{off.name}</button>
        ))}
      </div>

      <div style={{ position: "relative", width: "100%", paddingBottom: "74%", background: "rgba(0,0,0,0.2)", borderRadius: 10, overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 700 520" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </marker>
          </defs>

          {visibleEdges.map((edge, i) => {
            if (!positions[edge.from] || !positions[edge.to]) return null;
            const fp = positions[edge.from];
            const tp = positions[edge.to];
            const fcx = fp.x + NODE_W / 2;
            const fcy = fp.y + NODE_H / 2;
            const tcx = tp.x + NODE_W / 2;
            const tcy = tp.y + NODE_H / 2;
            const start = getBoxEdgePoint(fp, tcx, tcy);
            const end = getBoxEdgePoint(tp, fcx, fcy);
            const fromType = nodeMap[edge.from]?.type;
            const color = getNodeColor(fromType);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const len = Math.sqrt(dx*dx + dy*dy);
            if (len < 2) return null;
            const ux = dx / len;
            const uy = dy / len;
            const gap = 10;
            const sx = start.x + ux * gap;
            const sy = start.y + uy * gap;
            const ex = end.x - ux * gap;
            const ey = end.y - uy * gap;
            return (
              <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"
                markerEnd="url(#arr)" />
            );
          })}

          {visibleNodeIds.map(id => {
            const node = nodeMap[id];
            if (!node || !positions[id]) return null;
            const pos = positions[id];
            const color = getNodeColor(node.type);
            const bg = getNodeBg(node.type);
            const isShared = sharedNodeIds.includes(id);
            return (
              <g key={id} style={{ cursor: "pointer" }} onClick={() => setPopup(node)}>
                {isShared && (
                  <rect x={pos.x - 3} y={pos.y - 3} width={NODE_W + 6} height={NODE_H + 6}
                    rx="10" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
                )}
                <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H}
                  rx="8" fill={bg} stroke={color} strokeWidth="1"/>
                <text x={pos.x + NODE_W / 2} y={pos.y + 16} textAnchor="middle"
                  fill={color} fontSize="12" fontWeight="700" fontFamily="Georgia, serif">{node.name.length > 20 ? node.name.slice(0, 19) + "\u2026" : node.name}</text>
                <text x={pos.x + NODE_W / 2} y={pos.y + 33} textAnchor="middle"
                  fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Georgia, serif">{node.stat.length > 22 ? node.stat.slice(0, 21) + "\u2026" : node.stat}</text>
                {isShared && (
                  <rect x={pos.x + NODE_W - 10} y={pos.y - 10} width={20} height={16} rx="8" fill={color} stroke="#193150" strokeWidth="2"/>
                )}
                {isShared && (
                  <text x={pos.x + NODE_W} y={pos.y - 1} textAnchor="middle"
                    fill="#193150" fontSize="9" fontWeight="700" fontFamily="Georgia, serif">{node.officials ? node.officials.length : 2}</text>
                )}
              </g>
            );
          })}
        </svg>

        {popup && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, borderRadius: 10 }}>
            <div style={{ background: "#1e2d42", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: 22, maxWidth: 300, width: "90%" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: getNodeColor(popup.type), marginBottom: 6 }}>{popup.type}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 14 }}>{popup.detail.title}</div>
              {popup.detail.facts.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "#6b778a", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 90, flexShrink: 0 }}>{f.k}</span>
                  <span style={{ fontSize: 13, color: i === 0 ? getNodeColor(popup.type) : "#ddd5c4" }}>{f.v}</span>
                </div>
              ))}
              {popup.type === "donor" && popup.officials && popup.officials.length > 1 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 11, color: "#6b778a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Also donated to</div>
                  {popup.officials.filter(id => id !== activeOfficial).map(id => {
                    const donationKey = popup.id + "_" + id;
                    const donations = {
                      "bcbs_fowler": "Connected via VIVA/BCBS rate approval relationship",
                      "bcbs_battle": "$45,000 direct + aligned hospital board interests",
                      "bca_battle": "$45,000 direct — wage suppression mutual interest",
                      "hhhs_battle": "Board appointed by City Council — Battle has oversight",
                      "hhhs_ivey": "$63M/yr tax exemption approved under Ivey administration",
                    };
                    const note = donations[donationKey] || donations[popup.id + "_" + id] || "See public campaign finance records";
                    return (
                      <div key={id} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 13, color: "#C6A34D", fontWeight: 700 }}>{OFFICIALS[id]?.name || id}</div>
                        <div style={{ fontSize: 12, color: "#9aaabb", marginTop: 2 }}>{note}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {popup.type === "decision" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 11, color: "#6b778a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Officials who decided</div>
                  {EDGES.filter(e => e.to === popup.id && nodeMap[e.from]?.type === "official").map(e => (
                    <div key={e.from} style={{ fontSize: 13, color: "#C6A34D", fontWeight: 700, marginBottom: 4 }}>
                      {OFFICIALS[e.from]?.name || e.from}
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: "#6b778a", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8, marginBottom: 6 }}>Donors who benefited</div>
                  {EDGES.filter(e => e.to === popup.id && nodeMap[e.from]?.type === "donor").map(e => (
                    <div key={e.from} style={{ fontSize: 13, color: "#B98FD8", fontWeight: 700, marginBottom: 4 }}>
                      {nodeMap[e.from]?.name || e.from}
                    </div>
                  ))}
                </div>
              )}
              {popup.type === "impact" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 11, color: "#6b778a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Caused by</div>
                  {EDGES.filter(e => e.to === popup.id).map(e => (
                    <div key={e.from} style={{ fontSize: 13, color: getNodeColor(nodeMap[e.from]?.type), fontWeight: 700, marginBottom: 4 }}>
                      {nodeMap[e.from]?.name || e.from}
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setPopup(null)} style={{ marginTop: 14, width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#f3ead1", borderRadius: 4, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>Close</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[["official","Officials"],["donor","Donors / companies"],["decision","Decisions / bills"],["impact","Who pays"]].map(([type, label]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9aaabb" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: getNodeColor(type) }}/>
            {label}
          </div>
        ))}
        <div style={{ fontSize: 11, color: "#6b778a", marginLeft: "auto" }}>Dashed border = appears in multiple officials' webs</div>
      </div>
    </div>
  );
}
