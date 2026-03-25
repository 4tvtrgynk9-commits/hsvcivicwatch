import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

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
      analysis:"Federal minimum wage: $7.25/hr — unchanged since 2009. A full-time worker at this rate earns $15,080/year, below the federal poverty line for a family of two ($20,440). Alabama has not raised its state minimum wage in 16 years. In 2015, Birmingham passed a city ordinance raising the local minimum wage. Alabama immediately passed a preemption law blocking it. In 2023, Sen. Arthur Orr sponsored SB 88 codifying that cities and counties permanently cannot exceed the federal floor.\n\nOrr received $45,000 from the Business Council of Alabama (BCA) before and after sponsoring this bill. The BCA represents the large employers — retail, fast food, healthcare — who benefit most from keeping wages at the federal minimum. Amazon, operating in Huntsville with IDB property tax abatements worth millions, pays its Alabama warehouse workers at or near the rate it sets internally — not because of any state requirement to do better.\n\nThe downstream effects are documented: $7.25/hr workers cannot afford Huntsville's $1,200/month infant care. They cannot afford BCBS health premiums at $490/month. They cannot afford the $163/month auto insurance required to drive to work. The minimum wage and every other cost discussed on this app are part of the same system.\n\nContact Sen. Arthur Orr directly — (334) 242-7895 — and demand SB 88 repeal. His Senate District 8 seat is on the 2026 ballot. Tanya Reeves (D) has announced a challenge. Register to vote at sos.alabama.gov — deadline is 15 days before any election.",
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
      analysis:"Huntsville area infant care runs approximately $1,200/month ($14,400/year). For a parent earning $30,000/year, that is 48% of gross income — before taxes, rent, food, or transportation. The federal poverty guideline for a family of three is $25,820. Child care costs are the primary driver of why a single parent needs $41.34/hour to achieve a living wage in Madison County.\n\nAlabama ranks last or near-last nationally in state investment in early childhood education. The CHOOSE Act (2023) created education savings accounts — but 67% of initial recipients were already in private school. Meanwhile public Pre-K serves 30% of 4-year-olds. Head Start in Madison County operates at 35% of eligible enrollment capacity with 65% of eligible children on waiting lists.\n\nCompare: Washington DC publicly funds Pre-K for all children from age 3. Vermont's Child Care Financial Assistance Program covers full cost for low-income families. These are not radical experiments — they are existing programs in peer states that have measurably improved workforce participation, reduced poverty, and increased long-term tax revenue. Alabama has chosen not to implement them.\n\nContact your state representatives and demand: (1) Expansion of Alabama First Class Pre-K funding, (2) Child Care Assistance Program (CCAP) Assistance Program) expansion to cover more families, (3) Opposition to CHOOSE Act vouchers that divert funding from public Pre-K. Find your state legislator at legislature.alabama.gov. The 2026 session begins in February — now is when these decisions are made.",
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
            {analysisOpen[k]?"Hide ▲":"Decode This 🔍"}
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

export { WorkersPage };
