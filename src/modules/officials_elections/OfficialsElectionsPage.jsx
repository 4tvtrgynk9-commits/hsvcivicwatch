import React, { useEffect, useState } from "react";
import { COLORS } from "../../config/theme";
import PageHeader from "../../components/PageHeader";
import VisualSwitcher from "../../components/VisualSwitcher";
import TabBar from "../../components/TabBar";
import IssueCard from "../../components/IssueCard";
import ModuleEmptyState from "../../components/ModuleEmptyState";
import InvestigativeTrail from "../../components/InvestigativeTrail";
import useSupabaseModule from "../../lib/useSupabaseModule";
import useRotatingStats from "../../lib/useRotatingStats";
import useModuleStatBlocks from "../../hooks/useModuleStatBlocks";

const MODULE_ID = "officials_elections";

const tabs = [
  { id: "current_officials", label: "Current Officials" },
  { id: "candidates", label: "Candidates" },
  { id: "elections_2026", label: "2026 Elections" },
];

export default function OfficialsElectionsPage() {
  const { liveIssues, loading } = useSupabaseModule(MODULE_ID);
  const [tabId, setTabId] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === tabId) || tabs[0];
  const { statBlocks: liveStatBlocks, loading: statBlocksLoading, error: statBlocksError } = useModuleStatBlocks(MODULE_ID, tabId);

  const SCROLL_KEY = "hsv_last_card";

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const age = Date.now() - (saved.ts || 0);
      const moduleMatch = saved.module === MODULE_ID;
      const savedTabIsValid = tabs.some((tab) => tab.id === saved.tab);
      if (moduleMatch && age < 24 * 60 * 60 * 1000 && savedTabIsValid && saved.tab !== tabId) {
        setTabId(saved.tab);
      }
    } catch (e) {}
  }, [tabId]);

  const tabLiveIssues = liveIssues.filter((issue) => {
    const issueTabs = Array.isArray(issue.tabs) && issue.tabs.length ? issue.tabs : (issue.tab ? [issue.tab] : []);
    return issueTabs.includes(tabId) || issue.tab === tabId;
  });

  const rotatingStats = useRotatingStats({
    liveStatBlocks,
    fallbackStats: [],
    activeTabId: tabId,
    maxItems: 3,
  });

  return (
    <div>
      <PageHeader
        title="Who Runs Huntsville"
        intro="Who runs Huntsville, you ask? Meet the people making decisions about your daily life who'd rather you didn't look too closely."
      />
      <VisualSwitcher visual={activeTab?.visual} stats={rotatingStats.stats} rotationKey={rotatingStats.rotationKey} />
      {statBlocksLoading ? <div style={{ textAlign: "center", color: COLORS.muted, padding: "10px 0", fontSize: 14 }}>Loading...</div> : null}
      {statBlocksError ? <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{statBlocksError.message || String(statBlocksError)}</div> : null}
      <TabBar tabs={tabs} activeTabId={tabId} onChange={setTabId} />
      <div>
        {tabLiveIssues.map((issue, index) => (
          <IssueCard key={issue.id || index} issue={issue} />
        ))}
        {!loading && tabLiveIssues.length === 0 ? (
          <ModuleEmptyState moduleName={"Who Runs Huntsville"} moduleDescription={"Who runs Huntsville, you ask? Meet the people making decisions about your daily life who'd rather you didn't look too closely."} />
        ) : null}
      </div>
      <InvestigativeTrail issues={liveIssues} />
    </div>
  );
}
