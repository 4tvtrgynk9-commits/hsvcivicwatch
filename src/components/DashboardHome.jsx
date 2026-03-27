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
        marginBottom: 10,
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
        padding: "13px 15px",
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
      <span style={{ flex: 1, fontSize: 15.5, lineHeight: 1.32 }}>{item.title}</span>
      <span style={{ color: COLORS.textSoft, fontWeight: 800, fontSize: 12.5 }}>View →</span>
    </button>
  );
}

function KeyCard({ item, onClick }) {
  const grocery = item.target === "taxation";
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 14,
        minHeight: grocery ? 136 : 118,
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
      <div style={{ fontSize: 26, fontWeight: 1000, color: item.color }}>{item.value}</div>
      {grocery ? (
        <div style={{ color: COLORS.text, fontSize: 13.5, lineHeight: 1.38, maxWidth: 188 }}>
          <div>≈ $420/year (1 person)</div>
          <div>≈ $1,680/year (household of 4)</div>
        </div>
      ) : (
        <div style={{ color: COLORS.text, fontSize: 13.5, lineHeight: 1.35, maxWidth: 188 }}>{item.sub}</div>
      )}
    </button>
  );
}

function ModuleCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderTop: `4px solid ${item.featured ? COLORS.gold : COLORS.navy}`,
        borderRadius: 14,
        padding: 15,
        textAlign: "left",
        cursor: "pointer",
        minHeight: 88,
        color: COLORS.text,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.26, display: "flex", gap: 8, alignItems: "flex-start" }}>
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
        padding: 12,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 10, color, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 21, fontWeight: 1000, color: COLORS.text, marginBottom: 6 }}>
        ${earnings(valueAnnual, elapsed).toFixed(2)}
      </div>
      <div style={{ color: COLORS.textSoft, fontSize: 12, lineHeight: 1.32 }}>{valueHourly} · {subtitle}</div>
    </button>
  );
}

function AcronymKey() {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 12px",
        background: COLORS.panelAlt,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        fontSize: 12.5,
        lineHeight: 1.5,
        color: COLORS.text,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", color: COLORS.gold, marginBottom: 4 }}>
        Acronym Key
      </div>
      <div>TVA = Tennessee Valley Authority</div>
      <div>HHHS = Huntsville Hospital Health System</div>
      <div>HU = Huntsville Utilities</div>
    </div>
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
      {sectionTitle("Live pay clocks — since you opened this page")}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        <div style={{ background: COLORS.blueSoft, border: "1px solid rgba(47,93,138,0.12)", borderRadius: 14, padding: 13 }}>
          <div style={{ fontSize: 11, color: COLORS.blue, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 9 }}>Utilities pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            <ClockCell label="TVA CEO earnings" valueAnnual={tvaCeo} valueHourly="~$3,894/hr" elapsed={elapsed} color={COLORS.orange} subtitle="$8.1M/yr" onClick={() => onOpenModule("utilities")} />
            <ClockCell label="HU CEO earnings" valueAnnual={huCeo} valueHourly="~$207/hr" elapsed={elapsed} color={COLORS.gold} subtitle="Est. $430k/yr" onClick={() => onOpenModule("utilities")} />
            <div style={{ gridColumn: "1 / span 2" }}>
              <ClockCell label="HU teller earnings" valueAnnual={huTeller} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.green} subtitle="Est. $33k/yr" onClick={() => onOpenModule("utilities")} />
            </div>
          </div>
          <button onClick={() => onOpenModule("utilities")} style={{ marginTop: 10, display: "grid", gap: 5, color: COLORS.text, fontSize: 12.5, background: "transparent", border: "none", padding: 0, width: "100%", textAlign: "center", cursor: "pointer" }}>
            <div><strong>HU CEO-to-teller ratio:</strong> {ratio(huCeo, huTeller)}</div>
            <div><strong>TVA CEO-to-teller ratio:</strong> {ratio(tvaCeo, huTeller)}</div>
          </button>
        </div>

        <div style={{ background: COLORS.lavenderSoft, border: "1px solid rgba(122,79,163,0.12)", borderRadius: 14, padding: 13 }}>
          <div style={{ fontSize: 11, color: COLORS.lavender, fontWeight: 900, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 9 }}>Healthcare pay gap</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 9 }}>
            <ClockCell label="HHHS CEO earnings" valueAnnual={hhCeo} valueHourly="~$1,490/hr" elapsed={elapsed} color={COLORS.red} subtitle="$3.1M/yr" onClick={() => onOpenModule("health")} />
            <ClockCell label="CNA earnings" valueAnnual={hhCna} valueHourly="~$16/hr" elapsed={elapsed} color={COLORS.blue} subtitle="Est. $34k/yr" onClick={() => onOpenModule("health")} />
          </div>
          <button onClick={() => onOpenModule("health")} style={{ marginTop: 10, display: "grid", gap: 5, color: COLORS.text, fontSize: 12.5, background: "transparent", border: "none", padding: 0, width: "100%", textAlign: "center", cursor: "pointer" }}>
            <div><strong>HHHS CEO-to-CNA ratio:</strong> {ratio(hhCeo, hhCna)}</div>
            <div style={{ color: COLORS.textSoft, fontSize: 11.5 }}>Lowest-paid everyday worker role shown for comparison.</div>
          </button>
        </div>
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
        @keyframes hciTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (max-width: 900px) {
          .hci-home-title { font-size: 40px !important; }
          .hci-home-subtitle { font-size: 17px !important; }
          .hci-home-keys { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .hci-home-modules { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 620px) {
          .hci-home-title { font-size: 33px !important; }
          .hci-home-subtitle { font-size: 16px !important; line-height: 1.45 !important; }
          .hci-home-keys { grid-template-columns: 1fr !important; }
          .hci-home-module-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section style={{ marginBottom: 18 }}>
        <div style={{ maxWidth: 980 }}>
          <div className="hci-home-title" style={{ fontSize: 52, lineHeight: 0.94, margin: "0 0 10px", color: COLORS.text, fontWeight: 1000, letterSpacing: -1 }}>
            Huntsville Civic Investigator
          </div>
          <div className="hci-home-subtitle" style={{ color: COLORS.navy, fontSize: 20, fontWeight: 700, lineHeight: 1.5, maxWidth: 960 }}>
            Real data. Real facts. Real connections — investigations decoded so Huntsville can uncover what’s really happening.
          </div>
        </div>
      </section>

      <PayPanel elapsed={elapsed} onOpenModule={onOpenModule} />

      <section style={{ marginBottom: 24 }}>
        {sectionTitle("Active investigations")}
        <div style={{ display: "grid", gap: 10 }}>
          {activeInvestigations.map((item) => <FeedRow key={item.title} item={item} onClick={() => onOpenModule(item.id)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 26 }}>
        {sectionTitle("Key numbers — Huntsville 2026")}
        <div className="hci-home-keys" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          {keyNumbers.map((item) => <KeyCard key={item.label} item={item} onClick={() => onOpenModule(item.target)} />)}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        {sectionTitle("Investigations")}
        {allGroups.map((group, index) => (
          <div key={group.group} style={{ marginBottom: index === allGroups.length - 1 ? 8 : 16, marginTop: group.group === BOTTOM_NAV.group ? 18 : 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 900, color: COLORS.gold, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>
              {group.group}
            </div>
            <div className="hci-home-module-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              {group.items.map((item) => <ModuleCard key={item.id} item={item} onClick={() => onOpenModule(item.id)} />)}
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 16, marginBottom: 4, overflow: "hidden" }}>
        <div style={{ background: COLORS.tickerBg, color: COLORS.gold, padding: "3px 0", overflow: "hidden", whiteSpace: "nowrap", borderTop: "1px solid rgba(198,163,77,0.25)", borderBottom: "1px solid rgba(198,163,77,0.25)" }}>
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
