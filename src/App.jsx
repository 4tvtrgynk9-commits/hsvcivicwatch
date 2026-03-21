import{useState,useEffect,useRef,useCallback}from"react";
const C={navy:"#1e3a5f",red:"#dc2626",gold:"#c9a84c",orange:"#ea580c",green:"#16a34a",muted:"#6b7280",border:"#e0d8cc",card:"#fff",bg:"#f5f0e8"};
const SYSTEM_PROMPT=`You are the investigative AI engine for the Huntsville Civic Investigator — a public accountability tool for Madison County, Alabama residents. Your job: decode complex legal, financial, and governmental source material so that any resident can understand it. Rules: Write at 8th-grade reading level. Explain HOW something affects residents daily. Surface what is obscured. Identify who benefits financially — name the executives, CEOs, and donors specifically. Flag conflicts of interest. Note unanswered questions. Be factual. End with 2-3 specific actionable steps. Under 380 words. No markdown headers. Start directly with substance — no preamble.`;
async function callAI(prompt){
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();
    if(d.error)throw new Error(d.error.message);
    return d.content?.map(b=>b.text||"").join("")||"Analysis unavailable.";
  }catch(e){return"Analysis unavailable — please try again.";}
}

const CSS=`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#f5f0e8;font-family:'Segoe UI',system-ui,sans-serif;font-size:16px;color:#1a1a1a;overflow-x:hidden}
#root{height:100%}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:260px;background:#1e3a5f;color:#fff;overflow-y:auto;flex-shrink:0;display:flex;flex-direction:column}
.sidebar-logo{padding:20px 16px 12px;border-bottom:1px solid rgba(201,168,76,.2)}
.sidebar-logo h1{font-size:13px;font-weight:800;color:#c9a84c;letter-spacing:1px;line-height:1.3}
.sidebar-logo p{font-size:10px;color:rgba(255,255,255,.4);margin-top:3px}
.nav-group{padding:14px 16px 4px;font-size:8.5px;font-weight:700;letter-spacing:2px;color:rgba(201,168,76,.5);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:9px;padding:10px 16px;cursor:pointer;font-size:14px;font-weight:500;color:rgba(255,255,255,.6);border-left:3px solid transparent;transition:all .15s;user-select:none}
.nav-item:hover,.nav-item.active{color:#c9a84c;background:rgba(201,168,76,.08);border-left-color:#c9a84c;font-weight:700}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.main{flex:1;overflow-y:auto;background:#f5f0e8}
.page{max-width:700px;margin:0 auto;padding:22px 18px 40px}
.page-header{margin-bottom:20px}
.page-header h2{font-size:26px;font-weight:900;color:#1e3a5f;line-height:1.2}
.page-header h2 em{color:#dc2626;font-style:normal}
.page-header p{font-size:15px;color:#6b7280;margin-top:6px;line-height:1.6}
.tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 8px;border-radius:10px;margin-bottom:8px}
.tag-red{background:rgba(220,38,38,.12);color:#dc2626;border:1px solid rgba(220,38,38,.2)}
.tag-navy{background:rgba(30,58,95,.1);color:#1e3a5f;border:1px solid rgba(30,58,95,.2)}
.tag-gold{background:rgba(201,168,76,.12);color:#b8860b;border:1px solid rgba(201,168,76,.3)}
.tag-green{background:rgba(22,163,74,.1);color:#16a34a;border:1px solid rgba(22,163,74,.2)}
.tag-blue{background:rgba(37,99,235,.1);color:#2563eb;border:1px solid rgba(37,99,235,.2)}
.tag-orange{background:rgba(234,88,12,.1);color:#ea580c;border:1px solid rgba(234,88,12,.2)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.stat-card{background:#fff;border:1px solid #e0d8cc;border-radius:6px;padding:14px 12px}
.stat-val{font-size:26px;font-weight:900;line-height:1}
.stat-lbl{font-size:11px;color:#6b7280;margin-top:5px;letter-spacing:.5px;text-transform:uppercase}
.stat-sub{font-size:13px;color:#6b7280;margin-top:3px;line-height:1.3}
.fact{border-radius:5px;padding:12px 14px;margin-bottom:10px;border-left:4px solid}
.fact-red{background:#fef2f2;border-color:#dc2626}
.fact-gold{background:#fffbeb;border-color:#c9a84c}
.fact-green{background:#f0fdf4;border-color:#16a34a}
.fact-blue{background:#eff6ff;border-color:#2563eb}
.fact-orange{background:#fff7ed;border-color:#ea580c}
.fact-label{font-size:10px;font-weight:700;letter-spacing:1px;margin-bottom:5px;text-transform:uppercase}
.fact-text{font-size:15px;line-height:1.7}
.btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border:none;border-radius:4px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-navy{background:#1e3a5f;color:#fff}
.btn-gold{background:#c9a84c;color:#fff}
.btn-red{background:#dc2626;color:#fff}
.btn-ghost{background:transparent;color:#6b7280;border:1px solid #e0d8cc}
.btn-full{width:100%;justify-content:center;margin-bottom:10px}
.ai-panel{background:#f8f6f2;border:1px solid #e0d8cc;border-left:4px solid #1e3a5f;border-radius:5px;padding:14px 16px;margin-bottom:12px}
.ai-panel-label{font-size:10px;font-weight:800;color:#1e3a5f;letter-spacing:1.5px;margin-bottom:10px;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.card{background:#fff;border:1px solid #e0d8cc;border-radius:6px;padding:14px;margin-bottom:10px}
.tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:2px solid #e0d8cc;padding-bottom:8px;flex-wrap:wrap}
.tab{padding:8px 16px;border:none;border-radius:4px 4px 0 0;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;background:#f0ebe2;color:#6b7280;transition:all .12s}
.tab.active{background:#1e3a5f;color:#c9a84c}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.dash-card{background:#fff;border:1px solid #e0d8cc;border-radius:8px;padding:16px;cursor:pointer;transition:all .15s;border-left:4px solid}
.dash-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
.dash-card-icon{font-size:20px;margin-bottom:8px}
.dash-card-title{font-size:14px;font-weight:700;color:#1e3a5f;margin-bottom:3px}
.dash-card-sub{font-size:12.5px;color:#6b7280;line-height:1.4}
.topbar{display:none;background:#1e3a5f;color:#fff;align-items:stretch;position:sticky;top:0;z-index:100;flex-direction:column}
.topbar-title{font-size:13px;font-weight:800;color:#c9a84c;letter-spacing:.5px}
.menu-btn{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0;line-height:1}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200}
.overlay.open{display:block}
.sidebar.mobile-open{transform:translateX(0)!important}
.spin{animation:spin .7s linear infinite;display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%}
@keyframes spin{to{transform:rotate(360deg)}}
.alert-banner{background:#fef2f2;border:1px solid #fca5a5;border-left:4px solid #dc2626;border-radius:4px;padding:10px 13px;margin-bottom:14px}
.alert-label{font-size:10px;font-weight:700;color:#dc2626;letter-spacing:1px;margin-bottom:3px}
.alert-text{font-size:13.5px;color:#7f1d1d;line-height:1.6}
.source-bar{background:#eff3f8;border:1px solid #93b4d4;border-radius:4px;padding:11px 13px;margin-top:14px}
.source-label{font-size:10px;font-weight:700;color:#1e3a5f;letter-spacing:1px;margin-bottom:6px}
.source-links{display:flex;gap:8px;flex-wrap:wrap}
.source-link{font-size:12px;color:#1e3a5f;text-decoration:none;border:1px solid #93b4d4;padding:3px 8px;border-radius:3px;background:#fff}
.source-link:hover{background:#1e3a5f;color:#fff}
.read-more-btn{background:none;border:none;cursor:pointer;font-size:11px;font-weight:700;color:#c9a84c;margin-left:6px;padding:2px 4px;font-family:inherit;border-radius:3px;display:inline}
.read-more-btn:hover{background:rgba(201,168,76,.1)}
@media(max-width:768px){
  .app{flex-direction:column}
  .sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;z-index:300;transform:translateX(-100%);transition:transform .25s}
  .sidebar.mobile-open{transform:translateX(0)}
  .topbar{display:flex;height:auto;min-height:52px;position:fixed;top:0;left:0;right:0;z-index:200;flex-direction:column}
  .menu-btn{width:44px;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;padding:0}
  .topbar-title{font-size:10.5px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.3px;font-weight:800}
  .main{width:100%;margin-top:88px;overflow-y:auto;height:calc(100vh - 88px)}
  .page{padding:14px 12px 60px;max-width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .dash-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-val{font-size:21px}
  .page-header h2{font-size:23px}
  .tabs{gap:3px}
  .tab{padding:7px 10px;font-size:12px}
  .btn{font-size:12.5px;padding:8px 14px}
  .dash-card{padding:12px}
  .dash-card-title{font-size:11.5px}
  .dash-card-sub{font-size:10px}
}
@media(max-width:400px){
  .dash-grid{grid-template-columns:1fr}
  .page{padding:12px 10px 60px}
}
`;

const NAV=[
  {group:"ECONOMIC"},
  {id:"equity",icon:"⚖",label:"The Two Huntsvilles"},
  {id:"utilities",icon:"💧",label:"Power, Water & Utilities"},
  {id:"health",icon:"✚",label:"Health System"},
  {id:"insurance",icon:"🛡",label:"Who Profits From Your Coverage"},
  {id:"money",icon:"💰",label:"Follow the Money"},
  {id:"workers",icon:"👷",label:"Workers Rights & Child Care"},
  {id:"taxes",icon:"🧾",label:"Taxes"},
  {group:"GOVERNANCE"},
  {id:"officials",icon:"▣",label:"Officials & Elections"},
  {id:"boards",icon:"🏛",label:"Boards, Directors & Schools"},
  {id:"voting",icon:"🗳",label:"Voter Empowerment"},
  {id:"disinfo",icon:"🧠",label:"Disinformation"},
  {group:"JUSTICE"},
  {id:"sentencing",icon:"⚖",label:"Criminal Justice"},
  {id:"policing",icon:"🚔",label:"Police & Sheriff"},
  {id:"surveillance",icon:"📡",label:"Surveillance & Privacy"},
  {group:"COMMUNITY"},
  {id:"unhoused",icon:"🏠",label:"Unhoused Residents"},
  {id:"environment",icon:"🌊",label:"Environment, Water, Transit & Roads"},
  {id:"landuse",icon:"🗺",label:"Land Use & Business Equity"},
  {id:"proposals",icon:"📐",label:"Policy Proposals"},
  {id:"action",icon:"▶",label:"Take Action"},
];

// ─── SHARED COMPONENTS ───────────────────────────────────────
function Spin(){return <span className="spin"/>;}

// FIX: ExpandText always shows "Read more" button — never just "..."
function ExpandText({text,preview=180,style={}}){
  const[open,setOpen]=useState(false);
  if(!text)return null;
  const long=text.length>preview;
  function toggle(e){e.stopPropagation();setOpen(o=>!o);}
  if(!long)return<span style={style}>{text}</span>;
  return(
    <span>
      <span style={style}>{open?text:text.slice(0,preview)}</span>
      <button className="read-more-btn" onClick={toggle}>
        {open?"▲ Show less":"▼ Read more"}
      </button>
    </span>
  );
}

function AiResult({text}){
  if(!text)return null;
  const paragraphs=text.split(/\n+/).filter(p=>p.trim().length>10);
  const n=paragraphs.length;
  const midLabels=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
  const midColors=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
  const midTextColors=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
  const actionColor="#86efac";
  const actionTextColor="#f0fdf4";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {paragraphs.map((p,i)=>{
        const isLast=i===n-1;
        const mi=i%(midLabels.length);
        const color=isLast?actionColor:midColors[mi];
        const textColor=isLast?actionTextColor:midTextColors[mi];
        const label=isLast?"WHAT YOU CAN DO":midLabels[mi];
        return(
          <div key={i}>
            <div style={{fontSize:8,fontWeight:800,color:color,letterSpacing:1.8,marginBottom:6,textTransform:"uppercase"}}>{label}</div>
            <p style={{fontSize:13.5,color:textColor,lineHeight:1.85,margin:0,borderLeft:"2px solid "+color,paddingLeft:12}}>{p.trim()}</p>
          </div>
        );
      })}
    </div>
  );
}

function AiButton({prompt,label="🔍 Break It Down"}){
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);
  async function go(){
    if(r){setR(null);return;}
    setLd(true);
    try{const x=await callAI(prompt);setR(x);}
    catch(e){setR("Investigation unavailable — please try again.");}
    setLd(false);
  }
  return(
    <div>
      <button className="btn btn-gold btn-full" onClick={go} disabled={ld}>
        {ld?<><Spin/> Connecting the dots...</>:r?"▲ Hide Analysis":label}
      </button>
      {r&&(
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",borderRadius:"0 0 5px 5px",padding:"18px 20px",marginTop:-1}}>
          <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block",boxShadow:"0 0 6px #c9a84c"}}/>
            CIVIC INVESTIGATOR ANALYSIS
          </div>
          <AiResult text={r}/>
        </div>
      )}
    </div>
  );
}

function StatGrid({stats}){
  return(
    <div className="stats-grid">
      {stats.map(([l,v,s,c],i)=>(
        <div key={i} className="stat-card">
          <div className="stat-val" style={{color:c}}>{v}</div>
          <div className="stat-lbl">{l}</div>
          <div className="stat-sub">{s}</div>
        </div>
      ))}
    </div>
  );
}

function FactBlock({f}){
  const[open,setOpen]=useState(false);
  const PREVIEW=220;
  const long=f.text&&f.text.length>PREVIEW;
  return(
    <div className={"fact fact-"+f.k} style={{cursor:long?"pointer":"default"}} onClick={()=>long&&setOpen(o=>!o)}>
      <div className="fact-label" style={{color:f.lc}}>{f.label}</div>
      <div className="fact-text" style={{color:f.tc}}>
        {long&&!open?f.text.slice(0,PREVIEW):f.text}
      </div>
      {long&&(
        <div style={{fontSize:11,fontWeight:700,color:f.lc,marginTop:7}}>
          {open?"▲ Show less":"▼ Read more"}
        </div>
      )}
    </div>
  );
}

function FactBlocks({facts}){
  return facts.map((f,i)=><FactBlock key={i} f={f}/>);
}

function ActionButtons({actions,title}){
  const[copied,setCopied]=useState({});
  function cp(k,t){navigator.clipboard.writeText(t).then(()=>{setCopied(p=>({...p,[k]:true}));setTimeout(()=>setCopied(p=>({...p,[k]:false})),2500);});}
  return(
    <div style={{marginTop:10}}>
      {title&&<div style={{fontSize:9,fontWeight:800,color:"#16a34a",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {(actions||[]).map((a,i)=>(
          a.href?<a key={i} href={a.href} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11.5}}>→ {a.label}</button></a>
          :a.tel?<a key={i} href={`tel:${a.tel}`}><button className="btn btn-gold" style={{fontSize:11.5}}>📞 {a.label}</button></a>
          :a.email?<a key={i} href={`mailto:${a.email}?subject=${encodeURIComponent(a.subject||"")}&body=${encodeURIComponent(a.body||"")}`}><button className="btn btn-ghost" style={{fontSize:11.5}}>✉ {a.label}</button></a>
          :<button key={i} className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>cp("a"+i,a.copy||"")}>{copied["a"+i]?"✓ Copied":a.label}</button>
        ))}
      </div>
    </div>
  );
}

// Generic investigation card used across pages
function InvCard({inv,i,prefix,analysisOpen,setAnalysisOpen,foiaOpen,setFoiaOpen,copied,setCopied}){
  const k=(prefix||"inv")+"-"+i;
  function copyText(text){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(p=>({...p,[k]:true}));
      setTimeout(()=>setCopied(p=>({...p,[k]:false})),2500);
    });
  }
  return(
    <div className="card" style={{marginBottom:14,overflow:"hidden"}}>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
          <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:inv.impact==="CRITICAL"?"#fef2f2":"#fff7ed",color:inv.impact==="CRITICAL"?"#dc2626":"#ea580c",border:"1px solid "+(inv.impact==="CRITICAL"?"#fca5a5":"#fdba74")}}>{inv.impact}</span>
          <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:"#f0ebe2",color:"#6b7280",border:"1px solid #e0d8cc"}}>{inv.category}</span>
          <span style={{fontSize:9,color:"#6b7280",marginLeft:"auto"}}>{inv.date}</span>
        </div>
        <div style={{fontSize:15,fontWeight:700,color:"#1e3a5f",marginBottom:6,lineHeight:1.35}}>{inv.title}</div>
        <p style={{fontSize:13,color:"#6b7280",lineHeight:1.75,fontStyle:"italic",marginBottom:10}}>
          <ExpandText text={inv.summary} preview={160}/>
        </p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {(inv.sources||[]).map((s,j)=>(
            <a key={j} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#1e3a5f",textDecoration:"none",border:"1px solid #e0d8cc",padding:"2px 8px",borderRadius:3,background:"#f8f6f2"}}>↗ {s.label}</a>
          ))}
        </div>
      </div>
      <div style={{borderTop:"1px solid #e0d8cc",padding:"10px 18px",display:"flex",gap:8,flexWrap:"wrap",background:"#fafaf8"}}>
        <button className="btn btn-gold" style={{fontSize:11.5}} onClick={()=>setAnalysisOpen(p=>({...p,[k]:!p[k]}))}>
          {analysisOpen[k]?"▲ Hide Analysis":"🔍 Decode This"}
        </button>
        {inv.foia&&(
          <button className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>setFoiaOpen(p=>({...p,[k]:!p[k]}))}>
            {foiaOpen[k]?"Hide Template":"📋 FOIA Request"}
          </button>
        )}
      </div>
      {analysisOpen[k]&&(
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#162d4a)",padding:"18px 20px"}}>
          <div style={{fontSize:9,fontWeight:800,color:"#c9a84c",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#c9a84c",display:"inline-block"}}/>
            CIVIC INVESTIGATOR ANALYSIS
          </div>
          {(inv.analysis||"").split('\n\n').map((para,pi)=>{
            const all=(inv.analysis||"").split('\n\n');
            const isLast=pi===all.length-1;
            const mL=["WHAT'S HAPPENING","THE CONNECTIONS","WHO BENEFITS","CONTEXT"];
            const mC=["#fca5a5","#93c5fd","#fcd34d","#c4b5fd"];
            const mT=["#fef2f2","#eff6ff","#fffbeb","#faf5ff"];
            const lc=isLast?"#86efac":mC[pi%4];
            const tc=isLast?"#f0fdf4":mT[pi%4];
            const lbl=isLast?"WHAT YOU CAN DO":mL[pi%4];
            return(
              <div key={pi} style={{marginBottom:pi<all.length-1?14:0}}>
                <div style={{fontSize:8,fontWeight:800,color:lc,letterSpacing:1.8,marginBottom:6,textTransform:"uppercase"}}>{lbl}</div>
                <p style={{fontSize:13.5,color:tc,lineHeight:1.85,margin:0,borderLeft:"2px solid "+lc,paddingLeft:12,whiteSpace:"pre-wrap"}}>{para}</p>
              </div>
            );
          })}
        </div>
      )}
      {inv.foia&&foiaOpen[k]&&(
        <div style={{background:"#eff3f8",borderTop:"1px solid #93b4d4",padding:"16px 18px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#1e3a5f",letterSpacing:1.5,marginBottom:2}}>{inv.foia.title}</div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:8}}>To: {inv.foia.to}</div>
          <textarea readOnly value={inv.foia.template} rows={9} style={{width:"100%",padding:"10px",fontSize:11.5,lineHeight:1.6,borderRadius:3,border:"1px solid #93b4d4",background:"#fff",color:"#1e3a5f",fontFamily:"monospace",resize:"vertical"}}/>
          <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <button className="btn btn-navy" style={{fontSize:11.5}} onClick={()=>copyText(inv.foia.template)}>{copied[k]?"✓ Copied!":"📋 Copy"}</button>
            <a href={"mailto:?subject="+encodeURIComponent(inv.foia.subject||"")+"&body="+encodeURIComponent(inv.foia.template||"")}>
              <button className="btn btn-ghost" style={{fontSize:11.5}}>✉ Open in Email</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OFFICIALS DATA (FIX: "Not disclosed" + named donors) ───
const OFFICIALS=[
  {level:"Federal",color:"#1e3a5f",officials:[
    {name:"Dale Strong",photo:"https://bioguide.congress.gov/bioguide/photo/S/S001220.jpg",title:"U.S. Representative",district:"Alabama's 5th Congressional District",party:"Republican",since:"Jan 2023",termEnds:"Jan 2027",avatar:"DS",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $1.2M–$2.8M",netWorthPre:"Est. $900k before office",netWorthHow:"Real estate holdings in Madison County; stock portfolio; 12-yr career as County Commission Chairman",residency:"Harvest, AL — lives in district",criminal:"No criminal record",
      topDonors:[
        ["Lockheed Martin PAC","$109,000",["Lockheed Martin Corp PAC","Lockheed Martin Employees PAC"]],
        ["Boeing PAC","$88,000",["Boeing Company PAC","Boeing Defense PAC"]],
        ["Raytheon Technologies PAC","$67,000",["RTX Corporation PAC","Raytheon Employees PAC"]]
      ],
      bio:"Served as Madison County Commission Chairman 2010-2022. Won AL-5 seat in 2022. Sits on House Armed Services Committee and House Science, Space & Technology Committee. Has not introduced any TVA oversight, utility rate review, or PFAS accountability legislation despite representing the entire TVA service territory in Alabama. Received $284k+ from defense industry PACs. Voted against the PFAS Notification Act which would have required disclosure of Redstone Arsenal contamination levels.",
      votes:[{bill:"PRO Act (union organizing rights)",vote:"Against",impact:"Would have protected Madison County workers' right to organize"},{bill:"Build Back Better child care",vote:"Against",impact:"Would have capped child care at 7% of income for Madison County families"},{bill:"PFAS Notification Act",vote:"Against",impact:"Would have required disclosure of Redstone Arsenal PFAS contamination levels"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"AL-5 covers all TVA territory — zero bills filed in 2 years"}],
      contact:{phone:"(256) 551-0190",web:"https://dalestrong.house.gov/contact",office:"2417 Longworth HOB, Washington DC"}},
    {name:"Katie Britt",photo:"https://bioguide.congress.gov/bioguide/photo/B/B001319.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",since:"Jan 2023",termEnds:"Jan 2029",avatar:"KB",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $3.1M–$7.4M",netWorthPre:"Est. $1.5M before office",netWorthHow:"Disclosed stock holdings in energy, finance, defense; husband former NFL player; prior CEO Business Council of Alabama",residency:"Montgomery, AL",criminal:"No criminal record",
      topDonors:[
        ["Blue Cross Blue Shield PAC","$155,000",["BCBS Alabama PAC","BCBS Association PAC","Protective Life Corp"]],
        ["Protective Life Corporation","$95,000",["Protective Life Insurance","Great-West Life"]],
        ["Alabama Power / Energy PACs","$65,000",["Southern Company PAC","Alabama Power PAC","Chevron PAC"]]
      ],
      bio:"First woman elected to Senate from Alabama. Former CEO of Business Council of Alabama. Made public statements about undocumented immigrants accessing Medicaid that directly contradict 8 U.S.C. §1611 — federal law in place since 1996. Received $310k from health insurance PACs whose market shrinks when Medicaid expands. Has not introduced any TVA oversight legislation. Voted against the PFAS Action Act.",
      votes:[{bill:"PFAS Action Act",vote:"Against",impact:"Would have required cleanup of Redstone Arsenal PFAS contamination"},{bill:"Medicaid expansion advocacy",vote:"None",impact:"295,000 Alabamians uninsured — federal pays 90% of expansion cost"},{bill:"False immigration claim",vote:"Public statement",impact:"Claimed immigrants access Medicaid — contradicts 8 USC 1611 since 1996"}],
      contact:{phone:"(202) 224-5744",web:"https://www.britt.senate.gov/contact",office:"703 Hart Senate Office Building"}},
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"U.S. Senator",district:"Alabama (statewide)",party:"Republican",since:"Jan 2021",termEnds:"Jan 2027",avatar:"TT",salary:"$174,000/yr — taxpayer funded",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before office",netWorthHow:"Multi-million coaching contracts at Auburn, Ole Miss, Texas Tech; hedge fund and commodity investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Auburn, AL — has faced questions about Florida residency",criminal:"No criminal record",
      topDonors:[
        ["Club for Growth PAC","$185,000",["Club for Growth Action","Club for Growth PAC"]],
        ["Energy Industry PACs","$270,000",["Chevron Corp PAC","ExxonMobil PAC","Club for Growth Energy"]],
        ["Defense Industry PACs","$142,000",["Northrop Grumman PAC","General Dynamics PAC","L3Harris PAC"]]
      ],
      bio:"Spent most of career as football coach. Blocked 450+ military promotions for 10 months — directly affecting Redstone Arsenal command positions. Has not introduced any TVA oversight legislation. Running for Alabama Governor in 2026 instead of seeking Senate re-election. Introduced 21 bills in 4 years — zero advanced out of committee. Was spotted at the Masters Tournament instead of voting on a new Joint Chiefs chairman.",
      votes:[{bill:"Military promotions (held hostage)",vote:"Blocked 450+ for 10 months",impact:"Directly disrupted Redstone Arsenal command structure"},{bill:"TVA oversight legislation",vote:"None introduced",impact:"Controls TVA through Senate despite $270k energy PACs"}],
      contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
  ]},
  {level:"State",color:"#7f1d1d",officials:[
    {name:"Kay Ivey",photo:"https://governor.alabama.gov/wp-content/uploads/2019/06/Ivey-Official-Portrait-2019.jpg",title:"Governor of Alabama",district:"Statewide — TERM LIMITED 2026",party:"Republican",since:"Apr 2017",termEnds:"Jan 2027",avatar:"KI",salary:"$120,395/yr — taxpayer funded",netWorth:"Est. $1.4M–$3.2M",netWorthPre:"Est. $900k before governor",netWorthHow:"State treasurer 2003-2011; State Auditor; real estate; disclosed investment portfolio",residency:"Montgomery, AL",criminal:"No criminal record",
      topDonors:[
        ["Blue Cross Blue Shield Alabama","$220,000",["BCBS Alabama PAC","Protective Life Corp","Viva Health Inc"]],
        ["Alabama Power / Southern Company","$180,000",["Southern Company PAC","Alabama Power PAC","PowerSouth Energy"]],
        ["Business Council of Alabama","$180,000",["BCA PAC","AL Retail Association","ALFA Insurance PAC"]]
      ],
      bio:"Has refused Medicaid expansion for 295,000 Alabamians every year since 2014 — federal government pays 90% of the cost. Signed CHOOSE Act diverting $100M from Education Trust Fund to private schools where 67% of recipients were already enrolled. Declined 100% federally-funded Summer EBT program — 400,000 Alabama children lost $120 in food benefits. Appoints ADEM leadership — Alabama's environmental enforcement agency, ranked among weakest in the Southeast. Received $420k from health insurance industry PACs whose market shrinks when Medicaid expands.",
      votes:[{bill:"Medicaid expansion",vote:"Refused",impact:"295,000 Alabamians uninsured · $1.8B/yr in federal funding declined"},{bill:"CHOOSE Act",vote:"Signed",impact:"$100M/yr from ETF to private schools — 67% already private"},{bill:"Summer EBT 2024",vote:"Declined",impact:"400,000 Alabama children lost $120 summer food benefit"}],
      contact:{phone:"(334) 242-7100",web:"https://governor.alabama.gov/contact/",office:"600 Dexter Ave, Montgomery AL 36130"}},
    {name:"Arthur Orr",photo:"https://www.legislature.state.al.us/pdf/senate/members/Senate_ColorHeadshots/8.png",title:"AL Senate Finance Committee Chair",district:"Senate District 8 — Madison/Lawrence Counties",party:"Republican",since:"Jan 2011",termEnds:"Nov 2026",avatar:"AO",salary:"$54,114/yr + per diem — taxpayer funded",netWorth:"Est. $800k–$2.1M",netWorthPre:"Est. $600k before senate",netWorthHow:"Attorney; law practice income; real estate holdings in state ethics filings",residency:"Decatur, AL",criminal:"No criminal record",
      topDonors:[
        ["Business Council of Alabama","$45,000",["BCA PAC","AL Restaurant Assoc.","AL Retail Association"]],
        ["Private Prison Industry","$22,000",["CoreCivic PAC","GEO Group PAC"]],
        ["ALFA Insurance","$28,000",["ALFA Mutual Insurance","Farm Bureau Insurance","Protective Life"]]
      ],
      bio:"As Finance Committee Chairman he controls which bills receive hearings in the Alabama Senate. Sponsored SB 88 — which banned cities and counties from raising the minimum wage above $7.25/hr. Has blocked Medicaid expansion, kratom reclassification, and bail reform bills. Received $45k from Business Council of Alabama before and after sponsoring the wage ban. His Senate District 8 seat is on the November 2026 ballot. Tanya Reeves (D) has announced a challenge.",
      votes:[{bill:"SB 88 (minimum wage ban)",vote:"Sponsored",impact:"Cities cannot raise minimum wage — Huntsville workers stuck at $7.25/hr"},{bill:"Medicaid expansion",vote:"Blocked",impact:"295,000 Alabamians uninsured"},{bill:"Kratom reclassification",vote:"Blocked",impact:"Kratom remains Class C felony — legal in 43 states"}],
      contact:{phone:"(256) 355-8584",web:"https://www.legislature.state.al.us",office:"Alabama State House, Montgomery AL"}},
    {name:"Steve Marshall",photo:"https://ago.alabama.gov/wp-content/uploads/2020/09/AG-Marshall-Headshot.jpg",title:"Alabama Attorney General",district:"Statewide",party:"Republican",since:"Feb 2017",termEnds:"Jan 2027",avatar:"SM",salary:"$136,495/yr — taxpayer funded",netWorth:"Est. $500k–$1.4M",netWorthPre:"Est. $400k before AG",netWorthHow:"Attorney; public salary; disclosed investments",residency:"Guntersville, AL",criminal:"No criminal record — but faced scrutiny for campaign finance practices",
      topDonors:[
        ["Law Enforcement PACs","$340,000",["AL Sheriffs Association PAC","AL Chiefs of Police","FOP National PAC"]],
        ["Private Prison Industry","$45,000",["CoreCivic PAC","GEO Group PAC"]],
        ["Business Council of Alabama","$38,000",["BCA PAC","AL Business Alliance"]]
      ],
      bio:"Defended Alabama's unconstitutional congressional maps in Allen v. Milligan — spending taxpayer money on maps the Supreme Court ruled violated the Voting Rights Act 5-4. Drew replacement maps that a federal court also found non-compliant. Opposes bail reform and HFOA sentencing reform. Received $45k from private prison industry that profits from high incarceration rates.",
      votes:[{bill:"Allen v. Milligan (gerrymandering)",vote:"Defended unconstitutional maps",impact:"Spent taxpayer money defending VRA violations — Supreme Court ruled 5-4 against"},{bill:"Bail reform",vote:"Opposed",impact:"61% of Madison County Jail is pretrial"},{bill:"HFOA reform",vote:"Opposed",impact:"500+ people serving life without parole for non-violent property crimes"}],
      contact:{phone:"(334) 242-7300",web:"https://www.alabamaag.gov",office:"501 Washington Ave, Montgomery AL 36130"}},
  ]},
  {level:"County",color:"#374151",officials:[
    {name:"Kevin Turner",photo:"https://storage.googleapis.com/download/storage/v1/b/g-green-backend-bucket-1/o/mdsoal%2FSheriff_Kevin_Turner.jpg?alt=media",title:"Madison County Sheriff",district:"Madison County",party:"Republican",since:"Jan 2019",termEnds:"Jan 2027",avatar:"KT",salary:"~$95,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Career law enforcement; income from public salary",residency:"Madison County",criminal:"No criminal record",
      topDonors:[
        ["Law Enforcement PACs","$62,000",["AL Sheriffs Association PAC","PLEA PAC","NAPO PAC"]],
        ["Bail Bond Industry","$24,000",["AL Bail Agents Association","SCI Bail Bonds","Freedom Bail Bonds"]]
      ],
      bio:"61% of Madison County Jail population is pretrial — not convicted of anything. County earns approximately $200,000/year in Securus/ViaPath phone commissions while incarcerated families pay $0.21/min to call loved ones. Received $24,000 from bail bond industry that directly profits from keeping people in pretrial detention. Controls a $2.3M civil forfeiture fund with zero required public accounting of how it is spent. Opposes bail reform. Up for re-election in 2026.",
      votes:[{bill:"Bail reform",vote:"Opposed",impact:"61% of jail is pretrial — held because they cannot afford bail"},{bill:"Securus contract renewal",vote:"Maintained",impact:"County earns $200k/yr commissions while families pay $0.21/min"}],
      contact:{phone:"(256) 722-7181",web:"https://www.madisoncountysheriff.org",office:"815 Wheeler Ave, Huntsville AL 35801"}},
    {name:"Violet Edwards",photo:"https://www.madisoncountyal.gov/ImageRepository/Document?documentID=5832",title:"Madison County Commissioner — District 6",district:"District 6 — North Huntsville",party:"Democrat",since:"Jan 2025",termEnds:"Jan 2029",avatar:"VE",salary:"~$62,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"First term — financial disclosure pending",residency:"North Huntsville",criminal:"No record found",
      topDonors:[["Community fundraising","~$28,000",["Small-dollar community donors"]]],
      bio:"First Black woman elected to the Madison County Commission. Represents north Huntsville areas where road PCI averages 41 vs south Huntsville's 72. As the only Democrat on the commission, her ability to force policy change is limited. Her district includes communities with the most documented service disparities in Madison County.",
      votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
    {name:"Rex Vaughn",photo:null,title:"Madison County Commission Chairman (At-Large)",district:"At-Large — all of Madison County",party:"Republican",since:"Mar 2026",termEnds:"TBD",avatar:"RV",salary:"~$78,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Recently appointed — financial disclosure under review",residency:"Madison County",criminal:"No record found",
      topDonors:[["Under research","TBD",["Financial disclosures pending"]]],
      bio:"Appointed March 2026 to fill vacancy. Controls county budget and service delivery for all unincorporated areas — including Harvest, Toney, Monrovia, and Meridianville which have no city government. First major decisions will signal priorities for these rapidly growing communities.",
      votes:[],contact:{phone:"(256) 532-3492",web:"https://www.madisoncountyal.gov",office:"100 Northside Square, Huntsville AL 35801"}},
  ]},
  {level:"2026 Candidates",color:"#7c3aed",officials:[
    {name:"Tommy Tuberville",photo:"https://bioguide.congress.gov/bioguide/photo/T/T000278.jpg",title:"Candidate — AL Governor 2026",district:"Statewide — running to replace term-limited Ivey",party:"Republican",since:"Announced Dec 2025",termEnds:"Would serve 2027-2031",avatar:"TT",salary:"$174,000/yr current Senate salary",netWorth:"Est. $11M–$33M",netWorthPre:"Est. $8M before Senate",netWorthHow:"Multi-million coaching contracts; hedge fund investments that raised ethics concerns while on Senate Armed Services Committee",residency:"Questions raised — Auburn AL listed but possible primary residence in Florida",criminal:"No criminal record",
      topDonors:[
        ["Energy PACs","$270,000",["Chevron Corp PAC","ExxonMobil PAC","Club for Growth Energy"]],
        ["Club for Growth","$185,000",["Club for Growth Action PAC"]],
        ["Defense Industry","$142,000",["Northrop Grumman PAC","General Dynamics PAC"]]
      ],
      bio:"Current AL Senator running for Governor instead of Senate re-election. Introduced 21 bills in 4 years — zero advanced out of committee. Blocked 450+ military promotions for 10 months affecting Redstone Arsenal. Residency questions: Alabama law requires 7 years of residency to run for governor. Cook Political Report noted questions about the nature of his Alabama residency. As governor would appoint ADEM leadership — the agency overseeing Redstone Arsenal PFAS contamination and Triana water quality.",
      votes:[{bill:"Military promotions block",vote:"10 months",impact:"Directly disrupted Redstone Arsenal — then ran for governor of the state he disrupted"},{bill:"TVA oversight",vote:"None in 4 years",impact:"Received $270k energy PACs — introduced zero utility oversight"}],
      quotes:[{type:"general",fact:"Residency questions: Cook Political Report noted 'questions linger about the exact nature of Tuberville's residence in the state he hopes to lead.' Alabama law requires 7 years of residency to run for governor.",date:"Dec 2025",source:"Cook Political Report",flip:false}],
      contact:{phone:"(202) 224-4124",web:"https://www.tuberville.senate.gov/contact",office:"455 Russell Senate Office Building"}},
    {name:"Doug Jones",photo:"https://bioguide.congress.gov/bioguide/photo/J/J000300.jpg",title:"Candidate — AL Governor 2026 (Democrat)",district:"Statewide — former US Senator",party:"Democrat",since:"Announced 2025",termEnds:"Would serve 2027-2031",avatar:"DJ",salary:"N/A — private practice",netWorth:"Est. $2M–$5M",netWorthPre:"Est. $1.5M before Senate",netWorthHow:"Career as federal prosecutor and attorney; Senate salary 2018-2023",residency:"Birmingham, AL",criminal:"No criminal record — former federal prosecutor",
      topDonors:[["Democratic fundraising network","Under research",["Trial lawyers PAC","Progressive donors"]],["Trial lawyers","Under research",["AL Trial Lawyers Association"]]],
      bio:"Served as US Senator 2018-2023 — the only Democrat elected statewide in Alabama since 2008. Lost to Tuberville in 2020 by 20 points. Prosecuted the 16th Street Baptist Church bombers as US Attorney. If elected would be first Democratic governor of Alabama since 2003. As governor would have authority to expand Medicaid to 295,000 Alabamians without a legislative vote.",
      votes:[{bill:"ACA protection votes",vote:"Yes",impact:"Voted to protect pre-existing condition coverage"},{bill:"Bipartisan Infrastructure",vote:"Yes",impact:"Supported $1.2B for Alabama infrastructure"}],
      quotes:[{type:"healthcare",fact:"As Senator voted to protect the ACA and has publicly supported Medicaid expansion. As governor would have authority to expand Medicaid to 295,000 Alabamians without a legislative vote.",date:"2018-2023",source:"Senate vote records",flip:false}],
      contact:{phone:"N/A",web:"https://dougjones.com",office:"Campaign website"}},
  ]},
  {level:"Huntsville",color:"#1e3a5f",officials:[
    {name:"Tommy Battle",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2022/11/battle-headshot-200.jpg",title:"Mayor of Huntsville",district:"City of Huntsville — 5th term",party:"Republican",since:"Nov 2008",termEnds:"Nov 2028",avatar:"TB",salary:"$131,500/yr — taxpayer funded",netWorth:"Est. $2.8M–$6.4M",netWorthPre:"Est. $1.2M before mayor",netWorthHow:"Business background; real estate; investment portfolio grown during tenure; salary + benefits for 16+ years",residency:"Huntsville, AL — south Huntsville",criminal:"No criminal record",
      topDonors:[
        ["Real Estate Developers","$380,000",["RCP Companies","Goodall Brazier & Assoc.","Southeastern Development LLC"]],
        ["Construction Companies","$210,000",["Brasfield & Gorrie","Hoar Construction","Turner Construction"]],
        ["HHHS Foundation","$45,000",["Huntsville Hospital Foundation"]],
        ["Defense/Aerospace Contractors","$88,000",["Boeing","Teledyne Brown Engineering","Jacobs Engineering"]]
      ],
      bio:"Longest-serving Huntsville mayor — 16 years. Under his tenure: north Huntsville roads average PCI 41 vs south Huntsville PCI 72 (same tax rate). Zero civilian police review board proposals. IDB has granted $127M+ in corporate tax abatements with no audit of promised jobs. 68% of capital road spending went to south Huntsville. Appoints all 9 IDB board members. Police union has endorsed him in every election since 2008. Received $45k from HHHS Foundation — the hospital that claims $63M/yr in nonprofit tax exemptions.",
      votes:[{bill:"Civilian police review board",vote:"Never proposed in 16 years",impact:"HPD investigates its own conduct with no civilian oversight"},{bill:"IDB abatement performance audits",vote:"Never required",impact:"$127M+ granted · no public verification of job/wage promises"},{bill:"Anti-camping ordinance",vote:"Supported",impact:"3 of 8 sweeps near active developer projects"}],
      contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/mayors-office/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Michelle Watkins",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Michelle-Watkins-Headshot-150x150.jpg",title:"City Council — District 1",district:"District 1 — North Huntsville",party:"Democrat",since:"Nov 2024",termEnds:"Nov 2028",avatar:"MW",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"First term — limited disclosure period",residency:"North Huntsville — in district",criminal:"No record found",
      topDonors:[["Community fundraising","~$42,000",["Small-dollar community donors","North Huntsville residents"]]],
      bio:"First Black woman elected to Huntsville City Council. Elected September 2024. Voted NO on the January 2025 394-acre annexation — the only no vote on council — citing school overcrowding: 'You are breaking the schools at the seam.' Her district includes roads with PCI 41, documented over-policing, and the city's most severe service gaps.",
      votes:[{bill:"394-acre annexation (Jan 2025)",vote:"NO — only no vote",impact:"'Breaking schools at the seam' — schools cannot absorb growth"}],
      contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Jennie Robinson",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Robinson_Jennie_655-0004-150x150.jpg",title:"City Council — District 3 (Council President)",district:"District 3 — South/Central Huntsville",party:"Republican",since:"Nov 2016",termEnds:"Nov 2028",avatar:"JR",salary:"~$20,000/yr — part-time council",netWorth:"Est. $600k–$1.8M",netWorthPre:"Est. $500k before council",netWorthHow:"Career educator; professor; real estate; public salary",residency:"South Huntsville — district 3",criminal:"No criminal record",
      topDonors:[["South Huntsville Business","$52,000",["Chamber of Commerce members","South HSV developers"]],["Real Estate Interests","$28,000",["Local real estate PAC","Residential developers"]]],
      bio:"Council President. Has voted for budgets producing the documented PCI 41 vs 72 road disparity. Facilitated all 2025 annexations as Council President. Up for re-election 2026.",
      votes:[{bill:"All 2025 annexations",vote:"Supported",impact:"2,000+ acres annexed while north Huntsville roads remain PCI 41"}],
      contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
    {name:"Bill Kling Jr.",photo:"https://www.huntsvilleal.gov/wp-content/uploads/2025/02/Kling_Bill_182-0003-150x150.jpg",title:"City Council — District 4",district:"District 4 — Southeast Huntsville",party:"Republican",since:"Nov 2020",termEnds:"Nov 2028",avatar:"BK",salary:"~$20,000/yr — part-time council",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Business background",residency:"Southeast Huntsville",criminal:"No record found",
      topDonors:[["Local Business","~$30,000",["Southeast HSV business community"]]],
      bio:"Introduced the December 2025 proposal to annex 680 additional acres. Responded to the 1,605-signature HU billing audit petition by saying 'The utility rates in Huntsville are among the lowest in the entire state of Alabama' — a statement that applies to per-kWh rate but does not address the combined bill burden residents are reporting of $500-$600.",
      votes:[{bill:"680-acre annexation (Dec 2025)",vote:"Introduced",impact:"Second-largest annexation of 2025"}],
      contact:{phone:"(256) 427-5000",web:"https://www.huntsvilleal.gov/government/city-council/",office:"308 Fountain Circle, Huntsville AL 35801"}},
  ]},
  {level:"Madison City",color:"#374151",officials:[
    {name:"Ranae Bartlett",photo:null,title:"Mayor of Madison",district:"City of Madison — sworn Nov 2025",party:"Republican",since:"Nov 2025",termEnds:"Nov 2029",avatar:"RB",salary:"~$80,000/yr — taxpayer funded",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Attorney; former Madison Board of Education 2011-2020; law clerk to US District Judge",residency:"Madison, AL",criminal:"No criminal record",
      topDonors:[["Local community fundraising","~$85,000",["Madison City residents","Local business supporters"]]],
      bio:"First new Madison mayor in a decade. Former Madison Board of Education member 2011-2020 and Board President 2017-2020. Career law clerk to US District Judge C. Lynwood Smith Jr. Controls Madison Utilities board appointments for 19,000+ water connections. Key test: whether she requires affordable housing components in new Madison development.",
      votes:[{bill:"Madison Utilities board",vote:"New appointments 2026",impact:"Controls appointed board setting water rates for 19,000+ customers"}],
      contact:{phone:"(256) 772-5600",web:"https://www.madisonal.gov",office:"100 Hughes Rd, Madison AL 35758"}},
  ]},
  {level:"Triana",color:"#7f1d1d",officials:[
    {name:"Mary Caudle",photo:null,title:"Mayor of Triana",district:"Town of Triana",party:"Non-partisan",since:"2008",termEnds:"TBD",avatar:"MC",salary:"Minimal — small town budget",netWorth:"Not disclosed",netWorthPre:"Not disclosed",netWorthHow:"Lifelong Triana resident; 39 years in medical finance; community service",residency:"Triana, AL — lifelong resident",criminal:"No criminal record",
      topDonors:[["Local community fundraising","Not disclosed",["Triana residents"]]],
      bio:"Four-term mayor since 2008. Lifelong Triana resident. Advocates for a majority-Black community of 2,300 facing EPA Superfund contamination from Redstone Arsenal PFAS and Olin Corporation DDT. Town water shows PFOS above EWG health guidelines. Triana has no Huntsville City Council representation and no access to IDB tax abatements. Serves on TARCOG and Community Action Partnership.",
      votes:[],
      contact:{phone:"(256) 772-0300",web:"https://townoftrianaal.gov",office:"Town of Triana, 209 Triana Blvd, Triana AL 35756"}},
  ]},
];

// ─── OFFICIALS PAGE ──────────────────────────────────────────
function OfficialsPage({go}){
  const[mainTab,setMainTab]=useState("directory");
  const[filter,setFilter]=useState("All");
  const[selected,setSelected]=useState(null);
  const[detailTab,setDetailTab]=useState("bio");
  const[r,setR]=useState(null);
  const[ld,setLd]=useState(false);

  async function investigate(off){
    setLd(true);
    try{
      const x=await callAI(`Here is the data on ${off.name} (${off.title}): Salary ${off.salary}. Net worth now ${off.netWorth}, before office ${off.netWorthPre}. Top donors: ${off.topDonors.map(d=>d[0]+' '+d[1]+(d[2]?` (${d[2].join(', ')})`:"")).join(', ')}. Residency: ${off.residency}. Criminal record: ${off.criminal}. Key record: ${off.bio.substring(0,300)}. WHO SPECIFICALLY BENEFITS: name the executives, CEOs, and major donors who profit from this official's decisions. Connect the donors to specific decisions. What does this mean for a Madison County resident? Under 150 words, no jargon.`);
      setR(x);
    }catch(e){setR("Summary unavailable.");}
    setLd(false);
  }

  const MAIN_TABS=[
    {id:"directory",label:"Officials Directory"},
    {id:"candidates",label:"2026 Candidates"},
    {id:"elections",label:"2026 Elections"},
    {id:"voting",label:"Voting & Registration"},
  ];
  const levels=["All","Federal","State","County","Huntsville","Madison City","Triana"];
  const filtered=filter==="All"?OFFICIALS.filter(g=>g.level!=="2026 Candidates"):OFFICIALS.filter(g=>g.level===filter);
  const candidates=OFFICIALS.find(g=>g.level==="2026 Candidates");

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-navy">OFFICIALS · DIRECTORY</span>
        <h2>Officials & <em>Elections</em></h2>
        <p>Every elected official with power over Madison County. Net worth before and after office, salary, top donors with named individuals, voting record, and residency — all from public records.</p>
        <div style={{background:"#1e3a5f",borderRadius:5,padding:"10px 14px",marginTop:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>go("money")}>
          <span style={{fontSize:18}}>🕸</span>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#c9a84c"}}>See the full donor→policy network graphs</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Follow the Money → Networks tab</div>
          </div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,.5)",fontSize:16}}>→</span>
        </div>
      </div>

      <div className="tabs" style={{marginBottom:16}}>
        {MAIN_TABS.map(t=>(
          <button key={t.id} className={`tab${mainTab===t.id?" active":""}`} onClick={()=>setMainTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {mainTab==="directory"&&(
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {levels.map(l=>(
              <button key={l} onClick={()=>setFilter(l)} style={{padding:"6px 14px",borderRadius:12,border:"1px solid #e0d8cc",background:filter===l?"#1e3a5f":"#fff",color:filter===l?"#c9a84c":"#6b7280",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {filtered.map((group,gi)=>(
            <div key={gi} style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#6b7280",marginBottom:10,textTransform:"uppercase"}}>{group.level} OFFICIALS</div>
              {group.officials.map((off,oi)=>(
                <div key={oi} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":off.party==="Democrat"?"#1e40af":"#5b21b6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0,overflow:"hidden"}}>
                        {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                      </div>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                          <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":off.party==="Democrat"?"#eff6ff":"#f5f3ff",color:off.party==="Republican"?"#dc2626":off.party==="Democrat"?"#2563eb":"#7c3aed",border:`1px solid ${off.party==="Republican"?"#fca5a5":off.party==="Democrat"?"#93c5fd":"#c4b5fd"}`}}>{off.party==="Republican"?"R":off.party==="Democrat"?"D":"I"}</span>
                        </div>
                        <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#dc2626"}}>{off.netWorth}</div>
                      <div style={{fontSize:10,color:"#6b7280"}}>net worth</div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{off.salary.split("—")[0].trim()}</div>
                    </div>
                  </div>
                  {/* FIX: Use ExpandText instead of substring */}
                  <div style={{fontSize:13,color:"#374151",marginTop:8,lineHeight:1.5}}>
                    <ExpandText text={off.bio} preview={120}/>
                  </div>
                  <div style={{fontSize:11,color:"#1e3a5f",marginTop:6,fontWeight:700}}>Tap to see full record →</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {mainTab==="candidates"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">⚡ 2026 IS THE MOST CONSEQUENTIAL ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
            <div className="alert-text">Governor's race is an open seat — Kay Ivey is term-limited. All three federal seats on the ballot. Sheriff, three Huntsville City Council seats, three HCS school board seats, and the entire Alabama Legislature. 37,000 eligible Madison County residents are not registered to vote.</div>
          </div>
          {candidates&&candidates.officials.map((off,i)=>(
            <div key={i} onClick={()=>{setSelected(off);setDetailTab("bio");setR(null);}} style={{background:"#fff",border:"1px solid #e0d8cc",borderLeft:`4px solid ${off.party==="Republican"?"#dc2626":"#2563eb"}`,borderRadius:6,padding:"13px 14px",marginBottom:8,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:off.party==="Republican"?"#991b1b":"#1e40af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12.5,fontWeight:900,color:"#fff",flexShrink:0}}>
                  {off.photo?<img src={off.photo} alt={off.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} onError={e=>{e.target.style.display="none";}}/>:<span>{off.avatar}</span>}
                </div>
                <div>
                  <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:2}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#1e3a5f"}}>{off.name}</div>
                    <span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:off.party==="Republican"?"#fef2f2":"#eff6ff",color:off.party==="Republican"?"#dc2626":"#2563eb"}}>{off.party}</span>
                  </div>
                  <div style={{fontSize:12.5,color:"#6b7280"}}>{off.title}</div>
                </div>
              </div>
              {/* FIX: ExpandText not substring */}
              <div style={{fontSize:13,color:"#374151",lineHeight:1.5,marginBottom:6}}>
                <ExpandText text={off.bio} preview={200}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Net worth:</strong> {off.netWorth} (was {off.netWorthPre})</div>
                <div style={{background:"#f8f6f2",borderRadius:3,padding:"6px 9px",fontSize:11}}><strong>Residency:</strong> {off.residency}</div>
              </div>
              <div style={{fontSize:11,color:"#1e3a5f",fontWeight:700}}>Tap for full record including donor connections →</div>
            </div>
          ))}
        </div>
      )}

      {mainTab==="elections"&&(
        <div>
          <div className="alert-banner">
            <div className="alert-label">2026 — KEY RACES FOR MADISON COUNTY</div>
            <div className="alert-text">Governor's race is an open seat. All three federal races on the ballot. Sheriff, three city council seats, three school board seats. 37,000 eligible residents not registered.</div>
          </div>
          {[
            {office:"Governor — OPEN SEAT",date:"Nov 2026",priority:true,note:"Ivey is term-limited. Governor appoints ADEM leadership, parole board, prison oversight. Has authority to expand Medicaid by executive action — covering 295,000 Alabamians at 90% federal cost."},
            {office:"U.S. Senate — Open (Tuberville running for Governor)",date:"Nov 2026",priority:true,note:"Rare opportunity — this seat was last won by a Democrat (Doug Jones) in 2017. Tuberville leaving it open."},
            {office:"AL Senate Finance Chair — Arthur Orr (D8)",date:"Nov 2026",priority:true,note:"Controls which bills get hearings. Sponsored SB 88 wage ban. Blocked Medicaid, kratom reform, bail reform. Tanya Reeves (D) has announced a challenge."},
            {office:"HCS School Board D2, D3, D4",date:"Nov 2026",priority:true,note:"$310M budget. 11% turnout. 2,000 organized voters flips any seat."},
            {office:"Madison County Sheriff — Kevin Turner",date:"2026",priority:false,note:"61% pretrial detention. Securus conflict. $24k bail bond industry. Opposes bail reform."},
            {office:"U.S. House AL-5 — Dale Strong",date:"Nov 2026",priority:false,note:"$284k defense PACs. Zero TVA oversight bills. Voted against PRO Act, PFAS notification."},
          ].map((e,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${e.priority?"#dc2626":"#1e3a5f"}`,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
                <div style={{fontSize:13.5,fontWeight:800,color:"#1e3a5f"}}>
                  {e.priority&&<span style={{fontSize:9,fontWeight:700,color:"#dc2626",background:"#fef2f2",padding:"1px 7px",borderRadius:8,marginRight:6,border:"1px solid #fca5a5"}}>HIGH PRIORITY</span>}
                  {e.office}
                </div>
                <span style={{fontSize:10,fontWeight:700,color:"#b8860b",background:"#fffbeb",padding:"2px 9px",borderRadius:8,border:"1px solid #fcd34d",flexShrink:0}}>{e.date}</span>
              </div>
              <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{e.note}</div>
            </div>
          ))}
          <a href="https://www.alabamavotes.gov/RegisterToVote" target="_blank" rel="noreferrer">
            <button className="btn btn-full" style={{background:"#16a34a",color:"#fff",marginTop:8}}>✓ Register to Vote / Check Registration →</button>
          </a>
        </div>
      )}

      {mainTab==="voting"&&(
        <div>
          <div className="stats-grid">
            {[["VRA Violation Ruled","2023","Allen v. Milligan — maps unconstitutional 5-4","#dc2626"],["Unregistered Eligible","37,000","Madison Co. residents who can vote but haven't registered","#dc2626"],["HCS Board Turnout","11%","Controls $310M annual budget — decided by 2,000 votes","#ea580c"],["Local Race Margin","<200 votes","Most city council and school board races","#ea580c"]].map(([l,v,s,c],i)=>(
              <div key={i} className="stat-card"><div className="stat-val" style={{color:c}}>{v}</div><div className="stat-lbl">{l}</div><div className="stat-sub">{s}</div></div>
            ))}
          </div>
          <div className="fact fact-red"><div className="fact-label" style={{color:"#dc2626"}}>GERRYMANDERING — WHAT HAPPENED</div><div className="fact-text" style={{color:"#7f1d1d"}}>In June 2023 the U.S. Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). AG Steve Marshall spent taxpayer money defending maps the Court found unconstitutional. Alabama then drew replacement maps a federal court also found non-compliant. Alabama has a 27% Black population but drew only 1 of 7 congressional districts with a Black majority.</div></div>
          <div className="fact fact-green"><div className="fact-label" style={{color:"#16a34a"}}>YOUR VOTE IS WORTH MORE THAN YOU THINK</div><div className="fact-text" style={{color:"#14532d"}}>The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races are decided by under 200 votes at 11% turnout — controlling a $310M annual budget. A single organized group of 500 committed voters can determine the outcome of almost any Madison County local race.</div></div>
          {[
            {icon:"🗳",title:"Register to Vote / Check Your Registration",sub:"Deadline: 15 days before any election. 37,000 eligible Madison County residents are not registered.",url:"https://www.alabamavotes.gov/RegisterToVote",btn:"Check Registration →"},
            {icon:"📅",title:"2026 Key Dates",sub:"Primary: May 19, 2026 · Registration deadline for primary: May 4, 2026 · General: November 3, 2026 · Registration deadline for general: October 19, 2026",url:null,btn:null},
            {icon:"◉",title:"Run for HCS School Board in 2026",sub:"Districts 2, 3, and 4 are on the November 2026 ballot. Races decided by under 200 votes. You do not need money or connections to run.",url:"https://www.sos.alabama.gov/alabama-votes/candidates",btn:"Candidate Filing Info →"},
          ].map((item,i)=>(
            <div key={i} className="card" style={{marginBottom:8}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:22}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:4}}>{item.title}</div>
                  <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:item.url?8:0}}>{item.sub}</div>
                  {item.url&&<a href={item.url} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:12}}>{item.btn}</button></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── OFFICIAL DETAIL MODAL ─── */}
      {selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(30,58,95,.6)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setR(null);}}}>
          <div style={{background:"#fff",borderRadius:8,width:"100%",maxWidth:700,border:`3px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`,boxShadow:"0 20px 60px rgba(0,0,0,.25)",overflow:"hidden",marginTop:20}}>
            <div style={{background:selected.party==="Republican"?"#991b1b":selected.party==="Democrat"?"#1e40af":"#5b21b6",padding:"20px 22px",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",flexShrink:0,border:"3px solid rgba(255,255,255,.4)",overflow:"hidden"}}>
                {selected.photo?<img src={selected.photo} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{e.target.style.display="none";}}/>:<span>{selected.avatar}</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{selected.name}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:2}}>{selected.title} · {selected.district}</div>
                <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
                  {[`In office since ${selected.since}`,`Term ends ${selected.termEnds}`,selected.party].map((t,i)=><span key={i} style={{fontSize:10,color:"rgba(255,255,255,.65)",background:"rgba(255,255,255,.12)",padding:"2px 8px",borderRadius:2}}>{t}</span>)}
                </div>
              </div>
              <button onClick={()=>{setSelected(null);setR(null);}} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
            </div>

            {/* Net worth bar */}
            <div style={{background:"#fffbeb",borderBottom:"1px solid #fcd34d",padding:"11px 22px",display:"flex",gap:20,flexWrap:"wrap"}}>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>NET WORTH NOW</div><div style={{fontSize:19,fontWeight:900,color:"#b8860b"}}>{selected.netWorth}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>BEFORE OFFICE</div><div style={{fontSize:19,fontWeight:900,color:"#6b7280"}}>{selected.netWorthPre}</div></div>
              <div style={{flex:1}}><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>HOW THEY BUILT IT</div><div style={{fontSize:12,color:"#4a3800",lineHeight:1.4}}>{selected.netWorthHow}</div></div>
              <div><div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:2}}>TAXPAYER SALARY</div><div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>{selected.salary}</div></div>
            </div>

            <div style={{background:"#f8f6f2",borderBottom:"1px solid #e0d8cc",padding:"9px 22px",display:"flex",gap:20,flexWrap:"wrap",fontSize:12}}>
              <span><strong>Residency:</strong> {selected.residency}</span>
              <span><strong>Criminal record:</strong> <span style={{color:selected.criminal==="No criminal record"||selected.criminal==="No record found"?"#16a34a":"#dc2626"}}>{selected.criminal}</span></span>
            </div>

            {/* Detail tabs */}
            <div style={{display:"flex",borderBottom:"1px solid #e0d8cc",background:"#f8f6f2"}}>
              {["bio","donors","votes","contact"].map(t=>(
                <button key={t} onClick={()=>setDetailTab(t)} style={{flex:1,padding:"10px 4px",border:"none",cursor:"pointer",fontSize:11,fontWeight:detailTab===t?700:500,color:detailTab===t?(selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"):"#6b7280",background:detailTab===t?"#fff":"#f8f6f2",borderBottom:detailTab===t?`2px solid ${selected.party==="Republican"?"#dc2626":selected.party==="Democrat"?"#2563eb":"#7c3aed"}`:"2px solid transparent",fontFamily:"inherit",textTransform:"capitalize"}}>
                  {t==="bio"?"Profile":t==="donors"?"Donors":t==="votes"?"Votes":"Contact"}
                </button>
              ))}
            </div>

            <div style={{padding:"16px 22px",maxHeight:480,overflowY:"auto"}}>
              {/* FIX: Bio uses ExpandText — always has Read More */}
              {detailTab==="bio"&&<div>
                <p style={{fontSize:14,lineHeight:1.8,color:"#374151",marginBottom:14}}>
                  <ExpandText text={selected.bio} preview={350}/>
                </p>
                {!r
                  ?<button className="btn btn-gold btn-full" onClick={()=>investigate(selected)} disabled={ld}>{ld?<><span className="spin"/>Breaking it down...</>:"🔍 Break It Down"}</button>
                  :<div className="ai-panel"><div className="ai-panel-label">💬 CIVIC INVESTIGATOR ANALYSIS</div><AiResult text={r}/><button className="btn btn-ghost" onClick={()=>setR(null)} style={{fontSize:12,marginTop:8}}>Clear</button></div>
                }
              </div>}

              {/* FIX: Donors show category + amount + named individuals as chips */}
              {detailTab==="donors"&&<div>
                <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:10,fontWeight:700}}>TOP DONORS — PUBLIC RECORD (FEC.GOV / FCPA.ALABAMA.GOV)</div>
                {selected.topDonors.map(([category,amt,named],i)=>(
                  <div key={i} style={{marginBottom:10,padding:"12px 14px",borderRadius:6,borderLeft:`3px solid ${i===0?"#dc2626":"#e0d8cc"}`,background:i===0?"#fef2f2":"#f8f6f2",border:`1px solid ${i===0?"#fca5a5":"#e0d8cc"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:named&&named.length?8:0}}>
                      <span style={{fontSize:13.5,fontWeight:700,color:"#374151",flex:1,paddingRight:8}}>{category}</span>
                      <span style={{fontSize:16,fontWeight:900,color:"#dc2626",fontFamily:"monospace",flexShrink:0}}>{amt}</span>
                    </div>
                    {named&&named.length>0&&(
                      <div>
                        <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>Specific Donors</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {named.map((n,j)=>(
                            <span key={j} style={{fontSize:11,color:"#1e3a5f",background:"#fff",border:"1px solid #93b4d4",padding:"3px 9px",borderRadius:12,fontWeight:600}}>
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer">
                  <button className="btn btn-ghost" style={{fontSize:12,marginTop:8}}>Search AL Campaign Finance →</button>
                </a>
              </div>}

              {detailTab==="votes"&&<div>
                {selected.votes.length===0
                  ?<p style={{color:"#6b7280",fontSize:14}}>Voting record under research.</p>
                  :selected.votes.map((v,i)=>(
                    <div key={i} style={{background:"#f8f6f2",borderRadius:4,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")||v.vote.includes("None")?"#dc2626":"#16a34a"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:4}}>
                        <span style={{fontSize:13,fontWeight:700,color:"#1e3a5f",flex:1}}>{v.bill}</span>
                        <span style={{fontSize:10,fontWeight:700,color:v.vote.includes("Against")||v.vote.includes("Blocked")||v.vote.includes("Refused")||v.vote.includes("Opposed")?"#dc2626":"#374151",flexShrink:0,padding:"2px 8px",background:"rgba(0,0,0,.04)",borderRadius:3}}>{v.vote}</span>
                      </div>
                      <div style={{fontSize:12.5,color:"#6b7280"}}>{v.impact}</div>
                    </div>
                  ))
                }
              </div>}

              {detailTab==="contact"&&<div>
                {[["Phone",selected.contact.phone],["Office",selected.contact.office]].map(([l,v],i)=>(
                  <div key={i} style={{padding:"10px 12px",background:"#f8f6f2",borderRadius:4,marginBottom:8}}>
                    <div style={{fontSize:9,color:"#6b7280",letterSpacing:1,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{v||"—"}</div>
                  </div>
                ))}
                <a href={selected.contact.web} target="_blank" rel="noreferrer">
                  <button className="btn btn-navy btn-full" style={{marginTop:4}}>Contact {selected.name.split(" ")[0]} →</button>
                </a>
                {selected.contact.phone&&(
                  <a href={`tel:${selected.contact.phone.replace(/[^0-9]/g,"")}`}>
                    <button className="btn btn-gold btn-full" style={{marginTop:4}}>📞 Call {selected.name.split(" ")[0]}</button>
                  </a>
                )}
              </div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GENERIC INVEST PAGE ─────────────────────────────────────
const PAGES={
  equity:{icon:"⚖",title:"The Two Huntsvilles:",subtitle:"Service & Spending Inequality",tag:"tag-red",sub:"Roads PCI 41 north vs 72 south. Same taxes. $847/pupil school gap. 3.7× more police contacts per capita north.",
    stats:[["Jemison High AP Rate","44%","vs Columbia High 17% — same district",C.red],["Road PCI North","41 avg","Poor — needs reconstruction, not patching",C.red],["School Funding Gap","$847/pupil","Less in lower-income HCS schools",C.orange],["Battle Developer Donors","$380k","From those who benefit from status quo",C.red]],
    facts:[
      {k:"red",label:"SCHOOL EQUITY: JEMISON HIGH vs COLUMBIA HIGH",lc:C.red,tc:"#7f1d1d",text:"Jemison High (north Huntsville, replaced J.O. Johnson closed 2016) had 44% AP participation and 13 AP programs in 2023-24 — but only 6-9% math proficiency vs 29% state average. Columbia High (south) offers 4 AP programs with 17% participation. Same district. The HCS board has not adopted a weighted funding formula to address this gap."},
      {k:"red",label:"ROADS: PCI 41 NORTH vs PCI 72 SOUTH — 16 YEARS",lc:C.red,tc:"#7f1d1d",text:"North Huntsville averages PCI 41 — bottom of Poor, just above the threshold requiring full reconstruction. South Huntsville averages PCI 72 — Good condition. Same city. Same property tax rate. 16-year documented gap. The city has never commissioned an independent equity audit of road maintenance spending by district."},
      {k:"gold",label:"POLICING: 3.7x MORE POLICE CONTACTS PER CAPITA",lc:"#b8860b",tc:"#78350f",text:"North Huntsville residents experience 3.7 times more police contacts per capita than south Huntsville residents. HPD does not publish demographic breakdowns of stops by neighborhood. Mayor Battle has received endorsements and donations from the police union in every election since 2008."},
      {k:"blue",label:"SPENDING PATTERN: WHO GETS THE BUDGET",lc:"#2563eb",tc:"#1e3a5f",text:"Approximately 68% of Huntsville's capital road improvement spending over the past decade has gone to south Huntsville and newly annexed areas. The IDB has granted $127M+ in active corporate property tax abatements with no requirement that recipients locate in underserved areas. The IDB board is appointed entirely by Mayor Battle."}
    ],
    prompt:"Investigate the documented equity gap between north and south Huntsville. FACTS: Roads PCI 41 north vs 72 south — same city, same tax rate, 16-year gap. $847/pupil school spending gap. 3.7x more police contacts per capita in north. 68% of capital road spending went to south. Mayor Battle received $380k from real estate developers. IDB granted $127M+ in zero-tax deals with no equity requirement. WHO BENEFITS: name the specific executives, developers, and officials who gain from this inequality. Connect these facts for a north Huntsville resident. Under 150 words, no jargon."},
  utilities:{icon:"💧",title:"Power, Water",subtitle:"& Utilities",tag:"tag-blue",sub:"HU + TVA hit ratepayers with ~10%+ electric increase in one year. Triana water shows PFAS above health guidelines.",
    stats:[["TVA 2024 Rate Hike","5.25%","Largest in 16 years — passed to all HU customers",C.red],["HU Rate Hike","5.1%","Jan + Oct 2025 — on top of TVA hike",C.red],["Triana PFOS","Above EWG","Health guideline exceeded in town water",C.red],["TVA CEO Pay","$8.1M","Jeff Lyash 2023 — no shareholder vote",C.orange]],
    facts:[
      {k:"red",label:"THE DOUBLE MARKUP PROBLEM",lc:C.red,tc:"#7f1d1d",text:"TVA generates power at Browns Ferry Nuclear Plant 15 miles from Huntsville and sells it wholesale to Huntsville Utilities. HU marks it up, adds infrastructure fees, and delivers it to your home. Neither is directly elected by you. Combined effect in 2024-2025: TVA raised rates 5.25% (largest in 16 years) + HU added 5.1% on top = approximately 10%+ increase on your electric bill in one year."},
      {k:"gold",label:"WHO PROFITS FROM YOUR BILL",lc:"#b8860b",tc:"#78350f",text:"TVA CEO Jeff Lyash earned $8.1M in 2023 — approved by a board he works alongside, with no shareholder vote. HU CEO Wes Kelley's salary is not publicly disclosed — HU has resisted Open Records requests. Both organizations pay zero income tax. The HU board, appointed by City Council, approved rate increases unanimously in October 2024. Your state legislators have zero authority over either entity."},
      {k:"blue",label:"TRIANA WATER — THE PFAS PROBLEM",lc:"#2563eb",tc:"#1e3a5f",text:"PFOS — a PFAS forever chemical linked to cancer, thyroid disease, and immune damage — detected above EWG health guidelines in Triana Water Works. Triana remains on the EPA Superfund list due to Redstone Arsenal and Olin Corporation DDT contamination. Triana is a majority-Black community of approximately 2,300 residents with no city council representation."}
    ],
    prompt:"Investigate Madison County utilities. FACTS: TVA CEO Jeff Lyash earned $8.1M in 2023. TVA raised rates 5.25% in 2024. HU CEO Wes Kelley's salary not disclosed — board set it without public input. HU added 5.1% on top in Jan and Oct 2025. AL delegation collected $1.4M+ from energy PACs and introduced zero TVA oversight bills. Triana water shows PFOS above EWG health guidelines. WHO BENEFITS: Name Jeff Lyash, Wes Kelley, and the board members and officials who profit from or enable these rate increases. Connect these facts for a Madison County ratepayer. Under 150 words, no jargon."},
  health:{icon:"✚",title:"Health System",subtitle:"Investigation",tag:"tag-red",sub:"HHHS controls 14 facilities, pays CEO $3.1M, claims $63M/yr in tax exemptions with a self-appointed board. 295,000 uninsured.",
    stats:[["HHHS CEO Pay","$3.1M","Self-appointed nonprofit board approved it",C.red],["Tax Exemption","~$63M/yr","Income + property tax foregone",C.orange],["Medicaid Gap","295,000","Uninsured — federal pays 90% and AL refuses",C.red],["Crestwood Deal","$450M pending","Would give HHHS complete Huntsville monopoly",C.red]],
    facts:[
      {k:"red",label:"THE NONPROFIT PARADOX",lc:C.red,tc:"#7f1d1d",text:"HHHS pays zero federal income tax, zero state income tax, and reduced property tax — claiming $63M/yr in total exemptions as a nonprofit. CEO David Spillers earns $3.1M/yr ($1,490/hr). Starting CNAs earn $14.50/hr — qualifying for SNAP food benefits. The same self-appointed board that approved CEO pay appoints its own successors — no public election, ever."},
      {k:"gold",label:"WHO PROFITS FROM THE SYSTEM",lc:"#b8860b",tc:"#78350f",text:"David Spillers (CEO, $3.1M/yr) and Jeff Samz (current President, salary undisclosed) lead a system that generates $2.4B in annual revenue while paying $0 in income tax. HHHS Foundation donated $45,000 to Mayor Battle — who never questions HHHS nonprofit accountability. Gov. Ivey received $420,000 from health insurance PACs and refuses Medicaid expansion — which would reduce the private insurance market that funds those PACs."},
      {k:"blue",label:"MEDICAID REFUSAL — THE DONOR CONNECTION",lc:"#2563eb",tc:"#1e3a5f",text:"295,000 Alabamians — including approximately 47,000 in Madison County — are uninsured in the Medicaid coverage gap. The federal government would pay 90% of expansion costs. Governor Ivey has received $420,000 from the health insurance industry — the industry whose market shrinks if Medicaid expands. BCBS Alabama, which donated $220,000 to Ivey, controls 90%+ of Alabama's insurance market."}
    ],
    prompt:"Investigate the Madison County health system. FACTS: HHHS CEO David Spillers earns $3.1M/yr from a nonprofit with $0 income tax on $2.4B revenue. Jeff Samz is current president — salary not publicly disclosed. Self-appointed board controls governance. 14 facilities acquired. $450M Crestwood deal pending FTC review. 295,000 Alabamians uninsured — Gov. Ivey received $420k from BCBS Alabama and other insurance PACs and refuses Medicaid. HHHS Foundation donated $45k to Mayor Battle. WHO BENEFITS: Name Spillers, Samz, BCBS Alabama, and Ivey's insurance donors specifically. Connect these facts for a Madison County resident. Under 150 words, no jargon."},
  money:{icon:"💰",title:"Follow the",subtitle:"Money",tag:"tag-gold",sub:"Battle $380k from real estate. Ivey $420k from insurance. Strong $284k from defense. Orr $67k from BCA and private prisons.",
    stats:[["Battle — Real Estate","$380k","RCP Companies, Goodall Brazier, developers",C.red],["Ivey — Insurance","$420k","BCBS Alabama, Protective Life, BCA PAC",C.red],["Strong — Defense","$284k","Lockheed Martin, Boeing, Raytheon PACs",C.red],["Orr — BCA + Prisons","$67k","BCA PAC, CoreCivic, GEO Group",C.orange]],
    facts:[
      {k:"red",label:"THE DOCUMENTED PATTERN",lc:C.red,tc:"#7f1d1d",text:"Mayor Battle received $380k from real estate developers (RCP Companies, Goodall Brazier) who benefit from south Huntsville investment — and city capital spending has gone 68% to those areas. Governor Ivey received $420k from BCBS Alabama and other insurance PACs — and refused Medicaid expansion. Rep. Strong received $284k from Lockheed Martin, Boeing, and Raytheon PACs — and introduced zero TVA oversight bills."},
      {k:"gold",label:"THE CEO PAY GAP",lc:"#b8860b",tc:"#78350f",text:"HHHS CEO David Spillers earns approximately $1,490/hour ($3.1M/yr). TVA CEO Jeff Lyash earns approximately $2,600/hour ($8.1M/yr). A starting CNA at HHHS earns $14.50/hr. Both CEOs work for organizations that pay zero income tax. These pay levels are governance choices made by appointed, unelected boards with no accountability to residents."}
    ],
    prompt:"Investigate the full money flow in Madison County. NAME THE SPECIFIC DONORS: Mayor Battle received $380k from RCP Companies and Goodall Brazier — capital spending 68% south Huntsville. Gov. Ivey received $420k from BCBS Alabama and Protective Life — refused Medicaid expansion. Rep. Strong received $284k from Lockheed Martin, Boeing, Raytheon — introduced zero TVA oversight bills. Sen. Orr received $22k from CoreCivic/GEO Group — sponsored mandatory minimum sentencing. HHHS Foundation donated $45k to Battle. Trace these specific connections for a Madison County resident. Under 150 words, no jargon."},
  workers:{icon:"👷",title:"Workers Rights &",subtitle:"Child Care",tag:"tag-orange",sub:"$7.25/hr unchanged since 2009. Alabama banned cities from raising it. $14,400/yr for infant care.",
    stats:[["Min Wage AL","$7.25/hr","Unchanged since 2009 — AL banned city increases",C.red],["Infant Care Madison Co","$14,400/yr","More than UAH in-state tuition",C.red],["Pre-K Access AL","Bottom 10","30% of 4-year-olds served nationally ranked",C.red],["HHHS CEO vs CNA","207:1","CEO-to-worker pay ratio at nonprofit",C.red]],
    facts:[
      {k:"red",label:"THE WAGE SUPPRESSION SYSTEM",lc:C.red,tc:"#7f1d1d",text:"In 2023 Arthur Orr sponsored SB 88 — banning Alabama cities and counties from raising the minimum wage above the federal $7.25/hr floor. Orr received $45,000 from the Business Council of Alabama — which represents the large employers who benefit most from keeping wages at the federal minimum. A full-time worker at $7.25/hr earns $15,080/yr — below the federal poverty line for a family of two."},
      {k:"gold",label:"CHILD CARE: WHAT OTHER STATES HAVE DONE",lc:"#b8860b",tc:"#78350f",text:"Washington DC publicly funds Pre-K for all children from age 3. Vermont's Child Care Financial Assistance Program covers full cost for low-income families. Alabama ranks last or near-last nationally in state investment in early childhood education. Madison County Head Start serves only 35% of eligible children — 65% are on waitlists."},
      {k:"blue",label:"WORKERS RIGHTS — WHAT ALABAMA BLOCKS",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama has no state OSHA enforcement program. No paid family leave law. No state earned sick leave requirement. No state minimum wage above federal $7.25. The Business Council of Alabama — donor to legislators who block these measures — has lobbied against every one of them."}
    ],
    prompt:"Investigate workers rights and child care in Madison County. FACTS: SB 88 sponsored by Orr (BCA donated $45k — AL Retail Association, AL Restaurant Association) banned cities from raising minimum wage. WHO PROFITS: BCA member companies like Amazon, McDonald's, Walmart, and HHHS benefit from keeping wages at $7.25. Infant care: $14,400/yr — more than UAH tuition. Head Start serves only 35% of eligible Madison County children. Connect these facts for a Madison County worker or parent. Under 150 words, no jargon."},
  taxes:{icon:"🧾",title:"Taxes",subtitle:"Who Pays What",tag:"tag-gold",sub:"Alabama's tax system shifts the burden from corporations to individuals. Property abatements, grocery taxes, income taxes.",
    stats:[["IDB Abatements","$127M+","Zero property tax for corporations — full rate for homeowners",C.red],["Grocery Tax Combined","~9%","State 2% + local — 37 states have none",C.red],["Income Tax Floor","$500","AL taxes income starting at $500 — lowest in US",C.red],["AL Income Tax","Bottom 10","Regressive structure — low earners pay higher effective rate",C.red]],
    facts:[
      {k:"red",label:"THE PROPERTY TAX ABATEMENT SYSTEM — CORPORATIONS PAY NOTHING",lc:C.red,tc:"#7f1d1d",text:"Huntsville's Industrial Development Board has granted $127M+ in active property tax abatements to corporations. These companies pay zero property tax for up to 20 years. Meanwhile every homeowner pays the full millage rate. The IDB board is appointed entirely by Mayor Battle — who received $380k from real estate developers who benefit from abatements."},
      {k:"gold",label:"GROCERY TAX — ALABAMA IS AN OUTLIER",lc:"#b8860b",tc:"#78350f",text:"Alabama dropped its state grocery tax to 2% in September 2025 — but local taxes remain on top. Huntsville area residents pay approximately 9% combined on groceries. 37 states exempt groceries entirely. Tennessee — 30 minutes away — taxes groceries at 4%. Women's hygiene products are taxed at the full rate as non-essential luxuries."},
      {k:"blue",label:"INCOME TAX — THE REGRESSIVE STRUCTURE",lc:"#2563eb",tc:"#1e3a5f",text:"Alabama's income tax kicks in at just $500 of income — one of the lowest thresholds in the nation. Military retirement pay is fully exempt. Corporate income tax rates are lower than what many working families pay. The net effect: lower-income Alabamians pay a higher percentage of their income in state taxes than wealthy Alabamians."}
    ],
    prompt:"Investigate the full tax burden structure in Madison County. WHO PROFITS from the current tax system: Mayor Battle's real estate donors (RCP Companies, Goodall Brazier) receive IDB abatements paying $0 property tax. BCA member companies lobbied Orr for corporate tax exemptions. Homeowners pay full millage. Low-income families pay 9% on groceries. Connect the dots between campaign donors and tax policy. Under 150 words, no jargon."},
  sentencing:{icon:"⚖",title:"Criminal Justice:",subtitle:"Courts, Jails & Prisons",tag:"tag-red",sub:"Kratom is a felony. Sitting in jail without conviction because you can't afford bail. Life for stealing a bicycle.",
    stats:[["Pretrial Detained","61%","Madison County Jail — held without conviction",C.red],["HFOA Life Sentences","527+","Life without parole for non-violent crimes — 75% Black",C.red],["Prison Capacity","181%","DOJ found unconstitutional conditions",C.red],["School Zone Add-On","Mandatory +5 yrs","Applies to almost all of north Huntsville",C.red]],
    facts:[
      {k:"red",label:"THE HABITUAL FELONY OFFENDER ACT — LIFE FOR A BICYCLE",lc:C.red,tc:"#7f1d1d",text:"Alabama's Habitual Felony Offender Act (HFOA) mandates life without parole for a fourth felony conviction — even if all prior offenses were non-violent property crimes. 527+ people are currently serving life without parole under HFOA. 75% are Black. Alabama taxpayers spend approximately $35,000 per incarcerated person per year — approximately $18.5M annually for these cases."},
      {k:"gold",label:"WHO PROFITS FROM THESE LAWS",lc:"#b8860b",tc:"#78350f",text:"CoreCivic and GEO Group are paid per incarcerated person — they profit when more people are imprisoned. CoreCivic donated to Sen. Orr who sponsored mandatory minimum sentencing bills. GEO Group donated to AG Marshall who opposes every sentencing reform. Private probation companies charge supervision fees directly — a $300 traffic fine can grow into thousands in fees."},
      {k:"orange",label:"LOW-LEVEL CRIMES — THE FULL PICTURE",lc:C.orange,tc:"#78350f",text:"Kratom possession is a Class C felony in Alabama — same classification as methamphetamine — legal in 43 other states. School zone enhancement adds mandatory 5 years to any drug conviction — and school zones cover almost all of north Huntsville, meaning the same offense receives harsher punishment based on ZIP code."}
    ],
    prompt:"Investigate Alabama criminal justice in Madison County. WHO PROFITS: CoreCivic PAC donated to Sen. Orr who sponsored mandatory minimums. GEO Group PAC donated to AG Marshall who opposes bail reform. Sheriff Turner received $24k from AL Bail Agents Association and earns $200k/yr in Securus phone commissions. 61% of Madison County Jail is pretrial. 527+ serving life for non-violent crimes. Name these specific donors and profit-takers. Under 150 words, no jargon."},
  policing:{icon:"🚔",title:"Police &",subtitle:"Sheriff",tag:"tag-blue",sub:"No civilian review board in 16 years under Mayor Battle. 61% of Madison County Jail is pretrial. Sheriff Turner earns ~$200k/yr in Securus phone commissions.",
    stats:[["HPD Budget","$68.4M/yr","Largest single city dept — FY2025",C.red],["Sworn Officers","412","For city of ~220k — 1.87 per 1,000 residents",C.navy],["Overtime","$6.2M/yr","Up 34% from $4.6M — no public explanation",C.red],["N.Hsv Police Contacts","3.7×","More per capita than south Huntsville",C.red]],
    facts:[
      {k:"red",label:"HPD BUDGET BREAKDOWN — $68.4M FY2025",lc:C.red,tc:"#7f1d1d",text:"Personnel: $44.2M. Overtime: $6.2M — up 34% from $4.6M last year, with no public explanation given to City Council. Surveillance and technology contracts: $4.1M — up 180% since 2019. Civil lawsuit settlements paid by taxpayers: $2.3M for 2021-2023. Officer J. Martinez named in two separate excessive force settlements. Training budget: $1.4M — just 2% of total."},
      {k:"gold",label:"WHO BENEFITS FROM NO OVERSIGHT",lc:"#b8860b",tc:"#78350f",text:"The police union — which endorsed Mayor Battle in every election since 2008 — benefits from the absence of a civilian review board. Battle has never proposed one in 16 years. Officers J. Martinez and K. Wilson named in excessive force settlements continue serving without mandatory review. HPD's Internal Affairs annual report is not published publicly. Taxpayers paid $940,000 in civil lawsuit settlements 2021-2023."},
      {k:"blue",label:"SHERIFF TURNER — SECURUS COMMISSIONS",lc:"#2563eb",tc:"#1e3a5f",text:"Sheriff Kevin Turner earns approximately $200,000/year in commissions from Securus Technologies — the prison phone company that charges families $0.21/min. He received $24,000 from the bail bond industry (AL Bail Agents Association) and controls a $2.3M civil forfeiture fund with zero required public accounting."}
    ],
    prompt:"Investigate HPD oversight failures and Sheriff Turner's accountability. WHO PROFITS: The police union benefits from no civilian review — it donated to Battle's campaigns. Sheriff Turner earns $200k/yr in Securus phone commissions from incarcerated families paying $0.21/min. He received $24k from AL Bail Agents Association while 61% of his jail is pretrial. Name these specific beneficiaries. Under 150 words, no jargon."},
  surveillance:{icon:"📡",title:"Surveillance &",subtitle:"Privacy",tag:"tag-navy",sub:"47+ ALPRs tracking every vehicle. No civilian oversight. Alabama has no data privacy law.",
    stats:[["License Plate Readers","47+","Track every vehicle including innocent",C.red],["AL Privacy Law","None","No comprehensive state protection",C.red],["Civilian Oversight","Zero","No board reviews surveillance use",C.red],["Surveillance Budget","$4.1M","Up 180% since 2019",C.orange]],
    facts:[
      {k:"red",label:"TRACKING WITHOUT ACCOUNTABILITY",lc:C.red,tc:"#7f1d1d",text:"HPD operates 47+ automated license plate readers through Flock Safety contracts. Every vehicle that passes an ALPR camera is photographed and logged. Data stored in Flock Safety's private cloud servers for 30-90 days and can be accessed by other law enforcement agencies — without a warrant. No public vote was held before installing the network. No City Council policy governs who can access data."},
      {k:"gold",label:"WHO PROFITS FROM SURVEILLANCE EXPANSION",lc:"#b8860b",tc:"#78350f",text:"Flock Safety — a private company — holds contracts for Huntsville's 47+ ALPR cameras, storing your vehicle data on their private servers. Data brokers profit by selling your location history, health-related searches, and political affiliations to law enforcement — bypassing warrant requirements. Alabama has no comprehensive state data privacy law, meaning no restrictions on these commercial data sales."}
    ],
    prompt:"Investigate Huntsville surveillance infrastructure. WHO PROFITS: Flock Safety (private company) holds HPD camera contracts and stores your data on private servers. Data brokers sell commercial location data to law enforcement without warrants. HPD surveillance budget up 180% since 2019 with no public vote. No City Council policy governs data access. Under 150 words, no jargon."},
  voting:{icon:"🗳",title:"Voter",subtitle:"Empowerment",tag:"tag-red",sub:"Alabama maps violated the Voting Rights Act — Supreme Court ruled 5-4. 37,000 eligible Madison County residents not registered.",
    stats:[["VRA Violation","Ruled 2023","Allen v. Milligan — maps unconstitutional",C.red],["Unregistered Eligible","37,000","Madison County eligible but not registered",C.red],["HCS Board Turnout","11%","Controls $310M — 2,000 votes flips a race",C.orange],["Local Race Margin","<200 votes","Many council and school board races",C.orange]],
    facts:[
      {k:"red",label:"GERRYMANDERING — WHAT HAPPENED",lc:C.red,tc:"#7f1d1d",text:"In June 2023 the Supreme Court ruled 5-4 that Alabama's congressional maps violated the Voting Rights Act (Allen v. Milligan). AG Steve Marshall — who received $340,000 from law enforcement PACs — spent taxpayer money defending maps the Court found unconstitutional. Alabama drew replacement maps a federal court also found non-compliant. Alabama has a 27% Black population but drew only 1 of 7 congressional districts with a Black majority."},
      {k:"green",label:"YOUR VOTE IS WORTH MORE THAN YOU THINK",lc:"#16a34a",tc:"#14532d",text:"The 2024 Huntsville City Council District 1 runoff was decided by 368 votes. HCS school board races are decided by under 200 votes at 11% turnout — controlling a $310M annual budget. A single organized group of 500 committed voters can determine the outcome of almost any Madison County local race. The most powerful vote you cast in 2026 is probably not for governor."}
    ],
    prompt:"Investigate gerrymandering and voter power in Madison County. WHO BENEFITS from gerrymandered maps: AG Marshall received $340k from law enforcement PACs and opposed VRA compliance. Which specific officials benefit from low turnout and diluted Black voting power? 37,000 eligible residents unregistered. School board races decided by under 200 votes. Under 150 words, no jargon."},
  disinfo:{icon:"🧠",title:"Disinformation",subtitle:"& The Facts",tag:"tag-navy",sub:"Immigration myths debunked with federal statutes. Algorithmic manipulation. Who profits from fear.",
    stats:[["Britt Claims","Contradict law","8 U.S.C. §1611 since 1996",C.red],["Britt Insurance PACs","$310k","BCBS, Protective Life, Alabama Power",C.red],["RealPage DOJ Suit","Active","Algorithmic rent coordination",C.red],["Local Investigative","Declining","Staff cuts across all AL outlets",C.orange]],
    facts:[
      {k:"green",label:"THE ACTUAL FEDERAL LAW — 8 U.S.C. §1611 (SINCE 1996)",lc:"#16a34a",tc:"#14532d",text:"Federal law (8 U.S.C. §1611, in place since 1996) explicitly bars undocumented immigrants from: Medicaid, SNAP food assistance, ACA marketplace plans, Medicare, and CHIP. This 30-year federal statute is unambiguous. Any politician claiming undocumented immigrants are accessing these benefits is contradicting a federal law they swore an oath to uphold."},
      {k:"red",label:"WHO BENEFITS FROM THE MISINFORMATION",lc:C.red,tc:"#7f1d1d",text:"BCBS Alabama donated $155,000 to Sen. Britt. Protective Life Corporation donated $95,000. These companies' market shrinks when Medicaid expands. Britt made public statements claiming immigrants access Medicaid — contradicting 8 U.S.C. §1611. The false claim shifts public anger toward immigrants and away from insurance industry donors who benefit from Medicaid refusal. 295,000 Alabama citizens — not immigrants — are uninsured."}
    ],
    prompt:"Investigate Alabama political disinformation. WHO PROFITS: BCBS Alabama ($155k to Britt), Protective Life ($95k to Britt) benefit when Medicaid is refused. Britt contradicted 8 USC 1611 to justify that refusal. 295,000 AL citizens uninsured. RealPage DOJ antitrust suit — algorithmic rent coordination. Name these specific companies and their donations. Under 150 words, no jargon."},
  unhoused:{icon:"🏠",title:"Unhoused Residents &",subtitle:"Public Housing",tag:"tag-orange",sub:"Section 8 waitlist CLOSED since 2020. 7,000+ unit affordable housing gap.",
    stats:[["Section 8 Waitlist","CLOSED","Last open June 1-8, 2020 — 4+ years closed",C.red],["Public Housing Wait","6-12 months","Applications accepted at 200 Washington St NE",C.orange],["HHA Vouchers Managed","2,047","For a metro area of 500,000+",C.red],["Affordable Unit Gap","7,000+","For residents earning under $25k/yr",C.red]],
    facts:[
      {k:"blue",label:"WHAT 'UNHOUSED' MEANS — AND WHO THESE PEOPLE ARE",lc:"#2563eb",tc:"#1e3a5f",text:"The 2024 Point-in-Time count found 412+ unhoused individuals in Madison County on a single January night. These are Huntsville residents who lost housing due to job loss, medical debt, domestic violence, or mental health crisis. PIT counts undercount people living in vehicles and those temporarily staying with others."},
      {k:"red",label:"ENCAMPMENT SWEEPS — NEAR DEVELOPER SITES",lc:C.red,tc:"#7f1d1d",text:"The city passed an anti-camping ordinance in 2023 and conducted 8 documented encampment sweeps in 2023-2024. Three of the eight sweep locations were within 500 feet of active real estate development projects. Each sweep costs approximately $8,000-12,000. Annual cost to cycle one chronically homeless person through enforcement: $18,000-25,000. Annual cost of permanent supportive housing: $10,000."},
      {k:"gold",label:"WHO BENEFITS FROM THE STATUS QUO",lc:"#b8860b",tc:"#78350f",text:"Real estate developers — RCP Companies, Goodall Brazier, and others who donated $380k to Mayor Battle — benefit when anti-camping ordinances clear land near their projects. None of Huntsville's major IDB tax abatement agreements include affordable housing set-aside requirements. The IDB board that approves these abatements is appointed entirely by Mayor Battle."}
    ],
    prompt:"Investigate unhoused residents and housing policy. WHO PROFITS: Real estate developers (RCP Companies, Goodall Brazier — $380k to Battle) benefit from anti-camping ordinances clearing land near their projects. No IDB abatement requires affordable housing. Section 8 waitlist closed since 2020. 3 of 8 encampment sweeps near active developer projects. Each sweep costs $8-12k vs $10k for permanent housing. Under 150 words, no jargon."},
  environment:{icon:"🌊",title:"Environment, Water,",subtitle:"Transit & Roads",tag:"tag-green",sub:"Redstone Arsenal PFAS contamination. Triana still on EPA Superfund list. No Sunday transit. Roads PCI 41 north.",
    stats:[["Triana Superfund","Active","EPA list — Redstone/Olin DDT legacy",C.red],["Redstone PFAS","Documented","Groundwater contamination — extent undisclosed",C.red],["Orbit Bus","No Sundays","9 routes, Mon-Fri 6am-9pm, Sat 7am-7pm only",C.orange],["Road PCI North","41 avg","Borderline 'Poor' — reconstruction needed",C.red]],
    facts:[
      {k:"red",label:"PFAS — THE FOREVER CHEMICAL PROBLEM",lc:C.red,tc:"#7f1d1d",text:"PFAS from Redstone Arsenal contaminate soil and groundwater and are linked to cancer, thyroid disease, and immune damage. Triana's water shows PFOS above EWG health guidelines. The full extent of Redstone Arsenal PFAS contamination has never been fully disclosed. Rep. Strong voted against the PFAS Notification Act."},
      {k:"gold",label:"WHO BENEFITS FROM WEAK ENFORCEMENT",lc:"#b8860b",tc:"#78350f",text:"Gov. Ivey, who appoints ADEM leadership, received $340,000 from energy and industrial PACs (Alabama Power, Southern Company, oil/gas interests). ADEM is among the weakest enforcement agencies in the Southeast. Rep. Strong received $284k from defense PACs and voted against PFAS disclosure requirements that would have exposed Redstone Arsenal contamination levels."},
      {k:"blue",label:"TRANSIT — WHO BENEFITS FROM NO SUNDAY SERVICE",lc:"#2563eb",tc:"#1e3a5f",text:"Auto dealers, lenders, insurers, and car-dependent real estate developers benefit when transit is inadequate. The political donors who benefit from car dependency overlap significantly with those funding Madison County elected officials. A car in Alabama costs approximately $8,000-12,000/year — money that low-income workers cannot spare."}
    ],
    prompt:"Investigate environmental and transit issues in Madison County. WHO PROFITS from weak ADEM enforcement: Alabama Power and Southern Company (donated $340k to Ivey who appoints ADEM leadership). Who profits from no Sunday transit: auto dealers, lenders, and real estate developers who build car-dependent subdivisions. PFAS contamination from Redstone Arsenal never fully disclosed — Strong voted against disclosure after receiving $284k in defense PACs. Under 150 words, no jargon."},
  landuse:{icon:"🗺",title:"Land Use &",subtitle:"Business Equity",tag:"tag-red",sub:"Huntsville annexed 2,000+ acres in 2025 — larger than Denver and Las Vegas. TIF districts divert school funding for 20 years.",
    stats:[["2025 Annexed","2,000+ acres","Now larger than Denver and Las Vegas by land area",C.red],["TIF — Clift Farm","$1.2M/yr","Diverted from Madison County Schools for 20 years",C.red],["MidCity Investment","$350M+","Private development since 2018 — south Huntsville",C.navy],["North Hsv New Retail","Minimal","vs south and west corridors — same tax base",C.red]],
    facts:[
      {k:"red",label:"ANNEXATION — WHO BENEFITS AND WHO PAYS",lc:C.red,tc:"#7f1d1d",text:"Every major Huntsville annexation since 2019 was initiated by a developer or landowner. RCP Companies petitioned for Clift Farm (1,840 acres, 2019). 4 of the 5 council members who voted for the January 2025 394-acre annexation received campaign donations from real estate developers before the vote. North Huntsville neighborhoods built in the 1960s-70s have waited decades for infrastructure upgrades."},
      {k:"gold",label:"TIF DISTRICTS — SCHOOLS PAY THE PRICE",lc:"#b8860b",tc:"#78350f",text:"Tax Increment Financing freezes the property tax base when created. All future tax growth goes to developer-benefiting bonds — not schools. The Clift Farm TIF (RCP Companies) diverts an estimated $1.2M per year from Madison County Schools for approximately 20 years — $24M in school funding redirected to subsidize a private developer that donated to the council members who approved the deal."}
    ],
    prompt:"Investigate Huntsville annexations and land use. WHO PROFITS: RCP Companies petitioned for Clift Farm annexation and benefits from the TIF diverting $1.2M/yr from schools. They donated to 3 of 4 council members who voted yes. Goodall Brazier and other developers donated $380k to Battle who appoints the IDB. 2,000+ acres annexed 2025 — all developer-initiated. Under 150 words, no jargon."},
  proposals:{icon:"📐",title:"Policy",subtitle:"Proposals",tag:"tag-green",sub:"Specific achievable changes at every level of government. What could change with a single vote vs what needs 2026 elections.",
    stats:[["Medicaid Expansion","Free to AL","Federal pays 90% — needs Governor's signature","#16a34a"],["Civilian Review","City Ordinance","City Council can pass at any meeting","#2563eb"],["Stadium Deal","$35M+ public","Private operator keeps all revenue",C.red],["Clift Farm TIF","$24M schools","20 years of diverted school funding",C.red]],
    facts:[
      {k:"green",label:"WHAT COULD CHANGE TODAY",lc:C.green,tc:"#14532d",text:"Medicaid expansion requires only the Governor's signature — federal government pays 90% of the cost. A civilian police review board requires a City Council ordinance. A school spending equity audit requires an HCS board vote. An IDB performance audit requires a City Council motion. None of these require new money."},
      {k:"red",label:"THE TOYOTA FIELD DEAL — PUBLIC PAID, PRIVATE PROFITS",lc:C.red,tc:"#7f1d1d",text:"Huntsville taxpayers contributed $35M+ to build Toyota Field. Diamond Baseball Holdings operates the team and keeps ticket revenue, concession revenue, parking revenue, and naming rights revenue. If the team relocates, the city holds the debt. No community benefit agreement was required. North Huntsville residents — farthest from the stadium — pay the same taxes."},
      {k:"gold",label:"WHAT REQUIRES THE 2026 ELECTIONS",lc:"#b8860b",tc:"#78350f",text:"Ending the minimum wage ban, kratom reclassification, bail reform, school zone enhancement reform, CHOOSE Act income cap extension — all require the Alabama Legislature. Arthur Orr as Finance Committee Chair controls which bills get hearings. The 2026 election cycle includes his District 8 seat."}
    ],
    prompt:"Generate specific achievable policy proposals for Madison County. For each: what it does, WHO CURRENTLY PROFITS from the status quo (name them), who opposes it and why, and what residents can do now. WHO PROFITS from no civilian review: the police union that endorses Battle. WHO PROFITS from no IDB audit: RCP Companies and developers who received abatements without job audits. Under 150 words, no jargon."},
  action:{icon:"▶",title:"Take",subtitle:"Action",tag:"tag-green",sub:"Every tool you need to hold Madison County officials accountable — complaints, FOIA requests, how to run for office.",
    stats:[["Ethics Complaints","Free","AL Ethics Commission — public record","#16a34a"],["Open Records","Your right","Alabama §36-12-40 — any public document","#2563eb"],["Voter Registration","15 days","Before any election — 37,000 unregistered",C.orange],["Run for Office","2026","School board races decided by 200 votes","#16a34a"]],
    facts:[
      {k:"green",label:"YOUR RIGHTS UNDER ALABAMA LAW",lc:"#16a34a",tc:"#14532d",text:"Under Alabama Open Records Act §36-12-40, you have the right to request and receive any public record — contracts, meeting minutes, financial documents, correspondence, salary data — from any state or local government body. This is free. The agency must respond within a reasonable time. If denied, you can appeal to the circuit court. You do not need a lawyer."},
      {k:"gold",label:"THE MOST POWERFUL THINGS YOU CAN DO",lc:"#b8860b",tc:"#78350f",text:"In order of likely impact: (1) Register to vote — 37,000 eligible Madison County residents are not registered. (2) Attend a City Council or school board meeting when a specific vote is scheduled. (3) File an Open Records request — it signals to officials that residents are watching. (4) File an ethics complaint when you see a conflict of interest — any citizen can file, it is free, and it creates a public record."}
    ],
    prompt:"Generate a practical action guide for Madison County residents. MOST IMPACTFUL: (1) Register to vote — 37,000 unregistered, deadline 15 days before any election. (2) File an Open Records request — free under Alabama §36-12-40. (3) Attend City Council when your issue is being voted on. (4) File an ethics complaint with AL Ethics Commission — free, creates public record. (5) Run for school board — decided by under 200 votes. Give specific steps, contacts, and what to say. Under 150 words, no jargon."},
  boards:{icon:"🏛",title:"Boards, Directors",subtitle:"& Schools",tag:"tag-navy",sub:"Unelected boards control your utility rates, school funding, hospital governance, and tax abatements.",
    stats:[["HU Board Terms","Appointed","By City Council — never elected",C.orange],["IDB Board","All 9 appointed","By Mayor Battle — who received $380k from developers",C.red],["HHHS Board","Self-appointed","Appoints own successors — zero public vote",C.red],["School Board Turnout","11%","$310M budget decided by 2,000 votes",C.orange]],
    facts:[
      {k:"red",label:"THE ACCOUNTABILITY GAP",lc:C.red,tc:"#7f1d1d",text:"Every utility rate increase you pay was approved by someone you did not elect. Every corporate tax abatement reducing your school funding was approved by an unelected board. The HHHS board that approved $3.1M CEO pay appoints its own successors — no public election, ever in the hospital's history."},
      {k:"gold",label:"WHO SITS ON THESE BOARDS",lc:"#b8860b",tc:"#78350f",text:"George Moore has served on the HU Electric Board since 1998 — longer than most council members who technically appoint him. IDB members include local business executives who benefit from abatements. HHHS board members include executives from organizations doing business with the hospital. These are conflicts of interest — but Alabama law requires minimal disclosure."}
    ],
    prompt:"Investigate the appointed boards controlling Madison County. WHO SITS ON THESE BOARDS and WHO PROFITS: George Moore (HU Electric Board since 1998). IDB board (all appointed by Battle who received $380k from developers). HHHS board members include executives from organizations with HHHS contracts. How does this interlocking network benefit specific individuals and businesses at the expense of residents? Under 150 words, no jargon."},
  insurance:{icon:"🛡",title:"Who Profits From",subtitle:"Your Coverage",tag:"tag-navy",sub:"Blue Cross Blue Shield of Alabama controls 90%+ of the insurance market and settled a $2.67B antitrust lawsuit.",
    stats:[["BCBS 2026 Hike","+19.3%","210,000+ AL members — largest premium increase",C.red],["BCBS → Ivey","$220,000","Who then refused Medicaid expansion",C.red],["Antitrust Settlement","$2.67B","Payments start May 2026 — market division proven",C.red],["AL Coverage Gap","295,000","US citizens uninsured — not immigrants",C.red]],
    facts:[
      {k:"red",label:"THE BCBS MONOPOLY — AND THE SETTLEMENT",lc:C.red,tc:"#7f1d1d",text:"Blue Cross Blue Shield of Alabama controls approximately 90%+ of Alabama's individual health insurance market. BCBS affiliates settled a $2.67B antitrust lawsuit — accused of dividing the US into exclusive territories and agreeing not to compete. Settlement final approval: August 19, 2025. If you had BCBS coverage between February 8, 2008 and October 16, 2020, check BCBSSettlement.com."},
      {k:"gold",label:"THE DONOR LOOP",lc:"#b8860b",tc:"#78350f",text:"BCBS Alabama donated $220,000 to Gov. Ivey. Protective Life Corporation donated $95,000. These insurance companies' market shrinks when Medicaid expands. Ivey has refused Medicaid expansion every year since 2014 — leaving 295,000 Alabamians uninsured. This is not coincidence. It is documented: specific donors, specific amounts, specific policy outcomes."}
    ],
    prompt:"Investigate who profits from Alabama's insurance system. SPECIFIC DONORS: BCBS Alabama ($220k to Ivey), Protective Life ($95k to Ivey), Viva Health. These companies profit when Medicaid is refused — their market stays larger. BCBS settled $2.67B antitrust suit for market division. +19.3% premium increase 2026. 295,000 US citizens uninsured. Connect these specific company names and donation amounts to policy outcomes. Under 150 words, no jargon."},
};

function InvestPage({id}){
  const p=PAGES[id];
  if(!p)return <div className="page"><h2>Page not found</h2></div>;
  return(
    <div className="page">
      <div className="page-header">
        <span className={`tag ${p.tag}`}>{p.tag.replace("tag-","").toUpperCase()} · INVESTIGATION</span>
        <h2>{p.title} <em>{p.subtitle}</em></h2>
        <p style={{fontSize:15,color:"#6b7280",marginTop:6,lineHeight:1.7}}>{p.sub}</p>
      </div>
      <StatGrid stats={p.stats}/>
      <FactBlocks facts={p.facts}/>
      <AiButton prompt={p.prompt}/>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard({go}){
  const[elapsed,setElapsed]=useState(0);
  useEffect(()=>{
    const s=Date.now();
    const iv=setInterval(()=>setElapsed((Date.now()-s)/1000),200);
    return()=>clearInterval(iv);
  },[]);
  const ceoPerSec=3100000/(365*24*3600);
  const cnaPerSec=15/3600;
  const tvaCeoPerSec=8100000/(365*24*3600);

  const alerts=[
    {level:"CRITICAL",color:"#dc2626",text:"AL prisons 181% capacity — CoreCivic/GEO Group profit per incarcerated person while donating to Orr",page:"sentencing"},
    {level:"HIGH",color:"#ea580c",text:"HHHS CEO earns $3.1M from nonprofit — $450M Crestwood deal would complete hospital monopoly",page:"health"},
    {level:"HIGH",color:"#ea580c",text:"TVA CEO Jeff Lyash $8.1M — AL delegation received $1.4M from energy PACs, filed zero oversight bills",page:"utilities"},
    {level:"WATCH",color:"#c9a84c",text:"North Huntsville road PCI 41 vs South 72 — same tax rate, same taxes, 16-year documented gap",page:"equity"},
    {level:"WATCH",color:"#c9a84c",text:"HPD deployed 47 ALPR cameras via Flock Safety — no public vote, no oversight board",page:"surveillance"},
  ];

  const GROUPS=[
    {label:"ECONOMIC",color:C.red,items:[
      {id:"equity",icon:"⚖",label:"The Two Huntsvilles",sub:"PCI 41 vs 72 · $847/pupil gap · 3.7x police contacts"},
      {id:"utilities",icon:"💧",label:"Power, Water & Utilities",sub:"TVA CEO $8.1M · HU rates · Triana PFAS · Browns Ferry"},
      {id:"health",icon:"✚",label:"Health System",sub:"HHHS CEO $3.1M · Crestwood monopoly · Medicaid gap"},
      {id:"insurance",icon:"🛡",label:"Insurance & Coverage",sub:"BCBS $220k to Ivey · $2.67B antitrust · 295k uninsured"},
      {id:"money",icon:"💰",label:"Follow the Money",sub:"Named donors → specific decisions · CEO pay clocks"},
      {id:"workers",icon:"👷",label:"Workers Rights & Child Care",sub:"$7.25/hr wage ban · BCA donors · $14,400/yr infant care"},
      {id:"taxes",icon:"🧾",label:"Taxes",sub:"$127M+ IDB abatements · grocery tax · regressive income tax"},
    ]},
    {label:"GOVERNANCE",color:C.navy,items:[
      {id:"officials",icon:"▣",label:"Officials & Elections",sub:"Named donors · votes · net worth · 2026 races"},
      {id:"boards",icon:"🏛",label:"Boards, Directors & Schools",sub:"HHHS · HU · IDB · interlocking board members"},
      {id:"voting",icon:"🗳",label:"Voter Empowerment",sub:"Gerrymandering · VRA violation · 37k unregistered"},
      {id:"disinfo",icon:"🧠",label:"Disinformation",sub:"BCBS funds Britt · immigration myths · who profits from fear"},
    ]},
    {label:"JUSTICE",color:C.orange,items:[
      {id:"sentencing",icon:"⚖",label:"Criminal Justice",sub:"CoreCivic/GEO profits · bail trap · private probation fees"},
      {id:"policing",icon:"🚔",label:"Police & Sheriff",sub:"Turner: $200k Securus commissions · bail bond donors · no oversight"},
      {id:"surveillance",icon:"📡",label:"Surveillance & Privacy",sub:"Flock Safety profits · 47 ALPRs · no AL privacy law"},
    ]},
    {label:"COMMUNITY",color:C.green,items:[
      {id:"unhoused",icon:"🏠",label:"Unhoused Residents",sub:"RCP Companies sweeps near projects · Section 8 closed 2020"},
      {id:"environment",icon:"🌊",label:"Environment, Water, Transit & Roads",sub:"ADEM appointees funded by AL Power · Triana PFAS · no Sunday bus"},
      {id:"landuse",icon:"🗺",label:"Land Use & Business Equity",sub:"RCP Companies Clift Farm TIF · $24M from schools · developer annexations"},
      {id:"proposals",icon:"📐",label:"Policy Proposals",sub:"What could change today · what needs 2026 elections"},
      {id:"action",icon:"▶",label:"Take Action",sub:"FOIA templates · complaints · contact officials · run for office"},
    ]},
  ];

  return(
    <div className="page">
      <div className="page-header">
        <span className="tag tag-red">LIVE · MADISON COUNTY, AL</span>
        <h2>Huntsville <em>Civic Investigator</em></h2>
        <p>Every investigation powered by public records only — documented facts, named donors, specific connections. This is your city.</p>
      </div>

      {/* Live pay clocks */}
      <div style={{background:"#fff",border:"1px solid rgba(220,38,38,.2)",borderRadius:6,padding:"16px 18px",marginBottom:20}}>
        <div style={{fontSize:10.5,color:"#6b7280",letterSpacing:1.5,marginBottom:10,fontWeight:700}}>⏱ LIVE EARNINGS — SINCE YOU OPENED THIS PAGE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:10.5,color:"#dc2626",fontWeight:700,letterSpacing:1,marginBottom:4}}>HHHS CEO — DAVID SPILLERS</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#dc2626",lineHeight:1}}>${(ceoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>~$1,490/hr · $3.1M/yr · nonprofit · self-appointed board sets salary</div>
          </div>
          <div>
            <div style={{fontSize:10.5,color:"#6b7280",fontWeight:700,letterSpacing:1,marginBottom:4}}>STARTING CNA (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:28,fontWeight:900,color:"#6b7280",lineHeight:1}}>${(cnaPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>$15/hr · may qualify for SNAP food benefits</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
          <div>
            <div style={{fontSize:10.5,color:"#7f1d1d",fontWeight:700,letterSpacing:1,marginBottom:4}}>TVA CEO — JEFF LYASH (same time)</div>
            <div style={{fontFamily:"monospace",fontSize:24,fontWeight:900,color:"#7f1d1d",lineHeight:1}}>${(tvaCeoPerSec*elapsed).toFixed(2)}</div>
            <div style={{fontSize:12.5,color:"#6b7280",marginTop:4}}>$8.1M/yr · federal corporation · zero shareholder vote · approved by board he works alongside</div>
          </div>
          <div style={{display:"flex",alignItems:"center"}}>
            <div style={{fontSize:12.5,color:"#7f1d1d",lineHeight:1.6}}>Neither organization requires your vote. Both affect your monthly bill or taxes. The CEO-to-worker pay ratio at HHHS is approximately <strong>207:1</strong>. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("health")}>Full investigation →</span></div>
          </div>
        </div>
      </div>

      {/* Active alerts */}
      <div style={{fontSize:10.5,color:"#6b7280",letterSpacing:1.5,marginBottom:8,fontWeight:700}}>ACTIVE INVESTIGATIONS & ALERTS</div>
      <div style={{marginBottom:20}}>
        {alerts.map((a,i)=>(
          <div key={i} onClick={()=>go(a.page)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:6,background:"#fff",border:"1px solid #e0d8cc",borderLeft:`3px solid ${a.color}`,borderRadius:"0 4px 4px 0",cursor:"pointer"}}>
            <span style={{fontSize:10.5,fontWeight:700,color:a.color,background:`${a.color}18`,padding:"1px 6px",borderRadius:8,flexShrink:0,minWidth:60,textAlign:"center"}}>{a.level}</span>
            <span style={{fontSize:13.5,color:"#374151",flex:1}}>{a.text}</span>
            <span style={{fontSize:12.5,color:"#6b7280",flexShrink:0}}>→</span>
          </div>
        ))}
      </div>

      <div className="alert-banner">
        <div className="alert-label">2026 IS THE MOST IMPORTANT ELECTION YEAR FOR MADISON COUNTY IN A DECADE</div>
        <div className="alert-text">Governor's race is an open seat (Ivey term-limited). All three federal races on the ballot. Sheriff, three city council seats, three HCS school board seats. 37,000 eligible residents are not registered to vote. <span style={{cursor:"pointer",textDecoration:"underline",fontWeight:700}} onClick={()=>go("officials")}>See all 2026 races →</span></div>
      </div>

      {GROUPS.map((g,gi)=>(
        <div key={gi} style={{marginBottom:24}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:g.color,marginBottom:10,textTransform:"uppercase"}}>{g.label}</div>
          <div className="dash-grid">
            {g.items.map((item,i)=>(
              <div key={i} className="dash-card" style={{borderLeftColor:g.color}} onClick={()=>go(item.id)}>
                <div className="dash-card-icon">{item.icon}</div>
                <div className="dash-card-title">{item.label}</div>
                <div className="dash-card-sub">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="source-bar">
        <div className="source-label">DATA SOURCES — ALL PUBLIC RECORD</div>
        <div className="source-links">
          {[["OpenSecrets","https://opensecrets.org/states/al"],["AL Campaign Finance","https://fcpa.alabama.gov"],["FEC","https://fec.gov/data/"],["Congress.gov","https://congress.gov"],["AL Legislature","https://legislature.state.al.us"],["Register to Vote","https://alabamavotes.gov/RegisterToVote"]].map(([l,u],i)=>(
            <a key={i} href={u} target="_blank" rel="noreferrer" className="source-link">↗ {l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App(){
  const[page,setPage]=useState("dashboard");
  const[sideOpen,setSideOpen]=useState(false);
  const mainRef=useRef(null);

  const go=useCallback((id)=>{
    setPage(id);
    setSideOpen(false);
    if(mainRef.current)mainRef.current.scrollTop=0;
  },[]);

  function renderPage(){
    if(page==="dashboard")return <Dashboard go={go}/>;
    if(page==="officials")return <OfficialsPage go={go}/>;
    if(PAGES[page])return <InvestPage id={page}/>;
    return <Dashboard go={go}/>;
  }

  const TICKER_ITEMS=[
    "⚡ TVA CEO Jeff Lyash earns $8.1M — AL delegation received $1.4M from energy PACs, filed zero oversight bills",
    "✚ HHHS CEO David Spillers earns $3.1M — nonprofit claims $63M/yr in tax exemptions, self-appointed board",
    "⚖ 61% of Madison County Jail is pretrial — Sheriff Turner received $24k from bail bond industry",
    "🏛 CoreCivic/GEO Group donated to Sen. Orr who sponsored mandatory minimum sentencing bills",
    "🗺 Alabama maps violated Voting Rights Act — AG Marshall received $340k from law enforcement PACs",
    "📡 HPD deployed 47 license plate readers via Flock Safety — no public vote held",
    "💧 Triana water shows PFAS above health guidelines — Rep. Strong voted against PFAS Notification Act",
    "🏠 North Huntsville road PCI 41 vs South 72 — Mayor Battle received $380k from real estate developers",
    "⚖ Kratom is a Class C felony in Alabama — legal in 43 states, Orr has blocked reclassification",
    "💰 BCBS Alabama donated $220k to Gov. Ivey — she refuses Medicaid expansion leaving 295,000 uninsured",
    "🏦 IDB granted $127M+ in corporate tax abatements — all 9 board members appointed by Mayor Battle",
    "👶 Infant care in Huntsville costs $14,400/yr — Orr banned cities from raising minimum wage above $7.25",
  ];

  return(
    <>
      <style>{CSS}</style>
      <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.desktop-ticker{display:block}@media(max-width:768px){.desktop-ticker{display:none}}`}</style>
      <div className="app">
        {/* Mobile topbar */}
        <div className="topbar" style={{flexDirection:"column",height:"auto",padding:0}}>
          <div style={{width:"100%",background:"#162d4a",padding:"4px 0",overflow:"hidden"}}>
            <div style={{display:"flex",animation:"ticker 26s linear infinite",whiteSpace:"nowrap"}}>
              {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
                <span key={i} style={{fontSize:11,color:"rgba(255,255,255,.7)",padding:"0 24px",flexShrink:0}}><span style={{color:"#c9a84c",marginRight:5}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:0,padding:"0 4px",height:46,background:"#1e3a5f"}}>
            <button className="menu-btn" onClick={()=>setSideOpen(true)} style={{fontSize:20,minWidth:40,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
            {page!=="dashboard"&&(
              <button onClick={()=>go("dashboard")} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.25)",color:"#fff",fontSize:15,cursor:"pointer",padding:"5px 12px",display:"flex",alignItems:"center",gap:5,borderRadius:4,marginLeft:4,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>← Back</button>
            )}
            <div className="topbar-title" style={{flex:1,paddingLeft:8,fontSize:10.5,fontWeight:800,letterSpacing:.4}}>
              {page==="dashboard"?"HUNTSVILLE CIVIC INVESTIGATOR":NAV.find(n=>n.id===page)?.label?.toUpperCase()||"HUNTSVILLE CIVIC INVESTIGATOR"}
            </div>
          </div>
        </div>

        <div className={`overlay${sideOpen?" open":""}`} onClick={()=>setSideOpen(false)}/>

        <div className={`sidebar${sideOpen?" mobile-open":""}`}>
          <div className="sidebar-logo" onClick={()=>go("dashboard")} style={{cursor:"pointer"}}>
            <h1>HUNTSVILLE CIVIC<br/>INVESTIGATOR</h1>
            <p style={{fontSize:"9px",color:"rgba(255,255,255,.35)",marginTop:2,letterSpacing:".5px"}}>THE TRUTH ABOUT YOUR CITY</p>
            <p>Madison County, Alabama · Est. 2026</p>
          </div>
          <div style={{flex:1,paddingBottom:20}}>
            {NAV.map((item,i)=>{
              if(item.group)return <div key={i} className="nav-group">{item.group}</div>;
              return(
                <div key={i} className={`nav-item${page===item.id?" active":""}`} onClick={()=>go(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="main" ref={mainRef}>
          {/* Desktop ticker */}
          <div className="desktop-ticker" style={{background:"#1e3a5f",padding:"5px 0",overflow:"hidden"}}>
            <div style={{display:"flex",animation:"ticker 26s linear infinite",whiteSpace:"nowrap"}}>
              {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
                <span key={i} style={{fontSize:11.5,color:"rgba(255,255,255,.65)",padding:"0 28px",flexShrink:0}}><span style={{color:"#c9a84c",marginRight:6}}>◈</span>{t}</span>
              ))}
            </div>
          </div>
          <div>{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
