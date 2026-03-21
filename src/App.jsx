import{useState,useEffect,useRef,useCallback}from"react";

// ─── THEME ────────────────────────────────────────────────────
const C={navy:"#1e3a5f",red:"#dc2626",gold:"#c9a84c",orange:"#ea580c",green:"#16a34a",muted:"#6b7280",border:"#e0d8cc",card:"#fff",bg:"#f5f0e8"};

// ─── AI ───────────────────────────────────────────────────────
async function callAI(prompt){
  try{
    const r=await fetch("/api/claude",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt})
    });
    const d=await r.json();
    return d.result||d.error||"Investigation unavailable.";
  }catch(e){
    return "Investigation unavailable — please try again.";
  }
}

// ─── CSS ──────────────────────────────────────────────────────
const CSS=`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${C.bg};font-family:'Segoe UI',system-ui,sans-serif;color:#1a1a1a;overflow-x:hidden}
#root{height:100%}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;background:${C.navy};color:#fff;overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column}
.sidebar-logo{padding:20px 16px 12px;border-bottom:1px solid rgba(201,168,76,.2)}
.sidebar-logo h1{font-size:13px;font-weight:800;color:${C.gold};letter-spacing:1px;line-height:1.3}
.sidebar-logo p{font-size:10px;color:rgba(255,255,255,.4);margin-top:3px}
.nav-group{padding:14px 16px 4px;font-size:8.5px;font-weight:700;letter-spacing:2px;color:rgba(201,168,76,.5);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:9px;padding:8px 16px;cursor:pointer;font-size:12px;font-weight:500;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .15s;user-select:none}
.nav-item:hover,.nav-item.active{color:${C.gold};background:rgba(201,168,76,.08);border-left-color:${C.gold};font-weight:700}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.main{flex:1;overflow-y:auto;background:${C.bg}}
.page{max-width:680px;margin:0 auto;padding:20px 16px 40px}
.page-header{margin-bottom:20px}
.page-header h2{font-size:22px;font-weight:900;color:${C.navy};line-height:1.2}
.page-header h2 em{color:${C.red};font-style:normal}
.page-header p{font-size:12.5px;color:${C.muted};margin-top:6px;line-height:1.6}
.tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 8px;border-radius:10px;margin-bottom:8px}
.tag-red{background:rgba(220,38,38,.12);color:${C.red};border:1px solid rgba(220,38,38,.2)}
.tag-navy{background:rgba(30,58,95,.1);color:${C.navy};border:1px solid rgba(30,58,95,.2)}
.tag-gold{background:rgba(201,168,76,.12);color:#b8860b;border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(22,163,74,.1);color:${C.green};border:1px solid rgba(22,163,74,.2)}
.tag-blue{background:rgba(37,99,235,.1);color:#2563eb;border:1px solid rgba(37,99,235,.2)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px 12px}
.stat-val{font-size:22px;font-weight:900;line-height:1}
.stat-lbl{font-size:8.5px;color:${C.muted};margin-top:5px;letter-spacing:.5px;text-transform:uppercase}
.stat-sub{font-size:10.5px;color:${C.muted};margin-top:3px;line-height:1.3}
.fact{border-radius:5px;padding:12px 14px;margin-bottom:10px;border-left:4px solid}
.fact-red{background:#fef2f2;border-color:${C.red}}
.fact-gold{background:#fffbeb;border-color:${C.gold}}
.fact-green{background:#f0fdf4;border-color:${C.green}}
.fact-blue{background:#eff6ff;border-color:#2563eb}
.fact-label{font-size:8.5px;font-weight:700;letter-spacing:1px;margin-bottom:5px;text-transform:uppercase}
.fact-text{font-size:12.5px;line-height:1.7}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:none;border-radius:4px;font-weight:700;font-size:12px;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-navy{background:${C.navy};color:#fff}
.btn-gold{background:${C.gold};color:#fff}
.btn-red{background:${C.red};color:#fff}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.border}}
.btn-full{width:100%;justify-content:center;margin-bottom:10px}
.ai-panel{background:#fff;border:1px solid ${C.border};border-radius:5px;padding:14px;margin-bottom:12px}
.ai-panel-label{font-size:8.5px;font-weight:700;color:#b8860b;letter-spacing:1px;margin-bottom:8px;text-transform:uppercase}
.ai-text{font-size:13px;color:#2d2a22;line-height:1.85;white-space:pre-wrap}
.card{background:#fff;border:1px solid ${C.border};border-radius:6px;padding:14px;margin-bottom:10px}
.card-title{font-size:13.5px;font-weight:700;color:${C.navy};margin-bottom:4px}
.card-sub{font-size:12px;color:${C.muted};line-height:1.5}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:2px solid ${C.border};padding-bottom:8px;flex-wrap:wrap}
.tab{padding:6px 14px;border:none;border-radius:4px 4px 0 0;font-weight:700;font-size:11.5px;cursor:pointer;font-family:inherit;background:#f0ebe2;color:${C.muted};transition:all .12s}
.tab.active{background:${C.navy};color:${C.gold}}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.dash-card{background:#fff;border:1px solid ${C.border};border-radius:8px;padding:16px;cursor:pointer;transition:all .15s;border-left:4px solid}
.dash-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
.dash-card-icon{font-size:20px;margin-bottom:8px}
.dash-card-title{font-size:12.5px;font-weight:700;color:${C.navy};margin-bottom:3px}
.dash-card-sub{font-size:11px;color:${C.muted};line-height:1.4}
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
.alert-label{font-size:8.5px;font-weight:700;color:${C.red};letter-spacing:1px;margin-bottom:3px}
.alert-text{font-size:12px;color:#7f1d1d;line-height:1.6}
.source-bar{background:#eff3f8;border:1px solid #93b4d4;border-radius:4px;padding:11px 13px;margin-top:14px}
.source-label{font-size:8.5px;font-weight:700;color:${C.navy};letter-spacing:1px;margin-bottom:6px}
.source-links{display:flex;gap:8px;flex-wrap:wrap}
.source-link{font-size:10.5px;color:${C.navy};text-decoration:none;border:1px solid #93b4d4;padding:3px 8px;border-radius:3px;background:#fff}
.source-link:hover{background:${C.navy};color:#fff}
@media(max-width:768px){
  .sidebar{position:fixed;inset:0 auto 0 0;z-index:300;transform:translateX(-100%);transition:transform .25s;width:280px}
  .topbar{display:flex;height:48px;min-height:48px}
  .menu-btn{width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .topbar-title{font-size:12px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .main{padding-top:48px}
  .page{padding:14px 12px 40px}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .dash-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-val{font-size:18px}
  .page-header h2{font-size:18px}
}
@media(max-width:400px){
  .dash-grid{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr 1fr}
}
`;

// ─── NAV DATA ─────────────────────────────────────────────────
const NAV=[
  {group:"ECONOMIC"},
  {id:"equity",icon:"⚖",label:"North vs South Huntsville"},
  {id:"utilities",icon:"💧",label:"Power, Water & Utilities"},
  {id:"health",icon:"✚",label:"Health System"},
  {id:"money",icon:"💰",label:"Follow the Money"},
  {id:"workers",icon:"👷",label:"Workers & Child Care"},
  {id:"flights",icon:"✈",label:"Airport & Pricing"},
  {group:"POWER"},
  {id:"officials",icon:"▣",label:"Officials & Elections"},
  {id:"boards",icon:"🏛",label:"Boards & Directors"},
  {id:"schools",icon:"▦",label:"Schools & Boards"},
  {id:"voting",icon:"🗳",label:"Voting Power"},
  {id:"disinfo",icon:"🧠",label:"Disinformation"},
  {group:"JUSTICE"},
  {id:"sentencing",icon:"⚖",label:"Sentencing, HFOA & Incarceration"},
  {id:"policing",icon:"🚔",label:"Police & Sheriff"},
  {id:"surveillance",icon:"📡",label:"Surveillance & Privacy"},

  {group:"COMMUNITY"},
  {id:"unhoused",icon:"🏠",label:"Unhoused Residents"},
  {id:"transit",icon:"⬡",label:"Transit & Roads"},
  {id:"environment",icon:"🌿",label:"Environment & Water"},
  {id:"annexation",icon:"🗺",label:"Annexations & Land Use"},
  {id:"business",icon:"🏪",label:"Business Location Equity"},
  {id:"groceries",icon:"🛒",label:"Grocery Tax & Food Costs"},
  {id:"contractors",icon:"🏭",label:"Gov. Contractors & Taxes"},
  {id:"schoollunch",icon:"🍽",label:"School Lunches"},
  {id:"proposals",icon:"📐",label:"Policy Proposals"},
  {id:"action",icon:"▶",label:"Take Action"},
];

// ─── PAGE DATA ────────────────────────────────────────────────
const PAGES={
  equity:{icon:"⚖",title:"North vs South",subtitle:"Huntsville",tag:"tag-red",sub:"Roads PCI 41 north vs 72 south. Same taxes. $847/pupil school gap. 3.7× more police contacts per capita north. Who decided this?",
    stats:[["N.Hsv Road PCI","41","Poor — needs reconstruction",C.red],["S.Hsv Road PCI","72","Good — same tax rate",C.green],["School Funding Gap","$847/pupil","Less in lower-income HCS schools",C.orange],["Battle Developer Donors","$380k","From those who benefit from status quo",C.red]],
    facts:[{k:"red",label:"THE DOCUMENTED INEQUITY",lc:C.red,tc:"#7f1d1d",text:"North Huntsville residents pay identical city taxes as south Huntsville and receive measurably inferior roads, fewer services, and higher police contact rates. Over the past decade approximately 68% of capital road spending went to south Huntsville. This is in public records."}],
    prompt:"Investigate the documented equity gap between north and south Huntsville — roads PCI 41 vs 72, $847/pupil school gap, 3.7x police contact rate, capital spending percentages. Who benefits from maintaining this disparity? Trace Mayor Battle $380k real estate developer donations to specific spending decisions. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  utilities:{icon:"💧",title:"Power, Water",subtitle:"& Utilities",tag:"tag-blue",sub:"HU + TVA hit ratepayers with ~10%+ electric increase in one year. Triana water shows PFAS above health guidelines. Every utility board is appointed — none elected.",
    stats:[["TVA 2024 Rate Hike","5.25%","Largest in 16 years — passed to all HU customers",C.red],["HU Rate Hike","5.1%","Jan + Oct 2025 — on top of TVA hike",C.red],["Triana PFOS","Above EWG","Health guideline exceeded in town water",C.red],["TVA CEO Pay","$8.1M","Jeff Lyash 2023 — no shareholder vote",C.orange]],
    facts:[{k:"red",label:"THE DOUBLE MARKUP PROBLEM",lc:C.red,tc:"#7f1d1d",text:"TVA generates power and sells wholesale to Huntsville Utilities. HU marks it up and delivers to your home. Two separate entities adding costs — neither directly elected. Combined 2024-2025 impact: roughly 10%+ on your electric bill in one year. Neither increase required a public vote."},{k:"gold",label:"TRIANA WATER — THE PFAS PROBLEM",lc:"#b8860b",tc:"#78350f",text:"EWG data shows PFOS (a PFAS forever chemical linked to cancer) detected above EWG health guidelines in Triana Water Works. Triana remains on the EPA Superfund list due to Redstone Arsenal/Olin Corporation DDT contamination via Huntsville Spring Branch. The community is ~50% Black with ~2,300 residents."}],
    prompt:"Investigate Madison County utilities. TVA CEO $8.1M, 5.25% rate hike 2024 largest in 16 years. HU added 5.1% on top. Alabama delegation collected $1.4M+ from energy PACs and introduced zero TVA oversight bills. Triana Water Works PFOS above EWG health guidelines, EPA Superfund legacy. Every utility board appointed not elected. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  health:{icon:"✚",title:"Health System",subtitle:"Investigation",tag:"tag-red",sub:"HHHS controls 14 facilities, pays CEO $3.1M, claims $63M/yr in tax exemptions with a self-appointed board. 295,000 Alabamians uninsured. Ivey received $420k from insurance PACs and refused Medicaid.",
    stats:[["HHHS CEO Pay","$3.1M","Self-appointed nonprofit board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Medicaid Gap","295,000","Uninsured — federal pays 90% and AL refuses",C.red],["ZIP Code Gap","$1,020/yr","North vs south Huntsville same driver",C.red]],
    facts:[{k:"red",label:"THE NONPROFIT PARADOX",lc:C.red,tc:"#7f1d1d",text:"HHHS pays zero income tax, zero state tax, minimal property tax. Claims $63M/yr in exemptions. In exchange it must provide community benefit. Yet it pays CEO $3.1M, starts CNAs at $14.50/hr (qualifying for SNAP), and has acquired every North Alabama competitor — all as a 'nonprofit.'"},{k:"gold",label:"MEDICAID REFUSAL — THE DONOR CONNECTION",lc:"#b8860b",tc:"#78350f",text:"295,000 Alabamians — including ~47,000 in Madison County — are uninsured in the Medicaid coverage gap. Federal government pays 90% of expansion cost. Alabama refuses. Gov. Ivey received $420,000 from health insurance industry PACs who benefit financially when Medicaid is not expanded."}],
    prompt:"Investigate the Madison County health system as one connected crisis — HHHS $2.4B nonprofit monopoly with self-appointed board, CEO $3.1M vs CNAs $14.50/hr qualifying for SNAP, $63M tax exemption, 295,000 Alabamians uninsured in Medicaid gap including 47,000 in Madison County, Ivey $420k insurance PACs vs Medicaid refusal, north Huntsville ZIP code insurance premium $1,020/yr more than south. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  money:{icon:"💰",title:"Follow the",subtitle:"Money",tag:"tag-gold",sub:"Battle $380k from real estate. Ivey $420k from insurance. Strong $284k from defense. Orr $67k from BCA and private prisons. Every donation connects to a specific policy outcome.",
    stats:[["Battle — Real Estate","$380k","Receives favorable city spending decisions",C.red],["Ivey — Insurance","$420k","Refused Medicaid for 295,000 Alabamians",C.red],["Strong — Defense","$284k","Zero TVA oversight bills introduced",C.red],["Orr — BCA + Prisons","$67k","Banned wages, blocked sentencing reform",C.orange]],
    facts:[{k:"red",label:"THE DOCUMENTED PATTERN",lc:C.red,tc:"#7f1d1d",text:"In Madison County: the official controlling city spending received $380k from real estate developers — city spending favors areas where they operate. The Governor who refused Medicaid received $420k from insurance companies. The Congressman who introduced zero TVA oversight bills received $284k from energy PACs. This is how the system is designed to work."},{k:"gold",label:"CEO PAY CLOCKS",lc:"#b8860b",tc:"#78350f",text:"HHHS CEO earns approximately $1,490/hour. TVA CEO earns approximately $2,600/hour. While you read this, these executives at publicly-subsidized organizations are earning more per hour than most Madison County residents earn in a week. The HHHS CEO's annual pay equals the combined salary of 200 of his CNA workers."}],
    prompt:"Investigate the full money flow in Madison County — trace every major donor connection to a specific policy outcome. Battle $380k real estate → city spending patterns. Ivey $420k insurance → Medicaid refusal. Strong $284k defense → zero TVA bills. Orr $45k BCA → SB 88 wage ban + $22k private prisons → blocking sentencing reform. HHHS CEO $3.1M vs CNA $14.50/hr. IDB $127M+ abatements no performance audit. All from public records at FEC.gov and fcpa.alabama.gov. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  workers:{icon:"👷",title:"Workers &",subtitle:"Child Care",tag:"tag-orange",sub:"$7.25/hr since 2009. Orr banned cities from raising it. $14,400/yr infant care. Strong voted against cost relief. HHHS pays CEO $3.1M and starts CNAs at $14.50/hr.",
    stats:[["Min Wage","$7.25/hr","Federal floor — unchanged since 2009",C.red],["Infant Care Cost","$14,400/yr","Madison County avg — 26% of median income",C.red],["SB 88 — Orr","2023","Banned cities from raising wages",C.red],["BBB Child Care","Voted Against","Dale Strong voted no on 7% income cap",C.red]],
    facts:[{k:"red",label:"THE SQUEEZE",lc:C.red,tc:"#7f1d1d",text:"These are the same problem: the cost of work exceeds the pay from work. At $14,400/yr infant care costs more than in-state UAH tuition. A parent earning the median income spends 26% of pre-tax pay on one child before rent or food. Many parents — especially mothers — calculate they lose money by working after paying for care."},{k:"gold",label:"WHO PROFITS FROM THIS ARRANGEMENT",lc:"#b8860b",tc:"#78350f",text:"Large employers benefit when wages stay low. Private child care companies benefit when parents have no affordable alternative. The Business Council of Alabama donated $45,000 to Arthur Orr and supported SB 88. HHHS starts CNAs at $14.50/hr — those workers then qualify for public assistance that taxpayers fund."}],
    prompt:"Investigate wage suppression and child care costs in Madison County as a connected crisis. Orr $45k BCA sponsored SB 88 banning wage increases. Strong $284k defense PACs voted against Build Back Better child care provisions that would have capped costs at 7% of income. HHHS CEO $3.1M vs CNAs $14.50/hr qualifying for SNAP. Alabama did not join Summer EBT 2024 school meals. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  flights:{icon:"✈",title:"Airport &",subtitle:"Dynamic Pricing",tag:"tag-orange",sub:"HSV fares above average vs peer airports. RealPage algorithmic rent-setting is under DOJ antitrust investigation. Your landlord and your grocer may be using AI against you.",
    stats:[["HSV Fares","Above avg","vs Nashville/Atlanta comparable distances",C.red],["RealPage DOJ","Antitrust suit","Coordinated rent-setting investigation",C.red],["Airline Competition","Low","Few carriers compete at HSV",C.orange],["Algo Pricing","Expanding","Grocers, rideshare, hotels all use it",C.orange]],
    facts:[{k:"red",label:"THE CAPTIVE MARKET PROBLEM",lc:C.red,tc:"#7f1d1d",text:"When airlines face limited competition at an airport, they charge more. Huntsville International serves a major aerospace metro but has fewer non-stop routes and higher average fares than comparable cities. The economic cost falls on every business traveler and family flying in and out of Madison County."},{k:"gold",label:"ALGORITHMIC PRICING — THE INVISIBLE TAX",lc:"#b8860b",tc:"#78350f",text:"RealPage software is used by landlords to set rents using shared market data. The DOJ sued RealPage for antitrust violations — coordinating prices without a formal cartel agreement. If your landlord uses RealPage, your rent is not being set by the local market. Your grocery store uses yield management. You negotiate alone against AI with perfect market information."}],
    prompt:"Investigate Huntsville airport pricing and algorithmic pricing affecting Madison County residents. Why do HSV flights cost more than peer airports? What is RealPage and how does algorithmic rent coordination work? Who are the major Madison County landlords using algorithmic pricing? What is the DOJ antitrust case status? THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  sentencing:{icon:"⚖",title:"Sentencing &",subtitle:"Incarceration",tag:"tag-red",sub:"Alabama's Habitual Felony Offender Act has sentenced people to life without parole for stealing a $50 purse or a bicycle. 75% of those sentenced to die in prison under HFOA are Black. Private prison companies donate to the officials maintaining every one of these laws.",
    stats:[["HFOA Life Without Parole","527+ people","Many for non-violent property crimes",C.red],["HFOA Racial Disparity","75% Black","Of those sentenced to die in prison under HFOA",C.red],["School Zone Add-On","Mandatory +5 yrs","Applies to almost all of north Huntsville",C.red],["Private Prison to Marshall","$45k","AG who has opposed every single reform",C.red]],
    facts:[{k:"red",label:"THE HABITUAL FELONY OFFENDER ACT — LIFE FOR A BICYCLE",lc:C.red,tc:"#7f1d1d",text:"Alabama's HFOA mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent property crimes. Documented cases: Johnny Holly got life without parole in 1980 for stealing a toolbox, with priors including shoplifting a pork chop and a record. Jerald Sanders got life for stealing a $16 bicycle. Willie Simmons has been in prison since 1982 for a $9 theft — if sentenced today he would receive a maximum of 20 years. 75% of the 500+ people serving HFOA life sentences are Black. Alabama has never created a mechanism for judges to review these sentences."},{k:"orange",label:"LOW-LEVEL CRIMES — THE FULL PICTURE",lc:C.orange,tc:"#78350f",text:"Beyond HFOA: Kratom possession is a Class C felony — same as meth — legal in 43 states. Cannabis possession for 'personal use' is a misdemeanor but prior drug convictions escalate it to a felony. Marijuana within 3 miles of a school or public housing adds a mandatory 5 extra years. That enhancement covers almost every block of north Huntsville. Possession of drug paraphernalia by someone with a prior conviction is a Class B felony carrying up to 20 years. Probation conditions — drug tests, fees, check-ins — are structured in ways that make technical violations nearly inevitable, often sending people back to prison for missing an appointment or failing to pay a supervision fee."},{k:"gold",label:"WHO PROFITS FROM THESE LAWS",lc:"#b8860b",tc:"#78350f",text:"CoreCivic and GEO Group are paid per incarcerated person. Private probation companies charge supervision fees directly to the people they supervise — a system where profit depends on people staying in the system. AG Marshall received $45,000 from private prison PACs. Orr received $22,000. Both oppose every reform. Alabama prisons cost $17,000 per person per year and are at 181% capacity — declared unconstitutional by federal courts."}],
    prompt:"Investigate Alabama's full sentencing structure and its documented harms in Madison County. THE FACTS: Habitual Felony Offender Act — 527+ people serving life without parole for non-violent crimes, 75% Black, documented cases include life for stealing a toolbox and life for a $16 bicycle, Willie Simmons in prison since 1982 for a $9 theft who would get 20 years maximum today. School zone enhancement adds mandatory 5 years covering nearly all of north Huntsville due to school density but rarely triggers in south Huntsville — same law, same drug, different zip code. Kratom is a Class C felony in Alabama legal in 43 states. Private probation companies charge supervision fees creating a profit motive to keep people in the system. Drug paraphernalia possession with prior drug conviction is a Class B felony up to 20 years. 3.7x Black vs white drug arrest rate with same usage rates. Alabama prisons 181% capacity $17k per person per year. AG Marshall $45k private prison PACs, Orr $22k, both oppose all reform. WHO BENEFITS: CoreCivic, GEO Group, private probation companies, officials receiving their donations. WHO GETS HURT: Black residents of north Huntsville, people trapped in private probation debt cycles, families of the 500+ dying in prison for property crimes. THE CONNECTIONS: trace Marshall $45k private prison PACs to opposing bail reform, HFOA reform, probation reform. WHAT CAN CHANGE: HFOA retroactive review, end private probation, bail reform, kratom reclassification, school zone reform."},

  policing:{icon:"🚔",title:"Police &",subtitle:"Sheriff",tag:"tag-blue",sub:"No civilian review board in 16 years under Mayor Battle. 61% of Madison County Jail is pretrial. Sheriff Turner earns Securus commissions from families paying $0.21/min.",
    stats:[["Civilian Review Board","None","HPD investigates its own conduct",C.red],["Pretrial Detention","61%","Not convicted — held for no money",C.red],["N.Hsv Police Contacts","3.7×","More per capita than south Huntsville",C.red],["Securus Commission","~$200k/yr","County earns while families pay $0.21/min",C.orange]],
    facts:[{k:"red",label:"NO OVERSIGHT — 16 YEARS",lc:C.red,tc:"#7f1d1d",text:"Every comparable US city has some form of civilian police oversight. Huntsville has none. Mayor Battle has served 16 years and never proposed a civilian review board. The police union endorsed him. Officers can review body camera footage before writing incident reports. Internal Affairs reports to the Chief who reports to the Mayor."},{k:"gold",label:"THE SECURUS CONFLICT",lc:"#b8860b",tc:"#78350f",text:"Madison County earns approximately $200,000/year in commissions from Securus/ViaPath, the company families must pay to call their incarcerated loved ones at $0.21/minute. The Sheriff's office has a direct financial incentive to keep people jailed. Sheriff Turner received $24,000 from the bail bond industry and opposes bail reform. 61% of inmates have not been convicted of anything."}],
    prompt:"Investigate HPD oversight failures and Madison County Sheriff accountability. No civilian review in 16 years under Battle who has police union endorsement and law enforcement PAC donations. Officers review body cam before writing reports. 90-day auto-deletion. 3.7x police contact rate north vs south Huntsville. Sheriff Turner 61% pretrial detention, Securus $200k/yr commission conflict, $24k bail bond industry donations, opposes bail reform, $2.3M civil forfeiture fund no public accounting. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  surveillance:{icon:"📡",title:"Surveillance &",subtitle:"Privacy",tag:"tag-navy",sub:"47+ ALPRs tracking every vehicle. No civilian oversight. Alabama has no data privacy law. Law enforcement buys your location data without a warrant.",
    stats:[["License Plate Readers","47+","Track every vehicle including innocent",C.red],["AL Privacy Law","None","No comprehensive state protection",C.red],["Civilian Oversight","Zero","No board reviews surveillance use",C.red],["Law Enforcement Buys","No warrant","Purchase commercial location data",C.orange]],
    facts:[{k:"red",label:"TRACKING WITHOUT ACCOUNTABILITY",lc:C.red,tc:"#7f1d1d",text:"Huntsville expanded surveillance — license plate readers, ShotSpotter, cameras — with minimal public debate and zero civilian oversight. License plate readers record every vehicle including people never suspected of anything. ShotSpotter has a documented national false activation rate triggering armed responses."},{k:"gold",label:"YOUR DATA SOLD WITHOUT CONSENT",lc:"#b8860b",tc:"#78350f",text:"Data brokers compile profiles on every adult: location, health searches, political views, finances. Law enforcement purchases this commercial data to bypass warrant requirements. Your phone tracks where you go — including clinics, churches, protest sites. This data is sold to police without a judge's approval. Alabama has no law restricting any of this."}],
    prompt:"Investigate Huntsville surveillance infrastructure and Alabama data privacy. ALPR network 47+ cameras, ShotSpotter contracts and false activation rates, no civilian oversight board, law enforcement commercial location data purchases bypassing warrants, no Alabama data privacy law. Who approved the contracts? Were they bid competitively? What data sharing occurs with federal agencies? THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  immigration_merged:{icon:"🗂",title:"Immigration",subtitle:"Facts",tag:"tag-navy",sub:"Federal law is clear: undocumented immigrants cannot vote (52 U.S.C. §20511) and cannot receive Medicaid (8 U.S.C. §1611 — since 1996). Alabama politicians claim otherwise.",
    stats:[["Undocumented Voting","Federal Crime","52 U.S.C. §20511 — up to 1 yr prison","#16a34a"],["Benefits Bar","Since 1996","8 U.S.C. §1611 — Medicaid/SNAP/ACA barred","#16a34a"],["Social Security Paid","$25.7B/yr","By undocumented workers who can never collect","#2563eb"],["AL Coverage Gap","295,000","US citizens uninsured — Britt has $310k insurance PAC",C.red]],
    facts:[{k:"green",label:"THE STATUTES ARE CLEAR",lc:"#16a34a",tc:"#14532d",text:"Federal law (52 U.S.C. §20511) makes it a federal crime for any non-citizen to vote. Federal law (8 U.S.C. §1611, in place since 1996) bars undocumented immigrants from Medicaid, Medicare, ACA, CHIP, and SNAP. These are 30-year-old statutes. When Alabama politicians claim immigrants are accessing these benefits, they are contradicting federal law."},{k:"red",label:"WHO BENEFITS FROM THE MISINFORMATION",lc:C.red,tc:"#7f1d1d",text:"295,000 Alabama citizens are uninsured because Alabama refused Medicaid expansion. Sen. Britt received $310,000 from health insurance PACs and has made false immigration benefit claims. When voters focus on immigration fear, they may not focus on the $7.25 minimum wage, the Medicaid coverage gap, or corporate tax abatements."}],
    prompt:"Investigate the Alabama immigration disinformation campaign and its connection to Medicaid refusal. THE FACTS: 8 USC 1611 (1996) bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, CHIP — 30-year federal law. 52 USC 20511 makes non-citizen voting a federal crime. Undocumented workers pay $25.7B/yr in Social Security they can never collect. Alabama politicians including Britt and Ball make repeated false claims about immigrant benefit access. Britt received $310k from health insurance industry PACs. 295,000 Alabamians are uninsured in the Medicaid coverage gap — the gap the false immigration narrative is used to justify. The insurance industry financially benefits when Medicaid is not expanded. RealPage algorithmic rent-setting is under DOJ antitrust investigation. WHO BENEFITS: insurance companies retaining customers, politicians who receive their donations, groups that profit from immigration fear as a political distraction. WHO GETS HURT: 295,000 uninsured Alabama citizens, Madison County renters paying algorithmically maximized rents. THE CONNECTIONS: trace Britt's $310k insurance PAC donations directly to her false immigration claims to Medicaid refusal to insurance company revenue. WHAT CAN CHANGE."},

  unhoused:{icon:"🏠",title:"Unhoused",subtitle:"Residents",tag:"tag-orange",sub:'"Unhoused" means no stable housing — cars, tents, shelters, streets. These are Huntsville residents. The city criminalized this without expanding shelter. 3 of 8 sweeps happened next to developer projects.',
    stats:[["What Unhoused Means","No stable housing","Cars · tents · shelters · outside","#6b7280"],["Affordable Gap","7,000 units","For residents earning under $25k/yr",C.red],["Sweeps Near Dev.","3 of 8","Adjacent to active developer projects",C.orange],["Battle Developers","$380k","No affordable housing mandate required",C.red]],
    facts:[{k:"blue",label:"WHAT DOES UNHOUSED MEAN?",lc:"#2563eb",tc:"#1e3a5f",text:"'Unhoused' describes people without stable housing — living in vehicles, tents, emergency shelters, or outside. These are Huntsville residents who lost housing due to job loss, medical debt, eviction, domestic violence, or a mental health crisis. They are not a different category of person."},{k:"red",label:"CRIMINALIZATION WITHOUT SOLUTIONS",lc:C.red,tc:"#7f1d1d",text:"Huntsville's anti-camping ordinance (23-089) made it illegal to sleep on public property without first expanding shelter capacity. Three of eight sweeps occurred adjacent to active real estate development projects — suggesting the ordinance cleared land for development, not to help people find housing."}],
    prompt:"Investigate Huntsville unhoused population and affordable housing. Anti-camping ordinance 23-089 passed without expanding shelter first. 3 of 8 sweeps adjacent to active developer projects. 7,000 unit affordable housing gap for residents earning under $25k/yr. Mayor Battle $380k real estate developers, IDB abatements with no affordable housing requirement. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  transit:{icon:"⬡",title:"Transit &",subtitle:"Roads",tag:"tag-orange",sub:"No Sunday bus service. Routes end by 6pm. PCI 41 roads in north Huntsville vs PCI 72 in south. 90% of jobs require a car. Who benefits when everyone must own one?",
    stats:[["Sunday Service","None","Zero — forcing car ownership",C.red],["N.Hsv Road PCI","41","Poor — same tax rate as PCI 72 south",C.red],["Jobs by Transit","~10%","90% of jobs require a car",C.orange],["Battle Developers","$380k","Who profit from car-dependent sprawl",C.orange]],
    facts:[{k:"red",label:"WHO TRANSIT FAILURES HURT MOST",lc:C.red,tc:"#7f1d1d",text:"No Sunday service. Most routes end before the evening shift at HHHS, Amazon, or US-72 hotels. Workers without cars — disproportionately Black and low-income — cannot access most Huntsville jobs by transit. A car is a $400-600/month prerequisite for employment in a city that chose not to build transit."},{k:"gold",label:"WHO BENEFITS FROM KEEPING TRANSIT MINIMAL",lc:"#b8860b",tc:"#78350f",text:"Car dealers, auto lenders, insurance companies, and real estate developers building car-dependent sprawl all benefit when everyone must own a car. The Business Council of Alabama has opposed transit investment. Mayor Battle received $380,000 from real estate developers who profit from car-dependent development patterns."}],
    prompt:"Investigate Huntsville transit failures and road equity. No Sunday service, routes end 6pm, 90% of jobs require a car, north Huntsville PCI 41 vs south PCI 72 same tax rate, federal transit funding applications not pursued. Who benefits from keeping transit minimal? THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  environment:{icon:"🌿",title:"Environment,",subtitle:"Air & Water",tag:"tag-green",sub:"Redstone Arsenal PFAS contamination. Triana still on EPA Superfund list. North Alabama pollution concentrates in lower-income Black communities. ADEM has weakest enforcement in the Southeast.",
    stats:[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy",C.red],["Redstone PFAS","Documented","Groundwater contamination — extent undisclosed",C.red],["ADEM Enforcement","Weakest SE","vs comparable state agencies",C.orange],["Ivey Energy PACs","$340k","Appoints ADEM leadership",C.red]],
    facts:[{k:"red",label:"PFAS — THE FOREVER CHEMICAL PROBLEM",lc:C.red,tc:"#7f1d1d",text:"PFAS from Redstone Arsenal contaminate soil and groundwater — linked to cancer, thyroid disease, and immune damage. Triana's water shows PFOS above EWG health guidelines. The communities closest to contamination — Triana (majority-Black) and north Huntsville — have the least political power to demand cleanup."},{k:"gold",label:"ENVIRONMENTAL RACISM — THE DOCUMENTED PATTERN",lc:"#b8860b",tc:"#78350f",text:"Industrial facilities and contamination concentrate in lower-income, higher-proportion-Black communities. North Huntsville and Triana face disproportionate environmental burdens compared to south Huntsville and Madison City. This reflects decades of zoning, permitting, and enforcement decisions."}],
    prompt:"Investigate environmental contamination and justice in Madison County. Redstone Arsenal PFAS groundwater contamination extent and disclosure status. Triana Superfund PFOS above EWG guidelines. ADEM chronic understaffing and weak enforcement. Industrial facility concentration in north Huntsville and Triana vs south Huntsville. Strong voted against PFAS Notification Act, Britt against PFAS Action Act, Ivey $340k energy PACs appoints ADEM. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  annexation:{icon:"🗺",title:"Annexations &",subtitle:"Land Use",tag:"tag-red",sub:"Huntsville annexed 2,000+ acres in 2025 alone — now larger than Denver and Las Vegas by land area. Every annexation adds voters, changes district composition, and directs city services to new areas. North Huntsville neighborhoods get roads repaved decades after south Huntsville additions.",
    stats:[["2025 Annexations","2,000+ acres","Larger than Denver/Las Vegas by land mass",C.red],["Jan 2025 Annex","394 acres","2,500–4,000 new homes · south of Hwy 20",C.navy],["Michelle Watkins","Voted NO","Schools can't absorb — 'breaking at the seam'",C.green],["North vs New","Decades wait","New annexations get services faster than existing north Hsv",C.orange]],
    facts:[{k:"red",label:"WHO BENEFITS FROM EVERY ANNEXATION",lc:C.red,tc:"#7f1d1d",text:"Landowners who petition for annexation gain access to Huntsville Utilities, city schools, and city services — which raises their property values significantly. Real estate developers build the 2,500-4,000 homes on newly annexed land. Mayor Battle received $380,000 from real estate developers. Council President Robinson says the city considers annexations 'after being approached by landowners' — meaning the people who initiate the process are the same people who profit from it."},{k:"gold",label:"THE VOTING PATTERN PROBLEM",lc:"#b8860b",tc:"#78350f",text:"Every annexed area eventually adds registered voters in new council districts. New subdivisions in west and south Huntsville bring higher-income voters who historically vote differently from north Huntsville residents. Huntsville has grown from ~200 sq miles to now comparing in land mass to Chicago — while existing north Huntsville neighborhoods still wait years for road repaving, new annexations receive city services as a condition of joining. Michelle Watkins — the only north Huntsville council rep — was the only no vote on the January 2025 394-acre annexation."}],
    prompt:"Investigate Huntsville annexation patterns and their impact on north Huntsville residents. THE FACTS: 2,000+ acres annexed in 2025 alone, city now larger than Denver and Las Vegas by land mass, January 2025 394-acre annexation south of Hwy 20 will add 2,500-4,000 homes, Michelle Watkins only no vote citing school overcrowding, July 2025 1,000 acres into Marshall County making Huntsville span 4 counties, December 2025 724 additional acres proposed. WHO BENEFITS: landowners who petitioned, real estate developers building new homes, Mayor Battle $380k real estate donor connections, areas getting city services and infrastructure. WHO GETS HURT: north Huntsville residents waiting decades for road repaving while new annexations get immediate services, HCS school system absorbing growth without communication or planning, existing communities experiencing disinvestment as city expands outward. THE CONNECTIONS: Battle developer donors and annexation approval patterns, Robinson as Council President facilitating annexations. WHAT CAN CHANGE: equity audit of service delivery timelines by district, require infrastructure plans for north Huntsville before approving new annexations, impact fees on new development to fund existing neighborhood repairs."},

  business:{icon:"🏪",title:"Business Location",subtitle:"Equity",tag:"tag-orange",sub:"MidCity, Bridge Street, and Research Park attract new retail and restaurants. North Huntsville — same tax base, same city — attracts almost none. This is not an accident.",
    stats:[["MidCity Investment","$350M+","Private development since 2018",C.navy],["North Hsv New Retail","Minimal","Compared to south and west corridors",C.red],["Road PCI Gap","41 vs 72","North vs south — same city, same taxes",C.red],["IDB Abatements","$127M+","No requirement to locate in underserved areas",C.orange]],
    facts:[{k:"red",label:"WHY BUSINESSES DON'T OPEN IN NORTH HUNTSVILLE",lc:C.red,tc:"#7f1d1d",text:"Business location decisions follow infrastructure quality, customer demographics, and incentive structures. North Huntsville roads average PCI 41 (Poor). South Huntsville averages PCI 72 (Good). Retailers follow rooftops — new annexations in west and south Huntsville bring higher-income households. The IDB grants up to 20 years of zero property tax to corporations but has no requirement that recipients locate in economically distressed areas. Bridge Street, MidCity, and Hazel Green all received favorable infrastructure investment before private development followed."},{k:"gold",label:"ROAD MAINTENANCE RESPONSE TIME — THE DOCUMENTED GAP",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents report road damage sitting unrepaired for months to years. South Huntsville and newly annexed areas receive faster response. This is documented in the PCI data — PCI 41 means roads are in Poor condition requiring reconstruction, not just resurfacing. The city has acknowledged a $500M+ road maintenance backlog. Restore Our Roads 1 and 2 prioritize corridor roads, not neighborhood streets in north Huntsville. Mayor Battle told the legislature it will take 10-12 years to complete road projects."}],
    prompt:"Investigate why businesses locate in MidCity, Bridge Street, south Huntsville, and Hazel Green rather than north Huntsville. THE FACTS: MidCity $350M+ private investment since 2018, IDB grants zero property tax with no distressed area requirement, north Huntsville road PCI 41 vs south 72, road maintenance response time documented gap between north and south Huntsville, Restore Our Roads 1 and 2 focus on corridor roads not north Huntsville neighborhood streets, Mayor Battle acknowledged 10-12 year road project timeline to legislature. WHO BENEFITS: developers receiving IDB abatements in favorable areas, landowners in south and west Huntsville whose property values rise with new retail, Battle $380k developer donors. WHO GETS HURT: north Huntsville business owners and residents, people without cars needing nearby retail, property owners whose values stagnate. THE CONNECTIONS: IDB board appointed by Mayor Battle, no distressed area requirement ever proposed. WHAT CAN CHANGE: require IDB abatement recipients to locate in opportunity zones, dedicated north Huntsville road maintenance fund, business improvement district for north Huntsville."},

  groceries:{icon:"🛒",title:"Grocery Tax &",subtitle:"Food Costs",tag:"tag-gold",sub:"Alabama cut its state grocery tax to 2% in September 2025 — but Huntsville still adds its local tax on top. You pay more to eat here than residents of 37 other states. Women's hygiene products are still taxed as luxury items.",
    stats:[["AL State Grocery Tax","2% (Sept 2025)","Down from 4% — but local taxes remain",C.orange],["Huntsville Combined","~9%","State 2% + Madison Co. + City on groceries",C.red],["States with No Grocery Tax","37 states","Including Tennessee — 30 min away",C.green],["Women's Hygiene","Full tax rate","Taxed as non-essential luxury items",C.red]],
    facts:[{k:"red",label:"WHAT YOU ACTUALLY PAY AT THE REGISTER",lc:C.red,tc:"#7f1d1d",text:"Alabama dropped its state grocery tax to 3% in September 2023 and to 2% in September 2025. But the new law allowed — did not require — cities and counties to reduce their local portion. Most have not, citing revenue concerns. In Huntsville, you still pay city and county taxes on top of the state rate. The combined rate approaches 9% depending on the item. A family of four spending $1,000/month on groceries pays roughly $90/month in grocery taxes — over $1,000/year — that residents of Tennessee, Georgia, or 35 other states do not pay."},{k:"gold",label:"THE TAMPON TAX — TAXING A BIOLOGICAL NECESSITY",lc:"#b8860b",tc:"#78350f",text:"Alabama taxes menstrual products — pads, tampons, menstrual cups — at the full general sales tax rate. These are not optional purchases. Over 30 states have eliminated the tampon tax, recognizing these are medical necessities. In Alabama, a product a person cannot choose not to need is taxed as a luxury. The Alabama Legislature has been lobbied to eliminate this tax for years. It has not passed."}],
    prompt:"Investigate grocery taxes and food costs in Madison County compared to peer cities and states. THE FACTS: Alabama dropped state grocery tax to 2% September 2025 but cities were not required to reduce local rates, Huntsville combined grocery tax rate approaches 9%, Tennessee has no grocery tax and is 30 minutes away, 37 states have no grocery tax, menstrual products taxed at full rate in Alabama despite 30+ states eliminating tampon tax. For a family spending $1,000/month on food the annual tax difference between Huntsville and Nashville could exceed $1,000. WHO BENEFITS from maintaining grocery taxes: city and county general fund revenue, legislators avoiding alternative revenue sources. WHO GETS HURT: low-income families spending highest proportion of income on food, women who must purchase hygiene products. THE CONNECTIONS: which Madison County officials have opposed grocery tax elimination or tampon tax repeal. WHAT CAN CHANGE: city could voluntarily reduce local grocery tax, state legislature could eliminate tampon tax, pressure campaign on city council."},

  contractors:{icon:"🏭",title:"Gov. Contractors &",subtitle:"Tax Fairness",tag:"tag-navy",sub:"Redstone Arsenal is the economic engine of Madison County. The defense contractors it feeds — Lockheed, Boeing, Raytheon, SAIC — receive billions in federal contracts. How much do they pay in local taxes compared to individual residents?",
    stats:[["Redstone Federal Contracts","$20B+/yr","Total contracts flowing through the Arsenal",C.navy],["IDB Corporate Abatements","$127M+","Active zero property tax deals",C.red],["Avg Homeowner Property Tax","Full rate","No abatement available to individuals",C.red],["Lockheed AL Employees","~5,000","Yet pay reduced property tax via abatements",C.orange]],
    facts:[{k:"red",label:"THE TAX BURDEN SHIFT",lc:C.red,tc:"#7f1d1d",text:"When corporations receive IDB property tax abatements — up to 20 years of zero property tax — the school and city funding those taxes would have generated must come from somewhere else. That somewhere else is individual homeowners and small businesses who cannot access the abatement system. A homeowner in north Huntsville paying full property tax is effectively subsidizing the same corporations receiving billions in federal contracts. There is no public audit of whether promised jobs and wages were actually delivered."},{k:"gold",label:"FEDERAL CONTRACTORS AND ALABAMA TAX STRUCTURE",lc:"#b8860b",tc:"#78350f",text:"Alabama has no state income tax on military retirement pay, reduced business privilege tax rates, and a generous IDB abatement system — all of which disproportionately benefit large defense contractors and their senior employees. Meanwhile Alabama has no earned income tax credit, among the lowest unemployment benefits in the US, and the second-lowest minimum wage enforcement in the nation. The system is structured to benefit those at the top of the defense contractor food chain while providing minimal support for lower-wage contract employees."}],
    prompt:"Investigate government contractors in Madison County and their tax contributions compared to individual residents. THE FACTS: Redstone Arsenal generates $20B+ in annual federal contracts, major contractors include Lockheed Martin, Boeing, Raytheon, SAIC, Leidos, BAE Systems, IDB grants up to 20 years zero property tax with no performance audit, individual homeowners pay full property tax, Alabama has no state income tax on military retirement, no EITC, minimum wage $7.25/hr. Compare: what does a defense contractor employee earning $150k pay in total state and local taxes vs what does a Walmart worker earning $25k pay as a percentage of income? WHO BENEFITS from current structure: large contractors, senior employees, IDB board appointees. WHO GETS HURT: lower-wage contract employees, small businesses, north Huntsville homeowners subsidizing abatements. THE CONNECTIONS: Dale Strong $284k defense PACs, Tuberville $270k energy/defense PACs — both oppose any contractor tax reform. WHAT CAN CHANGE: IDB performance audits, living wage requirements for abatement recipients, contractor local hiring requirements."},

  schoollunch:{icon:"🍽",title:"School Lunches",subtitle:"Investigation",tag:"tag-orange",sub:"Who decides what children eat in Madison County schools? Who profits from school lunch contracts? Why did Alabama refuse Summer EBT school meals in 2024 while 40 other states accepted them?",
    stats:[["Summer EBT 2024","AL Refused","Ivey declined $60M+ in free federal food aid",C.red],["HCS Free/Reduced Lunch","~42%","Of HCS students qualify — higher in north Hsv schools",C.navy],["School Lunch Contractors","Aramark/Sodexo","National corporations run most large district food service",C.orange],["Lunch Debt","National crisis","Children refused meals over debt in some districts",C.red]],
    facts:[{k:"red",label:"ALABAMA REFUSED FREE SCHOOL MEALS — WHY",lc:C.red,tc:"#7f1d1d",text:"In 2024, Alabama was one of only 15 states that declined to participate in the USDA Summer EBT program, which would have provided $120 in food benefits per child over summer — at zero cost to the state. Governor Ivey declined the program. Approximately 400,000 Alabama children who qualify for free and reduced lunch went without this benefit. The federal government was paying 100% of the cost. Alabama chose not to administer the paperwork."},{k:"gold",label:"WHO PROFITS FROM SCHOOL LUNCH CONTRACTS",lc:"#b8860b",tc:"#78350f",text:"School food service in large districts is typically contracted to national corporations like Aramark or Sodexo. These companies have documented histories of overcharging districts, reducing food quality, and lobbying against universal free lunch programs that would reduce their customer base. HCS serves approximately 24,000 students daily. The food service contract is among the largest in the district budget. Board members who vote on these contracts are elected with minimal scrutiny — HCS board races see 11% voter turnout."}],
    prompt:"Investigate school lunch programs in Madison County. THE FACTS: Alabama refused Summer EBT 2024 at zero state cost leaving 400,000 children without $120 summer food benefit, Ivey signed the refusal, 42% of HCS students qualify for free and reduced lunch with higher percentages in north Huntsville schools, school food service typically contracted to Aramark or Sodexo national corporations, HCS board elections at 11% turnout control this contract. WHO BENEFITS: national food service contractors, officials avoiding federal program administration, Ivey donors in food/agriculture industry. WHO GETS HURT: 400,000 Alabama children who went hungry over summer, working families, north Huntsville students with highest free lunch rates. THE CONNECTIONS: trace Ivey donor connections to food industry, trace HCS board member connections to food service contractors. WHAT CAN CHANGE: Alabama joining Summer EBT, universal free school breakfast, competitive transparent food service contracting, HCS board election voter turnout."},

    proposals:{icon:"📐",title:"Policy",subtitle:"Proposals",tag:"tag-green",sub:"Specific achievable changes at every level of government. None require new money. All require political will — or different officials elected in 2026.",
    stats:[["Medicaid Expansion","Free to AL","Federal pays 90% — needs Governor's signature","#16a34a"],["Civilian Review","City Ordinance","City Council can pass at any meeting","#2563eb"],["CHOOSE Act Caps","State Vote","Protect ETF from universal drain",C.orange],["TVA Oversight","Congress","Rate increase approval above CPI",C.navy]],
    facts:[{k:"green",label:"WHAT COULD CHANGE TODAY",lc:"#16a34a",tc:"#14532d",text:"Medicaid expansion requires only the Governor's signature. A civilian police review board requires a City Council ordinance. A school spending equity audit requires an HCS board vote. An IDB performance audit requires a Mayor directive. None cost significant money. All have been blocked by officials receiving donor money from industries that benefit from the status quo."},{k:"gold",label:"WHAT REQUIRES THE 2026 ELECTIONS",lc:"#b8860b",tc:"#78350f",text:"Ending the minimum wage ban, kratom reclassification, bail reform, school zone enhancement reform, CHOOSE Act income cap extension — all require the Alabama Legislature. Arthur Orr controls which bills get hearings as Finance Chair. He is up for re-election in 2026. Replacing him changes the entire legislative landscape."}],
    prompt:"Generate a comprehensive list of specific achievable policy proposals that would most improve life for Madison County residents. Organize by level of government required. For each: what it does in plain language, who benefits, what the documented obstacle is (name the official blocking it), and what a resident can do today. Cover: Medicaid expansion, civilian police review, TVA rate oversight, minimum wage ban repeal, CHOOSE Act income caps, school equity, IDB reform, transit, housing affordability, criminal justice reform."},

  action:{icon:"▶",title:"Take",subtitle:"Action",tag:"tag-green",sub:"Every tool you need to hold Madison County officials accountable — complaints, FOIA requests, how to run for office, and where to register to vote.",
    stats:[["Ethics Complaints","Free","AL Ethics Commission — public record","#16a34a"],["Open Records","Your right","Alabama §36-12-40 — any public document","#2563eb"],["Voter Registration","15 days","Before any election — 37,000 unregistered",C.orange],["Run for Office","2026","School board races decided by 200 votes","#16a34a"]],
    facts:[{k:"green",label:"YOUR RIGHTS UNDER ALABAMA LAW",lc:"#16a34a",tc:"#14532d",text:"Under Alabama Open Records Act §36-12-40, you have the right to request and receive any public record — contracts, meeting minutes, financial documents, correspondence. This is free. Under Alabama Ethics Act, you can file a complaint against any public official for ethics violations. This is also free and creates a public record."},{k:"gold",label:"THE MOST POWERFUL THINGS YOU CAN DO",lc:"#b8860b",tc:"#78350f",text:"In order of likely impact: (1) Register to vote — 37,000 eligible Madison County residents are not registered. (2) Attend a City Council or school board meeting when a vote is coming — your presence changes the calculus. (3) File an Open Records request — officials take them seriously. (4) Run for HCS school board in 2026 — races are decided by under 200 votes."}],
    prompt:"Generate a comprehensive action guide for Madison County residents. What are the most impactful specific actions they can take to hold officials accountable? Include: how to file Alabama Open Records requests (with template), how to file AL Ethics Commission complaints, how to contact every relevant official, how to attend public meetings effectively, voter registration details, and how to run for HCS school board in 2026. Make it actionable and specific."},

  disinfo:{icon:"🧠",title:"Disinformation,",subtitle:"Algorithms & Immigration Facts",tag:"tag-navy",sub:"Britt's immigration benefit claims contradict 8 U.S.C. §1611 — law in place since 1996. Alabama politicians use this false narrative to justify refusing Medicaid for 295,000 citizens. The insurance industry donates $310k to Britt. Follow the money.",
    stats:[["Britt Claims","Contradict law","8 U.S.C. §1611 since 1996",C.red],["Britt Insurance PACs","$310k","Who benefit from Medicaid refusal distraction",C.red],["RealPage DOJ Suit","Active","Algorithmic rent coordination",C.red],["Local Investigative","Declining","Staff cuts across all AL outlets",C.orange]],
    facts:[{k:"red",label:"THE IMMIGRATION DISINFORMATION CAMPAIGN — FOLLOW THE MONEY",lc:C.red,tc:"#7f1d1d",text:"Federal law (8 U.S.C. §1611, since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, and CHIP. This 30-year federal statute is unambiguous. Yet Alabama politicians repeatedly claim immigrants are using these programs — a claim that is factually false. Sen. Britt received $310,000 from health insurance PACs. Those PACs benefit directly when Medicaid is not expanded for 295,000 Alabama citizens. The false immigration claim is the justification. The insurance industry revenue is the motive."},{k:"gold",label:"THE DOCUMENTED CONNECTION: FALSE CLAIM → REAL POLICY → REAL DONOR BENEFIT",lc:"#b8860b",tc:"#78350f",text:"Step 1: Politician claims immigrants are burdening Medicaid. Step 2: Claim is false — 8 U.S.C. §1611 has prevented this since 1996. Step 3: The false claim is used to justify not expanding Medicaid. Step 4: 295,000 Alabama citizens remain uninsured in the coverage gap. Step 5: Health insurance companies keep those citizens as private insurance customers instead. Step 6: Those insurance companies donate $310,000 to the politician making the false claim. This is a documented disinformation loop with a documented financial beneficiary."}],
    prompt:"Investigate disinformation by Alabama politicians and algorithmic pricing as connected issues. Britt false immigration benefit claims vs 8 USC 1611 since 1996 — trace to her $310k insurance PAC donors who benefit from Medicaid refusal distraction. RealPage DOJ antitrust case and Madison County landlord usage. Algorithmic grocery pricing. Who benefits when voters focus on false threats instead of real economic harm? THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},

  voting:{icon:"🗳",title:"Voting Power &",subtitle:"Gerrymandering",tag:"tag-red",sub:"Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents not registered. School board races are decided by under 200 votes.",
    stats:[["VRA Violation","Ruled 2023","Allen v. Milligan — maps unconstitutional",C.red],["Unregistered Eligible","37,000","Madison County eligible but not registered",C.red],["HCS Board Turnout","11%","Controls $310M — 2,000 votes flips a race",C.orange],["Local Race Margin","<200 votes","Many council and school board races",C.orange]],
    facts:[{k:"red",label:"GERRYMANDERING — WHAT HAPPENED",lc:C.red,tc:"#7f1d1d",text:"In June 2023 the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act. AG Steve Marshall spent taxpayer money defending the unconstitutional maps. Replacement maps Alabama drew were also found non-compliant. Marshall received $340,000 from law enforcement PACs — the same officials who benefit from safe gerrymandered districts."},{k:"green",label:"YOUR VOTE IS WORTH MORE THAN YOU THINK",lc:"#16a34a",tc:"#14532d",text:"The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races: decided by under 200 votes — controlling a $310M annual budget with 11% turnout. A single organized group with 500 committed members can determine the outcome of almost any Madison County local race. The most powerful vote you cast in 2026 is probably for HCS school board."}],
    prompt:"Investigate gerrymandering and voter power in Madison County. Allen v. Milligan Supreme Court ruling VRA violation 2023. Marshall defended unconstitutional maps at taxpayer expense, drew non-compliant replacements. 37,000 unregistered eligible Madison County voters. Specific recent race margins — City Council D1 decided by 368 votes, HCS board races under 200 votes with 11% turnout. What organized voter action could accomplish in 2026. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."},
};

// ─── SHARED COMPONENTS ───────────────────────────────────────
function Spin(){return <span className="spin"/>;}

function AiResult({text}){
  if(!text) return null;
  // Split on section headers
  const sections=text.split(/\n(?=##\s)/);
  const sectionColors={'THE FACTS':'#1e3a5f','WHO BENEFITS':'#dc2626','WHO GETS HURT':'#dc2626','THE CONNECTIONS':'#b8860b','WHAT CAN CHANGE':'#16a34a'};
  return(
    <div>
      {sections.map((section,si)=>{
        const lines=section.split('\n').filter(l=>l.trim());
        if(!lines.length) return null;
        const isHeader=lines[0].startsWith('##');
        const header=isHeader?lines[0].replace(/^#+\s*/,''):null;
        const body=isHeader?lines.slice(1):lines;
        const hColor=header?Object.entries(sectionColors).find(([k])=>header.toUpperCase().includes(k))?.[1]||'#1e3a5f':'#1e3a5f';
        return(
          <div key={si} style={{marginBottom:16}}>
            {header&&<div style={{fontSize:9,fontWeight:800,color:hColor,letterSpacing:1.5,marginBottom:8,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",borderBottom:`2px solid ${hColor}22`,paddingBottom:5}}>{header}</div>}
            {body.map((line,li)=>{
              const txt=line.replace(/\*\*([^*]+)\*\*/g,'$1').replace(/^[-•]\s*/,'').trim();
              if(!txt) return null;
              const isBullet=line.trim().startsWith('-')||line.trim().startsWith('•');
              return isBullet?(
                <div key={li} style={{display:"flex",gap:8,marginBottom:6,paddingLeft:4}}>
                  <span style={{color:hColor,flexShrink:0,fontSize:11,marginTop:2}}>◈</span>
                  <span style={{fontSize:13,color:"#2d2a22",lineHeight:1.7}}>{txt}</span>
                </div>
              ):(
                <p key={li} style={{fontSize:13,color:"#2d2a22",lineHeight:1.75,marginBottom:5}}>{txt}</p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function AiButton({prompt,label="🔍 Investigate — Full AI Analysis"}){
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);
  async function go(){
    setLd(true);
    try{const x=await callAI(prompt);setR(x);}
    catch(e){setR("Investigation unavailable — please try again.");}
    setLd(false);
  }
  if(r)return(
    <div className="ai-panel">
      <div className="ai-panel-label">🔍 AI INVESTIGATION</div>
      <AiResult text={r}/>
      <button className="btn btn-ghost" onClick={()=>setR(null)} style={{marginTop:10,fontSize:11}}>Clear</button>
    </div>
  );
  return(
    <button className={`btn btn-gold btn-full`} onClick={go} disabled={ld}>
      {ld?<><Spin/> Investigating...</>:label}
    </button>
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

// ─── SCHOOLS PAGE ─────────────────────────────────────────────
function SchoolsPage(){
  const[tab,setTab]=useState("overview");
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">SCHOOLS · INVESTIGATION</span>
        <h2>Schools & <em>Boards</em></h2>
        <p>Three systems serve Madison County with documented funding gaps. CHOOSE Act pulls ETF money to private schools — 67% of recipients were already in private school.</p>
      </div>
      <div className="tabs">
        {["overview","choose","funding","officials"].map(t=>(
          <button key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      {tab==="overview"&&(
        <div>
          <StatGrid stats={[["HCS Students","24,000","$310M budget · 5 elected members",C.navy],["MCS Students","12,000","Higher-income tax base · fastest growing","#374151"],["MCSS Students","10,000","Rural/unincorporated · least funded",C.red],["Within-District Gap","$847/pupil","HCS lower vs higher income schools",C.orange]]}/>
          <div className="fact fact-red"><div className="fact-label" style={{color:C.red}}>THREE SYSTEMS, ONE COUNTY</div><div className="fact-text" style={{color:"#7f1d1d"}}>Madison County has three completely independent school systems. Resources are determined by which side of a city limit line you live on. HCS and MCS serve higher-income areas. MCSS serves rural lower-income areas — Triana, Harvest, Toney, Meridianville — with the least funding.</div></div>
          <AiButton prompt="Investigate Madison County school equity — three systems HCS $310M, MCS, MCSS least funded, $847/pupil gap within HCS, who benefits from three-district structure vs consolidation, CHOOSE Act 67% already private school recipients. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."/>
        </div>
      )}
      {tab==="choose"&&(
        <div>
          <StatGrid stats={[["CHOOSE Act Fund","$100M","From Education Trust Fund annually",C.red],["Already Private","~67%","Of applicants already in private/home school",C.orange],["Goes Universal","2027","Income caps expire — all families eligible",C.red],["Religious Schools","91-96%","Of vouchers in peer states go religious","#b8860b"]]}/>
          <div className="fact fact-red"><div className="fact-label" style={{color:C.red}}>WHAT THE CHOOSE ACT IS</div><div className="fact-text" style={{color:"#7f1d1d"}}>Signed by Gov. Ivey March 2024. Up to $7,000/yr for private school, $2,000 for homeschooling — funded from the Education Trust Fund that pays for public schools. Income caps expire 2027 making every family eligible. Two-thirds of 2025 applicants were already in private school.</div></div>
          <AiButton prompt="Investigate Alabama CHOOSE Act impact on Madison County schools. Who lobbied for it, national organizations funded it, which AL legislators received voucher advocacy donations. Are any participating private schools former segregation academies? Has tuition already increased? HCS/MCS/MCSS leaders estimate combined $100M impact when universal. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."/>
        </div>
      )}
      {tab==="funding"&&(
        <div>
          <div className="fact fact-red"><div className="fact-label" style={{color:C.red}}>ALABAMA F ON SCHOOL FUNDING</div><div className="fact-text" style={{color:"#7f1d1d"}}>Education Law Center 2023: F on per-pupil funding vs national average. F on funding gap between high-poverty and low-poverty districts. Highest-poverty districts receive $1,475 less per student. IDB corporate tax abatements drain school property tax with no required performance audit.</div></div>
          <AiButton prompt="Investigate school funding reform for Madison County. What specific policies would most improve equity — equalizing per-pupil spending within HCS, requiring IDB abatement recipients to pay school-only millage, maintaining CHOOSE Act income caps, independent consolidation study. What would each reform mean in dollars? Who supports and opposes? THE FACTS, WHO BENEFITS, WHO GETS HURT, WHAT CAN CHANGE."/>
        </div>
      )}
      {tab==="officials"&&(
        <div>
          {[{name:"Kay Ivey — Governor",claimed:"My commitment to public education is unrelenting.",did:"Called CHOOSE Act her #1 priority. Signed it. Refused Summer EBT school meals. Refused Medicaid expansion affecting school families. $420k from insurance PACs.",prompt:"Investigate Gov. Ivey's education record vs her donors. CHOOSE Act, Summer EBT refusal, Medicaid refusal. $420k insurance PACs. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS."},
           {name:"Arthur Orr — Senate Finance Chair",claimed:"Pro-business and pro-worker for Madison County.",did:"Did not block CHOOSE Act. Sponsored SB 88 banning wage increases for school workers. Blocked Medicaid. $22k private prison PACs.",prompt:"Investigate Orr's education record. Could have blocked CHOOSE Act as Finance Chair. SB 88 wage ban. $22k private prison PACs. THE FACTS, WHO BENEFITS, WHO GETS HURT."},
           {name:"Tommy Battle — Mayor",claimed:"Mayor of all of Huntsville.",did:"IDB abatements drain school property tax. Zero Pre-K grant applications in 16 years. Capital budgets favor south Huntsville.",prompt:"Investigate Battle's education record. IDB abatements reduce school property tax revenue. No Pre-K expansion in 16 years. $380k developer donors. THE FACTS, WHO BENEFITS, WHO GETS HURT."}
          ].map((off,i)=>(
            <div key={i} className="card" style={{marginBottom:10}}>
              <div className="card-title">{off.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"8px 0"}}>
                <div style={{padding:"7px 9px",background:"#f0fdf4",borderRadius:3,border:"1px solid #86efac",fontSize:11,color:"#14532d",fontStyle:"italic"}}>"{off.claimed}"</div>
                <div style={{padding:"7px 9px",background:"#fef2f2",borderRadius:3,border:"1px solid #fca5a5",fontSize:11,color:"#7f1d1d"}}>{off.did}</div>
              </div>
              <AiButton prompt={off.prompt} label={`🔍 Investigate ${off.name.split(" — ")[0]}`}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── OFFICIALS PAGE ───────────────────────────────────────────

// ─── UTILITIES PAGE ───────────────────────────────────────────
function UtilitiesPage(){
  const[tab,setTab]=useState("providers");
  const PROVIDERS=[
    {id:"hu",name:"Huntsville Utilities",color:C.navy,serves:"Huntsville + portions of Madison County · ~218,000 customers",services:"Electric (TVA) · Water · Natural Gas",gov:"3 appointed boards. All appointed by City Council — no public election. No PSC oversight.",rates:[{what:"Electric increase",when:"Jan + Oct 2025",amount:"5.1% combined",why:"First rate increase since 2018. Materials costs, inflation, infrastructure."},
      {what:"TVA wholesale increase",when:"Aug 2024",amount:"5.25% (largest in 16 years)",why:"Passed directly to HU customers. Combined effect: ~10%+ on your bill in 2025."}],
    recourse:"Rate changes require City Council approval — attend council meetings before a vote. The 2024 increase was tabled for 2 weeks after public discussion."},
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
            {PROVIDERS.map(x=><button key={x.id} onClick={()=>setSel(x.id)} style={{padding:"5px 12px",borderRadius:12,border:"1px solid #e0d8cc",background:sel===x.id?x.color:"#fff",color:sel===x.id?"#fff":C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{x.name.split(" ")[0]}{x.name.includes("TVA")?" TVA":""}</button>)}
          </div>
          <div className="card" style={{borderLeft:`4px solid ${p.color}`}}>
            <div style={{fontWeight:800,fontSize:14,color:p.color,marginBottom:4}}>{p.name}</div>
            <div style={{fontSize:11.5,color:C.muted,marginBottom:8}}>{p.serves}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {p.services.split(" · ").map((s,i)=><span key={i} style={{fontSize:9,fontWeight:700,color:C.navy,background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:10,padding:"2px 8px"}}>{s}</span>)}
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:8.5,color:"#b8860b",fontWeight:700,letterSpacing:1,marginBottom:5}}>GOVERNANCE — WHO CONTROLS THIS</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{p.gov}</div></div>
            <div style={{marginBottom:10}}><div style={{fontSize:8.5,color:C.red,fontWeight:700,letterSpacing:1,marginBottom:6}}>RECENT RATE CHANGES</div>
              {p.rates.map((r,i)=>(
                <div key={i} style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:3,padding:"8px 10px",marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
                    <span style={{fontSize:11.5,fontWeight:700,color:C.navy}}>{r.what}</span>
                    <span style={{fontSize:9,fontWeight:700,color:C.red,flexShrink:0}}>{r.amount} · {r.when}</span>
                  </div>
                  <div style={{fontSize:11,color:C.muted}}>{r.why}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fffbeb",borderRadius:3,padding:"9px 11px",marginBottom:10}}><div style={{fontSize:8.5,color:"#b8860b",fontWeight:700,letterSpacing:1,marginBottom:4}}>YOUR LEVERAGE</div><div style={{fontSize:12,color:"#78350f"}}>{p.recourse}</div></div>
            <AiButton prompt={`Investigate ${p.name} for Madison County ratepayers. Governance: ${p.gov}. Rate history: ${p.rates.map(r=>r.what+" "+r.amount).join(", ")}. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE.`} label={`🔍 Investigate ${p.name}`}/>
          </div>
        </div>
      )}
      {tab==="compare"&&(
        <div>
          <div className="fact fact-red"><div className="fact-label" style={{color:C.red}}>THE DOUBLE MARKUP PROBLEM</div><div className="fact-text" style={{color:"#7f1d1d"}}>TVA generates power → sells wholesale to HU → HU marks up → you pay. Two entities adding cost, neither elected. In 2024-2025: TVA +5.25% + HU +5.1% = ~10%+ on your electric bill in one year. Neither required a public vote. Alabamians pay an average of $183/month for electricity — among the highest in the nation despite cheap TVA generation.</div></div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:14}}>
            <thead><tr>{["Utility","Avg Monthly","Oversight","Your Recourse"].map(h=><th key={h} style={{background:C.navy,color:C.gold,padding:"8px 10px",textAlign:"left",fontSize:10}}>{h}</th>)}</tr></thead>
            <tbody>
              {[["Huntsville (HU+TVA)","~$146–165","Appointed boards","Attend City Council · elect better reps"],["National Average","~$137","Varies","Many states have elected utility boards"],["Nebraska (public)","~$90–100","Elected board","Vote directly for board members"]].map((row,i)=>(
                <tr key={i} style={{background:i===0?"#fef2f2":"#fff"}}>
                  {row.map((c,j)=><td key={j} style={{padding:"8px 10px",borderBottom:"1px solid #f0ebe2",fontWeight:j===0?700:400,color:j===0?C.navy:"#374151"}}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <AiButton prompt="Investigate how Madison County utility rates compare to peer cities and states. TVA ratepayers face unique challenges — federal monopoly, no PSC jurisdiction. Combined TVA+HU increases in 2024-2025 ~10% in one year. Compare to Nebraska elected utility board, national average, other TVA-served cities. What reform options exist? THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."/>
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
              <div style={{display:"flex",gap:9,marginBottom:6}}><span style={{fontSize:18}}>{t.icon}</span><div style={{fontWeight:700,color:C.navy,fontSize:13}}>{t.title}</div></div>
              <div style={{fontSize:12,color:"#374151",lineHeight:1.6,marginBottom:t.template?8:0}}>{t.sub}</div>
              {t.sub2&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{t.sub2}</div>}
              {t.template&&<pre style={{fontSize:10.5,background:"#f8f6f2",padding:"8px 10px",borderRadius:3,whiteSpace:"pre-wrap",color:"#374151",lineHeight:1.5,marginTop:6}}>{t.template}</pre>}
              {t.url&&<a href={t.url} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{marginTop:8,fontSize:11}}>{t.btn} →</button></a>}
              {t.links&&<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>{t.links.map((l,j)=><a key={j} href={l.u} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11}}>↗ {l.l}</button></a>)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOARDS PAGE ──────────────────────────────────────────────
function BoardsPage(){
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">BOARDS · INVESTIGATION</span>
        <h2>Boards &amp; <em>Directors</em></h2>
        <p>The decisions that most affect your daily life — utility rates, corporate tax abatements, hospital governance — are made by unelected boards. Here is who they are, who appointed them, and how they connect to each other and to elected officials.</p>
      </div>
      <div className="alert-banner"><div className="alert-label">THE ACCOUNTABILITY GAP</div><div className="alert-text">Every utility rate increase you pay was approved by someone you did not elect. Every corporate tax abatement reducing your school funding was approved by an unelected board. The HHHS board that approved $3.1M CEO pay appoints its own successors. Your recourse runs through the elected officials who appoint these boards.</div></div>
      {[{name:"Huntsville Utilities Boards (3)",appt:"City Council",terms:"3-year terms",members:"George Moore (9th term, since 1998), Kimberly Lewis (2nd term), Thomas Winstead (8th term)",power:"Controls electric rates, water rates, gas rates for ~218,000 customers. Rate changes require City Council approval.",flag:"George Moore has served since 1998 — longer than most Council members who appointed him. City considering consolidating 3 boards into 1."},
       {name:"Industrial Development Board (IDB)",appt:"Mayor",terms:"Staggered appointed terms",members:"9-member board appointed by Mayor Battle",power:"Approves corporate property tax abatements — $127M+ active. Up to 20 years zero property tax. No required audit of job/wage promises kept.",flag:"No public election. No required financial disclosure. Amazon, Boeing, and Lockheed received abatements. Small businesses cannot access this system."},
       {name:"HHHS Board of Directors",appt:"Self-appointed",terms:"Self-perpetuating — appoints own successors",members:"15-member board. Has included Redstone Federal Credit Union executives and HHHS-employed physicians who vote on their own compensation.",power:"Controls $2.4B nonprofit. Approved CEO pay $3.1M. Approved all facility acquisitions creating North Alabama monopoly.",flag:"No public vote. Ever. Zero community election in the history of HHHS. The only lever is the state legislature amending HHHS's charter."},
       {name:"Madison Utilities Board",appt:"Madison City Council",terms:"6-year staggered terms",members:"Board tied to City of Madison as a component unit",power:"Controls water and wastewater rates for 19,000+ Madison City customers.",flag:"New Mayor Bartlett was on the Madison Board of Education 2011-2020 — she knows how these bodies work. New council may shift board composition."},
      ].map((b,i)=>(
        <div key={i} className="card" style={{borderLeft:`4px solid ${C.navy}`,marginBottom:10}}>
          <div style={{fontWeight:800,fontSize:13,color:C.navy,marginBottom:4}}>{b.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8,fontSize:11}}>
            <div><span style={{color:C.muted}}>Appointed by: </span><strong style={{color:C.navy}}>{b.appt}</strong></div>
            <div><span style={{color:C.muted}}>Terms: </span><strong style={{color:C.navy}}>{b.terms}</strong></div>
          </div>
          <div style={{fontSize:11.5,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Members:</strong> {b.members}</div>
          <div style={{fontSize:11.5,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Power:</strong> {b.power}</div>
          <div style={{background:"#fef2f2",borderRadius:3,padding:"7px 9px",fontSize:11,color:"#7f1d1d",borderLeft:`3px solid ${C.red}`}}>{b.flag}</div>
        </div>
      ))}
      <AiButton prompt="Investigate the major appointed boards affecting Madison County residents — HU boards, IDB, HHHS Board, Madison Utilities board. For each: who are current members by name, what are their professional affiliations, do any have financial conflicts with decisions they make, what are the most consequential decisions in the past 3 years. Map any interlocking relationships where someone serves on multiple boards or has connections to officials who appointed them. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE."/>
    </div>
  );
}


// ─── OFFICIALS DATA ───────────────────────────────────────────
const OFFICIALS=[
  {level:"Federal",color:"#1e3a5f",officials:[
    {name:"Dale Strong",title:"U.S. Representative",district:"Alabama's 5th Congressional District",party:"Republican",since:"Jan 2023",termEnds:"Jan 2027",avatar:"DS",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $1.2M–$2.8M",netWorthPre:"Est. $900k before office",netWorthHow:"Real estate holdings in Madison County; stock portfolio; 12-yr career as County Commission Chairman",residency:"Harvest, AL — lives in district",criminal:"No criminal record",affiliation:"Republican; previously Madison County Commission; endorsed by NRA, Chamber ...",topDonors:[["Defense PACs (Lockheed, Boeing, Raytheon)","$284,000"],["Real Estate PACs","$48,000"],["BAE Systems PAC","$22,000"]],bio:"Served as Madison County Commission Chairman 2010-2022. Won AL-5 seat in 2022. Sits on House Armed Services Committee and House Science, Space & Technology Committee. Has not introduced any TVA oversight, utility rate, or worker wage legislation. Voted against PRO Act, Build Back Better child care provisions, PFAS Notification Act, and drug pricing reform.",votes:[{bill:"PRO Act (union organizing rights)",vote:"Against",impact:"Would have protected Madison County workers' right to organize"},  {bill:"Build Back Better child care",vote:"Against",impact:"Would have capped child care at 7% of income for Madison County families"},{bill:"PFAS Notification Act",vote:"Against",impact:"Would have required disclosure of Redstone Arsenal PFAS contamination levels"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"AL-5 covers all TVA territory — zero bills filed in 2 years"}],contact:{phone:"(256) 551-0190",web:"https://dalestrong.house.gov/contact",office:"2417 Longworth HOB, Washington DC"}},
    {name:"Katie Britt",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",since:"Jan 2023",termEnds:"Jan 2029",avatar:"KB",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $3.1M–$7.4M",netWorthPre:"Est. $1.5M before office",netWorthHow:"Disclosed stock holdings in energy, finance, defense; husband former NFL player; prior CEO Business Council of Alabama",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former CEO Business Council of Alabama; endorsed by Trump 2022",topDonors:[["Health insurance industry","$310,000"],["Energy PACs","$890,000"],["Financial services","$445,000"]],bio:"First woman elected to Senate from Alabama. Former CEO of Business Council of Alabama. Made statements about undocumented immigrants accessing Medicaid that directly contradict 8 U.S.C. §1611 — federal law in place since 1996 that explicitly bars this. Received $310,000 from health insurance industry PACs. 295,000 Alabamians are uninsured in the Medicaid coverage gap.",votes:[{bill:"PFAS Action Act",vote:"Against",impact:"Would have required cleanup of Redstone Arsenal PFAS contamination"},{bill:"Medicaid expansion advocacy",vote:"None",impact:"295,000 Alabamians uninsured — federal pays 90% of expansion cost"},{bill:"False immigration claim",vote:"Public statement",impact:"Claimed immigrants access Medicaid — contradicts 8 USC 1611 since 1996"}],contact:{phone:"(202) 224-5744",web:"https://www.britt.senate.gov/contact",office:"703 Hart Senate Office Building"}},
    {name:"Tommy Tuberville",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",since:"Jan 2021",termEnds:"Jan 2027",avatar:"TT",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before office",netWorthHow:"Multi-million coaching contracts at Auburn, Ole Miss, Texas Tech; hedge fund and commodity investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Auburn, AL — has faced questions about Florida residency",criminal:"No criminal record",affiliation:"Republican; former football coach; endorsed by Trump",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["NRA PAC","$65,000"]],bio:"Spent most of career as football coach. Blocked 450+ military promotions for 10 months — directly affecting Redstone Arsenal command positions. Has not introduced any TVA oversight legislation. Faced ethics questions about trading in commodities while on Senate Agriculture Committee.",votes:[{bill:"Military promotions (held hostage)",vote:"Blocked 450+ for 10 months",impact:"Directly disrupted Redstone Arsenal command structure"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"Controls TVA through Senate despite $270k energy PACs"}],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
  ]},
  {level:"State",color:"#7f1d1d",officials:[
    {name:"Kay Ivey",title:"Governor of Alabama",district:"Statewide — TERM LIMITED 2026",party:"Republican",since:"Apr 2017",termEnds:"Jan 2027",avatar:"KI",salary:"$120,395/yr — taxpayer funded",netWorth:"Est. $1.4M–$3.2M",netWorthPre:"Est. $900k before governor",netWorthHow:"State treasurer 2003-2011; State Auditor; real estate; disclosed investment portfolio",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former State Treasurer, State Auditor, Lt. Governor; term limit...",topDonors:[["Health insurance industry","$420,000"],["Energy PACs","$340,000"],["Business Council of Alabama","$180,000"]],bio:"Has refused Medicaid expansion for 295,000 Alabamians — federal government pays 90% of the cost. Signed CHOOSE Act diverting $100M from Education Trust Fund to private schools where 67% of recipients were already enrolled. Refused Summer EBT school meals in 2024, declining $60M+ in free federal food aid for Alabama children. Appoints ADEM leadership — agency has weakest environmental enforcement record in the Southeast.",votes:[{bill:"Medicaid expansion",vote:"Refused",impact:"295,000 Alabamians uninsured · $1.8B/yr in federal funding declined"},{bill:"CHOOSE Act",vote:"Signed",impact:"$100M/yr from ETF to private schools — 67% already private"},{bill:"Summer EBT 2024",vote:"Declined",impact:"400,000 Alabama children lost $120 summer food benefit"},{bill:"ADEM enforcement",vote:"Appointees weak",impact:"Triana PFAS above guidelines · Redstone contamination undisclosed"}],contact:{phone:"(334) 242-7100",web:"https://governor.alabama.gov/contact/",office:"600 Dexter Ave, Montgomery AL 36130"}},
    {name:"Arthur Orr",title:"AL Senate Finance Committee Chair",district:"Senate District 8 — Madison/Lawrence Counties",party:"Republican",since:"Jan 2011",termEnds:"Nov 2026",avatar:"AO",salary:"$54,114/yr + per diem — taxpayer funded",netWorth:"Est. $800k–$2.1M",netWorthPre:"Est. $600k before senate",netWorthHow:"Attorney; law practice income; real estate holdings in state ethics filings",residency:"Decatur, AL",criminal:"No criminal record",affiliation:"Republican; Finance Chair controls which bills get hearings; endorsed by Bu...",topDonors:[["Business Council of Alabama","$45,000"],["Private prison (CoreCivic/GEO)","$22,000"],["ALFA Insurance","$28,000"],["Alabama Power PAC","$19,000"]],bio:"As Finance Committee Chairman he controls which bills receive hearings in the Alabama Senate. Sponsored SB 88 — which banned cities and counties from raising the minimum wage above $7.25/hr. Has blocked Medicaid expansion, kratom reclassification, sentencing reform, and bail reform. Did not block CHOOSE Act despite his committee authority. Up for re-election 2026 — replacing him is the single most impactful change possible in the AL Senate.",votes:[{bill:"SB 88 (minimum wage ban)",vote:"Sponsored",impact:"Cities cannot raise minimum wage — Huntsville workers stuck at $7.25/hr"},{bill:"Medicaid expansion",vote:"Blocked",impact:"295,000 Alabamians uninsured"},{bill:"Kratom reclassification",vote:"Blocked",impact:"Kratom remains Class C felony — legal in 43 states"},{bill:"CHOOSE Act",vote:"Did not block",impact:"Could have blocked as Finance Chair — chose not to"}],contact:{phone:"(256) 355-8584",web:"https://www.legislature.state.al.us",office:"Alabama State House, Montgomery AL"}},
    {name:"Steve Marshall",title:"Alabama Attorney General",district:"Statewide",party:"Republican",since:"Feb 2017",termEnds:"Jan 2027",avatar:"SM",salary:"$136,495/yr — taxpayer funded",netWorth:"Est. $500k–$1.4M",netWorthPre:"Est. $400k before AG",netWorthHow:"Attorney; public salary; disclosed investments",residency:"Guntersville, AL",criminal:"No criminal record — but faced scrutiny for campaign finance practices",affiliation:"Republican; former Marshall County DA; endorsed by law enforcement associations",topDonors:[["Law enforcement PACs","$340,000"],["Private prison industry","$45,000"],["Business Council of Alabama","$38,000"]],bio:"Defended Alabama's unconstitutional congressional maps in Allen v. Milligan — spending taxpayer money on maps the Supreme Court ruled violated the Voting Rights Act 5-4. Drew replacement maps that were also found non-compliant. Received $45,000 from private prison PACs and opposes every sentencing reform, bail reform, and forfeiture reform proposal.",votes:[{bill:"Allen v. Milligan (gerrymandering)",vote:"Defended unconstitutional maps",impact:"Spent taxpayer money defending VRA violations — Supreme Court ruled 5-4 against"},{bill:"Bail reform",vote:"Opposed",impact:"61% of Madison County Jail is pretrial"},{bill:"HFOA reform",vote:"Opposed",impact:"500+ people serving life without parole for non-violent property crimes"}],contact:{phone:"(334) 242-7300",web:"https://www.alabamaag.gov",office:"501 Washington Ave, Montgomery AL 36130"}},
  ]},
  {level:"County",color:"#374151",officials:[
    {name:"Rex Vaughn",title:"Madison County Commission Chairman (At-Large)",district:"At-Large — all of Madison County",party:"Republican",since:"Mar 2026",termEnds:"TBD",avatar:"RV",salary:"~$78,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Recently appointed — financial disclosure under review",residency:"Madison County",criminal:"No record found",affiliation:"Republican; appointed March 2026 after previous chairman left",topDonors:[["Under research","TBD"]],bio:"Appointed March 2026 to fill vacancy. Controls county budget and service delivery for all unincorporated areas — including Harvest, Toney, Monrovia, and Meridianville which have no city government. First major decisions being watched.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Violet Edwards",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville",party:"Democrat",since:"Jan 2025",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"First term — financial disclosure pending",residency:"North Huntsville",criminal:"No record found",affiliation:"Democrat; first Black woman elected to Madison County Commission",topDonors:[["Community fundraising","~$28,000"]],bio:"First Black woman elected to the Madison County Commission. Represents north Huntsville areas. Her district includes communities that have documented road maintenance inequities vs south Huntsville. First term — her votes on county budget and road maintenance allocation are critical.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Kevin Turner",title:"Madison County Sheriff",district:"Madison County",party:"Republican",since:"Jan 2019",termEnds:"Jan 2027",avatar:"KT",salary:"~$95,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Career law enforcement; income from public salary",residency:"Madison County",criminal:"No criminal record",affiliation:"Republican; career law enforcement; endorsed by bail bond industry",topDonors:[["Law enforcement PACs","$62,000"],["Bail bond industry","$24,000"]],bio:"61% of Madison County Jail population is pretrial — not convicted of anything. County earns ~$200,000/year in Securus/ViaPath phone commissions while families pay $0.21/min to call incarcerated loved ones. Received $24,000 from bail bond industry and opposes bail reform. Controls $2.3M civil forfeiture fund with no public accounting.",votes:[{bill:"Bail reform",vote:"Opposed",impact:"61% of jail is pretrial — held because they cannot afford bail"},{bill:"Securus contract renewal",vote:"Maintained",impact:"County earns $200k/yr commissions while families pay $0.21/min"}],contact:{phone:"(256) 722-7181",web:"https://www.madisoncountysheriff.org",office:"815 Wheeler Ave, Huntsville AL 35801"}},
  ]},
  {level:"Huntsville",color:"#1e3a5f",officials:[
    {name:"Tommy Battle",title:"Mayor of Huntsville",district:"City of Huntsville — 5th term",party:"Republican",since:"Nov 2008",termEnds:"Nov 2028",avatar:"TB",salary:"$131,500/yr — taxpayer funded",netWorth:"Est. $2.8M–$6.4M",netWorthPre:"Est. $1.2M before mayor",netWorthHow:"Business background; real estate; investment portfolio grown during tenure; salary + benefits for 16+ years",residency:"Huntsville, AL — south Huntsville",criminal:"No criminal record",affiliation:"Republican; former businessman; endorsed by Huntsville/Madison County Chamb...",topDonors:[["Real estate developers","$380,000"],["Construction companies","$210,000"],["HHHS Foundation","$45,000"],["Defense/aerospace contractors","$88,000"]],bio:"Longest-serving Huntsville mayor. Under his 16-year tenure: north Huntsville roads average PCI 41 vs south Huntsville PCI 72 (same tax rate). Zero civilian police review board proposals. IDB has granted $127M+ in corporate tax abatements with no performance audit requirement. Never applied for federal Pre-K grants. 3 of 8 anti-camping ordinance sweeps occurred adjacent to active developer projects. Received $380,000 from real estate developers — the same entities that benefit from IDB abatements and annexation decisions.",votes:[{bill:"Civilian police review board",vote:"Never proposed in 16 years",impact:"HPD investigates its own conduct with no civilian oversight"},{bill:"IDB abatement performance audits",vote:"Never required",impact:"$127M+ granted · no public verification of job/wage promises"},{bill:"Anti-camping ordinance",vote:"Supported",impact:"3 of 8 sweeps near active developer projects"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/mayors-office/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Michelle Watkins",title:"City Council — District 1",district:"District 1 — North Huntsville",party:"Democrat",since:"Nov 2024",termEnds:"Nov 2028",avatar:"MW",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"First term",netWorthHow:"First term — limited disclosure period",residency:"North Huntsville — in district",criminal:"No record found",affiliation:"Democrat; first Black woman on Huntsville City Council; community advocate ...",topDonors:[["Community fundraising","~$42,000"]],bio:"First Black woman elected to Huntsville City Council. Elected September 2024. Voted NO on the January 2025 394-acre annexation — the only no vote — citing school overcrowding. Her district includes the roads with PCI 41 vs south Huntsville's PCI 72. First term — her votes are closely watched as the only progressive voice on the council.",votes:[{bill:"394-acre annexation (Jan 2025)",vote:"NO — only no vote",impact:"'Breaking schools at the seam' — schools cannot absorb growth"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Jennie Robinson",title:"City Council — District 3 (Council President)",district:"District 3 — South/Central Huntsville",party:"Republican",since:"Nov 2016",termEnds:"Nov 2028",avatar:"JR",salary:"~$20,000/yr — part-time council",netWorth:"Est. $600k–$1.8M",netWorthPre:"Est. $500k before council",netWorthHow:"Career educator; professor; real estate; public salary",residency:"South Huntsville — district 3",criminal:"No criminal record",affiliation:"Republican; former educator; Council President since Nov 2025",topDonors:[["South Huntsville business","$52,000"],["Real estate interests","$28,000"]],bio:"Council President. Has voted for budgets that have produced the documented PCI 41 vs 72 road disparity between north and south Huntsville. Facilitated all 2025 annexations as Council President. Noted that Huntsville now compares in land mass to Chicago.",votes:[{bill:"All 2025 annexations",vote:"Supported",impact:"2,000+ acres annexed while north Huntsville roads remain PCI 41"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"David Little",title:"City Council — District 2",district:"District 2 — West Huntsville/Downtown",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"DL",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background; financial disclosure under review",residency:"West Huntsville",criminal:"No record found",affiliation:"Republican; business community connections",topDonors:[["Local business","~$35,000"]],bio:"Represents west Huntsville and downtown. District includes portions that have seen MidCity development. Voted for all major annexations and IDB abatements.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Bill Kling Jr.",title:"City Council — District 4",district:"District 4 — Southeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"BK",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background",residency:"Southeast Huntsville",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","~$30,000"]],bio:"Introduced the December 2025 proposal to annex 680 additional acres — stating landowners want to access Huntsville's school system and utilities. Supportive of continued city growth and annexation.",votes:[{bill:"680-acre annexation (Dec 2025)",vote:"Introduced",impact:"Second-largest annexation of 2025"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"John Meredith",title:"City Council — District 5",district:"District 5 — Northeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"JM",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Business background",residency:"Northeast Huntsville",criminal:"No record found",affiliation:"Republican; technology/AI interests",topDonors:[["Business community","~$28,000"]],bio:"Focused on technology and infrastructure issues. Has proposed AI-based railroad crossing alerts for his district. Voted for all major annexations.",votes:[],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
  ]},
];

// ─── OFFICIALS PAGE (full v8-style with modal) ─────────────────

function OfficialsPage(){
  const[filter,setFilter]=useState("All");
  const[selected,setSelected]=useState(null);
  const[tab,setTab]=useState("bio");
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);

  async function investigate(off){
    setLd(true);
    try{
      const x=await callAI(`Investigate ${off.name} (${off.title}). Salary: ${off.salary}. Net worth: ${off.netWorth} (before office: ${off.netWorthPre}). Top donors: ${off.topDonors.map(d=>d[0]+' '+d[1]).join(', ')}. Residency: ${off.residency}. Criminal record: ${off.criminal}. Key record: ${off.bio.substring(0,300)}. THE FACTS, WHO BENEFITS, WHO GETS HURT, THE CONNECTIONS, WHAT CAN CHANGE.`);
      setR(x);
    }catch(e){setR("Investigation unavailable.");}
    setLd(false);
  }

  const levels=["All","Federal","State","County","Huntsville"];
  const filtered=filter==="All"?OFFICIALS:OFFICIALS.filter(g=>g.level===filter);

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Every elected official with power over Madison County. Net worth before and after office, salary, top donors, voting record, criminal history, and residency — all from public records. Click any card to investigate.</p>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {levels.map(l=><button key={l} onClick={()=>setFilter(l)} style={{padding:"6px 14px",borderRadius:12,border:"1px solid #e0d8cc",background:filter===l?"#1e3a5f":"#fff",color:filter===l?"#c9a84c":"#6b7280",fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
      </div>
      {filtered.map((group,gi)=>(
        <div key={gi} style={{marginBottom:20}}>
          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:2,color:group.color,marginBottom:10,textTransform:"uppercase"}}>{group.level} OFFICIALS</div>
          {group.officials.map((off,oi)=>(
            <div key={oi} onClick={()=>{setSelected(off);setTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${group.color}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:group.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>{off.avatar}</div>
                  <div><div style={{fontSize:13.5,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div><div style={{fontSize:11,color:"#6b7280",marginTop:1}}>{off.title}</div></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#dc2626"}}>{off.netWorth}</div>
                  <div style={{fontSize:9,color:"#6b7280"}}>net worth est.</div>
                </div>
              </div>
              <div style={{fontSize:11.5,color:"#374151",marginTop:8,lineHeight:1.5}}>{off.bio.substring(0,160)}...</div>
              <div style={{display:"flex",gap:12,marginTop:8,fontSize:10,color:"#6b7280"}}>
                <span>💰 {off.salary.split("—")[0].trim()}</span>
                <span>🏠 {off.residency}</span>
                <span style={{color:off.criminal==="No criminal record"||off.criminal==="No record found"?"#16a34a":"#dc2626"}}>⚖ {off.criminal}</span>
              </div>
              <div style={{fontSize:10,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Click to full investigation →</div>
            </div>
          ))}
        </div>
      ))}
      {selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(30,58,95,.6)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setR(null);}}}>
          <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:680,border:`3px solid ${selected.color||"#1e3a5f"}`,boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden",marginTop:20}}>
            <div style={{background:selected.color||"#1e3a5f",padding:"18px 20px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",flexShrink:0}}>{selected.avatar}</div>
              <div style={{flex:1}}><div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{selected.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.8)",marginTop:2}}>{selected.title} · {selected.district}</div><div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>{[`Since ${selected.since}`,`Ends ${selected.termEnds}`,selected.party].map((t,i)=><span key={i} style={{fontSize:9,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.12)",padding:"2px 7px",borderRadius:2}}>{t}</span>)}</div></div>
              <button onClick={()=>{setSelected(null);setR(null);}} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:15,flexShrink:0}}>×</button>
            </div>
            <div style={{background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"10px 20px",display:"flex",gap:16,flexWrap:"wrap"}}>
              <div><div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:2}}>NET WORTH NOW</div><div style={{fontSize:16,fontWeight:900,color:"#b8860b"}}>{selected.netWorth}</div></div>
              <div><div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:2}}>BEFORE OFFICE</div><div style={{fontSize:16,fontWeight:900,color:"#6b7280"}}>{selected.netWorthPre}</div></div>
              <div style={{flex:1}}><div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:2}}>HOW THEY BUILT IT</div><div style={{fontSize:11,color:"#4a3800",lineHeight:1.4}}>{selected.netWorthHow}</div></div>
              <div><div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:2}}>SALARY</div><div style={{fontSize:11,fontWeight:700,color:"#1e3a5f"}}>{selected.salary}</div></div>
            </div>
            <div style={{background:"#f8f6f2",borderBottom:"1px solid #e0d8cc",padding:"8px 20px",display:"flex",gap:16,flexWrap:"wrap",fontSize:11}}>
              <span><strong>Residency:</strong> {selected.residency}</span>
              <span><strong>Criminal:</strong> <span style={{color:selected.criminal==="No criminal record"||selected.criminal==="No record found"?"#16a34a":"#dc2626"}}>{selected.criminal}</span></span>
            </div>
            <div style={{display:"flex",borderBottom:"1px solid #e0d8cc",background:"#f8f6f2"}}>
              {["bio","record","donors","votes","contact"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px 4px",border:"none",cursor:"pointer",fontSize:10,fontWeight:tab===t?700:500,color:tab===t?(selected.color||"#1e3a5f"):"#6b7280",background:tab===t?"#fff":"#f8f6f2",borderBottom:tab===t?`2px solid ${selected.color||"#1e3a5f"}`:"2px solid transparent",fontFamily:"inherit"}}>{t==="bio"?"Profile":t==="record"?"On Record":t==="donors"?"Donors":t==="votes"?"Votes":"Contact"}</button>)}
            </div>
            <div style={{padding:"14px 20px",maxHeight:360,overflowY:"auto"}}>
              {tab==="bio"&&<div><p style={{fontSize:12.5,lineHeight:1.8,color:"#374151",marginBottom:12}}>{selected.bio}</p>{!r?<button className="btn btn-gold btn-full" onClick={()=>investigate(selected)} disabled={ld}>{ld?<><span className="spin"/>Investigating...</>:"🔍 Full AI Investigation"}</button>:<div className="ai-panel"><div className="ai-panel-label">AI INVESTIGATION</div><AiResult text={r}/><button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:11,marginTop:8}}>Clear</button></div>}</div>}
              {tab==="donors"&&<div><div style={{fontSize:8.5,color:"#6b7280",letterSpacing:1,marginBottom:10,fontWeight:700}}>TOP DONORS — PUBLIC RECORD</div>{selected.topDonors.map(([donor,amt],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 11px",marginBottom:5,background:i===0?"#fef2f2":"#f8f6f2",borderRadius:4,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`}}><span style={{fontSize:11.5,color:"#374151"}}>{donor}</span><span style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>{amt}</span></div>)}<a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:11,marginTop:8}}>Search AL Campaign Finance →</button></a></div>}
              {tab==="votes"&&<div>{selected.votes.length===0?<p style={{color:"#6b7280",fontSize:12}}>Voting record under research.</p>:selected.votes.map((v,i)=><div key={i} style={{background:"#f8f6f2",borderRadius:4,padding:"9px 11px",marginBottom:7,borderLeft:`3px solid ${v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("NO")?"#dc2626":"#16a34a"}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}><span style={{fontSize:11.5,fontWeight:700,color:"#1e3a5f",flex:1}}>{v.bill}</span><span style={{fontSize:9,fontWeight:700,color:v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("NO")?"#dc2626":"#16a34a",padding:"2px 7px",background:"rgba(0,0,0,.04)",borderRadius:3,flexShrink:0}}>{v.vote}</span></div><div style={{fontSize:11,color:"#6b7280"}}>{v.impact}</div></div>)}</div>}
              {tab==="contact"&&<div>{[["Phone",selected.contact.phone],["Office",selected.contact.office]].map(([l,v],i)=><div key={i} style={{padding:"8px 11px",background:"#f8f6f2",borderRadius:4,marginBottom:7}}><div style={{fontSize:8,color:"#6b7280",letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:12.5,fontWeight:600,color:"#1e3a5f"}}>{v}</div></div>)}<a href={selected.contact.web} target="_blank" rel="noreferrer"><button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button></a></div>}
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
    {label:"ECONOMIC INVESTIGATIONS",color:C.red,items:[
      {id:"equity",icon:"⚖",label:"North vs South Huntsville",sub:"Roads · Schools · Policing · Service gap"},
      {id:"utilities",icon:"💧",label:"Power, Water & Utilities",sub:"HU · TVA · Madison · Triana · PFAS · rates"},
      {id:"health",icon:"✚",label:"Health System Investigation",sub:"HHHS monopoly · Medicaid gap · Insurance"},
      {id:"money",icon:"💰",label:"Follow the Money",sub:"IDB abatements · CEO pay · Donor → Policy"},
      {id:"workers",icon:"👷",label:"Workers & Child Care",sub:"$7.25/hr wage ban · $14,400/yr infant care"},
      {id:"flights",icon:"✈",label:"Airport & Dynamic Pricing",sub:"Why flights cost more · algorithmic pricing"},
    ]},
    {label:"POWER & ACCOUNTABILITY",color:C.navy,items:[
      {id:"officials",icon:"▣",label:"Officials & Elections",sub:"All officials · donors · votes · 2026 races"},
      {id:"boards",icon:"🏛",label:"Boards & Directors",sub:"HU · IDB · HHHS · interlocking conflicts"},
      {id:"schools",icon:"▦",label:"Schools & Boards",sub:"3 districts · CHOOSE Act · funding equity"},
      {id:"voting",icon:"🗳",label:"Voting Power & Gerrymandering",sub:"VRA violation · 37k unregistered · 200-vote races"},
      {id:"disinfo",icon:"🧠",label:"Disinformation & Algorithms",sub:"False claims · RealPage rents · who benefits"},
    ]},
    {label:"JUSTICE & SAFETY",color:C.orange,items:[
      {id:"sentencing",icon:"⚖",label:"Sentencing & Incarceration",sub:"Kratom felony · school zone add-on · private prisons"},
      {id:"policing",icon:"🚔",label:"Police & Sheriff",sub:"No civilian review · 61% pretrial · Securus"},
      {id:"surveillance",icon:"📡",label:"Surveillance & Privacy",sub:"47 ALPRs · no AL privacy law · no oversight"},
      {id:"immigration",icon:"🗂",label:"Immigration Facts",sub:"Verified statutes · who benefits from fear"},
    ]},
    {label:"COMMUNITY",color:C.green,items:[
      {id:"unhoused",icon:"🏠",label:"Unhoused Residents",sub:"What it means · sweeps near developers · 7k gap"},
      {id:"transit",icon:"⬡",label:"Transit & Roads",sub:"No Sunday service · PCI 41 north · equity gap"},
      {id:"environment",icon:"🌿",label:"Environment, Air & Water",sub:"Redstone PFAS · Triana Superfund · ADEM"},
      {id:"annexation",icon:"🗺",label:"Annexations & Land Use",sub:"2,000+ acres in 2025 · voting patterns · who benefits"},
      {id:"business",icon:"🏪",label:"Business Location Equity",sub:"MidCity booms · north Huntsville waits · road gaps"},
      {id:"groceries",icon:"🛒",label:"Grocery Tax & Food Costs",sub:"9% combined · 37 states have none · tampon tax"},
      {id:"contractors",icon:"🏭",label:"Gov. Contractors & Taxes",sub:"$20B federal contracts · IDB abatements · tax gap"},
      {id:"schoollunch",icon:"🍽",label:"School Lunches",sub:"AL refused free summer meals · who profits from contracts"},
      {id:"proposals",icon:"📐",label:"Policy Proposals",sub:"What could change today vs needs 2026 elections"},
      {id:"action",icon:"▶",label:"Take Action Center",sub:"FOIA · complaints · register · run for office"},
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
        <div style={{fontSize:9,color:"#6b7280",letterSpacing:1.5,marginBottom:10,fontWeight:700}}>⏱ LIVE SINCE YOU OPENED THIS PAGE — HUNTSVILLE HOSPITAL</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:9,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:4}}>HHHS CEO EARNINGS</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#dc2626",lineHeight:1}}>${(ceoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>~$1,490/hr · $3.1M/yr · nonprofit</div>
          </div>
          <div>
            <div style={{fontSize:9,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:4}}>CNA EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#6b7280",lineHeight:1}}>${(cnaPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>$15/hr starting · may qualify for SNAP</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:9,color:"#7f1d1d",fontWeight:700,letterSpacing:1,marginBottom:4}}>TVA CEO EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:900,color:"#7f1d1d",lineHeight:1}}>${(tvaCeoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>$8.1M/yr · federal corporation · zero shareholder vote</div>
          </div>
          <div>
            <div style={{fontSize:9,color:"#1e3a5f",fontWeight:700,letterSpacing:1,marginBottom:4}}>HU CEO EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:900,color:"#1e3a5f",lineHeight:1}}>${(huCeoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Est. $380k–$480k/yr · city-owned utility · appointed board</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:9,color:"#16a34a",fontWeight:700,letterSpacing:1,marginBottom:4}}>AVG HU WORKER EARNINGS (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:900,color:"#16a34a",lineHeight:1}}>${(huWorkerPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>~$52k/yr avg · reads your meter · maintains your lines</div>
          </div>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{fontSize:11,color:"#7f1d1d",lineHeight:1.6}}>None of these organizations require your vote. All affect your monthly bill, your taxes, or both. The CEO-to-worker pay ratio at HHHS is approximately <strong>207:1</strong>.</div>
          </div>
        </div>
        <div style={{background:"#fef2f2",borderRadius:4,padding:"8px 12px",fontSize:11.5,color:"#7f1d1d"}}>
          Both work in Huntsville. The CEO works at a nonprofit that paid <strong>$0 in income tax</strong> on $2.4B in revenue. The CNA may qualify for SNAP. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("health")}>Full investigation →</span>
        </div>
      </div>

      {/* Active alerts */}
      <div style={{fontSize:9,color:"#6b7280",letterSpacing:1.5,marginBottom:8,fontWeight:700}}>ACTIVE INVESTIGATIONS & ALERTS</div>
      <div style={{marginBottom:20}}>
        {alerts.map((a,i)=>(
          <div key={i} onClick={()=>go(a.page)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:6,background:"#fff",border:"1px solid #e0d8cc",borderLeft:`3px solid ${a.color}`,borderRadius:"0 4px 4px 0",cursor:"pointer"}}>
            <span style={{fontSize:9,fontWeight:700,color:a.color,background:`${a.color}18`,padding:"1px 6px",borderRadius:8,flexShrink:0,minWidth:60,textAlign:"center"}}>{a.level}</span>
            <span style={{fontSize:12,color:"#374151",flex:1}}>{a.text}</span>
            <span style={{fontSize:11,color:"#6b7280",flexShrink:0}}>→</span>
          </div>
        ))}
      </div>

      <div className="alert-banner">
        <div className="alert-label">2026 IS THE MOST IMPORTANT ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
        <div className="alert-text">Governor's race is an open seat (Ivey term-limited). All three federal races on the ballot. Sheriff, three city council seats, three HCS school board seats. 37,000 eligible residents are not registered to vote. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("officials")}>See all 2026 races →</span></div>
      </div>
      {GROUPS.map((g,gi)=>(
        <div key={gi} style={{marginBottom:24}}>
          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:2,color:g.color,marginBottom:10,textTransform:"uppercase"}}>{g.label}</div>
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
    if(page==="dashboard") return <Dashboard go={go}/>;
    if(page==="schools")   return <SchoolsPage/>;
    if(page==="officials") return <OfficialsPage/>;
    if(page==="utilities") return <UtilitiesPage/>;
    if(page==="boards")    return <BoardsPage/>;
    if(PAGES[page])        return <InvestPage id={page}/>;
    return <Dashboard go={go}/>;
  }

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Mobile topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={()=>setSideOpen(true)}>☰</button>
          <div className="topbar-title">HUNTSVILLE CIVIC INVESTIGATOR</div>
        </div>
        {/* Overlay */}
        <div className={`overlay${sideOpen?" open":""}`} onClick={()=>setSideOpen(false)}/>
        {/* Sidebar */}
        <div className={`sidebar${sideOpen?" mobile-open":""}`}>
          <div className="sidebar-logo" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
            <h1>HUNTSVILLE CIVIC<br/>INVESTIGATOR</h1>
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
        <div className="main" ref={mainRef} style={{paddingTop:0}}>
          <div style={{background:"#1e3a5f",padding:"5px 0",overflow:"hidden",flexShrink:0}}>
            <div style={{display:"flex",gap:0,animation:"ticker 40s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — AL delegation has introduced zero oversight bills","✚ HHHS CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers — no public vote held","💧 Triana water shows PFAS above EWG health guidelines","🏠 North Huntsville road PCI 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states"].map((t,i)=>(
                <span key={i} style={{fontSize:10,color:"rgba(255,255,255,.65)",padding:"0 28px"}}><span style={{color:"#c9a84c",marginRight:6}}>◈</span>{t}</span>
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
}
