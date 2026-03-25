import{useState,useEffect,useRef,useCallback}from"react";
import{AiButton,ActionButtons,FactBlocks,ExpandText,InvestPage}from"../components/shared";

// --- HEALTH SYSTEM PAGE ---
export function HealthPage(){
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
      analysis:"HHHS pays zero federal income tax, zero state income tax, and reduced property tax — claiming approximately $63 million per year in total tax exemptions as a nonprofit. The legal justification: nonprofits must provide community benefit to the public commensurate with their exemption.\n\nHere is what HHHS does with that exemption: CEO Jeff Samz earned approximately $3.1 million in 2022 — approximately $1,490 per hour. Starting CNAs earn $14.50 per hour. Patient Care Technicians start at approximately $18/hr. Environmental Services workers start at $12.50/hr. Multiple frontline roles earn wages that qualify employees for SNAP food assistance.\n\nIn 2013, while Spillers' compensation grew, HHHS froze wages system-wide with no deadline and simultaneously increased employee health insurance premiums by $40/month and cut pension contributions. The official justification was declining reimbursements. The CEO's compensation continued to increase through this period.\n\nThe IRS requires nonprofits to disclose total community benefit spending on Form 990 Schedule H — but does not specify what counts as community benefit. HHHS has not published a clear breakdown of what it claims as community benefit as a percentage of revenue. File an IRS Form 990 inspection request or look it up free on ProPublica Nonprofit Explorer.",
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
      analysis:"On January 20, 2026, HHHS announced it would acquire Crestwood Medical Center from Community Health Systems for $450 million. Crestwood is a 180-bed hospital located 2 miles from Huntsville Hospital's main campus. Crestwood is the last remaining hospital in Huntsville not owned by HHHS. If this deal closes, HHHS will have a complete monopoly on inpatient hospital services in Huntsville — and in all of North Alabama.\n\nThe FTC has challenged similar deals. In 2023, nonprofit Novant Health announced a $140M deal to buy two North Carolina hospitals. The FTC sued, arguing it would reduce competition. Novant eventually abandoned the deal while litigation was pending. The Crestwood deal is more than 3x larger and creates an even more complete geographic monopoly.\n\nWhat a monopoly means for patients: When there is no competition, hospital prices rise — HHHS can charge more and insurers must pay. Insurance companies lose negotiating leverage and pass higher costs to employers and workers as premium increases. Blue Cross Blue Shield of Alabama — which already controls over 90% of Alabama commercial health insurance — saw ACA premiums increase 19.3% for 2026. The HHHS monopoly and the BCBS premium increases are structurally linked: each hospital HHHS acquires reduces the competition that keeps prices in check. Wages stagnate because there is only one major healthcare employer. Patients in labor disputes or with grievances have nowhere else to go.\n\nWhat you can do today: File a public comment with the FTC. Contact Rep. Dale Strong's office. The deal has not yet closed. The period for regulatory challenge is now.",
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
      analysis:"HHHS — Huntsville Hospital Health System — employs approximately 20,000 people and is the largest private employer in Madison County. With the Crestwood acquisition pending, it will soon be the only hospital employer in Huntsville. Workers who leave have limited options without relocating.\n\nDocumented patterns from Glassdoor and Indeed reviews (2024-2025): Nurses report 1 CNA assigned to 15+ patients. Registered Nurses performing transport, phlebotomy, and janitorial duties simultaneously — outside their job description. Annual raises of $0.25 or less. Pay is described as the lowest in nursing locally and does not compete with other opportunities. Equipment broken with slow or no repair. Multiple reviewers say management does not care about staff.\n\nWHO ACTUALLY BENEFITS FROM THIS WAGE STRUCTURE: CEO Jeff Samz ($3.1M/yr). The 9-member self-appointed board — including business executives and real estate developers — who approved that pay and set the nonprofit rules. The elected officials who received HHHS political donations: Tommy Battle received $45,000 from HHHS-affiliated donors; state legislators who have blocked hospital price transparency bills. The system benefits financially from keeping labor costs low while charging some of the highest procedure prices in Alabama. HHHS charges $38,000 for a knee replacement — the state average is $28,000. That price gap is pure margin, and it goes to executive compensation, facility expansion, and political donations — not worker wages.\n\nCNA wages: $14.50/hr = $30,160/yr. Federal poverty line for a family of four: $31,200. A full-time CNA at HHHS qualifies for food assistance.",
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
      analysis:"The Affordable Care Act allowed states to expand Medicaid to cover adults earning up to 138% of the federal poverty level. The federal government pays 90% of the cost — permanently. Alabama refuses. As of 2026, 295,000 Alabamians earn too much for traditional Medicaid but too little for ACA marketplace subsidies. They are uninsured.\n\nWho benefits from the refusal: Health insurance companies — their market shrinks if Medicaid expands. Gov. Ivey received $420,000 from health insurance industry PACs. Sen. Orr received donations from the Business Council of Alabama, which has lobbied against expansion.\n\nHHHS's role: HHHS absorbs significant uncompensated care costs from uninsured patients. It then reports this as 'community benefit' on its IRS Form 990 to justify its nonprofit tax exemption. The Medicaid refusal and HHHS's expansion are structurally linked — more uninsured patients means more uncompensated care, which means a bigger 'community benefit' claim, which justifies the nonprofit exemption that saves HHHS $63M/year in taxes.\n\nThe connected loop: Ivey refuses Medicaid (protecting insurance donors) → 47,000+ Madison County residents are uninsured → HHHS provides uncompensated care → HHHS claims this as community benefit → HHHS retains $63M/year in tax exemptions → HHHS donates to Mayor Battle's campaign → Battle never questions HHHS nonprofit status or board structure. Everyone in the loop benefits except the uninsured resident.",
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
            {analysisOpen[k]?"Hide Analysis ▲":"Decode This 🔍"}
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

export default HealthPage;
