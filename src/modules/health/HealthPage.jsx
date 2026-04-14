import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import VisualSwitcher from "../../components/VisualSwitcher";
import TabBar from "../../components/TabBar";
import IssueCard from "../../components/IssueCard";
import InvestigativeTrail from "../../components/InvestigativeTrail";
import data from "././health.data";
import useSupabaseModule from "../../lib/useSupabaseModule";

export default function HealthPage() {
  const [tabId, setTabId] = useState(data.tabs?.[0]?.id || "overview");
  const activeTab = data.tabs?.find((t) => t.id === tabId) || data.tabs?.[0];

  const { liveIssues, liveStats, loading } = useSupabaseModule("health");

  const activeTabIssues = activeTab?.issues || [];
  const mergedIssues = [
    ...liveIssues.filter((li) => !activeTabIssues.find((hi) => hi.id === li.id)),
    ...activeTabIssues,
  ];

  const stats = liveStats.length > 0
    ? liveStats
    : (activeTab?.stats || data.stats || []);

  return (
    <div>
      <PageHeader title={data.title} intro={data.intro} />
      <VisualSwitcher visual={activeTab?.visual || data.topVisual} stats={stats} />
      <TabBar tabs={data.tabs || []} activeTabId={tabId} onChange={setTabId} />
      {loading && (
        <div style={{ padding:"32px 0", textAlign:"center", color:"#b8860b", fontSize:14, fontStyle:"italic" }}>
          Loading live data...
        </div>
      )}
      <div>
        {mergedIssues.map((issue, index) => (
          <IssueCard key={issue.id || index} issue={issue} />
        ))}
      </div>
      <InvestigativeTrail entries={activeTab?.trail || []} />
    </div>
  );
}