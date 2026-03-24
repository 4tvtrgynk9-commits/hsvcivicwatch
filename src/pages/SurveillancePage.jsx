import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function SurveillancePage(){
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">SURVEILLANCE · INVESTIGATION</span>
        <h2>Surveillance & <em>Privacy</em></h2>
        <p>47 license plate readers track every vehicle in Huntsville — no public vote, no oversight board, no warrant required. Alabama has no data privacy law. Law enforcement can buy your location history without a warrant. Here is what is watching you.</p>
      </div>
      <div className="stats-grid" style={{marginBottom:16}}>
        {[["ALPRs","47+","License plate readers — every vehicle photographed","#dc2626"],["Warrant Required?","No","ALPR data stored 30-90 days — shared without warrant","#dc2626"],["AL Privacy Law","None","Zero comprehensive state data privacy law","#ea580c"],["Surveillance Budget","$4.1M","HPD tech contracts — up 180% since 2019","#ea580c"]].map(([l,v,s,c],i)=>(
          <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
        ))}
      </div>
      <FactBlocks facts={[
        {k:"red",label:"ALPR NETWORK — EVERY VEHICLE PHOTOGRAPHED",lc:"#dc2626",tc:"#7f1d1d",text:"HPD operates 47+ automated license plate readers through Flock Safety contracts. Every vehicle that passes an ALPR camera is photographed and logged — regardless of whether the driver has done anything wrong. Data is stored in Flock Safety's private cloud servers (not city servers) for 30-90 days. Accessible by other law enforcement agencies through data-sharing agreements without a warrant. No public vote was held before the network was installed. No City Council policy governs who can access the data or for what purpose."},
        {k:"gold",label:"FACIAL RECOGNITION — NOT CONFIRMED, NOT DENIED",lc:"#b8860b",tc:"#78350f",text:"HPD has not confirmed or denied whether it uses facial recognition technology. Alabama has no law requiring police departments to disclose surveillance technology use. NIST studies show facial recognition error rates of 10-35% for Black women — the highest error rates are for the demographic most likely to be stopped by HPD in north Huntsville based on documented patrol patterns."},
        {k:"blue",label:"COMMERCIAL DATA PURCHASES — NO WARRANT NEEDED",lc:"#2563eb",tc:"#1e3a5f",text:"Data brokers compile detailed profiles on every adult: location history, health-related searches, political affiliations, financial data. Law enforcement agencies — including in Alabama — can purchase this data to bypass warrant requirements that would apply if they collected it directly. Alabama has no law requiring disclosure of such purchases. You have no right to know if your profile has been bought and shared with HPD or the Sheriff."},
        {k:"green",label:"WHAT OTHER CITIES HAVE DONE",lc:"#16a34a",tc:"#14532d",text:"Nashville TN: requires City Council approval for new surveillance technology and annual public reporting. Oakland CA: surveillance oversight ordinance since 2018, public impact assessments required. Portland OR: banned facial recognition by city government. Huntsville has no equivalent ordinance. A surveillance oversight ordinance can be passed by City Council — it does not require state legislation."},
      ]}/>
      <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10}}>CHECK YOUR WATER AND YOUR DATA</div>
        <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>Contact your City Council member and demand a surveillance transparency ordinance requiring: (1) public notice before any new surveillance technology is deployed, (2) annual public reporting on how ALPR data is accessed and shared, (3) a data retention limit policy, (4) prohibition on purchasing commercial location data without a warrant. Council contact: (256) 427-5000 · huntsvilleal.gov/government/city-council</div>
      </div>
      <div style={{marginTop:14}}>
        <AiButton prompt="Investigate Huntsville surveillance infrastructure and Alabama data privacy. FACTS: HPD operates 47+ ALPR cameras through Flock Safety — photographs every vehicle, stores data 30-90 days in private cloud, accessible by other agencies without warrant. HPD has not confirmed or denied facial recognition use — Alabama has no disclosure law. NIST facial recognition error rates: 10-35% for Black women. Commercial location data can be purchased by law enforcement without warrant. Alabama has no comprehensive state data privacy law. HPD surveillance budget: $4.1M — up 180% since 2019. No public vote was held before ALPR network installed. Decode for a Huntsville resident — what this means, what is being done elsewhere, and what residents can demand from City Council. Under 200 words, no jargon."/>
      </div>
    </div>
  );
}


// --- VOTER EMPOWERMENT PAGE ---

export { SurveillancePage };
