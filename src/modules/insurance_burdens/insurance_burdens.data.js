const data = {
  id: "insurance_burdens",
  title: "Insurance Burdens",
  intro: "Insurance is sold as protection. In practice it often works like a mandatory payment system that shifts risk back onto ordinary people while insurers, aligned hospital systems, and the officials who keep the rules in place collect the benefit. This module investigates health, auto, dental, vision, and homeowners insurance — and the regulators who approve the increases.",
  tabs: [
    {
      id: "health",
      label: "Health Insurance",
      stats: [
        ["BCBS Market Share", "39.53%", "Blue Cross Blue Shield of Alabama share of state accident-and-health market in 2024", "#dc2626"],
        ["2026 Premium Increase", "19.3%", "ALDOI-approved average individual market increase for BCBS of Alabama", "#ea580c"],
        ["Medicaid Gap", "~92,000", "Alabamians stuck in the coverage gap statewide; roughly 12,000 in the Huntsville metro", "#dc2626"],
        ["Market Concentration", "81.55%", "Share of Alabama accident-and-health market held by BCBS, UnitedHealth, Humana, and VIVA combined", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Department of Insurance 2024 Market Data", text: "Source for BCBS 39.53% market share and related figures" },
        { label: "ALDOI 2026 Individual Market Rate Approvals", text: "Source for 19.3% BCBS increase and other 2026 approvals" },
        { label: "KFF Health Coverage Data", text: "Source for 92,000 Alabama Medicaid gap estimate" }
      ]
    },
    {
      id: "auto",
      label: "Auto Insurance",
      stats: [
        ["Alabama Requirement", "Mandatory", "Liability insurance required to legally drive and register a vehicle", "#dc2626"],
        ["Credit-Based Pricing", "State-approved", "Alabama allows insurers to use credit history in pricing personal auto policies", "#ea580c"],
        ["Car Dependency", "Near total", "Huntsville has no meaningful public transit alternative for most residents", "#dc2626"],
        ["Enforcement", "Active", "Uninsured motorist penalties include fines, registration suspension, and vehicle impoundment", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Code Title 32 — Motor Vehicles and Traffic", text: "Source for mandatory liability insurance requirement" },
        { label: "Alabama Department of Insurance", text: "Source for credit-based pricing authorization and rate filing approval process" }
      ]
    },
    {
      id: "dental_vision",
      label: "Dental & Vision",
      stats: [
        ["Dental: Treated as Optional", "By design", "Dental is excluded from most standard health plans and sold separately with its own limits", "#dc2626"],
        ["Typical Annual Maximum", "$1,000-$2,000", "Most dental plans cap yearly benefits far below what serious dental work costs", "#ea580c"],
        ["Vision Plan Coverage", "Exam + allowance", "Most vision plans cover the exam and a fixed frame or contact allowance only", "#dc2626"],
        ["Waiting Periods", "6-12 months", "Many dental plans impose waiting periods before covering basic or major services", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "BCBS of Alabama dental plan materials", text: "Source for waiting period structure and coverage categories" },
        { label: "City of Huntsville employee benefits documentation", text: "Source for dental as voluntary add-on and vision allowance structure" }
      ]
    },
    {
      id: "homeowners",
      label: "Homeowners",
      stats: [
        ["Alabama Storm Risk", "High", "North Alabama sits in a significant tornado and severe weather corridor", "#dc2626"],
        ["Underinsurance Risk", "Common", "Replacement cost coverage gaps leave homeowners short after major losses", "#ea580c"],
        ["Non-Renewals Rising", "National trend", "Insurers are pulling back from high-risk markets across the country", "#dc2626"],
        ["Older Housing Stock", "Concentrated burden", "Older homes in lower-income neighborhoods face higher premiums and more exclusions", "#7c3aed"]
      ],
      issues: [],
      trail: [
        { label: "Alabama Department of Insurance", text: "Source for homeowners rate filing approvals and complaint process" },
        { label: "National flood and storm loss data", text: "Context for North Alabama severe weather risk profile" }
      ]
    }
  ]
};
export default data;
