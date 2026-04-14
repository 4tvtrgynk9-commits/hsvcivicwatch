import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

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
      {id:"insurance",icon:"🛡",label:"Insurance Costs & Coverage",sub:"19-25% premium spike · 90k uninsured gap · BCBS monopoly · car/dental/vision costs"},
      {id:"workers",icon:"👷",label:"Worker Rights & Child Care",sub:"$7.25/hr wage ban · $14,400/yr infant care · NLRB · right-to-work"},
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


export { Dashboard };
