import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

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

export { PolicingPage };
