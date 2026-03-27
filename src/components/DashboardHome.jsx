import React, { useEffect, useMemo, useState } from "react";
import { COLORS, SPACING } from "../config/theme";
import { NAV, BOTTOM_NAV } from "../config/nav";

const keyNumbers = [
  { label: "Data centers", value: "11" },
  { label: "Data centers under construction", value: "3" },
  { label: "TVA debt", value: "$20B+" },
  { label: "Huntsville Hospital revenue", value: "$2.4B" },
  { label: "Pretrial detention", value: "61%" },
  { label: "COVID funds used for prison construction", value: "$400M" },
];

const activeInvestigations = [
  { id: "utilities", title: "Utilities: Power, Water, & Gas", summary: "Power is generated here, risk is carried here, and bills are paid here — but control sits farther up the chain, where residents have far less say." },
  { id: "health", title: "Healthcare & Hospital System", summary: "This module tracks how monopoly power, premium hikes, executive compensation, understaffing, and shrinking competition all connect inside Huntsville’s healthcare system." },
  { id: "equity", title: "The Two Huntsvilles", summary: "Huntsville sells one growth story, but the money, resources, and outcomes show a city split by race, geography, and who leaders choose to prioritize." },
  { id: "money", title: "Follow the Money", summary: "Campaign money, contracts, commissions, grants, and quiet favors rarely stand alone. This follows where the money moves, what it buys, and who keeps cashing in while the public is left with the cost." },
];

function useElapsedSeconds() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - started) / 1000);
    }, 250);
    return () => window.clearInterval(timer);
  }, []);
  return elapsed;
}

function earnings(amountPerYear, elapsed) {
  return (amountPerYear / (365 * 24 * 3600)) * elapsed;
}

function PayPair({ title, ceoLabel, ceoAmount, workerLabel, workerAmount, elapsed, accent = COLORS.gold }) {
  const ratio = workerAmount > 0 ? `${Math.round(ceoAmount / workerAmount)}:1` : "—";
  return (
    <div style={{
      background: `linear-gradient(180deg, ${COLORS.panelAlt}, ${COLORS.panel})`,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18,
      padding: 18,
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    }}>
      <div style={{ fontSize: 11, color: accent, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
        <div>
          <div style={{ color: COLORS.textSoft, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1 }}>{ceoLabel}</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 900, fontSize: 28, color: COLORS.text, marginTop: 4 }}>${earnings(ceoAmount, elapsed).toFixed(2)}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>~${ceoAmount.toLocaleString()}/yr</div>
        </div>
        <div style={{ textAlign: "center", paddingBottom: 6 }}>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.1, textTransform: "uppercase" }}>CEO-to-worker ratio</div>
          <div style={{ fontSize: 22, color: COLORS.gold, fontWeight: 1000, marginTop: 4 }}>{ratio}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: COLORS.textSoft, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1 }}>{workerLabel}</div>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 900, fontSize: 28, color: COLORS.text, marginTop: 4 }}>${earnings(workerAmount, elapsed).toFixed(2)}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>~${workerAmount.toLocaleString()}/yr</div>
        </div>
      </div>
      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 10 }}>Since you opened this page</div>
    </div>
  );
}

function InvestigationCard({ title, summary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: `linear-gradient(180deg, ${COLORS.panelAlt}, ${COLORS.panel})`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 20,
        cursor: "pointer",
        display: "block",
        boxShadow: "0 16px 34px rgba(0,0,0,0.20)",
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 900, letterSpacing: 1.15, textTransform: "uppercase", marginBottom: 6 }}>Active investigation</div>
      <div style={{ fontSize: 22, fontWeight: 1000, color: COLORS.text, marginBottom: 8 }}>{title}</div>
      <div style={{ color: COLORS.textSoft, lineHeight: 1.6 }}>{summary}</div>
    </button>
  );
}

function ModuleCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: `linear-gradient(180deg, ${COLORS.panelAlt}, ${COLORS.panel})`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 16,
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

export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: "Action", items: [BOTTOM_NAV] }], []);

  return (
    <div>
      <section style={{ marginBottom: 28, background: `linear-gradient(180deg, ${COLORS.panelAlt}, ${COLORS.panel})`, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 24, boxShadow: "0 24px 50px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 780 }}>
            <div style={{ fontSize: 14, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>Real data. Real facts. Real connections.</div>
            <h1 style={{ fontSize: 56, lineHeight: 0.94, margin: "0 0 12px", color: COLORS.text, fontWeight: 1000 }}>Huntsville Civic Investigator</h1>
            <div style={{ color: COLORS.textSoft, fontSize: 18, lineHeight: 1.6, maxWidth: 760 }}>Investigations decoded so Huntsville can uncover what’s really happening.</div>
          </div>
          <div style={{ fontSize: 11, border: `1px solid ${COLORS.borderStrong}`, color: COLORS.gold, padding: "6px 10px", borderRadius: 999, fontWeight: 900 }}>v1.0</div>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Live pay clocks</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 14 }}>
          <PayPair title="Utilities pay gap" ceoLabel="HU CEO earnings" ceoAmount={430000} workerLabel="HU teller earnings" workerAmount={33000} elapsed={elapsed} />
          <PayPair title="Hospital pay gap" ceoLabel="HHHS CEO earnings" ceoAmount={3100000} workerLabel="CNA earnings" workerAmount={34000} elapsed={elapsed} accent={COLORS.red} />
          <PayPair title="Regional power pay gap" ceoLabel="TVA CEO earnings" ceoAmount={8100000} workerLabel="HU teller earnings" workerAmount={33000} elapsed={elapsed} accent={COLORS.orange} />
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Key numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {keyNumbers.map((item) => (
            <div key={item.label} style={{ background: `linear-gradient(180deg, ${COLORS.panelAlt}, ${COLORS.panel})`, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 1000, color: COLORS.text }}>{item.value}</div>
              <div style={{ marginTop: 6, color: COLORS.textSoft, lineHeight: 1.45 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Active investigations</div>
        <div style={{ display: "grid", gap: 12 }}>
          {activeInvestigations.map((card) => (
            <InvestigationCard key={card.id} title={card.title} summary={card.summary} onClick={() => onOpenModule(card.id)} />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 900, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>All modules</div>
        {allGroups.map((group) => (
          <div key={group.group} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.text, marginBottom: 10 }}>{group.group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {group.items.map((item) => (
                <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 30, marginBottom: 12 }}>
        <div style={{ background: `linear-gradient(90deg, ${COLORS.panelSoft}, ${COLORS.panelAlt})`, color: COLORS.textSoft, borderRadius: 999, padding: "10px 16px", fontSize: 12, lineHeight: 1.5, border: `1px solid ${COLORS.border}` }}>
          Some figures are estimates because the exact numbers are not publicly disclosed. If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.
        </div>
      </section>
    </div>
  );
}
