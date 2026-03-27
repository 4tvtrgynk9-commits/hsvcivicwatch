import React, { useEffect, useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";

const keyNumbers = [
  { label: "TVA Debt", value: "$20B+", sub: "Debt tied to the monopoly power system residents still fund.", color: COLORS.red, target: "utilities" },
  { label: "Hospital Buyout", value: "$450M", sub: "Crestwood acquisition accelerating regional healthcare monopoly concerns.", color: COLORS.lavender, target: "health" },
  { label: "Pretrial Detention", value: "61%", sub: "People jailed before conviction, punished by poverty first.", color: COLORS.green, target: "criminal_justice" },
  { label: "COVID Funds to Prisons", value: "$400M", sub: "Pandemic relief redirected into prison construction instead of community needs.", color: COLORS.gold, target: "criminal_justice" },
  { label: "Front Row Subsidy", value: "$16M", sub: "City investment helping underwrite a luxury downtown development.", color: COLORS.orange, target: "housing_crisis" },
  { label: "7% Grocery Tax", value: "7%", sub: "≈ $420/year (1 person) · ≈ $1,680/year (household of 4)", color: COLORS.blue, target: "taxation" },
];

const activeInvestigations = [
  { id: "utilities", tag: "Utilities", color: COLORS.blue, title: "The risk is in Alabama. The control isn’t." },
  { id: "health", tag: "Healthcare", color: COLORS.red, title: "Nonprofit on paper. Monopoly in practice." },
  { id: "equity", tag: "The Two Huntsvilles", color: COLORS.gold, title: "One growth story. Two very different cities." },
  { id: "money", tag: "Follow the Money", color: COLORS.lavender, title: "The same names keep showing up." },
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
  return (annual / (365 * 24 * 60 * 60)) * seconds;
}

function ratio(a, b) {
  if (!a || !b) return "—";
  return `${Math.round(a / b)}:1`;
}

function sectionTitle(label) {
  return (
    <div
      style={{
        fontSize: 11,
        color: COLORS.gold,
        fontWeight: 900,
        letterSpacing: 2.1,
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

function FeedRow({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "center",
        textAlign: "left",
        color: COLORS.text,
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1, color: item.color, minWidth: 92 }}>
        {item.tag}
      </span>
      <span style={{ flex: 1, fontSize: 15, lineHeight: 1.3 }}>{item.title}</span>
      <span style={{ color: COLORS.textSoft, fontWeight: 800, fontSize: 12 }}>View →</span>
    </button>
  );
}

function KeyCard({ item, onClick }) {
  const grocery = item.target === "taxation";
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 12,
        minHeight: grocery ? 120 : 104,
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", color: COLORS.textSoft }}>
        {item.label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 1000, color: item.color }}>{item.value}</div>
      {grocery ? (
        <div style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.35 }}>
          <div>≈ $420/year (1 person)</div>
          <div>≈ $1,680/year (household of 4)</div>
        </div>
      ) : (
        <div style={{ color: COLORS.text, fontSize: 13 }}>{item.sub}</div>
      )}
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
        borderTop: `4px solid ${item.featured ? COLORS.gold : COLORS.navy}`,
        borderRadius: 14,
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        minHeight: 80,
        color: COLORS.text,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 14, display: "flex", gap: 8 }}>
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </div>
    </button>
  );
}

function ClockCell({ label, valueAnnual, valueHourly, elapsed, color, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 10,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 10, color, fontWeight: 900, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 1000, marginBottom: 4 }}>
        ${earnings(valueAnnual, elapsed).toFixed(2)}
      </div>
      <div style={{ fontSize: 11.5, color: COLORS.textSoft }}>{valueHourly}</div>
    </button>
  );
}

function AcronymKey() {
  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 12px",
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        maxWidth: 520,
        fontSize: 12,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 900, color: COLORS.gold, marginBottom: 4 }}>
        Acronym Key
      </div>
      <div>TVA = Tennessee Valley Authority</div>
      <div>HHHS = Huntsville Hospital Health System</div>
      <div>HU = Huntsville Utilities</div>
    </div>
  );
}

function PayPanel({ elapsed, onOpenModule }) {
  return (
    <section style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 14, marginBottom: 18 }}>
      {sectionTitle("Live pay clocks — since you opened this page")}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        <ClockCell label="TVA CEO" valueAnnual={8100000} valueHourly="~$3,894/hr" elapsed={elapsed} color={COLORS.orange} subtitle="" onClick={() => onOpenModule("utilities")} />
        <ClockCell label="HU CEO" valueAnnual={430000} valueHourly="~$207/hr" elapsed={elapsed} color={COLORS.gold} subtitle="" onClick={() => onOpenModule("utilities")} />
        <ClockCell label="HU Teller" valueAnnual={33000} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.green} subtitle="" onClick={() => onOpenModule("utilities")} />
        <ClockCell label="HHHS CEO" valueAnnual={3100000} valueHourly="~$1,490/hr" elapsed={elapsed} color={COLORS.red} subtitle="" onClick={() => onOpenModule("health")} />
      </div>

      <AcronymKey />
    </section>
  );
}

export default function DashboardHome({ onOpenModule }) {
  const elapsed = useElapsedSeconds();
  const allGroups = useMemo(() => [...NAV, { group: BOTTOM_NAV.group, items: [BOTTOM_NAV] }], []);

  return (
    <div>
      <style>{`
        @media (max-width: 900px) {
          .hci-home-keys { grid-template-columns: repeat(2, 1fr) !important; }
          .hci-home-module-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 620px) {
          .hci-home-keys { grid-template-columns: repeat(2, 1fr) !important; }
          .hci-home-module-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <PayPanel elapsed={elapsed} onOpenModule={onOpenModule} />

      <section style={{ marginBottom: 20 }}>
        {sectionTitle("Active investigations")}
        <div style={{ display: "grid", gap: 10 }}>
          {activeInvestigations.map((item) => <FeedRow key={item.title} item={item} onClick={() => onOpenModule(item.id)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 20 }}>
        {sectionTitle("Key numbers — Huntsville 2026")}
        <div className="hci-home-keys" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {keyNumbers.map((item) => <KeyCard key={item.label} item={item} onClick={() => onOpenModule(item.target)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 22 }}>
        {sectionTitle("Investigations")}
        {allGroups.map((group) => (
          <div key={group.group} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: COLORS.gold, marginBottom: 6 }}>
              {group.group}
            </div>
            <div className="hci-home-module-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {group.items.map((item) => <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}