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
    return d.result||d.error||"Analysis unavailable.";
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
  {id:"equity",icon:"⚖",label:"The Two Huntsvilles: Service Inequality"},
  {id:"utilities",icon:"💧",label:"Power, Water & Utilities"},
  {id:"health",icon:"✚",label:"Health System"},
  {id:"money",icon:"💰",label:"Follow the Money"},
  {id:"workers",icon:"👷",label:"Workers & Child Care"},
  {id:"flights",icon:"✈",label:"Pricing Power & Air Travel"},
  {group:"POWER"},
  {id:"officials",icon:"▣",label:"Officials & Elections"},
  {id:"boards",icon:"🏛",label:"Boards, Directors & Schools"},
  {id:"voting",icon:"🗳",label:"Voting Power"},
  {id:"disinfo",icon:"🧠",label:"Disinformation"},
  {group:"JUSTICE"},
  {id:"sentencing",icon:"⚖",label:"Criminal Justice: Courts, Jails & Prisons"},
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
  equity:{icon:"⚖",title:"The Two Huntsvilles:",subtitle:"Service & Spending Inequality",tag:"tag-red",sub:"Roads PCI 41 north vs 72 south. Same taxes. $847/pupil school gap. 3.7× more police contacts per capita north. Who ...",
    stats:[["N.Hsv Road PCI","41","Poor — needs reconstruction",C.red],["S.Hsv Road PCI","72","Good — same tax rate",C.green],["School Funding Gap","$847/pupil","Less in lower-income HCS schools",C.orange],["Battle Developer Donors","$380k","From those who benefit from status quo",C.red]],
    facts:[{k:"red",label:"THE DOCUMENTED INEQUITY",lc:C.red,tc:"#7f1d1d",text:"North Huntsville residents pay identical city taxes as south Huntsville and receive measurably inferior roads, fewer services, and higher police contact rates. Over the past decade approximately 68% of capital road ..."}],
    prompt:"Investigate the documented equity gap between north and south Huntsville — roads PCI 41 vs 72, $847/pupil school gap, 3.7x police contact rate, capital spending percentages. Who benefits from maintaining this disparity? Trace Mayor Battle $380k real estate developer donations to specific spending decisions. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  utilities:{icon:"💧",title:"Power, Water",subtitle:"& Utilities",tag:"tag-blue",sub:"HU + TVA hit ratepayers with ~10%+ electric increase in one year. Triana water shows PFAS above health guidelines. ...",
    stats:[["TVA 2024 Rate Hike","5.25%","Largest in 16 years — passed to all HU customers",C.red],["HU Rate Hike","5.1%","Jan + Oct 2025 — on top of TVA hike",C.red],["Triana PFOS","Above EWG","Health guideline exceeded in town water",C.red],["TVA CEO Pay","$8.1M","Jeff Lyash 2023 — no shareholder vote",C.orange]],
    facts:[{k:"red",label:"THE DOUBLE MARKUP PROBLEM",lc:C.red,tc:"#7f1d1d",text:"TVA generates power and sells wholesale to Huntsville Utilities. HU marks it up and delivers to your home. Two separate entities adding costs — neither directly elected. Combined 2024-2025 impact: roughly 10%+ on yo..."},{k:"gold",label:"TRIANA WATER — THE PFAS PROBLEM",lc:"#b8860b",tc:"#78350f",text:"EWG data shows PFOS (a PFAS forever chemical linked to cancer) detected above EWG health guidelines in Triana Water Works. Triana remains on the EPA Superfund list due to Redstone Arsenal/Olin Corporation DDT contam..."}],
    prompt:"Investigate Madison County utilities. TVA CEO $8.1M, 5.25% rate hike 2024 largest in 16 years. HU added 5.1% on top. Alabama delegation collected $1.4M+ from energy PACs and introduced zero TVA oversight bills. Triana Water Works PFOS above EWG health guidelines, EPA Superfund legacy. Every utility board appointed not elected. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  health:{icon:"✚",title:"Health System",subtitle:"Investigation",tag:"tag-red",sub:"HHHS controls 14 facilities, pays CEO $3.1M, claims $63M/yr in tax exemptions with a self-appointed board. 295,000 ...",
    stats:[["HHHS CEO Pay","$3.1M","Self-appointed nonprofit board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Medicaid Gap","295,000","Uninsured — federal pays 90% and AL refuses",C.red],["ZIP Code Gap","$1,020/yr","North vs south Huntsville same driver",C.red]],
    facts:[{k:"red",label:"THE NONPROFIT PARADOX",lc:C.red,tc:"#7f1d1d",text:"HHHS pays zero income tax, zero state tax, minimal property tax. Claims $63M/yr in exemptions. In exchange it must provide community benefit. Yet it pays CEO $3.1M, starts CNAs at $14.50/hr (qualifying for SNAP), an..."},{k:"gold",label:"MEDICAID REFUSAL — THE DONOR CONNECTION",lc:"#b8860b",tc:"#78350f",text:"295,000 Alabamians — including ~47,000 in Madison County — are uninsured in the Medicaid coverage gap. Federal government pays 90% of expansion cost. Alabama refuses. Gov. Ivey received $420,000 from health insuranc..."}],
    prompt:"Investigate the Madison County health system as one connected crisis — HHHS $2.4B nonprofit monopoly with self-appointed board, CEO $3.1M vs CNAs $14.50/hr qualifying for SNAP, $63M tax exemption, 295,000 Alabamians uninsured in Medicaid gap including 47,000 in Madison County, Ivey $420k insurance PACs vs Medicaid refusal, north Huntsville ZIP code insurance premium $1,020/yr more than south. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  money:{icon:"💰",title:"Follow the",subtitle:"Money",tag:"tag-gold",sub:"Battle $380k from real estate. Ivey $420k from insurance. Strong $284k from defense. Orr $67k from BCA and private ...",
    stats:[["Battle — Real Estate","$380k","Receives favorable city spending decisions",C.red],["Ivey — Insurance","$420k","Refused Medicaid for 295,000 Alabamians",C.red],["Strong — Defense","$284k","Zero TVA oversight bills introduced",C.red],["Orr — BCA + Prisons","$67k","Banned wages, blocked sentencing reform",C.orange]],
    facts:[{k:"red",label:"THE DOCUMENTED PATTERN",lc:C.red,tc:"#7f1d1d",text:"In Madison County: the official controlling city spending received $380k from real estate developers — city spending favors areas where they operate. The Governor who refused Medicaid received $420k from insurance c..."},{k:"gold",label:"CEO PAY CLOCKS",lc:"#b8860b",tc:"#78350f",text:"HHHS CEO earns approximately $1,490/hour. TVA CEO earns approximately $2,600/hour. While you read this, these executives at publicly-subsidized organizations are earning more per hour than most Madison County reside..."}],
    prompt:"Investigate the full money flow in Madison County — trace every major donor connection to a specific policy outcome. Battle $380k real estate → city spending patterns. Ivey $420k insurance → Medicaid refusal. Strong $284k defense → zero TVA bills. Orr $45k BCA → SB 88 wage ban + $22k private prisons → blocking sentencing reform. HHHS CEO $3.1M vs CNA $14.50/hr. IDB $127M+ abatements no performance audit. All from public records at FEC.gov and fcpa.alabama.gov. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  workers:{icon:"👷",title:"Workers Rights &",subtitle:"Child Care",tag:"tag-orange",sub:"$7.25/hr unchanged since 2009. Alabama banned cities from raising it. $14,400/yr for infant care — more than UAH tu...",
    stats:[["Min Wage AL","$7.25/hr","Unchanged since 2009 — AL banned city increases",C.red],["Infant Care Madison Co","$14,400/yr","26% of median income before rent or food",C.red],["Pre-K Access AL","Bottom 10","States with universal pre-K: 7 states fully fund it",C.red],["HHHS CEO vs CNA","207:1","CEO-to-worker pay ratio at nonprofit",C.red]],
    facts:[{k:"red",label:"THE WAGE SUPPRESSION SYSTEM",lc:C.red,tc:"#7f1d1d",text:"In 2023 Arthur Orr sponsored SB 88 — banning Alabama cities from raising the minimum wage above the federal $7.25/hr floor. Huntsville cannot raise wages for its own workers. Madison cannot. Every Alabama city is lo..."},{k:"gold",label:"CHILD CARE: WHAT OTHER STATES HAVE DONE",lc:"#b8860b",tc:"#78350f",text:"Washington DC: publicly funded pre-K for all children from age 3. Vermont: Child Care Financial Assistance Program covers full cost for low-income families. Connecticut: Care 4 Kids subsidizes care from 6 weeks old...."},{k:"blue",label:"WORKERS RIGHTS — WHAT ALABAMA BLOCKS",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama has no state OSHA enforcement program — relies entirely on federal OSHA which is chronically understaffed. Alabama has no paid family leave law. No state earned sick leave requirement. No state EITC (Earned ..."}],
    prompt:"Investigate the connected crisis of wage suppression, child care costs, and workers rights in Madison County. THE FACTS: SB 88 (Orr, BCA $45k) banned city wage increases — Huntsville cannot raise wages. $14,400/yr infant care exceeds UAH tuition. Alabama ranked bottom 10 pre-K access — compare to Georgia (universal pre-K since 1995), Vermont (full subsidy from 6 weeks), DC (universal pre-K 3+), Connecticut, California. Alabama: no EITC, no paid leave, $275/week max unemployment for 14 weeks, no state OSHA enforcement. Strong voted against BBB child care 7% income cap. HHHS CEO $3.1M vs CNA $14.50/hr qualifying for SNAP. WHO BENEFITS: large employers (cheap labor), private child care companies (no competition from public programs), officials receiving BCA donations. WHO GETS HURT: working parents especially mothers, low-income families, CNA workers. THE CONNECTIONS: Orr $45k BCA, Strong $284k defense PACs vs BBB vote, Ivey refused Summer EBT ($60M free federal money). WHAT CAN CHANGE: repeal SB 88, state pre-K program, child care subsidy, state EITC."},

  flights:{icon:"✈",title:"Airport &",subtitle:"Dynamic Pricing",tag:"tag-orange",sub:"HSV fares above average vs peer airports. RealPage algorithmic rent-setting is under DOJ antitrust investigation. Y...",
    stats:[["HSV Fares","Above avg","vs Nashville/Atlanta comparable distances",C.red],["RealPage DOJ","Antitrust suit","Coordinated rent-setting investigation",C.red],["Airline Competition","Low","Few carriers compete at HSV",C.orange],["Algo Pricing","Expanding","Grocers, rideshare, hotels all use it",C.orange]],
    facts:[{k:"red",label:"THE CAPTIVE MARKET PROBLEM",lc:C.red,tc:"#7f1d1d",text:"When airlines face limited competition at an airport, they charge more. Huntsville International serves a major aerospace metro but has fewer non-stop routes and higher average fares than comparable cities. The econ..."},{k:"gold",label:"ALGORITHMIC PRICING — THE INVISIBLE TAX",lc:"#b8860b",tc:"#78350f",text:"RealPage software is used by landlords to set rents using shared market data. The DOJ sued RealPage for antitrust violations — coordinating prices without a formal cartel agreement. If your landlord uses RealPage, y..."}],
    prompt:"Investigate Huntsville airport pricing and algorithmic pricing affecting Madison County residents. Why do HSV flights cost more than peer airports? What is RealPage and how does algorithmic rent coordination work? Who are the major Madison County landlords using algorithmic pricing? What is the DOJ antitrust case status? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."},

  sentencing:{icon:"⚖",title:"Criminal Justice:",subtitle:"Courts, Jails & Prisons",tag:"tag-red",sub:"Kratom is a felony. Sitting in jail without conviction because you can't afford bail. Life for stealing a bicycle. Private prisons donate to officials who block reform.",
    stats:[["HFOA Life Without Parole","527+ people","Many for non-violent property crimes",C.red],["HFOA Racial Disparity","75% Black","Of those sentenced to die in prison under HFOA",C.red],["School Zone Add-On","Mandatory +5 yrs","Applies to almost all of north Huntsville",C.red],["Private Prison to Marshall","$45k","AG who has opposed every single reform",C.red]],
    facts:[{k:"red",label:"THE HABITUAL FELONY OFFENDER ACT — LIFE FOR A BICYCLE",lc:C.red,tc:"#7f1d1d",text:"Alabama's HFOA mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent property crimes. Documented cases: Johnny Holly got life without parole in 1980 for stealing a..."},{k:"orange",label:"LOW-LEVEL CRIMES — THE FULL PICTURE",lc:C.orange,tc:"#78350f",text:"Beyond HFOA: Kratom possession is a Class C felony — same as meth — legal in 43 states. Cannabis possession for 'personal use' is a misdemeanor but prior drug convictions escalate it to a felony. Marijuana within 3 ..."},{k:"gold",label:"WHO PROFITS FROM THESE LAWS",lc:"#b8860b",tc:"#78350f",text:"CoreCivic and GEO Group are paid per incarcerated person. Private probation companies charge supervision fees directly to the people they supervise — a system where profit depends on people staying in the system. AG..."}],
    prompt:"Investigate Alabama's full sentencing structure and its documented harms in Madison County. THE FACTS: Habitual Felony Offender Act — 527+ people serving life without parole for non-violent crimes, 75% Black, documented cases include life for stealing a toolbox and life for a $16 bicycle, Willie Simmons in prison since 1982 for a $9 theft who would get 20 years maximum today. School zone enhancement adds mandatory 5 years covering nearly all of north Huntsville due to school density but rarely triggers in south Huntsville — same law, same drug, different zip code. Kratom is a Class C felony in Alabama legal in 43 states. Private probation companies charge supervision fees creating a profit motive to keep people in the system. Drug paraphernalia possession with prior drug conviction is a Class B felony up to 20 years. 3.7x Black vs white drug arrest rate with same usage rates. Alabama prisons 181% capacity $17k per person per year. AG Marshall $45k private prison PACs, Orr $22k, both oppose all reform. WHO BENEFITS: CoreCivic, GEO Group, private probation companies, officials receiving their donations. WHO GETS HURT: Black residents of north Huntsville, people trapped in private probation debt cycles, families of the 500+ dying in prison for property crimes. THE CONNECTIONS: trace Marshall $45k private prison PACs to opposing bail reform, HFOA reform, probation reform. WHAT CAN CHANGE: HFOA retroactive review, end private probation, bail reform, kratom reclassification, school zone reform."},

  policing:{icon:"🚔",title:"Police &",subtitle:"Sheriff",tag:"tag-blue",sub:"No civilian review board in 16 years under Mayor Battle. 61% of Madison County Jail is pretrial. Sheriff Turner ear...",
    stats:[["Civilian Review Board","None","HPD investigates its own conduct",C.red],["Pretrial Detention","61%","Not convicted — held for no money",C.red],["N.Hsv Police Contacts","3.7×","More per capita than south Huntsville",C.red],["Securus Commission","~$200k/yr","County earns while families pay $0.21/min",C.orange]],
    facts:[{k:"red",label:"NO OVERSIGHT — 16 YEARS",lc:C.red,tc:"#7f1d1d",text:"Every comparable US city has some form of civilian police oversight. Huntsville has none. Mayor Battle has served 16 years and never proposed a civilian review board. The police union endorsed him. Officers can revi..."},{k:"gold",label:"THE SECURUS CONFLICT",lc:"#b8860b",tc:"#78350f",text:"Madison County earns approximately $200,000/year in commissions from Securus/ViaPath, the company families must pay to call their incarcerated loved ones at $0.21/minute. The Sheriff's office has a direct financial ..."}],
    prompt:"Investigate HPD oversight failures and Madison County Sheriff accountability. No civilian review in 16 years under Battle who has police union endorsement and law enforcement PAC donations. Officers review body cam before writing reports. 90-day auto-deletion. 3.7x police contact rate north vs south Huntsville. Sheriff Turner 61% pretrial detention, Securus $200k/yr commission conflict, $24k bail bond industry donations, opposes bail reform, $2.3M civil forfeiture fund no public accounting. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  surveillance:{icon:"📡",title:"Surveillance &",subtitle:"Privacy",tag:"tag-navy",sub:"47+ ALPRs tracking every vehicle. No civilian oversight. Alabama has no data privacy law. Law enforcement buys your...",
    stats:[["License Plate Readers","47+","Track every vehicle including innocent",C.red],["AL Privacy Law","None","No comprehensive state protection",C.red],["Civilian Oversight","Zero","No board reviews surveillance use",C.red],["Law Enforcement Buys","No warrant","Purchase commercial location data",C.orange]],
    facts:[{k:"red",label:"TRACKING WITHOUT ACCOUNTABILITY",lc:C.red,tc:"#7f1d1d",text:"Huntsville expanded surveillance — license plate readers, ShotSpotter, cameras — with minimal public debate and zero civilian oversight. License plate readers record every vehicle including people never suspected of..."},{k:"gold",label:"YOUR DATA SOLD WITHOUT CONSENT",lc:"#b8860b",tc:"#78350f",text:"Data brokers compile profiles on every adult: location, health searches, political views, finances. Law enforcement purchases this commercial data to bypass warrant requirements. Your phone tracks where you go — inc..."}],
    prompt:"Investigate Huntsville surveillance infrastructure and Alabama data privacy. ALPR network 47+ cameras, ShotSpotter contracts and false activation rates, no civilian oversight board, law enforcement commercial location data purchases bypassing warrants, no Alabama data privacy law. Who approved the contracts? Were they bid competitively? What data sharing occurs with federal agencies? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."},

  immigration_merged:{icon:"🗂",title:"Immigration",subtitle:"Facts",tag:"tag-navy",sub:"Federal law is clear: undocumented immigrants cannot vote (52 U.S.C. §20511) and cannot receive Medicaid (8 U.S.C. ...",
    stats:[["Undocumented Voting","Federal Crime","52 U.S.C. §20511 — up to 1 yr prison","#16a34a"],["Benefits Bar","Since 1996","8 U.S.C. §1611 — Medicaid/SNAP/ACA barred","#16a34a"],["Social Security Paid","$25.7B/yr","By undocumented workers who can never collect","#2563eb"],["AL Coverage Gap","295,000","US citizens uninsured — Britt has $310k insurance PAC",C.red]],
    facts:[{k:"green",label:"THE STATUTES ARE CLEAR",lc:"#16a34a",tc:"#14532d",text:"Federal law (52 U.S.C. §20511) makes it a federal crime for any non-citizen to vote. Federal law (8 U.S.C. §1611, in place since 1996) bars undocumented immigrants from Medicaid, Medicare, ACA, CHIP, and SNAP. These..."},{k:"red",label:"WHO BENEFITS FROM THE MISINFORMATION",lc:C.red,tc:"#7f1d1d",text:"295,000 Alabama citizens are uninsured because Alabama refused Medicaid expansion. Sen. Britt received $310,000 from health insurance PACs and has made false immigration benefit claims. When voters focus on immigrat..."}],
    prompt:"Investigate the Alabama immigration disinformation campaign and its connection to Medicaid refusal. THE FACTS: 8 USC 1611 (1996) bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, CHIP — 30-year federal law. 52 USC 20511 makes non-citizen voting a federal crime. Undocumented workers pay $25.7B/yr in Social Security they can never collect. Alabama politicians including Britt and Ball make repeated false claims about immigrant benefit access. Britt received $310k from health insurance industry PACs. 295,000 Alabamians are uninsured in the Medicaid coverage gap — the gap the false immigration narrative is used to justify. The insurance industry financially benefits when Medicaid is not expanded. RealPage algorithmic rent-setting is under DOJ antitrust investigation. WHO BENEFITS: insurance companies retaining customers, politicians who receive their donations, groups that profit from immigration fear as a political distraction. WHO GETS HURT: 295,000 uninsured Alabama citizens, Madison County renters paying algorithmically maximized rents. THE CONNECTIONS: trace Britt's $310k insurance PAC donations directly to her false immigration claims to Medicaid refusal to insurance company revenue. WHAT CAN CHANGE."},

  unhoused:{icon:"🏠",title:"Unhoused Residents &",subtitle:"Public Housing",tag:"tag-orange",
    sub:"Section 8 voucher waitlist CLOSED since 2020 — last opened for 7 days. 6-12 month wait for public housing. 7,000-un...",
    stats:[
      ["Section 8 Waitlist","CLOSED","Last open June 1-8, 2020 — 4+ years closed",C.red],
      ["Wait for Public Housing","6-12 months","Applications accepted at 200 Washington St NE",C.orange],
      ["HHA Vouchers Managed","2,047","For a metro area of 500,000+",C.red],
      ["Affordable Unit Gap","7,000+","For residents earning under $25k/yr",C.red]
    ],
    facts:[
      {k:"blue",label:"WHAT 'UNHOUSED' MEANS — AND WHO THESE PEOPLE ARE",lc:"#2563eb",tc:"#1e3a5f",text:"'Unhoused' means no stable housing — living in vehicles, tents, emergency shelters, or outside. These are Huntsville residents who lost housing due to job loss, medical debt, eviction, domestic violence, or a mental..."},
      {k:"red",label:"THE PUBLIC HOUSING SYSTEM — WHAT'S AVAILABLE AND WHAT THEY SAY",lc:C.red,tc:"#7f1d1d",text:"The Huntsville Housing Authority (HHA) manages 1,378 public housing units and 2,047 Housing Choice Vouchers (Section 8) for a metro area of 500,000+. The Section 8 waitlist has been CLOSED since June 8, 2020 — it wa..."},
      {k:"gold",label:"WHAT OFFICIALS SAID VS WHAT THEY DID",lc:"#b8860b",tc:"#78350f",text:"SAID: City spokesperson: 'The City of Huntsville is committed to supporting our most vulnerable residents by partnering with organizations that provide essential services.' DID: Passed Ordinance 23-089 criminalizing..."},
      {k:"green",label:"WHO IS LOBBYING AND WHO BENEFITS",lc:"#16a34a",tc:"#14532d",text:"Real estate developers benefit when: anti-camping ordinances clear land near their projects; IDB abatements remove their property tax burden without affordable housing requirements; the Section 8 waitlist stays clos..."}
    ],
    prompt:"Summarize all the public housing and unhoused data on this page and investigate the complete accountability picture: Section 8 waitlist closed since 2020, only 2,047 vouchers for 500k+ metro, 6-12 month public housing wait. Anti-camping Ordinance 23-089 passed before shelter expansion. 3 of 8 sweeps near developer projects. Battle $380k real estate donors, IDB zero affordable housing requirement. SPLC involvement. Who are the largest real estate developers receiving IDB abatements — what is their documented lobbying activity. What would it cost to implement a community benefit agreement requiring affordable units from abatement recipients. THE CONNECTIONS, WHAT CAN CHANGE."},

  transit:{icon:"⬡",title:"Transit, Roads &",subtitle:"Infrastructure",tag:"tag-orange",
    sub:"Orbit bus runs Mon-Sat only. No Sunday service. Routes end at 9pm. 9 routes covering 175 miles — in a city 222+ squ...",
    stats:[
      ["Orbit Coverage","9 routes","Mon-Fri 6am-9pm · Sat 7am-7pm · NO Sunday",C.red],
      ["City Land Area","222+ sq miles","Larger than Philadelphia — 1/9th the population",C.orange],
      ["N.Hsv Road PCI","41 avg","Poor — requires reconstruction, not just patching",C.red],
      ["S.Hsv Road PCI","72 avg","Good — same city, same tax rate",C.green]
    ],
    facts:[
      {k:"red",label:"THE ORBIT SYSTEM — WHAT EXISTS AND WHAT'S MISSING",lc:C.red,tc:"#7f1d1d",text:"Huntsville's Orbit bus system: 9 routes, runs Monday-Friday 6am-9pm and Saturday 7am-7pm. NO Sunday service. Routes cover 175 miles of streets but in a city that now spans 222+ square miles and is geographically lar..."},
      {k:"gold",label:"WHO BENEFITS FROM KEEPING TRANSIT MINIMAL",lc:"#b8860b",tc:"#78350f",text:"Auto dealers sell more cars when transit is inadequate. Auto lenders collect more loan interest. Insurance companies collect more premiums. Real estate developers build car-dependent subdivisions that require two ca..."},
      {k:"red",label:"ROAD CONDITIONS — THE DOCUMENTED NORTH-SOUTH GAP",lc:C.red,tc:"#7f1d1d",text:"Pavement Condition Index (PCI) measures road quality: 0-25 Failed, 26-40 Serious, 41-55 Poor, 56-70 Fair, 71-85 Good, 86-100 Very Good. North Huntsville average: PCI 41 — at the very bottom of 'Poor,' just above the..."},
      {k:"blue",label:"BUSINESSES USE ROADS MORE — AND PAY LESS",lc:"#2563eb",tc:"#1e3a5f",text:"This is a national issue: heavy commercial trucks cause 99,000 times the road damage per vehicle of a car. Every Amazon delivery truck, every construction vehicle, every defense contractor shuttle on Huntsville's ro..."}
    ],
    prompt:"Summarize all the transit and roads data on this page and investigate: why does Huntsville have no Sunday transit service in a city this size? Who specifically has blocked transit expansion — what are the lobbying connections between the Business Council of Alabama, real estate developers, and transit policy decisions? What would Sunday service cost vs the economic benefit to workers? How does the north-south road PCI gap connect to capital spending decisions — what percentage of Huntsville's road budget has gone to north Huntsville vs south Huntsville over the past decade? What are peer cities doing — Nashville, Chattanooga, Knoxville transit systems compared to Huntsville. THE CONNECTIONS, WHAT CAN CHANGE."},

  environment:{icon:"🌿",title:"Environment,",subtitle:"Air & Water",tag:"tag-green",sub:"Redstone Arsenal PFAS contamination. Triana still on EPA Superfund list. North Alabama pollution concentrates in lo...",
    stats:[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy",C.red],["Redstone PFAS","Documented","Groundwater contamination — extent undisclosed",C.red],["ADEM Enforcement","Weakest SE","vs comparable state agencies",C.orange],["Ivey Energy PACs","$340k","Appoints ADEM leadership",C.red]],
    facts:[{k:"red",label:"PFAS — THE FOREVER CHEMICAL PROBLEM",lc:C.red,tc:"#7f1d1d",text:"PFAS from Redstone Arsenal contaminate soil and groundwater — linked to cancer, thyroid disease, and immune damage. Triana's water shows PFOS above EWG health guidelines. The communities closest to contamination — T..."},{k:"gold",label:"ENVIRONMENTAL RACISM — THE DOCUMENTED PATTERN",lc:"#b8860b",tc:"#78350f",text:"Industrial facilities and contamination concentrate in lower-income, higher-proportion-Black communities. North Huntsville and Triana face disproportionate environmental burdens compared to south Huntsville and Madi..."}],
    prompt:"Investigate environmental contamination and justice in Madison County. Redstone Arsenal PFAS groundwater contamination extent and disclosure status. Triana Superfund PFOS above EWG guidelines. ADEM chronic understaffing and weak enforcement. Industrial facility concentration in north Huntsville and Triana vs south Huntsville. Strong voted against PFAS Notification Act, Britt against PFAS Action Act, Ivey $340k energy PACs appoints ADEM. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},

  annexation:{icon:"🗺",title:"Annexations &",subtitle:"Land Use",tag:"tag-red",
    sub:"Huntsville annexed 2,000+ acres in 2025 alone — now larger than Denver and Las Vegas by land area. New annexations ...",
    stats:[
      ["2025 Annexed","2,000+ acres","Surpassed Denver and Las Vegas in land mass",C.red],
      ["Jan 2025 Annex","394 acres","S of Hwy 20/I-65 — 2,500-4,000 new homes",C.navy],
      ["July 2025 Annex","1,000 acres","Into Marshall County — now 4 counties",C.orange],
      ["Dec 2025 Proposed","724 acres","2nd largest annexation of 2025",C.orange]
    ],
    facts:[
      {k:"red",label:"HOW ANNEXATION WORKS — AND WHO INITIATES IT",lc:C.red,tc:"#7f1d1d",text:"Alabama law has 4 methods of annexation. The most common: a landowner submits a petition (online form at HuntsvilleAL.gov) requesting their land be annexed into the city. Once received, the city reviews it internall..."},
      {k:"gold",label:"THE COUNCIL VOTE RECORD — WHO VOTED YES AND WHO VOTED NO",lc:"#b8860b",tc:"#78350f",text:"January 2025 (394 acres, S. Hwy 20/I-65): YES — Robinson (D3), Little (D2), Kling (D4), Meredith (D5). NO — Michelle Watkins (D1, north Huntsville). Watkins: 'My concern is, this is a lot of weight for a school syst..."},
      {k:"blue",label:"WHO BENEFITS AND WHO GETS THE SHORT END",lc:"#2563eb",tc:"#1e3a5f",text:"WHO BENEFITS: Landowners whose property value rises immediately upon annexation. Real estate developers who build 2,500-4,000 homes on newly annexed land. Areas that immediately receive city utilities, schools, and ..."},
      {k:"green",label:"THE VOTING PATTERN IMPACT",lc:"#16a34a",tc:"#14532d",text:"Every annexed area eventually becomes registered voters in new or existing council districts. New subdivisions in west and south Huntsville bring higher-income households that historically vote differently from nort..."}
    ],
    prompt:"Summarize all the annexation data on this page and investigate the full pattern: which developers petitioned for each major 2025 annexation, what are their campaign donation histories to Battle or council members, what infrastructure commitments were made, how do service delivery timelines compare between newly annexed areas and north Huntsville neighborhoods that have waited decades. Has the city ever commissioned an equity audit comparing service delivery speed by neighborhood age and income level? THE CONNECTIONS between Battle's $380k developer donors and annexation approval patterns. WHAT CAN CHANGE."},

  business:{icon:"🏪",title:"Business Location",subtitle:"Equity",tag:"tag-orange",sub:"MidCity, Bridge Street, and Research Park attract new retail and restaurants. North Huntsville — same tax base, sam...",
    stats:[["MidCity Investment","$350M+","Private development since 2018",C.navy],["North Hsv New Retail","Minimal","Compared to south and west corridors",C.red],["Road PCI Gap","41 vs 72","North vs south — same city, same taxes",C.red],["IDB Abatements","$127M+","No requirement to locate in underserved areas",C.orange]],
    facts:[{k:"red",label:"WHY BUSINESSES DON'T OPEN IN NORTH HUNTSVILLE",lc:C.red,tc:"#7f1d1d",text:"Business location decisions follow infrastructure quality, customer demographics, and incentive structures. North Huntsville roads average PCI 41 (Poor). South Huntsville averages PCI 72 (Good). Retailers follow roo..."},{k:"gold",label:"ROAD MAINTENANCE RESPONSE TIME — THE DOCUMENTED GAP",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents report road damage sitting unrepaired for months to years. South Huntsville and newly annexed areas receive faster response. This is documented in the PCI data — PCI 41 means roads are in ..."}],
    prompt:"Investigate why businesses locate in MidCity, Bridge Street, south Huntsville, and Hazel Green rather than north Huntsville. THE FACTS: MidCity $350M+ private investment since 2018, IDB grants zero property tax with no distressed area requirement, north Huntsville road PCI 41 vs south 72, road maintenance response time documented gap between north and south Huntsville, Restore Our Roads 1 and 2 focus on corridor roads not north Huntsville neighborhood streets, Mayor Battle acknowledged 10-12 year road project timeline to legislature. WHO BENEFITS: developers receiving IDB abatements in favorable areas, landowners in south and west Huntsville whose property values rise with new retail, Battle $380k developer donors. WHO GETS HURT: north Huntsville business owners and residents, people without cars needing nearby retail, property owners whose values stagnate. THE CONNECTIONS: IDB board appointed by Mayor Battle, no distressed area requirement ever proposed. WHAT CAN CHANGE: require IDB abatement recipients to locate in opportunity zones, dedicated north Huntsville road maintenance fund, business improvement district for north Huntsville."},

  groceries:{icon:"🛒",title:"Grocery Tax &",subtitle:"Food Costs",tag:"tag-gold",sub:"Alabama cut its state grocery tax to 2% in September 2025 — but Huntsville still adds its local tax on top. You pay...",
    stats:[["AL State Grocery Tax","2% (Sept 2025)","Down from 4% — but local taxes remain",C.orange],["Huntsville Combined","~9%","State 2% + Madison Co. + City on groceries",C.red],["States with No Grocery Tax","37 states","Including Tennessee — 30 min away",C.green],["Women's Hygiene","Full tax rate","Taxed as non-essential luxury items",C.red]],
    facts:[{k:"red",label:"WHAT YOU ACTUALLY PAY AT THE REGISTER",lc:C.red,tc:"#7f1d1d",text:"Alabama dropped its state grocery tax to 3% in September 2023 and to 2% in September 2025. But the new law allowed — did not require — cities and counties to reduce their local portion. Most have not, citing revenue..."},{k:"gold",label:"THE TAMPON TAX — TAXING A BIOLOGICAL NECESSITY",lc:"#b8860b",tc:"#78350f",text:"Alabama taxes menstrual products — pads, tampons, menstrual cups — at the full general sales tax rate. These are not optional purchases. Over 30 states have eliminated the tampon tax, recognizing these are medical n..."}],
    prompt:"Investigate grocery taxes and food costs in Madison County compared to peer cities and states. THE FACTS: Alabama dropped state grocery tax to 2% September 2025 but cities were not required to reduce local rates, Huntsville combined grocery tax rate approaches 9%, Tennessee has no grocery tax and is 30 minutes away, 37 states have no grocery tax, menstrual products taxed at full rate in Alabama despite 30+ states eliminating tampon tax. For a family spending $1,000/month on food the annual tax difference between Huntsville and Nashville could exceed $1,000. WHO BENEFITS from maintaining grocery taxes: city and county general fund revenue, legislators avoiding alternative revenue sources. WHO GETS HURT: low-income families spending highest proportion of income on food, women who must purchase hygiene products. THE CONNECTIONS: which Madison County officials have opposed grocery tax elimination or tampon tax repeal. WHAT CAN CHANGE: city could voluntarily reduce local grocery tax, state legislature could eliminate tampon tax, pressure campaign on city council."},

  contractors:{icon:"🏭",title:"Gov. Contractors &",subtitle:"Tax Fairness",tag:"tag-navy",sub:"Redstone Arsenal is the economic engine of Madison County. The defense contractors it feeds — Lockheed, Boeing, Ray...",
    stats:[["Redstone Federal Contracts","$20B+/yr","Total contracts flowing through the Arsenal",C.navy],["IDB Corporate Abatements","$127M+","Active zero property tax deals",C.red],["Avg Homeowner Property Tax","Full rate","No abatement available to individuals",C.red],["Lockheed AL Employees","~5,000","Yet pay reduced property tax via abatements",C.orange]],
    facts:[{k:"red",label:"THE TAX BURDEN SHIFT",lc:C.red,tc:"#7f1d1d",text:"When corporations receive IDB property tax abatements — up to 20 years of zero property tax — the school and city funding those taxes would have generated must come from somewhere else. That somewhere else is indivi..."},{k:"gold",label:"FEDERAL CONTRACTORS AND ALABAMA TAX STRUCTURE",lc:"#b8860b",tc:"#78350f",text:"Alabama has no state income tax on military retirement pay, reduced business privilege tax rates, and a generous IDB abatement system — all of which disproportionately benefit large defense contractors and their sen..."}],
    prompt:"Investigate government contractors in Madison County and their tax contributions compared to individual residents. THE FACTS: Redstone Arsenal generates $20B+ in annual federal contracts, major contractors include Lockheed Martin, Boeing, Raytheon, SAIC, Leidos, BAE Systems, IDB grants up to 20 years zero property tax with no performance audit, individual homeowners pay full property tax, Alabama has no state income tax on military retirement, no EITC, minimum wage $7.25/hr. Compare: what does a defense contractor employee earning $150k pay in total state and local taxes vs what does a Walmart worker earning $25k pay as a percentage of income? WHO BENEFITS from current structure: large contractors, senior employees, IDB board appointees. WHO GETS HURT: lower-wage contract employees, small businesses, north Huntsville homeowners subsidizing abatements. THE CONNECTIONS: Dale Strong $284k defense PACs, Tuberville $270k energy/defense PACs — both oppose any contractor tax reform. WHAT CAN CHANGE: IDB performance audits, living wage requirements for abatement recipients, contractor local hiring requirements."},

  schoollunch:{icon:"🍽",title:"School Lunches",subtitle:"Investigation",tag:"tag-orange",sub:"Who decides what children eat in Madison County schools? Who profits from school lunch contracts? Why did Alabama r...",
    stats:[["Summer EBT 2024","AL Refused","Ivey declined $60M+ in free federal food aid",C.red],["HCS Free/Reduced Lunch","~42%","Of HCS students qualify — higher in north Hsv schools",C.navy],["School Lunch Contractors","Aramark/Sodexo","National corporations run most large district food service",C.orange],["Lunch Debt","National crisis","Children refused meals over debt in some districts",C.red]],
    facts:[{k:"red",label:"ALABAMA REFUSED FREE SCHOOL MEALS — WHY",lc:C.red,tc:"#7f1d1d",text:"In 2024, Alabama was one of only 15 states that declined to participate in the USDA Summer EBT program, which would have provided $120 in food benefits per child over summer — at zero cost to the state. Governor Ive..."},{k:"gold",label:"WHO PROFITS FROM SCHOOL LUNCH CONTRACTS",lc:"#b8860b",tc:"#78350f",text:"School food service in large districts is typically contracted to national corporations like Aramark or Sodexo. These companies have documented histories of overcharging districts, reducing food quality, and lobbyin..."}],
    prompt:"Investigate school lunch programs in Madison County. THE FACTS: Alabama refused Summer EBT 2024 at zero state cost leaving 400,000 children without $120 summer food benefit, Ivey signed the refusal, 42% of HCS students qualify for free and reduced lunch with higher percentages in north Huntsville schools, school food service typically contracted to Aramark or Sodexo national corporations, HCS board elections at 11% turnout control this contract. WHO BENEFITS: national food service contractors, officials avoiding federal program administration, Ivey donors in food/agriculture industry. WHO GETS HURT: 400,000 Alabama children who went hungry over summer, working families, north Huntsville students with highest free lunch rates. THE CONNECTIONS: trace Ivey donor connections to food industry, trace HCS board member connections to food service contractors. WHAT CAN CHANGE: Alabama joining Summer EBT, universal free school breakfast, competitive transparent food service contracting, HCS board election voter turnout."},

    proposals:{icon:"📐",title:"Policy",subtitle:"Proposals",tag:"tag-green",sub:"Specific achievable changes at every level of government. None require new money. All require political will — or d...",
    stats:[["Medicaid Expansion","Free to AL","Federal pays 90% — needs Governor's signature","#16a34a"],["Civilian Review","City Ordinance","City Council can pass at any meeting","#2563eb"],["CHOOSE Act Caps","State Vote","Protect ETF from universal drain",C.orange],["TVA Oversight","Congress","Rate increase approval above CPI",C.navy]],
    facts:[{k:"green",label:"WHAT COULD CHANGE TODAY",lc:"#16a34a",tc:"#14532d",text:"Medicaid expansion requires only the Governor's signature. A civilian police review board requires a City Council ordinance. A school spending equity audit requires an HCS board vote. An IDB performance audit requir..."},{k:"gold",label:"WHAT REQUIRES THE 2026 ELECTIONS",lc:"#b8860b",tc:"#78350f",text:"Ending the minimum wage ban, kratom reclassification, bail reform, school zone enhancement reform, CHOOSE Act income cap extension — all require the Alabama Legislature. Arthur Orr controls which bills get hearings ..."}],
    prompt:"Generate a comprehensive list of specific achievable policy proposals that would most improve life for Madison County residents. Organize by level of government required. For each: what it does in plain language, who benefits, what the documented obstacle is (name the official blocking it), and what a resident can do today. Cover: Medicaid expansion, civilian police review, TVA rate oversight, minimum wage ban repeal, CHOOSE Act income caps, school equity, IDB reform, transit, housing affordability, criminal justice reform."},

  action:{icon:"▶",title:"Take",subtitle:"Action",tag:"tag-green",sub:"Every tool you need to hold Madison County officials accountable — complaints, FOIA requests, how to run for office...",
    stats:[["Ethics Complaints","Free","AL Ethics Commission — public record","#16a34a"],["Open Records","Your right","Alabama §36-12-40 — any public document","#2563eb"],["Voter Registration","15 days","Before any election — 37,000 unregistered",C.orange],["Run for Office","2026","School board races decided by 200 votes","#16a34a"]],
    facts:[{k:"green",label:"YOUR RIGHTS UNDER ALABAMA LAW",lc:"#16a34a",tc:"#14532d",text:"Under Alabama Open Records Act §36-12-40, you have the right to request and receive any public record — contracts, meeting minutes, financial documents, correspondence. This is free. Under Alabama Ethics Act, you ca..."},{k:"gold",label:"THE MOST POWERFUL THINGS YOU CAN DO",lc:"#b8860b",tc:"#78350f",text:"In order of likely impact: (1) Register to vote — 37,000 eligible Madison County residents are not registered. (2) Attend a City Council or school board meeting when a vote is coming — your presence changes the calc..."}],
    prompt:"Generate a comprehensive action guide for Madison County residents. What are the most impactful specific actions they can take to hold officials accountable? Include: how to file Alabama Open Records requests (with template), how to file AL Ethics Commission complaints, how to contact every relevant official, how to attend public meetings effectively, voter registration details, and how to run for HCS school board in 2026. Make it actionable and specific."},

  disinfo:{icon:"🧠",title:"Disinformation,",subtitle:"Algorithms & Immigration Facts",tag:"tag-navy",sub:"Britt's immigration benefit claims contradict 8 U.S.C. §1611 — law in place since 1996. Alabama politicians use thi...",
    stats:[["Britt Claims","Contradict law","8 U.S.C. §1611 since 1996",C.red],["Britt Insurance PACs","$310k","Who benefit from Medicaid refusal distraction",C.red],["RealPage DOJ Suit","Active","Algorithmic rent coordination",C.red],["Local Investigative","Declining","Staff cuts across all AL outlets",C.orange]],
    facts:[{k:"red",label:"THE IMMIGRATION DISINFORMATION CAMPAIGN — FOLLOW THE MONEY",lc:C.red,tc:"#7f1d1d",text:"Federal law (8 U.S.C. §1611, since 1996) explicitly bars undocumented immigrants from Medicaid, SNAP, ACA, Medicare, and CHIP. This 30-year federal statute is unambiguous. Yet Alabama politicians repeatedly claim im..."},{k:"gold",label:"THE DOCUMENTED CONNECTION: FALSE CLAIM → REAL POLICY → REAL DONOR BENEFIT",lc:"#b8860b",tc:"#78350f",text:"Step 1: Politician claims immigrants are burdening Medicaid. Step 2: Claim is false — 8 U.S.C. §1611 has prevented this since 1996. Step 3: The false claim is used to justify not expanding Medicaid. Step 4: 295,000 ..."}],
    prompt:"Investigate disinformation by Alabama politicians and algorithmic pricing as connected issues. Britt false immigration benefit claims vs 8 USC 1611 since 1996 — trace to her $310k insurance PAC donors who benefit from Medicaid refusal distraction. RealPage DOJ antitrust case and Madison County landlord usage. Algorithmic grocery pricing. Who benefits when voters focus on false threats instead of real economic harm? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."},

  voting:{icon:"🗳",title:"Voting Power &",subtitle:"Gerrymandering",tag:"tag-red",sub:"Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents not...",
    stats:[["VRA Violation","Ruled 2023","Allen v. Milligan — maps unconstitutional",C.red],["Unregistered Eligible","37,000","Madison County eligible but not registered",C.red],["HCS Board Turnout","11%","Controls $310M — 2,000 votes flips a race",C.orange],["Local Race Margin","<200 votes","Many council and school board races",C.orange]],
    facts:[{k:"red",label:"GERRYMANDERING — WHAT HAPPENED",lc:C.red,tc:"#7f1d1d",text:"In June 2023 the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act. AG Steve Marshall spent taxpayer money defending the unconstitutional maps. Replacement maps Alabama drew we..."},{k:"green",label:"YOUR VOTE IS WORTH MORE THAN YOU THINK",lc:"#16a34a",tc:"#14532d",text:"The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races: decided by under 200 votes — controlling a $310M annual budget with 11% turnout. A single organized group with 500..."}],
    prompt:"Investigate gerrymandering and voter power in Madison County. Allen v. Milligan Supreme Court ruling VRA violation 2023. Marshall defended unconstitutional maps at taxpayer expense, drew non-compliant replacements. 37,000 unregistered eligible Madison County voters. Specific recent race margins — City Council D1 decided by 368 votes, HCS board races under 200 votes with 11% turnout. What organized voter action could accomplish in 2026. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."},
};

// ─── SHARED COMPONENTS ───────────────────────────────────────
function Spin(){return <span className="spin"/>;}

function AiResult({text}){
  if(!text) return null;
  // AI now returns plain paragraphs - just render them cleanly
  const paragraphs=text.split(/\n+/).filter(p=>p.trim().length>10);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {paragraphs.map((p,i)=>(
        <p key={i} style={{fontSize:14,color:"#2d2a22",lineHeight:1.8,margin:0,padding:"8px 0",borderBottom:i<paragraphs.length-1?"1px solid #f0ebe2":"none"}}>{p.trim()}</p>
      ))}
    </div>
  );
}

function AiButton({prompt,label="🔍 Break It Down"}){
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
      <div className="ai-panel-label">💬 SUMMARY</div>
      <AiResult text={r}/>
      <button className="btn btn-ghost" onClick={()=>setR(null)} style={{marginTop:10,fontSize:12.5}}>Clear</button>
    </div>
  );
  return(
    <button className={`btn btn-gold btn-full`} onClick={go} disabled={ld}>
      {ld?<><Spin/> Breaking it down...</>:label}
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
            <AiButton prompt={`Investigate ${p.name} for Madison County ratepayers. Governance: ${p.gov}. Rate history: ${p.rates.map(r=>r.what+" "+r.amount).join(", ")}. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words.`} label={`🔍 Investigate ${p.name}`}/>
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
              {name:"Board of Directors (15 members)",role:"Self-Appointed — Zero Public Vote",note:"To see current members: visit ProPublica.org/nonprofit-explorer and search 'Huntsville Hospital' (EIN 63-0288816). Or submit an Open Records request to HHHS directly."},
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
            {from:"Mayor Tommy Battle",to:"IDB Board",rel:"APPOINTS ALL 9 MEMBERS",detail:"Battle received $380k from real estate developers. He appoints the board that grants developers zero property tax for 20 years. No performance audit required.",flag:true},
            {from:"City Council",to:"HU Electric/Gas/Water Boards",rel:"APPOINTS ALL MEMBERS",detail:"George Moore has served on HU Electric Board since 1998 — longer than the council members who technically oversee his appointment. Rate increases approved with minimal public...",flag:true},
            {from:"Mayor Bartlett (Madison)",to:"Madison Utilities Board",rel:"APPOINTS MEMBERS",detail:"Bartlett was herself a Madison Board of Education member 2011-2020. She now controls Madison Utilities board appointments. Utilities fund affects school property tax base.",flag:false},
            {from:"HHHS Board",to:"HHHS Board",rel:"SELF-APPOINTING",detail:"Board appoints own successors with no public input. Has included HHHS-employed physicians who vote on their own compensation and executives from organizations doing business with...",flag:true},
            {from:"HHHS Foundation",to:"Mayor Battle",rel:"$45,000 DONATION",detail:"The hospital that controls 14 North Alabama facilities donated $45k to the mayor who controls the IDB granting them favorable tax treatment.",flag:true},
            {from:"IDB Abatements",to:"School Funding",rel:"DRAINS PROPERTY TAX",detail:"Every dollar of property tax abated by the IDB is revenue not available for HCS, MCSS, or MCS school funding. The IDB board appointed by Battle has never been required to quantify...",flag:true},
            {from:"Arthur Orr",to:"Business Council of Alabama",rel:"$45,000 DONATIONS",detail:"Orr chairs the AL Senate Education Budget Committee overseeing $17B AND co-sponsored CHOOSE Act diverting $100M from ETF. BCA which donated to him opposed any income cap on CHOOSE...",flag:true},
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
    {name:"Dale Strong",photo:"https://bioguide.congress.gov/bioguide/photo/S/S001220.jpg",title:"U.S. Representative",district:"Alabama's 5th Congressional District",party:"Republican",photo:"https://dalestrong.house.gov/sites/evo-subsites/dalestrong.house.gov/files/evo-media-image/strong-official.jpg",
      since:"Jan 2023",termEnds:"Jan 2027",avatar:"DS",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $1.2M–$2.8M",netWorthPre:"Est. $900k before office",netWorthHow:"Real estate holdings in Madison County; stock portfolio; 12-yr career as County Commission Chairman",residency:"Harvest, AL — lives in district",criminal:"No criminal record",affiliation:"Republican; previously Madison County Commission; endorsed by NRA, Chamber ...",topDonors:[["Defense PACs (Lockheed, Boeing, Raytheon)","$284,000"],["Real Estate PACs","$48,000"],["BAE Systems PAC","$22,000"]],bio:"Served as Madison County Commission Chairman 2010-2022. Won AL-5 seat in 2022. Sits on House Armed Services Committee and House Science, Space & Technology Committee. Has not introduced any TVA oversight, utility rate, or worker wage legislation.",votes:[{bill:"PRO Act (union organizing rights)",vote:"Against",impact:"Would have protected Madison County workers' right to organize"},  {bill:"Build Back Better child care",vote:"Against",impact:"Would have capped child care at 7% of income for Madison County families"},{bill:"PFAS Notification Act",vote:"Against",impact:"Would have required disclosure of Redstone Arsenal PFAS contamination levels"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"AL-5 covers all TVA territory — zero bills filed in 2 years"}],contact:{phone:"(256) 551-0190",web:"https://dalestrong.house.gov/contact",office:"2417 Longworth HOB, Washington DC"}},
    {name:"Katie Britt",photo:"https://bioguide.congress.gov/bioguide/photo/B/B001319.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",photo:"https://www.britt.senate.gov/wp-content/uploads/2023/01/Britt_Official_Portrait.jpg",
      since:"Jan 2023",termEnds:"Jan 2029",avatar:"KB",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $3.1M–$7.4M",netWorthPre:"Est. $1.5M before office",netWorthHow:"Disclosed stock holdings in energy, finance, defense; husband former NFL player; prior CEO Business Council of Alabama",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former CEO Business Council of Alabama; endorsed by Trump 2022",topDonors:[["Health insurance industry","$310,000"],["Energy PACs","$890,000"],["Financial services","$445,000"]],bio:"First woman elected to Senate from Alabama. Former CEO of Business Council of Alabama. Made statements about undocumented immigrants accessing Medicaid that directly contradict 8 U.S.C. §1611 — federal law in place since 1996 that explicitl...",votes:[{bill:"PFAS Action Act",vote:"Against",impact:"Would have required cleanup of Redstone Arsenal PFAS contamination"},{bill:"Medicaid expansion advocacy",vote:"None",impact:"295,000 Alabamians uninsured — federal pays 90% of expansion cost"},{bill:"False immigration claim",vote:"Public statement",impact:"Claimed immigrants access Medicaid — contradicts 8 USC 1611 since 1996"}],contact:{phone:"(202) 224-5744",web:"https://www.britt.senate.gov/contact",office:"703 Hart Senate Office Building"}},
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",photo:"https://www.tuberville.senate.gov/wp-content/uploads/2023/01/Tuberville_Official_Portrait.jpg",
      since:"Jan 2021",termEnds:"Jan 2027",avatar:"TT",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before office",netWorthHow:"Multi-million coaching contracts at Auburn, Ole Miss, Texas Tech; hedge fund and commodity investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Auburn, AL — has faced questions about Florida residency",criminal:"No criminal record",affiliation:"Republican; former football coach; endorsed by Trump",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["NRA PAC","$65,000"]],bio:"Spent most of career as football coach. Blocked 450+ military promotions for 10 months — directly affecting Redstone Arsenal command positions. Has not introduced any TVA oversight legislation. Faced ethics questions about trading in commod...",votes:[{bill:"Military promotions (held hostage)",vote:"Blocked 450+ for 10 months",impact:"Directly disrupted Redstone Arsenal command structure"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"Controls TVA through Senate despite $270k energy PACs"}],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
  ]},
  {level:"State",color:"#7f1d1d",officials:[
    {name:"Kay Ivey",photo:"https://governor.alabama.gov/wp-content/uploads/2019/01/Ivey-Official-Portrait.jpg",title:"Governor of Alabama",district:"Statewide — TERM LIMITED 2026",party:"Republican",photo:"https://governor.alabama.gov/wp-content/uploads/2019/06/Ivey-Official-Portrait-2019.jpg",
      since:"Apr 2017",termEnds:"Jan 2027",avatar:"KI",salary:"$120,395/yr — taxpayer funded",netWorth:"Est. $1.4M–$3.2M",netWorthPre:"Est. $900k before governor",netWorthHow:"State treasurer 2003-2011; State Auditor; real estate; disclosed investment portfolio",residency:"Montgomery, AL",criminal:"No criminal record",affiliation:"Republican; former State Treasurer, State Auditor, Lt. Governor; term limit...",topDonors:[["Health insurance industry","$420,000"],["Energy PACs","$340,000"],["Business Council of Alabama","$180,000"]],bio:"Has refused Medicaid expansion for 295,000 Alabamians — federal government pays 90% of the cost. Signed CHOOSE Act diverting $100M from Education Trust Fund to private schools where 67% of recipients were already enrolled.",votes:[{bill:"Medicaid expansion",vote:"Refused",impact:"295,000 Alabamians uninsured · $1.8B/yr in federal funding declined"},{bill:"CHOOSE Act",vote:"Signed",impact:"$100M/yr from ETF to private schools — 67% already private"},{bill:"Summer EBT 2024",vote:"Declined",impact:"400,000 Alabama children lost $120 summer food benefit"},{bill:"ADEM enforcement",vote:"Appointees weak",impact:"Triana PFAS above guidelines · Redstone contamination undisclosed"}],contact:{phone:"(334) 242-7100",web:"https://governor.alabama.gov/contact/",office:"600 Dexter Ave, Montgomery AL 36130"}},
    {name:"Arthur Orr",title:"AL Senate Finance Committee Chair",district:"Senate District 8 — Madison/Lawrence Counties",party:"Republican",since:"Jan 2011",termEnds:"Nov 2026",avatar:"AO",salary:"$54,114/yr + per diem — taxpayer funded",netWorth:"Est. $800k–$2.1M",netWorthPre:"Est. $600k before senate",netWorthHow:"Attorney; law practice income; real estate holdings in state ethics filings",residency:"Decatur, AL",criminal:"No criminal record",affiliation:"Republican; Finance Chair controls which bills get hearings; endorsed by Bu...",topDonors:[["Business Council of Alabama","$45,000"],["Private prison (CoreCivic/GEO)","$22,000"],["ALFA Insurance","$28,000"],["Alabama Power PAC","$19,000"]],bio:"As Finance Committee Chairman he controls which bills receive hearings in the Alabama Senate. Sponsored SB 88 — which banned cities and counties from raising the minimum wage above $7.25/hr. Has blocked Medicaid expansion, kratom reclassifi...",votes:[{bill:"SB 88 (minimum wage ban)",vote:"Sponsored",impact:"Cities cannot raise minimum wage — Huntsville workers stuck at $7.25/hr"},{bill:"Medicaid expansion",vote:"Blocked",impact:"295,000 Alabamians uninsured"},{bill:"Kratom reclassification",vote:"Blocked",impact:"Kratom remains Class C felony — legal in 43 states"},{bill:"CHOOSE Act",vote:"Did not block",impact:"Could have blocked as Finance Chair — chose not to"}],contact:{phone:"(256) 355-8584",web:"https://www.legislature.state.al.us",office:"Alabama State House, Montgomery AL"}},
    {name:"Steve Marshall",title:"Alabama Attorney General",district:"Statewide",party:"Republican",since:"Feb 2017",termEnds:"Jan 2027",avatar:"SM",salary:"$136,495/yr — taxpayer funded",netWorth:"Est. $500k–$1.4M",netWorthPre:"Est. $400k before AG",netWorthHow:"Attorney; public salary; disclosed investments",residency:"Guntersville, AL",criminal:"No criminal record — but faced scrutiny for campaign finance practices",affiliation:"Republican; former Marshall County DA; endorsed by law enforcement associations",topDonors:[["Law enforcement PACs","$340,000"],["Private prison industry","$45,000"],["Business Council of Alabama","$38,000"]],bio:"Defended Alabama's unconstitutional congressional maps in Allen v. Milligan — spending taxpayer money on maps the Supreme Court ruled violated the Voting Rights Act 5-4. Drew replacement maps that were also found non-compliant.",votes:[{bill:"Allen v. Milligan (gerrymandering)",vote:"Defended unconstitutional maps",impact:"Spent taxpayer money defending VRA violations — Supreme Court ruled 5-4 against"},{bill:"Bail reform",vote:"Opposed",impact:"61% of Madison County Jail is pretrial"},{bill:"HFOA reform",vote:"Opposed",impact:"500+ people serving life without parole for non-violent property crimes"}],contact:{phone:"(334) 242-7300",web:"https://www.alabamaag.gov",office:"501 Washington Ave, Montgomery AL 36130"}},
  ]},
  {level:"County",color:"#374151",officials:[
    {name:"Rex Vaughn",title:"Madison County Commission Chairman (At-Large)",district:"At-Large — all of Madison County",party:"Republican",since:"Mar 2026",termEnds:"TBD",avatar:"RV",salary:"~$78,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Recently appointed — financial disclosure under review",residency:"Madison County",criminal:"No record found",affiliation:"Republican; appointed March 2026 after previous chairman left",topDonors:[["Under research","TBD"]],bio:"Appointed March 2026 to fill vacancy. Controls county budget and service delivery for all unincorporated areas — including Harvest, Toney, Monrovia, and Meridianville which have no city government. First major decisions being watched.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Violet Edwards",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville",party:"Democrat",since:"Jan 2025",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"First term — financial disclosure pending",residency:"North Huntsville",criminal:"No record found",affiliation:"Democrat; first Black woman elected to Madison County Commission",topDonors:[["Community fundraising","~$28,000"]],bio:"First Black woman elected to the Madison County Commission. Represents north Huntsville areas. Her district includes communities that have documented road maintenance inequities vs south Huntsville.",votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Kevin Turner",title:"Madison County Sheriff",district:"Madison County",party:"Republican",since:"Jan 2019",termEnds:"Jan 2027",avatar:"KT",salary:"~$95,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Career law enforcement; income from public salary",residency:"Madison County",criminal:"No criminal record",affiliation:"Republican; career law enforcement; endorsed by bail bond industry",topDonors:[["Law enforcement PACs","$62,000"],["Bail bond industry","$24,000"]],bio:"61% of Madison County Jail population is pretrial — not convicted of anything. County earns ~$200,000/year in Securus/ViaPath phone commissions while families pay $0.21/min to call incarcerated loved ones. Received $24,000 from bail bond in...",votes:[{bill:"Bail reform",vote:"Opposed",impact:"61% of jail is pretrial — held because they cannot afford bail"},{bill:"Securus contract renewal",vote:"Maintained",impact:"County earns $200k/yr commissions while families pay $0.21/min"}],contact:{phone:"(256) 722-7181",web:"https://www.madisoncountysheriff.org",office:"815 Wheeler Ave, Huntsville AL 35801"}},
  ]},
  {level:"2026 Candidates",color:"#7c3aed",officials:[
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"Candidate — AL Governor 2026",district:"Statewide — running to replace term-limited Ivey",party:"Republican",since:"Announced Dec 2025",termEnds:"Would serve 2027-2031",avatar:"TT",salary:"$174,000/yr current Senate salary",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before Senate",netWorthHow:"Multi-million coaching contracts; hedge fund investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Questions raised — Auburn AL listed but possible primary residence in Florida",criminal:"No criminal record",affiliation:"Republican; endorsed by Trump; former football coach",topDonors:[["Energy PACs","$270,000"],["Club for Growth","$185,000"],["Defense industry","$142,000"]],bio:"Current AL Senator running for Governor instead of Senate re-election. Introduced 21 bills in 4 years — zero advanced out of committee. Blocked 450+ military promotions for 10 months affecting Redstone Arsenal. Questions about whether he ac...",votes:[{bill:"Military promotions block",vote:"10 months",impact:"Directly disrupted Redstone Arsenal — then ran for governor of the state he disrupted"},{bill:"TVA oversight",vote:"None in 4 years",impact:"Received $270k energy PACs — introduced zero utility oversight"}],quotes:[
      {type:"general",quote:null,fact:"Residency questions: Cook Political Report noted 'questions linger about the exact nature of Tuberville's residence in the state he hopes to lead.' Alabama law requires 7 years of residency to run for governor.",date:"Dec 2025",source:"Cook Political Report",flip:false},
      {type:"general",quote:null,fact:"Introduced just 21 bills in the 118th Congress — zero of which advanced out of committee. Was spotted at the Masters Tournament instead of voting on a new Joint Chiefs chairman. Now running for governor claiming...",date:"2023-2024",source:"Cook Political Report",flip:true},
      {type:"environment",quote:null,fact:"Received $270,000 from energy PACs as Senator. Introduced zero TVA oversight bills despite TVA raising rates 3 times in 18 months. As governor he would have no direct TVA authority — but AL Governor appoints ADEM...",date:"2021-2025",source:"FEC.gov",flip:true},
    ],contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
    {name:"Doug Jones",title:"Candidate — AL Governor 2026 (Democrat)",district:"Statewide — former US Senator",party:"Democrat",since:"Announced 2025",termEnds:"Would serve 2027-2031",avatar:"DJ",salary:"N/A — private practice",netWorth:"Est. $2M–$5M",netWorthPre:"Est. $1.5M before Senate",netWorthHow:"Career as federal prosecutor and attorney; Senate salary 2018-2023",residency:"Birmingham, AL",criminal:"No criminal record — former federal prosecutor",affiliation:"Democrat; former US Senator (2018-2023); prosecuted 16th Street Baptist Chu...",topDonors:[["Democratic fundraising network","Under research"],["Trial lawyers","Under research"]],bio:"Served as US Senator 2018-2023 — the only Democrat elected statewide in Alabama since 2008. Lost to Tuberville in 2020 by 20 points. Prosecuted the 16th Street Baptist Church bombers as US Attorney. If elected would be first Democratic gove...",votes:[{bill:"ACA protection votes",vote:"Yes",impact:"Voted to protect pre-existing condition coverage"},{bill:"Bipartisan Infrastructure",vote:"Yes",impact:"Supported $1.2B for Alabama infrastructure"}],quotes:[
      {type:"healthcare",quote:null,fact:"As Senator voted to protect the ACA and has publicly supported Medicaid expansion. As governor would have authority to expand Medicaid to 295,000 Alabamians without a legislative vote.",date:"2018-2023",source:"Senate vote records",flip:false},
      {type:"general",quote:null,fact:"First Democrat to win a Senate seat in Alabama since 1992. Won in 2017 special election by 1.7 points over Roy Moore. Lost re-election to Tuberville by 20 points in 2020. Running for governor as Ivey is term-limited.",date:"2025",source:"AL election records",flip:false},
    ],contact:{phone:"N/A",web:"https://dougjones.com",office:"Campaign website"}},
  ]},
  {level:"Madison City",color:"#374151",officials:[
    {name:"Ranae Bartlett",title:"Mayor of Madison",district:"City of Madison — sworn Nov 2025",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"RB",photo:"https://www.madisonal.gov/ImageRepository/Document?documentID=9876",salary:"~$80,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Attorney; former Madison Board of Education 2011-2020; law clerk to US District Judge",residency:"Madison, AL",criminal:"No criminal record",affiliation:"Republican; former Madison City Council D5; former School Board President 2...",topDonors:[["Local community fundraising","~$85,000"]],bio:"First new Madison mayor in a decade. Former Madison Board of Education member 2011-2020 and Board President 2017-2020. Career law clerk to US District Judge C. Lynwood Smith Jr. and former Walmart Associate General Counsel.",votes:[{bill:"Madison Utilities board",vote:"New appointments 2026",impact:"Controls appointed board setting water rates for 19,000+ customers"}],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe.",fact:"Said this at swearing in. Key test: whether she requires affordable housing components in new Madison development, and whether Madison Utilities board she appoints acts on rate transparency.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Maura Wroblewski",title:"Madison City Council — District 1",district:"District 1 — Huntsville Browns Ferry Rd / Mose Chapel Rd",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MW",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Re-elected third term; background in community development",residency:"Madison District 1",criminal:"No record found",affiliation:"Republican; re-elected third term",topDonors:[["Local community fundraising","Under research"]],bio:"Re-elected to her third term. Focused on infrastructure and Mill Creek Greenway Preserve project — a mile-long trail on Balch Road in partnership with Madison Utilities and North Alabama Land Trust.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"David Bier",title:"Madison City Council — District 2",district:"District 2",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"DB",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 2",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. One of six new council members sworn in with Mayor Bartlett.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Billie Goodson",title:"Madison City Council — District 3",district:"District 3",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"BG",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 3",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Michael McKay",title:"Madison City Council — District 4",district:"District 4",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"MM",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 4",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Alice Lessmann",title:"Madison City Council — District 5",district:"District 5",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"AL",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025; former Alabama Association of School Boards District 9 Director",residency:"Madison District 5",criminal:"No record found",affiliation:"Republican; former school board association director",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. Former District 9 Director for the Alabama Association of School Boards. Focused on smart growth, school support, and infrastructure.",votes:[],quotes:[{type:"general",quote:"I want to make sure that Madison is a place where families are happy, businesses thrive — that includes smart growth, supporting our schools, keeping our city safe with our first responders and our infrastructure.",fact:"Said at swearing in. Her school board background makes her key vote on school-developer interface decisions.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Erica White",title:"Madison City Council — District 6",district:"District 6",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"EW",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Small business owner; newly elected Nov 2025",residency:"Madison District 6",criminal:"No record found",affiliation:"Republican; small business owner",topDonors:[["Local community fundraising","Under research"]],bio:"Small business owner and mother of two. Elected November 2025. Focus: roads and infrastructure in District 6, particularly Old Madison Pike.",votes:[],quotes:[{type:"general",quote:"City government is best run when real world people with experience that care about the city step up and make a difference.",fact:"Said at swearing in. Watch her votes on road maintenance equity and development review.",date:"Nov 2025",source:"WAFF",flip:false}],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
    {name:"Kenneth Jackson",title:"Madison City Council — District 7",district:"District 7 — Balch Road area",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"KJ",photo:null,salary:"~$12,000/yr",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Newly elected Nov 2025",residency:"Madison District 7 — Balch Road",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community fundraising","Under research"]],bio:"Newly elected November 2025. Committed to accelerating infrastructure improvements including the recently approved roundabout in his district.",votes:[],quotes:[],contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
  ]},
  {level:"Triana",color:"#7f1d1d",officials:[
    {name:"Mary Caudle",title:"Mayor of Triana",district:"Town of Triana — ~2,323 residents · majority-Black community",party:"Independent",since:"2008",termEnds:"2025 (election status under research)",avatar:"MC",photo:null,salary:"Minimal — small town budget",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Lifelong Triana resident; 39 years in medical finance; founder Assist Practice Management Services LLC; Senior Director at Sequel Youth and Family Services",residency:"Triana, AL — lifelong resident",criminal:"No criminal record",affiliation:"Non-partisan local office; serves on TARCOG, Community Action Partnership, ...",topDonors:[["Local community fundraising","Under research"]],bio:"Four-term mayor (since 2008). Lifelong Triana resident. The town faces Superfund contamination from Redstone Arsenal and Olin Corporation DDT via Huntsville Spring Branch. Town water shows PFOS above EWG health guidelines.",votes:[],quotes:[{type:"environment",quote:null,fact:"PFAS/ENVIRONMENT: Triana's water shows PFOS above EWG health guidelines. Town remains on EPA Superfund list. Mayor Caudle has worked with regional bodies to address contamination from Redstone Arsenal. Despite being the...",date:"Ongoing",source:"EWG / EPA Superfund records",flip:false},{type:"general",quote:null,fact:"ACCOUNTABILITY GAP: Triana residents have no access to IDB tax abatements, no Huntsville City Council representation, and limited TARCOG influence. Their water contamination affects a majority-Black community of 2,300...",date:"Ongoing",source:"Madison County records",flip:false}],contact:{phone:"(256) 772-0300",web:"https://townoftrianaal.gov",office:"Town of Triana, 209 Triana Blvd, Triana AL 35756"}},
  ]},
  {level:"Unincorporated Areas",color:"#6b7280",officials:[
    {name:"Phil Vandiver",title:"Madison County Commissioner — District 4",district:"District 4 — COVERS: Harvest, Toney, Monrovia, Meridianville",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"PV",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; background in agriculture and local business",residency:"Harvest, AL (Highway 53)",criminal:"No record found",affiliation:"Republican; agricultural interests; 12 years on commission",topDonors:[["Agricultural interests","Under research"],["Local business","Under research"]],bio:"KEY OFFICIAL FOR HARVEST/TONEY/MERIDIANVILLE/MONROVIA RESIDENTS. These are unincorporated communities with NO city government, NO city council, NO mayor. Phil Vandiver is the ONLY elected official whose primary job is to represent these ~12...",votes:[{bill:"Road maintenance allocation",vote:"District 4 priority",impact:"Harvest/Toney/Meridianville road quality directly in his control"},{bill:"Zoning decisions",vote:"District 4 vote",impact:"Controls commercial and residential development in unincorporated area"}],quotes:[{type:"general",quote:"We've still got a lot of work to do. We've still got to work in our communities and improve our rec centers and improve everything.",fact:"Said while seeking re-election 2024. District 4 covers the fastest growing unincorporated area in Alabama with some of the fewest services per capita. 12 years in office — residents should ask: what specifically has...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 852-8351",web:"https://www.madisoncountyal.gov",office:"6084 Highway 53, Harvest AL 35749"}},
    {name:"Tom Brandon",title:"Madison County Commissioner — District 1",district:"District 1 — New Market, Gurley, Paint Rock area",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"TB2",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; agricultural background",residency:"New Market, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local community","Under research"]],bio:"Represents the eastern rural portion of Madison County including New Market, Gurley, and Paint Rock. 12 years on the commission.",votes:[],quotes:[],contact:{phone:"(256) 828-0726",web:"https://www.madisoncountyal.gov",office:"9457 Moores Mill Road, New Market AL"}},
    {name:"Steve Haraway",title:"Madison County Commissioner — District 2",district:"District 2 — Madison City adjacent areas",party:"Republican",since:"Jan 2013",termEnds:"Jan 2029",avatar:"SH",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"12 years on commission; business background",residency:"Madison, AL",criminal:"No record found",affiliation:"Republican",topDonors:[["Local business","Under research"]],bio:"Represents District 2 adjacent to Madison City. Has served 3 terms — 12 years.",votes:[],quotes:[{type:"general",quote:"I understand what the needs are. I've been doing this for the last three terms, and I'm very familiar with the problems we've got, and I'm also familiar with what we need to do to grow and make Madison County better.",fact:"Said while seeking 2024 re-election. 12 years on the commission — voters should ask what specific problems were solved vs what remains unaddressed.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1590",web:"https://www.madisoncountyal.gov",office:"100 Plaza Blvd Suite 2, Madison AL"}},
    {name:"Craig Hill",title:"Madison County Commissioner — District 3",district:"District 3 — Brownsboro, eastern Madison County",party:"Republican",since:"Jan 2017",termEnds:"Jan 2029",avatar:"CH",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"Commission since 2017; agricultural/rural background",residency:"Brownsboro, AL (Highway 72 East)",criminal:"No record found",affiliation:"Republican; ran unopposed 2024",topDonors:[["Local community","Under research"]],bio:"Represents eastern rural Madison County. Ran unopposed in November 2024.",votes:[],quotes:[],contact:{phone:"(256) 776-2475",web:"https://www.madisoncountyal.gov",office:"4273 Highway 72 East, Brownsboro AL"}},
    {name:"Phil Riddick",title:"Madison County Commissioner — District 5",district:"District 5 — Southeast Huntsville area",party:"Republican",since:"Jan 2011",termEnds:"Jan 2029",avatar:"PR",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"17 years commission; 17 years commercial real estate",residency:"Huntsville area, District 5",criminal:"No record found",affiliation:"Republican; commercial real estate background",topDonors:[["Real estate interests","Under research"]],bio:"Longest-serving current commissioner — 17 years. Background in commercial real estate. Has worked on improvements to Ditto Landing.",votes:[],quotes:[{type:"general",quote:"Just work experience outside of the commission, being in the commercial real estate business for 17 years, I kind of know what people are looking for, developers and things like that, important things that come up in the county.",fact:"Explicitly ties his commission judgment to his real estate industry background — an industry that directly benefits from favorable county zoning and infrastructure decisions.",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-3497",web:"https://www.madisoncountyal.gov",office:"100 Northside Square Courthouse 6th Floor Rm 627, Huntsville AL"}},
    {name:"Violet Edwards",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville / unincorporated north county",party:"Democrat",since:"Jan 2021",termEnds:"Jan 2029",avatar:"VE",photo:null,salary:"~$62,000/yr — taxpayer funded",netWorth:"Under research",netWorthPre:"Under research",netWorthHow:"First term 2021-2024; re-elected 2024; community organizer background",residency:"North Huntsville — District 6",criminal:"No record found",affiliation:"Democrat; first Black woman on Madison County Commission",topDonors:[["Community fundraising","~$35,000"]],bio:"First Black woman elected to the Madison County Commission. Re-elected 2024. Represents north Huntsville and surrounding unincorporated areas where road PCI averages 41 vs south Huntsville's 72. As the only Democrat on the commission, she i...",votes:[{bill:"Road maintenance equity",vote:"Advocated",impact:"Her district has the lowest road PCI in the county"}],quotes:[{type:"general",quote:"I ask for the community to vote for me because I have worked tirelessly over last four years. I will continue to serve with honor and integrity, and together, working with the community, we can continue to make great strides.",fact:"Re-election statement 2024. As the only Democrat on a 7-member Republican commission, her ability to force policy change is limited. The question: has she been able to move resources toward District 6, and if not, what...",date:"Nov 2024",source:"WHNT",flip:false}],contact:{phone:"(256) 532-1505",web:"https://www.madisoncountyal.gov",office:"3210 Hi-Lo Circle, Huntsville AL"}},
  ]},  {level:"Huntsville",color:"#1e3a5f",officials:[
    {name:"Tommy Battle",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2022/11/battle-headshot-200.jpg",title:"Mayor of Huntsville",district:"City of Huntsville — 5th term",party:"Republican",since:"Nov 2008",termEnds:"Nov 2028",avatar:"TB",salary:"$131,500/yr — taxpayer funded",netWorth:"Est. $2.8M–$6.4M",netWorthPre:"Est. $1.2M before mayor",netWorthHow:"Business background; real estate; investment portfolio grown during tenure; salary + benefits for 16+ years",residency:"Huntsville, AL — south Huntsville",criminal:"No criminal record",affiliation:"Republican; former businessman; endorsed by Huntsville/Madison County Chamb...",topDonors:[["Real estate developers","$380,000"],["Construction companies","$210,000"],["HHHS Foundation","$45,000"],["Defense/aerospace contractors","$88,000"]],bio:"Longest-serving Huntsville mayor. Under his 16-year tenure: north Huntsville roads average PCI 41 vs south Huntsville PCI 72 (same tax rate). Zero civilian police review board proposals. IDB has granted $127M+ in corporate tax abatements wi...",votes:[{bill:"Civilian police review board",vote:"Never proposed in 16 years",impact:"HPD investigates its own conduct with no civilian oversight"},{bill:"IDB abatement performance audits",vote:"Never required",impact:"$127M+ granted · no public verification of job/wage promises"},{bill:"Anti-camping ordinance",vote:"Supported",impact:"3 of 8 sweeps near active developer projects"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/mayors-office/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Michelle Watkins",title:"City Council — District 1",district:"District 1 — North Huntsville",party:"Democrat",since:"Nov 2024",termEnds:"Nov 2028",avatar:"MW",salary:"~$20,000/yr — part-time council",netWorth:"Under research",netWorthPre:"First term",netWorthHow:"First term — limited disclosure period",residency:"North Huntsville — in district",criminal:"No record found",affiliation:"Democrat; first Black woman on Huntsville City Council; community advocate ...",topDonors:[["Community fundraising","~$42,000"]],bio:"First Black woman elected to Huntsville City Council. Elected September 2024. Voted NO on the January 2025 394-acre annexation — the only no vote — citing school overcrowding. Her district includes the roads with PCI 41 vs south Huntsville's PCI 72.",votes:[{bill:"394-acre annexation (Jan 2025)",vote:"NO — only no vote",impact:"'Breaking schools at the seam' — schools cannot absorb growth"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Jennie Robinson",title:"City Council — District 3 (Council President)",district:"District 3 — South/Central Huntsville",party:"Republican",since:"Nov 2016",termEnds:"Nov 2028",avatar:"JR",salary:"~$20,000/yr — part-time council",netWorth:"Est. $600k–$1.8M",netWorthPre:"Est. $500k before council",netWorthHow:"Career educator; professor; real estate; public salary",residency:"South Huntsville — district 3",criminal:"No criminal record",affiliation:"Republican; former educator; Council President since Nov 2025",topDonors:[["South Huntsville business","$52,000"],["Real estate interests","$28,000"]],bio:"Council President. Has voted for budgets that have produced the documented PCI 41 vs 72 road disparity between north and south Huntsville. Facilitated all 2025 annexations as Council President. Noted that Huntsville now compares in land mas...",votes:[{bill:"All 2025 annexations",vote:"Supported",impact:"2,000+ acres annexed while north Huntsville roads remain PCI 41"}],contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
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
      const x=await callAI(`Investigate ${off.name} (${off.title}). Salary: ${off.salary}. Net worth: ${off.netWorth} (before office: ${off.netWorthPre}). Top donors: ${off.topDonors.map(d=>d[0]+' '+d[1]).join(', ')}. Residency: ${off.residency}. Criminal record: ${off.criminal}. Key record: ${off.bio.substring(0,300)}. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words.`);
      setR(x);
    }catch(e){setR("Investigation unavailable.");}
    setLd(false);
  }

  const levels=["All","Federal","State","County","Huntsville","Madison City","Triana","Unincorporated Areas","2026 Candidates"];
  const filtered=filter==="All"?OFFICIALS:OFFICIALS.filter(g=>g.level===filter);

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Every elected official with power over Madison County. Net worth before and after office, salary, top donors, voting record, criminal history, and residency — all from public records. Click any card to investigate.</p>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {levels.map(l=><button key={l} onClick={()=>setFilter(l)} style={{padding:"6px 14px",borderRadius:12,border:"1px solid #e0d8cc",background:filter===l?"#1e3a5f":"#fff",color:filter===l?"#c9a84c":"#6b7280",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
      </div>
      {filtered.map((group,gi)=>(
        <div key={gi} style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:group.color,marginBottom:10,textTransform:"uppercase"}}>{group.level} OFFICIALS</div>
          {group.officials.map((off,oi)=>(
            <div key={oi} onClick={()=>{setSelected(off);setTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":off.party==="Democrat"?"#1e40af":"#5b21b6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13.5,fontWeight:900,color:"#fff",flexShrink:0,overflow:"hidden",border:"2px solid rgba(255,255,255,.3)"}}>
                  {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                </div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                      <span style={{fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":off.party==="Democrat"?"#eff6ff":"#f5f3ff",color:off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed",border:`1px solid ${off.party==="Republican"?"#fca5a5":off.party==="Democrat"?"#93c5fd":"#c4b5fd"}`,flexShrink:0,whiteSpace:"nowrap"}}>{off.party==="Republican"?"R":"D"}</span>
                    </div>
                    <div style={{fontSize:12.5,color:"#6b7280",marginTop:1}}>{off.title}</div></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:11.5,fontWeight:700,color:"#dc2626"}}>{off.netWorth}</div>
                  <div style={{fontSize:10.5,color:"#6b7280"}}>net worth est.</div>
                </div>
              </div>
              <div style={{fontSize:13,color:"#374151",marginTop:8,lineHeight:1.5}}>{off.bio.substring(0,160)}...</div>
              <div style={{display:"flex",gap:12,marginTop:8,fontSize:11.5,color:"#6b7280"}}>
                <span>💰 {off.salary.split("—")[0].trim()}</span>
                <span>🏠 {off.residency}</span>
                <span style={{color:off.criminal==="No criminal record"||off.criminal==="No record found"?"#16a34a":"#dc2626"}}>⚖ {off.criminal}</span>
              </div>
              <div style={{fontSize:11.5,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Click to full investigation →</div>
            </div>
          ))}
        </div>
      ))}
      {selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(30,58,95,.6)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setR(null);}}}>
          <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:680,border:`3px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`,boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden",marginTop:20}}>
            <div style={{background:selected.party==="Republican"?"#991b1b":selected.party==="Democrat"?"#1e40af":"#5b21b6",padding:"18px 20px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:58,height:58,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",flexShrink:0,overflow:"hidden",border:"2px solid rgba(255,255,255,.4)"}}>
                {selected.photo?<img src={selected.photo} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{selected.avatar}</span>}
              </div>
              <div style={{flex:1}}><div style={{fontSize:19,fontWeight:900,color:"#fff"}}>{selected.name}</div><div style={{fontSize:12.5,color:"rgba(255,255,255,.8)",marginTop:2}}>{selected.title} · {selected.district}</div><div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>{[`Since ${selected.since}`,`Ends ${selected.termEnds}`,selected.party].map((t,i)=><span key={i} style={{fontSize:10.5,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.12)",padding:"2px 7px",borderRadius:2}}>{t}</span>)}</div></div>
              <button onClick={()=>{setSelected(null);setR(null);}} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:15,flexShrink:0}}>×</button>
            </div>
            <div style={{background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"10px 20px",display:"flex",gap:16,flexWrap:"wrap"}}>
              <div><div style={{fontSize:9.5,color:"#6b7280",letterSpacing:1,marginBottom:2}}>NET WORTH NOW</div><div style={{fontSize:17,fontWeight:900,color:"#b8860b"}}>{selected.netWorth}</div></div>
              <div><div style={{fontSize:9.5,color:"#6b7280",letterSpacing:1,marginBottom:2}}>BEFORE OFFICE</div><div style={{fontSize:17,fontWeight:900,color:"#6b7280"}}>{selected.netWorthPre}</div></div>
              <div style={{flex:1}}><div style={{fontSize:9.5,color:"#6b7280",letterSpacing:1,marginBottom:2}}>HOW THEY BUILT IT</div><div style={{fontSize:12.5,color:"#4a3800",lineHeight:1.4}}>{selected.netWorthHow}</div></div>
              <div><div style={{fontSize:9.5,color:"#6b7280",letterSpacing:1,marginBottom:2}}>SALARY</div><div style={{fontSize:12.5,fontWeight:700,color:"#1e3a5f"}}>{selected.salary}</div></div>
            </div>
            <div style={{background:"#f8f6f2",borderBottom:"1px solid #e0d8cc",padding:"8px 20px",display:"flex",gap:16,flexWrap:"wrap",fontSize:12.5}}>
              <span><strong>Residency:</strong> {selected.residency}</span>
              <span><strong>Criminal:</strong> <span style={{color:selected.criminal==="No criminal record"||selected.criminal==="No record found"?"#16a34a":"#dc2626"}}>{selected.criminal}</span></span>
            </div>
            <div style={{display:"flex",borderBottom:"1px solid #e0d8cc",background:"#f8f6f2"}}>
              {["bio","record","donors","votes","contact"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px 4px",border:"none",cursor:"pointer",fontSize:11.5,fontWeight:tab===t?700:500,color:tab===t?(selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"):"#6b7280",background:tab===t?"#fff":"#f8f6f2",borderBottom:tab===t?`2px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`:"2px solid transparent",fontFamily:"inherit"}}>{t==="bio"?"Profile":t==="record"?"On Record":t==="donors"?"Donors":t==="votes"?"Votes":"Contact"}</button>)}
            </div>
            <div style={{padding:"14px 20px",maxHeight:360,overflowY:"auto"}}>
              {tab==="bio"&&<div><p style={{fontSize:14,lineHeight:1.8,color:"#374151",marginBottom:12}}>{selected.bio}</p>{!r?<button className="btn btn-gold btn-full" onClick={()=>investigate(selected)} disabled={ld}>{ld?<><span className="spin"/>Investigating...</>:"🔍 Break It Down"}</button>:<div className="ai-panel"><div className="ai-panel-label">AI INVESTIGATION</div><AiResult text={r}/><button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:12.5,marginTop:8}}>Clear</button></div>}</div>}
              {tab==="record"&&<div>
                {(!selected.quotes||selected.quotes.length===0)?
                  <div style={{padding:"20px",textAlign:"center",color:"#6b7280",fontSize:14}}>Record research ongoing — check back for updates. Use the AI Investigation in the Profile tab for a current analysis.</div>:
                  selected.quotes.map((q,i)=>(
                    <div key={i} style={{marginBottom:10,borderRadius:5,overflow:"hidden",border:`1px solid ${q.flip?"#fca5a5":q.type==="environment"?"#86efac":q.type==="healthcare"?"#93c5fd":"#fcd34d"}`,borderLeft:`4px solid ${q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}`}}>
                      <div style={{padding:"8px 12px",background:q.flip?"#fef2f2":q.type==="environment"?"#f0fdf4":q.type==="healthcare"?"#eff6ff":"#fffbeb",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontSize:9.5,fontWeight:800,padding:"2px 8px",borderRadius:8,background:"rgba(0,0,0,.06)",color:q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}}>{q.flip?"⚠ SAID ONE THING, DID ANOTHER":q.type==="environment"?"🌿 ENVIRONMENT":q.type==="healthcare"?"✚ HEALTHCARE":"📋 ON RECORD"}</span>
                        {q.date&&<span style={{fontSize:9.5,color:"#6b7280"}}>{q.date}</span>}
                        {q.source&&<span style={{fontSize:9.5,color:"#6b7280"}}>· {q.source}</span>}
                      </div>
                      <div style={{padding:"10px 12px",background:"#fff"}}>
                        {q.quote&&<div style={{fontSize:14,fontStyle:"italic",color:"#1e3a5f",marginBottom:7,lineHeight:1.6,padding:"6px 10px",background:"#eff3f8",borderRadius:3,borderLeft:"3px solid #93b4d4"}}>"{q.quote}"</div>}
                        <div style={{fontSize:13.5,color:q.flip?"#7f1d1d":"#374151",lineHeight:1.65}}>{q.fact}</div>
                      </div>
                    </div>
                  ))
                }
              </div>}
                            {tab==="donors"&&<div><div style={{fontSize:10,color:"#6b7280",letterSpacing:1,marginBottom:10,fontWeight:700}}>TOP DONORS — PUBLIC RECORD</div>{selected.topDonors.map(([donor,amt],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 11px",marginBottom:5,background:i===0?"#fef2f2":"#f8f6f2",borderRadius:4,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`}}><span style={{fontSize:13,color:"#374151"}}>{donor}</span><span style={{fontSize:13.5,fontWeight:700,color:"#dc2626"}}>{amt}</span></div>)}<a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:12.5,marginTop:8}}>Search AL Campaign Finance →</button></a></div>}
              {tab==="votes"&&<div>{selected.votes.length===0?<p style={{color:"#6b7280",fontSize:13.5}}>Voting record under research.</p>:selected.votes.map((v,i)=><div key={i} style={{background:"#f8f6f2",borderRadius:4,padding:"9px 11px",marginBottom:7,borderLeft:`3px solid ${v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("NO")?"#dc2626":"#16a34a"}`}}><div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}><span style={{fontSize:13,fontWeight:700,color:"#1e3a5f",flex:1}}>{v.bill}</span><span style={{fontSize:10.5,fontWeight:700,color:v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("NO")?"#dc2626":"#16a34a",padding:"2px 7px",background:"rgba(0,0,0,.04)",borderRadius:3,flexShrink:0}}>{v.vote}</span></div><div style={{fontSize:12.5,color:"#6b7280"}}>{v.impact}</div></div>)}</div>}
              {tab==="contact"&&<div>{[["Phone",selected.contact.phone],["Office",selected.contact.office]].map(([l,v],i)=><div key={i} style={{padding:"8px 11px",background:"#f8f6f2",borderRadius:4,marginBottom:7}}><div style={{fontSize:9.5,color:"#6b7280",letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{v}</div></div>)}<a href={selected.contact.web} target="_blank" rel="noreferrer"><button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button></a></div>}
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
      {id:"equity",icon:"⚖",label:"The Two Huntsvilles: Service Inequality",sub:"PCI 41 vs 72 · $847/pupil gap · 3.7x police contacts · spending audit"},
      {id:"utilities",icon:"💧",label:"Power, Water & Utilities",sub:"HU · TVA · Madison · Triana · PFAS · rates"},
      {id:"health",icon:"✚",label:"Health System Investigation",sub:"HHHS monopoly · Medicaid gap · Insurance"},
      {id:"money",icon:"💰",label:"Follow the Money",sub:"CEO pay clocks · donor→policy pipeline · where city money goes"},
      {id:"workers",icon:"👷",label:"Workers & Child Care",sub:"$7.25/hr wage ban · $14,400/yr infant care"},
      {id:"flights",icon:"✈",label:"Airport & Dynamic Pricing",sub:"Why flights cost more · algorithmic pricing"},
    ]},
    {label:"POWER & ACCOUNTABILITY",color:C.navy,items:[
      {id:"officials",icon:"▣",label:"Officials & Elections",sub:"All officials · donors · votes · 2026 races"},
      {id:"boards",icon:"🏛",label:"Boards, Directors & Schools",sub:"All unelected bodies · school boards · utility boards · IDB"},
      
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
    if(page==="schools")   return <BoardsPage/>;
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
              {["⚡ TVA rate hike #3 in 18 months — AL delegation has introduced zero oversight bills","✚ HHHS CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers — no public vote held","💧 Triana water shows PFAS above EWG health guidelines","🏠 North Huntsville road PCI 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states"].map((t,i)=>(
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
}
