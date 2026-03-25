import React from "react";

export const equityPageData = {
  id: "equity",
  icon: "⚖",
  title: "The Two Huntsvilles",
  subtitle: "Service & Spending Inequality",
  tag: "tag-red",
  sub: "Roads, schools, and policing patterns show a long-running equity gap inside the same city.",

  stats: [
    ["Road PCI North", "41", "Poor condition — near reconstruction threshold", "#dc2626"],
    ["Road PCI South", "72", "Good condition", "#16a34a"],
    ["Capital Road Spending", "68%", "Share going to south Huntsville and annexed areas", "#ea580c"],
    ["Police Contacts", "3.7x", "Higher per-capita in north Huntsville", "#c9a84c"],
  ],

  facts: [
    {
      k: "red",
      label: "ROAD MAINTENANCE GAP",
      lc: "#dc2626",
      tc: "#7f1d1d",
      text:
        "North Huntsville roads average a Pavement Condition Index of 41 — poor condition, close to reconstruction level. South Huntsville averages 72 — good condition. Residents in both areas pay the same city tax rates.",
    },
    {
      k: "gold",
      label: "SCHOOL RESOURCE PATTERN",
      lc: "#b8860b",
      tc: "#78350f",
      text:
        "Mae C. Jemison High serves northwest Huntsville and shows stronger AP participation than some peer schools, but math proficiency remains very low. Huntsville City Schools has not adopted a clearly weighted funding approach that visibly sends more resources where student need is higher.",
    },
    {
      k: "blue",
      label: "POLICING PATTERN",
      lc: "#2563eb",
      tc: "#1e3a5f",
      text:
        "North Huntsville residents experience significantly more police contact per capita than south Huntsville residents, while the city has not required a public patrol equity analysis or created a civilian review board.",
    },
    {
      k: "green",
      label: "SPENDING AND POWER",
      lc: "#16a34a",
      tc: "#14532d",
      text:
        "Most capital road improvement spending over the past decade went to south Huntsville and annexed areas. Mayor Battle received major support from real estate developers who benefit from those growth patterns. The city has not commissioned an independent equity audit.",
    },
  ],

  prompt:
    "Explain the equity gap in plain language. Focus on roads, schools, policing, spending patterns, and who benefits from the current setup.",

  aiPayload: {
    pageTitle: "The Two Huntsvilles",
    tabLabel: "Overview",
    connections: [
      "Mayor Tommy Battle",
      "Huntsville City Council",
      "Huntsville City Schools",
      "Industrial Development Board",
      "Real estate developers",
      "Huntsville Police Department",
    ],
    whoBenefits: [
      "Developers and landowners in favored growth corridors",
      "Officials protected by weak transparency and no equity audit",
      "Institutions that keep control without neighborhood-level accountability",
    ],
    whoPays: [
      "North Huntsville residents",
      "Students in less-resourced schools",
      "Residents facing heavier police contact",
      "Taxpayers funding unequal service outcomes",
    ],
    actionData: [
      "Ask City Council for road spending totals by district",
      "Request PCI and pothole response data by neighborhood",
      "Ask Huntsville City Schools for per-school funding and staffing comparisons",
      "Ask for patrol deployment and stop data by neighborhood",
      "Push for an independent city equity audit",
    ],
  },
};

export function getEquityAIPayload() {
  return {
    pageTitle: equityPageData.aiPayload.pageTitle,
    tabLabel: equityPageData.aiPayload.tabLabel,
    prompt: equityPageData.prompt,
    stats: equityPageData.stats,
    facts: equityPageData.facts,
    connections: equityPageData.aiPayload.connections,
    whoBenefits: equityPageData.aiPayload.whoBenefits,
    whoPays: equityPageData.aiPayload.whoPays,
    actionData: equityPageData.aiPayload.actionData,
  };
}

export function EquityPage() {
  return null;
}

export default EquityPage;