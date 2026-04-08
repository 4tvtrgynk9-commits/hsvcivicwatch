const data = {
id: ‘insurance_burdens’,
title: ‘Insurance Burdens’,
intro: ‘Insurance is sold as protection. In practice it often works like a mandatory payment system that shifts risk back onto ordinary people while insurers, aligned hospital systems, and the officials who keep the rules in place collect the benefit. This module investigates auto, health, dental, vision, homeowners, and the regulators who approve the increases.’,
tabs: [
{
id: ‘auto’,
label: ‘Auto Insurance’,
stats: [
[‘Alabama Requirement’, ‘Mandatory’, ‘Liability insurance required to legally drive and register a vehicle’, ‘#dc2626’],
[‘Credit-Based Pricing’, ‘State-approved’, ‘Alabama allows insurers to use credit history in pricing personal auto policies’, ‘#ea580c’],
[‘Car Dependency’, ‘Near total’, ‘Huntsville has no meaningful public transit alternative for most residents’, ‘#dc2626’],
[‘Enforcement’, ‘Active’, ‘Uninsured motorist penalties include fines, registration suspension, and vehicle impoundment’, ‘#7c3aed’]
],
issues: [
{
id: ‘mandatory_unequal’,
label: ‘Mandatory & Unequal’,
title: ‘Auto insurance is mandatory in Alabama, but the burden is not equal’,
summary: ‘Alabama requires liability insurance to legally drive and register a vehicle. In a city with no meaningful public transit, a car is not optional for most residents — it is the only way to get to work, school, or a grocery store. That makes auto insurance effectively a mandatory cost of participation in economic life. But Alabama also allows insurers to use credit history and ZIP-code-based territory ratings when pricing personal auto policies, which means the mandatory cost is not equally distributed.’,
details: ‘Credit-based pricing is legal in Alabama for personal insurance lines. Insurers use credit scores as a proxy for risk, and regulators have allowed it. The practical effect is that residents with lower credit scores — who are disproportionately lower-income, younger, or from historically disinvested communities — pay more for the same legal requirement. Territory-based pricing means that where you live affects your rate independent of your individual driving record. In a metro where geography, race, and investment patterns are not neutral, territory pricing can produce a heavier burden on some parts of town than others. The result is a system where insurance is mandatory, but the price of that mandate falls harder on residents who already have less.’,
decoder: {
whatsHappening: ‘Alabama has created a system where driving without insurance is illegal, but the cost of that insurance is set by a pricing framework that uses credit and geography as factors. Neither of those factors has a clear, direct relationship to how safely a person drives. They correlate instead with income and zip code.’,
connections: ‘Insurers lobbied for and maintained the right to use credit-based pricing through state legislatures across the country. Alabama is one of the states that allows it without meaningful restriction. The Alabama Department of Insurance approves rate filings from carriers, and those filings include the territory and credit structures that produce unequal pricing.’,
benefits: ‘Insurance carriers benefit from credit and territory pricing because it allows them to charge more to people who have fewer alternatives. The state benefits from mandatory insurance enforcement because it reduces uninsured motorist claims. The residents paying elevated rates for a mandatory product do not benefit from the structure.’,
impact: ‘Residents in lower-income parts of the Huntsville metro — particularly North Huntsville and other historically disinvested areas — likely face higher auto insurance costs than comparable drivers in more affluent ZIP codes. A driver with a lower credit score can pay significantly more than an identical driver with better credit, purely because of a financial metric unrelated to driving behavior.’,
actions: {
intro: ‘Auto insurance pricing is regulated at the state level. The Alabama Department of Insurance approves rate structures. State legislators set the rules insurers must follow.’,
contacts: [
{ name: ‘Alabama Department of Insurance’, role: ‘State regulator that approves auto insurance rate filings’, officialLink: ‘https://www.aldoi.gov’ },
{ name: ‘Alabama Legislature’, role: ‘Sets the rules governing credit-based insurance pricing’, officialLink: ‘https://www.legislature.state.al.us’ }
],
meetings: [
{ title: ‘Alabama Legislature Sessions’, frequency: ‘Annual regular session’, why: ‘Insurance pricing rules are set here. Constituent contact around credit-based pricing reform matters.’ }
],
paths: [
{ destination: ‘ALDOI Consumer Services’, type: ‘Complaint / Rate Inquiry’, why: ‘File a complaint or request information on how your rate was calculated and what factors were used.’ }
],
actions: [
{ label: ‘Contact ALDOI’, kind: ‘primary’, template: { email: ‘’, subject: ‘Request for Information on Credit-Based Auto Insurance Pricing in Alabama’, body: ‘I am requesting information on how Alabama regulates the use of credit history in auto insurance pricing, what restrictions exist on territory-based rating, and what recourse is available to consumers who believe their rate reflects factors unrelated to their driving record.’ } }
]
}
}
}
],
brainstorm: [
{ id: ‘bs_auto_renewal_shock’, label: ‘Renewal Shock’, title: ‘Your rate went up and you did nothing wrong’, summary: ‘Premium increases at renewal with no claims, no tickets, and no changes in coverage are common. Insurers adjust territory and credit factors annually, and policyholders have little recourse.’ },
{ id: ‘bs_auto_north_hsv’, label: ‘North Huntsville Burden’, title: ‘Geography determines price in ways that track race’, summary: ‘Territory-based pricing in a racially and economically divided metro like Huntsville means ZIP code correlates with race and income — and therefore with premium burden.’ },
{ id: ‘bs_auto_uninsured’, label: ‘Uninsured Driver Trap’, title: ‘Falling behind means penalties that make the problem worse’, summary: ‘Drivers who let insurance lapse due to cost face fines, registration suspension, and impoundment — costs that compound the original affordability problem.’ },
{ id: ‘bs_auto_claims_denials’, label: ‘Claims Denials’, title: ‘Paying in without getting anything back’, summary: ‘Policyholders who file claims report delays, underpayment, and outright denials. The insurer collects premiums but contests payouts.’ },
{ id: ‘bs_auto_coverage_gaps’, label: ‘Coverage Gaps’, title: ‘Minimum coverage leaves you exposed’, summary: ‘Alabama minimum liability requirements protect the other driver, not the policyholder. Many residents carry the minimum and are fully exposed in a major accident.’ },
{ id: ‘bs_auto_enforcement’, label: ‘Enforcement Patterns’, title: ‘Traffic stops and insurance enforcement by neighborhood’, summary: ‘If traffic enforcement is heavier in lower-income areas, insurance-related penalties disproportionately fall there too — compounding the premium burden with enforcement costs.’ },
{ id: ‘bs_auto_transit’, label: ‘No Transit Alternative’, title: ‘A mandatory cost with no opt-out’, summary: ‘In a city with no meaningful public transit, insurance is not optional. Residents cannot choose not to drive. The mandate has no escape valve.’ },
{ id: ‘bs_auto_quotes’, label: ‘ZIP Code Quote Audit’, title: ‘Same driver, different address, very different price’, summary: ‘Quote comparisons across North Huntsville, South Huntsville, Madison, and Morgan County ZIP codes would reveal how much territory pricing shifts the burden locally.’ },
{ id: ‘bs_auto_who_keeps’, label: ‘Who Keeps the Rules in Place’, title: ‘Insurer lobbying and the officials who protect credit-based pricing’, summary: ‘Campaign donations from insurance carriers and trade associations to Alabama officials who vote on insurance regulation.’ }
],
trail: [
{ label: ‘Alabama Code Title 32 — Motor Vehicles and Traffic’, text: ‘Source for mandatory liability insurance requirement’ },
{ label: ‘Alabama Department of Insurance’, text: ‘Source for credit-based pricing authorization and rate filing approval process’ }
]
},
{
id: ‘health’,
label: ‘Health Insurance’,
stats: [
[‘BCBS Market Share’, ‘39.53%’, ‘Blue Cross Blue Shield of Alabama's share of the state accident-and-health market in 2024’, ‘#dc2626’],
[‘2026 Premium Increase’, ‘19.3%’, ‘ALDOI-approved average individual market increase for BCBS of Alabama’, ‘#ea580c’],
[‘Medicaid Gap’, ‘~92,000’, ‘Alabamians estimated by KFF to be stuck in the coverage gap statewide; roughly 12,000 in the Huntsville metro’, ‘#dc2626’],
[‘Market Concentration’, ‘81.55%’, ‘Share of Alabama accident-and-health market held by BCBS, UnitedHealth, Humana, and VIVA combined’, ‘#7c3aed’]
],
issues: [
{
id: ‘bcbs_dominance’,
label: ‘BCBS Dominance’,
title: ‘One insurer controls 40% of Alabama's health market — and the state approved a 19% rate hike’,
summary: ‘Blue Cross Blue Shield of Alabama held 39.53% of the state's accident-and-health insurance market in 2024, covering over 2.8 million members including more than 2 million Alabamians. In the Huntsville metro — using the three-county insured adult base of roughly 345,100 people — BCBS likely covers around 270,000 residents. In 2026, the Alabama Department of Insurance approved an average individual market increase of 19.3% for BCBS. That increase did not just happen. A state regulator approved it.’,
details: ‘BCBS of Alabama is not just the dominant statewide insurer. It is specifically embedded in the Huntsville healthcare system. Huntsville Hospital employee benefit materials show BCBS-administered medical plans, and a physician recruitment page cited a payer mix of 60% Blue Cross Blue Shield for one role — meaning BCBS controls both the insurer side and a dominant share of the local provider reimbursement landscape. VIVA Health, which launched Huntsville Hospital co-branded Medicare Advantage plans in Madison, Limestone, and Morgan counties, adds another layer of alignment between the dominant insurer and the dominant hospital system. Together with UnitedHealthcare (28.02% of the Alabama market) and Humana (8.85%), four insurers control 81.55% of Alabama's accident-and-health market. This is not a competitive market. It is a concentrated one, and concentration benefits the insurer, not the insured.’,
decoder: {
whatsHappening: ‘BCBS of Alabama is the dominant health insurer in the state and deeply embedded in Huntsville's provider ecosystem. The Alabama Department of Insurance, the state agency that regulates insurers, approved a 19.3% average premium increase for BCBS in 2026. That approval means every individual market policyholder in Alabama is paying significantly more — not because the market demanded it, but because a regulator allowed it.’,
connections: ‘The alignment between BCBS, Huntsville Hospital Health System, and VIVA creates a market structure where the dominant hospital system is also deeply tied to the dominant insurer. That alignment reduces competitive pressure on both sides. Meanwhile, Alabama has not expanded Medicaid, which pushes more people into the private market where BCBS and its peers set the price.’,
benefits: ‘BCBS of Alabama, UnitedHealthcare, Humana, and VIVA all benefit from a concentrated market with limited competition and an approved rate structure that allows significant premium increases. Huntsville Hospital benefits from its alignment with the dominant insurer through favorable reimbursement arrangements and the VIVA co-branded Medicare Advantage product.’,
impact: ‘Individual market policyholders in the Huntsville metro saw average premiums jump 19.3% for BCBS plans in 2026. Employer-sponsored plan members face cost-shifting through higher deductibles and out-of-pocket maximums. The roughly 12,000 people in the Huntsville metro estimated to be in Alabama's Medicaid gap have no affordable option at all.’,
actions: {
intro: ‘The Alabama Department of Insurance approves rate increases. The Alabama Legislature controls Medicaid expansion. Both are pressure points.’,
contacts: [
{ name: ‘Alabama Department of Insurance’, role: ‘State regulator that approved BCBS 2026 rate increase’, officialLink: ‘https://www.aldoi.gov’ },
{ name: ‘Alabama Legislature’, role: ‘Controls Medicaid expansion decision’, officialLink: ‘https://www.legislature.state.al.us’ },
{ name: ‘Alabama Arise’, role: ‘Statewide advocacy on Medicaid expansion and health coverage’, officialLink: ‘https://www.alarise.org’ }
],
meetings: [
{ title: ‘Alabama Legislature Sessions’, frequency: ‘Annual regular session’, why: ‘Medicaid expansion and insurance regulation reform happen here.’ },
{ title: ‘ALDOI Public Proceedings’, frequency: ‘As scheduled’, why: ‘Rate filings and regulatory actions are public. Request information on how the 19.3% increase was evaluated.’ }
],
paths: [
{ destination: ‘ALDOI Consumer Services’, type: ‘Complaint / Rate Inquiry’, why: ‘File complaints about coverage denials, prior authorization delays, or rate concerns.’ }
],
actions: [
{ label: ‘Contact ALDOI’, kind: ‘primary’, template: { email: ‘’, subject: ‘Request for Justification of 2026 BCBS Rate Increase Approval’, body: ‘The Alabama Department of Insurance approved an average 19.3% individual market premium increase for Blue Cross Blue Shield of Alabama in 2026. I am requesting the public record of the rate filing review, what evidence BCBS provided to justify the increase, and what criteria ALDOI used in its approval decision.’ } }
]
}
}
}
],
brainstorm: [
{ id: ‘bs_health_viva’, label: ‘VIVA + HHHS’, title: ‘When your insurer and your hospital are the same team’, summary: ‘VIVA launched Huntsville Hospital co-branded Medicare Advantage plans. That alignment between dominant insurer and dominant hospital reduces accountability for both.’ },
{ id: ‘bs_health_medicaid_gap’, label: ‘Medicaid Gap’, title: ‘Alabama chose to leave 92,000 people without coverage’, summary: ‘Alabama has not expanded Medicaid. The coverage gap is a political choice, not an inevitability. Roughly 12,000 people in the Huntsville metro are caught in it.’ },
{ id: ‘bs_health_prior_auth’, label: ‘Prior Authorization’, title: ‘Insurers require permission before you get care’, summary: ‘VIVA reported 68,385 prior authorization requests in 2025 with about 2,052 not approved. Prior auth delays treatment and shifts power to the insurer.’ },
{ id: ‘bs_health_insured_still_broke’, label: ‘Insured but Broke’, title: ‘Having insurance does not mean you can afford care’, summary: ‘High deductibles, copays, and out-of-pocket maximums mean insured patients still face bills that push them toward medical debt.’ },
{ id: ‘bs_health_united_humana’, label: ‘UnitedHealth & Humana’, title: ‘The other giants in the room’, summary: ‘UnitedHealth held 28.02% and Humana 8.85% of Alabama's market in 2024. Together with BCBS these three control most of what residents can buy.’ },
{ id: ‘bs_health_donations’, label: ‘Insurer Money in Politics’, title: ‘Who funds the officials who regulate the industry’, summary: ‘Campaign donations from BCBS, hospital-aligned interests, and insurance trade groups to Alabama officials who vote on Medicaid, rate regulation, and insurance law.’ },
{ id: ‘bs_health_network’, label: ‘Network Restrictions’, title: ‘Your plan may not cover the doctor you need’, summary: ‘Narrow networks limit which providers are covered. In a market dominated by one hospital system, network design can effectively steer patients whether they choose it or not.’ },
{ id: ‘bs_health_public_dollars’, label: ‘Public Dollars, Private Profit’, title: ‘Why private insurers benefit from Medicare and Medicaid’, summary: ‘Medicare Advantage and Medicaid managed care plans funnel public dollars to private insurers. VIVA and others are paid by taxpayers to manage public beneficiaries.’ },
{ id: ‘bs_health_celtic’, label: ‘Celtic Insurance 25% Hike’, title: ‘ALDOI approved a 25% increase for a smaller carrier too’, summary: ‘Celtic Insurance Company received a 25% average individual market increase approved by ALDOI in 2026 alongside BCBS and UnitedHealthcare increases.’ }
],
trail: [
{ label: ‘Alabama Department of Insurance 2024 Market Data’, text: ‘Source for BCBS 39.53% market share, UnitedHealth 28.02%, Humana 8.85%, VIVA figures’ },
{ label: ‘ALDOI 2026 Individual Market Rate Approvals’, text: ‘Source for 19.3% BCBS increase, 20.0% UnitedHealthcare increase, 25.0% Celtic increase’ },
{ label: ‘KFF Health Coverage Data’, text: ‘Source for 92,000 Alabama Medicaid gap estimate; 12,000 Huntsville metro estimate based on 13.5% state share’ },
{ label: ‘Huntsville Housing Authority / VIVA Health materials’, text: ‘Source for VIVA Huntsville Hospital co-branded Medicare Advantage plans in Madison, Limestone, and Morgan counties’ }
]
},
{
id: ‘dental_vision’,
label: ‘Dental & Vision’,
stats: [
[‘Dental: Treated as Optional’, ‘By design’, ‘Dental is excluded from most standard health plans; sold separately with its own limits’, ‘#dc2626’],
[‘Typical Annual Maximum’, ‘$1,000–$2,000’, ‘Most dental plans cap yearly benefits far below what serious dental work costs’, ‘#ea580c’],
[‘Vision Plan Coverage’, ‘Exam + allowance’, ‘Most vision plans cover the exam and a fixed frame or contact allowance — not full cost’, ‘#dc2626’],
[‘Waiting Periods’, ‘6–12 months’, ‘Many dental plans impose waiting periods before covering basic or major services’, ‘#7c3aed’]
],
issues: [
{
id: ‘dental_thin_coverage’,
label: ‘Thin Coverage’,
title: ‘Dental insurance is designed to cover maintenance, not real need’,
summary: ‘Dental insurance is not health insurance. It is a product built around annual maximums, waiting periods, and coverage categories that cap payouts well below what serious dental treatment costs. A root canal, crown, or implant can cost $1,500 to $4,000 or more. Most dental plans cap annual benefits at $1,000 to $2,000. The insurance exists, but it does not protect against the costs people actually fear.’,
details: ‘BCBS dental materials show waiting periods for adult basic and adult major services, meaning a new enrollee cannot immediately use their plan for anything beyond preventive care. Humana markets dental products with annual maximums that are prominently featured in marketing but quietly insufficient for real treatment. The City of Huntsville treats dental as a voluntary add-on to employee benefits, and vision as a separate benefit still. Huntsville Hospital employee vision materials show eye exam copays plus fixed frame and contact lens allowances — not full coverage of what eyewear actually costs. These products are structured around insurer payout limits, not patient need. The annual maximum is not a floor. It is a ceiling, and it is a low one.’,
decoder: {
whatsHappening: ‘Dental and vision plans are designed to cover routine maintenance — cleanings, exams — at acceptable cost to the insurer. When real need arises, the caps, waiting periods, and exclusions shift the cost back to the patient. The plan exists, the premiums are collected, but the protection is incomplete.’,
connections: ‘Insurers benefit from separating dental and vision from medical coverage because it allows them to create lower-premium products with high payout limits that sound meaningful but are rarely tested. Employers benefit from offering these plans as visible benefits without bearing the full cost of real coverage. Employees pay premiums and often still pay out of pocket for significant treatment.’,
benefits: ‘Insurers collect premiums and face limited payout exposure because annual maximums cap their liability. Employers can list dental and vision in benefits packages without committing to substantive coverage. Dental and vision providers benefit from a system where patients come in for covered preventive care but pay out of pocket for complex treatment.’,
impact: ‘Residents who need significant dental or vision care quickly discover that their plan covers little of the actual cost. Delayed care due to cost leads to worse outcomes — a cavity becomes a root canal, a root canal becomes an extraction. Oral health and vision health are connected to overall health, and treating them as optional extras has real consequences.’,
actions: {
intro: ‘Dental and vision coverage is shaped by employer benefit decisions and insurance product design. Asking employers and insurers directly about plan limits is the starting point.’,
contacts: [
{ name: ‘Alabama Department of Insurance’, role: ‘Regulates dental and vision insurance products sold in Alabama’, officialLink: ‘https://www.aldoi.gov’ }
],
meetings: [],
paths: [
{ destination: ‘Your Employer HR Department’, type: ‘Direct Inquiry’, why: ‘Ask for a full breakdown of annual maximum, waiting periods, and what percentage of major services your plan covers before you need it.’ }
],
actions: [
{ label: ‘Request Plan Details’, kind: ‘primary’, template: { email: ‘’, subject: ‘Request for Full Dental Plan Coverage Details’, body: ‘I am requesting a complete breakdown of our dental plan including: annual maximum benefit, waiting periods by service category, percentage coverage for basic and major services, and any exclusions that apply to implants, orthodontia, or other major treatment.’ } }
]
}
}
}
],
brainstorm: [
{ id: ‘bs_dv_annual_max’, label: ‘The Annual Cap Problem’, title: ‘The plan maximum is a ceiling, not real protection’, summary: ‘Most dental plans cap benefits at $1,000-$2,000 a year. One crown can exceed that. The cap protects the insurer more than the patient.’ },
{ id: ‘bs_dv_waiting’, label: ‘Waiting Periods’, title: ‘You paid premiums before you could use the plan’, summary: ‘Waiting periods of 6-12 months for basic and major services mean new enrollees are paying for coverage they cannot yet use.’ },
{ id: ‘bs_dv_vision_allowance’, label: ‘Frame Allowance Gap’, title: ‘Your vision plan covers the exam and part of the glasses’, summary: ‘Fixed frame and contact lens allowances often fall short of actual eyewear costs, leaving patients with out-of-pocket bills even with vision coverage.’ },
{ id: ‘bs_dv_add_on_trap’, label: ‘The Add-On Trap’, title: ‘Dental and vision are separated from health coverage by design’, summary: ‘The separation allows insurers to create lower-premium products with high visibility and low real protection. Employees may not realize the limits until they need care.’ },
{ id: ‘bs_dv_medicaid_dental’, label: ‘Medicaid Dental Gaps’, title: ‘Adult Medicaid dental coverage in Alabama is limited’, summary: ‘Alabama Medicaid provides limited dental benefits for adults. People in the coverage gap have no dental coverage at all.’ },
{ id: ‘bs_dv_delayed_care’, label: ‘Delayed Care Outcomes’, title: ‘When people skip dental care because of cost’, summary: ‘Deferred dental care leads to more serious and expensive conditions. Oral health connects to cardiovascular health, diabetes management, and pregnancy outcomes.’ },
{ id: ‘bs_dv_local_burden’, label: ‘Local Dental Desert’, title: ‘Access to affordable dental care in the Huntsville metro’, summary: ‘Community health centers and sliding-scale dental providers in Madison, Limestone, and Morgan counties — who has access and who does not.’ }
],
trail: [
{ label: ‘BCBS of Alabama dental plan materials’, text: ‘Source for waiting period structure and coverage categories’ },
{ label: ‘Humana dental product marketing’, text: ‘Source for annual maximum structure’ },
{ label: ‘City of Huntsville employee benefits documentation’, text: ‘Source for dental as voluntary add-on and vision allowance structure’ }
]
},
{
id: ‘homeowners’,
label: ‘Homeowners’,
stats: [
[‘Alabama Storm Risk’, ‘High’, ‘North Alabama sits in a significant tornado and severe weather corridor’, ‘#dc2626’],
[‘Underinsurance Risk’, ‘Common’, ‘Replacement cost coverage gaps leave homeowners short after major losses’, ‘#ea580c’],
[‘Non-Renewals Rising’, ‘National trend’, ‘Insurers are pulling back from high-risk markets; Alabama is watching the same pressure’, ‘#dc2626’],
[‘Older Housing Stock’, ‘Concentrated burden’, ‘Older homes — disproportionately in lower-income neighborhoods — face higher premiums and more exclusions’, ‘#7c3aed’]
],
issues: [
{
id: ‘storm_underinsurance’,
label: ‘Storm & Underinsurance’,
title: ‘North Alabama storm risk is real, and many homeowners are not fully covered for it’,
summary: ‘North Alabama sits in a significant tornado and severe weather corridor. Huntsville and Madison County have experienced major tornado events, hail damage, and severe storm losses. Homeowners insurance is supposed to protect against exactly this kind of risk. But a combination of rising premiums, policy exclusions, replacement cost gaps, and coverage limits means many homeowners who think they are protected discover after a loss that they are not fully covered.’,
details: ‘Underinsurance is one of the most common and least discussed problems in homeowners coverage. A home insured for its purchase price or its assessed value may be significantly underinsured relative to what it would actually cost to rebuild at current construction prices. Material and labor costs have risen sharply since 2020. A policy written in 2019 may cover only 60-70% of today's replacement cost. Insurers are also increasingly using actual cash value rather than replacement cost coverage for roofs, which means a hail-damaged roof is paid out at depreciated value — far less than what a new roof costs. Meanwhile, some carriers are pulling back from high-risk markets or adding wind and hail exclusions that shift those exact storm risks back to the homeowner.’,
decoder: {
whatsHappening: ‘Homeowners in North Alabama pay premiums for coverage that may not match their actual rebuild cost, may exclude the exact storm damage most likely to occur, and may be subject to non-renewal if the insurer decides the risk profile has changed. The protection is real on paper but incomplete in practice.’,
connections: ‘Insurance carriers benefit from collecting premiums while managing payout exposure through depreciation schedules, exclusions, and replacement cost caps. State regulation approves these structures. After a major disaster, the gap between coverage and actual loss falls entirely on the homeowner.’,
benefits: ‘Insurers who use actual cash value depreciation on roofs and components collect full premiums while limiting payout on one of the most common claim types in a storm-prone region. Carriers who add wind or hail exclusions reduce their loss exposure while continuing to collect premiums on the remaining coverage.’,
impact: ‘Homeowners who suffer major storm losses and discover their coverage is insufficient face the full gap out of pocket. For lower-income homeowners, that gap can mean an unrepaired home, mounting debt, or displacement. The communities with the oldest housing stock — often lower-income and majority-minority neighborhoods — tend to face both higher premiums and more restrictive coverage terms.’,
actions: {
intro: ‘Review your policy before a storm, not after. Ask specifically about replacement cost vs. actual cash value, roof coverage terms, and wind or hail exclusions.’,
contacts: [
{ name: ‘Alabama Department of Insurance’, role: ‘State regulator; handles homeowners insurance complaints’, officialLink: ‘https://www.aldoi.gov’ }
],
meetings: [],
paths: [
{ destination: ‘ALDOI Consumer Services’, type: ‘Complaint’, why: ‘If a claim is denied or underpaid, file a complaint with ALDOI. Keep all documentation of the loss, the claim, and the insurer's response.’ }
],
actions: [
{ label: ‘Review Your Policy Now’, kind: ‘primary’, template: { email: ‘’, subject: ‘Request for Policy Coverage Review — Replacement Cost and Storm Exclusions’, body: ‘I am requesting a written explanation of my current homeowners policy covering: (1) whether my dwelling coverage reflects current replacement cost or a prior valuation, (2) whether my roof is covered at replacement cost or actual cash value, (3) any wind, hail, or named storm exclusions that apply to my policy, and (4) the process for requesting a coverage limit increase.’ } }
]
}
}
}
],
brainstorm: [
{ id: ‘bs_home_premiums’, label: ‘Rising Premiums’, title: ‘Homeowners insurance is getting more expensive across Alabama’, summary: ‘Alabama premium trends, which carriers are raising rates, and what ALDOI has approved.’ },
{ id: ‘bs_home_nonrenewal’, label: ‘Non-Renewals’, title: ‘Insurers are choosing not to renew in higher-risk areas’, summary: ‘National non-renewal trends reaching Alabama — which areas are most exposed and what homeowners can do when their policy is dropped.’ },
{ id: ‘bs_home_flood’, label: ‘Flood Coverage Gap’, title: ‘Standard homeowners policies do not cover flooding’, summary: ‘Flood insurance is separate, often federal (NFIP), and many homeowners in flood-prone areas do not have it. Huntsville has known drainage and floodplain issues.’ },
{ id: ‘bs_home_older_homes’, label: ‘Older Home Burden’, title: ‘Older housing stock pays more and gets less’, summary: ‘Homes built before modern codes face higher premiums, more exclusions, and stricter underwriting. These homes are concentrated in lower-income and historically disinvested neighborhoods.’ },
{ id: ‘bs_home_landlord_passthrough’, label: ‘Landlord Cost Passthrough’, title: ‘When landlord insurance costs go up, rent goes up’, summary: ‘Rising landlord insurance premiums are passed to tenants through rent increases. Renters absorb the cost of a risk they do not own.’ },
{ id: ‘bs_home_claims_dispute’, label: ‘Claims Disputes’, title: ‘What happens when the insurer and the homeowner disagree on the damage’, summary: ‘Public adjusters, appraisal clauses, and the claims dispute process in Alabama.’ },
{ id: ‘bs_home_infrastructure’, label: ‘Public Infrastructure and Private Cost’, title: ‘When city drainage failures raise your insurance bill’, summary: ‘Huntsville drainage and stormwater infrastructure condition and its potential effect on property flood risk and insurance pricing.’ }
],
trail: [
{ label: ‘Alabama Department of Insurance’, text: ‘Source for homeowners rate filing approvals and complaint process’ },
{ label: ‘National flood and storm loss data’, text: ‘Context for North Alabama severe weather risk profile’ }
]
},
{
id: ‘regulation’,
label: ‘Regulation & Oversight’,
stats: [
[‘ALDOI Role’, ‘Rate approver’, ‘The Alabama Department of Insurance approves insurer rate filings including the 2026 increases’, ‘#dc2626’],
[‘2026 Increases Approved’, ‘19.3% — 25%’, ‘ALDOI approved individual market increases of 19.3% (BCBS), 20% (UnitedHealthcare), and 25% (Celtic) for 2026’, ‘#ea580c’],
[‘Insurer Influence’, ‘Documented’, ‘Insurance industry is among the top lobbying and donor sectors in Alabama politics’, ‘#dc2626’],
[‘Consumer Protections’, ‘Weak’, ‘Alabama has limited prior authorization oversight, no rate review with public challenge rights, and no Medicaid expansion’, ‘#7c3aed’]
],
issues: [
{
id: ‘aldoi_accountability’,
label: ‘ALDOI Accountability’,
title: ‘The agency that regulates insurance also approved the biggest premium increases in years’,
summary: ‘The Alabama Department of Insurance is the state agency responsible for regulating insurance carriers, approving rate filings, and protecting consumers. In 2026, ALDOI approved average individual market premium increases of 19.3% for BCBS of Alabama, 20.0% for UnitedHealthcare, and 25.0% for Celtic Insurance Company. These increases did not happen because no one was watching. They happened because the regulator whose job is to protect consumers approved them.’,
details: ‘ALDOI reviews rate filings submitted by insurance carriers and approves, modifies, or rejects them. The standard is whether the rate is actuarially justified — not whether it is affordable, not whether it is reasonable relative to insurer profit margins, and not whether consumers can absorb it. Alabama does not have a prior approval process with meaningful public participation rights, meaning consumers and advocates cannot formally challenge a rate filing before it is approved. The result is a regulatory system that is structurally oriented toward insurer solvency rather than consumer protection. When an insurer says rates need to increase to cover projected losses, ALDOI evaluates the actuarial math. Whether that math accounts for insurer profit targets, executive compensation, or administrative overhead in ways that inflate the justification is not transparent to the public.’,
decoder: {
whatsHappening: ‘ALDOI is not a neutral body. It sits inside a state political system where insurance industry interests are organized, funded, and present. The commissioners who lead ALDOI are appointed by the governor. The governor and legislators who oversee the agency receive campaign contributions from insurance industry donors. That does not prove corruption, but it does explain why the regulatory framework consistently produces outcomes that favor insurers.’,
connections: ‘The insurance industry is among the most active lobbying and campaign donor sectors in Alabama politics. Insurer PACs, trade association PACs, and individual carrier contributions flow to legislators who write insurance law and to governors who appoint insurance commissioners. The officials who approve 19% premium increases are not operating in a vacuum — they are operating in a political ecosystem shaped by industry money.’,
benefits: ‘Insurers benefit from a regulatory system that approves rate increases without requiring them to justify profit margins or executive compensation as factors. Officials benefit from campaign contributions that do not legally require any specific action in return but that come disproportionately from industries operating under their regulatory authority.’,
impact: ‘Alabama policyholders face premium increases approved by a regulator with limited consumer advocacy infrastructure, no meaningful public challenge process, and a political environment shaped by industry influence. The 2026 increases are real costs absorbed by real people. The regulatory process that approved them is not designed to prioritize their interests.’,
actions: {
intro: ‘ALDOI is a public agency. Its rate decisions are public records. The officials who oversee it are elected or appointed by elected officials. All of those are accountability levers.’,
contacts: [
{ name: ‘Alabama Department of Insurance’, role: ‘Rate filing approvals and consumer complaints’, officialLink: ‘https://www.aldoi.gov’ },
{ name: ‘Alabama Governor's Office’, role: ‘Appoints the Insurance Commissioner’, officialLink: ‘https://governor.alabama.gov’ },
{ name: ‘Alabama Legislature’, role: ‘Writes insurance regulation law and oversight authority’, officialLink: ‘https://www.legislature.state.al.us’ }
],
meetings: [
{ title: ‘Alabama Legislature Sessions’, frequency: ‘Annual regular session’, why: ‘Insurance regulation reform, prior authorization oversight, and consumer protection bills are introduced here.’ }
],
paths: [
{ destination: ‘ALDOI Public Records’, type: ‘Open Records Request’, why: ‘Request the rate filing submissions from BCBS, UnitedHealthcare, and Celtic that supported the 2026 increases, including actuarial justification documents.’ }
],
actions: [
{ label: ‘Request Rate Filing Records’, kind: ‘primary’, template: { email: ‘’, subject: ‘Public Records Request: 2026 Individual Market Rate Filing Justifications’, body: ‘I am requesting copies of the rate filing submissions, actuarial memoranda, and ALDOI review records for the 2026 individual market premium increases approved for Blue Cross Blue Shield of Alabama (19.3%), UnitedHealthcare (20.0%), and Celtic Insurance Company (25.0%).’ } }
]
}
}
}
],
brainstorm: [
{ id: ‘bs_reg_donations’, label: ‘Insurer Donations’, title: ‘Which Alabama officials receive money from insurance industry donors’, summary: ‘Campaign finance records showing insurance carrier, insurer PAC, and trade association contributions to Alabama officials who regulate or legislate on insurance.’ },
{ id: ‘bs_reg_complaints’, label: ‘Consumer Complaint Volume’, title: ‘How many Alabamians complain to ALDOI and what happens’, summary: ‘ALDOI complaint data by insurer, complaint type, and resolution — and whether complaint rates correlate with the carriers that received the largest rate increases.’ },
{ id: ‘bs_reg_prior_auth’, label: ‘Prior Authorization Reform’, title: ‘Alabama has no strong prior authorization oversight law’, summary: ‘Other states have passed prior authorization reform bills. Alabama has not. The officials who could change that and the industry interests that benefit from the status quo.’ },
{ id: ‘bs_reg_medicaid_politics’, label: ‘Medicaid Expansion Politics’, title: ‘Who benefits from Alabama not expanding Medicaid’, summary: ‘Private insurers benefit from Medicaid non-expansion because it pushes more people into the private market. The political money behind Alabama's continued refusal.’ },
{ id: ‘bs_reg_commissioner’, label: ‘The Insurance Commissioner’, title: ‘Who is Alabama's insurance regulator and who appointed them’, summary: ‘Profile of the Alabama Insurance Commissioner, their background, appointment process, and any industry ties.’ },
{ id: ‘bs_reg_bills_killed’, label: ‘Bills That Died’, title: ‘Insurance protection bills that were introduced and went nowhere’, summary: ‘Alabama legislative history on prior authorization reform, credit-based pricing limits, rate review reform, and other consumer protection measures.’ },
{ id: ‘bs_reg_better_models’, label: ‘What Other States Do’, title: ‘States with stronger insurance consumer protections’, summary: ‘Comparison of states with prior approval with public challenge rights, credit-based pricing restrictions, stronger prior authorization oversight, and Medicaid expansion.’ }
],
trail: [
{ label: ‘Alabama Department of Insurance 2024 Annual Report’, text: ‘Source for market share data and regulatory framework’ },
{ label: ‘ALDOI 2026 Rate Approval Records’, text: ‘Source for individual market premium increase approvals’ },
{ label: ‘KFF Health Policy Research’, text: ‘Source for Medicaid gap estimates’ }
]
}
]
};
export default data;