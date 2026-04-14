const data = {
  id: "proposals",
  title: "A Better Huntsville: The Blueprint",
  intro: "Every investigation in this app points to a solvable problem. This module documents specific, evidence-based reforms — drawn from what other cities have done — that would make Huntsville more equitable, accountable, and livable.",
  tabs: [
    {
      id: "economic_justice",
      label: "Economic Justice",
      stats: [
        ["Living Wage Gap", "$5.68/hr", "Difference between Alabama minimum wage and MIT living wage for Madison County", "#dc2626"],
        ["Cities with Living Wage Laws", "25+", "Major U.S. cities that have enacted local living wage ordinances", "#1e8449"],
        ["IDB Tax Abatements", "Untracked", "No public accounting of total property tax revenue foregone through IDB deals", "#ea580c"],
        ["Infant Care Cost vs. Tuition", "Higher", "Huntsville infant care costs more per year than UAH tuition", "#dc2626"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "housing_infrastructure",
      label: "Housing & Infrastructure",
      stats: [
        ["Affordable Units Needed", "Estimated 10,000+", "Estimated affordable housing gap in the Huntsville metro", "#dc2626"],
        ["Road PCI Gap", "41 vs 72", "Average pavement condition — North Huntsville vs South Huntsville", "#ea580c"],
        ["TIF Accountability", "None required", "No mandatory community benefit agreements attached to TIF-backed development", "#dc2626"],
        ["Rent Control Preemption", "State law", "Alabama state law prohibits cities from enacting rent control ordinances", "#7c3aed"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "public_safety",
      label: "Public Safety Reform",
      stats: [
        ["Mental Health Call Share", "Estimated 20-30%", "Share of HPD calls that are mental health related nationally — Huntsville has no civilian response alternative", "#dc2626"],
        ["Civilian Oversight", "None", "Huntsville has no civilian police oversight board with subpoena power", "#ea580c"],
        ["Crisis Care Cut", "$36,000", "Amount cut from WellStone mental health funding in the same budget that expanded HPD", "#dc2626"],
        ["Cities with Civilian Boards", "150+", "Major U.S. cities with functioning civilian police oversight boards", "#1e8449"]
      ],
      issues: [],
      trail: []
    },
    {
      id: "governance",
      label: "Governance & Democracy",
      stats: [
        ["Appointed Boards", "12+", "Major Huntsville-area boards with significant public impact and zero elected members", "#dc2626"],
        ["City Council Transparency", "Limited", "No requirement to record or publicly stream all city committee meetings", "#ea580c"],
        ["Campaign Finance Disclosure", "Weak", "Alabama has some of the weakest campaign finance disclosure requirements in the nation", "#dc2626"],
        ["FOIA Response Rate", "Inconsistent", "City of Huntsville public records request response times are not publicly tracked", "#7c3aed"]
      ],
      issues: [],
      trail: []
    }
  ]
};
export default data;
