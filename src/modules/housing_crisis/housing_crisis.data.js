const data = {
id: “housing_crisis”,
title: “Housing Crisis”,
intro: “Huntsville says it is focused on affordability, but the visible pipeline is still dominated by luxury and market-rate development while deeply affordable housing remains smaller, slower, and more conditional. This module tracks who gets built for, who gets pushed out, and who benefits from the gap.”,
tabs: [
{
id: “overview”,
label: “Overview”,
stats: [
[“2024 New Units”, “6,404”, “81% were multifamily — the most since 1984”, “#dc2626”],
[“Renters Cost-Burdened”, “~40%”, “Pay more than 30% of income on rent and utilities”, “#ea580c”],
[“Living Wage Gap”, “$22.81/hr”, “What a single adult in Madison County needs just to survive”, “#dc2626”],
[“Unhoused in Huntsville”, “~600”, “Estimated by local advocates and city data”, “#7c3aed”]
],
issues: [
{
id: “counting_units”,
label: “Units vs. Affordability”,
title: “The city is counting units. That is not the same as counting affordability.”,
summary: “Huntsville celebrated 6,404 new residential units in 2024, with 81% tied to multifamily construction — the most completed in a single year since 1984. Mayor Tommy Battle said the city's focus is on "maintaining affordability." But counting units produced is not the same as showing those units are affordable to the people already living here.”,
details: “The city's own 2024 Development Review frames the boom as proof of a successful "economic growth strategy." Shane Davis, Director of Urban and Economic Development, credited 46,000 new jobs since 2014 as the engine. That framing makes sense for high-skill workers in defense and tech. It explains far less about what a food service worker, retail clerk, or home health aide is supposed to do when the apartment pipeline is built for a different income level. A city can post record construction numbers and still leave its existing workforce priced out. The question is never just how many units, but affordable at what rent, for what income, with what screening rules.”,
decoder: {
whatsHappening: “Huntsville is producing more housing than at any point in decades, but the official metrics focus entirely on volume. The city counts occupancy certificates and permit totals. It does not publicly report what share of new units are affordable at area median income, or at 50% or 30% of AMI, where the real pressure is.”,
connections: “The growth narrative serves the city's economic development goals, the chamber ecosystem, and developers who need favorable permitting and infrastructure support. Framing production as proof of affordability lets officials answer affordability criticism with construction data, without being accountable for who those units actually serve.”,
benefits: “Developers, commercial real estate investors, downtown business interests, and the city's tax base all benefit when high-density, market-rate development is framed as the answer to affordability. It justifies approvals without requiring affordability conditions.”,
impact: “Working-class residents, renters in the lower half of the income scale, and people relocating from public housing are the ones who absorb the cost of a gap between what gets built and what they can afford. The 40% cost-burden rate — where renters pay more than 30% of income on housing — is one concrete measure of that pressure.”,
actions: {
intro: “If you want to push the city to account for who its housing pipeline actually serves, the council and planning process are the pressure points.”,
contacts: [
{ name: “Huntsville City Council”, role: “5-member council with land use and budget authority”, officialLink: “https://www.huntsvilleal.gov/city-council/” },
{ name: “City Planning Department”, role: “Reviews and recommends development approvals”, officialLink: “https://www.huntsvilleal.gov/planning/” }
],
meetings: [
{ title: “City Council Regular Meetings”, frequency: “Twice monthly, typically Thursday evenings”, why: “Public comment is available. Zoning and development approvals pass here.” },
{ title: “Planning Commission Meetings”, frequency: “Monthly”, why: “Where rezonings and major development applications are first reviewed.” }
],
paths: [
{ destination: “City Council Members”, type: “Email / Phone”, why: “Ask what share of new units are priced at 60% AMI or below, and what the city's formal affordability benchmarks are.” }
],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Request for Affordability Breakdown in New Housing Production”, body: “I am asking the city council to provide a public breakdown of how many of the 6,404 residential units completed in 2024 are priced at or below 60% of area median income, and what affordability conditions were attached to any publicly subsidized or TIF-assisted developments.” } }
]
}
}
},
{
id: “class_story”,
label: “Class Story”,
title: “Huntsville's growth story is also a class story”,
summary: “The city's prosperity narrative centers on defense contracts, tech jobs, and a growing professional class. But the same economy runs on tens of thousands of manufacturing, retail, food service, and hospitality workers whose wages have not kept pace with the housing market that growth has produced.”,
details: “Alabama labor data shows roughly 35,000 manufacturing jobs, 28,000 retail jobs, and 25,000 leisure and hospitality jobs in the metro, including about 20,000 in food service. MIT Living Wage data for Madison County shows the average food preparation and serving wage is about $28,170 a year. A single adult needs $47,437 before taxes just to cover basics. The gap is not a planning failure. It is a structural feature: a city built on two separate economic tracks, one visible and celebrated, one invisible and cost-burdened.”,
decoder: {
whatsHappening: “Huntsville's economy is split. High-skill workers in defense, aerospace, and tech are well-compensated and are the primary audience for the city's growth branding. The much larger workforce in service, retail, production, and care sectors earns incomes that fit neither the new construction market nor the rising cost of existing rentals.”,
connections: “The Chamber of Commerce, the Committee of 100, and business-aligned political infrastructure shape which sectors get the most attention and infrastructure investment. The result is a city where economic wins are real but unevenly distributed, and where housing policy does not appear to account for the lower half of the wage scale.”,
benefits: “Employers who pay sub-living wages benefit from a community narrative that does not focus on wage levels. Developers benefit from building for the upper market. The political class benefits from claiming prosperity without being held to account for the conditions of the majority of the workforce.”,
impact: “Workers in food service, retail, healthcare support, and similar roles are the ones most likely to be cost-burdened, most likely to face long commutes, and least likely to be represented in housing policy discussions. They are the people the city's growth machine relies on and does not build for.”,
actions: {
intro: “Connecting wage reality to housing policy requires pushing both on the development pipeline and on the city's labor and workforce conversation.”,
contacts: [
{ name: “Huntsville City Council”, role: “Budget and development authority”, officialLink: “https://www.huntsvilleal.gov/city-council/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Public comment is available. Ask council members how they define affordability and which income tiers the housing pipeline is actually serving.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Housing Policy for the Full Workforce, Not Just the Top”, body: “I am asking the Huntsville City Council to explain how housing policy addresses the needs of workers in food service, retail, manufacturing, and care sectors, whose average wages fall significantly below what the MIT Living Wage Calculator shows is needed to afford current market-rate housing in Madison County.” } }
]
}
}
},
{
id: “crisis_before_unhoused”,
label: “Before Unhoused”,
title: “The housing crisis starts long before someone ends up on the street”,
summary: “Public attention tends to focus on visible unhoused populations. But the crisis is larger than that. A local housing provider reported that some nominally "affordable" apartments were "roach-infested" and "not up to living standards," and said the Huntsville Housing Authority had told her that for many clients, "the best thing is to leave Huntsville." Telling people to leave is not a housing plan.”,
details: “Housing insecurity exists on a spectrum. It starts with a single adult spending 40% of their paycheck on rent, includes families in substandard conditions who can't afford to move, and ends with people sleeping outside. Each step on that path is connected. When affordable supply is thin and what exists is deteriorating, the exit routes narrow. The official response to homelessness in Huntsville — emphasizing services, shelter referrals, and individual-level solutions — is disconnected from the upstream supply and wage conditions that keep pushing people down that path.”,
decoder: {
whatsHappening: “Huntsville's visible housing conversation is about new construction. The less visible conversation is about whether existing low-cost rentals are safe and habitable, whether voucher holders can actually use their vouchers, and whether the path from housing instability to homelessness has any real off-ramps.”,
connections: “Weak landlord accountability, limited code enforcement, and a landlord-friendly state legal framework all contribute to conditions where nominally affordable units do not actually function as decent housing. Without stronger tenant protections, affordable stock deteriorates while supply stays low.”,
benefits: “Landlords who maintain substandard properties benefit from a tight market where tenants have few alternatives. The city benefits politically from not having to account for conditions inside the existing affordable stock.”,
impact: “Tenants in the lowest-cost rentals absorb the cost of inadequate conditions, limited alternatives, and a legal system that moves faster toward eviction than toward habitability enforcement.”,
actions: {
intro: “Habitability standards and code enforcement are city functions. So is the decision about whether to require affordability conditions on subsidized development.”,
contacts: [
{ name: “Huntsville Housing Authority”, role: “Administers public housing and voucher programs”, officialLink: “https://hsvha.org” },
{ name: “City Community Development Department”, role: “Oversees code enforcement and community housing programs”, officialLink: “https://www.huntsvilleal.gov/community-development/” }
],
meetings: [
{ title: “Huntsville Housing Authority Board Meetings”, frequency: “Monthly”, why: “Public body. Ask about voucher acceptance rates, waitlist status, and habitability standards in the voucher program.” }
],
paths: [
{ destination: “City Community Development”, type: “Complaint / Inquiry”, why: “File or ask about code enforcement processes for substandard rental conditions.” }
],
actions: [
{ label: “Contact HHA Board”, kind: “primary”, template: { email: “”, subject: “Request for Voucher Acceptance, Waitlist, and Habitability Data”, body: “I am requesting current data on the Huntsville Housing Authority voucher waitlist length, voucher acceptance rates by area, habitability standards applied to voucher-assisted units, and what options exist for tenants in units that do not meet those standards.” } }
]
}
}
}
],
trail: [
{ label: “City of Huntsville 2024 Development Review”, text: “Source for permit totals, multifamily share, and occupancy certificate figures” },
{ label: “MIT Living Wage Calculator — Madison County, AL”, text: “Source for income requirements by household type; data updated February 2026” },
{ label: “SPLC / Love Huntsville reporting, January 2025”, text: “Source for 40% cost-burden figure and local advocate quotes on affordable housing conditions” }
]
},
{
id: “affordability”,
label: “Affordability”,
stats: [
[“Single Adult Living Wage”, “$22.81/hr”, “Or $47,437/yr before taxes just to cover basics in Madison County”, “#dc2626”],
[“Family of 4 Living Wage”, “$104,712/yr”, “Required before taxes when both adults work, with two children”, “#ea580c”],
[“Food Service Average Pay”, “$28,170/yr”, “BLS Huntsville metro data — vs. $47,437 needed to survive alone”, “#dc2626”],
[“Healthcare Support Pay”, “$33,290/yr”, “Still nearly $15,000 short of a single adult living wage”, “#7c3aed”]
],
issues: [
{
id: “jobs_dont_match_rent”,
label: “Jobs vs. Rent”,
title: “The jobs Huntsville runs on do not pay what Huntsville housing now costs”,
summary: “The MIT Living Wage Calculator shows a single adult in Madison County needs $22.81 an hour — about $47,437 a year before taxes — just to cover basic expenses. That is not a comfortable budget. It is a survival budget. Food service workers in the metro average $28,170 a year. Healthcare support workers average $33,290. Production workers average $46,110. The math does not work for most of the workforce that keeps the city running.”,
details: “The living wage figure covers food, housing, transportation, medical, and other basics — not savings, not emergencies, not entertainment. MIT's housing cost estimate for Madison County is about $12,953 a year for a single adult renting alone, which corresponds to roughly $1,079 a month. That figure represents the lower end of current market averages. As market-rate construction focuses on higher price points, even that baseline is under pressure. The standard financial rule that renters should spend no more than 30% of income on housing means a food service worker earning $28,170 can afford about $705 a month. That number is increasingly disconnected from actual available inventory.”,
decoder: {
whatsHappening: “A large share of Huntsville's working population is employed in sectors where wages are structurally below what the housing market now requires. This is not a temporary mismatch. It is a durable gap that grows whenever construction skews toward the upper market and wage growth in service sectors stays flat.”,
connections: “Employers in food service, retail, and hospitality benefit from workers who cannot afford to leave the local area but also cannot afford to live comfortably within it. The city's economic development strategy has not historically included wage standards as part of how it evaluates growth.”,
benefits: “Low-wage employers maintain a captive workforce. Developers who build for the upper market avoid affordability conditions. The city's revenue base grows with market-rate property values. The workers who do not benefit are not the ones at the table when development agreements are negotiated.”,
impact: “For workers earning at or near $28,000 to $35,000 a year, the housing market leaves almost no margin. Cost-burdening — spending more than 30% of income on housing — is not a personal failure. It is the predictable result of a wage and housing market that are moving in different directions.”,
actions: {
intro: “The connection between wages and housing costs is a policy choice, not an immutable fact. Councils can tie development incentives to affordability. They can ask employers receiving public subsidies what they pay.”,
contacts: [
{ name: “Huntsville City Council”, role: “Development and budget authority”, officialLink: “https://www.huntsvilleal.gov/city-council/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Raise the gap between local wages and housing costs in public comment.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Wage and Housing Affordability Gap in Huntsville”, body: “MIT Living Wage data shows a single adult in Madison County needs $47,437 a year before taxes just to meet basic needs. BLS data shows food service workers in the metro average $28,170 a year. I am asking the council to explain what city housing and development policy does to address this structural gap, and whether affordability conditions are attached to any publicly supported development.” } }
]
}
}
},
{
id: “luxury_first”,
label: “Luxury First”,
title: “Luxury gets built faster than affordability”,
summary: “The Front Row project is adding 545 luxury apartments to downtown Huntsville, paired with high-end retail and office space. It is a visible symbol of the development pipeline. Affordable projects do exist, but they are smaller, slower, and typically require stacked subsidy structures that take years to assemble. The result is that the market builds what pencils easiest, and what pencils easiest is not what most Huntsville workers can afford.”,
details: “Luxury and market-rate development moves faster because it does not require Low Income Housing Tax Credits, competitive federal grants, housing authority partnerships, or multi-year planning timelines. Affordable development almost always requires all of those. The gap in production speed is not a coincidence — it is a feature of how the incentive structure works. The city has not, as of this writing, made affordability conditions a standard requirement for approvals of large market-rate projects. When affordability is present, it tends to be voluntary, promotional, or tied to specific public financing vehicles rather than baseline standards.”,
decoder: {
whatsHappening: “The private development market produces what returns the most profit. Without mandatory affordability requirements tied to zoning approvals or infrastructure support, the market will continue to produce at the upper end. Huntsville's current policy framework does not require developers to build affordable units as a condition of approval.”,
connections: “Developers, business improvement districts, and downtown property interests benefit from high-end residential development that raises surrounding property values. Local political networks that rely on business-sector support have limited incentive to impose conditions that reduce developer margins.”,
benefits: “Market-rate and luxury developers, downtown commercial property owners, and investors in adjacent real estate all benefit from the current pipeline. The city's assessed property values also benefit, which funds general city operations — creating a fiscal incentive to favor higher-value development.”,
impact: “Residents earning below area median income, service workers, and people relying on the voucher program bear the cost of a market that is not building for them. As luxury supply increases, the gap between visible new housing and actually accessible housing widens.”,
actions: {
intro: “Inclusionary zoning and affordability conditions on development approvals are the structural levers. These are city council decisions.”,
contacts: [
{ name: “Huntsville City Council”, role: “Zoning and development authority”, officialLink: “https://www.huntsvilleal.gov/city-council/” },
{ name: “City Planning Department”, role: “Reviews development applications and recommends conditions”, officialLink: “https://www.huntsvilleal.gov/planning/” }
],
meetings: [
{ title: “Planning Commission Meetings”, frequency: “Monthly”, why: “This is where major development applications are reviewed. Public comment is available.” },
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Final approval authority on rezonings and development agreements.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Affordable Unit Requirements for Large Residential Developments”, body: “I am asking the Huntsville City Council whether the city requires any percentage of affordable units in large residential developments like the Front Row project, and if not, what would be required to establish an inclusionary zoning or affordability condition policy.” } }
]
}
}
},
{
id: “single_adult_breaking_point”,
label: “Single Adult Crisis”,
title: “A single adult is already near the breaking point”,
summary: “MIT Living Wage data shows a single adult in Madison County needs $22.81 an hour just to cover food, housing, transportation, healthcare, and other basics. Alabama's minimum wage is $7.25. The state has no minimum wage above the federal floor. That $15.56-an-hour gap between survival and the legal floor is not a temporary problem. It is baked into the state's policy choices.”,
details: “The $22.81 living wage requirement assumes the person works full-time, has no debt, and faces no medical emergency, car breakdown, or other unexpected cost. It is a baseline, not a comfortable income. At that wage, housing costs of about $1,079 a month represent 28% of gross income — barely inside the 30% threshold. At $15 an hour, a full-time worker earns $31,200 before taxes. That leaves housing consuming more than 40% of gross income if they are paying market rates. For the large share of Huntsville workers earning between $28,000 and $35,000 a year, cost-burden is not a risk. It is a baseline condition.”,
decoder: {
whatsHappening: “Alabama's minimum wage and wage structure leaves a large share of the workforce structurally unable to afford basic costs in the Huntsville metro. This is a state-level policy choice that the city has not attempted to counteract through its own wage standards or affordability requirements.”,
connections: “Alabama state preemption laws prevent cities from setting their own minimum wages above the state floor. The same political alignment that maintains a $7.25 minimum also resists rent control, strengthens eviction timelines, and limits local housing regulation. These are not separate problems. They are parts of the same policy framework.”,
benefits: “Low-wage employers benefit from a labor market where workers cannot afford not to work. The state's business-aligned political class benefits from maintaining a cheap-labor reputation in economic development pitches. Workers are not the primary audience for those decisions.”,
impact: “Single adults earning between $28,000 and $42,000 a year are the population most exposed to cost-burden in the current market. That covers a large slice of the service, retail, care, and support workforce. For this group, the housing market is not a ladder. It is a ceiling.”,
actions: {
intro: “While state law limits what cities can do on wages, the city still controls development policy and can push for affordable supply. Local advocacy also connects to state-level minimum wage campaigns.”,
contacts: [
{ name: “Alabama Legislature”, role: “Sets state minimum wage and preemption framework”, officialLink: “https://www.legislature.state.al.us” },
{ name: “Huntsville City Council”, role: “Controls local development and affordability policy”, officialLink: “https://www.huntsvilleal.gov/city-council/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Raise the connection between wage floors and housing affordability.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Single Adult Housing Affordability in Madison County”, body: “MIT data shows a single adult in Madison County needs $22.81 an hour just to cover basic needs. Alabama's minimum wage is $7.25. I am asking the city council what local tools it is using to address the affordability gap for single adults, and whether affordability benchmarks are part of any current or proposed development policy.” } }
]
}
}
}
],
trail: [
{ label: “MIT Living Wage Calculator — Madison County, AL (Feb 2026)”, text: “All wage and income requirement figures sourced directly from livingwage.mit.edu/counties/01089” },
{ label: “BLS Occupational Employment and Wage Statistics — Huntsville Metro”, text: “Occupational wage averages cited via MIT Living Wage Calculator typical salary table” },
{ label: “City of Huntsville 2024 Development Review”, text: “Construction volume and pipeline composition data” }
]
},
{
id: “displacement”,
label: “Unhoused & Displacement”,
stats: [
[“Butler Terrace / Johnson Towers”, “~254 units”, “Original public housing stock being replaced at Mill Creek over 8 years”, “#dc2626”],
[“Mill Creek Total Units Planned”, “705”, “Mixed-income — not all public housing replacement”, “#ea580c”],
[“The Slab Encampment”, “75–100 people”, “Fourth closure in four years, per SPLC reporting”, “#dc2626”],
[“Mill Creek Timeline”, “8 years”, “Project runs to 2033; residents live in limbo during construction”, “#7c3aed”]
],
issues: [
{
id: “public_housing_replacement”,
label: “Public Housing”,
title: “They say "affordability" while replacing public housing with a mixed-income model”,
summary: “The Mill Creek redevelopment will replace Butler Terrace and Johnson Towers — the two main public housing sites in west Huntsville — with a $350 million mixed-income project backed by a $50 million HUD Choice Neighborhoods grant. The city calls it a transformation. What it is, structurally, is the conversion of a deeply affordable public housing campus into a mixed-income development that includes market-rate, workforce, and affordable units in a single project — with a timeline of 8 years and a final report due to HUD in 2033.”,
details: “Butler Terrace originally held 170 units. Butler Terrace Addition held 84 units. That's approximately 254 units of traditional public housing. The Mill Creek plan calls for 705 total mixed-income units across all phases — more units on paper, but not all public housing replacement. Of those, 125 are being contributed by Huntsville Hospital as workforce housing for its employees. The Housing Authority says there is a 1-to-1 replacement plan, but that math applies to households relocated, not necessarily to the number of units at the same affordability level. More than 100 individuals and families were already relocated before construction began. Whether they come back depends on screening criteria, income thresholds, background check policies, and project timeline — none of which are prominently disclosed in public communications.”,
decoder: {
whatsHappening: “Traditional public housing serves people at the very bottom of the income scale with no screening requirements beyond program eligibility. Mixed-income models typically include units at multiple income levels — 30%, 50%, 60%, and 80% of AMI — plus market-rate units. The shift is not just aesthetic. It changes who can actually live there. Mixed-income is not the same as public housing. It is a policy choice about who the development is primarily for.”,
connections: “The city, the Housing Authority, HUD, McCormack Baron Salazar (the developer), and Huntsville Hospital are all partners in Mill Creek. The framing — transformation, investment, inclusion — is consistent across all of them. The harder questions about replacement math, return rates, screening policies, and timeline risk are not prominently raised in official communications.”,
benefits: “The developer, McCormack Baron Salazar, brings a national reputation and a fee structure. Huntsville Hospital gets 125 workforce housing units for its employees on an adjacent site. The city gets a $350 million redevelopment it can point to as evidence of affordability commitment. Former public housing residents get a promise of return that depends on conditions they do not control.”,
impact: “Displaced Butler Terrace and Johnson Towers residents are the most exposed. They were moved out before construction and must navigate a multi-year gap to return to a development where their eligibility, screening, and priority access are not clearly guaranteed. For those who cannot meet new screening criteria, or who cannot wait 8 years, the displacement is permanent.”,
actions: {
intro: “The Housing Authority is a public body with a board. HUD has reporting requirements for Choice Neighborhoods grantees. These are accountability levers.”,
contacts: [
{ name: “Huntsville Housing Authority”, role: “Administers Mill Creek and public housing programs”, officialLink: “https://hsvha.org” },
{ name: “HUD Region 4 Office”, role: “Oversight agency for the $50M Choice Neighborhoods grant”, officialLink: “https://www.hud.gov/program_offices/field_policy_mgt/localoffices#IV” }
],
meetings: [
{ title: “Huntsville Housing Authority Board Meetings”, frequency: “Monthly”, why: “Ask for specific unit-by-unit affordability breakdown, return criteria, and number of former residents who have returned or been confirmed for return.” }
],
paths: [
{ destination: “HUD Choice Neighborhoods Program”, type: “Information Request”, why: “HUD grantees are required to report on resident relocation, replacement unit counts, and program compliance. Public records requests can surface this data.” }
],
actions: [
{ label: “Contact HHA Board”, kind: “primary”, template: { email: “”, subject: “Mill Creek: Replacement Unit Counts, Return Criteria, and Resident Status”, body: “I am requesting the following information about the Mill Creek redevelopment: (1) How many of the 705 planned units are designated for households at 30% AMI or below? (2) What are the exact eligibility and screening criteria for former Butler Terrace and Johnson Towers residents to return? (3) How many former residents have confirmed return placements? (4) What happens to residents who cannot qualify or who cannot wait for the project to complete?” } }
]
}
}
},
{
id: “camp_closures”,
label: “Camp Closures”,
title: “The city keeps closing camps without creating enough places to go”,
summary: “The Southern Poverty Law Center reported that Huntsville officials moved to close "The Slab" encampment on Derrick Street, where about 75 to 100 people were living, after a September 2024 fire. Advocates noted it was the fourth closure in four years. The city called it a "reset." Love Huntsville Executive Director Emma Steelman said at the time: "Right now it's impossible to end homelessness when there is no housing to put people into."”,
details: “The Derrick Street encampment sits in the Mill Creek Redevelopment District — the same area targeted by the $350 million mixed-income project. That overlap is not coincidental. As redevelopment pressure increases in west Huntsville, informal survival spaces in the same footprint become a visibility and liability problem for the larger project narrative. The pattern described by local advocates is consistent: a camp is closed, residents are moved down the road or to another informal site, and the cycle continues. The SPLC noted that Huntsville has closed camps in this pattern across multiple administrations, with each closure framed as a safety or health response rather than as part of a systemic strategy to reduce homelessness.”,
decoder: {
whatsHappening: “Camp closures are framed as safety interventions. What they do in practice is displace people from informal shelter without providing formal housing. Each closure requires residents to rebuild survival infrastructure somewhere else, losing belongings, social connections, and access to services in the process.”,
connections: “The SPLC, Love Huntsville, and other advocacy organizations have repeatedly documented that the city closes camps without first securing shelter capacity for residents. The Derrick Street area is also adjacent to the Mill Creek redevelopment footprint, which means encampment visibility is a complicating factor for a $350 million investment narrative.”,
benefits: “Camp closures benefit the city's image in development-adjacent corridors. They benefit property interests near the affected sites. They do not benefit the people living in the camps, who are simply moved elsewhere without additional housing options.”,
impact: “Camp residents lose stability, belongings, and service access with each sweep. The SPLC noted that residents with disabilities and limited mobility face particular harm, as no special accommodation plans have been provided. Each closure also pushes the population into smaller, less visible, and less monitored locations.”,
actions: {
intro: “Local advocates have been the primary force pushing back on encampment closures. Supporting their work and showing up to public comment periods matters.”,
contacts: [
{ name: “Love Huntsville”, role: “Local advocacy organization working to end homelessness”, officialLink: “https://lovehuntsville.org” },
{ name: “Huntsville Community Development Department”, role: “Manages encampment response and city shelter partnerships”, officialLink: “https://www.huntsvilleal.gov/community-development/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Camp closures and encampment policy are city decisions. Public comment is an on-record opportunity to push for alternatives.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Camp Closures Without Housing Alternatives”, body: “The SPLC has documented four encampment closures in four years in Huntsville. Love Huntsville has stated that it is impossible to end homelessness when there is no housing to move people into. I am asking the city council to explain what shelter or housing capacity was confirmed before each closure, and what plan exists to ensure future closures are not simply displacement without solution.” } }
]
}
}
},
{
id: “criminalization”,
label: “Criminalization”,
title: “Once there is nowhere to go, poverty becomes easier to police”,
summary: “In June 2024, the U.S. Supreme Court ruled in City of Grants Pass v. Johnson that anti-camping ordinances do not violate the Eighth Amendment, even when no shelter space is available. That ruling removed a key legal barrier to criminalizing outdoor sleeping. Huntsville already has public-camping restrictions on the books. Combined with persistent encampment closures and limited affordable supply, the legal landscape now makes it easier to punish people for being unhoused.”,
details: “Outdoor camping is technically illegal in Huntsville city limits. Prior to the Grants Pass ruling, enforcement was constrained in some jurisdictions by Ninth Circuit precedent, though Alabama is not in the Ninth Circuit. The ruling matters because it signals to local governments that anti-camping enforcement is constitutionally permissible regardless of shelter availability. That removes a legal incentive to provide alternatives before closing camps. The throughline the research documents have described — from rent burden, to displacement, to encampment, to sweep, to criminalization — is now legally easier to complete at each step.”,
decoder: {
whatsHappening: “The Supreme Court's Grants Pass ruling cleared the path for local governments to criminalize camping without first securing shelter capacity. In Huntsville, where encampment closures are already a documented pattern and affordable housing supply is thin, this legal shift makes the low end of the housing market even more punishing for people who fall off it.”,
connections: “State law in Alabama restricts what local governments can do on wages, rent control, and tenant protections. The Grants Pass ruling restricts what courts can do to stop encampment enforcement. Together, they narrow the legal and political toolbox available to unhoused people and their advocates, while expanding the options available to local governments that prefer enforcement over supply solutions.”,
benefits: “Property owners near informal encampments benefit from enforcement. The city benefits politically from visible responses to homelessness that look like action without requiring housing investment. The legal system benefits from a steady supply of cases generated by enforcement without resolution.”,
impact: “Unhoused people are the ones who bear the cost of a legal framework that makes it easier to punish poverty than to house it. Each fine or arrest is a barrier to stability. Each sweep destroys belongings, disrupts service access, and makes the path to housing longer.”,
actions: {
intro: “Local policy can still choose not to criminalize even when it is legally permitted to do so. The city council has discretion over enforcement priorities and over how it allocates community development funds.”,
contacts: [
{ name: “Love Huntsville”, role: “Local advocacy organization working to end homelessness”, officialLink: “https://lovehuntsville.org” },
{ name: “SPLC Economic Justice Program”, role: “Legal advocacy on homeless rights”, officialLink: “https://www.splcenter.org/issues/economic-justice” },
{ name: “Huntsville City Council”, role: “Sets enforcement priorities and community development budget”, officialLink: “https://www.huntsvilleal.gov/city-council/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Raise anti-camping enforcement and shelter capacity in public comment.” }
],
paths: [],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Anti-Camping Enforcement and Shelter Capacity”, body: “The Supreme Court's Grants Pass ruling permits anti-camping enforcement even without shelter availability, but does not require it. I am asking the Huntsville City Council to clarify whether the city plans to increase anti-camping enforcement, and if so, what shelter or housing capacity will be confirmed before enforcement actions are taken.” } }
]
}
}
}
],
trail: [
{ label: “SPLC: Advocates in Alabama Seek Aid for Unhoused People (Jan 2025)”, text: “Source for 40% cost-burden figure, The Slab encampment details, fourth-closure-in-four-years framing, and Love Huntsville advocacy quotes” },
{ label: “Huntsville Housing Authority: The Future of BT / Mill Creek”, text: “Source for original Butler Terrace unit counts, relocation policy, and 1-to-1 replacement claim” },
{ label: “City of Huntsville: Mill Creek Grant Announcement (July 2024)”, text: “Source for $50M HUD grant, $350M total investment, 705 unit plan, and Mayor Battle quote” },
{ label: “City of Grants Pass v. Johnson, Supreme Court (June 2024)”, text: “Source for the constitutional shift on anti-camping ordinance enforcement” }
]
},
{
id: “policy”,
label: “Policy & Zoning”,
stats: [
[“TIF Districts Active”, “Yes”, “City uses Tax Increment Financing to support growth infrastructure”, “#dc2626”],
[“Rent Control Allowed”, “No”, “Alabama state law prohibits local rent control ordinances”, “#ea580c”],
[“BizPAC Endorsements”, “Active”, “Committee of 100-linked PAC endorses and funds local races including mayor and council”, “#dc2626”],
[“Eviction Timeline”, “Fast”, “Alabama landlord-tenant law provides a rapid path in nonpayment cases”, “#7c3aed”]
],
issues: [
{
id: “public_money_private_growth”,
label: “TIF & Public Money”,
title: “Public money helps shape private growth — without affordability requirements”,
summary: “Huntsville uses Tax Increment Financing, a public financing tool, to support growth-related infrastructure and improvements in designated development corridors. TIF captures future property tax revenue increases in a district and directs it back into that district's development. That means public dollars are being used to support private development projects — without, as of this writing, mandatory affordability conditions attached.”,
details: “TIF is not inherently problematic. It is a legitimate economic development tool used by cities across the country. The issue is accountability. When public money is channeled into a development district, it is reasonable to ask what public obligations are attached. If TIF-supported infrastructure makes a luxury apartment project financially viable, the public has a legitimate interest in whether that project includes affordable units, local hiring commitments, or other community benefit conditions. Currently, those conditions are not a documented standard part of Huntsville's TIF framework.”,
decoder: {
whatsHappening: “Tax Increment Financing redirects future public tax revenues into a designated growth zone. This effectively subsidizes development activity in that area. Huntsville is using this tool to support growth in targeted corridors, including areas connected to major development projects. The mechanism is public. The accountability for what kinds of housing and community benefit get built is not clearly defined.”,
connections: “Developers who operate in TIF districts receive infrastructure support and reduced project costs. Business groups, engineering firms, and contractors who participate in TIF-funded work benefit from the public subsidy. The political connection is that business-aligned local government is unlikely to impose conditions on development tools that serve business interests.”,
benefits: “Developers, commercial property investors, and contractors in TIF-designated corridors benefit from public infrastructure investment that reduces their project costs. Property values in those corridors typically rise, which benefits existing property owners. The revenue recapture benefits the city's development goals but not necessarily its lowest-income residents.”,
impact: “If TIF funds support development that does not include affordability conditions, the public is subsidizing a market-rate or luxury pipeline without community benefit requirements. The cost is borne by residents who are priced out of the resulting development.”,
actions: {
intro: “TIF agreements are public documents. Asking for them and demanding community benefit conditions is a legitimate civic action.”,
contacts: [
{ name: “Huntsville City Council”, role: “Authorizes TIF districts and development agreements”, officialLink: “https://www.huntsvilleal.gov/city-council/” },
{ name: “Urban and Economic Development Department”, role: “Shane Davis, Director — administers growth and development policy”, officialLink: “https://www.huntsvilleal.gov/urban-economic-development/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “TIF authorizations and development agreements require council votes. These are public proceedings.” }
],
paths: [
{ destination: “City Clerk / Open Records”, type: “Public Records Request”, why: “Request copies of active TIF district plans, boundaries, and development agreements to determine what community benefit conditions, if any, are included.” }
],
actions: [
{ label: “Request TIF District Records”, kind: “primary”, template: { email: “”, subject: “Public Records Request: TIF District Agreements and Affordability Conditions”, body: “I am requesting copies of all active Tax Increment Financing district plans and related development agreements in Huntsville, including any community benefit conditions, affordability requirements, local hiring provisions, or other public obligations attached to private development receiving TIF-supported infrastructure.” } }
]
}
}
},
{
id: “bizpac_political_ecosystem”,
label: “Business Power”,
title: “Business power is part of the housing story”,
summary: “BizPAC, operated through the Huntsville Committee of 100, openly endorses and contributes to local races including mayor and city council. The Committee of 100 is Huntsville's oldest and most influential business advocacy organization. It does not prove corruption. It does prove that housing, zoning, infrastructure decisions, and local elections all sit inside a business-backed political ecosystem where developer-friendly candidates have a structural advantage.”,
details: “The Committee of 100 has shaped Huntsville's economic trajectory for decades. Its membership includes major employers, developers, engineering and architecture firms, and financial institutions. BizPAC formalizes political spending within that network. The result is a local political environment where candidates who receive business sector support have more resources than those who do not, and where elected officials who want to stay in office have structural incentives not to impose conditions on development that business allies oppose. This is not a Huntsville-specific problem. It is a structural feature of local politics where developer money is concentrated and tenant interests are diffuse.”,
decoder: {
whatsHappening: “Local elections in Huntsville are shaped by organized business money. BizPAC is the vehicle. The Committee of 100 is the network. Candidates who align with business sector priorities are better resourced than those who do not. That alignment shapes how the city council votes on zoning, development approvals, infrastructure investment, and affordability policy.”,
connections: “The same firms and individuals who develop residential and commercial property, receive engineering contracts on public projects, and sit on business boards also fund the campaigns of local officials who vote on zoning, permits, and development agreements. That is not a coincidence. It is a system.”,
benefits: “Business-aligned candidates who receive BizPAC support benefit from campaign resources. Developers and business groups benefit from having elected allies in positions to approve their projects. The cost of this alignment is borne by renters and residents whose interests are not organized into a comparable political structure.”,
impact: “Housing affordability policy is made by elected officials who are embedded in a business-funded political ecosystem. The structural result is that affordability conditions, tenant protections, and inclusionary requirements face a higher bar than market-rate approvals. That is a policy outcome, not just a political observation.”,
actions: {
intro: “Campaign finance records are public. Knowing who funds local candidates and comparing that with development approval records is basic civic research.”,
contacts: [
{ name: “Alabama Secretary of State”, role: “Campaign finance records and disclosures”, officialLink: “https://www.sos.alabama.gov” },
{ name: “Huntsville City Council Members”, role: “Directly accountable on zoning and development votes”, officialLink: “https://www.huntsvilleal.gov/city-council/” }
],
meetings: [
{ title: “City Council Meetings”, frequency: “Twice monthly”, why: “Show up. Public comment is on the record. Development votes are public. Presence creates accountability.” }
],
paths: [
{ destination: “Alabama SOS Campaign Finance Database”, type: “Public Record”, why: “Look up who has contributed to city council and mayoral campaigns, and compare those donors to applicants in major development approvals.” }
],
actions: [
{ label: “Email City Council”, kind: “primary”, template: { email: “”, subject: “Campaign Donors and Development Approvals: A Request for Transparency”, body: “I am asking each member of the Huntsville City Council to disclose whether they have received campaign contributions from developers, engineering firms, or business organizations with active development applications before the council or planning commission, and what recusal or disclosure policies are in place to manage those conflicts.” } }
]
}
}
},
{
id: “state_law_toolbox”,
label: “State Law Limits”,
title: “Alabama state law has already narrowed the renter-protection toolbox”,
summary: “Alabama cities cannot adopt rent control ordinances. State law prevents it. Alabama landlord-tenant law also provides landlords with a relatively fast legal path in nonpayment cases, often allowing eviction proceedings to begin within days of a missed payment. These are not Huntsville-specific failures. They are state-level policy choices that constrain what local officials can do — even if they wanted to do more.”,
details: “The absence of local rent control authority means that when market rents rise rapidly, tenants have no legal protection against increases. A landlord can raise rent to market rate at the end of any lease term, and a tenant's only options are to pay, move, or face eviction. Alabama's eviction process is among the faster ones in the South. Notice periods in nonpayment cases are short, and courts typically process cases quickly. Tenants who cannot pay have limited time to find alternatives before enforcement begins. The combination — rising rents, no rent control, fast eviction — is not a market failure. It is the intended result of a state legal framework that is structured around landlord interests.”,
decoder: {
whatsHappening: “Alabama has preempted local rent control authority and maintained a landlord-friendly eviction framework. Cities like Huntsville operate inside that framework and cannot adopt tools that many other cities use to protect renters. This limits local options without eliminating them. The city still controls zoning, affordability conditions, development incentives, and how it allocates housing funds.”,
connections: “The Alabama Legislature is dominated by a coalition that includes landlord interests, real estate associations, and the business community. The same political alignment that maintains a $7.25 minimum wage also prevents rent control and maintains fast-track evictions. It is a coherent policy framework, not an accident.”,
benefits: “Landlords benefit from no rent control and fast evictions. The state's political class benefits from maintaining a deregulated property market it can advertise to business interests. Tenants absorb all of the risk in this framework.”,
impact: “Renters in Huntsville have no legal protection against rent increases at lease renewal, a fast path to eviction in nonpayment situations, and limited ability to organize legal challenges. The result is a structural disadvantage that compounds the income and supply pressures the rest of this module documents.”,
actions: {
intro: “State law is the constraint. State legislators are the lever. Local advocacy connects to state-level campaigns on minimum wage, eviction protections, and tenant rights.”,
contacts: [
{ name: “Alabama Legislature”, role: “Madison County Representatives and Senators”, officialLink: “https://www.legislature.state.al.us” },
{ name: “Alabama Arise”, role: “Statewide advocacy organization working on poverty and housing”, officialLink: “https://www.alarise.org” }
],
meetings: [
{ title: “Alabama Legislature Sessions”, frequency: “Annual regular session”, why: “State housing, wage, and tenant protection law is made here. Constituent contact and committee testimony are the primary pressure points.” }
],
paths: [
{ destination: “Alabama Arise”, type: “Organizing”, why: “Connect with the statewide network working on housing, wages, and tenant rights at the legislative level.” }
],
actions: [
{ label: “Contact State Legislators”, kind: “primary”, template: { email: “”, subject: “Tenant Protections and Housing Affordability in Madison County”, body: “I am contacting you as a constituent to ask your position on the following: (1) Alabama's preemption of local rent control authority, (2) the current nonpayment eviction notice timeline under state law, and (3) what legislative action you support to strengthen tenant protections and housing affordability in communities like Huntsville where cost-burden rates are near 40%.” } }
]
}
}
}
],
trail: [
{ label: “City of Huntsville Urban and Economic Development”, text: “Source for TIF and development strategy framing” },
{ label: “BizPAC / Committee of 100 public filings”, text: “Public endorsement and contribution records for local races” },
{ label: “Alabama Code Title 35 — Landlord-Tenant Law”, text: “Source for state preemption of rent control and eviction timeline structure” },
{ label: “SPLC letter to Huntsville officials (2022)”, text: “Source for legal analysis of encampment enforcement and tenant rights context” }
]
}
]
};
export default data;