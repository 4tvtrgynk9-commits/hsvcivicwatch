import React,{useState} from "react";
import { AiButton, ActionButtons, ExpandText } from "../components/shared";
import { callAI } from "../lib/ai";

const ELECTIONS = [
  {office:"Governor — OPEN SEAT",date:"Nov 2026",priority:true,note:"Kay Ivey is term-limited. Governor controls major appointments affecting environment, prisons, and healthcare oversight."},
  {office:"U.S. Senate — Open (Tuberville running for Governor)",date:"Nov 2026",priority:true,note:"Rare open Senate race. This will shape Alabama's federal representation for years."},
  {office:"HCS School Board D2, D3, D4",date:"Nov 2026",priority:true,note:"Controls a $310M budget. These races are often decided by a few hundred votes."},
  {office:"Madison County Sheriff",date:"Nov 2026",priority:false,note:"Jail policy, pretrial detention, phone contracts, and enforcement priorities all run through this office."},
  {office:"Huntsville City Council D2, D3, D4",date:"Nov 2026",priority:false,note:"Council votes on roads, zoning, budgets, and appointments to key boards."},
];

export function OfficialsPage({go}){
  const[tab,setTab]=useState("directory");
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);

  async function investigate(){
    setLd(true);
    try{
      const x=await callAI("Explain why local and state elections in Madison County matter more than many residents think. Use plain language. Focus on budget power, appointments, school boards, sheriff races, and how a few hundred votes can decide major outcomes. Under 180 words.");
      setR(x);
    }catch(e){
      setR("Analysis unavailable — please try again.");
    }
    setLd(false);
  }

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Use this page to understand which offices matter most in Madison County, what races are coming in 2026, and where to go for voter registration and election information.</p>
        <div style={{background:"#1e3a5f",borderRadius:5,padding:"10px 14px",marginTop:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>go&&go("money")}>
          <span style={{fontSize:18}}>🕸</span>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#c9a84c",letterSpacing:.5}}>See the full donor→policy network graphs</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Follow the Money → Networks tab</div>
          </div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:16}}>→</span>
        </div>
      </div>

      <div className="tabs" style={{marginBottom:16}}>
        <button className={`tab${tab==="directory"?" active":""}`} onClick={()=>setTab("directory")}>Directory</button>
        <button className={`tab${tab==="elections"?" active":""}`} onClick={()=>setTab("elections")}>2026 Elections</button>
        <button className={`tab${tab==="voting"?" active":""}`} onClick={()=>setTab("voting")}>Voting & Registration</button>
      </div>

      {tab==="directory"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">PAGE STABILIZED</div>
            <div className="alert-text">This page is being rebuilt from your full officials dataset. The crash is removed, and the election and voting tools below are live while the full directory is restored cleanly.</div>
          </div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-title">Why this page matters</div>
            <div className="card-sub">Mayor, council, sheriff, school board, state legislators, and federal officials each control different parts of daily life in Madison County — roads, policing, schools, zoning, utilities, healthcare oversight, and tax decisions.</div>
          </div>
          {!r ? (
            <button className="btn btn-gold btn-full" onClick={investigate} disabled={ld}>
              {ld ? "Connecting the dots..." : "Decode This 🔍"}
            </button>
          ) : (
            <div className="ai-panel">
              <div className="ai-panel-label">CIVIC INVESTIGATOR ANALYSIS</div>
              <div style={{marginBottom:8}}>{r}</div>
              <button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:12}}>Hide Analysis ▲</button>
            </div>
          )}
          <ActionButtons
            title="OFFICIAL RESOURCES"
            actions={[
              {label:"Alabama Campaign Finance Search",href:"https://fcpa.alabama.gov"},
              {label:"Huntsville City Council",href:"https://www.huntsvilleal.gov/government/city-council/"},
              {label:"Alabama Legislature",href:"https://alison.legislature.state.al.us"},
            ]}
          />
        </div>
      )}

      {tab==="elections"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">2026 IS A HIGH-IMPACT YEAR</div>
            <div className="alert-text">Governor, U.S. Senate, sheriff, council, and school board races can all directly affect Madison County life.</div>
          </div>
          {ELECTIONS.map((e,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${e.priority?"#dc2626":"#1e3a5f"}`,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
                <div style={{fontSize:13.5,fontWeight:800,color:"#1e3a5f"}}>
                  {e.priority&&<span style={{fontSize:9,fontWeight:700,color:"#dc2626",background:"#fef2f2",padding:"1px 7px",borderRadius:8,marginRight:6,border:"1px solid #fca5a5"}}>HIGH PRIORITY</span>}
                  {e.office}
                </div>
                <span style={{fontSize:10,fontWeight:700,color:"#b8860b",background:"#fffbeb",padding:"2px 9px",borderRadius:8,border:"1px solid #fcd34d",flexShrink:0}}>{e.date}</span>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{e.note}</div>
            </div>
          ))}
        </div>
      )}

      {tab==="voting"&&(
        <div>
          <div className="stats-grid">
            {[["Unregistered Eligible","37,000","Madison County residents who can vote but have not registered","#dc2626"],["School Board Turnout","11%","Low turnout can control a huge budget","#ea580c"],["Local Race Margin","<200 votes","Many local races are decided by a few hundred votes","#ea580c"],["Registration Deadline","15 days","Before any Alabama election","#2563eb"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>

          {[
            {step:"1. Register to Vote",detail:"Online through Alabama Votes. Registration closes 15 days before each election.",link:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",linkText:"Register Now →"},
            {step:"2. Check Your Registration",detail:"If you moved, changed your name, or have not voted in years, verify your status now.",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Check Registration →"},
            {step:"3. Find Your Polling Place",detail:"Polling places can change. Verify before election day.",link:"https://myinfo.alabamavotes.gov/voterview/",linkText:"Find Polling Place →"},
            {step:"4. Alabama Voter ID Rules",detail:"Alabama requires photo ID. Free voter IDs are available if you do not already have one.",link:"https://www.alabamavoterID.com/",linkText:"Voter ID Info →"},
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

export default OfficialsPage;
