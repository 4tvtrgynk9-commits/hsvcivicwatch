import React, { useEffect, useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

const keyNumbers = [
  { label: "TVA Debt", value: "$20B+", sub: "Debt tied to the monopoly power system residents still fund.", color: COLORS.red },
  { label: "Data Centers", value: "11", sub: "Major data centers tied to local utility and infrastructure strain.", color: COLORS.navy },
  { label: "Under Construction", value: "3", sub: "Data centers still being built while residents absorb system pressure.", color: COLORS.orange },
  { label: "Hospital Buyout", value: "$450M", sub: "Crestwood acquisition accelerating regional healthcare monopoly concerns.", color: COLORS.purple },
  { label: "Pretrial Detention", value: "61%", sub: "People jailed before conviction, punished by poverty first.", color: COLORS.green },
  { label: "COVID Funds to Prisons", value: "$400M", sub: "Pandemic relief redirected into prison construction instead of community needs.", color: COLORS.gold },
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
        padding: "13px 16px",
        cursor: "pointer",
        display: "flex",
        gap: 14,
        alignItems: "center",
        textAlign: "left",
        color: COLORS.text,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1, color: item.color, minWidth: 84 }}>{item.tag}</span>
      <span style={{ flex: 1, fontSize: 15, lineHeight: 1.35 }}>{item.title}</span>
      <span style={{ color: COLORS.textSoft, fontWeight: 800, fontSize: 13 }}>View →</span>
    </button>
  );
}

function KeyCard({ item }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, minHeight: 132 }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: COLORS.textSoft, marginBottom: 8 }}>{item.label}</div>
      <div style={{ fontSize: 28, fontWeight: 1000, color: item.color, marginBottom: 6 }}>{item.value}</div>
      <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.45 }}>{item.sub}</div>
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
        padding: 16,
        textAlign: "left",
        cursor: "pointer",
        minHeight: 86,
        color: COLORS.text,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </div>
    </button>
  );
}

function ClockCell({ label, valueAnnual, valueHourly, elapsed, color, subtitle }) {
  return (
    <div style={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 10, color, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 24, fontWeight: 1000, color: COLORS.text, marginBottom: 6 }}>${earnings(valueAnnual, elapsed).toFixed(2)}</div>
      <div style={{ color: COLORS.textSoft, fontSize: 12, lineHeight: 1.35 }}>{valueHourly} · {subtitle}</div>
    </div>
  );
}

function PayPanel({ elapsed }) {
  const huTeller = 33000;
  const huCeo = 430000;
  const hhCna = 34000;
  const hhCeo = 3100000;
  const tvaCeo = 8100000;

  return (
    <section style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18, marginBottom: 24 }}>
      <div style={{ fontSize: 12, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 12 }}>
        Live pay clocks — since you opened this page
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <div style={{ background: "rgba(25,49,80,0.04)", border: `1px solid rgba(25,49,80,0.10)`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.navy, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>Utilities pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <ClockCell label="TVA CEO earnings" valueAnnual={tvaCeo} valueHourly="~$3,894/hr" elapsed={elapsed} color={COLORS.orange} subtitle="$8.1M/yr" />
            <ClockCell label="HU CEO earnings" valueAnnual={huCeo} valueHourly="~$207/hr" elapsed={elapsed} color={COLORS.gold} subtitle="Est. $430k/yr" />
            <ClockCell label="HU teller earnings" valueAnnual={huTeller} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.green} subtitle="Est. $33k/yr" />
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 6, color: COLORS.text, fontSize: 13 }}>
            <div><strong>HU CEO-to-teller ratio:</strong> {ratio(huCeo, huTeller)}</div>
            <div><strong>TVA CEO-to-teller ratio:</strong> {ratio(tvaCeo, huTeller)}</div>
          </div>
        </div>

        <div style={{ background: "rgba(123,76,194,0.05)", border: `1px solid rgba(123,76,194,0.12)`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>Healthcare pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <ClockCell label="HHHS CEO earnings" valueAnnual={hhCeo} valueHourly="~$1,490/hr" elapsed={elapsed} color={COLORS.red} subtitle="$3.1M/yr" />
            <ClockCell label="CNA earnings" valueAnnual={hhCna} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.navy} subtitle="Est. $34k/yr" />
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 6, color: COLORS.text, fontSize: 13 }}>
            <div><strong>HHHS CEO-to-CNA ratio:</strong> {ratio(hhCeo, hhCna)}</div>
            <div style={{ color: COLORS.textSoft }}>Lowest-paid everyday worker role shown for comparison.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: "Action", items: [BOTTOM_NAV] }], []);
  return (
    <div>
      <style>{`
        @keyframes hciTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <section style={{ marginBottom: 22 }}>
        <div style={{ maxWidth: 980 }}>
          <div style={{ fontSize: 52, lineHeight: 0.94, margin: "0 0 8px", color: COLORS.text, fontWeight: 1000, letterSpacing: -1.0 }}>Huntsville Civic Investigator</div>
          <div style={{ color: COLORS.textSoft, fontSize: 18, lineHeight: 1.55, maxWidth: 980 }}>
            Real data. Real facts. Real connections — Investigations decoded so Huntsville can uncover what’s really happening.
          </div>
        </div>
      </section>

      <PayPanel elapsed={elapsed} />

      <section style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 12, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.4, textTransform: "uppercase", marginBottom: 12 }}>
          Active investigations
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {activeInvestigations.map((item) => <FeedRow key={item.title} item={item} onClick={() => onOpenModule(item.id)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.4, textTransform: "uppercase", marginBottom: 12 }}>
          Key numbers — Huntsville 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {keyNumbers.map((item) => <KeyCard key={item.label} item={item} />)}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: COLORS.textSoft, fontWeight: 900, letterSpacing: 2.4, textTransform: "uppercase", marginBottom: 12 }}>
          Investigations
        </div>
        {allGroups.map((group) => (
          <div key={group.group} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.textSoft, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.6 }}>{group.group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {group.items.map((item) => <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />)}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24, marginBottom: 4, overflow: "hidden" }}>
        <div style={{ background: COLORS.tickerBg, color: COLORS.gold, padding: "8px 0", overflow: "hidden", whiteSpace: "nowrap", borderTop: `1px solid rgba(198,170,87,0.35)`, borderBottom: `1px solid rgba(198,170,87,0.35)` }}>
          <div style={{ display: "inline-flex", gap: 56, minWidth: "200%", animation: "hciTicker 30s linear infinite", fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase" }}>
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
