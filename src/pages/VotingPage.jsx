import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function VotingPage(){
  const[tab,setTab]=useState("power");
  const tabs=[{id:"power",label:"Your Vote"},{id:"gerry",label:"Gerrymandering"},{id:"register",label:"Register"}];
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">VOTER EMPOWERMENT · INVESTIGATION</span>
        <h2>Voter <em>Empowerment</em></h2>
        <p>Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents are not registered. School board races are decided by under 200 votes. Your vote in local elections is worth more than you think.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="power"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Unregistered Eligible","37,000","Madison County residents who could vote but aren't","#dc2626"],["HCS Board Turnout","11%","Controls $310M annual budget — 2,000 votes flips it","#ea580c"],["Closest Race 2024","368 votes","District 1 City Council runoff — that's it","#orange"],["School Board Margin","<200 votes","Typical margin in Madison County school board races","#1e3a5f"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:["#dc2626","#ea580c","#c9a84c","#1e3a5f"][i]}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          {[
            {office:"Huntsville City Council — District 1",controls:"North Huntsville roads, development approvals, police budget vote",decided:"368 votes in 2024 runoff",next:"November 2026",why:"Michelle Watkins is the only council member who voted NO on the January 2025 annexation citing school overcrowding. Her district includes the roads with PCI 41."},
            {office:"HCS School Board — Districts 2, 3, 4",controls:"$310M annual budget — per-pupil spending gap, AP courses, teacher pay",decided:"Under 200 votes typically",next:"November 2026",why:"The documented $847/pupil spending gap between north and south Huntsville schools can be fixed by this board. They have not fixed it. New members could."},
            {office:"AL State Senate — District 8 (Arthur Orr)",controls:"Finance Committee hearings — which bills get a vote",decided:"Madison County voters",next:"November 2026",why:"Orr blocked minimum wage increases, sponsored mandatory sentencing bills, received $45k from BCA. Tanya Reeves (D) has announced a challenge."},
            {office:"Madison County Sheriff",controls:"61% pretrial jail population, $2.3M forfeiture fund, Securus contract",decided:"County-wide",next:"2026",why:"No challenger has run against Turner with accountability as the central issue. 2026 is the cycle."},
          ].map((r,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid #1e3a5f"}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{r.office}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{padding:"8px",background:"#eff3f8",borderRadius:3}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:2}}>CONTROLS</div><div style={{fontSize:11.5,color:"#374151"}}>{r.controls}</div></div>
                  <div style={{padding:"8px",background:"#fef2f2",borderRadius:3}}><div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,marginBottom:2}}>DECIDED BY</div><div style={{fontSize:11.5,color:"#374151"}}>{r.decided} · Next: {r.next}</div></div>
                </div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{r.why}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="gerry"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"ALLEN v. MILLIGAN — SUPREME COURT RULED MAPS UNCONSTITUTIONAL",lc:"#dc2626",tc:"#7f1d1d",text:"In June 2023, the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). Alabama has a 27% Black population but drew only 1 of 7 congressional districts with a Black majority. AG Steve Marshall spent taxpayer money defending the unconstitutional maps. Alabama then drew replacement maps that a federal court also found non-compliant. After years of litigation, a remedial map was implemented for 2024."},
            {k:"gold",label:"THE STATE LEGISLATIVE MAP PROBLEM",lc:"#b8860b",tc:"#78350f",text:"The congressional map ruling applies to US House seats. State legislative maps have their own challenges. Alabama's state House and Senate maps have faced challenges under the VRA as well. The combination of gerrymandered maps and voter ID laws has concentrated political power in ways that consistently produce legislative majorities willing to block minimum wage increases, Medicaid expansion, and sentencing reform — all of which are majority-popular policies in Alabama polling."},
            {k:"blue",label:"WHAT MADISON COUNTY VOTERS CAN DO",lc:"#2563eb",tc:"#1e3a5f",text:"The state legislative maps covering Madison County determine which senators and representatives are elected. These maps were drawn by the Legislature itself — a conflict of interest. In states with independent redistricting commissions, maps tend to be more competitive. Alabama does not have one. The path to changing this runs through electing legislators who commit to independent redistricting."},
          ]}/>
        </div>
      )}

      {tab==="register"&&(
        <div>
          {[
            {step:"1. Register to Vote",detail:"Online at sos.alabama.gov. Deadline: 15 days before any election. You will need: driver's license or state ID number, last 4 of SSN, residential address. Takes 5 minutes.",link:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",linkText:"Register Now →"},
            {step:"2. Check Your Registration",detail:"Even if you think you're registered, verify. Alabama has conducted voter roll purges. Your status may have changed if you moved or missed multiple elections.",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Check My Registration →"},
            {step:"3. Know Your Polling Place",detail:"Find your assigned polling location before Election Day. Polling places can change. Madison County Election Commission: (256) 532-3510",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Find My Polling Place →"},
            {step:"4. Alabama Voter ID Law",detail:"Alabama requires photo ID to vote. Accepted: Driver's license, state ID, US passport, employee ID (government), military ID, student ID (state school). Free state ID available at any ALEA office if you don't have one.",link:"https://www.alabamavoterID.com/",linkText:"Free Voter ID →"},
            {step:"5. 2026 Key Dates",detail:"State primary: likely June 2026. General election: November 2026. Registration deadline: 15 days before each. Open enrollment for absentee ballot: contact Madison County Probate Office — (256) 532-3330.",link:"https://www.sos.alabama.gov/",linkText:"AL Secretary of State →"},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:12,padding:"16px 18px",borderLeft:"4px solid #16a34a"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:6}}>{s.step}</div>
              <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7,marginBottom:10}}>{s.detail}</div>
              <a href={s.link} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11.5}}>{s.linkText}</button></a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- DISINFORMATION PAGE ---

export { VotingPage };
