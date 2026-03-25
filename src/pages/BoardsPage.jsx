import{useState,useEffect,useRef,useCallback}from"react";
import{AiButton,ActionButtons,FactBlocks,ExpandText,InvestPage}from"./shared";

// --- BOARDS PAGE ---
export function BoardsPage(){
  const[tab,setTab]=useState("appointed");
  const TABS=[{id:"appointed",label:"Utility & IDB Boards"},{id:"schools",label:"School Boards"},{id:"hospital",label:"HHHS Hospital"},{id:"connections",label:"Interlocking"}];
  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">BOARDS & SCHOOLS · INVESTIGATION</span>
        <h2>Unelected Boards, <em>Directors & School Boards</em></h2>
        <p>The decisions that most affect your daily life — utility rates, tax abatements, hospital governance, school spending, and curriculum — are made by people you did not elect and cannot vote out. Your only recourse runs through the elected officials who appoint them. Here is who they are, who appointed them, and what they control.</p>
      </div>
      <div className="alert-banner">
        <div className="alert-label">THE ACCOUNTABILITY GAP</div>
        <div className="alert-text">Every utility rate increase you pay was approved by someone you did not elect. Every corporate tax abatement reducing your school funding was approved by an unelected board. The HHHS board that approved $3.1M CEO pay appoints its own successors. Your school board members control $310M/year at 11% voter turnout.</div>
      </div>
      <div className="tabs">
        {TABS.map(t=><button key={t.id} className={`tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      {tab==="appointed"&&(
        <div>
          {[
            {name:"Huntsville Utilities Boards (3 separate)",appt:"City Council",terms:"3-year terms — staggered",members:"George Moore (Electric, 9th term since 1998), Thomas Winstead (Electric, 8th term), Kimberly Lewis (Electric, 2nd term). Gas and Water boards have separate members.",power:"Approves all HU rate changes. Electric + Gas + Water for ~218,000 customers. In 2025: Electric +5.1% on top of TVA +5.25% = ~10%+ combined. Rate changes...",flag:"George Moore has served on the HU Electric Board since 1998 — longer than most council members who technically appoint him. City is considering consolidating...",recourse:"Attend City Council meetings before rate votes. Council meetings are public. Contact your district council member.",contact:"100 Northside Square, Huntsville AL 35801"},
            {name:"Industrial Development Board (IDB)",appt:"Mayor Tommy Battle",terms:"Staggered — appointed by sitting mayor",members:"9-member board. Members include local business executives and developers. Full current membership: available via AL Open Records request to City Clerk.",power:"Approves corporate property tax abatements — $127M+ active. Up to 20 years of ZERO property tax. No required audit of whether promised jobs or wages were...",flag:"No public election. No required financial disclosure for members. Small businesses cannot access this system. Every dollar abated from property tax is revenue...",recourse:"File Open Records request for all active abatements and member list. Demand performance audit at City Council meeting.",contact:"308 Fountain Circle, Huntsville AL 35801"},
            {name:"Madison Utilities Board",appt:"Madison City Council",terms:"6-year staggered terms",members:"Public corporation board — component unit of Madison City. New Mayor Bartlett was herself a Madison Board of Education member 2011-2020.",power:"Controls water and wastewater rates for 19,000+ Madison City connections. Major 2025-2026 project: Wall Triana water main.",flag:"New Mayor Bartlett's prior school board experience gives her unusual insight into appointed board dynamics. Her appointments to this board in 2026 will signal...",recourse:"Contact Mayor Bartlett directly. She controls who gets appointed.",contact:"100 Hughes Rd, Madison AL 35758"},
          ].map((b,i)=>(
            <div key={i} className="card" style={{borderLeft:"4px solid #1e3a5f",marginBottom:10}}>
              <div style={{fontWeight:800,fontSize:14,color:"#1e3a5f",marginBottom:6}}>{b.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8,fontSize:12.5}}>
                <div><span style={{color:"#6b7280"}}>Appointed by: </span><strong style={{color:"#1e3a5f"}}>{b.appt}</strong></div>
                <div><span style={{color:"#6b7280"}}>Terms: </span><strong style={{color:"#1e3a5f"}}>{b.terms}</strong></div>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Members:</strong> {b.members}</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Controls:</strong> {b.power}</div>
              <div style={{background:"#fef2f2",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#7f1d1d",borderLeft:"3px solid #dc2626",marginBottom:6}}>{b.flag}</div>
              <div style={{background:"#f0fdf4",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#14532d",borderLeft:"3px solid #16a34a"}}><strong>Your recourse:</strong> {b.recourse}</div>
            </div>
          ))}
          <ActionButtons title="CONTACT UTILITY BOARDS" actions={[
            {label:"Contact City Clerk (HU boards)",href:"https://www.huntsvilleal.gov/government/city-clerk/"},
            {label:"Call City Council",tel:"2564275000"},
            {label:"Open Records — Board Member Compensation",email:"cityclerk@huntsvilleal.gov",subject:"Open Records Request — Huntsville Utilities Board Compensation",body:"Dear City Clerk,\n\nPursuant to Alabama Open Records Act §36-12-40, I request: (1) Names and terms of all current Huntsville Utilities board members (Electric, Gas, Water). (2) Any disclosed compensation or expense reimbursements. (3) Meeting minutes for the past 12 months.\n\n[Your Name]"},
            {label:"File Ethics Complaint",href:"https://ethics.alabama.gov"},
          ]}/>
          <AiButton prompt="Investigate the appointed boards controlling Madison County utilities and tax abatements — HU Electric/Gas/Water boards (George Moore serving since 1998), IDB ($127M+ abatements, no performance audit), Madison Utilities board. For each: who are the current members by name, what are their professional affiliations, do any have financial conflicts with decisions they make, what are the most consequential decisions in the past 3 years. What does the interlocking of Mayor Battle's real estate donors with IDB appointments look like? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
      {tab==="schools"&&(
        <div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>THREE SYSTEMS, UNEQUAL FUNDING, LOW TURNOUT</div><div className="fact-text" style={{color:"#7f1d1d"}}>Madison County has three completely independent school systems. Resources are determined by which side of a city limit line you live on. School board races control hundreds of millions of dollars...</div></div>
          {[
            {name:"Huntsville City Schools (HCS) Board",system:"HCS",budget:"$310M/yr",students:"~24,000",members:"5 elected members by district",elected:true,districts:"Districts 1-5 corresponding to city council districts",power:"Sets curriculum, approves budget, hires superintendent. Controls per-pupil spending distribution — documented $847/pupil gap between lower-income and...",flag:"Board races decided by under 200 votes at 11% turnout. Donors to board members: real estate developers and construction companies who benefit from school...",upcoming:"Districts 2, 3, 4 on November 2026 ballot.",contact:"200 White St, Huntsville AL 35801"},
            {name:"Madison City Schools (MCS) Board",system:"MCS",budget:"~$120M/yr",students:"~12,000",members:"5 elected members",elected:true,districts:"City of Madison school districts",power:"Controls fastest-growing school system in Madison County. New subdivisions annexed regularly. Growth strain is documented — unplanned additions from city...",flag:"Mayor Bartlett (former MCS board member/president 2011-2020) now controls Madison Utilities board appointments that fund MCS operations. Unique potential for...",upcoming:"MCS board elections 2026.",contact:"211 Celtic Dr, Madison AL 35758"},
            {name:"Madison County Schools (MCSS) Board",system:"MCSS",budget:"~$85M/yr",students:"~10,000",members:"5 elected members",elected:true,districts:"Rural/unincorporated county: Harvest, Toney, Meridianville, Triana, New Market",power:"Controls schools for all unincorporated Madison County. Serves students in Harvest, Toney, Meridianville — the fastest-growing unincorporated areas — with the...",flag:"MCSS is the least-funded system serving the most rapidly growing unincorporated communities. These communities have no city government so county commission...",upcoming:"MCSS board elections 2026.",contact:"1275 Jordan Rd, Huntsville AL 35811"},
          ].map((b,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${b.elected?"#16a34a":"#dc2626"}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
                <div style={{fontWeight:800,fontSize:14,color:"#1e3a5f"}}>{b.name}</div>
                <span style={{fontSize:9.5,fontWeight:700,color:b.elected?"#16a34a":"#dc2626",background:b.elected?"#f0fdf4":"#fef2f2",padding:"2px 8px",borderRadius:8,border:`1px solid ${b.elected?"#86efac":"#fca5a5"}`,flexShrink:0,height:"fit-content"}}>{b.elected?"✓ ELECTED":"APPOINTED"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#1e3a5f"}}>{b.budget}</div><div className="stat-lbl">Annual Budget</div></div>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#374151"}}>{b.students}</div><div className="stat-lbl">Students</div></div>
                <div className="stat-card" style={{padding:"8px 10px"}}><div className="stat-val" style={{fontSize:15,color:"#ea580c"}}>11%</div><div className="stat-lbl">Voter Turnout</div></div>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Members:</strong> {b.members} · {b.districts}</div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}><strong>Controls:</strong> {b.power}</div>
              <div style={{background:"#fef2f2",borderRadius:3,padding:"7px 9px",fontSize:12.5,color:"#7f1d1d",borderLeft:"3px solid #dc2626",marginBottom:6}}>{b.flag}</div>
              {b.upcoming&&<div style={{background:"#fffbeb",borderRadius:3,padding:"6px 9px",fontSize:12.5,color:"#78350f",borderLeft:"3px solid #c9a84c"}}>2026 ELECTION: {b.upcoming} Races decided by under 200 votes.</div>}
            </div>
          ))}
          <ActionButtons title="CONTACT SCHOOL BOARDS" actions={[
            {label:"HCS Board — (256) 428-6800",tel:"2564286800"},
            {label:"Email HCS Board",email:"board@hsv-k12.org",subject:"Constituent Request — School Resource Equity",body:"Dear HCS Board,\n\nI am requesting the board commission a per-school resource equity audit — per-pupil spending, AP course availability, and facility budgets broken down by school.\n\nHCS Board elections for Districts 2, 3, and 4 are on the November 2026 ballot.\n\n[Your Name]"},
            {label:"Madison County Schools",tel:"2568522557"},
            {label:"Open Records — Donor to Board Members",email:"records@hsv-k12.org",subject:"Open Records Request — Board Member Campaign Donors",body:"Dear Records Custodian,\n\nPursuant to Alabama Open Records Act §36-12-40, I request any campaign finance disclosures made by HCS board members in their last election cycle.\n\n[Your Name]"},
          ]}/>
          <AiButton prompt="Investigate the three Madison County school boards — HCS $310M, MCS $120M, MCSS $85M. Who are the current board members by name? What are their campaign donor connections? Have any board members received donations from construction or development companies that later won school contracts? How does the CHOOSE Act diversion of $100M from the Education Trust Fund (ETF) affect each system's funding? What is the documented $847/pupil spending gap within HCS? What do the 2026 board races look like and who should voters watch? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
      {tab==="hospital"&&(
        <div>
          <div className="stats-grid">
            {[["HHHS Revenue","$2.4B/yr","Nonprofit · $0 income tax",C.red],["CEO Pay","$3.1M/yr","Self-appointed board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Board Structure","Self-appointed","Appoints its own successors — zero public vote",C.red]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>THE SELF-PERPETUATING BOARD</div><div className="fact-text" style={{color:"#7f1d1d"}}>The HHHS board appoints its own successors. No public vote. No community election. Ever. In the history of HHHS. The board approved $3.1M CEO pay. The board approved every hospital acquisition th...</div></div>
          <div className="fact fact-gold"><div className="fact-label" style={{color:"#b8860b"}}>THE NONPROFIT PARADOX</div><div className="fact-text" style={{color:"#78350f"}}>HHHS pays $0 income tax on $2.4B in revenue, reduced property tax, and claims $63M/yr in total exemptions. In exchange it must provide community benefit. Yet it starts CNAs at $14.50/hr (qualifyi...</div></div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:8}}>⚠ HHHS BOARD — SELF-APPOINTED, NO PUBLIC VOTE EVER</div>
            <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:5,padding:"10px 12px",marginBottom:8,fontSize:13,color:"#7f1d1d"}}>The HHHS board appoints its own successors. No election in the hospital's history. Full current membership requires reviewing their IRS Form 990 — available free at ProPublica Nonprofit Explorer. Past members have included HHHS-employed physicians voting on their own compensation and executives from organizations doing business with the hospital.</div>
            {[{name:"David Spillers",role:"President & CEO — $3.1M/yr",note:"Compensation approved by the same board he works alongside. Board has limited independence from management."},
              {name:"Board of Directors (15 members)",role:"Self-Appointed — Zero Public Vote",note:"To see current members: visit ProPublica.org/nonprofit-explorer and search 'Huntsville Hospital' (EIN 63-0288816). ..."},
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"9px 11px",background:"#fff",border:"1px solid #e0d8cc",borderRadius:4,marginBottom:6}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"#991b1b",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11.5,fontWeight:800,flexShrink:0}}>{m.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                <div><div style={{fontWeight:700,fontSize:14,color:"#1e3a5f"}}>{m.name}</div><div style={{fontSize:11.5,color:"#6b7280",marginBottom:2}}>{m.role}</div><div style={{fontSize:12.5,color:"#374151",lineHeight:1.5}}>{m.note}</div></div>
              </div>
            ))}
            <a href="https://projects.propublica.org/nonprofits/organizations/630288816" target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:12.5,marginTop:4}}>View HHHS IRS 990 at ProPublica →</button></a>
          </div>
          <ActionButtons title="CONTACT HHHS & FILE COMPLAINTS" actions={[
            {label:"Call HHHS CEO Office",tel:"2562651000"},
            {label:"Email HHHS Board",email:"info@huntsvillehospital.org",subject:"HHHS Board Accountability — Community Benefit & Crestwood Acquisition",body:"Dear HHHS Board,\n\nI am writing as a Madison County resident to demand:\n\n1. Full public disclosure of CEO and executive compensation.\n2. A community benefit audit showing what HHHS provides in exchange for its $63 million per year in tax exemptions.\n3. A public comment period before the Crestwood acquisition closes.\n\nThe self-appointed board structure provides no public accountability. I am requesting that change.\n\n[Your Name]"},
            {label:"FTC — Comment on Crestwood Deal",href:"https://www.ftc.gov/news-events/mergers-public-comments"},
            {label:"AL Attorney General Complaint",href:"https://www.alabamaag.gov/consumers/"},
            {label:"ProPublica — HHHS Form 990",href:"https://projects.propublica.org/nonprofits/organizations/630288816"},
          ]}/>
          <AiButton prompt="Investigate HHHS nonprofit monopoly governance. Self-appointed board — who are the current members by name, what organizations are they affiliated with, have any members received business from HHHS or been affiliated with organizations that received HHHS contracts? CEO David Spillers $3.1M vs CNAs $14.50/hr. $63M/yr tax exemption vs community benefit provided. 14-facility acquisition creating North Alabama monopoly. FTC has not acted. AL Legislature could amend charter. HHHS Foundation donated $45k to Mayor Battle. Summarize what all this means for a Madison County resident without legal or government jargon. Connect the dots. Under 150 words."/>
        </div>
      )}
      {tab==="connections"&&(
        <div>
          <div className="alert-banner"><div className="alert-label">THE INTERLOCKING POWER STRUCTURE</div><div className="alert-text">The same individuals cycle through multiple boards and have connections to elected officials. This is how policy is coordinated without public knowledge or consent. Below are the documented connections between unelected boards and elected officials in Madison County.</div></div>
          {[
            {from:"Mayor Tommy Battle",to:"IDB Board",rel:"APPOINTS ALL 9 MEMBERS",detail:"Battle received $380k from real estate developers. He appoints the board that grants developers zero property tax for 20 years. No performance au...",flag:true},
            {from:"City Council",to:"HU Electric/Gas/Water Boards",rel:"APPOINTS ALL MEMBERS",detail:"George Moore has served on HU Electric Board since 1998 — longer than the council members who technically oversee his appointment. Rate increases...",flag:true},
            {from:"Mayor Bartlett (Madison)",to:"Madison Utilities Board",rel:"APPOINTS MEMBERS",detail:"Bartlett was herself a Madison Board of Education member 2011-2020. She now controls Madison Utilities board appointments. Utilities fund affects...",flag:false},
            {from:"Huntsville Hospital (HHHS) Board",to:"HHHS Board",rel:"SELF-APPOINTING",detail:"Board appoints own successors with no public input. Has included HHHS-employed physicians who vote on their own compensation and executives from ...",flag:true},
            {from:"HHHS Foundation",to:"Mayor Battle",rel:"$45,000 DONATION",detail:"The hospital that controls 14 North Alabama facilities donated $45k to the mayor who controls the IDB granting them favorable tax treatment.",flag:true},
            {from:"IDB Abatements",to:"School Funding",rel:"DRAINS PROPERTY TAX",detail:"Every dollar of property tax abated by the IDB is revenue not available for HCS, MCSS, or MCS school funding. The IDB board appointed by Battle h...",flag:true},
            {from:"Arthur Orr",to:"Business Council of Alabama",rel:"$45,000 DONATIONS",detail:"Orr chairs the AL Senate Education Budget Committee overseeing $17B AND co-sponsored CHOOSE Act diverting $100M from ETF. BCA which donated to hi...",flag:true},
          ].map((c,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${c.flag?"#dc2626":"#1e3a5f"}`,marginBottom:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{c.from}</span>
                <span style={{fontSize:10.5,fontWeight:800,color:c.flag?"#dc2626":"#374151",background:c.flag?"#fef2f2":"#f0ebe2",padding:"2px 8px",borderRadius:8,border:`1px solid ${c.flag?"#fca5a5":"#e0d8cc"}`}}>{c.rel}</span>
                <span style={{fontSize:13.5,fontWeight:700,color:"#1e3a5f"}}>{c.to}</span>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{c.detail}</div>
            </div>
          ))}
          <AiButton prompt="Map the complete interlocking power structure of unelected boards in Madison County. Who sits on multiple boards simultaneously? What financial relationships exist between board members and the elected officials who appointed them? How does the IDB abatement system connect to school funding shortfalls? How does HHHS Foundation's political donations connect to its nonprofit tax exemptions? Are there any individuals who appear in multiple positions — board member AND contractor AND donor? Summarize what all this means for a Madison County resident without legal or government jargon. Under 150 words."/>
        </div>
      )}
    </div>
  );
}

export default BoardsPage;
