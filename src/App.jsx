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
  }, []);

  useEffect(() => {
    window.history.replaceState({ route: initialRoute }, "", `#${initialRoute}`);
    const onPopState = (event) => {
      const nextRoute = event.state?.route || window.location.hash.replace("#", "") || ROUTE_DASHBOARD;
      scrollPositions.current[previousRoute.current] = window.scrollY;
      previousRoute.current = nextRoute;
      pendingRestore.current = nextRoute;
      setActiveId(nextRoute);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
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
    <div style={{ minHeight: "100vh", display: "flex", background: COLORS.bg }}>
      <Sidebar activeId={activeId} onNavigate={(id) => navigate(id)} />
      <main style={{ flex: 1, padding: 24 }}>
        <div style={{ maxWidth: SPACING.pageMax, margin: "0 auto" }}>
          {activeId !== ROUTE_DASHBOARD && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => navigate(ROUTE_DASHBOARD)}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  background: "#fff",
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 800,
                  color: COLORS.navyDark,
                }}
              >
                ← Back to dashboard
              </button>
              <div style={{ color: COLORS.muted, fontSize: 14 }}>{moduleTitle[activeId]}</div>
            </div>
          )}
          <ActivePage activeId={activeId} onBack={(id) => navigate(id)} />
        </div>
      </main>
    </div>
  );
}
