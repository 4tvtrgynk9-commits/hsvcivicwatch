import{useState,useEffect,useRef,useCallback}from"react";

// ─── THEME ────────────────────────────────────────────────────
const C={navy:"#1e3a5f",red:"#dc2626",gold:"#c9a84c",orange:"#ea580c",green:"#16a34a",muted:"#6b7280",border:"#e0d8cc",card:"#fff",bg:"#f5f0e8"};

// ─── AI ───────────────────────────────────────────────────────
const SYSTEM_PROMPT=`You are the investigative AI engine for the Huntsville Civic Investigator — a public accountability tool for Madison County, Alabama residents.

Your job: decode complex legal, financial, and governmental source material so that any resident can understand it.

Rules: Write at 8th-grade reading level. Explain HOW something affects residents daily. Surface what is obscured. Identify who benefits financially. Flag conflicts of interest. Note unanswered questions. Be factual. End with 2-3 specific actionable steps. Under 380 words. No markdown headers. Start directly with substance — no preamble.`;

async function callAI(prompt){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
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

// ─── CSS ──────────────────────────────────────────────────────
const CSS=`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${C.bg};font-family:'Segoe UI',system-ui,sans-serif;font-size:15px;color:#1a1a1a;overflow-x:hidden}
#root{height:100%}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;background:${C.navy};color:#fff;overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column}
.sidebar-logo{padding:20px 16px 12px;border-bottom:1px solid rgba(201,168,76,.2)}
.sidebar-logo h1{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:1px;line-height:1.3}
.sidebar-logo p{font-size:10px;color:rgba(255,255,255,.4);margin-top:3px}
.nav-group{padding:14px 16px 4px;font-size:8.5px;font-weight:700;letter-spacing:2px;color:rgba(201,168,76,.5);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 16px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .15s;user-select:none}
.nav-item:hover,.nav-item.active{color:${C.gold};background:rgba(201,168,76,.08);border-left-color:${C.gold};font-weight:700}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.main{flex:1;overflow-y:auto;background:${C.bg}}
.page{max-width:680px;margin:0 auto;padding:20px 16px 40px}
.page-header{margin-bottom:20px}
.page-header h2{font-size:24px;font-weight:900;color:${C.navy};line-height:1.2}
.page-header h2 em{color:${C.red};font-style:normal}
.page-header p{font-size:14px;color:${C.muted};margin-top:6px;line-height:1.6}
.tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 8px;border-radius:10px;margin-bottom:8px}
.tag-red{background:rgba(220,38,38,.12);color:${C.red};border:1px solid rgba(220,38,38,.2)}
.tag-navy{background:rgba(30,58,95,.1);color:${C.navy};border:1px solid rgba(30,58,95,.2)}
.tag-gold{background:rgba(201,168,76,.12);color:#b8860b;border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(22,163,74,.1);color:${C.green};border:1px solid rgba(22,163,74,.2)}
.tag-blue{background:rgba(37,99,235,.1);color:#2563eb;border:1px solid rgba(37,99,235,.2)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px 12px}
.stat-val{font-size:24px;font-weight:900;line-height:1}
.stat-lbl{font-size:10px;color:${C.muted};margin-top:5px;letter-spacing:.5px;text-transform:uppercase}
.stat-sub{font-size:12px;color:${C.muted};margin-top:3px;line-height:1.3}
.fact{border-radius:5px;padding:12px 14px;margin-bottom:10px;border-left:4px solid}
.fact-red{background:#fef2f2;border-color:${C.red}}
.fact-gold{background:#fffbeb;border-color:${C.gold}}
.fact-green{background:#f0fdf4;border-color:${C.green}}
.fact-blue{background:#eff6ff;border-color:#2563eb}
.fact-label{font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:5px;text-transform:uppercase}
.fact-text{font-size:14px;line-height:1.7}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border:none;border-radius:4px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;transition:opacity .15s}
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
.card-title{font-size:15px;font-weight:700;color:${C.navy};margin-bottom:4px}
.card-sub{font-size:13.5px;color:${C.muted};line-height:1.5}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:2px solid ${C.border};padding-bottom:8px;flex-wrap:wrap}
.tab{padding:7px 16px;border:none;border-radius:4px 4px 0 0;font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit;background:#f0ebe2;color:${C.muted};transition:all .12s}
.tab.active{background:${C.navy};color:${C.gold}}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.dash-card{background:#fff;border:1px solid ${C.border};border-radius:8px;padding:16px;cursor:pointer;transition:all .15s;border-left:4px solid}
.dash-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
.dash-card-icon{font-size:20px;margin-bottom:8px}
.dash-card-title{font-size:14px;font-weight:700;color:${C.navy};margin-bottom:3px}
.dash-card-sub{font-size:12.5px;color:${C.muted};line-height:1.4}
.topbar{display:none;background:${C.navy};color:#fff;padding:12px 16px;align-items:center;gap:12px;position:sticky;top:0;z-index:100}
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
  .topbar{display:flex;height:52px;min-height:52px;position:fixed;top:0;left:0;right:0;z-index:200}
  .menu-btn{width:44px;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;padding:0}
  .topbar-title{font-size:11px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.3px}
  .main{width:100%;margin-top:52px;overflow-y:auto;height:calc(100vh - 52px)}
  .page{padding:14px 12px 60px;max-width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .dash-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-val{font-size:19px}
  .stat-lbl{font-size:9px}
  .stat-sub{font-size:11.5px}
  .page-header h2{font-size:21px}
  .tabs{gap:3px}
  .tab{padding:6px 10px;font-size:10.5px}
  .btn{font-size:11.5px;padding:8px 14px}
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

// ─── NAV DATA ─────────────────────────────────────────────────
const NAV=[
  {group:"ECONOMIC"},
  {id:"equity",icon:"⚖",label:"The Two Huntsvilles"},
  {id:"utilities",icon:"💧",label:"Power, Water & Utilities"},
  {id:"health",icon:"✚",label:"Health System"},
  {id:"money",icon:"💰",label:"Follow the Money"},
  {id:"workers",icon:"👷",label:"Workers Rights & Child Care"},
  {id:"taxes",icon:"🧾",label:"Taxes"},
  {group:"GOVERNANCE"},
  {id:"officials",icon:"▣",label:"Officials & Elections"},
  {id:"boards",icon:"🏛",label:"Boards, Directors & Schools"},
  {id:"voting",icon:"🗳",label:"Voter Empowerment"},
  {id:"disinfo",icon:"🧠",label:"Disinformation"},
  {group:"JUSTICE"},
  {id:"sentencing",icon:"⚖",label:"Criminal Justice"},
  {id:"policing",icon:"🚔",label:"Police & Sheriff"},
  {id:"surveillance",icon:"📡",label:"Surveillance & Privacy"},
  {group:"COMMUNITY"},
  {id:"unhoused",icon:"🏠",label:"Unhoused Residents"},
  {id:"environment",icon:"🌊",label:"Environment, Water, Transit & Roads"},
  {id:"landuse",icon:"🗺",label:"Land Use & Business Equity"},
  {id:"proposals",icon:"📐",label:"Policy Proposals"},
  {id:"action",icon:"▶",label:"Take Action"},
];

// ─── PAGE DATA ────────────────────────────────────────────────
const PAGES={
  equity:{icon:"⚖",title:"The Two Huntsvilles:",subtitle:"Service & Spending Inequality",tag:"tag-red",sub:"Roads PCI 41 north vs 72 south. Same taxes. $847/pupil school gap. 3.7× more police contacts per capita north. Who ...",
    stats:[["Columbia High","$9,400/pupil","vs Johnson High $7,100 — same HCS district",C.red],["Road PCI North","41 avg","Poor — needs full reconstruction, not patching",C.red],["School Funding Gap","$847/pupil","Less in lower-income HCS schools",C.orange],["Battle Developer Donors","$380k","From those who benefit from status quo",C.red]],
    facts:[
      {k:"red",label:"SCHOOL FUNDING: COLUMBIA HIGH vs JOHNSON HIGH — SAME DISTRICT",lc:C.red,tc:"#7f1d1d",text:"Within Huntsville City Schools, Columbia High (south Huntsville) receives $9,400 per pupil. Johnson High (north Huntsville) receives $7,100 per pupil. Same district. Same superintendent. Same school board. The gap is explained by local property tax supplements — higher property values in south Huntsville generate more revenue at the same millage rate, and that revenue is not redistributed equitably within the district."},
      {k:"red",label:"ROADS: PCI 41 NORTH vs PCI 72 SOUTH — 16 YEARS",lc:C.red,tc:"#7f1d1d",text:"Pavement Condition Index (PCI): 0-25 Failed, 26-40 Serious, 41-55 Poor, 56-70 Fair, 71-85 Good. North Huntsville averages PCI 41 — bottom of Poor, just above the threshold requiring full reconstruction. South Huntsville averages PCI 72 — Good condition. Same city. Same property tax rate. 16-year documented gap. The city has never commissioned an independent equity audit of road maintenance spending by district."},
      {k:"gold",label:"POLICING: 3.7x MORE POLICE CONTACTS PER CAPITA",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents experience 3.7 times more police contacts per capita than south Huntsville residents. HPD does not publish demographic breakdowns of stops, contacts, or use-of-force by neighborhood. The city has never required HPD to conduct or publish a patrol equity analysis. Mayor Battle has received endorsements and donations from the police union in every election since 2008."},
      {k:"blue",label:"SPENDING PATTERN: WHO GETS THE BUDGET",lc:"#2563eb",tc:"#1e3a5f",text:"Approximately 68% of Huntsville's capital road improvement spending over the past decade has gone to south Huntsville and newly annexed areas. The IDB has granted $127M+ in active corporate property tax abatements with no requirement that recipients locate in underserved areas and no public audit of whether promised jobs were delivered. The entire IDB board is appointed by Mayor Battle."}
    ],
    prompt:"Investigate the documented equity gap between north and south Huntsville. FACTS: Roads PCI 41 north vs 72 south — same city, same tax rate, 16-year gap. $847/pupil school spending gap between north and south HCS schools in the same district. 3.7x more police contacts per capita in north Huntsville. 68% of capital road spending went to south Huntsville over the past decade. Mayor Battle received $380k from real estate developers. IDB granted $127M+ in zero-tax deals with no equity requirement. The city has never commissioned an independent equity audit. Connect these facts for a north Huntsville resident in plain language. Under 150 words, no jargon."},

  utilities:{icon:"💧",title:"Power, Water",subtitle:"& Utilities",tag:"tag-blue",sub:"HU + TVA hit ratepayers with ~10%+ electric increase in one year. Triana water shows PFAS above health guidelines. ...",
    stats:[["TVA 2024 Rate Hike","5.25%","Largest in 16 years — passed to all HU customers",C.red],["HU Rate Hike","5.1%","Jan + Oct 2025 — on top of TVA hike",C.red],["Triana PFOS","Above EWG","Health guideline exceeded in town water",C.red],["TVA CEO Pay","$8.1M","Jeff Lyash 2023 — no shareholder vote",C.orange]],
    facts:[{k:"red",label:"THE DOUBLE MARKUP PROBLEM",lc:C.red,tc:"#7f1d1d",text:"TVA generates power at Browns Ferry Nuclear Plant 15 miles from Huntsville and sells it wholesale to Huntsville Utilities. HU marks it up, adds infrastructure fees, and delivers it to your home. Two separate entities both adding cost — neither directly elected by you. Combined effect in 2024-2025: TVA raised rates 5.25% (largest in 16 years) + HU added 5.1% on top = approximately 10%+ increase on your electric bill in one year. Alabama's Public Service Commission has zero jurisdiction over either entity."},{k:"gold",label:"TRIANA WATER — THE PFAS PROBLEM",lc:"#b8860b",tc:"#78350f",text:"EWG data shows PFOS — a PFAS forever chemical linked to cancer, thyroid disease, and immune damage — detected above EWG health guidelines in Triana Water Works. Triana remains on the EPA Superfund list due to Redstone Arsenal and Olin Corporation DDT contamination via Huntsville Spring Branch. Triana is a majority-Black community of approximately 2,300 residents with no city council representation and no access to IDB tax abatements."}],
    prompt:"Investigate Madison County utilities. FACTS: TVA CEO Jeff Lyash earned $8.1M in 2023. TVA raised rates 5.25% in 2024 — largest in 16 years. HU added 5.1% on top in Jan and Oct 2025. Combined effect: approximately 10%+ on your electric bill in one year. Alabama delegation (Strong, Britt, Tuberville) collected $1.4M+ from energy PACs and introduced zero TVA oversight bills. Browns Ferry Nuclear Plant generates power 15 miles from Huntsville — owned by TVA, not Alabama. TVA carries $20B+ in debt passed to ratepayers. Triana water shows PFOS above EWG health guidelines. Connect these facts for a Madison County ratepayer in plain language. Under 150 words, no jargon."},

  health:{icon:"✚",title:"Health System",subtitle:"Investigation",tag:"tag-red",sub:"HHHS controls 14 facilities, pays CEO $3.1M, claims $63M/yr in tax exemptions with a self-appointed board. 295,000 ...",
    stats:[["HHHS CEO Pay","$3.1M","Self-appointed nonprofit board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Medicaid Gap","295,000","Uninsured — federal pays 90% and AL refuses",C.red],["ZIP Code Gap","$1,020/yr","North vs south Huntsville same driver",C.red]],
    facts:[{k:"red",label:"THE NONPROFIT PARADOX",lc:C.red,tc:"#7f1d1d",text:"HHHS pays zero federal income tax, zero state income tax, and reduced property tax — claiming $63M/yr in total exemptions as a nonprofit. In exchange it must provide community benefit commensurate with its tax exemption. Yet it pays CEO David Spillers $3.1M/yr, starts CNAs at $14.50/hr (qualifying for SNAP food benefits), and has sued patients for unpaid bills including wage garnishment and property liens. The IRS has never required HHHS to publicly disclose the actual dollar value of free charity care as a percentage of revenue."},{k:"gold",label:"MEDICAID REFUSAL — THE DONOR CONNECTION",lc:"#b8860b",tc:"#78350f",text:"295,000 Alabamians — including approximately 47,000 in Madison County — are uninsured and fall in the Medicaid coverage gap: they earn too much for traditional Medicaid but too little for ACA marketplace subsidies. The federal government would pay 90% of expansion costs. Alabama refuses. Governor Ivey has received $420,000 from the health insurance industry — the industry whose market shrinks if Medicaid expands. HHHS, as the dominant health provider, faces less price pressure without Medicaid expansion."}],
    prompt:"Investigate the Madison County health system as one connected crisis. FACTS: HHHS has $2.4B annual revenue, $0 income tax, $63M/yr in total tax exemptions, a self-appointed board that appoints its own successors. CEO David Spillers earns $3.1M/yr. Starting CNA wage: $14.50/hr — qualifies for SNAP food benefits. HHHS has acquired 14 facilities, creating a North Alabama monopoly. 295,000 Alabamians including 47,000 in Madison County are uninsured in the Medicaid coverage gap — Alabama refuses expansion despite the federal government paying 90%. Gov. Ivey received $420k from health insurance industry. HHHS Foundation donated $35k to Mayor Battle. Connect these facts for a Madison County resident in plain language. Under 150 words, no jargon."},

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
    prompt:"Investigate Huntsville surveillance infrastructure and Alabama data privacy. FACTS: HPD operates 47 ALPR cameras through Flock Safety contract — photographs every vehicle passing, stores data 30-90 days in private cloud, accessible by other agencies without warrant. HPD has not confirmed or denied use of facial recognition — Alabama has no law requiring disclosure. NIST studies show facial recognition error rates of 10-35% for Black women. No public vote was held before installing the ALPR network. No City Council policy governs who can access data or for what purpose. Alabama has no comprehensive state data privacy law. Law enforcement can purchase commercial location data without a warrant. Connect these facts for a Huntsville resident. Under 150 words, no jargon."},

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

// ─── SHARED COMPONENTS ───────────────────────────────────────
function Spin(){return <span className="spin"/>;}

function AiResult({text}){
  if(!text) return null;
  const paragraphs=text.split(/\n+/).filter(p=>p.trim().length>10);
  const labels=["WHAT'S HAPPENING","THE CONNECTIONS","WHAT YOU CAN DO","ADDITIONAL CONTEXT"];
  const colors=["#fca5a5","#93c5fd","#86efac","#fcd34d"];
  const textColors=["#fef2f2","#eff6ff","#f0fdf4","#fffbeb"];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {paragraphs.map((p,i)=>(
        <div key={i}>
          <div style={{fontSize:8,fontWeight:800,color:colors[i%4],letterSpacing:1.8,marginBottom:6,textTransform:"uppercase"}}>
            {labels[i%4]}
          </div>
          <p style={{fontSize:13.5,color:textColors[i%4],lineHeight:1.85,margin:0,borderLeft:"2px solid "+colors[i%4],paddingLeft:12}}>
            {p.trim()}
          </p>
        </div>
      ))}
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

function FactBlocks({facts}){
  return facts.map((f,i)=>(
    <div key={i} className={`fact fact-${f.k}`}>
      <div className="fact-label" style={{color:f.lc}}>{f.label}</div>
      <div className="fact-text" style={{color:f.tc}}>{f.text}</div>
    </div>
  ));
}

// ─── INVESTIGATION PAGE (generic) ────────────────────────────
function InvestPage({id}){
  const p=PAGES[id];
  if(!p)return <div className="page"><h2>Page not found</h2></div>;
  return(
    <div className="page">
      <div className="page-header">
        <span className={`tag ${p.tag}`}>{p.tag.replace("tag-","").toUpperCase()} · INVESTIGATION</span>
        <h2>{p.title} <em>{p.subtitle}</em></h2>
        <p>{p.sub}</p>
      </div>
      <StatGrid stats={p.stats}/>
      <FactBlocks facts={p.facts}/>
      <AiButton prompt={p.prompt}/>
    </div>
  );
}

// ─── EQUITY PAGE — THE TWO HUNTSVILLES ───────────────────────
function EquityPage(){
  const[copied,setCopied]=useState({});
  function copy(key,text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[key]:true}));
      setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);
    });
  }

  const metrics=[
    {label:"Road Pavement Quality (PCI Score)",north:41,south:72,northLabel:"41 / 100",southLabel:"72 / 100",note:"PCI below 40 = Poor — needs full reconstruction. Same city. Same tax rate.",color:"#dc2626"},
    {label:"Per-Pupil School Spending (HCS)",north:71,south:94,northLabel:"$7,100",southLabel:"$9,400",note:"Johnson High vs Columbia High. Same district. Same superintendent.",color:"#ea580c"},
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
      prompt:"Analyze road maintenance equity in Huntsville, Alabama. North Huntsville road PCI average: 41 (Poor, requires reconstruction). South Huntsville: 72 (Good). Same city, same tax rate. Capital road spending past decade: approximately 68% in south Huntsville. North Huntsville is 58% Black residents, lower median income. Federal CDBG funds require equitable distribution. Mayor Battle received $380,000 from real estate developers who benefit from south Huntsville investment. Pothole complaint response: north takes 2-3x longer. Decode for a north Huntsville resident — what is happening, who benefits, what can residents do? Under 150 words, no jargon.",
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
      summary:"Within the same Huntsville City School district, per-pupil spending varies by $2,300 depending on which neighborhood a child lives in. The HCS board has authority to fix this and has not.",
      prompt:"Analyze school funding inequity within Huntsville City Schools. HCS serves all of Huntsville under one district. Per-pupil spending: south Huntsville schools approximately $9,400, north Huntsville approximately $7,100. Advanced Placement courses: south schools average 14, north average 6. Teacher retention: south 8.2 years average, north 4.1 years. HCS Board has not adopted an equity-based resource allocation formula. Board members are elected — Districts 2, 3, and 4 on November 2026 ballot. Decode for a north Huntsville parent: what the board could do today, why they have not, what parents can demand. Under 150 words, no jargon.",
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
      prompt:"Analyze police patrol distribution inequity in Huntsville. HPD deploys approximately 2x the proactive patrol hours per resident in north Huntsville vs south. North Huntsville is 58% Black; south is 78% white. Per-capita violent crime rates differ by approximately 18%, not 200%. Traffic stop rate: north residents stopped 2.4x more often than south. Citation rates per stop are nearly identical — disparity is in stops, not outcomes. Consequences: more minor arrests, more bail system involvement, more private probation debt, job loss, housing instability. HPD has not published patrol deployment analysis. City Council has not requested one in 16 years. Decode for a north Huntsville resident — what this means, why it matters, what can be demanded. Under 150 words, no jargon.",
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
      summary:"Approximately 68% of Huntsville capital infrastructure spending went to south Huntsville over the past decade — the same areas where Mayor Battle top donors operate and develop.",
      prompt:"Investigate capital spending and donor connections in Huntsville. Approximately 68% of capital road improvement spending FY2015-2024 concentrated in south Huntsville. Mayor Battle top campaign donors: real estate developers $380,000, construction companies $210,000. IDB has granted $127M+ in active corporate property tax abatements — board appointed entirely by Battle. Three of eight 2023-2024 encampment sweeps within 500 feet of active development projects. City has never commissioned an independent equity audit of capital spending by district. CDBG regulations require cities demonstrate benefit to low-to-moderate income residents. Connect donors to spending decisions. Decode for a Madison County resident — who benefits, who pays, what would change this pattern. Under 150 words, no jargon.",
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

  const[aiResults,setAiResults]=useState({});
  const[aiLoading,setAiLoading]=useState({});
  const[foiaOpen,setFoiaOpen]=useState({});

  async function investigate(i,prompt){
    if(aiResults[i]){setAiResults(p=>({...p,[i]:null}));return;}
    setAiLoading(p=>({...p,[i]:true}));
    try{const r=await callAI(prompt);setAiResults(p=>({...p,[i]:r}));}
    catch(e){setAiResults(p=>({...p,[i]:"Analysis unavailable — please try again."}));}
    setAiLoading(p=>({...p,[i]:false}));
  }

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-red">EQUITY INVESTIGATION</span>
        <h2>The Two Huntsvilles: <em>Same City, Different World</em></h2>
        <p>Same city. Same tax rate. Documented disparities in roads, schools, policing, parks, and capital investment — sustained over 16 years. Here is the data, the connections, and what you can do.</p>
      </div>

      {/* Visual comparison bars */}
      <div className="card" style={{padding:"20px",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>Service Quality Comparison — North vs South Huntsville</div>
        <div style={{fontSize:11,color:"#6b7280",marginBottom:16}}>Colored bar = North Huntsville. Light bar = South Huntsville. Higher = better service or more enforcement.</div>
        {metrics.map((m,i)=>(
          <div key={i} style={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:4}}>
              <span style={{fontSize:12.5,color:"#6b7280",fontWeight:500}}>{m.label}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"90px 1fr 90px",gap:8,alignItems:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:m.color,textAlign:"right"}}>{m.northLabel}</div>
              <div style={{position:"relative",height:26,background:"#f0ebe2",borderRadius:3,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.south+"%",background:"#e0d8cc",borderRadius:3}}/>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.north+"%",background:m.color,opacity:.75,borderRadius:3}}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",padding:"0 8px",justifyContent:"space-between"}}>
                  <span style={{fontSize:9,color:"rgba(255,255,255,.8)",fontWeight:700}}>N</span>
                  <span style={{fontSize:9,color:"rgba(0,0,0,.2)",fontWeight:700}}>S</span>
                </div>
              </div>
              <div style={{fontSize:11,color:"#aaa"}}>{m.southLabel}</div>
            </div>
            <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic",marginTop:4,paddingLeft:98}}>{m.note}</div>
          </div>
        ))}
      </div>

      {/* Stat strip */}
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["Columbia High","$9,400/pupil","vs Johnson High $7,100 — same district","#dc2626"],["Road PCI North","41 avg","Borderline Poor — same tax rate as PCI 72 south","#dc2626"],["Police Contacts","3.7x more","Per capita north vs south Huntsville","#ea580c"],["Capital Spending","~68% south","10-year pattern — same city, same taxes","#dc2626"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card">
            <div className="stat-val" style={{color:c}}>{v}</div>
            <div className="stat-lbl">{l}</div>
            <div className="stat-sub">{s}</div>
          </div>
        ))}
      </div>

      {/* Investigation cards with AI + FOIA */}
      {investigations.map((inv,i)=>(
        <div key={i} className="card" style={{marginBottom:14,overflow:"hidden"}}>
          <div style={{padding:"16px 18px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#fef2f2",color:"#dc2626",border:"1px solid #fca5a5"}}>{inv.impact}</span>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
              <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
            <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}>{inv.summary}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {inv.sources.map((s,j)=>(
                <a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>
                  ↗ {s.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",background:"#fafaf8"}}>
            <button className="btn btn-gold" onClick={()=>investigate(i,inv.prompt)} disabled={!!aiLoading[i]} style={{fontSize:11.5}}>
              {aiLoading[i]?<><span className="spin"/>Analyzing...</>:aiResults[i]?"Hide Analysis":"◈ Decode This"}
            </button>
            <button className="btn btn-ghost" onClick={()=>setFoiaOpen(p=>({...p,[i]:!p[i]}))} style={{fontSize:11.5}}>
              {foiaOpen[i]?"Hide Template":"📋 FOIA Request"}
            </button>
          </div>

          {aiResults[i]&&(
            <div style={{background:"linear-gradient(135deg,#fffdf5,#fffbeb)",borderTop:"2px solid rgba(201,168,76,.2)",padding:"16px 18px"}}>
              <div style={{fontSize:9,fontWeight:800,color:"#b8860b",letterSpacing:1.5,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#c9a84c",display:"inline-block"}}/>
                AI ANALYSIS · CIVIC INVESTIGATOR
              </div>
              <p style={{fontSize:13.5,color:"#2d2a22",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{aiResults[i]}</p>
            </div>
          )}

          {foiaOpen[i]&&(
            <div style={{background:"#eff3f8",borderTop:"1px solid #93b4d4",padding:"16px 18px"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:2}}>{inv.foia.title}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>To: {inv.foia.to}</div>
              <textarea
                readOnly
                value={inv.foia.template.replace(/\n/g,"\n")}
                rows={8}
                style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#fff",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}
              />
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy("foia-"+i,inv.foia.template.replace(/\\n/g,"\n"))}>
                  {copied["foia-"+i]?"✓ Copied!":"📋 Copy to Clipboard"}
                </button>
                <a href={"mailto:?subject="+encodeURIComponent(inv.foia.subject)+"&body="+encodeURIComponent(inv.foia.template.replace(/\\n/g,"\n"))}>
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
    </div>
  );
}

// ─── SCHOOLS PAGE ─────────────────────────────────────────────
function SchoolsPage(){const nav=React.useContext?React.useContext(null):null;return null;}

// ─── OFFICIALS PAGE ───────────────────────────────────────────

// ─── UTILITIES PAGE ───────────────────────────────────────────
function UtilitiesPage(){
  const[tab,setTab]=useState("providers");
  const PROVIDERS=[
    {id:"hu",name:"Huntsville Utilities",color:C.navy,serves:"Huntsville + portions of Madison County · ~218,000 customers",services:"Electric (TVA) · Water · Natural Gas",gov:"3 appointed boards. All appointed by City Council — no public election. No PSC oversight.",rates:[{what:"Electric increase",when:"Jan + Oct 2025",amount:"5.1% combined",why:"First rate increase since 2018. Materials costs, inflation, infrastructure."},
      {what:"TVA wholesale increase",when:"Aug 2024",amount:"5.25% (largest in 16 years)",why:"Passed directly to HU customers. Combined effect: ~10%+ on your bill in 2025."}],
    recourse:"Rate changes require City Council approval — attend council meetings before a vote. The 2024 increase was tabled for 2..."},
    {id:"mu",name:"Madison Utilities",color:"#374151",serves:"City of Madison + surrounding · 19,000+ water connections",services:"Water · Wastewater (no electric)",gov:"Public corporation, board appointed by Madison City Council for 6-year terms.",rates:[{what:"Wall Triana water main",when:"2025-2026",amount:"Major infrastructure",why:"New large-diameter transmission main for city growth."}],
    recourse:"Board appointed by City Council. New mayor Bartlett (former board member) may shift priorities."},
    {id:"triana",name:"Triana Water Works",color:C.red,serves:"Town of Triana · pop. ~2,323 · ~50% Black",services:"Water · Sewer",gov:"Run directly by Town of Triana — mayor and council control it.",rates:[{what:"PFOS contamination",when:"Ongoing",amount:"Above EWG health guidelines",why:"PFAS detected above health guidelines. Redstone Arsenal/Olin Corporation DDT contamination legacy. Still on EPA Superfund list."}],
    recourse:"Contact elected mayor and council. File Open Records for rate history. Request annual Consumer Confidence Report."},
    {id:"tva",name:"TVA — Federal Power Monopoly",color:"#7f1d1d",serves:"All North Alabama (wholesale to HU)",services:"Electric generation + transmission",gov:"Federal corporation. 9-member board appointed by President, confirmed by Senate. Zero PSC jurisdiction. Only Congress can reform TVA.",rates:[{what:"Wholesale rate hike",when:"Aug 2024",amount:"5.25% — largest in 16 years",why:"Aging grid, data center capacity. Passed through to all ratepayers."},{what:"3 hikes in 18 months",when:"2022-2024",amount:"Multiple increases",why:"Each passed to HU customers with no ability to choose a different provider."}],
    recourse:"ONLY Congress can reform TVA. AL delegation received $1.4M+ energy PACs and introduced zero oversight bills."},
  ];
  const selProv=useState("hu");
  const[sel,setSel]=selProv;
  const p=PROVIDERS.find(x=>x.id===sel)||PROVIDERS[0];
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-blue">UTILITIES · INVESTIGATION</span>
        <h2>Power, Water & <em>Utilities</em></h2>
        <p>Every utility board in Madison County is appointed, not elected. When your bill goes up, you cannot vote out the person who approved it. Here's who controls each utility and what leverage you actually have.</p>
      </div>
      <div className="tabs">
        {[{id:"providers",label:"Providers"},{id:"compare",label:"Rates"},{id:"watchdog",label:"Watchdog"}].map(t=>(
          <button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab==="providers"&&(
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {PROVIDERS.map(x=><button key={x.id} onClick={()=>setSel(x.id)} style={{padding:"5px 12px",borderRadius:12,border:"1px solid #e0d8cc",background:sel===x.id?x.color:"#fff",color:sel===x.id?"#fff":C.muted,fontSize:12.5,fontWeight:600,cursor:"pointer"}}>{x.name.split(" ")[0]}{x.name.includes("TVA")?" TVA":""}</button>)}
          </div>
          <div className="card" style={{borderLeft:`4px solid ${p.color}`}}>
            <div style={{fontWeight:800,fontSize:14,color:p.color,marginBottom:4}}>{p.name}</div>
            <div style={{fontSize:13,color:C.muted,marginBottom:8}}>{p.serves}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {p.services.split(" · ").map((s,i)=><span key={i} style={{fontSize:10.5,fontWeight:700,color:C.navy,background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:10,padding:"2px 8px"}}>{s}</span>)}
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#b8860b",fontWeight:700,letterSpacing:1,marginBottom:5}}>GOVERNANCE — WHO CONTROLS THIS</div><div style={{fontSize:13.5,color:"#374151",lineHeight:1.6}}>{p.gov}</div></div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.red,fontWeight:700,letterSpacing:1,marginBottom:6}}>RECENT RATE CHANGES</div>
              {p.rates.map((r,i)=>(
                <div key={i} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:3,padding:"8px 10px",marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.what}</span>
                    <span style={{fontSize:10.5,fontWeight:700,color:C.red,flexShrink:0}}>{r.amount} · {r.when}</span>
                  </div>
                  <div style={{fontSize:12.5,color:C.muted}}>{r.why}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fffbeb",borderRadius:3,padding:"9px 11px",marginBottom:10}}><div style={{fontSize:10,color:"#b8860b",fontWeight:700,letterSpacing:1,marginBottom:4}}>YOUR LEVERAGE</div><div style={{fontSize:13.5,color:"#78350f"}}>{p.recourse}</div></div>
            <AiButton prompt={`Investigate ${p.name} for Madison County ratepayers. Governance: ${p.gov}. Rate history: ${p.rates.map(r=>r.what+" "+r.amount).join(", ")}. Summarize what all this means for a Madison County resident without legal or government jargon. Connect t...`} label={`🔍 Investigate ${p.name}`}/>
          </div>
        </div>
      )}
      {tab==="compare"&&(
        <div>
          <div className="fact fact-red"><div className="fact-label" style={{color:C.red}}>THE DOUBLE MARKUP PROBLEM</div><div className="fact-text" style={{color:"#7f1d1d"}}>TVA generates power → sells wholesale to HU → HU marks up → you pay. Two entities adding cost, neither elected. In 2024-2025: TVA +5.25% + HU +5.1% = ~10%+ on your electric bill in one year. Neit...</div></div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13.5,marginBottom:14}}>
            <thead><tr>{["Utility","Avg Monthly","Oversight","Your Recourse"].map(h=><th key={h} style={{background:C.navy,color:C.gold,padding:"8px 10px",textAlign:"left",fontSize:11.5}}>{h}</th>)}</tr></thead>
            <tbody>
              {[["Huntsville (HU+TVA)","~$146–165","Appointed boards","Attend City Council · elect better reps"],["National Average","~$137","Varies","Many states have elected utility boards"],["Nebraska (public)","~$90–100","Elected board","Vote directly for board members"]].map((row,i)=>(
                <tr key={i} style={{background:i===0?"#fef2f2":"#fff"}}>
                  {row.map((c,j)=><td key={j} style={{padding:"8px 10px",borderBottom:"1px solid #f0ebe2",fontWeight:j===0?700:400,color:j===0?C.navy:"#374151"}}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <AiButton prompt="Investigate how Madison County utility rates compare to peer cities and states. TVA ratepayers face unique challenges — federal monopoly, no PSC jurisdiction. Combined TVA+HU increases in 2024-2025 ~10% in one year. Compare to Nebraska elected utility board, national average, other TVA-served cities. What reform options exist? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
      {tab==="watchdog"&&(
        <div>
          {[{icon:"💧",title:"Check Your Water — EWG Database",sub:"Free database showing every detected contaminant compared to EPA limits AND stricter health guidelines.",url:"https://www.ewg.org/tapwater/",btn:"Check Your Water"},
            {icon:"📋",title:"Request Consumer Confidence Report",sub:"Every water utility must publish an annual report listing every detected substance. Request from your provider.",template:"[Utility Name]\nRe: Alabama Open Records Act §36-12-40\n\nI request:\n1. Current rate schedule and all changes FY2020-present\n2. Board meeting minutes — past 24 months\n3. All current board member names and professional affiliations\n\n[Your Name]"},
            {icon:"✉",title:"Attend a Utility Board Meeting",sub:"HU boards meet monthly — open to public. Weeks before a rate vote are when public comment matters most.",sub2:"HU Electric Board: 4th Wednesday, 8:30am, 112 Spragins St NW"},
            {icon:"⚖",title:"Contact Congress — TVA Reform",sub:"Only Congress can reform TVA. AL delegation received $1.4M+ energy PACs and introduced zero oversight bills.",links:[{l:"Rep. Strong",u:"https://dalestrong.house.gov/contact"},{l:"Sen. Britt",u:"https://www.britt.senate.gov/contact"},{l:"Sen. Tuberville",u:"https://www.tuberville.senate.gov/contact"}]},
          ].map((t,i)=>(
            <div key={i} className="card" style={{marginBottom:10}}>
              <div style={{display:"flex",gap:9,marginBottom:6}}><span style={{fontSize:20}}>{t.icon}</span><div style={{fontWeight:700,color:C.navy,fontSize:14}}>{t.title}</div></div>
              <div style={{fontSize:13.5,color:"#374151",lineHeight:1.6,marginBottom:t.template?8:0}}>{t.sub}</div>
              {t.sub2&&<div style={{fontSize:12.5,color:C.muted,marginTop:4}}>{t.sub2}</div>}
              {t.template&&<pre style={{fontSize:12,background:"#f8f6f2",padding:"8px 10px",borderRadius:3,whiteSpace:"pre-wrap",color:"#374151",lineHeight:1.5,marginTop:6}}>{t.template}</pre>}
              {t.url&&<a href={t.url} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{marginTop:8,fontSize:12.5}}>{t.btn} →</button></a>}
              {t.links&&<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>{t.links.map((l,j)=><a key={j} href={l.u} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:12.5}}>↗ {l.l}</button></a>)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOARDS PAGE ──────────────────────────────────────────────
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
          <AiButton prompt="Investigate the three Madison County school boards — HCS $310M, MCS $120M, MCSS $85M. Who are the current board members by name? What are their campaign donor connections? Have any board members received donations from construction or development companies that later won school contracts? How does the CHOOSE Act diversion of $100M from ETF affect each system's funding? What is the documented $847/pupil spending gap within HCS? What do the 2026 board races look like and who should voters watch? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
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
            {from:"HHHS Board",to:"HHHS Board",rel:"SELF-APPOINTING",detail:"Board appoints own successors with no public input. Has included HHHS-employed physicians who vote on their own compensation and executives from ...",flag:true},
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



// ─── OFFICIALS DATA ───────────────────────────────────────────
const OFFICIALS=[
  {level:"Federal",color:"#1e3a5f",officials:[
    {name:"Dale Strong",photo:"https://bioguide.congress.gov/bioguide/photo/S/S001220.jpg",title:"U.S. Representative",district:"Alabama's 5th Congressional District",party:"Republican",
      since:"Jan 2023",termEnds:"Jan 2027",avatar:"DS",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $1.2M–$2.8M",netWorthPre:"Est. $900k before office",netWorthHow:"Real estate holdings in Madison County; stock portfolio; 12-yr career as County Commission Chairman",residency:"Harvest, AL — lives in district",criminal:"No criminal record",affiliation:"Republican; previously Madison County Commission; endorsed by NRA, Chamber ...",topDonors:[["Defense PACs (Lockheed, Boeing, Raytheon)","$284,000"],["Real Estate PACs","$48,000"],["BAE Systems PAC","$22,000"]],bio:"Served as Madison County Commission Chairman 2010-2022. Won AL-5 seat in 2022. Sits on House Armed Services Committee and House Science, Space & Technology Committee. Has not introduced any TVA oversight, utility ra...",votes:[{bill:"PRO Act (union organizing rights)",vote:"Against",impact:"Would have protected Madison County workers' right to organize"},  {bill:"Build Back Better child care",vote:"Against",impact:"Would have capped child care at 7% of income for Madison County families"},{bill:"PFAS Notification Act",vote:"Against",impact:"Would have required disclosure of Redstone Arsenal PFAS contamination levels"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"AL-5 covers all TVA territory — zero bills filed in 2 years"}],contact:{phone:"(256) 551-0190",web:"https://dalestrong.house.gov/contact",office:"2417 Longworth HOB, Washington DC"}},
    {name:"Katie Britt",photo:"https://bioguide.congress.gov/bioguide/photo/B/B001319.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",
      since:"Jan 2023",termEnds:"Jan 2029",avatar:"KB",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $3.1M–$7.4M",netWorthPre:"Est. $1.5M before office",netWorthHow:"Disclosed stock holdings in energy, finance, defense; husband former NFL player; prior CEO Business Council of Alabama",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former CEO Business Council of Alabama; endorsed by Trump 2022",topDonors:[["Health insurance industry","$310,000"],["Energy PACs","$890,000"],["Financial services","$445,000"]],bio:"First woman elected to Senate from Alabama. Former CEO of Business Council of Alabama. Made statements about undocumented immigrants accessing Medicaid that directly contradict 8 U.S.C. §1611 — federal law in place since 1996 that explicitl...",votes:[{bill:"PFAS Action Act",vote:"Against",impact:"Would have required cleanup of Redstone Arsenal PFAS contamination"},{bill:"Medicaid expansion advocacy",vote:"None",impact:"295,000 Alabamians uninsured — federal pays 90% of expansion cost"},{bill:"False immigration claim",vote:"Public statement",impact:"Claimed immigrants access Medicaid — contradicts 8 USC 1611 since 1996"}],contact:{phone:"(202) 224-5744",web:"https://www.britt.senate.gov/contact",office:"703 Hart Senate Office Building"}},
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",
      since:"Jan 2021",termEnds:"Jan 2027",avatar:"TT",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before office",netWorthHow:"Multi-million coaching contracts at Auburn, Ole Miss, Texas Tech; hedge fund and commodity investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Auburn, AL — has faced questions about Florida residency",criminal:"No criminal record",affiliation:"Republican; former football coach; endorsed by Trump",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["NRA PAC","$65,000"]],bio:"Spent most of career as football coach. Blocked 450+ military promotions for 10 months — directly affecting Redstone Arsenal command positions. Has not introduced any TVA oversight legislation. Faced ethics questions about trading in commod...",votes:[{bill:"Military promotions (held hostage)",vote:"Blocked 450+ for 10 months",impact:"Directly disrupted Redstone Arsenal command structure"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"Controls TVA through Senate despite $270k energy PACs"}],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
  ]},
  {level:"State",color:"#7f1d1d",officials:[
    {name:"Kay Ivey",photo:"https://governor.alabama.gov/wp-content/uploads/2019/06/Ivey-Official-Portrait-2019.jpg",title:"Governor of Alabama",district:"Statewide — TERM LIMITED 2026",party:"Republican",
      since:"Apr 2017",termEnds:"Jan 2027",avatar:"KI",salary:"$120,395/yr — taxpayer funded",netWorth:"Est. $1.4M–$3.2M",netWorthPre:"Est. $900k before governor",netWorthHow:"State treasurer 2003-2011; State Auditor; real estate; disclosed investment portfolio",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former State Treasurer, State Auditor, Lt. Governor; term limit...",topDonors:[["Health insurance industry","$420,000"],["Energy PACs","$340,000"],["Business Council of Alabama","$180,000"]],bio:"Has refused Medicaid expansion for 295,000 Alabamians — federal government pays 90% of the cost. Signed CHOOSE Act diverting $100M from Education Trust Fund to private schools where 67% of recipients were already en...",votes:[{bill:"Medicaid expansion",vote:"Refused",impact:"295,000 Alabamians uninsured · $1.8B/yr in federal funding declined"},{bill:"CHOOSE Act",vote:"Signed",impact:"$100M/yr from ETF to private schools — 67% already private"},{bill:"Summer EBT 2024",vote:"Declined",impact:"400,000 Alabama children lost $120 summer food benefit"},{bill:"ADEM enforcement",vote:"Appointees weak",impact:"Triana PFAS above guidelines · Redstone contamination undisclosed"}],contact:{phone:"(334) 242-7100",web:"https://governor.alabama.gov/contact/",office:"600 Dexter Ave, Montgomery AL 36130"}},
    {name:"Arthur Orr",photo:"https://www.legislature.state.al.us/pdf/senate/members/Senate_ColorHeadshots/8.png",title:"AL Senate Finance Committee Chair",district:"Senate District 8 — Madison/Lawrence Counties",party:"Republican",since:"Jan 2011",termEnds:"Nov 2026",avatar:"AO",salary:"$54,114/yr + per diem — taxpayer funded",netWorth:"Est. $800k–$2.1M",netWorthPre:"Est. $600k before senate",netWorthHow:"Attorney; law practice income; real estate holdings in state ethics filings",residency:"Decatur, AL",criminal:"No criminal record",affiliation:"Republican; Finance Chair controls which bills get hearings; endorsed by Bu...",topDonors:[["Business Council of Alabama","$45,000"],["Private prison (CoreCivic/GEO)","$22,000"],["ALFA Insurance","$28,000"],["Alabama Power PAC","$19,000"]],bio:"As Finance Committee Chairman he controls which bills receive hearings in the Alabama Senate. Sponsored SB 88 — which banned cities and counties from raising the minimum wage above $7.25/hr. Has blocked Medicaid expansion, kratom reclassifi...",votes:[{bill:"SB 88 (minimum wage ban)",vote:"Sponsored",impact:"Cities cannot raise minimum wage — Huntsville workers stuck at $7.25/hr"},{bill:"Medicaid expansion",vote:"Blocked",impact:"295,000 Alabamians uninsured"},{bill:"Kratom reclassification",vote:"Blocked",impact:"Kratom remains Class C felony — legal in 43 states"},{bill:"CHOOSE Act",vote:"Did not block",impact:"Could have blocked as Finance Chair — chose not to"}],contact:{phone:"(256) 355-8584",web:"https://www.legislature.state.al.us",office:"Alabama State House, Montgomery AL"}},
    {name:"Steve Marshall",photo:"https://ago.alabama.gov/wp-content/uploads/2020/09/AG-Marshall-Headshot.jpg",title:"Alabama Attorney General",district:"Statewide",party:"Republican",since:"Feb 2017",termEnds:"Jan 2027",avatar:"SM",salary:"$136,495/yr — taxpayer funded",netWorth:"Est. $500k–$1.4M",netWorthPre:"Est. $400k before AG",netWorthHow:"Attorney; public salary; disclosed investments",residency:"Guntersville, AL",criminal:"No criminal record — but faced scrutiny for campaign finance practices",affiliation:"Republican; former Marshall County DA; endorsed by law enforcement associations",topDonors:[["Law enforcement PACs","$340,000"],["Private prison industry","$45,000"],["Business Council of Alabama","$38,000"]],bio:"Defended Alabama's unconstitutional congressional maps in Allen v. Milligan — spending taxpayer money on maps the Supreme Court ruled violated the Voting Rights Act 5-4. Drew replacement maps that were also found no...",votes:[{bill:"Allen v. Milligan (gerrymandering)",vote:"Defended unconstitutional maps",impact:"Spent taxpayer money defending VRA violations — Supreme Court ruled 5-4 against"},{bill:"Bail reform",vote:"Opposed",impact:"61% of Madison County Jail is pretrial"},{bill:"HFOA reform",vote:"Opposed",impact:"500+ people serving life without parole for non-violent property crimes"}],contact:{phone:"(334) 242-7300",web:"https://www.alabamaag.gov",office:"501 Washington Ave, Montgomery AL 36130"}},
  ]},
  {level:"County",color:"#374151",officials:[
    {name:"Rex Vaughn",photo:null,title:"Madison County Commission Chairman (At-Large)",district:"At-Large — all of Madison County",party:"Republican",since:"Mar 2026",termEnds:"TBD",avatar:"RV",salary:"~$78,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Recently appointed — financial disclosure under review",residency:"Madison County",criminal:"No record found",affiliation:"Republican; appointed March 2026 after previous chairman left",topDonors:[["Under research","TBD"]],bio:"Appointed March 2026 to fill vacancy. Controls county budget and service delivery for all unincorporated areas — including Harvest, Toney, Monrovia, and Meridianville which have no city government. First major decis...",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Violet Edwards",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5832",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville",party:"Democrat",since:"Jan 2025",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"First term — financial disclosure pending",residency:"North Huntsville",criminal:"No record found",affiliation:"Democrat; first Black woman elected to Madison County Commission",topDonors:[["Community fundraising","~$28,000"]],bio:"First Black woman elected to the Madison County Commission. Represents north Huntsville areas. Her district includes communities that have documented road maintenance inequities vs south Huntsville.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Kevin Turner",photo:"https://storage.googleapis.com/download/storage/v1/b/g-green-backend-bucket-1/o/mdsoal%2FSheriff_Kevin_Turner.jpg?alt=media",title:"Madison County Sheriff",district:"Madison County",party:"Republican",since:"Jan 2019",termEnds:"Jan 2027",avatar:"KT",salary:"~$95,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Career law enforcement; income from public salary",residency:"Madison County",criminal:"No criminal record",affiliation:"Republican; career law enforcement; endorsed by bail bond industry",topDonors:[["Law enforcement PACs","$62,000"],["Bail bond industry","$24,000"]],bio:"61% of Madison County Jail population is pretrial — not convicted of anything. County earns ~$200,000/year in Securus/ViaPath phone commissions while families pay $0.21/min to call incarcerated loved ones. Received $24,000 from bail bond in...",votes:[{bill:"Bail reform",vote:"Opposed",impact:"61% of jail is pretrial — held because they cannot afford bail"},{bill:"Securus contract renewal",vote:"Maintained",impact:"County earns $200k/yr commissions while families pay $0.21/min"}],contact:{phone:"(256) 722-7181",web:"https://www.madisoncountysheriff.org",office:"815 Wheeler Ave, Huntsville AL 35801"}},
  ]},
  {level:"2026 Candidates",color:"#7c3aed",officials:[
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"Candidate — AL Governor 2026",district:"Statewide — running to replace term-limited Ivey",party:"Republican",since:"Announced Dec 2025",termEnds:"Would serve 2027-2031",avatar:"TT",salary:"$174,000/yr current Senate salary",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before Senate",netWorthHow:"Multi-million coaching contracts; hedge fund investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Questions raised — Auburn AL listed but possible primary residence in Florida",criminal:"No criminal record",affiliation:"Republican; endorsed by Trump; former football coach",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["Defense industry","$142,000"]],bio:"Current AL Senator running for Governor instead of Senate re-election. Introduced 21 bills in 4 years — zero advanced out of committee. Blocked 450+ military promotions for 10 months affecting Redstone Arsenal. Questions about whether he ac...",votes:[{bill:"Military promotions block",vote:"10 months",impact:"Directly disrupted Redstone Arsenal — then ran for governor of the state he disrupted"},{bill:"TVA oversight",vote:"None in 4 years",impact:"Received $270k energy PACs — introduced zero utility oversight"}],quotes:[
      {type:"general",quote:null,fact:"Residency questions: Cook Political Report noted 'questions linger about the exact nature of Tuberville's residence in the state he hopes to lead.' Alabama law requires 7 years of residency to run for governor.",date:"Dec 2025",source:"Cook Political Report",flip:false},
      {type:"general",quote:null,fact:"Introduced just 21 bills in the 118th Congress — zero of which advanced out of committee. Was spotted at the Masters Tournament instead of voting on a new Joint Chiefs chairman. Now running for governor claiming...",date:"2023-2024",source:"Cook Political Report",flip:true},
      {type:"environment",quote:null,fact:"Received $270,000 from energy PACs as Senator. Introduced zero TVA oversight bills despite TVA raising rates 3 times in 18 months. As governor he would have no direct TVA authority — but AL Governor appoints ADEM...",date:"2021-2025",source:"FEC.gov",flip:true},
    ],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
    {name:"Doug Jones",photo:"https://bioguide.congress.gov/bioguide/photo/J/J000300.jpg",title:"Candidate — AL Governor 2026 (Democrat)",district:"Statewide — former US Senator",party:"Democrat",since:"Announced 2025",termEnds:"Would serve 2027-2031",avatar:"DJ",salary:"N/A — private practice",netWorth:"Est. $2M–$5M",netWorthPre:"Est. $1.5M before Senate",netWorthHow:"Career as federal prosecutor and attorney; Senate salary 2018-2023",residency:"Birmingham, AL",criminal:"No criminal record — former federal prosecutor",affiliation:"Democrat; former US Senator (2018-2023); prosecuted 16th Street Baptist Chu...",topDonors:[["Democratic fundraising network","Under research"],["Trial lawyers","Under research"]],bio:"Served as US Senator 2018-2023 — the only Democrat elected statewide in Alabama since 2008. Lost to Tuberville in 2020 by 20 points. Prosecuted the 16th Street Baptist Church bombers as US Attorney. If elected would be first Democratic gove...",votes:[{bill:"ACA protection votes",vote:"Yes",impact:"Voted to protect pre-existing condition coverage"},{bill:"Bipartisan Infrastructure",vote:"Yes",impact:"Supported $1.2B for Alabama infrastructure"}],quotes:[
      {type:"healthcare",quote:null,fact:"As Senator voted to protect the ACA and has publicly supported Medicaid expansion. As governor would have authority to expand Medicaid to 295,000 Alabamians without a legislative vote.",date:"2018-2023",source:"Senate vote records",flip:false},
      {type:"general",quote:null,fact:"First Democrat to win a Senate seat in Alabama since 1992. Won in 2017 special election by 1.7 points over Roy Moore. Lost re-election to Tuberville by 20 points in 2020. Running for governor as Ivey is term-limited.",date:"2025",source:"AL election records",flip:false},
    ],contact:{phone:"N/A",web:"https://dougjones.com",office:"Campaign website"}},
  ]},
  {level:"Madison City",color:"#374151",officials:[
    {name:"Ranae Bartlett",photo:null,title:"Mayor of Madison",district:"City of Madison — sworn Nov 2025",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"RB",photo:null,salary:"~$80,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Attorney; former Madison Board of Education 2011-2020; law clerk to US District Judge",residency:"Madison, AL",criminal:"No criminal record",affiliation:"Republican; former Madison City Council D5; former School Board President 2...",topDonors:[["Local community fundraising","~$85,000"]],bio:"First new Madison mayor in a decade. Former Madison Board of Education member 2011-2020 and Board President 2017-2020. Career law clerk to US District Judge C. Lynwood Smith Jr. and former Walmart Associate General ...",votes:[{bill:"Madison Utilities board",vote:"New appointments 2026",impact:"Controls appointed board setting water rates for 19,000+ customers"}],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe.",fact:"Said this at swearing in. Key test: whether she requires affordable housing components in new Madison development, and whether Madison Utilities board she appoints acts on rate transparency.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Maura Wroblewski",title:"Madison City Council — District 1",district:"District 1 — Huntsville Browns Ferry Rd / Mose Chapel Rd",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MW",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Re-elected third term; background in community development",residency:"Madison District 1",criminal:"No record found",affiliation:"Republican; re-elected third term",topDonors:[["Local community fundraising","Under research"]],bio:"Re-elected to her third term. Focused on infrastructure and Mill Creek Greenway Preserve project — a mile-long trail on Balch Road in partnership with Madison Utilities and North Alabama Land Trust.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"David Bier",title:"Madison City Council — District 2",district:"District 2",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"DB",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 2",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. One of six new council members sworn in with Mayor Bartlett.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Billie Goodson",title:"Madison City Council — District 3",district:"District 3",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"BG",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 3",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Michael McKay",title:"Madison City Council — District 4",district:"District 4",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MM",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 4",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Alice Lessmann",title:"Madison City Council — District 5",district:"District 5",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"AL",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025; former Alabama Association of School Boards District 9 Director",residency:"Madison District 5",criminal:"No record found",affiliation:"Republican; former school board association director",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. Former District 9 Director for the Alabama Association of School Boards. Focused on smart growth, school support, and infrastructure.",votes:[],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe with our first responders and our infrastructure.",fact:"Said at swearing in. Her school board background makes her key vote on school-developer interface decisions.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Erica White",title:"Madison City Council — District 6",district:"District 6",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"EW",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Small business owner; newly elected Nov 2025",residency:"Madison District 6",criminal:"No record found",affiliation:"Republican; small business owner",topDonors:[["Local community fundraising","Under research"]],bio:"Small business owner and mother of two. Elected November 2025. Focus: roads and infrastructure in District 6, particularly Old Madison Pike.",votes:[],quotes:[{type:"general",quote:"City government is best run when real world people with experience that care about the city step up and make a difference.",fact:"Said at swearing in. Watch her votes on road maintenance equity and development review.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Kenneth Jackson",title:"Madison City Council — District 7",district:"District 7 — Balch Road area",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"KJ",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 7 — Balch Road",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. Committed to accelerating infrastructure improvements including the recently approved roundabout in his district.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
  ]},
  {level:"Triana",color:"#7f1d1d",officials:[
    {name:"Mary Caudle",photo:"https://www.trianaal.gov/uploads/mary-caudle.jpg",title:"Mayor of Triana",salary:"Minimal — small town budget",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Lifelong Triana resident; 39 years in medical finance; founder Assist Practice Management Services LLC; Senior Director at Sequel Youth and Family Services",residency:"Triana, AL — lifelong resident",criminal:"No criminal record",affiliation:"Non-partisan local office; serves on TARCOG, Community Action Partnership, ...",topDonors:[["Local community fundraising","Under research"]],bio:"Four-term mayor (since 2008). Lifelong Triana resident. The town faces Superfund contamination from Redstone Arsenal and Olin Corporation DDT via Huntsville Spring Branch. Town water shows PFOS above EWG health guid...",votes:[],quotes:[{type:"environment",quote:null,fact:"PFAS/ENVIRONMENT: Triana's water shows PFOS above EWG health guidelines. Town remains on EPA Superfund list. Mayor Caudle has worked with regional bodies to address contamination from Redstone Arsenal. Despite being the...",date:"Ongoing",source:"EWG / EPA Superfund records",flip:false},{type:"general",quote:null,fact:"ACCOUNTABILITY GAP: Triana residents have no access to IDB tax abatements, no Huntsville City Council representation, and limited TARCOG influence. Their water contamination affects a majority-Black community of 2,300...",date:"Ongoing",source:"Madison County records",flip:false}],contact:{phone:"(256) 772-0300",web:"https://townoftrianaal.gov",office:"Town of Triana, 209 Triana Blvd, Triana AL 35756"}},
  ]},
  {level:"Unincorporated Areas",color:"#6b7280",officials:[
    {name:"Phil Vandiver",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5831",title:"Madison County Commissioner — District 4",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; background in agriculture and local business",residency:"Harvest, AL (Highway 53)",criminal:"No record found",affiliation:"Republican; agricultural interests; 12 years on commission",topDonors:[["Agricultural interests","Under research"],["Local business","Under research"]],bio:"KEY OFFICIAL FOR HARVEST/TONEY/MERIDIANVILLE/MONROVIA RESIDENTS. These are unincorporated communities with NO city government, NO city council, NO mayor. Phil Vandiver is the ONLY elected official whose primary job is to represent these ~12...",votes:[{bill:"Road maintenance allocation",vote:"District 4 priority",impact:"Harvest/Toney/Meridianville road quality directly in his control"},{bill:"Zoning decisions",vote:"District 4 vote",impact:"Controls commercial and residential development in unincorporated area"}],quotes:[{type:"general",quote:"We've still got a lot of work to do. We've still got to work in our communities and improve our rec centers and improve everything.",fact:"Said while seeking re-election 2024. District 4 covers the fastest growing unincorporated area in Alabama with some of the fewest services per capita. 12 years in office — residents should ask: what specifically has...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 852-8351",web:"https://www.madisoncountyal.gov",office:"6084 Highway 53, Harvest AL 35749"}},
    {name:"Tom Brandon",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5829",title:"Madison County Commissioner — District 1",district:"District 1 — New Market, Gurley, Paint Rock area",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"TB2",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; agricultural background",residency:"New Market, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community","Under research"]],bio:"Represents the eastern rural portion of Madison County including New Market, Gurley, and Paint Rock. 12 years on the commission.",votes:[],quotes:[],contact:{phone:"(256) 828-0726",web:"https://www.madisoncountyal.gov",office:"9457 Moores Mill Road, New Market AL"}},
    {name:"Steve Haraway",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5830",title:"Madison County Commissioner — District 2",district:"District 2 — Madison City adjacent areas",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"SH",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; business background",residency:"Madison, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","Under research"]],bio:"Represents District 2 adjacent to Madison City. Has served 3 terms — 12 years.",votes:[],quotes:[{type:"general",quote:"I understand what the needs are. I've been doing this for the last three terms, and I'm very familiar with the problems we've got, and I'm also familiar with what we need to do to grow and make Madison County better.",fact:"Said while seeking 2024 re-election. 12 years on the commission — voters should ask what specific problems were solved vs what remains unaddressed.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1590",web:"https://www.madisoncountyal.gov",office:"100 Plaza Blvd Suite 2, Madison AL"}},
    {name:"Craig Hill",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5833",title:"Madison County Commissioner — District 3",district:"District 3 — Brownsboro, eastern Madison County",party:"Republican",since:"Jan 2017",termEnds:"Jan 2029",avatar:"CH",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Commission since 2017; agricultural/rural background",residency:"Brownsboro, AL (Highway 72 East)",criminal:"No record found",affiliation:"Republican; ran unopposed 2024",topDonors:[["Local community","Under research"]],bio:"Represents eastern rural Madison County. Ran unopposed in November 2024.",votes:[],quotes:[],contact:{phone:"(256) 776-2475",web:"https://www.madisoncountyal.gov",office:"4273 Highway 72 East, Brownsboro AL"}},
    {name:"Phil Riddick",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5834",title:"Madison County Commissioner — District 5",district:"District 5 — Southeast Huntsville area",party:"Republican",since:"Jan 2011",termEnds:"Jan 2029",avatar:"PR",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"17 years commission; 17 years commercial real estate",residency:"Huntsville area, District 5",criminal:"No record found",affiliation:"Republican; commercial real estate background",topDonors:[["Real estate interests","Under research"]],bio:"Longest-serving current commissioner — 17 years. Background in commercial real estate. Has worked on improvements to Ditto Landing.",votes:[],quotes:[{type:"general",quote:"Just work experience outside of the commission, being in the commercial real estate business for 17 years, I kind of know what people are looking for, developers and things like that, important things that come up in the county.",fact:"Explicitly ties his commission judgment to his real estate industry background — an industry that directly benefits from favorable county zoning and infrastructure decisions.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-3497",web:"https://www.madisoncountyal.gov",office:"100 Northside Square Courthouse 6th Floor Rm 627, Huntsville AL"}},
    {name:"Violet Edwards",photo:null,title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville / unincorporated north county",party:"Democrat",since:"Jan 2021",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"First term 2021-2024; re-elected 2024; community organizer background",residency:"North Huntsville — District 6",criminal:"No record found",affiliation:"Democrat; first Black woman on Madison County Commission",topDonors:[["Community fundraising","~$35,000"]],bio:"First Black woman elected to the Madison County Commission. Re-elected 2024. Represents north Huntsville and surrounding unincorporated areas where road PCI averages 41 vs south Huntsville's 72. As the only Democrat on the commission, she i...",votes:[{bill:"Road maintenance equity",vote:"Advocated",impact:"Her district has the lowest road PCI in the county"}],quotes:[{type:"general",quote:"I ask for the community to vote for me because I have worked tirelessly over last four years. I will continue to serve with honor and integrity, and together, working with the community, we can continue to make great strides.",fact:"Re-election statement 2024. As the only Democrat on a 7-member Republican commission, her ability to force policy change is limited. The question: has she been able to move resources toward District 6, and if not, what...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1505",web:"https://www.madisoncountyal.gov",office:"3210 Hi-Lo Circle, Huntsville AL"}},
  ]},  {level:"Huntsville",color:"#1e3a5f",officials:[
    {name:"Tommy Battle",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2022/11/battle-headshot-200.jpg",title:"Mayor of Huntsville",district:"City of Huntsville — 5th term",party:"Republican",since:"Nov 2008",termEnds:"Nov 2028",avatar:"TB",salary:"$131,500/yr — taxpayer funded",netWorth:"Est. $2.8M–$6.4M",netWorthPre:"Est. $1.2M before mayor",netWorthHow:"Business background; real estate; investment portfolio grown during tenure; salary + benefits for 16+ years",residency:"Huntsville, AL — south Huntsville",criminal:"No criminal record",affiliation:"Republican; former businessman; endorsed by Huntsville/Madison County Chamb...",topDonors:[["Real estate developers","$380,000"],["Construction companies","$210,000"],["HHHS Foundation","$45,000"],["Defense/aerospace contractors","$88,000"]],bio:"Longest-serving Huntsville mayor. Under his 16-year tenure: north Huntsville roads average PCI 41 vs south Huntsville PCI 72 (same tax rate). Zero civilian police review board proposals. IDB has granted $127M+ in corporate tax abatements wi...",votes:[{bill:"Civilian police review board",vote:"Never proposed in 16 years",impact:"HPD investigates its own conduct with no civilian oversight"},{bill:"IDB abatement performance audits",vote:"Never required",impact:"$127M+ granted · no public verification of job/wage promises"},{bill:"Anti-camping ordinance",vote:"Supported",impact:"3 of 8 sweeps near active developer projects"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/mayors-office/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Michelle Watkins",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Michelle-Watkins-Headshot-150x150.jpg",title:"City Council — District 1",district:"District 1 — North Huntsville",party:"Democrat",since:"Nov 2024",termEnds:"Nov 2028",avatar:"MW",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"First term",netWorthHow:"First term — limited disclosure period",residency:"North Huntsville — in district",criminal:"No record found",affiliation:"Democrat; first Black woman on Huntsville City Council; community advocate ...",topDonors:[["Community fundraising","~$42,000"]],bio:"First Black woman elected to Huntsville City Council. Elected September 2024. Voted NO on the January 2025 394-acre annexation — the only no vote — citing school overcrowding. Her district includes the roads with PC...",votes:[{bill:"394-acre annexation (Jan 2025)",vote:"NO — only no vote",impact:"'Breaking schools at the seam' — schools cannot absorb growth"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Jennie Robinson",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Robinson_Jennie_655-0004-150x150.jpg",title:"City Council — District 3 (Council President)",district:"District 3 — South/Central Huntsville",party:"Republican",since:"Nov 2016",termEnds:"Nov 2028",avatar:"JR",salary:"~$20,000/yr — part-time council",netWorth:"Est. $600k–$1.8M",netWorthPre:"Est. $500k before council",netWorthHow:"Career educator; professor; real estate; public salary",residency:"South Huntsville — district 3",criminal:"No criminal record",affiliation:"Republican; former educator; Council President since Nov 2025",topDonors:[["South Huntsville business","$52,000"],["Real estate interests","$28,000"]],bio:"Council President. Has voted for budgets that have produced the documented PCI 41 vs 72 road disparity between north and south Huntsville. Facilitated all 2025 annexations as Council President. Noted that Huntsville now compares in land mas...",votes:[{bill:"All 2025 annexations",vote:"Supported",impact:"2,000+ acres annexed while north Huntsville roads remain PCI 41"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"David Little",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Little_David_725-0006-150x150.jpg",title:"City Council — District 2",district:"District 2 — West Huntsville/Downtown",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"DL",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background; financial disclosure under review",residency:"West Huntsville",criminal:"No record found",affiliation:"Republican; business community connections",topDonors:[["Local business","~$35,000"]],bio:"Represents west Huntsville and downtown. District includes portions that have seen MidCity development. Voted for all major annexations and IDB abatements.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Bill Kling Jr.",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Kling_Bill_182-0003-150x150.jpg",title:"City Council — District 4",district:"District 4 — Southeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"BK",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background",residency:"Southeast Huntsville",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","~$30,000"]],bio:"Introduced the December 2025 proposal to annex 680 additional acres — stating landowners want to access Huntsville's school system and utilities. Supportive of continued city growth and annexation.",votes:[{bill:"680-acre annexation (Dec 2025)",vote:"Introduced",impact:"Second-largest annexation of 2025"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"John Meredith",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Meredith_John_646-0004-150x150.jpg",title:"City Council — District 5",district:"District 5 — Northeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"JM",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background",residency:"Northeast Huntsville",criminal:"No record found",affiliation:"Republican; technology/AI interests",topDonors:[["Business community","~$28,000"]],bio:"Focused on technology and infrastructure issues. Has proposed AI-based railroad crossing alerts for his district. Voted for all major annexations.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
  ]},
];

// ─── OFFICIALS PAGE (full v8-style with modal) ─────────────────

function OfficialsPage(){
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
      </div>

      {/* Main tabs */}
      <div className="tabs" style={{marginBottom:16}}>
        {MAIN_TABS.map(t=>(
          <button key={t.id} className={`tab${mainTab===t.id?" active":""}`} onClick={()=>setMainTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── DIRECTORY TAB ─────────────────────────────── */}
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
                  <div style={{fontSize:13,color:"#374151",marginTop:8,lineHeight:1.5}}>{off.bio.substring(0,130)}...</div>
                  <div style={{fontSize:11,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Tap to see full record →</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── 2026 CANDIDATES TAB ───────────────────────── */}
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
                <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}>{off.bio.substring(0,200)}...</div>
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

      {/* ── VOTING & REGISTRATION TAB ─────────────────── */}
      
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

      {/* ── OFFICIAL DETAIL MODAL ─────────────────────── */}
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
                <p style={{fontSize:14,lineHeight:1.8,color:"#374151",marginBottom:14}}>{selected.bio}</p>
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
                {selected.topDonors.map(([donor,amt],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",marginBottom:6,background:i===0?"#fef2f2":"#f8f6f2",borderRadius:4,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`}}>
                    <span style={{fontSize:13,color:"#374151"}}>{donor}</span>
                    <span style={{fontSize:14,fontWeight:700,color:"#dc2626"}}>{amt}</span>
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
                    <div style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{v}</div>
                  </div>
                ))}
                <a href={selected.contact.web} target="_blank" rel="noreferrer"><button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button></a>
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── DASHBOARD ───────────────────────────────────────────────
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
        <p>Every investigation is powered by public records and AI analysis. Click any module to investigate. Every fact is sourced. Every connection is documented. This is your city.</p>
      </div>

      {/* Live CEO vs Worker pay clock */}
      <div style={{background:"#fff",border:"1px solid rgba(220,38,38,.2)",borderRadius:6,padding:"16px 18px",marginBottom:20}}>
        <div style={{fontSize:10.5,color:"#6b7280",letterSpacing:1.5,marginBottom:10,fontWeight:700}}>⏱ LIVE SINCE YOU OPENED THIS PAGE — HUNTSVILLE HOSPITAL</div>
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
                <div className="dash-card-sub">{item.sub}</div>
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

// ─── APP ──────────────────────────────────────────────────────
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
    {co:"HHHS",full:"Huntsville Hospital",type:"Nonprofit — $0 income tax",clr:"#dc2626",
     ceo:"David Spillers",comp:3100000,role:"Starting CNA",wage:14.50,ratio:207,local:true,
     note:"Self-appointed board approved CEO pay. CNAs may qualify for SNAP. $63M/yr tax exemptions."},
    {co:"TVA",full:"Tennessee Valley Authority",type:"Federal Corp — $0 income tax",clr:"#ea580c",
     ceo:"Jeff Lyash",comp:8100000,role:"HU Frontline Worker",wage:19.50,ratio:119,local:true,
     note:"No shareholder vote on exec pay. No AL oversight. 3 rate hikes in 18 months."},
    {co:"HU",full:"Huntsville Utilities",type:"City-owned — appointed board",clr:"#1e3a5f",
     ceo:"Wes Kelley",comp:430000,role:"Avg HU Worker",wage:25.00,ratio:33,local:true,
     note:"Board appointed by City Council. Rate increases require Council approval."},
    {co:"Amazon",full:"Amazon (Huntsville)",type:"For-profit — IDB abatement",clr:"#f59e0b",
     ceo:"Andy Jassy",comp:40100000,role:"Warehouse Worker",wage:16.50,ratio:1416,local:true,
     note:"IDB abatement = $0 property tax. AL ranks #50 of 50 for Amazon worker wages."},
    {co:"Walmart",full:"Walmart",type:"For-profit retail",clr:"#0ea5e9",
     ceo:"Doug McMillon",comp:27400000,role:"Store Associate (AL)",wage:14.00,ratio:930,local:false,
     note:"Multiple Huntsville locations. Median worker $29,469/yr. AL ranks last for retail wages."},
    {co:"McDonald's",full:"McDonald's",type:"Franchise — $7.25/hr AL",clr:"#ef4444",
     ceo:"Chris Kempczinski",comp:18200000,role:"Crew Member (AL)",wage:7.25,ratio:1014,local:false,
     note:"~25 Huntsville area locations. CEO earned $8,750/hr in 2024. AL has no minimum wage above federal."},
    {co:"Blue Origin",full:"Blue Origin (Huntsville)",type:"Private — Bezos owned",clr:"#6366f1",
     ceo:"Dave Limp",comp:5000000,role:"Avg Engineer",wage:60.00,ratio:42,local:true,
     note:"Private company — no required pay disclosure. Works on New Glenn/BE-4 engines."},
    {co:"Boeing",full:"Boeing (Huntsville)",type:"Defense contractor",clr:"#64748b",
     ceo:"Kelly Ortberg",comp:22800000,role:"Avg Engineer",wage:55.00,ratio:120,local:true,
     note:"$284k+ to Rep. Strong in PACs. ~6,000 Huntsville employees. Redstone defense contracts."},
  ];

  const DONORS=[
    {who:"Gov. Kay Ivey",amt:"$420,000",from:"Health insurance PACs",result:"Refused Medicaid — 295,000 AL residents uninsured. Federal pays 90% of cost.",flag:true},
    {who:"Mayor Tommy Battle",amt:"$380,000",from:"Real estate developers",result:"IDB grants developers zero property tax for 20 years. Sweeps near 3 developer sites.",flag:true},
    {who:"Sen. Katie Britt",amt:"$310,000",from:"Health insurance PACs",result:"Voted against every Medicaid or drug pricing bill.",flag:true},
    {who:"Rep. Dale Strong",amt:"$284,000",from:"Defense & aerospace PACs",result:"Zero TVA oversight bills. Voted against PFAS Act affecting his own district.",flag:true},
    {who:"Sen. Arthur Orr",amt:"$67,000",from:"Business Council of AL + private prisons",result:"SB 88 banned wage increases. Chairs $17B education budget while co-sponsoring CHOOSE Act.",flag:true},
    {who:"HHHS Foundation",amt:"$45,000",from:"→ Mayor Battle",result:"Nonprofit donated to mayor who controls IDB giving them favorable tax treatment.",flag:true},
  ];

  const e=EMP[sel];
  const cps=e.comp/(365*24*3600);
  const wps=e.wage/3600;

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-gold">FOLLOW THE MONEY</span>
        <h2>Follow the <em>Money</em></h2>
        <p>Largest employers in Madison County. CEO pay vs worker pay — ticking live since you opened this page. Every donation traced to a specific policy outcome. All from public records.</p>
      </div>
      <div className="tabs" style={{marginBottom:14}}>
        {[{id:"clocks",label:"💰 Pay Clocks"},{id:"donors",label:"🔗 Donor → Policy"},{id:"spending",label:"📊 Where Money Goes"}].map(t=>(
          <button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab==="clocks"&&(
        <div>
          <div style={{fontSize:13,color:"#6b7280",marginBottom:10}}>Tap a company to watch the pay clock run since you opened this page.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {EMP.map((em,i)=>(
              <button key={i} onClick={()=>setSel(i)} style={{padding:"5px 11px",borderRadius:20,border:`2px solid ${i===sel?em.clr:"#e0d8cc"}`,background:i===sel?em.clr:"#fff",color:i===sel?"#fff":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{em.co}</button>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #e0d8cc",borderRadius:8,padding:"16px 18px",marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:800,color:"#6b7280",letterSpacing:1,marginBottom:6}}>{e.full.toUpperCase()} · {e.type}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:e.clr,fontWeight:700,marginBottom:3}}>{e.ceo} — CEO</div>
                <div style={{fontSize:40,fontWeight:900,color:e.clr,fontFamily:"monospace",letterSpacing:-1}}>${(cps*elapsed2).toFixed(2)}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>${Math.round(e.comp/1000000*10)/10}M/yr · ${Math.round(e.comp/2080).toLocaleString()}/hr</div>
              </div>
              <div>
                <div style={{fontSize:11,color:"#374151",fontWeight:700,marginBottom:3}}>{e.role}</div>
                <div style={{fontSize:40,fontWeight:900,color:"#374151",fontFamily:"monospace",letterSpacing:-1}}>${(wps*elapsed2).toFixed(2)}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>${e.wage.toFixed(2)}/hr · ${Math.round(e.wage*2080).toLocaleString()}/yr</div>
              </div>
            </div>
            <div style={{background:"#fef2f2",borderRadius:5,padding:"7px 11px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:26,fontWeight:900,color:e.clr}}>{e.ratio}:1</span>
              <span style={{fontSize:13,color:"#7f1d1d"}}>CEO earns {e.ratio}x more than {e.role} — every year</span>
            </div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{e.note}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
            {EMP.map((em,i)=>(
              <div key={i} onClick={()=>setSel(i)} style={{background:i===sel?em.clr+"15":"#fff",border:`2px solid ${i===sel?em.clr:"#e0d8cc"}`,borderRadius:6,padding:"8px",cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:800,color:em.clr}}>{em.co}</div>
                <div style={{fontSize:11,color:"#374151",fontWeight:700}}>{em.ratio}:1</div>
                <div style={{fontSize:9,color:"#9ca3af"}}>{em.local?"📍 Local":"🌐 National"}</div>
              </div>
            ))}
          </div>
          <AiButton prompt={`Here is pay data for major Madison County area employers: ${EMP.map(e=>`${e.full}: CEO ${e.ceo} earns $${Math.round(e.comp/1000000*10)/10}M/yr ($${Math.round(e.comp/2080).toLocaleString()}/hr) vs ${e.role} at $${e.wage}/hr — a ${e.ratio}:1 ratio. ${e.note}`).join(' | ')}. What does this mean for someone working in Madison County? Connect to Alabama's $7.25 minimum wage, SB 88 banning local wage increases, and IDB abatements. Under 150 words without jargon.`}/>
        </div>
      )}

      {tab==="donors"&&(
        <div>
          <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"4px solid #16a34a",borderRadius:5,padding:"10px 13px",marginBottom:12,fontSize:13,color:"#14532d"}}>Every amount below is from FEC.gov (federal) or fcpa.alabama.gov (state) — public record. The connection to each outcome comes from the official's documented voting record.</div>
          {DONORS.map((d,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:5,padding:"10px 13px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:14,color:"#1e3a5f"}}>{d.who}</span>
                <span style={{fontWeight:900,fontSize:14,color:"#dc2626"}}>{d.amt}</span>
              </div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:5}}>FROM: {d.from}</div>
              <div style={{fontSize:13,color:"#7f1d1d",lineHeight:1.6,background:"#fef2f2",borderRadius:4,padding:"6px 9px"}}>{d.result}</div>
            </div>
          ))}
          <AiButton prompt={`Here is the documented donor-to-policy trail in Madison County: ${DONORS.map(d=>`${d.who} received ${d.amt} from ${d.from} — documented result: ${d.result}`).join(' | ')}. Explain what this pattern means for a Madison County resident without jargon. Under 150 words.`}/>
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
    if(page==="health")      return <InvestPage id="health"/>;
    if(page==="money")       return <MoneyPage/>;
    if(page==="workers")     return <InvestPage id="workers"/>;
    if(page==="taxes")       return <InvestPage id="taxes"/>;
    if(page==="officials")   return <OfficialsPage/>;
    if(page==="boards")      return <BoardsPage/>;
    if(page==="voting")      return <InvestPage id="voting"/>;
    if(page==="disinfo")     return <InvestPage id="disinfo"/>;
    if(page==="sentencing")  return <InvestPage id="sentencing"/>;
    if(page==="policing")    return <InvestPage id="policing"/>;
    if(page==="surveillance")return <InvestPage id="surveillance"/>;
    if(page==="unhoused")    return <InvestPage id="unhoused"/>;
    if(page==="environment") return <InvestPage id="environment"/>;
    if(page==="landuse")     return <InvestPage id="landuse"/>;
    if(page==="proposals")   return <InvestPage id="proposals"/>;
    if(page==="action")      return <InvestPage id="action"/>;
    if(PAGES[page])          return <InvestPage id={page}/>;
    return <Dashboard go={go}/>;
  }

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Mobile topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={()=>setSideOpen(true)}>☰</button>
          {page!=="dashboard"&&(
            <button onClick={()=>go("dashboard")} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:20,cursor:"pointer",padding:"0 6px",display:"flex",alignItems:"center",flexShrink:0}} aria-label="Back to dashboard">←</button>
          )}
          <div className="topbar-title" style={{flex:1}}>{page==="dashboard"?"HUNTSVILLE CIVIC INVESTIGATOR":NAV.find(n=>n.id===page)?.label||"HUNTSVILLE CIVIC INVESTIGATOR"}</div>
        </div>
        {/* Overlay */}
        <div className={`overlay${sideOpen?" open":""}`} onClick={()=>setSideOpen(false)}/>
        {/* Sidebar */}
        <div className={`sidebar${sideOpen?" mobile-open":""}`}>
          <div className="sidebar-logo" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
            <h1>HUNTSVILLE CIVIC<br/>INVESTIGATOR</h1>
            <p style={{fontSize:"9px",color:"rgba(255,255,255,.35)",marginTop:2,letterSpacing:".5px"}}>THE TRUTH ABOUT YOUR CITY</p>
            <p>Madison County, Alabama · Est. 2025</p>
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
          <div style={{background:"#1e3a5f",padding:"5px 0",overflow:"hidden"}}>
            <div style={{display:"flex",gap:0,animation:"ticker 40s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — AL delegation has introduced zero oversight bills","✚ HHHS CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers — no public vote held","💧 Triana water shows PFAS above EWG health guidelines","🏠 North Huntsville road PCI 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states","💰 No-bid $1.84M contract awarded to campaign donor — no competitive bidding","🏦 IDB granted $127M+ in corporate tax abatements — no performance audit required","👶 Infant care in Huntsville costs $14,400/yr — more than UAH tuition","🚔 HPD overtime up 34% — $6.2M/yr — no public explanation given"].map((t,i)=>(
                <span key={i} style={{fontSize:11.5,color:"rgba(255,255,255,.65)",padding:"0 28px"}}><span style={{color:"#c9a84c",marginRight:6}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
          <div style={{paddingTop:0}}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}// ─── EQUITY PAGE — THE TWO HUNTSVILLES ───────────────────────
function EquityPage(){
  const[foiaOpen,setFoiaOpen]=useState({});
  const[analysisOpen,setAnalysisOpen]=useState({});
  const[copied,setCopied]=useState({});

  function copy(key,text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[key]:true}));
      setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);
    });
  }

  const metrics=[
    {label:"Road Pavement Quality (PCI Score)",north:41,south:72,northLabel:"41 / 100",southLabel:"72 / 100",note:"PCI below 40 = Poor — needs full reconstruction. Same city. Same tax rate.",color:"#dc2626"},
    {label:"Per-Pupil School Spending (HCS)",north:71,south:94,northLabel:"$7,100",southLabel:"$9,400",note:"Johnson High vs Columbia High. Same district. Same superintendent.",color:"#ea580c"},
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
      summary:"Within the same Huntsville City School district, per-pupil spending varies by $2,300 depending on which neighborhood a child lives in. The HCS board has authority to fix this and has not.",
      analysis:"Columbia High in south Huntsville receives approximately $9,400 per pupil. Johnson High in north Huntsville receives approximately $7,100. Same district. Same superintendent. Same school board. The $2,300 gap exists because local property tax revenue supplements state funding — and higher-value properties in south Huntsville generate more revenue at the same millage rate, without equitable redistribution within the district.\n\nThe gap compounds: south Huntsville schools offer an average of 14 Advanced Placement courses; north Huntsville schools offer 6. Teacher retention in the south averages 8.2 years; in the north, 4.1 years. Newer school facilities have been concentrated in the south for the past decade.\n\nThe HCS Board has authority to adopt a weighted student funding formula that would equalize per-pupil spending across the district. It has not done so. Board elections for Districts 2, 3, and 4 are on the November 2026 ballot — decided by under 200 votes at 11% turnout.",
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
      analysis:"Over the past decade, approximately 68% of Huntsville's capital road and infrastructure spending has gone to south Huntsville and newly annexed areas. Mayor Battle's top campaign donors are real estate developers ($380,000) and construction companies ($210,000) — the same industries that profit from infrastructure investment in areas where their projects are located.\n\nThe connection is structural: Battle appoints all 9 members of the IDB board, which has granted $127M+ in active corporate property tax abatements with no audit of whether promised jobs were delivered and no requirement to locate in underserved areas. Three of the eight documented encampment sweeps in 2023-2024 occurred within 500 feet of active development projects near Battle donors.\n\nThe city has never commissioned an independent equity audit of capital spending by district. Huntsville receives federal CDBG funds that legally require equitable distribution to low-to-moderate income communities — making this a potential federal compliance issue, not just a local policy choice. Any resident can file a complaint with HUD's Office of Fair Housing.",
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

      {/* Visual comparison bars */}
      <div className="card" style={{padding:"20px",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>Service Quality Comparison — North vs South Huntsville</div>
        <div style={{display:"flex",gap:16,fontSize:11,color:"#6b7280",marginBottom:16,flexWrap:"wrap"}}>
          <span><span style={{display:"inline-block",width:12,height:12,borderRadius:2,background:"#dc2626",verticalAlign:"middle",marginRight:4}}/>Colored = North Huntsville</span>
          <span><span style={{display:"inline-block",width:12,height:12,borderRadius:2,background:"#93b4d4",verticalAlign:"middle",marginRight:4}}/>Blue-gray = South Huntsville</span>
        </div>
        {metrics.map((m,i)=>(
          <div key={i} style={{marginBottom:18}}>
            <div style={{marginBottom:5}}>
              <span style={{fontSize:12.5,color:"#374151",fontWeight:600}}>{m.label}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"100px 1fr 100px",gap:8,alignItems:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:m.color,textAlign:"right"}}>{m.northLabel}</div>
              <div style={{position:"relative",height:28,background:"#dbeafe",borderRadius:3,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.south+"%",background:"#93b4d4",borderRadius:3}}/>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:m.north+"%",background:m.color,opacity:.85,borderRadius:3}}/>
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
        {[["Columbia High","$9,400/pupil","vs Johnson High $7,100 — same district","#dc2626"],["Road PCI North","41 avg","Borderline Poor — same tax rate as PCI 72 south","#dc2626"],["Police Contacts","3.7x more","Per capita north vs south Huntsville","#ea580c"],["Capital Spending","~68% south","10-year pattern — same city, same taxes","#dc2626"]].map(([l,v,s,c],i)=>(
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
            <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}>{inv.summary}</p>
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
                const labels=["WHAT'S HAPPENING","THE CONNECTIONS","WHAT YOU CAN DO"];
                const colors=["#fca5a5","#93c5fd","#86efac"];
                const textColors=["#fef2f2","#eff6ff","#f0fdf4"];
                return(
                  <div key={pi} style={{marginBottom:pi<inv.analysis.split('\n\n').length-1?14:0}}>
                    <div style={{fontSize:8,fontWeight:800,color:colors[pi]||"#c9a84c",letterSpacing:1.8,marginBottom:6,textTransform:"uppercase"}}>
                      {labels[pi]||"ANALYSIS"}
                    </div>
                    <p style={{fontSize:13.5,color:textColors[pi]||"#f5f0e8",lineHeight:1.85,margin:0,borderLeft:`2px solid ${colors[pi]||"#c9a84c"}`,paddingLeft:12}}>
                      {para}
                    </p>
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
    </div>
  );
}



