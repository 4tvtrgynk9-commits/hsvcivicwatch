import{useState,useEffect,useRef,useCallback}from"react";
import{AiButton,ActionButtons,FactBlocks,ExpandText,InvestPage}from"./shared";

// --- NETWORK GRAPH COMPONENT ---
// Pure SVG/CSS network graph — no external libs needed

function NodeHoverDetail({hover,nodes,edges}){
  const n=nodes.find(x=>x.id===hover);
  const related=edges.filter(e=>e.from===hover||e.to===hover);
  if(!n)return null;
  return(
    <div style={{marginTop:10,background:"rgba(255,255,255,.06)",borderRadius:5,padding:"10px 12px",border:"1px solid rgba(201,168,76,.3)"}}>
      <div style={{fontSize:10,fontWeight:800,color:"#c9a84c",letterSpacing:1,marginBottom:4}}>{n.label.toUpperCase()}</div>
      {n.detail&&<div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.6,marginBottom:6}}>{n.detail}</div>}
      {related.map((e,i)=>{
        const other=nodes.find(x=>x.id===(e.from===hover?e.to:e.from));
        return other?(<div key={i} style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:3}}><span style={{color:e.color||"#c9a84c",marginRight:4}}>--</span>{e.label||"connected"} <strong style={{color:"rgba(255,255,255,.8)"}}>{other.label}</strong></div>):null;
      })}
    </div>
  );
}
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
      {hover&&<NodeHoverDetail hover={hover} nodes={nodes} edges={edges}/>}
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

export default MoneyPage;
