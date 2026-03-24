import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function TaxesPage(){
  const[tab,setTab]=useState("overview");
  const[homeValue,setHomeValue]=useState(250000);
  const[incomeVal,setIncomeVal]=useState(55000);
  const[filingStatus,setFilingStatus]=useState("single");
  const[area,setArea]=useState("huntsville");
  const AREAS={
    huntsville:{name:"Huntsville City",rate:5.80,note:"Includes city, county & HCS school levy"},
    madison_city:{name:"Madison City",rate:6.95,note:"Highest in county — Madison City Schools"},
    triana:{name:"Triana",rate:6.15,note:"Includes city & county levy"},
    new_hope:{name:"New Hope / Gurley / Owens Cross Roads",rate:4.05,note:"Small municipal area"},
    harvest:{name:"Harvest / Meridianville (unincorporated)",rate:3.65,note:"County rate for improvements"},
    county:{name:"Rural Madison County (unincorporated)",rate:3.35,note:"Lowest in county — land rate"},
  };
  const ar=AREAS[area];
  const assessedVal=Math.round(homeValue*0.1);
  const annualTax=Math.round(assessedVal*(ar.rate/100));
  const businessTax=Math.round(homeValue*0.2*(ar.rate/100));
  // Alabama income tax (2025)
  const stdDed=filingStatus==="married"?6700:2500;
  const personalEx=filingStatus==="married"?3000:1500;
  const taxableIncome=Math.max(0,incomeVal-stdDed-personalEx);
  function alIncomeTax(ti){
    if(ti<=500)return ti*0.02;
    if(ti<=3000)return 10+(ti-500)*0.04;
    return 110+(ti-3000)*0.05;
  }
  const estimatedALTax=alIncomeTax(taxableIncome);
  const effectiveRate=(estimatedALTax/Math.max(incomeVal,1)*100).toFixed(1);
  const tabs=[{id:"overview",label:"Overview"},{id:"property",label:"Property Tax"},{id:"grocery",label:"Grocery Tax"},{id:"income",label:"Income Tax"},{id:"calculator",label:"🧮 Calculator"}];
  const millage=0.00382;
  const estimatedTax=Math.round(homeValue*0.1*millage);

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-gold">TAXES · INVESTIGATION</span>
        <h2>Taxes: <em>Who Pays What</em></h2>
        <p>Alabama's tax system shifts the burden from corporations to individuals. Property abatements give corporations $0 property tax. Grocery taxes hit poor families hardest. Income taxes kick in at $500 of income. Here is the full picture.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["IDB Abatements","$127M+","Active — corporations pay $0 property tax for years","#dc2626"],["Grocery Tax","~9% combined","37 states have zero grocery tax","#ea580c"],["Income Tax Floor","$500","AL taxes income starting at $500 — lowest in US","#dc2626"],["Corporate Tax","Lower than workers","BCA lobbied for every exemption in the code","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <AiButton prompt="Investigate the full tax burden structure in Madison County. FACTS: IDB has granted $127M+ in active property tax abatements — corporations pay $0 for up to 20 years, homeowners pay full millage rate. Alabama grocery tax: state cut to 2% in September 2025 but Huntsville area combined rate still ~9%. 37 states exempt groceries entirely. AL income tax kicks in at $500 of income — one of lowest thresholds in nation. Military retirement pay fully exempt. Corporate effective rates lower than many working families. AL ranks near bottom for tax fairness — regressive structure. How does this connect to political donations from BCA ($45k to Orr), insurance industry ($420k to Ivey), and real estate developers ($380k to Battle)? Under 200 words, no jargon."/>
        </div>
      )}

      {tab==="property"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"IDB ABATEMENTS — CORPORATIONS PAY NOTHING",lc:"#dc2626",tc:"#7f1d1d",text:"Huntsville's Industrial Development Board has granted $127M+ in active corporate property tax abatements. These companies pay zero property tax for up to 20 years. Meanwhile every homeowner pays the full millage rate. The revenue not collected must come from somewhere — it comes from reduced school funding, slower road maintenance, and fewer services. The IDB board is appointed entirely by Mayor Battle with no public election ever."},
            {k:"gold",label:"HOW PROPERTY TAX WORKS IN HUNTSVILLE",lc:"#b8860b",tc:"#78350f",text:"Alabama uses an Assessed Value system. Residential property is assessed at 10% of market value, then multiplied by the millage rate. Huntsville's combined millage (city + county + school) is approximately 38.2 mills. On a $200,000 home: assessed value = $20,000, tax = $20,000 × 0.0382 = approximately $764/year. Alabama has among the lowest property tax rates in the nation — but that low rate applies equally to homeowners and to corporate facilities that haven't been exempted by the IDB."},
            {k:"blue",label:"THE IDB ABATEMENT AUDIT THAT DOESN'T EXIST",lc:"#2563eb",tc:"#1e3a5f",text:"The IDB has never been required to publish a comprehensive audit of whether promised jobs were actually delivered in exchange for abatements. Some abatements come with job creation requirements — but enforcement is minimal. File an Open Records request for all active IDB abatement agreements, including: company name, abatement duration, promised job creation, and actual documented job creation. This is a public document you are entitled to."},
          ]}/>
        </div>
      )}

            {tab==="grocery"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:14}}>
            {[["AL Grocery Tax Rate","~9% combined","State 2% + local ~7% — city can reduce, most haven't","#dc2626"],["Annual Cost — Family of 4","~$720/yr","Based on $600/mo groceries at combined 10% rate vs 0%","#ea580c"],["States w/ No Grocery Tax","37","Alabama is in the minority — and among the most regressive","#dc2626"],["TN Grocery Tax","4%","Neighboring state — still taxed but lower than most AL areas","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>

          {/* State comparison chart */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Grocery Tax — Alabama vs Other States</div>
            {[
              {state:"Alabama (combined)",rate:9,color:"#dc2626",note:"State 2% + most local areas ~7%. Huntsville adds its full sales tax on groceries."},
              {state:"Tennessee",rate:4,color:"#ea580c",note:"Taxed but at reduced 4% rate — TN specifically chose a lower grocery rate."},
              {state:"Georgia",rate:0,color:"#16a34a",note:"No state grocery tax. Some local taxes apply."},
              {state:"Texas",rate:0,color:"#16a34a",note:"Groceries fully exempt from state sales tax."},
              {state:"Florida",rate:0,color:"#16a34a",note:"Groceries exempt."},
              {state:"Virginia",rate:2.5,color:"#c9a84c",note:"Reduced rate of 2.5% — actively chose to minimize burden."},
              {state:"37 Other States",rate:0,color:"#16a34a",note:"No grocery tax at all. Alabama is in a shrinking minority."},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{minWidth:120,fontSize:12,fontWeight:600,color:"#374151"}}>{s.state}</div>
                <div style={{flex:1,height:20,background:"#f0ebe2",borderRadius:3,position:"relative",overflow:"hidden"}}>
                  {s.rate>0&&<div style={{position:"absolute",top:0,left:0,height:"100%",width:(s.rate/10*100)+"%",background:s.color,borderRadius:3}}/>}
                  <span style={{position:"absolute",right:6,top:2,fontSize:10,fontWeight:700,color:"#1e3a5f"}}>{s.rate===0?"FREE":s.rate+"%"}</span>
                </div>
                <div style={{fontSize:10.5,color:"#6b7280",minWidth:140,flexShrink:0}}>{s.note}</div>
              </div>
            ))}
          </div>

          <FactBlocks facts={[
            {k:"red",label:"WHO IS HURT MOST — THE REGRESSIVE MATH",lc:"#dc2626",tc:"#7f1d1d",text:"A family earning $30,000/yr spends approximately 15% of income on food ($4,500/yr). At 9% tax that's $405/yr in grocery tax. A family earning $150,000/yr spends roughly 6% on food ($9,000/yr). At 9% that's $810/yr — twice the dollar amount, but only 0.5% of income. This is a regressive tax by definition: the lower your income, the higher the percentage you pay. North Huntsville residents — lower-income, more food-insecure — pay a disproportionate share."},
            {k:"gold",label:"HOW CITIES CAN OPT OUT — AND WHY MOST HAVEN'T",lc:"#b8860b",tc:"#78350f",text:"When Alabama reduced the state grocery tax from 4% to 3% in 2023 and to 2% in 2025, it passed a law ALLOWING — but not requiring — cities and counties to reduce their local grocery tax. Huntsville and most other municipalities chose not to reduce theirs. A Huntsville City Council vote could reduce or eliminate the local grocery tax at any time. No state approval required. Council Member Watkins has expressed concern about regressive taxes. Contact your council member directly — ask them to introduce a grocery tax reduction ordinance."},
          ]}/>

          {/* Tampon Tax section */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12,borderLeft:"4px solid #9333ea"}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9333ea",letterSpacing:1.5,marginBottom:10,textTransform:"uppercase"}}>The "Tampon Tax" — Taxing Biological Necessity</div>
            {[
              ["Monthly product cost (individual)","$10-20/mo","Based on tampons, pads, or menstrual cup amortized over time"],
              ["Annual product cost","$120-240/yr","Before tax — unavoidable biological expense"],
              ["Annual tax paid (at 9%)","$11-22/yr","Per woman for unavoidable hygiene products"],
              ["Family with 3 women (mother + 2 daughters)","$33-66/yr","In taxes alone — on products classified as 'luxury items'"],
            ].map(([l,v,n],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",marginBottom:6,borderRadius:4,background:i%2===0?"#f8f6f2":"#faf5ff",border:"1px solid #e0d8cc",flexWrap:"wrap",gap:4}}>
                <div>
                  <div style={{fontSize:12.5,fontWeight:600,color:"#374151"}}>{l}</div>
                  <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic"}}>{n}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:"#9333ea"}}>{v}</span>
              </div>
            ))}
            <div style={{background:"#faf5ff",borderRadius:4,padding:"10px 12px",marginTop:8,fontSize:13,color:"#5b21b6",lineHeight:1.65}}>
              Alabama classifies menstrual products as non-essential luxury items — same category as jewelry. <strong>30+ states have eliminated the tampon tax.</strong> Including: California, Florida, Illinois, New York, Ohio, Texas, Virginia, and more — red, blue, and purple states all. Contact your City Council member and state legislators to demand elimination of the tax on menstrual products in Alabama.
            </div>
            <ActionButtons actions={[
              {label:"Contact Mayor Battle — Grocery Tax",tel:"2564275000"},
              {label:"Email Council Member Watkins",email:"michelle.watkins@huntsvilleal.gov",subject:"Grocery Tax Reduction Ordinance",body:"Dear Council Member Watkins,\n\nI am requesting that you introduce an ordinance to reduce or eliminate Huntsville's local grocery tax. Alabama law allows cities to reduce their local grocery tax rate at any time.\n\nHuntsville residents — particularly in lower-income areas — pay nearly 9% combined sales tax on groceries. This is among the highest in the region and falls hardest on families with the least income.\n\n[Your Name]\n[Your Address]"},
              {label:"AL Legislature — Contact Your Rep",href:"https://www.legislature.state.al.us"},
            ]}/>
          </div>
        </div>
      )}

            {tab==="income"&&(
        <div>
          {/* Alabama income tax brackets */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Alabama Income Tax Brackets — 2025</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:8}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:8}}>SINGLE / HEAD OF HOUSEHOLD</div>
                {[["$0 – $500","2%"],["$501 – $3,000","4%"],["Over $3,000","5%"]].map(([r,p],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:i%2===0?"#f8f6f2":"#fff",borderRadius:3,marginBottom:3}}>
                    <span style={{fontSize:12.5,color:"#374151"}}>{r}</span>
                    <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#dc2626"}}>{p}</span>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Standard deduction: $2,500 · Personal exemption: $1,500</div>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:8}}>MARRIED FILING JOINTLY</div>
                {[["$0 – $1,000","2%"],["$1,001 – $6,000","4%"],["Over $6,000","5%"]].map(([r,p],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:i%2===0?"#f8f6f2":"#fff",borderRadius:3,marginBottom:3}}>
                    <span style={{fontSize:12.5,color:"#374151"}}>{r}</span>
                    <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#dc2626"}}>{p}</span>
                  </div>
                ))}
                <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Standard deduction: $6,700 · Personal exemption: $3,000 (+ $1,000/dependent)</div>
              </div>
            </div>
            <div style={{background:"#fef2f2",borderRadius:4,padding:"8px 12px",fontSize:12,color:"#7f1d1d"}}>
              Alabama income tax kicks in at just <strong>$500 of income</strong> — one of the lowest thresholds in the US. A worker earning $15,000/yr pays the same 5% top rate as someone earning $150,000/yr. This flat-top structure is <strong>regressive</strong>.
            </div>
          </div>

          {/* Individual vs Corporate vs Small Biz comparison */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Who Pays What — Individual vs Corporate vs Small Business</div>
            {[
              {entity:"Individual worker ($55k/yr)",rate:"Effective ~4.2%",paid:"~$2,300/yr AL income tax",advantages:"Standard deduction $2,500 — minimal",color:"#dc2626",icon:"👤"},
              {entity:"Large corporation (C-Corp)",rate:"Alabama 6.5%",paid:"6.5% of net Alabama income",advantages:"Can deduct: executive compensation, stock buybacks, depreciation, net operating losses carried forward, federal tax paid. Many large corps pay effective rate far below 6.5% through deductions.",color:"#ea580c",icon:"🏢"},
              {entity:"Small locally-owned LLC/S-Corp",rate:"Pass-through to personal rate — up to 5%",paid:"Income passes through to owner's personal return at individual rates",advantages:"Fewer deductions than C-Corps. Can't deduct stock buybacks. Federal QBI deduction helps but is complex. Effectively pays more than large corporations as % of real income.",color:"#c9a84c",icon:"🏪"},
              {entity:"IDB-abated corporation",rate:"0% property tax",paid:"$0 property tax for up to 20 years",advantages:"Property tax abatement from Industrial Development Board. You pay full property tax; they pay none. Same roads, schools, services — paid by you.",color:"#16a34a",icon:"🏭"},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:5,border:"1px solid #e0d8cc",borderLeft:"4px solid "+s.color}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{s.entity}</span>
                  <span style={{marginLeft:"auto",fontFamily:"monospace",fontSize:13,fontWeight:700,color:s.color}}>{s.rate}</span>
                </div>
                <div style={{fontSize:12,color:"#374151",marginBottom:4}}><strong>Pays:</strong> {s.paid}</div>
                <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}><strong>Advantages:</strong> {s.advantages}</div>
              </div>
            ))}
          </div>

          <FactBlocks facts={[
            {k:"red",label:"THE SMALL BUSINESS DISADVANTAGE — LOCAL STORES PAY MORE",lc:"#dc2626",tc:"#7f1d1d",text:"A locally-owned restaurant on Governors Drive pays full property tax, full sales tax, no IDB abatement. A Walmart Supercenter — which may have received local tax incentives — competes on the same street with structural advantages the local owner cannot access. The Alabama tax code has layers of exemptions and credits designed primarily for large capital investment deals, not for the small business owner. The Business Council of Alabama (which donated $180k to Ivey and $45k to Orr) lobbies for these large-company exemptions — not for the main street small business owner."},
            {k:"gold",label:"WHAT YOU CAN DO — INCOME TAX REFORM",lc:"#b8860b",tc:"#78350f",text:"Alabama's income tax could be reformed to: (1) Raise the standard deduction to reduce burden on lower-income workers, (2) Add a higher bracket above $50k/yr, (3) Close corporate deductions that large companies use to reduce their effective rate below 6.5%, (4) Require IDB abatement recipients to demonstrate job creation before receiving continued exemptions. Contact Sen. Orr (District 8, Finance Committee Chair) and your state House member at legislature.alabama.gov. The 2026 legislative session starts in February."},
          ]}/>

          {/* Income calculator inline — no need to go to calculator tab */}
          <div style={{background:"#eff3f8",border:"1px solid #93b4d4",borderRadius:5,padding:"12px 16px",marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",letterSpacing:1,marginBottom:6}}>→ USE THE CALCULATOR TAB TO ESTIMATE YOUR AL INCOME TAX</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>The <strong>🧮 Calculator</strong> tab includes both a property tax calculator (with area selector for all Madison County areas) and an Alabama income tax estimator for single and married filers. Switch to that tab to run your numbers.</div>
          </div>
        </div>
      )}


            {tab==="calculator"&&(
        <div>
          {/* Area selector */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Select Your Area in Madison County</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {Object.entries(AREAS).map(([k,a])=>(
                <button key={k} onClick={()=>setArea(k)} style={{padding:"6px 12px",borderRadius:4,border:"2px solid "+(area===k?"#1e3a5f":"#e0d8cc"),background:area===k?"#1e3a5f":"#fff",color:area===k?"#c9a84c":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{a.name}</button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#6b7280",fontStyle:"italic"}}>{ar.note} · Rate: <strong>${ar.rate} per $100 assessed</strong></div>
          </div>

          {/* Property Tax Calculator */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>🏠 Property Tax Calculator — {ar.name}</div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,color:"#374151",marginBottom:6}}>Home Market Value: <strong style={{color:"#1e3a5f"}}>${homeValue.toLocaleString()}</strong></div>
              <input type="range" min="50000" max="800000" step="5000" value={homeValue} onChange={e=>setHomeValue(Number(e.target.value))} style={{width:"100%",marginBottom:4}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280"}}><span>$50k</span><span>$800k</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {l:"Assessed Value (10% of market)",v:"$"+assessedVal.toLocaleString(),c:"#374151"},
                {l:"Your Annual Property Tax",v:"$"+annualTax.toLocaleString(),c:"#dc2626"},
                {l:"Monthly Tax Equivalent",v:"$"+Math.round(annualTax/12).toLocaleString(),c:"#dc2626"},
                {l:"Equivalent Business Property",v:"$"+businessTax.toLocaleString(),c:"#ea580c",note:"Businesses assessed at 20% — but with IDB abatement they pay $0"},
                {l:"Corporation w/ IDB Abatement",v:"$0",c:"#16a34a"},
              ].map((s,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:9,color:"#6b7280",letterSpacing:.5,marginBottom:3,textTransform:"uppercase"}}>{s.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
                  {s.note&&<div style={{fontSize:9,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{s.note}</div>}
                </div>
              ))}
            </div>
            <div style={{background:"#fef2f2",borderRadius:4,padding:"10px 12px",fontSize:12,color:"#7f1d1d",lineHeight:1.6}}>
              You pay <strong>${annualTax.toLocaleString()}/yr</strong> on a ${homeValue.toLocaleString()} home. A corporation receiving an IDB (Industrial Development Board) abatement on comparable property pays <strong>$0</strong> — for up to 20 years. That gap is revenue not going to your schools, roads, and services.
            </div>
          </div>

          {/* What property tax pays for */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",letterSpacing:1.2,marginBottom:10,textTransform:"uppercase"}}>Where Your Property Tax Goes (Approximate Breakdown)</div>
            {[
              {category:"Huntsville City Schools (HCS)",pct:40,color:"#1e3a5f",note:"Largest share — school operations, teacher pay, facilities"},
              {category:"Madison County General Fund",pct:28,color:"#374151",note:"Roads, Sheriff, courts, county services"},
              {category:"State of Alabama",pct:15,color:"#6b7280",note:"State general fund — smallest share of the three"},
              {category:"City of Huntsville General Fund",pct:17,color:"#93b4d4",note:"City services, HPD, parks, infrastructure"},
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12.5,color:"#374151",fontWeight:600}}>{r.category}</span>
                  <span style={{fontSize:12,fontWeight:700,color:r.color}}>{r.pct}%</span>
                </div>
                <div style={{height:16,background:"#f0ebe2",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:r.pct+"%",background:r.color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:10.5,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{r.note}</div>
              </div>
            ))}
          </div>

          {/* Income Tax Calculator */}
          <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:10}}>💵 Alabama Income Tax Calculator</div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              {[["single","Single / Head of Household"],["married","Married Filing Jointly"]].map(([k,l])=>(
                <button key={k} onClick={()=>setFilingStatus(k)} style={{padding:"6px 14px",borderRadius:4,border:"2px solid "+(filingStatus===k?"#1e3a5f":"#e0d8cc"),background:filingStatus===k?"#1e3a5f":"#fff",color:filingStatus===k?"#c9a84c":"#374151",fontSize:12,fontWeight:700,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:"#374151",marginBottom:6}}>Annual Gross Income: <strong style={{color:"#1e3a5f"}}>${incomeVal.toLocaleString()}</strong></div>
              <input type="range" min="10000" max="300000" step="1000" value={incomeVal} onChange={e=>setIncomeVal(Number(e.target.value))} style={{width:"100%",marginBottom:4}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#6b7280"}}><span>$10k</span><span>$300k</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[
                {l:"Standard Deduction (AL)",v:"$"+(filingStatus==="married"?"6,700":"2,500"),c:"#16a34a",note:"Alabama standard deduction — far below federal $14,600"},
                {l:"Personal Exemption",v:"$"+(filingStatus==="married"?"3,000":"1,500"),c:"#16a34a"},
                {l:"Taxable Income",v:"$"+taxableIncome.toLocaleString(),c:"#374151"},
                {l:"Est. Alabama Income Tax",v:"$"+Math.round(estimatedALTax).toLocaleString(),c:"#dc2626"},
                {l:"Effective AL Rate",v:effectiveRate+"%",c:"#dc2626"},
              ].map((s,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:9,color:"#6b7280",letterSpacing:.5,marginBottom:3,textTransform:"uppercase"}}>{s.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:19,fontWeight:800,color:s.c}}>{s.v}</div>
                  {s.note&&<div style={{fontSize:9,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{s.note}</div>}
                </div>
              ))}
            </div>
            <div style={{background:"#eff3f8",borderRadius:4,padding:"10px 12px",fontSize:12,color:"#1e3a5f",lineHeight:1.6}}>
              Alabama income tax kicks in at <strong>$500 of income</strong> — one of the lowest thresholds in the US. Alabama's standard deduction ($2,500 single) is far below the federal standard deduction ($14,600). This means lower-income Alabamians pay a higher share of income in state taxes than higher earners.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export { TaxesPage };
