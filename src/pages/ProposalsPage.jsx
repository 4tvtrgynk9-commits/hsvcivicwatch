import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function ProposalsPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">POLICY PROPOSALS · INVESTIGATION</span>
        <h2>Policy <em>Proposals</em></h2>
        <p>Some things could change tomorrow with a single vote. Others require winning elections in 2026. Here is what is possible, who has the power to do it, and what is blocking each one.</p>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:"#16a34a",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>CAN CHANGE TODAY — NO ELECTION NEEDED</div>
        {[
          {what:"Medicaid Expansion",who:"Gov. Kay Ivey — signature only",impact:"295,000 Alabamians get coverage. Federal pays 90%. ~10,000 jobs created.",blocker:"Ivey received $420k from health insurance PACs. Contact: governor.alabama.gov"},
          {what:"Civilian Police Review Board",who:"Huntsville City Council — ordinance vote",impact:"Independent review of HPD officer conduct. 16 years without one under Battle.",blocker:"Police union endorses Battle. Council contact: (256) 427-5000"},
          {what:"HCS School Spending Equity Audit",who:"HCS Board of Education — vote",impact:"Document and begin addressing the $847/pupil gap between schools in same district.",blocker:"Board has not acted. Three seats on 2026 ballot. Contact: (256) 428-6800"},
          {what:"IDB Abatement Audit",who:"Huntsville City Council — motion",impact:"Public accounting of whether $127M+ in abatements produced promised jobs.",blocker:"Battle appoints IDB board. Council contact: (256) 427-5000"},
          {what:"Section 8 Waitlist Opening",who:"Huntsville Housing Authority — policy decision",impact:"7,000+ household gap. Last open 7 days in 2020. Contact HHA: (256) 539-0774.",blocker:"Political will, not money. Contact HHA Board."},
        ].map((p,i)=>(
          <div key={i} className="card" style={{marginBottom:10,borderLeft:"4px solid #16a34a",padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{p.what}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
              <div style={{padding:"7px",background:"#f0fdf4",borderRadius:3,border:"1px solid #86efac"}}><div style={{fontSize:8.5,color:"#16a34a",fontWeight:700,marginBottom:1}}>WHO DECIDES</div><div style={{fontSize:11.5,color:"#374151"}}>{p.who}</div></div>
              <div style={{padding:"7px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:1}}>IMPACT</div><div style={{fontSize:11.5,color:"#374151"}}>{p.impact}</div></div>
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{p.blocker}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>REQUIRES 2026 ELECTIONS — STATE LEGISLATURE</div>
        {[
          {what:"Minimum Wage Preemption Repeal (SB 88)",who:"AL Legislature — Sen. Orr controls Finance Committee hearings",impact:"Cities could raise wages above $7.25/hr federal floor.",election:"Orr's District 8 seat is on November 2026 ballot — Madison County voters decide."},
          {what:"Bail Reform",who:"AL Legislature",impact:"61% of Madison County Jail is pretrial. Supervised release for non-violent defendants.",election:"Contact your state House and Senate members at legislature.alabama.gov"},
          {what:"HFOA Reform",who:"AL Legislature + AL Sentencing Commission",impact:"527+ people serving life for non-violent crimes. Reform would allow parole review.",election:"Contact state legislators. Equal Justice Initiative: eji.org"},
          {what:"Kratom Reclassification",who:"AL Legislature",impact:"Class C felony in AL, legal in 43 states. Reclassify as misdemeanor or civil citation.",election:"Contact legislature.alabama.gov — especially House Judiciary Committee"},
          {what:"CHOOSE Act Income Caps",who:"AL Legislature",impact:"Limit vouchers to students who couldn't otherwise afford private school.",election:"Contact state House members — especially those from Madison County districts"},
        ].map((p,i)=>(
          <div key={i} className="card" style={{marginBottom:10,borderLeft:"4px solid #dc2626",padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{p.what}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
              <div style={{padding:"7px",background:"#fef2f2",borderRadius:3,border:"1px solid #fca5a5"}}><div style={{fontSize:8.5,color:"#dc2626",fontWeight:700,marginBottom:1}}>WHO DECIDES</div><div style={{fontSize:11.5,color:"#374151"}}>{p.who}</div></div>
              <div style={{padding:"7px",background:"#eff3f8",borderRadius:3,border:"1px solid #93b4d4"}}><div style={{fontSize:8.5,color:"#1e3a5f",fontWeight:700,marginBottom:1}}>IMPACT</div><div style={{fontSize:11.5,color:"#374151"}}>{p.impact}</div></div>
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{p.election}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAKE ACTION PAGE ---

export { ProposalsPage };
