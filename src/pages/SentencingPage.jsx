import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function SentencingPage(){
  const[tab,setTab]=useState("overview");
  const[analysisOpen,setAnalysisOpen]=useState({});
  const tabs=[{id:"overview",label:"Overview"},{id:"hfoa",label:"Life Sentences"},{id:"pretrial",label:"Pretrial Jail"},{id:"private",label:"Private Prisons"},{id:"bail",label:"Bail Trap"}];

  const investigations=[
    {
      title:"Habitual Felony Offender Act — Life Without Parole for Non-Violent Crimes",
      impact:"CRITICAL",category:"Sentencing",date:"Ongoing — HFOA since 1979",
      summary:"Alabama's Habitual Felony Offender Act (HFOA) mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent. 527+ people are serving life sentences this way, 75% Black. Alabama taxpayers spend $35,000/person/year — approximately $18.5M annually — for these cases alone.",
      analysis:"Alabama's Habitual Felony Offender Act (HFOA) was passed in 1979 and has never been substantially reformed. A fourth felony conviction — even if all prior offenses were non-violent property crimes or drug possession — triggers mandatory life without parole. Documented cases: people serving life for stealing a bicycle, possessing drugs, or writing bad checks.\n\n527+ people are currently serving life without parole under HFOA. 75% are Black. Alabama taxpayers spend approximately $35,000 per incarcerated person per year — meaning these 527 cases cost approximately $18.5M annually, indefinitely. No parole possibility. No path out.\n\nAlabama prisons operated at 181% capacity as of 2024. The Department of Justice found unconstitutional conditions — dangerous overcrowding, inadequate medical care, violence. A federal court threatened sanctions. Alabama's response has been to build more prisons rather than reduce incarceration. The private prison industry — CoreCivic and GEO Group — is paid per incarcerated person. CoreCivic donated to Sen. Orr, who has sponsored mandatory minimum sentencing bills.\n\nContact Sen. Orr directly at orr@alsenate.gov — ask him to support HFOA reform. Contact your state House member at legislature.alabama.gov. The 2026 session is the window. Orr's District 8 seat (Madison County) is on the ballot — the race will be decided by Madison County voters.",
      sources:[
        {label:"AL DOC — Prison Stats",url:"https://www.doc.state.al.us/"},
        {label:"DOJ — AL Prison Conditions",url:"https://www.justice.gov/opa/pr/justice-department-files-lawsuit-alabama"},
        {label:"Equal Justice Initiative — AL",url:"https://eji.org/issues/criminal-justice/"},
      ],
    },
    {
      title:"61% of Madison County Jail is Pretrial — Not Convicted of Anything",
      impact:"HIGH",category:"Pretrial Detention",date:"2024 Jail Census",
      summary:"61% of the people in Madison County Jail on any given day have not been convicted of anything. They are there because they cannot afford bail. Sheriff Kevin Turner controls a $2.3M civil forfeiture fund. Securus phone contracts charge families $0.21/minute.",
      analysis:"On any given day, 61% of Madison County Jail population is pretrial — they have been charged but not convicted. They are in jail because they cannot afford bail. A $500 bail requires $50 cash to a bail bondsman — money that is not returned. For a family earning $15/hour, $50 is three hours of pre-tax wages. Many people lose their jobs before trial. Many plead guilty to crimes they did not commit just to get out.\n\nSheriff Kevin Turner has served 16 years without a civilian oversight board reviewing his department. He controls a $2.3M civil forfeiture fund — money seized from citizens, often before conviction, with zero required public accounting of how it is spent. He received $24,000 from the bail bond industry, which profits directly from the system that keeps people in pretrial detention. He contracted with Securus Technologies for jail phone service — Securus charges families $0.21/minute for calls. The Sheriff receives approximately $200,000/year in commissions from this contract. This is public money from families of incarcerated people.\n\nThe pretrial detention system costs Madison County taxpayers approximately $65/person/day. 61% of jail population being pretrial means the majority of this cost is for people who have not been found guilty of anything. Bail reform — allowing supervised release for non-violent pretrial defendants — could reduce costs and reduce harm. Turner's re-election campaign received donations from bail bond industry that profits from the current system.\n\nAttend Madison County Commission meetings when the jail budget is on the agenda. Contact the Commission at (256) 532-3330. File an Open Records request for the civil forfeiture fund expenditures. Sheriff Turner's next election is in 2026.",
      sources:[
        {label:"Madison County Sheriff",url:"https://www.madisonsheriff.com/"},
        {label:"Pretrial Justice Institute",url:"https://www.pretrial.org/"},
        {label:"AL Appleseed — Bail Reform",url:"https://alabamaappleseed.org/"},
      ],
    },
  ];

  function InvCard({inv,i}){
    const k="s-"+i;
    return(
      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:inv.impact==="CRITICAL"?"#fef2f2":"#fff7ed",color:inv.impact==="CRITICAL"?"#dc2626":"#ea580c",border:"1px solid "+(inv.impact==="CRITICAL"?"#fca5a5":"#fdba74")}}>{inv.impact}</span>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
          <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}><ExpandText text={inv.summary} preview={180}/></p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{inv.sources.map((s,j)=><a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>)}</div>
        </div>
        <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",background:"#fafaf8"}}>
          <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
            {analysisOpen[k]?"Hide ▲":"Decode This 🔍"}
          </button>
        </div>
        {analysisOpen[k]&&(
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
            <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14}}>◈ CIVIC INVESTIGATOR ANALYSIS</div>
            {inv.analysis.split('\n\n').map((para,pi)=>{
              const _allP=inv.analysis.split('\n\n');
              const _isLast=pi===_allP.length-1;
              const _mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
              const _mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
              const _mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
              const _lc=_isLast?"#86efac":_mC[pi%4];
              const _tc=_isLast?"#f0fdf4":_mT[pi%4];
              const _lbl=_isLast?"WHAT YOU CAN DO":_mL[pi%4];
              return(
                <div key={pi} style={{marginBottom:pi<_allP.length-1?14:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:800,color:_lc,letterSpacing:1.8,textTransform:"uppercase"}}>{_lbl}</div>
                    {_isLast&&<button onClick={()=>{const el=document.querySelector("[data-foia]");if(el)el.scrollIntoView({behavior:"smooth"});}} style={{fontSize:9,fontWeight:700,color:"#1e3a5f",background:"#c9a84c",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",letterSpacing:.5}}>↓ TAKE ACTION</button>}
                  </div>
                  <p style={{fontSize:13.5,color:_tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+_lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-red">CRIMINAL JUSTICE · INVESTIGATION</span>
        <h2>Criminal Justice: <em>Courts, Jails & Prisons</em></h2>
        <p>527+ people serving life without parole for non-violent crimes. 61% of Madison County Jail is pretrial. Alabama prisons at 181% capacity. Private prisons donate to the politicians who fill them. Here is who profits and who pays.</p>
      </div>
      <div className="tabs">{tabs.map(t=><button key={t.id} className={"tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

      {tab==="overview"&&(
        <div>
          <div className="stats-grid" style={{marginBottom:16}}>
            {[["Pretrial Detention","61%","Madison County Jail — not convicted of anything","#dc2626"],["HFOA Life Sentences","527+","Non-violent crimes · 75% Black · $18.5M/yr cost","#dc2626"],["Prison Capacity","181%","DOJ found unconstitutional conditions","#ea580c"],["Securus Commission","~$200k/yr","Sheriff earns from $0.21/min family phone calls","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          {investigations.map((inv,i)=><InvCard key={i} inv={inv} i={i}/>)}
        </div>
      )}

      {tab==="hfoa"&&(
        <div>
          <div className="card" style={{padding:"20px",marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:14}}>What the HFOA Does — Step by Step</div>
            {[
              {step:"1st felony conviction",result:"Standard sentence — can include probation",color:"#c9a84c"},
              {step:"2nd felony conviction",result:"Enhanced sentence — mandatory prison time begins",color:"#ea580c"},
              {step:"3rd felony conviction",result:"Significantly enhanced — longer mandatory minimum",color:"#dc2626"},
              {step:"4th felony conviction",result:"LIFE WITHOUT PAROLE — mandatory. No exceptions. Even if all four were non-violent.",color:"#7f1d1d"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                <div style={{padding:"8px 12px",background:s.color+"15",border:"1px solid "+s.color+"40",borderRadius:4,minWidth:140,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:s.color}}>{s.step}</div>
                </div>
                <div style={{padding:"8px 12px",background:"#f8f6f2",borderRadius:4,flex:1,border:"1px solid #e0d8cc"}}>
                  <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{s.result}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderLeft:"4px solid #dc2626",borderRadius:4,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#dc2626",letterSpacing:1,marginBottom:6}}>WHO PROFITS FROM THIS SYSTEM</div>
            <div style={{fontSize:13.5,color:"#7f1d1d",lineHeight:1.7}}>CoreCivic and GEO Group operate private prisons in Alabama and are paid per incarcerated person. CoreCivic donated to Sen. Arthur Orr, who has sponsored mandatory minimum sentencing bills that increase the prison population. The school zone enhancement adds mandatory 5 years to any drug conviction — and school zones cover most of north Huntsville, meaning the same offense receives harsher punishment based on where a person lives.</div>
          </div>
          <InvCard inv={investigations[0]} i={0}/>
        </div>
      )}

      {tab==="pretrial"&&(
        <div>
          {[
            {title:"The Bail Math",body:"A $500 bail bond requires $50 cash (10% non-refundable to a bondsman). For someone earning $15/hour after taxes, that is 4+ hours of work — but they have to pay immediately. Many cannot. They sit in jail, often losing their job within days. Many plead guilty to crimes they did not commit just to get released — even when they are innocent — because a guilty plea means a fine and time served. This is not an exception. It is the expected outcome of the system.",color:"#dc2626"},
            {title:"The Securus Phone Contract",body:"Madison County Jail uses Securus Technologies for phone calls. The rate: approximately $0.21/minute. A 15-minute call costs $3.15. A daily call from a parent to their child costs $22/week — $1,144/year. Sheriff Turner receives approximately $200,000/year in commissions from this contract. The money comes directly from families of incarcerated people — disproportionately low-income Black families from north Huntsville.",color:"#ea580c"},
            {title:"Civil Forfeiture — Seized Before Conviction",body:"Alabama law allows law enforcement to seize property they believe is connected to a crime — before any conviction, sometimes before any charges. Sheriff Turner controls a $2.3M civil forfeiture fund. Alabama requires zero public accounting of how this money is spent. To get property back, citizens must sue the government in civil court — at costs that often exceed the value of what was seized.",color:"#1e3a5f"},
          ].map((s,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid "+s.color}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7}}><ExpandText text={s.body} preview={220}/></div>
              </div>
            </div>
          ))}
          <InvCard inv={investigations[1]} i={1}/>
        </div>
      )}

      {tab==="private"&&(
        <div>
          {[
            {name:"CoreCivic",role:"Private Prison Operator",detail:"Operates Elmore Correctional Facility and other AL facilities. Paid per incarcerated person — profit depends on keeping beds filled. Donated to Sen. Arthur Orr who sponsored mandatory minimum bills.",color:"#dc2626"},
            {name:"GEO Group",role:"Private Prison Operator",detail:"Operates Kilby Correctional Facility. Same business model — per-person payment creates financial incentive for incarceration. Lobbied against sentencing reform in Alabama.",color:"#ea580c"},
            {name:"Private Probation Companies",role:"Supervision Fee Collectors",detail:"Turn $300 traffic fines into years of monthly fees totaling thousands. If you miss a payment, you can be re-incarcerated — for a fine, not a crime. This is legal in Alabama.",color:"#7f1d1d"},
            {name:"Prison Labor",role:"$0-$2/day",detail:"Incarcerated people in Alabama work for $0-$2/day. Companies that use prison labor include agricultural operations and industrial services. Enslaved labor by another name under the 13th Amendment exception.",color:"#374151"},
          ].map((p,i)=>(
            <div key={i} className="card" style={{marginBottom:12,borderLeft:"4px solid "+p.color}}>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{p.name}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:p.color+"15",color:p.color,border:"1px solid "+p.color+"30"}}>{p.role}</span>
                </div>
                <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7}}>{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="bail"&&(
        <div>
          <FactBlocks facts={[
            {k:"red",label:"KRATOM — CLASS C FELONY IN ALABAMA",lc:"#dc2626",tc:"#7f1d1d",text:"Kratom possession is a Class C felony in Alabama — the same classification as methamphetamine. It is legal in 43 other states. A first-time kratom possession conviction starts the HFOA clock. By the fourth offense — even if the other three were also non-violent drug possession — the sentence is life without parole."},
            {k:"gold",label:"SCHOOL ZONE ENHANCEMENT — GEOGRAPHIC INJUSTICE",lc:"#b8860b",tc:"#78350f",text:"Alabama's school zone enhancement adds a mandatory 5 years to any drug conviction occurring within a school zone. School zones in Huntsville cover almost all of north Huntsville. The same drug offense in south Huntsville may not trigger the enhancement. Identical conduct, different ZIP code, different sentence."},
            {k:"blue",label:"CANNABIS — STILL A CRIMINAL MATTER",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama's Medical Cannabis Commission began licensing in 2024 — but possession for personal use without a medical card remains a misdemeanor that escalates with prior drug convictions under HFOA. In neighboring Tennessee and Georgia, the legal landscape is shifting. In Alabama, prior convictions accumulate."},
          ]}/>
          <div style={{background:"#1e3a5f",borderRadius:5,padding:"16px 18px",marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",letterSpacing:1.5,marginBottom:10}}>WHAT 2026 CAN CHANGE</div>
            <div style={{fontSize:13.5,color:"rgba(255,255,255,.85)",lineHeight:1.8}}>HFOA reform, bail reform, kratom reclassification, school zone enhancement repeal — all require the Alabama Legislature. Contact your state House and Senate members at legislature.alabama.gov. The Sentencing Commission meets publicly — their recommendations go to the Legislature. Equal Justice Initiative in Montgomery (eji.org) runs a free legal clinic and policy advocacy program. Alabama Appleseed (alabamaappleseed.org) tracks these bills and needs volunteer support.</div>
          </div>
        </div>
      )}
    </div>
  );
}


// --- POLICE & SHERIFF PAGE ---

export { SentencingPage };
