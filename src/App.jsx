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
import AdminPanel from "./pages/AdminPanel";
import AdminResetPassword from "./pages/AdminResetPassword";

const ROUTE_DASHBOARD = "dashboard";
const ROUTE_ADMIN_RESET = "admin-reset";

function getRouteFromLocation() {
  const url = new URL(window.location.href);

  if (url.pathname === "/admin-reset-password") {
    return ROUTE_ADMIN_RESET;
  }

  if (url.searchParams.get("admin-reset") === "1") {
    return ROUTE_ADMIN_RESET;
  }

  const hash = url.hash.replace("#", "").trim();
  const cardParam = url.searchParams.get("card");
  if (cardParam) {
    try {
      localStorage.setItem("hsv_last_card", JSON.stringify({
        id: cardParam,
        ts: Date.now()
      }));
    } catch (e) {}
    url.searchParams.delete("card");
    window.history.replaceState(window.history.state || {}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  return hash || ROUTE_DASHBOARD;
}

function buildRouteUrl(routeId) {
  const url = new URL(window.location.href);

  if (routeId === ROUTE_ADMIN_RESET) {
    url.pathname = "/admin-reset-password";
    url.searchParams.delete("admin-reset");
    return `${url.pathname}${url.search}${url.hash}`;
  }

  url.searchParams.delete("admin-reset");
  url.searchParams.delete("code");
  url.hash = `#${routeId || ROUTE_DASHBOARD}`;
  return `${url.pathname}${url.search}${url.hash}`;
}

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
    case ROUTE_ADMIN_RESET: return <AdminResetPassword />;
    case "admin": return <AdminPanel />;
    default: return <DashboardHome onOpenModule={onBack} />;
  }
}

export default function App() {
  const initialRoute = useMemo(() => getRouteFromLocation(), []);

  const [activeId, setActiveId] = useState(initialRoute);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
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
    try { sessionStorage.removeItem("hsv_decoder_state"); } catch (e) {}
    if (pushHistory) {
      window.history.pushState({ route: nextRoute }, "", buildRouteUrl(nextRoute));
    }
    pendingRestore.current = nextRoute;
    setActiveId(nextRoute);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    window.history.replaceState({ route: initialRoute }, "", buildRouteUrl(initialRoute));
    const onPopState = (event) => {
      const nextRoute = event.state?.route || getRouteFromLocation();
      scrollPositions.current[previousRoute.current] = window.scrollY;
      previousRoute.current = nextRoute;
      pendingRestore.current = nextRoute;
      setActiveId(nextRoute);
      setMobileOpen(false);
    };
    const onResize = () => setIsMobile(window.innerWidth < 768);
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
    workers_childcare: "Worker Rights & Child Care",
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
    [ROUTE_ADMIN_RESET]: "Reset Admin Password",
    admin: "Admin Panel",
  };

  const mobileTitle = activeId === ROUTE_DASHBOARD ? "Huntsville Civic Investigator" : moduleTitle[activeId];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", background: COLORS.bg }}>

      {!isMobile && activeId !== "admin" && activeId !== ROUTE_ADMIN_RESET && (
        <Sidebar
          activeId={activeId}
          onNavigate={(id) => navigate(id)}
          isMobile={false}
          onHome={() => navigate(ROUTE_DASHBOARD)}
        />
      )}

      {isMobile && activeId !== "admin" && activeId !== ROUTE_ADMIN_RESET && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 70,
              background: COLORS.sidebarBg,
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(247,243,234,0.12)",
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 42 }}>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                style={{
                  width: 42,
                  height: 42,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  border: "1px solid rgba(247,243,234,0.18)",
                  background: mobileOpen ? COLORS.goldSoft : "rgba(247,243,234,0.08)",
                  color: COLORS.sidebarText,
                  fontSize: 21,
                  fontWeight: 900,
                  lineHeight: 1,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label="Open menu"
              >
                &#9776;
              </button>

              {activeId !== ROUTE_DASHBOARD ? (
                <button
                  onClick={() => navigate(ROUTE_DASHBOARD)}
                  style={{
                    width: 42,
                    height: 42,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    border: "1px solid rgba(247,243,234,0.18)",
                    background: "rgba(247,243,234,0.08)",
                    color: COLORS.sidebarText,
                    fontSize: 20,
                    fontWeight: 900,
                    lineHeight: 1,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  aria-label="Back to homepage"
                >
                  &larr;
                </button>
              ) : (
                <div style={{ width: 42, height: 42, flexShrink: 0 }} aria-hidden="true" />
              )}

              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  fontSize: activeId === ROUTE_DASHBOARD ? 16 : 14,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: COLORS.sidebarText,
                  paddingRight: 4,
                }}
              >
                {mobileTitle}
              </div>
            </div>
          </div>

          <Sidebar
            activeId={activeId}
            onNavigate={(id) => navigate(id)}
            isMobile
            onHome={() => navigate(ROUTE_DASHBOARD)}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </>
      )}

      <main
        style={{
          flex: 1,
          padding: isMobile ? "72px 12px 16px" : "12px 22px 18px 18px",
          color: COLORS.text,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: SPACING.pageMax, margin: "0 auto" }}>
          <ActivePage activeId={activeId} onBack={(id) => navigate(id)} />
        </div>
      </main>
    </div>
  );
}
