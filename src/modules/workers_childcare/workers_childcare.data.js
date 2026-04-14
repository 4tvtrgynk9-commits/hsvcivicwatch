const data = {
  id: "workers_childcare",
  title: "Worker Rights & Child Care",
  intro: "Alabama banned cities from raising the minimum wage. Infant care costs more than college tuition. Worker protections are among the weakest in the nation. This module documents who decided that — and what 2026 can change.",
  tabs: [
    {
      id: "worker_rights",
      label: "Worker Rights",
      stats: [
        ["Alabama Minimum Wage", "$7.25/hr", "Unchanged since 2009. State law bans cities from raising it.", "#dc2626"],
        ["Amazon HSV Wage", "$16.50/hr", "Below MIT living wage of $20.18/hr for a single adult in Madison County", "#ea580c"],
        ["HHHS CNA Starting", "$14.50/hr", "Qualifies for SNAP food benefits at this wage. CEO earns $3.1M at the same organization.", "#dc2626"],
        ["AL Worker Protections", "50th", "Alabama ranks last nationally for worker protections and labor law enforcement", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "MIT Living Wage Calculator — Madison County 2025", text: "Source for $20.18/hr living wage for single adult" },
        { label: "SB 88 — Alabama Minimum Wage Preemption (2023)", text: "Source for state ban on local minimum wage ordinances" }
      ]
    },
    {
      id: "child_care",
      label: "Child Care",
      stats: [
        ["Infant Care Cost", "$14,400/yr", "Average annual cost in Huntsville — 48% of a $30,000 salary", "#dc2626"],
        ["Alabama Pre-K Access", "30%", "Share of eligible 4-year-olds served by Alabama Pre-K — last in the nation", "#ea580c"],
        ["Head Start Waitlist", "65%", "Share of eligible Madison County children on the Head Start waitlist", "#dc2626"],
        ["Child Care Desert", "Widespread", "Large parts of North Alabama qualify as child care deserts by federal definition", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Child Care Aware of America — Alabama Data", text: "Source for infant care cost figures" },
        { label: "Alabama First Class Pre-K Program Data", text: "Source for 30% coverage rate" },
        { label: "Head Start Madison County enrollment data", text: "Source for 65% waitlist figure" }
      ]
    }
  ]
};
export default data;
