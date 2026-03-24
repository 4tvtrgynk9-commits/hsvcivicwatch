import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

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
    {label:"HCS AP Participation Rate: Jemison (N) vs Huntsville High (S)",north:44,south:65,northLabel:"44% Jemison (N)",southLabel:"65% Huntsville High (S)",note:"Jemison (north): 13 AP programs, 44% participation. Columbia (west): 4 AP programs, 17% participation. Columbia's 87% minority enrollment is treated more like north than south despite its location.",color:"#ea580c"},
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
        {[{id:"overview",label:"Overview"},{id:"hcs",label:"🏫 HCS Schools"},{id:"madison",label:"🏫 Madison County"},{id:"city",label:"🏫 Madison City"},{id:"action",label:"✊ Take Action"}].map(t=>(
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
      {tab==="city"&&<SchoolsMadisonCityTab/>}
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
    {school:"Huntsville High",area:"South — downtown / Monte Sano zone",apRate:65,mathProf:44,minority:39,econDis:30,rank:"#14 AL / Top 8%",c:SOUTH_COLOR,
     white:61,black:23,hispanic:8,
     perPupil:7531,
     note:"61% White, 23% Black. 65% AP participation — highest in HCS. Serves some of the wealthiest HCS zip codes including Monte Sano and Five Points."},
    {school:"Grissom High",area:"Southeast Huntsville — Jones Valley / Haysland",apRate:46,mathProf:31,minority:45,econDis:43,rank:"#41 AL / Top 25%",c:SOUTH_COLOR,
     white:52,black:17,hispanic:21,
     perPupil:7893,
     note:"52% White, 17% Black. Growing Hispanic population (21%). 2007 Blue Ribbon School. Still strong academically but declining vs 2015 peak. Free lunch up from 16% to 43%."},
    {school:"Columbia High",area:"West Huntsville — NOT south Huntsville",apRate:17,mathProf:12,minority:87,econDis:50,rank:"#199-297 AL / Bottom 50%",c:WEST_COLOR,
     white:13,black:52,hispanic:28,
     perPupil:null,
     note:"52% Black, 28% Hispanic, 13% White — the most diverse HCS high school. 87% minority. Only 17% AP participation. West Huntsville receives less infrastructure investment than south."},
    {school:"Jemison High",area:"North Huntsville — Pulaski Pike",apRate:44,mathProf:6,minority:93,econDis:64,rank:"#170 AL / Bottom 50%",c:NORTH_COLOR,
     white:7,black:73,hispanic:16,
     perPupil:11834,
     note:"73% Black, 16% Hispanic, 7% White. 93% minority. Despite spending MORE per student ($11,834) than Grissom ($7,893) due to federal Title I funds, math proficiency is 6% vs Grissom's 31%. This gap is structural — it reflects decades of neighborhood disinvestment, not school effort."},
  ];


  function Card({school,area,apRate,mathProf,minority,econDis,rank,c,note,white,black,hispanic,perPupil}){
    // Determine label based on color
    const areaType = c===NORTH_COLOR?"NORTH":c===WEST_COLOR?"WEST":"SOUTH";
    const areaLabel = {"NORTH":"North Huntsville","WEST":"West Huntsville","SOUTH":"South Huntsville"}[areaType];
    const areaTagColor = {"NORTH":"#dc2626","WEST":"#9333ea","SOUTH":"#2563eb"}[areaType];
    return(
      <div style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+c}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
          <div>
            <span style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{school}</span>
            <span style={{display:"inline-block",fontSize:9,fontWeight:700,color:"#fff",background:areaTagColor,borderRadius:8,padding:"1px 7px",marginLeft:8,letterSpacing:.5}}>{areaLabel}</span>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:c,background:c+"15",padding:"2px 8px",borderRadius:8}}>{rank}</span>
        </div>
        {/* Race/ethnicity bar */}
        {white!=null&&(
          <div style={{marginBottom:8}}>
            <div style={{fontSize:9,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Student Demographics (NCES 2023-24)</div>
            <div style={{display:"flex",height:16,borderRadius:3,overflow:"hidden",gap:1}}>
              <div style={{width:white+"%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {white>10&&<span style={{fontSize:8,fontWeight:700,color:"#374151"}}>{white}% W</span>}
              </div>
              <div style={{width:black+"%",background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {black>8&&<span style={{fontSize:8,fontWeight:700,color:"#fff"}}>{black}% B</span>}
              </div>
              <div style={{width:hispanic+"%",background:"#c9a84c",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {hispanic>8&&<span style={{fontSize:8,fontWeight:700,color:"#1e3a5f"}}>{hispanic}% H</span>}
              </div>
              <div style={{flex:1,background:"#d1d5db"}}/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:3,fontSize:9,color:"#6b7280",flexWrap:"wrap"}}>
              <span><span style={{display:"inline-block",width:8,height:8,background:"#e5e7eb",borderRadius:1,marginRight:3}}/>White: {white}%</span>
              <span><span style={{display:"inline-block",width:8,height:8,background:"#1e3a5f",borderRadius:1,marginRight:3}}/>Black: {black}%</span>
              <span><span style={{display:"inline-block",width:8,height:8,background:"#c9a84c",borderRadius:1,marginRight:3}}/>Hispanic: {hispanic}%</span>
              <span style={{color:c,fontWeight:700}}>{minority}% total minority enrollment</span>
            </div>
          </div>
        )}
        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
          {[
            {l:"AP Participation",v:apRate+"%",color:apRate>=50?"#16a34a":apRate>=30?"#c9a84c":"#dc2626"},
            {l:"Math Proficiency",v:mathProf+"%",color:mathProf>=40?"#16a34a":mathProf>=20?"#c9a84c":"#dc2626"},
            {l:"Econ. Disadvantaged",v:econDis+"%",color:econDis<=30?"#16a34a":econDis<=50?"#c9a84c":"#dc2626"},
            {l:"Per-Pupil Spend",v:perPupil?"$"+perPupil.toLocaleString():"N/A",color:"#374151"},
          ].map(({l,v,color},j)=>(
            <div key={j} style={{padding:"6px 8px",background:"#f8f6f2",borderRadius:3,border:"1px solid #e0d8cc"}}>
              <div style={{fontSize:8,color:"#6b7280",letterSpacing:.4,marginBottom:1,textTransform:"uppercase"}}>{l}</div>
              <div style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:12,color:"#374151",lineHeight:1.65,fontStyle:"italic"}}>{note}</div>
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

      {/* Racial disparity explainer */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #dc2626"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>The Racial Disparity — By the Numbers</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[
            {label:"Huntsville High (South — 61% White)",mathProf:"44%",ap:"65%",econ:"30%",perPupil:"$7,531",c:"#93b4d4"},
            {label:"Grissom High (Southeast — 52% White)",mathProf:"31%",ap:"46%",econ:"43%",perPupil:"$7,893",c:"#93b4d4"},
            {label:"Columbia High (West — 87% minority, 52% Black)",mathProf:"12%",ap:"17%",econ:"50%",perPupil:"N/A",c:"#9333ea"},
            {label:"Jemison High (North — 93% minority, 73% Black)",mathProf:"6%",ap:"44%",econ:"64%",perPupil:"$11,834",c:"#dc2626"},
          ].map((s,i)=>(
            <div key={i} style={{padding:"10px 12px",borderRadius:4,border:"1px solid #e0d8cc",borderLeft:"3px solid "+s.c}}>
              <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.4}}>{s.label}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {[["Math Proficient",s.mathProf],["AP Rate",s.ap],["Free Lunch",s.econ],["Per Pupil",s.perPupil]].map(([l,v],j)=>(
                  <div key={j} style={{textAlign:"center",minWidth:56}}>
                    <div style={{fontFamily:"monospace",fontSize:15,fontWeight:800,color:s.c}}>{v}</div>
                    <div style={{fontSize:8,color:"#6b7280",letterSpacing:.3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"#fef2f2",borderRadius:4,padding:"10px 12px",marginBottom:10,fontSize:13,color:"#7f1d1d",lineHeight:1.75}}>
          <strong>Same school district. Same superintendent. Same school board.</strong> A student at Huntsville High is 7x more likely to be proficient in math than a student at Jemison — while attending a school 9 miles away. The student bodies are not separated by district lines or by choice. They are separated by where their families could afford to live — which is shaped by decades of redlining, annexation patterns that prioritized south Huntsville infrastructure, and TIF financing that redirected tax growth away from north Huntsville schools.
        </div>
        <div style={{background:"#eff3f8",borderRadius:4,padding:"10px 12px",fontSize:12.5,color:"#1e3a5f",lineHeight:1.75}}>
          <strong>The spending paradox:</strong> Jemison receives <em>more</em> per-student funding ($11,834) than Grissom ($7,893) — because federal Title I dollars and remediation funding flow to higher-need schools. But money spent catching up is not the same as money invested in foundation. Grissom's $7,893 builds on neighborhood wealth, stable housing, and parent professional networks. Jemison's $11,834 is spent addressing poverty, chronic absenteeism, trauma, and the compounding effects of underfunded elementary years. Higher spending at Jemison is evidence of deeper need — not evidence of fairness.
        </div>
      </div>

      </div>
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

            {/* HCS Middle Schools */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>HCS Middle Schools — Where the Gap Compounds</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:12,lineHeight:1.6}}>The racial and economic gap doesn't begin in high school. By 8th grade, the gap in math proficiency between north and south Huntsville middle schools has already reached a 20-to-1 ratio. These are children in the same city, the same district, the same school board.</div>
        {[
          {school:"Hampton Cove Middle",area:"East — feeds Huntsville High",zone:"SOUTH/EAST",mathProf:66,econDis:11,white:78,black:5,hispanic:6,rank:"#11 AL / 5-star",c:"#93b4d4",
           note:"78% White, 5% Black. Only 10.8% free lunch. Top 11 in Alabama. Feeds directly into Huntsville High — the district's top high school. The feeder pipeline from Hampton Cove to Huntsville High is the clearest example of how geography determines outcome."},
          {school:"Mountain Gap Middle",area:"Southeast — Grissom zone",zone:"SOUTH",mathProf:43,econDis:34,white:64,black:17,hispanic:10,rank:"#44 AL / 5-star",c:"#93b4d4",
           note:"64% White, 17% Black. Strong academics. Scheduled to close and consolidate under the 10-year capital plan — community concern about what happens to its students."},
          {school:"Huntsville Junior High",area:"Central/South — feeds Huntsville High",zone:"SOUTH",mathProf:22,econDis:38,white:null,black:null,hispanic:null,rank:"#209 AL",c:"#93b4d4",
           note:"Feeds into Huntsville High. 22% math proficiency — lower than you'd expect for a south Huntsville school, reflecting the school's diverse zip codes including some transition neighborhoods."},
          {school:"Chapman Middle",area:"West Huntsville — feeds Columbia High",zone:"WEST",mathProf:5,econDis:72,white:10,black:55,hispanic:30,rank:"Bottom 20% AL",c:"#9333ea",
           note:"55% Black, 30% Hispanic, 10% White. 72% free lunch. 5% math proficiency — among the lowest in Alabama. Feeds into Columbia High. The transition from Chapman to Columbia represents the west Huntsville pipeline that mirrors the north Huntsville pattern."},
          {school:"McNair Jr High (Davis Hills)",area:"North Huntsville — feeds Jemison High",zone:"NORTH",mathProf:2,econDis:87,white:5,black:72,hispanic:17,rank:"Bottom 13% AL / 1-star",c:"#dc2626",
           note:"72% Black, 17% Hispanic, 5% White. 87% free lunch. Only 2.48% of 7th-graders proficient in math — the lowest in HCS and among the lowest in the state. Highest student-to-teacher ratio in HCS (22.5:1). Feeds directly into Jemison High School."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+s.c}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:9,fontWeight:700,color:"#fff",background:{"SOUTH":"#2563eb","EAST":"#2563eb","SOUTH/EAST":"#2563eb","WEST":"#9333ea","NORTH":"#dc2626"}[s.zone]||"#6b7280",borderRadius:8,padding:"1px 7px",letterSpacing:.5}}>{s.zone.replace("/","/​")}</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:s.c,background:s.c+"15",padding:"2px 8px",borderRadius:8}}>{s.rank}</span>
            </div>
            {/* Race bar */}
            {s.white!=null&&(
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",height:14,borderRadius:3,overflow:"hidden",gap:1,marginBottom:3}}>
                  <div style={{width:s.white+"%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {s.white>12&&<span style={{fontSize:8,fontWeight:700,color:"#374151"}}>{s.white}%W</span>}
                  </div>
                  <div style={{width:s.black+"%",background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {s.black>8&&<span style={{fontSize:8,fontWeight:700,color:"#fff"}}>{s.black}%B</span>}
                  </div>
                  <div style={{width:s.hispanic+"%",background:"#c9a84c",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {s.hispanic>8&&<span style={{fontSize:8,fontWeight:700,color:"#1e3a5f"}}>{s.hispanic}%H</span>}
                  </div>
                  <div style={{flex:1,background:"#d1d5db"}}/>
                </div>
              </div>
            )}
            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:6}}>
              {[
                {l:"8th Grade Math",v:s.mathProf+"%",color:s.mathProf>=40?"#16a34a":s.mathProf>=20?"#c9a84c":"#dc2626"},
                {l:"Free Lunch",v:s.econDis+"%",color:s.econDis<=30?"#16a34a":s.econDis<=55?"#c9a84c":"#dc2626"},
                {l:"Zone",v:s.area,color:"#374151"},
              ].map(({l,v,color},j)=>(
                <div key={j} style={{padding:"6px 8px",background:"#f8f6f2",borderRadius:3,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:8,color:"#6b7280",letterSpacing:.4,marginBottom:1,textTransform:"uppercase"}}>{l}</div>
                  <div style={{fontFamily:j<2?"monospace":"inherit",fontSize:j<2?14:11,fontWeight:700,color,lineHeight:1.2}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11.5,color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>{s.note}</div>
          </div>
          )
        )}
        {/* Middle school disparity callout */}
        <div style={{background:"#fef2f2",borderRadius:4,padding:"10px 12px",marginTop:4,fontSize:13,color:"#7f1d1d",lineHeight:1.75}}>
          <strong>The math gap at middle school: Hampton Cove 66% proficient vs McNair 2% proficient.</strong> That is a 33-to-1 ratio — in the same city, the same district, the same budget allocation. By the time these students reach high school, the gap has been building for 9 years. Hampton Cove feeds Huntsville High. McNair feeds Jemison. The pipeline is not an accident.
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
      <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderLeft:"4px solid #374151",borderRadius:4,padding:"10px 13px",marginBottom:14,fontSize:12.5,color:"#1e3a5f",lineHeight:1.6}}>
        <strong>Madison County Schools (MCSS)</strong> serves ~22,000 students across unincorporated Madison County — Harvest, Toney, Meridianville, New Hope, Hazel Green. It is the least-funded of the three systems yet faces the fastest unincorporated growth. Schools here are often compared unfavorably to Madison City — but they serve a fundamentally different population.
      </div>

      {/* MCSS High Schools */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>MCSS High Schools — NCES 2023-24</div>
        {[
          {school:"Sparkman High School",area:"Harvest / north Madison County",mathProf:26,apRate:45,econDis:39,white:44,black:36,hispanic:10,rank:"#64 AL",students:1770,c:"#374151",
           note:"44% White, 36% Black — most racially diverse MCSS school. Overcrowded since 2006 with a separate 9th-grade campus. Student-teacher ratio 20:1 — highest in MCSS. Despite challenges, 7 consecutive state girls basketball championships 2018-2024."},
          {school:"Hazel Green High School",area:"Hazel Green / northwest county",mathProf:27,apRate:45,econDis:44,white:57,black:22,hispanic:12,rank:"#38 AL",students:1500,c:"#374151",
           note:"57% White, 22% Black. Ranked 38th in Alabama — MCSS's top-performing high school. 25 National Merit Scholars. Strong science and academic programs despite serving a rural/suburban area with 44% economic disadvantage."},
          {school:"New Hope High School",area:"Rural east Madison County",mathProf:24,apRate:35,econDis:50,white:72,black:10,hispanic:8,rank:"#52 AL",students:800,c:"#374151",
           note:"72% White, 10% Black. Rural school serving east county. 50% economic disadvantage despite high white percentage — reflects rural white poverty that is less visible than urban poverty but equally real."},
          {school:"Madison County High",area:"Rural south county",mathProf:20,apRate:28,econDis:55,white:60,black:22,hispanic:12,rank:"Bottom 50% AL",students:900,c:"#ea580c",
           note:"60% White, 22% Black. Lowest-performing MCSS high school. Serves southern unincorporated areas with less infrastructure investment than Harvest corridor schools."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+s.c}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
              <div>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:10,color:"#6b7280",marginLeft:8}}>{s.area} · {s.students.toLocaleString()} students</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:s.c,background:s.c+"15",padding:"2px 8px",borderRadius:8}}>{s.rank}</span>
            </div>
            {/* Race bar */}
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",height:14,borderRadius:3,overflow:"hidden",gap:1,marginBottom:3}}>
                <div style={{width:s.white+"%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.white>12&&<span style={{fontSize:8,fontWeight:700,color:"#374151"}}>{s.white}%W</span>}
                </div>
                <div style={{width:s.black+"%",background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.black>8&&<span style={{fontSize:8,fontWeight:700,color:"#fff"}}>{s.black}%B</span>}
                </div>
                <div style={{width:s.hispanic+"%",background:"#c9a84c",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.hispanic>8&&<span style={{fontSize:8,fontWeight:700,color:"#1e3a5f"}}>{s.hispanic}%H</span>}
                </div>
                <div style={{flex:1,background:"#d1d5db"}}/>
              </div>
              <div style={{display:"flex",gap:10,fontSize:9,color:"#6b7280",flexWrap:"wrap"}}>
                <span>W: {s.white}%</span><span>B: {s.black}%</span><span>H: {s.hispanic}%</span>
                <span style={{fontWeight:700,color:s.c}}>{100-s.white}% minority</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:6}}>
              {[
                {l:"Math Proficiency",v:s.mathProf+"%",color:s.mathProf>=35?"#16a34a":s.mathProf>=20?"#c9a84c":"#dc2626"},
                {l:"AP Participation",v:s.apRate+"%",color:s.apRate>=40?"#16a34a":s.apRate>=25?"#c9a84c":"#dc2626"},
                {l:"Free Lunch",v:s.econDis+"%",color:s.econDis<=30?"#16a34a":s.econDis<=50?"#c9a84c":"#dc2626"},
              ].map(({l,v,color},j)=>(
                <div key={j} style={{padding:"6px 8px",background:"#f8f6f2",borderRadius:3,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:8,color:"#6b7280",letterSpacing:.4,marginBottom:1,textTransform:"uppercase"}}>{l}</div>
                  <div style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11.5,color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* MCSS Middle Schools */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>MCSS Middle Schools</div>
        {[
          {school:"Sparkman Middle School",area:"Harvest",mathProf:24,econDis:60,white:42,black:38,hispanic:12,note:"42% White, 38% Black. 60% free lunch. Discovery Middle (same county, Madison City) is 72% math proficient with 8% free lunch. Same county. Different world."},
          {school:"Hazel Green Middle",area:"Hazel Green",mathProf:27,econDis:50,white:55,black:25,hispanic:12,note:"55% White, 25% Black. Slightly better resourced than Sparkman Middle. Feeds into the stronger Hazel Green HS pipeline."},
          {school:"Discovery Middle (MCS)",area:"Madison City — comparison",mathProf:72,econDis:8,white:64,black:12,hispanic:10,note:"Madison City school included for comparison. 64% White, 8% free lunch, 72% math proficient. 9 miles from Sparkman Middle. Same county commission. $4,500+ more per student from property taxes alone."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:8,padding:"10px 12px",borderRadius:4,border:"1px solid #e0d8cc",borderLeft:"3px solid "+(i===2?"#16a34a":"#374151"),background:i===2?"#f0fdf4":"#fafaf8"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:5}}>
              <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
              {i===2&&<span style={{fontSize:9,fontWeight:700,color:"#fff",background:"#16a34a",borderRadius:8,padding:"1px 7px"}}>MADISON CITY COMPARISON</span>}
            </div>
            <div style={{display:"flex",height:12,borderRadius:2,overflow:"hidden",gap:1,marginBottom:5}}>
              <div style={{width:s.white+"%",background:"#e5e7eb"}}/><div style={{width:s.black+"%",background:"#1e3a5f"}}/><div style={{width:s.hispanic+"%",background:"#c9a84c"}}/><div style={{flex:1,background:"#d1d5db"}}/>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11,marginBottom:4}}>
              <span>W:{s.white}% B:{s.black}% H:{s.hispanic}%</span>
              <span style={{fontWeight:700,color:s.mathProf>=50?"#16a34a":s.mathProf>=25?"#c9a84c":"#dc2626"}}>Math: {s.mathProf}%</span>
              <span style={{color:"#6b7280"}}>Free lunch: {s.econDis}%</span>
            </div>
            <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Three-district comparison */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #dc2626"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Three Districts — Same County — Three Outcomes</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#1e3a5f",color:"#fff"}}>
                {["Metric","Madison City (MCS)","Huntsville City (HCS)","Madison County (MCSS)"].map((h,i)=>(
                  <th key={i} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:.5}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Students","~12,000","~24,000","~22,000"],
                ["Est. Per-Pupil","~$10,000","~$12,917","~$8,409"],
                ["Econ. Disadvantaged","~18%","~48%","~42%"],
                ["Top HS Math Prof.","51% (Clemens)","44% (HHS)","27% (Hazel Green)"],
                ["Lowest HS Math Prof.","~35%","6% (Jemison)","20% (MC High)"],
                ["% White (district avg)","~60%","~44%","~55%"],
                ["2026 Board Elections","All 5 seats","Districts 2,3,4","All seats"],
              ].map((row,i)=>(
                <tr key={i} style={{background:i%2===0?"#f8f6f2":"#fff",borderBottom:"1px solid #e0d8cc"}}>
                  {row.map((cell,j)=>(
                    <td key={j} style={{padding:"8px 10px",fontSize:j===0?12:12.5,fontWeight:j===0?600:400,color:j===0?"#374151":"#1e3a5f"}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{background:"#fef2f2",borderRadius:4,padding:"9px 12px",marginTop:10,fontSize:12.5,color:"#7f1d1d",lineHeight:1.7}}>
          MCSS spends <strong>$4,508 less per student</strong> than HCS yet serves a comparably disadvantaged population. The gap is driven almost entirely by property tax revenue — Madison City homes are assessed higher, generating more local funding per student. The county commission governs all three areas but has no authority over how these three separate school systems spend money. The only lever available is the school board ballot.
        </div>
      </div>

      {/* Notable achievements */}
      <div className="card" style={{padding:"14px 16px",marginBottom:12,borderLeft:"4px solid #16a34a"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#16a34a",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>MCSS — What They Get Right Despite the Challenges</div>
        {[
          {school:"Sparkman High",award:"7 consecutive 6A state basketball championships — girls (2018-2024)"},
          {school:"Sparkman HS Drumline",award:"Consistently top 5 nationally — SHS Indoor Drumline"},
          {school:"Hazel Green High",award:"25 National Merit Scholars · Strong STEM programs · Ranked #38 in Alabama"},
          {school:"New Hope High",award:"Ranked #52 in Alabama — strong academic record for a rural school its size"},
        ].map((a,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:7,paddingBottom:7,borderBottom:i<3?"1px solid #d1fae5":"none"}}>
            <span style={{fontSize:14,flexShrink:0}}>🏆</span>
            <div>
              <div style={{fontSize:12.5,fontWeight:700,color:"#1e3a5f"}}>{a.school}</div>
              <div style={{fontSize:12,color:"#374151"}}>{a.award}</div>
            </div>
          </div>
        ))}
      </div>

      <ActionButtons title="CONTACT MCSS" actions={[
        {label:"MCSS Board — (256) 852-2557",tel:"2568522557"},
        {label:"Email MCSS Superintendent",email:"superintendent@mcssk12.org",subject:"Constituent Request — School Funding Equity",body:"Dear MCSS Superintendent,\n\nI am requesting information on how MCSS plans to address the documented funding gap between Madison County Schools and Madison City Schools — specifically the estimated $4,500 per-pupil spending difference driven by property tax disparities.\n\nWhat advocacy is MCSS leadership doing at the state level to address the foundation program funding formula?\n\n[Your Name]"},
        {label:"MCSS Board Meetings",href:"https://www.mcssk12.org"},
        {label:"AL Legislature — School Funding",href:"https://www.legislature.state.al.us"},
      ]}/>
    </div>
  );
}

function SchoolsMadisonCityTab(){
  return(
    <div>
      <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"4px solid #16a34a",borderRadius:4,padding:"10px 13px",marginBottom:14,fontSize:12.5,color:"#14532d",lineHeight:1.6}}>
        <strong>Madison City Schools (MCS)</strong> is the fastest-growing district in Madison County, serving ~12,000 students in 14 schools with a budget of ~$120M/yr. It consistently outperforms both HCS and MCSS academically — but the reasons reveal as much about wealth sorting as school quality.
      </div>

      <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Madison City High Schools — NCES 2023-24</div>
        {[
          {school:"James Clemens High School",area:"West Madison — largest MCS high school",mathProf:51,apRate:58,econDis:25,white:55,black:20,hispanic:13,rank:"Top 10 AL",students:2200,
           note:"55% White, 20% Black, 13% Hispanic — the most diverse MCS high school. Named for Madison County's first African-American teacher. 58% AP participation. Ranked top 10 in Alabama consistently. Named after a historic figure while serving a relatively privileged population — its demographics reflect the city's rapid growth attracting higher-income families.",
           c:"#16a34a"},
          {school:"Bob Jones High School",area:"East Madison",mathProf:40,apRate:46,econDis:29,white:62,black:16,hispanic:10,rank:"Top 30 AL",students:1800,
           note:"62% White, 16% Black. Top 30 in Alabama. Strong STEM and performing arts. East Madison serves older, more established neighborhoods with slightly higher economic advantage than west Madison.",
           c:"#16a34a"},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #d1fae5",borderLeft:"4px solid "+s.c}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
              <div>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.school}</span>
                <span style={{fontSize:10,color:"#6b7280",marginLeft:8}}>{s.area} · {s.students.toLocaleString()} students</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:s.c,background:s.c+"20",padding:"2px 8px",borderRadius:8}}>{s.rank}</span>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{fontSize:9,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Student Demographics</div>
              <div style={{display:"flex",height:16,borderRadius:3,overflow:"hidden",gap:1,marginBottom:3}}>
                <div style={{width:s.white+"%",background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.white>12&&<span style={{fontSize:8,fontWeight:700,color:"#374151"}}>{s.white}%W</span>}
                </div>
                <div style={{width:s.black+"%",background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.black>8&&<span style={{fontSize:8,fontWeight:700,color:"#fff"}}>{s.black}%B</span>}
                </div>
                <div style={{width:s.hispanic+"%",background:"#c9a84c",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s.hispanic>8&&<span style={{fontSize:8,fontWeight:700,color:"#1e3a5f"}}>{s.hispanic}%H</span>}
                </div>
                <div style={{flex:1,background:"#d1d5db"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:6}}>
              {[["Math Prof.",s.mathProf+"%",s.mathProf>=45?"#16a34a":"#c9a84c"],["AP Rate",s.apRate+"%","#16a34a"],["Free Lunch",s.econDis+"%","#374151"],["State Rank",s.rank,"#16a34a"]].map(([l,v,c],j)=>(
                <div key={j} style={{padding:"5px 7px",background:"#f0fdf4",borderRadius:3,border:"1px solid #d1fae5"}}>
                  <div style={{fontSize:8,color:"#6b7280",letterSpacing:.4,marginBottom:1}}>{l}</div>
                  <div style={{fontSize:j===3?10:13,fontWeight:700,color:c,lineHeight:1.2}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11.5,color:"#374151",lineHeight:1.65,fontStyle:"italic"}}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* The Madison City advantage explained */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #1e3a5f"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Why MCS Outperforms — What the Numbers Actually Show</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[["Econ. Disadvantaged","MCS ~18%","HCS ~48%   MCSS ~42%","The single biggest predictor of test scores is family income. MCS simply serves fewer low-income students."],
            ["Per-Pupil Spending","MCS ~$10,000","HCS ~$12,917  MCSS ~$8,409","MCS spends LESS per student than HCS yet dramatically outperforms. Money follows need — higher spending at HCS reflects higher need, not higher quality."],
            ["Population Growth","MCS +15%/yr","HCS stable  MCSS +12%","Rapid growth brings new residents self-selecting for schools — a self-reinforcing cycle of high earners choosing Madison for its schools, which then remain high-performing because of who attends."],
          ].map(([l,v1,v2,note],i)=>(
            <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>{l}</div>
              <div style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:"#16a34a",marginBottom:3}}>{v1}</div>
              <div style={{fontSize:10,color:"#6b7280",marginBottom:6}}>{v2}</div>
              <div style={{fontSize:10.5,color:"#374151",lineHeight:1.5,fontStyle:"italic"}}>{note}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#1e3a5f",borderRadius:4,padding:"10px 12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#c9a84c",marginBottom:4}}>THE GROWTH RISK AHEAD</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.75}}>
            Madison City is annexing new subdivisions faster than it can build schools. James Clemens is already near capacity. If rapid growth continues without planned school construction, MCS will face the same overcrowding that is choking Sparkman. Mayor Bartlett — a former MCS board president — now controls Madison Utilities board appointments. Whether she prioritizes school infrastructure over utility expansion will define her administration.
          </div>
        </div>
      </div>

      
      {/* Uncomfortable truth */}
      <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #1e3a5f"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>The Uncomfortable Truth About Madison City Schools</div>
        <div style={{background:"#1e3a5f",borderRadius:4,padding:"12px 14px",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"#c9a84c",marginBottom:6}}>ACHIEVEMENT WITHOUT EQUITY IS JUST GEOGRAPHY</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>Madison City Schools are excellent largely because of who lives in Madison — not because of superior teaching or funding. The district benefits from decades of residential sorting. Higher-income families moved to Madison partly to access its schools. Their children arrive better housed, better fed, with more books at home and more professional adult models. The schools then get credit for outcomes that community wealth largely produced. Meanwhile, students at Jemison and Sparkman arrive with compounded disadvantages and get blamed for low test scores. Same state. Same standards. Different starting lines.</div>
        </div>
        {[
          {l:"Per-Pupil Spending",mcs:"~$10,000",hcs:"~$12,917",note:"MCS spends LESS per student than HCS yet dramatically outperforms — spending alone does not explain the gap."},
          {l:"Economic Disadvantage",mcs:"~18%",hcs:"~48%",note:"Family income is the single strongest predictor of academic outcomes — more than teachers, funding, or facilities."},
          {l:"% White Students",mcs:"~60%",hcs:"~44%",note:"Correlates with higher property values, more stable housing, and stronger parental professional networks."},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:7,padding:"7px 10px",background:"#f8f6f2",borderRadius:3,border:"1px solid #e0d8cc"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",marginBottom:2}}>{r.l}</div>
              <div style={{fontSize:11.5,color:"#6b7280",fontStyle:"italic"}}>{r.note}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:700,color:"#16a34a"}}>MCS: {r.mcs}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f"}}>HCS: {r.hcs}</div>
            </div>
          </div>
        ))}
      </div>

      <ActionButtons title="CONTACT MCS" actions={[
        {label:"MCS — (256) 772-2520",tel:"2567722520"},
        {label:"Email MCS Superintendent",email:"superintendent@madisoncityschools.org",subject:"Constituent Request — Growth Planning",body:"Dear MCS Superintendent,\n\nAs Madison City continues rapid residential growth, I am requesting the board publish a capacity plan for James Clemens and Bob Jones High Schools addressing projected overcrowding over the next 5 years.\n\n[Your Name]"},
        {label:"MCS Board Meetings",href:"https://www.madisoncityschools.org"},
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

export { EquityPage, SchoolsPage, SchoolsHCSTab, SchoolsMadisonTab, SchoolsMadisonCityTab, SchoolsActionTab };
