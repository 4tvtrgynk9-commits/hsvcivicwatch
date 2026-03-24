import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function EnvironmentPage(){
  const[tab,setTab]=useState("overview");
  const tabs=[{id:"overview",label:"Overview"},{id:"pfas",label:"PFAS & Water"},{id:"air",label:"Air Quality"},{id:"transit",label:"Transit & Roads"}];
  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">ENVIRONMENT · INVESTIGATION</span>
        <h2>Environment, Water, <em>Transit & Roads</em></h2>
        <p>Redstone Arsenal PFAS contamination. Triana on EPA Superfund list. North Alabama air quality affected by Browns Ferry. No Sunday transit. Roads PCI 41 in north Huntsville. Here is the full environmental picture for Madison County.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy","#dc2626"],["PFOS Detected","Above EWG","Triana Water Works — cancer-linked forever chemical","#dc2626"],["Orbit Bus","No Sundays","9 routes, Mon-Fri 6am-9pm, Sat 7am-7pm only","#ea580c"],["Road PCI North","41 avg","Borderline 'Poor' — reconstruction needed","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <AiButton prompt="Investigate environmental issues in Madison County. FACTS: Redstone Arsenal PFAS contamination — linked to cancer, never fully publicly disclosed. Triana Water Works shows PFOS above EWG health guidelines. Triana on EPA Superfund list since 1983. Rep. Strong voted against PFAS Notification Act. Gov. Ivey received $340k from energy/industrial PACs, appoints ADEM leadership. ADEM among weakest enforcement agencies in Southeast. Huntsville Link bus: 9 routes, no Sunday service, 60-90 min frequency in 222-square-mile city. Road PCI north Huntsville avg 41 vs south 72 — same tax rate. Capital road spending 68% in south over past decade. Check your water at ewg.org/tapwater. Contact EPA Region 4 Atlanta: (404) 562-9900. Contact Rep. Strong's office: (256) 551-0190. Under 200 words, no jargon."/>
        </div>
      )}

      {tab==="pfas"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"PFAS FROM REDSTONE ARSENAL — WHAT IS KNOWN",lc:"#dc2626",tc:"#7f1d1d",text:"PFAS (per- and polyfluoroalkyl substances) from Redstone Arsenal contaminate soil and groundwater in Madison County. PFAS are linked to kidney cancer, thyroid disease, testicular cancer, and immune damage. The full extent of Arsenal PFAS contamination has never been fully publicly disclosed. Rep. Dale Strong voted against the PFAS Notification Act that would have required disclosure of contamination levels near military installations."},
            {k:"orange",label:"TRIANA WATER — PFOS ABOVE HEALTH GUIDELINES",lc:"#ea580c",tc:"#78350f",text:"PFOS — a PFAS forever chemical — has been detected above EWG health guidelines in Triana Water Works. The EPA set a maximum contaminant level of 4 parts per trillion for PFOS. EWG's health guideline is 1 ppt. Triana remains on the EPA Superfund list due to contamination from both Redstone Arsenal discharge into Indian Creek and Olin Corporation DDT manufacturing. Triana is a majority-Black community of 2,300 with no Huntsville City Council representation."},
            {k:"gold",label:"CHECK YOUR WATER — FREE",lc:"#b8860b",tc:"#78350f",text:"Visit ewg.org/tapwater and search your ZIP code. This shows every detected contaminant in your water supply, compared to both EPA limits and EWG's more protective health guidelines. Huntsville area water comes from Tennessee River and underground aquifers. Triana residents — and some Madison County residents — may have elevated PFAS exposure. Your Consumer Confidence Report is available free from Huntsville Utilities (hsvutil.org) or Triana Water Works."},
          ]}/>
        </div>
      )}

      {tab==="air"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"BROWNS FERRY — NORTH ALABAMA AIRSHED",lc:"#dc2626",tc:"#7f1d1d",text:"Browns Ferry Nuclear Plant in Athens, AL generates electricity 15 miles from Huntsville. Nuclear plants are carbon-free for operation but generate radioactive waste. TVA's generation portfolio is approximately 44% fossil fuels — the rest of TVA's power feeding North Alabama comes from natural gas and coal plants across the valley, contributing to regional air quality through the airshed."},
            {k:"gold",label:"EPA AIR QUALITY DATA — MADISON COUNTY",lc:"#b8860b",tc:"#78350f",text:"EPA AirNow tracks daily air quality for Madison County. Days with elevated ozone and particulate matter are most common in summer. Industrial facilities in the region — including defense industry operations — contribute to ambient pollution. Lower-income communities, including north Huntsville, have documented higher proximity to pollution sources. ADEM (Alabama Department of Environmental Management) enforcement is among the weakest in the Southeast. Gov. Ivey appoints ADEM leadership."},
            {k:"blue",label:"CHECK TODAY'S AIR QUALITY",lc:"#2563eb",tc:"#1e3a5f",text:"Visit airnow.gov and enter your ZIP code for real-time air quality data. Sign up for alerts when air quality reaches unhealthy levels — especially important for people with asthma, heart disease, or young children. North Huntsville zip codes (35810, 35811, 35816) have historically shown slightly elevated exposure metrics compared to south Huntsville."},
          ]}/>
        </div>
      )}

      {tab==="transit"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"HUNTSVILLE LINK — WHAT EXISTS AND WHAT'S MISSING",lc:"#dc2626",tc:"#7f1d1d",text:"Huntsville's transit system operates 9 routes, Monday-Friday 6am-9pm and Saturday 7am-7pm. NO Sunday service. 60-90 minute frequency means missing a bus means waiting over an hour. Routes cover 175 miles of streets in a city that now spans 222+ square miles — larger than Philadelphia. No direct transit to major employers: Huntsville Hospital main campus, Cummings Research Park, Amazon HSV1, or Redstone Arsenal civilian gates. Annual budget: $8.2M — among lowest per-capita in comparable cities."},
            {k:"gold",label:"WHO BENEFITS FROM KEEPING TRANSIT MINIMAL",lc:"#b8860b",tc:"#78350f",text:"Auto dealers sell more cars when transit is inadequate. Auto lenders collect more loan interest. Insurance companies collect more premiums. Real estate developers build car-dependent subdivisions. A car in Alabama costs approximately $8,000-12,000/year in payments, insurance, fuel, and maintenance — money that low-income workers cannot spare. Inadequate transit is a poverty trap as well as an environmental issue."},
            {k:"blue",label:"ROADS — THE NORTH-SOUTH MAINTENANCE GAP",lc:"#2563eb",tc:"#1e3a5f",text:"North Huntsville road PCI average: 41 (Poor — requires reconstruction). South Huntsville: 72 (Good). Same city. Same tax rate. 16-year documented gap. 68% of capital road spending went to south Huntsville over the past decade. Pothole complaint response times 2-3x longer in north. Federal CDBG funds require equitable distribution — this may constitute a federal compliance issue. File an Open Records request for the full PCI database by council district."},
          ]}/>
          <AiButton prompt="Investigate transit and roads in Huntsville. FACTS: Huntsville Link budget $8.2M, 9 routes, no Sunday service, 60-90 min frequency. No transit to Huntsville Hospital, Cummings Research Park, Amazon HSV1. North Huntsville road PCI avg 41 vs south 72 — same tax rate. 68% capital road spending in south over past decade. Pothole response 2-3x slower in north. Federal transit funding available. Car dependency trap: $8-12k/yr for low-income workers. Contact Mayor Battle's office: (256) 427-5000. Attend City Council when the Huntsville Link budget is on the agenda. Demand a transit equity study. Under 200 words, no jargon."/>
        </div>
      )}
    </div>
  );
}

// --- LAND USE PAGE ---

export { EnvironmentPage };
