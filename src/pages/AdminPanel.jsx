import { useState, useEffect, useRef } from "react";
import { supabase } from '../lib/supabase';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

const ADMIN_PASSWORD = "hsv2026";

// Module prefix map for ref numbers
const MODULE_PREFIX = {
  "Health System": "HS", "Housing": "HO", "Criminal Justice": "CJ",
  "Utilities": "UT", "Workers": "WK", "Taxes": "TX", "Officials": "OF",
  "Environment": "EN", "Unhoused": "UH", "Annexation": "AN",
  "Transit": "TR", "Education": "ED", "Insurance": "IN", "Policing": "PO",
  "Boards": "BO", "Voting": "VT", "Data": "DA", "Money": "MO",
  "Land": "LA", "Information": "IW", "Proposals": "PR", "Action": "AC"
};

function getPrefix(module) {
  if (!module) return "XX";
  const key = Object.keys(MODULE_PREFIX).find(k => module.toLowerCase().includes(k.toLowerCase()));
  return key ? MODULE_PREFIX[key] : module.substring(0, 2).toUpperCase();
}

const RESEARCH_TEMPLATE = `Now take everything we just researched and format it using the template below.
Use only verified information. Write UNKNOWN for anything not found.
Produce as many ISSUE CARD and STAT BLOCK entries as the research supports.

ISSUE CARDS
-----------
--- ISSUE CARD START ---
MODULE: [Housing / Criminal Justice / Health System / Transit / Utilities / Education / Workers / Taxes / Officials / Environment / Unhoused / Annexation]
LABEL: [2-4 word category tag]
TITLE: [specific headline — what happened and who did it]
SUMMARY: [2-3 sentences. Plain language. What is the problem, who is responsible, why does it matter.]
DETAILS: [Full paragraph. Context, history, dollar amounts, dates, vote records, contract numbers.]
SOURCES:
- [Source 1 — URL or document name and date]
- [Source 2]

--- DECODER ---
WHATS HAPPENING: [Core contradiction in 2-3 plain sentences.]
CONNECTIONS: [Use their own public statements, slogans, social posts, votes, and donations against them. Format: They said X. They did Y. Name officials, amounts, dates. Include deliberate actions and things done behind closed doors if documented.]
WHO BENEFITS: [Named people only — officials, developers, CEOs, companies, boards. No vague categories.]
IMPACT: [Who is harmed, which neighborhoods, what they lose, dollar amounts where known.]

--- ACTIONS ---
CONTACTS:
- Name: [full name and title]
- Phone: [number or UNKNOWN]
- Email: [email or UNKNOWN]
- Address: [street address or UNKNOWN]
- Office Hours: [hours or UNKNOWN]

MEETINGS:
- Body: [board, council, or committee name]
- Next Meeting: [date, time, location or UNKNOWN]
- How to Speak: [public comment instructions or UNKNOWN]

RECORDS REQUEST:
- What to Request: [specific documents, emails, contracts]
- Where to Send It: [office name, address, email]
- Applies: [YES / NO]

COMPLAINT:
- Agency: [name]
- Link or Address: [url or address]
- Applies: [YES / NO]

INVESTIGATION REQUEST:
- Body: [oversight agency name]
- Link or Address: [url or address]
- Applies: [YES / NO]

MISCONDUCT REPORT:
- Body: [internal affairs, inspector general, DOJ, etc.]
- Link or Address: [url or address]
- Applies: [YES / NO]

ELECTIONS:
- Official: [name]
- Next Election: [date or UNKNOWN]
- District: [district or UNKNOWN]
- Voter Registration Link: [url]
- Applies: [YES / NO]

MEDIA OUTREACH:
- Outlet 1: WAFF 48, Tip Email: news@waff.com
- Outlet 2: WAAY 31, Tip Email: newsroom@waaytv.com
- Outlet 3: WHNT 19, Tip Email: Online at whnt.com/contact
- Outlet 4: AL.com, Tip Email: news@al.com
- Outlet 5: WZDX 54, Tip Email: Online at rocketcitynow.com/contact-us
- Applies: YES

EMAIL TEMPLATE:
- To: [official email]
- Subject: [specific to this issue]
- Body: [resident voice, requests specific action]
--- ISSUE CARD END ---

STAT BLOCKS
-----------
--- STAT BLOCK START ---
MODULE: [module name]
TAB: [tab name]
TYPE: [key-number / comparison-bar / pie-chart / trend-line / bar-chart / pay-clock / zone-map]
COLOR: [red / gold / purple / green / blue]

IF TYPE = key-number:
VALUE: [e.g. $380k]
LABEL: [2-5 word label]
CONTEXT: [one line]

IF TYPE = comparison-bar:
TITLE: [what is being compared]
LEFT LABEL: [e.g. North Huntsville]
LEFT VALUE: [number]
RIGHT LABEL: [e.g. South Huntsville]
RIGHT VALUE: [number]
UNIT: [PCI Score / % / $ / etc.]
CONTEXT: [one line]
NOTE: [optional]

IF TYPE = pie-chart:
TITLE: [what the pie represents]
SLICES:
  - [Label]: [percentage]%
CONTEXT: [one line]

IF TYPE = trend-line:
TITLE: [what is trending]
POINTS: [YEAR:VALUE, YEAR:VALUE ...]
UNIT: [$ / % / count]
CONTEXT: [one line]

IF TYPE = bar-chart:
TITLE: [what is being measured]
BARS:
  - [Category]: [value]
UNIT: [% / $ / count]
CONTEXT: [one line]

IF TYPE = pay-clock:
LABEL: [CEO name and title]
ANNUAL AMOUNT: [number in dollars, no commas]
CONTEXT: [one line contrast]

IF TYPE = zone-map:
TITLE: [what the map shows]
ZONES:
  - [Neighborhood]: [value] [GOOD/FAIR/POOR/CRITICAL]
UNIT: [what values represent]
CONTEXT: [one line]
--- STAT BLOCK END ---`;

const COLOR_MAP = { red:"#c0392b", gold:"#b8860b", purple:"#6c3483", green:"#1e8449", blue:"#1a5276" };
const COLOR_BG  = { red:"#2a0a0a", gold:"#2a1f00", purple:"#1a0a2a", green:"#0a1f0a", blue:"#0a1520" };

function KeyNumberBlock({ block }) {
  const c = COLOR_MAP[block.color] || "#b8860b";
  const bg = COLOR_BG[block.color] || "#2a1f00";
  return (
    <div style={{ background: bg, border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: c, fontSize: 38, fontWeight: 900, fontFamily: "Georgia,serif", lineHeight: 1 }}>{block.value}</div>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{block.label}</div>
      <div style={{ color: "#aaa", fontSize: 12, marginTop: 5, lineHeight: 1.5 }}>{block.context}</div>
    </div>
  );
}

function ComparisonBar({ block }) {
  const total = (block.leftValue || 0) + (block.rightValue || 0);
  const leftPct = total > 0 ? ((block.leftValue / total) * 100).toFixed(0) : 50;
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #3a4268", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{block.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#c0392b", fontSize: 20, fontWeight: 900 }}>{block.leftValue} <span style={{ fontSize: 11, color: "#888" }}>{block.unit}</span></span>
        <span style={{ color: "#aaa", fontSize: 20, fontWeight: 900 }}>{block.rightValue} <span style={{ fontSize: 11, color: "#888" }}>{block.unit}</span></span>
      </div>
      <div style={{ background: "#2a3040", borderRadius: 4, height: 22, display: "flex", overflow: "hidden", marginBottom: 8 }}>
        <div style={{ width: leftPct + "%", background: "linear-gradient(90deg,#c0392b,#e74c3c)", transition: "width 0.8s" }} />
        <div style={{ flex: 1, background: "#3a4a6a" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#c0392b", fontSize: 11, fontWeight: 700 }}>{block.leftLabel}</span>
        <span style={{ color: "#7ab", fontSize: 11, fontWeight: 700 }}>{block.rightLabel}</span>
      </div>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 10, borderTop: "1px solid #2a3040", paddingTop: 8 }}>{block.context}</div>}
    </div>
  );
}

function PieBlock({ block }) {
  const COLORS = ["#c0392b","#b8860b","#6c3483","#1e8449","#1a5276","#e67e22","#16a085"];
  const data = block.slices || [];
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #3a4268", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{block.title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" fontSize={10}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={v => v + "%"} contentStyle={{ background: "#1a1f2e", border: "1px solid #3a4268", color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 8, borderTop: "1px solid #2a3040", paddingTop: 8 }}>{block.context}</div>}
    </div>
  );
}

function TrendBlock({ block }) {
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #3a4268", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{block.title}</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={block.points || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3040" />
          <XAxis dataKey="year" stroke="#556" tick={{ fill: "#889", fontSize: 11 }} />
          <YAxis stroke="#556" tick={{ fill: "#889", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1a1f2e", border: "1px solid #3a4268", color: "#fff" }} />
          <Line type="monotone" dataKey="value" stroke="#c0392b" strokeWidth={2} dot={{ fill: "#c0392b", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 8, borderTop: "1px solid #2a3040", paddingTop: 8 }}>{block.context}</div>}
    </div>
  );
}

function BarBlock({ block }) {
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #3a4268", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{block.title}</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={block.bars || []} layout="vertical">
          <XAxis type="number" stroke="#556" tick={{ fill: "#889", fontSize: 10 }} />
          <YAxis type="category" dataKey="name" stroke="#556" tick={{ fill: "#ccc", fontSize: 10 }} width={120} />
          <Tooltip contentStyle={{ background: "#1a1f2e", border: "1px solid #3a4268", color: "#fff" }} />
          <Bar dataKey="value" fill="#b8860b" radius={[0,3,3,0]} />
        </BarChart>
      </ResponsiveContainer>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 8, borderTop: "1px solid #2a3040", paddingTop: 8 }}>{block.context}</div>}
    </div>
  );
}

function PayClockBlock({ block }) {
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - start.current) / 1000), 100);
    return () => clearInterval(id);
  }, []);
  const perSec = (block.annualAmount || 0) / (365.25 * 24 * 3600);
  const earned = (perSec * elapsed).toFixed(2);
  const [whole, cents] = earned.split(".");
  return (
    <div style={{ background: "#1a0a0a", border: "1px solid #5c1a1a", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#c0392b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Live Pay Clock</div>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{block.label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span style={{ color: "#c0392b", fontSize: 14, fontWeight: 700 }}>$</span>
        <span style={{ color: "#c0392b", fontSize: 42, fontWeight: 900, lineHeight: 1, fontFamily: "Georgia,serif" }}>{parseInt(whole).toLocaleString()}</span>
        <span style={{ color: "#c0392b", fontSize: 22, fontWeight: 700 }}>.{cents}</span>
      </div>
      <div style={{ color: "#556", fontSize: 11, marginTop: 4 }}>earned since you opened this page</div>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 10, borderTop: "1px solid #3a1a1a", paddingTop: 8 }}>{block.context}</div>}
    </div>
  );
}

const STATUS_COLORS = { GOOD:"#1e8449", FAIR:"#b8860b", POOR:"#c0392b", CRITICAL:"#7b241c" };

function ZoneMapBlock({ block }) {
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #3a4268", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{block.title}</div>
      {block.unit && <div style={{ color: "#556", fontSize: 11, marginBottom: 14 }}>Measured in: {block.unit}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(block.zones || []).map((z, i) => {
          const c = STATUS_COLORS[z.status] || "#888";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />
              <div style={{ flex: 1, color: "#ccc", fontSize: 13 }}>{z.name}</div>
              <div style={{ color: c, fontSize: 13, fontWeight: 700 }}>{z.value}</div>
              <div style={{ background: c+"33", color: c, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>{z.status}</div>
            </div>
          );
        })}
      </div>
      {block.context && <div style={{ color: "#889", fontSize: 11, marginTop: 12, borderTop: "1px solid #2a3040", paddingTop: 10 }}>{block.context}</div>}
    </div>
  );
}

function StatBlockPreview({ block }) {
  switch (block.type) {
    case "key-number":     return <KeyNumberBlock block={block} />;
    case "comparison-bar": return <ComparisonBar block={block} />;
    case "pie-chart":      return <PieBlock block={block} />;
    case "trend-line":     return <TrendBlock block={block} />;
    case "bar-chart":      return <BarBlock block={block} />;
    case "pay-clock":      return <PayClockBlock block={block} />;
    case "zone-map":       return <ZoneMapBlock block={block} />;
    default: return <div style={{ color: "#556", padding: 16 }}>Unknown type: {block.type}</div>;
  }
}

function ActionBadges({ actions }) {
  if (!actions) return null;
  const badges = [];
  if (actions.contacts?.length) badges.push({ l:"Contacts", c:"#1a5276" });
  if (actions.meetings?.length) badges.push({ l:"Meetings", c:"#1a5c2a" });
  if (actions.recordsRequest?.applies) badges.push({ l:"Records Request", c:"#7a5c00" });
  if (actions.complaint?.applies) badges.push({ l:"Complaint", c:"#8b1a1a" });
  if (actions.investigationRequest?.applies) badges.push({ l:"Investigation", c:"#8b1a1a" });
  if (actions.misconductReport?.applies) badges.push({ l:"Misconduct", c:"#8b1a1a" });
  if (actions.elections?.length) badges.push({ l:"Elections", c:"#3a1a6c" });
  if (actions.mediaOutreach?.applies) badges.push({ l:"Media", c:"#4a1a5c" });
  if (actions.emailTemplate) badges.push({ l:"Email", c:"#1a5c2a" });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
      {badges.map(b => <span key={b.l} style={{ background: b.c, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 3, textTransform: "uppercase" }}>{b.l}</span>)}
    </div>
  );
}

function IssueCardMini({ card }) {
  return (
    <div style={{ background: "#f5f0e8", border: "1px solid #ddd8cf", borderRadius: 8, padding: 20 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <span style={{ background: "#b8860b", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 3, textTransform: "uppercase" }}>{card.label}</span>
        <span style={{ background: "#e8e4dc", color: "#555", fontSize: 11, padding: "3px 9px", borderRadius: 3 }}>{card.module}</span>
      </div>
      <div style={{ color: "#1a1a1a", fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{card.title}</div>
      <div style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>{card.summary}</div>
      {card.decoder?.whatsHappening && (
        <div style={{ marginTop: 14, borderLeft: "3px solid #b8860b", paddingLeft: 12 }}>
          <div style={{ color: "#b8860b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>What's Happening</div>
          <div style={{ color: "#444", fontSize: 13, lineHeight: 1.5 }}>{card.decoder.whatsHappening}</div>
        </div>
      )}
      <ActionBadges actions={card.actions} />
    </div>
  );
}

function ConfirmIssueModal({ card, onConfirm, onCancel, publishing }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, width:"100%", maxWidth:580, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #ddd8cf" }}>
          <div style={{ color:"#1a7a3a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Confirm Publish</div>
          <div style={{ color:"#1a1a1a", fontSize:18, fontWeight:700 }}>This issue will go live on HSV Civic Watch</div>
          <div style={{ color:"#888", fontSize:13, marginTop:4 }}>Review before confirming.</div>
        </div>
        <div style={{ padding:22 }}><IssueCardMini card={card} /></div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700 }}>Cancel</button>
          <button onClick={onConfirm} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1 }}>
            {publishing ? "Going Live..." : "Confirm & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmStatModal({ card: block, issueCardsForModule, onConfirm, onCancel, publishing }) {
  const [linkedRef, setLinkedRef] = useState(issueCardsForModule?.[0]?.ref_number || "");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, width:"100%", maxWidth:520, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #ddd8cf" }}>
          <div style={{ color:"#1a7a3a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Confirm Publish</div>
          <div style={{ color:"#1a1a1a", fontSize:18, fontWeight:700 }}>This visual will go live on HSV Civic Watch</div>
          <div style={{ color:"#888", fontSize:13, marginTop:4 }}>{block.module} — {block.tab} — {block.type}</div>
          {issueCardsForModule?.length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ color:"#555", fontSize:13, fontWeight:600, marginBottom:6 }}>Link to Issue Card:</div>
              <select value={linkedRef} onChange={e => setLinkedRef(e.target.value)}
                style={{ width:"100%", background:"#fff", border:"1px solid #ddd8cf", borderRadius:4, padding:"10px 12px", fontSize:13, color:"#1a1a1a", outline:"none" }}>
                <option value="">No link (module-level only)</option>
                {issueCardsForModule.map(ic => (
                  <option key={ic.ref_number} value={ic.ref_number}>{ic.ref_number} — {ic.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div style={{ padding:22 }}><StatBlockPreview block={block} /></div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700 }}>Cancel</button>
          <button onClick={() => onConfirm(linkedRef)} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1 }}>
            {publishing ? "Going Live..." : "Confirm & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkConfirmModal({ issueCards, statBlocks, onConfirm, onCancel, publishing }) {
  const total = issueCards.length + statBlocks.length;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, width:"100%", maxWidth:520, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #ddd8cf" }}>
          <div style={{ color:"#1a7a3a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Confirm Bulk Publish</div>
          <div style={{ color:"#1a1a1a", fontSize:18, fontWeight:700 }}>{total} item{total !== 1 ? "s" : ""} going live</div>
        </div>
        <div style={{ padding:22, maxHeight:340, overflowY:"auto" }}>
          {issueCards.map((c,i) => (
            <div key={"ic"+i} style={{ padding:"12px 16px", background:"#fff", border:"1px solid #ddd8cf", borderRadius:6, marginBottom:10, display:"flex", gap:12 }}>
              <span style={{ color:"#1a7a3a", fontSize:20, flexShrink:0 }}>&#10003;</span>
              <div>
                <div style={{ color:"#b8860b", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>Issue Card</div>
                <div style={{ color:"#1a1a1a", fontSize:15, fontWeight:700 }}>{c.title}</div>
                <div style={{ color:"#888", fontSize:13 }}>{c.module}</div>
              </div>
            </div>
          ))}
          {statBlocks.map((b,i) => (
            <div key={"sb"+i} style={{ padding:"12px 16px", background:"#fff", border:"1px solid #ddd8cf", borderRadius:6, marginBottom:10, display:"flex", gap:12 }}>
              <span style={{ color:"#1a5276", fontSize:20, flexShrink:0 }}>&#9670;</span>
              <div>
                <div style={{ color:"#1a5276", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>Stat Block — {b.type}</div>
                <div style={{ color:"#1a1a1a", fontSize:15, fontWeight:700 }}>{b.label || b.title}</div>
                <div style={{ color:"#888", fontSize:13 }}>{b.module} — {b.tab}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700 }}>Cancel</button>
          <button onClick={onConfirm} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1 }}>
            {publishing ? "Going Live..." : "Confirm & Publish All"}
          </button>
        </div>
      </div>
    </div>
  );
}

function IssueRow({ card, selected, onToggle, onApprove, onReject }) {
  return (
    <div style={{ background:selected?"#fef9ec":"#f5f0e8", border:"2px solid "+(selected?"#b8860b":"#ddd8cf"), borderRadius:10, marginBottom:14, overflow:"hidden", transition:"all 0.15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px" }}>
        <input type="checkbox" checked={selected} onChange={onToggle} style={{ width:20, height:20, accentColor:"#b8860b", cursor:"pointer", flexShrink:0 }} />
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <span style={{ background:"#b8860b", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:3, textTransform:"uppercase" }}>{card.label}</span>
          <span style={{ background:"#e8e4dc", color:"#555", fontSize:11, padding:"3px 9px", borderRadius:3 }}>{card.module}</span>
        </div>
        <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, flex:1, lineHeight:1.3 }}>{card.title}</div>
        <button onClick={onApprove} style={{ width:46, height:46, borderRadius:"50%", background:"#e8f5ed", border:"2px solid #1a7a3a", color:"#1a7a3a", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>&#10003;</button>
        <button onClick={onReject} style={{ width:46, height:46, borderRadius:"50%", background:"#fef2f2", border:"2px solid #b91c1c", color:"#b91c1c", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>&#10005;</button>
      </div>
      <div style={{ padding:"0 22px 18px 64px", color:"#555", fontSize:14, lineHeight:1.6 }}>
        {card.summary}
        <ActionBadges actions={card.actions} />
      </div>
    </div>
  );
}

function StatRow({ block, selected, onToggle, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const labels = { "key-number":"Key Number","comparison-bar":"Comparison Bar","pie-chart":"Pie Chart","trend-line":"Trend Line","bar-chart":"Bar Chart","pay-clock":"Pay Clock","zone-map":"Zone Map" };
  return (
    <div style={{ background:selected?"#fef9ec":"#f5f0e8", border:"2px solid "+(selected?"#b8860b":"#ddd8cf"), borderRadius:10, marginBottom:14, overflow:"hidden", transition:"all 0.15s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px" }}>
        <input type="checkbox" checked={selected} onChange={onToggle} style={{ width:20, height:20, accentColor:"#b8860b", cursor:"pointer", flexShrink:0 }} />
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <span style={{ background:"#1a5276", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:3, textTransform:"uppercase" }}>{labels[block.type] || block.type}</span>
          <span style={{ background:"#e8e4dc", color:"#555", fontSize:11, padding:"3px 9px", borderRadius:3 }}>{block.module}</span>
        </div>
        <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, flex:1 }}>{block.label || block.title}</div>
        <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:"7px 14px", fontSize:13, cursor:"pointer", flexShrink:0, fontWeight:600 }}>{expanded?"Hide":"Preview"}</button>
        <button onClick={onApprove} style={{ width:46, height:46, borderRadius:"50%", background:"#e8f5ed", border:"2px solid #1a7a3a", color:"#1a7a3a", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>&#10003;</button>
        <button onClick={onReject} style={{ width:46, height:46, borderRadius:"50%", background:"#fef2f2", border:"2px solid #b91c1c", color:"#b91c1c", fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>&#10005;</button>
      </div>
      <div style={{ padding:"0 22px 12px 64px", color:"#777", fontSize:13 }}>{block.tab} tab — {block.context}</div>
      {expanded && <div style={{ padding:"0 22px 22px" }}><StatBlockPreview block={block} /></div>}
    </div>
  );
}

// Published tab components
function PublishedIssueCard({ card, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:12, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px" }}>
        <span style={{ background:"#2e3440", color:"#b8860b", fontSize:12, fontWeight:900, padding:"4px 10px", borderRadius:4, fontFamily:"monospace", flexShrink:0 }}>{card.ref_number}</span>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          <span style={{ background:"#b8860b", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, textTransform:"uppercase" }}>{card.label}</span>
        </div>
        <div style={{ color:"#1a1a1a", fontSize:15, fontWeight:700, flex:1, lineHeight:1.3 }}>{card.title}</div>
        <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>{expanded ? "Hide" : "Details"}</button>
        <button onClick={() => onDelete(card)} style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:700, flexShrink:0 }}>Delete</button>
      </div>
      {expanded && (
        <div style={{ padding:"0 20px 18px", borderTop:"1px solid #e8e4dc" }}>
          <div style={{ color:"#555", fontSize:13, lineHeight:1.6, marginTop:14 }}>{card.summary}</div>
        </div>
      )}
    </div>
  );
}

function PublishedStatBlock({ block, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = block.strength_score >= 8 ? "#1a7a3a" : block.strength_score >= 5 ? "#b8860b" : "#888";
  return (
    <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:12, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px" }}>
        <span style={{ background:"#2e3440", color:"#7ab", fontSize:12, fontWeight:900, padding:"4px 10px", borderRadius:4, fontFamily:"monospace", flexShrink:0 }}>{block.ref_number}</span>
        <div style={{ display:"flex", gap:6, flexShrink:0, alignItems:"center" }}>
          <span style={{ background:"#1a5276", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, textTransform:"uppercase" }}>{block.type}</span>
          {block.issue_card_ref && (
            <span style={{ background:"#fef9ec", color:"#b8860b", border:"1px solid #b8860b", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3 }}>&#8594; {block.issue_card_ref}</span>
          )}
          {block.strength_score && (
            <span style={{ background: scoreColor+"22", color: scoreColor, border:`1px solid ${scoreColor}`, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3 }}>&#9733; {block.strength_score}/10</span>
          )}
        </div>
        <div style={{ color:"#1a1a1a", fontSize:15, fontWeight:700, flex:1 }}>{block.label || block.title}</div>
        <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>{expanded ? "Hide" : "Preview"}</button>
        <button onClick={() => onDelete(block)} style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:700, flexShrink:0 }}>Delete</button>
      </div>
      {expanded && <div style={{ padding:"0 20px 20px" }}><StatBlockPreview block={block.data || block} /></div>}
    </div>
  );
}

function PublishedTab({ pubIssues, pubStats, onDeleteIssue, onDeleteStat }) {
  const [section, setSection] = useState("issues");

  // Group by module
  const issuesByModule = {};
  pubIssues.forEach(c => {
    const m = c.module || "Unknown";
    if (!issuesByModule[m]) issuesByModule[m] = [];
    issuesByModule[m].push(c);
  });

  const statsByModule = {};
  pubStats.forEach(b => {
    const m = b.module || "Unknown";
    if (!statsByModule[m]) statsByModule[m] = [];
    statsByModule[m].push(b);
  });

  const secBtn = (id, label, count) => ({
    background: section === id ? "#2e3440" : "#e8e4dc",
    color: section === id ? "#b8860b" : "#555",
    border: section === id ? "2px solid #b8860b" : "2px solid #ddd8cf",
    borderRadius: 6, padding: "10px 22px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", textTransform: "uppercase", letterSpacing: 1
  });

  return (
    <div>
      <h2 style={{ color:"#f5f0e8", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Published</h2>
      <p style={{ color:"#aaa", fontSize:15, margin:"0 0 24px" }}>{pubIssues.length} issue card(s) · {pubStats.length} stat block(s) live</p>

      <div style={{ display:"flex", gap:12, marginBottom:28 }}>
        <button style={secBtn("issues")} onClick={() => setSection("issues")}>
          Issue Cards ({pubIssues.length})
        </button>
        <button style={secBtn("stats")} onClick={() => setSection("stats")}>
          Stat Blocks ({pubStats.length})
        </button>
      </div>

      {section === "issues" && (
        <div>
          {Object.keys(issuesByModule).length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#aaa" }}>
              <div style={{ fontSize:40, marginBottom:16 }}>&#9670;</div>
              <div style={{ fontSize:16 }}>No issue cards published yet.</div>
            </div>
          )}
          {Object.entries(issuesByModule).map(([module, cards]) => (
            <div key={module} style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, paddingBottom:10, borderBottom:"2px solid #4a5268" }}>
                <span style={{ background:"#b8860b", color:"#fff", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:4, textTransform:"uppercase", letterSpacing:1 }}>{module}</span>
                <span style={{ color:"#aaa", fontSize:13 }}>{cards.length} card{cards.length !== 1 ? "s" : ""}</span>
              </div>
              {cards.map((card, i) => <PublishedIssueCard key={card.id || i} card={card} onDelete={onDeleteIssue} />)}
            </div>
          ))}
        </div>
      )}

      {section === "stats" && (
        <div>
          {Object.keys(statsByModule).length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#aaa" }}>
              <div style={{ fontSize:40, marginBottom:16 }}>&#9670;</div>
              <div style={{ fontSize:16 }}>No stat blocks published yet.</div>
            </div>
          )}
          {Object.entries(statsByModule).map(([module, blocks]) => (
            <div key={module} style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, paddingBottom:10, borderBottom:"2px solid #4a5268" }}>
                <span style={{ background:"#1a5276", color:"#fff", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:4, textTransform:"uppercase", letterSpacing:1 }}>{module}</span>
                <span style={{ color:"#aaa", fontSize:13 }}>{blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
              </div>
              {[...blocks].sort((a,b) => (b.strength_score||0)-(a.strength_score||0)).map((block, i) => (
                <PublishedStatBlock key={block.id || i} block={block} onDelete={onDeleteStat} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");
  const [rawPaste, setRawPaste] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [pendingIssues, setPendingIssues] = useState([]);
  const [pendingStats, setPendingStats] = useState([]);
  const [selIssues, setSelIssues] = useState([]);
  const [selStats, setSelStats] = useState([]);
  const [draftIssues, setDraftIssues] = useState([]);
  const [draftStats, setDraftStats] = useState([]);
  const [pubIssues, setPubIssues] = useState([]);
  const [pubStats, setPubStats] = useState([]);
  const [confirmIssue, setConfirmIssue] = useState(null);
  const [confirmStat, setConfirmStat] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); loadPublished(); }
    else setPwErr(true);
  };

  const loadPublished = async () => {
    const { data: issues } = await supabase.from('issue_cards').select('*').order('created_at', { ascending: false });
    const { data: stats } = await supabase.from('stat_blocks').select('*').order('strength_score', { ascending: false });
    if (issues) setPubIssues(issues);
    if (stats) setPubStats(stats);
  };

  const generateRefNumber = async (module, type) => {
    const prefix = getPrefix(module);
    const table = type === "issue" ? "issue_cards" : "stat_blocks";
    const suffix = type === "issue" ? "IC" : "SB";
    const { data } = await supabase.from(table).select('ref_number').like('ref_number', `${prefix}-${suffix}-%`);
    const nextNum = (data?.length || 0) + 1;
    return `${prefix}-${suffix}-${nextNum}`;
  };

  const scoreStatBlocks = async (blocks, module) => {
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statBlocks: blocks, module })
      });
      const data = await res.json();
      return data.scores || [];
    } catch { return []; }
  };

  const handleParse = async () => {
    if (!rawPaste.trim()) return;
    setParsing(true); setParseError("");
    setPendingIssues([]); setPendingStats([]);
    setSelIssues([]); setSelStats([]);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawPaste })
      });
      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error || "Parse failed");
      const issues = parsed.issueCards || [];
      const stats  = parsed.statBlocks  || [];
      setPendingIssues(issues);
      setPendingStats(stats);
      setSelIssues(issues.map((_, i) => i));
      setSelStats(stats.map((_, i) => i));
      setActiveTab("review");
    } catch (e) {
      setParseError("Could not parse content. Error: " + e.message);
    } finally { setParsing(false); }
  };

  const approveIssue = (card) => setConfirmIssue(card);
  const rejectIssue = (card) => {
    setDraftIssues(p => [...p, card]);
    setPendingIssues(p => {
      const idx = p.indexOf(card);
      const next = p.filter(c => c !== card);
      setSelIssues(s => s.filter(i => i !== idx).map(i => i > idx ? i-1 : i));
      return next;
    });
  };

  const confirmSingleIssue = async () => {
    setPublishing(true);
    const ref_number = await generateRefNumber(confirmIssue.module, "issue");
    const { error, data } = await supabase.from('issue_cards').insert({
      module: confirmIssue.module, label: confirmIssue.label,
      title: confirmIssue.title, summary: confirmIssue.summary,
      details: confirmIssue.details, sources: confirmIssue.sources,
      decoder: confirmIssue.decoder, actions: confirmIssue.actions,
      ref_number
    }).select();
    if (!error && data) {
      setPubIssues(p => [data[0], ...p]);
      setPendingIssues(p => p.filter(c => c !== confirmIssue));
    }
    setSelIssues([]); setConfirmIssue(null); setPublishing(false);
  };

  const approveStat = (block) => setConfirmStat(block);
  const rejectStat = (block) => {
    setDraftStats(p => [...p, block]);
    setPendingStats(p => {
      const idx = p.indexOf(block);
      const next = p.filter(b => b !== block);
      setSelStats(s => s.filter(i => i !== idx).map(i => i > idx ? i-1 : i));
      return next;
    });
  };

  const confirmSingleStat = async (linkedRef) => {
    setPublishing(true);
    const ref_number = await generateRefNumber(confirmStat.module, "stat");
    // Score this block
    const scores = await scoreStatBlocks([{ ...confirmStat, ref_number }], confirmStat.module);
    const score = scores.find(s => s.ref_number === ref_number)?.score || null;

    const { error, data } = await supabase.from('stat_blocks').insert({
      module: confirmStat.module, tab: confirmStat.tab,
      type: confirmStat.type, color: confirmStat.color,
      data: confirmStat, ref_number,
      issue_card_ref: linkedRef || null,
      strength_score: score
    }).select();
    if (!error && data) {
      setPubStats(p => [data[0], ...p]);
      setPendingStats(p => p.filter(b => b !== confirmStat));
      // Re-score all stats for this module
      rescoreModule(confirmStat.module);
    }
    setSelStats([]); setConfirmStat(null); setPublishing(false);
  };

  const rescoreModule = async (module) => {
    const { data: moduleStats } = await supabase.from('stat_blocks').select('*').eq('module', module);
    if (!moduleStats?.length) return;
    const scores = await scoreStatBlocks(moduleStats.map(s => ({ ...s.data, ref_number: s.ref_number })), module);
    for (const score of scores) {
      await supabase.from('stat_blocks').update({ strength_score: score.score }).eq('ref_number', score.ref_number);
    }
    // Refresh published
    const { data: updated } = await supabase.from('stat_blocks').select('*').order('strength_score', { ascending: false });
    if (updated) setPubStats(updated);
  };

  const handleBulkPublish = () => {
    if (selIssues.length + selStats.length > 0) setConfirmBulk(true);
  };

  const confirmBulkPublish = async () => {
    setPublishing(true);
    const issuesToPub = selIssues.map(i => pendingIssues[i]);
    const statsToPub = selStats.map(i => pendingStats[i]);
    const newPubIssues = [];
    const newPubStats = [];

    for (const card of issuesToPub) {
      const ref_number = await generateRefNumber(card.module, "issue");
      const { data } = await supabase.from('issue_cards').insert({
        module: card.module, label: card.label, title: card.title,
        summary: card.summary, details: card.details, sources: card.sources,
        decoder: card.decoder, actions: card.actions, ref_number
      }).select();
      if (data) newPubIssues.push(data[0]);
    }

    for (const block of statsToPub) {
      const ref_number = await generateRefNumber(block.module, "stat");
      const scores = await scoreStatBlocks([{ ...block, ref_number }], block.module);
      const score = scores[0]?.score || null;
      // Auto-link to first issue card of same module
      const sameModuleIssue = newPubIssues.find(ic => ic.module === block.module) ||
        pubIssues.find(ic => ic.module === block.module);
      const { data } = await supabase.from('stat_blocks').insert({
        module: block.module, tab: block.tab, type: block.type,
        color: block.color, data: block, ref_number,
        issue_card_ref: sameModuleIssue?.ref_number || null,
        strength_score: score
      }).select();
      if (data) newPubStats.push(data[0]);
    }

    setPubIssues(p => [...newPubIssues, ...p]);
    setPubStats(p => [...newPubStats, ...p]);
    setPendingIssues(p => p.filter((_,i) => !selIssues.includes(i)));
    setPendingStats(p => p.filter((_,i) => !selStats.includes(i)));

    // Re-score affected modules
    const affectedModules = [...new Set(statsToPub.map(b => b.module))];
    for (const mod of affectedModules) await rescoreModule(mod);

    setSelIssues([]); setSelStats([]); setConfirmBulk(false); setPublishing(false);
  };

  const handleDeleteIssue = async (card) => {
    if (!window.confirm(`Delete "${card.title}"? This cannot be undone.`)) return;
    await supabase.from('issue_cards').delete().eq('id', card.id);
    setPubIssues(p => p.filter(c => c.id !== card.id));
  };

  const handleDeleteStat = async (block) => {
    if (!window.confirm(`Delete "${block.label || block.title}"? This cannot be undone.`)) return;
    await supabase.from('stat_blocks').delete().eq('id', block.id);
    setPubStats(p => p.filter(b => b.id !== block.id));
  };

  const toggleIssue = (i) => setSelIssues(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleStat = (i) => setSelStats(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleAllIssues = () => setSelIssues(selIssues.length === pendingIssues.length ? [] : pendingIssues.map((_,i) => i));
  const toggleAllStats = () => setSelStats(selStats.length === pendingStats.length ? [] : pendingStats.map((_,i) => i));
  const copyTemplate = () => { navigator.clipboard.writeText(RESEARCH_TEMPLATE); setTemplateCopied(true); setTimeout(() => setTemplateCopied(false), 2500); };

  const totalPending = pendingIssues.length + pendingStats.length;
  const totalSel = selIssues.length + selStats.length;
  const totalDrafts = draftIssues.length + draftStats.length;

  const tabStyle = (id) => ({
    background: "none", border: "none",
    borderBottom: activeTab===id ? "3px solid #b8860b" : "3px solid transparent",
    color: activeTab===id ? "#b8860b" : "#aaa",
    padding: "16px 20px", fontSize: 13, fontWeight: 700,
    cursor: "pointer", textTransform: "uppercase", letterSpacing: 1
  });

  // Issue cards for same module (for stat block linking)
  const issueCardsForStatModule = confirmStat
    ? pubIssues.filter(ic => ic.module === confirmStat.module)
    : [];

  if (!authed) {
    return (
      <div style={{ minHeight:"100vh", background:"#2e3440", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
        <div style={{ width:440, padding:52, background:"#353b48", border:"1px solid #4a5268", borderRadius:12, boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>HSV Civic Watch</div>
            <div style={{ color:"#fff", fontSize:28, fontWeight:700, marginBottom:14 }}>Content Admin</div>
            <div style={{ color:"#e53e3e", fontSize:18, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>&#9888; Restricted Access</div>
          </div>
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter" && login()}
            style={{ width:"100%", background:"#2e3440", border:"1px solid "+(pwErr?"#e53e3e":"#4a5268"), borderRadius:4, padding:"16px 18px", color:"#fff", fontSize:16, boxSizing:"border-box", outline:"none", marginBottom:12 }} />
          {pwErr && <div style={{ color:"#e53e3e", fontSize:14, marginBottom:12, fontWeight:600 }}>Incorrect password.</div>}
          <button onClick={login} style={{ width:"100%", background:"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:16, fontSize:16, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:2 }}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#2e3440", fontFamily:"Georgia,serif", color:"#1a1a1a" }}>
      {confirmIssue && <ConfirmIssueModal card={confirmIssue} onConfirm={confirmSingleIssue} onCancel={() => setConfirmIssue(null)} publishing={publishing} />}
      {confirmStat && <ConfirmStatModal card={confirmStat} issueCardsForModule={issueCardsForStatModule} onConfirm={confirmSingleStat} onCancel={() => setConfirmStat(null)} publishing={publishing} />}
      {confirmBulk && <BulkConfirmModal issueCards={selIssues.map(i => pendingIssues[i])} statBlocks={selStats.map(i => pendingStats[i])} onConfirm={confirmBulkPublish} onCancel={() => setConfirmBulk(false)} publishing={publishing} />}

      <div style={{ borderBottom:"1px solid #4a5268", padding:"18px 36px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#2e3440" }}>
        <div>
          <div style={{ color:"#b8860b", fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase" }}>HSV Civic Watch</div>
          <div style={{ color:"#fff", fontSize:20, fontWeight:700, marginTop:2 }}>Content Admin</div>
        </div>
        <button onClick={() => setAuthed(false)} style={{ background:"#e53e3e", color:"#fff", border:"none", borderRadius:4, padding:"12px 24px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
          Sign Out
        </button>
      </div>

      <div style={{ borderBottom:"1px solid #4a5268", padding:"0 36px", display:"flex", flexWrap:"wrap", background:"#353b48" }}>
        <button onClick={() => setActiveTab("paste")} style={tabStyle("paste")}>1. Paste Research</button>
        <button onClick={() => setActiveTab("review")} style={tabStyle("review")}>2. Review{totalPending ? " ("+totalPending+")" : ""}</button>
        <button onClick={() => setActiveTab("drafts")} style={tabStyle("drafts")}>Drafts{totalDrafts ? " ("+totalDrafts+")" : ""}</button>
        <button onClick={() => setActiveTab("published")} style={tabStyle("published")}>Published ({pubIssues.length + pubStats.length})</button>
        <button onClick={() => setActiveTab("template")} style={{ ...tabStyle("template"), color: activeTab==="template" ? "#b8860b" : "#7ab" }}>Research Template</button>
      </div>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:36 }}>

        {activeTab === "paste" && (
          <div>
            <h2 style={{ color:"#f5f0e8", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Paste Formatted Research</h2>
            <p style={{ color:"#aaa", fontSize:15, margin:"0 0 22px" }}>Research freely first. Then go to the Research Template tab, copy the template, paste it into your AI chat to format your findings, then paste the result below.</p>
            <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, padding:10, marginBottom:18 }}>
              <textarea value={rawPaste} onChange={e => setRawPaste(e.target.value)}
                placeholder={"Paste your formatted research here...\n\nInclude --- ISSUE CARD START/END --- and --- STAT BLOCK START/END --- blocks.\nMultiple of each supported."}
                style={{ width:"100%", minHeight:360, background:"transparent", border:"none", color:"#333", fontSize:14, lineHeight:1.7, resize:"vertical", outline:"none", fontFamily:"monospace", boxSizing:"border-box", padding:14 }} />
            </div>
            {parseError && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:6, padding:"14px 18px", marginBottom:18, color:"#b91c1c", fontSize:14, fontWeight:600 }}>{parseError}</div>}
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <button onClick={handleParse} disabled={parsing || !rawPaste.trim()}
                style={{ background:parsing?"#888":"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:parsing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1 }}>
                {parsing ? "Processing..." : "Process & Organize"}
              </button>
              <span style={{ color:"#bbb", fontSize:14 }}>
                {rawPaste.trim() ? (rawPaste.split("--- ISSUE CARD START ---").length-1)+" issue card(s) · "+(rawPaste.split("--- STAT BLOCK START ---").length-1)+" stat block(s) detected" : "No content pasted"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div>
            <h2 style={{ color:"#f5f0e8", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Review</h2>
            <p style={{ color:"#aaa", fontSize:15, margin:"0 0 22px" }}>
              {totalPending ? pendingIssues.length+" issue card(s) · "+pendingStats.length+" stat block(s) ready." : "Nothing to review yet."}
            </p>
            {totalPending === 0 && (
              <div style={{ textAlign:"center", padding:"80px 0", color:"#aaa" }}>
                <div style={{ fontSize:44, marginBottom:18 }}>&#9670;</div>
                <div style={{ fontSize:18 }}>Nothing to review.</div>
                <button onClick={() => setActiveTab("paste")} style={{ marginTop:18, background:"#f5f0e8", color:"#b8860b", border:"2px solid #b8860b", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700 }}>Go to Paste Research</button>
              </div>
            )}
            {totalPending > 0 && (
              <>
                <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:8, padding:"14px 20px", marginBottom:22, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <span style={{ color:"#444", fontSize:15, fontWeight:600 }}>{totalSel} of {totalPending} selected</span>
                  {totalSel > 0 && (
                    <button onClick={handleBulkPublish} style={{ marginLeft:"auto", background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"11px 26px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
                      {totalSel === totalPending ? "Publish All ("+totalSel+")" : "Publish ("+totalSel+")"}
                    </button>
                  )}
                </div>
                {pendingIssues.length > 0 && (
                  <div style={{ marginBottom:36 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                      <div style={{ color:"#b8860b", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>Issue Cards ({pendingIssues.length})</div>
                      <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", color:"#bbb", fontSize:13 }}>
                        <input type="checkbox" checked={selIssues.length === pendingIssues.length} onChange={toggleAllIssues} style={{ accentColor:"#b8860b", width:16, height:16 }} />
                        {selIssues.length === pendingIssues.length ? "Deselect All" : "Select All"}
                      </label>
                    </div>
                    {pendingIssues.map((card,i) => <IssueRow key={i} card={card} selected={selIssues.includes(i)} onToggle={() => toggleIssue(i)} onApprove={() => approveIssue(card)} onReject={() => rejectIssue(card)} />)}
                  </div>
                )}
                {pendingStats.length > 0 && (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                      <div style={{ color:"#7ab", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>Stat Blocks ({pendingStats.length})</div>
                      <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", color:"#bbb", fontSize:13 }}>
                        <input type="checkbox" checked={selStats.length === pendingStats.length} onChange={toggleAllStats} style={{ accentColor:"#b8860b", width:16, height:16 }} />
                        {selStats.length === pendingStats.length ? "Deselect All" : "Select All"}
                      </label>
                    </div>
                    {pendingStats.map((block,i) => <StatRow key={i} block={block} selected={selStats.includes(i)} onToggle={() => toggleStat(i)} onApprove={() => approveStat(block)} onReject={() => rejectStat(block)} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "drafts" && (
          <div>
            <h2 style={{ color:"#f5f0e8", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Drafts</h2>
            <p style={{ color:"#aaa", fontSize:15, margin:"0 0 26px" }}>Rejected items saved here. Nothing is lost.</p>
            {totalDrafts === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0", color:"#aaa" }}>
                <div style={{ fontSize:44, marginBottom:18 }}>&#128196;</div>
                <div style={{ fontSize:18 }}>No drafts yet.</div>
              </div>
            ) : (
              <>
                {draftIssues.map((card,i) => (
                  <div key={i} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, overflow:"hidden" }}>
                    <div style={{ background:"#fef2f2", borderBottom:"1px solid #fca5a5", padding:"10px 22px" }}>
                      <span style={{ color:"#b91c1c", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>&#9679; Draft — Issue Card</span>
                    </div>
                    <div style={{ padding:"18px 22px" }}>
                      <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, marginBottom:8 }}>{card.title}</div>
                      <div style={{ color:"#555", fontSize:14, lineHeight:1.6, marginBottom:14 }}>{card.summary}</div>
                      <div style={{ display:"flex", gap:12 }}>
                        <button onClick={() => { setPendingIssues(p => [...p, card]); setDraftIssues(p => p.filter((_,di) => di !== i)); setActiveTab("review"); }}
                          style={{ background:"#eff6ff", color:"#1a4a7a", border:"1px solid #93c5fd", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Move to Review</button>
                        <button onClick={() => setDraftIssues(p => p.filter((_,di) => di !== i))}
                          style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {draftStats.map((block,i) => (
                  <div key={i} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, overflow:"hidden" }}>
                    <div style={{ background:"#eff6ff", borderBottom:"1px solid #93c5fd", padding:"10px 22px" }}>
                      <span style={{ color:"#1a4a7a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>&#9679; Draft — {block.type}</span>
                    </div>
                    <div style={{ padding:"18px 22px" }}>
                      <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, marginBottom:6 }}>{block.label || block.title}</div>
                      <div style={{ color:"#888", fontSize:14, marginBottom:14 }}>{block.module} — {block.tab}</div>
                      <div style={{ display:"flex", gap:12 }}>
                        <button onClick={() => { setPendingStats(p => [...p, block]); setDraftStats(p => p.filter((_,di) => di !== i)); setActiveTab("review"); }}
                          style={{ background:"#eff6ff", color:"#1a4a7a", border:"1px solid #93c5fd", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Move to Review</button>
                        <button onClick={() => setDraftStats(p => p.filter((_,di) => di !== i))}
                          style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "published" && (
          <PublishedTab
            pubIssues={pubIssues}
            pubStats={pubStats}
            onDeleteIssue={handleDeleteIssue}
            onDeleteStat={handleDeleteStat}
          />
        )}

        {activeTab === "template" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
              <div>
                <h2 style={{ color:"#f5f0e8", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Research Template</h2>
                <p style={{ color:"#aaa", fontSize:15, margin:0 }}>Complete your research with AI first. When done, copy this template and paste it into your AI chat. It will format everything for the admin form.</p>
              </div>
              <button onClick={copyTemplate} style={{ background:templateCopied?"#1a7a3a":"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"14px 28px", fontSize:14, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, flexShrink:0, marginLeft:24, transition:"background 0.3s" }}>
                {templateCopied ? "Copied!" : "Copy Template"}
              </button>
            </div>
            <div style={{ background:"#1e2330", border:"1px solid #3a4268", borderRadius:8, padding:28 }}>
              <pre style={{ color:"#ccc", fontSize:13, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"monospace", margin:0 }}>{RESEARCH_TEMPLATE}</pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}