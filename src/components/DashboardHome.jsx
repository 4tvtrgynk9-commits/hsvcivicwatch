import React, { useEffect, useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

const YEAR_SECONDS = 365 * 24 * 60 * 60;
function earnings(amount, elapsed) { return (amount / YEAR_SECONDS) * elapsed; }
function ratio(ceoAmount, workerAmount) { return `${Math.round(ceoAmount / workerAmount)}:1`; }
function useElapsedSeconds() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed((Date.now() - started) / 1000), 250);
    return () => window.clearInterval(timer);
  }, []);
  return elapsed;
}

const activeInvestigations = [
  { id: "criminal_justice", tag: "Critical", color: COLORS.red, title: "AL prisons 181% capacity — DOJ noncompliance, federal sanctions threatened" },
  { id: "health", tag: "High", color: COLORS.orange, title: "Huntsville Hospital now controls 14 facilities — FTC has not acted on monopoly" },
  { id: "utilities", tag: "High", color: COLORS.orange, title: "TVA raised rates 3 times in 18 months — no AL oversight bill filed" },
  { id: "equity", tag: "Watch", color: COLORS.gold, title: "North Huntsville road PCI avg 41 vs South 72 — same tax base, documented gap" },
  { id: "data_collection", tag: "Watch", color: COLORS.purple, title: "HPD ALPR network: 47 cameras installed with no public vote or hearing" },
  { id: "voting_rights", tag: "Watch", color: COLORS.gold, title: "2026 is the biggest election year in a decade — local turnout still lags" },
];

const keyNumbers = [
  { value: "$2.4B", label: "HH annual revenue", sub: "Nonprofit. $0 income tax.", color: COLORS.red },
  { value: "$20B+", label: "TVA debt load", sub: "Costs passed to ratepayers", color: COLORS.orange },
  { value: "181%", label: "Prison capacity", sub: "DOJ found unconstitutional conditions", color: COLORS.red },
  { value: "47", label: "ALPR cameras", sub: "No public vote held", color: COLORS.purple },
  { value: "41", label: "N. HSV road PCI", sub: "S. HSV avg: 72 — same city", color: COLORS.gold },
  { value: "$847", label: "School funding gap", sub: "Per pupil in lower-income schools", color: COLORS.orange },
];

function FeedRow({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderLeft: `4px solid ${item.color}`,
        borderRadius: 12,
        padding: "14px 16px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 16,
        color: COLORS.text,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1, color: item.color, minWidth: 68 }}>{item.tag}</span>
      <span style={{ flex: 1, fontSize: 18, lineHeight: 1.4 }}>{item.title}</span>
      <span style={{ color: COLORS.textSoft, fontWeight: 800 }}>View →</span>
    </button>
  );
}

function KeyCard({ item }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, minHeight: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.7, textTransform: "uppercase", color: COLORS.textSoft, marginBottom: 10 }}>{item.label}</div>
      <div style={{ fontSize: 34, fontWeight: 1000, color: item.color, marginBottom: 8 }}>{item.value}</div>
      <div style={{ color: COLORS.text, fontSize: 16, lineHeight: 1.5 }}>{item.sub}</div>
    </div>
  );
}

function ModuleCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderTop: `4px solid ${item.featured ? COLORS.gold : COLORS.orange}`,
        borderRadius: 12,
        padding: 18,
        textAlign: "left",
        cursor: "pointer",
        minHeight: 96,
        color: COLORS.text,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.3, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </div>
    </button>
  );
}

function PayPanel({ elapsed }) {
  const huTeller = 33000;
  const huCeo = 430000;
  const hhCna = 34000;
  const hhCeo = 3100000;
  const tvaCeo = 8100000;
  return (
    <section style={{ background: COLORS.panel, border: `1px solid rgba(209,73,63,0.16)`, borderRadius: 14, padding: 22, marginBottom: 30 }}>
      <div style={{ fontSize: 13, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
        Live earnings clocks — since you opened this page
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,1fr) minmax(280px,1fr)", gap: 18 }}>
        <div>
          <div style={{ fontSize: 14, color: COLORS.red, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase" }}>HHHS CEO earnings</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 42, fontWeight: 1000, color: COLORS.red, marginTop: 6 }}>${earnings(hhCeo, elapsed).toFixed(2)}</div>
          <div style={{ color: COLORS.textSoft, fontSize: 14 }}>~$1,490/hr · $3.1M/yr · nonprofit</div>

          <div style={{ fontSize: 14, color: COLORS.orange, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", marginTop: 16 }}>TVA CEO earnings (same time)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 42, fontWeight: 1000, color: COLORS.red, marginTop: 6 }}>${earnings(tvaCeo, elapsed).toFixed(2)}</div>
          <div style={{ color: COLORS.textSoft, fontSize: 14 }}>$8.1M/yr · federal corporation · zero shareholder vote</div>

          <div style={{ fontSize: 14, color: COLORS.green, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", marginTop: 16 }}>HU teller earnings (same time)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 42, fontWeight: 1000, color: COLORS.green, marginTop: 6 }}>${earnings(huTeller, elapsed).toFixed(2)}</div>
          <div style={{ color: COLORS.textSoft, fontSize: 14 }}>$15–$19/hr · ~$33k/yr estimate</div>
        </div>

        <div>
          <div style={{ fontSize: 14, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase" }}>CNA earnings (same time)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 42, fontWeight: 1000, color: COLORS.textSoft, marginTop: 6 }}>${earnings(hhCna, elapsed).toFixed(2)}</div>
          <div style={{ color: COLORS.textSoft, fontSize: 14 }}>$15/hr starting · may qualify for SNAP</div>

          <div style={{ fontSize: 14, color: COLORS.navy, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", marginTop: 16 }}>HU CEO earnings (same time)</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 42, fontWeight: 1000, color: COLORS.navy, marginTop: 6 }}>${earnings(huCeo, elapsed).toFixed(2)}</div>
          <div style={{ color: COLORS.textSoft, fontSize: 14 }}>Est. $380k–$480k/yr · city-owned utility · appointed board</div>

          <div style={{ marginTop: 20, color: COLORS.red, fontSize: 16, lineHeight: 1.7 }}>
            None of these organizations require your vote. All affect your monthly bill, your taxes, or both.<br />
            <strong>HHHS CEO-to-CNA ratio: {ratio(hhCeo, hhCna)}</strong><br />
            <strong>HU CEO-to-teller ratio: {ratio(huCeo, huTeller)}</strong>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18, background: "rgba(209,73,63,0.08)", borderRadius: 10, padding: "14px 16px", color: "#7c2d28", fontSize: 16 }}>
        Both work in Huntsville. The CEO works at a nonprofit that paid <strong>$0 in income tax</strong> on $2.4B in revenue. The CNA may qualify for SNAP. <strong style={{ textDecoration: "underline" }}>Full investigation →</strong>
      </div>
    </section>
  );
}

export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: "Take Action", items: [BOTTOM_NAV] }], []);
  return (
    <div>
      <style>{`
        @keyframes hciTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <section style={{ marginBottom: 28 }}>
        <div style={{ maxWidth: 980 }}>
          <div style={{ fontSize: 64, lineHeight: 0.92, margin: "0 0 8px", color: COLORS.text, fontWeight: 1000, letterSpacing: -1.2 }}>Huntsville <span style={{ color: COLORS.red }}>Civic Investigator</span></div>
          <div style={{ color: COLORS.textSoft, fontSize: 18, lineHeight: 1.6, maxWidth: 980 }}>
            Public records. Documented connections. Real names, real money, real decisions — and what you can do about it. This is your city.
          </div>
        </div>
      </section>

      <PayPanel elapsed={elapsed} />

      <section style={{ marginBottom: 34 }}>
        <div style={{ fontSize: 13, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
          Active investigations & alerts
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {activeInvestigations.map((item) => <FeedRow key={item.title} item={item} onClick={() => onOpenModule(item.id)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 34 }}>
        <div style={{ fontSize: 13, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
          Key numbers — Huntsville 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {keyNumbers.map((item) => <KeyCard key={item.label} item={item} />)}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
          Investigations
        </div>
        {allGroups.map((group) => (
          <div key={group.group} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: COLORS.textSoft, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.8 }}>{group.group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {group.items.map((item) => <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />)}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 16, marginBottom: 6, overflow: "hidden", borderRadius: 0 }}>
        <div style={{ background: COLORS.tickerBg, color: COLORS.gold, padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap", borderTop: `1px solid rgba(198,170,87,0.35)`, borderBottom: `1px solid rgba(198,170,87,0.35)` }}>
          <div style={{ display: "inline-flex", gap: 60, minWidth: "200%", animation: "hciTicker 28s linear infinite", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span>Some figures are estimates because the exact numbers are not publicly disclosed.</span>
            <span>If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.</span>
            <span>Some figures are estimates because the exact numbers are not publicly disclosed.</span>
            <span>If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
