import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import VisualSwitcher from "../../components/VisualSwitcher";
import TabBar from "../../components/TabBar";
import IssueCard from "../../components/IssueCard";
import InvestigativeTrail from "../../components/InvestigativeTrail";
import data from "././voting_rights.data";
import useSupabaseModule from "../../lib/useSupabaseModule";
import useRotatingStats from "../../lib/useRotatingStats";

export default function VotingRightsPage() {
  const { liveIssues, liveStats, liveStatBlocks, loading } = useSupabaseModule("voting_rights");
  const [tabId, setTabId] = useState(data.tabs?.[0]?.id || "overview");
  const activeTab = data.tabs?.find((t) => t.id === tabId) || data.tabs?.[0];

  const activeTabIssues = activeTab?.issues || [];
  const tabLiveIssues = liveIssues.filter((li) => {
    if (tabId === "overview") {
      return li.show_on_overview || !li.tab;
    }
    return li.tab === tabId;
  });
  const mergedIssues = [
    ...tabLiveIssues.filter((li) => !activeTabIssues.find((hi) => hi.id === li.id)),
    ...activeTabIssues,
  ];

  const rotatingStats = useRotatingStats({
    liveStatBlocks,
    fallbackStats: activeTab?.stats || data.stats || [],
    activeTabId: tabId,
    maxItems: 3,
  });

  return (
    <div>
      <PageHeader title={data.title} intro={data.intro} />
      <VisualSwitcher visual={activeTab?.visual || data.topVisual} stats={rotatingStats.stats} rotationKey={rotatingStats.rotationKey} />
      <TabBar tabs={data.tabs || []} activeTabId={tabId} onChange={setTabId} />
      <div>
        {(mergedIssues).map((issue, index) => (
          <IssueCard key={issue.id || index} issue={issue} />
        ))}
      </div>
      <InvestigativeTrail issues={liveIssues} />
    </div>
  );
}