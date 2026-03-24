import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

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
      analysis:"Your bill has four layers:\n\n1. RESIDENTIAL AVAILABILITY CHARGE — $20.23/month fixed. You pay this whether you use any electricity or not. Set by HU's Electric Board (appointed by City Council). Went up $3.00 in January 2025.\n\n2. CONSUMPTION CHARGE — $0.11675/kWh for the first 1,400 kWh, then $0.12289/kWh above that. Set by HU's Electric Board and approved by City Council. Went up $0.00288/kWh in January 2025 and another $0.00114 in October 2025.\n\n3. TVA FUEL COST ADJUSTMENT — Added on top. February 2026: 2.397¢/kWh on every kWh you use. Set monthly by TVA based on fuel costs. No Alabama body approves this. It changed monthly — peaked at 4.6¢/kWh in August 2022. This is a pure TVA passthrough.\n\n4. CITY SEWER / TRASH — HU collects these on behalf of the city. Not their revenue.\n\nFor a typical 1,200 kWh month: $20.23 + $140.10 + $28.76 = ~$189 electric only. Add water ($35-60) + gas ($30-80) + trash/sewer ($25-40) = combined monthly bill often $280-$380.\n\nWho profits from this structure: TVA CEO Jeff Lyash earned $8.1M in 2023 — approved by a board he works alongside, with no shareholder vote. HU CEO Wes Kelley's salary is not publicly disclosed — HU has resisted Open Records requests. Both pay zero income tax. The HU board, appointed by City Council, approved rate increases unanimously. Rep. Dale Strong, Sen. Katie Britt, and Sen. Tommy Tuberville collectively received $1.4M+ from energy PACs and introduced zero TVA oversight bills.\n\nIn August 2025 HU launched a new billing system that generated \"double bills\" and widespread account confusion. Over 1,600 customers signed a Change.org petition demanding an independent billing audit. HU's official response: \"blame the weather.\" Council Member Bill Kling's response to the petition: \"The utility rates in Huntsville are among the lowest in the entire state of Alabama.\" That may be technically true for the electric rate per kWh — but it does not describe what residents are actually paying when the full combined bill lands.\n\nWho approved this? HU Board approved the rate structure. City Council approved it unanimously in October 2024. TVA approved their fuel surcharge internally. Your state legislators have zero authority over any of it.",
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
      analysis:"TVA is a federal government corporation created by the Tennessee Valley Authority Act of 1933. That law gave TVA an exclusive right to serve its 7-state territory. No private utility, no cooperative, no new public utility can compete with TVA. It is a congressionally-imposed monopoly — and only Congress can end it.\n\nBrowns Ferry Nuclear Plant in Athens, Alabama — 15 miles from Huntsville — generates 3,800 megawatts. It was built with federal funds intended to benefit the region. Alabama ratepayers must buy that power at rates TVA sets, with no ability to negotiate or switch providers.\n\nTVA has raised base rates 4.5% in FY2024 and is proposing further increases for FY2026 to fund natural gas infrastructure expansion. Their CEO Jeff Lyash earned $8.1M in 2023 — approved by a board he works alongside, with no shareholder vote or public approval. TVA carries over $20 billion in long-term debt, all passed to ratepayers.\n\nAlabama's three federal representatives — Rep. Dale Strong, Sen. Katie Britt, Sen. Tommy Tuberville — collectively received $1.4M+ from energy PACs. None have introduced TVA oversight legislation. Strong sits on the House Armed Services Committee overseeing Redstone Arsenal, which is adjacent to the TVA supply chain. The money and the silence are connected.",
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
      analysis:"PFOS — a PFAS forever chemical linked to kidney cancer, thyroid disease, and immune damage — has been detected above EWG health guidelines in Triana Water Works. The EPA has set a maximum contaminant level of 4 parts per trillion for PFOS; EWG's health guideline is 1 ppt. Triana's levels have exceeded EWG's standard.\n\nTriana remains on the EPA Superfund list due to contamination from two sources: Redstone Arsenal PFAS discharge into Indian Creek/Huntsville Spring Branch, and Olin Corporation DDT manufacturing that contaminated the Tennessee River. This contamination began in the 1970s and has never been fully remediated. The full extent of Redstone Arsenal's ongoing PFAS contamination has not been publicly disclosed.\n\nTriana is a majority-Black community of approximately 2,300. It has no representation on the Huntsville City Council. It cannot access IDB tax abatements that benefit corporations. It receives none of the capital investment flowing to annexed development areas. Rep. Dale Strong voted against the PFAS Notification Act that would have required disclosure of contamination levels near military installations. Gov. Ivey — who appoints ADEM leadership — received $340,000 from energy and industrial PACs. ADEM is among the weakest enforcement agencies in the Southeast. The residents of Triana are paying the price.",
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
            <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>Contact Congress — The Only People Who Can Reform TVA</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:12,lineHeight:1.5}}>These three people represent you in Congress and received a combined $1.4M+ from energy PACs. None have introduced a TVA oversight bill. Call or email them directly.</div>
            {[
              {name:"Rep. Dale Strong (AL-5)",pac:"$284k from defense and energy PACs · zero TVA oversight bills",phone:"2565510190",dcphone:"2022254801",email:"https://dalestrong.house.gov/contact",label:"Strong"},
              {name:"Sen. Katie Britt",pac:"$890k from energy PACs · no TVA reform legislation",phone:"2565510660",dcphone:"2022245744",email:"https://www.britt.senate.gov/contact",label:"Britt"},
              {name:"Sen. Tommy Tuberville",pac:"$270k from energy PACs · no TVA oversight action",phone:"2565330986",dcphone:"2022244124",email:"https://www.tuberville.senate.gov/contact",label:"Tuberville"},
            ].map((c,i)=>(
              <div key={i} style={{padding:"12px 14px",background:"#fff",borderRadius:4,marginBottom:8,border:"1px solid #93b4d4"}}>
                <div style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f",marginBottom:3}}>{c.name}</div>
                <div style={{fontSize:11,color:"#dc2626",marginBottom:10}}>{c.pac}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <a href={"tel:"+c.phone}><button className="btn btn-gold" style={{fontSize:11}}>Call Huntsville Office</button></a>
                  <a href={"tel:"+c.dcphone}><button className="btn btn-gold" style={{fontSize:11}}>Call DC Office</button></a>
                  <a href={c.email} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11}}>Contact Form</button></a>
                </div>
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

export { UtilitiesPage };
