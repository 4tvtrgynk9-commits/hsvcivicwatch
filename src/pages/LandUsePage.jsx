import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function LandUsePage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">LAND USE · INVESTIGATION</span>
        <h2>Land Use & <em>Business Equity</em></h2>
        <p>Huntsville annexed 2,000+ acres in 2025 — now larger than Denver and Las Vegas. TIF districts divert school funding for 20 years. North Huntsville gets code enforcement while south gets capital investment. Here is who petitions for annexations and who donates to the officials who approve them.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["2025 Annexed","2,000+ acres","Now larger by area than Denver and Las Vegas","#dc2626"],["Clift Farm TIF","$1.2M/yr","Diverted from Madison County Schools for ~20 years","#dc2626"],["MidCity Investment","$350M+","Private development since 2018 — south Huntsville","#1e3a5f"],["N.Hsv Code Enforcement","78%","Of city actions — vs 35% in south","#ea580c"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"red",label:"ANNEXATION PATTERN — EVERY MAJOR ANNEXATION SINCE 2019 WAS DEVELOPER-INITIATED",lc:"#dc2626",tc:"#7f1d1d",text:"Every major Huntsville annexation since 2019 was initiated by a landowner or developer — not by residents requesting services. New annexed areas receive city utilities within months as a condition. North Huntsville neighborhoods built in the 1960s and 70s have waited decades for comparable infrastructure. 4 of the 5 council members who voted for the January 2025 394-acre annexation received campaign donations from real estate developers before the vote. Council Member Watkins — the only no vote — said: 'You are breaking the schools at the seam.'"},
        {k:"gold",label:"TIF DISTRICTS — SCHOOLS PAY THE PRICE FOR 20 YEARS",lc:"#b8860b",tc:"#78350f",text:"Tax Increment Financing freezes the property tax base when a TIF is created. All future property tax growth within the TIF area goes to repay developer-benefiting bonds — not to schools. The Clift Farm TIF diverts an estimated $1.2M per year from Madison County Schools for approximately 20 years. That is $24M in school funding redirected to subsidize a private developer. RCP Companies, the Clift Farm developer, donated to three of four council members who voted yes on the original annexation."},
        {k:"blue",label:"BUSINESS LOCATION EQUITY — WHY NORTH HUNTSVILLE WAITS",lc:"#2563eb",tc:"#1e3a5f",text:"Business location decisions follow infrastructure quality. North Huntsville roads average PCI 41 (Poor) vs south Huntsville PCI 72 (Good). IDB abatements — which eliminate property tax for up to 20 years — have no requirement to locate in underserved areas. MidCity received $350M+ in private investment since 2018. IDB abatements for developments in north Huntsville: minimal. Code enforcement actions concentrated in north Huntsville create an additional disincentive for businesses considering north Huntsville locations."},
      ]}/>
      <AiButton prompt="Investigate Huntsville annexations and land use inequity. FACTS: 2,000+ acres annexed 2025 — Huntsville now larger than Denver and Las Vegas. January 2025: 394 acres, 4-1 vote, only Watkins voted no. All major annexations since 2019 developer-initiated. Clift Farm TIF diverts $1.2M/yr from Madison County Schools for 20 years. RCP Companies donated to 3 of 4 yes-voting council members. 68% capital road spending in south over past decade. IDB abatements $127M+ with no underserved-area requirement. Code enforcement actions: 78% north Huntsville vs 35% south. MidCity $350M+ investment south — north Huntsville minimal. Contact your council member. Attend council meetings when annexations are on agenda. File Open Records for IDB abatement agreements. Under 200 words, no jargon."/>
    </div>
  );
}

// --- PROPOSALS PAGE ---

export { LandUsePage };
