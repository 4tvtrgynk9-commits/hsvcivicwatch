import React, { useEffect, useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

const keyNumbers = [
  { label: "TVA Debt", value: "$20B+", sub: "Debt tied to the monopoly power system residents still fund.", color: COLORS.red, target: "utilities" },
  { label: "Hospital Buyout", value: "$450M", sub: "Crestwood acquisition accelerating regional healthcare monopoly concerns.", color: COLORS.purple, target: "health" },
  { label: "Pretrial Detention", value: "61%", sub: "People jailed before conviction, punished by poverty first.", color: COLORS.green, target: "criminal_justice" },
  { label: "COVID Funds to Prisons", value: "$400M", sub: "Pandemic relief redirected into prison construction instead of community needs.", color: COLORS.gold, target: "criminal_justice" },
  { label: "Front Row Subsidy", value: "$16M", sub: "City investment helping underwrite a luxury downtown development.", color: COLORS.orange, target: "housing_crisis" },
  { label: "Grocery Tax", value: "7%", sub: "≈ $420/yr for 1 person · ≈ $1,680/yr for household of 4", color: COLORS.navy, target: "taxation" },
];

const activeInvestigations = [
  { id: "utilities", tag: "Utilities", color: COLORS.orange, title: "The risk is in Alabama. The control isn’t." },
  { id: "health", tag: "Healthcare", color: COLORS.red, title: "Nonprofit on paper. Monopoly in practice." },
  { id: "equity", tag: "The Two Huntsvilles", color: COLORS.navy, title: "One growth story. Two very different cities." },
  { id: "money", tag: "Follow the Money", color: COLORS.gold, title: "The same names keep showing up." },
];

function useElapsedSeconds() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - started) / 1000), 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function earnings(annual, seconds) {
  return annual / (365 * 24 * 60 * 60) * seconds;
}

function ratio(a, b) {
  if (!a || !b) return "—";
  return `${Math.round(a / b)}:1`;
}

function FeedRow({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "12px 15px",
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "center",
        textAlign: "left",
        color: COLORS.text,
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1, color: item.color, minWidth: 82 }}>{item.tag}</span>
      <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.34 }}>{item.title}</span>
      <span style={{ color: COLORS.textSoft, fontWeight: 800, fontSize: 12 }}>View →</span>
    </button>
  );
}

function KeyCard({ item, onClick }) {
  return (
    <button onClick={onClick} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, minHeight: 116, cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", color: COLORS.textSoft, marginBottom: 8 }}>{item.label}</div>
      <div style={{ fontSize: 25, fontWeight: 1000, color: item.color, marginBottom: 6 }}>{item.value}</div>
      <div style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.35, maxWidth: 180 }}>{item.sub}</div>
    </button>
  );
}

function ModuleCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderTop: `4px solid ${item.featured ? COLORS.navy : COLORS.navy}`,
        borderRadius: 12,
        padding: 15,
        textAlign: "left",
        cursor: "pointer",
        minHeight: 84,
        color: COLORS.text,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.25, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </div>
    </button>
  );
}

function ClockCell({ label, valueAnnual, valueHourly, elapsed, color, subtitle, onClick, centered=false }) {
  return (
    <button onClick={onClick} style={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, cursor: "pointer", textAlign: centered ? "center" : "left" }}>
      <div style={{ fontSize: 9.5, color, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 20, fontWeight: 1000, color: COLORS.text, marginBottom: 6, textAlign: "center" }}>${earnings(valueAnnual, elapsed).toFixed(2)}</div>
      <div style={{ color: COLORS.textSoft, fontSize: 11.5, lineHeight: 1.3, textAlign: "center" }}>{valueHourly} · {subtitle}</div>
    </button>
  );
}

function PayPanel({ elapsed, onOpenModule }) {
  const huTeller = 33000;
  const huCeo = 430000;
  const hhCna = 34000;
  const hhCeo = 3100000;
  const tvaCeo = 8100000;

  return (
    <section style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 22 }}>
      <div style={{ fontSize: 11, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.0, textTransform: "uppercase", marginBottom: 12 }}>
        Live pay clocks — since you opened this page
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <div style={{ background: "rgba(25,49,80,0.10)", border: `1px solid rgba(25,49,80,0.15)`, borderRadius: 14, padding: 13 }}>
          <div style={{ fontSize: 10.5, color: COLORS.navy, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 9 }}>Utilities pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            <ClockCell label="TVA CEO earnings" valueAnnual={tvaCeo} valueHourly="~$3,894/hr" elapsed={elapsed} color={COLORS.orange} subtitle="$8.1M/yr" onClick={() => onOpenModule("utilities")} centered />
            <ClockCell label="HU CEO earnings" valueAnnual={huCeo} valueHourly="~$207/hr" elapsed={elapsed} color={COLORS.gold} subtitle="Est. $430k/yr" onClick={() => onOpenModule("utilities")} centered />
            <div style={{ gridColumn: "1 / span 2" }}><ClockCell label="HU teller earnings" valueAnnual={huTeller} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.green} subtitle="Est. $33k/yr" onClick={() => onOpenModule("utilities")} centered /></div>
          </div>
          <button onClick={() => onOpenModule("utilities")} style={{ marginTop: 9, display: "grid", gap: 5, color: COLORS.text, fontSize: 12.5, background: "transparent", border: "none", padding: 0, width: "100%", textAlign: "center", cursor: "pointer" }}>
            <div><strong>HU CEO-to-teller ratio:</strong> {ratio(huCeo, huTeller)}</div>
            <div><strong>TVA CEO-to-teller ratio:</strong> {ratio(tvaCeo, huTeller)}</div>
          </button>
        </div>

        <div style={{ background: "rgba(123,76,194,0.08)", border: `1px solid rgba(123,76,194,0.14)`, borderRadius: 14, padding: 13 }}>
          <div style={{ fontSize: 10.5, color: COLORS.purple, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 9 }}>Healthcare pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 9 }}>
            <ClockCell label="HHHS CEO earnings" valueAnnual={hhCeo} valueHourly="~$1,490/hr" elapsed={elapsed} color={COLORS.red} subtitle="$3.1M/yr" onClick={() => onOpenModule("health")} centered />
            <ClockCell label="CNA earnings" valueAnnual={hhCna} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.navy} subtitle="Est. $34k/yr" onClick={() => onOpenModule("health")} centered />
          </div>
          <button onClick={() => onOpenModule("health")} style={{ marginTop: 9, display: "grid", gap: 5, color: COLORS.text, fontSize: 12.5, background: "transparent", border: "none", padding: 0, width: "100%", textAlign: "center", cursor: "pointer" }}>
            <div><strong>HHHS CEO-to-CNA ratio:</strong> {ratio(hhCeo, hhCna)}</div>
            <div style={{ color: COLORS.textSoft, fontSize: 11.5 }}>Lowest-paid everyday worker role shown for comparison.</div>
          </button>
        </div>
      </div>
    </section>
  );
}
export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: BOTTOM_NAV.group, items: [BOTTOM_NAV] }], []);
  return (
    <div>
      <style>{`
        @keyframes hciTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <section style={{ marginBottom: 20 }}>
        <div style={{ maxWidth: 980 }}>
          <div style={{ fontSize: 52, lineHeight: 0.94, margin: "0 0 10px", color: COLORS.text, fontWeight: 1000, letterSpacing: -1.0 }}>Huntsville Civic Investigator</div>
          <div style={{ color: COLORS.navy, fontSize: 20, fontWeight: 700, lineHeight: 1.5, maxWidth: 960 }}>
            Real data. Real facts. Real connections — Investigations decoded so Huntsville can uncover what’s really happening.
          </div>
        </div>
      </section>

      <PayPanel elapsed={elapsed} onOpenModule={onOpenModule} />

      <section style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 10 }}>
          Active investigations
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {activeInvestigations.map((item) => <FeedRow key={item.title} item={item} onClick={() => onOpenModule(item.id)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 11, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 10 }}>
          Key numbers — Huntsville 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          {keyNumbers.map((item) => <KeyCard key={item.label} item={item} onClick={() => onOpenModule(item.target)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 10 }}>
          Investigations
        </div>
        {allGroups.map((group, index) => (
          <div key={group.group} style={{ marginBottom: index === allGroups.length - 1 ? 8 : 16, marginTop: group.group === BOTTOM_NAV.group ? 18 : 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 900, color: group.group === BOTTOM_NAV.group ? COLORS.gold : COLORS.textSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>{group.group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              {group.items.map((item) => <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />)}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 16, marginBottom: 4, overflow: "hidden" }}>
        <div style={{ background: COLORS.tickerBg, color: COLORS.gold, padding: "3px 0", overflow: "hidden", whiteSpace: "nowrap", borderTop: `1px solid rgba(198,170,87,0.25)`, borderBottom: `1px solid rgba(198,170,87,0.25)` }}>
          <div style={{ display: "inline-flex", gap: 42, minWidth: "200%", animation: "hciTicker 34s linear infinite", fontSize: 9, fontWeight: 700, letterSpacing: 0.7, textTransform: "uppercase" }}>
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
