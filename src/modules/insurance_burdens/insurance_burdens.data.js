const data = {
id: "insurance_burdens",
title: "Insurance Burdens",
intro: "Insurance is sold as protection. In practice it often works like a mandatory payment system that shifts risk back onto ordinary people while insurers, aligned hospital systems, and the officials who keep the rules in place collect the benefit. This module investigates auto, health, dental, vision, homeowners, and the regulators who approve the increases.",
tabs: [
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
id: "health",
label: "Health Insurance",
stats: [
["BCBS Market Share", "39.53%", "Blue Cross Blue Shield of Alabama's share of the state accident-and-health market in 2024", "#dc2626"],
["2026 Premium Increase", "19.3%", "ALDOI-approved average individual market increase for BCBS of Alabama", "#ea580c"],
["Medicaid Gap", "~92,000", "Alabamians estimated by KFF to be stuck in the coverage gap statewide; roughly 12,000 in the Huntsville metro", "#dc2626"],
["Market Concentration", "81.55%", "Share of Alabama accident-and-health market held by BCBS, UnitedHealth, Humana, and VIVA combined", "#7c3aed"]
],
issues: [],
trail: [
{ label: "Alabama Department of Insurance 2024 Market Data", text: "Source for BCBS 39.53% market share, UnitedHealth 28.02%, Humana 8.85%, VIVA figures" },
{ label: "ALDOI 2026 Individual Market Rate Approvals", text: "Source for 19.3% BCBS increase, 20.0% UnitedHealthcare increase, 25.0% Celtic increase" },
{ label: "KFF Health Coverage Data", text: "Source for 92,000 Alabama Medicaid gap estimate; 12,000 Huntsville metro estimate based on 13.5% state share" },
{ label: "Huntsville Housing Authority / VIVA Health materials", text: "Source for VIVA Huntsville Hospital co-branded Medicare Advantage plans in Madison, Limestone, and Morgan counties" }
]
},
{
id: "dental_vision",
label: "Dental & Vision",
stats: [
["Dental: Treated as Optional", "By design", "Dental is excluded from most standard health plans; sold separately with its own limits", "#dc2626"],
["Typical Annual Maximum", "$1,000-$2,000", "Most dental plans cap yearly benefits far below what serious dental work costs", "#ea580c"],
["Vision Plan Coverage", "Exam + allowance", "Most vision plans cover the exam and a fixed frame or contact allowance — not full cost", "#dc2626"],
["Waiting Periods", "6-12 months", "Many dental plans impose waiting periods before covering basic or major services", "#7c3aed"]
],
issues: [],
trail: [
{ label: "BCBS of Alabama dental plan materials", text: "Source for waiting period structure and coverage categories" },
{ label: "Humana dental product marketing", text: "Source for annual maximum structure" },
{ label: "City of Huntsville employee benefits documentation", text: "Source for dental as voluntary add-on and vision allowance structure" }
]
},
{
id: "homeowners",
label: "Homeowners",
stats: [
["Alabama Storm Risk", "High", "North Alabama sits in a significant tornado and severe weather corridor", "#dc2626"],
["Underinsurance Risk", "Common", "Replacement cost coverage gaps leave homeowners short after major losses", "#ea580c"],
["Non-Renewals Rising", "National trend", "Insurers are pulling back from high-risk markets; Alabama is watching the same pressure", "#dc2626"],
["Older Housing Stock", "Concentrated burden", "Older homes — disproportionately in lower-income neighborhoods — face higher premiums and more exclusions", "#7c3aed"]
],
issues: [],
trail: [
{ label: "Alabama Department of Insurance", text: "Source for homeowners rate filing approvals and complaint process" },
{ label: "National flood and storm loss data", text: "Context for North Alabama severe weather risk profile" }
]
},
{
id: "regulation",
label: "Regulation & Oversight",
stats: [
["ALDOI Role", "Rate approver", "The Alabama Department of Insurance approves insurer rate filings including the 2026 increases", "#dc2626"],
["2026 Increases Approved", "19.3% - 25%", "ALDOI approved individual market increases of 19.3% (BCBS), 20% (UnitedHealthcare), and 25% (Celtic) for 2026", "#ea580c"],
["Insurer Influence", "Documented", "Insurance industry is among the top lobbying and donor sectors in Alabama politics", "#dc2626"],
["Consumer Protections", "Weak", "Alabama has limited prior authorization oversight, no rate review with public challenge rights, and no Medicaid expansion", "#7c3aed"]
],
issues: [],
trail: [
{ label: "Alabama Department of Insurance 2024 Annual Report", text: "Source for market share data and regulatory framework" },
{ label: "ALDOI 2026 Rate Approval Records", text: "Source for individual market premium increase approvals" },
{ label: "KFF Health Policy Research", text: "Source for Medicaid gap estimates" }
]
}
]
};
export default data;
