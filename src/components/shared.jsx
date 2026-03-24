import React,{useState} from "react";
import { C } from "../config/theme";
import { callAI } from "../lib/ai";
import { PAGES } from "../data/pages";

function Spin(){return <span className="spin"/>;}

function AiResult({text}){
  if(!text) return null;
  const paragraphs=text.split(/\n+/).filter(p=>p.trim().length>10);
  const n=paragraphs.length;
  // Middle labels cycle; last paragraph is always WHAT YOU CAN DO
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

function FactBlock({f,i}){
  const[open,setOpen]=useState(false);
  const PREVIEW=220;
  const long=f.text&&f.text.length>PREVIEW;
  return(
    <div key={i} className={"fact fact-"+f.k} style={{cursor:long?"pointer":"default"}} onClick={()=>long&&setOpen(o=>!o)}>
      <div className="fact-label" style={{color:f.lc}}>{f.label}</div>
      <div className="fact-text" style={{color:f.tc}}>
        {long&&!open?f.text.slice(0,PREVIEW)+"...":f.text}
      </div>
      {long&&(
        <div style={{fontSize:11,fontWeight:700,color:f.lc,marginTop:7,letterSpacing:.3,display:"inline-block",padding:"4px 0"}}>
          {open?"▲ Show less":"▼ Read full explanation"}
        </div>
      )}
    </div>
  );
}

function FactBlocks({facts}){
  return facts.map((f,i)=><FactBlock key={i} f={f} i={i}/>);
}

// --- EXPANDABLE TEXT COMPONENT ---
function ExpandText({text,preview=180,style={}}){
  const[open,setOpen]=useState(false);
  if(!text)return null;
  const long=text.length>preview;
  function toggle(e){e.stopPropagation();setOpen(o=>!o);}
  if(!long)return<span style={style}>{text}</span>;
  return(
    <span>
      <span style={style}>{open?text:text.slice(0,preview)}</span>
      <button onClick={toggle} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:"#c9a84c",marginLeft:6,padding:"2px 4px",fontFamily:"inherit",borderRadius:3,display:"inline-block"}}>
        {open?"▲ Show less":"▼ Read more"}
      </button>
    </span>
  );
}

// --- ACTION BUTTONS COMPONENT ---
function ActionButtons({actions,title}){
  const[copied,setCopied]=useState({});
  function cp(k,t){navigator.clipboard.writeText(t).then(()=>{setCopied(p=>({...p,[k]:true}));setTimeout(()=>setCopied(p=>({...p,[k]:false})),2500);});}
  return(
    <div style={{marginTop:10}}>
      {title&&<div style={{fontSize:9,fontWeight:800,color:"#16a34a",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {(actions||[]).map((a,i)=>(
          a.href
            ? <a key={i} href={a.href} target="_blank" rel="noreferrer"><button className="btn btn-navy" style={{fontSize:11.5}}>→ {a.label}</button></a>
            : a.tel
            ? <a key={i} href={`tel:${a.tel}`}><button className="btn btn-gold" style={{fontSize:11.5}}>📞 {a.label}</button></a>
            : a.email
            ? <a key={i} href={`mailto:${a.email}?subject=${encodeURIComponent(a.subject||"")}&body=${encodeURIComponent(a.body||"")}`}><button className="btn btn-ghost" style={{fontSize:11.5}}>✉ {a.label}</button></a>
            : <button key={i} className="btn btn-ghost" style={{fontSize:11.5}} onClick={()=>cp("a"+i,a.copy||"")}>{copied["a"+i]?"✓ Copied":a.label}</button>
        ))}
      </div>
    </div>
  );
}

// --- INVESTIGATION PAGE (generic) ---
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

// --- EQUITY PAGE — THE TWO HUNTSVILLES ---


export { Spin, AiResult, AiButton, StatGrid, FactBlock, FactBlocks, ExpandText, ActionButtons, InvestPage };
