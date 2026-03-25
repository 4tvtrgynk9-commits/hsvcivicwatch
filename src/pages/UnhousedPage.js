import{useState,useEffect,useRef,useCallback}from"react";
import{AiButton,ActionButtons,FactBlocks,ExpandText,InvestPage}from"../components/shared";

// --- UNHOUSED RESIDENTS PAGE ---
export function UnhousedPage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-orange">UNHOUSED · INVESTIGATION</span>
        <h2>Unhoused Residents & <em>Public Housing</em></h2>
        <p>412+ unhoused residents in Madison County. Section 8 waitlist closed since 2020. 7,000+ unit affordable housing gap. Three encampment sweeps occurred within 500 feet of active developer projects. Here is what the data shows about who this affects and who benefits from the status quo.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["Section 8 Waitlist","CLOSED","Last open June 1-8, 2020 — 4+ years closed","#dc2626"],["Public Housing Wait","6-12 mo","Applications accepted at 200 Washington St NE","#ea580c"],["HHA Vouchers","2,047","For a metro area of 500,000+ — one per 244 residents","#ea580c"],["Affordable Unit Gap","7,000+","For residents earning under $25k/yr","#dc2626"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"blue",label:"WHO IS UNHOUSED — AND WHY",lc:"#2563eb",tc:"#1e3a5f",text:"The 2024 Point-in-Time count found 412+ unhoused individuals in Madison County on a single January night. The actual number is higher — PIT counts undercount people in vehicles and temporary living situations. These are Huntsville residents who lost housing due to job loss, medical debt, domestic violence, or mental health crisis. Many were housed before. Many are working. Unhoused is not a permanent identity — it is a circumstance created by specific policy choices."},
        {k:"red",label:"ENCAMPMENT SWEEPS — NEAR DEVELOPER SITES",lc:"#dc2626",tc:"#7f1d1d",text:"The city passed an anti-camping ordinance in 2023 and conducted 8 documented encampment sweeps in 2023-2024. Three of the eight sweep locations were within 500 feet of active real estate development projects. Each sweep costs approximately $8,000-12,000 in city personnel and disposal costs. The annual cost to cycle one chronically homeless person through enforcement is approximately $18,000-25,000. The annual cost of permanent supportive housing is approximately $10,000. Sweeps cost more than housing."},
        {k:"gold",label:"WHO BENEFITS FROM THE STATUS QUO",lc:"#b8860b",tc:"#78350f",text:"Real estate developers benefit when anti-camping ordinances clear land near their projects. IDB abatements remove property tax burden from corporations without any affordable housing requirement. Mayor Battle received $380,000 from real estate developers. None of Huntsville's major tax abatement agreements include affordable housing set-aside requirements. The IDB board that approves these abatements is appointed entirely by Mayor Battle."},
        {k:"green",label:"WHAT WOULD ACTUALLY HELP",lc:"#16a34a",tc:"#14532d",text:"The Housing Authority can open the Section 8 waitlist — it is a policy choice, not a budget impossibility. The City Council can require affordable housing set-aside provisions in IDB abatement agreements. The City can fund rapid rehousing programs — permanent supportive housing costs $10,000/year vs $18,000-25,000 for enforcement cycling. Every IDB abatement granted without an affordable housing requirement is a missed opportunity to address the 7,000-unit gap."},
      ]}/>
      <AiButton prompt="Investigate unhoused residents and housing policy in Huntsville. FACTS: 412+ unhoused January 2024. Section 8 closed since June 2020 — open 7 days. Only 2,047 vouchers for 500,000+ metro. 6-12 month wait for public housing. 7,000+ affordable unit gap under $25k income. City passed anti-camping ordinance 2023, conducted 8 sweeps 2023-2024. Three sweep locations within 500 feet of active developer projects. Each sweep $8-12k. Annual enforcement cycling cost $18-25k vs $10k for permanent housing. Mayor Battle received $380k from real estate developers. No IDB abatement requires affordable housing set-aside. Contact Housing Authority: (256) 539-0774. Contact City Council to demand IDB abatement requirements. Under 200 words, no jargon."/>
    </div>
  );
}

export default UnhousedPage;
