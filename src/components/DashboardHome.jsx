import React, { useEffect, useMemo, useState } from "react";
import { NAV, BOTTOM_NAV } from "../config/nav";
import { COLORS } from "../config/theme";
import IssueCard from "./IssueCard";
import useHomepageData from "../hooks/useHomepageData";

function rotateWindow(items, startIndex, count) {
  if (!items.length) return [];
  const output = [];
  for (let i = 0; i < Math.min(count, items.length); i += 1) {
    output.push(items[(startIndex + i) % items.length]);
  }
  return output;
}

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
        fontSize: 15,
        color: COLORS.blue,
        fontWeight: 900,
        letterSpacing: 1.8,
        textTransform: "uppercase",
        marginBottom: 10,
        lineHeight: 1.15,
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
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderTop: `4px solid ${item.color || COLORS.gold}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        display: "block",
        textAlign: "left",
        color: COLORS.text,
      }}
      title={item.title}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: 1.4,
          color: item.color || COLORS.gold,
          marginBottom: 8,
        }}
      >
        {item.tag}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          lineHeight: 1.28,
          color: COLORS.text,
          marginBottom: item.summary ? 8 : 10,
        }}
      >
        {item.title}
      </div>

      {item.summary ? (
        <div
          style={{
            color: COLORS.textSoft,
            fontSize: 13.5,
            lineHeight: 1.42,
            marginBottom: 10,
          }}
        >
          {item.summary}
        </div>
      ) : null}

      <div style={{ color: COLORS.textSoft, fontWeight: 800, fontSize: 12.5 }}>
        Open investigation →
      </div>
    </button>
  );
}

function KeyCard({ item, onClick }) {
  const grocery = item.target === "taxation";

  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 14,
        padding: 14,
        minHeight: 120,
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: COLORS.textSoft,
        }}
      >
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
  const isBlueprint = item.id === "proposals";

  return (
    <button
      onClick={onClick}
      style={{
        background: isBlueprint ? COLORS.greenSoft : COLORS.card,
        border: `2px solid ${COLORS.navy}`,
        borderRadius: 14,
        padding: 14,
        textAlign: "center",
        cursor: "pointer",
        minHeight: 96,
        color: COLORS.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 14.5,
          lineHeight: 1.26,
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          gap: 8,
          alignItems: "center",
          width: "100%",
        }}
      >
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </div>
    </button>
  );
}

function ClockCell({ label, valueAnnual, valueHourly, elapsed, color, subtitle, onClick, mobile = false }) {
  return (
    <button
      onClick={onClick}
      className={mobile ? "hci-clock-cell-mobile" : ""}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 14,
        padding: mobile ? 10 : 12,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: mobile ? 11 : 12,
          color,
          fontWeight: 900,
          letterSpacing: mobile ? 1.2 : 1.4,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: mobile ? 18 : 21,
          fontWeight: 1000,
          color: COLORS.text,
          marginBottom: 6,
        }}
      >
        ${earnings(valueAnnual, elapsed).toFixed(2)}
      </div>

      <div
        style={{
          color: COLORS.textSoft,
          fontSize: mobile ? 11.5 : 12.5,
          lineHeight: 1.3,
        }}
      >
        {valueHourly} · {subtitle}
      </div>
    </button>
  );
}

function AcronymKey() {
  return (
    <div
      className="hci-acronym-box"
      style={{
        marginTop: 10,
        padding: "10px 12px",
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 12,
        fontSize: 12.5,
        lineHeight: 1.45,
        color: COLORS.text,
        width: "100%",
        maxWidth: 470,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: 1.3,
          textTransform: "uppercase",
          color: COLORS.gold,
          marginBottom: 4,
        }}
      >
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
    <section
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: 14,
        marginBottom: 18,
      }}
    >
      {sectionTitle("Live pay clocks — since you opened this page")}

      <div className="hci-pay-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <div
          className="hci-pay-panel"
          style={{
            background: COLORS.blueSoft,
            border: "1px solid rgba(47,93,138,0.18)",
            borderRadius: 16,
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: COLORS.blue,
              fontWeight: 900,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              marginBottom: 9,
            }}
          >
            Utilities pay gap
          </div>

          <div className="hci-clock-grid-utilities" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            <ClockCell
              label="TVA CEO earnings"
              valueAnnual={tvaCeo}
              valueHourly="~$3,894/hr"
              elapsed={elapsed}
              color={COLORS.orange}
              subtitle="$8.1M/yr"
              onClick={() => onOpenModule("utilities")}
              mobile={false}
            />
            <ClockCell
              label="HU CEO earnings"
              valueAnnual={huCeo}
              valueHourly="~$207/hr"
              elapsed={elapsed}
              color={COLORS.gold}
              subtitle="Est. $430k/yr"
              onClick={() => onOpenModule("utilities")}
              mobile={false}
            />
            <div className="hci-clock-wide" style={{ gridColumn: "1 / span 2", maxWidth: 260 }}>
              <ClockCell
                label="HU teller earnings"
                valueAnnual={huTeller}
                valueHourly="~$16/hr"
                elapsed={elapsed}
                color={COLORS.green}
                subtitle="Est. $33k/yr"
                onClick={() => onOpenModule("utilities")}
                mobile={false}
              />
            </div>
          </div>

          <button
            onClick={() => onOpenModule("utilities")}
            style={{
              marginTop: 8,
              display: "grid",
              gap: 4,
              color: COLORS.text,
              fontSize: 12,
              background: "transparent",
              border: "none",
              padding: 0,
              width: "100%",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div><strong>HU CEO-to-teller ratio:</strong> {ratio(huCeo, huTeller)}</div>
            <div><strong>TVA CEO-to-teller ratio:</strong> {ratio(tvaCeo, huTeller)}</div>
          </button>
        </div>

        <div
          className="hci-pay-panel"
          style={{
            background: COLORS.lavenderSoft,
            border: "1px solid rgba(122,79,163,0.18)",
            borderRadius: 16,
            padding: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: COLORS.lavender,
              fontWeight: 900,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              marginBottom: 9,
            }}
          >
            Healthcare pay gap
          </div>

          <div className="hci-clock-grid-health" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 9 }}>
            <ClockCell
              label="HHHS CEO earnings"
              valueAnnual={hhCeo}
              valueHourly="~$1,490/hr"
              elapsed={elapsed}
              color={COLORS.red}
              subtitle="$3.1M/yr"
              onClick={() => onOpenModule("health")}
              mobile={false}
            />
            <ClockCell
              label="CNA earnings"
              valueAnnual={hhCna}
              valueHourly="~$16/hr"
              elapsed={elapsed}
              color={COLORS.blue}
              subtitle="Est. $34k/yr"
              onClick={() => onOpenModule("health")}
              mobile={false}
            />
          </div>

          <button
            onClick={() => onOpenModule("health")}
            style={{
              marginTop: 8,
              display: "grid",
              gap: 4,
              color: COLORS.text,
              fontSize: 12,
              background: "transparent",
              border: "none",
              padding: 0,
              width: "100%",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div><strong>HHHS CEO-to-CNA ratio:</strong> {ratio(hhCeo, hhCna)}</div>
            <div style={{ color: COLORS.textSoft, fontSize: 11.5 }}>
              Lowest-paid everyday worker role shown for comparison.
            </div>
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
  const { cards, statBlocks, loading, error } = useHomepageData();
  const [investigationStart, setInvestigationStart] = useState(0);
  const [keyNumberStart, setKeyNumberStart] = useState(0);

  useEffect(() => {
    if (cards.length <= 12) return;
    const id = setInterval(() => {
      setInvestigationStart(prev => (prev + 1) % cards.length);
    }, 9000);
    return () => clearInterval(id);
  }, [cards.length]);

  useEffect(() => {
    if (statBlocks.length <= 6) return;
    const id = setInterval(() => {
      setKeyNumberStart(prev => (prev + 1) % statBlocks.length);
    }, 8000);
    return () => clearInterval(id);
  }, [statBlocks.length]);

  const visibleInvestigations = rotateWindow(cards, investigationStart, 12);
  const visibleKeyNumbers = rotateWindow(statBlocks, keyNumberStart, 6);

  const openSpecificInvestigation = (item) => {
    try {
      localStorage.setItem("hsv_last_card", JSON.stringify({
        id: item.ref_number || item.id,
        module: item.module || item.id,
        tab: item.tab || "overview",
        ts: Date.now()
      }));
    } catch (e) {}
    onOpenModule(item.module || item.id);
  };

  const getStatData = (block) => {
    const data = block?.data && typeof block.data === "object" ? block.data : block || {};
    return {
      label: data.label || block?.label || block?.title || "",
      value: data.value || block?.value || "",
      sub: data.context || block?.context || "",
      target: block?.module || data.module || "",
      color: COLORS.gold,
    };
  };

  return (
    <div>
      <style>{`
        @keyframes hciTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 1180px) {
          .hci-home-wrap {
            max-width: 100% !important;
          }

          .hci-home-title {
            font-size: 42px !important;
          }

          .hci-home-subtitle {
            font-size: 18px !important;
          }

          .hci-home-module-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 620px) {
          .hci-home-title {
            font-size: 34px !important;
            line-height: 0.98 !important;
          }

          .hci-home-subtitle {
            font-size: 16px !important;
            line-height: 1.42 !important;
          }

          .hci-pay-panel {
            padding: 10px !important;
          }

          .hci-home-module-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .hci-acronym-box {
            font-size: 11.5px !important;
            line-height: 1.38 !important;
          }
        }
      `}</style>

      <div className="hci-home-wrap">
        <section style={{ marginBottom: 14 }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div
              className="hci-home-title"
              style={{
                fontSize: 52,
                lineHeight: 0.94,
                margin: "0 0 10px",
                color: COLORS.text,
                fontWeight: 1000,
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              Huntsville Civic Investigator
            </div>

            <div
              className="hci-home-subtitle"
              style={{
                color: COLORS.navy,
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.5,
                maxWidth: 960,
                textAlign: "center",
              }}
            >
              Real data. Real facts. Real connections — Investigations decoded so Huntsville can uncover what's really happening.
            </div>
          </div>
        </section>

        <PayPanel elapsed={elapsed} onOpenModule={onOpenModule} />

        {loading ? (
          <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: "18px 0" }}>Loading...</div>
        ) : null}

        {error ? (
          <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 14 }}>{error.message || String(error)}</div>
        ) : null}

        {visibleInvestigations.length > 0 ? (
          <section style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 15,
                  color: COLORS.blue,
                  fontWeight: 900,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  lineHeight: 1.15,
                }}
              >
                Active investigations
              </div>
              {cards.length > 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: COLORS.red,
                    color: "#fff",
                    letterSpacing: 0.3,
                    marginLeft: 10,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {cards.length} live
                </div>
              ) : null}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {visibleInvestigations.map((item) => (
                <div key={item.ref_number || item.id || item.title} onClick={() => openSpecificInvestigation(item)}>
                  <IssueCard issue={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {visibleKeyNumbers.length > 0 ? (
          <section style={{ marginBottom: 18 }}>
            {sectionTitle("Key numbers — Huntsville 2026")}
            <div
              className="hci-home-keys"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {visibleKeyNumbers.map((block) => {
                const item = getStatData(block);
                return <KeyCard key={block.ref_number || block.id || item.label} item={item} onClick={() => onOpenModule(item.target)} />;
              })}
            </div>
          </section>
        ) : null}

        <section style={{ marginBottom: 16, marginTop: 40 }}>
          {sectionTitle("Investigations")}
          {allGroups.map((group, index) => (
            <div
              key={group.group}
              style={{
                marginBottom: index === allGroups.length - 1 ? 8 : 15,
                marginTop: group.group === BOTTOM_NAV.group ? 16 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: COLORS.blue,
                  marginBottom: group.group === "Daily Life: Costs & Burdens" ? 20 : 8,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  lineHeight: 1.15,
                }}
              >
                {group.group}
              </div>

              <div
                className="hci-home-module-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {group.items.map((item) => (
                  <ModuleCard
                    key={item.id}
                    item={item}
                    onClick={() => onOpenModule(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 12,
            marginBottom: 4,
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: COLORS.tickerBg,
              color: COLORS.gold,
              padding: "4px 0",
              overflow: "hidden",
              whiteSpace: "nowrap",
              borderTop: "1px solid rgba(198,163,77,0.25)",
              borderBottom: "1px solid rgba(198,163,77,0.25)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                gap: 42,
                minWidth: "200%",
                animation: "hciTicker 34s linear infinite",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: 0.7,
                textTransform: "uppercase",
              }}
            >
              <span>Some figures are estimates because the exact numbers are not publicly disclosed.</span>
              <span>If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.</span>
              <span>Some figures are estimates because the exact numbers are not publicly disclosed.</span>
              <span>If institutions want more precise figures used, they can release the records instead of hiding them behind vague reporting.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
