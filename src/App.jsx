import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import { COLORS, SPACING } from "./config/theme";
import EquityPage from "./modules/equity/EquityPage";
import UtilitiesPage from "./modules/utilities/UtilitiesPage";
import HealthPage from "./modules/health/HealthPage";
import InsuranceBurdensPage from "./modules/insurance_burdens/InsuranceBurdensPage";
import WorkersChildcarePage from "./modules/workers_childcare/WorkersChildcarePage";
import TaxationPage from "./modules/taxation/TaxationPage";
import HousingCrisisPage from "./modules/housing_crisis/HousingCrisisPage";
import OfficialsElectionsPage from "./modules/officials_elections/OfficialsElectionsPage";
import BoardsOversightPage from "./modules/boards_oversight/BoardsOversightPage";
import VotingRightsPage from "./modules/voting_rights/VotingRightsPage";
import CriminalJusticePage from "./modules/criminal_justice/CriminalJusticePage";
import PolicingPage from "./modules/policing/PolicingPage";
import DataCollectionPage from "./modules/data_collection/DataCollectionPage";
import MoneyPage from "./modules/money/MoneyPage";
import LandusePage from "./modules/landuse/LandusePage";
import EnvironmentPage from "./modules/environment/EnvironmentPage";
import InformationWarfarePage from "./modules/information_warfare/InformationWarfarePage";
import ProposalsPage from "./modules/proposals/ProposalsPage";
import ActionPage from "./modules/action/ActionPage";

const ROUTE_DASHBOARD = "dashboard";

function ActivePage({ activeId, onBack }) {
  switch (activeId) {
    case ROUTE_DASHBOARD:
      return <DashboardHome onOpenModule={onBack} />;
    case "equity": return <EquityPage />;
    case "utilities": return <UtilitiesPage />;
    case "health": return <HealthPage />;
    case "insurance_burdens": return <InsuranceBurdensPage />;
    case "workers_childcare": return <WorkersChildcarePage />;
    case "taxation": return <TaxationPage />;
    case "housing_crisis": return <HousingCrisisPage />;
    case "officials_elections": return <OfficialsElectionsPage />;
    case "boards_oversight": return <BoardsOversightPage />;
    case "voting_rights": return <VotingRightsPage />;
    case "criminal_justice": return <CriminalJusticePage />;
    case "policing": return <PolicingPage />;
    case "data_collection": return <DataCollectionPage />;
    case "money": return <MoneyPage />;
    case "landuse": return <LandusePage />;
    case "environment": return <EnvironmentPage />;
    case "information_warfare": return <InformationWarfarePage />;
    case "proposals": return <ProposalsPage />;
    case "action": return <ActionPage />;
    default: return <DashboardHome onOpenModule={onBack} />;
  }
}

export default function App() {
  const initialRoute = useMemo(() => {
    const hash = window.location.hash.replace("#", "").trim();
    return hash || ROUTE_DASHBOARD;
  }, []);

  const [activeId, setActiveId] = useState(initialRoute);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollPositions = useRef({});
  const pendingRestore = useRef(null);
  const previousRoute = useRef(initialRoute);

  const restoreScroll = useCallback((routeId) => {
    const nextScroll = scrollPositions.current[routeId] ?? 0;
    window.requestAnimationFrame(() => window.scrollTo({ top: nextScroll, behavior: "auto" }));
  }, []);

  const navigate = useCallback((nextRoute, pushHistory = true) => {
    const currentRoute = previousRoute.current;
    scrollPositions.current[currentRoute] = window.scrollY;
    previousRoute.current = nextRoute;
    if (pushHistory) {
      window.history.pushState({ route: nextRoute }, "", `#${nextRoute}`);
    }
    pendingRestore.current = nextRoute;
    setActiveId(nextRoute);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    window.history.replaceState({ route: initialRoute }, "", `#${initialRoute}`);
    const onPopState = (event) => {
      const nextRoute = event.state?.route || window.location.hash.replace("#", "") || ROUTE_DASHBOARD;
      scrollPositions.current[previousRoute.current] = window.scrollY;
      previousRoute.current = nextRoute;
      pendingRestore.current = nextRoute;
      setActiveId(nextRoute);
      setMobileOpen(false);
    };
    const onResize = () => setIsMobile(window.innerWidth < 960);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("resize", onResize);
    };
  }, [initialRoute]);

  useEffect(() => {
    if (pendingRestore.current !== null) {
      restoreScroll(pendingRestore.current);
      pendingRestore.current = null;
    }
  }, [activeId, restoreScroll]);

  const moduleTitle = {
    equity: "The Two Huntsvilles",
    utilities: "Utilities: Power, Water, & Gas",
    health: "Healthcare & Hospital System",
    insurance_burdens: "Insurance Burdens",
    workers_childcare: "Workers Rights & Child Care",
    taxation: "Taxation",
    housing_crisis: "Housing Crisis",
    officials_elections: "Officials & Elections",
    boards_oversight: "Boards, Directors, & School Boards",
    voting_rights: "The Ballot & Your Access",
    criminal_justice: "Criminal Justice: Sentencing & Prisons",
    policing: "Law Enforcement & Accountability",
    data_collection: "Surveillance & Data Collection",
    money: "Follow the Money",
    landuse: "Land: Annexation, Zoning, & Development",
    environment: "Environment",
    information_warfare: "Information Warfare",
    proposals: "A Better Huntsville: The Blueprint",
    action: "Take Action",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", background: COLORS.bg }}>
      {!isMobile && <Sidebar activeId={activeId} onNavigate={(id) => navigate(id)} isMobile={false} onHome={() => navigate(ROUTE_DASHBOARD)} />}
      {isMobile && (
        <>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: 60,
              background: COLORS.sidebarBg,
              color: COLORS.sidebarText,
              border: `1px solid rgba(255,255,255,0.10)`,
              borderRadius: 12,
              padding: "9px 11px",
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
            }}
            aria-label="Open menu"
          >
            ☰
          </button>
          <Sidebar activeId={activeId} onNavigate={(id) => navigate(id)} isMobile onHome={() => navigate(ROUTE_DASHBOARD)} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        </>
      )}
      <main style={{ flex: 1, padding: isMobile ? "56px 14px 18px" : "12px 22px 18px", color: COLORS.text, minWidth: 0 }}>
        <div style={{ maxWidth: SPACING.pageMax, margin: "0 auto" }}>
          {isMobile && activeId !== ROUTE_DASHBOARD && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <button
                onClick={() => navigate(ROUTE_DASHBOARD)}
                style={{
                  border: `1px solid ${COLORS.borderStrong}`,
                  background: "rgba(198,170,87,0.13)",
                  borderRadius: 999,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: 900,
                  color: COLORS.text,
                  fontSize: 13,
                }}
              >
                ← Back
              </button>
              <div style={{ color: COLORS.textSoft, fontSize: 12 }}>{moduleTitle[activeId]}</div>
            </div>
          )}
          <ActivePage activeId={activeId} onBack={(id) => navigate(id)} />
        </div>
      </main>
    </div>
  );
}
