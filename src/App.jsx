import React, { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
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

function ActivePage({ activeId }) {
  switch (activeId) {
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
    default: return <EquityPage />;
  }
}

export default function App() {
  const [activeId, setActiveId] = useState("equity");

  return (
    <div style={
      minHeight: "100vh",
      display: "flex",
      background: COLORS.bg
    }>
      <Sidebar activeId={activeId} onNavigate={setActiveId} />
      <main style={ flex: 1, padding: 24 }>
        <div style={ maxWidth: SPACING.pageMax, margin: "0 auto" }>
          <ActivePage activeId={activeId} />
        </div>
      </main>
    </div>
  );
}