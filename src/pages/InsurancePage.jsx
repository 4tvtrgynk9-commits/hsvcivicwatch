import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function InsurancePage(){
  const[tab,setTab]=useState("health");

  const tabs=[
    {id:"health",label:"🏥 Health Insurance"},
    {id:"medicaid",label:"⚠ Medicaid Denied"},
    {id:"bcbs",label:"🏢 BCBS Monopoly"},
    {id:"dental",label:"🦷 Dental & Vision"},
    {id:"auto",label:"🚗 Auto Insurance"},
    {id:"gap",label:"📊 Coverage Gap"},
  ];

  return(
    <div className="page">
      <div className="page-header">
        <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-navy">INSURANCE & MONOPOLY POWER</span>
        <h2>Who Profits From <em>Your Coverage</em></h2>
        <p>Blue Cross Blue Shield of Alabama controls 90%+ of the insurance market and just settled a $2.67B antitrust lawsuit. Gov. Ivey refuses $1.8B/yr in federal Medicaid funding. 295,000 Alabamians have no coverage. Here is the documented loop — and who benefits.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="health"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["BCBS 2026 Hike","+19.3%","210,000+ AL members — largest by far","#dc2626"],["Bronze Premium","$436-490/mo","Madison County — among highest in AL","#dc2626"],["After-Subsidy Avg","$121/mo","Tripled from $44/mo when enhanced credits expired Dec 2025","#ea580c"],["AL Uninsured","~9.8%","~32-36k in Madison County","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Blue Cross Blue Shield Alabama — Bronze Premium 2022–2026</div>
            {[{y:2022,m:310,note:"Enhanced ACA subsidies — avg after-subsidy $44/mo"},{y:2023,m:320,note:"+3.1% · Subsidies in effect"},{y:2024,m:335,note:"+4.7% · Subsidies extended"},{y:2025,m:400,note:"+19.4% — subsidies expiring"},{y:2026,m:490,note:"+19.3% · Subsidies expired · avg after-subsidy tripled to $121/mo"}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:"#6b7280",minWidth:36}}>{r.y}</span>
                <div style={{flex:1,background:"#f0ebe2",borderRadius:3,height:22,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,height:"100%",width:(r.m/490*100)+"%",background:r.m>400?"#dc2626":r.m>335?"#ea580c":"#93b4d4",borderRadius:3}}/>
                  <span style={{position:"absolute",right:6,top:3,fontSize:10,fontWeight:700,color:"#1e3a5f"}}>${r.m}/mo</span>
                </div>
                <span style={{fontSize:10,color:"#6b7280",minWidth:160,flexShrink:0}}>{r.note}</span>
              </div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"THE $2.67B ANTITRUST SETTLEMENT — PAYMENTS START MAY 2026",lc:"#dc2626",tc:"#7f1d1d",text:"A 2013 federal lawsuit accused Blue Cross Blue Shield companies of dividing the US into exclusive territories and agreeing not to compete — keeping prices artificially high. BCBS settled for $2.67 billion. Final approval for the provider settlement: August 19, 2025. Claim notices went out February 16, 2026. Payments expected May 2026. If you had BCBS coverage between February 8, 2008 and October 16, 2020, you may be eligible. Check BCBSSettlement.com."},
            {k:"gold",label:"HOW BCBS SETS YOUR PREMIUM WITH NO REAL COMPETITION",lc:"#b8860b",tc:"#78350f",text:"Blue Cross Blue Shield of Alabama controls approximately 90%+ of Alabama's individual health insurance market. With no real competition, BCBS sets rates that reflect their dominance — not a competitive market. The Alabama Department of Insurance (ALDOI) must approve rate increases, but has never rejected a major BCBS increase. The 2026 rate filing cited: subsidy expiration, higher claims, and rising admin costs. States with Medicaid expansion and more competitive markets show significantly lower premium growth."},
          ]}/>
          <ActionButtons actions={[
            {label:"Check Settlement Eligibility",href:"https://www.bcbssettlement.com"},
            {label:"File Insurance Complaint — ALDOI",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI Consumer Services",tel:"18004333966"},
            {label:"Contact Gov. Ivey — Demand Medicaid Expansion",href:"https://governor.alabama.gov/contact/"},
          ]}/>
        </div>
      )}

      {tab==="medicaid"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["Uninsured — AL","295,000","US citizens — Medicaid refused every year since 2014","#dc2626"],["Federal Pays","90%","Of Medicaid expansion cost — state pays just 10%","#16a34a"],["Revenue Refused","~$1.8B/yr","Federal funding Gov. Ivey declines annually","#dc2626"],["Jobs That Would Come","~10,000","Healthcare jobs created by expansion","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"WHO EXACTLY IS IN THE COVERAGE GAP",lc:"#dc2626",tc:"#7f1d1d",text:"These are people who earn too much to qualify for Alabama's current Medicaid — which covers only very low-income families with children, pregnant women, and disabled individuals — but too little to afford subsidized marketplace plans. The income threshold is roughly $14,580/yr for a single adult. A gig worker earning $16,000/yr or a part-time retail worker earning $18,000/yr falls directly into this gap. 295,000 Alabamians are in this exact situation. Every state that expanded Medicaid closed this gap."},
            {k:"blue",label:"THE MATH: FEDERAL PAYS 90% PERMANENTLY",lc:"#2563eb",tc:"#1e3a5f",text:"Under the Affordable Care Act (ACA), the federal government pays 90% of Medicaid expansion cost — permanently. Alabama's share would be approximately $200M/yr at current estimates. This is offset by: reduced uncompensated care costs at hospitals, ~10,000 healthcare jobs created, reduced emergency room use, and increased state income tax revenue from new workers. States that expanded Medicaid have documented net fiscal benefits within 2–4 years. Gov. Ivey declines $1.8B/yr in federal funding."},
            {k:"gold",label:"WHO BENEFITS FROM KEEPING MEDICAID CLOSED",lc:"#b8860b",tc:"#78350f",text:"Blue Cross Blue Shield of Alabama benefits directly: when Medicaid doesn't expand, more people need private insurance — growing their market. BCBS donated $220,000 to Gov. Ivey. Without expansion, people in the gap either go uninsured (and use emergency rooms, pushing costs onto hospitals and other patients) or buy BCBS plans when eligible. The loop: BCBS funds Ivey → Ivey refuses expansion → BCBS market stays large → BCBS raises premiums 19.3% → BCBS profits → repeat."},
            {k:"green",label:"WHAT 37 OTHER STATES DID — AND WHAT HAPPENED",lc:"#16a34a",tc:"#14532d",text:"37 states have expanded Medicaid. Every state that expanded saw: uninsured rate drop, rural hospitals stabilize, and net fiscal benefit to the state budget within a few years. Georgia expanded in 2023 — partial expansion, immediate enrollment gains. North Carolina expanded in 2023. Tennessee has TennCare covering ~1.5M residents. Alabama is one of 10 states that have not expanded. The governor can expand by executive action — no legislative vote required. Gov. Ivey has refused every year since 2014."},
          ]}/>
          <ActionButtons title="WHAT YOU CAN DO RIGHT NOW" actions={[
            {label:"Contact Gov. Ivey — Demand Medicaid",href:"https://governor.alabama.gov/contact/"},
            {label:"Call Gov. Ivey's Office",tel:"3342427100"},
            {label:"Email Gov. Ivey",email:"governor.ivey@governor.alabama.gov",subject:"Demand Medicaid Expansion — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nAlabama is one of 10 states that has not expanded Medicaid. 295,000 Alabamians — US citizens — have no health coverage. The federal government pays 90% of the cost. The state's 10% share is offset by reduced uncompensated care costs and new jobs created.\n\nI am demanding you expand Medicaid. You have the authority to do this by executive action.\n\n[Your Name]\n[Your Address]"},
            {label:"Check If You Qualify — Healthcare.gov",href:"https://healthcare.gov"},
            {label:"AL Medicaid — Current Eligibility",href:"https://medicaid.alabama.gov"},
          ]}/>
        </div>
      )}

      {tab==="bcbs"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["BCBS AL Market Share","90%+","Individual market — near-monopoly since 1936","#dc2626"],["Antitrust Settlement","$2.67B","Payments starting May 2026 — market division proven","#dc2626"],["SB 247","Passed Senate 32-0","Lets BCBS form holding company — in AL House","#ea580c"],["BCBS → Ivey","$220,000","Documented donations — she refuses Medicaid","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"HOW ONE INSURER CONTROLS YOUR RATE",lc:"#dc2626",tc:"#7f1d1d",text:"Blue Cross Blue Shield of Alabama has operated in the state since 1936. With approximately 90%+ of the individual market and dominant employer group market share, there is no meaningful competition. In a competitive market, insurers compete on price. In Alabama's market, ALDOI must approve rates — but has never rejected a major BCBS increase. The practical result: BCBS sets the price, you pay it, or you go uninsured. The antitrust lawsuit proved they coordinated to prevent competition across state lines."},
            {k:"gold",label:"SB 247 — THE BILL THAT COULD MAKE IT WORSE",lc:"#b8860b",tc:"#78350f",text:"Senate Bill 247 (SB 247) passed the Alabama Senate 32-0 and is pending in the House. It would allow BCBS to create a holding company structure — enabling it to diversify into other business lines beyond regulated insurance. Critics argue this reduces accountability by allowing BCBS to shift profits out of regulated insurance operations, making future rate increase justifications harder to challenge. ALDOI issued no formal objection. BCBS donated to multiple senators who voted yes."},
            {k:"blue",label:"THE ANTITRUST SETTLEMENT — WHAT IT MEANS",lc:"#2563eb",tc:"#1e3a5f",text:"BCBS affiliates were accused of dividing the US market into exclusive territories and agreeing not to compete across state lines — the exact arrangement that kept BCBS Alabama from facing competition. Settlement final approval: August 19, 2025. Payments to eligible subscribers begin May 2026. If you had BCBS between February 8, 2008 and October 16, 2020, check BCBSSettlement.com. The settlement also required BCBS to change certain operational practices. Federal court monitoring continues."},
          ]}/>
          <ActionButtons actions={[
            {label:"Check Settlement Eligibility",href:"https://www.bcbssettlement.com"},
            {label:"File BCBS Complaint — ALDOI",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI",tel:"18004333966"},
            {label:"DOJ Antitrust — Report BCBS Violations",href:"https://www.justice.gov/atr/citizen-complaint-center"},
            {label:"AL House Insurance Committee",href:"https://www.legislature.state.al.us"},
          ]}/>
        </div>
      )}

      {tab==="dental"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["Annual Dental Max","$1,500","Unchanged since 1975 — one crown uses the entire benefit","#dc2626"],["Basic Dental Premium","$35/mo","$420/yr for coverage that won't cover major work","#ea580c"],["Vision Premium","$18/mo","Eye exam + frames once a year — basic only","#6b7280"],["AL Medicaid Dental","Adults excluded","TN and GA cover some adult dental — AL does not","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"THE $1,500 CAP — SET IN 1975, NEVER UPDATED",lc:"#dc2626",tc:"#7f1d1d",text:"Most employer dental plans cap annual benefits at $1,500 — the same limit set in the 1970s. Adjusted for inflation, $1,500 in 1975 = approximately $8,200 today. A single crown costs $1,000-$1,500. A root canal plus crown can exceed $2,500. One dental problem wipes out your entire annual benefit. Delta Dental, Guardian, Cigna — every major carrier maintains this industry-standard cap with no regulatory requirement to update it."},
            {k:"gold",label:"ALABAMA MEDICAID — ADULT DENTAL EXCLUDED",lc:"#b8860b",tc:"#78350f",text:"Alabama Medicaid covers dental for children under 21 but excludes routine adult dental care entirely. Emergency extractions only are covered for adults. Compare: Tennessee TennCare covers some adult dental. Georgia Medicaid covers a limited adult dental benefit. The 2021 federal infrastructure bill allowed states to add adult dental to Medicaid — Alabama declined. Untreated dental disease leads to infections, hospital visits, and missed work — costs that exceed what prevention would have cost."},
          ]}/>
        </div>
      )}

      {tab==="auto"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Avg Auto Premium","$163/mo","$1,956/yr — above national average","#dc2626"],["North Hsv ZIP","~$185/mo","Higher rate for same car, same driver","#dc2626"],["South Hsv ZIP","~$148/mo","Lower rate — same city, ZIP code pricing","#ea580c"],["AL Uninsured Drivers","~18%","Among highest in US — poverty + high premiums","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <FactBlocks facts={[
            {k:"red",label:"ZIP CODE PRICING — NORTH HUNTSVILLE PAYS MORE FOR THE SAME CAR",lc:"#dc2626",tc:"#7f1d1d",text:"Alabama allows auto insurers to price premiums based partly on where you live — your ZIP code. A driver with an identical record driving the same car pays $30-50/month more in north Huntsville ZIP codes (35810, 35811, 35816) than in south Huntsville ZIP codes (35802, 35803). Over a year that's $360-600 extra for the same risk. ZIP code pricing correlates with race and income. California, New Jersey, Michigan, Hawaii, and Massachusetts have banned or strictly limited ZIP code pricing. Alabama has no such restriction."},
            {k:"gold",label:"18% UNINSURED RATE — THE POVERTY-PREMIUM TRAP",lc:"#b8860b",tc:"#78350f",text:"Alabama has one of the highest uninsured driver rates in the country — approximately 18%. The connection is direct: minimum wage $7.25/hr, auto premiums averaging $163/month ($1,956/yr), and no public transit alternative in a 222+ square mile city. Workers earning $15,000/yr spend 13% of gross income on car insurance alone. Many can't afford it and drive anyway — which raises rates for everyone who does pay."},
            {k:"blue",label:"HOW TO ACTUALLY LOWER YOUR RATE",lc:"#2563eb",tc:"#1e3a5f",text:"Shop every year — loyalty discounts are mostly myth, switching carriers can save $300-600/yr. Ask specifically about: paperless billing discount, low-mileage discount if you drive under 7,500/yr, and bundling with renters insurance. GEICO and Progressive typically undercut State Farm and Allstate in Alabama for lower-income ZIP codes. File a complaint with ALDOI if your rate increase seems unjustified — Consumer Services: 1-800-433-3966."},
          ]}/>
          <ActionButtons actions={[
            {label:"Compare AL Auto Rates",href:"https://aldoi.gov/"},
            {label:"File Auto Insurance Complaint",href:"https://aldoi.gov/Complaints/Complaints.aspx"},
            {label:"Call ALDOI",tel:"18004333966"},
          ]}/>
        </div>
      )}

      {tab==="gap"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Coverage Gap","~90,000","Earn too little for subsidies, too much for Medicaid","#dc2626"],["Madison Co. Uninsured","~32-36k","~8-9% of county — disproportionately working adults","#dc2626"],["Single Adult Threshold","$14,580/yr","Earn less = Medicaid gap. More = ACA subsidies eligible","#ea580c"],["130k at Risk","Subsidy loss","Could lose all coverage if ACA enhanced credits end","#dc2626"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Who Falls Through — 5 Real Profiles</div>
            {[
              {who:"Gig delivery worker",income:"$22,000/yr",why:"Earns over Medicaid threshold. No employer coverage. Bronze plan: $436/mo = 24% of income.",c:"#dc2626"},
              {who:"Part-time retail (29 hrs/wk)",income:"$17,500/yr",why:"Under 30 hrs = no employer coverage. Earns too much for AL Medicaid, too little for ACA subsidies.",c:"#ea580c"},
              {who:"55–64 year old, early retiree",income:"$45,000/yr",why:"Too young for Medicare (age 65+). No employer coverage. 2026 Silver plan: $900+/mo.",c:"#dc2626"},
              {who:"Small business employee (under 50 workers)",income:"$28,000/yr",why:"Employer not required to offer coverage. Bronze deductible $7,000 means coverage is nearly unusable.",c:"#ea580c"},
              {who:"Between jobs",income:"$0 temporarily",why:"COBRA continuation costs $700+/mo. Short-term gap plans don't cover pre-existing conditions.",c:"#7f1d1d"},
            ].map((p,i)=>(
              <div key={i} style={{marginBottom:8,padding:"10px 12px",borderRadius:4,borderLeft:"4px solid "+p.c,background:"#fafaf8",border:"1px solid #e0d8cc",borderLeft:"4px solid "+p.c}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{p.who}</span>
                  <span style={{fontFamily:"monospace",fontSize:12,color:p.c,fontWeight:700}}>{p.income}</span>
                </div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{p.why}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#6b7280",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>Alabama vs Neighbors — Medicaid Expansion Impact</div>
            {[
              {state:"Tennessee",uninsured:"10.8%",medicaid:"Expanded 2013",note:"TennCare covers ~1.5M. Higher wages, lower uninsured rate than AL despite no state income tax.",c:"#16a34a"},
              {state:"Georgia",uninsured:"12.2%",medicaid:"Partial expansion 2023",note:"Still catching up but expanding. Even partial expansion reduced uninsured rate.",c:"#c9a84c"},
              {state:"North Carolina",uninsured:"9.4%",medicaid:"Expanded 2023",note:"Late expander — immediate enrollment gains, rural hospitals stabilizing.",c:"#16a34a"},
              {state:"Alabama",uninsured:"9.8%",medicaid:"REFUSED since 2014",note:"Gov. Ivey refuses $1.8B/yr federal funding. BCBS donated $220k to Ivey. 295,000 US citizens uninsured.",c:"#dc2626"},
              {state:"Mississippi",uninsured:"12.5%",medicaid:"Not expanded",note:"The only SEC state with a worse uninsured rate than Alabama. Also hasn't expanded.",c:"#ea580c"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<4?"1px solid #f0ebe2":"none",alignItems:"flex-start"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:s.c,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:3}}>
                    <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.state}</span>
                    <span style={{fontSize:12,color:s.c,fontWeight:700}}>{s.medicaid}</span>
                  </div>
                  <div style={{fontSize:12,color:"#6b7280"}}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
          <ActionButtons actions={[
            {label:"Check Your Eligibility",href:"https://healthcare.gov"},
            {label:"AL Medicaid Eligibility",href:"https://medicaid.alabama.gov"},
            {label:"Contact Gov. Ivey",href:"https://governor.alabama.gov/contact/"},
            {label:"Call Gov. Ivey",tel:"3342427100"},
            {label:"Email Gov. Ivey — Expand Medicaid",email:"governor.ivey@governor.alabama.gov",subject:"Expand Medicaid — 295,000 Alabamians Uninsured",body:"Dear Governor Ivey,\n\nAlabama is one of 10 states that has not expanded Medicaid. 295,000 Alabamians are uninsured. The federal government pays 90% of the cost. I demand you expand Medicaid.\n\n[Your Name]"},
          ]}/>
        </div>
      )}
    </div>
  );
}


// --- HEALTH SYSTEM PAGE ---

export { InsurancePage };
