import React,{useState,useRef,useCallback} from "react";
import { CSS } from "./config/styles";
import { NAV } from "./config/nav";
import { PAGES } from "./data/pages";
import { InvestPage } from "./components/shared";
import EquityPage from "./pages/EquityPage";
import { UtilitiesPage } from "./pages/UtilitiesPage";
import { InsurancePage } from "./pages/InsurancePage";
import { HealthPage } from "./pages/HealthPage";
import { BoardsPage } from "./pages/BoardsPage";
import { OfficialsPage } from "./pages/OfficialsPage";
import { Dashboard } from "./pages/Dashboard";
import { MoneyPage } from "./pages/MoneyPage";
import { WorkersPage } from "./pages/WorkersPage";
import { SentencingPage } from "./pages/SentencingPage";
import { PolicingPage } from "./pages/PolicingPage";
import { SurveillancePage } from "./pages/SurveillancePage";
import { VotingPage } from "./pages/VotingPage";
import { DisinfoPage } from "./pages/DisinfoPage";
import { UnhousedPage } from "./pages/UnhousedPage";
import { EnvironmentPage } from "./pages/EnvironmentPage";
import { LandUsePage } from "./pages/LandUsePage";
import { ProposalsPage } from "./pages/ProposalsPage";
import { ActionPage } from "./pages/ActionPage";
import { TaxesPage } from "./pages/TaxesPage";

export default function App(){
  const[page,setPage]=useState("dashboard");
  const[sideOpen,setSideOpen]=useState(false);
  const mainRef=useRef(null);

  const go=useCallback((id)=>{
    setPage(id);
    setSideOpen(false);
    if(mainRef.current) mainRef.current.scrollTop=0;
  },[]);

  function renderPage(){
    if(page==="dashboard")   return <Dashboard go={go}/>;
    if(page==="equity")      return <EquityPage/>;
    if(page==="utilities")   return <UtilitiesPage/>;
    if(page==="health")      return <HealthPage/>;
    if(page==="insurance")   return <InsurancePage/>;
    if(page==="money")       return <MoneyPage/>;
    if(page==="workers")     return <WorkersPage/>;
    if(page==="taxes")       return <TaxesPage/>;
    if(page==="officials")   return <OfficialsPage go={go}/>;
    if(page==="boards")      return <BoardsPage/>;
    if(page==="voting")      return <VotingPage/>;
    if(page==="disinfo")     return <DisinfoPage/>;
    if(page==="sentencing")  return <SentencingPage/>;
    if(page==="policing")    return <PolicingPage/>;
    if(page==="surveillance")return <SurveillancePage/>;
    if(page==="unhoused")    return <UnhousedPage/>;
    if(page==="environment") return <EnvironmentPage/>;
    if(page==="landuse")     return <LandUsePage/>;
    if(page==="proposals")   return <ProposalsPage/>;
    if(page==="action")      return <ActionPage/>;
    if(PAGES[page])          return <InvestPage id={page}/>;
    return <Dashboard go={go}/>;
  }

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Mobile topbar — ticker on top, nav row below */}
        <div className="topbar" style={{flexDirection:"column",height:"auto",padding:0}}>
          {/* Ticker strip — full width, above everything */}
          <div style={{width:"100%",background:"#162d4a",padding:"4px 0",overflow:"hidden"}}>
            <div style={{display:"flex",gap:0,animation:"ticker 22s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — delegation introduced zero oversight bills","✚ HHHS (Huntsville Hospital) CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act vouchers: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers (Automated License Plate Readers) — no public vote held","💧 Triana water shows PFAS (cancer-linked forever chemicals) above health guidelines","🏠 North Huntsville road condition score 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states","💰 No-bid $1.84M contract awarded to campaign donor — no competitive bidding","🏦 Industrial Development Board granted $127M+ in corporate tax abatements — no performance audit","👶 Infant care in Huntsville costs $14,400/yr — more than UAH tuition","🚔 HPD overtime up 34% — $6.2M/yr — no public explanation given"].map((t,i)=>(
                <span key={i} style={{fontSize:11,color:"rgba(255,255,255,.7)",padding:"0 24px"}}><span style={{color:"#c9a84c",marginRight:5}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          {/* Nav row — hamburger + back + title */}
          <div style={{display:"flex",alignItems:"center",gap:0,padding:"0 4px",height:46,background:"#1e3a5f"}}>
            <button className="menu-btn" onClick={()=>setSideOpen(true)} style={{fontSize:20,minWidth:40,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
            {page!=="dashboard"&&(
              <button onClick={()=>go("dashboard")} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",fontSize:15,cursor:"pointer",padding:"5px 12px",display:"flex",alignItems:"center",gap:5,borderRadius:4,marginLeft:4,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
                ← Back
              </button>
            )}
            <div className="topbar-title" style={{flex:1,paddingLeft:8,fontSize:10.5,fontWeight:800,letterSpacing:.4}}>
              {page==="dashboard"?"HUNTSVILLE CIVIC INVESTIGATOR":NAV.find(n=>n.id===page)?.label?.toUpperCase()||"HUNTSVILLE CIVIC INVESTIGATOR"}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          .desktop-ticker{display:block}
          @media(max-width:768px){.desktop-ticker{display:none}}
          @media(max-width:768px){.topbar{height:auto!important}}
        `}</style>
        {/* Overlay */}
        <div className={`overlay${sideOpen?" open":""}`} onClick={()=>setSideOpen(false)}/>
        {/* Sidebar */}
        <div className={`sidebar${sideOpen?" mobile-open":""}`}>
          <div className="sidebar-logo" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
            <h1>HUNTSVILLE CIVIC<br/>INVESTIGATOR</h1>
            <p style={{fontSize:"9px",color:"rgba(255,255,255,.35)",marginTop:2,letterSpacing:".5px"}}>THE TRUTH ABOUT YOUR CITY</p>
            <p>Madison County, Alabama · Est. 2026</p>
          </div>
          <div style={{flex:1,paddingBottom:20}}>
            {NAV.map((item,i)=>{
              if(item.group) return <div key={i} className="nav-group">{item.group}</div>;
              return(
                <div key={i} className={`nav-item${page===item.id?" active":""}`} onClick={()=>go(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Main */}
        <div className="main" ref={mainRef}>
          {/* Desktop ticker — hidden on mobile (mobile gets it in topbar) */}
          <div className="desktop-ticker" style={{background:"#1e3a5f",padding:"5px 0",overflow:"hidden"}}>
            <div style={{display:"flex",gap:0,animation:"ticker 22s linear infinite",whiteSpace:"nowrap"}}>
              {["⚡ TVA rate hike #3 in 18 months — delegation introduced zero oversight bills","✚ Huntsville Hospital (HHHS) CEO earns $3.1M — nonprofit claims $63M/yr in tax exemptions","⚖ 61% of Madison County Jail is pretrial — not convicted of anything","🏫 CHOOSE Act vouchers: 67% of recipients were already in private school","🗺 Alabama maps violated Voting Rights Act — Supreme Court ruled 5-4","📡 HPD deployed 47 license plate readers — no public vote held","💧 Triana water shows PFAS (cancer-linked forever chemicals) above health guidelines","🏠 North Huntsville road score 41 vs South 72 — same tax rate","⚖ Kratom is a Class C felony in Alabama — legal in 43 states","💰 No-bid $1.84M contract to campaign donor — no competitive bidding","🏦 Industrial Development Board $127M+ in corporate tax abatements — no audit","👶 Infant care in Huntsville $14,400/yr — more than UAH tuition","🚔 HPD overtime up 34% to $6.2M/yr — no public explanation given"].map((t,i)=>(
                <span key={i} style={{fontSize:11.5,color:"rgba(255,255,255,.65)",padding:"0 28px"}}><span style={{color:"#c9a84c",marginRight:6}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          <div>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );

}
