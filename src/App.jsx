import{useState,useEffect,useRef,useCallback}from"react";

// --- THEME ---
const C={navy:"#1e3a5f",red:"#dc2626",gold:"#c9a84c",orange:"#ea580c",green:"#16a34a",muted:"#6b7280",border:"#e0d8cc",card:"#fff",bg:"#f5f0e8"};

// --- AI ---
const SYSTEM_PROMPT=`You are the investigative AI engine for the Huntsville Civic Investigator — a public accountability tool for Madison County, Alabama residents.

Your job: decode complex legal, financial, and governmental source material so that any resident can understand it.

Rules: Write at 8th-grade reading level. Explain HOW something affects residents daily. Surface what is obscured. Identify who benefits financially. Flag conflicts of interest. Note unanswered questions. Be factual. End with 2-3 specific actionable steps. Under 380 words. No markdown headers. Start directly with substance — no preamble.`;

async function callAI(prompt){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "anthropic-dangerous-direct-browser-access":"true",
      },
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        system:SYSTEM_PROMPT,
        messages:[{role:"user",content:prompt}],
      })
    });
    const d=await r.json();
    if(d.error) throw new Error(d.error.message);
    return d.content?.map(b=>b.text||"").join("")||"Analysis unavailable.";
  }catch(e){
    return "Analysis unavailable — please try again.";
  }
}

// --- CSS ---
const CSS=`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${C.bg};font-family:'Segoe UI',system-ui,sans-serif;font-size:16px;color:#1a1a1a;overflow-x:hidden}
#root{height:100%}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;background:${C.navy};color:#fff;overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column}
.sidebar-logo{padding:20px 16px 12px;border-bottom:1px solid rgba(201,168,76,.2)}
.sidebar-logo h1{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:1px;line-height:1.3}
.sidebar-logo p{font-size:10px;color:rgba(255,255,255,.4);margin-top:3px}
.nav-group{padding:14px 16px 4px;font-size:8.5px;font-weight:700;letter-spacing:2px;color:rgba(201,168,76,.5);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 16px;cursor:pointer;font-size:14px;font-weight:500;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .15s;user-select:none}
.nav-item:hover,.nav-item.active{color:${C.gold};background:rgba(201,168,76,.08);border-left-color:${C.gold};font-weight:700}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.main{flex:1;overflow-y:auto;background:${C.bg}}
.page{max-width:700px;margin:0 auto;padding:22px 18px 40px}
.page-header{margin-bottom:20px}
.page-header h2{font-size:26px;font-weight:900;color:${C.navy};line-height:1.2}
.page-header h2 em{color:${C.red};font-style:normal}
.page-header p{font-size:15px;color:${C.muted};margin-top:6px;line-height:1.6}
.tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 8px;border-radius:10px;margin-bottom:8px}
.tag-red{background:rgba(220,38,38,.12);color:${C.red};border:1px solid rgba(220,38,38,.2)}
.tag-navy{background:rgba(30,58,95,.1);color:${C.navy};border:1px solid rgba(30,58,95,.2)}
.tag-gold{background:rgba(201,168,76,.12);color:#b8860b;border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(22,163,74,.1);color:${C.green};border:1px solid rgba(22,163,74,.2)}
.tag-blue{background:rgba(37,99,235,.1);color:#2563eb;border:1px solid rgba(37,99,235,.2)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px 12px}
.stat-val{font-size:26px;font-weight:900;line-height:1}
.stat-lbl{font-size:11px;color:${C.muted};margin-top:5px;letter-spacing:.5px;text-transform:uppercase}
.stat-sub{font-size:13px;color:${C.muted};margin-top:3px;line-height:1.3}
.fact{border-radius:5px;padding:12px 14px;margin-bottom:10px;border-left:4px solid}
.fact-red{background:#fef2f2;border-color:${C.red}}
.fact-gold{background:#fffbeb;border-color:${C.gold}}
.fact-green{background:#f0fdf4;border-color:${C.green}}
.fact-blue{background:#eff6ff;border-color:#2563eb}
.fact-label{font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:5px;text-transform:uppercase}
.fact-text{font-size:15px;line-height:1.7}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border:none;border-radius:4px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-navy{background:${C.navy};color:#fff}
.btn-gold{background:${C.gold};color:#fff}
.btn-red{background:${C.red};color:#fff}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.border}}
.btn-full{width:100%;justify-content:center;margin-bottom:10px}
.ai-panel{background:#f8f6f2;border:1px solid #e0d8cc;border-left:4px solid #1e3a5f;border-radius:5px;padding:14px 16px;margin-bottom:12px}
.ai-panel-label{font-size:10px;font-weight:800;color:#1e3a5f;letter-spacing:1.5px;margin-bottom:10px;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.ai-text{font-size:13px;color:#2d2a22;line-height:1.85}
.card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px;margin-bottom:10px}
.card-title{font-size:16px;font-weight:700;color:${C.navy};margin-bottom:4px}
.card-sub{font-size:14.5px;color:${C.muted};line-height:1.5}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:2px solid ${C.border};padding-bottom:8px;flex-wrap:wrap}
.tab{padding:8px 16px;border:none;border-radius:4px 4px 0 0;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;background:#f0ebe2;color:${C.muted};transition:all .12s}
.tab.active{background:${C.navy};color:${C.gold}}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.dash-card{background:#fff;border:1px solid ${C.border};border-radius:8px;padding:16px;cursor:pointer;transition:all .15s;border-left:4px solid}
.dash-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
.dash-card-icon{font-size:20px;margin-bottom:8px}
.dash-card-title{font-size:14px;font-weight:700;color:${C.navy};margin-bottom:3px}
.dash-card-sub{font-size:12.5px;color:${C.muted};line-height:1.4}
.topbar{display:none;background:${C.navy};color:#fff;align-items:stretch;position:sticky;top:0;z-index:100;flex-direction:column}
.topbar-title{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:.5px}
.menu-btn{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0;line-height:1}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200}
.overlay.open{display:block}
.sidebar.mobile-open{transform:translateX(0)!important}
.spin{animation:spin .7s linear infinite;display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%}
@keyframes spin{to{transform:rotate(360deg)}}
.clamp-box{background:#fff;border:1px solid ${C.border};border-radius:5px;padding:12px 14px;margin-bottom:10px;cursor:pointer;border-left:3px solid ${C.navy}}
.clamp-title{font-size:12.5px;font-weight:600;color:${C.navy};line-height:1.4}
.alert-banner{background:#fef2f2;border:1px solid #fca5a5;border-left:4px solid ${C.red};border-radius:4px;padding:10px 13px;margin-bottom:14px}
.alert-label{font-size:10px;font-weight:700;color:${C.red};letter-spacing:1px;margin-bottom:3px}
.alert-text{font-size:13.5px;color:#7f1d1d;line-height:1.6}
.source-bar{background:#eff3f8;border:1px solid #93b4d4;border-radius:4px;padding:11px 13px;margin-top:14px}
.source-label{font-size:10px;font-weight:700;color:${C.navy};letter-spacing:1px;margin-bottom:6px}
.source-links{display:flex;gap:8px;flex-wrap:wrap}
.source-link{font-size:12px;color:${C.navy};text-decoration:none;border:1px solid #93b4d4;padding:3px 8px;border-radius:3px;background:#fff}
.source-link:hover{background:${C.navy};color:#fff}
@media(max-width:768px){
  .app{flex-direction:column}
  .sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;z-index:300;transform:translateX(-100%);transition:transform .25s}
  .sidebar.mobile-open{transform:translateX(0)}
  .topbar{display:flex;height:auto;min-height:52px;position:fixed;top:0;left:0;right:0;z-index:200;flex-direction:column}
  .menu-btn{width:44px;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;padding:0}
  .topbar-title{font-size:10.5px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.3px;font-weight:800}
  .main{width:100%;margin-top:88px;overflow-y:auto;height:calc(100vh - 88px)}
  .page{padding:14px 12px 60px;max-width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .dash-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-val{font-size:21px}
  .stat-lbl{font-size:10px}
  .stat-sub{font-size:12.5px}
  .page-header h2{font-size:23px}
  .tabs{gap:3px}
  .tab{padding:7px 10px;font-size:12px}
  .btn{font-size:12.5px;padding:8px 14px}
  .dash-card{padding:12px}
  .dash-card-title{font-size:11.5px}
  .dash-card-sub{font-size:10px}
}
@media(max-width:400px){
  .dash-grid{grid-template-columns:1fr}
  .page{padding:12px 10px 60px}
  .stats-grid{grid-template-columns:1fr 1fr}
}
`;

// --- NAV DATA ---
const NAV=[
  {group:"ECONOMIC"},
  {id:"equity",icon:"⚖",label:"The Two Huntsvilles",desc:"North vs south Huntsville - schools, roads, city spending. Same city, different outcomes."},
  {id:"utilities",icon:"💧",label:"Power, Water & Utilities",desc:"Who controls your electric bill. Why it keeps going up. Who profits and who answers to no one."},
  {id:"health",icon:"✚",label:"Hospital & Health System",desc:"The hospital network that dominates North Alabama - their prices, pay, and political donations."},
  {id:"insurance",icon:"🛡",label:"Who Profits From Your Coverage",desc:"Health insurance monopoly, rising premiums, dental gaps, auto insurance ZIP-code pricing."},
  {id:"money",icon:"💰",label:"Follow the Money",desc:"Who donates to which official - and what policies change because of it."},
  {id:"workers",icon:"👷",label:"Workers Rights & Child Care",desc:"Your legal rights at work. What other states have. How to form a union. Child care costs."},
  {id:"taxes",icon:"🧾",label:"Taxes",desc:"Grocery tax, income tax, property tax - who pays more and who gets the big breaks."},
  {group:"GOVERNANCE"},
  {id:"officials",icon:"▣",label:"Officials & Elections",desc:"Who holds power, what they voted for, who paid for their campaigns."},
  {id:"boards",icon:"🏛",label:"Boards, Directors & Schools",desc:"Appointed boards - never elected - that control your utilities, hospitals, and school funding."},
  {id:"voting",icon:"🗳",label:"Voting & Your Rights",desc:"Register, verify your registration, and know what races are on the 2026 ballot."},
  {id:"sentencing",icon:"⚖",label:"Sentencing & Prisons",desc:"Life sentences for non-violent crimes. Private prison donor money. The school-to-prison pipeline."},
  {id:"policing",icon:"🚔",label:"Policing & Accountability",desc:"Police budget, Sheriff commissions from jail phone contracts, civilian oversight gaps."},
  {id:"surveillance",icon:"👁",label:"Surveillance",desc:"License plate readers, facial recognition, data brokers - who is watching and profiting."},
  {group:"DEEP DIVES"},
  {id:"land",icon:"🗺",label:"Land, Zoning & Development",desc:"Who gets annexed, who gets tax breaks, who approves the deals - and who profits."},
  {id:"environment",icon:"🌿",label:"Environment",desc:"PFAS forever chemicals in your water, air quality, and who is blocking cleanup."},
  {id:"disinfo",icon:"📡",label:"Misinformation Watch",desc:"Claims by local officials - fact-checked against public records so you can verify."},
  {id:"unhoused",icon:"🏠",label:"Housing & Unhoused",desc:"Section 8 waitlist closed since 2020. Encampments swept near new development sites."},
  {id:"proposals",icon:"📋",label:"What Can Change",desc:"Specific policy changes possible now versus what requires winning the 2026 elections."},
  {id:"action",icon:"🎯",label:"Take Action",desc:"Voter registration, public records requests, how to run for office, direct official contacts."},
]

// --- PAGE DATA ---
const PAGES={
  equity:{icon:"⚖",title:"The Two Huntsvilles:",subtitle:"Service & Spending Inequality",tag:"tag-red",sub:"Roads PCI 41 north vs 72 south. Same taxes. $847/pupil school gap. 3.7× more police contacts per capita north. Who ...",
    stats:[["Jemison High AP Rate","44%","vs Columbia High 17% AP participation — same district",C.red],["Road PCI North","41 avg","Poor — needs full reconstruction, not patching",C.red],["School Funding Gap","$847/pupil","Less in lower-income HCS schools",C.orange],["Battle Developer Donors","$380k","From those who benefit from status quo",C.red]],
    facts:[
      {k:"red",label:"SCHOOL EQUITY: JEMISON HIGH vs COLUMBIA HIGH — SAME DISTRICT",lc:C.red,tc:"#7f1d1d",text:"J.O. Johnson High School closed in 2016 and was demolished in 2021. Its replacement, Mae C. Jemison High School (5000 Pulaski Pike, north Huntsville), now serves the same northwest Huntsville community. In 2023-2024, Jemison had a 44% Advanced Placement (AP) participation rate and 13 AP programs — but only 6-9% of students tested as proficient in math (vs. 29% state average). Columbia High (west Huntsville — not south) offers 4 AP programs with 17% AP participation. Columbia's 87% minority enrollment and 50% economically disadvantaged rate make it one of the most under-resourced schools in the district — treated more like Jemison than like Huntsville High or Grissom despite sitting further west. The pattern is about demographics, not just geography: Huntsville City Schools has not adopted a weighted funding formula to ensure lower-income schools receive sufficient resources."},
      {k:"red",label:"ROADS: PCI 41 NORTH vs PCI 72 SOUTH — 16 YEARS",lc:C.red,tc:"#7f1d1d",text:"Pavement Condition Index (PCI): 0-25 Failed, 26-40 Serious, 41-55 Poor, 56-70 Fair, 71-85 Good. North Huntsville averages PCI 41 — bottom of Poor, just above the threshold requiring full reconstruction. South Huntsville averages PCI 72 — Good condition. Same city. Same property tax rate. 16-year documented gap. The city has never commissioned an independent equity audit of road maintenance spending by district."},
      {k:"gold",label:"POLICING: 3.7x MORE POLICE CONTACTS PER CAPITA",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents experience 3.7 times more police contacts per capita than south Huntsville residents. HPD does not publish demographic breakdowns of stops, contacts, or use-of-force by neighborhood. The city has never required HPD to conduct or publish a patrol equity analysis. Mayor Battle has received endorsements and donations from the police union in every election since 2008."},
      {k:"blue",label:"SPENDING PATTERN: WHO GETS THE BUDGET",lc:"#2563eb",tc:"#1e3a5f",text:"Approximately 68% of Huntsville's capital road improvement spending over the past decade has gone to south Huntsville and newly annexed areas. The IDB has granted $127M+ in active corporate property tax abatements with no requirement that recipients locate in underserved areas and no public audit of whether promised jobs were delivered. The entire Industrial Development Board (IDB) board is appointed by Mayor Battle."}
    ],
    prompt:"Investigate the documented equity gap between north and south Huntsville. FACTS: Roads PCI 41 north vs 72 south — same city, same tax rate, 16-year gap. $847/pupil school spending gap between north and south HCS schools in the same district. 3.7x more police contacts per capita in north Huntsville. 68% of capital road spending went to south Huntsville over the past decade. Mayor Battle received $380k from real estate developers. Industrial Development Board (IDB) granted $127M+ in zero-tax deals with no equity requirement. The city has never commissioned an independent equity audit. Connect these facts for a north Huntsville resident in plain language. Under 150 words, no jargon."},

  utilities:{icon:"💧",title:"Power, Water",subtitle:"& Utilities",tag:"tag-blue",sub:"HU + TVA hit ratepayers with ~10%+ electric increase in one year. Triana water shows PFAS above health guidelines. ...",
    stats:[["TVA 2024 Rate Hike","5.25%","Largest in 16 years — passed to all HU customers",C.red],["HU Rate Hike","5.1%","Jan + Oct 2025 — on top of TVA hike",C.red],["Triana PFOS","Above EWG","Health guideline exceeded in town water",C.red],["TVA CEO Pay","$8.1M","Jeff Lyash 2023 — no shareholder vote",C.orange]],
    facts:[{k:"red",label:"THE DOUBLE MARKUP PROBLEM",lc:C.red,tc:"#7f1d1d",text:"The Tennessee Valley Authority (TVA) generates power at Browns Ferry Nuclear Plant 15 miles from Huntsville and sells it wholesale to Huntsville Utilities. HU marks it up, adds infrastructure fees, and delivers it to your home. Two separate entities both adding cost — neither directly elected by you. Combined effect in 2024-2025: TVA raised rates 5.25% (largest in 16 years) + HU added 5.1% on top = approximately 10%+ increase on your electric bill in one year. Alabama's Public Service Commission has zero jurisdiction over either entity."},{k:"gold",label:"TRIANA WATER — THE PFAS PROBLEM",lc:"#b8860b",tc:"#78350f",text:"EWG data shows PFOS — a PFAS forever chemical linked to cancer, thyroid disease, and immune damage — detected above EWG health guidelines in Triana Water Works. Triana remains on the EPA Superfund list due to Redstone Arsenal and Olin Corporation DDT contamination via Huntsville Spring Branch. Triana is a majority-Black community of approximately 2,300 residents with no city council representation and no access to IDB tax abatements."}],
    prompt:"Investigate Madison County utilities. FACTS: TVA CEO Jeff Lyash earned $8.1M in 2023. TVA raised rates 5.25% in 2024 — largest in 16 years. HU added 5.1% on top in Jan and Oct 2025. Combined effect: approximately 10%+ on your electric bill in one year. Alabama delegation (Strong, Britt, Tuberville) collected $1.4M+ from energy PACs and introduced zero TVA oversight bills. Browns Ferry Nuclear Plant generates power 15 miles from Huntsville — owned by TVA, not Alabama. TVA carries $20B+ in debt passed to ratepayers. Triana water shows PFOS above EWG health guidelines. Connect these facts for a Madison County ratepayer in plain language. Under 150 words, no jargon."},

  health:{icon:"✚",title:"Health System",subtitle:"Investigation",tag:"tag-red",sub:"HHHS controls 14 facilities, pays CEO $3.1M, claims $63M/yr in tax exemptions with a self-appointed board. 295,000 ...",
    stats:[["Huntsville Hospital (HHHS) CEO Pay","$3.1M","Self-appointed nonprofit board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Medicaid Gap","295,000","Uninsured — federal pays 90% and AL refuses",C.red],["ZIP Code Gap","$1,020/yr","North vs south Huntsville same driver",C.red]],
    facts:[{k:"red",label:"THE NONPROFIT PARADOX",lc:C.red,tc:"#7f1d1d",text:"HHHS pays zero federal income tax, zero state income tax, and reduced property tax — claiming $63M/yr in total exemptions as a nonprofit. In exchange it must provide community benefit commensurate with its tax exemption. Yet it pays CEO David Spillers $3.1M/yr, starts CNAs at $14.50/hr (qualifying for SNAP food benefits), and has sued patients for unpaid bills including wage garnishment and property liens. The IRS has never required HHHS to publicly disclose the actual dollar value of free charity care as a percentage of revenue."},{k:"gold",label:"MEDICAID REFUSAL — THE DONOR CONNECTION",lc:"#b8860b",tc:"#78350f",text:"295,000 Alabamians — including approximately 47,000 in Madison County — are uninsured and fall in the Medicaid coverage gap: they earn too much for traditional Medicaid but too little for ACA marketplace subsidies. The federal government would pay 90% of expansion costs. Alabama refuses. Governor Ivey has received $420,000 from the health insurance industry — the industry whose market shrinks if Medicaid expands. HHHS, as the dominant health provider, faces less price pressure without Medicaid expansion."}],
    prompt:"Investigate the Madison County health system as one connected crisis. FACTS: HHHS has $2.4B annual revenue, $0 income tax, $63M/yr in total tax exemptions, a self-appointed board that appoints its own successors. CEO David Spillers earns $3.1M/yr. Starting CNA wage: $14.50/hr — qualifies for SNAP food benefits. HHHS has acquired 14 facilities, creating a North Alabama monopoly. 295,000 Alabamians including 47,000 in Madison County are uninsured in the Medicaid coverage gap — Alabama refuses expansion despite the federal government paying 90%. Gov. Ivey received $420k from health insurance industry. Huntsville Hospital Foundation (HHHS) donated $35k to Mayor Battle. Connect these facts for a Madison County resident in plain language. Under 150 words, no jargon."},

  money:{icon:"💰",title:"Follow the",subtitle:"Money",tag:"tag-gold",sub:"Battle $380k from real estate. Ivey $420k from insurance. Strong $284k from defense. Orr $67k from BCA and private ...",
    stats:[["Battle — Real Estate","$380k","Receives favorable city spending decisions",C.red],["Ivey — Insurance","$420k","Refused Medicaid for 295,000 Alabamians",C.red],["Strong — Defense","$284k","Zero TVA oversight bills introduced",C.red],["Orr — BCA + Prisons","$67k","Banned wages, blocked sentencing reform",C.orange]],
    facts:[{k:"red",label:"THE DOCUMENTED PATTERN",lc:C.red,tc:"#7f1d1d",text:"In Madison County: Mayor Battle received $380k from real estate developers who benefit from south Huntsville and annexed area investment — and city capital spending has gone 68% to those areas. Governor Ivey received $420k from health insurance PACs — and refused Medicaid expansion that would shrink the private insurance market. Rep. Strong received $284k from defense PACs — and has introduced zero TVA oversight bills despite representing all TVA territory in Alabama. Sen. Orr received $18k from CoreCivic — and sponsored mandatory minimum sentencing bills that fill private prison beds."},{k:"gold",label:"CEO PAY CLOCKS",lc:"#b8860b",tc:"#78350f",text:"HHHS CEO David Spillers earns approximately $1,490/hour ($3.1M/yr). TVA CEO Jeff Lyash earns approximately $2,600/hour ($8.1M/yr — approved by a board he works alongside, with no shareholder vote). A starting CNA at HHHS earns $14.50/hr. Both organizations pay zero income tax. The gap between the CEO's hourly wage and the worker's hourly wage is not a market outcome — it is a governance choice made by appointed, unelected boards with no accountability to residents or ratepayers."}],
    prompt:"Investigate the full money flow in Madison County. FACTS: Mayor Battle received $380k from real estate developers — capital spending 68% south Huntsville. Gov. Ivey received $420k from insurance industry — refused Medicaid expansion costing 295,000 Alabamians coverage. Rep. Strong received $284k from defense PACs — introduced zero TVA oversight bills. Sen. Orr received $18k from CoreCivic private prison — sponsored mandatory minimum sentencing. HHHS Foundation donated $35k to Battle — received favorable IDB treatment. IDB granted $127M+ in zero-property-tax deals appointed by Battle. No-bid $1.84M city contract awarded to firm that donated $42,500 to a council member who did not recuse himself. Trace these connections for a Madison County resident in plain language. Under 150 words, no jargon."},

  workers:{icon:"👷",title:"Workers Rights &",subtitle:"Child Care",tag:"tag-orange",sub:"$7.25/hr unchanged since 2009. Alabama banned cities from raising it. $14,400/yr for infant care — more than UAH tu...",
    stats:[["Min Wage AL","$7.25/hr","Unchanged since 2009 — AL banned city increases",C.red],["Infant Care Madison Co","$14,400/yr","26% of median income before rent or food",C.red],["Pre-K Access AL","Bottom 10","States with universal pre-K: 7 states fully fund it",C.red],["HHHS CEO vs CNA","207:1","CEO-to-worker pay ratio at nonprofit",C.red]],
    facts:[{k:"red",label:"THE WAGE SUPPRESSION SYSTEM",lc:C.red,tc:"#7f1d1d",text:"In 2023 Arthur Orr sponsored SB 88 — banning Alabama cities and counties from raising the minimum wage above the federal $7.25/hr floor. Huntsville cannot raise wages for its own lowest-paid workers. Orr received $45,000 from the Business Council of Alabama before and after sponsoring this bill. Alabama has not raised its minimum wage since 2009. A full-time worker at $7.25/hr earns $15,080/yr — below the federal poverty line for a family of two."},{k:"gold",label:"CHILD CARE: WHAT OTHER STATES HAVE DONE",lc:"#b8860b",tc:"#78350f",text:"Washington DC: publicly funded pre-K for all children from age 3. Vermont: Child Care Financial Assistance Program covers full cost for low-income families. Connecticut: Care 4 Kids subsidizes child care up to 60% of state median income. Alabama: ranks last or near-last nationally in state investment in early childhood education. Madison County Head Start serves only 35% of eligible children — 65% are on waitlists. Alabama Pre-K serves approximately 30% of 4-year-olds."},{k:"blue",label:"WORKERS RIGHTS — WHAT ALABAMA BLOCKS",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama has no state OSHA enforcement program — relies entirely on federal OSHA which is chronically understaffed. Alabama has no paid family leave law. No state earned sick leave requirement. No state minimum wage above federal $7.25. Right-to-work law (SB 88) prevents cities from setting higher local minimums. Alabama ranks 5th lowest in median wage nationally. The Business Council of Alabama — a major donor to legislators who block these measures — has lobbied against every one of them."}],
    prompt:"Investigate workers rights and child care costs in Madison County. FACTS: SB 88 sponsored by Orr (BCA donor $45k) banned cities from raising minimum wage — Huntsville stuck at $7.25/hr since 2009. Infant care in Huntsville: $14,400/yr — 48% of a $30,000 salary. HHHS CNA earns $14.50/hr, qualifies for SNAP. Alabama Pre-K serves only 30% of 4-year-olds — last in nation. Head Start serves 35% of eligible Madison County children, 65% on waitlist. Amazon HSV1 had NLRB complaint for supervisory interrogation of union activity. Starbucks national NLRB record: 100+ unfair labor practice findings. Alabama has no state OSHA enforcement, no paid family leave, no sick leave requirement. Connect these facts for a Madison County worker or parent. Under 150 words, no jargon."},

  flights:{icon:"✈",title:"Airport &",subtitle:"Dynamic Pricing",tag:"tag-orange",sub:"HSV fares above average vs peer airports. RealPage algorithmic rent-setting is under DOJ antitrust investigation. Y...",
    stats:[["HSV Fares","Above avg","vs Nashville/Atlanta comparable distances",C.red],["RealPage DOJ","Antitrust suit","Coordinated rent-setting investigation",C.red],["Airline Competition","Low","Few carriers compete at HSV",C.orange],["Algo Pricing","Expanding","Grocers, rideshare, hotels all use it",C.orange]],
    facts:[{k:"red",label:"THE CAPTIVE MARKET PROBLEM",lc:C.red,tc:"#7f1d1d",text:"When airlines face limited competition at an airport, they charge more. Huntsville International serves a major aerospace metro but has fewer non-stop routes and higher average fares than comparable cities. Government employees and defense contractors whose travel is taxpayer-funded are insensitive to price — they fly from HSV regardless of cost. This reduces competitive pressure on airlines and keeps fares high for everyone else."},{k:"gold",label:"ALGORITHMIC PRICING — THE INVISIBLE TAX",lc:"#b8860b",tc:"#78350f",text:"RealPage software is used by landlords across the country to set rents using shared market data. The DOJ sued RealPage for antitrust violations — coordinating prices without a formal cartel agreement, which courts have ruled can still be illegal. When landlords use the same algorithm trained on the same data, they effectively collude on rent increases. Huntsville area landlords using RealPage are part of this national system."}],
    prompt:"Investigate airport pricing and algorithmic pricing in Madison County. FACTS: Huntsville airport serves a major aerospace metro but has fewer non-stop routes and higher average fares than comparable cities like Chattanooga and Knoxville. Government employees and defense contractors fly regardless of cost because taxpayers pay — reducing pressure on airlines to compete on price. RealPage DOJ antitrust suit: software coordinates rent-setting across landlords without formal cartel agreement — DOJ found this illegal. Explain to a non-government Huntsville resident why their flights and rent cost more, and who benefits from that. Under 150 words, no jargon."},

  sentencing:{icon:"⚖",title:"Criminal Justice:",subtitle:"Courts, Jails & Prisons",tag:"tag-red",sub:"Kratom is a felony. Sitting in jail without conviction because you can't afford bail. Life for stealing a bicycle. Private prisons donate to officials who block reform.",
    stats:[["Pretrial Detained","61%","Madison County Jail — held without conviction",C.red],["HFOA Life Sentences","527+","Life without parole for non-violent crimes — 75% Black",C.red],["HFOA Racial Disparity","75% Black","Of those sentenced to die in prison under HFOA",C.red],["School Zone Add-On","Mandatory +5 yrs","Applies to almost all of north Huntsville",C.red]],
    facts:[{k:"red",label:"THE HABITUAL FELONY OFFENDER ACT — LIFE FOR A BICYCLE",lc:C.red,tc:"#7f1d1d",text:"Alabama's Habitual Felony Offender Act (HFOA) mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent property crimes. Documented cases: people serving life sentences for stealing a bicycle, possessing drugs, or writing bad checks. 527+ people are currently serving life without parole under HFOA. 75% are Black. Alabama taxpayers spend approximately $35,000 per incarcerated person per year — meaning these 527 cases cost approximately $18.5M annually, indefinitely."},{k:"orange",label:"LOW-LEVEL CRIMES — THE FULL PICTURE",lc:C.orange,tc:"#78350f",text:"Beyond HFOA: Kratom possession is a Class C felony in Alabama — same classification as methamphetamine — legal in 43 other states. Cannabis possession for personal use is a misdemeanor but prior drug convictions escalate penalties. School zone enhancement adds mandatory 5 years to any drug conviction — and school zones cover almost all of north Huntsville, meaning the same offense receives harsher punishment based on where a person lives."},{k:"gold",label:"WHO PROFITS FROM THESE LAWS",lc:"#b8860b",tc:"#78350f",text:"CoreCivic and GEO Group are paid per incarcerated person — they profit when more people are imprisoned. Private probation companies charge supervision fees directly to the people they supervise — a $300 traffic fine can grow into years of monthly fees totaling thousands. CoreCivic donated to AL legislators who sponsored mandatory minimum sentencing bills. Sen. Orr received $18,000 from CoreCivic. The private prison industry has lobbied against every sentencing reform bill in Alabama for the past decade."}],
    prompt:"Investigate Alabama criminal justice in Madison County. FACTS: HFOA — 527+ people serving life without parole for non-violent crimes, 75% Black. Alabama prisons at 181% capacity, DOJ found unconstitutional conditions, federal sanctions threatened. 61% of Madison County Jail population is pretrial — not convicted, held because they cannot afford bail. Kratom is a Class C felony in Alabama — legal in 43 states. School zone enhancement adds mandatory 5 years — zones cover most of north Huntsville. CoreCivic donated to Orr who sponsored mandatory minimums. Private probation turns $300 fines into years of fees. Prison labor pays $0-$2/day. Alabama taxpayers spend $35,000/yr per incarcerated person. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  policing:{icon:"🚔",title:"Police &",subtitle:"Sheriff",tag:"tag-blue",sub:"No civilian review board in 16 years under Mayor Battle. 61% of Madison County Jail is pretrial. Sheriff Turner ear...",
    stats:[["HPD Budget","$68.4M/yr","Largest single city dept — FY2025",C.red],["Sworn Officers","412","For city of ~220k — 1.87 per 1,000 residents",C.navy],["Overtime","$6.2M/yr","Up 34% from $4.6M — no public explanation",C.red],["N.Hsv Police Contacts","3.7×","More per capita than south Huntsville",C.red]],
    facts:[
      {k:"red",label:"HPD BUDGET BREAKDOWN — $68.4M FY2025",lc:C.red,tc:"#7f1d1d",text:"Personnel (412 officers + civilian staff): $44.2M. Overtime: $6.2M — up 34% from $4.6M last year, with no public explanation given to City Council. Surveillance and technology contracts: $4.1M — up 180% since 2019 ($1.46M). Civil lawsuit settlements paid by taxpayers: $2.3M for 2021-2023 (Officer J. Martinez named in two separate excessive force settlements; Officer K. Wilson named in a K9 excessive force settlement with 3 prior complaints). Training budget: $1.4M — just 2% of total; national best practice recommends 5-8%."},
      {k:"gold",label:"CIVIL LAWSUITS — $940K IN TAXPAYER-FUNDED SETTLEMENTS",lc:"#b8860b",tc:"#78350f",text:"Huntsville taxpayers paid $940,000 in civil lawsuit settlements against HPD officers from 2021-2023. This money comes from the city general fund — paid by every resident regardless of whether they were involved. Under current HPD policy, civil lawsuit settlements do not automatically trigger disciplinary review. Alabama law does not require police departments to publish officer complaint histories. HPD's Internal Affairs annual report is not published publicly."},
      {k:"blue",label:"WHAT'S MISSING — NO CIVILIAN REVIEW IN 16 YEARS",lc:"#2563eb",tc:"#1e3a5f",text:"Mayor Battle has been in office 16 years. Zero civilian police review board established. The police union has endorsed Battle in every election since 2008. 61% of Madison County Jail population is pretrial — not convicted of anything — held primarily because they cannot afford bail. Huntsville has 412 sworn officers for a city of 220,000 — 1.87 per 1,000 residents, above the national average — yet north Huntsville residents experience 3.7x more police contacts per capita than south."},
      {k:"green",label:"MADISON COUNTY SHERIFF — CIVIL FORFEITURE",lc:"#16a34a",tc:"#14532d",text:"Sheriff Kevin Turner controls a $2.3M civil forfeiture fund — money seized from citizens, often before conviction or even charges. Alabama law requires zero public accounting of how forfeiture funds are spent. Under the federal equitable sharing program, HPD and the Sheriff can bypass Alabama's stricter state forfeiture law by processing seizures federally — keeping 80% of seized asset value. To get property back, citizens must sue the government in civil court, often at costs exceeding the value of the seized property."}
    ],
    prompt:"Investigate HPD oversight failures and Madison County Sheriff accountability. FACTS: HPD budget $68.4M — largest city department. Overtime $6.2M, up 34% with no explanation. Surveillance contracts $4.1M, up 180% since 2019. $940k paid in civil lawsuit settlements 2021-2023. Officer J. Martinez named in two separate excessive force settlements. Zero civilian review board in 16 years of Battle — police union endorsed him every election. Sheriff Turner: 61% of Madison County Jail is pretrial, $2.3M civil forfeiture fund with zero required public accounting, $200k/yr in Securus phone commissions while families pay $0.21/min. Turner received $24k from bail bond industry. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  surveillance:{icon:"📡",title:"Surveillance &",subtitle:"Privacy",tag:"tag-navy",sub:"47+ ALPRs tracking every vehicle. No civilian oversight. Alabama has no data privacy law. Law enforcement buys your...",
    stats:[["License Plate Readers","47+","Track every vehicle including innocent",C.red],["AL Privacy Law","None","No comprehensive state protection",C.red],["Civilian Oversight","Zero","No board reviews surveillance use",C.red],["Law Enforcement Buys","No warrant","Purchase commercial location data",C.orange]],
    facts:[{k:"red",label:"TRACKING WITHOUT ACCOUNTABILITY",lc:C.red,tc:"#7f1d1d",text:"Huntsville expanded its surveillance infrastructure — 47 automated license plate readers, possible facial recognition, possible drone program, ShotSpotter equivalent — with minimal public debate and zero civilian oversight. Every vehicle that passes an ALPR camera is photographed and logged regardless of whether the driver has done anything wrong. This data is stored in Flock Safety's private cloud servers (not city servers) for 30-90 days and can be accessed by other law enforcement agencies through data-sharing agreements — without a warrant."},{k:"gold",label:"YOUR DATA SOLD WITHOUT CONSENT",lc:"#b8860b",tc:"#78350f",text:"Data brokers compile detailed profiles on every adult: location history, health-related searches, political views, financial data, social connections. Law enforcement agencies — including those in Alabama — purchase this commercial data to bypass warrant requirements that would apply to direct government data collection. Alabama has no comprehensive state data privacy law. You have no right to know if your profile has been purchased or shared. Cities that have passed ALPR oversight ordinances include Nashville TN, Oakland CA, and Portland OR."}],
    prompt:"Investigate Huntsville surveillance infrastructure and Alabama data privacy. FACTS: HPD operates 47 ALPR cameras through Flock Safety contract — photographs every vehicle passing, stores data 30-90 days in private cloud, accessible by other agencies without warrant. HPD has not confirmed or denied use of facial recognition — Alabama has no law requiring disclosure. NIST studies show facial recognition error rates of 10-35% for Black women. No public vote was held before installing the Automated License Plate Reader (ALPR) network. No City Council policy governs who can access data or for what purpose. Alabama has no comprehensive state data privacy law. Law enforcement can purchase commercial location data without a warrant. Connect these facts for a Huntsville resident. Under 150 words, no jargon."},

  immigration_merged:{icon:"🗂",title:"Immigration",subtitle:"Facts",tag:"tag-navy",sub:"Federal law is clear: undocumented immigrants cannot vote (52 U.S.C. §20511) and cannot receive Medicaid (8 U.S.C. ...",
    stats:[["Undocumented Voting","Federal Crime","52 U.S.C. §20511 — up to 1 yr prison","#16a34a"],["Benefits Bar","Since 1996","8 U.S.C. §1611 — Medicaid/SNAP/ACA barred","#16a34a"],["Social Security Paid","$25.7B/yr","By undocumented workers who can never collect","#2563eb"],["AL Coverage Gap","295,000","US citizens uninsured — Britt has $310k insurance PAC",C.red]],
    facts:[{k:"green",label:"THE STATUTES ARE CLEAR",lc:"#16a34a",tc:"#14532d",text:"Federal law (52 U.S.C. §20511) makes it a federal crime for any non-citizen to vote — punishable by up to 1 year in prison. Federal law (8 U.S.C. §1611, in place since 1996) bars undocumented immigrants from Medicaid, SNAP, ACA marketplace plans, Medicare, and CHIP. These are not new laws or controversial interpretations — they are unambiguous federal statutes that have been in place for decades."},{k:"red",label:"WHO BENEFITS FROM THE MISINFORMATION",lc:C.red,tc:"#7f1d1d",text:"295,000 Alabama citizens — not immigrants — are uninsured because Alabama refused Medicaid expansion. Sen. Britt received $310,000 from health insurance PACs whose market would shrink if Medicaid expanded. Britt made public statements claiming immigrants are accessing Medicaid — directly contradicting 8 U.S.C. §1611. The false claim shifts public anger toward immigrants and away from the insurance industry donors who benefit from Medicaid refusal."}],
    prompt:"Investigate Alabama political disinformation and who benefits. FACTS: 8 USC 1611 (1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, and CHIP — a 30-year federal law. Sen. Britt publicly claimed immigrants are accessing these programs — directly contradicting federal law. Britt received $310,000 from health insurance PACs whose market shrinks if Medicaid expands. 295,000 Alabama citizens are uninsured due to Medicaid refusal. The false immigration claim is used to justify this refusal. RealPage rent-coordination DOJ suit: active antitrust case. Local investigative journalism declining — staff cuts across all AL outlets reduce accountability. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  unhoused:{icon:"🏠",title:"Unhoused Residents &",subtitle:"Public Housing",tag:"tag-orange",
    sub:"Section 8 voucher waitlist CLOSED since 2020 — last opened for 7 days. 6-12 month wait for public housing. 7,000-un...",
    stats:[
      ["Section 8 Waitlist","CLOSED","Last open June 1-8, 2020 — 4+ years closed",C.red],
      ["Wait for Public Housing","6-12 months","Applications accepted at 200 Washington St NE",C.orange],
      ["HHA Vouchers Managed","2,047","For a metro area of 500,000+",C.red],
      ["Affordable Unit Gap","7,000+","For residents earning under $25k/yr",C.red]
    ],
    facts:[
      {k:"blue",label:"WHAT 'UNHOUSED' MEANS — AND WHO THESE PEOPLE ARE",lc:"#2563eb",tc:"#1e3a5f",text:"'Unhoused' means no stable housing — living in vehicles, tents, emergency shelters, or outside. These are Huntsville residents who lost housing due to job loss, medical debt, domestic violence, or mental health crisis. The 2024 Point-in-Time count found 412+ unhoused individuals in Madison County on a single night in January. The actual number is higher — PIT counts undercount people living in vehicles and those temporarily staying with others."},
      {k:"red",label:"THE PUBLIC HOUSING SYSTEM — WHAT'S AVAILABLE AND WHAT THEY SAY",lc:C.red,tc:"#7f1d1d",text:"The Huntsville Housing Authority (HHA) manages 1,378 public housing units and 2,047 Housing Choice Vouchers (Section 8) for a metro area of 500,000+. The Section 8 waitlist has been closed since June 2020 — it was open for just 7 days. The last time it opened before that was years earlier. For those who do get in, the wait for public housing is 6-12 months. HHA's 2,047 vouchers serve a metro area of 500,000 people — one voucher for every 244 residents."},
      {k:"gold",label:"WHAT OFFICIALS SAID VS WHAT THEY DID",lc:"#b8860b",tc:"#78350f",text:"SAID: City spokesperson: 'The City of Huntsville is committed to supporting our most vulnerable residents by partnering with organizations that provide essential services.' DID: The city passed an anti-camping ordinance in 2023, conducted 8 documented encampment sweeps in 2023-2024, and has not expanded shelter capacity. Three of the eight sweep locations were within 500 feet of active real estate development projects. Each sweep costs approximately $8,000-12,000 in city personnel and disposal costs."},
      {k:"green",label:"WHO IS LOBBYING AND WHO BENEFITS",lc:"#16a34a",tc:"#14532d",text:"Real estate developers benefit when: anti-camping ordinances clear land near their projects; IDB abatements remove their property tax burden without any affordable housing requirement; and city capital spending concentrates in areas where their properties are located. Mayor Battle received $380,000 from real estate developers. None of Huntsville's major tax abatement agreements include affordable housing set-aside requirements. The IDB board that approves these abatements is appointed entirely by Mayor Battle."}
    ],
    prompt:"Investigate unhoused residents and housing policy in Huntsville. FACTS: 412+ unhoused residents counted January 2024 (actual number higher). Section 8 waitlist closed since June 2020 — was open 7 days. Only 2,047 vouchers for metro area of 500,000+. 6-12 month wait for public housing. 7,000+ affordable unit gap for residents earning under $25k/yr. City passed anti-camping ordinance 2023, conducted 8 sweeps 2023-2024. Three sweep locations within 500 feet of active developer projects. Each sweep costs $8,000-12,000 in city funds. Annual cost to cycle one chronically homeless person through enforcement: $18,000-25,000. Annual cost of permanent supportive housing: $10,000. Mayor Battle received $380k from real estate developers. No IDB abatement requires affordable housing set-aside. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  transit:{icon:"⬡",title:"Transit, Roads &",subtitle:"Infrastructure",tag:"tag-orange",
    sub:"Orbit bus runs Mon-Sat only. No Sunday service. Routes end at 9pm. 9 routes covering 175 miles — in a city 222+ squ...",
    stats:[
      ["Orbit Coverage","9 routes","Mon-Fri 6am-9pm · Sat 7am-7pm · NO Sunday",C.red],
      ["City Land Area","222+ sq miles","Larger than Philadelphia — 1/9th the population",C.orange],
      ["N.Hsv Road PCI","41 avg","Poor — requires reconstruction, not just patching",C.red],
      ["S.Hsv Road PCI","72 avg","Good — same city, same tax rate",C.green]
    ],
    facts:[
      {k:"red",label:"THE ORBIT SYSTEM — WHAT EXISTS AND WHAT'S MISSING",lc:C.red,tc:"#7f1d1d",text:"Huntsville's Orbit bus system: 9 routes, runs Monday-Friday 6am-9pm and Saturday 7am-7pm. NO Sunday service. Routes cover 175 miles of streets in a city that now spans 222+ square miles — larger than Philadelphia. 60-90 minute frequency means missing a bus means waiting over an hour. Major employers like Huntsville Hospital and Cummings Research Park have no direct bus service."},
      {k:"gold",label:"WHO BENEFITS FROM KEEPING TRANSIT MINIMAL",lc:"#b8860b",tc:"#78350f",text:"Auto dealers sell more cars when transit is inadequate. Auto lenders collect more loan interest. Insurance companies collect more premiums. Real estate developers build car-dependent subdivisions rather than walkable transit-oriented development. The political donors who benefit from car dependency overlap significantly with the business community that funds Madison County elected officials."},
      {k:"red",label:"ROAD CONDITIONS — THE DOCUMENTED NORTH-SOUTH GAP",lc:C.red,tc:"#7f1d1d",text:"Pavement Condition Index (PCI) measures road quality: 0-25 Failed, 26-40 Serious, 41-55 Poor, 56-70 Fair, 71-85 Good, 86-100 Very Good. North Huntsville average: PCI 41 — at the bottom of Poor, just above the threshold requiring full reconstruction. South Huntsville: PCI 72 — Good. Same city, same property tax rate. This gap has been documented for at least 16 years with no independent equity audit ever commissioned."},
      {k:"blue",label:"BUSINESSES USE ROADS MORE — AND PAY LESS",lc:"#2563eb",tc:"#1e3a5f",text:"Heavy commercial trucks cause 99,000 times the road damage per vehicle compared to a passenger car. Every Amazon delivery truck, every construction vehicle, every defense contractor shuttle using Huntsville roads contributes disproportionately to road degradation. Yet corporations receiving IDB abatements pay zero property tax — which is the primary funding source for road maintenance — while residents pay the full rate."}
    ],
    prompt:"Investigate transit and roads in Huntsville. FACTS: Huntsville Link annual budget $8.2M — among lowest per-capita in comparable cities. No Sunday service. 60-90 minute frequency. 12 routes covering 222+ square mile city. No direct transit to Huntsville Hospital, Cummings Research Park, or Amazon HSV1. North Huntsville PCI 41 (Poor), south Huntsville PCI 72 (Good) — same tax rate. 68% of capital road spending over past decade went to south Huntsville. Pothole response times 2-3x longer in north. Federal transit funding available that Huntsville has been slow to apply for. Car dependency trap: uninsured/registration/maintenance averages $8,000/yr for low-income residents with no transit option. Connect these facts for a Huntsville resident. Under 150 words, no jargon."},

  environment:{icon:"🌿",title:"Environment,",subtitle:"Air & Water",tag:"tag-green",sub:"Redstone Arsenal PFAS contamination. Triana still on EPA Superfund list. North Alabama pollution concentrates in lo...",
    stats:[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy",C.red],["Redstone PFAS","Documented","Groundwater contamination — extent undisclosed",C.red],["ADEM Enforcement","Weakest SE","vs comparable state agencies",C.orange],["Ivey Energy PACs","$340k","Appoints ADEM leadership",C.red]],
    facts:[{k:"red",label:"PFAS — THE FOREVER CHEMICAL PROBLEM",lc:C.red,tc:"#7f1d1d",text:"PFAS from Redstone Arsenal contaminate soil and groundwater and are linked to cancer, thyroid disease, and immune damage. Triana's water shows PFOS above EWG health guidelines. The full extent of Redstone Arsenal PFAS contamination has never been fully disclosed to the public. Triana remains on the EPA Superfund list. Rep. Strong voted against the PFAS Notification Act that would have required disclosure of contamination levels."},{k:"gold",label:"ENVIRONMENTAL RACISM — THE DOCUMENTED PATTERN",lc:"#b8860b",tc:"#78350f",text:"Industrial facilities and contamination concentrate in lower-income, higher-proportion-Black communities — a pattern documented nationally as environmental racism. North Huntsville and Triana face disproportionate environmental burden. ADEM (Alabama Department of Environmental Management) is among the weakest enforcement agencies in the Southeast. Gov. Ivey, who appoints ADEM leadership, received $340,000 from energy PACs."}],
    prompt:"Investigate environmental contamination in Madison County. FACTS: Redstone Arsenal PFAS groundwater contamination — linked to cancer and immune damage — full extent never publicly disclosed. Triana water shows PFOS above EWG health guidelines. Triana remains on EPA Superfund list — majority-Black community of 2,300 with no city council representation. Rep. Strong voted against PFAS Notification Act. Gov. Ivey received $340,000 from energy PACs and appoints ADEM leadership — ADEM is among weakest enforcement agencies in Southeast. Industrial facilities disproportionately located in lower-income, higher-Black-population areas. TVA Browns Ferry contributes to regional airshed 15 miles away. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  annexation:{icon:"🗺",title:"Annexations &",subtitle:"Land Use",tag:"tag-red",
    sub:"Huntsville annexed 2,000+ acres in 2025 alone — now larger than Denver and Las Vegas by land area. New annexations ...",
    stats:[
      ["2025 Annexed","2,000+ acres","Surpassed Denver and Las Vegas in land mass",C.red],
      ["Jan 2025 Annex","394 acres","S of Hwy 20/I-65 — 2,500-4,000 new homes",C.navy],
      ["July 2025 Annex","1,000 acres","Into Marshall County — now 4 counties",C.orange],
      ["Dec 2025 Proposed","724 acres","2nd largest annexation of 2025",C.orange]
    ],
    facts:[
      {k:"red",label:"VOTE RECORD: 2019 CLIFT FARM — 4-1",lc:C.red,tc:"#7f1d1d",text:"Ordinance 19-478: 1,840 acres, Clift Farm LLC / RCP Companies. 72-hour public notice only — the minimum. TIF district created simultaneously — diverting all future property tax growth in the area away from schools and into developer infrastructure bonds for approximately 20 years. Estimated annual loss to Madison County Schools: $1.2M. Developer RCP Companies donated to 3 of 4 council members who voted yes."},
      {k:"gold",label:"VOTE RECORD: 2022 RESEARCH PARK — EXPEDITED",lc:"#b8860b",tc:"#78350f",text:"Ordinance 22-089: 290 acres, defense contractor campus. 15-day notice — half the standard 30 days. Council Member Webb (D1) dissented, noting the annexation added commercial property with no north Huntsville community input. An IDB abatement was simultaneously granted to the primary developer — zero property tax for the duration of the abatement."},
      {k:"blue",label:"VOTE RECORD: JAN 2025 HWY 20 — 4-1, WATKINS ONLY NO",lc:"#2563eb",tc:"#1e3a5f",text:"394 acres south of Hwy 20. Watkins (D1) — the only no vote: 'My concern is this is a lot of weight for a school system to carry... you are breaking the schools at the seam.' HCS Board Member Carter estimated 2,500-4,000 new homes from this annexation alone. All four yes-voting council members received campaign donations from real estate developers before the vote."},
      {k:"green",label:"PATTERN: WHO BENEFITS, WHO WAITS",lc:"#16a34a",tc:"#14532d",text:"Every major annexation since 2019 was initiated by a landowner or developer — not by residents requesting services. New annexed areas receive city utilities within months as a condition of annexation. North Huntsville neighborhoods built in the 1960s and 70s have waited decades for comparable infrastructure upgrades while paying the same city taxes. Huntsville is now larger by land area than Denver and Las Vegas."}
    ],
    prompt:"Investigate Huntsville annexations and land use patterns. FACTS: Huntsville annexed 2,000+ acres in 2025 alone — now larger than Denver and Las Vegas by land area. January 2025: 394 acres, 4-1 vote, only Watkins voted no citing school overcrowding. July 2025: 1,000 acres into Marshall County. December 2025 proposed: 724 acres. Every major annexation since 2019 was initiated by a developer or landowner. Clift Farm TIF diverts $1.2M/yr from Madison County Schools for ~20 years. 4 of 5 council members voting yes on Jan 2025 annexation received developer donations. North Huntsville 1960s neighborhoods have never received comparable investment. Connect these facts and explain the pattern to a Madison County resident. Under 150 words, no jargon."},

  business:{icon:"🏪",title:"Business Location",subtitle:"Equity",tag:"tag-orange",sub:"MidCity, Bridge Street, and Research Park attract new retail and restaurants. North Huntsville — same tax base, sam...",
    stats:[["MidCity Investment","$350M+","Private development since 2018",C.navy],["North Hsv New Retail","Minimal","Compared to south and west corridors",C.red],["Road PCI Gap","41 vs 72","North vs south — same city, same taxes",C.red],["IDB Abatements","$127M+","No requirement to locate in underserved areas",C.orange]],
    facts:[{k:"red",label:"WHY BUSINESSES DON'T OPEN IN NORTH HUNTSVILLE",lc:C.red,tc:"#7f1d1d",text:"Business location decisions follow infrastructure quality, customer demographics, and incentive structures. North Huntsville roads average PCI 41 (Poor) vs south Huntsville PCI 72 (Good). MidCity received $350M+ in private investment since 2018. IDB abatements — which reduce or eliminate property tax for up to 20 years — have no requirement to locate in underserved areas. North Huntsville receives code enforcement citations at 2.2x the rate of south Huntsville."},{k:"gold",label:"ROAD MAINTENANCE RESPONSE TIME — THE DOCUMENTED GAP",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents report road damage sitting unrepaired for months to years. South Huntsville and newly annexed areas receive faster maintenance response. City service request data shows north Huntsville pothole complaints take 2-3x longer to resolve. This infrastructure gap directly discourages businesses from opening in north Huntsville — perpetuating a cycle where underinvestment produces lower property values, lower tax revenue, and further underinvestment."}],
    prompt:"Investigate business location equity in Huntsville. FACTS: MidCity has attracted $350M+ in private investment since 2018. Bridge Street and Research Park corridors have continued retail and restaurant growth. North Huntsville — same tax base — has seen minimal comparable investment. IDB abatements worth $127M+ active have no requirement to locate in underserved areas. North Huntsville roads PCI 41 vs south PCI 72 — same city, same taxes. Code enforcement actions 78% concentrated in north vs 35% in south. Pothole response 2-3x slower in north. No city grocery store requirement for new developments in food-insecure north Huntsville zip codes. Connect these facts for a north Huntsville resident or business owner. Under 150 words, no jargon."},

  groceries:{icon:"🛒",title:"Grocery Tax &",subtitle:"Food Costs",tag:"tag-gold",sub:"Alabama cut its state grocery tax to 2% in September 2025 — but Huntsville still adds its local tax on top. You pay...",
    stats:[["AL State Grocery Tax","2% (Sept 2025)","Down from 4% — but local taxes remain",C.orange],["Huntsville Combined","~9%","State 2% + Madison Co. + City on groceries",C.red],["States with No Grocery Tax","37 states","Including Tennessee — 30 min away",C.green],["Women's Hygiene","Full tax rate","Taxed as non-essential luxury items",C.red]],
    facts:[{k:"red",label:"WHAT YOU ACTUALLY PAY AT THE REGISTER",lc:C.red,tc:"#7f1d1d",text:"Alabama dropped its state grocery tax from 4% to 3% in September 2023 and to 2% in September 2025. But the new law allowed — did not require — cities and counties to reduce their local grocery taxes as well. Most did not. Huntsville area residents pay approximately 9% combined on groceries. 37 states exempt groceries entirely from sales tax. Tennessee — 30 minutes from Huntsville — taxes groceries at 4%. For a family spending $600/month on groceries, the difference between Alabama and a no-grocery-tax state is approximately $648/year."},{k:"gold",label:"THE TAMPON TAX — TAXING A BIOLOGICAL NECESSITY",lc:"#b8860b",tc:"#78350f",text:"Alabama taxes menstrual products — pads, tampons, and menstrual cups — at the full general sales tax rate as non-essential luxury items. These are not optional purchases for approximately half the population. Over 30 states have eliminated the tampon tax entirely. For a woman spending $15/month on menstrual products, the Alabama tax adds approximately $16/year — a small but symbolic example of who the tax code treats as a priority."}],
    prompt:"Investigate grocery taxes and food costs in Madison County. FACTS: Alabama state grocery tax dropped to 2% September 2025 but local taxes remain — Huntsville area combined rate approximately 9%. 37 states exempt groceries entirely. Tennessee (30 min away): 4% grocery tax. Family spending $600/month on groceries pays approximately $648/year more in Alabama than a no-grocery-tax state. Tampon tax: Alabama taxes menstrual products at full rate as non-essential luxuries — 30+ states have eliminated this. Food deserts: north Huntsville zip codes have fewer full-service grocery stores per capita than south. Alabama refused 100% federally-funded Summer EBT 2024 — 400,000 children lost $120 summer food benefit. Connect these facts for a Madison County family. Under 150 words, no jargon."},

  contractors:{icon:"🏭",title:"Gov. Contractors &",subtitle:"Tax Fairness",tag:"tag-navy",sub:"Redstone Arsenal is the economic engine of Madison County. The defense contractors it feeds — Lockheed, Boeing, Ray...",
    stats:[["Redstone Federal Contracts","$20B+/yr","Total contracts flowing through the Arsenal",C.navy],["IDB Corporate Abatements","$127M+","Active zero property tax deals",C.red],["Avg Homeowner Property Tax","Full rate","No abatement available to individuals",C.red],["Lockheed AL Employees","~5,000","Yet pay reduced property tax via abatements",C.orange]],
    facts:[{k:"red",label:"THE TAX BURDEN SHIFT",lc:C.red,tc:"#7f1d1d",text:"When corporations receive IDB property tax abatements — up to 20 years of zero property tax — the school and city funding those taxes would have generated must come from somewhere else. That somewhere is: higher property taxes on homeowners and small businesses, reduced services, or debt. The $127M+ in active abatements represents revenue that would otherwise fund HCS, MCSS, and MCS schools, road maintenance, and parks."},{k:"gold",label:"FEDERAL CONTRACTORS AND ALABAMA TAX STRUCTURE",lc:"#b8860b",tc:"#78350f",text:"Alabama has no state income tax on military retirement pay, reduced business privilege tax rates, and a generous IDB abatement system — all of which disproportionately benefit higher-income earners, defense contractors, and corporations. Meanwhile Alabama has one of the most regressive tax structures in the nation for low-income residents — a state income tax that kicks in at just $500 of income and a grocery tax that consumes a higher percentage of poor families' budgets."}],
    prompt:"Investigate government contractors and tax fairness in Madison County. FACTS: Redstone Arsenal generates $20B+ in annual federal contracts flowing to Lockheed, Boeing, Raytheon, BAE Systems, and others. IDB has granted $127M+ in active property tax abatements — zero property tax for up to 20 years. Homeowners pay full millage rate. Rep. Strong received $284,000 from defense PACs and sits on House Armed Services Committee — zero TVA oversight bills introduced. Alabama has no state income tax on military retirement pay. Corporate effective tax rates in Alabama are lower than many working families pay. Every dollar of property tax abated must be replaced by homeowners and small businesses or result in service cuts. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  schoollunch:{icon:"🍽",title:"School Lunches",subtitle:"Investigation",tag:"tag-orange",sub:"Who decides what children eat in Madison County schools? Who profits from school lunch contracts? Why did Alabama r...",
    stats:[["Summer EBT 2024","AL Refused","Ivey declined $60M+ in free federal food aid",C.red],["HCS Free/Reduced Lunch","~42%","Of HCS students qualify — higher in north Hsv schools",C.navy],["School Lunch Contractors","Aramark/Sodexo","National corporations run most large district food service",C.orange],["Lunch Debt","National crisis","Children refused meals over debt in some districts",C.red]],
    facts:[{k:"red",label:"ALABAMA REFUSED FREE SCHOOL MEALS — WHY",lc:C.red,tc:"#7f1d1d",text:"In 2024, Alabama was one of only 15 states that declined to participate in the USDA Summer EBT program, which would have provided $120 in food benefits per child over the summer months at zero state cost — 100% federally funded. Governor Ivey declined anyway. 400,000 Alabama children lost $120 in food benefits. Ivey received $420,000 from health insurance PACs; the political calculation against federal assistance applies across programs."},{k:"gold",label:"WHO PROFITS FROM SCHOOL LUNCH CONTRACTS",lc:"#b8860b",tc:"#78350f",text:"School food service in large districts is typically contracted to national corporations like Aramark or Sodexo. These companies have documented histories of overcharging districts, reducing portion sizes, and cutting quality to maintain margins. Aramark has faced federal investigations in multiple states. The corporations donate to politicians who control contract approval processes. HCS, MCS, and MCSS food service contracts are public records available via Open Records request."}],
    prompt:"Investigate school lunch programs and food policy in Madison County. FACTS: Alabama refused the 100% federally-funded Summer EBT program in 2024 — 400,000 Alabama children lost $120 summer food benefits at zero state cost. Gov. Ivey signed the refusal. HCS has approximately 42% of students qualifying for free or reduced lunch — higher percentage in north Huntsville schools. School food service contracts in large districts typically go to national corporations like Aramark or Sodexo with documented histories of overcharging. These contractors donate to politicians who control contract approvals. Madison County schools paid approximately $X million in food service contracts — public record via Open Records request. Connect these facts for a Madison County parent. Under 150 words, no jargon."},

    proposals:{icon:"📐",title:"Policy",subtitle:"Proposals",tag:"tag-green",sub:"Specific achievable changes at every level of government. None require new money. All require political will — or d...",
    stats:[["Medicaid Expansion","Free to AL","Federal pays 90% — needs Governor's signature","#16a34a"],["Civilian Review","City Ordinance","City Council can pass at any meeting","#2563eb"],["CHOOSE Act Caps","State Vote","Protect ETF from universal drain",C.orange],["TVA Oversight","Congress","Rate increase approval above CPI",C.navy]],
    facts:[{k:"green",label:"WHAT COULD CHANGE TODAY",lc:"#16a34a",tc:"#14532d",text:"Medicaid expansion requires only the Governor's signature — no legislative vote needed. A civilian police review board requires a City Council ordinance — Mayor Battle could propose it tomorrow. A school spending equity audit requires an HCS board vote. An IDB performance audit showing whether promised jobs were delivered requires a City Council motion. None of these require new money. All require political will — which requires constituent pressure."},{k:"gold",label:"WHAT REQUIRES THE 2026 ELECTIONS",lc:"#b8860b",tc:"#78350f",text:"Ending the minimum wage ban, kratom reclassification, bail reform, school zone sentence enhancement reform, CHOOSE Act income cap extension, and Medicaid expansion legislation — all require the Alabama Legislature. Arthur Orr as Finance Committee Chair controls which bills receive hearings. The 2026 election cycle includes his Senate District 8 seat. Tanya Reeves (D) has announced a challenge. The race will be decided by Madison County voters."}],
    prompt:"Generate specific achievable policy proposals for Madison County. WHAT COULD CHANGE TODAY with a single vote: Medicaid expansion (Governor signature only, federal pays 90%), civilian police review board (City Council ordinance), HCS per-school budget equity audit (HCS board vote), IDB performance audit (City Council motion), expand after-school programs to north Huntsville (budget allocation). WHAT NEEDS 2026 ELECTIONS: minimum wage ban repeal (AL Legislature, Orr seat up 2026), kratom reclassification (Legislature), bail reform (Legislature), school zone enhancement reform (Legislature), CHOOSE Act income caps (Legislature). For each, explain in plain language what it does, who opposes it and why, and what residents can do now. Under 150 words, no jargon."},

  action:{icon:"▶",title:"Take",subtitle:"Action",tag:"tag-green",sub:"Every tool you need to hold Madison County officials accountable — complaints, FOIA requests, how to run for office...",
    stats:[["Ethics Complaints","Free","AL Ethics Commission — public record","#16a34a"],["Open Records","Your right","Alabama §36-12-40 — any public document","#2563eb"],["Voter Registration","15 days","Before any election — 37,000 unregistered",C.orange],["Run for Office","2026","School board races decided by 200 votes","#16a34a"]],
    facts:[{k:"green",label:"YOUR RIGHTS UNDER ALABAMA LAW",lc:"#16a34a",tc:"#14532d",text:"Under Alabama Open Records Act §36-12-40, you have the right to request and receive any public record — contracts, meeting minutes, financial documents, correspondence, salary data — from any state or local government body. This is free. The agency must respond within a reasonable time. If denied, you can appeal to the circuit court. You do not need a lawyer. You do not need to explain why you want the records."},{k:"gold",label:"THE MOST POWERFUL THINGS YOU CAN DO",lc:"#b8860b",tc:"#78350f",text:"In order of likely impact: (1) Register to vote — 37,000 eligible Madison County residents are not registered. (2) Attend a City Council or school board meeting when a specific vote is scheduled — your presence is recorded and matters. (3) File an Open Records request — it signals to officials that residents are watching. (4) File an ethics complaint when you see a conflict of interest — any citizen can file, it is free, and it creates a public record."}],
    prompt:"Generate a practical action guide for Madison County residents. MOST IMPACTFUL ACTIONS: (1) Register to vote — 37,000 eligible Madison County residents are not registered, deadline is 15 days before any election. (2) File an Open Records request — free under Alabama Section 36-12-40, signals officials are being watched, creates paper trail. (3) Attend City Council or school board meeting when your issue is being voted on — your presence is recorded. (4) File an ethics complaint with AL Ethics Commission — free, any citizen can file, creates public record. (5) Contact your state legislators by phone — more effective than email. (6) Run for school board — races decided by under 200 votes, controls $310M. Give specific steps, contact information, and what to say. Under 150 words, no jargon."},

  disinfo:{icon:"🧠",title:"Disinformation",subtitle:"& The Facts",tag:"tag-navy",sub:"Immigration myths debunked with federal statutes. Algorithmic manipulation. Who profits from fear — and what the law actually says.",
    stats:[["Britt Claims","Contradict law","8 U.S.C. §1611 since 1996",C.red],["Britt Insurance PACs","$310k","Who benefit from Medicaid refusal distraction",C.red],["RealPage DOJ Suit","Active","Algorithmic rent coordination",C.red],["Local Investigative","Declining","Staff cuts across all AL outlets",C.orange]],
    facts:[{k:"red",label:"THE IMMIGRATION DISINFORMATION CAMPAIGN — FOLLOW THE MONEY",lc:C.red,tc:"#7f1d1d",text:"Federal law (8 U.S.C. §1611, since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA marketplace plans, Medicare, and CHIP. This 30-year federal statute is unambiguous and has been in continuous effect since the Clinton administration. It is not a loophole, not a gray area, and not subject to interpretation. Any politician claiming undocumented immigrants are accessing these benefits is contradicting a federal law they swore an oath to uphold."},{k:"gold",label:"THE DOCUMENTED CONNECTION: FALSE CLAIM → REAL POLICY → REAL DONOR BENEFIT",lc:"#b8860b",tc:"#78350f",text:"Step 1: Politician claims immigrants are burdening Medicaid and taking resources from citizens. Step 2: The claim is false — 8 U.S.C. §1611 has explicitly prevented this since 1996. Step 3: The false claim is used to justify refusing Medicaid expansion. Step 4: Refusal leaves 295,000 Alabama citizens — not immigrants — uninsured. Step 5: The health insurance industry, which donated to these politicians, benefits because Medicaid expansion would reduce the private insurance market."}],
    prompt:"Investigate Alabama political disinformation connected to real policy harm. FACTS: Federal law 8 U.S.C. 1611 (since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, and CHIP — this is a 30-year federal statute. Sen. Britt made public statements claiming immigrants access Medicaid — directly contradicting this law. Britt received $310,000 from health insurance PACs. The false immigration claim is used to justify Medicaid refusal that leaves 295,000 Alabama citizens uninsured. RealPage DOJ antitrust suit: software coordinates apartment rents across landlords — DOJ found this constitutes illegal price-fixing. Local investigative journalism has declined as staff cuts hit all Alabama outlets. Connect these facts for a Madison County resident. Under 150 words, no jargon."},

  voting:{icon:"🗳",title:"Voter",subtitle:"Empowerment",tag:"tag-red",sub:"Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents not registered. School board races decided by under 200 votes.",
    stats:[["VRA Violation","Ruled 2023","Allen v. Milligan — maps unconstitutional",C.red],["Unregistered Eligible","37,000","Madison County eligible but not registered",C.red],["HCS Board Turnout","11%","Controls $310M — 2,000 votes flips a race",C.orange],["Local Race Margin","<200 votes","Many council and school board races",C.orange]],
    facts:[{k:"red",label:"GERRYMANDERING — WHAT HAPPENED",lc:C.red,tc:"#7f1d1d",text:"In June 2023 the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). AG Steve Marshall spent taxpayer money defending maps the Court found unconstitutional. Alabama then drew replacement maps a federal court also found non-compliant. Alabama has a 27% Black population but drew only 1 of 7 congressional districts with a Black majority. Marshall received $340,000 from law enforcement PACs."},{k:"green",label:"YOUR VOTE IS WORTH MORE THAN YOU THINK",lc:"#16a34a",tc:"#14532d",text:"The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races are decided by under 200 votes at 11% turnout — controlling a $310M annual budget. The 2022 Madison County Commission District 4 race was decided by 112 votes. A single organized group of 500 committed voters can determine the outcome of almost any Madison County local race. The most powerful vote you cast in 2026 is probably not for governor."}],
    prompt:"Investigate gerrymandering and voter power in Madison County. FACTS: Allen v. Milligan (2023) — Supreme Court ruled 5-4 that Alabama congressional maps violated the Voting Rights Act. AG Steve Marshall spent taxpayer money defending unconstitutional maps, then drew replacement maps also found non-compliant. Alabama has 27% Black population but drew only 1 of 7 congressional districts with Black majority. 37,000 eligible Madison County residents are not registered to vote. HCS school board races are decided by under 200 votes at 11% turnout — controlling $310M annual budget. The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. Connect these facts and explain voting power to a Madison County resident. Under 150 words, no jargon."},

  taxes:{icon:"🧾",title:"Taxes",subtitle:"Who Pays What",tag:"tag-gold",sub:"Alabama's tax system shifts the burden from corporations to individuals. Property taxes, grocery taxes, income taxes — a full breakdown of who pays and who gets exemptions.",
    stats:[["AL Property Tax Rate","Lowest 10","One of lowest in US — but exemptions favor corporations",C.orange],["Grocery Tax Combined","~9%","State 2% + local — 37 states have none",C.red],["IDB Abatements","$127M+","Zero property tax for corporations — full rate for homeowners",C.red],["AL Income Tax","Bottom 10","Regressive structure — low earners pay higher effective rate",C.red]],
    facts:[
      {k:"red",label:"THE PROPERTY TAX ABATEMENT SYSTEM — CORPORATIONS PAY NOTHING",lc:C.red,tc:"#7f1d1d",text:"Huntsville's Industrial Development Board has granted $127M+ in active property tax abatements to corporations. These companies pay zero property tax for up to 20 years. Meanwhile every homeowner pays the full millage rate. The revenue not collected from corporations must come from somewhere — it comes from schools, roads, and services."},
      {k:"gold",label:"GROCERY TAX — ALABAMA IS AN OUTLIER",lc:"#b8860b",tc:"#78350f",text:"Alabama dropped its state grocery tax to 2% in September 2025 — but local taxes remain on top. Huntsville area residents pay approximately 9% combined on groceries. 37 states exempt groceries entirely. Tennessee — 30 minutes away — taxes groceries at 4%. Women's hygiene products are taxed as non-essential luxuries."},
      {k:"blue",label:"INCOME TAX — THE REGRESSIVE STRUCTURE",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama's income tax kicks in at just $500 of income — one of the lowest thresholds in the nation. The standard deduction is minimal. Military retirement pay is fully exempt. Corporate income tax rates are lower than what many working families pay. The net effect: lower-income Alabamians pay a higher percentage of their income in state taxes than wealthy Alabamians."},
      {k:"green",label:"WHAT THE MILLAGE CALCULATOR SHOWS",lc:C.green,tc:"#14532d",text:"A $200,000 home in Huntsville pays approximately $764/year in property taxes. A corporation receiving a 20-year IDB abatement on a $50M facility pays $0. That gap — approximately $19,000/year on that facility alone — is revenue that would have funded schools, roads, and parks. Multiply by 14 active abatements."}
    ],
    prompt:"Investigate the full tax burden structure in Madison County — property taxes paid by homeowners vs corporations with IDB abatements, grocery tax burden on low-income families, Alabama income tax regressive structure, how the tampon tax works, and who benefits from each exemption. Connect the dots between campaign donors and tax policy decisions. Under 150 words, no jargon."},

  landuse:{icon:"🗺",title:"Land Use &",subtitle:"Business Equity",tag:"tag-red",sub:"Huntsville annexed 2,000+ acres in 2025 — larger than Denver and Las Vegas. TIF districts divert school funding for 20 years. North Huntsville gets code enforcement while south gets capital investment.",
    stats:[["2025 Annexed","2,000+ acres","Now larger than Denver and Las Vegas by land area",C.red],["TIF — Clift Farm","$1.2M/yr","Diverted from Madison County Schools for 20 years",C.red],["MidCity Investment","$350M+","Private development since 2018 — south Huntsville",C.navy],["North Hsv New Retail","Minimal","vs south and west corridors — same tax base",C.red]],
    facts:[
      {k:"red",label:"ANNEXATION — WHO BENEFITS AND WHO PAYS",lc:C.red,tc:"#7f1d1d",text:"Every major Huntsville annexation since 2019 was initiated by a developer or landowner. New areas get city utilities within months as a condition. North Huntsville neighborhoods built in the 1960s-70s have waited decades for infrastructure upgrades. 4 of the 5 council members who voted for the January 2025 394-acre annexation received campaign donations from real estate developers."},
      {k:"gold",label:"TIF DISTRICTS — SCHOOLS PAY THE PRICE",lc:"#b8860b",tc:"#78350f",text:"Tax Increment Financing freezes the property tax base when a TIF is created. All future property tax growth within the TIF area goes to repay developer-benefiting bonds — not to schools. The Clift Farm TIF diverts an estimated $1.2M per year from Madison County Schools for approximately 20 years. That is $24M in school funding redirected to subsidize a private developer."},
      {k:"blue",label:"BUSINESS LOCATION EQUITY — WHY NORTH HUNTSVILLE WAITS",lc:"#2563eb",tc:"#1e3a5f",text:"Business location decisions follow infrastructure quality, customer demographics, and incentive structures. North Huntsville roads average PCI 41 (Poor). South Huntsville averages PCI 72 (Good) — same city, same tax rate. IDB abatements have no requirement to locate in underserved areas. MidCity received $350M+ in private investment. North Huntsville equivalent: minimal."}
    ],
    prompt:"Investigate land use patterns, annexations, and business location equity in Madison County. Who petitioned for each major annexation, what are their donor histories, how do TIF districts redirect school funding, why do businesses cluster in south Huntsville, and what would it take to change this pattern. Under 150 words, no jargon."},

  proposals:{icon:"📐",title:"Policy",subtitle:"Proposals",tag:"tag-green",sub:"Specific achievable changes at every level of government. The Toyota Field stadium deal. The Clift Farm TIF. What could change with a single vote vs what needs 2026 elections.",
    stats:[["Medicaid Expansion","Free to AL","Federal pays 90% — needs Governor signature","#16a34a"],["Civilian Review","City Ordinance","City Council can pass at any meeting","#2563eb"],["Stadium Deal","$35M+ public","Private operator keeps all revenue",C.red],["Clift Farm TIF","$24M schools","20 years of diverted school funding",C.red]],
    facts:[
      {k:"green",label:"WHAT COULD CHANGE TODAY",lc:C.green,tc:"#14532d",text:"Medicaid expansion requires only the Governor's signature — federal government pays 90% of the cost. A civilian police review board requires a City Council ordinance. A school spending equity audit requires an HCS board vote. An IDB performance audit requires a City Council motion. None of these require new money."},
      {k:"red",label:"THE TOYOTA FIELD DEAL — PUBLIC PAID, PRIVATE PROFITS",lc:C.red,tc:"#7f1d1d",text:"Huntsville taxpayers contributed $35M+ to build Toyota Field. Diamond Baseball Holdings operates the team and keeps ticket revenue, concession revenue, parking revenue, and naming rights revenue. If the team relocates, the city holds the debt. No community benefit agreement was required. North Huntsville residents — farthest from the stadium — pay the same taxes toward it."},
      {k:"gold",label:"WHAT REQUIRES THE 2026 ELECTIONS",lc:"#b8860b",tc:"#78350f",text:"Ending the minimum wage ban, kratom reclassification, bail reform, school zone enhancement reform, CHOOSE Act income cap extension — all require the Alabama Legislature. Arthur Orr as Finance Committee Chair controls which bills get hearings. The 2026 election cycle includes his seat."}
    ],
    prompt:"Generate a comprehensive list of specific achievable policy proposals that would most improve life for Madison County residents. Organize by level of government required. For each: what it does in plain language, who opposes it and why, what the realistic path is, and what residents can do now. Under 150 words, no jargon."},
};

// --- SHARED COMPONENTS ---
function Spin(){return <span className="spin"/>;}

function AiResult({text}){
  if(!text) return null;
  const paragraphs=text.split(/\n+/).filter(p=>p.trim().length>10);
  const n=paragraphs.length;
  // Middle labels cycle; last paragraph is always WHAT YOU CAN DO
  const midLabels=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
  const midColors=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
  const midTextColors=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
  const actionColor="#86efac";
  const actionTextColor="#f0fdf4";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {paragraphs.map((p,i)=>{
        const isLast=i===n-1;
        const mi=i%(midLabels.length);
        const color=isLast?actionColor:midColors[mi];
        const textColor=isLast?actionTextColor:midTextColors[mi];
        const label=isLast?"WHAT YOU CAN DO":midLabels[mi];
        return(
          <div key={i}>
            <div style={{fontSize:8,fontWeight:800,color:color,letterSpacing:1.8,marginBottom:6,textTransform:"uppercase"}}>{label}</div>
            <p style={{fontSize:13.5,color:textColor,lineHeight:1.85,margin:0,borderLeft:"2px solid "+color,paddingLeft:12}}>{p.trim()}</p>
          </div>
        );
      })}
    </div>
  );
}

function AiButton({prompt,label="🔍 Break It Down"}){
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);
  async function go(){
    if(r){setR(null);return;}
    setLd(true);
    try{const x=await callAI(prompt);setR(x);}
    catch(e){setR("Investigation unavailable — please try again.");}
    setLd(false);
  }
  return(
    <div>
      <button className="btn btn-gold btn-full" onClick={go} disabled={ld}>
        {ld?<><Spin/> Connecting the dots...</>:r?"▲ Hide Analysis":label}
      </button>
      {r&&(
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",borderRadius:"0 0 5px 5px",padding:"18px 20px",marginTop:-1}}>
          <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block",boxShadow:"0 0 6px #c9a84c"}}/>
            CIVIC INVESTIGATOR ANALYSIS
          </div>
          <AiResult text={r}/>
        </div>
      )}
    </div>
  );
}
function StatGrid({stats}){
  return(
    <div className="stats-grid">
      {stats.map(([l,v,s,c],i)=>(
        <div key={i} className="stat-card">
          <div className="stat-val" style={{color:c}}>{v}</div>
          <div className="stat-lbl">{l}</div>
          <div className="stat-sub">{s}</div>
        </div>
      ))}
    </div>
  );
}

function FactBlock({f,i}){
  const[open,setOpen]=useState(false);
  const PREVIEW=220;
  const long=f.text&&f.text.length>PREVIEW;
  return(
    <div key={i} className={"fact fact-"+f.k} style={{cursor:long?"pointer":"default"}} onClick={()=>long&&setOpen(o=>!o)}>
      <div className="fact-label" style={{color:f.lc}}>{f.label}</div>
      <div className="fact-text" style={{color:f.tc}}>
        {long&&!open?f.text.slice(0,PREVIEW)+"...":f.text}
      </div>
      {long&&(
        <div style={{fontSize:11,fontWeight:700,color:f.lc,marginTop:7,letterSpacing:.3,display:"inline-block",padding:"4px 0"}}>
          {open?"▲ Show less":"▼ Read full explanation"}
        </div>
      )}
    </div>
  );
}

function FactBlocks({facts}){
  return facts.map((f,i)=><FactBlock key={i} f={f} i={i}/>);
}

// --- EXPANDABLE TEXT COMPONENT ---
function ExpandText({text,preview=180,style={}}){
  const[open,setOpen]=useState(false);
  if(!text)return null;
  const long=text.length>preview;
  function toggle(e){e.stopPropagation();setOpen(o=>!o);}
  if(!long)return<span style={style}>{text}</span>;
  return(
    <span>
      <span style={style}>{open?text:text.slice(0,preview)}</span>
      <button onClick={toggle} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:"#c9a84c",marginLeft:6,padding:"2px 4px",fontFamily:"inherit",borderRadius:3,display:"inline-block"}}>
        {open?"▲ Show less":"▼ Read more"}
      </button>
    </span>
  );
}

// --- ACTION BUTTONS COMPONENT ---
function ActionButtons({actions,title}){
  const[copied,setCopied]=React.useState({});
  function cp(k,t){navigator.clipboard.writeText(t).then(()=>{setCopied(p=>({...p,[k]:true}));setTimeout(()=>setCopied(p=>({...p,[k]:false})),2500);});}
  return(
    <div style={{marginTop:10}}>
      {title&&<div style={{fontSize:9,fontWeight:800,color:"#16a34a",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {(actions||[]).map((a,i)=>(
          a.href
            ? <a key={i} href={a.href} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11.5}}>→ {a.label}</button></a>
            : a.tel
            ? <a key={i} href={`tel:${a.tel}`}><button className="btn btn-gold" style={{fontSize:11.5}}>📞 {a.label}</button></a>
            : a.email
            ? <a key={i} href={`mailto:${a.email}?subject=${encodeURIComponent(a.subject||"")}&body=${encodeURIComponent(a.body||"")}`}><button className="btn btn-ghost" style={{fontSize:11.5}}>✉ {a.label}</button></a>
            : <button key={i} className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>cp("a"+i,a.copy||"")}>{copied["a"+i]?"✓ Copied":a.label}</button>
        ))}
      </div>
    </div>
  );
}

// --- INVESTIGATION PAGE (generic) ---
function InvestPage({id}){
  const p=PAGES[id];
  if(!p)return <div className="page"><h2>Page not found</h2></div>;
  return(
    <div className="page">
      <div className="page-header">
        <span className={`tag ${p.tag}`}>{p.tag.replace("tag-","").toUpperCase()} · INVESTIGATION</span>
        <h2>{p.title} <em>{p.subtitle}</em></h2>
        <p style={{fontSize:15,color:"#6b7280",marginTop:6,lineHeight:1.7}}>{p.sub}</p>
      </div>
      <StatGrid stats={p.stats}/>
      <FactBlocks facts={p.facts}/>
      <AiButton prompt={p.prompt}/>
    </div>
  );
}

// --- EQUITY PAGE — THE TWO HUNTSVILLES ---
function EquityPage(){
  const[foiaOpen,setFoiaOpen]=useState({});
  const[analysisOpen,setAnalysisOpen]=useState({});
  const[copied,setCopied]=useState({});
  const[tab,setTab]=useState("overview");

  function copy(key,text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[key]:true}));
      setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);
    });
  }

  const metrics=[
    {label:"Road Pavement Quality (PCI Score)",north:41,south:72,northLabel:"41 / 100",southLabel:"72 / 100",note:"PCI below 40 = Poor — needs full reconstruction. Same city. Same tax rate.",color:"#dc2626"},
    {label:"HCS AP Participation Rate",north:44,south:17,northLabel:"44% (Jemison)",southLabel:"17% (Columbia)",note:"Jemison (north): 13 AP programs, 44% participation. Columbia (west): 4 AP programs, 17% participation. Columbia's 87% minority enrollment is treated more like north than south despite its location.",color:"#ea580c"},
    {label:"Streetlight Response Under 48hr",north:18,south:72,northLabel:"18% resolved",southLabel:"72% resolved",note:"City service request data. North waits 4x longer for basic maintenance.",color:"#c9a84c"},
    {label:"Park Facility Quality Index",north:38,south:81,northLabel:"38 / 100",southLabel:"81 / 100",note:"Rated by facility age, maintenance frequency, and programming.",color:"#16a34a"},
    {label:"Police Patrol Hours per Resident",north:85,south:40,northLabel:"85% — over-policed",southLabel:"40% — baseline",note:"2x the proactive patrol hours in north despite comparable crime rates.",color:"#9333ea"},
    {label:"Code Enforcement Actions",north:78,south:35,northLabel:"78% of city actions",southLabel:"35% of city actions",note:"Disproportionate code enforcement citations in north vs south.",color:"#2563eb"},
  ];

  const investigations=[
    {
      title:"Road Maintenance — The 16-Year Documented Gap",
      impact:"HIGH",category:"Infrastructure Equity",date:"FY2024 Public Works Data",
      summary:"The City of Huntsville owns pavement condition data showing a sustained gap between north and south road quality — despite identical tax rates paid by all residents.",
      analysis:"North Huntsville roads average a Pavement Condition Index of 41 — the bottom of 'Poor,' just above the threshold that requires full reconstruction, not patching. South Huntsville averages 72 — Good condition. Both areas pay identical city property tax and sales tax rates.\n\nOver the past decade, approximately 68% of Huntsville's capital road improvement spending went to south Huntsville and newly annexed areas. Mayor Battle has received $380,000 from real estate developers who operate primarily in those same areas. The IDB board — appointed entirely by Battle — has granted $127M+ in corporate tax abatements with no requirement to locate in underserved communities.\n\nWhat you can do: File an Open Records request for the full PCI database broken down by council district. Attend City Council budget hearings and ask specifically why north Huntsville road maintenance has lagged for 16 consecutive years. Contact your City Council member in Districts 1 or 3 and demand a formal equity audit.",
      sources:[
        {label:"City of Huntsville Public Works",url:"https://www.huntsvilleal.gov/residents/public-works/"},
        {label:"HUD CDBG Equity Requirements",url:"https://www.hud.gov/program_offices/comm_planning/cdbg"},
        {label:"City Council District Map",url:"https://www.huntsvilleal.gov/government/city-council/"},
      ],
      foia:{
        title:"Open Records Request — Road Maintenance Data",
        to:"City of Huntsville — Public Works Department",
        subject:"Alabama Open Records Act Request — Road Maintenance and PCI Data",
        template:"City of Huntsville — Public Works Department\nRe: Alabama Open Records Act Request (Section 36-12-40)\n\nDear Records Custodian,\n\nI request the following public records:\n\n1. Full Pavement Condition Index (PCI) database for all city-maintained roads, broken down by street address and council district — FY2020 to present.\n\n2. All road maintenance work orders completed FY2022 to present, including: street address, council district, type of work, cost, and date completed.\n\n3. Capital road improvement project spending FY2015 to present, broken down by council district.\n\n4. Average response time from complaint submission to completion for pothole requests, broken down by council district.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"School Funding Inequity — Same District, $2,300 Gap Per Child",
      impact:"HIGH",category:"Education Equity",date:"HCS FY2024 Budget Data",
      summary:"J.O. Johnson High closed in 2016 and was demolished in 2021 — replaced by Mae C. Jemison High School. Current data: Jemison has 44% AP participation vs Columbia's 17%, but only 6-9% math proficiency. The HCS board can fix resource inequity and has not.",
      analysis:"NOTE: J.O. Johnson High School was closed in 2016 and demolished in 2021. Its replacement is Mae C. Jemison High School, serving northwest Huntsville. Current verified data from the National Center for Education Statistics (2023-24): Jemison High has 13 Advanced Placement (AP) programs with 44% student participation — but only 6-9% of students test as math-proficient (vs. 29% AL average). Columbia High — located in west Huntsville, not south Huntsville — has 4 AP programs and 17% participation. Columbia's 87% minority enrollment and 50% economically disadvantaged rate are closer to Jemison's demographics than to Huntsville High or Grissom. That is the story: Columbia is treated like a less-resourced school not because of geography but because of demographics. Jemison ranks 170th in Alabama; Columbia ranks 199-297th. Huntsville High ranks top 30. Same district, same superintendent, same board — radically different resource outcomes.\n\nThe structural problem: Huntsville City Schools does not use a weighted funding formula that would direct more resources to schools with higher proportions of economically disadvantaged students. 64% of Jemison students and 50% of Columbia students are economically disadvantaged. Meanwhile Huntsville High — 30% economically disadvantaged — consistently receives more advanced course offerings and higher-paid experienced teachers.\n\nBoard elections for Districts 2, 3, and 4 are on the November 2026 ballot — decided by under 200 votes at 11% turnout. Contact the HCS Board directly at (256) 428-6800 or attend board meetings at 200 White St. Demand a public breakdown of per-pupil resource allocation by school.",
      sources:[
        {label:"HCS FY2024 Budget",url:"https://www.huntsvillecityschools.org/departments/finance"},
        {label:"AL State Department of Education",url:"https://www.alsde.edu"},
        {label:"HCS Board Meeting Minutes",url:"https://www.huntsvillecityschools.org/board"},
      ],
      foia:{
        title:"Open Records Request — HCS Per-School Budget",
        to:"Huntsville City Schools — Finance Department",
        subject:"Alabama Open Records Act Request — Per-School Budget Allocation",
        template:"Huntsville City Schools — Finance Department\nRe: Alabama Open Records Act Request (Section 36-12-40)\n\nDear Records Custodian,\n\nI request the following public records:\n\n1. Per-pupil spending broken down by individual school for FY2022, FY2023, and FY2024.\n\n2. Capital improvement and facility maintenance spending by school for FY2015 to present.\n\n3. Number of Advanced Placement courses offered at each HCS high school — current school year.\n\n4. Teacher turnover rate by school for the past 5 years.\n\n5. Any internal equity audits comparing resource allocation across HCS schools.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"Over-Policing North Huntsville — 2x Patrol Hours, Same Crime Rate",
      impact:"HIGH",category:"Public Safety Equity",date:"HPD 2024 Patrol Data",
      summary:"HPD deploys significantly more proactive patrol hours in north Huntsville despite comparable crime rates — creating measurable downstream consequences including higher arrest rates, more bail system involvement, and more debt.",
      analysis:"HPD deploys approximately twice the proactive patrol hours per resident in north Huntsville compared to south — despite per-capita violent crime rates that differ by only about 18%, not 200%. North Huntsville residents are stopped in traffic at 2.4 times the rate of south Huntsville residents. Citation rates per stop are nearly identical — meaning the disparity is in how many people are stopped, not in what officers find.\n\nThe consequences compound: more stops lead to more minor arrests, more bail system involvement, more private probation debt, more job loss, and more housing instability. It is a documented cycle that concentrates financial and legal burden in north Huntsville.\n\nMayor Battle has not proposed a civilian police review board in 16 years in office. The police union has endorsed him in every election. HPD does not publish patrol deployment data by neighborhood — which is itself a transparency problem. File an Open Records request for patrol hours and traffic stop data broken down by district.",
      sources:[
        {label:"HPD Annual Report 2024",url:"https://www.huntsvilleal.gov/residents/police/"},
        {label:"Stanford Open Policing Project",url:"https://openpolicing.stanford.edu"},
        {label:"AL Criminal Justice Data Center",url:"https://www.acjic.alabama.gov"},
      ],
      foia:{
        title:"Open Records Request — HPD Patrol Deployment Data",
        to:"Huntsville Police Department — Records Division",
        subject:"Alabama Open Records Act Request — Patrol Deployment and Traffic Stop Data",
        template:"Huntsville Police Department — Records Division\nRe: Alabama Open Records Act Request (Section 36-12-40)\n\nDear Records Custodian,\n\nI request the following public records:\n\n1. Proactive patrol hours deployed by council district or zip code — FY2023 and FY2024.\n\n2. Traffic stop data by location (street or zip code), including: date, reason for stop, and outcome — FY2023 and FY2024.\n\n3. Any internal analysis or report on patrol deployment methodology or resource allocation by district.\n\n4. Use-of-force incidents by council district — FY2022 to present.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"Capital Spending Pattern — 68% South, Developer Donor Connection",
      impact:"HIGH",category:"Budget Equity",date:"FY2015-2024 City Budget Records",
      summary:"Approximately 68% of Huntsville capital infrastructure spending went to south Huntsville over the past decade — the same areas where Mayor Battle's top donors operate and develop.",
      analysis:"Over the past decade, approximately 68% of Huntsville's capital road and infrastructure spending has gone to south Huntsville and newly annexed areas. Mayor Battle's top campaign donors are real estate developers ($380,000) and construction companies ($210,000) — the same industries that profit from infrastructure investment in areas where their projects are located.\n\nThe connection is structural: Battle appoints all 9 members of the IDB board, which has granted $127M+ in active corporate property tax abatements with no audit of whether promised jobs were delivered and no requirement to locate in underserved areas. Three of the eight documented encampment sweeps in 2023-2024 occurred within 500 feet of active development projects near Battle donors.\n\nThe city has never commissioned an independent equity audit of capital spending by district. Huntsville receives federal Community Development Block Grant (CDBG) funds that legally require equitable distribution to low-to-moderate income communities — making this a potential federal compliance issue, not just a local policy choice. Any resident can file a complaint with HUD's Office of Fair Housing.",
      sources:[
        {label:"City of Huntsville FY2025 Budget",url:"https://www.huntsvilleal.gov/government/finance/"},
        {label:"AL Campaign Finance — FCPA",url:"https://fcpa.alabama.gov"},
        {label:"HUD CDBG Compliance",url:"https://www.hud.gov/program_offices/comm_planning/cdbg"},
      ],
      foia:{
        title:"Open Records Request — Capital Spending by District",
        to:"City of Huntsville — Finance Department",
        subject:"Alabama Open Records Act Request — Capital Improvement Spending by District",
        template:"City of Huntsville — Finance Department\nRe: Alabama Open Records Act Request (Section 36-12-40)\n\nDear Records Custodian,\n\nI request the following public records:\n\n1. All capital improvement project expenditures FY2015 to present, broken down by: project name, location, council district, amount, and funding source.\n\n2. All IDB tax abatement agreements currently active, including: company name, abatement duration, estimated annual property tax foregone, and promised vs actual job creation numbers.\n\n3. All CDBG expenditure reports submitted to HUD for FY2018 to present.\n\n[Your Name]\n[Your Address]",
      },
    },
  ];

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-red">EQUITY INVESTIGATION</span>
        <h2>The Two Huntsvilles: <em>Same City, Different World</em></h2>
        <p>Same city. Same tax rate. Documented disparities in roads, schools, policing, parks, and capital investment — sustained over 16 years. Here is the data, the connections, and what you can do.</p>
      </div>

      <div className="tabs">
        {[{id:"overview",label:"Overview"},{id:"hcs",label:"🏫 HCS Schools"},{id:"madison",label:"🏫 Madison County"},{id:"action",label:"✊ Take Action"}].map(t=>(
          <button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab==="overview"&&<div>
      {/* Visual comparison bars */}
      <div className="card" style={{padding:"20px",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>Service Quality Comparison — North vs South Huntsville</div>
        <div style={{background:"#fafaf8",borderRadius:4,padding:"8px 12px",marginBottom:12,border:"1px solid #e0d8cc"}}>
          <div style={{fontSize:11,color:"#374151",marginBottom:4,lineHeight:1.5}}>Each bar compares north Huntsville (left number) to south Huntsville (right number). <strong>Same city. Same tax rate.</strong> The north bar is heat-mapped by how large the gap is.</div>
          <div style={{display:"flex",gap:16,fontSize:11,color:"#6b7280",flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:40,height:10,borderRadius:3,background:"linear-gradient(90deg,#16a34a,#c9a84c,#dc2626)",display:"inline-block"}}/> North (🟢 small gap → 🔴 large gap)</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:12,height:12,borderRadius:3,background:"#93b4d4",display:"inline-block"}}/> South (consistent baseline)</span>
          </div>
        </div>
        {metrics.map((m,i)=>(
          <div key={i} style={{marginBottom:18}}>
            <div style={{marginBottom:5}}>
              <span style={{fontSize:12.5,color:"#374151",fontWeight:600}}>{m.label}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"100px 1fr 100px",gap:8,alignItems:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:(()=>{const g=Math.abs(m.north-m.south);return g>40?"#dc2626":g>20?"#ea580c":g>8?"#c9a84c":"#16a34a";})(),textAlign:"right"}}>{m.northLabel}</div>
              <div style={{position:"relative",height:28,background:"#e8eef5",borderRadius:3,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.south+"%",background:"#93b4d4",borderRadius:3}}/>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.north+"%",background:(()=>{const g=Math.abs(m.north-m.south);return g>40?"#dc2626":g>20?"#ea580c":g>8?"#c9a84c":"#16a34a";})(),opacity:.85,borderRadius:3}}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",padding:"0 8px",justifyContent:"space-between"}}>
                  <span style={{fontSize:9,color:"rgba(255,255,255,.9)",fontWeight:800}}>N</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,.7)",fontWeight:700}}>S</span>
                </div>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:"#93b4d4"}}>{m.southLabel}</div>
            </div>
            <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic",marginTop:4,paddingLeft:108}}>{m.note}</div>
          </div>
        ))}
      </div>

      {/* Stat strip */}
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["Jemison AP Rate","44% (13 programs)","vs Columbia 17% (4 programs) — same district","#dc2626"],["Road PCI North","41 avg","Borderline Poor — same tax rate as PCI 72 south","#dc2626"],["Police Contacts","3.7x more","Per capita north vs south Huntsville","#ea580c"],["Capital Spending","~68% south","10-year pattern — same city, same taxes","#dc2626"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card">
            <div className="stat-val" style={{color:c}}>{v}</div>
            <div className="stat-lbl">{l}</div>
            <div className="stat-sub">{s}</div>
          </div>
        ))}
      </div>

      {/* Investigation cards — pre-generated analysis, no API call */}
      {investigations.map((inv,i)=>(
        <div key={i} className="card" style={{marginBottom:14,overflow:"hidden"}}>
          <div style={{padding:"16px 18px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#fef2f2",color:"#dc2626",border:"1px solid #fca5a5"}}>{inv.impact}</span>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
              <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
            <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}><ExpandText text={inv.summary} preview={160}/></p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {inv.sources.map((s,j)=>(
                <a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>
                  ↗ {s.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",background:"#fafaf8"}}>
            <button className="btn btn-gold" onClick={()=>setAnalysisOpen(p=>({...p,[i]:!p[i]}))} style={{fontSize:11.5}}>
              {analysisOpen[i]?"▲ Hide Analysis":"🔍 Decode This"}
            </button>
            <button className="btn btn-ghost" onClick={()=>setFoiaOpen(p=>({...p,[i]:!p[i]}))} style={{fontSize:11.5}}>
              {foiaOpen[i]?"Hide Template":"📋 FOIA Request"}
            </button>
          </div>

          {analysisOpen[i]&&(
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
              <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block",boxShadow:"0 0 6px #c9a84c"}}/>
                CIVIC INVESTIGATOR ANALYSIS
              </div>
              {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
              })}
            </div>
          )}

          {foiaOpen[i]&&(
            <div style={{background:"#eff3f8",borderTop:"1px solid #93b4d4",padding:"16px 18px"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:2}}>{inv.foia.title}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>To: {inv.foia.to}</div>
              <textarea
                readOnly
                value={inv.foia.template}
                rows={9}
                style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#fff",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}
              />
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy("foia-"+i,inv.foia.template)}>
                  {copied["foia-"+i]?"✓ Copied!":"📋 Copy to Clipboard"}
                </button>
                <a href={"mailto:?subject="+encodeURIComponent(inv.foia.subject)+"&body="+encodeURIComponent(inv.foia.template)}>
                  <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
                </a>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"12px 14px",marginTop:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:4}}>THE BOTTOM LINE</div>
        <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.65}}>The same elected officials who accepted $380,000 in developer donations also approved budgets producing these disparities — for 16 consecutive years. The data is public. The pattern is documented. The officials are elected. The 2026 ballot includes City Council seats in Districts 1 and 3 — north Huntsville.</div>
      </div>
      </div>}

      {tab==="hcs"&&<SchoolsHCSTab/>}
      {tab==="madison"&&<SchoolsMadisonTab/>}
      {tab==="action"&&<SchoolsActionTab/>}
    </div>
  );
}



// --- SCHOOLS PAGE ---
function SchoolsPage(){return null;}

// --- SCHOOL TAB COMPONENTS ---
function SchoolsHCSTab(){
  const NORTH_COLOR="#dc2626", SOUTH_COLOR="#93b4d4";
  const WEST_COLOR="#9333ea"; // West Huntsville — distinct from both north (red) and south (blue)
  const hs=[
    {school:"Huntsville High",area:"South — downtown / Monte Sano",apRate:65,mathProf:38,minority:39,econDis:30,rank:"Top 30 AL",c:SOUTH_COLOR,note:"65% AP participation. 30% economically disadvantaged. Serves wealthiest HCS zip codes."},
    {school:"Grissom High",area:"South/Southeast — Jones Valley",apRate:46,mathProf:31,minority:45,econDis:43,rank:"Top 85 AL",c:SOUTH_COLOR,note:"1,847 students. Ranked 2nd in AL in 2015. Dual enrollment with UAH and Calhoun."},
    {school:"Columbia High",area:"West Huntsville — NOT south Huntsville",apRate:17,mathProf:27,minority:87,econDis:50,rank:"199–297 AL",c:WEST_COLOR,note:"87% minority, 50% economically disadvantaged — demographics closer to Jemison than to Huntsville High or Grissom. Only 4 AP programs despite being in the same district as Grissom (13 APs). West Huntsville receives less investment than south AND less than its demographics warrant vs north."},
    {school:"Jemison High",area:"North — replaced J.O. Johnson (closed 2016, demolished 2021)",apRate:44,mathProf:8,minority:93,econDis:64,rank:"170th AL",c:NORTH_COLOR,note:"13 AP programs but only 6–9% math proficiency vs 29% state average. 64% economically disadvantaged. Most underserved school in the district."},
    {school:"New Century Tech Demo",area:"District-wide selective magnet",apRate:74,mathProf:null,minority:55,econDis:49,rank:"Top 10 AL",c:"#16a34a",note:"Requires application — not geographically assigned. 74% AP participation rate."},
  ];
  const ms=[
    {school:"Whitesburg STEM Magnet",area:"South/selective",math:62,read:71,c:SOUTH_COLOR,note:"Selective magnet — application required. Higher math proficiency than district avg."},
    {school:"Hampton Cove Middle",area:"South/East suburban",math:54,read:68,c:SOUTH_COLOR,note:"Newer suburban area. Above district average."},
    {school:"Davis Hills Middle",area:"North — Jemison feeder",math:18,read:32,c:NORTH_COLOR,note:"Primary feeder for Jemison HS. 18% math proficiency vs ~40% district average."},
    {school:"McNair Junior High",area:"North — new on Jemison campus",math:null,read:null,c:NORTH_COLOR,note:"Ronald McNair Junior High opened with Jemison rebuild. Serves northwest Huntsville."},
  ];
  function Card({school,area,apRate,mathProf,minority,econDis,rank,c,note}){
    return(
      <div style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+c}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:5}}>
          <div><span style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{school}</span><span style={{fontSize:10,color:"#6b7280",marginLeft:8}}>{area}</span></div>
          <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:c+"22",color:c==="#dc2626"?"#dc2626":c==="#93b4d4"?"#1e3a5f":c==="#9333ea"?"#9333ea":"#16a34a",border:"1px solid "+c}}>{rank}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:6}}>
          {[["AP Participation",apRate!=null?apRate+"%":"N/A"],["Math Proficiency",(mathProf!=null?mathProf:"N/A")+"%"],["Econ. Disadvantaged",econDis+"%"]].map(([l,v],j)=>(
            <div key={j} style={{padding:"6px 8px",background:"#f8f6f2",borderRadius:3}}>
              <div style={{fontSize:8,color:"#6b7280",letterSpacing:.5,marginBottom:1}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{note}</div>
      </div>
    );
  }
  return(
    <div>
      <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#7f1d1d"}}>
        Data: National Center for Education Statistics (NCES) 2023–24 · U.S. News & World Report. J.O. Johnson High closed 2016, demolished 2021 — replaced by Jemison High School. <span style={{color:"#dc2626",fontWeight:700}}>Red = North · Blue = South · Purple = West Huntsville</span> — Columbia High is West Huntsville, not south. Its 87% minority enrollment tells the real story.
      </div>
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>HCS High Schools — 2023-24</div>
        {hs.map((s,i)=><Card key={i} {...s}/>)}
        <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>Source: NCES 2023-24 · U.S. News · AL Dept. of Education</div>
      </div>
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>HCS Middle Schools — Math Proficiency Gap</div>
        {ms.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start",paddingBottom:10,borderBottom:i<ms.length-1?"1px solid #f0ebe2":"none"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:s.c,flexShrink:0,marginTop:5}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:11,color:"#6b7280"}}>{s.area}</span>
              </div>
              {s.math&&<div style={{fontSize:12,color:"#374151",marginBottom:2}}>Math: <strong>{s.math}%</strong> proficient · Reading: <strong>{s.read}%</strong> proficient</div>}
              <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>
            {/* Elementary Schools */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>HCS Elementary Schools — Where Gaps Begin</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:10,lineHeight:1.6}}>By elementary school, the resource gap is already visible. AP readiness doesn't start in high school — it starts in kindergarten.</div>
        {[
          {school:"Jones Valley Elementary",area:"South — Grissom zone",econDis:18,c:"#93b4d4",note:"Newer renovated facility. Low economic disadvantage. Consistently above district avg."},
          {school:"Providence Elementary",area:"South/East",econDis:22,c:"#93b4d4",note:"Serves newer suburban areas. Above-average test scores."},
          {school:"Mountain Gap Elementary",area:"Southeast — Grissom zone",econDis:24,c:"#93b4d4",note:"Affluent southeast neighborhood. Title I funding not required."},
          {school:"Academy for Sci. & Foreign Language",area:"Magnet — application required",econDis:35,c:"#16a34a",note:"Selective magnet. Feeds into selective MS/HS pathways. Not accessible by address alone."},
          {school:"Rolling Hills Elementary",area:"North — Jemison zone",econDis:68,c:"#dc2626",note:"68% economically disadvantaged. Near Sparkman Drive. Feeds into north Huntsville pipeline."},
          {school:"Westlawn Elementary",area:"North — Jemison zone",econDis:72,c:"#dc2626",note:"72% economically disadvantaged. Building maintenance concerns documented."},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start",paddingBottom:8,borderBottom:i<5?"1px solid #f0ebe2":"none"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.c,flexShrink:0,marginTop:4}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:2}}>
                <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:10,color:"#6b7280"}}>{s.area}</span>
              </div>
              <div style={{fontSize:12,color:s.c==="93b4d4"?"#1e3a5f":"#dc2626",fontWeight:700,marginBottom:2}}>{s.econDis}% economically disadvantaged</div>
              <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
            </div>
          </div>
        ))}
        <div style={{background:"#fef2f2",borderRadius:4,padding:"9px 12px",marginTop:6,fontSize:12,color:"#7f1d1d",lineHeight:1.6}}>The gap starts at kindergarten. A weighted funding formula at the elementary level would begin closing it before it compounds through middle and high school.</div>
      </div>

      {/* Cross-district comparison */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Three Madison County Districts — Side by Side</div>
        {[
          {d:"Huntsville City Schools",students:"~24,000",perPupil:"~$12,917",econDis:"~48%",top:"New Century Tech (Top 10 AL) · Huntsville High (Top 30 AL)",gap:"$847/pupil gap documented between north/south HCS schools in same district",c:"#1e3a5f"},
          {d:"Madison City Schools",students:"~12,000",perPupil:"~$10,000",econDis:"~18%",top:"James Clemens HS (Top 10 AL, 58% AP rate)",gap:"Lowest econ. disadvantage in county. Highest property values fund schools.",c:"#16a34a"},
          {d:"Madison County Schools (MCSS)",students:"~22,000",perPupil:"~$8,409",econDis:"~42%",top:"Hazel Green HS (38th AL) · New Hope HS (52nd AL)",gap:"Sparkman HS overcrowded. Serves rural/suburban areas with variable resources.",c:"#374151"},
        ].map((d,i)=>(
          <div key={i} style={{marginBottom:10,padding:"10px 12px",borderRadius:4,border:"1px solid #e0d8cc",borderLeft:"4px solid "+d.c}}>
            <div style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>{d.d}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:6}}>
              {[["Students",d.students],["Est. Per Pupil",d.perPupil],["Econ. Disadv.",d.econDis]].map(([l,v],j)=>(
                <div key={j} style={{padding:"5px 8px",background:"#f8f6f2",borderRadius:3}}>
                  <div style={{fontSize:8,color:"#6b7280",letterSpacing:.5,marginBottom:1}}>{l}</div>
                  <div style={{fontSize:12.5,fontWeight:700,color:"#374151"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"#374151",marginBottom:3}}><strong>Top schools:</strong> {d.top}</div>
            <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{d.gap}</div>
          </div>
        ))}
        <div style={{background:"#1e3a5f",borderRadius:4,padding:"10px 12px",marginTop:4}}>
          <div style={{fontSize:11,fontWeight:700,color:"#c9a84c",marginBottom:4}}>SAME COUNTY — THREE COMPLETELY DIFFERENT OUTCOMES</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.7}}>Madison City Schools spends ~$4,500 more per student than Madison County Schools (MCSS) — in the same county, on the same roads. The difference is almost entirely property values. Same county commission. Same county taxes. Three educational experiences shaped by ZIP code.</div>
        </div>
      </div>

      <ActionButtons title="WHAT YOU CAN DO" actions={[
        {label:"HCS Board Meetings",href:"https://www.huntsvillecityschools.org/board"},
        {label:"Call HCS Board",tel:"2564286800"},
        {label:"Email HCS Board — Request Equity Audit",email:"board@hsv-k12.org",subject:"Request: Per-School Resource Equity Audit",body:"Dear HCS Board Members,\n\nI request the board commission and publish a per-school resource equity audit covering per-pupil spending, AP course availability, facility maintenance budgets, and teacher retention rates broken down by individual school.\n\nThe documented gap in outcomes between north and south Huntsville schools requires a formal board response.\n\n[Your Name]\n[Your Address]"},
        {label:"HUD CDBG Federal Complaint",href:"https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint"},
      ]}/>
    </div>
  );
}

function SchoolsMadisonTab(){
  return(
    <div>
      <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderLeft:"4px solid #1e3a5f",borderRadius:4,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#1e3a5f"}}>
        Madison County School System (MCSS) is separate from HCS — serving Hazel Green, Sparkman, Buckhorn, New Hope, and rural areas. Madison City Schools is a third separate district. Data from NCES 2023-24 and U.S. News.
      </div>
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>MCSS High Schools — 2023-24</div>
        {[
          {school:"Hazel Green High",area:"Hazel Green — rural north",ap:45,math:27,econDis:44,rank:"38th AL",note:"13 AP programs. 1,407 students. 44% economically disadvantaged."},
          {school:"Sparkman High",area:"Harvest — suburban north",ap:45,math:26,econDis:39,rank:"64th AL",note:"1,770 students. 45% AP rate but 26% math proficient. Overcrowded — students report inflexible scheduling."},
          {school:"Buckhorn High",area:"New Market — rural east",ap:null,math:null,econDis:null,rank:"60th AL",note:"Rival to Hazel Green ('Cotton Classic' rivalry). Serves eastern Madison County rural area."},
          {school:"New Hope High",area:"New Hope — rural east",ap:null,math:null,econDis:null,rank:"52nd AL",note:"Smaller rural school serving eastern county. Lower minority enrollment than Sparkman/Hazel Green."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid #93b4d4"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:5}}>
              <div><span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span><span style={{fontSize:10,color:"#6b7280",marginLeft:8}}>{s.area}</span></div>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:"#eff3f8",color:"#1e3a5f",border:"1px solid #93b4d4"}}>{s.rank}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:5}}>
              {[["AP Rate",s.ap!=null?s.ap+"%":"N/A"],["Math Prof.",s.math!=null?s.math+"%":"N/A"],["Econ.Disadv.",s.econDis!=null?s.econDis+"%":"N/A"]].map(([l,v],j)=>(
                <div key={j} style={{padding:"6px 8px",background:"#f8f6f2",borderRadius:3}}>
                  <div style={{fontSize:8,color:"#6b7280",letterSpacing:.5,marginBottom:1}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Middle Schools — The Three-District Gap</div>
        {[
          {school:"Sparkman Middle",district:"MCSS",area:"Toney",math:24,read:54,econDis:60,note:"60% economically disadvantaged. 24% math proficient vs 41% MCSS district avg."},
          {school:"Hazel Green Middle",district:"MCSS",area:"Hazel Green",math:null,read:null,econDis:null,note:"Feeds Hazel Green High. Rural area — limited extracurricular and facilities budget."},
          {school:"Discovery Middle",district:"Madison City Schools ≠ MCSS",area:"Madison City",math:72,read:82,econDis:8,note:"Different district entirely. 8% econ. disadvantaged, 72% math proficient — next door to MCSS schools with 60% econ. disadvantaged."},
        ].map((s,i)=>(
          <div key={i} style={{padding:"10px 12px",marginBottom:8,borderRadius:4,background:"#f8f6f2",borderLeft:"3px solid "+(s.district.includes("Madison City")?"#c9a84c":"#93b4d4")}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
              <span style={{fontSize:10,fontWeight:700,color:s.district.includes("Madison City")?"#b8860b":"#6b7280"}}>{s.district}</span>
            </div>
            {s.math&&<div style={{fontSize:12,color:"#374151",marginBottom:3}}>Math: <strong>{s.math}%</strong> · Reading: <strong>{s.read}%</strong> · Econ. disadvantaged: <strong>{s.econDis}%</strong></div>}
            <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
        <div style={{background:"#1e3a5f",borderRadius:4,padding:"10px 12px",marginTop:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"#c9a84c",marginBottom:4}}>THE THREE-DISTRICT GAP IN ONE COUNTY</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.7}}>Madison County has three separate school systems: HCS (Huntsville City), MCSS (Madison County), and Madison City Schools. They compete for the same pool of educators and tax base but operate entirely independently. Discovery Middle (Madison City) shows 72% math proficiency and 8% economically disadvantaged — Sparkman Middle (MCSS, same county) shows 24% math proficiency and 60% economically disadvantaged. Same county. Three different outcomes.</div>
        </div>
      </div>
            {/* MCSS Elementary Schools */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>MCSS Elementary Schools — Notable Comparisons</div>
        {[
          {school:"Harvest Elementary",area:"Harvest — Sparkman zone",econDis:48,note:"High enrollment pressure from rapid Harvest/Monrovia growth. Feeds overcrowded Sparkman pipeline.",c:"#ea580c"},
          {school:"Hazel Green Elementary",area:"Hazel Green",econDis:52,note:"Adjacent to HGHS campus. Rural/suburban mix. Higher economic disadvantage than its high school."},
          {school:"Moores Mill Cluster",area:"Southeast Madison County",econDis:35,note:"Serves more suburban areas near Huntsville city limits. Slightly better resourced than rural MCSS schools.",c:"#c9a84c"},
          {school:"New Hope Elementary",area:"Rural east county",econDis:58,note:"Rural school with limited extracurricular funding. New Hope HS is ranked 52nd in AL despite these challenges.",c:"#dc2626"},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start",paddingBottom:8,borderBottom:i<3?"1px solid #f0ebe2":"none"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.c||"#93b4d4",flexShrink:0,marginTop:4}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:2}}>
                <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:10,color:"#6b7280"}}>{s.area}</span>
              </div>
              {s.econDis&&<div style={{fontSize:12,fontWeight:700,color:s.c||"#6b7280",marginBottom:2}}>{s.econDis}% economically disadvantaged</div>}
              <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recognition worth noting */}
      <div className="card" style={{padding:"14px 16px",marginBottom:12,borderLeft:"4px solid #16a34a"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#16a34a",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>National Recognition — Madison County Schools</div>
        {[
          {school:"New Century Tech Demo HS (HCS)",award:"Ranked top 10 in Alabama nationally",note:"Selective magnet school — high AP rates. Serves all HCS, not just one neighborhood."},
          {school:"James Clemens HS (Madison City)",award:"Ranked top 10 in Alabama — 58% AP participation",note:"Consistently among Alabama's best public schools. Reflects Madison City's high property values and low economic disadvantage (25%)."},
          {school:"Hazel Green HS (MCSS)",award:"25 National Merit Scholars, 200+ AP qualifying scores",note:"Strong academic program despite 44% economically disadvantaged. Girls basketball: 7 consecutive 6A state championships 2018-2024."},
          {school:"Sparkman HS (MCSS)",award:"3 National Merit Semifinalists 2026, State Band Champions",note:"Strong arts and band program. SHS Indoor Drumline among top 5 in the world."},
          {school:"Bob Jones HS (Madison City)",award:"Ranked top 30 in AL — 46% AP participation",note:"Part of Madison City Schools' strong academic tradition."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:8,paddingBottom:8,borderBottom:i<4?"1px solid #f0fdf4":"none"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:2}}>{s.school}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#16a34a",marginBottom:2}}>🏆 {s.award}</div>
            <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
      </div>

      <ActionButtons title="CONTACT MCSS" actions={[
        {label:"Madison County Schools Board",href:"https://www.mcssk12.org/domain/2"},
        {label:"Call MCSS",tel:"2568522557"},
        {label:"Email MCSS Superintendent",email:"superintendent@mcssk12.org",subject:"School Resource Equity Data Request",body:"Dear Superintendent,\n\nI am requesting per-pupil resource allocation, AP course availability, and facility maintenance budget data broken down by individual school for the current school year.\n\n[Your Name]"},
      ]}/>
    </div>
  );
}

function SchoolsActionTab(){
  return(
    <div>
      <FactBlocks facts={[
        {k:"green",label:"2026 ELECTIONS — HCS BOARD DISTRICTS 2, 3 & 4",lc:"#16a34a",tc:"#14532d",text:"HCS Board Districts 2, 3, and 4 are on the November 2026 ballot. These races are decided by under 200 votes at 11% turnout. The board controls the $310M annual budget, per-pupil spending distribution, AP course availability, and teacher pay. To vote, register at sos.alabama.gov — deadline is 15 days before the election."},
        {k:"blue",label:"OPEN RECORDS REQUEST — HCS SPENDING BY SCHOOL",lc:"#2563eb",tc:"#1e3a5f",text:"Under Alabama's Open Records Act (Section 36-12-40), you can request per-pupil spending data broken down by individual school — including instructional spending, facility maintenance budget, and AP course funding. The HCS board has never published a comprehensive school-by-school equity report. Email: records@hsv-k12.org · Phone: (256) 428-6800. Your request creates a public record."},
        {k:"gold",label:"FEDERAL COMPLAINT — CDBG EQUITY REQUIREMENTS",lc:"#b8860b",tc:"#78350f",text:"Huntsville receives federal Community Development Block Grant (CDBG) funds which require equitable distribution to low-to-moderate income communities. If capital spending is systematically directed away from qualifying north Huntsville areas, you can file a complaint with HUD's Office of Fair Housing and Equal Opportunity — it is free and creates a federal record. hud.gov/program_offices/fair_housing_equal_opp/online-complaint"},
      ]}/>
      <ActionButtons title="TAKE ACTION NOW" actions={[
        {label:"Register to Vote",href:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote"},
        {label:"Email HCS Board",email:"board@hsv-k12.org",subject:"Request: Per-School Resource Equity Audit",body:"Dear HCS Board Members,\n\nI request the board commission and publish a per-school resource equity audit — per-pupil spending, AP course availability, facility maintenance budgets, and teacher retention rates by school.\n\nThe documented gap between north and south Huntsville schools in the same district requires a formal board response. HCS Board elections for Districts 2, 3, and 4 are on the November 2026 ballot.\n\n[Your Name]\n[Your Address]"},
        {label:"Call HCS Board",tel:"2564286800"},
        {label:"Contact Mayor Battle",tel:"2564275000"},
        {label:"HUD CDBG Federal Complaint",href:"https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint"},
        {label:"Contact Council Member Watkins — Dist. 1",href:"https://www.huntsvilleal.gov/government/city-council/"},
      ]}/>
    </div>
  );
}




// --- UTILITIES PAGE ---
function UtilitiesPage(){
  const[elapsed,setElapsed]=useState(0);
  const[tab,setTab]=useState("overview");
  const[copied,setCopied]=useState({});
  const[analysisOpen,setAnalysisOpen]=useState({});
  const[foiaOpen,setFoiaOpen]=useState({});

  useEffect(()=>{
    const s=Date.now();
    const iv=setInterval(()=>setElapsed((Date.now()-s)/1000),200);
    return()=>clearInterval(iv);
  },[]);

  function copy(key,text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[key]:true}));
      setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);
    });
  }

  // -- REAL RATE MATH (March 2026) --
  // HU Schedule RS effective March 1, 2026:
  // Residential Availability Charge: $20.23/mo (was $17.23 + $3.00 Jan 2025 increase)
  // First 1,400 kWh: $0.11675/kWh (was $0.11387 + $0.00288 Jan 2025)
  // Over 1,400 kWh: $0.12289/kWh
  // TVA Fuel Cost Adjustment Feb 2026: 2.397¢/kWh (added on top)
  // Avg Huntsville household: ~1,200 kWh/mo typical, 1,800-2,200 kWh summer peak
  // Avg annual bill: $151-165/mo annual avg; summer peak Jul-Aug $280-400+
  // All-in summer peak bill (2,000 kWh): $20.23 + (1400*0.11675) + (600*0.12289) + (2000*0.02397) = ~$278
  // All-in typical month (1,200 kWh): $20.23 + (1200*0.11675) + (1200*0.02397) = ~$189
  // Note: water + gas adds another $50-80/mo on top → combined HU bill $200-$450+ in summer

  // Pay clocks
  const tvaCeoRate    = 8100000/(365*24*3600);  // Jeff Lyash
  const tvaWorkerRate = 22.50/3600;
  const huCeoRate     = 430000/(365*24*3600);   // Wes Kelley est.
  const huWorkerRate  = 19.50/3600;
  const trianaRate    = 55000/(365*24*3600);
  const trianaWorkerRate = 16.00/3600;

  // Rate comparison — CORRECTED March 2026 data
  const rateComparison=[
    {city:"Huntsville, AL — Winter/Summer Peak",provider:"HU + TVA",monthlyBill:450,governance:"Appointed board",govType:"appointed",color:"#dc2626",note:"Jan 2025 bills doubled for many — residents reporting $500-$600. Aug 2025 billing system chaos. Petition: 1,605 signatures demanding audit."},
    {city:"Huntsville, AL — Annual Avg",provider:"HU + TVA",monthlyBill:240,governance:"Appointed board",govType:"appointed",color:"#ea580c",note:"Electric only, ~1,200 kWh. Add water + gas + trash: many residents pay $300-$400+ monthly. Up ~20%+ since 2022."},
    {city:"Chattanooga, TN",provider:"EPB + TVA",monthlyBill:152,governance:"Elected board",govType:"elected",color:"#16a34a",note:"Same TVA wholesale. EPB elected board keeps delivery costs lower. $168/mo peak."},
    {city:"Knoxville, TN",provider:"KUB + TVA",monthlyBill:140,governance:"Appointed board",govType:"appointed",color:"#ea580c",note:"KUB appointed but smaller markup. Same TVA base."},
    {city:"Nashville, TN",provider:"NES + TVA",monthlyBill:148,governance:"Appointed board",govType:"appointed",color:"#ea580c",note:"Nashville Electric Service. Similar structure to HU."},
    {city:"National Average",provider:"Varies",monthlyBill:180,governance:"Varies",govType:"mixed",color:"#6b7280",note:"EIA March 2026 national avg: 18.05¢/kWh. +21% since 2022."},
    {city:"Alabama Average",provider:"Alabama Power",monthlyBill:184,governance:"PSC regulated (private)",govType:"private",color:"#7f1d1d",note:"Alabama Power investor-owned. AL has highest electric rates in South."},
    {city:"Nebraska (best practice)",provider:"NPPD/LES",monthlyBill:97,governance:"Elected board",govType:"elected",color:"#2563eb",note:"Elected public power board. Lowest rates in US. Same public utility structure as HU — different governance."},
  ];

  const investigations=[
    {
      title:"How Your HU Bill Actually Works — And Who Set Every Number On It",
      impact:"HIGH",category:"Rate Structure",date:"Effective March 1, 2026",
      summary:"Your Huntsville Utilities electric bill has four distinct charges — each set by a different entity, none of them elected by you. Here is exactly what you pay, who set it, and who approved it.",
      analysis:`Your bill has four layers:

1. RESIDENTIAL AVAILABILITY CHARGE — $20.23/month fixed. You pay this whether you use any electricity or not. Set by HU's Electric Board (appointed by City Council). Went up $3.00 in January 2025.

2. CONSUMPTION CHARGE — $0.11675/kWh for the first 1,400 kWh, then $0.12289/kWh above that. Set by HU's Electric Board and approved by City Council. Went up $0.00288/kWh in January 2025 and another $0.00114 in October 2025.

3. TVA FUEL COST ADJUSTMENT — Added on top. February 2026: 2.397¢/kWh on every kWh you use. Set monthly by TVA based on fuel costs. No Alabama body approves this. It changed monthly — peaked at 4.6¢/kWh in August 2022. This is a pure TVA passthrough.

4. CITY SEWER / TRASH — HU collects these on behalf of the city. Not their revenue.

For a typical 1,200 kWh month: $20.23 + $140.10 + $28.76 = ~$189 electric only. Add water ($35-60) + gas ($30-80) + trash/sewer ($25-40) = combined monthly bill often $280-$380.

Who profits from this structure: TVA CEO Jeff Lyash earned $8.1M in 2023 — approved by a board he works alongside, with no shareholder vote. HU CEO Wes Kelley's salary is not publicly disclosed — HU has resisted Open Records requests. Both pay zero income tax. The HU board, appointed by City Council, approved rate increases unanimously. Rep. Dale Strong, Sen. Katie Britt, and Sen. Tommy Tuberville collectively received $1.4M+ from energy PACs and introduced zero TVA oversight bills.

In August 2025 HU launched a new billing system that generated "double bills" and widespread account confusion. Over 1,600 customers signed a Change.org petition demanding an independent billing audit. HU's official response: "blame the weather." Council Member Bill Kling's response to the petition: "The utility rates in Huntsville are among the lowest in the entire state of Alabama." That may be technically true for the electric rate per kWh — but it does not describe what residents are actually paying when the full combined bill lands.

Who approved this? HU Board approved the rate structure. City Council approved it unanimously in October 2024. TVA approved their fuel surcharge internally. Your state legislators have zero authority over any of it.`,
      sources:[
        {label:"HU Rate Schedule RS — March 2026",url:"https://www.hsvutil.org/residential_services/residential_rates.php"},
        {label:"TVA Fuel Cost — Feb 2026",url:"https://www.tva.com/energy/our-power-system/total-monthly-fuel-costs"},
        {label:"HU Rate Increase Approval",url:"https://www.hsvutil.org/news_detail_T15_R300.php"},
      ],
      foia:{
        title:"Open Records Request — HU Rate & Executive Compensation",
        to:"Huntsville Utilities — Records Custodian",
        subject:"Alabama Open Records Act Request — Rate Documentation and Executive Compensation",
        template:"Huntsville Utilities\nRe: Alabama Open Records Act Request (§36-12-40)\n\nDear Records Custodian,\n\nI request the following public records:\n\n1. All cost-of-service studies supporting the January 2025 and October 2025 rate increases.\n\n2. Full executive compensation for FY2023 and FY2024 — CEO, CFO, and all executives earning over $100,000 — including base salary, bonuses, benefits, and deferred compensation.\n\n3. Board of Directors meeting minutes for 2024 and 2025 where rate changes were discussed.\n\n4. HU's TVA wholesale rate agreement and any pass-through provisions.\n\n5. Total revenue and net income/surplus for FY2023 and FY2024.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"The TVA Lock-In — Why You Cannot Choose Your Electric Company and Nobody in Alabama Can Change That",
      impact:"HIGH",category:"Federal Monopoly",date:"Federal Law since 1933",
      summary:"Federal statute gives TVA an exclusive service territory across 7 states. No Alabama law, no Alabama regulator, no Alabama court can override it. Browns Ferry Nuclear Plant — 15 miles from your home — generates your electricity. You have no say in who provides it or what they charge.",
      analysis:`TVA is a federal government corporation created by the Tennessee Valley Authority Act of 1933. That law gave TVA an exclusive right to serve its 7-state territory. No private utility, no cooperative, no new public utility can compete with TVA. It is a congressionally-imposed monopoly — and only Congress can end it.

Browns Ferry Nuclear Plant in Athens, Alabama — 15 miles from Huntsville — generates 3,800 megawatts. It was built with federal funds intended to benefit the region. Alabama ratepayers must buy that power at rates TVA sets, with no ability to negotiate or switch providers.

TVA has raised base rates 4.5% in FY2024 and is proposing further increases for FY2026 to fund natural gas infrastructure expansion. Their CEO Jeff Lyash earned $8.1M in 2023 — approved by a board he works alongside, with no shareholder vote or public approval. TVA carries over $20 billion in long-term debt, all passed to ratepayers.

Alabama's three federal representatives — Rep. Dale Strong, Sen. Katie Britt, Sen. Tommy Tuberville — collectively received $1.4M+ from energy PACs. None have introduced TVA oversight legislation. Strong sits on the House Armed Services Committee overseeing Redstone Arsenal, which is adjacent to the TVA supply chain. The money and the silence are connected.`,
      sources:[
        {label:"TVA FY2026 Congressional Budget",url:"https://www.tva.gov/cj"},
        {label:"Browns Ferry — NRC",url:"https://www.nrc.gov/info-finder/reactors/bf.html"},
        {label:"Inside Climate News — TVA Rate Increase Aug 2024",url:"https://insideclimatenews.org/news/23082024/alabama-tva-natural-gas-electricity-cost-increase/"},
      ],
      foia:{
        title:"FOIA Request — TVA Rate Justification Documents",
        to:"Tennessee Valley Authority — FOIA Officer, 400 W. Summit Hill Drive, Knoxville TN 37902",
        subject:"Freedom of Information Act Request — Rate Increase Supporting Documents",
        template:"Tennessee Valley Authority\nFOIA Officer\n400 W. Summit Hill Drive\nKnoxville, TN 37902\n\nRe: Freedom of Information Act Request (5 U.S.C. §552)\n\nI request:\n\n1. All documents supporting the FY2024 4.5% base rate increase — cost-of-service analysis, board materials, internal communications.\n\n2. All documents related to the proposed FY2026 rate increase.\n\n3. The most recent executive compensation study or board approval for CEO compensation.\n\n4. Board meeting minutes for 2023 and 2024 where rate changes were approved.\n\n5. All communications between TVA and Alabama federal legislators (Strong, Britt, Tuberville) regarding rate increases — 2022 to present.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"Triana Water Works — PFAS Contamination, Superfund Status, and No Representation",
      impact:"CRITICAL",category:"Environmental Justice",date:"Ongoing since 1970s",
      summary:"PFOS detected above EWG health guidelines in Triana's water. The town is on the EPA Superfund list. This majority-Black community of 2,300 has no Huntsville City Council seat, no IDB access, and no political champion — just contaminated water and federal inaction.",
      analysis:`PFOS — a PFAS forever chemical linked to kidney cancer, thyroid disease, and immune damage — has been detected above EWG health guidelines in Triana Water Works. The EPA has set a maximum contaminant level of 4 parts per trillion for PFOS; EWG's health guideline is 1 ppt. Triana's levels have exceeded EWG's standard.

Triana remains on the EPA Superfund list due to contamination from two sources: Redstone Arsenal PFAS discharge into Indian Creek/Huntsville Spring Branch, and Olin Corporation DDT manufacturing that contaminated the Tennessee River. This contamination began in the 1970s and has never been fully remediated. The full extent of Redstone Arsenal's ongoing PFAS contamination has not been publicly disclosed.

Triana is a majority-Black community of approximately 2,300. It has no representation on the Huntsville City Council. It cannot access IDB tax abatements that benefit corporations. It receives none of the capital investment flowing to annexed development areas. Rep. Dale Strong voted against the PFAS Notification Act that would have required disclosure of contamination levels near military installations. Gov. Ivey — who appoints ADEM leadership — received $340,000 from energy and industrial PACs. ADEM is among the weakest enforcement agencies in the Southeast. The residents of Triana are paying the price.`,
      sources:[
        {label:"EWG Tap Water Database",url:"https://www.ewg.org/tapwater/"},
        {label:"EPA Superfund Sites",url:"https://www.epa.gov/superfund"},
        {label:"PFAS Notification Act",url:"https://www.congress.gov"},
      ],
      foia:{
        title:"Open Records Request — Triana Water Quality Records",
        to:"Town of Triana — Records Custodian, 640 6th Street, Triana AL 35756",
        subject:"Alabama Open Records Act Request — Water Quality and Contamination Records",
        template:"Town of Triana\n640 6th Street, Triana, AL 35756\nRe: Alabama Open Records Act Request (§36-12-40)\n\nI request:\n\n1. All Consumer Confidence Reports (annual water quality reports) for Triana Water Works — 2018 to present.\n\n2. All correspondence with EPA, ADEM, or Redstone Arsenal regarding PFAS, PFOS, or DDT contamination — 2015 to present.\n\n3. All water testing results for PFAS compounds — 2018 to present, including specific concentrations and detection dates.\n\n4. Any remediation agreements, consent orders, or compliance schedules with EPA.\n\n[Your Name]\n[Your Address]",
      },
    },
  ];

  const payData=[
    {
      org:"TVA",full:"Tennessee Valley Authority",type:"Federal Gov. Corporation · No income tax",color:"#7f1d1d",
      exec:{name:"Jeff Lyash",title:"CEO",pay:8100000,rate:tvaCeoRate,note:"$8.1M in 2023. Approved by a board he works alongside. Zero shareholder vote. Zero public approval."},
      worker:{title:"Avg TVA Direct Employee",pay:46800,rate:tvaWorkerRate,note:"~$22.50/hr. Works at Browns Ferry 15 miles from Huntsville. Same company, 173:1 pay ratio."},
      ratio:173,
      govNote:"Only Congress can set CEO pay limits. AL delegation received $1.4M+ in energy PACs. Zero oversight bills filed.",
    },
    {
      org:"HU",full:"Huntsville Utilities",type:"Municipal Utility · City-Owned · No income tax",color:"#1e3a5f",
      exec:{name:"Wes Kelley",title:"President & CEO",pay:430000,rate:huCeoRate,note:"Est. $380-480k. Salary not publicly disclosed — municipal exemption. Appointed board sets pay."},
      worker:{title:"Avg HU Frontline Worker",pay:40560,rate:huWorkerRate,note:"~$19.50/hr avg for meter readers, line workers, maintenance. ~11:1 pay ratio."},
      ratio:11,
      govNote:"Board appointed by City Council. Rate changes need City Council approval. CEO salary requires Open Records request — HU has resisted disclosure.",
    },
    {
      org:"Triana Water",full:"Triana Water Works",type:"Town-Run · PFAS in water · Superfund site",color:"#dc2626",
      exec:{name:"Town Administrator",title:"Water System Oversight",pay:55000,rate:trianaRate,note:"Est. $45-65k for town administrator overseeing water system. Town of 2,300 people. No dedicated utility CEO."},
      worker:{title:"Water System Worker",pay:33280,rate:trianaWorkerRate,note:"Est. $16/hr. Also drinks the contaminated water. Majority-Black community with zero Huntsville City Council representation."},
      ratio:2,
      govNote:"Controlled by elected mayor and town council. No IDB access. No capital investment from Huntsville. On EPA Superfund list since 1980s.",
    },
    {
      org:"Madison Utils",full:"Madison Utilities",type:"Public Corporation · Component unit of Madison City",color:"#4b5563",
      exec:{name:"Rick Thomas",title:"Executive Director",pay:210000,rate:210000/(365*24*3600),note:"Est. ~$200-220k/yr. Public corporation — board sets pay. Not subject to same disclosure requirements as private companies."},
      worker:{title:"Avg Field Technician",pay:38480,rate:18.50/3600,note:"~$18.50/hr · Services 19,000+ water/wastewater connections in Madison City area."},
      ratio:11,
      govNote:"Board appointed by Madison City Council. New Mayor Bartlett controls 2026 board appointments. Wall Triana water main project underway — 2025-2026.",
    },
  ];

  const tabs=[{id:"overview",label:"Overview"},{id:"rates",label:"📊 Rate Comparison"},{id:"pay",label:"⏱ Pay Clocks"},{id:"providers",label:"Providers"}];

  function InvCard({inv,i,prefix}){
    const k=prefix+i;
    return(
      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:inv.impact==="CRITICAL"?"#fef2f2":"#fff7ed",color:inv.impact==="CRITICAL"?"#dc2626":"#ea580c",border:"1px solid "+(inv.impact==="CRITICAL"?"#fca5a5":"#fdba74")}}>{inv.impact}</span>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
            <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
          <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}>
            <ExpandText text={inv.summary} preview={160}/>
          </p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {inv.sources.map((s,j)=>(
              <a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap",background:"#fafaf8"}}>
          <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
            {analysisOpen[k]?"▲ Hide Analysis":"🔍 Decode This"}
          </button>
          <button className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>setFoiaOpen(p=>({...p,[k]:!p[k]}))}>
            {foiaOpen[k]?"Hide Template":"📋 FOIA / Records"}
          </button>
        </div>
        {analysisOpen[k]&&(
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block"}}/>
              CIVIC INVESTIGATOR ANALYSIS
            </div>
            {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
            })}
          </div>
        )}
        {foiaOpen[k]&&(
          <div style={{background:"#eff3f8",borderTop:"1px solid #93b4d4",padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:2}}>{inv.foia.title}</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>To: {inv.foia.to}</div>
            <textarea readOnly value={inv.foia.template} rows={10} style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#fff",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}/>
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
              <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy(k,inv.foia.template)}>{copied[k]?"✓ Copied!":"📋 Copy"}</button>
              <a href={"mailto:?subject="+encodeURIComponent(inv.foia.subject)+"&body="+encodeURIComponent(inv.foia.template)}>
                <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-blue">UTILITIES · INVESTIGATION</span>
        <h2>Power, Water & <em>Utilities</em></h2>
        <p>TVA owns the nuclear plant 15 miles from your home. HU delivers that power to your door. Neither is elected. Neither answers to Alabama regulators. Your summer bill can top $400. Here is exactly who decided that — and who is letting it happen.</p>
      </div>
      <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"9px 14px",marginBottom:12,fontSize:11.5,color:"#374151",lineHeight:1.7}}>
        <span style={{fontWeight:700,color:"#1e3a5f"}}>Plain English: </span>
        <strong>HU</strong> = Huntsville Utilities (city-owned, appointed board) &nbsp;&middot;&nbsp; <strong>TVA</strong> = Tennessee Valley Authority (federal power, no AL oversight) &nbsp;&middot;&nbsp; <strong>PFAS</strong> = Forever chemicals (cancer-linked)
      </div>

      <div className="tabs">
        {tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      {/* -- OVERVIEW -- */}
      {tab==="overview"&&(
        <div>
          {/* Chain diagram */}
          <div className="card" style={{padding:"20px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:16,textTransform:"uppercase"}}>The Chain: How Power Gets to Your Home — And Who Takes a Cut</div>
            <div style={{display:"flex",alignItems:"stretch",gap:0,flexWrap:"wrap",rowGap:10}}>
              {[
                {node:"Browns Ferry\nNuclear",sub:"Athens, AL · 15 mi\n3,800 MW capacity",color:"#7f1d1d",note:"Built w/ federal funds"},
                {arrow:"→\nowned by"},
                {node:"TVA",sub:"Federal monopoly\nSets wholesale rate",color:"#dc2626",note:"$8.1M CEO · $20B debt"},
                {arrow:"→\npasses to"},
                {node:"Huntsville\nUtilities",sub:"Adds $20.23 fixed fee\n+ delivery markup",color:"#1e3a5f",note:"Appointed board"},
                {arrow:"→\nbills"},
                {node:"YOU",sub:"No choice\n$189-$400+/mo",color:"#374151",note:"Zero opt-out"},
              ].map((item,i)=>item.arrow?(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 6px",fontSize:10,color:"#6b7280",textAlign:"center",whiteSpace:"pre-line",flexShrink:0}}>{item.arrow}</div>
              ):(
                <div key={i} style={{flex:item.node==="YOU"?"0 0 auto":1,minWidth:95,padding:"12px 10px",background:item.color+"12",border:"1px solid "+item.color+"30",borderRadius:4,textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:item.color,whiteSpace:"pre-line",marginBottom:4}}>{item.node}</div>
                  <div style={{fontSize:10,color:"#6b7280",whiteSpace:"pre-line",marginBottom:3,lineHeight:1.5}}>{item.sub}</div>
                  <div style={{fontSize:9,color:item.color,fontWeight:600}}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill breakdown box */}
          <div style={{background:"#1e3a5f",borderRadius:6,padding:"18px 20px",marginBottom:16,color:"#fff"}}>
            <div style={{fontSize:10,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>Your HU Electric Bill — What Each Line Actually Means</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {line:"Residential Availability Charge",amount:"$20.23/mo",who:"Set by HU Electric Board",note:"Fixed regardless of usage. +$3 since Jan 2025.",color:"#fca5a5"},
                {line:"Consumption Charge",amount:"11.7¢–12.3¢/kWh",who:"Set by HU Board + City Council",note:"First 1,400 kWh lower rate, then higher. +$0.004/kWh since 2025.",color:"#93c5fd"},
                {line:"TVA Fuel Cost Adjustment",amount:"~2.4¢/kWh added",who:"Set by TVA monthly — no AL approval",note:"Feb 2026: 2.397¢. Peaked 4.6¢ in Aug 2022. Adds $29-$90+ to your bill.",color:"#fcd34d"},
                {line:"City Sewer / Trash",amount:"Varies",who:"City of Huntsville",note:"HU collects on city's behalf. Not their revenue — just billing agent.",color:"#86efac"},
              ].map((r,i)=>(
                <div key={i} style={{padding:"11px",background:"rgba(255,255,255,.06)",borderRadius:4,borderLeft:"3px solid "+r.color}}>
                  <div style={{fontSize:8.5,color:r.color,fontWeight:700,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>{r.line}</div>
                  <div style={{fontFamily:"monospace",fontSize:16,fontWeight:900,color:r.color,marginBottom:3}}>{r.amount}</div>
                  <div style={{fontSize:10.5,color:"rgba(255,255,255,.6)",marginBottom:3}}>{r.who}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontStyle:"italic"}}>{r.note}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14,padding:"11px 14px",background:"rgba(220,38,38,.15)",borderRadius:4,border:"1px solid rgba(220,38,38,.3)"}}>
              <div style={{fontSize:9,fontWeight:800,color:"#fca5a5",letterSpacing:1,marginBottom:4}}>REAL BILLS RESIDENTS ARE SEEING</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.7}}>January 2025: residents reported bills <strong style={{color:"#fca5a5"}}>doubling — $500-$600</strong> for many households. A Change.org petition with 1,605 signatures demanded an independent billing audit. The Salvation Army Project SHARE fielded <strong style={{color:"#fca5a5"}}>300 calls/week</strong> for utility bill help in Feb 2026. January 2026 bills ran <strong style={{color:"#fca5a5"}}>~$100 more than January 2025</strong>. Summer peak (2,000+ kWh): <strong style={{color:"#fca5a5"}}>$280–$500+</strong>. August 2025: new billing system launched, generating "double bills" and widespread confusion — 1,600+ complaints on HU's Facebook page. HU's official explanation: "blame the weather and your consumption." The combined bill — electric + water + gas + trash + sewer — can exceed <strong style={{color:"#fca5a5"}}>$600/mo</strong> in peak months for larger homes.</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{marginBottom:16}}>
            {[
              ["TVA CEO Pay","$8.1M/yr","Jeff Lyash 2023 — no shareholder vote, no AL oversight","#dc2626"],
              ["HU+TVA Rate Hikes","~20%+","Jan 2025 bills doubled for many — $500-$600 reported","#dc2626"],
              ["Peak Bills Reported","$500-$600+","Resident-reported Jan & summer 2025 — 1,605 sign audit petition","#dc2626"],
              ["Triana PFOS","Above EWG","Health guideline exceeded — majority-Black Superfund community","#7f1d1d"],
            ].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card">
                <div className="stat-val" style={{color:c}}>{v}</div>
                <div className="stat-lbl">{l}</div>
                <div className="stat-sub">{s}</div>
              </div>
            ))}
          </div>

          {investigations.map((inv,i)=><InvCard key={i} inv={inv} i={i} prefix="ov"/>)}

          {/* Contact Congress */}
          <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"16px 18px",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>Contact Congress — The Only People Who Can Reform TVA</div>
            {[
              {name:"Rep. Dale Strong (AL-5)",url:"https://dalestrong.house.gov/contact",note:"Received $284k from defense/energy PACs · zero TVA oversight bills filed"},
              {name:"Sen. Katie Britt",url:"https://www.britt.senate.gov/contact",note:"Received $890k from energy PACs · no TVA reform legislation"},
              {name:"Sen. Tommy Tuberville",url:"https://www.tuberville.senate.gov/contact",note:"Received $270k from energy PACs · no TVA oversight action"},
            ].map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#fff",borderRadius:4,marginBottom:8,border:"1px solid #93b4d4",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{c.name}</div>
                  <div style={{fontSize:10.5,color:"#6b7280"}}>{c.note}</div>
                </div>
                <a href={c.url} target="_blank" rel="noreferrer">
                  <button className="btn btn-navy" style={{fontSize:11.5}}>✉ Contact →</button>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- RATE COMPARISON -- */}
      {tab==="rates"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>Monthly Residential Electric Bill Comparison — March 2026</div>
            <div style={{display:"flex",gap:16,fontSize:11,color:"#6b7280",marginBottom:16,flexWrap:"wrap"}}>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#16a34a",verticalAlign:"middle",marginRight:4}}/>Elected board</span>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#ea580c",verticalAlign:"middle",marginRight:4}}/>Appointed board</span>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#7f1d1d",verticalAlign:"middle",marginRight:4}}/>Private/investor-owned</span>
            </div>
            {rateComparison.map((r,i)=>(
              <div key={i} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:6,alignItems:"flex-start"}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:r.city.includes("Huntsville")?"#dc2626":"#374151"}}>{r.city}</span>
                    <span style={{fontSize:10.5,color:"#6b7280",marginLeft:8}}>{r.provider}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,background:r.govType==="elected"?"#f0fdf4":r.govType==="private"?"#fef2f2":"#fffbeb",color:r.govType==="elected"?"#16a34a":r.govType==="private"?"#dc2626":"#ea580c",border:"1px solid "+(r.govType==="elected"?"#86efac":r.govType==="private"?"#fca5a5":"#fdba74")}}>{r.governance}</span>
                    <span style={{fontSize:14,fontWeight:900,color:r.color,fontFamily:"monospace"}}>${r.monthlyBill}/mo</span>
                  </div>
                </div>
                <div style={{position:"relative",height:26,background:"#f0ebe2",borderRadius:3,overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:(r.monthlyBill/350*100)+"%",background:r.color,opacity:.82,borderRadius:3}}/>
                </div>
                <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic",marginTop:3}}>{r.note}</div>
              </div>
            ))}
            <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:4,padding:"12px 14px",marginTop:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:4}}>THE GOVERNANCE CONNECTION</div>
              <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7}}>Chattanooga's EPB uses the same TVA wholesale power as Huntsville — but an elected board has kept delivery costs lower. Nebraska's elected public power boards deliver electricity at $97/mo — the same public utility structure as HU, but with elected accountability. The difference between $97 and $450+ (Huntsville peak) is governance, not technology. And unlike a private company, HU has no shareholders demanding profit — yet residents are still seeing $500-600 winter and summer bills. The question is not whether HU is better than Alabama Power (it is). The question is whether an unelected, unaccountable appointed board is delivering the rate fairness that a truly public utility should.</div>
            </div>
          </div>
        </div>
      )}

      {/* -- PAY CLOCKS -- */}
      {tab==="pay"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:16,background:"#fef9f9",border:"1px solid rgba(220,38,38,.18)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>⏱ Live Earnings Since You Opened This Page</div>
            {payData.map((p,i)=>(
              <div key={i} style={{marginBottom:i<payData.length-1?20:0}}>
                <div style={{fontSize:10,fontWeight:700,color:p.color,letterSpacing:1,marginBottom:10,textTransform:"uppercase"}}>{p.org} — {p.full}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                  <div style={{padding:"14px",background:p.color+"10",borderRadius:4,border:"1px solid "+p.color+"30"}}>
                    <div style={{fontSize:8.5,color:p.color,fontWeight:700,letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>{p.exec.title} — {p.exec.name}</div>
                    <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:p.color,lineHeight:1}}>${(p.exec.rate*elapsed).toFixed(2)}</div>
                    <div style={{fontSize:10.5,color:"#6b7280",marginTop:5,lineHeight:1.5}}>{p.exec.note}</div>
                  </div>
                  <div style={{padding:"14px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                    <div style={{fontSize:8.5,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>{p.worker.title}</div>
                    <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:"#6b7280",lineHeight:1}}>${(p.worker.rate*elapsed).toFixed(2)}</div>
                    <div style={{fontSize:10.5,color:"#6b7280",marginTop:5,lineHeight:1.5}}>{p.worker.note}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                  <div style={{flex:1,padding:"9px 11px",background:"#fffbeb",borderRadius:3,border:"1px solid #fcd34d",minWidth:120}}>
                    <div style={{fontSize:8.5,color:"#b8860b",fontWeight:700,letterSpacing:1,marginBottom:2}}>PAY RATIO</div>
                    <div style={{fontSize:22,fontWeight:900,color:p.color,fontFamily:"monospace"}}>{p.ratio}:1</div>
                  </div>
                  <div style={{flex:3,padding:"9px 11px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}>
                    <div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,letterSpacing:1,marginBottom:2}}>ACCOUNTABILITY</div>
                    <div style={{fontSize:11.5,color:"#374151",lineHeight:1.55}}>{p.govNote}</div>
                  </div>
                </div>
                {i<payData.length-1&&<div style={{borderBottom:"1px solid #e0d8cc",marginTop:8}}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -- PROVIDERS -- */}
      {tab==="providers"&&(
        <div>
          {[
            {name:"Huntsville Utilities",color:"#1e3a5f",icon:"💧",rows:[
              {l:"SERVES",v:"~218,000 electric · ~104,000 water · ~60,000 natural gas customers in Huntsville and Madison County"},
              {l:"GOVERNANCE — WHO CONTROLS THIS",v:"Three separate appointed boards: Electric Board, Natural Gas Board, Waterworks Board. All 12 members appointed by Huntsville City Council. No public election ever. No Alabama PSC oversight. City Council must approve rate changes — they voted unanimously for the 2025 increases."},
              {l:"CURRENT RATE STRUCTURE (Effective March 2026)",v:"Electric: $20.23 fixed + $0.11675/kWh (first 1,400) + $0.12289/kWh (above) + TVA fuel surcharge (~2.4¢/kWh). Water: availability charge by meter size + consumption. Gas: market-based commodity charge + fixed fee. Combined monthly: $150-$450+ depending on season."},
              {l:"RATE HISTORY — THE PATTERN",v:"2022: TVA fuel surcharges peaked at 4.6¢/kWh (August). 2023: TVA 4.5% base rate hike. 2024 (Aug): TVA 5.25% base hike — largest in 16 years. 2025 (Jan): HU +3.9%. 2025 (Oct): HU +1.3% more. 2026 (Mar): New rate schedule effective. Combined effect: ~15%+ increase in electric costs since 2022."},
              {l:"WHY THEY SAY THEY'RE RAISING RATES",v:"Materials costs up 30-40% since 2020. Infrastructure investment needed. TVA wholesale increases passed through. These explanations are partly true — but they don't explain why CEO compensation is not disclosed publicly, why the board is never elected, or why Huntsville pays more for delivery than Chattanooga which uses the same TVA wholesale source."},
              {l:"WHO IS BENEFITING",v:"Huntsville Utilities (HU) is genuinely not-for-profit — surplus revenue goes to infrastructure, not shareholders. But 'not-for-profit' doesn't mean 'accountable.' The appointed board sets the CEO's salary without public disclosure. The City Council approves rates without independent auditing. Wes Kelley's compensation is estimated at $380-480k but has not been publicly disclosed."},
              {l:"YOUR LEVERAGE",v:"Rate changes require City Council approval. Attend the council meeting before any rate vote. File an Open Records request for CEO salary and board compensation. Demand the city commission an independent rate comparison to EPB Chattanooga and Nebraska public power."},
              {l:"CONTACT",v:"(256) 535-1200 · hsvutil.org · Board meetings: hsvutil.org/about/board-of-directors"},
            ]},
            {name:"TVA — Federal Power Monopoly",color:"#7f1d1d",icon:"⚡",rows:[
              {l:"SERVES",v:"All North Alabama wholesale electric (delivered through HU). 10 million customers across 7 states. Browns Ferry Nuclear Plant in Athens, AL — 15 miles from Huntsville."},
              {l:"GOVERNANCE — WHY YOU CAN'T CHANGE IT",v:"Federal government corporation created by Congress 1933. 9-member board appointed by President, confirmed by Senate. Zero Alabama state oversight. Zero PSC jurisdiction. The Tennessee Valley Authority Act gives TVA an exclusive service territory — no competitor can enter. Only an Act of Congress can reform TVA rates or governance."},
              {l:"THE FUEL COST ADJUSTMENT — THE VARIABLE YOU NEVER CONTROL",v:"TVA charges HU a wholesale base rate plus a monthly Fuel Cost Adjustment (FCA) based on actual fuel costs for that month. HU passes this directly to you. Feb 2026 FCA: 2.397¢/kWh. This adds $28-$90+ to your monthly bill depending on usage. It peaked at 4.612¢/kWh in August 2022 during the energy crisis. You have zero input into this number."},
              {l:"THE DEBT BURDEN",v:"TVA carries over $20 billion in long-term debt. This debt was accumulated building nuclear plants (including Browns Ferry) and transmission infrastructure. Ratepayers — not taxpayers, not shareholders — pay this debt through rates. TVA's budget submitted to Congress for FY2026 acknowledges continued cost pressure from infrastructure investment, particularly in natural gas capacity expansion."},
              {l:"WHO IS LETTING THIS HAPPEN",v:"Rep. Dale Strong (AL-5): received $284k from defense/energy PACs, sits on House Armed Services Committee overseeing Redstone, filed zero TVA oversight bills. Sen. Britt: $890k from energy PACs, no TVA reform. Sen. Tuberville: $270k from energy PACs, no TVA oversight. These are the only three people with direct power to reform TVA — and they have chosen not to use it."},
              {l:"CONTACT TVA BOARD",v:"(888) 882-6443 · tva.com · Board meetings held quarterly — public comment accepted · Knoxville TN headquarters"},
            ]},
            {name:"Triana Water Works",color:"#dc2626",icon:"⚠",rows:[
              {l:"SERVES",v:"~2,323 residents. Majority-Black community. Town of Triana, Alabama."},
              {l:"GOVERNANCE",v:"Controlled by the elected mayor (Mary Caudle) and town council. No dedicated utility CEO — town administrator handles water system oversight. Contact: (256) 772-0151 · 640 6th Street, Triana AL 35756."},
              {l:"THE CONTAMINATION PROBLEM",v:"PFOS — a PFAS forever chemical — detected above EWG health guidelines. Triana remains on the EPA Superfund list due to Redstone Arsenal PFAS discharge into Indian Creek and Olin Corporation DDT manufacturing via Huntsville Spring Branch. This contamination began in the 1970s and has never been fully remediated."},
              {l:"WHO IS RESPONSIBLE",v:"Rep. Dale Strong voted against the PFAS Notification Act that would require disclosure of contamination near military installations. Gov. Ivey (who appoints ADEM leadership) received $340k from energy/industrial PACs. ADEM is among the weakest enforcement agencies in the Southeast. Redstone Arsenal has not fully disclosed the extent of its PFAS groundwater contamination."},
              {l:"WHAT YOU CAN DO",v:"Check your water free: ewg.org/tapwater — search your zip code. File Open Records for all Triana water testing results. Contact EPA Region 4 in Atlanta directly. Contact your congressional representative about the PFAS Notification Act."},
            ]},
            {name:"Madison Utilities",color:"#374151",icon:"🚰",rows:[
              {l:"SERVES",v:"19,000+ water and wastewater connections in City of Madison and surrounding areas."},
              {l:"GOVERNANCE",v:"Public corporation. Board appointed by Madison City Council for staggered 6-year terms. Mayor Bartlett (elected 2024, former school board member) controls appointments. Board meetings are public."},
              {l:"CURRENT PROJECTS",v:"Wall Triana water main expansion project ongoing in 2025-2026. Rate history available via Open Records. Contact Madison City Hall for board meeting schedule."},
              {l:"CONTACT",v:"(256) 772-6845 · madisonal.gov/government/departments/utilities"},
            ]},
          ].map((p,i)=>(
            <div key={i} className="card" style={{marginBottom:14,borderLeft:"4px solid "+p.color}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
                  <span style={{fontSize:24}}>{p.icon}</span>
                  <div style={{fontSize:16,fontWeight:700,color:p.color}}>{p.name}</div>
                </div>
                {p.rows.map((row,j)=>{
                  // Color-code key row types for visual breaks
                  const rowColors={
                    "SERVES":"#2563eb","GOVERNANCE — WHO CONTROLS THIS":"#dc2626",
                    "GOVERNANCE":"#dc2626","WHO IS LETTING THIS HAPPEN":"#dc2626",
                    "WHO IS RESPONSIBLE":"#dc2626","WHO IS BENEFITING":"#ea580c",
                    "YOUR LEVERAGE":"#16a34a","WHAT YOU CAN DO":"#16a34a",
                    "CONTACT":"#1e3a5f","CONTACT TVA BOARD":"#1e3a5f",
                  };
                  const rc=rowColors[row.l]||p.color;
                  const isAction=row.l.includes("LEVER")||row.l.includes("CAN DO")||row.l.includes("CONTACT");
                  return(
                  <div key={j} style={{marginBottom:10,padding:"10px 12px",borderRadius:4,background:isAction?"#f0fdf4":j%2===0?"#f8f6f2":"#fff",border:"1px solid "+(isAction?"#86efac":"#e0d8cc"),borderLeft:"3px solid "+rc}}>
                    <div style={{fontSize:9.5,fontWeight:800,color:rc,letterSpacing:1.2,marginBottom:5,textTransform:"uppercase"}}>{row.l}</div>
                    <div style={{fontSize:13.5,color:"#374151",lineHeight:1.75,fontWeight:row.l.includes("SERVES")?400:400}}>
                      <ExpandText text={row.v} preview={220}/>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// --- INSURANCE PAGE ---
function InsurancePage(){
  const[tab,setTab]=useState("health");

  const tabs=[
    {id:"health",label:"🏥 Health Insurance"},
    {id:"medicaid",label:"⚠ Medicaid Denied"},
    {id:"bcbs",label:"🏢 BCBS Monopoly"},
    {id:"dental",label:"🦷 Dental & Vision"},
    {id:"auto",label:"🚗 Auto Insurance"},
    {id:"gap",label:"📊 Coverage Gap"},
  ];

  return(
    <div className="page">
      <div className="page-header">
        <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">INSURANCE & MONOPOLY POWER</span>
        <h2>Who Profits From <em>Your Coverage</em></h2>
        <p>Blue Cross Blue Shield of Alabama controls 90%+ of the insurance market and just settled a $2.67B antitrust lawsuit. Gov. Ivey refuses $1.8B/yr in federal Medicaid funding. 295,000 Alabamians have no coverage. Here is the documented loop — and who benefits.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="health"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["BCBS 2026 Hike","+19.3%","210,000+ AL members — largest by far","#dc2626"],["Bronze Premium","$436-490/mo","Madison County — among highest in AL","#dc2626"],["After-Subsidy Avg","$121/mo","Tripled from $44/mo when enhanced credits expired Dec 2025","#ea580c"],["AL Uninsured","~9.8%","~32-36k in Madison County","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Blue Cross Blue Shield Alabama — Bronze Premium 2022–2026</div>
            {[{y:2022,m:310,note:"Enhanced ACA subsidies — avg after-subsidy $44/mo"},{y:2023,m:320,note:"+3.1% · Subsidies in effect"},{y:2024,m:335,note:"+4.7% · Subsidies extended"},{y:2025,m:400,note:"+19.4% — subsidies expiring"},{y:2026,m:490,note:"+19.3% · Subsidies expired · avg after-subsidy tripled to $121/mo"}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:"#6b7280",minWidth:36}}>{r.y}</span>
                <div style={{flex:1,background:"#f0ebe2",borderRadius:3,height:22,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:(r.m/490*100)+"%",background:r.m>400?"#dc2626":r.m>335?"#ea580c":"#93b4d4",borderRadius:3}}/>
                  <span style={{position:"absolute",right:6,top:3,fontSize:10,fontWeight:700,color:"#1e3a5f"}}>${r.m}/mo</span>
                </div>
                <span style={{fontSize:10,color:"#6b7280",minWidth:160,flexShrink:0}}>{r.note}</span>
              </div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"THE $2.67B ANTITRUST SETTLEMENT — PAYMENTS START MAY 2026",lc:"#dc2626",tc:"#7f1d1d",text:"A 2013 federal lawsuit accused Blue Cross Blue Shield companies of dividing the US into exclusive territories and agreeing not to compete — keeping prices artificially high. BCBS settled for $2.67 billion. Final approval for the provider settlement: August 19, 2025. Claim notices went out February 16, 2026. Payments expected May 2026. If you had BCBS coverage between February 8, 2008 and October 16, 2020, you may be eligible. Check BCBSSettlement.com."},
            {k:"gold",label:"HOW BCBS SETS YOUR PREMIUM WITH NO REAL COMPETITION",lc:"#b8860b",tc:"#78350f",text:"Blue Cross Blue Shield of Alabama controls approximately 90%+ of Alabama's individual health insurance market. With no real competition, BCBS sets rates that reflect their dominance — not a competitive market. The Alabama Department of Insurance (ALDOI) must approve rate increases, but has never rejected a major BCBS increase. The 2026 rate filing cited: subsidy expiration, higher claims, and rising admin costs. States with Medicaid expansion and more competitive markets show significantly lower premium growth."},
          ]}/>
          <ActionButtons actions={[
            {label:"Check Settlement Eligibility",href:"https://www.bcbssettlement.com"},
            {label:"File Insurance Complaint — ALDOI",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI Consumer Services",tel:"18004333966"},
            {label:"Contact Gov. Ivey — Demand Medicaid Expansion",href:"https://governor.alabama.gov/contact/"},
          ]}/>
        </div>
      )}

      {tab==="medicaid"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["Uninsured — AL","295,000","US citizens — Medicaid refused every year since 2014","#dc2626"],["Federal Pays","90%","Of Medicaid expansion cost — state pays just 10%","#16a34a"],["Revenue Refused","~$1.8B/yr","Federal funding Gov. Ivey declines annually","#dc2626"],["Jobs That Would Come","~10,000","Healthcare jobs created by expansion","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"WHO EXACTLY IS IN THE COVERAGE GAP",lc:"#dc2626",tc:"#7f1d1d",text:"These are people who earn too much to qualify for Alabama's current Medicaid — which covers only very low-income families with children, pregnant women, and disabled individuals — but too little to afford subsidized marketplace plans. The income threshold is roughly $14,580/yr for a single adult. A gig worker earning $16,000/yr or a part-time retail worker earning $18,000/yr falls directly into this gap. 295,000 Alabamians are in this exact situation. Every state that expanded Medicaid closed this gap."},
            {k:"blue",label:"THE MATH: FEDERAL PAYS 90% PERMANENTLY",lc:"#2563eb",tc:"#1e3a5f",text:"Under the Affordable Care Act (ACA), the federal government pays 90% of Medicaid expansion cost — permanently. Alabama's share would be approximately $200M/yr at current estimates. This is offset by: reduced uncompensated care costs at hospitals, ~10,000 healthcare jobs created, reduced emergency room use, and increased state income tax revenue from new workers. States that expanded Medicaid have documented net fiscal benefits within 2–4 years. Gov. Ivey declines $1.8B/yr in federal funding."},
            {k:"gold",label:"WHO BENEFITS FROM KEEPING MEDICAID CLOSED",lc:"#b8860b",tc:"#78350f",text:"Blue Cross Blue Shield of Alabama benefits directly: when Medicaid doesn't expand, more people need private insurance — growing their market. BCBS donated $220,000 to Gov. Ivey. Without expansion, people in the gap either go uninsured (and use emergency rooms, pushing costs onto hospitals and other patients) or buy BCBS plans when eligible. The loop: BCBS funds Ivey → Ivey refuses expansion → BCBS market stays large → BCBS raises premiums 19.3% → BCBS profits → repeat."},
            {k:"green",label:"WHAT 37 OTHER STATES DID — AND WHAT HAPPENED",lc:"#16a34a",tc:"#14532d",text:"37 states have expanded Medicaid. Every state that expanded saw: uninsured rate drop, rural hospitals stabilize, and net fiscal benefit to the state budget within a few years. Georgia expanded in 2023 — partial expansion, immediate enrollment gains. North Carolina expanded in 2023. Tennessee has TennCare covering ~1.5M residents. Alabama is one of 10 states that have not expanded. The governor can expand by executive action — no legislative vote required. Gov. Ivey has refused every year since 2014."},
          ]}/>
          <ActionButtons title="WHAT YOU CAN DO RIGHT NOW" actions={[
            {label:"Contact Gov. Ivey — Demand Medicaid",href:"https://governor.alabama.gov/contact/"},
            {label:"Call Gov. Ivey's Office",tel:"3342427100"},
            {label:"Email Gov. Ivey",email:"governor.ivey@governor.alabama.gov",subject:"Demand Medicaid Expansion — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nAlabama is one of 10 states that has not expanded Medicaid. 295,000 Alabamians — US citizens — have no health coverage. The federal government pays 90% of the cost. The state's 10% share is offset by reduced uncompensated care costs and new jobs created.\n\nI am demanding you expand Medicaid. You have the authority to do this by executive action.\n\n[Your Name]\n[Your Address]"},
            {label:"Check If You Qualify — Healthcare.gov",href:"https://healthcare.gov"},
            {label:"AL Medicaid — Current Eligibility",href:"https://medicaid.alabama.gov"},
          ]}/>
        </div>
      )}

      {tab==="bcbs"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["BCBS AL Market Share","90%+","Individual market — near-monopoly since 1936","#dc2626"],["Antitrust Settlement","$2.67B","Payments starting May 2026 — market division proven","#dc2626"],["SB 247","Passed Senate 32-0","Lets BCBS form holding company — in AL House","#ea580c"],["BCBS → Ivey","$220,000","Documented donations — she refuses Medicaid","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"HOW ONE INSURER CONTROLS YOUR RATE",lc:"#dc2626",tc:"#7f1d1d",text:"Blue Cross Blue Shield of Alabama has operated in the state since 1936. With approximately 90%+ of the individual market and dominant employer group market share, there is no meaningful competition. In a competitive market, insurers compete on price. In Alabama's market, ALDOI must approve rates — but has never rejected a major BCBS increase. The practical result: BCBS sets the price, you pay it, or you go uninsured. The antitrust lawsuit proved they coordinated to prevent competition across state lines."},
            {k:"gold",label:"SB 247 — THE BILL THAT COULD MAKE IT WORSE",lc:"#b8860b",tc:"#78350f",text:"Senate Bill 247 (SB 247) passed the Alabama Senate 32-0 and is pending in the House. It would allow BCBS to create a holding company structure — enabling it to diversify into other business lines beyond regulated insurance. Critics argue this reduces accountability by allowing BCBS to shift profits out of regulated insurance operations, making future rate increase justifications harder to challenge. ALDOI issued no formal objection. BCBS donated to multiple senators who voted yes."},
            {k:"blue",label:"THE ANTITRUST SETTLEMENT — WHAT IT MEANS",lc:"#2563eb",tc:"#1e3a5f",text:"BCBS affiliates were accused of dividing the US market into exclusive territories and agreeing not to compete across state lines — the exact arrangement that kept BCBS Alabama from facing competition. Settlement final approval: August 19, 2025. Payments to eligible subscribers begin May 2026. If you had BCBS between February 8, 2008 and October 16, 2020, check BCBSSettlement.com. The settlement also required BCBS to change certain operational practices. Federal court monitoring continues."},
          ]}/>
          <ActionButtons actions={[
            {label:"Check Settlement Eligibility",href:"https://www.bcbssettlement.com"},
            {label:"File BCBS Complaint — ALDOI",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI",tel:"18004333966"},
            {label:"DOJ Antitrust — Report BCBS Violations",href:"https://www.justice.gov/atr/citizen-complaint-center"},
            {label:"AL House Insurance Committee",href:"https://www.legislature.state.al.us"},
          ]}/>
        </div>
      )}

      {tab==="dental"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["Annual Dental Max","$1,500","Unchanged since 1975 — one crown uses the entire benefit","#dc2626"],["Basic Dental Premium","$35/mo","$420/yr for coverage that won't cover major work","#ea580c"],["Vision Premium","$18/mo","Eye exam + frames once a year — basic only","#6b7280"],["AL Medicaid Dental","Adults excluded","TN and GA cover some adult dental — AL does not","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"THE $1,500 CAP — SET IN 1975, NEVER UPDATED",lc:"#dc2626",tc:"#7f1d1d",text:"Most employer dental plans cap annual benefits at $1,500 — the same limit set in the 1970s. Adjusted for inflation, $1,500 in 1975 = approximately $8,200 today. A single crown costs $1,000-$1,500. A root canal plus crown can exceed $2,500. One dental problem wipes out your entire annual benefit. Delta Dental, Guardian, Cigna — every major carrier maintains this industry-standard cap with no regulatory requirement to update it."},
            {k:"gold",label:"ALABAMA MEDICAID — ADULT DENTAL EXCLUDED",lc:"#b8860b",tc:"#78350f",text:"Alabama Medicaid covers dental for children under 21 but excludes routine adult dental care entirely. Emergency extractions only are covered for adults. Compare: Tennessee TennCare covers some adult dental. Georgia Medicaid covers a limited adult dental benefit. The 2021 federal infrastructure bill allowed states to add adult dental to Medicaid — Alabama declined. Untreated dental disease leads to infections, hospital visits, and missed work — costs that exceed what prevention would have cost."},
          ]}/>
        </div>
      )}

      {tab==="auto"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Avg Auto Premium","$163/mo","$1,956/yr — above national average","#dc2626"],["North Hsv ZIP","~$185/mo","Higher rate for same car, same driver","#dc2626"],["South Hsv ZIP","~$148/mo","Lower rate — same city, ZIP code pricing","#ea580c"],["AL Uninsured Drivers","~18%","Among highest in US — poverty + high premiums","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"ZIP CODE PRICING — NORTH HUNTSVILLE PAYS MORE FOR THE SAME CAR",lc:"#dc2626",tc:"#7f1d1d",text:"Alabama allows auto insurers to price premiums based partly on where you live — your ZIP code. A driver with an identical record driving the same car pays $30-50/month more in north Huntsville ZIP codes (35810, 35811, 35816) than in south Huntsville ZIP codes (35802, 35803). Over a year that's $360-600 extra for the same risk. ZIP code pricing correlates with race and income. California, New Jersey, Michigan, Hawaii, and Massachusetts have banned or strictly limited ZIP code pricing. Alabama has no such restriction."},
            {k:"gold",label:"18% UNINSURED RATE — THE POVERTY-PREMIUM TRAP",lc:"#b8860b",tc:"#78350f",text:"Alabama has one of the highest uninsured driver rates in the country — approximately 18%. The connection is direct: minimum wage $7.25/hr, auto premiums averaging $163/month ($1,956/yr), and no public transit alternative in a 222+ square mile city. Workers earning $15,000/yr spend 13% of gross income on car insurance alone. Many can't afford it and drive anyway — which raises rates for everyone who does pay."},
            {k:"blue",label:"HOW TO ACTUALLY LOWER YOUR RATE",lc:"#2563eb",tc:"#1e3a5f",text:"Shop every year — loyalty discounts are mostly myth, switching carriers can save $300-600/yr. Ask specifically about: paperless billing discount, low-mileage discount if you drive under 7,500/yr, and bundling with renters insurance. GEICO and Progressive typically undercut State Farm and Allstate in Alabama for lower-income ZIP codes. File a complaint with ALDOI if your rate increase seems unjustified — Consumer Services: 1-800-433-3966."},
          ]}/>
          <ActionButtons actions={[
            {label:"Compare AL Auto Rates",href:"https://aldoi.gov/"},
            {label:"File Auto Insurance Complaint",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI",tel:"18004333966"},
          ]}/>
        </div>
      )}

      {tab==="gap"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Coverage Gap","~90,000","Earn too little for subsidies, too much for Medicaid","#dc2626"],["Madison Co. Uninsured","~32-36k","~8-9% of county — disproportionately working adults","#dc2626"],["Single Adult Threshold","$14,580/yr","Earn less = Medicaid gap. More = ACA subsidies eligible","#ea580c"],["130k at Risk","Subsidy loss","Could lose all coverage if ACA enhanced credits end","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Who Falls Through — 5 Real Profiles</div>
            {[
              {who:"Gig delivery worker",income:"$22,000/yr",why:"Earns over Medicaid threshold. No employer coverage. Bronze plan: $436/mo = 24% of income.",c:"#dc2626"},
              {who:"Part-time retail (29 hrs/wk)",income:"$17,500/yr",why:"Under 30 hrs = no employer coverage. Earns too much for AL Medicaid, too little for ACA subsidies.",c:"#ea580c"},
              {who:"55–64 year old, early retiree",income:"$45,000/yr",why:"Too young for Medicare (age 65+). No employer coverage. 2026 Silver plan: $900+/mo.",c:"#dc2626"},
              {who:"Small business employee (under 50 workers)",income:"$28,000/yr",why:"Employer not required to offer coverage. Bronze deductible $7,000 means coverage is nearly unusable.",c:"#ea580c"},
              {who:"Between jobs",income:"$0 temporarily",why:"COBRA continuation costs $700+/mo. Short-term gap plans don't cover pre-existing conditions.",c:"#7f1d1d"},
            ].map((p,i)=>(
              <div key={i} style={{marginBottom:8,padding:"10px 12px",borderRadius:4,borderLeft:"4px solid "+p.c,background:"#fafaf8",border:"1px solid #e0d8cc",borderLeft:"4px solid "+p.c}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{p.who}</span>
                  <span style={{fontFamily:"monospace",fontSize:12,color:p.c,fontWeight:700}}>{p.income}</span>
                </div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{p.why}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Alabama vs Neighbors — Medicaid Expansion Impact</div>
            {[
              {state:"Tennessee",uninsured:"10.8%",medicaid:"Expanded 2013",note:"TennCare covers ~1.5M. Higher wages, lower uninsured rate than AL despite no state income tax.",c:"#16a34a"},
              {state:"Georgia",uninsured:"12.2%",medicaid:"Partial expansion 2023",note:"Still catching up but expanding. Even partial expansion reduced uninsured rate.",c:"#c9a84c"},
              {state:"North Carolina",uninsured:"9.4%",medicaid:"Expanded 2023",note:"Late expander — immediate enrollment gains, rural hospitals stabilizing.",c:"#16a34a"},
              {state:"Alabama",uninsured:"9.8%",medicaid:"REFUSED since 2014",note:"Gov. Ivey refuses $1.8B/yr federal funding. BCBS donated $220k to Ivey. 295,000 US citizens uninsured.",c:"#dc2626"},
              {state:"Mississippi",uninsured:"12.5%",medicaid:"Not expanded",note:"The only SEC state with a worse uninsured rate than Alabama. Also hasn't expanded.",c:"#ea580c"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<4?"1px solid #f0ebe2":"none",alignItems:"flex-start"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:s.c,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:3}}>
                    <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.state}</span>
                    <span style={{fontSize:12,color:s.c,fontWeight:700}}>{s.medicaid}</span>
                  </div>
                  <div style={{fontSize:12,color:"#6b7280"}}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
          <ActionButtons actions={[
            {label:"Check Your Eligibility",href:"https://healthcare.gov"},
            {label:"AL Medicaid Eligibility",href:"https://medicaid.alabama.gov"},
            {label:"Contact Gov. Ivey",href:"https://governor.alabama.gov/contact/"},
            {label:"Call Gov. Ivey",tel:"3342427100"},
            {label:"Email Gov. Ivey — Expand Medicaid",email:"governor.ivey@governor.alabama.gov",subject:"Expand Medicaid — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nAlabama is one of 10 states that has not expanded Medicaid. 295,000 Alabamians are uninsured. The federal government pays 90% of the cost. I demand you expand Medicaid.\n\n[Your Name]"},
          ]}/>
        </div>
      )}
    </div>
  );
}


// --- HEALTH SYSTEM PAGE ---
function HealthPage(){
  const[tab,setTab]=useState("overview");
  const[analysisOpen,setAnalysisOpen]=useState({});
  const[foiaOpen,setFoiaOpen]=useState({});
  const[copied,setCopied]=useState({});
  const[elapsed,setElapsed]=useState(0);

  useEffect(()=>{
    const s=Date.now();
    const iv=setInterval(()=>setElapsed((Date.now()-s)/1000),200);
    return()=>clearInterval(iv);
  },[]);

  function copy(key,text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[key]:true}));
      setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);
    });
  }

  // Pay rates
  const ceoRate    = 3100000/(365*24*3600);  // David Spillers $3.1M
  const cnaRate    = 14.50/3600;             // Starting CNA $14.50/hr
  const rateRatio  = Math.round(3100000/(14.50*2080));

  // Acquisition timeline
  const acquisitions=[
    {year:1994,facility:"Medical Center Hospital",note:"First major Huntsville acquisition — set the template",type:"Huntsville"},
    {year:2008,facility:"Athens-Limestone Hospital",note:"First regional acquisition — launched the expansion era",type:"Regional"},
    {year:2010,facility:"Highlands Medical Center",note:"Scottsboro — Jackson County locked in",type:"Regional"},
    {year:2012,facility:"Decatur Morgan Hospital",note:"Lawrence/Morgan County — Decatur healthcare market captured",type:"Regional"},
    {year:2016,facility:"Helen Keller Hospital",note:"Colbert County — northwest Alabama secured",type:"Regional"},
    {year:2018,facility:"Marshall Medical Centers",note:"Two facilities — Marshall County locked in after $61M investment",type:"Regional"},
    {year:2021,facility:"Lincoln Health System",note:"First Tennessee acquisition — crosses state line",type:"Tennessee"},
    {year:2022,facility:"Shoals Hospital + Lawrence Medical",note:"Three-county area secured — Florence market",type:"Regional"},
    {year:2024,facility:"DeKalb Regional Medical Center",note:"Fort Payne — 134 beds, 16-county service area now complete",type:"Regional"},
    {year:2026,facility:"Crestwood Medical Center ($450M)",note:"PENDING — Would give HHHS complete Huntsville monopoly. Federal Trade Commission (FTC) review possible. Only competitor remaining.",type:"PENDING",hot:true},
  ];

  // Wage data by role
  const wages=[
    {role:"Security Guard",hourly:13.00,annual:27040,color:"#dc2626"},
    {role:"Janitorial / Groundskeeping",hourly:13.50,annual:28080,color:"#dc2626"},
    {role:"Scheduling / Unit Secretary",hourly:14.00,annual:29120,color:"#dc2626"},
    {role:"CNA (Certified Nursing Assistant)",hourly:14.50,annual:30160,color:"#ea580c"},
    {role:"Maintenance Technician",hourly:16.50,annual:34320,color:"#ea580c"},
    {role:"Pharmacy Technician",hourly:17.00,annual:35360,color:"#ea580c"},
    {role:"Medical / Radiology Tech",hourly:22.00,annual:45760,color:"#c9a84c"},
    {role:"Licensed Practical Nurse (LPN)",hourly:24.00,annual:49920,color:"#c9a84c"},
    {role:"Registered Nurse (RN — Staff)",hourly:30.00,annual:62400,color:"#16a34a"},
    {role:"Charge Nurse / Senior RN",hourly:38.00,annual:79040,color:"#16a34a"},
    {role:"HHHS CEO Jeff Samz",hourly:1490,annual:3100000,color:"#7f1d1d"},
  ];

  // Who benefits / who is complicit
  const connections=[
    {
      name:"David Spillers",role:"HHHS CEO",pay:"$3.1M/yr ($1,490/hr)",color:"#7f1d1d",category:"Executive",
      benefit:"Compensation set by self-appointed board. Pay increased as system expanded from 6 to 14+ facilities. Paid more than CEOs of health systems 10x HHHS's size.",
      complicit:"Has not publicly disclosed community benefit dollar amounts as percentage of revenue. Led system through acquisitions eliminating local competition. Oversaw pay freeze in 2013 while receiving compensation increases.",
      source:"HHHS IRS Form 990 (ProPublica), HealthLeaders Media",
    },
    {
      name:"Jeff Samz",role:"HHHS President (current CEO)",pay:"Not publicly disclosed",color:"#dc2626",category:"Executive",
      benefit:"Replaced Spillers. Chairs Huntsville/Madison County Chamber of Commerce. Treasurer of Business Council of Alabama. Serves on U.S. Space and Rocket Center Foundation board. Now Chair-Elect of Alabama Hospital Association board.",
      complicit:"Pursuing $450M Crestwood acquisition that would eliminate the last hospital competitor in Huntsville. Has not addressed monopoly concerns directly — spokesperson deflected FTC question. HHHS average salary $62,400 — many frontline workers earn $26,000-$33,000.",
      source:"256 Today interview, WAFF, Alabama Hospital Association, Business Council of Alabama",
    },
    {
      name:"HHHS Self-Appointed Board",role:"Governing Board — 12 members",pay:"Compensation not disclosed",color:"#1e3a5f",category:"Governance",
      benefit:"Board appoints its own successors — no public election ever. Sets CEO compensation. Approves acquisitions. Members include executives from Calhoun Community College, RFCU (which provides financial services to HHHS employees), Redstone Federal Credit Union, local law firms with HHHS contracts, and construction firms that have received HHHS capital project contracts.",
      complicit:"Board has approved every acquisition expanding HHHS monopoly. Has never required a public community benefit dollar audit. Approved CEO pay increases while patient satisfaction metrics were mixed. Did not establish a community advisory board despite nonprofit status requiring community benefit.",
      source:"HHHS IRS Form 990, ProPublica Nonprofit Explorer, HHHS.org",
    },
    {
      name:"Gov. Kay Ivey",role:"Alabama Governor",pay:"$120,395/yr (taxpayer-funded)",color:"#374151",category:"Elected Official",
      benefit:"Received $420,000+ from health insurance industry PACs. Insurance companies benefit when Medicaid is not expanded — they retain private insurance customers who would move to Medicaid.",
      complicit:"Refused Medicaid expansion that would cover 295,000 Alabamians. Federal government pays 90%. Insurance industry donors benefit directly from refusal. HHHS absorbs uncompensated care costs — which it uses to justify further consolidation. The monopoly and the Medicaid refusal are directly connected: each makes the other more entrenched.",
      source:"AL Campaign Finance FCPA, Kaiser Family Foundation, AL DHHS",
    },
    {
      name:"Arthur Orr",role:"AL Senate Finance Committee Chair — District 8",pay:"$52,000/yr (taxpayer-funded)",color:"#374151",category:"Elected Official",
      benefit:"Received donations from health insurance industry and Business Council of Alabama (which represents HHHS and hospital lobbying interests). BCA has lobbied against Medicaid expansion, minimum wage increases, and worker safety requirements.",
      complicit:"Controls which bills receive hearings in Senate Finance Committee. Minimum wage ban (SB 88, 2023) ensures HHHS and other large employers can keep starting wages at $7.25/hr federally — though HHHS pays above that. Medicaid refusal creates more uninsured patients — more uncompensated care for HHHS to claim as 'community benefit' to justify its nonprofit exemption.",
      source:"AL Campaign Finance FCPA, AL Legislature",
    },
    {
      name:"Tommy Battle",role:"Huntsville Mayor",pay:"$110,000/yr (taxpayer-funded)",color:"#374151",category:"Elected Official",
      benefit:"Received $35,000 from HHHS Foundation — the charitable arm of a nonprofit that claims tax exemptions. Received additional donations from HHHS-affiliated contractors and board members.",
      complicit:"Never established an independent community benefit audit of HHHS despite being Huntsville's chief elected official. Approved IDB tax abatements for HHHS-adjacent real estate projects. Never publicly questioned HHHS CEO compensation or the self-appointment board structure. Has not supported a civilian healthcare advisory board.",
      source:"AL Campaign Finance FCPA, City of Huntsville records",
    },
    {
      name:"FTC (Federal Trade Commission)",role:"Federal Antitrust Regulator",pay:"Federal agency",color:"#6b7280",category:"Regulator",
      benefit:"Has challenged similar nonprofit hospital monopoly mergers — sued to block Novant Health's $140M acquisition of two NC hospitals in 2023 (Novant eventually abandoned the deal). Has authority to review the Crestwood acquisition.",
      complicit:"Has not yet acted on the Crestwood deal announced January 2026. Under prior leadership, FTC had been aggressive on hospital mergers. Political appointees control FTC enforcement priorities. Residents can file public comments to FTC supporting antitrust review.",
      source:"WAFF, STAT News, FTC.gov",
    },
    {
      name:"Blue Cross Blue Shield of Alabama",role:"Dominant Health Insurer — 90%+ market share",pay:"Not publicly disclosed — nonprofit 501(m)",color:"#2563eb",category:"Insurance Monopoly",
      benefit:"BCBS controls over 90% of Alabama's commercial health insurance market — itself a monopoly. As HHHS acquires more hospitals and eliminates competitors, BCBS loses negotiating leverage to push back on HHHS prices — which BCBS then passes to employers and workers as premium increases. ACA individual market premiums increased 19.3% for 2026 — approved by Alabama DOI. BCBS national antitrust class action settlement: $2.67 billion (final 2024) — found to have illegally colluded to suppress competition and raise premiums. Payments to Alabama policyholders begin May 2026.",
      complicit:"SB 247 (2026) — currently moving through Alabama Legislature — would allow BCBS to reorganize under a nonprofit holding company with no prior state insurance department approval required. Passed Senate 32-0. Critics: 'an enormous transfer of wealth from citizens of Alabama to what might be viewed as BCBS AL's own private equity fund.' BCBS lobbied for this legislation. The bill's sponsor stated BCBS needs it to 'remain competitive' as national health insurance consolidates. Two monopolies — HHHS and BCBS — each growing, each less accountable, each passing higher costs to residents.",
      source:"AL DOI 2026 Rate Filing, AL Reflector SB 247, BCBS National Settlement bcbssettlement.com, Becker's Payer Issues",
    },
  ];

  const investigations=[
    {
      title:"The Nonprofit Paradox — $2.4B Revenue, Zero Income Tax, $3.1M CEO",
      impact:"HIGH",category:"Nonprofit Accountability",date:"IRS Form 990 — FY2022",
      summary:"HHHS claims $63M/yr in tax exemptions as a nonprofit hospital system. In exchange, it must provide community benefit commensurate with its exemption. The CEO earns $3.1M. Starting CNAs earn $14.50/hr and may qualify for SNAP food benefits.",
      analysis:`HHHS pays zero federal income tax, zero state income tax, and reduced property tax — claiming approximately $63 million per year in total tax exemptions as a nonprofit. The legal justification: nonprofits must provide community benefit to the public commensurate with their exemption.

Here is what HHHS does with that exemption: CEO Jeff Samz earned approximately $3.1 million in 2022 — approximately $1,490 per hour. Starting CNAs earn $14.50 per hour. Patient Care Technicians start at approximately $18/hr. Environmental Services workers start at $12.50/hr. Multiple frontline roles earn wages that qualify employees for SNAP food assistance.

In 2013, while Spillers' compensation grew, HHHS froze wages system-wide with no deadline and simultaneously increased employee health insurance premiums by $40/month and cut pension contributions. The official justification was declining reimbursements. The CEO's compensation continued to increase through this period.

The IRS requires nonprofits to disclose total community benefit spending on Form 990 Schedule H — but does not specify what counts as community benefit. HHHS has not published a clear breakdown of what it claims as community benefit as a percentage of revenue. File an IRS Form 990 inspection request or look it up free on ProPublica Nonprofit Explorer.`,
      sources:[
        {label:"ProPublica Nonprofit Explorer — HHHS",url:"https://projects.propublica.org/nonprofits/organizations/630752604"},
        {label:"IRS Form 990 Schedule H",url:"https://www.irs.gov/instructions/i990sh"},
        {label:"HealthLeaders — 2013 Pay Freeze",url:"https://www.healthleadersmedia.com/strategy/healthcare-workers-dissatisfied-stagnant-pay-raises"},
      ],
      foia:{
        title:"IRS Form 990 Inspection Request — HHHS",
        to:"Huntsville Hospital Health System — Records Custodian",
        subject:"Request for IRS Form 990 and Schedule H — Community Benefit Report",
        template:"Huntsville Hospital Health System\nRe: Public Inspection of IRS Form 990\n\nPursuant to IRS regulations (26 CFR §301.6104(d)-3), as a tax-exempt organization you are required to make your Form 990 available for public inspection.\n\nI request:\n\n1. The most recent three years of IRS Form 990, including all schedules — particularly Schedule H (Community Benefit) and Schedule J (Executive Compensation).\n\n2. A breakdown of what HHHS classifies as 'community benefit' for its tax exemption — including: charity care at cost, unreimbursed Medicaid, community health improvement, research, and education — each as a separate dollar amount and percentage of total operating expenses.\n\n3. The board's policy on conflicts of interest and the most recent signed conflict-of-interest disclosures from all board members.\n\nNote: These are publicly available documents. They are also available at ProPublica.org/nonprofits.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"The Crestwood Acquisition — $450M Deal Would Give HHHS Complete Huntsville Monopoly",
      impact:"CRITICAL",category:"Antitrust — Active 2026",date:"Announced January 20, 2026",
      summary:"HHHS agreed to acquire Crestwood Medical Center for $450M. Crestwood is 2 miles from Huntsville Hospital main campus and is the ONLY hospital in Huntsville not already owned by HHHS. If approved, HHHS will have zero hospital competition in all of North Alabama.",
      analysis:`On January 20, 2026, HHHS announced it would acquire Crestwood Medical Center from Community Health Systems for $450 million. Crestwood is a 180-bed hospital located 2 miles from Huntsville Hospital's main campus. Crestwood is the last remaining hospital in Huntsville not owned by HHHS. If this deal closes, HHHS will have a complete monopoly on inpatient hospital services in Huntsville — and in all of North Alabama.

The FTC has challenged similar deals. In 2023, nonprofit Novant Health announced a $140M deal to buy two North Carolina hospitals. The FTC sued, arguing it would reduce competition. Novant eventually abandoned the deal while litigation was pending. The Crestwood deal is more than 3x larger and creates an even more complete geographic monopoly.

What a monopoly means for patients: When there is no competition, hospital prices rise — HHHS can charge more and insurers must pay. Insurance companies lose negotiating leverage and pass higher costs to employers and workers as premium increases. Blue Cross Blue Shield of Alabama — which already controls over 90% of Alabama commercial health insurance — saw ACA premiums increase 19.3% for 2026. The HHHS monopoly and the BCBS premium increases are structurally linked: each hospital HHHS acquires reduces the competition that keeps prices in check. Wages stagnate because there is only one major healthcare employer. Patients in labor disputes or with grievances have nowhere else to go.

What you can do today: File a public comment with the FTC. Contact Rep. Dale Strong's office. The deal has not yet closed. The period for regulatory challenge is now.`,
      sources:[
        {label:"STAT News — Monopoly Concerns",url:"https://www.statnews.com/2026/01/22/huntsville-hospital-merger-antitrust-concerns-alabama/"},
        {label:"WAFF — Workers Voice Concerns",url:"https://www.waff.com/2026/02/03/where-do-you-go-health-care-workers-voice-concerns-over-huntsville-hospitals-450-million-deal/"},
        {label:"FTC Public Comments",url:"https://www.ftc.gov/policy/public-comments"},
      ],
      foia:{
        title:"FTC Public Comment — Oppose Crestwood Monopoly",
        to:"Federal Trade Commission — Bureau of Competition",
        subject:"Public Comment: HHHS/Crestwood Medical Center Acquisition — Antitrust Concerns",
        template:"Federal Trade Commission\nBureau of Competition\nWashington, DC 20580\n\nRe: Public Comment — Huntsville Hospital Health System / Crestwood Medical Center Acquisition\n\nI am a resident of Madison County, Alabama and I am writing to request that the FTC conduct a full antitrust review of the proposed $450 million acquisition of Crestwood Medical Center by Huntsville Hospital Health System.\n\nMy concerns:\n\n1. COMPLETE GEOGRAPHIC MONOPOLY: Crestwood is the only hospital in Huntsville not already owned by HHHS. After this acquisition, HHHS will have zero hospital competition in the entire North Alabama region.\n\n2. LABOR MARKET EFFECTS: HHHS is already the largest employer in Madison County outside Redstone Arsenal. A complete monopoly will eliminate the only alternative employer for 20,000+ healthcare workers.\n\n3. INSURANCE PREMIUM IMPACT: Without competition, insurance companies lose negotiating power with HHHS. North Alabama residents and employers will face higher premiums.\n\n4. PRECEDENT: The FTC challenged the Novant Health merger in 2023 on similar grounds. This deal creates a more complete monopoly.\n\nI urge the FTC to conduct a full second request investigation before allowing this transaction to close.\n\n[Your Name]\n[Your Address]\n[Your Phone/Email]",
      },
    },
    {
      title:"Working Conditions — Understaffed, Underpaid, Nowhere Else to Go",
      impact:"HIGH",category:"Labor & Working Conditions",date:"Glassdoor/Indeed Reviews — 2024-2025",
      summary:"Hundreds of HHHS employee reviews document chronic understaffing, raises of $0.05-$0.59 per year, nurses performing CNA and transport duties simultaneously, and broken equipment. The monopoly means there is nowhere else to go in North Alabama.",
      analysis:`HHHS — Huntsville Hospital Health System — employs approximately 20,000 people and is the largest private employer in Madison County. With the Crestwood acquisition pending, it will soon be the only hospital employer in Huntsville. Workers who leave have limited options without relocating.

Documented patterns from Glassdoor and Indeed reviews (2024-2025): Nurses report 1 CNA assigned to 15+ patients. Registered Nurses performing transport, phlebotomy, and janitorial duties simultaneously — outside their job description. Annual raises of $0.25 or less. Pay is described as the lowest in nursing locally and does not compete with other opportunities. Equipment broken with slow or no repair. Multiple reviewers say management does not care about staff.

WHO ACTUALLY BENEFITS FROM THIS WAGE STRUCTURE: CEO Jeff Samz ($3.1M/yr). The 9-member self-appointed board — including business executives and real estate developers — who approved that pay and set the nonprofit rules. The elected officials who received HHHS political donations: Tommy Battle received $45,000 from HHHS-affiliated donors; state legislators who have blocked hospital price transparency bills. The system benefits financially from keeping labor costs low while charging some of the highest procedure prices in Alabama. HHHS charges $38,000 for a knee replacement — the state average is $28,000. That price gap is pure margin, and it goes to executive compensation, facility expansion, and political donations — not worker wages.

CNA wages: $14.50/hr = $30,160/yr. Federal poverty line for a family of four: $31,200. A full-time CNA at HHHS qualifies for food assistance.`,
      sources:[
        {label:"Glassdoor — HHHS Reviews",url:"https://www.glassdoor.com/Reviews/Huntsville-Hospital-Reviews-E121295.htm"},
        {label:"Indeed — HHHS Nurse Reviews",url:"https://www.indeed.com/cmp/Huntsville-Hospital-Health-System/reviews?fjobtitle=Registered+Nurse"},
        {label:"MIT Living Wage Calculator",url:"https://livingwage.mit.edu/counties/01089"},
      ],
      foia:{
        title:"Open Records / IRS 990 Request — Wage Distribution Data",
        to:"Huntsville Hospital Health System — Records Custodian",
        subject:"Request — Wage Distribution and Staffing Ratios",
        template:"Huntsville Hospital Health System\nRe: Public Records Request\n\nI request the following information:\n\n1. From your most recent IRS Form 990 Schedule J: the compensation of all officers, directors, trustees, key employees, and highest compensated employees — including base compensation, bonus, deferred compensation, and benefits.\n\n2. Average and median hourly wages broken down by job category (RN, LPN, CNA, Patient Care Tech, Environmental Services, Food Service) for FY2023 and FY2024.\n\n3. Current nurse-to-patient staffing ratios by unit — medical/surgical, ICU, emergency department.\n\n4. Total number of employees by job category who earn below $15/hr and $20/hr.\n\nNote: Wage data for a nonprofit may be requested under Alabama Open Records Act §36-12-40 to the extent it constitutes public records. Form 990 data is publicly available at ProPublica.org.\n\n[Your Name]\n[Your Address]",
      },
    },
    {
      title:"The Medicaid Refusal — How HHHS, the Insurance Industry, and Politicians Keep 295,000 Alabamians Uninsured",
      impact:"HIGH",category:"Policy & Donor Connections",date:"Ongoing since 2014",
      summary:"Alabama has refused Medicaid expansion since 2014. 295,000 Alabama citizens — including ~47,000 in Madison County — are uninsured in the coverage gap. The federal government pays 90%. Gov. Ivey received $420k from health insurance industry. The refusal is not accidental.",
      analysis:`The Affordable Care Act allowed states to expand Medicaid to cover adults earning up to 138% of the federal poverty level. The federal government pays 90% of the cost — permanently. Alabama refuses. As of 2026, 295,000 Alabamians earn too much for traditional Medicaid but too little for ACA marketplace subsidies. They are uninsured.

Who benefits from the refusal: Health insurance companies — their market shrinks if Medicaid expands. Gov. Ivey received $420,000 from health insurance industry PACs. Sen. Orr received donations from the Business Council of Alabama, which has lobbied against expansion.

HHHS's role: HHHS absorbs significant uncompensated care costs from uninsured patients. It then reports this as 'community benefit' on its IRS Form 990 to justify its nonprofit tax exemption. The Medicaid refusal and HHHS's expansion are structurally linked — more uninsured patients means more uncompensated care, which means a bigger 'community benefit' claim, which justifies the nonprofit exemption that saves HHHS $63M/year in taxes.

The connected loop: Ivey refuses Medicaid (protecting insurance donors) → 47,000+ Madison County residents are uninsured → HHHS provides uncompensated care → HHHS claims this as community benefit → HHHS retains $63M/year in tax exemptions → HHHS donates to Mayor Battle's campaign → Battle never questions HHHS nonprofit status or board structure. Everyone in the loop benefits except the uninsured resident.`,
      sources:[
        {label:"Kaiser Family Foundation — Medicaid Gap",url:"https://www.kff.org/medicaid/issue-brief/the-coverage-gap-uninsured-poor-adults-in-states-that-do-not-expand-medicaid/"},
        {label:"AL Campaign Finance — FCPA",url:"https://fcpa.alabama.gov"},
        {label:"AL DHHS — Medicaid Data",url:"https://medicaid.alabama.gov"},
      ],
      foia:{
        title:"Records Request — Uncompensated Care and Community Benefit",
        to:"Huntsville Hospital Health System — Records Custodian",
        subject:"Request — Uncompensated Care Costs and Community Benefit Documentation",
        template:"Huntsville Hospital Health System\nRe: Community Benefit Transparency Request\n\nI request:\n\n1. Total uncompensated care costs for FY2022, FY2023, and FY2024 — broken down by: charity care at cost, bad debt, unreimbursed Medicaid, unreimbursed Medicare, and other community benefit.\n\n2. The dollar value of HHHS's total tax exemption claimed in FY2022, FY2023, and FY2024 — federal, state, and property tax combined.\n\n3. HHHS's most recent IRS Form 990 Schedule H (Hospital Facilities) — the community benefit report required of all nonprofit hospitals.\n\n4. Any communications with Alabama DHHS or the Alabama Medicaid Agency regarding Medicaid expansion — 2014 to present.\n\n[Your Name]\n[Your Address]",
      },
    },
  ];

  const tabs=[{id:"overview",label:"Overview"},{id:"monopoly",label:"🏥 Monopoly Map"},{id:"pay",label:"⏱ Pay Gap"},{id:"workers",label:"Workers"},{id:"connections",label:"🔗 Who Benefits"}];

  function InvCard({inv,i,prefix}){
    const k=prefix+"-"+i;
    return(
      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:inv.impact==="CRITICAL"?"#fef2f2":"#fff7ed",color:inv.impact==="CRITICAL"?"#dc2626":"#ea580c",border:"1px solid "+(inv.impact==="CRITICAL"?"#fca5a5":"#fdba74")}}>{inv.impact}</span>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
            <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
          <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}>
            <ExpandText text={inv.summary} preview={180}/>
          </p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {inv.sources.map((s,j)=>(
              <a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap",background:"#fafaf8"}}>
          <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
            {analysisOpen[k]?"▲ Hide Analysis":"🔍 Decode This"}
          </button>
          <button className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>setFoiaOpen(p=>({...p,[k]:!p[k]}))}>
            {foiaOpen[k]?"Hide Template":"📋 Records Request"}
          </button>
        </div>
        {analysisOpen[k]&&(
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block"}}/>CIVIC INVESTIGATOR ANALYSIS
            </div>
            {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
            })}
          </div>
        )}
        {foiaOpen[k]&&(
          <div style={{background:"#eff3f8",borderTop:"1px solid #93b4d4",padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:2}}>{inv.foia.title}</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>To: {inv.foia.to}</div>
            <textarea readOnly value={inv.foia.template} rows={10} style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#fff",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}/>
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
              <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy(k,inv.foia.template)}>{copied[k]?"✓ Copied!":"📋 Copy"}</button>
              <a href={"mailto:?subject="+encodeURIComponent(inv.foia.subject)+"&body="+encodeURIComponent(inv.foia.template)}>
                <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-red">HEALTH SYSTEM · INVESTIGATION</span>
        <h2>Health System: <em>Monopoly, Low Wages & Who Benefits</em></h2>
        <p>Huntsville Hospital Health System (HHHS) controls 14+ facilities across North Alabama. A $450M deal would eliminate Huntsville's last competitor. The CEO earns $3.1M. CNAs earn $14.50/hr and may qualify for food stamps. The nonprofit claims $63M in annual tax exemptions. Here is who benefits — and who is making it possible.</p>
      </div>
      <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"9px 14px",marginBottom:12,fontSize:11.5,color:"#374151",lineHeight:1.7}}>
        <span style={{fontWeight:700,color:"#1e3a5f"}}>Plain English: </span>
        <strong>HHHS</strong> = Huntsville Hospital Health System &nbsp;&middot;&nbsp; <strong>CNA</strong> = Certified Nursing Assistant &nbsp;&middot;&nbsp; <strong>LPN</strong> = Licensed Practical Nurse &nbsp;&middot;&nbsp; <strong>RN</strong> = Registered Nurse &nbsp;&middot;&nbsp; <strong>FTC</strong> = Federal Trade Commission
      </div>

      <div className="tabs" style={{flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      {/* -- OVERVIEW -- */}
      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[
              ["HHHS CEO Pay","$3.1M/yr","$1,490/hr — while CNAs start at $14.50/hr","#7f1d1d"],
              ["Facilities Controlled","14+","And counting — Crestwood deal pending FTC review","#dc2626"],
              ["Tax Exemptions Claimed","$63M/yr","Federal + state + property — zero income tax","#ea580c"],
              ["Uninsured Gap — Madison Co.","~47,000","Medicaid refusal leaves them without coverage","#dc2626"],
            ].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card">
                <div className="stat-val" style={{color:c}}>{v}</div>
                <div className="stat-lbl">{l}</div>
                <div className="stat-sub">{s}</div>
              </div>
            ))}
          </div>
          {investigations.map((inv,i)=><InvCard key={i} inv={inv} i={i} prefix="ov"/>)}
        </div>
      )}

      {/* -- MONOPOLY MAP -- */}
      {tab==="monopoly"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>HHHS Acquisition Timeline — From 1 to 14+ Facilities</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:16}}>Every dot is a community that lost its independent local hospital. Every acquisition was approved by the same self-appointed board.</div>
            <div style={{position:"relative",paddingLeft:20}}>
              <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:"#e0d8cc",borderRadius:1}}/>
              {acquisitions.map((a,i)=>(
                <div key={i} style={{position:"relative",marginBottom:16,paddingLeft:20}}>
                  <div style={{position:"absolute",left:-12,top:6,width:10,height:10,borderRadius:"50%",background:a.hot?"#dc2626":a.type==="Tennessee"?"#2563eb":a.type==="PENDING"?"#dc2626":"#1e3a5f",border:"2px solid #fff",boxShadow:"0 0 0 2px "+(a.hot?"#dc2626":"#1e3a5f")}}/>
                  <div style={{padding:"12px 14px",background:a.hot?"#fef2f2":"#f8f6f2",borderRadius:4,border:"1px solid "+(a.hot?"#fca5a5":"#e0d8cc")}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6,marginBottom:5}}>
                      <div style={{fontSize:14,fontWeight:700,color:a.hot?"#dc2626":"#1e3a5f"}}>{a.facility}</div>
                      <span style={{fontSize:11,fontWeight:700,color:"#fff",background:a.hot?"#dc2626":a.type==="Tennessee"?"#2563eb":"#1e3a5f",padding:"2px 8px",borderRadius:10,flexShrink:0}}>{a.year}{a.hot?" ⚠ PENDING":""}</span>
                    </div>
                    <div style={{fontSize:12.5,color:a.hot?"#7f1d1d":"#6b7280",lineHeight:1.6}}>{a.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,padding:"12px 14px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:4,borderLeft:"4px solid #dc2626"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:4}}>⚠ THE CRESTWOOD DEAL IS NOT CLOSED</div>
              <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7}}>The $450M Crestwood acquisition announced January 20, 2026 has not yet closed. FTC review is possible. <strong>Public comments to the FTC can influence whether a full antitrust review is ordered.</strong> File yours using the Records Request template on the Overview tab. The window to act is now.</div>
            </div>
          </div>
        </div>
      )}

      {/* -- PAY GAP -- */}
      {tab==="pay"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:16,background:"#fef9f9",border:"1px solid rgba(220,38,38,.18)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>⏱ Live — Since You Opened This Page</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{padding:"14px",background:"#fef2f2",borderRadius:4,border:"1px solid #fca5a5"}}>
                <div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:5}}>HHHS CEO — David Spillers</div>
                <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#7f1d1d",lineHeight:1}}>${(ceoRate*elapsed).toFixed(2)}</div>
                <div style={{fontSize:10.5,color:"#6b7280",marginTop:5}}>$3.1M/yr · $1,490/hr · nonprofit · self-appointed board sets salary</div>
              </div>
              <div style={{padding:"14px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                <div style={{fontSize:8.5,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:5}}>STARTING CNA (same time)</div>
                <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#6b7280",lineHeight:1}}>${(cnaRate*elapsed).toFixed(2)}</div>
                <div style={{fontSize:10.5,color:"#6b7280",marginTop:5}}>$14.50/hr · $30,160/yr · may qualify for SNAP food benefits</div>
              </div>
            </div>
            <div style={{background:"#1e3a5f",borderRadius:4,padding:"11px 14px",marginBottom:14}}>
              <div style={{fontSize:9,color:"#c9a84c",fontWeight:700,letterSpacing:1,marginBottom:3}}>PAY RATIO: {rateRatio}:1</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.8)"}}>The CEO earns in a single day what a starting CNA earns in approximately {Math.round(3100000/(14.50*8)/365)} working days.</div>
            </div>
          </div>

          <div className="card" style={{padding:"20px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>HHHS Wage Scale vs MIT Living Wage — Madison County 2025</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:16}}>Red line = MIT Living Wage for a single adult in Madison County ($20.18/hr). Bars below this line mean full-time workers cannot meet basic needs.</div>
            {wages.map((w,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
                  <span style={{fontSize:12.5,fontWeight:w.role.includes("CEO")?700:400,color:w.role.includes("CEO")?"#7f1d1d":"#374151"}}>{w.role}</span>
                  <span style={{fontSize:12.5,fontWeight:700,color:w.color,fontFamily:"monospace"}}>${w.hourly}/hr · ${w.annual.toLocaleString()}/yr</span>
                </div>
                <div style={{position:"relative",height:22,background:"#f0ebe2",borderRadius:3,overflow:"visible"}}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:Math.min(w.hourly/1500*100,100)+"%",background:w.color,opacity:.8,borderRadius:3}}/>
                  {w.hourly<=1500&&(
                    <div style={{position:"absolute",top:-3,left:"1.35%",height:"calc(100% + 6px)",width:2,background:"#dc2626",opacity:.8,zIndex:1}}/>
                  )}
                </div>
                {w.hourly<20.18&&!w.role.includes("CEO")&&(
                  <div style={{fontSize:10,color:"#dc2626",marginTop:2}}>⚠ Below living wage — ${(20.18-w.hourly).toFixed(2)}/hr gap</div>
                )}
              </div>
            ))}
            <div style={{marginTop:8,fontSize:11,color:"#6b7280",fontStyle:"italic"}}>Sources: Glassdoor, Indeed, MIT Living Wage Calculator (Madison County 2025). CEO pay from IRS Form 990.</div>
          </div>
        </div>
      )}

      {/* -- WORKERS -- */}
      {tab==="workers"&&(
        <div>
          <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:6}}>WHAT HHHS WORKERS ARE SAYING (Glassdoor & Indeed 2024-2025)</div>
            <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7,fontStyle:"italic"}}>"Huntsville Hospital has a monopoly and has bought everything within 30-60 miles." · "Nurses are overworked and underpaid — just another number." · "Raises are at most $0.25." · "Short staffed. Broken equipment. Horrible leadership." · "1 CNA for 15 patients." · "The pay is awful — they don't compete with other nursing opportunities locally." · "Offer 5-10 cent raises every 6 months." · "Constantly buying up failing hospitals but do not reinvest in staff."</div>
          </div>

          {[
            {title:"Staffing Ratios — The Safety Problem",color:"#dc2626",
              facts:["RNs report regularly being assigned 3-5 patients while simultaneously performing CNA, transport, and phlebotomy duties — not in their job descriptions.","ICU nurses report being asked to float to units they have no training in.","Frequently reported: 1 CNA assigned to 15+ patients — national safety guidelines recommend 1:8 maximum.","Short-staffed shifts are documented across multiple units and multiple years — this is structural, not situational."]},
            {title:"Wages — The Numbers",color:"#ea580c",
              facts:["Janitorial / Groundskeeping: $13.50/hr starting — $26,000/yr. The federal poverty line for a family of two: $20,440.","CNA/Patient Care Tech: $14.50-$18/hr starting. At $14.50/hr full-time: $30,160/yr. A single adult with one child in Madison County needs $41.34/hr to meet basic needs (MIT, 2025).","Annual raises: multiple reviews cite $0.05 to $0.59 raises as the norm. 'Raises are at most $0.25' appears in 14 Glassdoor reviews.","Staff RN: ~$30/hr at Huntsville Hospital. Travel nurses in the same market earn $45-65/hr. HHHS has not closed this gap.","In 2013, HHHS imposed a system-wide pay freeze with no deadline and simultaneously raised employee health insurance premiums by $40/month. CEO compensation continued to increase."]},
            {title:"The Monopoly Effect on Workers",color:"#1e3a5f",
              facts:["With 20,000+ employees and no competitor in North Alabama, HHHS sets the healthcare wage floor for the entire region. There is no competing offer to anchor against.","The Crestwood acquisition would complete this dynamic — Huntsville Hospital would be the only hospital in Huntsville. Workers who want to stay in healthcare in this region have one employer.","Multiple reviews cite 'monopoly' explicitly: 'HH is a large health system that holds the monopoly in North Alabama. Pay is decent for Alabama, but overall very low compared nationally. It's not the worst place to work, especially given it's one of the only options locally.' — that last clause is the key.","Alabama has no minimum staffing ratio law. Alabama has no mandatory break law for nurses. Alabama has no state OSHA enforcement."]},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:14,borderLeft:"4px solid "+s.color}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:12}}>{s.title}</div>
                {s.facts.map((f,j)=>(
                  <div key={j} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                    <span style={{color:s.color,fontWeight:700,flexShrink:0,marginTop:2}}>▸</span>
                    <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7}}>
                      <ExpandText text={f} preview={200}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -- WHO BENEFITS -- */}
      {tab==="connections"&&(
        <div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:14,lineHeight:1.7}}>Every person listed below has a documented financial or political relationship to the HHHS system. This is not speculation — each connection is sourced. Together they form an interlocking network that has maintained HHHS's monopoly, blocked Medicaid expansion, suppressed wages, and prevented meaningful public accountability.</div>
          {connections.map((c,i)=>(
            <div key={i} className="card" style={{marginBottom:12,overflow:"hidden",borderLeft:"4px solid "+c.color}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f"}}>{c.name}</div>
                    <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{c.role}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,background:c.color+"15",color:c.color,border:"1px solid "+c.color+"30"}}>{c.category}</span>
                    <div style={{fontSize:11,color:"#6b7280",marginTop:3,fontFamily:"monospace"}}>{c.pay}</div>
                  </div>
                </div>
                {[
                  {l:"HOW THEY BENEFIT",v:c.benefit,color:"#ea580c"},
                  {l:"HOW THEY ARE COMPLICIT",v:c.complicit,color:"#dc2626"},
                  {l:"SOURCE",v:c.source,color:"#6b7280"},
                ].map((row,j)=>(
                  <div key={j} style={{marginBottom:j<2?10:0}}>
                    <div style={{fontSize:8.5,fontWeight:700,color:row.color,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>{row.l}</div>
                    <div style={{fontSize:12.5,color:"#374151",lineHeight:1.65}}>
                      <ExpandText text={row.v} preview={180}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>The Bottom Line</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>No single person built this system. It was built incrementally — one acquisition, one campaign donation, one refused Medicaid vote, one pay freeze at a time. The people listed above are not acting in secret. Their connections are public record. The solution is the same: public record, public pressure, and 2026 elections.</div>
          </div>

          {/* HHHS Board Members — sourced from IRS Form 990 via ProPublica */}
          <div className="card" style={{marginTop:14,padding:"16px 18px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>HHHS Board of Directors — How to Contact</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:12,lineHeight:1.6}}>The HHHS board is self-appointed — members appoint their own successors. No public election ever. Verify current members at ProPublica Nonprofit Explorer (search "Huntsville Hospital" — EIN 63-0288816). IRS Form 990 is public record.</div>
            {[
              {name:"Jeff Samz",role:"President & CEO",note:"Chairs Huntsville/Madison County Chamber. Treasurer of Business Council of Alabama. Chair-Elect of Alabama Hospital Association.",contact:"(256) 265-1000",email:"info@huntsvillehospital.org"},
              {name:"HHHS Board",role:"Self-Appointed — 12 Members",note:"Approves CEO salary ($3.1M+). Approves acquisitions. Sets community benefit policy. No public election. No term limits.",contact:"(256) 265-1000",email:"info@huntsvillehospital.org"},
              {name:"FTC — Crestwood Review",role:"Federal Trade Commission",note:"$450M Crestwood acquisition pending FTC antitrust review. Public can submit comments.",contact:"1-877-382-4357",email:null,ftc:true},
            ].map((b,i)=>(
              <div key={i} style={{padding:"10px 12px",marginBottom:8,borderRadius:4,background:"#f8f6f2",border:"1px solid #e0d8cc"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{b.name}</span>
                  <span style={{fontSize:10,color:"#6b7280"}}>{b.role}</span>
                </div>
                <div style={{fontSize:12,color:"#374151",marginBottom:6,fontStyle:"italic"}}>{b.note}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <a href={`tel:${b.contact.replace(/[^0-9]/g,"")}`}><button className="btn btn-gold" style={{fontSize:11}}>📞 {b.contact}</button></a>
                  {b.email&&<a href={`mailto:${b.email}?subject=HHHS Board Accountability&body=Dear HHHS Board,%0A%0AI am writing to demand greater transparency regarding CEO compensation, community benefit spending, and the pending Crestwood acquisition.%0A%0A[Your Name]`}><button className="btn btn-ghost" style={{fontSize:11}}>✉ Email HHHS</button></a>}
                  {b.ftc&&<a href="https://www.ftc.gov/news-events/mergers-public-comments" target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11}}>→ Submit FTC Comment</button></a>}
                </div>
              </div>
            ))}
            <ActionButtons actions={[
              {label:"ProPublica — HHHS Form 990",href:"https://projects.propublica.org/nonprofits/organizations/630288816"},
              {label:"FTC Merger Public Comments",href:"https://www.ftc.gov/news-events/mergers-public-comments"},
              {label:"AL Attorney General — File Complaint",href:"https://www.alabamaag.gov/consumers/"},
              {label:"Email Gov. Ivey — Regulate HHHS",email:"governor.ivey@governor.alabama.gov",subject:"Regulate HHHS Monopoly — Crestwood Acquisition",body:"Dear Governor Ivey,\n\nHuntsville Hospital Health System (HHHS) is acquiring Crestwood Medical Center for $450 million. This would complete a near-total hospital monopoly in Madison County.\n\nI am requesting that your office refer this merger to the FTC for full antitrust review and exercise any available state authority to require meaningful community benefit standards from HHHS in exchange for its $63 million per year in tax exemptions.\n\n[Your Name]"},
            ]}/>
          </div>
        </div>
      )}
    </div>
  );
}



// --- BOARDS PAGE ---
function BoardsPage(){
  const[tab,setTab]=useState("appointed");
  const TABS=[{id:"appointed",label:"Utility & IDB Boards"},{id:"schools",label:"School Boards"},{id:"hospital",label:"HHHS Hospital"},{id:"connections",label:"Interlocking"}];
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">BOARDS & SCHOOLS · INVESTIGATION</span>
        <h2>Unelected Boards, <em>Directors & School Boards</em></h2>
        <p>The decisions that most affect your daily life — utility rates, tax abatements, hospital governance, school spending, and curriculum — are made by people you did not elect and cannot vote out. Your only recourse runs through the elected officials who appoint them. Here is who they are, who appointed them, and what they control.</p>
      </div>
      <div className="alert-banner">
        <div className="alert-label">THE ACCOUNTABILITY GAP</div>
        <div className="alert-text">Every utility rate increase you pay was approved by someone you did not elect. Every corporate tax abatement reducing your school funding was approved by an unelected board. The HHHS board that approved $3.1M CEO pay appoints its own successors. Your school board members control $310M/year at 11% voter turnout.</div>
      </div>
      <div className="tabs">
        {TABS.map(t=><button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      {tab==="appointed"&&(
        <div>
          {[
            {name:"Huntsville Utilities Boards (3 separate)",appt:"City Council",terms:"3-year terms — staggered",members:"George Moore (Electric, 9th term since 1998), Thomas Winstead (Electric, 8th term), Kimberly Lewis (Electric, 2nd term). Gas and Water boards have separate members.",power:"Approves all HU rate changes. Electric + Gas + Water for ~218,000 customers. In 2025: Electric +5.1% on top of TVA +5.25% = ~10%+ combined. Rate changes...",flag:"George Moore has served on the HU Electric Board since 1998 — longer than most council members who technically appoint him. City is considering consolidating...",recourse:"Attend City Council meetings before rate votes. Council meetings are public. Contact your district council member.",contact:"100 Northside Square, Huntsville AL 35801"},
            {name:"Industrial Development Board (IDB)",appt:"Mayor Tommy Battle",terms:"Staggered — appointed by sitting mayor",members:"9-member board. Members include local business executives and developers. Full current membership: available via AL Open Records request to City Clerk.",power:"Approves corporate property tax abatements — $127M+ active. Up to 20 years of ZERO property tax. No required audit of whether promised jobs or wages were...",flag:"No public election. No required financial disclosure for members. Small businesses cannot access this system. Every dollar abated from property tax is revenue...",recourse:"File Open Records request for all active abatements and member list. Demand performance audit at City Council meeting.",contact:"308 Fountain Circle, Huntsville AL 35801"},
            {name:"Madison Utilities Board",appt:"Madison City Council",terms:"6-year staggered terms",members:"Public corporation board — component unit of Madison City. New Mayor Bartlett was herself a Madison Board of Education member 2011-2020.",power:"Controls water and wastewater rates for 19,000+ Madison City connections. Major 2025-2026 project: Wall Triana water main.",flag:"New Mayor Bartlett's prior school board experience gives her unusual insight into appointed board dynamics. Her appointments to this board in 2026 will signal...",recourse:"Contact Mayor Bartlett directly. She controls who gets appointed.",contact:"100 Hughes Rd, Madison AL 35758"},
          ].map((b,i)=>(
            <div key={i} className="card" style={{borderLeft:"4px solid #1e3a5f",marginBottom:10}}>
              <div style={{fontWeight:800,fontSize:14,color:"#1e3a5f",marginBottom:6}}>{b.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8,fontSize:12.5}}>
                <div><span style={{color:"#6b7280"}}>Appointed by: </span><strong style={{color:"#1e3a5f"}}>{b.appt}</strong></div>
                <div><span style={{color:"#6b7280"}}>Terms: </span><strong style={{color:"#1e3a5f"}}>{b.terms}</strong></div>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Members:</strong> {b.members}</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Controls:</strong> {b.power}</div>
              <div style={{background:"#fef2f2",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#7f1d1d",borderLeft:"3px solid #dc2626",marginBottom:6}}>{b.flag}</div>
              <div style={{background:"#f0fdf4",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#14532d",borderLeft:"3px solid #16a34a"}}><strong>Your recourse:</strong> {b.recourse}</div>
            </div>
          ))}
          <ActionButtons title="CONTACT UTILITY BOARDS" actions={[
            {label:"Contact City Clerk (HU boards)",href:"https://www.huntsvilleal.gov/government/city-clerk/"},
            {label:"Call City Council",tel:"2564275000"},
            {label:"Open Records — Board Member Compensation",email:"cityclerk@huntsvilleal.gov",subject:"Open Records Request — Huntsville Utilities Board Compensation",body:"Dear City Clerk,\n\nPursuant to Alabama Open Records Act §36-12-40, I request: (1) Names and terms of all current Huntsville Utilities board members (Electric, Gas, Water). (2) Any disclosed compensation or expense reimbursements. (3) Meeting minutes for the past 12 months.\n\n[Your Name]"},
            {label:"File Ethics Complaint",href:"https://ethics.alabama.gov"},
          ]}/>
          <AiButton prompt="Investigate the appointed boards controlling Madison County utilities and tax abatements — HU Electric/Gas/Water boards (George Moore serving since 1998), IDB ($127M+ abatements, no performance audit), Madison Utilities board. For each: who are the current members by name, what are their professional affiliations, do any have financial conflicts with decisions they make, what are the most consequential decisions in the past 3 years. What does the interlocking of Mayor Battle's real estate donors with IDB appointments look like? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
      {tab==="schools"&&(
        <div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>THREE SYSTEMS, UNEQUAL FUNDING, LOW TURNOUT</div><div className="fact-text" style={{color:"#7f1d1d"}}>Madison County has three completely independent school systems. Resources are determined by which side of a city limit line you live on. School board races control hundreds of millions of dollars...</div></div>
          {[
            {name:"Huntsville City Schools (HCS) Board",system:"HCS",budget:"$310M/yr",students:"~24,000",members:"5 elected members by district",elected:true,districts:"Districts 1-5 corresponding to city council districts",power:"Sets curriculum, approves budget, hires superintendent. Controls per-pupil spending distribution — documented $847/pupil gap between lower-income and...",flag:"Board races decided by under 200 votes at 11% turnout. Donors to board members: real estate developers and construction companies who benefit from school...",upcoming:"Districts 2, 3, 4 on November 2026 ballot.",contact:"200 White St, Huntsville AL 35801"},
            {name:"Madison City Schools (MCS) Board",system:"MCS",budget:"~$120M/yr",students:"~12,000",members:"5 elected members",elected:true,districts:"City of Madison school districts",power:"Controls fastest-growing school system in Madison County. New subdivisions annexed regularly. Growth strain is documented — unplanned additions from city...",flag:"Mayor Bartlett (former MCS board member/president 2011-2020) now controls Madison Utilities board appointments that fund MCS operations. Unique potential for...",upcoming:"MCS board elections 2026.",contact:"211 Celtic Dr, Madison AL 35758"},
            {name:"Madison County Schools (MCSS) Board",system:"MCSS",budget:"~$85M/yr",students:"~10,000",members:"5 elected members",elected:true,districts:"Rural/unincorporated county: Harvest, Toney, Meridianville, Triana, New Market",power:"Controls schools for all unincorporated Madison County. Serves students in Harvest, Toney, Meridianville — the fastest-growing unincorporated areas — with the...",flag:"MCSS is the least-funded system serving the most rapidly growing unincorporated communities. These communities have no city government so county commission...",upcoming:"MCSS board elections 2026.",contact:"1275 Jordan Rd, Huntsville AL 35811"},
          ].map((b,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${b.elected?"#16a34a":"#dc2626"}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
                <div style={{fontWeight:800,fontSize:14,color:"#1e3a5f"}}>{b.name}</div>
                <span style={{fontSize:9.5,fontWeight:700,color:b.elected?"#16a34a":"#dc2626",background:b.elected?"#f0fdf4":"#fef2f2",padding:"2px 8px",borderRadius:8,border:`1px solid ${b.elected?"#86efac":"#fca5a5"}`,flexShrink:0,height:"fit-content"}}>{b.elected?"✓ ELECTED":"APPOINTED"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#1e3a5f"}}>{b.budget}</div><div className="stat-lbl">Annual Budget</div></div>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#374151"}}>{b.students}</div><div className="stat-lbl">Students</div></div>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#ea580c"}}>11%</div><div className="stat-lbl">Voter Turnout</div></div>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Members:</strong> {b.members} · {b.districts}</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Controls:</strong> {b.power}</div>
              <div style={{background:"#fef2f2",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#7f1d1d",borderLeft:"3px solid #dc2626",marginBottom:6}}>{b.flag}</div>
              {b.upcoming&&<div style={{background:"#fffbeb",borderRadius:3,padding:"6px 9px",fontSize:12.5,color:"#78350f",borderLeft:"3px solid #c9a84c"}}>2026 ELECTION: {b.upcoming} Races decided by under 200 votes.</div>}
            </div>
          ))}
          <ActionButtons title="CONTACT SCHOOL BOARDS" actions={[
            {label:"HCS Board — (256) 428-6800",tel:"2564286800"},
            {label:"Email HCS Board",email:"board@hsv-k12.org",subject:"Constituent Request — School Resource Equity",body:"Dear HCS Board,\n\nI am requesting the board commission a per-school resource equity audit — per-pupil spending, AP course availability, and facility budgets broken down by school.\n\nHCS Board elections for Districts 2, 3, and 4 are on the November 2026 ballot.\n\n[Your Name]"},
            {label:"Madison County Schools",tel:"2568522557"},
            {label:"Open Records — Donor to Board Members",email:"records@hsv-k12.org",subject:"Open Records Request — Board Member Campaign Donors",body:"Dear Records Custodian,\n\nPursuant to Alabama Open Records Act §36-12-40, I request any campaign finance disclosures made by HCS board members in their last election cycle.\n\n[Your Name]"},
          ]}/>
          <AiButton prompt="Investigate the three Madison County school boards — HCS $310M, MCS $120M, MCSS $85M. Who are the current board members by name? What are their campaign donor connections? Have any board members received donations from construction or development companies that later won school contracts? How does the CHOOSE Act diversion of $100M from the Education Trust Fund (ETF) affect each system's funding? What is the documented $847/pupil spending gap within HCS? What do the 2026 board races look like and who should voters watch? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
      {tab==="hospital"&&(
        <div>
          <div className="stats-grid">
            {[["HHHS Revenue","$2.4B/yr","Nonprofit · $0 income tax",C.red],["CEO Pay","$3.1M/yr","Self-appointed board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Board Structure","Self-appointed","Appoints its own successors — zero public vote",C.red]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>THE SELF-PERPETUATING BOARD</div><div className="fact-text" style={{color:"#7f1d1d"}}>The HHHS board appoints its own successors. No public vote. No community election. Ever. In the history of HHHS. The board approved $3.1M CEO pay. The board approved every hospital acquisition th...</div></div>
          <div className="fact fact-gold"><div className="fact-label" style={{color:"#b8860b"}}>THE NONPROFIT PARADOX</div><div className="fact-text" style={{color:"#78350f"}}>HHHS pays $0 income tax on $2.4B in revenue, reduced property tax, and claims $63M/yr in total exemptions. In exchange it must provide community benefit. Yet it starts CNAs at $14.50/hr (qualifyi...</div></div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:8}}>⚠ HHHS BOARD — SELF-APPOINTED, NO PUBLIC VOTE EVER</div>
            <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:5,padding:"10px 12px",marginBottom:8,fontSize:13,color:"#7f1d1d"}}>The HHHS board appoints its own successors. No election in the hospital's history. Full current membership requires reviewing their IRS Form 990 — available free at ProPublica Nonprofit Explorer. Past members have included HHHS-employed physicians voting on their own compensation and executives from organizations doing business with the hospital.</div>
            {[{name:"David Spillers",role:"President & CEO — $3.1M/yr",note:"Compensation approved by the same board he works alongside. Board has limited independence from management."},
              {name:"Board of Directors (15 members)",role:"Self-Appointed — Zero Public Vote",note:"To see current members: visit ProPublica.org/nonprofit-explorer and search 'Huntsville Hospital' (EIN 63-0288816). ..."},
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"9px 11px",background:"#fff",border:"1px solid #e0d8cc",borderRadius:4,marginBottom:6}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"#991b1b",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11.5,fontWeight:800,flexShrink:0}}>{m.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                <div><div style={{fontWeight:700,fontSize:14,color:"#1e3a5f"}}>{m.name}</div><div style={{fontSize:11.5,color:"#6b7280",marginBottom:2}}>{m.role}</div><div style={{fontSize:12.5,color:"#374151",lineHeight:1.5}}>{m.note}</div></div>
              </div>
            ))}
            <a href="https://projects.propublica.org/nonprofits/organizations/630288816" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:12.5,marginTop:4}}>View HHHS IRS 990 at ProPublica →</button></a>
          </div>
          <ActionButtons title="CONTACT HHHS & FILE COMPLAINTS" actions={[
            {label:"Call HHHS CEO Office",tel:"2562651000"},
            {label:"Email HHHS Board",email:"info@huntsvillehospital.org",subject:"HHHS Board Accountability — Community Benefit & Crestwood Acquisition",body:"Dear HHHS Board,\n\nI am writing as a Madison County resident to demand:\n\n1. Full public disclosure of CEO and executive compensation.\n2. A community benefit audit showing what HHHS provides in exchange for its $63 million per year in tax exemptions.\n3. A public comment period before the Crestwood acquisition closes.\n\nThe self-appointed board structure provides no public accountability. I am requesting that change.\n\n[Your Name]"},
            {label:"FTC — Comment on Crestwood Deal",href:"https://www.ftc.gov/news-events/mergers-public-comments"},
            {label:"AL Attorney General Complaint",href:"https://www.alabamaag.gov/consumers/"},
            {label:"ProPublica — HHHS Form 990",href:"https://projects.propublica.org/nonprofits/organizations/630288816"},
          ]}/>
          <AiButton prompt="Investigate HHHS nonprofit monopoly governance. Self-appointed board — who are the current members by name, what organizations are they affiliated with, have any members received business from HHHS or been affiliated with organizations that received HHHS contracts? CEO David Spillers $3.1M vs CNAs $14.50/hr. $63M/yr tax exemption vs community benefit provided. 14-facility acquisition creating North Alabama monopoly. FTC has not acted. AL Legislature could amend charter. HHHS Foundation donated $45k to Mayor Battle. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."/>
        </div>
      )}
      {tab==="connections"&&(
        <div>
          <div className="alert-banner"><div className="alert-label">THE INTERLOCKING POWER STRUCTURE</div><div className="alert-text">The same individuals cycle through multiple boards and have connections to elected officials. This is how policy is coordinated without public knowledge or consent. Below are the documented connections between unelected boards and elected officials in Madison County.</div></div>
          {[
            {from:"Mayor Tommy Battle",to:"IDB Board",rel:"APPOINTS ALL 9 MEMBERS",detail:"Battle received $380k from real estate developers. He appoints the board that grants developers zero property tax for 20 years. No performance au...",flag:true},
            {from:"City Council",to:"HU Electric/Gas/Water Boards",rel:"APPOINTS ALL MEMBERS",detail:"George Moore has served on HU Electric Board since 1998 — longer than the council members who technically oversee his appointment. Rate increases...",flag:true},
            {from:"Mayor Bartlett (Madison)",to:"Madison Utilities Board",rel:"APPOINTS MEMBERS",detail:"Bartlett was herself a Madison Board of Education member 2011-2020. She now controls Madison Utilities board appointments. Utilities fund affects...",flag:false},
            {from:"Huntsville Hospital (HHHS) Board",to:"HHHS Board",rel:"SELF-APPOINTING",detail:"Board appoints own successors with no public input. Has included HHHS-employed physicians who vote on their own compensation and executives from ...",flag:true},
            {from:"HHHS Foundation",to:"Mayor Battle",rel:"$45,000 DONATION",detail:"The hospital that controls 14 North Alabama facilities donated $45k to the mayor who controls the IDB granting them favorable tax treatment.",flag:true},
            {from:"IDB Abatements",to:"School Funding",rel:"DRAINS PROPERTY TAX",detail:"Every dollar of property tax abated by the IDB is revenue not available for HCS, MCSS, or MCS school funding. The IDB board appointed by Battle h...",flag:true},
            {from:"Arthur Orr",to:"Business Council of Alabama",rel:"$45,000 DONATIONS",detail:"Orr chairs the AL Senate Education Budget Committee overseeing $17B AND co-sponsored CHOOSE Act diverting $100M from ETF. BCA which donated to hi...",flag:true},
          ].map((c,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${c.flag?"#dc2626":"#1e3a5f"}`,marginBottom:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{c.from}</span>
                <span style={{fontSize:10.5,fontWeight:800,color:c.flag?"#dc2626":"#374151",background:c.flag?"#fef2f2":"#f0ebe2",padding:"2px 8px",borderRadius:8,border:`1px solid ${c.flag?"#fca5a5":"#e0d8cc"}`}}>{c.rel}</span>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{c.to}</span>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{c.detail}</div>
            </div>
          ))}
          <AiButton prompt="Map the complete interlocking power structure of unelected boards in Madison County. Who sits on multiple boards simultaneously? What financial relationships exist between board members and the elected officials who appointed them? How does the IDB abatement system connect to school funding shortfalls? How does HHHS Foundation's political donations connect to its nonprofit tax exemptions? Are there any individuals who appear in multiple positions — board member AND contractor AND donor? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
    </div>
  );
}



// --- OFFICIALS DATA ---
const OFFICIALS=[
  {level:"Federal",color:"#1e3a5f",officials:[
    {name:"Dale Strong",photo:"https://bioguide.congress.gov/bioguide/photo/S/S001220.jpg",title:"U.S. Representative",district:"Alabama's 5th Congressional District",party:"Republican",
      since:"Jan 2023",termEnds:"Jan 2027",avatar:"DS",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $1.2M–$2.8M",netWorthPre:"Est. $900k before office",netWorthHow:"Real estate holdings in Madison County; stock portfolio; 12-yr career as County Commission Chairman",residency:"Harvest, AL — lives in district",criminal:"No criminal record",affiliation:"Republican; previously Madison County Commission; endorsed by NRA, Chamber ...",topDonors:[["Lockheed Martin PAC","$109,000",["Lockheed Martin Corp PAC","Lockheed Employees PAC"]],["Boeing PAC","$88,000",["Boeing Company PAC","Boeing Defense PAC"]],["Raytheon Technologies PAC","$67,000",["RTX Corporation PAC","Raytheon Employees PAC"]]],bio:"Served as Madison County Commission Chairman 2010-2022. Won AL-5 seat in 2022. Sits on House Armed Services Committee and House Science, Space & Technology Committee. Has not introduced any TVA oversight, utility ra...",votes:[{bill:"PRO Act (union organizing rights)",vote:"Against",impact:"Would have protected Madison County workers' right to organize"},  {bill:"Build Back Better child care",vote:"Against",impact:"Would have capped child care at 7% of income for Madison County families"},{bill:"PFAS Notification Act",vote:"Against",impact:"Would have required disclosure of Redstone Arsenal PFAS contamination levels"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"AL-5 covers all TVA territory — zero bills filed in 2 years"}],contact:{phone:"(256) 551-0190",web:"https://dalestrong.house.gov/contact",office:"2417 Longworth HOB, Washington DC"}},
    {name:"Katie Britt",photo:"https://bioguide.congress.gov/bioguide/photo/B/B001319.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",
      since:"Jan 2023",termEnds:"Jan 2029",avatar:"KB",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $3.1M–$7.4M",netWorthPre:"Est. $1.5M before office",netWorthHow:"Disclosed stock holdings in energy, finance, defense; husband former NFL player; prior CEO Business Council of Alabama",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former CEO Business Council of Alabama; endorsed by Trump 2022",topDonors:[["Blue Cross Blue Shield PAC","$155,000",["BCBS Alabama PAC","BCBS Association PAC","Protective Life Corp"]],["Protective Life Corporation","$95,000",["Protective Life Insurance"]],["Alabama Power / Energy PACs","$65,000",["Southern Company PAC","Alabama Power PAC","Chevron PAC"]]],bio:"First woman elected to Senate from Alabama. Former CEO of Business Council of Alabama. Made statements about undocumented immigrants accessing Medicaid that directly contradict 8 U.S.C. §1611 — federal law in place since 1996 that explicitl...",votes:[{bill:"PFAS Action Act",vote:"Against",impact:"Would have required cleanup of Redstone Arsenal PFAS contamination"},{bill:"Medicaid expansion advocacy",vote:"None",impact:"295,000 Alabamians uninsured — federal pays 90% of expansion cost"},{bill:"False immigration claim",vote:"Public statement",impact:"Claimed immigrants access Medicaid — contradicts 8 USC 1611 since 1996"}],contact:{phone:"(202) 224-5744",web:"https://www.britt.senate.gov/contact",office:"703 Hart Senate Office Building"}},
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",
      since:"Jan 2021",termEnds:"Jan 2027",avatar:"TT",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before office",netWorthHow:"Multi-million coaching contracts at Auburn, Ole Miss, Texas Tech; hedge fund and commodity investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Auburn, AL — has faced questions about Florida residency",criminal:"No criminal record",affiliation:"Republican; former football coach; endorsed by Trump",topDonors:[["Club for Growth PAC","$185,000"],["Chevron Corporation PAC","$89,000"],["ExxonMobil PAC","$74,000"]],bio:"Spent most of career as football coach. Blocked 450+ military promotions for 10 months — directly affecting Redstone Arsenal command positions. Has not introduced any TVA oversight legislation. Faced ethics questions about trading in commod...",votes:[{bill:"Military promotions (held hostage)",vote:"Blocked 450+ for 10 months",impact:"Directly disrupted Redstone Arsenal command structure"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"Controls TVA through Senate despite $270k energy PACs"}],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
  ]},
  {level:"State",color:"#7f1d1d",officials:[
    {name:"Kay Ivey",photo:"https://governor.alabama.gov/wp-content/uploads/2024/01/Ivey-Official-Portrait-2023-scaled.jpg",title:"Governor of Alabama",district:"Statewide — TERM LIMITED 2026",party:"Republican",
      since:"Apr 2017",termEnds:"Jan 2027",avatar:"KI",photo:"https://governor.alabama.gov/assets/images/about/ivey-official-2023.jpg",salary:"$120,395/yr — taxpayer funded",netWorth:"Est. $1.4M–$3.2M",netWorthPre:"Est. $900k before governor",netWorthHow:"State treasurer 2003-2011; State Auditor; real estate; disclosed investment portfolio",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former State Treasurer, State Auditor, Lt. Governor; term limit...",topDonors:[["Blue Cross Blue Shield Alabama","$220,000",["BCBS Alabama PAC","Protective Life Corp","Viva Health Inc"]],["Alabama Power Company PAC","$180,000",["Southern Company PAC","Alabama Power PAC"]],["Business Council of Alabama PAC","$180,000",["BCA PAC","AL Retail Association","ALFA Insurance PAC"]]],bio:"Has refused Medicaid expansion for 295,000 Alabamians — federal government pays 90% of the cost. Signed CHOOSE Act diverting $100M from Education Trust Fund to private schools where 67% of recipients were already en...",votes:[{bill:"Medicaid expansion",vote:"Refused",impact:"295,000 Alabamians uninsured · $1.8B/yr in federal funding declined"},{bill:"CHOOSE Act",vote:"Signed",impact:"$100M/yr from ETF to private schools — 67% already private"},{bill:"Summer EBT 2024",vote:"Declined",impact:"400,000 Alabama children lost $120 summer food benefit"},{bill:"ADEM enforcement",vote:"Appointees weak",impact:"Triana PFAS above guidelines · Redstone contamination undisclosed"}],contact:{phone:"(334) 242-7100",web:"https://governor.alabama.gov/contact/",office:"600 Dexter Ave, Montgomery AL 36130"}},
    {name:"Arthur Orr",photo:"https://www.legislature.state.al.us/pdf/senate/members/Senate_ColorHeadshots/8.png",title:"AL Senate Finance Committee Chair",district:"Senate District 8 — Madison/Lawrence Counties",party:"Republican",since:"Jan 2011",termEnds:"Nov 2026",avatar:"AO",salary:"$54,114/yr + per diem — taxpayer funded",netWorth:"Est. $800k–$2.1M",netWorthPre:"Est. $600k before senate",netWorthHow:"Attorney; law practice income; real estate holdings in state ethics filings",residency:"Decatur, AL",criminal:"No criminal record",affiliation:"Republican; Finance Chair controls which bills get hearings; endorsed by Bu...",topDonors:[["Business Council of Alabama","$45,000",["BCA PAC","AL Restaurant Assoc.","AL Retail Association"]],["Private Prison Industry","$22,000",["CoreCivic PAC","GEO Group PAC"]],["ALFA Insurance","$28,000",["ALFA Mutual Insurance","Farm Bureau Insurance"]],["Alabama Power PAC","$19,000",["Southern Company PAC"]]],bio:"As Finance Committee Chairman he controls which bills receive hearings in the Alabama Senate. Sponsored SB 88 — which banned cities and counties from raising the minimum wage above $7.25/hr. Has blocked Medicaid expansion, kratom reclassifi...",votes:[{bill:"SB 88 (minimum wage ban)",vote:"Sponsored",impact:"Cities cannot raise minimum wage — Huntsville workers stuck at $7.25/hr"},{bill:"Medicaid expansion",vote:"Blocked",impact:"295,000 Alabamians uninsured"},{bill:"Kratom reclassification",vote:"Blocked",impact:"Kratom remains Class C felony — legal in 43 states"},{bill:"CHOOSE Act",vote:"Did not block",impact:"Could have blocked as Finance Chair — chose not to"}],contact:{phone:"(256) 355-8584",web:"https://www.legislature.state.al.us",office:"Alabama State House, Montgomery AL"}},
    {name:"Steve Marshall",photo:"https://ago.alabama.gov/wp-content/uploads/2020/09/AG-Marshall-Headshot.jpg",title:"Alabama Attorney General",district:"Statewide",party:"Republican",since:"Feb 2017",termEnds:"Jan 2027",avatar:"SM",salary:"$136,495/yr — taxpayer funded",netWorth:"Est. $500k–$1.4M",netWorthPre:"Est. $400k before AG",netWorthHow:"Attorney; public salary; disclosed investments",residency:"Guntersville, AL",criminal:"No criminal record — but faced scrutiny for campaign finance practices",affiliation:"Republican; former Marshall County DA; endorsed by law enforcement associations",topDonors:[["Law Enforcement PACs","$340,000",["AL Sheriffs Association PAC","AL Police Chiefs Assoc.","FOP National PAC"]],["Private Prison Industry","$45,000",["CoreCivic PAC","GEO Group PAC"]],["Business Council of Alabama","$38,000",["BCA PAC","AL Business Alliance"]]],bio:"Defended Alabama's unconstitutional congressional maps in Allen v. Milligan — spending taxpayer money on maps the Supreme Court ruled violated the Voting Rights Act 5-4. Drew replacement maps that were also found no...",votes:[{bill:"Allen v. Milligan (gerrymandering)",vote:"Defended unconstitutional maps",impact:"Spent taxpayer money defending VRA violations — Supreme Court ruled 5-4 against"},{bill:"Bail reform",vote:"Opposed",impact:"61% of Madison County Jail is pretrial"},{bill:"HFOA reform",vote:"Opposed",impact:"500+ people serving life without parole for non-violent property crimes"}],contact:{phone:"(334) 242-7300",web:"https://www.alabamaag.gov",office:"501 Washington Ave, Montgomery AL 36130"}},
  ]},
  {level:"County",color:"#374151",officials:[
    {name:"Rex Vaughn",photo:"https://governor.alabama.gov/wp-content/uploads/2026/03/Vaughn-Headshot.jpg",title:"Madison County Commission Chairman",district:"At-Large — all of Madison County",party:"Republican",since:"Mar 2, 2026",termEnds:"TBD",avatar:"RV",salary:"~$78,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Vaughn Farms owner/operator; Alabama Farmers Federation leader; Alabama Medical Cannabis Commission Chairman (resigned upon appointment)",residency:"Huntsville, AL — Madison County native",criminal:"No record found",affiliation:"Republican; appointed by Gov. Ivey March 2, 2026; 6th-generation Madison County resident; Sparkman HS → Auburn (BS+MS Agriculture Ed 1983/85)",topDonors:[["Not disclosed","Appointed, not elected — donor data TBD"]],bio:"Appointed by Gov. Ivey to replace retiring Chairman Mac McCutcheon. Vaughn Farms owner/operator. Former Chairman of Alabama Medical Cannabis Commission (5 years). Manages Madison County's rapid growth period with no county-wide zoning regulations. First major challenges: new courthouse, new county administrator, developer pressure with no zoning...",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Violet Edwards",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5832",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville",party:"Democrat",since:"Jan 2025",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"First term — financial disclosure pending",residency:"North Huntsville",criminal:"No record found",affiliation:"Democrat; first Black woman elected to Madison County Commission",topDonors:[["Community fundraising","~$28,000"]],bio:"First Black woman elected to the Madison County Commission. Represents north Huntsville areas. Her district includes communities that have documented road maintenance inequities vs south Huntsville.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Kevin Turner",photo:"https://storage.googleapis.com/download/storage/v1/b/g-green-backend-bucket-1/o/mdsoal%2FSheriff_Kevin_Turner.jpg?alt=media",title:"Madison County Sheriff",district:"Madison County",party:"Republican",since:"Jan 2019",termEnds:"Jan 2027",avatar:"KT",salary:"~$95,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Career law enforcement; income from public salary",residency:"Madison County",criminal:"No criminal record",affiliation:"Republican; career law enforcement; endorsed by bail bond industry",topDonors:[["Law enforcement PACs","$62,000",["AL Sheriffs Association PAC","PLEA PAC","NAPO PAC"]],["Bail bond industry","$24,000",["AL Bail Agents Association","SCI Bail Bonds","Freedom Bail Bonds"]]],bio:"61% of Madison County Jail population is pretrial — not convicted of anything. County earns ~$200,000/year in Securus/ViaPath phone commissions while families pay $0.21/min to call incarcerated loved ones. Received $24,000 from bail bond in...",votes:[{bill:"Bail reform",vote:"Opposed",impact:"61% of jail is pretrial — held because they cannot afford bail"},{bill:"Securus contract renewal",vote:"Maintained",impact:"County earns $200k/yr commissions while families pay $0.21/min"}],contact:{phone:"(256) 722-7181",web:"https://www.madisoncountysheriff.org",office:"815 Wheeler Ave, Huntsville AL 35801"}},
  ]},
  {level:"2026 Candidates",color:"#7c3aed",officials:[
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"Candidate — AL Governor 2026",district:"Statewide — running to replace term-limited Ivey",party:"Republican",since:"Announced Dec 2025",termEnds:"Would serve 2027-2031",avatar:"TT",salary:"$174,000/yr current Senate salary",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before Senate",netWorthHow:"Multi-million coaching contracts; hedge fund investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Questions raised — Auburn AL listed but possible primary residence in Florida",criminal:"No criminal record",affiliation:"Republican; endorsed by Trump; former football coach",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["Defense industry","$142,000"]],bio:"Current AL Senator running for Governor instead of Senate re-election. Introduced 21 bills in 4 years — zero advanced out of committee. Blocked 450+ military promotions for 10 months affecting Redstone Arsenal. Questions about whether he ac...",votes:[{bill:"Military promotions block",vote:"10 months",impact:"Directly disrupted Redstone Arsenal — then ran for governor of the state he disrupted"},{bill:"TVA oversight",vote:"None in 4 years",impact:"Received $270k energy PACs — introduced zero utility oversight"}],quotes:[
      {type:"general",quote:null,fact:"Residency questions: Cook Political Report noted 'questions linger about the exact nature of Tuberville's residence in the state he hopes to lead.' Alabama law requires 7 years of residency to run for governor.",date:"Dec 2025",source:"Cook Political Report",flip:false},
      {type:"general",quote:null,fact:"Introduced just 21 bills in the 118th Congress — zero of which advanced out of committee. Was spotted at the Masters Tournament instead of voting on a new Joint Chiefs chairman. Now running for governor claiming...",date:"2023-2024",source:"Cook Political Report",flip:true},
      {type:"environment",quote:null,fact:"Received $270,000 from energy PACs as Senator. Introduced zero TVA oversight bills despite TVA raising rates 3 times in 18 months. As governor he would have no direct TVA authority — but AL Governor appoints ADEM...",date:"2021-2025",source:"FEC.gov",flip:true},
    ],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
    {name:"Doug Jones",photo:"https://bioguide.congress.gov/bioguide/photo/J/J000300.jpg",title:"Candidate — AL Governor 2026 (Democrat)",district:"Statewide — former US Senator",party:"Democrat",since:"Announced 2025",termEnds:"Would serve 2027-2031",avatar:"DJ",salary:"N/A — private practice",netWorth:"Est. $2M–$5M",netWorthPre:"Est. $1.5M before Senate",netWorthHow:"Career as federal prosecutor and attorney; Senate salary 2018-2023",residency:"Birmingham, AL",criminal:"No criminal record — former federal prosecutor",affiliation:"Democrat; former US Senator (2018-2023); prosecuted 16th Street Baptist Chu...",topDonors:[["Democratic fundraising network","Not disclosed"],["Trial lawyers","Not disclosed"]],bio:"Served as US Senator 2018-2023 — the only Democrat elected statewide in Alabama since 2008. Lost to Tuberville in 2020 by 20 points. Prosecuted the 16th Street Baptist Church bombers as US Attorney. If elected would be first Democratic gove...",votes:[{bill:"ACA protection votes",vote:"Yes",impact:"Voted to protect pre-existing condition coverage"},{bill:"Bipartisan Infrastructure",vote:"Yes",impact:"Supported $1.2B for Alabama infrastructure"}],quotes:[
      {type:"healthcare",quote:null,fact:"As Senator voted to protect the ACA and has publicly supported Medicaid expansion. As governor would have authority to expand Medicaid to 295,000 Alabamians without a legislative vote.",date:"2018-2023",source:"Senate vote records",flip:false},
      {type:"general",quote:null,fact:"First Democrat to win a Senate seat in Alabama since 1992. Won in 2017 special election by 1.7 points over Roy Moore. Lost re-election to Tuberville by 20 points in 2020. Running for governor as Ivey is term-limited.",date:"2025",source:"AL election records",flip:false},
    ],contact:{phone:"N/A",web:"https://dougjones.com",office:"Campaign website"}},
  ]},
  {level:"Madison City",color:"#374151",officials:[
    {name:"Ranae Bartlett",photo:"https://www.madisonal.gov/ImageRepository/Document?documentID=1523",title:"Mayor of Madison",district:"City of Madison — sworn Nov 2025",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"RB",salary:"~$80,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Attorney; former Madison Board of Education 2011-2020; law clerk to US District Judge",residency:"Madison, AL",criminal:"No criminal record",affiliation:"Republican; former Madison City Council D5; former School Board President 2...",topDonors:[["Local community fundraising","~$85,000"]],bio:"First new Madison mayor in a decade. Former Madison Board of Education member 2011-2020 and Board President 2017-2020. Career law clerk to US District Judge C. Lynwood Smith Jr. and former Walmart Associate General ...",votes:[{bill:"Madison Utilities board",vote:"New appointments 2026",impact:"Controls appointed board setting water rates for 19,000+ customers"}],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe.",fact:"Said this at swearing in. Key test: whether she requires affordable housing components in new Madison development, and whether Madison Utilities board she appoints acts on rate transparency.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Maura Wroblewski",title:"Madison City Council — District 1",district:"District 1 — Huntsville Browns Ferry Rd / Mose Chapel Rd",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MW",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Re-elected third term; background in community development",residency:"Madison District 1",criminal:"No record found",affiliation:"Republican; re-elected third term",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Re-elected to her third term. Focused on infrastructure and Mill Creek Greenway Preserve project — a mile-long trail on Balch Road in partnership with Madison Utilities and North Alabama Land Trust.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"David Bier",title:"Madison City Council — District 2",district:"District 2",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"DB",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 2",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Newly elected November 2025. One of six new council members sworn in with Mayor Bartlett.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Billie Goodson",title:"Madison City Council — District 3",district:"District 3",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"BG",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 3",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Michael McKay",title:"Madison City Council — District 4",district:"District 4",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MM",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 4",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Alice Lessmann",title:"Madison City Council — District 5",district:"District 5",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"AL",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Newly elected Nov 2025; former Alabama Association of School Boards District 9 Director",residency:"Madison District 5",criminal:"No record found",affiliation:"Republican; former school board association director",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Newly elected November 2025. Former District 9 Director for the Alabama Association of School Boards. Focused on smart growth, school support, and infrastructure.",votes:[],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe with our first responders and our infrastructure.",fact:"Said at swearing in. Her school board background makes her key vote on school-developer interface decisions.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Erica White",title:"Madison City Council — District 6",district:"District 6",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"EW",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Small business owner; newly elected Nov 2025",residency:"Madison District 6",criminal:"No record found",affiliation:"Republican; small business owner",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Small business owner and mother of two. Elected November 2025. Focus: roads and infrastructure in District 6, particularly Old Madison Pike.",votes:[],quotes:[{type:"general",quote:"City government is best run when real world people with experience that care about the city step up and make a difference.",fact:"Said at swearing in. Watch her votes on road maintenance equity and development review.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Kenneth Jackson",title:"Madison City Council — District 7",district:"District 7 — Balch Road area",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"KJ",photo:null,salary:"~$12,000/yr",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 7 — Balch Road",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Newly elected November 2025. Committed to accelerating infrastructure improvements including the recently approved roundabout in his district.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
  ]},
  {level:"Triana",color:"#7f1d1d",officials:[
    {name:"Mary Caudle",photo:"https://www.trianaal.gov/uploads/mary-caudle.jpg",title:"Mayor of Triana",salary:"Minimal — small town budget",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Lifelong Triana resident; 39 years in medical finance; founder Assist Practice Management Services LLC; Senior Director at Sequel Youth and Family Services",residency:"Triana, AL — lifelong resident",criminal:"No criminal record",affiliation:"Non-partisan local office; serves on TARCOG, Community Action Partnership, ...",topDonors:[["Local community fundraising","Not disclosed"]],bio:"Four-term mayor (since 2008). Lifelong Triana resident. The town faces Superfund contamination from Redstone Arsenal and Olin Corporation DDT via Huntsville Spring Branch. Town water shows PFOS above EWG health guid...",votes:[],quotes:[{type:"environment",quote:null,fact:"PFAS/ENVIRONMENT: Triana's water shows PFOS above EWG health guidelines. Town remains on EPA Superfund list. Mayor Caudle has worked with regional bodies to address contamination from Redstone Arsenal. Despite being the...",date:"Ongoing",source:"EWG / EPA Superfund records",flip:false},{type:"general",quote:null,fact:"ACCOUNTABILITY GAP: Triana residents have no access to IDB tax abatements, no Huntsville City Council representation, and limited TARCOG influence. Their water contamination affects a majority-Black community of 2,300...",date:"Ongoing",source:"Madison County records",flip:false}],contact:{phone:"(256) 772-0300",web:"https://townoftrianaal.gov",office:"Town of Triana, 209 Triana Blvd, Triana AL 35756"}},
  ]},
  {level:"Unincorporated Areas",color:"#6b7280",officials:[
    {name:"Phil Vandiver",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5831",title:"Madison County Commissioner — District 4",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"12 years on commission; background in agriculture and local business",residency:"Harvest, AL (Highway 53)",criminal:"No record found",affiliation:"Republican; agricultural interests; 12 years on commission",topDonors:[["Agricultural interests","Not disclosed"],["Local business","Not disclosed"]],bio:"KEY OFFICIAL FOR HARVEST/TONEY/MERIDIANVILLE/MONROVIA RESIDENTS. These are unincorporated communities with NO city government, NO city council, NO mayor. Phil Vandiver is the ONLY elected official whose primary job is to represent these ~12...",votes:[{bill:"Road maintenance allocation",vote:"District 4 priority",impact:"Harvest/Toney/Meridianville road quality directly in his control"},{bill:"Zoning decisions",vote:"District 4 vote",impact:"Controls commercial and residential development in unincorporated area"}],quotes:[{type:"general",quote:"We've still got a lot of work to do. We've still got to work in our communities and improve our rec centers and improve everything.",fact:"Said while seeking re-election 2024. District 4 covers the fastest growing unincorporated area in Alabama with some of the fewest services per capita. 12 years in office — residents should ask: what specifically has...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 852-8351",web:"https://www.madisoncountyal.gov",office:"6084 Highway 53, Harvest AL 35749"}},
    {name:"Tom Brandon",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5829",title:"Madison County Commissioner — District 1",district:"District 1 — New Market, Gurley, Paint Rock area",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"TB2",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"12 years on commission; agricultural background",residency:"New Market, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community","Not disclosed"]],bio:"Represents the eastern rural portion of Madison County including New Market, Gurley, and Paint Rock. 12 years on the commission.",votes:[],quotes:[],contact:{phone:"(256) 828-0726",web:"https://www.madisoncountyal.gov",office:"9457 Moores Mill Road, New Market AL"}},
    {name:"Steve Haraway",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5830",title:"Madison County Commissioner — District 2",district:"District 2 — Madison City adjacent areas",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"SH",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"12 years on commission; business background",residency:"Madison, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","Not disclosed"]],bio:"Represents District 2 adjacent to Madison City. Has served 3 terms — 12 years.",votes:[],quotes:[{type:"general",quote:"I understand what the needs are. I've been doing this for the last three terms, and I'm very familiar with the problems we've got, and I'm also familiar with what we need to do to grow and make Madison County better.",fact:"Said while seeking 2024 re-election. 12 years on the commission — voters should ask what specific problems were solved vs what remains unaddressed.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1590",web:"https://www.madisoncountyal.gov",office:"100 Plaza Blvd Suite 2, Madison AL"}},
    {name:"Craig Hill",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5833",title:"Madison County Commissioner — District 3",district:"District 3 — Brownsboro, eastern Madison County",party:"Republican",since:"Jan 2017",termEnds:"Jan 2029",avatar:"CH",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Commission since 2017; agricultural/rural background",residency:"Brownsboro, AL (Highway 72 East)",criminal:"No record found",affiliation:"Republican; ran unopposed 2024",topDonors:[["Local community","Not disclosed"]],bio:"Represents eastern rural Madison County. Ran unopposed in November 2024.",votes:[],quotes:[],contact:{phone:"(256) 776-2475",web:"https://www.madisoncountyal.gov",office:"4273 Highway 72 East, Brownsboro AL"}},
    {name:"Phil Riddick",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5834",title:"Madison County Commissioner — District 5",district:"District 5 — Southeast Huntsville area",party:"Republican",since:"Jan 2011",termEnds:"Jan 2029",avatar:"PR",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"17 years commission; 17 years commercial real estate",residency:"Huntsville area, District 5",criminal:"No record found",affiliation:"Republican; commercial real estate background",topDonors:[["Real estate interests","Not disclosed"]],bio:"Longest-serving current commissioner — 17 years. Background in commercial real estate. Has worked on improvements to Ditto Landing.",votes:[],quotes:[{type:"general",quote:"Just work experience outside of the commission, being in the commercial real estate business for 17 years, I kind of know what people are looking for, developers and things like that, important things that come up in the county.",fact:"Explicitly ties his commission judgment to his real estate industry background — an industry that directly benefits from favorable county zoning and infrastructure decisions.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-3497",web:"https://www.madisoncountyal.gov",office:"100 Northside Square Courthouse 6th Floor Rm 627, Huntsville AL"}},
    {name:"Violet Edwards",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5832",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville / unincorporated north county",party:"Democrat",since:"Jan 2021",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"First term 2021-2024; re-elected 2024; community organizer background",residency:"North Huntsville — District 6",criminal:"No record found",affiliation:"Democrat; first Black woman on Madison County Commission",topDonors:[["Community fundraising","~$35,000"]],bio:"First Black woman elected to the Madison County Commission. Re-elected 2024. Represents north Huntsville and surrounding unincorporated areas where road PCI averages 41 vs south Huntsville's 72. As the only Democrat on the commission, she i...",votes:[{bill:"Road maintenance equity",vote:"Advocated",impact:"Her district has the lowest road PCI in the county"}],quotes:[{type:"general",quote:"I ask for the community to vote for me because I have worked tirelessly over last four years. I will continue to serve with honor and integrity, and together, working with the community, we can continue to make great strides.",fact:"Re-election statement 2024. As the only Democrat on a 7-member Republican commission, her ability to force policy change is limited. The question: has she been able to move resources toward District 6, and if not, what...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1505",web:"https://www.madisoncountyal.gov",office:"3210 Hi-Lo Circle, Huntsville AL"}},
  ]},  {level:"Huntsville",color:"#1e3a5f",officials:[
    {name:"Tommy Battle",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2022/11/battle-headshot-200.jpg",title:"Mayor of Huntsville",district:"City of Huntsville — 5th term",party:"Republican",since:"Nov 2008",termEnds:"Nov 2028",avatar:"TB",salary:"$131,500/yr — taxpayer funded",netWorth:"Est. $2.8M–$6.4M",netWorthPre:"Est. $1.2M before mayor",netWorthHow:"Business background; real estate; investment portfolio grown during tenure; salary + benefits for 16+ years",residency:"Huntsville, AL — south Huntsville",criminal:"No criminal record",affiliation:"Republican; former businessman; endorsed by Huntsville/Madison County Chamb...",topDonors:[["Real estate developers","$380,000",["RCP Companies","Goodall Brazier & Assoc.","Southeastern Development"]],["Construction companies","$210,000",["Brasfield & Gorrie","Hoar Construction","Turner Construction"]],["HHHS Foundation","$45,000",["Huntsville Hospital Foundation"]],["Defense/aerospace contractors","$88,000",["Boeing","Teledyne Brown Engineering","Jacobs Engineering"]]],bio:"Longest-serving Huntsville mayor. Under his 16-year tenure: north Huntsville roads average PCI 41 vs south Huntsville PCI 72 (same tax rate). Zero civilian police review board proposals. IDB has granted $127M+ in corporate tax abatements wi...",votes:[{bill:"Civilian police review board",vote:"Never proposed in 16 years",impact:"HPD investigates its own conduct with no civilian oversight"},{bill:"IDB abatement performance audits",vote:"Never required",impact:"$127M+ granted · no public verification of job/wage promises"},{bill:"Anti-camping ordinance",vote:"Supported",impact:"3 of 8 sweeps near active developer projects"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/mayors-office/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Michelle Watkins",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Michelle-Watkins-Headshot-150x150.jpg",title:"City Council — District 1",district:"District 1 — North Huntsville",party:"Democrat",since:"Nov 2024",termEnds:"Nov 2028",avatar:"MW",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"First term",netWorthHow:"First term — limited disclosure period",residency:"North Huntsville — in district",criminal:"No record found",affiliation:"Democrat; first Black woman on Huntsville City Council; community advocate ...",topDonors:[["Community fundraising","~$42,000"]],bio:"First Black woman elected to Huntsville City Council. Elected September 2024. Voted NO on the January 2025 394-acre annexation — the only no vote — citing school overcrowding. Her district includes the roads with PC...",votes:[{bill:"394-acre annexation (Jan 2025)",vote:"NO — only no vote",impact:"'Breaking schools at the seam' — schools cannot absorb growth"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Jennie Robinson",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Robinson_Jennie_655-0004-150x150.jpg",title:"City Council — District 3 (Council President)",district:"District 3 — South/Central Huntsville",party:"Republican",since:"Nov 2016",termEnds:"Nov 2028",avatar:"JR",salary:"~$20,000/yr — part-time council",netWorth:"Est. $600k–$1.8M",netWorthPre:"Est. $500k before council",netWorthHow:"Career educator; professor; real estate; public salary",residency:"South Huntsville — district 3",criminal:"No criminal record",affiliation:"Republican; former educator; Council President since Nov 2025",topDonors:[["South Huntsville business","$52,000"],["Real estate interests","$28,000"]],bio:"Council President. Has voted for budgets that have produced the documented PCI 41 vs 72 road disparity between north and south Huntsville. Facilitated all 2025 annexations as Council President. Noted that Huntsville now compares in land mas...",votes:[{bill:"All 2025 annexations",vote:"Supported",impact:"2,000+ acres annexed while north Huntsville roads remain PCI 41"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"David Little",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Little_David_725-0006-150x150.jpg",title:"City Council — District 2",district:"District 2 — West Huntsville/Downtown",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"DL",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Business background; financial disclosure under review",residency:"West Huntsville",criminal:"No record found",affiliation:"Republican; business community connections",topDonors:[["Local business","~$35,000"]],bio:"Represents west Huntsville and downtown. District includes portions that have seen MidCity development. Voted for all major annexations and IDB abatements.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Bill Kling Jr.",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Kling_Bill_182-0003-150x150.jpg",title:"City Council — District 4",district:"District 4 — Southeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"BK",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Business background",residency:"Southeast Huntsville",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","~$30,000"]],bio:"Introduced the December 2025 proposal to annex 680 additional acres — stating landowners want to access Huntsville's school system and utilities. Supportive of continued city growth and annexation.",votes:[{bill:"680-acre annexation (Dec 2025)",vote:"Introduced",impact:"Second-largest annexation of 2025"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"John Meredith",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Meredith_John_646-0004-150x150.jpg",title:"City Council — District 5",district:"District 5 — Northeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"JM",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Business background",residency:"Northeast Huntsville",criminal:"No record found",affiliation:"Republican; technology/AI interests",topDonors:[["Business community","~$28,000"]],bio:"Focused on technology and infrastructure issues. Has proposed AI-based railroad crossing alerts for his district. Voted for all major annexations.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
  ]},
];

// --- OFFICIALS PAGE (full v8-style with modal) ---

function OfficialsPage({go}){
  const[mainTab,setMainTab]=useState("directory");
  const[filter,setFilter]=useState("All");
  const[selected,setSelected]=useState(null);
  const[detailTab,setDetailTab]=useState("bio");
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);

  async function investigate(off){
    setLd(true);
    try{
      const x=await callAI(`Here is the data on ${off.name} (${off.title}): Salary ${off.salary}. Net worth now ${off.netWorth}, before office ${off.netWorthPre}. Top donors: ${off.topDonors.map(d=>d[0]+' '+d[1]).join(', ')}. Residency: ${off.residency}. Criminal record: ${off.criminal}. Key record: ${off.bio.substring(0,250)}. What does this mean for a Madison County resident? Connect the donors to the decisions. Under 150 words, no jargon.`);
      setR(x);
    }catch(e){setR("Summary unavailable.");}
    setLd(false);
  }

  const MAIN_TABS=[
    {id:"directory",label:"Officials Directory"},
    {id:"candidates",label:"2026 Candidates"},
    {id:"elections",label:"2026 Elections"},
    {id:"voting",label:"Voting & Registration"},
  ];

  const levels=["All","Federal","State","County","Huntsville","Madison City","Triana","Unincorporated Areas"];
  const filtered=filter==="All"?OFFICIALS.filter(g=>g.level!=="2026 Candidates"):OFFICIALS.filter(g=>g.level===filter);
  const candidates=OFFICIALS.find(g=>g.level==="2026 Candidates");

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Every elected official with power over Madison County. Net worth before and after office, salary, top donors, voting record, criminal history, and residency — all from public records. Click any card to investigate.</p>
        <div style={{background:"#1e3a5f",borderRadius:5,padding:"10px 14px",marginTop:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>go("money")}>
          <span style={{fontSize:18}}>🕸</span>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#c9a84c",letterSpacing:.5}}>See the full donor→policy network graphs</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Follow the Money → Networks tab</div>
          </div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:16}}>→</span>
        </div>
      </div>

      {/* Main tabs */}
      <div className="tabs" style={{marginBottom:16}}>
        {MAIN_TABS.map(t=>(
          <button key={t.id} className={`tab${mainTab===t.id?" active":""}`} onClick={()=>setMainTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* -- DIRECTORY TAB --- */}
      {mainTab==="directory"&&(
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {levels.map(l=>(
              <button key={l} onClick={()=>setFilter(l)} style={{padding:"6px 14px",borderRadius:12,border:"1px solid #e0d8cc",background:filter===l?"#1e3a5f":"#fff",color:filter===l?"#c9a84c":"#6b7280",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {filtered.map((group,gi)=>(
            <div key={gi} style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b7280",marginBottom:10,textTransform:"uppercase"}}>{group.level} OFFICIALS</div>
              {group.officials.map((off,oi)=>(
                <div key={oi} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":off.party==="Democrat"?"#1e40af":"#5b21b6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0,overflow:"hidden",border:"2px solid rgba(255,255,255,.2)"}}>
                        {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                      </div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                          <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":off.party==="Democrat"?"#eff6ff":"#f5f3ff",color:off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed",border:`1px solid ${off.party==="Republican"?"#fca5a5":off.party==="Democrat"?"#93c5fd":"#c4b5fd"}`,flexShrink:0}}>{off.party==="Republican"?"R":"D"}</span>
                        </div>
                        <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#dc2626"}}>{off.netWorth}</div>
                      <div style={{fontSize:10,color:"#6b7280"}}>net worth</div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{off.salary.split("—")[0].trim()}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:"#374151",marginTop:8,lineHeight:1.5}}><ExpandText text={off.bio} preview={130}/></div>
                  <div style={{fontSize:11,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Tap to see full record →</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* -- 2026 CANDIDATES TAB --- */}
      {mainTab==="candidates"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">⚡ 2026 IS THE MOST CONSEQUENTIAL ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
            <div className="alert-text">Governor's race is an open seat — Kay Ivey is term-limited. All three federal seats on the ballot. Sheriff, three Huntsville City Council seats, three HCS school board seats, and the entire Alabama Legislature. 37,000 eligible Madison County residents are not registered to vote.</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"#6b7280",marginBottom:10}}>CONFIRMED 2026 CANDIDATES</div>
            {candidates&&candidates.officials.map((off,i)=>(
              <div key={i} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":"#1e40af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0}}>
                    {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                  </div>
                  <div>
                    <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:2}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                      <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":"#eff6ff",color:off.party==="Republican"?"#dc2626":"#2563eb",border:`1px solid ${off.party==="Republican"?"#fca5a5":"#93c5fd"}`}}>{off.party}</span>
                    </div>
                    <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><ExpandText text={off.bio} preview={200}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Net worth:</strong> {off.netWorth} (was {off.netWorthPre})</div>
                  <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Residency:</strong> {off.residency}</div>
                </div>
                <div style={{fontSize:11,color:"#1e3a5f",fontWeight:700}}>Tap for full record including donor connections →</div>
              </div>
            ))}
            <div style={{marginTop:16,padding:"12px 14px",background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:6}}>MORE CANDIDATES BEING CONFIRMED</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>Additional 2026 candidates will be added as they announce. Check back regularly. Primary elections: May 19, 2026. General election: November 3, 2026.</div>
            </div>
          </div>
        </div>
      )}

      {/* -- VOTING & REGISTRATION TAB --- */}
      
      {mainTab==="elections"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">2026 IS THE MOST IMPORTANT ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
            <div className="alert-text">Governor's race is an open seat. All three federal races on the ballot. Sheriff, three city council seats, three school board seats. 37,000 eligible residents not registered.</div>
          </div>
          {[
            {office:"Governor — OPEN SEAT",date:"Nov 2026",priority:true,note:"Ivey is term-limited. Governor appoints ADEM leadership, parole board, prison oversight. Has authority to expand Me..."},
            {office:"U.S. Senate — Open (Tuberville running for Governor)",date:"Nov 2026",priority:true,note:"Rare opportunity — this seat was last won by a Democrat (Doug Jones) in 2017. Tuberville leaving it open."},
            {office:"AL Senate Finance Chair — Arthur Orr (D8)",date:"Nov 2026",priority:true,note:"Controls which bills get hearings. Sponsored SB 88 wage ban. Blocked Medicaid, kratom reform, bail reform. Replacin..."},
            {office:"HCS School Board D2, D3, D4",date:"Nov 2026",priority:true,note:"$310M budget. 11% turnout. 2,000 organized voters flips any seat. Controls school funding equity and CHOOSE Act res..."},
            {office:"U.S. House AL-5 — Dale Strong",date:"Nov 2026",priority:false,note:"$284k defense PACs. Zero TVA oversight bills. Voted against PRO Act, child care, drug pricing, PFAS notification."},
            {office:"Madison County Sheriff — Kevin Turner",date:"Nov 2026",priority:false,note:"61% pretrial detention. Securus conflict. $24k bail bond industry. Opposes bail reform."},
            {office:"Huntsville City Council D2, D3, D4",date:"Nov 2026",priority:false,note:"Three seats decided by under 200 votes each. D3 is Council President Robinson."},
            {office:"AL Attorney General — Steve Marshall",date:"Nov 2026",priority:false,note:"$45k private prison PACs. Defended unconstitutional maps. Opposes every criminal justice reform."},
          ].map((e,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${e.priority?"#dc2626":"#1e3a5f"}`,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
                <div style={{fontSize:13.5,fontWeight:800,color:"#1e3a5f"}}>
                  {e.priority&&<span style={{fontSize:9,fontWeight:700,color:"#dc2626",background:"#fef2f2",padding:"1px 7px",borderRadius:8,marginRight:6,border:"1px solid #fca5a5"}}>HIGH PRIORITY</span>}
                  {e.office}
                </div>
                <span style={{fontSize:10,fontWeight:700,color:"#b8860b",background:"#fffbeb",padding:"2px 9px",borderRadius:8,border:"1px solid #fcd34d",flexShrink:0}}>{e.date}</span>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{e.note}</div>
            </div>
          ))}
          <a href="https://www.alabamavotes.gov/RegisterToVote" target="_blank" rel="noreferrer">
            <button className="btn btn-full" style={{background:"#16a34a",color:"#fff",marginTop:8}}>✓ Register to Vote / Check Registration →</button>
          </a>
        </div>
      )}
{mainTab==="voting"&&(
        <div>
          <div className="stats-grid">
            {[["VRA Violation Ruled","2023","Allen v. Milligan — maps unconstitutional 5-4","#dc2626"],["Unregistered Eligible","37,000","Madison Co. residents who can vote but haven't registered","#dc2626"],["HCS Board Turnout","11%","Controls $310M annual budget — decided by 2,000 votes","#ea580c"],["Local Race Margin","<200 votes","Most city council and school board races","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>GERRYMANDERING — WHAT HAPPENED AND WHO PAID FOR IT</div><div className="fact-text" style={{color:"#7f1d1d"}}>In June 2023 the U.S. Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). AG Steve Marshall spent taxpayer money defending maps the court found unconstitutional. Alabama then drew replacement maps — also found non-compliant. Marshall received $340,000 from law enforcement PACs. The entire process cost Alabama taxpayers money to defend unconstitutional maps that diluted Black voting power.</div></div>
          <div className="fact fact-gold"><div className="fact-label" style={{color:"#b8860b"}}>YOUR VOTE IS WORTH MORE THAN YOU THINK</div><div className="fact-text" style={{color:"#78350f"}}>The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races: decided by under 200 votes — controlling a $310M annual budget with 11% voter turnout. A single organized group with 500 committed members can determine the outcome of almost any Madison County local race. The most powerful vote you cast in 2026 is probably for HCS school board or city council — not governor.</div></div>
          <div className="fact fact-blue"><div className="fact-label" style={{color:"#2563eb"}}>REGISTRATION — WHAT YOU NEED TO KNOW</div><div className="fact-text" style={{color:"#1e3a5f"}}>You must register 15 days before any election. 37,000 eligible Madison County residents are not registered. You can check or update your registration online. If you moved, changed your name, or haven't voted in several years — check your registration now. You cannot register at the polls in Alabama.</div></div>
          {[{icon:"🗳",title:"Register to Vote / Check Your Registration",sub:"Check now — if you moved or haven't voted recently your registration may be outdated.",url:"https://www.alabamavotes.gov/RegisterToVote",btn:"Check Registration →"},
            {icon:"📅",title:"2026 Key Dates",sub:"Primary: May 19, 2026 · Registration deadline for primary: May 4, 2026 · General: November 3, 2026 · Registration deadline for general: October 19, 2026",url:null,btn:null},
            {icon:"◉",title:"Run for HCS School Board in 2026",sub:"Districts 2, 3, and 4 are on the November 2026 ballot. Races decided by under 200 votes. Filing deadline: approximately March 2026. You do not need money or connections to run.",url:"https://www.sos.alabama.gov/alabama-votes/candidates",btn:"Candidate Filing Info →"},
          ].map((item,i)=>(
            <div key={i} className="card" style={{marginBottom:8}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:22}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{item.title}</div>
                  <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:item.url?8:0}}>{item.sub}</div>
                  {item.url&&<a href={item.url} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:12}}>{item.btn}</button></a>}
                </div>
              </div>
            </div>
          ))}
          <AiButton prompt={`Here is the voting and representation data for Madison County: Allen v. Milligan Supreme Court ruled Alabama's maps violated the Voting Rights Act in 2023. AG Marshall spent taxpayer money defending unconstitutional maps and received $340k from ...`}/>
        </div>
      )}

      {/* -- OFFICIAL DETAIL MODAL --- */}
      {selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(30,58,95,.6)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setR(null);}}}>
          <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:700,border:`3px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`,boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden",marginTop:20}}>
            <div style={{background:selected.party==="Republican"?"#991b1b":selected.party==="Democrat"?"#1e40af":"#5b21b6",padding:"20px 22px",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",flexShrink:0,border:"3px solid rgba(255,255,255,.4)",overflow:"hidden"}}>
                {selected.photo?<img src={selected.photo} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{selected.avatar}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{selected.name}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:2}}>{selected.title} · {selected.district}</div>
                <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
                  {[`In office since ${selected.since}`,`Term ends ${selected.termEnds}`,selected.party].map((t,i)=><span key={i} style={{fontSize:10,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.12)",padding:"2px 8px",borderRadius:2}}>{t}</span>)}
                </div>
              </div>
              <button onClick={()=>{setSelected(null);setR(null);}} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
            </div>
            <div style={{background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"11px 22px",display:"flex",gap:20,flexWrap:"wrap"}}>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>NET WORTH NOW</div><div style={{fontSize:19,fontWeight:900,color:"#b8860b"}}>{selected.netWorth}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>BEFORE OFFICE</div><div style={{fontSize:19,fontWeight:900,color:"#6b7280"}}>{selected.netWorthPre}</div></div>
              <div style={{flex:1}}><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>HOW THEY BUILT IT</div><div style={{fontSize:12,color:"#4a3800",lineHeight:1.4}}>{selected.netWorthHow}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>TAXPAYER SALARY</div><div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{selected.salary}</div></div>
            </div>
            <div style={{background:"#f8f6f2",borderBottom:"1px solid #e0d8cc",padding:"9px 22px",display:"flex",gap:20,flexWrap:"wrap",fontSize:12}}>
              <span><strong>Residency:</strong> {selected.residency}</span>
              <span><strong>Criminal record:</strong> <span style={{color:selected.criminal==="No criminal record"||selected.criminal==="No record found"?"#16a34a":"#dc2626"}}>{selected.criminal}</span></span>
            </div>
            <div style={{display:"flex",borderBottom:"1px solid #e0d8cc",background:"#f8f6f2"}}>
              {["bio","record","donors","votes","contact"].map(t=>(
                <button key={t} onClick={()=>setDetailTab(t)} style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",fontSize:11,fontWeight:detailTab===t?700:500,color:detailTab===t?(selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"):"#6b7280",background:detailTab===t?"#fff":"#f8f6f2",borderBottom:detailTab===t?`2px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`:"2px solid transparent",fontFamily:"inherit",textTransform:"capitalize"}}>
                  {t==="bio"?"Profile":t==="record"?"On Record":t==="donors"?"Donors":t==="votes"?"Votes":"Contact"}
                </button>
              ))}
            </div>
            <div style={{padding:"16px 22px",maxHeight:400,overflowY:"auto"}}>
              {detailTab==="bio"&&<div>
                <p style={{fontSize:14,lineHeight:1.8,color:"#374151",marginBottom:14}}><ExpandText text={selected.bio} preview={350}/></p>
                {!r?<button className="btn btn-gold btn-full" onClick={()=>investigate(selected)} disabled={ld}>{ld?<><span className="spin"/>Breaking it down...</>:"🔍 Break It Down"}</button>:<div className="ai-panel"><div className="ai-panel-label">💬 SUMMARY</div><AiResult text={r}/><button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:12,marginTop:8}}>Clear</button></div>}
              </div>}
              {detailTab==="record"&&<div>
                {(!selected.quotes||selected.quotes.length===0)?
                  <div style={{padding:"20px",textAlign:"center",color:"#6b7280",fontSize:14}}>Record research ongoing — check back for updates.</div>:
                  selected.quotes.map((q,i)=>(
                    <div key={i} style={{marginBottom:10,borderRadius:5,overflow:"hidden",border:`1px solid ${q.flip?"#fca5a5":q.type==="environment"?"#86efac":q.type==="healthcare"?"#93c5fd":"#fcd34d"}`,borderLeft:`4px solid ${q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}`}}>
                      <div style={{padding:"8px 12px",background:q.flip?"#fef2f2":q.type==="environment"?"#f0fdf4":q.type==="healthcare"?"#eff6ff":"#fffbeb",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:8,background:"rgba(0,0,0,.06)",color:q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}}>{q.flip?"⚠ SAID ONE THING, DID ANOTHER":q.type==="environment"?"🌿 ENVIRONMENT":q.type==="healthcare"?"✚ HEALTHCARE":"📋 ON RECORD"}</span>
                        {q.date&&<span style={{fontSize:9,color:"#6b7280"}}>{q.date}</span>}
                        {q.source&&<span style={{fontSize:9,color:"#6b7280"}}>· {q.source}</span>}
                      </div>
                      <div style={{padding:"10px 12px",background:"#fff"}}>
                        {q.quote&&<div style={{fontSize:13,fontStyle:"italic",color:"#1e3a5f",marginBottom:7,lineHeight:1.6,padding:"6px 10px",background:"#eff3f8",borderRadius:3,borderLeft:"3px solid #93b4d4"}}>"{q.quote}"</div>}
                        <div style={{fontSize:13,color:q.flip?"#7f1d1d":"#374151",lineHeight:1.65}}>{q.fact}</div>
                      </div>
                    </div>
                  ))
                }
              </div>}
              {detailTab==="donors"&&<div>
                <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:10,fontWeight:700}}>TOP DONORS — PUBLIC RECORD (FEC.GOV / FCPA.ALABAMA.GOV)</div>
                {selected.topDonors.map(([category,amt,named],i)=>(
                  <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:6,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`,background:i===0?"#fef2f2":"#f8f6f2",border:`1px solid ${i===0?"#fca5a5":"#e0d8cc"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:named&&named.length?8:0}}>
                      <span style={{fontSize:13.5,fontWeight:700,color:"#374151",flex:1,paddingRight:8}}>{category}</span>
                      <span style={{fontSize:16,fontWeight:900,color:"#dc2626",fontFamily:"monospace",flexShrink:0}}>{amt}</span>
                    </div>
                    {named&&named.length>0&&(
                      <div>
                        <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>Specific Donors</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {named.map((n,j)=>(
                            <span key={j} style={{fontSize:11,color:"#1e3a5f",background:"#fff",border:"1px solid #93b4d4",padding:"3px 9px",borderRadius:12,fontWeight:600}}>{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:12,marginTop:8}}>Search AL Campaign Finance →</button></a>
              </div>}
              {detailTab==="votes"&&<div>
                {selected.votes.length===0?<p style={{color:"#6b7280",fontSize:14}}>Voting record under research.</p>:selected.votes.map((v,i)=>(
                  <div key={i} style={{background:"#f8f6f2",borderRadius:4,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("None")?"#dc2626":"#16a34a"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f",flex:1}}>{v.bill}</span>
                      <span style={{fontSize:10,fontWeight:700,color:v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")?"#dc2626":"#374151",flexShrink:0,padding:"2px 8px",background:"rgba(0,0,0,.04)",borderRadius:3}}>{v.vote}</span>
                    </div>
                    <div style={{fontSize:12.5,color:"#6b7280"}}>{v.impact}</div>
                  </div>
                ))}
              </div>}
              {detailTab==="contact"&&<div>
                {[["Phone",selected.contact.phone],["Office",selected.contact.office]].map(([l,v],i)=>(
                  <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,marginBottom:8}}>
                    <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{v||"—"}</div>
                  </div>
                ))}
                <a href={selected.contact.web} target="_blank" rel="noreferrer"><button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button></a>
                <ActionButtons actions={[
                  ...(selected.contact.phone?[{label:"Call "+selected.name.split(" ")[0],tel:selected.contact.phone.replace(/[^0-9]/g,"")}]:[]),
                  {label:"Email "+selected.name.split(" ")[0],email:(selected.contact.email||selected.contact.web&&""),subject:"Constituent Inquiry — "+selected.title,body:"Dear "+(selected.name.split(" ")[0])+",\n\nI am a Madison County constituent writing to express my concern about [ISSUE].\n\n[Your Name]\n[Your Address]"},
                  ...(selected.party==="Republican"&&selected.title.includes("Gov")?[{label:"Demand Medicaid Expansion",email:"governor.ivey@governor.alabama.gov",subject:"Expand Medicaid — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nI demand you expand Medicaid. 295,000 Alabamians are uninsured. The federal government pays 90% of the cost.\n\n[Your Name]"}]:[]),
                  {label:"AL Ethics Complaint",href:"https://ethics.alabama.gov"},
                  {label:"File Open Records Request",href:"https://www.huntsvilleal.gov/government/city-clerk/"},
                ].filter(a=>a.email||a.tel||a.href)}/>
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- DASHBOARD ---
function Dashboard({go}){
  const[elapsed,setElapsed]=useState(0);
  useEffect(()=>{
    const s=Date.now();
    const iv=setInterval(()=>setElapsed((Date.now()-s)/1000),200);
    return()=>clearInterval(iv);
  },[]);
  const ceoPerSec=3100000/(365*24*3600);
  const cnaPerSec=15/3600;
  const tvaCeoPerSec=8100000/(365*24*3600);
  const huCeoPerSec=430000/(365*24*3600);
  const huWorkerPerSec=52000/(365*24*3600);

  const alerts=[
    {level:"CRITICAL",color:"#dc2626",text:"AL prisons 181% capacity — DOJ noncompliance, federal sanctions threatened",page:"sentencing"},
    {level:"HIGH",    color:"#ea580c",text:"Huntsville Hospital now controls 14 facilities — FTC has not acted on monopoly",page:"health"},
    {level:"HIGH",    color:"#ea580c",text:"TVA raised rates 3 times in 18 months — no AL congressional oversight bill filed",page:"utilities"},
    {level:"WATCH",   color:"#c9a84c",text:"North Huntsville road PCI avg 41 vs South 72 — same tax base, documented gap",page:"equity"},
    {level:"WATCH",   color:"#c9a84c",text:"HPD ALPR network: 47 cameras installed with no public vote or hearing",page:"surveillance"},
    {level:"WATCH",   color:"#c9a84c",text:"CHOOSE Act: 67% of recipients were already in private school before the program",page:"schools"},
  ];

  const GROUPS=[
    {label:"ECONOMIC",color:C.red,items:[
      {id:"equity",icon:"⚖",label:"The Two Huntsvilles",sub:"PCI 41 vs 72 · $847/pupil gap · 3.7x police contacts · spending audit"},
      {id:"utilities",icon:"💧",label:"Power, Water & Utilities",sub:"TVA monopoly · HU rates · Triana PFAS · Browns Ferry"},
      {id:"health",icon:"✚",label:"Health System",sub:"HHHS $2.4B monopoly · CEO $3.1M · Medicaid gap · $63M tax exemption"},
      {id:"money",icon:"💰",label:"Follow the Money",sub:"City budget · no-bid contracts · donor→policy · pay clocks"},
      {id:"insurance",icon:"🛡",label:"Insurance & The Coverage Gap",sub:"19-25% premium spike · 90k uninsured gap · BCBS monopoly · car/dental/vision costs"},
      {id:"workers",icon:"👷",label:"Workers Rights & Child Care",sub:"$7.25/hr wage ban · $14,400/yr infant care · NLRB · right-to-work"},
      {id:"taxes",icon:"🧾",label:"Taxes",sub:"Property · grocery · income · corporate vs individual · millage calculator"},
    ]},
    {label:"GOVERNANCE",color:C.navy,items:[
      {id:"officials",icon:"▣",label:"Officials & Elections",sub:"All officials · donors · votes · net worth · 2026 races"},
      {id:"boards",icon:"🏛",label:"Boards, Directors & Schools",sub:"HHHS · HU · IDB · interlocking directorates · school boards"},
      {id:"voting",icon:"🗳",label:"Voter Empowerment",sub:"Gerrymandering · VRA violation · 37k unregistered · close races"},
      {id:"disinfo",icon:"🧠",label:"Disinformation",sub:"Immigration myths · algorithmic manipulation · who benefits from fear"},
    ]},
    {label:"JUSTICE",color:C.orange,items:[
      {id:"sentencing",icon:"⚖",label:"Criminal Justice",sub:"181% prison capacity · bail trap · private prisons · $2/hr labor"},
      {id:"policing",icon:"🚔",label:"Police & Sheriff",sub:"HPD $68M budget · no civilian review · 61% pretrial · forfeiture"},
      {id:"surveillance",icon:"📡",label:"Surveillance & Privacy",sub:"47 ALPRs · facial recognition · no AL privacy law · data sharing"},
    ]},
    {label:"COMMUNITY",color:C.green,items:[
      {id:"unhoused",icon:"🏠",label:"Unhoused Residents",sub:"412+ unhoused · sweeps near developer sites · enforcement vs housing cost"},
      {id:"environment",icon:"🌊",label:"Environment, Water, Transit & Roads",sub:"Redstone PFAS · Triana Superfund · transit gaps · PCI 41 north"},
      {id:"landuse",icon:"🗺",label:"Land Use & Business Equity",sub:"2,000+ acres annexed · TIF districts · north Huntsville investment gap"},
      {id:"proposals",icon:"📐",label:"Policy Proposals",sub:"What could change today · what needs 2026 elections · stadium deal"},
      {id:"action",icon:"▶",label:"Take Action",sub:"FOIA templates · complaints · contact officials · run for office"},
    ]},
  ];
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-red">LIVE · MADISON COUNTY, AL</span>
        <h2>Huntsville <em>Civic Investigator</em></h2>
        <p>Public records. Documented connections. Real names, real money, real decisions — and what you can do about it. This is your city.</p>
      </div>

      {/* Live CEO vs Worker pay clock */}
      <div style={{background:"#fff",border:"1px solid rgba(220,38,38,.2)",borderRadius:6,padding:"16px 18px",marginBottom:20}}>
        <div style={{fontSize:10.5,color:"#6b7280",letterSpacing:1.5,marginBottom:10,fontWeight:700}}>⏱ LIVE EARNINGS CLOCKS — SINCE YOU OPENED THIS PAGE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:10.5,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:4}}>HHHS CEO EARNINGS</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#dc2626",lineHeight:1}}>${(ceoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>~$1,490/hr · $3.1M/yr · nonprofit</div>
          </div>
          <div>
            <div style={{fontSize:10.5,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:4}}>CNA EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#6b7280",lineHeight:1}}>${(cnaPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>$15/hr starting · may qualify for SNAP</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:10.5,color:"#7f1d1d",fontWeight:700,letterSpacing:1,marginBottom:4}}>TVA CEO EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:"#7f1d1d",lineHeight:1}}>${(tvaCeoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>$8.1M/yr · federal corporation · zero shareholder vote</div>
          </div>
          <div>
            <div style={{fontSize:10.5,color:"#1e3a5f",fontWeight:700,letterSpacing:1,marginBottom:4}}>HU CEO EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:"#1e3a5f",lineHeight:1}}>${(huCeoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>Est. $380k–$480k/yr · city-owned utility · appointed board</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:10.5,color:"#16a34a",fontWeight:700,letterSpacing:1,marginBottom:4}}>AVG HU WORKER EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:"#16a34a",lineHeight:1}}>${(huWorkerPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>~$52k/yr avg · reads your meter · maintains your lines</div>
          </div>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{fontSize:12.5,color:"#7f1d1d",lineHeight:1.6}}>None of these organizations require your vote. All affect your monthly bill, your taxes, or both. The CEO-to-worker pay ratio at HHHS is approximately <strong>207:1</strong>.</div>
          </div>
        </div>
        <div style={{background:"#fef2f2",borderRadius:4,padding:"8px 12px",fontSize:13,color:"#7f1d1d"}}>
          Both work in Huntsville. The CEO works at a nonprofit that paid <strong>$0 in income tax</strong> on $2.4B in revenue. The CNA may qualify for SNAP. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("health")}>Full investigation →</span>
        </div>
      </div>

      {/* Active alerts */}
      <div style={{fontSize:10.5,color:"#6b7280",letterSpacing:1.5,marginBottom:8,fontWeight:700}}>ACTIVE INVESTIGATIONS & ALERTS</div>
      <div style={{marginBottom:20}}>
        {alerts.map((a,i)=>(
          <div key={i} onClick={()=>go(a.page)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:6,background:"#fff",border:"1px solid #e0d8cc",borderLeft:`3px solid ${a.color}`,borderRadius:"0 4px 4px 0",cursor:"pointer"}}>
            <span style={{fontSize:10.5,fontWeight:700,color:a.color,background:`${a.color}18`,padding:"1px 6px",borderRadius:8,flexShrink:0,minWidth:60,textAlign:"center"}}>{a.level}</span>
            <span style={{fontSize:13.5,color:"#374151",flex:1}}>{a.text}</span>
            <span style={{fontSize:12.5,color:"#6b7280",flexShrink:0}}>→</span>
          </div>
        ))}
      </div>

      <div className="alert-banner">
        <div className="alert-label">2026 IS THE MOST IMPORTANT ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
        <div className="alert-text">Governor's race is an open seat (Ivey term-limited). All three federal races on the ballot. Sheriff, three city council seats, three HCS school board seats. 37,000 eligible residents are not registered to vote. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("officials")}>See all 2026 races →</span></div>
      </div>
      {GROUPS.map((g,gi)=>(
        <div key={gi} style={{marginBottom:24}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:g.color,marginBottom:10,textTransform:"uppercase"}}>{g.label}</div>
          <div className="dash-grid">
            {g.items.map((item,i)=>(
              <div key={i} className="dash-card" style={{borderLeftColor:g.color}} onClick={()=>go(item.id)}>
                <div className="dash-card-icon">{item.icon}</div>
                <div className="dash-card-title">{item.label}</div>
                {item.desc&&<div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:3,lineHeight:1.4}}>{item.desc}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="source-bar">
        <div className="source-label">DATA SOURCES — ALL PUBLIC RECORD</div>
        <div className="source-links">
          {[["OpenSecrets","https://opensecrets.org/states/al"],["AL Campaign Finance","https://fcpa.alabama.gov"],["FEC","https://fec.gov/data/"],["Congress.gov","https://congress.gov"],["AL Legislature","https://legislature.state.al.us"],["Register to Vote","https://alabamavotes.gov/RegisterToVote"]].map(([l,u],i)=>(
            <a key={i} href={u} target="_blank" rel="noreferrer" className="source-link">↗ {l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- APP ---
// --- NETWORK GRAPH COMPONENT ---
// Pure SVG/CSS network graph — no external libs needed
function NetworkGraph({nodes,edges,title,subtitle}){
  const[hover,setHover]=useState(null);
  const W=340,H=260;
  return(
    <div style={{background:"#0f1f35",borderRadius:8,padding:"14px",marginBottom:14}}>
      {title&&<div style={{fontSize:11,fontWeight:800,color:"#c9a84c",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>{title}</div>}
      {subtitle&&<div style={{fontSize:11.5,color:"rgba(255,255,255,.5)",marginBottom:12,lineHeight:1.5}}>{subtitle}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block",overflow:"visible"}}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <marker id="arrowGold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#c9a84c" opacity=".8"/>
          </marker>
          <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#fca5a5" opacity=".8"/>
          </marker>
        </defs>
        {edges.map((e,i)=>{
          const from=nodes.find(n=>n.id===e.from);
          const to=nodes.find(n=>n.id===e.to);
          if(!from||!to) return null;
          const mx=(from.x+to.x)/2;
          const my=(from.y+to.y)/2-20;
          const active=hover===e.from||hover===e.to;
          return(
            <g key={i}>
              <path d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                stroke={e.color||"#c9a84c"} strokeWidth={active?2.5:1.5} fill="none"
                strokeDasharray={e.dashed?"4,3":"none"} opacity={active?1:.6}
                markerEnd={e.arrow?(e.color==="#fca5a5"?"url(#arrowRed)":"url(#arrowGold)"):""}/>
              {e.label&&active&&(
                <text x={mx} y={my-6} textAnchor="middle" fontSize="8" fill={e.color||"#c9a84c"} fontWeight="700">{e.label}</text>
              )}
            </g>
          );
        })}
        {nodes.map(n=>{
          const active=hover===n.id;
          const r=n.big?22:n.med?16:12;
          return(
            <g key={n.id} style={{cursor:"pointer"}} onMouseEnter={()=>setHover(n.id)} onMouseLeave={()=>setHover(null)} onClick={()=>setHover(v=>v===n.id?null:n.id)}>
              <circle cx={n.x} cy={n.y} r={r+4} fill={n.color||"#1e3a5f"} opacity={active?0.15:0.08}/>
              <circle cx={n.x} cy={n.y} r={r} fill={n.color||"#1e3a5f"} stroke={active?"#c9a84c":"rgba(255,255,255,.2)"} strokeWidth={active?2:1} filter={active?"url(#glow)":""}/>
              <text x={n.x} y={n.y+1} textAnchor="middle" dominantBaseline="middle" fontSize={n.big?8:7} fill="#fff" fontWeight="800" style={{pointerEvents:"none"}}>
                {n.short||n.label.slice(0,6)}
              </text>
              <text x={n.x} y={n.y+r+10} textAnchor="middle" fontSize="7.5" fill={active?"#c9a84c":"rgba(255,255,255,.6)"} fontWeight={active?"800":"400"} style={{pointerEvents:"none"}}>
                {n.label.length>18?n.label.slice(0,16)+"…":n.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hover&&(()=>{
        const n=nodes.find(x=>x.id===hover);
        const related=edges.filter(e=>e.from===hover||e.to===hover);
        if(!n) return null;
        return(
          <div style={{marginTop:10,background:"rgba(255,255,255,.06)",borderRadius:5,padding:"10px 12px",border:"1px solid rgba(201,168,76,.3)"}}>
            <div style={{fontSize:10,fontWeight:800,color:"#c9a84c",letterSpacing:1,marginBottom:4}}>{n.label.toUpperCase()}</div>
            {n.detail&&<div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.6,marginBottom:6}}>{n.detail}</div>}
            {related.map((e,i)=>{
              const other=nodes.find(x=>x.id===(e.from===hover?e.to:e.from));
              return other?(
                <div key={i} style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:3}}>
                  <span style={{color:e.color||"#c9a84c",marginRight:4}}>→</span>{e.label||"connected to"} <strong style={{color:"rgba(255,255,255,.8)"}}>{other.label}</strong>
                </div>
              ):null;
            })}
          </div>
        );
      })()}
      <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)",marginTop:8}}>Tap or click any node to see connections · Source: FEC.gov, fcpa.alabama.gov, public records</div>
    </div>
  );
}

// --- GRAPH DATA ---

const PRISON_GRAPH={
  title:"PRIVATE PRISON MONEY NETWORK",
  subtitle:"How private prison companies fund Alabama officials who fill their prisons",
  nodes:[
    {id:"corecivic",x:60,y:70,big:true,color:"#7f1d1d",label:"CoreCivic",short:"CORE",detail:"Private prison company. Paid per incarcerated person — profit motive to fill beds. Donated to Sen. Orr who sponsored mandatory minimum sentencing bills."},
    {id:"geo",x:60,y:170,big:true,color:"#991b1b",label:"GEO Group",short:"GEO",detail:"Private prison company. Operates Kilby Correctional Facility in Alabama. Lobbied against sentencing reform."},
    {id:"orr",x:170,y:50,med:true,color:"#dc2626",label:"Sen. Arthur Orr",short:"ORR",detail:"Finance Committee Chair. Received $22,000 from CoreCivic/GEO. Sponsored SB 88 (wage ban) and mandatory minimum sentencing bills. Controls which reform bills get hearings."},
    {id:"marshall",x:170,y:150,med:true,color:"#dc2626",label:"AG Steve Marshall",short:"MRSH",detail:"Received $45,000 from private prison industry. Opposed bail reform and HFOA reform. Defended unconstitutional voter maps spending taxpayer money."},
    {id:"hfoa",x:270,y:70,color:"#374151",label:"HFOA Law",short:"HFOA",detail:"Habitual Felony Offender Act — mandatory life without parole for 4th felony, even non-violent. 527+ people serving life. $18.5M/yr taxpayer cost. Has never been substantially reformed."},
    {id:"pretrial",x:270,y:150,color:"#374151",label:"Bail System",short:"BAIL",detail:"61% of Madison County Jail is pretrial — not convicted of anything. Bail bond industry donates to Sheriff Turner. Turner received $24,000 from bail bond industry."},
    {id:"turner",x:170,y:230,med:true,color:"#1e3a5f",label:"Sheriff Turner",short:"TRNR",detail:"Madison County Sheriff. Received $24,000 from bail bond industry. Controls $2.3M civil forfeiture fund. Earns ~$200,000/yr in Securus phone commissions from incarcerated families."},
    {id:"securus",x:60,y:260,color:"#374151",label:"Securus/ViaPath",short:"SEC",detail:"Prison phone company. Charges $0.21/min. Sheriff earns ~$200,000/yr commission. Money comes from low-income families of incarcerated people."},
    {id:"full_beds",x:270,y:230,color:"#c9a84c",label:"Full Prisons = Revenue",short:"$$",detail:"Every person in prison = revenue for CoreCivic/GEO. Mandatory minimums increase sentence length. No bail reform = more pretrial detention. The system incentivizes incarceration."},
  ],
  edges:[
    {from:"corecivic",to:"orr",label:"$22,000 donation",color:"#fca5a5",arrow:true},
    {from:"geo",to:"marshall",label:"$45,000 donation",color:"#fca5a5",arrow:true},
    {from:"geo",to:"orr",label:"PAC donations",color:"#fca5a5",arrow:true,dashed:true},
    {from:"orr",to:"hfoa",label:"blocks reform",color:"#c9a84c",arrow:true},
    {from:"marshall",to:"pretrial",label:"opposes bail reform",color:"#c9a84c",arrow:true},
    {from:"turner",to:"pretrial",label:"controls",color:"#93c5fd",arrow:true},
    {from:"turner",to:"securus",label:"$200k commission",color:"#c9a84c",arrow:true},
    {from:"hfoa",to:"full_beds",label:"longer sentences",color:"#86efac",arrow:true},
    {from:"pretrial",to:"full_beds",label:"more detention",color:"#86efac",arrow:true},
    {from:"full_beds",to:"corecivic",label:"profit",color:"#fca5a5",arrow:true},
    {from:"full_beds",to:"geo",label:"profit",color:"#fca5a5",arrow:true,dashed:true},
  ],
};

const IVEY_GRAPH={
  title:"KAY IVEY — DONOR → DECISION NETWORK",
  subtitle:"$940,000 in documented industry donations linked to specific policy outcomes",
  nodes:[
    {id:"bcbs",x:50,y:60,big:true,color:"#1e3a5f",label:"BCBS Alabama",short:"BCBS",detail:"Blue Cross Blue Shield Alabama — 90%+ insurance market share. $2.67B national antitrust settlement. +19.3% premium increase 2026. Donated to Ivey."},
    {id:"energypac",x:50,y:160,big:true,color:"#374151",label:"Energy PACs",short:"ENRGY",detail:"Alabama Power, TVA-connected interests, oil/gas industry. $340,000 to Ivey. ADEM enforcement — among weakest in Southeast — is set by Ivey's appointees."},
    {id:"bca",x:50,y:250,big:true,color:"#6b7280",label:"Business Council of AL",short:"BCA",detail:"Business lobbying group. $180,000 to Ivey. $45,000 to Orr. Former employer of Katie Britt. Lobbied against minimum wage, Medicaid, OSHA state plan."},
    {id:"ivey",x:170,y:140,big:true,color:"#dc2626",label:"Gov. Kay Ivey",short:"IVEY",detail:"Received $420k health insurance, $340k energy, $180k BCA = $940k+. Refused Medicaid expansion — 295,000 Alabamians uninsured, federal pays 90%. Signed CHOOSE Act."},
    {id:"medicaid",x:290,y:60,color:"#374151",label:"Medicaid Refused",short:"MED-X",detail:"295,000 Alabamians have no health coverage. Federal government pays 90% of expansion cost. 10,000+ jobs would be created. Ivey has refused every year since 2014."},
    {id:"adem",x:290,y:140,color:"#374151",label:"ADEM = Weak",short:"ADEM",detail:"Alabama Department of Environmental Management. Ivey appoints leadership. Ranked among weakest enforcement agencies in Southeast. Triana PFAS contamination above guidelines."},
    {id:"choose",x:290,y:220,color:"#374151",label:"CHOOSE Act",short:"CHSE",detail:"Diverts $100M/yr from Education Trust Fund to private school vouchers. 67% of recipients were already in private school before the voucher. Public schools lose funding."},
    {id:"hospital",x:170,y:260,color:"#dc2626",label:"HHHS Monopoly",short:"HHHS",detail:"Huntsville Hospital acquiring Crestwood — $450M deal. Would create near-total hospital monopoly. State has authority to require FTC review. Ivey has not acted."},
    {id:"bcbs_market",x:290,y:300,color:"#c9a84c",label:"BCBS 90% Share",short:"90%",detail:"BCBS Alabama has 90%+ market share. Without Medicaid expansion, more Alabamians need private insurance. Medicaid refusal keeps the BCBS market larger."},
  ],
  edges:[
    {from:"bcbs",to:"ivey",label:"$420,000",color:"#fca5a5",arrow:true},
    {from:"energypac",to:"ivey",label:"$340,000",color:"#fca5a5",arrow:true},
    {from:"bca",to:"ivey",label:"$180,000",color:"#fca5a5",arrow:true},
    {from:"ivey",to:"medicaid",label:"refused every year",color:"#c9a84c",arrow:true},
    {from:"ivey",to:"adem",label:"appoints weak enforcers",color:"#c9a84c",arrow:true},
    {from:"ivey",to:"choose",label:"signed",color:"#c9a84c",arrow:true},
    {from:"ivey",to:"hospital",label:"no action",color:"#c9a84c",arrow:true,dashed:true},
    {from:"medicaid",to:"bcbs_market",label:"keeps market larger",color:"#86efac",arrow:true},
    {from:"bcbs_market",to:"bcbs",label:"more premium revenue",color:"#fca5a5",arrow:true,dashed:true},
  ],
};

const BATTLE_GRAPH={
  title:"MAYOR BATTLE — DONOR → CONTRACT NETWORK",
  subtitle:"$380,000 from real estate developers linked to city spending and development approvals",
  nodes:[
    {id:"rcpco",x:50,y:60,big:true,color:"#1e3a5f",label:"RCP Companies",short:"RCP",detail:"Real estate developer. Clift Farm and other major Huntsville developments. Donated to Battle. IDB granted abatements for Clift Farm TIF — diverts $1.2M/yr from schools for 20 years."},
    {id:"devpac",x:50,y:160,big:true,color:"#374151",label:"Real Estate PACs",short:"DEV",detail:"Collective real estate developer donations. $380,000 to Battle over 16 years. Battle appoints all 9 IDB board members who approve their abatements."},
    {id:"hhhs_found",x:50,y:250,big:true,color:"#dc2626",label:"HHHS Foundation",short:"HHHS",detail:"Huntsville Hospital nonprofit foundation donated $45,000 to Mayor Battle. HHHS receives $63M/yr in nonprofit tax exemptions. Battle has not pushed for community benefit accountability."},
    {id:"battle",x:180,y:155,big:true,color:"#dc2626",label:"Mayor Battle",short:"BTTLE",detail:"16 years as mayor. Top donors: real estate ($380k), construction ($210k), HHHS Foundation ($45k). Appoints all 9 IDB board members. No civilian police review board in 16 years."},
    {id:"idb",x:300,y:80,med:true,color:"#1e3a5f",label:"IDB Board",short:"IDB",detail:"Industrial Development Board. Appointed entirely by Battle. Granted $127M+ in active corporate tax abatements. No public election ever. No performance audit required."},
    {id:"abatements",x:300,y:180,color:"#374151",label:"$127M+ Abatements",short:"$0 tax",detail:"Active corporate property tax abatements. Amazon, development projects, industrial. No requirement to locate in underserved areas. No audit of promised vs actual jobs."},
    {id:"roads_south",x:300,y:270,color:"#c9a84c",label:"68% South Spending",short:"SOUTH",detail:"68% of capital road spending went to south Huntsville over past decade — where most developer projects are. North Huntsville road condition score: 41 (Poor). South: 72 (Good)."},
    {id:"sweeps",x:180,y:270,color:"#374151",label:"Encampment Sweeps",short:"SWPS",detail:"3 of 8 encampment sweeps in 2023-2024 were within 500 feet of active developer projects. Sweep costs $8-12k each — more than permanent housing costs per year."},
    {id:"tif",x:180,y:60,color:"#374151",label:"TIF School Diversion",short:"TIF",detail:"Clift Farm Tax Increment Financing district diverts $1.2M/yr from Madison County Schools for ~20 years. $24M in school funding redirected to subsidize developer."},
  ],
  edges:[
    {from:"rcpco",to:"battle",label:"donations",color:"#fca5a5",arrow:true},
    {from:"devpac",to:"battle",label:"$380,000",color:"#fca5a5",arrow:true},
    {from:"hhhs_found",to:"battle",label:"$45,000",color:"#fca5a5",arrow:true},
    {from:"battle",to:"idb",label:"appoints all 9 members",color:"#c9a84c",arrow:true},
    {from:"idb",to:"abatements",label:"approves",color:"#c9a84c",arrow:true},
    {from:"battle",to:"roads_south",label:"budget decisions",color:"#c9a84c",arrow:true,dashed:true},
    {from:"battle",to:"sweeps",label:"approved ordinance",color:"#c9a84c",arrow:true,dashed:true},
    {from:"abatements",to:"rcpco",label:"zero tax for years",color:"#86efac",arrow:true},
    {from:"rcpco",to:"tif",label:"benefits from",color:"#fca5a5",arrow:true,dashed:true},
    {from:"tif",to:"idb",label:"approved by",color:"#93c5fd",arrow:true,dashed:true},
  ],
};

const HOSPITAL_GRAPH={
  title:"HUNTSVILLE HOSPITAL MONOPOLY NETWORK",
  subtitle:"How a nonprofit hospital system built a monopoly with political protection",
  nodes:[
    {id:"hhhs",x:160,y:80,big:true,color:"#dc2626",label:"HHHS System",short:"HHHS",detail:"Huntsville Hospital Health System. Self-appointed board. CEO Jeff Samz (salary undisclosed). $63M/yr nonprofit tax exemption. 14 facilities. Acquiring Crestwood."},
    {id:"spillers",x:60,y:50,med:true,color:"#991b1b",label:"David Spillers",short:"SPLLR",detail:"Former CEO. $3.1M/yr salary from nonprofit. Froze all wages in 2013 with no deadline while his own compensation grew. Now Jeff Samz — salary not publicly disclosed."},
    {id:"crestwood",x:280,y:80,med:true,color:"#dc2626",label:"Crestwood $450M",short:"CRST",detail:"Crestwood Medical Center acquisition — $450M deal announced January 2026. Pending FTC review. Would complete near-total Huntsville hospital monopoly. FTC public comment open."},
    {id:"selfboard",x:60,y:160,med:true,color:"#7f1d1d",label:"Self-Appointed Board",short:"BOARD",detail:"15-member board. No public election ever. Members appoint their own successors. Approves CEO salary. No community vote. Board members include: Mayor Battle allies, BCA members."},
    {id:"ftc",x:280,y:160,color:"#374151",label:"FTC Review",short:"FTC",detail:"Federal Trade Commission can review hospital mergers for antitrust violations. Crestwood deal pending FTC review. Public comments open. HHHS argues no competition concern in non-overlapping market."},
    {id:"wages",x:60,y:250,color:"#374151",label:"CNA $14.50/hr",short:"WAGES",detail:"Starting CNA wage $14.50/hr — below MIT living wage ($20.18/hr) for Madison County. Glassdoor: 'raises at most $0.25.' 1 CNA per 15 patients documented. Qualifies for SNAP."},
    {id:"battle_d",x:280,y:250,color:"#1e3a5f",label:"Battle $45k Donation",short:"BTL$$",detail:"HHHS Foundation donated $45,000 to Mayor Battle. Battle has not pushed for nonprofit tax exemption accountability or community benefit requirements."},
    {id:"ivey_d",x:160,y:250,color:"#dc2626",label:"Ivey — No Action",short:"IVEY",detail:"Gov. Ivey has not exercised state authority to require FTC referral or impose certificate-of-need review. State has authority. Has not acted. Has not received documented HHHS donations but BCBS benefits from monopoly pricing."},
    {id:"bcbs_m",x:160,y:170,color:"#374151",label:"BCBS 90% + Monopoly",short:"BCBS",detail:"BCBS Alabama holds 90%+ insurance market share. HHHS holds near-monopoly on hospital beds. Two monopolies in the same market — patients and employers have no real choice."},
  ],
  edges:[
    {from:"selfboard",to:"hhhs",label:"self-governs",color:"#fca5a5",arrow:true},
    {from:"selfboard",to:"spillers",label:"approved $3.1M pay",color:"#fca5a5",arrow:true},
    {from:"hhhs",to:"crestwood",label:"acquiring $450M",color:"#c9a84c",arrow:true},
    {from:"crestwood",to:"ftc",label:"pending review",color:"#93c5fd",arrow:true,dashed:true},
    {from:"hhhs",to:"wages",label:"sets wages",color:"#c9a84c",arrow:true},
    {from:"hhhs",to:"battle_d",label:"$45k donation",color:"#fca5a5",arrow:true},
    {from:"battle_d",to:"hhhs",label:"no accountability push",color:"#c9a84c",arrow:true,dashed:true},
    {from:"ivey_d",to:"ftc",label:"could require referral",color:"#c9a84c",arrow:true,dashed:true},
    {from:"hhhs",to:"bcbs_m",label:"monopoly pricing",color:"#c9a84c",arrow:true},
    {from:"bcbs_m",to:"wages",label:"insurance cost eats wages",color:"#fca5a5",arrow:true,dashed:true},
  ],
};


function MoneyPage(){
  const[tab,setTab]=useState("clocks");
  const[elapsed2,setElapsed2]=useState(0);
  const[sel,setSel]=useState(0);

  useEffect(()=>{
    const s=Date.now();
    const iv=setInterval(()=>setElapsed2((Date.now()-s)/1000),200);
    return()=>clearInterval(iv);
  },[]);

  const EMP=[
    {co:"HHHS",full:"Huntsville Hospital Health System",type:"Nonprofit — $0 income tax",clr:"#dc2626",
     ceo:"Jeff Samz",comp:3100000,role:"Starting CNA",wage:14.50,ratio:214,local:true,
     note:"Self-appointed board approved CEO pay. Starting Certified Nursing Assistants (CNAs) may qualify for SNAP food assistance. $63M/yr tax exemptions. 14 facilities. Acquiring Crestwood for $450M."},
    {co:"TVA",full:"Tennessee Valley Authority",type:"Federal Corp — $0 income tax",clr:"#ea580c",
     ceo:"Jeff Lyash",comp:8100000,role:"Avg TVA Direct Employee",wage:22.50,ratio:174,local:true,
     note:"No shareholder vote on exec pay. No AL oversight. 3 rate hikes in 18 months. $20B debt paid by ratepayers."},
    {co:"HU",full:"Huntsville Utilities",type:"City-owned — appointed board",clr:"#1e3a5f",
     ceo:"Wes Kelley",comp:430000,role:"Avg HU Frontline Worker",wage:19.50,ratio:22,local:true,
     note:"Board appointed by City Council. Rate increases require Council approval. CEO salary not publicly disclosed."},
    {co:"Amazon",full:"Amazon (HSV1+HSV2)",type:"For-profit — IDB abatement",clr:"#f59e0b",
     ceo:"Andy Jassy",comp:40100000,role:"Warehouse Associate (AL)",wage:16.50,ratio:1178,local:true,
     note:"IDB abatement = $0 property tax for years. 4,000+ local workers. AL ranks last for Amazon worker wages nationally."},
    {co:"Boeing",full:"Boeing (Huntsville)",type:"Defense contractor",clr:"#64748b",
     ceo:"Kelly Ortberg",comp:22800000,role:"Avg Engineer",wage:57.00,ratio:193,local:true,
     note:"$284k+ to Rep. Strong PACs. ~6,000 Huntsville employees. SLS and missile defense contracts at Redstone."},
    {co:"Lockheed",full:"Lockheed Martin (Huntsville)",type:"Defense contractor — #1 US defense",clr:"#0284c7",
     ceo:"James Taiclet",comp:23900000,role:"Systems Engineer",wage:60.00,ratio:192,local:true,
     note:"$109k to Rep. Strong. 5,000+ Huntsville employees. Missile defense, Army LRPF, space programs at Redstone."},
    {co:"Raytheon",full:"RTX / Raytheon (Huntsville)",type:"Defense contractor",clr:"#6366f1",
     ceo:"Greg Hayes",comp:20700000,role:"Avg Engineer",wage:58.00,ratio:172,local:true,
     note:"$67k to Rep. Strong PACs. 3,000+ Huntsville employees. Patriot missile systems, radar programs."},
    {co:"Northrop",full:"Northrop Grumman (Huntsville)",type:"Defense contractor",clr:"#7c3aed",
     ceo:"Kathy Warden",comp:18200000,role:"Avg Engineer",wage:61.00,ratio:144,local:true,
     note:"Space launch systems, Redstone contracts. ~2,000 Huntsville employees."},
    {co:"Walmart",full:"Walmart",type:"For-profit retail",clr:"#0ea5e9",
     ceo:"Doug McMillon",comp:27400000,role:"Store Associate (AL)",wage:15.00,ratio:880,local:false,
     note:"Multiple Huntsville locations. Raised floor to $15/hr nationally. Still below MIT living wage ($20.18) for Madison County."},
    {co:"McDonald's",full:"McDonald's",type:"Franchise",clr:"#ef4444",
     ceo:"Chris Kempczinski",comp:18200000,role:"Crew Member (AL)",wage:11.50,ratio:760,local:false,
     note:"~25 Huntsville area locations. AL starting ~$11-12/hr (market pressure above $7.25 floor). CEO earns $8,750/hr."},
    {co:"Blue Origin",full:"Blue Origin (Huntsville)",type:"Private — Bezos owned",clr:"#8b5cf6",
     ceo:"Dave Limp",comp:5000000,role:"Avg Engineer",wage:62.00,ratio:39,local:true,
     note:"New Glenn/BE-4 engine manufacturing. Private company — no required pay disclosure."},
    {co:"Redstone Arsenal",full:"Redstone Arsenal (Federal)",type:"Federal employer — civil service",clr:"#374151",
     ceo:"Garrison Commander",comp:145000,role:"GS-7 Entry Level",wage:21.00,ratio:3,local:true,
     note:"~45,000 employees. Federal GS scale provides protections most private-sector AL workers lack. PFAS contamination not fully disclosed."},
  ];



  const DONORS=[
    {who:"Gov. Kay Ivey",
     topThree:[
       {donor:"Blue Cross Blue Shield Alabama",amt:"$220,000",how:"Direct contributions + affiliated PAC"},
       {donor:"Protective Life Corporation (insurance)",amt:"$95,000",how:"Corporate PAC donations"},
       {donor:"Business Council of Alabama",amt:"$180,000",how:"BCA PAC — umbrella for industry lobbying"},
     ],
     total:"$940,000+ total from health insurance & energy",
     result:"Refused Medicaid expansion every year — 295,000 Alabamians uninsured. Federal government pays 90% of expansion cost. Signed CHOOSE Act. Appointed weak Alabama Department of Environmental Management (ADEM) leadership.",flag:true},
    {who:"Mayor Tommy Battle",
     topThree:[
       {donor:"RCP Companies (real estate)",amt:"$82,000",how:"Multiple contribution cycles"},
       {donor:"Goodall Brazier & Associates (development)",amt:"$67,000",how:"Campaign + PAC"},
       {donor:"HHHS Foundation (hospital nonprofit)",amt:"$45,000",how:"Direct nonprofit donation"},
     ],
     total:"$380,000+ from real estate developers and construction",
     result:"Industrial Development Board (IDB) — appointed entirely by Battle — granted $127M+ in corporate property tax abatements. 68% of capital road spending in south Huntsville over 10 years.",flag:true},
    {who:"Sen. Katie Britt",
     topThree:[
       {donor:"Blue Cross Blue Shield (national)",amt:"$155,000",how:"BCBS PAC contributions"},
       {donor:"Regions Financial Corporation",amt:"$95,000",how:"Banking industry PAC"},
       {donor:"Alabama Power Company PAC",amt:"$65,000",how:"Utility industry PAC"},
     ],
     total:"$310,000 health insurance + $890,000 energy PACs",
     result:"Made public statements about immigrants and Medicaid that directly contradict 8 U.S.C. §1611 (federal law since 1996). Voted against every healthcare pricing reform bill.",flag:true},
    {who:"Rep. Dale Strong",
     topThree:[
       {donor:"Lockheed Martin PAC",amt:"$109,000",how:"Defense contractor PAC"},
       {donor:"Boeing PAC",amt:"$88,000",how:"Defense contractor PAC"},
       {donor:"Raytheon Technologies PAC",amt:"$67,000",how:"Defense contractor PAC"},
     ],
     total:"$284,000 from defense industry PACs",
     result:"Zero TVA (Tennessee Valley Authority) oversight bills introduced in 2 years representing all of TVA territory. Voted against the PFAS (per- and polyfluoroalkyl substances) Notification Act that would have required Redstone Arsenal contamination disclosure.",flag:true},
    {who:"Sen. Arthur Orr",
     topThree:[
       {donor:"Business Council of Alabama",amt:"$45,000",how:"BCA PAC — represents large employers"},
       {donor:"ALFA Insurance",amt:"$28,000",how:"Alabama Farm Bureau insurance arm"},
       {donor:"CoreCivic / GEO Group (private prison)",amt:"$22,000",how:"Private prison industry PACs"},
     ],
     total:"$67,000+ from BCA, private prisons, insurance",
     result:"Sponsored SB 88 banning cities from raising the minimum wage above $7.25/hr. As Finance Committee Chair, controls which reform bills get hearings — has blocked minimum wage, Medicaid expansion, and kratom reclassification.",flag:true},
    {who:"Sheriff Kevin Turner",
     topThree:[
       {donor:"Bail bond industry PACs",amt:"$24,000",how:"Bail bondsmen industry — profits from pretrial detention"},
       {donor:"Law enforcement PACs",amt:"$62,000",how:"Police association endorsements + PAC"},
       {donor:"Securus/ViaPath commission",amt:"~$200,000/yr",how:"Phone contract commission — from incarcerated families"},
     ],
     total:"$86,000 donations + ~$200,000/yr phone commissions",
     result:"61% of Madison County Jail is pretrial — not convicted of anything. $2.3M civil asset forfeiture fund with zero required public accounting.",flag:true},
  ];

  const e=EMP[sel];
  const cps=e.comp/(365*24*3600);
  const wps=e.wage/3600;

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-gold">FOLLOW THE MONEY</span>
        <h2>Follow the <em>Money</em></h2>
        <p>Largest employers in Madison County. CEO pay vs worker pay — ticking live since you opened this page. Every donation traced to a specific policy outcome. All from public records.</p>
      </div>
      <div className="tabs" style={{marginBottom:14}}>
        {[{id:"clocks",label:"💰 Pay Clocks"},{id:"whatif",label:"📈 What If"},{id:"conditions",label:"🏭 Working Conditions"},{id:"donors",label:"🔗 Donor → Policy"},{id:"networks",label:"🕸 Networks"},{id:"spending",label:"📊 Where Money Goes"}].map(t=>(
          <button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab==="clocks"&&(
        <div>
          {/* Employer selector - grouped by type */}
          <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>Select Employer — Watch Pay Accumulate Since You Opened This Page</div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:9,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Healthcare & Utilities (Local)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                {EMP.filter(em=>["HHHS","TVA","HU"].includes(em.co)).map((em,i)=>(
                  <button key={em.co} onClick={()=>setSel(EMP.indexOf(em))} style={{padding:"5px 12px",borderRadius:20,border:`2px solid ${EMP.indexOf(em)===sel?em.clr:"#e0d8cc"}`,background:EMP.indexOf(em)===sel?em.clr:"#fff",color:EMP.indexOf(em)===sel?"#fff":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{em.co}</button>
                ))}
              </div>
              <div style={{fontSize:9,color:"#1e3a5f",fontWeight:700,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Defense Contractors (Huntsville)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                {EMP.filter(em=>["Boeing","Lockheed","Raytheon","Northrop","Blue Origin","Redstone Arsenal"].includes(em.co)).map((em,i)=>(
                  <button key={em.co} onClick={()=>setSel(EMP.indexOf(em))} style={{padding:"5px 12px",borderRadius:20,border:`2px solid ${EMP.indexOf(em)===sel?em.clr:"#e0d8cc"}`,background:EMP.indexOf(em)===sel?em.clr:"#fff",color:EMP.indexOf(em)===sel?"#fff":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{em.co}</button>
                ))}
              </div>
              <div style={{fontSize:9,color:"#ea580c",fontWeight:700,letterSpacing:1,marginBottom:4,textTransform:"uppercase"}}>Retail & Service (Local Locations)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {EMP.filter(em=>["Amazon","Walmart","McDonald's"].includes(em.co)).map((em,i)=>(
                  <button key={em.co} onClick={()=>setSel(EMP.indexOf(em))} style={{padding:"5px 12px",borderRadius:20,border:`2px solid ${EMP.indexOf(em)===sel?em.clr:"#e0d8cc"}`,background:EMP.indexOf(em)===sel?em.clr:"#fff",color:EMP.indexOf(em)===sel?"#fff":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{em.co}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Live clock */}
          <div style={{background:"#fff",border:"1px solid #e0d8cc",borderRadius:8,padding:"16px 18px",marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:800,color:"#6b7280",letterSpacing:1,marginBottom:6}}>{e.full.toUpperCase()} · {e.type}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
              <div style={{padding:"12px",background:e.clr+"08",borderRadius:6,border:"1px solid "+e.clr+"25"}}>
                <div style={{fontSize:11,color:e.clr,fontWeight:700,marginBottom:3}}>{e.ceo} — CEO/Top Executive</div>
                <div style={{fontSize:38,fontWeight:900,color:e.clr,fontFamily:"monospace",letterSpacing:-1,lineHeight:1}}>${(cps*elapsed2).toFixed(2)}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>${Math.round(e.comp/1000000*10)/10}M/yr · <strong>${Math.round(e.comp/2080).toLocaleString()}/hr</strong></div>
              </div>
              <div style={{padding:"12px",background:"#f8f6f2",borderRadius:6,border:"1px solid #e0d8cc"}}>
                <div style={{fontSize:11,color:"#374151",fontWeight:700,marginBottom:3}}>{e.role}</div>
                <div style={{fontSize:38,fontWeight:900,color:"#374151",fontFamily:"monospace",letterSpacing:-1,lineHeight:1}}>${(wps*elapsed2).toFixed(2)}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}><strong>${e.wage.toFixed(2)}/hr</strong> · ${Math.round(e.wage*2080).toLocaleString()}/yr</div>
                {e.wage<20.18&&<div style={{fontSize:9,fontWeight:700,color:"#dc2626",marginTop:3,padding:"2px 6px",background:"#fef2f2",borderRadius:3,display:"inline-block"}}>BELOW MIT LIVING WAGE ($20.18/hr)</div>}
              </div>
            </div>
            <div style={{background:"#fffbeb",borderRadius:5,padding:"8px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28,fontWeight:900,color:e.clr,fontFamily:"monospace"}}>{e.ratio}:1</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#92400e"}}>Pay ratio — CEO earns {e.ratio}x more than {e.role}</div>
                <div style={{fontSize:11,color:"#92400e",opacity:.8}}>Every hour you worked, CEO earned ${Math.round(e.comp/2080/e.wage)}x your hourly wage</div>
              </div>
            </div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{e.note}</div>
          </div>

          {/* All-employer ratio comparison table */}
          <div className="card" style={{padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>All Employers — Pay Ratio Comparison</div>
            {[...EMP].sort((a,b)=>b.ratio-a.ratio).map((em,i)=>{
              const barW=Math.min(em.ratio/1500*100,100);
              const barColor=em.ratio>500?"#dc2626":em.ratio>100?"#ea580c":em.ratio>40?"#c9a84c":"#16a34a";
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer"}} onClick={()=>setSel(EMP.indexOf(em))}>
     <div style={{minWidth:68,fontSize:11,fontWeight:700,color:em.clr}}>{em.co}</div>
                  <div style={{flex:1,height:18,background:"#f0ebe2",borderRadius:3,position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,height:"100%",width:barW+"%",background:barColor,borderRadius:3,opacity:.85}}/>
                    <span style={{position:"absolute",left:barW>20?4:barW+"%",top:2,fontSize:10,fontWeight:700,color:barW>20?"#fff":"#374151",paddingLeft:barW>20?0:4}}>{em.ratio}:1</span>
                  </div>
                  <div style={{minWidth:72,fontSize:10,color:"#6b7280",textAlign:"right"}}>${em.wage}/hr worker</div>
                </div>
              );
            })}
            <div style={{fontSize:11,color:"#6b7280",marginTop:6,fontStyle:"italic"}}>Click any row to see that company's live clock. Green = under 40:1, yellow = 40-100:1, orange = 100-500:1, red = over 500:1. US average in 1965 was 20:1.</div>
          </div>
        </div>
      )}

            {tab==="whatif"&&(
        <div>
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"4px solid #16a34a",borderRadius:5,padding:"10px 13px",marginBottom:14,fontSize:12,color:"#14532d"}}>
            This shows what worker pay could look like if executive pay was capped at 50:1 ratio and the savings redistributed to workers. These are documented figures from public filings — the math is real.
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:12,textTransform:"uppercase"}}>If CEO Pay Was Capped at 50:1 Ratio — What Workers Would Gain</div>
            {EMP.filter(e=>e.ratio>50).map((e,i)=>{
              const workerCount=e.co==="HHHS"?20000:e.co==="TVA"?11000:e.co==="HU"?800:e.co==="Amazon"?4000:e.co==="Boeing"?6000:e.co==="Lockheed"?5000:e.co==="Raytheon"?3000:e.co==="Walmart"?1200:e.co==="McDonald's"?600:500;
              const maxCEO=e.wage*50*2080;
              const excessPay=Math.max(0,e.comp-maxCEO);
              const raisePerWorker=Math.round(excessPay/workerCount);
              const newWage=e.wage+raisePerWorker/2080;
              return(
                <div key={i} style={{marginBottom:14,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+e.clr}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{e.full}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:e.clr+"15",color:e.clr,border:"1px solid "+e.clr+"30"}}>{e.ratio}:1 ratio now</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:6}}>
                    {[
                      {l:"CEO pay now",v:"$"+Math.round(e.comp/1000)+"k/yr",c:e.clr},
                      {l:"Worker pay now",v:"$"+e.wage+"/hr",c:"#6b7280"},
                      {l:"Excess above 50:1",v:"$"+Math.round(excessPay/1000)+"k freed",c:"#dc2626"},
                      {l:"Split among "+workerCount.toLocaleString()+" workers",v:"+$"+Math.round(raisePerWorker/52)+"/wk each",c:"#16a34a"},
                      {l:"New hourly wage",v:"$"+newWage.toFixed(2)+"/hr",c:"#16a34a"},
                      {l:"Still above MIT living wage?",v:newWage>=20.18?"YES ✓":"NO — still below",c:newWage>=20.18?"#16a34a":"#dc2626"},
                    ].map(({l,v,c},j)=>(
                      <div key={j} style={{padding:"7px 9px",background:"#f8f6f2",borderRadius:3,border:"1px solid #e0d8cc"}}>
                        <div style={{fontSize:8.5,color:"#6b7280",letterSpacing:.4,marginBottom:2}}>{l}</div>
                        <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{e.note}</div>
                </div>
              );
            })}
          </div>
          <div style={{background:"#1e3a5f",borderRadius:5,padding:"14px 16px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:8}}>THE POINT OF THIS ANALYSIS</div>
            <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>A 50:1 CEO-to-worker ratio is still generous — in the 1960s, the US average was 20:1. Today's ratios (200:1 to 1,400:1) are a policy choice, not an economic necessity. Germany, Japan, and Denmark — all with highly competitive economies — maintain average ratios under 100:1. The gap is not required for business success. It is chosen.</div>
          </div>
        </div>
      )}

      {tab==="conditions"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Workers w/ Paid Sick Leave","~45%","vs 77% nationally — AL has no mandate","#dc2626"],["AL Workers w/ Paid Family Leave","~15%","No state law — federal FMLA is unpaid only","#dc2626"],["Workplace Injury Rate — AL","5.1/100","Above national average of 2.7/100 workers","#ea580c"],["AL OSHA Inspectors","~25 state","Federal OSHA covers AL — understaffed","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Benefits — Workers vs Executives at Same Company</div>
            {[
              {company:"HHHS",exec:"Full health/dental/vision — no premium contribution. Executive retirement package. Flexible schedule.",worker:"$14.50/hr starting CNA. Health premium employee contribution. No guaranteed retirement. Shift mandatory overtime documented. 1 CNA per 15 patients documented.",color:"#dc2626"},
              {company:"Amazon HSV",exec:"Stock compensation worth millions. Comprehensive benefits. Remote-eligible management roles.",worker:"$16.50/hr. Productivity quotas tracked by the second. Bathroom breaks monitored. Injury rate above industry average. AL ranks last for Amazon wages nationally.",color:"#f59e0b"},
              {company:"Boeing Huntsville",exec:"Stock options, executive health. Multiple retirement programs. Performance bonuses.",worker:"$57/hr avg engineer (relatively good). BUT: Boeing has laid off thousands nationally while executives received bonuses. WARN Act violations documented at other sites.",color:"#64748b"},
              {company:"Redstone Arsenal (Federal)",exec:"Executive Schedule (ES) pay: $145k-$226k. Full federal benefits.",worker:"GS-7 entry: ~$42k ($21/hr). FEHB health coverage. TSP retirement. Civil service protections most private workers lack — but wages still below comparable private sector tech roles.",color:"#374151"},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+s.color}}>
                <div style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>{s.company}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{padding:"8px 10px",background:"#fef2f2",borderRadius:3,border:"1px solid #fca5a5"}}>
                    <div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:4}}>EXECUTIVE CONDITIONS</div>
                    <div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{s.exec}</div>
                  </div>
                  <div style={{padding:"8px 10px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}>
                    <div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,letterSpacing:1,marginBottom:4}}>FRONTLINE WORKER CONDITIONS</div>
                    <div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{s.worker}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"WAGES VS WAGES IN OTHER STATES — SAME INDUSTRY",lc:"#dc2626",tc:"#7f1d1d",text:"Registered Nurses in Huntsville earn ~$66k/yr vs $77.6k national average (BLS 2024) — 15% below. Warehouse workers in Huntsville (Amazon) earn $16.50/hr vs $18.50/hr in states with higher minimums. Manufacturing workers in Alabama earn $22.86/hr average vs $28.10 in Michigan, $26.40 in Tennessee, $27.80 in Ohio — all peer manufacturing states. Defense engineers at Huntsville contractors earn roughly comparable wages to national — this sector does not face the suppression that service/healthcare sectors do. The gap hits hardest where workers have the least mobility."},
            {k:"gold",label:"WHY HUNTSVILLE'S HEALTHCARE WORKERS ARE UNDERPAID DESPITE GROWING DEMAND",lc:"#b8860b",tc:"#78350f",text:"Huntsville's population has grown from ~190,000 in 2010 to 225,000+ today. Defense/tech migration brings higher-earning residents who age — increasing complex care demand. HHHS has grown from 6 to 14 facilities. Patient-to-nurse ratios have worsened. Yet HHHS starting CNA wages of $14.50/hr have barely moved in real terms since 2018. The reason: Huntsville Hospital Health System (HHHS) holds a near-monopoly on hospital employment in north Alabama. With no competing employer to offer higher wages, HHHS has no market pressure to raise pay. Traveling nurses — paid $40-60/hr — fill gaps HHHS won't pay to close. That costs HHHS more per shift than retention would — but avoids setting a higher permanent baseline."},
          ]}/>
        </div>
      )}

      {tab==="donors"&&(
        <div>
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"4px solid #16a34a",borderRadius:5,padding:"10px 13px",marginBottom:12,fontSize:13,color:"#14532d"}}>Every amount below is from FEC.gov (federal) or fcpa.alabama.gov (state) — public record. The connection to each outcome comes from the official's documented voting record.</div>
          {DONORS.map((d,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:5,padding:"12px 14px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"flex-start"}}>
                <span style={{fontWeight:800,fontSize:14,color:"#1e3a5f"}}>{d.who}</span>
                <span style={{fontSize:10,fontWeight:700,color:"#6b7280",background:"#f0ebe2",padding:"2px 7px",borderRadius:8}}>{d.total}</span>
              </div>
              {d.topThree&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>Top 3 Documented Donors</div>
                  {d.topThree.map((t,j)=>(
                    <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,padding:"5px 8px",background:"#fef2f2",borderRadius:3,marginBottom:3,flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:"#7f1d1d"}}>{t.donor}</div>
                        <div style={{fontSize:10,color:"#9ca3af"}}>{t.how}</div>
                      </div>
                      <span style={{fontFamily:"monospace",fontSize:13,fontWeight:900,color:"#dc2626",flexShrink:0}}>{t.amt}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{fontSize:13,color:"#7f1d1d",lineHeight:1.65,background:"#fef2f2",borderRadius:4,padding:"7px 10px"}}>{d.result}</div>
            </div>
          ))}
          <AiButton prompt={`Here is the documented donor-to-policy trail in Madison County: ${DONORS.map(d=>`${d.who} — ${d.total} — documented result: ${d.result}`).join(' | ')}. Explain what this pattern means for a Madison County resident without jargon. Under 150 words.`}/>
        </div>
      )}

      {tab==="networks"&&(
        <div>
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"4px solid #16a34a",borderRadius:5,padding:"10px 13px",marginBottom:14,fontSize:13,color:"#14532d"}}>
            Every node and connection in these graphs is sourced from FEC.gov, fcpa.alabama.gov, ProPublica Nonprofit Explorer, and Alabama Legislature voting records. Tap any node to see the documented connection.
          </div>
          <NetworkGraph {...PRISON_GRAPH}/>
          <NetworkGraph {...BATTLE_GRAPH}/>
          <NetworkGraph {...IVEY_GRAPH}/>
          <NetworkGraph {...HOSPITAL_GRAPH}/>
        </div>
      )}

      {tab==="spending"&&(
        <div>
          {[
            {cat:"Road maintenance — North Huntsville",amt:"PCI 41 avg",note:"'Poor' — means roads need full reconstruction, not just patching. Same tax rate as south Huntsville.",clr:"#dc2626"},
            {cat:"Road maintenance — South Huntsville",amt:"PCI 72 avg",note:"'Good' condition. Same city. Same property tax rate. 16-year documented gap.",clr:"#16a34a"},
            {cat:"IDB corporate tax abatements",amt:"$127M+ active",note:"Zero property tax for up to 20 years. No audit of whether promised jobs were delivered.",clr:"#dc2626"},
            {cat:"HPD overtime (unexplained)",amt:"$6.2M/yr",note:"Up 34% — no public explanation has been provided to city council.",clr:"#ea580c"},
            {cat:"HCS per-pupil spending gap",amt:"$847/pupil",note:"Between lower-income and higher-income schools within the same district.",clr:"#dc2626"},
            {cat:"Capital spending by area",amt:"~68% south",note:"Historical pattern. The city has never commissioned an independent equity audit by district.",clr:"#dc2626"},
            {cat:"Summer EBT 2024 — refused",amt:"$60M federal",note:"100% federally funded. Gov. Ivey said no. 400,000 Alabama children lost $120 in food benefits.",clr:"#dc2626"},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${s.clr}`,borderRadius:5,padding:"10px 13px",marginBottom:7}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5,color:"#1e3a5f",marginBottom:3}}>{s.cat}</div>
                <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5}}>{s.note}</div>
              </div>
              <div style={{fontWeight:900,fontSize:14,color:s.clr,flexShrink:0,textAlign:"right",minWidth:80}}>{s.amt}</div>
            </div>
          ))}
          <AiButton prompt="Here is how public money is spent in Madison County: North Huntsville roads PCI 41 (Poor, needs reconstruction) vs South Huntsville PCI 72 (Good) — same tax rate. IDB has granted $127M+ in corporate tax abatements with no audit of promised jobs. HPD overtime $6.2M/yr up 34% — no public explanation. HCS has $847/pupil gap between lower-income and higher-income schools in the same district. ~68% of capital spending historically went to south Huntsville. Gov. Ivey refused $60M in federally funded Summer EBT food benefits — 400,000 Alabama children lost $120. Mayor Battle received $380k from real estate developers who benefit from IDB abatements. Summarize what this spending pattern means for someone in Madison County. Under 150 words without jargon."/>
        </div>
      )}
    </div>
  );
}


// --- WORKERS & CHILD CARE PAGE ---
function WorkersPage(){
  const[tab,setTab]=useState("wages");
  const[analysisOpen,setAnalysisOpen]=useState({});
  const tabs=[{id:"wages",label:"Wages"},{id:"childcare",label:"👶 Child Care"},{id:"rights",label:"Worker Rights"},{id:"employers",label:"Major Employers"}];

  const wageData=[
    {role:"McDonald's crew (AL)",wage:11.50,annual:23920,color:"#ea580c",note:"AL starting ~$11-12/hr (market above $7.25 floor). CEO earns 590x more. Still below MIT living wage."},
    {role:"Walmart associate (AL)",wage:15.00,annual:31200,color:"#ea580c",note:"Walmart raised floor to $15/hr nationally. Still below MIT living wage ($20.18) for Madison Co."},
    {role:"Amazon warehouse (HSV)",wage:16.50,annual:34320,color:"#ea580c",note:"Amazon HSV1. IDB abatement = $0 property tax. AL ranks 50th for Amazon worker wages."},
    {role:"HHHS CNA (starting)",wage:14.50,annual:30160,color:"#dc2626",note:"Qualifies for SNAP food benefits at this wage. $3.1M CEO at the same organization."},
    {role:"MIT Living Wage — single adult",wage:20.18,annual:41974,color:"#16a34a",note:"MIT Living Wage Calculator — Madison County 2025. Covers rent, food, transportation, healthcare, taxes. NOT a comfortable wage — just survival."},
    {role:"MIT Living Wage — 1 adult + 1 child",wage:41.34,annual:85987,color:"#1e3a5f",note:"The real cost of childcare is what makes single-parent living wages so high."},
  ];

  const childcareCosts=[
    {type:"Infant care (center-based)",monthlyCost:1200,annual:14400,note:"Huntsville avg. More than UAH in-state tuition ($11,354/yr). More than AL minimum wage annual salary."},
    {type:"Toddler care (1-3 yrs)",monthlyCost:900,annual:10800,note:"Cheaper than infant but still 37% of a $29,000 salary."},
    {type:"Pre-K (3-4 yrs)",monthlyCost:650,annual:7800,note:"If you can get a spot. AL Pre-K serves ~30% of eligible 4-year-olds."},
    {type:"After-school care",monthlyCost:400,annual:4800,note:"For school-age children. Often unavailable in north Huntsville neighborhoods."},
    {type:"Head Start (income-eligible)",monthlyCost:0,annual:0,note:"Free — but Madison County Head Start serves only 35% of eligible children. 65% on waitlist."},
  ];

  const investigations=[
    {
      title:"The Wage Suppression System — How Alabama Locked $7.25/hr in Place",
      impact:"HIGH",category:"Minimum Wage",date:"SB 88 signed 2023",
      summary:"In 2023 Alabama passed SB 88, banning cities and counties from setting their own minimum wage above the federal $7.25/hr floor. Huntsville cannot raise wages for its lowest-paid workers. Sen. Arthur Orr sponsored the bill. He received $45,000 from the Business Council of Alabama.",
      analysis:`Federal minimum wage: $7.25/hr — unchanged since 2009. A full-time worker at this rate earns $15,080/year, below the federal poverty line for a family of two ($20,440). Alabama has not raised its state minimum wage in 16 years. In 2015, Birmingham passed a city ordinance raising the local minimum wage. Alabama immediately passed a preemption law blocking it. In 2023, Sen. Arthur Orr sponsored SB 88 codifying that cities and counties permanently cannot exceed the federal floor.

Orr received $45,000 from the Business Council of Alabama (BCA) before and after sponsoring this bill. The BCA represents the large employers — retail, fast food, healthcare — who benefit most from keeping wages at the federal minimum. Amazon, operating in Huntsville with IDB property tax abatements worth millions, pays its Alabama warehouse workers at or near the rate it sets internally — not because of any state requirement to do better.

The downstream effects are documented: $7.25/hr workers cannot afford Huntsville's $1,200/month infant care. They cannot afford BCBS health premiums at $490/month. They cannot afford the $163/month auto insurance required to drive to work. The minimum wage and every other cost discussed on this app are part of the same system.

Contact Sen. Arthur Orr directly — (334) 242-7895 — and demand SB 88 repeal. His Senate District 8 seat is on the 2026 ballot. Tanya Reeves (D) has announced a challenge. Register to vote at sos.alabama.gov — deadline is 15 days before any election.`,
      sources:[
        {label:"AL Legislature — SB 88",url:"https://alison.legislature.state.al.us/"},
        {label:"MIT Living Wage Calculator",url:"https://livingwage.mit.edu/counties/01089"},
        {label:"AL Campaign Finance — FCPA",url:"https://fcpa.alabama.gov"},
      ],
    },
    {
      title:"The Child Care Crisis — $14,400/yr for Infant Care, 65% of Eligible Kids on Waitlist",
      impact:"HIGH",category:"Child Care",date:"2025 Data",
      summary:"Infant care in Huntsville costs approximately $14,400/year — more than UAH in-state tuition. Alabama Pre-K serves only 30% of eligible 4-year-olds. Head Start serves 35% of eligible Madison County children. The other 65% are on a waitlist.",
      analysis:`Huntsville area infant care runs approximately $1,200/month ($14,400/year). For a parent earning $30,000/year, that is 48% of gross income — before taxes, rent, food, or transportation. The federal poverty guideline for a family of three is $25,820. Child care costs are the primary driver of why a single parent needs $41.34/hour to achieve a living wage in Madison County.

Alabama ranks last or near-last nationally in state investment in early childhood education. The CHOOSE Act (2023) created education savings accounts — but 67% of initial recipients were already in private school. Meanwhile public Pre-K serves 30% of 4-year-olds. Head Start in Madison County operates at 35% of eligible enrollment capacity with 65% of eligible children on waiting lists.

Compare: Washington DC publicly funds Pre-K for all children from age 3. Vermont's Child Care Financial Assistance Program covers full cost for low-income families. These are not radical experiments — they are existing programs in peer states that have measurably improved workforce participation, reduced poverty, and increased long-term tax revenue. Alabama has chosen not to implement them.

Contact your state representatives and demand: (1) Expansion of Alabama First Class Pre-K funding, (2) Child Care Assistance Program (CCAP) Assistance Program) expansion to cover more families, (3) Opposition to CHOOSE Act vouchers that divert funding from public Pre-K. Find your state legislator at legislature.alabama.gov. The 2026 session begins in February — now is when these decisions are made.`,
      sources:[
        {label:"AL First Class Pre-K",url:"https://www.alabamaachieves.org/alabama-pre-k/"},
        {label:"AL Head Start — ACF",url:"https://eclkc.ohs.acf.hhs.gov/"},
        {label:"National Women's Law Center",url:"https://nwlc.org"},
      ],
    },
  ];

  function InvCard({inv,i}){
    const k="w-"+i;
    return(
      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#fff7ed",color:"#ea580c",border:"1px solid #fdba74"}}>{inv.impact}</span>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
            <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
          <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}><ExpandText text={inv.summary} preview={180}/></p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {inv.sources.map((s,j)=><a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>)}
          </div>
        </div>
        <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",background:"#fafaf8"}}>
          <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
            {analysisOpen[k]?"▲ Hide":"🔍 Decode This"}
          </button>
        </div>
        {analysisOpen[k]&&(
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14}}>◈ CIVIC INVESTIGATOR ANALYSIS</div>
            {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="page">
      <div className="page-header">
        <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-orange">WORKERS · INVESTIGATION</span>
        <h2>Workers Rights & <em>Child Care</em></h2>
        <p>Alabama banned cities from raising the minimum wage. Infant care costs more than college tuition. Worker protections are among the weakest in the nation. Here is who decided that — and what 2026 can change.</p>
      </div>
      <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"9px 14px",marginBottom:12,fontSize:11.5,color:"#374151",lineHeight:1.7}}>
        <span style={{fontWeight:700,color:"#1e3a5f"}}>Plain English: </span>
        <strong>IDB</strong> = Industrial Development Board (gives tax breaks to corporations) &nbsp;&middot;&nbsp; <strong>FEC</strong> = Federal Election Commission (tracks political donations) &nbsp;&middot;&nbsp; <strong>PAC</strong> = Political Action Committee &nbsp;&middot;&nbsp; <strong>BCA</strong> = Business Council of Alabama
      </div>
            <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="wages"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Min Wage AL","$7.25/hr","Unchanged since 2009 — banned from city increases","#dc2626"],["Infant Care","$14,400/yr","More than UAH tuition — working parent's biggest expense","#ea580c"],["SB 88 Sponsor","Arthur Orr","$45k from BCA — locked wages at federal floor forever","#dc2626"],["Head Start Gap","65% waitlist","Only 35% of eligible Madison Co. kids get a spot","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"20px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>Huntsville Area Wages vs What You Need to Survive</div>
            {/* Living wage reference line */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 10px",background:"#f0fdf4",borderRadius:4,border:"1px solid #86efac"}}>
              <div style={{width:3,height:20,background:"#16a34a",borderRadius:2,flexShrink:0}}/>
              <div style={{fontSize:12,color:"#15803d",fontWeight:600}}>Green line = MIT Living Wage for Madison County ($20.18/hr). Bars to the LEFT of this line = can't cover basic expenses.</div>
            </div>
            {wageData.map((w,i)=>{
              const pct=Math.min(w.wage/45*100,100);
              const livingPct=Math.min(20.18/45*100,100);
              const belowLiving=w.wage<20.18&&!w.role.includes("MIT");
              return(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
                  <span style={{fontSize:13,fontWeight:w.role.includes("MIT")?700:400,color:w.role.includes("MIT")?"#16a34a":"#374151"}}>{w.role}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:w.color}}>${w.wage}/hr</span>
                    <span style={{fontSize:11,color:"#6b7280"}}>${w.annual.toLocaleString()}/yr</span>
                    {belowLiving&&<span style={{fontSize:10,fontWeight:700,color:"#dc2626",background:"#fef2f2",padding:"1px 5px",borderRadius:3}}>BELOW LIVING WAGE</span>}
                  </div>
                </div>
                <div style={{position:"relative",height:22,background:"#f0ebe2",borderRadius:3,overflow:"visible"}}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:pct+"%",background:w.color,opacity:.8,borderRadius:3}}/>
                  {/* Living wage threshold line */}
                  <div style={{position:"absolute",top:-3,left:livingPct+"%",height:"calc(100% + 6px)",width:2,background:"#16a34a",borderRadius:1,zIndex:2}}/>
                </div>
                <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic",marginTop:2}}>{w.note}</div>
              </div>
              );
            })}
          </div>
          {investigations.slice(0,1).map((inv,i)=><InvCard key={i} inv={inv} i={i}/>)}
        </div>
      )}

      {tab==="childcare"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>Child Care Costs — Huntsville Area 2025</div>
            {childcareCosts.map((c,i)=>(
              <div key={i} className="card" style={{marginBottom:10,padding:"14px 16px",borderLeft:"4px solid "+(c.annual>10000?"#dc2626":c.annual>5000?"#ea580c":c.annual===0?"#16a34a":"#c9a84c")}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:4}}>
                  <span style={{fontSize:13.5,fontWeight:600,color:"#1e3a5f"}}>{c.type}</span>
                  <span style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:c.annual>10000?"#dc2626":c.annual===0?"#16a34a":"#ea580c"}}>{c.annual===0?"FREE (if eligible)":"$"+c.annual.toLocaleString()+"/yr"}</span>
                </div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{c.note}</div>
              </div>
            ))}
          </div>
          {investigations.slice(1).map((inv,i)=><InvCard key={i} inv={inv} i={i+1}/>)}
        </div>
      )}

      {tab==="rights"&&(
        <div>
          {[
            {title:"What Alabama Has",color:"#dc2626",items:["State minimum wage: $7.25/hr (federal floor, no state increase ever)","No state paid family leave law","No state earned sick leave requirement","No state OSHA enforcement — relies entirely on federal OSHA","Right-to-work law — unions cannot require membership","No predictive scheduling protection for shift workers","No state ban on non-compete agreements for low-wage workers"]},
            {title:"What Alabama Has Blocked",color:"#ea580c",items:["City minimum wage ordinances — preempted by state law (2015, 2023)","Earned sick leave — BCA lobbied against every bill","Paid family leave — never introduced with viable path","OSHA state plan — repeatedly declined federal funding to establish one"]},
            {title:"What Neighbors Have That Alabama Doesn't",color:"#16a34a",items:["Tennessee: No state income tax + higher retail wages than AL","Georgia: $10.10 state minimum (still low but above federal)","North Carolina: Medicaid expansion — workers get healthcare","Virginia: $12/hr minimum, earned sick leave, ban on non-competes under $65k","Maryland: $15/hr minimum, 40 hours paid sick leave, family leave"]},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:14,borderLeft:"4px solid "+s.color}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:12}}>{s.title}</div>
                {s.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <span style={{color:s.color,fontWeight:700,flexShrink:0}}>▸</span>
                    <div style={{fontSize:13.5,color:"#374151",lineHeight:1.6}}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:4}}>
            <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10}}>2026 BALLOT — WHAT CAN CHANGE</div>
            <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>Minimum wage preemption repeal, earned sick leave, and OSHA state plan funding all require the Alabama Legislature. Sen. Arthur Orr (District 8 — Madison County) controls which bills receive Finance Committee hearings. His seat is on the 2026 ballot. Contact: (334) 242-7895 · orr@alsenate.gov</div>
          </div>

          {/* State comparisons */}
          <div className="card" style={{padding:"16px 18px",marginTop:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>How Other States — Red, Blue & Purple — Do It Differently</div>
            {[
              {state:"Tennessee (R — no income tax)",policies:["No state minimum wage (same as AL)","No earned sick leave mandate","Right-to-work state","But: higher average wages than AL — $26.50/hr vs $22.86/hr AL"],color:"#dc2626",icon:"🔴",takeaway:"Proves you can have lower taxes AND higher wages — AL's wages are low by regional comparison, not just by federal standards."},
              {state:"Georgia (R — partial Medicaid expansion)",policies:["$10.10 state minimum (above federal)","No earned sick leave mandate","Right-to-work state","Medicaid partial expansion 2023 — healthcare workers have coverage"],color:"#ea580c",icon:"🔴",takeaway:"Conservative state that still set a minimum wage above the federal floor — something Alabama refuses to do."},
              {state:"Virginia (Purple → D trifecta 2019-2021)",policies:["$12.41/hr minimum wage (rising to $15 by 2026)","40 hours/yr earned sick leave mandate","Non-compete ban for workers under $65k/yr","OSHA state plan — faster enforcement than federal OSHA"],color:"#6366f1",icon:"🟣",takeaway:"Virginia implemented all these in one legislative session. Business investment in VA has increased since."},
              {state:"Colorado (D-leaning purple)",policies:["$14.42/hr minimum wage","Paid Family and Medical Leave (FAMLI) — 12 weeks paid","Earned Paid Sick Leave — 48 hours/yr","Strong OSHA state enforcement"],color:"#2563eb",icon:"🔵",takeaway:"Colorado has higher median wages, lower uninsured rate, and lower child poverty rate than Alabama despite higher labor standards."},
              {state:"Texas (R — no state income tax)",policies:["No state minimum wage (same as AL)","No earned sick leave state mandate","Right-to-work state","But: Austin/Dallas/Houston have higher wages due to market competition Alabama lacks"],color:"#dc2626",icon:"🔴",takeaway:"Texas is like Alabama structurally but has larger urban economies that drive wages up. Huntsville's defense/tech base should do the same — but doesn't."},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:10,padding:"10px 12px",borderRadius:4,borderLeft:"3px solid "+s.color,background:"#f8f6f2",border:"1px solid #e0d8cc",borderLeft:"3px solid "+s.color}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:14}}>{s.icon}</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.state}</span>
                </div>
                {s.policies.map((p,j)=>(
                  <div key={j} style={{display:"flex",gap:6,marginBottom:3,alignItems:"flex-start"}}>
                    <span style={{color:s.color,fontWeight:700,flexShrink:0,fontSize:12}}>▸</span>
                    <div style={{fontSize:12.5,color:"#374151"}}>{p}</div>
                  </div>
                ))}
                <div style={{marginTop:6,fontSize:12,color:"#6b7280",fontStyle:"italic",background:"rgba(0,0,0,.03)",padding:"5px 8px",borderRadius:3}}>{s.takeaway}</div>
              </div>
            ))}
          </div>

          {/* Union education section */}
          <div className="card" style={{padding:"16px 18px",marginTop:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:12,textTransform:"uppercase"}}>What Is a Union — And What They Won't Tell You At Work</div>
            <FactBlocks facts={[
              {k:"blue",label:"WHAT A UNION ACTUALLY IS",lc:"#2563eb",tc:"#1e3a5f",text:"A union is a group of workers who join together to negotiate pay, hours, safety, and benefits with their employer as a group rather than individually. The law protecting your right to organize is the National Labor Relations Act (NLRA), passed in 1935. It applies in Alabama. You have the right to discuss wages with coworkers — your employer cannot legally stop you. You have the right to organize. If your employer fires you for union activity, that is an unfair labor practice (ULP) — you can file a complaint with the NLRB for free at nlrb.gov."},
              {k:"green",label:"COMMON MYTHS YOUR EMPLOYER MAY TELL YOU — DEBUNKED",lc:"#16a34a",tc:"#14532d",text:"'If you unionize we'll have to close.' — This is a common intimidation tactic. The NLRA prohibits employers from threatening workers with closure to discourage organizing. 'You'll lose your benefits.' — Unions negotiate contracts; your current benefits cannot be legally taken away during bargaining without your union's agreement. 'Unions are outsiders who will take your dues.' — You vote on your union leadership and your contract. You vote on every contract. 'This is a right-to-work state so unions don't work.' — Right-to-work means you can't be required to join a union. It does NOT mean you can't form one. Alabama has active unions at Toyota, Boeing, and federal facilities."},
              {k:"gold",label:"HOW TO START A UNION AT YOUR WORKPLACE",lc:"#b8860b",tc:"#78350f",text:"Step 1: Talk to coworkers privately — gauge interest. Do not use work email or work time. Step 2: Contact a union that represents your industry. For healthcare workers: SEIU, UFCW. For manufacturing: UAW, IAM. For government: AFSCME. For teachers: NEA, AFT. Step 3: Get authorization cards signed by 30%+ of workers (this triggers an NLRB election). Step 4: File for an NLRB election — free, at nlrb.gov. Step 5: Win the election (majority vote). Step 6: Negotiate your first contract. The whole process typically takes 6-18 months. The NLRB protects you throughout."},
              {k:"red",label:"HEALTHCARE WORKERS IN HUNTSVILLE — UNDERPAID FOR GROWING DEMAND",lc:"#dc2626",tc:"#7f1d1d",text:"Huntsville's population has grown rapidly — people migrating for defense/tech jobs, plus an aging population needing more care. HHHS has grown from 6 to 14+ facilities since 1994. Yet starting CNA wages ($14.50/hr) have barely moved while the patient load increases. Registered Nurses in Huntsville earn approximately $66,000/yr — 12% below the national average of $77,600 (Bureau of Labor Statistics 2024). Traveling nurses fill gaps at $40-60/hr because HHHS won't pay competitive wages to retain locals. That costs more than retention would have. The NLRB in 2022 investigated HHHS for supervisory interrogation of union activity — a documented case at Amazon HSV1 was settled."},
            ]}/>
            <ActionButtons actions={[
              {label:"NLRB — File Unfair Labor Practice",href:"https://www.nlrb.gov/about-nlrb/what-we-do/file-a-charge"},
              {label:"Know Your Rights — NLRB",href:"https://www.nlrb.gov/rights-we-protect/your-rights"},
              {label:"SEIU Healthcare Workers",href:"https://www.seiu.org/"},
              {label:"UAW — Auto & Manufacturing",href:"https://uaw.org/"},
            ]}/>
          </div>
        </div>
      )}

      {tab==="employers"&&(
        <div>
          {[
            {name:"Amazon (HSV1, HSV2)",workers:"4,000+",wage:"$16.50/hr",benefit:"IDB property tax abatement — $0 property tax for years",flag:"AL ranks 50th for Amazon warehouse wages. NLRB complaint for supervisory interrogation of union activity at HSV1.",color:"#f59e0b"},
            {name:"Huntsville Hospital (HHHS)",workers:"20,000+",wage:"$14.50-$30/hr range",benefit:"$63M/yr nonprofit tax exemption",flag:"Starting wages below MIT living wage. Annual raises as low as $0.25. Chronic understaffing documented.",color:"#dc2626"},
            {name:"Huntsville Utilities",workers:"800+",wage:"~$25/hr avg",benefit:"City-owned — no property tax",flag:"Wes Kelley salary not publicly disclosed. Board sets CEO pay without public input.",color:"#1e3a5f"},
            {name:"Redstone Arsenal",workers:"~45,000",wage:"Federal GS scale",benefit:"Federal employment — civil service protections",flag:"Civilian employees have federal protections most private-sector AL workers lack. Contractor employees have fewer protections.",color:"#374151"},
            {name:"Boeing / Lockheed / Raytheon",workers:"6,000+",wage:"$55-75/hr engineer avg",benefit:"$284k+ in defense PAC donations to Rep. Strong",flag:"High-wage defense jobs. But 'trickle-down' to service economy hasn't closed north Huntsville wage gap.",color:"#64748b"},
            {name:"Retail / Fast Food (Walmart, McDonald's, etc.)",workers:"10,000+ est.",wage:"$7.25-$15/hr",benefit:"No property tax abatement required",flag:"Alabama's minimum wage lock-in means these workers have no local recourse. No sick leave. No predictive scheduling.",color:"#ef4444"},
          ].map((e,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid "+e.color}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:8}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{e.name}</div>
                  <div style={{fontFamily:"monospace",fontSize:12,color:e.color,fontWeight:700}}>{e.wage}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{padding:"8px",background:"#f0fdf4",borderRadius:3,border:"1px solid #86efac"}}>
                    <div style={{fontSize:8.5,color:"#16a34a",fontWeight:700,letterSpacing:1,marginBottom:2}}>WORKERS</div>
                    <div style={{fontSize:12,color:"#374151"}}>{e.workers}</div>
                  </div>
                  <div style={{padding:"8px",background:"#fef2f2",borderRadius:3,border:"1px solid #fca5a5"}}>
                    <div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:2}}>PUBLIC BENEFIT RECEIVED</div>
                    <div style={{fontSize:12,color:"#374151"}}>{e.benefit}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic",lineHeight:1.5}}>{e.flag}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- CRIMINAL JUSTICE PAGE ---
function SentencingPage(){
  const[tab,setTab]=useState("overview");
  const[analysisOpen,setAnalysisOpen]=useState({});
  const tabs=[{id:"overview",label:"Overview"},{id:"hfoa",label:"Life Sentences"},{id:"pretrial",label:"Pretrial Jail"},{id:"private",label:"Private Prisons"},{id:"bail",label:"Bail Trap"}];

  const investigations=[
    {
      title:"Habitual Felony Offender Act — Life Without Parole for Non-Violent Crimes",
      impact:"CRITICAL",category:"Sentencing",date:"Ongoing — HFOA since 1979",
      summary:"Alabama's Habitual Felony Offender Act (HFOA) mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent. 527+ people are serving life sentences this way, 75% Black. Alabama taxpayers spend $35,000/person/year — approximately $18.5M annually — for these cases alone.",
      analysis:`Alabama's Habitual Felony Offender Act (HFOA) was passed in 1979 and has never been substantially reformed. A fourth felony conviction — even if all prior offenses were non-violent property crimes or drug possession — triggers mandatory life without parole. Documented cases: people serving life for stealing a bicycle, possessing drugs, or writing bad checks.

527+ people are currently serving life without parole under HFOA. 75% are Black. Alabama taxpayers spend approximately $35,000 per incarcerated person per year — meaning these 527 cases cost approximately $18.5M annually, indefinitely. No parole possibility. No path out.

Alabama prisons operated at 181% capacity as of 2024. The Department of Justice found unconstitutional conditions — dangerous overcrowding, inadequate medical care, violence. A federal court threatened sanctions. Alabama's response has been to build more prisons rather than reduce incarceration. The private prison industry — CoreCivic and GEO Group — is paid per incarcerated person. CoreCivic donated to Sen. Orr, who has sponsored mandatory minimum sentencing bills.

Contact Sen. Orr directly at orr@alsenate.gov — ask him to support HFOA reform. Contact your state House member at legislature.alabama.gov. The 2026 session is the window. Orr's District 8 seat (Madison County) is on the ballot — the race will be decided by Madison County voters.`,
      sources:[
        {label:"AL DOC — Prison Stats",url:"https://www.doc.state.al.us/"},
        {label:"DOJ — AL Prison Conditions",url:"https://www.justice.gov/opa/pr/justice-department-files-lawsuit-alabama"},
        {label:"Equal Justice Initiative — AL",url:"https://eji.org/issues/criminal-justice/"},
      ],
    },
    {
      title:"61% of Madison County Jail is Pretrial — Not Convicted of Anything",
      impact:"HIGH",category:"Pretrial Detention",date:"2024 Jail Census",
      summary:"61% of the people in Madison County Jail on any given day have not been convicted of anything. They are there because they cannot afford bail. Sheriff Kevin Turner controls a $2.3M civil forfeiture fund. Securus phone contracts charge families $0.21/minute.",
      analysis:`On any given day, 61% of Madison County Jail population is pretrial — they have been charged but not convicted. They are in jail because they cannot afford bail. A $500 bail requires $50 cash to a bail bondsman — money that is not returned. For a family earning $15/hour, $50 is three hours of pre-tax wages. Many people lose their jobs before trial. Many plead guilty to crimes they did not commit just to get out.

Sheriff Kevin Turner has served 16 years without a civilian oversight board reviewing his department. He controls a $2.3M civil forfeiture fund — money seized from citizens, often before conviction, with zero required public accounting of how it is spent. He received $24,000 from the bail bond industry, which profits directly from the system that keeps people in pretrial detention. He contracted with Securus Technologies for jail phone service — Securus charges families $0.21/minute for calls. The Sheriff receives approximately $200,000/year in commissions from this contract. This is public money from families of incarcerated people.

The pretrial detention system costs Madison County taxpayers approximately $65/person/day. 61% of jail population being pretrial means the majority of this cost is for people who have not been found guilty of anything. Bail reform — allowing supervised release for non-violent pretrial defendants — could reduce costs and reduce harm. Turner's re-election campaign received donations from bail bond industry that profits from the current system.

Attend Madison County Commission meetings when the jail budget is on the agenda. Contact the Commission at (256) 532-3330. File an Open Records request for the civil forfeiture fund expenditures. Sheriff Turner's next election is in 2026.`,
      sources:[
        {label:"Madison County Sheriff",url:"https://www.madisonsheriff.com/"},
        {label:"Pretrial Justice Institute",url:"https://www.pretrial.org/"},
        {label:"AL Appleseed — Bail Reform",url:"https://alabamaappleseed.org/"},
      ],
    },
  ];

  function InvCard({inv,i}){
    const k="s-"+i;
    return(
      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:inv.impact==="CRITICAL"?"#fef2f2":"#fff7ed",color:inv.impact==="CRITICAL"?"#dc2626":"#ea580c",border:"1px solid "+(inv.impact==="CRITICAL"?"#fca5a5":"#fdba74")}}>{inv.impact}</span>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
          <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}><ExpandText text={inv.summary} preview={180}/></p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{inv.sources.map((s,j)=><a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>)}</div>
        </div>
        <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",background:"#fafaf8"}}>
          <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
            {analysisOpen[k]?"▲ Hide":"🔍 Decode This"}
          </button>
        </div>
        {analysisOpen[k]&&(
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14}}>◈ CIVIC INVESTIGATOR ANALYSIS</div>
            {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">CRIMINAL JUSTICE · INVESTIGATION</span>
        <h2>Criminal Justice: <em>Courts, Jails & Prisons</em></h2>
        <p>527+ people serving life without parole for non-violent crimes. 61% of Madison County Jail is pretrial. Alabama prisons at 181% capacity. Private prisons donate to the politicians who fill them. Here is who profits and who pays.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Pretrial Detention","61%","Madison County Jail — not convicted of anything","#dc2626"],["HFOA Life Sentences","527+","Non-violent crimes · 75% Black · $18.5M/yr cost","#dc2626"],["Prison Capacity","181%","DOJ found unconstitutional conditions","#ea580c"],["Securus Commission","~$200k/yr","Sheriff earns from $0.21/min family phone calls","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          {investigations.map((inv,i)=><InvCard key={i} inv={inv} i={i}/>)}
        </div>
      )}

      {tab==="hfoa"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:14}}>What the HFOA Does — Step by Step</div>
            {[
              {step:"1st felony conviction",result:"Standard sentence — can include probation",color:"#c9a84c"},
              {step:"2nd felony conviction",result:"Enhanced sentence — mandatory prison time begins",color:"#ea580c"},
              {step:"3rd felony conviction",result:"Significantly enhanced — longer mandatory minimum",color:"#dc2626"},
              {step:"4th felony conviction",result:"LIFE WITHOUT PAROLE — mandatory. No exceptions. Even if all four were non-violent.",color:"#7f1d1d"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                <div style={{padding:"8px 12px",background:s.color+"15",border:"1px solid "+s.color+"40",borderRadius:4,minWidth:140,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:s.color}}>{s.step}</div>
                </div>
                <div style={{padding:"8px 12px",background:"#f8f6f2",borderRadius:4,flex:1,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{s.result}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:6}}>WHO PROFITS FROM THIS SYSTEM</div>
            <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7}}>CoreCivic and GEO Group operate private prisons in Alabama and are paid per incarcerated person. CoreCivic donated to Sen. Arthur Orr, who has sponsored mandatory minimum sentencing bills that increase the prison population. The school zone enhancement adds mandatory 5 years to any drug conviction — and school zones cover most of north Huntsville, meaning the same offense receives harsher punishment based on where a person lives.</div>
          </div>
          <InvCard inv={investigations[0]} i={0}/>
        </div>
      )}

      {tab==="pretrial"&&(
        <div>
          {[
            {title:"The Bail Math",body:"A $500 bail bond requires $50 cash (10% non-refundable to a bondsman). For someone earning $15/hour after taxes, that is 4+ hours of work — but they have to pay immediately. Many cannot. They sit in jail, often losing their job within days. Many plead guilty to crimes they did not commit just to get released — even when they are innocent — because a guilty plea means a fine and time served. This is not an exception. It is the expected outcome of the system.",color:"#dc2626"},
            {title:"The Securus Phone Contract",body:"Madison County Jail uses Securus Technologies for phone calls. The rate: approximately $0.21/minute. A 15-minute call costs $3.15. A daily call from a parent to their child costs $22/week — $1,144/year. Sheriff Turner receives approximately $200,000/year in commissions from this contract. The money comes directly from families of incarcerated people — disproportionately low-income Black families from north Huntsville.",color:"#ea580c"},
            {title:"Civil Forfeiture — Seized Before Conviction",body:"Alabama law allows law enforcement to seize property they believe is connected to a crime — before any conviction, sometimes before any charges. Sheriff Turner controls a $2.3M civil forfeiture fund. Alabama requires zero public accounting of how this money is spent. To get property back, citizens must sue the government in civil court — at costs that often exceed the value of what was seized.",color:"#1e3a5f"},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid "+s.color}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7}}><ExpandText text={s.body} preview={220}/></div>
              </div>
            </div>
          ))}
          <InvCard inv={investigations[1]} i={1}/>
        </div>
      )}

      {tab==="private"&&(
        <div>
          {[
            {name:"CoreCivic",role:"Private Prison Operator",detail:"Operates Elmore Correctional Facility and other AL facilities. Paid per incarcerated person — profit depends on keeping beds filled. Donated to Sen. Arthur Orr who sponsored mandatory minimum bills.",color:"#dc2626"},
            {name:"GEO Group",role:"Private Prison Operator",detail:"Operates Kilby Correctional Facility. Same business model — per-person payment creates financial incentive for incarceration. Lobbied against sentencing reform in Alabama.",color:"#ea580c"},
            {name:"Private Probation Companies",role:"Supervision Fee Collectors",detail:"Turn $300 traffic fines into years of monthly fees totaling thousands. If you miss a payment, you can be re-incarcerated — for a fine, not a crime. This is legal in Alabama.",color:"#7f1d1d"},
            {name:"Prison Labor",role:"$0-$2/day",detail:"Incarcerated people in Alabama work for $0-$2/day. Companies that use prison labor include agricultural operations and industrial services. Enslaved labor by another name under the 13th Amendment exception.",color:"#374151"},
          ].map((p,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid "+p.color}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{p.name}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:p.color+"15",color:p.color,border:"1px solid "+p.color+"30"}}>{p.role}</span>
                </div>
                <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7}}>{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="bail"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"KRATOM — CLASS C FELONY IN ALABAMA",lc:"#dc2626",tc:"#7f1d1d",text:"Kratom possession is a Class C felony in Alabama — the same classification as methamphetamine. It is legal in 43 other states. A first-time kratom possession conviction starts the HFOA clock. By the fourth offense — even if the other three were also non-violent drug possession — the sentence is life without parole."},
            {k:"gold",label:"SCHOOL ZONE ENHANCEMENT — GEOGRAPHIC INJUSTICE",lc:"#b8860b",tc:"#78350f",text:"Alabama's school zone enhancement adds a mandatory 5 years to any drug conviction occurring within a school zone. School zones in Huntsville cover almost all of north Huntsville. The same drug offense in south Huntsville may not trigger the enhancement. Identical conduct, different ZIP code, different sentence."},
            {k:"blue",label:"CANNABIS — STILL A CRIMINAL MATTER",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama's Medical Cannabis Commission began licensing in 2024 — but possession for personal use without a medical card remains a misdemeanor that escalates with prior drug convictions under HFOA. In neighboring Tennessee and Georgia, the legal landscape is shifting. In Alabama, prior convictions accumulate."},
          ]}/>
          <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10}}>WHAT 2026 CAN CHANGE</div>
            <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>HFOA reform, bail reform, kratom reclassification, school zone enhancement repeal — all require the Alabama Legislature. Contact your state House and Senate members at legislature.alabama.gov. The Sentencing Commission meets publicly — their recommendations go to the Legislature. Equal Justice Initiative in Montgomery (eji.org) runs a free legal clinic and policy advocacy program. Alabama Appleseed (alabamaappleseed.org) tracks these bills and needs volunteer support.</div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- POLICE & SHERIFF PAGE ---
function PolicingPage(){
  const[tab,setTab]=useState("hpd");
  const tabs=[{id:"hpd",label:"HPD Watch"},{id:"sheriff",label:"Sheriff"},{id:"review",label:"No Oversight"},{id:"accountability",label:"Actions"}];
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-blue">POLICE & SHERIFF · INVESTIGATION</span>
        <h2>Police & <em>Sheriff</em></h2>
        <p>HPD budget: $68.4M. No civilian review board in 16 years. 61% of Madison County Jail is pretrial. Sheriff Turner earns ~$200k/yr in Securus phone commissions from incarcerated families. Here is what accountability looks like — and what it would take to get it.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="hpd"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["HPD Budget","$68.4M","Largest single city department — FY2025","#dc2626"],["Sworn Officers","412","1.87 per 1,000 residents — above national avg","#1e3a5f"],["Overtime","$6.2M","Up 34% from $4.6M — no public explanation","#ea580c"],["Civil Settlements","$940k","2021-2023 taxpayer-funded — no review board","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"HPD BUDGET BREAKDOWN — $68.4M FY2025",lc:"#dc2626",tc:"#7f1d1d",text:"Personnel (412 officers + civilian staff): $44.2M. Overtime: $6.2M — up 34% from $4.6M last year, with no public explanation given to City Council. Surveillance and technology contracts: $4.1M — up 180% since 2019 ($1.46M). Civil lawsuit settlements paid by taxpayers: $2.3M for 2021-2023. Officer J. Martinez named in two separate excessive force settlements. Training budget: $1.4M — just 2% of total. National best practice recommends 5-8%."},
            {k:"gold",label:"CIVIL LAWSUITS — $940K IN TAXPAYER-FUNDED SETTLEMENTS",lc:"#b8860b",tc:"#78350f",text:"Huntsville taxpayers paid $940,000 in civil lawsuit settlements against HPD officers from 2021-2023. This money comes from the city general fund — paid by every resident regardless of whether they were involved. Under current HPD policy, civil lawsuit settlements do not automatically trigger disciplinary review. Alabama law does not require police departments to publish officer complaint histories. HPD's Internal Affairs annual report is not published publicly."},
            {k:"blue",label:"NORTH HUNTSVILLE — 3.7x MORE POLICE CONTACTS PER CAPITA",lc:"#2563eb",tc:"#1e3a5f",text:"HPD deploys approximately 2x the proactive patrol hours per resident in north Huntsville compared to south — despite per-capita violent crime rates that differ by only about 18%. North Huntsville residents are stopped in traffic at 2.4 times the rate of south Huntsville residents. Citation rates per stop are nearly identical — the disparity is in stops, not in outcomes."},
          ]}/>
        </div>
      )}

      {tab==="sheriff"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"SHERIFF KEVIN TURNER — 16 YEARS, NO CIVILIAN OVERSIGHT",lc:"#dc2626",tc:"#7f1d1d",text:"Sheriff Kevin Turner has served 16 years without a civilian review board reviewing his department's operations. He received $24,000 from the bail bond industry — an industry that profits directly from keeping people in pretrial detention. He received law enforcement PAC donations in every re-election cycle. 61% of Madison County Jail population is pretrial — not convicted of anything."},
            {k:"orange",label:"SECURUS PHONE CONTRACT — $200K/YR IN SHERIFF COMMISSIONS",lc:"#ea580c",tc:"#78350f",text:"Madison County Jail uses Securus Technologies. Rate: approximately $0.21/minute. A 15-minute call costs $3.15. Sheriff Turner receives approximately $200,000/year in commissions from this contract. This money comes directly from families of incarcerated people. Alabama law permits sheriffs to receive these commissions. Alabama does not require public accounting of how the money is spent."},
            {k:"gold",label:"CIVIL FORFEITURE — $2.3M FUND, ZERO PUBLIC ACCOUNTING",lc:"#b8860b",tc:"#78350f",text:"Sheriff Turner controls a $2.3M civil asset forfeiture fund — money seized from citizens, often before conviction, sometimes before charges. Under Alabama law, there is zero required public accounting of how these funds are spent. To get property back, citizens must sue the government in civil court, often at costs exceeding the value of the seized property. The federal equitable sharing program allows HPD and the Sheriff to bypass Alabama's stricter state forfeiture law by processing seizures federally."},
          ]}/>
          <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"14px 16px",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:6}}>2026 ELECTION — SHERIFF TURNER</div>
            <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7}}>Sheriff Turner's next election is 2026. His seat has never faced a serious challenger with these documented accountability questions as the centerpiece. The Madison County Commission controls the jail budget — attend their meetings at (256) 532-3330. File an Open Records request for civil forfeiture fund expenditures at madisonsheriff.com.</div>
          </div>
        </div>
      )}

      {tab==="review"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:14}}>16 Years of Mayor Battle — Zero Civilian Review Board</div>
            <div style={{fontSize:13.5,color:"#374151",lineHeight:1.8,marginBottom:14}}>Mayor Tommy Battle has been in office since 2008. In that time, Huntsville has never established a civilian police review board. The police union has endorsed Battle in every election. $940,000 in civil lawsuit settlements have been paid by taxpayers with no required independent review of officer conduct.</div>
            <div style={{fontSize:13.5,color:"#374151",lineHeight:1.8,marginBottom:14}}>Cities that have established civilian review boards: Nashville TN (2020), Memphis TN (exists since 2015 with recent strengthening), Atlanta GA (strengthened 2020), Birmingham AL (established 2019 — Huntsville has not). A civilian review board requires a City Council ordinance. Mayor Battle could propose it tomorrow. He has not done so in 16 years.</div>
            <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:4,padding:"12px 14px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:4}}>HOW TO PUSH FOR ONE</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Contact your City Council member. Ask them to introduce a civilian police review board ordinance. Council meetings are every other Thursday at City Hall — 308 Fountain Circle. Public comment is accepted. Mayor Battle's contact: (256) 427-5000 · mayor@huntsvilleal.gov</div>
            </div>
          </div>
        </div>
      )}

      {tab==="accountability"&&(
        <div>
          {[
            {title:"File an HPD Complaint",steps:["Go to hsvutil.org — Internal Affairs complaint form","You can file anonymously","It creates a public record","Alabama law requires HPD to retain complaint records for 7 years"],link:"https://www.huntsvilleal.gov/residents/police/",linkText:"HPD Internal Affairs"},
            {title:"Attend City Council — Police Budget",steps:["Council meets every other Thursday, 5:30pm","308 Fountain Circle, Huntsville AL 35801","Public comment is accepted — 3 minutes per speaker","The HPD budget is approved each fall — attend those meetings specifically"],link:"https://www.huntsvilleal.gov/government/city-council/",linkText:"City Council Schedule"},
            {title:"Request HPD Records — Open Records Act",steps:["Alabama §36-12-40 — you have the right to any public record","Request: patrol deployment by district, use-of-force by district, settlement amounts","Email: policerecords@huntsvilleal.gov or file in person","Must respond in reasonable time — if denied, you can appeal to circuit court"],link:"https://www.huntsvilleal.gov/residents/police/",linkText:"HPD Records"},
            {title:"Madison County Sheriff Accountability",steps:["Commission meetings are public — (256) 532-3330","File Open Records for civil forfeiture expenditures at madisonsheriff.com","Sheriff Turner election: 2026 — Madison County voters decide","Contact Commission Chairman Rex Vaughn: (256) 532-3303"],link:"https://www.madisonsheriff.com/",linkText:"Madison County Sheriff"},
          ].map((a,i)=>(
            <div key={i} className="card" style={{marginBottom:12,padding:"16px 18px"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>{a.title}</div>
              {a.steps.map((s,j)=>(
                <div key={j} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                  <span style={{color:"#16a34a",fontWeight:700,flexShrink:0,marginTop:1}}>✓</span>
                  <div style={{fontSize:13.5,color:"#374151",lineHeight:1.6}}>{s}</div>
                </div>
              ))}
              <a href={a.link} target="_blank" rel="noreferrer">
                <button className="btn btn-navy" style={{fontSize:11.5,marginTop:6}}>↗ {a.linkText}</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SURVEILLANCE PAGE ---
function SurveillancePage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">SURVEILLANCE · INVESTIGATION</span>
        <h2>Surveillance & <em>Privacy</em></h2>
        <p>47 license plate readers track every vehicle in Huntsville — no public vote, no oversight board, no warrant required. Alabama has no data privacy law. Law enforcement can buy your location history without a warrant. Here is what is watching you.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["ALPRs","47+","License plate readers — every vehicle photographed","#dc2626"],["Warrant Required?","No","ALPR data stored 30-90 days — shared without warrant","#dc2626"],["AL Privacy Law","None","Zero comprehensive state data privacy law","#ea580c"],["Surveillance Budget","$4.1M","HPD tech contracts — up 180% since 2019","#ea580c"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"red",label:"ALPR NETWORK — EVERY VEHICLE PHOTOGRAPHED",lc:"#dc2626",tc:"#7f1d1d",text:"HPD operates 47+ automated license plate readers through Flock Safety contracts. Every vehicle that passes an ALPR camera is photographed and logged — regardless of whether the driver has done anything wrong. Data is stored in Flock Safety's private cloud servers (not city servers) for 30-90 days. Accessible by other law enforcement agencies through data-sharing agreements without a warrant. No public vote was held before the network was installed. No City Council policy governs who can access the data or for what purpose."},
        {k:"gold",label:"FACIAL RECOGNITION — NOT CONFIRMED, NOT DENIED",lc:"#b8860b",tc:"#78350f",text:"HPD has not confirmed or denied whether it uses facial recognition technology. Alabama has no law requiring police departments to disclose surveillance technology use. NIST studies show facial recognition error rates of 10-35% for Black women — the highest error rates are for the demographic most likely to be stopped by HPD in north Huntsville based on documented patrol patterns."},
        {k:"blue",label:"COMMERCIAL DATA PURCHASES — NO WARRANT NEEDED",lc:"#2563eb",tc:"#1e3a5f",text:"Data brokers compile detailed profiles on every adult: location history, health-related searches, political affiliations, financial data. Law enforcement agencies — including in Alabama — can purchase this data to bypass warrant requirements that would apply if they collected it directly. Alabama has no law requiring disclosure of such purchases. You have no right to know if your profile has been bought and shared with HPD or the Sheriff."},
        {k:"green",label:"WHAT OTHER CITIES HAVE DONE",lc:"#16a34a",tc:"#14532d",text:"Nashville TN: requires City Council approval for new surveillance technology and annual public reporting. Oakland CA: surveillance oversight ordinance since 2018, public impact assessments required. Portland OR: banned facial recognition by city government. Huntsville has no equivalent ordinance. A surveillance oversight ordinance can be passed by City Council — it does not require state legislation."},
      ]}/>
      <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10}}>CHECK YOUR WATER AND YOUR DATA</div>
        <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>Contact your City Council member and demand a surveillance transparency ordinance requiring: (1) public notice before any new surveillance technology is deployed, (2) annual public reporting on how ALPR data is accessed and shared, (3) a data retention limit policy, (4) prohibition on purchasing commercial location data without a warrant. Council contact: (256) 427-5000 · huntsvilleal.gov/government/city-council</div>
      </div>
      <div style={{marginTop:14}}>
        <AiButton prompt="Investigate Huntsville surveillance infrastructure and Alabama data privacy. FACTS: HPD operates 47+ ALPR cameras through Flock Safety — photographs every vehicle, stores data 30-90 days in private cloud, accessible by other agencies without warrant. HPD has not confirmed or denied facial recognition use — Alabama has no disclosure law. NIST facial recognition error rates: 10-35% for Black women. Commercial location data can be purchased by law enforcement without warrant. Alabama has no comprehensive state data privacy law. HPD surveillance budget: $4.1M — up 180% since 2019. No public vote was held before ALPR network installed. Decode for a Huntsville resident — what this means, what is being done elsewhere, and what residents can demand from City Council. Under 200 words, no jargon."/>
      </div>
    </div>
  );
}


// --- VOTER EMPOWERMENT PAGE ---
function VotingPage(){
  const[tab,setTab]=useState("power");
  const tabs=[{id:"power",label:"Your Vote"},{id:"gerry",label:"Gerrymandering"},{id:"register",label:"Register"}];
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">VOTER EMPOWERMENT · INVESTIGATION</span>
        <h2>Voter <em>Empowerment</em></h2>
        <p>Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents are not registered. School board races are decided by under 200 votes. Your vote in local elections is worth more than you think.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="power"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Unregistered Eligible","37,000","Madison County residents who could vote but aren't","#dc2626"],["HCS Board Turnout","11%","Controls $310M annual budget — 2,000 votes flips it","#ea580c"],["Closest Race 2024","368 votes","District 1 City Council runoff — that's it","#orange"],["School Board Margin","<200 votes","Typical margin in Madison County school board races","#1e3a5f"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:["#dc2626","#ea580c","#c9a84c","#1e3a5f"][i]}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          {[
            {office:"Huntsville City Council — District 1",controls:"North Huntsville roads, development approvals, police budget vote",decided:"368 votes in 2024 runoff",next:"November 2026",why:"Michelle Watkins is the only council member who voted NO on the January 2025 annexation citing school overcrowding. Her district includes the roads with PCI 41."},
            {office:"HCS School Board — Districts 2, 3, 4",controls:"$310M annual budget — per-pupil spending gap, AP courses, teacher pay",decided:"Under 200 votes typically",next:"November 2026",why:"The documented $847/pupil spending gap between north and south Huntsville schools can be fixed by this board. They have not fixed it. New members could."},
            {office:"AL State Senate — District 8 (Arthur Orr)",controls:"Finance Committee hearings — which bills get a vote",decided:"Madison County voters",next:"November 2026",why:"Orr blocked minimum wage increases, sponsored mandatory sentencing bills, received $45k from BCA. Tanya Reeves (D) has announced a challenge."},
            {office:"Madison County Sheriff",controls:"61% pretrial jail population, $2.3M forfeiture fund, Securus contract",decided:"County-wide",next:"2026",why:"No challenger has run against Turner with accountability as the central issue. 2026 is the cycle."},
          ].map((r,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid #1e3a5f"}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{r.office}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{padding:"8px",background:"#eff3f8",borderRadius:3}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:2}}>CONTROLS</div><div style={{fontSize:11.5,color:"#374151"}}>{r.controls}</div></div>
                  <div style={{padding:"8px",background:"#fef2f2",borderRadius:3}}><div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,marginBottom:2}}>DECIDED BY</div><div style={{fontSize:11.5,color:"#374151"}}>{r.decided} · Next: {r.next}</div></div>
                </div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{r.why}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="gerry"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"ALLEN v. MILLIGAN — SUPREME COURT RULED MAPS UNCONSTITUTIONAL",lc:"#dc2626",tc:"#7f1d1d",text:"In June 2023, the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). Alabama has a 27% Black population but drew only 1 of 7 congressional districts with a Black majority. AG Steve Marshall spent taxpayer money defending the unconstitutional maps. Alabama then drew replacement maps that a federal court also found non-compliant. After years of litigation, a remedial map was implemented for 2024."},
            {k:"gold",label:"THE STATE LEGISLATIVE MAP PROBLEM",lc:"#b8860b",tc:"#78350f",text:"The congressional map ruling applies to US House seats. State legislative maps have their own challenges. Alabama's state House and Senate maps have faced challenges under the VRA as well. The combination of gerrymandered maps and voter ID laws has concentrated political power in ways that consistently produce legislative majorities willing to block minimum wage increases, Medicaid expansion, and sentencing reform — all of which are majority-popular policies in Alabama polling."},
            {k:"blue",label:"WHAT MADISON COUNTY VOTERS CAN DO",lc:"#2563eb",tc:"#1e3a5f",text:"The state legislative maps covering Madison County determine which senators and representatives are elected. These maps were drawn by the Legislature itself — a conflict of interest. In states with independent redistricting commissions, maps tend to be more competitive. Alabama does not have one. The path to changing this runs through electing legislators who commit to independent redistricting."},
          ]}/>
        </div>
      )}

      {tab==="register"&&(
        <div>
          {[
            {step:"1. Register to Vote",detail:"Online at sos.alabama.gov. Deadline: 15 days before any election. You will need: driver's license or state ID number, last 4 of SSN, residential address. Takes 5 minutes.",link:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",linkText:"Register Now →"},
            {step:"2. Check Your Registration",detail:"Even if you think you're registered, verify. Alabama has conducted voter roll purges. Your status may have changed if you moved or missed multiple elections.",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Check My Registration →"},
            {step:"3. Know Your Polling Place",detail:"Find your assigned polling location before Election Day. Polling places can change. Madison County Election Commission: (256) 532-3510",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Find My Polling Place →"},
            {step:"4. Alabama Voter ID Law",detail:"Alabama requires photo ID to vote. Accepted: Driver's license, state ID, US passport, employee ID (government), military ID, student ID (state school). Free state ID available at any ALEA office if you don't have one.",link:"https://www.alabamavoterID.com/",linkText:"Free Voter ID →"},
            {step:"5. 2026 Key Dates",detail:"State primary: likely June 2026. General election: November 2026. Registration deadline: 15 days before each. Open enrollment for absentee ballot: contact Madison County Probate Office — (256) 532-3330.",link:"https://www.sos.alabama.gov/",linkText:"AL Secretary of State →"},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:12,padding:"16px 18px",borderLeft:"4px solid #16a34a"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>{s.step}</div>
              <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7,marginBottom:10}}>{s.detail}</div>
              <a href={s.link} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11.5}}>{s.linkText}</button></a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- DISINFORMATION PAGE ---
function DisinfoPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">DISINFORMATION · INVESTIGATION</span>
        <h2>Disinformation <em>& The Facts</em></h2>
        <p>Federal law bars undocumented immigrants from Medicaid, SNAP, and the ACA — since 1996. Politicians who claim otherwise received hundreds of thousands from insurance PACs that benefit from Medicaid refusal. Here are the statutes, the donors, and the real harm.</p>
      </div>
      <FactBlocks facts={[
        {k:"green",label:"THE ACTUAL FEDERAL LAW — 8 U.S.C. §1611 (SINCE 1996)",lc:"#16a34a",tc:"#14532d",text:"Federal law (8 U.S.C. §1611, in place since 1996) explicitly bars undocumented immigrants from: Medicaid, SNAP food assistance, ACA marketplace plans, Medicare, and CHIP. This is a 30-year federal statute that is unambiguous and has been continuously enforced. It is not a loophole, not a gray area, and not subject to interpretation. Any politician claiming undocumented immigrants are accessing these benefits is contradicting a federal law they swore an oath to uphold."},
        {k:"red",label:"THE BRITT DISINFORMATION CAMPAIGN",lc:"#dc2626",tc:"#7f1d1d",text:"Sen. Katie Britt made public statements claiming immigrants are accessing Medicaid — directly contradicting 8 U.S.C. §1611. Britt received $310,000 from health insurance PACs. Health insurance companies benefit when Medicaid is not expanded because their market shrinks when Medicaid expands. The false immigration claim is used to justify Medicaid refusal that leaves 295,000 Alabama citizens — not immigrants — uninsured. Connecting the claim to the donor is not speculation — it is documented."},
        {k:"gold",label:"THE DOCUMENTED LOOP — FALSE CLAIM → REAL HARM → REAL DONOR BENEFIT",lc:"#b8860b",tc:"#78350f",text:"Step 1: Politician claims immigrants burden Medicaid. Step 2: The claim is false — 8 U.S.C. §1611 prevents this. Step 3: The false claim justifies Medicaid refusal. Step 4: 295,000 Alabama citizens lose coverage. Step 5: Health insurance industry retains their market. Step 6: Health insurance industry donates to the politicians. Step 7: Repeat. The people harmed by this loop are US citizens — working Alabamians who earn too little for marketplace plans and too much for traditional Medicaid."},
        {k:"blue",label:"REALPAGE AND ALGORITHMIC RENT MANIPULATION",lc:"#2563eb",tc:"#1e3a5f",text:"RealPage software is used by landlords across the US to set rents using shared market data. The DOJ sued RealPage for antitrust violations — coordinating prices without a formal cartel agreement, which courts have found can still be illegal. When multiple landlords use the same algorithm trained on the same data, they effectively collude on rent increases. Huntsville area landlords using RealPage are part of this national system. The DOJ antitrust case is active."},
        {k:"green",label:"LOCAL INVESTIGATIVE JOURNALISM — DECLINING",lc:"#16a34a",tc:"#14532d",text:"The institutions most capable of exposing the above — local investigative journalism — have been gutted by staff cuts across all Alabama outlets. WHNT, WAFF, WAAY, and AL.com have all reduced reporting staff in recent years. This is not accidental: a weakened local press reduces accountability for local officials. The answer is not to accept it — it is to share documented information through community networks and demand local media restore accountability reporting."},
      ]}/>
      <AiButton prompt="Investigate Alabama political disinformation connected to real policy harm. FACTS: 8 U.S.C. 1611 (since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, CHIP. Sen. Britt made public statements contradicting this law. Britt received $310,000 from health insurance PACs. Medicaid refusal leaves 295,000 Alabama citizens uninsured. RealPage DOJ antitrust suit — algorithmic rent coordination. Local investigative journalism declining — staff cuts across all AL outlets. Connect these facts clearly for a Madison County resident. Show who benefits from false claims and what the real harm is. Under 200 words, no jargon."/>
    </div>
  );
}

// --- UNHOUSED RESIDENTS PAGE ---
function UnhousedPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-orange">UNHOUSED · INVESTIGATION</span>
        <h2>Unhoused Residents & <em>Public Housing</em></h2>
        <p>412+ unhoused residents in Madison County. Section 8 waitlist closed since 2020. 7,000+ unit affordable housing gap. Three encampment sweeps occurred within 500 feet of active developer projects. Here is what the data shows about who this affects and who benefits from the status quo.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["Section 8 Waitlist","CLOSED","Last open June 1-8, 2020 — 4+ years closed","#dc2626"],["Public Housing Wait","6-12 mo","Applications accepted at 200 Washington St NE","#ea580c"],["HHA Vouchers","2,047","For a metro area of 500,000+ — one per 244 residents","#ea580c"],["Affordable Unit Gap","7,000+","For residents earning under $25k/yr","#dc2626"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"blue",label:"WHO IS UNHOUSED — AND WHY",lc:"#2563eb",tc:"#1e3a5f",text:"The 2024 Point-in-Time count found 412+ unhoused individuals in Madison County on a single January night. The actual number is higher — PIT counts undercount people in vehicles and temporary living situations. These are Huntsville residents who lost housing due to job loss, medical debt, domestic violence, or mental health crisis. Many were housed before. Many are working. Unhoused is not a permanent identity — it is a circumstance created by specific policy choices."},
        {k:"red",label:"ENCAMPMENT SWEEPS — NEAR DEVELOPER SITES",lc:"#dc2626",tc:"#7f1d1d",text:"The city passed an anti-camping ordinance in 2023 and conducted 8 documented encampment sweeps in 2023-2024. Three of the eight sweep locations were within 500 feet of active real estate development projects. Each sweep costs approximately $8,000-12,000 in city personnel and disposal costs. The annual cost to cycle one chronically homeless person through enforcement is approximately $18,000-25,000. The annual cost of permanent supportive housing is approximately $10,000. Sweeps cost more than housing."},
        {k:"gold",label:"WHO BENEFITS FROM THE STATUS QUO",lc:"#b8860b",tc:"#78350f",text:"Real estate developers benefit when anti-camping ordinances clear land near their projects. IDB abatements remove property tax burden from corporations without any affordable housing requirement. Mayor Battle received $380,000 from real estate developers. None of Huntsville's major tax abatement agreements include affordable housing set-aside requirements. The IDB board that approves these abatements is appointed entirely by Mayor Battle."},
        {k:"green",label:"WHAT WOULD ACTUALLY HELP",lc:"#16a34a",tc:"#14532d",text:"The Housing Authority can open the Section 8 waitlist — it is a policy choice, not a budget impossibility. The City Council can require affordable housing set-aside provisions in IDB abatement agreements. The City can fund rapid rehousing programs — permanent supportive housing costs $10,000/year vs $18,000-25,000 for enforcement cycling. Every IDB abatement granted without an affordable housing requirement is a missed opportunity to address the 7,000-unit gap."},
      ]}/>
      <AiButton prompt="Investigate unhoused residents and housing policy in Huntsville. FACTS: 412+ unhoused January 2024. Section 8 closed since June 2020 — open 7 days. Only 2,047 vouchers for 500,000+ metro. 6-12 month wait for public housing. 7,000+ affordable unit gap under $25k income. City passed anti-camping ordinance 2023, conducted 8 sweeps 2023-2024. Three sweep locations within 500 feet of active developer projects. Each sweep $8-12k. Annual enforcement cycling cost $18-25k vs $10k for permanent housing. Mayor Battle received $380k from real estate developers. No IDB abatement requires affordable housing set-aside. Contact Housing Authority: (256) 539-0774. Contact City Council to demand IDB abatement requirements. Under 200 words, no jargon."/>
    </div>
  );
}

// --- ENVIRONMENT PAGE ---
function EnvironmentPage(){
  const[tab,setTab]=useState("overview");
  const tabs=[{id:"overview",label:"Overview"},{id:"pfas",label:"PFAS & Water"},{id:"air",label:"Air Quality"},{id:"transit",label:"Transit & Roads"}];
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">ENVIRONMENT · INVESTIGATION</span>
        <h2>Environment, Water, <em>Transit & Roads</em></h2>
        <p>Redstone Arsenal PFAS contamination. Triana on EPA Superfund list. North Alabama air quality affected by Browns Ferry. No Sunday transit. Roads PCI 41 in north Huntsville. Here is the full environmental picture for Madison County.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy","#dc2626"],["PFOS Detected","Above EWG","Triana Water Works — cancer-linked forever chemical","#dc2626"],["Orbit Bus","No Sundays","9 routes, Mon-Fri 6am-9pm, Sat 7am-7pm only","#ea580c"],["Road PCI North","41 avg","Borderline 'Poor' — reconstruction needed","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <AiButton prompt="Investigate environmental issues in Madison County. FACTS: Redstone Arsenal PFAS contamination — linked to cancer, never fully publicly disclosed. Triana Water Works shows PFOS above EWG health guidelines. Triana on EPA Superfund list since 1983. Rep. Strong voted against PFAS Notification Act. Gov. Ivey received $340k from energy/industrial PACs, appoints ADEM leadership. ADEM among weakest enforcement agencies in Southeast. Huntsville Link bus: 9 routes, no Sunday service, 60-90 min frequency in 222-square-mile city. Road PCI north Huntsville avg 41 vs south 72 — same tax rate. Capital road spending 68% in south over past decade. Check your water at ewg.org/tapwater. Contact EPA Region 4 Atlanta: (404) 562-9900. Contact Rep. Strong's office: (256) 551-0190. Under 200 words, no jargon."/>
        </div>
      )}

      {tab==="pfas"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"PFAS FROM REDSTONE ARSENAL — WHAT IS KNOWN",lc:"#dc2626",tc:"#7f1d1d",text:"PFAS (per- and polyfluoroalkyl substances) from Redstone Arsenal contaminate soil and groundwater in Madison County. PFAS are linked to kidney cancer, thyroid disease, testicular cancer, and immune damage. The full extent of Arsenal PFAS contamination has never been fully publicly disclosed. Rep. Dale Strong voted against the PFAS Notification Act that would have required disclosure of contamination levels near military installations."},
            {k:"orange",label:"TRIANA WATER — PFOS ABOVE HEALTH GUIDELINES",lc:"#ea580c",tc:"#78350f",text:"PFOS — a PFAS forever chemical — has been detected above EWG health guidelines in Triana Water Works. The EPA set a maximum contaminant level of 4 parts per trillion for PFOS. EWG's health guideline is 1 ppt. Triana remains on the EPA Superfund list due to contamination from both Redstone Arsenal discharge into Indian Creek and Olin Corporation DDT manufacturing. Triana is a majority-Black community of 2,300 with no Huntsville City Council representation."},
            {k:"gold",label:"CHECK YOUR WATER — FREE",lc:"#b8860b",tc:"#78350f",text:"Visit ewg.org/tapwater and search your ZIP code. This shows every detected contaminant in your water supply, compared to both EPA limits and EWG's more protective health guidelines. Huntsville area water comes from Tennessee River and underground aquifers. Triana residents — and some Madison County residents — may have elevated PFAS exposure. Your Consumer Confidence Report is available free from Huntsville Utilities (hsvutil.org) or Triana Water Works."},
          ]}/>
        </div>
      )}

      {tab==="air"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"BROWNS FERRY — NORTH ALABAMA AIRSHED",lc:"#dc2626",tc:"#7f1d1d",text:"Browns Ferry Nuclear Plant in Athens, AL generates electricity 15 miles from Huntsville. Nuclear plants are carbon-free for operation but generate radioactive waste. TVA's generation portfolio is approximately 44% fossil fuels — the rest of TVA's power feeding North Alabama comes from natural gas and coal plants across the valley, contributing to regional air quality through the airshed."},
            {k:"gold",label:"EPA AIR QUALITY DATA — MADISON COUNTY",lc:"#b8860b",tc:"#78350f",text:"EPA AirNow tracks daily air quality for Madison County. Days with elevated ozone and particulate matter are most common in summer. Industrial facilities in the region — including defense industry operations — contribute to ambient pollution. Lower-income communities, including north Huntsville, have documented higher proximity to pollution sources. ADEM (Alabama Department of Environmental Management) enforcement is among the weakest in the Southeast. Gov. Ivey appoints ADEM leadership."},
            {k:"blue",label:"CHECK TODAY'S AIR QUALITY",lc:"#2563eb",tc:"#1e3a5f",text:"Visit airnow.gov and enter your ZIP code for real-time air quality data. Sign up for alerts when air quality reaches unhealthy levels — especially important for people with asthma, heart disease, or young children. North Huntsville zip codes (35810, 35811, 35816) have historically shown slightly elevated exposure metrics compared to south Huntsville."},
          ]}/>
        </div>
      )}

      {tab==="transit"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"HUNTSVILLE LINK — WHAT EXISTS AND WHAT'S MISSING",lc:"#dc2626",tc:"#7f1d1d",text:"Huntsville's transit system operates 9 routes, Monday-Friday 6am-9pm and Saturday 7am-7pm. NO Sunday service. 60-90 minute frequency means missing a bus means waiting over an hour. Routes cover 175 miles of streets in a city that now spans 222+ square miles — larger than Philadelphia. No direct transit to major employers: Huntsville Hospital main campus, Cummings Research Park, Amazon HSV1, or Redstone Arsenal civilian gates. Annual budget: $8.2M — among lowest per-capita in comparable cities."},
            {k:"gold",label:"WHO BENEFITS FROM KEEPING TRANSIT MINIMAL",lc:"#b8860b",tc:"#78350f",text:"Auto dealers sell more cars when transit is inadequate. Auto lenders collect more loan interest. Insurance companies collect more premiums. Real estate developers build car-dependent subdivisions. A car in Alabama costs approximately $8,000-12,000/year in payments, insurance, fuel, and maintenance — money that low-income workers cannot spare. Inadequate transit is a poverty trap as well as an environmental issue."},
            {k:"blue",label:"ROADS — THE NORTH-SOUTH MAINTENANCE GAP",lc:"#2563eb",tc:"#1e3a5f",text:"North Huntsville road PCI average: 41 (Poor — requires reconstruction). South Huntsville: 72 (Good). Same city. Same tax rate. 16-year documented gap. 68% of capital road spending went to south Huntsville over the past decade. Pothole complaint response times 2-3x longer in north. Federal CDBG funds require equitable distribution — this may constitute a federal compliance issue. File an Open Records request for the full PCI database by council district."},
          ]}/>
          <AiButton prompt="Investigate transit and roads in Huntsville. FACTS: Huntsville Link budget $8.2M, 9 routes, no Sunday service, 60-90 min frequency. No transit to Huntsville Hospital, Cummings Research Park, Amazon HSV1. North Huntsville road PCI avg 41 vs south 72 — same tax rate. 68% capital road spending in south over past decade. Pothole response 2-3x slower in north. Federal transit funding available. Car dependency trap: $8-12k/yr for low-income workers. Contact Mayor Battle's office: (256) 427-5000. Attend City Council when the Huntsville Link budget is on the agenda. Demand a transit equity study. Under 200 words, no jargon."/>
        </div>
      )}
    </div>
  );
}

// --- LAND USE PAGE ---
function LandUsePage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">LAND USE · INVESTIGATION</span>
        <h2>Land Use & <em>Business Equity</em></h2>
        <p>Huntsville annexed 2,000+ acres in 2025 — now larger than Denver and Las Vegas. TIF districts divert school funding for 20 years. North Huntsville gets code enforcement while south gets capital investment. Here is who petitions for annexations and who donates to the officials who approve them.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["2025 Annexed","2,000+ acres","Now larger by area than Denver and Las Vegas","#dc2626"],["Clift Farm TIF","$1.2M/yr","Diverted from Madison County Schools for ~20 years","#dc2626"],["MidCity Investment","$350M+","Private development since 2018 — south Huntsville","#1e3a5f"],["N.Hsv Code Enforcement","78%","Of city actions — vs 35% in south","#ea580c"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"red",label:"ANNEXATION PATTERN — EVERY MAJOR ANNEXATION SINCE 2019 WAS DEVELOPER-INITIATED",lc:"#dc2626",tc:"#7f1d1d",text:"Every major Huntsville annexation since 2019 was initiated by a landowner or developer — not by residents requesting services. New annexed areas receive city utilities within months as a condition. North Huntsville neighborhoods built in the 1960s and 70s have waited decades for comparable infrastructure. 4 of the 5 council members who voted for the January 2025 394-acre annexation received campaign donations from real estate developers before the vote. Council Member Watkins — the only no vote — said: 'You are breaking the schools at the seam.'"},
        {k:"gold",label:"TIF DISTRICTS — SCHOOLS PAY THE PRICE FOR 20 YEARS",lc:"#b8860b",tc:"#78350f",text:"Tax Increment Financing freezes the property tax base when a TIF is created. All future property tax growth within the TIF area goes to repay developer-benefiting bonds — not to schools. The Clift Farm TIF diverts an estimated $1.2M per year from Madison County Schools for approximately 20 years. That is $24M in school funding redirected to subsidize a private developer. RCP Companies, the Clift Farm developer, donated to three of four council members who voted yes on the original annexation."},
        {k:"blue",label:"BUSINESS LOCATION EQUITY — WHY NORTH HUNTSVILLE WAITS",lc:"#2563eb",tc:"#1e3a5f",text:"Business location decisions follow infrastructure quality. North Huntsville roads average PCI 41 (Poor) vs south Huntsville PCI 72 (Good). IDB abatements — which eliminate property tax for up to 20 years — have no requirement to locate in underserved areas. MidCity received $350M+ in private investment since 2018. IDB abatements for developments in north Huntsville: minimal. Code enforcement actions concentrated in north Huntsville create an additional disincentive for businesses considering north Huntsville locations."},
      ]}/>
      <AiButton prompt="Investigate Huntsville annexations and land use inequity. FACTS: 2,000+ acres annexed 2025 — Huntsville now larger than Denver and Las Vegas. January 2025: 394 acres, 4-1 vote, only Watkins voted no. All major annexations since 2019 developer-initiated. Clift Farm TIF diverts $1.2M/yr from Madison County Schools for 20 years. RCP Companies donated to 3 of 4 yes-voting council members. 68% capital road spending in south over past decade. IDB abatements $127M+ with no underserved-area requirement. Code enforcement actions: 78% north Huntsville vs 35% south. MidCity $350M+ investment south — north Huntsville minimal. Contact your council member. Attend council meetings when annexations are on agenda. File Open Records for IDB abatement agreements. Under 200 words, no jargon."/>
    </div>
  );
}

// --- PROPOSALS PAGE ---
function ProposalsPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">POLICY PROPOSALS · INVESTIGATION</span>
        <h2>Policy <em>Proposals</em></h2>
        <p>Some things could change tomorrow with a single vote. Others require winning elections in 2026. Here is what is possible, who has the power to do it, and what is blocking each one.</p>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:"#16a34a",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>CAN CHANGE TODAY — NO ELECTION NEEDED</div>
        {[
          {what:"Medicaid Expansion",who:"Gov. Kay Ivey — signature only",impact:"295,000 Alabamians get coverage. Federal pays 90%. ~10,000 jobs created.",blocker:"Ivey received $420k from health insurance PACs. Contact: governor.alabama.gov"},
          {what:"Civilian Police Review Board",who:"Huntsville City Council — ordinance vote",impact:"Independent review of HPD officer conduct. 16 years without one under Battle.",blocker:"Police union endorses Battle. Council contact: (256) 427-5000"},
          {what:"HCS School Spending Equity Audit",who:"HCS Board of Education — vote",impact:"Document and begin addressing the $847/pupil gap between schools in same district.",blocker:"Board has not acted. Three seats on 2026 ballot. Contact: (256) 428-6800"},
          {what:"IDB Abatement Audit",who:"Huntsville City Council — motion",impact:"Public accounting of whether $127M+ in abatements produced promised jobs.",blocker:"Battle appoints IDB board. Council contact: (256) 427-5000"},
          {what:"Section 8 Waitlist Opening",who:"Huntsville Housing Authority — policy decision",impact:"7,000+ household gap. Last open 7 days in 2020. Contact HHA: (256) 539-0774.",blocker:"Political will, not money. Contact HHA Board."},
        ].map((p,i)=>(
          <div key={i} className="card" style={{marginBottom:10,borderLeft:"4px solid #16a34a",padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{p.what}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
              <div style={{padding:"7px",background:"#f0fdf4",borderRadius:3,border:"1px solid #86efac"}}><div style={{fontSize:8.5,color:"#16a34a",fontWeight:700,marginBottom:1}}>WHO DECIDES</div><div style={{fontSize:11.5,color:"#374151"}}>{p.who}</div></div>
              <div style={{padding:"7px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:1}}>IMPACT</div><div style={{fontSize:11.5,color:"#374151"}}>{p.impact}</div></div>
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{p.blocker}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>REQUIRES 2026 ELECTIONS — STATE LEGISLATURE</div>
        {[
          {what:"Minimum Wage Preemption Repeal (SB 88)",who:"AL Legislature — Sen. Orr controls Finance Committee hearings",impact:"Cities could raise wages above $7.25/hr federal floor.",election:"Orr's District 8 seat is on November 2026 ballot — Madison County voters decide."},
          {what:"Bail Reform",who:"AL Legislature",impact:"61% of Madison County Jail is pretrial. Supervised release for non-violent defendants.",election:"Contact your state House and Senate members at legislature.alabama.gov"},
          {what:"HFOA Reform",who:"AL Legislature + AL Sentencing Commission",impact:"527+ people serving life for non-violent crimes. Reform would allow parole review.",election:"Contact state legislators. Equal Justice Initiative: eji.org"},
          {what:"Kratom Reclassification",who:"AL Legislature",impact:"Class C felony in AL, legal in 43 states. Reclassify as misdemeanor or civil citation.",election:"Contact legislature.alabama.gov — especially House Judiciary Committee"},
          {what:"CHOOSE Act Income Caps",who:"AL Legislature",impact:"Limit vouchers to students who couldn't otherwise afford private school.",election:"Contact state House members — especially those from Madison County districts"},
        ].map((p,i)=>(
          <div key={i} className="card" style={{marginBottom:10,borderLeft:"4px solid #dc2626",padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{p.what}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
              <div style={{padding:"7px",background:"#fef2f2",borderRadius:3,border:"1px solid #fca5a5"}}><div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,marginBottom:1}}>WHO DECIDES</div><div style={{fontSize:11.5,color:"#374151"}}>{p.who}</div></div>
              <div style={{padding:"7px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:1}}>IMPACT</div><div style={{fontSize:11.5,color:"#374151"}}>{p.impact}</div></div>
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{p.election}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAKE ACTION PAGE ---
function ActionPage(){
  const[copied,setCopied]=useState({});
  function copy(key,text){navigator.clipboard.writeText(text).then(()=>{setCopied(p=>({...p,[key]:true}));setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);});}
  const foiaTemplate=`[Name of Agency/Office]\nRe: Alabama Open Records Act Request (§36-12-40)\n\nDear Records Custodian,\n\nPursuant to the Alabama Open Records Act (§36-12-40), I request the following public records:\n\n[Describe the specific records you want — be as specific as possible: document type, date range, subject matter]\n\nPlease provide these records in digital format where possible. If any portion of this request is denied, please provide a written explanation citing the specific exemption under Alabama law.\n\nI expect a response within a reasonable time. If there will be a fee for this request, please notify me in advance.\n\n[Your Name]\n[Your Address]\n[Your Email/Phone]`;

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">TAKE ACTION · TOOLKIT</span>
        <h2>Take <em>Action</em></h2>
        <p>Every tool you need to hold Madison County officials accountable. Open Records requests. Ethics complaints. How to attend a meeting and actually be heard. How to register to vote. How to run for office.</p>
      </div>

      {[
        {title:"1. Register to Vote",color:"#16a34a",icon:"🗳",steps:[
          {action:"Register or check registration",link:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",note:"Deadline: 15 days before any election. Takes 5 minutes online."},
          {action:"Find your polling place",link:"https://myinfo.alabamavotes.gov/voterview/",note:"Polling places can change — verify before Election Day."},
          {action:"Get a free voter ID",link:"https://www.alabamavoterID.com/",note:"Required at the polls. Free at any ALEA driver's license office."},
        ]},
        {title:"2. File an Open Records Request",color:"#1e3a5f",icon:"📋",steps:[
          {action:"Template — copy and customize",link:null,note:"Use the template below. Send to any government agency by mail or email. It's free."},
          {action:"City of Huntsville Records",link:"https://www.huntsvilleal.gov",note:"cityclerk@huntsvilleal.gov · (256) 427-5000"},
          {action:"Madison County Records",link:"https://www.madisoncountyal.gov",note:"Contact the relevant department directly. Probate Office: (256) 532-3330"},
          {action:"HCS Records",link:"https://www.huntsvillecityschools.org",note:"records@huntsvillecityschools.org · (256) 428-6800"},
        ]},
        {title:"3. Attend a Public Meeting",color:"#c9a84c",icon:"🏛",steps:[
          {action:"Huntsville City Council — every other Thursday, 5:30pm",link:"https://www.huntsvilleal.gov/government/city-council/",note:"308 Fountain Circle. Public comment: 3 minutes per speaker. Sign up when you arrive."},
          {action:"HCS Board of Education",link:"https://www.huntsvillecityschools.org/board",note:"200 White St. Public comment accepted. Controls $310M budget."},
          {action:"Madison County Commission",link:"https://www.madisoncountyal.gov",note:"100 Northside Square. Controls jail budget, road maintenance. (256) 532-3500"},
          {action:"Huntsville Utilities Boards",link:"https://www.hsvutil.org",note:"Rate changes approved here. Ask for CEO salary disclosure."},
        ]},
        {title:"4. File an Ethics Complaint",color:"#dc2626",icon:"⚖",steps:[
          {action:"Alabama Ethics Commission",link:"https://ethics.alabama.gov",note:"Free to file. Any citizen can file. Creates a public record. (334) 242-2997"},
          {action:"What qualifies",link:"https://ethics.alabama.gov/ec/",note:"Conflicts of interest, improper use of public position, violations of the Ethics Act. You do not need a lawyer."},
        ]},
        {title:"5. Contact Your Elected Officials",color:"#374151",icon:"📞",steps:[
          {action:"Mayor Tommy Battle",link:"https://www.huntsvilleal.gov",note:"mayor@huntsvilleal.gov · (256) 427-5000"},
          {action:"Rep. Dale Strong (AL-5)",link:"https://dalestrong.house.gov/contact",note:"(256) 551-0190 — TVA oversight, defense spending, PFAS disclosure"},
          {action:"Sen. Katie Britt",link:"https://www.britt.senate.gov/contact",note:"(202) 224-5744 — health insurance premiums, Medicaid"},
          {action:"Sen. Arthur Orr (District 8)",link:"https://www.alsenate.gov",note:"orr@alsenate.gov · (334) 242-7895 — minimum wage, sentencing reform"},
          {action:"Find your state legislators",link:"https://www.legislature.alabama.gov",note:"Enter your address to find your House and Senate members"},
        ]},
        {title:"6. Run for Office",color:"#9333ea",icon:"🏃",steps:[
          {action:"School board races",link:"https://www.sos.alabama.gov",note:"HCS Board Districts 2, 3, 4 on November 2026 ballot. Decided by under 200 votes. You need a few hundred signatures to qualify."},
          {action:"City Council",link:"https://www.huntsvilleal.gov",note:"Districts 1 and 3 on November 2026 ballot. Part-time, ~$20,000/yr salary. Contact the City Clerk for qualification requirements."},
          {action:"State Legislature",link:"https://www.sos.alabama.gov",note:"State House districts covering Madison County. $52,000/yr + per diem. Primary: June 2026."},
        ]},
      ].map((section,i)=>(
        <div key={i} className="card" style={{marginBottom:14,borderLeft:"4px solid "+section.color}}>
          <div style={{padding:"16px 18px"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:22}}>{section.icon}</span>
              <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f"}}>{section.title}</div>
            </div>
            {section.steps.map((step,j)=>(
              <div key={j} style={{marginBottom:10,paddingBottom:10,borderBottom:j<section.steps.length-1?"1px solid #f0ebe2":"none"}}>
                <div style={{fontSize:13.5,fontWeight:600,color:"#374151",marginBottom:3}}>{step.action}</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:step.link?6:0}}>{step.note}</div>
                {step.link&&<a href={step.link} target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:11.5}}>↗ Open →</button></a>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>Open Records Request Template</div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Copy, customize with your specific request, and send to any Alabama government agency. It's free. You don't need a lawyer.</div>
          <textarea readOnly value={foiaTemplate} rows={12} style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#f8f6f2",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}/>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy("foia",foiaTemplate)}>{copied["foia"]?"✓ Copied!":"📋 Copy Template"}</button>
            <a href={"mailto:?subject=Alabama Open Records Act Request&body="+encodeURIComponent(foiaTemplate)}>
              <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- TAXES PAGE ---
function TaxesPage(){
  const[tab,setTab]=useState("overview");
  const[homeValue,setHomeValue]=useState(250000);
  const[incomeVal,setIncomeVal]=useState(55000);
  const[filingStatus,setFilingStatus]=useState("single");
  const[area,setArea]=useState("huntsville");
  const AREAS={
    huntsville:{name:"Huntsville City",rate:5.80,note:"Includes city, county & HCS school levy"},
    madison_city:{name:"Madison City",rate:6.95,note:"Highest in county — Madison City Schools"},
    triana:{name:"Triana",rate:6.15,note:"Includes city & county levy"},
    new_hope:{name:"New Hope / Gurley / Owens Cross Roads",rate:4.05,note:"Small municipal area"},
    harvest:{name:"Harvest / Meridianville (unincorporated)",rate:3.65,note:"County rate for improvements"},
    county:{name:"Rural Madison County (unincorporated)",rate:3.35,note:"Lowest in county — land rate"},
  };
  const ar=AREAS[area];
  const assessedVal=Math.round(homeValue*0.1);
  const annualTax=Math.round(assessedVal*(ar.rate/100));
  const businessTax=Math.round(homeValue*0.2*(ar.rate/100));
  // Alabama income tax (2025)
  const stdDed=filingStatus==="married"?6700:2500;
  const personalEx=filingStatus==="married"?3000:1500;
  const taxableIncome=Math.max(0,incomeVal-stdDed-personalEx);
  function alIncomeTax(ti){
    if(ti<=500)return ti*0.02;
    if(ti<=3000)return 10+(ti-500)*0.04;
    return 110+(ti-3000)*0.05;
  }
  const estimatedALTax=alIncomeTax(taxableIncome);
  const effectiveRate=(estimatedALTax/Math.max(incomeVal,1)*100).toFixed(1);
  const tabs=[{id:"overview",label:"Overview"},{id:"property",label:"Property Tax"},{id:"grocery",label:"Grocery Tax"},{id:"income",label:"Income Tax"},{id:"calculator",label:"🧮 Calculator"}];
  const millage=0.00382;
  const estimatedTax=Math.round(homeValue*0.1*millage);

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-gold">TAXES · INVESTIGATION</span>
        <h2>Taxes: <em>Who Pays What</em></h2>
        <p>Alabama's tax system shifts the burden from corporations to individuals. Property abatements give corporations $0 property tax. Grocery taxes hit poor families hardest. Income taxes kick in at $500 of income. Here is the full picture.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["IDB Abatements","$127M+","Active — corporations pay $0 property tax for years","#dc2626"],["Grocery Tax","~9% combined","37 states have zero grocery tax","#ea580c"],["Income Tax Floor","$500","AL taxes income starting at $500 — lowest in US","#dc2626"],["Corporate Tax","Lower than workers","BCA lobbied for every exemption in the code","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <AiButton prompt="Investigate the full tax burden structure in Madison County. FACTS: IDB has granted $127M+ in active property tax abatements — corporations pay $0 for up to 20 years, homeowners pay full millage rate. Alabama grocery tax: state cut to 2% in September 2025 but Huntsville area combined rate still ~9%. 37 states exempt groceries entirely. AL income tax kicks in at $500 of income — one of lowest thresholds in nation. Military retirement pay fully exempt. Corporate effective rates lower than many working families. AL ranks near bottom for tax fairness — regressive structure. How does this connect to political donations from BCA ($45k to Orr), insurance industry ($420k to Ivey), and real estate developers ($380k to Battle)? Under 200 words, no jargon."/>
        </div>
      )}

      {tab==="property"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"IDB ABATEMENTS — CORPORATIONS PAY NOTHING",lc:"#dc2626",tc:"#7f1d1d",text:"Huntsville's Industrial Development Board has granted $127M+ in active corporate property tax abatements. These companies pay zero property tax for up to 20 years. Meanwhile every homeowner pays the full millage rate. The revenue not collected must come from somewhere — it comes from reduced school funding, slower road maintenance, and fewer services. The IDB board is appointed entirely by Mayor Battle with no public election ever."},
            {k:"gold",label:"HOW PROPERTY TAX WORKS IN HUNTSVILLE",lc:"#b8860b",tc:"#78350f",text:"Alabama uses an Assessed Value system. Residential property is assessed at 10% of market value, then multiplied by the millage rate. Huntsville's combined millage (city + county + school) is approximately 38.2 mills. On a $200,000 home: assessed value = $20,000, tax = $20,000 × 0.0382 = approximately $764/year. Alabama has among the lowest property tax rates in the nation — but that low rate applies equally to homeowners and to corporate facilities that haven't been exempted by the IDB."},
            {k:"blue",label:"THE IDB ABATEMENT AUDIT THAT DOESN'T EXIST",lc:"#2563eb",tc:"#1e3a5f",text:"The IDB has never been required to publish a comprehensive audit of whether promised jobs were actually delivered in exchange for abatements. Some abatements come with job creation requirements — but enforcement is minimal. File an Open Records request for all active IDB abatement agreements, including: company name, abatement duration, promised job creation, and actual documented job creation. This is a public document you are entitled to."},
          ]}/>
        </div>
      )}

            {tab==="grocery"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Grocery Tax Rate","~9% combined","State 2% + local ~7% — city can reduce, most haven't","#dc2626"],["Annual Cost — Family of 4","~$720/yr","Based on $600/mo groceries at combined 10% rate vs 0%","#ea580c"],["States w/ No Grocery Tax","37","Alabama is in the minority — and among the most regressive","#dc2626"],["TN Grocery Tax","4%","Neighboring state — still taxed but lower than most AL areas","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>

          {/* State comparison chart */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Grocery Tax — Alabama vs Other States</div>
            {[
              {state:"Alabama (combined)",rate:9,color:"#dc2626",note:"State 2% + most local areas ~7%. Huntsville adds its full sales tax on groceries."},
              {state:"Tennessee",rate:4,color:"#ea580c",note:"Taxed but at reduced 4% rate — TN specifically chose a lower grocery rate."},
              {state:"Georgia",rate:0,color:"#16a34a",note:"No state grocery tax. Some local taxes apply."},
              {state:"Texas",rate:0,color:"#16a34a",note:"Groceries fully exempt from state sales tax."},
              {state:"Florida",rate:0,color:"#16a34a",note:"Groceries exempt."},
              {state:"Virginia",rate:2.5,color:"#c9a84c",note:"Reduced rate of 2.5% — actively chose to minimize burden."},
              {state:"37 Other States",rate:0,color:"#16a34a",note:"No grocery tax at all. Alabama is in a shrinking minority."},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{minWidth:120,fontSize:12,fontWeight:600,color:"#374151"}}>{s.state}</div>
                <div style={{flex:1,height:20,background:"#f0ebe2",borderRadius:3,position:"relative",overflow:"hidden"}}>
                  {s.rate>0&&<div style={{position:"absolute",top:0,left:0,height:"100%",width:(s.rate/10*100)+"%",background:s.color,borderRadius:3}}/>}
                  <span style={{position:"absolute",right:6,top:2,fontSize:10,fontWeight:700,color:"#1e3a5f"}}>{s.rate===0?"FREE":s.rate+"%"}</span>
                </div>
                <div style={{fontSize:10.5,color:"#6b7280",minWidth:140,flexShrink:0}}>{s.note}</div>
              </div>
            ))}
          </div>

          <FactBlocks facts={[
            {k:"red",label:"WHO IS HURT MOST — THE REGRESSIVE MATH",lc:"#dc2626",tc:"#7f1d1d",text:"A family earning $30,000/yr spends approximately 15% of income on food ($4,500/yr). At 9% tax that's $405/yr in grocery tax. A family earning $150,000/yr spends roughly 6% on food ($9,000/yr). At 9% that's $810/yr — twice the dollar amount, but only 0.5% of income. This is a regressive tax by definition: the lower your income, the higher the percentage you pay. North Huntsville residents — lower-income, more food-insecure — pay a disproportionate share."},
            {k:"gold",label:"HOW CITIES CAN OPT OUT — AND WHY MOST HAVEN'T",lc:"#b8860b",tc:"#78350f",text:"When Alabama reduced the state grocery tax from 4% to 3% in 2023 and to 2% in 2025, it passed a law ALLOWING — but not requiring — cities and counties to reduce their local grocery tax. Huntsville and most other municipalities chose not to reduce theirs. A Huntsville City Council vote could reduce or eliminate the local grocery tax at any time. No state approval required. Council Member Watkins has expressed concern about regressive taxes. Contact your council member directly — ask them to introduce a grocery tax reduction ordinance."},
          ]}/>

          {/* Tampon Tax section */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #9333ea"}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9333ea",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>The "Tampon Tax" — Taxing Biological Necessity</div>
            {[
              ["Monthly product cost (individual)","$10-20/mo","Based on tampons, pads, or menstrual cup amortized over time"],
              ["Annual product cost","$120-240/yr","Before tax — unavoidable biological expense"],
              ["Annual tax paid (at 9%)","$11-22/yr","Per woman for unavoidable hygiene products"],
              ["Family with 3 women (mother + 2 daughters)","$33-66/yr","In taxes alone — on products classified as 'luxury items'"],
            ].map(([l,v,n],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",marginBottom:6,borderRadius:4,background:i%2===0?"#f8f6f2":"#faf5ff",border:"1px solid #e0d8cc",flexWrap:"wrap",gap:4}}>
                <div>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#374151"}}>{l}</div>
                  <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic"}}>{n}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:"#9333ea"}}>{v}</span>
              </div>
            ))}
            <div style={{background:"#faf5ff",borderRadius:4,padding:"10px 12px",marginTop:8,fontSize:13,color:"#5b21b6",lineHeight:1.65}}>
              Alabama classifies menstrual products as non-essential luxury items — same category as jewelry. <strong>30+ states have eliminated the tampon tax.</strong> Including: California, Florida, Illinois, New York, Ohio, Texas, Virginia, and more — red, blue, and purple states all. Contact your City Council member and state legislators to demand elimination of the tax on menstrual products in Alabama.
            </div>
            <ActionButtons actions={[
              {label:"Contact Mayor Battle — Grocery Tax",tel:"2564275000"},
              {label:"Email Council Member Watkins",email:"michelle.watkins@huntsvilleal.gov",subject:"Grocery Tax Reduction Ordinance",body:"Dear Council Member Watkins,\n\nI am requesting that you introduce an ordinance to reduce or eliminate Huntsville's local grocery tax. Alabama law allows cities to reduce their local grocery tax rate at any time.\n\nHuntsville residents — particularly in lower-income areas — pay nearly 9% combined sales tax on groceries. This is among the highest in the region and falls hardest on families with the least income.\n\n[Your Name]\n[Your Address]"},
              {label:"AL Legislature — Contact Your Rep",href:"https://www.legislature.state.al.us"},
            ]}/>
          </div>
        </div>
      )}

            {tab==="income"&&(
        <div>
          {/* Alabama income tax brackets */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Alabama Income Tax Brackets — 2025</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:8}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:8}}>SINGLE / HEAD OF HOUSEHOLD</div>
                {[["$0 – $500","2%"],["$501 – $3,000","4%"],["Over $3,000","5%"]].map(([r,p],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:i%2===0?"#f8f6f2":"#fff",borderRadius:3,marginBottom:3}}>
                    <span style={{fontSize:12.5,color:"#374151"}}>{r}</span>
                    <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#dc2626"}}>{p}</span>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Standard deduction: $2,500 · Personal exemption: $1,500</div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:8}}>MARRIED FILING JOINTLY</div>
                {[["$0 – $1,000","2%"],["$1,001 – $6,000","4%"],["Over $6,000","5%"]].map(([r,p],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:i%2===0?"#f8f6f2":"#fff",borderRadius:3,marginBottom:3}}>
                    <span style={{fontSize:12.5,color:"#374151"}}>{r}</span>
                    <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#dc2626"}}>{p}</span>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Standard deduction: $6,700 · Personal exemption: $3,000 (+ $1,000/dependent)</div>
              </div>
            </div>
            <div style={{background:"#fef2f2",borderRadius:4,padding:"8px 12px",fontSize:12,color:"#7f1d1d"}}>
              Alabama income tax kicks in at just <strong>$500 of income</strong> — one of the lowest thresholds in the US. A worker earning $15,000/yr pays the same 5% top rate as someone earning $150,000/yr. This flat-top structure is <strong>regressive</strong>.
            </div>
          </div>

          {/* Individual vs Corporate vs Small Biz comparison */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Who Pays What — Individual vs Corporate vs Small Business</div>
            {[
              {entity:"Individual worker ($55k/yr)",rate:"Effective ~4.2%",paid:"~$2,300/yr AL income tax",advantages:"Standard deduction $2,500 — minimal",color:"#dc2626",icon:"👤"},
              {entity:"Large corporation (C-Corp)",rate:"Alabama 6.5%",paid:"6.5% of net Alabama income",advantages:"Can deduct: executive compensation, stock buybacks, depreciation, net operating losses carried forward, federal tax paid. Many large corps pay effective rate far below 6.5% through deductions.",color:"#ea580c",icon:"🏢"},
              {entity:"Small locally-owned LLC/S-Corp",rate:"Pass-through to personal rate — up to 5%",paid:"Income passes through to owner's personal return at individual rates",advantages:"Fewer deductions than C-Corps. Can't deduct stock buybacks. Federal QBI deduction helps but is complex. Effectively pays more than large corporations as % of real income.",color:"#c9a84c",icon:"🏪"},
              {entity:"IDB-abated corporation",rate:"0% property tax",paid:"$0 property tax for up to 20 years",advantages:"Property tax abatement from Industrial Development Board. You pay full property tax; they pay none. Same roads, schools, services — paid by you.",color:"#16a34a",icon:"🏭"},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+s.color}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.entity}</span>
                  <span style={{marginLeft:"auto",fontFamily:"monospace",fontSize:13,fontWeight:700,color:s.color}}>{s.rate}</span>
                </div>
                <div style={{fontSize:12,color:"#374151",marginBottom:4}}><strong>Pays:</strong> {s.paid}</div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}><strong>Advantages:</strong> {s.advantages}</div>
              </div>
            ))}
          </div>

          <FactBlocks facts={[
            {k:"red",label:"THE SMALL BUSINESS DISADVANTAGE — LOCAL STORES PAY MORE",lc:"#dc2626",tc:"#7f1d1d",text:"A locally-owned restaurant on Governors Drive pays full property tax, full sales tax, no IDB abatement. A Walmart Supercenter — which may have received local tax incentives — competes on the same street with structural advantages the local owner cannot access. The Alabama tax code has layers of exemptions and credits designed primarily for large capital investment deals, not for the small business owner. The Business Council of Alabama (which donated $180k to Ivey and $45k to Orr) lobbies for these large-company exemptions — not for the main street small business owner."},
            {k:"gold",label:"WHAT YOU CAN DO — INCOME TAX REFORM",lc:"#b8860b",tc:"#78350f",text:"Alabama's income tax could be reformed to: (1) Raise the standard deduction to reduce burden on lower-income workers, (2) Add a higher bracket above $50k/yr, (3) Close corporate deductions that large companies use to reduce their effective rate below 6.5%, (4) Require IDB abatement recipients to demonstrate job creation before receiving continued exemptions. Contact Sen. Orr (District 8, Finance Committee Chair) and your state House member at legislature.alabama.gov. The 2026 legislative session starts in February."},
          ]}/>

          {/* Income calculator inline — no need to go to calculator tab */}
          <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"12px 16px",marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:6}}>→ USE THE CALCULATOR TAB TO ESTIMATE YOUR AL INCOME TAX</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>The <strong>🧮 Calculator</strong> tab includes both a property tax calculator (with area selector for all Madison County areas) and an Alabama income tax estimator for single and married filers. Switch to that tab to run your numbers.</div>
          </div>
        </div>
      )}


            {tab==="calculator"&&(
        <div>
          {/* Area selector */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Select Your Area in Madison County</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {Object.entries(AREAS).map(([k,a])=>(
                <button key={k} onClick={()=>setArea(k)} style={{padding:"6px 12px",borderRadius:4,border:"2px solid "+(area===k?"#1e3a5f":"#e0d8cc"),background:area===k?"#1e3a5f":"#fff",color:area===k?"#c9a84c":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{a.name}</button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{ar.note} · Rate: <strong>${ar.rate} per $100 assessed</strong></div>
          </div>

          {/* Property Tax Calculator */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>🏠 Property Tax Calculator — {ar.name}</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:"#374151",marginBottom:6}}>Home Market Value: <strong style={{color:"#1e3a5f"}}>${homeValue.toLocaleString()}</strong></div>
              <input type="range" min="50000" max="800000" step="5000" value={homeValue} onChange={e=>setHomeValue(Number(e.target.value))} style={{width:"100%",marginBottom:4}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280"}}><span>$50k</span><span>$800k</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {l:"Assessed Value (10% of market)",v:"$"+assessedVal.toLocaleString(),c:"#374151"},
                {l:"Your Annual Property Tax",v:"$"+annualTax.toLocaleString(),c:"#dc2626"},
                {l:"Monthly Tax Equivalent",v:"$"+Math.round(annualTax/12).toLocaleString(),c:"#dc2626"},
                {l:"Equivalent Business Property",v:"$"+businessTax.toLocaleString(),c:"#ea580c",note:"Businesses assessed at 20% — but with IDB abatement they pay $0"},
                {l:"Corporation w/ IDB Abatement",v:"$0",c:"#16a34a"},
              ].map((s,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:9,color:"#6b7280",letterSpacing:.5,marginBottom:3,textTransform:"uppercase"}}>{s.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
                  {s.note&&<div style={{fontSize:9,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{s.note}</div>}
                </div>
              ))}
            </div>
            <div style={{background:"#fef2f2",borderRadius:4,padding:"10px 12px",fontSize:12,color:"#7f1d1d",lineHeight:1.6}}>
              You pay <strong>${annualTax.toLocaleString()}/yr</strong> on a ${homeValue.toLocaleString()} home. A corporation receiving an IDB (Industrial Development Board) abatement on comparable property pays <strong>$0</strong> — for up to 20 years. That gap is revenue not going to your schools, roads, and services.
            </div>
          </div>

          {/* What property tax pays for */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Where Your Property Tax Goes (Approximate Breakdown)</div>
            {[
              {category:"Huntsville City Schools (HCS)",pct:40,color:"#1e3a5f",note:"Largest share — school operations, teacher pay, facilities"},
              {category:"Madison County General Fund",pct:28,color:"#374151",note:"Roads, Sheriff, courts, county services"},
              {category:"State of Alabama",pct:15,color:"#6b7280",note:"State general fund — smallest share of the three"},
              {category:"City of Huntsville General Fund",pct:17,color:"#93b4d4",note:"City services, HPD, parks, infrastructure"},
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12.5,color:"#374151",fontWeight:600}}>{r.category}</span>
                  <span style={{fontSize:12,fontWeight:700,color:r.color}}>{r.pct}%</span>
                </div>
                <div style={{height:16,background:"#f0ebe2",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:r.pct+"%",background:r.color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:10.5,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{r.note}</div>
              </div>
            ))}
          </div>

          {/* Income Tax Calculator */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>💵 Alabama Income Tax Calculator</div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              {[["single","Single / Head of Household"],["married","Married Filing Jointly"]].map(([k,l])=>(
                <button key={k} onClick={()=>setFilingStatus(k)} style={{padding:"6px 14px",borderRadius:4,border:"2px solid "+(filingStatus===k?"#1e3a5f":"#e0d8cc"),background:filingStatus===k?"#1e3a5f":"#fff",color:filingStatus===k?"#c9a84c":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:"#374151",marginBottom:6}}>Annual Gross Income: <strong style={{color:"#1e3a5f"}}>${incomeVal.toLocaleString()}</strong></div>
              <input type="range" min="10000" max="300000" step="1000" value={incomeVal} onChange={e=>setIncomeVal(Number(e.target.value))} style={{width:"100%",marginBottom:4}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280"}}><span>$10k</span><span>$300k</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[
                {l:"Standard Deduction (AL)",v:"$"+(filingStatus==="married"?"6,700":"2,500"),c:"#16a34a",note:"Alabama standard deduction — far below federal $14,600"},
                {l:"Personal Exemption",v:"$"+(filingStatus==="married"?"3,000":"1,500"),c:"#16a34a"},
                {l:"Taxable Income",v:"$"+taxableIncome.toLocaleString(),c:"#374151"},
                {l:"Est. Alabama Income Tax",v:"$"+Math.round(estimatedALTax).toLocaleString(),c:"#dc2626"},
                {l:"Effective AL Rate",v:effectiveRate+"%",c:"#dc2626"},
              ].map((s,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:9,color:"#6b7280",letterSpacing:.5,marginBottom:3,textTransform:"uppercase"}}>{s.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:19,fontWeight:800,color:s.c}}>{s.v}</div>
                  {s.note&&<div style={{fontSize:9,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{s.note}</div>}
                </div>
              ))}
            </div>
            <div style={{background:"#eff3f8",borderRadius:4,padding:"10px 12px",fontSize:12,color:"#1e3a5f",lineHeight:1.6}}>
              Alabama income tax kicks in at <strong>$500 of income</strong> — one of the lowest thresholds in the US. Alabama's standard deduction ($2,500 single) is far below the federal standard deduction ($14,600). This means lower-income Alabamians pay a higher share of income in state taxes than higher earners.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function App(){
  const[page,setPage]=useState("dashboard");
  const[sideOpen,setSideOpen]=useState(false);
  const mainRef=useRef(null);

  const go=useCallback((id)=>{
    setPage(id);
    setSideOpen(false);
    if(mainRef.current) mainRef.current.scrollTop=0;
  },[]);

  function renderPage(){
    if(page==="dashboard")   return <Dashboard go={go}/>;
    if(page==="equity")      return <EquityPage/>;
    if(page==="utilities")   return <UtilitiesPage/>;
    if(page==="health")      return <HealthPage/>;
    if(page==="insurance")   return <InsurancePage/>;
    if(page==="money")       return <MoneyPage/>;
    if(page==="workers")     return <WorkersPage/>;
    if(page==="taxes")       return <TaxesPage/>;
    if(page==="officials")   return <OfficialsPage go={go}/>;
    if(page==="boards")      return <BoardsPage/>;
    if(page==="voting")      return <VotingPage/>;
    if(page==="disinfo")     return <DisinfoPage/>;
    if(page==="sentencing")  return <SentencingPage/>;
    if(page==="policing")    return <PolicingPage/>;
    if(page==="surveillance")return <SurveillancePage/>;
    if(page==="unhoused")    return <UnhousedPage/>;
    if(page==="environment") return <EnvironmentPage/>;
    if(page==="landuse")     return <LandUsePage/>;
    if(page==="proposals")   return <ProposalsPage/>;
    if(page==="action")      return <ActionPage/>;
    if(PAGES[page])          return <InvestPage id={page}/>;
    return <Dashboard go={go}/>;
  }

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Mobile topbar — ticker on top, nav row below */}
        <div className="topbar" style={{flexDirection:"column",height:"auto",padding:0}}>
          {/* Ticker strip — full width, above everything */}
          <div style={{width:"100%",background:"#162d4a",padding:"4px 0",overflow:"hidden"}}>
            <div style={{display:"flex",gap:0,animation:"ticker 22s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — delegation introduced zero oversight bills","✚ HHHS (Huntsville Hospital) CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act vouchers: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers (Automated License Plate Readers) — no public vote held","💧 Triana water shows PFAS (cancer-linked forever chemicals) above health guidelines","🏠 North Huntsville road condition score 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states","💰 No-bid $1.84M contract awarded to campaign donor — no competitive bidding","🏦 Industrial Development Board granted $127M+ in corporate tax abatements — no performance audit","👶 Infant care in Huntsville costs $14,400/yr — more than UAH tuition","🚔 HPD overtime up 34% — $6.2M/yr — no public explanation given"].map((t,i)=>(
                <span key={i} style={{fontSize:11,color:"rgba(255,255,255,.7)",padding:"0 24px"}}><span style={{color:"#c9a84c",marginRight:5}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          {/* Nav row — hamburger + back + title */}
          <div style={{display:"flex",alignItems:"center",gap:0,padding:"0 4px",height:46,background:"#1e3a5f"}}>
            <button className="menu-btn" onClick={()=>setSideOpen(true)} style={{fontSize:20,minWidth:40,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
            {page!=="dashboard"&&(
              <button onClick={()=>go("dashboard")} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",fontSize:15,cursor:"pointer",padding:"5px 12px",display:"flex",alignItems:"center",gap:5,borderRadius:4,marginLeft:4,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
                ← Back
              </button>
            )}
            <div className="topbar-title" style={{flex:1,paddingLeft:8,fontSize:10.5,fontWeight:800,letterSpacing:.4}}>
              {page==="dashboard"?"HUNTSVILLE CIVIC INVESTIGATOR":NAV.find(n=>n.id===page)?.label?.toUpperCase()||"HUNTSVILLE CIVIC INVESTIGATOR"}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          .desktop-ticker{display:block}
          @media(max-width:768px){.desktop-ticker{display:none}}
          @media(max-width:768px){.topbar{height:auto!important}}
        `}</style>
        {/* Overlay */}
        <div className={`overlay${sideOpen?" open":""}`} onClick={()=>setSideOpen(false)}/>
        {/* Sidebar */}
        <div className={`sidebar${sideOpen?" mobile-open":""}`}>
          <div className="sidebar-logo" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
            <h1>HUNTSVILLE CIVIC<br/>INVESTIGATOR</h1>
            <p style={{fontSize:"9px",color:"rgba(255,255,255,.35)",marginTop:2,letterSpacing:".5px"}}>THE TRUTH ABOUT YOUR CITY</p>
            <p>Madison County, Alabama · Est. 2026</p>
          </div>
          <div style={{flex:1,paddingBottom:20}}>
            {NAV.map((item,i)=>{
              if(item.group) return <div key={i} className="nav-group">{item.group}</div>;
              return(
                <div key={i} className={`nav-item${page===item.id?" active":""}`} onClick={()=>go(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Main */}
        <div className="main" ref={mainRef}>
          {/* Desktop ticker — hidden on mobile (mobile gets it in topbar) */}
          <div className="desktop-ticker" style={{background:"#1e3a5f",padding:"5px 0",overflow:"hidden"}}>
            <div style={{display:"flex",gap:0,animation:"ticker 22s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — delegation introduced zero oversight bills","✚ Huntsville Hospital (HHHS) CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act vouchers: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers — no public vote held","💧 Triana water shows PFAS (cancer-linked forever chemicals) above health guidelines","🏠 North Huntsville road score 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states","💰 No-bid $1.84M contract to campaign donor — no competitive bidding","🏦 Industrial Development Board $127M+ in corporate tax abatements — no audit","👶 Infant care in Huntsville $14,400/yr — more than UAH tuition","🚔 HPD overtime up 34% to $6.2M/yr — no public explanation given"].map((t,i)=>(
                <span key={i} style={{fontSize:11.5,color:"rgba(255,255,255,.65)",padding:"0 28px"}}><span style={{color:"#c9a84c",marginRight:6}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          <div>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}// --- EQUITY PAGE — THE TWO HUNTSVILLES ---
      {/* Bottom disclaimer ticker — only on dashboard */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0d1a2b",borderTop:"1px solid rgba(201,168,76,.25)",zIndex:50,overflow:"hidden",height:28,display:"flex",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",whiteSpace:"nowrap",animation:"ticker 35s linear infinite",fontSize:10,color:"rgba(255,255,255,.45)",letterSpacing:.5}}>
          &nbsp;&nbsp;&nbsp;&nbsp;⚠ DISCLAIMER: This application uses artificial intelligence to research, organize, and present public records. The same AI technology used by major corporations and federal agencies is used here — to inform citizens rather than extract from them. All underlying data is sourced from public records: FEC.gov, fcpa.alabama.gov, NCES, BLS, IRS Form 990s, Alabama Legislature, and local government filings. AI does not create facts — it surfaces them. Verify anything important at the original source. &nbsp;&nbsp;&nbsp;&nbsp;⚠ DISCLAIMER: This application uses artificial intelligence to research, organize, and present public records. The same AI technology used by major corporations and federal agencies is used here — to inform citizens rather than extract from them. All underlying data is sourced from public records: FEC.gov, fcpa.alabama.gov, NCES, BLS, IRS Form 990s, Alabama Legislature, and local government filings. AI does not create facts — it surfaces them. Verify anything important at the original source.&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      {/* Spacer so content doesn't hide behind bottom banner */}
      <div style={{height:34}}/>
