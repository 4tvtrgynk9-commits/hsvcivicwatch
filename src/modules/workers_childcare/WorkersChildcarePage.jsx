import React, { useEffect, useState } from "react";
import { COLORS } from "../../config/theme";
import PageHeader from "../../components/PageHeader";
import VisualSwitcher from "../../components/VisualSwitcher";
import TabBar from "../../components/TabBar";
import IssueCard from "../../components/IssueCard";
import ModuleEmptyState from "../../components/ModuleEmptyState";
import InvestigativeTrail from "../../components/InvestigativeTrail";
import data from "././workers_childcare.data";
import useSupabaseModule from "../../lib/useSupabaseModule";
import useRotatingStats from "../../lib/useRotatingStats";
import useModuleStatBlocks from "../../hooks/useModuleStatBlocks";

const PAY_CLOCK_EMPLOYERS = [
  {
    employer: "Redstone Arsenal / U.S. Army",
    executiveTitle: "Garrison Commander",
    executiveAnnual: 190000,
    executiveSource: "Public record",
    workerTitle: "GS-3 base pay",
    workerHourly: 15.79,
    workerSource: "Public record",
    context: "Federal pay tables show the gap between senior command compensation and entry-grade civilian base pay.",
  },
  {
    employer: "Boeing Huntsville",
    executiveTitle: "President",
    executiveAnnual: 450000,
    executiveSource: "Est.",
    workerTitle: "Assembly worker",
    workerHourly: 28,
    workerSource: "Est.",
    context: "Local executive compensation is not usually itemized publicly, so this uses conservative aerospace management estimates.",
  },
  {
    employer: "Lockheed Martin Huntsville",
    executiveTitle: "Site VP",
    executiveAnnual: 375000,
    executiveSource: "Est.",
    workerTitle: "Entry engineer / hourly contractor",
    workerHourly: 31,
    workerSource: "Est.",
    context: "The worker figure blends entry engineering and hourly contractor estimates to avoid overstating the gap.",
  },
  {
    employer: "Huntsville Hospital Health System / HHHS",
    executiveTitle: "CEO",
    executiveAnnual: 3100000,
    executiveSource: "Public record",
    workerTitle: "CNA",
    workerHourly: 16,
    workerSource: "Est.",
    context: "The nonprofit hospital pay gap compares top executive compensation with a low-paid direct care role.",
  },
  {
    employer: "Huntsville Utilities / HU",
    executiveTitle: "CEO",
    executiveAnnual: 430000,
    executiveSource: "Public record",
    workerTitle: "Teller",
    workerHourly: 16,
    workerSource: "Est.",
    context: "Public utility leadership pay is shown against an everyday customer-facing utility role.",
  },
  {
    employer: "Toyota Motor Manufacturing Alabama / TMMA",
    executiveTitle: "Plant Manager",
    executiveAnnual: 260000,
    executiveSource: "Est.",
    workerTitle: "Line worker",
    workerHourly: 31,
    workerSource: "Est.",
    context: "Automotive plant manager pay is estimated against production-line wages in North Alabama manufacturing.",
  },
  {
    employer: "Mazda Toyota Manufacturing / MTM",
    executiveTitle: "Plant Manager",
    executiveAnnual: 250000,
    executiveSource: "Est.",
    workerTitle: "Line worker",
    workerHourly: 28,
    workerSource: "Est.",
    context: "Joint-venture plant leadership estimates are compared with posted and reported production wage ranges.",
  },
  {
    employer: "City of Huntsville",
    executiveTitle: "Mayor Tommy Battle",
    executiveAnnual: 181000,
    executiveSource: "Public record",
    workerTitle: "City employee median",
    workerHourly: 26,
    workerSource: "Public record",
    context: "Municipal pay is compared against an estimated hourly equivalent for median city employee compensation.",
  },
];

function annualFromHourly(hourly) {
  return hourly * 52 * 40;
}

function earningsPerSecond(annual, elapsedMs) {
  return (annual / (52 * 40 * 3600)) * (elapsedMs / 1000);
}

function money(value) {
  return "$" + Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function cents(value) {
  return "$" + Number(value || 0).toFixed(2);
}

function ratio(item) {
  return Math.round(item.executiveAnnual / annualFromHourly(item.workerHourly));
}

function useIsMobileWidth() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 760;
  });

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 760);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  return isMobile;
}

function PayClockTicker({ elapsedMs, isMobile }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 16, color: COLORS.blue, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14 }}>
        Live Pay Clock Ticker
      </div>
      <div
        className="hsv-pay-clock-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14,
        }}
      >
        {PAY_CLOCK_EMPLOYERS.map((item) => {
          const workerAnnual = annualFromHourly(item.workerHourly);
          return (
            <div key={item.employer} style={{ background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 16 }}>
              <div style={{ color: COLORS.navy, fontSize: 14, fontWeight: 1000, lineHeight: 1.25, marginBottom: 12 }}>{item.employer}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <div style={{ background: COLORS.redSoft, borderRadius: 10, padding: 12 }}>
                  <div style={{ color: COLORS.red, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 6 }}>{item.executiveTitle}</div>
                  <div style={{ color: COLORS.text, fontSize: 24, fontWeight: 1000, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {cents(earningsPerSecond(item.executiveAnnual, elapsedMs))}
                  </div>
                </div>
                <div style={{ background: COLORS.greenSoft, borderRadius: 10, padding: 12 }}>
                  <div style={{ color: COLORS.green, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 6 }}>{item.workerTitle}</div>
                  <div style={{ color: COLORS.text, fontSize: 24, fontWeight: 1000, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    {cents(earningsPerSecond(workerAnnual, elapsedMs))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, color: COLORS.text, fontSize: 13, fontWeight: 900 }}>
                Executive-to-worker ratio: {ratio(item)}:1
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, padding: "12px 14px", background: COLORS.panel, borderRadius: 12, color: COLORS.text, fontSize: 13, lineHeight: 1.6 }}>
        <strong style={{ color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1 }}>Acronym Key:</strong>{" "}
        HHHS = Huntsville Hospital Health System; HU = Huntsville Utilities; GS-3 = federal General Schedule grade 3; MTM = Mazda Toyota Manufacturing; TMMA = Toyota Motor Manufacturing Alabama.
      </div>
    </section>
  );
}

function RatioCards({ isMobile }) {
  const maxAnnual = Math.max(...PAY_CLOCK_EMPLOYERS.map((item) => item.executiveAnnual));
  return (
    <section>
      <div style={{ fontSize: 16, color: COLORS.blue, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 14 }}>
        Static Ratio Cards
      </div>
      <div
        className="hsv-ratio-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14,
        }}
      >
        {PAY_CLOCK_EMPLOYERS.map((item) => {
          const workerAnnual = annualFromHourly(item.workerHourly);
          const executiveWidth = Math.max(8, (item.executiveAnnual / maxAnnual) * 100);
          const workerWidth = Math.max(8, (workerAnnual / maxAnnual) * 100);
          return (
            <div key={item.employer} style={{ background: COLORS.panel, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 16 }}>
              <div style={{ color: COLORS.navy, fontSize: 17, fontWeight: 1000, lineHeight: 1.25, marginBottom: 12 }}>{item.employer}</div>
              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 900 }}>{item.executiveTitle}: {money(item.executiveAnnual)}/yr</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{item.executiveSource}</div>
                </div>
                <div>
                  <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 900 }}>{item.workerTitle}: Est. ${item.workerHourly.toFixed(2)}/hr ({money(workerAnnual)}/yr)</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{item.workerSource}</div>
                </div>
              </div>
              <div style={{ display: "inline-flex", color: COLORS.red, fontWeight: 900, fontSize: 14, marginBottom: 12 }}>
                {ratio(item)}:1 ratio
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ color: COLORS.red, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>Executive</div>
                  <div style={{ height: 20, background: COLORS.cardAlt, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${executiveWidth}%`, height: "100%", background: COLORS.red, borderRadius: 999 }} />
                  </div>
                  <div style={{ color: COLORS.red, fontSize: 12, fontWeight: 900, marginTop: 3 }}>{money(item.executiveAnnual)}</div>
                </div>
                <div>
                  <div style={{ color: COLORS.green, fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>Worker</div>
                  <div style={{ height: 20, background: COLORS.cardAlt, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${workerWidth}%`, height: "100%", background: COLORS.green, borderRadius: 999 }} />
                  </div>
                  <div style={{ color: COLORS.green, fontSize: 12, fontWeight: 900, marginTop: 3 }}>{money(workerAnnual)}</div>
                </div>
              </div>
              <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.55 }}>{item.context}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PayClockTab() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const isMobile = useIsMobileWidth();

  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - started), 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <style>{`
        @media (max-width: 760px) {
          .hsv-pay-clock-grid,
          .hsv-ratio-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <PayClockTicker elapsedMs={elapsedMs} isMobile={isMobile} />
      <RatioCards isMobile={isMobile} />
    </div>
  );
}

export default function WorkersChildcarePage() {
  const { liveIssues, loading } = useSupabaseModule("workers_childcare");
  const [tabId, setTabId] = useState(data.tabs?.[0]?.id || "overview");
  const activeTab = data.tabs?.find((t) => t.id === tabId) || data.tabs?.[0];
  const { statBlocks: liveStatBlocks, loading: statBlocksLoading, error: statBlocksError } = useModuleStatBlocks("workers_childcare", tabId);

  const SCROLL_KEY = "hsv_last_card";

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const age = Date.now() - (saved.ts || 0);
      const moduleMatch = saved.module === "workers_childcare";
      if (moduleMatch && age < 24 * 60 * 60 * 1000 && saved.tab && saved.tab !== tabId) {
        setTabId(saved.tab);
      }
    } catch (e) {}
  }, [tabId]);

  const tabLiveIssues = liveIssues.filter((li) => {
    const liTabs = Array.isArray(li.tabs) && li.tabs.length ? li.tabs : (li.tab ? [li.tab] : []);
    if (tabId === "overview") {
      return li.show_on_overview || liTabs.includes("overview") || (!li.tab && liTabs.length === 0);
    }
    return liTabs.includes(tabId) || li.tab === tabId;
  });

  const rotatingStats = useRotatingStats({
    liveStatBlocks,
    fallbackStats: [],
    activeTabId: tabId,
    maxItems: 3,
  });

  return (
    <div>
      <PageHeader title={data.title} intro={data.intro} />
      {tabId !== "pay_clock" ? <VisualSwitcher visual={activeTab?.visual || data.topVisual} stats={rotatingStats.stats} rotationKey={rotatingStats.rotationKey} /> : null}
      {statBlocksLoading ? <div style={{ textAlign: "center", color: COLORS.muted, padding: "10px 0", fontSize: 14 }}>Loading...</div> : null}
      {statBlocksError ? <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{statBlocksError.message || String(statBlocksError)}</div> : null}
      <TabBar tabs={data.tabs || []} activeTabId={tabId} onChange={setTabId} />
      {tabId === "pay_clock" ? (
        <PayClockTab />
      ) : (
        <>
          <div>
            {tabLiveIssues.map((issue, index) => (
              <IssueCard key={issue.id || index} issue={issue} />
            ))}
            {!loading && tabLiveIssues.length === 0 ? (
              <ModuleEmptyState moduleName={data.title} moduleDescription={data.intro} />
            ) : null}
          </div>
          <InvestigativeTrail issues={liveIssues} />
        </>
      )}
    </div>
  );
}
