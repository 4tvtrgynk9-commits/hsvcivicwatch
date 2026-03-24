import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function OfficialsPage({go}){
  const[mainTab,setMainTab]=useState("directory");
  const[filter,setFilter]=useState("All");
  const[selected,setSelected]=useState(null);
  const[detailTab,setDetailTab]=useState("bio");
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);

  async function investigate(off){
    setLd(true);
    try{
      const x=await callAI(`Here is the data on ${off.name} (${off.title}): Salary ${off.salary}. Net worth now ${off.netWorth}, before office ${off.netWorthPre}. Top donors: ${off.topDonors.map(d=>d[0]+' '+d[1]).join(', ')}. Residency: ${off.residency}. Criminal record: ${off.criminal}. Key record: ${off.bio.substring(0,250)}. What does this mean for a Madison County resident? Connect the donors to the decisions. Under 150 words, no jargon.`);
      setR(x);
    }catch(e){setR("Summary unavailable.");}
    setLd(false);
  }

  const MAIN_TABS=[
    {id:"directory",label:"Officials Directory"},
    {id:"candidates",label:"2026 Candidates"},
    {id:"elections",label:"2026 Elections"},
    {id:"voting",label:"Voting & Registration"},
  ];

  const levels=["All","Federal","State","County","Huntsville","Madison City","Triana","Unincorporated Areas"];
  const filtered=filter==="All"?OFFICIALS.filter(g=>g.level!=="2026 Candidates"):OFFICIALS.filter(g=>g.level===filter);
  const candidates=OFFICIALS.find(g=>g.level==="2026 Candidates");

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Every elected official with power over Madison County. Net worth before and after office, salary, top donors, voting record, criminal history, and residency — all from public records. Click any card to investigate.</p>
        <div style={{background:"#1e3a5f",borderRadius:5,padding:"10px 14px",marginTop:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>go("money")}>
          <span style={{fontSize:18}}>🕸</span>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#c9a84c",letterSpacing:.5}}>See the full donor→policy network graphs</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Follow the Money → Networks tab</div>
          </div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:16}}>→</span>
        </div>
      </div>

      {/* Main tabs */}
      <div className="tabs" style={{marginBottom:16}}>
        {MAIN_TABS.map(t=>(
          <button key={t.id} className={`tab${mainTab===t.id?" active":""}`} onClick={()=>setMainTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* -- DIRECTORY TAB --- */}
      {mainTab==="directory"&&(
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {levels.map(l=>(
              <button key={l} onClick={()=>setFilter(l)} style={{padding:"6px 14px",borderRadius:12,border:"1px solid #e0d8cc",background:filter===l?"#1e3a5f":"#fff",color:filter===l?"#c9a84c":"#6b7280",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {filtered.map((group,gi)=>(
            <div key={gi} style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b7280",marginBottom:10,textTransform:"uppercase"}}>{group.level} OFFICIALS</div>
              {group.officials.map((off,oi)=>(
                <div key={oi} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":off.party==="Democrat"?"#1e40af":"#5b21b6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0,overflow:"hidden",border:"2px solid rgba(255,255,255,.2)"}}>
                        {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                      </div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                          <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":off.party==="Democrat"?"#eff6ff":"#f5f3ff",color:off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed",border:`1px solid ${off.party==="Republican"?"#fca5a5":off.party==="Democrat"?"#93c5fd":"#c4b5fd"}`,flexShrink:0}}>{off.party==="Republican"?"R":"D"}</span>
                        </div>
                        <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#dc2626"}}>{off.netWorth}</div>
                      <div style={{fontSize:10,color:"#6b7280"}}>net worth</div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{off.salary.split("—")[0].trim()}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:"#374151",marginTop:8,lineHeight:1.5}}><ExpandText text={off.bio} preview={130}/></div>
                  <div style={{fontSize:11,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Tap to see full record →</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* -- 2026 CANDIDATES TAB --- */}
      {mainTab==="candidates"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">⚡ 2026 IS THE MOST CONSEQUENTIAL ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
            <div className="alert-text">Governor's race is an open seat — Kay Ivey is term-limited. All three federal seats on the ballot. Sheriff, three Huntsville City Council seats, three HCS school board seats, and the entire Alabama Legislature. 37,000 eligible Madison County residents are not registered to vote.</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"#6b7280",marginBottom:10}}>CONFIRMED 2026 CANDIDATES</div>
            {candidates&&candidates.officials.map((off,i)=>(
              <div key={i} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":"#1e40af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0}}>
                    {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                  </div>
                  <div>
                    <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:2}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                      <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":"#eff6ff",color:off.party==="Republican"?"#dc2626":"#2563eb",border:`1px solid ${off.party==="Republican"?"#fca5a5":"#93c5fd"}`}}>{off.party}</span>
                    </div>
                    <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><ExpandText text={off.bio} preview={200}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Net worth:</strong> {off.netWorth} (was {off.netWorthPre})</div>
                  <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Residency:</strong> {off.residency}</div>
                </div>
                <div style={{fontSize:11,color:"#1e3a5f",fontWeight:700}}>Tap for full record including donor connections →</div>
              </div>
            ))}
            <div style={{marginTop:16,padding:"12px 14px",background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:6}}>MORE CANDIDATES BEING CONFIRMED</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>Additional 2026 candidates will be added as they announce. Check back regularly. Primary elections: May 19, 2026. General election: November 3, 2026.</div>
            </div>
          </div>
        </div>
      )}

      {/* -- VOTING & REGISTRATION TAB --- */}
      
      {mainTab==="elections"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">2026 IS THE MOST IMPORTANT ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
            <div className="alert-text">Governor's race is an open seat. All three federal races on the ballot. Sheriff, three city council seats, three school board seats. 37,000 eligible residents not registered.</div>
          </div>
          {[
            {office:"Governor — OPEN SEAT",date:"Nov 2026",priority:true,note:"Ivey is term-limited. Governor appoints ADEM leadership, parole board, prison oversight. Has authority to expand Me..."},
            {office:"U.S. Senate — Open (Tuberville running for Governor)",date:"Nov 2026",priority:true,note:"Rare opportunity — this seat was last won by a Democrat (Doug Jones) in 2017. Tuberville leaving it open."},
            {office:"AL Senate Finance Chair — Arthur Orr (D8)",date:"Nov 2026",priority:true,note:"Controls which bills get hearings. Sponsored SB 88 wage ban. Blocked Medicaid, kratom reform, bail reform. Replacin..."},
            {office:"HCS School Board D2, D3, D4",date:"Nov 2026",priority:true,note:"$310M budget. 11% turnout. 2,000 organized voters flips any seat. Controls school funding equity and CHOOSE Act res..."},
            {office:"U.S. House AL-5 — Dale Strong",date:"Nov 2026",priority:false,note:"$284k defense PACs. Zero TVA oversight bills. Voted against PRO Act, child care, drug pricing, PFAS notification."},
            {office:"Madison County Sheriff — Kevin Turner",date:"Nov 2026",priority:false,note:"61% pretrial detention. Securus conflict. $24k bail bond industry. Opposes bail reform."},
            {office:"Huntsville City Council D2, D3, D4",date:"Nov 2026",priority:false,note:"Three seats decided by under 200 votes each. D3 is Council President Robinson."},
            {office:"AL Attorney General — Steve Marshall",date:"Nov 2026",priority:false,note:"$45k private prison PACs. Defended unconstitutional maps. Opposes every criminal justice reform."},
          ].map((e,i)=>(
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
          <a href="https://www.alabamavotes.gov/RegisterToVote" target="_blank" rel="noreferrer">
            <button className="btn btn-full" style={{background:"#16a34a",color:"#fff",marginTop:8}}>✓ Register to Vote / Check Registration →</button>
          </a>
        </div>
      )}
{mainTab==="voting"&&(
        <div>
          <div className="stats-grid">
            {[["VRA Violation Ruled","2023","Allen v. Milligan — maps unconstitutional 5-4","#dc2626"],["Unregistered Eligible","37,000","Madison Co. residents who can vote but haven't registered","#dc2626"],["HCS Board Turnout","11%","Controls $310M annual budget — decided by 2,000 votes","#ea580c"],["Local Race Margin","<200 votes","Most city council and school board races","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>GERRYMANDERING — WHAT HAPPENED AND WHO PAID FOR IT</div><div className="fact-text" style={{color:"#7f1d1d"}}>In June 2023 the U.S. Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). AG Steve Marshall spent taxpayer money defending maps the court found unconstitutional. Alabama then drew replacement maps — also found non-compliant. Marshall received $340,000 from law enforcement PACs. The entire process cost Alabama taxpayers money to defend unconstitutional maps that diluted Black voting power.</div></div>
          <div className="fact fact-gold"><div className="fact-label" style={{color:"#b8860b"}}>YOUR VOTE IS WORTH MORE THAN YOU THINK</div><div className="fact-text" style={{color:"#78350f"}}>The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races: decided by under 200 votes — controlling a $310M annual budget with 11% voter turnout. A single organized group with 500 committed members can determine the outcome of almost any Madison County local race. The most powerful vote you cast in 2026 is probably for HCS school board or city council — not governor.</div></div>
          <div className="fact fact-blue"><div className="fact-label" style={{color:"#2563eb"}}>REGISTRATION — WHAT YOU NEED TO KNOW</div><div className="fact-text" style={{color:"#1e3a5f"}}>You must register 15 days before any election. 37,000 eligible Madison County residents are not registered. You can check or update your registration online. If you moved, changed your name, or haven't voted in several years — check your registration now. You cannot register at the polls in Alabama.</div></div>
          {[{icon:"🗳",title:"Register to Vote / Check Your Registration",sub:"Check now — if you moved or haven't voted recently your registration may be outdated.",url:"https://www.alabamavotes.gov/RegisterToVote",btn:"Check Registration →"},
            {icon:"📅",title:"2026 Key Dates",sub:"Primary: May 19, 2026 · Registration deadline for primary: May 4, 2026 · General: November 3, 2026 · Registration deadline for general: October 19, 2026",url:null,btn:null},
            {icon:"◉",title:"Run for HCS School Board in 2026",sub:"Districts 2, 3, and 4 are on the November 2026 ballot. Races decided by under 200 votes. Filing deadline: approximately March 2026. You do not need money or connections to run.",url:"https://www.sos.alabama.gov/alabama-votes/candidates",btn:"Candidate Filing Info →"},
          ].map((item,i)=>(
            <div key={i} className="card" style={{marginBottom:8}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:22}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{item.title}</div>
                  <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:item.url?8:0}}>{item.sub}</div>
                  {item.url&&<a href={item.url} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:12}}>{item.btn}</button></a>}
                </div>
              </div>
            </div>
          ))}
          <AiButton prompt={`Here is the voting and representation data for Madison County: Allen v. Milligan Supreme Court ruled Alabama's maps violated the Voting Rights Act in 2023. AG Marshall spent taxpayer money defending unconstitutional maps and received $340k from ...`}/>
        </div>
      )}

      {/* -- OFFICIAL DETAIL MODAL --- */}
      {selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(30,58,95,.6)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setR(null);}}}>
          <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:700,border:`3px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`,boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden",marginTop:20}}>
            <div style={{background:selected.party==="Republican"?"#991b1b":selected.party==="Democrat"?"#1e40af":"#5b21b6",padding:"20px 22px",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",flexShrink:0,border:"3px solid rgba(255,255,255,.4)",overflow:"hidden"}}>
                {selected.photo?<img src={selected.photo} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{selected.avatar}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{selected.name}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:2}}>{selected.title} · {selected.district}</div>
                <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
                  {[`In office since ${selected.since}`,`Term ends ${selected.termEnds}`,selected.party].map((t,i)=><span key={i} style={{fontSize:10,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.12)",padding:"2px 8px",borderRadius:2}}>{t}</span>)}
                </div>
              </div>
              <button onClick={()=>{setSelected(null);setR(null);}} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
            </div>
            <div style={{background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"11px 22px",display:"flex",gap:20,flexWrap:"wrap"}}>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>NET WORTH NOW</div><div style={{fontSize:19,fontWeight:900,color:"#b8860b"}}>{selected.netWorth}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>BEFORE OFFICE</div><div style={{fontSize:19,fontWeight:900,color:"#6b7280"}}>{selected.netWorthPre}</div></div>
              <div style={{flex:1}}><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>HOW THEY BUILT IT</div><div style={{fontSize:12,color:"#4a3800",lineHeight:1.4}}>{selected.netWorthHow}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>TAXPAYER SALARY</div><div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{selected.salary}</div></div>
            </div>
            <div style={{background:"#f8f6f2",borderBottom:"1px solid #e0d8cc",padding:"9px 22px",display:"flex",gap:20,flexWrap:"wrap",fontSize:12}}>
              <span><strong>Residency:</strong> {selected.residency}</span>
              <span><strong>Criminal record:</strong> <span style={{color:selected.criminal==="No criminal record"||selected.criminal==="No record found"?"#16a34a":"#dc2626"}}>{selected.criminal}</span></span>
            </div>
            <div style={{display:"flex",borderBottom:"1px solid #e0d8cc",background:"#f8f6f2"}}>
              {["bio","record","donors","votes","contact"].map(t=>(
                <button key={t} onClick={()=>setDetailTab(t)} style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",fontSize:11,fontWeight:detailTab===t?700:500,color:detailTab===t?(selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"):"#6b7280",background:detailTab===t?"#fff":"#f8f6f2",borderBottom:detailTab===t?`2px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`:"2px solid transparent",fontFamily:"inherit",textTransform:"capitalize"}}>
                  {t==="bio"?"Profile":t==="record"?"On Record":t==="donors"?"Donors":t==="votes"?"Votes":"Contact"}
                </button>
              ))}
            </div>
            <div style={{padding:"16px 22px",maxHeight:400,overflowY:"auto"}}>
              {detailTab==="bio"&&<div>
                <p style={{fontSize:14,lineHeight:1.8,color:"#374151",marginBottom:14}}><ExpandText text={selected.bio} preview={350}/></p>
                {!r?<button className="btn btn-gold btn-full" onClick={()=>investigate(selected)} disabled={ld}>{ld?<><span className="spin"/>Breaking it down...</>:"🔍 Break It Down"}</button>:<div className="ai-panel"><div className="ai-panel-label">💬 SUMMARY</div><AiResult text={r}/><button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:12,marginTop:8}}>Clear</button></div>}
              </div>}
              {detailTab==="record"&&<div>
                {(!selected.quotes||selected.quotes.length===0)?
                  <div style={{padding:"20px",textAlign:"center",color:"#6b7280",fontSize:14}}>Record research ongoing — check back for updates.</div>:
                  selected.quotes.map((q,i)=>(
                    <div key={i} style={{marginBottom:10,borderRadius:5,overflow:"hidden",border:`1px solid ${q.flip?"#fca5a5":q.type==="environment"?"#86efac":q.type==="healthcare"?"#93c5fd":"#fcd34d"}`,borderLeft:`4px solid ${q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}`}}>
                      <div style={{padding:"8px 12px",background:q.flip?"#fef2f2":q.type==="environment"?"#f0fdf4":q.type==="healthcare"?"#eff6ff":"#fffbeb",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:8,background:"rgba(0,0,0,.06)",color:q.flip?"#dc2626":q.type==="environment"?"#16a34a":q.type==="healthcare"?"#2563eb":"#b8860b"}}>{q.flip?"⚠ SAID ONE THING, DID ANOTHER":q.type==="environment"?"🌿 ENVIRONMENT":q.type==="healthcare"?"✚ HEALTHCARE":"📋 ON RECORD"}</span>
                        {q.date&&<span style={{fontSize:9,color:"#6b7280"}}>{q.date}</span>}
                        {q.source&&<span style={{fontSize:9,color:"#6b7280"}}>· {q.source}</span>}
                      </div>
                      <div style={{padding:"10px 12px",background:"#fff"}}>
                        {q.quote&&<div style={{fontSize:13,fontStyle:"italic",color:"#1e3a5f",marginBottom:7,lineHeight:1.6,padding:"6px 10px",background:"#eff3f8",borderRadius:3,borderLeft:"3px solid #93b4d4"}}>"{q.quote}"</div>}
                        <div style={{fontSize:13,color:q.flip?"#7f1d1d":"#374151",lineHeight:1.65}}>{q.fact}</div>
                      </div>
                    </div>
                  ))
                }
              </div>}
              {detailTab==="donors"&&<div>
                <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:10,fontWeight:700}}>TOP DONORS — PUBLIC RECORD (FEC.GOV / FCPA.ALABAMA.GOV)</div>
                {selected.topDonors.map(([category,amt,named],i)=>(
                  <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:6,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`,background:i===0?"#fef2f2":"#f8f6f2",border:`1px solid ${i===0?"#fca5a5":"#e0d8cc"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:named&&named.length?8:0}}>
                      <span style={{fontSize:13.5,fontWeight:700,color:"#374151",flex:1,paddingRight:8}}>{category}</span>
                      <span style={{fontSize:16,fontWeight:900,color:"#dc2626",fontFamily:"monospace",flexShrink:0}}>{amt}</span>
                    </div>
                    {named&&named.length>0&&(
                      <div>
                        <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>Specific Donors</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {named.map((n,j)=>(
                            <span key={j} style={{fontSize:11,color:"#1e3a5f",background:"#fff",border:"1px solid #93b4d4",padding:"3px 9px",borderRadius:12,fontWeight:600}}>{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:12,marginTop:8}}>Search AL Campaign Finance →</button></a>
              </div>}
              {detailTab==="votes"&&<div>
                {selected.votes.length===0?<p style={{color:"#6b7280",fontSize:14}}>Voting record under research.</p>:selected.votes.map((v,i)=>(
                  <div key={i} style={{background:"#f8f6f2",borderRadius:4,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("None")?"#dc2626":"#16a34a"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f",flex:1}}>{v.bill}</span>
                      <span style={{fontSize:10,fontWeight:700,color:v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")?"#dc2626":"#374151",flexShrink:0,padding:"2px 8px",background:"rgba(0,0,0,.04)",borderRadius:3}}>{v.vote}</span>
                    </div>
                    <div style={{fontSize:12.5,color:"#6b7280"}}>{v.impact}</div>
                  </div>
                ))}
              </div>}
              {detailTab==="contact"&&<div>
                {[["Phone",selected.contact.phone],["Office",selected.contact.office]].map(([l,v],i)=>(
                  <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,marginBottom:8}}>
                    <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{v||"—"}</div>
                  </div>
                ))}
                <a href={selected.contact.web} target="_blank" rel="noreferrer"><button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button></a>
                <ActionButtons actions={[
                  ...(selected.contact.phone?[{label:"Call "+selected.name.split(" ")[0],tel:selected.contact.phone.replace(/[^0-9]/g,"")}]:[]),
                  {label:"Email "+selected.name.split(" ")[0],email:(selected.contact.email||selected.contact.web&&""),subject:"Constituent Inquiry — "+selected.title,body:"Dear "+(selected.name.split(" ")[0])+",\n\nI am a Madison County constituent writing to express my concern about [ISSUE].\n\n[Your Name]\n[Your Address]"},
                  ...(selected.party==="Republican"&&selected.title.includes("Gov")?[{label:"Demand Medicaid Expansion",email:"governor.ivey@governor.alabama.gov",subject:"Expand Medicaid — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nI demand you expand Medicaid. 295,000 Alabamians are uninsured. The federal government pays 90% of the cost.\n\n[Your Name]"}]:[]),
                  {label:"AL Ethics Complaint",href:"https://ethics.alabama.gov"},
                  {label:"File Open Records Request",href:"https://www.huntsvilleal.gov/government/city-clerk/"},
                ].filter(a=>a.email||a.tel||a.href)}/>
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- DASHBOARD ---

export { OfficialsPage };
