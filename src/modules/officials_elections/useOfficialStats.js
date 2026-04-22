import { useMemo } from "react";

function formatCurrency(value) {
  if (!Number.isFinite(value) || value <= 0) return "Not yet tracked";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${Math.round(value)}`;
}

function parseMoney(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value || "")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim();
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasMatchingScope(profile, activeTabId) {
  return Array.isArray(profile?.scopes) && profile.scopes.includes(activeTabId);
}

function hasEthicsComplaint(profile) {
  const value = String(
    profile?.ethics_complaints ||
      profile?.ethicsComplaints ||
      profile?.quickFacts?.find((fact) => String(fact?.label || "").trim().toLowerCase() === "ethics complaints")?.value ||
      ""
  ).trim();
  if (!value) return false;
  return value !== "NOT DISCLOSED" && value !== "None confirmed";
}

function getSalary(profile) {
  const direct = parseMoney(profile?.salary || profile?.compensation);
  if (direct !== null) return direct;

  const salaryFact = Array.isArray(profile?.quickFacts)
    ? profile.quickFacts.find((fact) => {
        const label = String(fact?.label || "").trim().toLowerCase();
        return label === "salary" || label === "annual salary" || label === "compensation";
      })
    : null;

  return parseMoney(salaryFact?.value);
}

function getPacCountFlag(profile) {
  const pacs = profile?.donors?.pacs || profile?.donors?.PACs || profile?.donors?.pacs_list;
  return Array.isArray(pacs) && pacs.length > 0;
}

function getTotalRaised(profile) {
  return parseMoney(
    profile?.donors?.total_raised ||
      profile?.donors?.totalRaised ||
      profile?.donors?.raised
  );
}

export default function useOfficialStats(profiles, activeTabId) {
  return useMemo(() => {
    const source = Array.isArray(profiles) ? profiles : [];
    const matchingProfiles = source.filter((profile) => hasMatchingScope(profile, activeTabId));

    if (!source.length || !matchingProfiles.length) {
      return [
        { label: "Profiles Tracked", value: "—" },
        { label: activeTabId === "candidates" ? "Races Tracked" : "Combined Salaries", value: "—" },
        {
          label:
            activeTabId === "county"
              ? "Active Complaints"
              : activeTabId === "state" || activeTabId === "federal"
                ? "PAC Connections"
                : activeTabId === "candidates"
                  ? "Total Fundraising"
                  : "Ethics Complaints",
          value: "—",
        },
      ];
    }

    const profilesTracked = String(matchingProfiles.length);

    if (activeTabId === "candidates") {
      const totalFundraising = matchingProfiles.reduce((sum, profile) => {
        const amount = getTotalRaised(profile);
        return amount !== null ? sum + amount : sum;
      }, 0);

      return [
        { label: "Profiles Tracked", value: profilesTracked },
        { label: "Races Tracked", value: profilesTracked },
        { label: "Total Fundraising", value: formatCurrency(totalFundraising) },
      ];
    }

    const salaryValues = matchingProfiles
      .map(getSalary)
      .filter((value) => value !== null);
    const combinedSalaries = salaryValues.length
      ? formatCurrency(salaryValues.reduce((sum, value) => sum + value, 0))
      : "Not yet tracked";

    if (activeTabId === "state" || activeTabId === "federal") {
      return [
        { label: "Profiles Tracked", value: profilesTracked },
        { label: "Combined Salaries", value: combinedSalaries },
        {
          label: "PAC Connections",
          value: String(matchingProfiles.filter(getPacCountFlag).length),
        },
      ];
    }

    const complaintLabel = activeTabId === "county" ? "Active Complaints" : "Ethics Complaints";
    const complaintCount = matchingProfiles.filter(hasEthicsComplaint).length;

    return [
      { label: "Profiles Tracked", value: profilesTracked },
      { label: "Combined Salaries", value: combinedSalaries },
      { label: complaintLabel, value: String(complaintCount) },
    ];
  }, [activeTabId, profiles]);
}
