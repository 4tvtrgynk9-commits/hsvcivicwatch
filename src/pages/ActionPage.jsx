import React,{useState,useEffect,useRef,useCallback} from "react";
import { C } from "../config/theme";
import { NAV } from "../config/nav";
import { PAGES } from "../data/pages";
import { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage } from "../components/shared";

function ActionPage(){
  const[copied,setCopied]=useState({});
  function copy(key,text){navigator.clipboard.writeText(text).then(()=>{setCopied(p=>({...p,[key]:true}));setTimeout(()=>setCopied(p=>({...p,[key]:false})),2500);});}
  const foiaTemplate=`[Name of Agency/Office]\nRe: Alabama Open Records Act Request (§36-12-40)\n\nDear Records Custodian,\n\nPursuant to the Alabama Open Records Act (§36-12-40), I request the following public records:\n\n[Describe the specific records you want — be as specific as possible: document type, date range, subject matter]\n\nPlease provide these records in digital format where possible. If any portion of this request is denied, please provide a written explanation citing the specific exemption under Alabama law.\n\nI expect a response within a reasonable time. If there will be a fee for this request, please notify me in advance.\n\n[Your Name]\n[Your Address]\n[Your Email/Phone]`;

  return(
    <div className="page">
      <div className="page-header">
                <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>HUNTSVILLE CIVIC INVESTIGATOR — THE TRUTH ABOUT YOUR CITY</div>
        <span className="tag tag-green">TAKE ACTION · TOOLKIT</span>
        <h2>Take <em>Action</em></h2>
        <p>Every tool you need to hold Madison County officials accountable. Open Records requests. Ethics complaints. How to attend a meeting and actually be heard. How to register to vote. How to run for office.</p>
      </div>

      {[
        {title:"1. Register to Vote",color:"#16a34a",icon:"🗳",steps:[
          {action:"Register or check registration",link:"https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",note:"Deadline: 15 days before any election. Takes 5 minutes online."},
          {action:"Find your polling place",link:"https://myinfo.alabamavotes.gov/voterview/",note:"Polling places can change — verify before Election Day."},
          {action:"Get a free voter ID",link:"https://www.alabamavoterID.com/",note:"Required at the polls. Free at any ALEA driver's license office."},
        ]},
        {title:"2. File an Open Records Request",color:"#1e3a5f",icon:"📋",steps:[
          {action:"Template — copy and customize",link:null,note:"Use the template below. Send to any government agency by mail or email. It's free."},
          {action:"City of Huntsville Records",link:"https://www.huntsvilleal.gov",note:"cityclerk@huntsvilleal.gov · (256) 427-5000"},
          {action:"Madison County Records",link:"https://www.madisoncountyal.gov",note:"Contact the relevant department directly. Probate Office: (256) 532-3330"},
          {action:"HCS Records",link:"https://www.huntsvillecityschools.org",note:"records@huntsvillecityschools.org · (256) 428-6800"},
        ]},
        {title:"3. Attend a Public Meeting",color:"#c9a84c",icon:"🏛",steps:[
          {action:"Huntsville City Council — every other Thursday, 5:30pm",link:"https://www.huntsvilleal.gov/government/city-council/",note:"308 Fountain Circle. Public comment: 3 minutes per speaker. Sign up when you arrive."},
          {action:"HCS Board of Education",link:"https://www.huntsvillecityschools.org/board",note:"200 White St. Public comment accepted. Controls $310M budget."},
          {action:"Madison County Commission",link:"https://www.madisoncountyal.gov",note:"100 Northside Square. Controls jail budget, road maintenance. (256) 532-3500"},
          {action:"Huntsville Utilities Boards",link:"https://www.hsvutil.org",note:"Rate changes approved here. Ask for CEO salary disclosure."},
        ]},
        {title:"4. File an Ethics Complaint",color:"#dc2626",icon:"⚖",steps:[
          {action:"Alabama Ethics Commission",link:"https://ethics.alabama.gov",note:"Free to file. Any citizen can file. Creates a public record. (334) 242-2997"},
          {action:"What qualifies",link:"https://ethics.alabama.gov/ec/",note:"Conflicts of interest, improper use of public position, violations of the Ethics Act. You do not need a lawyer."},
        ]},
        {title:"5. Contact Your Elected Officials",color:"#374151",icon:"📞",steps:[
          {action:"Mayor Tommy Battle",link:"https://www.huntsvilleal.gov",note:"mayor@huntsvilleal.gov · (256) 427-5000"},
          {action:"Rep. Dale Strong (AL-5)",link:"https://dalestrong.house.gov/contact",note:"(256) 551-0190 — TVA oversight, defense spending, PFAS disclosure"},
          {action:"Sen. Katie Britt",link:"https://www.britt.senate.gov/contact",note:"(202) 224-5744 — health insurance premiums, Medicaid"},
          {action:"Sen. Arthur Orr (District 8)",link:"https://www.alsenate.gov",note:"orr@alsenate.gov · (334) 242-7895 — minimum wage, sentencing reform"},
          {action:"Find your state legislators",link:"https://www.legislature.alabama.gov",note:"Enter your address to find your House and Senate members"},
        ]},
        {title:"6. Run for Office",color:"#9333ea",icon:"🏃",steps:[
          {action:"School board races",link:"https://www.sos.alabama.gov",note:"HCS Board Districts 2, 3, 4 on November 2026 ballot. Decided by under 200 votes. You need a few hundred signatures to qualify."},
          {action:"City Council",link:"https://www.huntsvilleal.gov",note:"Districts 1 and 3 on November 2026 ballot. Part-time, ~$20,000/yr salary. Contact the City Clerk for qualification requirements."},
          {action:"State Legislature",link:"https://www.sos.alabama.gov",note:"State House districts covering Madison County. $52,000/yr + per diem. Primary: June 2026."},
        ]},
      ].map((section,i)=>(
        <div key={i} className="card" style={{marginBottom:14,borderLeft:"4px solid "+section.color}}>
          <div style={{padding:"16px 18px"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:22}}>{section.icon}</span>
              <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f"}}>{section.title}</div>
            </div>
            {section.steps.map((step,j)=>(
              <div key={j} style={{marginBottom:10,paddingBottom:10,borderBottom:j<section.steps.length-1?"1px solid #f0ebe2":"none"}}>
                <div style={{fontSize:13.5,fontWeight:600,color:"#374151",marginBottom:3}}>{step.action}</div>
                <div style={{fontSize:12,color:"#6b7280",marginBottom:step.link?6:0}}>{step.note}</div>
                {step.link&&<a href={step.link} target="_blank" rel="noreferrer"><button className="btn btn-ghost" style={{fontSize:11.5}}>↗ Open →</button></a>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>Open Records Request Template</div>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Copy, customize with your specific request, and send to any Alabama government agency. It's free. You don't need a lawyer.</div>
          <textarea readOnly value={foiaTemplate} rows={12} style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#f8f6f2",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}/>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copy("foia",foiaTemplate)}>{copied["foia"]?"✓ Copied!":"📋 Copy Template"}</button>
            <a href={"mailto:?subject=Alabama Open Records Act Request&body="+encodeURIComponent(foiaTemplate)}>
              <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- TAXES PAGE ---

export { ActionPage };
