import React, { useEffect, useMemo, useState } from "react";
import { COLORS, SPACING } from "../config/theme";
import { NAV, BOTTOM_NAV } from "../config/nav";

const keyNumbers = [
  { label: "Data centers", value: "11" },
  { label: "Data centers under construction", value: "3" },
  { label: "TVA debt", value: "$20B+" },
  { label: "Huntsville Hospital revenue", value: "$2.4B" },
  { label: "Pretrial detention", value: "61%" },
  { label: "COVID funds for prison construction", value: "$400M" },
];

const activeInvestigations = [
  { id: "utilities", title: "Utilities: Power, Water, & Gas", summary: "Power is generated here, risk is carried here, and bills are paid here — but control sits farther up the chain." },
  { id: "health", title: "Healthcare & Hospital System", summary: "Monopoly power, premium hikes, executive pay, understaffing, and shrinking competition all connect here." },
  { id: "equity", title: "The Two Huntsvilles", summary: "One city, two realities — split by race, geography, and who leaders choose to prioritize." },
  { id: "money", title: "Follow the Money", summary: "Campaign money, contracts, commissions, grants, and quiet favors rarely stand alone." },
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

function ClockCard({ label, sublabel, amountPerYear, elapsed, tone = COLORS.navy }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: tone, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 28, fontWeight: 900, color: tone }}>
        ${earnings(amountPerYear, elapsed).toFixed(2)}
      </div>
      <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>{sublabel}</div>
      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>Since you opened this page</div>
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
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 18,
        cursor: "pointer",
        display: "block",
      }}
    >
      <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 6 }}>Active investigation</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text, marginBottom: 8 }}>{title}</div>
      <div style={{ color: COLORS.muted, lineHeight: 1.6 }}>{summary}</div>
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
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        minHeight: 96,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.text, lineHeight: 1.3 }}>{item.label}</div>
    </button>
  );
}

export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: "Action", items: [BOTTOM_NAV] }], []);

  return (
    <div>
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.red, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 8 }}>Huntsville Civic Watch</div>
        <h1 style={{ fontSize: 38, lineHeight: 1.05, margin: "0 0 12px", color: COLORS.text }}>Real data. Real facts. Real connections — Investigations decoded so Huntsville can uncover what’s really happening.</h1>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Live pay clocks</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <ClockCard label="TVA CEO" sublabel="~$8.1M/yr" amountPerYear={8100000} elapsed={elapsed} tone={"#7f1d1d"} />
          <ClockCard label="Huntsville Utilities CEO" sublabel="Est. $430k/yr" amountPerYear={430000} elapsed={elapsed} tone={COLORS.navy} />
          <ClockCard label="Huntsville Utilities average worker" sublabel="~$52k/yr" amountPerYear={52000} elapsed={elapsed} tone={COLORS.green} />
          <ClockCard label="Huntsville Hospital CEO" sublabel="~$3.1M/yr" amountPerYear={3100000} elapsed={elapsed} tone={COLORS.red} />
          <ClockCard label="Huntsville Hospital average worker" sublabel="Est. $62.4k/yr" amountPerYear={62400} elapsed={elapsed} tone={COLORS.gold} />
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Key numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {keyNumbers.map((item) => (
            <div key={item.label} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.navy }}>{item.value}</div>
              <div style={{ marginTop: 6, color: COLORS.muted, lineHeight: 1.5 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>Active investigations</div>
        <div style={{ display: "grid", gap: 12 }}>
          {activeInvestigations.map((card) => (
            <InvestigationCard key={card.id} title={card.title} summary={card.summary} onClick={() => onOpenModule(card.id)} />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>All modules</div>
        {allGroups.map((group) => (
          <div key={group.group} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.navyDark, marginBottom: 10 }}>{group.group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {group.items.map((item) => (
                <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 30, marginBottom: 12 }}>
        <div style={{ background: COLORS.navyDark, color: "#fff", borderRadius: 999, padding: "10px 16px", fontSize: 12, lineHeight: 1.5 }}>
          Some figures are estimates because the exact numbers are not publicly disclosed. If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.
        </div>
      </section>
    </div>
  );
}
