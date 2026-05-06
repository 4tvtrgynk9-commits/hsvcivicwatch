import React, { useEffect, useState } from "react";
import { COLORS } from "../../config/theme";
import PageHeader from "../../components/PageHeader";
import VisualSwitcher from "../../components/VisualSwitcher";
import TabBar from "../../components/TabBar";
import IssueCard from "../../components/IssueCard";
import ModuleEmptyState from "../../components/ModuleEmptyState";
import InvestigativeTrail from "../../components/InvestigativeTrail";
import data from "././information_warfare.data";
import useSupabaseModule from "../../lib/useSupabaseModule";
import useRotatingStats from "../../lib/useRotatingStats";
import useModuleStatBlocks from "../../hooks/useModuleStatBlocks";

export default function InformationWarfarePage() {
  const { liveIssues, loading } = useSupabaseModule("information_warfare");
  const [tabId, setTabId] = useState(data.tabs?.[0]?.id || "overview");
  const activeTab = data.tabs?.find((t) => t.id === tabId) || data.tabs?.[0];
  const { statBlocks: liveStatBlocks, loading: statBlocksLoading, error: statBlocksError } = useModuleStatBlocks("information_warfare", tabId);

  const SCROLL_KEY = "hsv_last_card";

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const age = Date.now() - (saved.ts || 0);
      const moduleMatch = saved.module === "information_warfare";
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
      <VisualSwitcher visual={activeTab?.visual || data.topVisual} stats={rotatingStats.stats} rotationKey={rotatingStats.rotationKey} />
      {statBlocksLoading ? <div style={{ textAlign: "center", color: COLORS.muted, padding: "10px 0", fontSize: 14 }}>Loading...</div> : null}
      {statBlocksError ? <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{statBlocksError.message || String(statBlocksError)}</div> : null}
      <TabBar tabs={data.tabs || []} activeTabId={tabId} onChange={setTabId} />
      <div>
        {tabLiveIssues.map((issue, index) => (
          <IssueCard key={issue.id || index} issue={issue} />
        ))}
        {!loading && tabLiveIssues.length === 0 ? (
          <ModuleEmptyState moduleName={data.title} moduleDescription={data.intro} />
        ) : null}
      </div>
      <InvestigativeTrail issues={liveIssues} />
    </div>
  );
}