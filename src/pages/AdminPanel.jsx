import { useState, useEffect, useRef } from "react";
import { supabase } from '../lib/supabase';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

const ADMIN_PASSKEY_NAME = "HSV Civic Watch Admin Passkey";
const ADMIN_TOTP_NAME = "HSV Civic Watch Admin Authenticator";

const MODULE_PREFIX = {
  equity: "EQ",
  utilities: "UT",
  health: "HS",
  insurance_burdens: "IN",
  workers_childcare: "WK",
  taxation: "TX",
  housing_crisis: "HO",
  officials_elections: "OF",
  boards_oversight: "BO",
  voting_rights: "VT",
  criminal_justice: "CJ",
  policing: "PO",
  data_collection: "DA",
  money: "MO",
  landuse: "LA",
  environment: "EN",
  information_warfare: "IW",
  proposals: "PR",
  action: "AC",
};

function getPrefix(module) {
  if (!module) return "XX";
  return MODULE_PREFIX[String(module).trim().toLowerCase()] || String(module).substring(0, 2).toUpperCase();
}

const RESEARCH_TEMPLATE = `Now take everything we just researched and format it using the template below.
Use only verified information. Write UNKNOWN for anything not found.
Produce as many ISSUE CARD and STAT BLOCK entries as the research supports.

ISSUE CARDS
-----------
--- ISSUE CARD START ---
MODULE: [Housing / Criminal Justice / Health System / Transit / Utilities / Education / Workers / Taxes / Officials / Environment / Unhoused / Annexation]
LABEL: [2-4 word category tag]
TITLE: [specific headline -- what happened and who did it]
SUMMARY: [2-3 sentences. Plain language. What is the problem, who is responsible, why does it matter.]
DETAILS: [Full paragraph. Context, history, dollar amounts, dates, vote records, contract numbers.]
SOURCES:
- [Source 1 -- URL or document name and date]
- [Source 2]

--- DECODER ---
WHATS HAPPENING: [Core contradiction in 2-3 plain sentences.]
CONNECTIONS: [Use their own public statements, slogans, social posts, votes, and donations against them. Format: They said X. They did Y. Name officials, amounts, dates. Include deliberate actions and things done behind closed doors if documented.]
WHO BENEFITS: [Named people only -- officials, developers, CEOs, companies, boards. No vague categories.]
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

const PROFILE_RESEARCH_TEMPLATE = `You are an investigative researcher building a prosecutorial dossier on a public official for HSV Civic Watch, a civic accountability platform covering the Huntsville, Alabama metro area (Madison County, Limestone County, Morgan County, Marshall County — principal cities include Huntsville, Madison, Athens, Decatur, New Hope). This is not a biography. This is not a press release. You are following the money, naming the names, and connecting every dot. Use only verifiable public records — ethics filings, campaign finance reports, court documents, property records, voting records, corporate filings, news archives, social media. If a figure is estimated, label it Est. and show your sourcing logic. If something is unknown, write NOT DISCLOSED — never leave a field blank. Every field must be answered. Expand every acronym on first use. Gender-neutral they/them pronouns for any unnamed individual. Named individuals only in The Beneficiaries — never organizations, never categories. Every claim must be traceable to a public record, filing, vote, court document, or on-record statement.

NAME:
OFFICE / ROLE:
KIND: [elected / appointed / candidate / board_member / judge / sheriff / tax_official / superintendent / asst_superintendent / principal / vice_principal / resource_officer / director / authority_member / district_staff]
JURISDICTION:
GEOGRAPHY:
APPOINTED BY / ELECTED BY:
TERM START:
TERM END / NEXT ELECTION DATE:
PARTY REGISTRATION:
SALARY:
ESTIMATED NET WORTH:
STATUS: [active / candidate / former / deceased]
DATE OF BIRTH:
RESIDENCY:
CRIMINAL RECORD:
ETHICS COMPLAINTS:
EDUCATION:
MILITARY SERVICE:
BORN INTO / MARRIED INTO:
ELITE INSTITUTIONAL CONNECTIONS:
PROFESSIONAL NETWORK:
BOARD SEATS AND ORGANIZATIONAL TIES:
NAMED INDIVIDUALS IN THEIR ORBIT:
CAMPAIGN FINANCE TOTAL:
TOP DONORS:
PAC SUPPORT:
DONATIONS MADE:
DARK MONEY:
FINANCE FILING LINKS:
SPOUSE:
HAS CHILDREN:
CHILDREN COUNT:
PARENTS AND SIBLINGS:
FAMILY BUSINESS TIES:
PUBLIC STATEMENTS:
SOCIAL MEDIA:
INTERVIEWS:
SWORN TESTIMONY:
PUBLIC MEETING COMMENTS:
NEWSLETTERS AND MAILERS:
NOTABLE CONTRADICTIONS:
VOTES:
RULINGS:
CONTRACTS AWARDED:
POLICIES ENACTED OR BLOCKED:
APPOINTMENTS MADE:
REVERSALS:
NOTABLE ACTIONS TAKEN:
NOTABLE ACTIONS BLOCKED OR AVOIDED:
SOCIAL MEDIA HANDLES:
- Twitter/X: [url or UNKNOWN]
- Facebook: [url or UNKNOWN]
- Instagram: [url or UNKNOWN]
- LinkedIn: [url or UNKNOWN]

CONTACT:
- Office Phone: [number or UNKNOWN]
- Office Email: [email or UNKNOWN]
- Office Address: [address or UNKNOWN]
- Office Hours: [hours or UNKNOWN]
- Official Website: [url or UNKNOWN]
- Campaign Website: [url or UNKNOWN]
- Campaign Finance URL: [url or UNKNOWN]
THE RISE: How they got power. Not a biography — a power map. Name every patron, every org that backed them, every pivotal appointment and who made it. Trace how each career step connected to the next and what they traded or who they served to advance. End on where they sit now and what that position gives them access to. Chronological but contemptuous. Every advancement framed as handed not earned unless the record proves otherwise. No hedging. No softening. No benefit of the doubt.
THE AFFILIATIONS: Every organizational financial and personal tie creating obligation or loyalty outside their public role. Named boards. Named PACs. Named donors. Named law firms lobbying shops industries. Named clubs fraternal orgs civic orgs military networks alumni networks. Named individuals they vacation with do business with appear at events with. No categories — only names and amounts. The question: who does this person actually serve.
THE BENEFICIARIES: Named individuals only. Never organizations. Never industries. Never vague categories. Who specifically got richer got the contract got the appointment got the zoning variance got the case dismissed got the regulatory pass. One named individual per sentence. Dollar amount or specific benefit stated. Relationship to official stated explicitly. No softening.
THE TRACK RECORD: Receipts only. Specific votes. Specific rulings. Specific contracts. Specific statements contradicted by actions. Dates on everything. Dollar amounts on everything. Who was harmed named explicitly. Every reversal documented with before and after. Ethics complaints with outcomes. Criminal record if any. Order by impact unless chronology hits harder.`;

const BLUEPRINT_RESEARCH_TEMPLATE = ""; // TODO: add blueprint research template text

const COLOR_MAP = { red:"#c0392b", gold:"#b8860b", purple:"#6c3483", green:"#1e8449", blue:"#1a5276" };
const COLOR_BG  = { red:"#2a0a0a", gold:"#2a1f00", purple:"#1a0a2a", green:"#0a1f0a", blue:"#0a1520" };

const MODULE_OPTIONS = [
  "equity",
  "utilities",
  "health",
  "insurance_burdens",
  "workers_childcare",
  "taxation",
  "housing_crisis",
  "officials_elections",
  "boards_oversight",
  "voting_rights",
  "criminal_justice",
  "policing",
  "data_collection",
  "money",
  "landuse",
  "environment",
  "information_warfare",
  "proposals",
  "action",
];

const PROFILE_LEVEL_OPTIONS = ["local", "state", "federal", "judge"];

const TAB_OPTIONS = {
  equity: ["overview", "schools", "infrastructure"],
  utilities: ["overview"],
  health: ["overview"],
  insurance_burdens: ["health", "auto", "dental_vision", "homeowners"],
  workers_childcare: ["worker_rights", "child_care"],
  taxation: ["overview"],
  housing_crisis: ["overview"],
  officials_elections: ["overview"],
  boards_oversight: ["overview"],
  voting_rights: ["voter_registration", "polling_access", "your_reps"],
  criminal_justice: ["bail_pretrial", "sentencing", "incarceration"],
  policing: ["hpd", "sheriff"],
  data_collection: ["surveillance", "data_collection"],
  money: ["connections_map", "donor_profiles", "exec_vs_worker", "contracts_vendors"],
  landuse: ["overview"],
  environment: ["overview"],
  information_warfare: ["narrative_control", "disinformation", "media_capture"],
  proposals: ["economic_justice", "housing_infrastructure", "public_safety", "governance"],
  action: ["overview"],
};

const STAT_TYPE_OPTIONS = [
  "key-number",
  "comparison-bar",
  "pie-chart",
  "trend-line",
  "bar-chart",
  "pay-clock",
  "zone-map",
];

const STAT_COLOR_OPTIONS = ["red", "gold", "purple", "green", "blue"];

function getTabsForModule(module) {
  return TAB_OPTIONS[module] || ["overview"];
}

function pulseWiggleStyle() {
  return `
    @keyframes slideUp {
      0% {
        transform: translateY(24px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes hsvAdminEditedPulse {
      0% {
        transform: translateX(0);
        box-shadow: 0 0 0 rgba(62,139,91,0);
      }
      8% {
        transform: translateX(-12px);
        box-shadow:
          0 0 0 5px rgba(62,139,91,0.34),
          0 0 0 13px rgba(62,139,91,0.16),
          0 0 34px rgba(62,139,91,0.26);
      }
      16% { transform: translateX(12px); }
      24% { transform: translateX(-12px); }
      32% { transform: translateX(0); }

      40% {
        transform: translateX(-12px);
        box-shadow:
          0 0 0 4px rgba(62,139,91,0.24),
          0 0 0 8px rgba(62,139,91,0.10),
          0 0 22px rgba(62,139,91,0.18);
      }
      48% { transform: translateX(12px); }
      56% { transform: translateX(-12px); }
      64% { transform: translateX(0); }

      72% {
        transform: translateX(-12px);
        box-shadow:
          0 0 0 3px rgba(62,139,91,0.18),
          0 0 0 6px rgba(62,139,91,0.08),
          0 0 14px rgba(62,139,91,0.14);
      }
      80% { transform: translateX(12px); }
      88% { transform: translateX(-12px); }
      100% {
        transform: translateX(0);
        box-shadow: 0 0 0 rgba(62,139,91,0);
      }
    }
  `;
}

function FieldLabel({ children }) {
  return (
    <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
      {children}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      style={{
        width:"100%",
        background:"#fff",
        border:"1px solid #ddd8cf",
        borderRadius:6,
        padding:"11px 12px",
        fontSize:14,
        color:"#1a1a1a",
        boxSizing:"border-box",
        outline:"none",
        ...(props.style || {})
      }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        width:"100%",
        background:"#fff",
        border:"1px solid #ddd8cf",
        borderRadius:6,
        padding:"11px 12px",
        fontSize:14,
        color:"#1a1a1a",
        boxSizing:"border-box",
        outline:"none",
        resize:"vertical",
        ...(props.style || {})
      }}
    />
  );
}

function SelectInput({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width:"100%",
        background:"#fff",
        border:"1px solid #ddd8cf",
        borderRadius:6,
        padding:"11px 12px",
        fontSize:14,
        color:"#1a1a1a",
        boxSizing:"border-box",
        outline:"none",
        ...(props.style || {})
      }}
    >
      {children}
    </select>
  );
}

function AdminMetaRow({ label, value }) {
  return (
    <div style={{ marginBottom:8 }}>
      <span style={{ color:"#777", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, display:"inline-block", minWidth:110 }}>
        {label}:
      </span>
      <span style={{ color:"#333", fontSize:13, fontFamily:"monospace" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function buildIssueEditState(item) {
  const fallbackTab = item.tab || getTabsForModule(item.module || "equity")[0] || "overview";
  const tabs = Array.from(new Set(
    (Array.isArray(item.tabs) && item.tabs.length ? item.tabs : [fallbackTab]).concat(fallbackTab)
  ));

  return {
    module: item.module || "equity",
    tab: fallbackTab,
    tabs,
    label: item.label || "",
    title: item.title || "",
    summary: item.summary || "",
    homepage_teaser: item.homepage_teaser || "",
    details: item.details || "",
    decoder: {
      whatsHappening: item.decoder?.whatsHappening || "",
      connections: item.decoder?.connections || "",
      whoBenefits: item.decoder?.whoBenefits || "",
      impact: item.decoder?.impact || "",
    },
  };
}

function buildStatEditState(item) {
  const data = item.data || item;
  return {
    module: item.module || data.module || "equity",
    tab: item.tab || data.tab || getTabsForModule(item.module || data.module || "equity")[0] || "overview",
    type: item.type || data.type || "key-number",
    color: item.color || data.color || "gold",
    data: JSON.parse(JSON.stringify(data || {})),
  };
}

function EditModal({ config, onClose, onSave, onDelete, saving, isMobile = false }) {
  const { itemType, item } = config;
  const isIssue = itemType === "issue_card";
  const [issueState, setIssueState] = useState(() => buildIssueEditState(item));
  const [statState, setStatState] = useState(() => buildStatEditState(item));
  const [savedFlash, setSavedFlash] = useState(false);

  const activeModule = isIssue ? issueState.module : statState.module;
  const activeTabs = getTabsForModule(activeModule);
  const originalIssueState = JSON.stringify(buildIssueEditState(item));
  const originalStatState = JSON.stringify(buildStatEditState(item));
  const hasChanges = isIssue
    ? JSON.stringify(issueState) !== originalIssueState
    : JSON.stringify(statState) !== originalStatState;
  const isCompact = isMobile;
  const twoColGrid = isCompact ? "1fr" : "repeat(2, minmax(0, 1fr))";

  useEffect(() => {
    if (isIssue && !activeTabs.includes(issueState.tab)) {
      setIssueState(prev => ({ ...prev, tab: activeTabs[0] || "overview" }));
    }
    if (!isIssue && !activeTabs.includes(statState.tab)) {
      setStatState(prev => ({ ...prev, tab: activeTabs[0] || "overview" }));
    }
  }, [isIssue, activeModule]);

  const updateStatData = (key, value) => {
    setStatState(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
  };

  const renderStatFields = () => {
    const data = statState.data || {};
    const type = statState.type;

    if (type === "key-number") {
      return (
        <>
          <div>
            <FieldLabel>Value</FieldLabel>
            <TextInput value={data.value || ""} onChange={e => updateStatData("value", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Label</FieldLabel>
            <TextInput value={data.label || ""} onChange={e => updateStatData("label", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
        </>
      );
    }

    if (type === "comparison-bar") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.title || ""} onChange={e => updateStatData("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Left Label</FieldLabel>
            <TextInput value={data.leftLabel || ""} onChange={e => updateStatData("leftLabel", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Left Value</FieldLabel>
            <TextInput value={data.leftValue ?? ""} onChange={e => updateStatData("leftValue", Number(e.target.value || 0))} />
          </div>
          <div>
            <FieldLabel>Right Label</FieldLabel>
            <TextInput value={data.rightLabel || ""} onChange={e => updateStatData("rightLabel", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Right Value</FieldLabel>
            <TextInput value={data.rightValue ?? ""} onChange={e => updateStatData("rightValue", Number(e.target.value || 0))} />
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <TextInput value={data.unit || ""} onChange={e => updateStatData("unit", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
        </>
      );
    }

    if (type === "pie-chart") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.title || ""} onChange={e => updateStatData("title", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Slices</FieldLabel>
            <TextArea
              rows={5}
              placeholder={"Schools:62\nPolice:28\nDebt Service:10"}
              value={(data.slices || []).map(s => `${s.name || s.label || ""}:${s.value ?? ""}`).join("\n")}
              onChange={e => updateStatData("slices", e.target.value.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
                const [name, value] = line.split(":");
                return { name: (name || "").trim(), value: Number((value || "0").trim()) };
              }))}
            />
          </div>
        </>
      );
    }

    if (type === "trend-line") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.title || ""} onChange={e => updateStatData("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <TextInput value={data.unit || ""} onChange={e => updateStatData("unit", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Points</FieldLabel>
            <TextArea
              rows={5}
              placeholder={"2022:14\n2023:18\n2024:22"}
              value={(data.points || []).map(p => `${p.year}:${p.value}`).join("\n")}
              onChange={e => updateStatData("points", e.target.value.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
                const [year, value] = line.split(":");
                return { year: (year || "").trim(), value: Number((value || "0").trim()) };
              }))}
            />
          </div>
        </>
      );
    }

    if (type === "bar-chart") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.title || ""} onChange={e => updateStatData("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <TextInput value={data.unit || ""} onChange={e => updateStatData("unit", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Bars</FieldLabel>
            <TextArea
              rows={5}
              placeholder={"North Huntsville:38\nSouth Huntsville:14"}
              value={(data.bars || []).map(b => `${b.name}:${b.value}`).join("\n")}
              onChange={e => updateStatData("bars", e.target.value.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
                const [name, value] = line.split(":");
                return { name: (name || "").trim(), value: Number((value || "0").trim()) };
              }))}
            />
          </div>
        </>
      );
    }

    if (type === "pay-clock") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Label</FieldLabel>
            <TextInput value={data.label || ""} onChange={e => updateStatData("label", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Annual Amount</FieldLabel>
            <TextInput value={data.annualAmount ?? ""} onChange={e => updateStatData("annualAmount", Number(e.target.value || 0))} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
        </>
      );
    }

    if (type === "zone-map") {
      return (
        <>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.title || ""} onChange={e => updateStatData("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <TextInput value={data.unit || ""} onChange={e => updateStatData("unit", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Context</FieldLabel>
            <TextArea rows={3} value={data.context || ""} onChange={e => updateStatData("context", e.target.value)} />
          </div>
          <div style={{ gridColumn:"1 / -1" }}>
            <FieldLabel>Zones</FieldLabel>
            <TextArea
              rows={5}
              placeholder={"North Huntsville:82:CRITICAL\nDowntown:41:FAIR"}
              value={(data.zones || []).map(z => `${z.name}:${z.value}:${z.status}`).join("\n")}
              onChange={e => updateStatData("zones", e.target.value.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
                const [name, value, status] = line.split(":");
                return { name: (name || "").trim(), value: (value || "").trim(), status: (status || "").trim() };
              }))}
            />
          </div>
        </>
      );
    }

    return null;
  };

  const handleSave = async () => {
    const updates = isIssue
      ? issueState
      : {
          module: statState.module,
          tab: statState.tab,
          type: statState.type,
          color: statState.color,
          data: {
            ...statState.data,
            module: statState.module,
            tab: statState.tab,
            type: statState.type,
            color: statState.color,
          },
        };

    setSavedFlash(true);
    await onSave(config, updates);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:4000, display:"flex", alignItems:isMobile ? "stretch" : "center", justifyContent:"center", padding:isMobile ? 0 : 16, overflowY:"auto" }}>
      <style>{pulseWiggleStyle()}</style>
      <div style={{ background:"#f5f0e8", border:isMobile ? "none" : "1px solid #ddd8cf", borderRadius:isMobile ? 0 : 12, width:"100%", maxWidth:isMobile ? "100%" : 1040, maxHeight:isMobile ? "100vh" : "92vh", overflow:"hidden", boxShadow:isMobile ? "none" : "0 24px 80px rgba(0,0,0,0.35)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #ddd8cf", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexShrink:0 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>
              Edit {isIssue ? "Issue Card" : "Stat Block"}
            </div>
            <div style={{ color:"#1a1a1a", fontSize:20, fontWeight:700, lineHeight:1.3 }}>
              {isIssue ? item.title : (item.label || item.title || item.ref_number)}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <button
              onClick={() => {
                if (window.confirm("Delete this item? This cannot be undone.")) onDelete(item);
              }}
              style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:6, padding:"10px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}
            >
              Delete
            </button>
            <button
              onClick={onClose}
              style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:6, width:40, height:40, fontSize:20, fontWeight:700, cursor:"pointer", lineHeight:1 }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ padding:"22px 24px", overflowY:"auto", flex:"1 1 auto", minHeight:0 }}>
          {isIssue ? (
            <>
              <div style={{ display:"grid", gridTemplateColumns:twoColGrid, gap:16, marginBottom:16 }}>
                <div>
                  <FieldLabel>Module</FieldLabel>
                  <SelectInput value={issueState.module} onChange={e => {
                    const firstTab = getTabsForModule(e.target.value)[0] || "overview";
                    setIssueState(prev => ({
                      ...prev,
                      module: e.target.value,
                      tab: firstTab,
                      tabs: [firstTab]
                    }));
                  }}>
                    {MODULE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Primary Tab</FieldLabel>
                  <SelectInput value={issueState.tab} onChange={e => setIssueState(prev => {
                    const nextTab = e.target.value;
                    return {
                      ...prev,
                      tab: nextTab,
                      tabs: Array.from(new Set([...(prev.tabs || []), nextTab]))
                    };
                  })}>
                    {activeTabs.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <FieldLabel>Show In Tabs</FieldLabel>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:6 }}>
                  {activeTabs.map(option => {
                    const checked = (issueState.tabs || []).includes(option);
                    return (
                      <label
                        key={option}
                        style={{
                          display:"flex",
                          alignItems:"center",
                          gap:8,
                          background:"#fff",
                          border:"1px solid #ddd8cf",
                          borderRadius:8,
                          padding:"8px 10px",
                          fontSize:13,
                          cursor:"pointer"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            const currentTabs = issueState.tabs || [];
                            const nextTabs = e.target.checked
                              ? Array.from(new Set([...currentTabs, option]))
                              : currentTabs.filter(t => t !== option);

                            const safeTabs = nextTabs.length ? nextTabs : [activeTabs[0] || "overview"];

                            setIssueState(prev => ({
                              ...prev,
                              tabs: safeTabs,
                              tab: safeTabs.includes(prev.tab) ? prev.tab : safeTabs[0]
                            }));
                          }}
                          style={{ accentColor:"#b8860b" }}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <FieldLabel>Label</FieldLabel>
                <TextInput value={issueState.label} onChange={e => setIssueState(prev => ({ ...prev, label: e.target.value }))} />
              </div>

              <div style={{ marginBottom:16 }}>
                <FieldLabel>Title</FieldLabel>
                <TextArea rows={2} value={issueState.title} onChange={e => setIssueState(prev => ({ ...prev, title: e.target.value }))} />
              </div>

              <div style={{ marginBottom:16 }}>
                <FieldLabel>Summary</FieldLabel>
                <TextArea rows={4} value={issueState.summary} onChange={e => setIssueState(prev => ({ ...prev, summary: e.target.value }))} />
              </div>

              <div style={{ marginBottom:16 }}>
                <FieldLabel>Homepage Teaser</FieldLabel>
                <TextArea
                  rows={3}
                  placeholder={"1-2 punchy exposé-style sentences for the homepage mini issue card."}
                  value={issueState.homepage_teaser}
                  onChange={e => setIssueState(prev => ({ ...prev, homepage_teaser: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom:20 }}>
                <FieldLabel>Details</FieldLabel>
                <TextArea rows={8} value={issueState.details} onChange={e => setIssueState(prev => ({ ...prev, details: e.target.value }))} />
              </div>

              <div style={{ display:"grid", gap:16 }}>
                <div>
                  <FieldLabel>What’s Happening</FieldLabel>
                  <TextArea rows={4} value={issueState.decoder.whatsHappening} onChange={e => setIssueState(prev => ({ ...prev, decoder: { ...prev.decoder, whatsHappening: e.target.value } }))} />
                </div>
                <div>
                  <FieldLabel>The Connections</FieldLabel>
                  <TextArea rows={4} value={issueState.decoder.connections} onChange={e => setIssueState(prev => ({ ...prev, decoder: { ...prev.decoder, connections: e.target.value } }))} />
                </div>
                <div>
                  <FieldLabel>Who Benefits</FieldLabel>
                  <TextArea rows={4} value={issueState.decoder.whoBenefits} onChange={e => setIssueState(prev => ({ ...prev, decoder: { ...prev.decoder, whoBenefits: e.target.value } }))} />
                </div>
                <div>
                  <FieldLabel>The Impact</FieldLabel>
                  <TextArea rows={4} value={issueState.decoder.impact} onChange={e => setIssueState(prev => ({ ...prev, decoder: { ...prev.decoder, impact: e.target.value } }))} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:twoColGrid, gap:16, marginBottom:16 }}>
                <div>
                  <FieldLabel>Module</FieldLabel>
                  <SelectInput value={statState.module} onChange={e => setStatState(prev => ({ ...prev, module: e.target.value, tab: getTabsForModule(e.target.value)[0] || "overview" }))}>
                    {MODULE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Tab</FieldLabel>
                  <SelectInput value={statState.tab} onChange={e => setStatState(prev => ({ ...prev, tab: e.target.value }))}>
                    {activeTabs.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Type</FieldLabel>
                  <SelectInput value={statState.type} onChange={e => setStatState(prev => ({ ...prev, type: e.target.value }))}>
                    {STAT_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Color</FieldLabel>
                  <SelectInput value={statState.color} onChange={e => setStatState(prev => ({ ...prev, color: e.target.value }))}>
                    {STAT_COLOR_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </SelectInput>
                </div>
              </div>

              <div style={{ background:"#efe7da", border:"1px solid #ddd8cf", borderRadius:10, padding:16, marginBottom:18 }}>
                <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
                  Stat Block Setup
                </div>
                <div style={{ display:"grid", gridTemplateColumns:twoColGrid, gap:16 }}>
                  {renderStatFields()}
                </div>
              </div>

              <div style={{ background:"#efe7da", border:"1px solid #ddd8cf", borderRadius:10, padding:16 }}>
                <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>
                  Live Preview
                </div>
                <StatBlockPreview block={{ ...statState.data, module: statState.module, tab: statState.tab, type: statState.type, color: statState.color }} />
              </div>
            </>
          )}

          <div style={{ marginTop:24, paddingTop:16, borderTop:"1px solid #ddd8cf" }}>
            <div style={{ color:"#777", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
              Admin Details
            </div>
            <AdminMetaRow label="ID" value={item.id} />
            <AdminMetaRow label="Ref Number" value={item.ref_number} />
            {!isIssue ? <AdminMetaRow label="Issue Card Ref" value={item.issue_card_ref} /> : null}
          </div>
        </div>

        <div style={{ padding:"16px 24px", borderTop:"1px solid #ddd8cf", display:"flex", flexDirection:isMobile ? "column-reverse" : "row", justifyContent:"flex-end", gap:12, background:"#f5f0e8", flexShrink:0 }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:6, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer", width:isMobile ? "100%" : "auto" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            style={{ background:(saving || !hasChanges) ? "#888" : "#1a7a3a", color:"#fff", border:"none", borderRadius:6, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:(saving || !hasChanges) ? "not-allowed" : "pointer", minWidth:120, opacity:(saving || !hasChanges) ? 0.7 : 1, width:isMobile ? "100%" : "auto" }}
          >
            {saving ? "Saving..." : (savedFlash ? "Saved" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileEditModal({ profile, onClose, onSave, saving, isMobile = false }) {
  const [form, setForm] = useState(() => ({
    name: profile?.name || "",
    office: profile?.office || "",
    level: profile?.level || "local",
    kind: profile?.kind || "",
    geography: profile?.geography || "",
    party: profile?.party || "",
    status_line: profile?.status_line || "",
    decoder: {
      rise: profile?.decoder?.rise || "",
      affiliations: profile?.decoder?.affiliations || "",
      beneficiaries: profile?.decoder?.beneficiaries || "",
      track_record: profile?.decoder?.track_record || "",
    },
  }));

  useEffect(() => {
    setForm({
      name: profile?.name || "",
      office: profile?.office || "",
      level: profile?.level || "local",
      kind: profile?.kind || "",
      geography: profile?.geography || "",
      party: profile?.party || "",
      status_line: profile?.status_line || "",
      decoder: {
        rise: profile?.decoder?.rise || "",
        affiliations: profile?.decoder?.affiliations || "",
        beneficiaries: profile?.decoder?.beneficiaries || "",
        track_record: profile?.decoder?.track_record || "",
      },
    });
  }, [profile]);

  const darkInputStyle = {
    background:"#f5f0e8",
    border:"1px solid #ddd8cf",
    color:"#1a1a1a",
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:4100, display:"flex", alignItems:isMobile ? "stretch" : "center", justifyContent:"center", padding:isMobile ? 0 : 16, overflowY:"auto" }}>
      <div style={{ background:"#f5f0e8", border:isMobile ? "none" : "1px solid #ddd8cf", borderRadius:isMobile ? 0 : 12, width:"100%", maxWidth:isMobile ? "100%" : 980, maxHeight:isMobile ? "100vh" : "92vh", overflow:"hidden", boxShadow:isMobile ? "none" : "0 24px 80px rgba(0,0,0,0.45)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #4a5268", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexShrink:0 }}>
          <div>
            <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Edit Profile</div>
            <div style={{ color:"#fff", fontSize:22, fontWeight:900, lineHeight:1.3 }}>{profile?.name || "Profile"}</div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:6, width:40, height:40, fontSize:20, fontWeight:700, cursor:"pointer", lineHeight:1 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding:"22px 24px", overflowY:"auto", flex:"1 1 auto", minHeight:0 }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap:16, marginBottom:18 }}>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Name</div>
              <TextInput value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} style={darkInputStyle} />
            </div>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Office</div>
              <TextInput value={form.office} onChange={e => setForm(prev => ({ ...prev, office: e.target.value }))} style={darkInputStyle} />
            </div>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Level</div>
              <SelectInput value={form.level} onChange={e => setForm(prev => ({ ...prev, level: e.target.value }))} style={darkInputStyle}>
                {PROFILE_LEVEL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </SelectInput>
            </div>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Kind</div>
              <TextInput value={form.kind} onChange={e => setForm(prev => ({ ...prev, kind: e.target.value }))} style={darkInputStyle} />
            </div>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Geography</div>
              <TextInput value={form.geography} onChange={e => setForm(prev => ({ ...prev, geography: e.target.value }))} style={darkInputStyle} />
            </div>
            <div>
              <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Party</div>
              <TextInput value={form.party} onChange={e => setForm(prev => ({ ...prev, party: e.target.value }))} style={darkInputStyle} />
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ color:"#555", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Status Line</div>
            <TextArea rows={3} value={form.status_line} onChange={e => setForm(prev => ({ ...prev, status_line: e.target.value }))} style={darkInputStyle} />
          </div>

          <div style={{ display:"grid", gap:16 }}>
            <div style={{ background:"#f5f0e8", border:"1px solid #C6A34D", borderRadius:10, padding:14 }}>
              <div style={{ color:"#C6A34D", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Rise</div>
              <TextArea rows={5} value={form.decoder.rise} onChange={e => setForm(prev => ({ ...prev, decoder: { ...prev.decoder, rise: e.target.value } }))} style={{ ...darkInputStyle, border:"1px solid #C6A34D" }} />
            </div>
            <div style={{ background:"#f5f0e8", border:"1px solid #2F5D8A", borderRadius:10, padding:14 }}>
              <div style={{ color:"#7ab", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Affiliations</div>
              <TextArea rows={5} value={form.decoder.affiliations} onChange={e => setForm(prev => ({ ...prev, decoder: { ...prev.decoder, affiliations: e.target.value } }))} style={{ ...darkInputStyle, border:"1px solid #2F5D8A" }} />
            </div>
            <div style={{ background:"#f5f0e8", border:"1px solid #7A4FA3", borderRadius:10, padding:14 }}>
              <div style={{ color:"#c7a7e8", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Beneficiaries</div>
              <TextArea rows={5} value={form.decoder.beneficiaries} onChange={e => setForm(prev => ({ ...prev, decoder: { ...prev.decoder, beneficiaries: e.target.value } }))} style={{ ...darkInputStyle, border:"1px solid #7A4FA3" }} />
            </div>
            <div style={{ background:"#f5f0e8", border:"1px solid #B4473E", borderRadius:10, padding:14 }}>
              <div style={{ color:"#e59d97", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Track Record</div>
              <TextArea rows={6} value={form.decoder.track_record} onChange={e => setForm(prev => ({ ...prev, decoder: { ...prev.decoder, track_record: e.target.value } }))} style={{ ...darkInputStyle, border:"1px solid #B4473E" }} />
            </div>
          </div>
        </div>

        <div style={{ padding:"16px 24px", borderTop:"1px solid #ddd8cf", display:"flex", flexDirection:isMobile ? "column-reverse" : "row", justifyContent:"flex-end", gap:12, background:"#f5f0e8", flexShrink:0 }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:6, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer", width:isMobile ? "100%" : "auto" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            style={{ background:saving ? "#888" : "#1a7a3a", color:"#fff", border:"none", borderRadius:6, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:saving ? "not-allowed" : "pointer", minWidth:120, opacity:saving ? 0.7 : 1, width:isMobile ? "100%" : "auto" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Stat Block Renderers ----------------------------------------------------

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

// --- Modals ------------------------------------------------------------------

function ConfirmIssueModal({ card, onConfirm, onCancel, publishing, isMobile = false }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:isMobile ? "flex-end" : "center", justifyContent:"center", padding:isMobile ? 0 : 20 }}>
      <style>{pulseWiggleStyle()}</style>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:isMobile ? "12px 12px 0 0" : 10, width:"100%", maxWidth:580, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", position:isMobile ? "fixed" : "relative", bottom:isMobile ? 0 : "auto", left:isMobile ? 0 : "auto", right:isMobile ? 0 : "auto", animation:isMobile ? "slideUp 0.22s ease-out" : "none" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #ddd8cf" }}>
          <div style={{ color:"#1a7a3a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Confirm Publish</div>
          <div style={{ color:"#1a1a1a", fontSize:18, fontWeight:700 }}>This issue will go live on HSV Civic Watch</div>
          <div style={{ color:"#888", fontSize:13, marginTop:4 }}>Review before confirming.</div>
        </div>
        <div style={{ padding:22 }}><IssueCardMini card={card} /></div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end", flexDirection:isMobile ? "column-reverse" : "row" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700, width:isMobile ? "100%" : "auto" }}>Cancel</button>
          <button onClick={onConfirm} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1, width:isMobile ? "100%" : "auto" }}>
            {publishing ? "Going Live..." : "Confirm & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmStatModal({ card: block, issueCardsForModule, onConfirm, onCancel, publishing, isMobile = false }) {
  const [linkedRef, setLinkedRef] = useState(issueCardsForModule?.[0]?.ref_number || "");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:isMobile ? "flex-end" : "center", justifyContent:"center", padding:isMobile ? 0 : 20 }}>
      <style>{pulseWiggleStyle()}</style>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:isMobile ? "12px 12px 0 0" : 10, width:"100%", maxWidth:520, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", position:isMobile ? "fixed" : "relative", bottom:isMobile ? 0 : "auto", left:isMobile ? 0 : "auto", right:isMobile ? 0 : "auto", animation:isMobile ? "slideUp 0.22s ease-out" : "none" }}>
        <div style={{ padding:"22px 28px", borderBottom:"1px solid #ddd8cf" }}>
          <div style={{ color:"#1a7a3a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Confirm Publish</div>
          <div style={{ color:"#1a1a1a", fontSize:18, fontWeight:700 }}>This visual will go live on HSV Civic Watch</div>
          <div style={{ color:"#888", fontSize:13, marginTop:4 }}>{block.module} -- {block.tab} -- {block.type}</div>
          {issueCardsForModule?.length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ color:"#555", fontSize:13, fontWeight:600, marginBottom:6 }}>Link to Issue Card:</div>
              <select value={linkedRef} onChange={e => setLinkedRef(e.target.value)}
                style={{ width:"100%", background:"#fff", border:"1px solid #ddd8cf", borderRadius:4, padding:"10px 12px", fontSize:13, color:"#1a1a1a", outline:"none" }}>
                <option value="">No link (module-level only)</option>
                {issueCardsForModule.map(ic => (
                  <option key={ic.ref_number} value={ic.ref_number}>{ic.ref_number} -- {ic.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div style={{ padding:22 }}><StatBlockPreview block={block} /></div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end", flexDirection:isMobile ? "column-reverse" : "row" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700, width:isMobile ? "100%" : "auto" }}>Cancel</button>
          <button onClick={() => onConfirm(linkedRef)} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1, width:isMobile ? "100%" : "auto" }}>
            {publishing ? "Going Live..." : "Confirm & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkConfirmModal({ issueCards, statBlocks, onConfirm, onCancel, publishing, isMobile = false }) {
  const total = issueCards.length + statBlocks.length;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:isMobile ? "flex-end" : "center", justifyContent:"center", padding:isMobile ? 0 : 20 }}>
      <style>{pulseWiggleStyle()}</style>
      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:isMobile ? "12px 12px 0 0" : 10, width:"100%", maxWidth:520, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", position:isMobile ? "fixed" : "relative", bottom:isMobile ? 0 : "auto", left:isMobile ? 0 : "auto", right:isMobile ? 0 : "auto", animation:isMobile ? "slideUp 0.22s ease-out" : "none" }}>
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
                <div style={{ color:"#1a5276", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>Stat Block -- {b.type}</div>
                <div style={{ color:"#1a1a1a", fontSize:15, fontWeight:700 }}>{b.label || b.title}</div>
                <div style={{ color:"#888", fontSize:13 }}>{b.module} -- {b.tab}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"18px 28px", borderTop:"1px solid #ddd8cf", display:"flex", gap:12, justifyContent:"flex-end", flexDirection:isMobile ? "column-reverse" : "row" }}>
          <button onClick={onCancel} disabled={publishing} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700, width:isMobile ? "100%" : "auto" }}>Cancel</button>
          <button onClick={onConfirm} disabled={publishing} style={{ background:publishing?"#1a5c2a":"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:publishing?"not-allowed":"pointer", textTransform:"uppercase", letterSpacing:1, width:isMobile ? "100%" : "auto" }}>
            {publishing ? "Going Live..." : "Confirm & Publish All"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Review Row Components ---------------------------------------------------

function IssueRow({ card, selected, onToggle, onApprove, onReject, isMobile = false }) {
  return (
    <div style={{ background:selected?"#fef9ec":"#f5f0e8", border:"2px solid "+(selected?"#b8860b":"#ddd8cf"), borderRadius:10, marginBottom:14, overflow:"hidden", transition:"all 0.15s" }}>
      <div style={{ display:"flex", flexDirection:isMobile ? "column" : "row", alignItems:isMobile ? "stretch" : "center", gap:14, padding:"18px 22px" }}>
        <div style={{ display:"flex", gap:14, alignItems:isMobile ? "flex-start" : "center", flex:1, minWidth:0 }}>
          <input type="checkbox" checked={selected} onChange={onToggle} style={{ width:20, height:20, accentColor:"#b8860b", cursor:"pointer", flexShrink:0, marginTop:isMobile ? 2 : 0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1, minWidth:0 }}>
            <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
              <span style={{ background:"#b8860b", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:3, textTransform:"uppercase" }}>{card.label}</span>
              <span style={{ background:"#e8e4dc", color:"#555", fontSize:11, padding:"3px 9px", borderRadius:3 }}>{card.module}</span>
            </div>
            <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, flex:1, lineHeight:1.3 }}>{card.title}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, width:isMobile ? "100%" : "auto" }}>
          <button onClick={onApprove} style={{ width:isMobile ? "auto" : 46, height:48, borderRadius:isMobile ? 8 : "50%", background:"#e8f5ed", border:"2px solid #1a7a3a", color:"#1a7a3a", fontSize:isMobile ? 15 : 24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:700, flex:isMobile ? 1 : "0 0 auto" }}>&#10003;</button>
          <button onClick={onReject} style={{ width:isMobile ? "auto" : 46, height:48, borderRadius:isMobile ? 8 : "50%", background:"#fef2f2", border:"2px solid #b91c1c", color:"#b91c1c", fontSize:isMobile ? 15 : 24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:700, flex:isMobile ? 1 : "0 0 auto" }}>&#10005;</button>
        </div>
      </div>
      <div style={{ padding:isMobile ? "0 22px 18px" : "0 22px 18px 64px", color:"#555", fontSize:14, lineHeight:1.6 }}>
        {card.summary}
        <ActionBadges actions={card.actions} />
      </div>
    </div>
  );
}

function StatRow({ block, selected, onToggle, onApprove, onReject, isMobile = false }) {
  const [expanded, setExpanded] = useState(false);
  const labels = { "key-number":"Key Number","comparison-bar":"Comparison Bar","pie-chart":"Pie Chart","trend-line":"Trend Line","bar-chart":"Bar Chart","pay-clock":"Pay Clock","zone-map":"Zone Map" };
  const showPreview = isMobile || expanded;
  return (
    <div style={{ background:selected?"#fef9ec":"#f5f0e8", border:"2px solid "+(selected?"#b8860b":"#ddd8cf"), borderRadius:10, marginBottom:14, overflow:"hidden", transition:"all 0.15s" }}>
      <div style={{ display:"flex", flexDirection:isMobile ? "column" : "row", alignItems:isMobile ? "stretch" : "center", gap:14, padding:"18px 22px" }}>
        <div style={{ display:"flex", gap:14, alignItems:isMobile ? "flex-start" : "center", flex:1, minWidth:0 }}>
          <input type="checkbox" checked={selected} onChange={onToggle} style={{ width:20, height:20, accentColor:"#b8860b", cursor:"pointer", flexShrink:0, marginTop:isMobile ? 2 : 0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1, minWidth:0 }}>
            <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
              <span style={{ background:"#1a5276", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:3, textTransform:"uppercase" }}>{labels[block.type] || block.type}</span>
              <span style={{ background:"#e8e4dc", color:"#555", fontSize:11, padding:"3px 9px", borderRadius:3 }}>{block.module}</span>
            </div>
            <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, flex:1 }}>{block.label || block.title}</div>
          </div>
        </div>
        {!isMobile ? <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:"7px 14px", fontSize:13, cursor:"pointer", flexShrink:0, fontWeight:600 }}>{expanded?"Hide":"Preview"}</button> : null}
        <div style={{ display:"flex", gap:12, width:isMobile ? "100%" : "auto" }}>
          <button onClick={onApprove} style={{ width:isMobile ? "auto" : 46, height:48, borderRadius:isMobile ? 8 : "50%", background:"#e8f5ed", border:"2px solid #1a7a3a", color:"#1a7a3a", fontSize:isMobile ? 15 : 24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:700, flex:isMobile ? 1 : "0 0 auto" }}>&#10003;</button>
          <button onClick={onReject} style={{ width:isMobile ? "auto" : 46, height:48, borderRadius:isMobile ? 8 : "50%", background:"#fef2f2", border:"2px solid #b91c1c", color:"#b91c1c", fontSize:isMobile ? 15 : 24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:700, flex:isMobile ? 1 : "0 0 auto" }}>&#10005;</button>
        </div>
      </div>
      <div style={{ padding:isMobile ? "0 22px 12px" : "0 22px 12px 64px", color:"#777", fontSize:13 }}>{block.tab} tab -- {block.context}</div>
      {showPreview && <div style={{ padding:"0 22px 22px" }}><StatBlockPreview block={block} /></div>}
    </div>
  );
}

// --- Published Tab -----------------------------------------------------------

function PublishedIssueCard({ card, onDelete, onEdit, highlight, animate, isMobile = false }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      id={`admin-item-${card.id}`}
      style={{
        background:"#f5f0e8",
        border:"1px solid #ddd8cf",
        borderRadius:10,
        marginBottom:18,
        overflow:"hidden",
      }}
    >
      <div style={{ display:"flex", flexDirection:"column", alignItems:"stretch", gap:12, padding:"22px 24px", minHeight:84 }}>
        <div style={{ display:"flex", alignItems:isMobile ? "flex-start" : "center", gap:12, flexDirection:isMobile ? "column" : "row" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, width:isMobile ? "100%" : "auto" }}>
            <span style={{ background:"#2e3440", color:"#b8860b", fontSize:14, fontWeight:900, padding:"5px 12px", borderRadius:4, fontFamily:"monospace" }}>{card.ref_number}</span>
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
            <span style={{ background:"#b8860b", color:"#fff", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:3, textTransform:"uppercase" }}>{card.label}</span>
          </div>
          <div style={{ color:"#1a1a1a", fontSize:17, fontWeight:700, flex:1, lineHeight:1.3, width:isMobile ? "100%" : "auto" }}>{card.title}</div>
        </div>
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:600, flex:1 }}>{expanded ? "Hide" : "Details"}</button>
          <button onClick={() => onEdit(card)} style={{ background:"#eff6ff", color:"#1a4a7a", border:"1px solid #93c5fd", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:700, flex:1 }}>Edit</button>
          <button onClick={() => onDelete(card)} style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:700, flex:1 }}>Delete</button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding:"0 22px 20px", borderTop:"1px solid #e8e4dc" }}>
          <div style={{ color:"#555", fontSize:15, lineHeight:1.6, marginTop:14 }}>{card.summary}</div>
        </div>
      )}
    </div>
  );
}

function PublishedStatBlock({ block, onDelete, onEdit, highlight, animate, isMobile = false }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = block.strength_score >= 8 ? "#1a7a3a" : block.strength_score >= 5 ? "#b8860b" : "#888";
  return (
    <div
      id={`admin-item-${block.id}`}
      style={{
        background:"#f5f0e8",
        border:"1px solid #ddd8cf",
        borderRadius:10,
        marginBottom:18,
        overflow:"hidden",
      }}
    >
      <div style={{ display:"flex", flexDirection:"column", alignItems:"stretch", gap:12, padding:"22px 24px", minHeight:84 }}>
        <div style={{ display:"flex", alignItems:isMobile ? "flex-start" : "center", gap:12, flexDirection:isMobile ? "column" : "row" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, width:isMobile ? "100%" : "auto" }}>
            <span style={{ background:"#2e3440", color:"#7ab", fontSize:14, fontWeight:900, padding:"5px 12px", borderRadius:4, fontFamily:"monospace" }}>{block.ref_number}</span>
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ background:"#1a5276", color:"#fff", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:3, textTransform:"uppercase" }}>{block.type}</span>
            {block.issue_card_ref && (
              <span style={{ background:"#fef9ec", color:"#b8860b", border:"1px solid #b8860b", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:3 }}>&#8594; {block.issue_card_ref}</span>
            )}
            {block.strength_score && (
              <span style={{ background: scoreColor+"22", color: scoreColor, border:`1px solid ${scoreColor}`, fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:3 }}>&#9733; {block.strength_score}/10</span>
            )}
          </div>
          <div style={{ color:"#1a1a1a", fontSize:17, fontWeight:700, flex:1, width:isMobile ? "100%" : "auto" }}>{block.label || block.title}</div>
        </div>
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          <button onClick={() => setExpanded(v => !v)} style={{ background:"#e8e4dc", color:"#444", border:"1px solid #ddd8cf", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:600, flex:1 }}>{expanded ? "Hide" : "Preview"}</button>
          <button onClick={() => onEdit(block)} style={{ background:"#eff6ff", color:"#1a4a7a", border:"1px solid #93c5fd", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:700, flex:1 }}>Edit</button>
          <button onClick={() => onDelete(block)} style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:isMobile ? "10px 8px" : "8px 16px", fontSize:isMobile ? 12 : 14, cursor:"pointer", fontWeight:700, flex:1 }}>Delete</button>
        </div>
      </div>
      {expanded && <div style={{ padding:"0 22px 22px" }}><StatBlockPreview block={block.data || block} /></div>}
    </div>
  );
}

function PublishedTab({ pubIssues, pubStats, onDeleteIssue, onDeleteStat, onEditIssue, onEditStat, highlightId, animateId, exportStatus, fallbackText, fallbackRef, handleExport, getLastExportLabel, onRerank, rerankRunning, isMobile = false }) {
  const [section, setSection] = useState("issues");




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

  const secBtn = (id) => ({
    background: section === id ? "#2e3440" : "#e8e4dc",
    color: section === id ? "#b8860b" : "#555",
    border: section === id ? "2px solid #b8860b" : "2px solid #ddd8cf",
    borderRadius: 6, padding: "11px 24px", fontSize: 15, fontWeight: 700,
    cursor: "pointer", textTransform: "uppercase", letterSpacing: 1
  });

  return (
    <div>
      <div style={{ display:"flex", flexDirection:isMobile ? "column" : "row", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8 }}>
        <div>
          <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Published</h2>
          <p style={{ color:"#555", fontSize:15, margin:"0 0 12px" }}>{pubIssues.length} issue card(s) &middot; {pubStats.length} stat block(s) live</p>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12, flexWrap:"wrap" }}>
            <button
              onClick={handleExport}
              disabled={exportStatus === "success"}
              style={{
                background: exportStatus === "success" ? "#1a7a3a" : "#b8860b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 700,
                cursor: exportStatus === "success" ? "default" : "pointer",
                letterSpacing: 0.5,
                transition: "background 0.2s",
              }}
            >
              {exportStatus === "success" ? "Copied! Paste into NotebookLM ✓" : "Export for NotebookLM"}
            </button>
            {getLastExportLabel() && exportStatus !== "success" && (
              <span style={{ color:"#555", fontSize:12 }}>Last export: {getLastExportLabel()}</span>
            )}
          </div>
          {exportStatus === "fallback" && (
            <div style={{ marginBottom:12 }}>
              <p style={{ color:"#555", fontSize:12, margin:"0 0 6px" }}>Clipboard blocked — select all and copy manually:</p>
              <textarea
                ref={fallbackRef}
                readOnly
                value={fallbackText}
                style={{
                  width: "100%",
                  minHeight: 120,
                  background: "#f5f0e8",
                  color: "#333",
                  border: "1px solid #ddd8cf",
                  borderRadius: 10,
                  padding: 8,
                  fontSize: 11,
                  fontFamily: "Georgia, serif",
                  resize: "vertical",
                }}
              />
            </div>
          )}
        </div>
        <div style={{ display:"flex", flexDirection:isMobile ? "column" : "row", gap:10, width:isMobile ? "100%" : "auto" }}>
          <button
            onClick={onRerank}
            disabled={rerankRunning}
            style={{ background:"#1a5276", color:"#fff", border:"none", borderRadius:4, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:rerankRunning ? "not-allowed" : "pointer", textTransform:"uppercase", letterSpacing:1, width:isMobile ? "100%" : "auto" }}>
            {rerankRunning ? "Re-ranking..." : "Re-rank All"}
          </button>
          <button
            onClick={async () => {
              if (!window.confirm("Delete ALL published content? This cannot be undone.")) return;
              const allItems = section === "issues" ? pubIssues : pubStats;
              for (const item of allItems) {
                if (section === "issues") await onDeleteIssue(item, true);
                else await onDeleteStat(item, true);
              }
            }}
            style={{ background:"#7f1d1d", color:"#fff", border:"1px solid #b91c1c", borderRadius:4, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, flexShrink:0, width:isMobile ? "100%" : "auto" }}>
            Delete All {section === "issues" ? "Issue Cards" : "Stat Blocks"}
          </button>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:28 }}>
        <button style={secBtn("issues")} onClick={() => setSection("issues")}>Issue Cards ({pubIssues.length})</button>
        <button style={secBtn("stats")} onClick={() => setSection("stats")}>Stat Blocks ({pubStats.length})</button>
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
                <span style={{ background:"#b8860b", color:"#fff", fontSize:13, fontWeight:700, padding:"5px 14px", borderRadius:4, textTransform:"uppercase", letterSpacing:1 }}>{module}</span>
                <span style={{ color:"#aaa", fontSize:14 }}>{cards.length} card{cards.length !== 1 ? "s" : ""}</span>
              </div>
              {cards.map((card, i) => <PublishedIssueCard key={card.id || i} card={card} onDelete={onDeleteIssue} onEdit={onEditIssue} highlight={highlightId === card.id} animate={animateId === card.id} isMobile={isMobile} />)}
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
                <span style={{ background:"#1a5276", color:"#fff", fontSize:13, fontWeight:700, padding:"5px 14px", borderRadius:4, textTransform:"uppercase", letterSpacing:1 }}>{module}</span>
                <span style={{ color:"#aaa", fontSize:14 }}>{blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
              </div>
              {[...blocks].sort((a,b) => (b.strength_score||0)-(a.strength_score||0)).map((block, i) => (
                <PublishedStatBlock key={block.id || i} block={block} onDelete={onDeleteStat} onEdit={onEditStat} highlight={highlightId === block.id} animate={animateId === block.id} isMobile={isMobile} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Social Cards Queue Logic ---
function buildRotationList(cards) {
  const byModule = {};
  cards.forEach(c => {
    const m = c.module || "Unknown";
    if (!byModule[m]) byModule[m] = [];
    byModule[m].push(c);
  });
  const modules = Object.keys(byModule).sort();
  modules.forEach(m => {
    byModule[m].sort((a, b) => (a.ref_number || "").localeCompare(b.ref_number || ""));
  });
  const maxCards = Math.max(...modules.map(m => byModule[m].length));
  const ordered = [];
  for (let cardIdx = 0; cardIdx < maxCards; cardIdx++) {
    for (const mod of modules) {
      if (byModule[mod][cardIdx]) ordered.push(byModule[mod][cardIdx]);
    }
  }
  return ordered;
}

function getQueueState() {
  try { return JSON.parse(localStorage.getItem("hsv_social_queue") || "{}"); }
  catch { return {}; }
}

function saveQueueState(state) {
  localStorage.setItem("hsv_social_queue", JSON.stringify(state));
}

function getCurrentQueueIndex(rotationList) {
  const state = getQueueState();
  if (!state.currentIndex && state.currentIndex !== 0) return 0;
  return state.currentIndex % Math.max(rotationList.length, 1);
}

function advanceQueue(rotationList) {
  const state = getQueueState();
  const current = state.currentIndex || 0;
  const next = (current + 1) % Math.max(rotationList.length, 1);
  saveQueueState({ ...state, currentIndex: next, lastPostedAt: Date.now() });
}

// --- Social Slide Renderer ---

const SLIDE_META = [
  { label:"Hook",     color:"#b8860b", icon:"&#9889;" },
  { label:"Problem",  color:"#c0392b", icon:"&#9888;" },
  { label:"Evidence", color:"#1a5276", icon:"&#128269;" },
  { label:"Link",     color:"#1a7a3a", icon:"&#127760;" },
];

function SocialSlide({ slide, index, imageUrl, slideRef }) {
  const meta = SLIDE_META[index];
  const isLink = index === 3;
  return (
    <div ref={slideRef} style={{
      width:540, height:540,
      background:"linear-gradient(145deg,#0d1117 0%,#1a1f2e 60%,#0a0e1a 100%)",
      border:"2px solid " + meta.color,
      position:"relative", overflow:"hidden",
      display:"flex", flexDirection:"column",
      fontFamily:"Georgia,serif",
      boxShadow:"0 0 40px " + meta.color + "33",
      flexShrink:0
    }}>
      {imageUrl && !isLink && (
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"url(" + imageUrl + ")",
          backgroundSize:"cover", backgroundPosition:"center",
          opacity:0.15, filter:"grayscale(50%)"
        }}/>
      )}
      <div style={{ height:5, background:"linear-gradient(90deg," + meta.color + ",transparent)", flexShrink:0 }}/>
      <div style={{ padding:"10px 18px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid " + meta.color + "33", flexShrink:0, position:"relative" }}>
        <div style={{ background:meta.color, color:"#fff", fontSize:8, fontWeight:900, padding:"3px 8px", borderRadius:2, letterSpacing:2, textTransform:"uppercase" }}>HSV CIVIC WATCH</div>
        <div style={{ color:"#556", fontSize:8, letterSpacing:1, textTransform:"uppercase" }}>Huntsville, AL</div>
        <div style={{ marginLeft:"auto", color:meta.color, fontSize:10, fontWeight:700 }}>{index+1} / 4</div>
      </div>
      <div style={{
        flex:1, padding:"18px 22px",
        display:"flex", flexDirection:"column",
        justifyContent:isLink ? "center" : "flex-start",
        alignItems:isLink ? "center" : "flex-start",
        textAlign:isLink ? "center" : "left",
        position:"relative"
      }}>
        {isLink ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ color:meta.color, fontSize:28, fontWeight:900, letterSpacing:-1, lineHeight:1 }}>HSV<br/>CIVIC<br/>WATCH</div>
            <div style={{ width:36, height:2, background:meta.color }}/>
            <div style={{ color:"#ccc", fontSize:12, lineHeight:1.6, maxWidth:200 }}>{slide.body}</div>
            <div style={{ background:meta.color, color:"#fff", fontSize:11, fontWeight:700, padding:"10px 20px", borderRadius:4, letterSpacing:1, textTransform:"uppercase" }}>
              www.hsvcivicwatch.org
            </div>
          </div>
        ) : (
          <>
            <div style={{ color:meta.color, fontSize:9, fontWeight:700, letterSpacing:3, textTransform:"uppercase", marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
              <span dangerouslySetInnerHTML={{ __html:meta.icon }}/>
              {meta.label}
            </div>
            <div style={{ color:"#fff", fontSize:index===0 ? 19 : 16, fontWeight:900, lineHeight:1.25, marginBottom:12 }}>
              {slide.headline}
            </div>
            {slide.stat && (
              <div style={{ background:meta.color + "22", border:"1px solid " + meta.color, borderLeft:"4px solid " + meta.color, borderRadius:6, padding:"8px 12px", marginBottom:12 }}>
                <div style={{ color:meta.color, fontSize:26, fontWeight:900, lineHeight:1, fontFamily:"Georgia,serif" }}>{slide.stat}</div>
                {slide.statLabel && <div style={{ color:"#ccc", fontSize:10, marginTop:3 }}>{slide.statLabel}</div>}
              </div>
            )}
            <div style={{ color:"#bbb", fontSize:11, lineHeight:1.65, flex:1 }}>{slide.body}</div>
            {index===2 && slide.source && (
              <div style={{ marginTop:10, color:"#556", fontSize:9, fontStyle:"italic", borderTop:"1px solid " + meta.color + "33", paddingTop:7 }}>
                Source: {slide.source}
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ height:3, background:"linear-gradient(90deg,transparent," + meta.color + ")", flexShrink:0 }}/>
    </div>
  );
}

// --- Social Cards Tab ---

function SocialCardsQueue({ pubIssues, pubStats }) {
  const rotationList = buildRotationList(pubIssues);
  const [selectedIndex, setSelectedIndex] = useState(() => getCurrentQueueIndex(rotationList));
  const [slides, setSlides] = useState(null);
  const [imageUrls, setImageUrls] = useState([null, null, null]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(null);
  const [markedPosted, setMarkedPosted] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const slideRef0 = useRef(null);
  const slideRef1 = useRef(null);
  const slideRef2 = useRef(null);
  const slideRef3 = useRef(null);
  const slideRefs = [slideRef0, slideRef1, slideRef2, slideRef3];

  const selectedCard = rotationList[selectedIndex] || null;

  const moduleStats = pubStats
    .filter(s => s.module === selectedCard?.module)
    .sort((a, b) => (b.strength_score || 0) - (a.strength_score || 0))
    .slice(0, 3);

  const queueState = getQueueState();
  const nextPostDate = queueState.lastPostedAt
    ? new Date(queueState.lastPostedAt + 3*24*60*60*1000).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
    : "Ready now";

  const adminSocialFetch = async (body) => {
    const { data } = await supabase.auth.getSession();
    const headers = { "Content-Type": "application/json" };
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    }
    return fetch("/api/admin-social", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  };

  const generateSlides = async () => {
    if (!selectedCard) return;
    setGenerating(true);
    setGenError("");
    setSlides(null);
    setImageUrls([null, null, null]);

    const statSummary = moduleStats.map(s => {
      const d = s.data || s;
      if (d.type === "key-number") return "KEY STAT: " + d.value + " -- " + d.label + " (" + (d.context||"") + ")";
      if (d.type === "comparison-bar") return "COMPARISON: " + d.leftLabel + " " + d.leftValue + " vs " + d.rightLabel + " " + d.rightValue + " " + (d.unit||"") + " -- " + d.title;
      if (d.type === "pay-clock") return "PAY CLOCK: " + d.label + " earns $" + (d.annualAmount||0).toLocaleString() + "/year";
      if (d.type === "trend-line") return "TREND: " + d.title + " -- " + (d.context||"");
      if (d.type === "pie-chart") return "PIE: " + d.title + " -- " + (d.slices||[]).map(sl => (sl.name||sl.label) + " " + sl.value + "%").join(", ");
      if (d.type === "bar-chart") return "BAR CHART: " + d.title;
      return "VISUAL DATA: " + (d.title||d.label||d.type);
    }).join("\n");

    const prompt = `You are the social media writer for HSV Civic Watch, a civic transparency and accountability app for Huntsville, Alabama residents.

Your job is to write a 4-slide Instagram/Facebook post series that exposes a local civic issue in a way that grabs attention, builds understanding, shows evidence, and drives residents to the website for the full story and action steps.

=== ISSUE CARD DATA ===
Module: ${selectedCard.module}
Label: ${selectedCard.label}
Ref: ${selectedCard.ref_number}
Title: ${selectedCard.title}
Summary: ${selectedCard.summary}
Details: ${selectedCard.details || ""}
What's Happening (Decoder): ${selectedCard.decoder?.whatsHappening || ""}
The Connections (Decoder): ${selectedCard.decoder?.connections || ""}
Who Benefits (Decoder): ${selectedCard.decoder?.whoBenefits || ""}
The Impact (Decoder): ${selectedCard.decoder?.impact || ""}
Sources: ${JSON.stringify(selectedCard.sources || [])}

=== SUPPORTING STAT BLOCKS (use these numbers -- they are verified data) ===
${statSummary || "No stat blocks available -- use numbers from the issue card details above."}

=== SLIDE FORMAT RULES ===

SLIDE 1 -- HOOK
Goal: Stop the scroll. Make a Huntsville resident feel this is about them RIGHT NOW.
Choose whichever hook format is most powerful for this specific issue:
  - A bold provocative headline slammed over a photo of the implicated person, building, or entity, with a key stat overlaid on top.
  - Lead with the single most shocking number from the stat blocks formatted as a large visual (e.g. "$4.2M" or "3x more"), with 1-2 punchy context sentences beneath.
  - A provocative question the resident cannot ignore (e.g. "Why is your water bill funding a CEO bonus?").
Use a real named number from the stat blocks if one exists and is powerful.
Headline: Max 12 words. Punchy. Direct. No jargon.
Body: 1-2 sentences. Make the reader need to see slide 2.
Stat: The single strongest number from stat blocks or issue card details. Format it large (e.g. "$4.2M", "87%", "3x higher"). Empty string if nothing strong.
StatLabel: 2-5 words describing the stat. Empty if no stat.
ImageQuery: 5-7 word search for a real photo. Huntsville AL location, named official, corporate building, or government facility directly tied to this issue.

SLIDE 2 -- PROBLEM
Goal: Explain the issue clearly to someone with no background. Name names.
Headline: Who is doing what and why it is wrong. Max 14 words. Name the responsible person, board, or company.
Body: 2-3 sentences. Name the responsible party. Explain the failure or harm. Plain language -- no acronyms without explanation.
No stat on this slide.
ImageQuery: 5-7 words for a photo of the responsible entity: office building, headshot, corporate logo in public context, or the affected location.

SLIDE 3 -- EVIDENCE
Goal: Hard documented proof. Names, dollars, dates, votes, donations, contracts.
Headline: "Here is what the records show" style. Max 14 words. Name names.
Body: 2-3 sentences. Dollar amounts, vote records, contract numbers, donation amounts, specific dates, named individuals only.
Source: Short citation of strongest source (e.g. "Huntsville City Council minutes, March 2024").
ImageQuery: 5-7 words for a photo of the implicated entity, a relevant government building, corporate headquarters, or named official in a public setting.

SLIDE 4 -- LINK
Goal: Drive traffic to hsvcivicwatch.org.
Body: One specific sentence telling the reader what they will find at the site (full sourced story, action steps, who to contact). Not generic -- be specific.

=== VISUAL GUIDANCE FOR IMAGE QUERIES ===
Prioritize in this order:
1. Named Huntsville AL government buildings (City Hall, Madison County Courthouse, Huntsville Utilities building, specific school, etc.)
2. Named officials in a public/professional setting: "[Full Name] Huntsville Alabama"
3. Named corporations or their Huntsville facilities
4. The affected Huntsville neighborhood or location
5. A relevant facility type: "Huntsville Alabama public housing", "Madison County jail exterior"
Never use generic stock photo queries. Always tie the query to Huntsville AL or the named entity.

=== OUTPUT FORMAT ===
Return ONLY valid JSON. No markdown fences. No explanation. No extra text.

{"slides":[{"slideNum":1,"label":"Hook","headline":"...","stat":"...","statLabel":"...","body":"...","imageQuery":"..."},{"slideNum":2,"label":"Problem","headline":"...","stat":"","statLabel":"","body":"...","imageQuery":"..."},{"slideNum":3,"label":"Evidence","headline":"...","stat":"","statLabel":"","body":"...","source":"...","imageQuery":"..."},{"slideNum":4,"label":"Link","headline":"","stat":"","statLabel":"","body":"..."}]}`;

    try {
      const res = await adminSocialFetch({
        action: "slides",
        prompt,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No text response from AI");
      setSlides(data.slides || []);
      const urls = await Promise.all(
        (data.slides || []).slice(0,3).map(s => s.imageQuery ? fetchImage(s.imageQuery) : Promise.resolve(null))
      );
      setImageUrls(urls);
    } catch(e) {
      setGenError("Could not generate slides: " + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const fetchImage = async (query) => {
    try {
      const res = await adminSocialFetch({ action: "image", query });
      const data = await res.json();
      if (!res.ok) return null;
      return data.imageUrl || null;
    } catch { return null; }
  };

  const downloadSlide = async (index) => {
    const el = slideRefs[index]?.current;
    if (!el) return;
    setDownloading(index);
    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const canvas = await window.html2canvas(el, {
        scale:2, useCORS:true, allowTaint:true,
        backgroundColor:null, width:540, height:540
      });
      const link = document.createElement("a");
      link.download = "hsvcivicwatch-slide-" + (index+1) + "-" + SLIDE_META[index].label.toLowerCase() + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch(e) { console.error("Download failed:", e); }
    finally { setDownloading(null); }
  };

  const downloadAll = async () => {
    for (let i = 0; i < 4; i++) {
      await downloadSlide(i);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  const copySlideText = (slide, i) => {
    const lines = [
      "Slide " + (i+1) + ": " + SLIDE_META[i].label,
      slide.headline||"",
      slide.stat ? slide.stat + " -- " + slide.statLabel : "",
      slide.body||"",
      slide.source ? "Source: " + slide.source : "",
      i===3 ? "www.hsvcivicwatch.org" : ""
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines);
    setCopied(i);
    setTimeout(()=>setCopied(null),2000);
  };

  const copyAllText = () => {
    if (!slides) return;
    const all = slides.map((slide,i)=>[
      "== Slide " + (i+1) + ": " + SLIDE_META[i].label + " ==",
      slide.headline||"",
      slide.stat ? slide.stat + " -- " + slide.statLabel : "",
      slide.body||"",
      slide.source ? "Source: " + slide.source : "",
      i===3 ? "www.hsvcivicwatch.org" : ""
    ].filter(Boolean).join("\n")).join("\n\n");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(()=>setCopied(null),2000);
  };

  const handleMarkPosted = () => {
    advanceQueue(rotationList);
    const nextIdx = (selectedIndex + 1) % Math.max(rotationList.length, 1);
    setSelectedIndex(nextIdx);
    setSlides(null);
    setImageUrls([null,null,null]);
    setMarkedPosted(true);
    setTimeout(()=>setMarkedPosted(false),3000);
  };

  if (pubIssues.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"80px 0", color:"#aaa" }}>
        <div style={{ fontSize:44, marginBottom:18 }}>&#128247;</div>
        <div style={{ fontSize:18, marginBottom:8 }}>No published issue cards yet.</div>
        <div style={{ fontSize:14, color:"#556" }}>Publish issue cards first to generate social media content.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 6px" }}>Social Media Content</h2>
          <p style={{ color:"#555", fontSize:15, margin:0 }}>
            Rotation {selectedIndex+1} of {rotationList.length} &middot; Next scheduled: <span style={{ color:"#b8860b", fontWeight:700 }}>{nextPostDate}</span>
          </p>
        </div>
        {slides && (
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"flex-end" }}>
            <button onClick={copyAllText} style={{ background:copied==="all"?"#1a7a3a":"#e8e4dc", color:copied==="all"?"#fff":"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"10px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              {copied==="all"?"Copied!":"Copy All Text"}
            </button>
            <button onClick={downloadAll} style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"10px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Download All 4 PNGs
            </button>
            <button onClick={handleMarkPosted} style={{ background:markedPosted?"#1a7a3a":"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"10px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              {markedPosted ? "Marked! Next card loaded" : "Mark as Posted & Advance"}
            </button>
          </div>
        )}
      </div>

      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:8, padding:"14px 20px", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#b8860b" }}/>
            <span style={{ color:"#b8860b", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Queued</span>
          </div>
          {selectedCard && (
            <>
              <span style={{ color:"#1a1a1a", fontSize:14, fontWeight:700 }}>{selectedCard.ref_number} -- {selectedCard.title}</span>
              <span style={{ background:"#b8860b22", color:"#b8860b", border:"1px solid #b8860b44", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:3, textTransform:"uppercase" }}>{selectedCard.module}</span>
            </>
          )}
        </div>
        {moduleStats.length > 0 && (
          <div style={{ marginTop:8, color:"#555", fontSize:12 }}>
            {moduleStats.length} stat block{moduleStats.length!==1?"s":""} from this module will be used in generation
          </div>
        )}
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ color:"#555", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>
          Rotation Order -- Select to Override
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {rotationList.map((card,i)=>(
            <button key={card.id||i} onClick={()=>{ setSelectedIndex(i); setSlides(null); setImageUrls([null,null,null]); }}
              style={{
                background:selectedIndex===i?"#b8860b":"#e8e4dc",
                color:selectedIndex===i?"#fff":"#555",
                border:selectedIndex===i?"2px solid #b8860b":"2px solid #ddd8cf",
                borderRadius:6, padding:"7px 12px", fontSize:11,
                fontWeight:700, cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"flex-start",
                gap:2, textAlign:"left", maxWidth:170
              }}>
              <span style={{ fontSize:9, opacity:0.7 }}>{card.ref_number} &middot; {card.module}</span>
              <span style={{ fontSize:11, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{card.title}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={generateSlides} disabled={generating||!selectedCard}
        style={{
          background:generating?"#888":"#b8860b",
          color:"#fff", border:"none", borderRadius:6,
          padding:"14px 32px", fontSize:15, fontWeight:700,
          cursor:generating?"not-allowed":"pointer",
          textTransform:"uppercase", letterSpacing:1,
          marginBottom:28, boxShadow:generating?"none":"0 4px 20px rgba(184,134,11,0.4)"
        }}>
        {generating ? "Generating slides + finding images..." : "Generate 4 Social Slides"}
      </button>

      {genError && (
        <div style={{ background:"#2a0a0a", border:"1px solid #c0392b", borderRadius:6, padding:"14px 18px", marginBottom:20, color:"#e57373", fontSize:14 }}>
          {genError}
        </div>
      )}

      {slides && (
        <div>
          <div style={{ color:"#aaa", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>
            Preview -- {selectedCard?.title}
          </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {slides.map((slide,i)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <SocialSlide slide={slide} index={i} imageUrl={imageUrls[i]} slideRef={slideRefs[i]}/>
                <div style={{ width:540, background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:6, padding:"10px 14px" }}>
                  {slide.headline && <div style={{ color:"#1a1a1a", fontWeight:700, marginBottom:4, fontSize:12, fontFamily:"Georgia,serif" }}>{slide.headline}</div>}
                  {slide.stat && <div style={{ color:"#b8860b", fontWeight:700, marginBottom:2, fontSize:12 }}>{slide.stat} {slide.statLabel}</div>}
                  <div style={{ color:"#333", fontSize:11 }}>{slide.body}</div>
                  {slide.source && <div style={{ color:"#555", marginTop:4, fontStyle:"italic", fontSize:11 }}>Source: {slide.source}</div>}
                  {i===3 && <div style={{ color:"#b8860b", fontWeight:700, marginTop:4, fontSize:12 }}>www.hsvcivicwatch.org</div>}
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    <button onClick={()=>copySlideText(slide,i)}
                      style={{ background:copied===i?"#1a7a3a":"#e8e4dc", color:copied===i?"#fff":"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", flex:1 }}>
                      {copied===i?"Copied!":"Copy Text"}
                    </button>
                    <button onClick={()=>downloadSlide(i)} disabled={downloading===i}
                      style={{ background:downloading===i?"#888":"#e8e4dc", color:downloading===i?"#fff":"#555", border:"1px solid #ddd8cf", borderRadius:4, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:downloading===i?"not-allowed":"pointer", flex:1 }}>
                      {downloading===i?"Saving...":"Download PNG"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:8, padding:"16px 20px", marginTop:28, color:"#555", fontSize:13, lineHeight:1.6 }}>
            <strong style={{ color:"#b8860b" }}>Posting workflow:</strong> Download all 4 PNGs, then upload as a multi-image post on Instagram or Facebook. Paste the slide text as your caption. Once posted, click <strong style={{ color:"#f5f0e8" }}>Mark as Posted &amp; Advance</strong> to move the queue to the next card.
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPreviewBadge({ children }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", background:"#efe7da", color:"#1a1a1a", borderRadius:999, padding:"5px 10px", fontSize:11, fontWeight:900, textTransform:"uppercase", letterSpacing:1, marginRight:8 }}>
      {children}
    </span>
  );
}

function AdminPreviewBlock({ borderColor, children }) {
  if (!children) return null;
  return (
    <div style={{ borderLeft:`4px solid ${borderColor}`, paddingLeft:12, marginBottom:10, fontSize:14, color:"#1a1a1a", lineHeight:1.7 }}>
      {children}
    </div>
  );
}

// --- Main Admin Panel --------------------------------------------------------

export default function AdminPanel() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authView, setAuthView] = useState("password");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [passkeyFactorId, setPasskeyFactorId] = useState("");
  const [totpFactorId, setTotpFactorId] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [totpSetup, setTotpSetup] = useState(null);
  const [adminTab, setAdminTab] = useState("issue_cards");
  const [profileAdminTab, setProfileAdminTab] = useState("paste");
  const [activeTab, setActiveTab] = useState("import");
  const [rawPaste, setRawPaste] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [pendingIssues, setPendingIssues] = useState([]);
  const [pendingStats, setPendingStats] = useState([]);
  const [selIssues, setSelIssues] = useState([]);
  const [selStats, setSelStats] = useState([]);
  const [draftIssues, setDraftIssues] = useState([]);
  const [draftStats, setDraftStats] = useState([]);
  const [pasteQueue, setPasteQueue] = useState([]);
  const [queueNotice, setQueueNotice] = useState(0);
  const [pubIssues, setPubIssues] = useState([]);
  const [pubStats, setPubStats] = useState([]);
  const [confirmIssue, setConfirmIssue] = useState(null);
  const [confirmStat, setConfirmStat] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toolsTemplatesOpen, setToolsTemplatesOpen] = useState(false);
  const [toolTemplateCopied, setToolTemplateCopied] = useState({ issue: false, profile: false, blueprint: false });
  const [editConfig, setEditConfig] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [animateId, setAnimateId] = useState(null);
  const [savedToast, setSavedToast] = useState("");
  const [profileRawPaste, setProfileRawPaste] = useState("");
  const [profileParsing, setProfileParsing] = useState(false);
  const [profileParseError, setProfileParseError] = useState("");
  const [parsedProfile, setParsedProfile] = useState(null);
  const [profilePublishSuccess, setProfilePublishSuccess] = useState("");
  const [seats, setSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [seatSearch, setSeatSearch] = useState("");
  const [selectedSeatId, setSelectedSeatId] = useState("");
  const [seatMatches, setSeatMatches] = useState([]);
  const [pubProfiles, setPubProfiles] = useState([]);
  const [pubProfilesLoading, setPubProfilesLoading] = useState(false);
  const [pubProfilesError, setPubProfilesError] = useState("");
  const [profileEditConfig, setProfileEditConfig] = useState(null);
  const [profileEditSaving, setProfileEditSaving] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState("brief");
  const [blueprintInput, setBlueprintInput] = useState("");
  const [blueprintParsing, setBlueprintParsing] = useState(false);
  const [blueprintError, setBlueprintError] = useState("");
  const [parsedBlueprint, setParsedBlueprint] = useState(null);
  const [blueprintPublishSuccess, setBlueprintPublishSuccess] = useState("");
  const [weeklyRunning, setWeeklyRunning] = useState(false);
  const [weeklyResult, setWeeklyResult] = useState(null);
  const [weeklyError, setWeeklyError] = useState("");
  const [weeklyToast, setWeeklyToast] = useState(null);
  const [rerankRunning, setRerankRunning] = useState(false);
  const [exportStatus, setExportStatus] = useState("idle");
  const [fallbackText, setFallbackText] = useState("");
  const fallbackRef = useRef(null);

  const loadPublished = async () => {
    if (!supabase) return;
    try {
      const { data: issues } = await supabase.from('issue_cards').select('*').order('created_at', { ascending: false });
      const { data: stats } = await supabase.from('stat_blocks').select('*').order('strength_score', { ascending: false });
      if (issues) setPubIssues(issues);
      if (stats) setPubStats(stats);
    } catch (e) { console.error("loadPublished error:", e); }
  };

  const loadPublishedProfiles = async () => {
    if (!supabase) return;
    setPubProfilesLoading(true);
    setPubProfilesError("");
    try {
      const { data, error } = await supabase
        .from("official_profiles")
        .select("id, name, office, level, kind, geography, party, status_line, headshot_url, decoder, created_at")
        .order("level", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setPubProfiles(data || []);
    } catch (e) {
      console.error("loadPublishedProfiles error:", e);
      setPubProfilesError(e?.message || "Could not load published profiles.");
    } finally {
      setPubProfilesLoading(false);
    }
  };

  const EXPORT_TS_KEY = "hsv_notebook_export_ts";

  const getLastExportLabel = () => {
    try {
      const ts = localStorage.getItem(EXPORT_TS_KEY);
      if (!ts) return null;
      const d = new Date(parseInt(ts, 10));
      return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    } catch { return null; }
  };

  const buildExportText = () => {
    const lines = [];
    const allIssues = [...pubIssues].sort((a, b) => (a.module || "").localeCompare(b.module || ""));
    allIssues.forEach((card) => {
      lines.push("════════════════════════════════════════");
      lines.push(`REF: ${card.ref_number || "—"}  |  MODULE: ${card.module || "—"}  |  TAB: ${card.tab || "—"}`);
      lines.push(`TITLE: ${card.title || "—"}`);
      lines.push("");
      if (card.summary) { lines.push("SUMMARY:"); lines.push(card.summary); lines.push(""); }
      const statMatches = pubStats.filter(s => s.module === card.module && s.ref_number === card.ref_number);
      if (statMatches.length) {
        lines.push("LINKED STAT BLOCKS:");
        statMatches.forEach(s => {
          lines.push(`  • ${s.label || s.stat_label || "—"}: ${s.value || s.stat_value || "—"}${s.context ? " — " + s.context : ""}`);
        });
        lines.push("");
      }
    });
    lines.push("════════════════════════════════════════");
    lines.push(`Exported from HSV Civic Watch Admin · ${new Date().toLocaleString("en-US")}`);
    return lines.join("\n");
  };

  const handleExport = async () => {
    const text = buildExportText();
    try {
      await navigator.clipboard.writeText(text);
      localStorage.setItem(EXPORT_TS_KEY, Date.now().toString());
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2500);
    } catch {
      setFallbackText(text);
      setExportStatus("fallback");
      setTimeout(() => { if (fallbackRef.current) fallbackRef.current.select(); }, 80);
    }
  };

  const loadSeats = async () => {
    if (!supabase || seats.length) return;
    setSeatsLoading(true);
    try {
      const { data } = await supabase.from("seats").select("id, title, level, jurisdiction, geography").order("level", { ascending: true }).order("title", { ascending: true });
      setSeats(data || []);
    } catch (e) { console.error("loadSeats error:", e); }
    finally { setSeatsLoading(false); }
  };

  const getAdminAuthHeaders = async (baseHeaders = {}) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token
      ? { ...baseHeaders, Authorization: `Bearer ${token}` }
      : { ...baseHeaders };
  };

  const adminJsonFetch = async (url, { body, headers, ...options } = {}) => {
    const nextHeaders = await getAdminAuthHeaders({
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    });

    return fetch(url, {
      ...options,
      headers: nextHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  function resetAuthUi(nextError = "", nextMessage = "") {
    setAuthView("password");
    setAuthError(nextError);
    setAuthMessage(nextMessage);
    setPasskeyFactorId("");
    setTotpFactorId("");
    setTotpSetup(null);
    setMfaCode("");
    setPw("");
  }

  async function grantAdminAccess() {
    setAuthed(true);
    setAuthLoading(false);
    setAuthBusy(false);
    setAuthView("password");
    setAuthError("");
    setAuthMessage("");
    setPasskeyFactorId("");
    setTotpFactorId("");
    setTotpSetup(null);
    setMfaCode("");
    await loadPublished();
    return true;
  }

  async function handlePasskeyChallenge(factorId = passkeyFactorId) {
    if (!factorId) {
      setAuthError("No passkey factor is available for this admin account.");
      return false;
    }

    setAuthBusy(true);
    setAuthError("");
    const { error } = await supabase.auth.mfa.webauthn.authenticate({ factorId });
    if (error) {
      setAuthBusy(false);
      setAuthError(error.message || "Passkey verification did not complete.");
      return false;
    }

    return syncAdminSession({ preferPasskeyPrompt: false });
  }

  async function beginSecondFactor({ preferPasskeyPrompt = false } = {}) {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      setAuthBusy(false);
      setAuthView("password");
      setAuthError(error.message || "Could not load your second-factor options.");
      return false;
    }

    const passkeyFactor = data?.webauthn?.[0] || null;
    const totpFactor = data?.totp?.[0] || null;

    setPasskeyFactorId(passkeyFactor?.id || "");
    setTotpFactorId(totpFactor?.id || "");
    setTotpSetup(null);
    setMfaCode("");

    if (passkeyFactor && preferPasskeyPrompt) {
      const completed = await handlePasskeyChallenge(passkeyFactor.id);
      if (completed) return true;
    }

    setAuthBusy(false);
    setAuthError("");

    if (passkeyFactor && totpFactor) {
      setAuthView("mfa-choice");
      setAuthMessage("Approve with your passkey or enter your authenticator code to continue.");
      return false;
    }

    if (passkeyFactor) {
      setAuthView("mfa-passkey");
      setAuthMessage("Approve the sign-in with your iPhone or saved passkey before entering the admin panel.");
      return false;
    }

    if (totpFactor) {
      setAuthView("mfa-totp");
      setAuthMessage("Enter the 6-digit code from your authenticator app.");
      return false;
    }

    setAuthView("setup-choice");
    setAuthMessage("Set up a second factor before the admin panel will open.");
    return false;
  }

  async function syncAdminSession({ preferPasskeyPrompt = false } = {}) {
    if (!supabase) {
      setAuthLoading(false);
      setAuthBusy(false);
      return false;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setAuthed(false);
      setAuthLoading(false);
      setAuthBusy(false);
      resetAuthUi();
      return false;
    }

    const res = await adminJsonFetch("/api/admin-session", { method: "GET" });
    const payload = await res.json();

    if (!payload.authenticated) {
      await supabase.auth.signOut();
      setAuthed(false);
      setAuthLoading(false);
      setAuthBusy(false);
      resetAuthUi(payload.error || "Admin access was denied for this session.");
      return false;
    }

    if (payload.aal === "aal2") {
      return grantAdminAccess();
    }

    setAuthed(false);
    setAuthLoading(false);
    return beginSecondFactor({ preferPasskeyPrompt });
  }

  async function handleLogin() {
    if (!pw.trim()) {
      setAuthError("Enter your admin password.");
      return;
    }

    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Could not sign in.");

      const { error } = await supabase.auth.setSession(payload.session);
      if (error) throw error;

      setPw("");
      await syncAdminSession({ preferPasskeyPrompt: true });
    } catch (error) {
      setAuthBusy(false);
      setAuthError(String(error?.message || "Could not sign in."));
    }
  }

  async function handleForgotPassword() {
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const res = await fetch("/api/admin-reset", { method: "POST" });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Could not send a reset link.");

      setAuthMessage(payload.message || "Reset link sent to your admin recovery inbox.");
    } catch (error) {
      setAuthError(String(error?.message || "Could not send a reset link."));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleTotpChallenge() {
    const factorId = totpSetup?.id || totpFactorId;
    if (!factorId) {
      setAuthError("No authenticator factor is ready yet.");
      return;
    }
    if (!mfaCode.trim()) {
      setAuthError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setAuthBusy(true);
    setAuthError("");

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: mfaCode.trim(),
    });

    if (error) {
      setAuthBusy(false);
      setAuthError(error.message || "That code could not be verified.");
      return;
    }

    setMfaCode("");
    setTotpSetup(null);
    await syncAdminSession({ preferPasskeyPrompt: false });
  }

  async function handleStartPasskeySetup() {
    setAuthBusy(true);
    setAuthError("");

    const { error } = await supabase.auth.mfa.webauthn.register({
      friendlyName: ADMIN_PASSKEY_NAME,
    });

    if (error) {
      setAuthBusy(false);
      setAuthError(error.message || "Could not register the passkey second factor.");
      return;
    }

    await syncAdminSession({ preferPasskeyPrompt: false });
  }

  async function handleStartTotpSetup() {
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "HSV Civic Watch",
      friendlyName: ADMIN_TOTP_NAME,
    });

    if (error) {
      setAuthBusy(false);
      setAuthError(error.message || "Could not start authenticator setup.");
      return;
    }

    setTotpSetup({
      id: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
    setAuthBusy(false);
    setAuthView("setup-totp");
    setAuthMessage("Scan the QR code or enter the secret on your phone, then confirm with the 6-digit code.");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthed(false);
    setPubIssues([]);
    setPubStats([]);
    resetAuthUi();
  }

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let active = true;

    const boot = async () => {
      if (!active) return;
      await syncAdminSession({ preferPasskeyPrompt: false });
    };

    boot();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setAuthed(false);
        setAuthLoading(false);
        setAuthBusy(false);
        resetAuthUi();
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        syncAdminSession({ preferPasskeyPrompt: false });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authed) return;

    let timer = null;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await supabase.auth.signOut();
        setAuthed(false);
        setPubIssues([]);
        setPubStats([]);
        resetAuthUi("Session expired due to inactivity. Please sign in again.");
      }, 10 * 60 * 1000);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [authed]);

  useEffect(() => {
    if (adminTab === "profiles") loadSeats();
    if (adminTab === "profiles" && profileAdminTab === "published") {
      loadPublishedProfiles();
    }
  }, [adminTab, profileAdminTab]);

  const generateRefNumber = async (module, type) => {
    if (!supabase) return `XX-${type === "issue" ? "IC" : "SB"}-1`;
    const prefix = getPrefix(module);
    const table = type === "issue" ? "issue_cards" : "stat_blocks";
    const suffix = type === "issue" ? "IC" : "SB";
    const { data } = await supabase.from(table).select('ref_number').like('ref_number', `${prefix}-${suffix}-%`);
    const nextNum = (data?.length || 0) + 1;
    return `${prefix}-${suffix}-${nextNum}`;
  };

  const scoreStatBlocks = async (blocks, module) => {
    try {
      const res = await adminJsonFetch("/api/score", {
        method: "POST",
        body: { statBlocks: blocks, module }
      });
      const data = await res.json();
      return data.scores || [];
    } catch { return []; }
  };

  const handleParse = async () => {
    if (!rawPaste.trim()) return;
    const BATCH_SIZE = 3;
    // Split raw paste into individual card blocks
    const cardBlocks = rawPaste.split("--- ISSUE CARD START ---").slice(1).map(b => "--- ISSUE CARD START ---" + b.split("--- ISSUE CARD END ---")[0] + "--- ISSUE CARD END ---");
    const statBlocks = rawPaste.split("--- STAT BLOCK START ---").slice(1).map(b => "--- STAT BLOCK START ---" + b.split("--- STAT BLOCK END ---")[0] + "--- STAT BLOCK END ---");
    const firstBatchCards = cardBlocks.slice(0, BATCH_SIZE);
    const overflowCards = cardBlocks.slice(BATCH_SIZE);
    // Queue overflow in groups of 3
    if (overflowCards.length > 0) {
      const batches = [];
      for (let i = 0; i < overflowCards.length; i += BATCH_SIZE) {
        batches.push(overflowCards.slice(i, i + BATCH_SIZE));
      }
      setPasteQueue(p => [...p, ...batches]);
      setQueueNotice(overflowCards.length);
    }
    const sep = "\n\n"; const firstBatchPaste = firstBatchCards.join(sep) + (statBlocks.length ? sep + statBlocks.join(sep) : "");
    setParsing(true); setParseError("");
    setPendingIssues([]); setPendingStats([]);
    setSelIssues([]); setSelStats([]);
    try {
      const res = await adminJsonFetch("/api/parse", {
        method: "POST",
        body: { rawPaste: firstBatchPaste }
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
      setRawPaste("");
    } catch (e) {
      setParseError("Could not parse content. Error: " + e.message);
    } finally { setParsing(false); }
  };

  const processBatch = async (batchIndex) => {
    const batch = pasteQueue[batchIndex];
    if (!batch) return;
    const sep2 = "\n\n"; const batchPaste = batch.join(sep2);

    setParsing(true); setParseError("");
    try {
      const res = await adminJsonFetch("/api/parse", {
        method: "POST",
        body: { rawPaste: batchPaste }
      });
      const parsed = await res.json();
      if (!res.ok) throw new Error(parsed.error || "Parse failed");
      const issues = parsed.issueCards || [];
      const stats  = parsed.statBlocks  || [];
      setPendingIssues(issues);
      setPendingStats(stats);
      setSelIssues(issues.map((_, i) => i));
      setSelStats(stats.map((_, i) => i));
      setPasteQueue(p => p.filter((_, i) => i !== batchIndex));
      setActiveTab("review");
    } catch (e) {
      setParseError("Could not parse batch. Error: " + e.message);
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
    if (!supabase) return;
    setPublishing(true);
    try {
      const ref_number = await generateRefNumber(confirmIssue.module, "issue");
      const { error, data } = await supabase.from('issue_cards').insert({
        module: confirmIssue.module, label: confirmIssue.label,
        title: confirmIssue.title, summary: confirmIssue.summary,
        details: confirmIssue.details, sources: confirmIssue.sources,
        decoder: confirmIssue.decoder, actions: confirmIssue.actions,
        visual_score: confirmIssue.visual_score || confirmIssue.inline_visual_score || 0,
        visual_config: confirmIssue.visual_config || null,
        tab: confirmIssue.tab || null,
        tabs: Array.isArray(confirmIssue.tabs) ? confirmIssue.tabs : (confirmIssue.tab ? [confirmIssue.tab] : ["overview"]),
        show_on_overview: confirmIssue.show_on_overview || false,
        shock_score: confirmIssue.shock_score || null,
        module_relevance_score: confirmIssue.module_relevance_score || null,
        inline_visual_score: confirmIssue.inline_visual_score || confirmIssue.visual_score || null,
        homepage_score: confirmIssue.homepage_score || null,
        homepage_teaser: confirmIssue.homepage_teaser || "",
        published_at: new Date().toISOString(),
        ref_number
      }).select();
      if (!error && data) {
        setPubIssues(p => [data[0], ...p]);
        setPendingIssues(p => p.filter(c => c !== confirmIssue));
      }
    } catch(e) { console.error("confirmSingleIssue error:", e); }
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
    if (!supabase) return;
    setPublishing(true);
    try {
      const ref_number = await generateRefNumber(confirmStat.module, "stat");
      const scores = confirmStat.strength_score
        ? []
        : await scoreStatBlocks([{ ...confirmStat, ref_number }], confirmStat.module);
      const score = confirmStat.strength_score || scores.find(s => s.ref_number === ref_number)?.score || null;
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
        rescoreModule(confirmStat.module);
      }
    } catch(e) { console.error("confirmSingleStat error:", e); }
    setSelStats([]); setConfirmStat(null); setPublishing(false);
  };

  const rescoreModule = async (module) => {
    if (!supabase) return;
    try {
      const { data: moduleStats } = await supabase.from('stat_blocks').select('*').eq('module', module);
      if (!moduleStats?.length) return;
      const scores = await scoreStatBlocks(moduleStats.map(s => ({ ...s.data, ref_number: s.ref_number })), module);
      for (const score of scores) {
        await supabase.from('stat_blocks').update({ strength_score: score.score }).eq('ref_number', score.ref_number);
      }
      const { data: updated } = await supabase.from('stat_blocks').select('*').order('strength_score', { ascending: false });
      if (updated) setPubStats(updated);
    } catch(e) { console.error("rescoreModule error:", e); }
  };

  const handleBulkPublish = () => {
    if (selIssues.length + selStats.length > 0) setConfirmBulk(true);
  };

  const confirmBulkPublish = async () => {
    if (!supabase) return;
    setPublishing(true);
    const issuesToPub = selIssues.map(i => pendingIssues[i]);
    const statsToPub = selStats.map(i => pendingStats[i]);
    const newPubIssues = [];
    const newPubStats = [];
    try {
      for (const card of issuesToPub) {
        const ref_number = await generateRefNumber(card.module, "issue");
        const { data } = await supabase.from('issue_cards').insert({
          module: card.module, label: card.label, title: card.title,
          summary: card.summary, details: card.details, sources: card.sources,
          decoder: card.decoder, actions: card.actions,
          visual_score: card.visual_score || card.inline_visual_score || 0,
          visual_config: card.visual_config || null,
          tab: card.tab || null,
          tabs: Array.isArray(card.tabs) ? card.tabs : (card.tab ? [card.tab] : ["overview"]),
          show_on_overview: card.show_on_overview || false,
          shock_score: card.shock_score || null,
          module_relevance_score: card.module_relevance_score || null,
          inline_visual_score: card.inline_visual_score || card.visual_score || null,
          homepage_score: card.homepage_score || null,
          homepage_teaser: card.homepage_teaser || "",
          published_at: new Date().toISOString(),
          ref_number
        }).select();
        if (data) newPubIssues.push(data[0]);
      }
      for (const block of statsToPub) {
        const ref_number = await generateRefNumber(block.module, "stat");
        const scores = block.strength_score
          ? []
          : await scoreStatBlocks([{ ...block, ref_number }], block.module);
        const score = block.strength_score || scores[0]?.score || null;
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
      const affectedModules = [...new Set(statsToPub.map(b => b.module))];
      for (const mod of affectedModules) await rescoreModule(mod);
    } catch(e) { console.error("confirmBulkPublish error:", e); }
    setSelIssues([]); setSelStats([]); setConfirmBulk(false); setPublishing(false);
  };

  const handleDeleteIssue = async (card, silent = false) => {
    if (!supabase) return;
    if (!silent && !window.confirm(`Delete "${card.title}"? This cannot be undone.`)) return;
    try {
      await supabase.from('issue_cards').delete().eq('id', card.id);
      setPubIssues(p => p.filter(c => c.id !== card.id));
    } catch(e) { console.error("deleteIssue error:", e); }
  };

  const handleDeleteStat = async (block, silent = false) => {
    if (!supabase) return;
    if (!silent && !window.confirm(`Delete "${block.label || block.title}"? This cannot be undone.`)) return;
    try {
      await supabase.from('stat_blocks').delete().eq('id', block.id);
      setPubStats(p => p.filter(b => b.id !== block.id));
    } catch(e) { console.error("deleteStat error:", e); }
  };

  const openIssueEdit = (card) => setEditConfig({ itemType: "issue_card", item: card });
  const openStatEdit = (block) => setEditConfig({ itemType: "stat_block", item: block });

  const flashUpdatedItem = (id) => {
    setHighlightId(id);
    setAnimateId(null);

    setTimeout(() => {
      const el = document.getElementById(`admin-item-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 40);

    setTimeout(() => {
      setAnimateId(id);
    }, 420);

    setTimeout(() => setAnimateId(null), 3400);
    setTimeout(() => setHighlightId(null), 7200);
  };

  const handleSaveEdit = async (config, updates) => {
    setEditSaving(true);
    try {
      const res = await adminJsonFetch("/api/update", {
        method: "POST",
        body: {
          itemType: config.itemType,
          id: config.item.id,
          updates
        }
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Update failed");

      if (config.itemType === "issue_card") {
        setPubIssues(prev => prev.map(item => item.id === payload.item.id ? payload.item : item));
        if (Array.isArray(payload.cascaded_stats) && payload.cascaded_stats.length) {
          setPubStats(prev => {
            const ids = new Set(payload.cascaded_stats.map(s => s.id));
            const kept = prev.filter(item => !ids.has(item.id));
            return [...payload.cascaded_stats, ...kept];
          });
        }
      } else {
        setPubStats(prev => prev.map(item => item.id === payload.item.id ? payload.item : item));
      }

      setSavedToast("Saved successfully");
      setTimeout(() => setSavedToast(""), 3000);
      setEditConfig(null);
      flashUpdatedItem(payload.item.id);
    } catch (e) {
      window.alert("Save failed: " + e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const toggleIssue = (i) => setSelIssues(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleStat = (i) => setSelStats(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleAllIssues = () => setSelIssues(selIssues.length === pendingIssues.length ? [] : pendingIssues.map((_,i) => i));
  const toggleAllStats = () => setSelStats(selStats.length === pendingStats.length ? [] : pendingStats.map((_,i) => i));
  const copyToolTemplate = async (type, text) => {
    await navigator.clipboard.writeText(text);
    setToolTemplateCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setToolTemplateCopied((prev) => ({ ...prev, [type]: false })), 2000);
  };

  const handleParseProfile = async (mode) => {
    if (!profileRawPaste.trim()) return;
    const nextSeatId = selectedSeatId;
    setSelectedSeatId("");
    setSeatSearch("");
    setSeatMatches([]);
    setProfileParsing(true);
    setProfileParseError("");
    setProfilePublishSuccess("");

    try {
      const res = await adminJsonFetch("/api/parse-profile", {
        method: "POST",
        body: { rawPaste: profileRawPaste, mode, profileId: null, seatId: mode === "publish" ? (nextSeatId || null) : null }
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Profile parse failed");
      setParsedProfile(payload.profile || null);
      await autoMatchSeat(payload.profile);
      if (mode === "publish") {
        setProfilePublishSuccess("Published successfully");
      }
    } catch (error) {
      setProfileParseError(String(error?.message || "Profile parse failed"));
    } finally {
      setProfileParsing(false);
    }
  };

  const autoMatchSeat = async (profile) => {
    if (!supabase || !profile) return;
    const officeRole = profile.office || profile.role_label || "";
    const jurisdiction = profile.jurisdiction || profile.geography || "";

    let { data: exactMatches } = await supabase
      .from("seats")
      .select("id, title, level, jurisdiction, geography")
      .ilike("title", `%${officeRole}%`)
      .limit(3);

    if (!exactMatches?.length && jurisdiction) {
      const { data: fallback } = await supabase
        .from("seats")
        .select("id, title, level, jurisdiction, geography")
        .ilike("jurisdiction", `%${jurisdiction}%`)
        .limit(3);
      exactMatches = fallback;
    }

    if (exactMatches?.length === 1) {
      setSelectedSeatId(exactMatches[0].id);
      setSeatSearch(exactMatches[0].title);
      setSeatMatches([]);
    } else if (exactMatches?.length > 1) {
      setSeatMatches(exactMatches);
    } else {
      setSeatMatches([]);
    }
  };

  const handleSaveProfileEdit = async (fields) => {
    if (!profileEditConfig) return;
    setProfileEditSaving(true);
    try {
      const res = await adminJsonFetch("/api/update.js", {
        method: "POST",
        body: {
          table: "official_profiles",
          id: profileEditConfig.id,
          fields
        }
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Update failed");

      setPubProfiles(prev => prev.map(item => item.id === payload.item.id ? payload.item : item));
      setSavedToast("Saved successfully");
      setTimeout(() => setSavedToast(""), 3000);
      setProfileEditConfig(null);
    } catch (e) {
      window.alert("Save failed: " + e.message);
    } finally {
      setProfileEditSaving(false);
    }
  };

  const handleDeleteProfile = async (profile) => {
    if (!supabase) return;
    if (!window.confirm(`Delete "${profile.name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from("official_profiles").delete().eq("id", profile.id);
      if (error) throw error;
      setPubProfiles(prev => prev.filter(item => item.id !== profile.id));
    } catch (e) {
      window.alert("Delete failed: " + (e?.message || "Unknown error"));
    }
  };

  const handleParseBlueprint = async (mode) => {
    if (!blueprintInput.trim()) return;
    setBlueprintParsing(true);
    setBlueprintError("");
    setBlueprintPublishSuccess("");

    try {
      const res = await adminJsonFetch("/api/parse-blueprint", {
        method: "POST",
        body: {
          input: blueprintInput,
          inputMode: blueprintMode === "brief" ? "brief" : "template",
          mode,
          blueprintId: null
        }
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Blueprint parse failed");
      setParsedBlueprint(payload.blueprint || null);
      if (mode === "publish") {
        setBlueprintPublishSuccess("Published successfully");
      }
    } catch (error) {
      setBlueprintError(String(error?.message || "Blueprint parse failed"));
    } finally {
      setBlueprintParsing(false);
    }
  };

  const handleRunWeeklyJob = async () => {
    setWeeklyRunning(true);
    setWeeklyError("");
    setWeeklyResult(null);

    try {
      const res = await adminJsonFetch("/api/cron-weekly", {
        method: "POST"
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Weekly job failed");
      setWeeklyResult(payload);
    } catch (error) {
      setWeeklyError(String(error?.message || "Weekly job failed"));
    } finally {
      setWeeklyRunning(false);
    }
  };

  const handleRerank = async () => {
    if (!supabase) return;
    setRerankRunning(true);
    try {
      const { data: issues } = await supabase
        .from("issue_cards")
        .select("id, shock_score, module_relevance_score");

      for (const issue of issues || []) {
        const shock = Math.max(1, Math.min(10, issue.shock_score || 1));
        const relevance = Math.max(1, Math.min(10, issue.module_relevance_score || 1));
        const homepageScore = Math.max(1, Math.min(10, Math.round(
          (shock * 0.70) + (10 * 0.20) + (relevance * 0.10)
        )));
        await supabase
          .from("issue_cards")
          .update({ homepage_score: homepageScore })
          .eq("id", issue.id);
      }
      await loadPublished();
      setSavedToast("Re-rank complete — homepage scores updated");
      setTimeout(() => setSavedToast(""), 3000);
    } catch (e) {
      setSavedToast("Re-rank failed: " + e.message);
      setTimeout(() => setSavedToast(""), 4000);
    } finally {
      setRerankRunning(false);
    }
  };

  useEffect(() => {
    if (!weeklyResult) return;
    setWeeklyToast({
      type: "success",
      message: `Rescored: ${weeklyResult.rescored} · Flagged: ${weeklyResult.stale_flagged}`,
    });
    const id = setTimeout(() => setWeeklyToast(null), 5000);
    return () => clearTimeout(id);
  }, [weeklyResult]);

  useEffect(() => {
    if (!weeklyError) return;
    setWeeklyToast({
      type: "error",
      message: weeklyError,
    });
    const id = setTimeout(() => setWeeklyToast(null), 5000);
    return () => clearTimeout(id);
  }, [weeklyError]);

  const totalPending = pendingIssues.length + pendingStats.length;
  const totalSel = selIssues.length + selStats.length;
  const totalDrafts = draftIssues.length + draftStats.length + pasteQueue.reduce((a, b) => a + b.length, 0);

  const tabStyle = (id) => ({
    background: "none",
    border: "none",
    borderBottom: activeTab===id ? "3px solid #b8860b" : "3px solid transparent",
    color: activeTab===id ? "#b8860b" : "#aaa",
    padding: isMobile ? "12px 14px" : "12px 20px",
    fontSize: isMobile ? 12 : 13,
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 0,
  });
  const adminTabStyle = (id) => ({
    background:"transparent",
    border:"none",
    borderBottom: adminTab === id ? "3px solid #b8860b" : "3px solid transparent",
    padding:isMobile ? "12px 14px" : "14px 20px",
    fontSize:isMobile ? 12 : 14,
    fontWeight:900,
    cursor:"pointer",
    color: adminTab === id ? "#b8860b" : "#aaa",
    transition:"color 0.15s",
    marginBottom: adminTab === id ? -2 : 0,
  });

  const issueCardsForStatModule = confirmStat
    ? pubIssues.filter(ic => ic.module === confirmStat.module)
    : [];

  // Queue notice modal
  const QueueNoticeModal = queueNotice > 0 ? (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#353b48", border:"1px solid #b8860b", borderRadius:10, width:"100%", maxWidth:460, padding:"28px 32px", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Holding Cell</div>
        <div style={{ color:"#fff", fontSize:18, fontWeight:700, marginBottom:10 }}>{queueNotice} card{queueNotice !== 1 ? "s" : ""} moved to the queue</div>
        <div style={{ color:"#aaa", fontSize:14, lineHeight:1.6, marginBottom:20 }}>
          You pasted more than 3 cards. The first 3 are in Review now. The rest have been shelved in the Drafts tab under <strong style={{ color:"#b8860b" }}>Paste Research Queue</strong>, grouped in batches of 3. Process them whenever you are ready.
        </div>
        <button onClick={() => setQueueNotice(0)}
          style={{ background:"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
          Got It
        </button>
      </div>
    </div>
  ) : null;

  const renderAuthContent = () => {
    const inputStyle = {
      width:"100%",
      background:"#2e3440",
      border:"1px solid #4a5268",
      borderRadius:6,
      padding:"15px 16px",
      color:"#fff",
      fontSize:16,
      boxSizing:"border-box",
      outline:"none",
      marginBottom:12,
    };

    const primaryButtonStyle = {
      width:"100%",
      background:authBusy ? "#6b7280" : "#b8860b",
      color:"#fff",
      border:"none",
      borderRadius:6,
      padding:15,
      fontSize:15,
      fontWeight:700,
      cursor:authBusy ? "not-allowed" : "pointer",
      textTransform:"uppercase",
      letterSpacing:1.5,
    };

    const secondaryButtonStyle = {
      width:"100%",
      background:"#2e3440",
      color:"#d8c08a",
      border:"1px solid #6c5a2d",
      borderRadius:6,
      padding:14,
      fontSize:14,
      fontWeight:700,
      cursor:authBusy ? "not-allowed" : "pointer",
      textTransform:"uppercase",
      letterSpacing:1.2,
    };

    return (
      <>
        {authLoading ? (
          <div style={{ color:"#ccc", fontSize:15, textAlign:"center", lineHeight:1.7 }}>
            Checking the current admin session...
          </div>
        ) : null}

        {!authLoading && authView === "password" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              Enter your password first. A second factor is required every time before the admin panel opens.
            </div>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !authBusy && handleLogin()}
              style={{ ...inputStyle, border:`1px solid ${authError ? "#e53e3e" : "#4a5268"}` }}
            />
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={handleLogin} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Checking..." : "Enter"}
            </button>
            <button
              onClick={handleForgotPassword}
              disabled={authBusy}
              style={{ ...secondaryButtonStyle, marginTop:12 }}
            >
              {authBusy ? "Sending..." : "Reset Password Link"}
            </button>
          </>
        ) : null}

        {!authLoading && authView === "mfa-passkey" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              Approve this sign-in with your saved passkey. On Apple devices this can trigger the iPhone or iCloud Keychain approval prompt.
            </div>
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={() => handlePasskeyChallenge()} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Waiting For Approval..." : "Approve With Passkey"}
            </button>
            <button
              onClick={() => resetAuthUi()}
              disabled={authBusy}
              style={{ ...secondaryButtonStyle, marginTop:12 }}
            >
              Back To Password
            </button>
          </>
        ) : null}

        {!authLoading && authView === "mfa-choice" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              Finish the second step before entering the admin panel.
            </div>
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={() => handlePasskeyChallenge()} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Waiting For Approval..." : "Approve With Passkey"}
            </button>
            <button
              onClick={() => { setAuthError(""); setAuthView("mfa-totp"); }}
              disabled={authBusy}
              style={{ ...secondaryButtonStyle, marginTop:12 }}
            >
              Use Authenticator Code Instead
            </button>
          </>
        ) : null}

        {!authLoading && authView === "mfa-totp" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              Enter the 6-digit code from your authenticator app to finish signing in.
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={e => e.key === "Enter" && !authBusy && handleTotpChallenge()}
              style={{ ...inputStyle, textAlign:"center", letterSpacing:8 }}
            />
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={handleTotpChallenge} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Verifying..." : "Verify Code"}
            </button>
            {passkeyFactorId ? (
              <button
                onClick={() => { setAuthError(""); setAuthView("mfa-passkey"); }}
                disabled={authBusy}
                style={{ ...secondaryButtonStyle, marginTop:12 }}
              >
                Use Passkey Instead
              </button>
            ) : null}
          </>
        ) : null}

        {!authLoading && authView === "setup-choice" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              This admin account needs a second factor before it can be used. The passkey option is the closest match to the iPhone approval flow you asked for.
            </div>
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={handleStartPasskeySetup} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Starting..." : "Set Up iPhone / Passkey MFA"}
            </button>
            <button
              onClick={handleStartTotpSetup}
              disabled={authBusy}
              style={{ ...secondaryButtonStyle, marginTop:12 }}
            >
              Use Authenticator App Instead
            </button>
          </>
        ) : null}

        {!authLoading && authView === "setup-totp" ? (
          <>
            <div style={{ color:"#aaa", fontSize:14, lineHeight:1.7, marginBottom:18, textAlign:"center" }}>
              Scan this QR code with your authenticator app, then confirm the 6-digit code below.
            </div>
            {totpSetup?.qrCode ? (
              <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(totpSetup.qrCode)}`}
                  alt="Admin MFA QR code"
                  style={{ width:180, height:180, background:"#fff", padding:12, borderRadius:10 }}
                />
              </div>
            ) : null}
            {totpSetup?.secret ? (
              <div style={{ background:"#2e3440", border:"1px solid #4a5268", borderRadius:8, padding:"12px 14px", color:"#eee", fontFamily:"monospace", fontSize:13, lineHeight:1.6, marginBottom:14, wordBreak:"break-all" }}>
                Secret: {totpSetup.secret}
              </div>
            ) : null}
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={e => e.key === "Enter" && !authBusy && handleTotpChallenge()}
              style={{ ...inputStyle, textAlign:"center", letterSpacing:8 }}
            />
            {authError ? <div style={{ color:"#f5b7b1", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authError}</div> : null}
            {authMessage ? <div style={{ color:"#d8c08a", fontSize:14, marginBottom:12, lineHeight:1.6 }}>{authMessage}</div> : null}
            <button onClick={handleTotpChallenge} disabled={authBusy} style={primaryButtonStyle}>
              {authBusy ? "Verifying..." : "Enable Authenticator MFA"}
            </button>
            <button
              onClick={() => { setAuthError(""); setAuthView("setup-choice"); }}
              disabled={authBusy}
              style={{ ...secondaryButtonStyle, marginTop:12 }}
            >
              Back
            </button>
          </>
        ) : null}
      </>
    );
  };

  if (!authed) {
    return (
      <div style={{ minHeight:"100vh", background:"#2e3440", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif" }}>
        <div style={{ width:440, padding:52, background:"#353b48", border:"1px solid #4a5268", borderRadius:12, boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ color:"#b8860b", fontSize:12, fontWeight:700, letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>HSV Civic Watch</div>
            <div style={{ color:"#fff", fontSize:28, fontWeight:700, marginBottom:14 }}>Content Admin</div>
            <div style={{ color:"#e53e3e", fontSize:18, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>&#9888; Restricted Access</div>
          </div>
          {renderAuthContent()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#2e3440", fontFamily:"Georgia,serif", color:"#1a1a1a" }}>
      {QueueNoticeModal}
      {savedToast ? (
        <div style={{ position:"fixed", top:18, right:18, zIndex:5000, background:"#dfeee5", color:"#1a7a3a", border:"1px solid rgba(62,139,91,0.35)", borderRadius:8, padding:"12px 16px", fontSize:14, fontWeight:700, boxShadow:"0 10px 28px rgba(0,0,0,0.18)" }}>
          {savedToast}
        </div>
      ) : null}
      {weeklyToast ? (
        <div
          style={{
            position:"fixed",
            top: savedToast ? 72 : 18,
            right:18,
            zIndex:5000,
            background: weeklyToast.type === "error" ? "#b91c1c" : "#1a7a3a",
            color: "#fff",
            border: "none",
            borderRadius:8,
            padding:"12px 16px",
            fontSize:14,
            fontWeight:700,
            boxShadow:"0 10px 28px rgba(0,0,0,0.18)"
          }}
        >
          {weeklyToast.message}
        </div>
      ) : null}
      {confirmIssue && <ConfirmIssueModal card={confirmIssue} onConfirm={confirmSingleIssue} onCancel={() => setConfirmIssue(null)} publishing={publishing} isMobile={isMobile} />}
      {confirmStat && <ConfirmStatModal card={confirmStat} issueCardsForModule={issueCardsForStatModule} onConfirm={confirmSingleStat} onCancel={() => setConfirmStat(null)} publishing={publishing} isMobile={isMobile} />}
      {confirmBulk && <BulkConfirmModal issueCards={selIssues.map(i => pendingIssues[i])} statBlocks={selStats.map(i => pendingStats[i])} onConfirm={confirmBulkPublish} onCancel={() => setConfirmBulk(false)} publishing={publishing} isMobile={isMobile} />}
      {editConfig && <EditModal config={editConfig} onClose={() => setEditConfig(null)} onSave={handleSaveEdit} onDelete={editConfig.itemType === "issue_card" ? handleDeleteIssue : handleDeleteStat} saving={editSaving} isMobile={isMobile} />}
      {profileEditConfig ? <ProfileEditModal profile={profileEditConfig} onClose={() => setProfileEditConfig(null)} onSave={handleSaveProfileEdit} saving={profileEditSaving} isMobile={isMobile} /> : null}

      {/* Header */}
      <div style={{ borderBottom:"1px solid #4a5268", padding:isMobile ? "12px 16px" : "18px 36px", display:"flex", flexDirection:isMobile ? "column" : "row", justifyContent:"space-between", alignItems:isMobile ? "stretch" : "center", gap:isMobile ? 12 : 0, background:"#2e3440" }}>
        <div>
          <div style={{ color:"#b8860b", fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase" }}>HSV Civic Watch</div>
          <div style={{ color:"#fff", fontSize:20, fontWeight:700, marginTop:2 }}>Content Admin</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, width:isMobile ? "100%" : "auto" }}>
          <button onClick={handleSignOut} style={{ background:"#e53e3e", color:"#fff", border:"none", borderRadius:4, padding:"12px 24px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1, flex:isMobile ? 1 : "none" }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ borderBottom:"2px solid #4a5268", marginBottom:0, background:"#2e3440", padding:isMobile ? "0 12px" : "0 36px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, overflowX:isMobile ? "auto" : "visible", whiteSpace:isMobile ? "nowrap" : "normal", flexWrap:"nowrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:0, flexWrap:"nowrap" }}>
            <button onClick={() => setAdminTab("issue_cards")} style={adminTabStyle("issue_cards")}>Content</button>
            <button onClick={() => setAdminTab("profiles")} style={adminTabStyle("profiles")}>Profiles</button>
            <button onClick={() => setAdminTab("blueprints")} style={adminTabStyle("blueprints")}>Blueprints</button>
            <button onClick={() => setAdminTab("tools")} style={adminTabStyle("tools")}>Tools</button>
          </div>
          {!isMobile && adminTab === "tools" ? (
            <div style={{ display:"flex", gap:10, marginLeft:"auto", alignItems:"center" }}>
              <button
                onClick={handleExport}
                disabled={exportStatus === "success"}
                style={{ background:"#1a5276", color:"#fff", border:"none", borderRadius:4, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:exportStatus === "success" ? "default" : "pointer", whiteSpace:"nowrap" }}
              >
                {exportStatus === "success" ? "Copied! ✓" : "NotebookLM Export ↗"}
              </button>
              <button
                onClick={handleRunWeeklyJob}
                disabled={weeklyRunning}
                style={{ background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:weeklyRunning ? "not-allowed" : "pointer", whiteSpace:"nowrap" }}
              >
                {weeklyRunning ? "Running..." : "Run Weekly Report"}
              </button>
            </div>
          ) : null}
        </div>
        {isMobile && adminTab === "tools" ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", padding:"0 0 12px" }}>
            <button
              onClick={handleExport}
              disabled={exportStatus === "success"}
              style={{ background:"#1a5276", color:"#fff", border:"none", borderRadius:4, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:exportStatus === "success" ? "default" : "pointer", whiteSpace:"nowrap", width:"100%" }}
            >
              {exportStatus === "success" ? "Copied! ✓" : "NotebookLM Export ↗"}
            </button>
            <button
              onClick={handleRunWeeklyJob}
              disabled={weeklyRunning}
              style={{ background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:weeklyRunning ? "not-allowed" : "pointer", whiteSpace:"nowrap", width:"100%" }}
            >
              {weeklyRunning ? "Running..." : "Run Weekly Report"}
            </button>
          </div>
        ) : null}
      </div>
      {adminTab === "tools" && exportStatus === "fallback" ? (
        <div style={{ padding:isMobile ? "12px" : "12px 36px", background:"#2e3440" }}>
          <textarea
            ref={fallbackRef}
            readOnly
            value={fallbackText}
            style={{ width:"100%", minHeight:120, background:"#f5f0e8", color:"#333", border:"1px solid #ddd8cf", borderRadius:10, padding:12, fontSize:11, fontFamily:"Georgia, serif", resize:"vertical" }}
          />
        </div>
      ) : null}

      {adminTab === "issue_cards" ? (
        <>
      {/* Nav tabs */}
      <div style={{ marginTop:0, padding:"16px 36px 0", borderBottom:"1px solid #4a5268", display:"flex", gap:0, flexWrap:isMobile ? "nowrap" : "wrap", overflowX:isMobile ? "auto" : "visible", whiteSpace:isMobile ? "nowrap" : "normal", background:"#353b48" }}>
        <button onClick={() => setActiveTab("import")} style={tabStyle("import")}>Import</button>
        <button onClick={() => setActiveTab("review")} style={tabStyle("review")}>Review{totalPending ? " ("+totalPending+")" : ""}</button>
        <button onClick={() => setActiveTab("drafts")} style={tabStyle("drafts")}>Drafts{totalDrafts ? " ("+totalDrafts+")" : ""}</button>
        <button onClick={() => setActiveTab("published")} style={tabStyle("published")}>Published ({pubIssues.length + pubStats.length})</button>

      </div>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:isMobile ? "16px 12px" : "36px 36px" }}>

        {activeTab === "import" && (
          <div>
            <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Import Research</h2>
            <p style={{ color:"#555", fontSize:15, margin:"0 0 22px" }}>Research first using AI. When done, copy the Issue Card Research Template from <strong style={{ color:"#b8860b" }}>Tools → Templates</strong>, format your findings, then paste the result below.</p>
            <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, padding:10, marginBottom:18 }}>
              <textarea value={rawPaste} onChange={e => setRawPaste(e.target.value)}
                placeholder={"Paste your formatted research here...\n\nInclude --- ISSUE CARD START/END --- and --- STAT BLOCK START/END --- blocks.\nMultiple of each supported."}
                style={{ width:"100%", minHeight:isMobile ? 220 : 360, background:"transparent", border:"none", color:"#333", fontSize:isMobile ? 13 : 14, lineHeight:1.7, resize:"vertical", outline:"none", fontFamily:"monospace", boxSizing:"border-box", padding:14 }} />
            </div>
            {parseError && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:6, padding:"14px 18px", marginBottom:18, color:"#b91c1c", fontSize:14, fontWeight:600 }}>{parseError}</div>}
            <div style={{ display:"flex", gap:14, alignItems:isMobile ? "stretch" : "center", flexDirection:isMobile ? "column" : "row" }}>
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
            <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Review</h2>
            <p style={{ color:"#555", fontSize:15, margin:"0 0 22px" }}>
              {totalPending ? pendingIssues.length+" issue card(s) · "+pendingStats.length+" stat block(s) ready." : "Nothing to review yet."}
            </p>
            {totalPending === 0 && (
              <div style={{ textAlign:"center", padding:"80px 0", color:"#aaa" }}>
                <div style={{ fontSize:44, marginBottom:18 }}>&#9670;</div>
                <div style={{ fontSize:18 }}>Nothing to review.</div>
                <button onClick={() => setActiveTab("import")} style={{ marginTop:18, background:"#f5f0e8", color:"#b8860b", border:"2px solid #b8860b", borderRadius:4, padding:"12px 24px", fontSize:14, cursor:"pointer", fontWeight:700 }}>Go to Import</button>
              </div>
            )}
            {totalPending > 0 && (
              <>
                <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:8, padding:"14px 20px", marginBottom:22, display:"flex", alignItems:isMobile ? "stretch" : "center", gap:16, flexWrap:"wrap", flexDirection:isMobile ? "column" : "row" }}>
                  <span style={{ color:"#444", fontSize:15, fontWeight:600 }}>{totalSel} of {totalPending} selected</span>
                  {totalSel > 0 && (
                    <button onClick={handleBulkPublish} style={{ marginLeft:isMobile ? 0 : "auto", width:isMobile ? "100%" : "auto", background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"11px 26px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
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
                    {pendingIssues.map((card,i) => <IssueRow key={i} card={card} selected={selIssues.includes(i)} onToggle={() => toggleIssue(i)} onApprove={() => approveIssue(card)} onReject={() => rejectIssue(card)} isMobile={isMobile} />)}
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
                    {pendingStats.map((block,i) => <StatRow key={i} block={block} selected={selStats.includes(i)} onToggle={() => toggleStat(i)} onApprove={() => approveStat(block)} onReject={() => rejectStat(block)} isMobile={isMobile} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "drafts" && (
          <div>
            <h2 style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Drafts</h2>
            <p style={{ color:"#555", fontSize:15, margin:"0 0 26px" }}>Holding cell for queued batches and rejected content.</p>

            {/* Paste Research Queue */}
            <div style={{ marginBottom:40 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:10, borderBottom:"2px solid #4a5268" }}>
                <span style={{ color:"#b8860b", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>Paste Research Queue</span>
                <span style={{ background:"#b8860b22", color:"#b8860b", border:"1px solid #b8860b44", fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:3 }}>{pasteQueue.reduce((a,b) => a+b.length, 0)} cards waiting</span>
              </div>
              {pasteQueue.length === 0 ? (
                <div style={{ color:"#556", fontSize:14, padding:"20px 0" }}>No queued batches. Paste more than 3 cards at once to queue overflow here.</div>
              ) : (
                pasteQueue.map((batch, bi) => (
                  <div key={bi} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, overflow:"hidden" }}>
                    <div style={{ display:"flex", alignItems:isMobile ? "stretch" : "center", justifyContent:"space-between", flexDirection:isMobile ? "column" : "row", gap:isMobile ? 12 : 0, padding:"14px 20px", borderBottom:"1px solid #ddd8cf" }}>
                      <div>
                        <span style={{ color:"#1a1a1a", fontSize:14, fontWeight:700 }}>Batch {bi + 2}</span>
                        <span style={{ color:"#555", fontSize:13, marginLeft:10 }}>{batch.length} card{batch.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ display:"flex", gap:10, flexDirection:isMobile ? "column" : "row", width:isMobile ? "100%" : "auto" }}>
                        <button onClick={() => processBatch(bi)} disabled={parsing}
                          style={{ background:parsing?"#4a5268":"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:parsing?"not-allowed":"pointer", textTransform:"uppercase", width:isMobile ? "100%" : "auto" }}>
                          {parsing ? "Processing..." : "Process Batch"}
                        </button>
                        <button onClick={() => setPasteQueue(p => p.filter((_,i) => i !== bi))}
                          style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer", width:isMobile ? "100%" : "auto" }}>
                          Discard
                        </button>
                      </div>
                    </div>
                    <div style={{ padding:"12px 20px" }}>
                      {batch.map((raw, ci) => {
                        const titleMatch = raw.match(/TITLE:\s*(.+)/);
                        const labelMatch = raw.match(/LABEL:\s*(.+)/);
                        return (
                          <div key={ci} style={{ display:"flex", gap:10, alignItems:"center", padding:"6px 0", borderBottom: ci < batch.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                            {labelMatch && <span style={{ background:"#b8860b", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3, textTransform:"uppercase", flexShrink:0 }}>{labelMatch[1].trim()}</span>}
                            <span style={{ color:"#333", fontSize:13 }}>{titleMatch ? titleMatch[1].trim() : "Card " + (ci+1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rejected */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:10, borderBottom:"2px solid #4a5268" }}>
                <span style={{ color:"#e57373", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:2 }}>Rejected</span>
                <span style={{ background:"#e5737322", color:"#e57373", border:"1px solid #e5737344", fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:3 }}>{draftIssues.length + draftStats.length} items</span>
              </div>
              {draftIssues.length === 0 && draftStats.length === 0 ? (
                <div style={{ color:"#556", fontSize:14, padding:"20px 0" }}>No rejected items.</div>
              ) : (
                <>
                  {draftIssues.length > 0 && (
                    <div style={{ marginBottom:24 }}>
                      <div style={{ color:"#aaa", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Issue Cards ({draftIssues.length})</div>
                      {draftIssues.map((card,i) => (
                        <div key={i} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, overflow:"hidden" }}>
                          <div style={{ background:"#fef2f2", borderBottom:"1px solid #fca5a5", padding:"10px 22px" }}>
                            <span style={{ color:"#b91c1c", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>&#9679; Rejected &mdash; Issue Card</span>
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
                    </div>
                  )}
                  {draftStats.length > 0 && (
                    <div>
                      <div style={{ color:"#aaa", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Stat Blocks ({draftStats.length})</div>
                      {draftStats.map((block,i) => (
                        <div key={i} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, overflow:"hidden" }}>
                          <div style={{ background:"#eff6ff", borderBottom:"1px solid #93c5fd", padding:"10px 22px" }}>
                            <span style={{ color:"#1a4a7a", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>&#9679; Rejected &mdash; {block.type}</span>
                          </div>
                          <div style={{ padding:"18px 22px" }}>
                            <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:700, marginBottom:6 }}>{block.label || block.title}</div>
                            <div style={{ color:"#888", fontSize:14, marginBottom:14 }}>{block.module} &mdash; {block.tab}</div>
                            <div style={{ display:"flex", gap:12 }}>
                              <button onClick={() => { setPendingStats(p => [...p, block]); setDraftStats(p => p.filter((_,di) => di !== i)); setActiveTab("review"); }}
                                style={{ background:"#eff6ff", color:"#1a4a7a", border:"1px solid #93c5fd", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Move to Review</button>
                              <button onClick={() => setDraftStats(p => p.filter((_,di) => di !== i))}
                                style={{ background:"#fef2f2", color:"#b91c1c", border:"1px solid #fca5a5", borderRadius:4, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "published" && (
          <PublishedTab
            pubIssues={pubIssues}
            pubStats={pubStats}
            onDeleteIssue={handleDeleteIssue}
            onDeleteStat={handleDeleteStat}
            onEditIssue={openIssueEdit}
            onEditStat={openStatEdit}
            highlightId={highlightId}
            animateId={animateId}
            exportStatus={exportStatus}
            fallbackText={fallbackText}
            fallbackRef={fallbackRef}
            handleExport={handleExport}
            getLastExportLabel={getLastExportLabel}
            onRerank={handleRerank}
            rerankRunning={rerankRunning}
            isMobile={isMobile}
          />
        )}



      </div>
        </>
      ) : null}

      {adminTab === "profiles" ? (
        <div>
          <div style={{ marginTop:0, padding:"16px 36px 0", borderBottom:"1px solid #4a5268", display:"flex", gap:0, flexWrap:isMobile ? "nowrap" : "wrap", overflowX:isMobile ? "auto" : "visible", whiteSpace:isMobile ? "nowrap" : "normal", background:"#353b48" }}>
            <button
              onClick={() => setProfileAdminTab("paste")}
              style={{ padding:"12px 20px", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1, border:"none", background:"none", borderBottom: profileAdminTab === "paste" ? "3px solid #b8860b" : "3px solid transparent", color: profileAdminTab === "paste" ? "#b8860b" : "#aaa", cursor:"pointer", marginBottom:0 }}
            >
              Paste Profile
            </button>
            <button
              onClick={() => setProfileAdminTab("published")}
              style={{ padding:"12px 20px", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1, border:"none", background:"none", borderBottom: profileAdminTab === "published" ? "3px solid #b8860b" : "3px solid transparent", color: profileAdminTab === "published" ? "#b8860b" : "#aaa", cursor:"pointer", marginBottom:0 }}
            >
              Published Profiles
            </button>
          </div>

          <div style={{ maxWidth:1060, margin:"0 auto", padding:isMobile ? "16px 12px" : "36px 36px" }}>
            {profileAdminTab === "paste" ? (
              <div>
                <textarea
                  value={profileRawPaste}
                  onChange={(e) => setProfileRawPaste(e.target.value)}
                  style={{ width:"100%", minHeight:"280px", fontFamily:"Georgia, serif", fontSize:14, color:"#333", background:"#f5f0e8", padding:14, border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, resize:"vertical" }}
                />

                <div style={{ display:"flex", gap:10 }}>
                  <button
                    onClick={() => handleParseProfile("parse")}
                    disabled={profileParsing || !profileRawPaste.trim()}
                    style={{ background:"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}
                  >
                    Parse Profile
                  </button>
                  {parsedProfile ? (
                    <button
                      onClick={() => handleParseProfile("publish")}
                      disabled={profileParsing}
                      style={{ background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}
                    >
                      Publish Profile
                    </button>
                  ) : null}
                </div>

                {parsedProfile ? (
                  <div style={{ marginTop:18, background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, padding:18 }}>
                    <div style={{ color:"#b8860b", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>LINK TO SEAT (Required for Predecessors tab)</div>
                    <div style={{ color:"#555", fontSize:15, lineHeight:1.6, marginBottom:12 }}>Select the permanent government seat this official holds. Enables the public Predecessors tab.</div>
                    {seatMatches.length > 0 && !selectedSeatId ? (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ color: "#b8860b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                          Suggested seats — click to select:
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {seatMatches.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => { setSelectedSeatId(seat.id); setSeatSearch(seat.title); setSeatMatches([]); }}
                              style={{ background: "#f5f0e8", border: "1px solid #b8860b", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#b8860b", cursor: "pointer" }}
                            >
                              {seat.title} · {seat.level} · {seat.jurisdiction}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <input type="text" placeholder={seatsLoading ? "Loading seats..." : "Search seats — type a title, level, or jurisdiction..."} value={seatSearch} onChange={e => setSeatSearch(e.target.value)}
                      style={{ width:"100%", background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:6, padding:"10px 12px", fontSize:14, color:"#333", outline:"none", marginBottom:10, boxSizing:"border-box", fontFamily:"Georgia, serif" }} />
                    {seatSearch.trim().length >= 2 ? (
                      <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:6, maxHeight:220, overflowY:"auto" }}>
                        {seats.filter(seat => [seat.title, seat.level, seat.jurisdiction, seat.geography].filter(Boolean).some(v => v.toLowerCase().includes(seatSearch.toLowerCase()))).slice(0,20).map(seat => (
                          <button key={seat.id} onClick={() => { setSelectedSeatId(seat.id); setSeatSearch(seat.title); setSeatMatches([]); }}
                            style={{ width:"100%", background: selectedSeatId === seat.id ? "#b8860b22" : "transparent", border:"none", borderBottom:"1px solid rgba(0,0,0,0.06)", padding:"10px 14px", textAlign:"left", cursor:"pointer", display:"flex", flexDirection:"column", gap:2 }}>
                            <span style={{ color:"#1a1a1a", fontSize:13, fontWeight:700 }}>{seat.title}</span>
                            <span style={{ color:"#555", fontSize:11 }}>{[seat.level, seat.jurisdiction, seat.geography].filter(Boolean).join(" · ")}</span>
                          </button>
                        ))}
                        {!seats.filter(seat => [seat.title, seat.level, seat.jurisdiction, seat.geography].filter(Boolean).some(v => v.toLowerCase().includes(seatSearch.toLowerCase()))).length
                          ? <div style={{ padding:"12px 14px", color:"#556", fontSize:13 }}>No seats match.</div> : null}
                      </div>
                    ) : null}
                    {selectedSeatId
                      ? <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:10 }}><span style={{ background:"#b8860b22", color:"#b8860b", border:"1px solid #b8860b44", fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:999 }}>✓ Seat selected</span><button onClick={() => { setSelectedSeatId(""); setSeatSearch(""); setSeatMatches([]); }} style={{ background:"none", border:"none", color:"#556", fontSize:12, cursor:"pointer" }}>Clear</button></div>
                      : <div style={{ marginTop:6, color:"#556", fontSize:12 }}>No seat selected — profile will publish without seat link.</div>}
                  </div>
                ) : null}

                {profileParsing ? <div style={{ color:"#6b778a", fontSize:14, marginTop:14 }}>Parsing profile...</div> : null}
                {profileParseError ? (
                  <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:14, marginTop:14, color:"#b91c1c", fontSize:14 }}>
                    {profileParseError}
                  </div>
                ) : null}
                {profilePublishSuccess ? <div style={{ color:"#3E8B5B", fontSize:14, fontWeight:900, marginTop:14 }}>{profilePublishSuccess}</div> : null}

                {parsedProfile ? (
                  <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:12, padding:18, marginTop:16 }}>
                    <div style={{ color:"#1a1a1a", fontSize:22, fontWeight:900, marginBottom:4 }}>{parsedProfile.name}</div>
                    <div style={{ color:"#555", fontSize:15, marginBottom:12 }}>{parsedProfile.office}</div>
                    <div style={{ marginBottom:12 }}>
                      <AdminPreviewBadge>{parsedProfile.kind}</AdminPreviewBadge>
                      <AdminPreviewBadge>{parsedProfile.module}</AdminPreviewBadge>
                    </div>
                    <AdminPreviewBlock borderColor="#C6A34D">{parsedProfile.decoder?.rise}</AdminPreviewBlock>
                    <AdminPreviewBlock borderColor="#2F5D8A">{parsedProfile.decoder?.affiliations}</AdminPreviewBlock>
                    <AdminPreviewBlock borderColor="#7A4FA3">{parsedProfile.decoder?.beneficiaries}</AdminPreviewBlock>
                    <AdminPreviewBlock borderColor="#B4473E">{parsedProfile.decoder?.track_record}</AdminPreviewBlock>
                  </div>
                ) : null}
              </div>
            ) : null}

            {profileAdminTab === "published" ? (() => {
              const grouped = {
                local: [],
                state: [],
                federal: [],
                judge: [],
                uncategorized: [],
              };

              for (const profile of pubProfiles) {
                const key = String(profile?.level || "").trim().toLowerCase();
                if (key === "local" || key === "state" || key === "federal" || key === "judge") grouped[key].push(profile);
                else grouped.uncategorized.push(profile);
              }

              const lowerIncludes = (value, needle) => String(value || "").toLowerCase().includes(needle);
              const stateJudges = grouped.judge.filter(profile => lowerIncludes(profile.kind, "state") || lowerIncludes(profile.geography, "state"));
              const federalJudges = grouped.judge.filter(profile => lowerIncludes(profile.kind, "federal") || lowerIncludes(profile.geography, "federal"));
              const otherJudges = grouped.judge.filter(profile => !stateJudges.includes(profile) && !federalJudges.includes(profile));

              const badgeStyle = { background:"#b8860b", color:"#fff", textTransform:"uppercase", fontSize:13, fontWeight:700, padding:"5px 14px", borderRadius:4, display:"inline-block" };
              const pillStyle = { background:"#e8e4dc", border:"1px solid #ddd8cf", color:"#555", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, padding:"4px 9px", borderRadius:999 };

              const renderProfileCard = (profile, options = {}) => (
                <div key={profile.id} style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:10, padding:18, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ color:"#1a1a1a", fontSize:16, fontWeight:900, marginBottom:4 }}>{profile.name}</div>
                    {options.showDistrict && profile.geography ? <div style={{ color:"#555", fontSize:12, marginBottom:4 }}>{profile.geography}</div> : null}
                    <div style={{ color:"#555", fontSize:13, marginBottom:10 }}>{profile.office || "—"}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      <span style={pillStyle}>{profile.level || "uncategorized"}</span>
                      {profile.kind ? <span style={pillStyle}>{profile.kind}</span> : null}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, flexShrink:0 }}>
                    <button
                      onClick={() => setProfileEditConfig(profile)}
                      style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:6, padding:"10px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile)}
                      style={{ background:"#b91c1c", color:"#fff", border:"none", borderRadius:6, padding:"10px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );

              const renderStandardGroup = (label, profiles) => (
                <div style={{ marginBottom:28 }}>
                  <div style={badgeStyle}>{label}</div>
                  <div style={{ display:"grid", gap:12, marginTop:14 }}>
                    {profiles.length ? profiles.map(profile => renderProfileCard(profile)) : <div style={{ color:"#777f93", fontSize:14, padding:"10px 0" }}>No profiles in this section yet.</div>}
                  </div>
                </div>
              );

              return (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, marginBottom:22 }}>
                    <div>
                      <div style={{ color:"#1a1a1a", fontSize:24, fontWeight:700, marginBottom:6 }}>Published Profiles</div>
                      <div style={{ color:"#555", fontSize:15 }}>Manage published official profiles by level, edit decoder copy, and remove stale rows.</div>
                    </div>
                    <button
                      onClick={loadPublishedProfiles}
                      disabled={pubProfilesLoading}
                      style={{ background:"#e8e4dc", color:"#555", border:"1px solid #ddd8cf", borderRadius:8, padding:"10px 16px", fontSize:13, fontWeight:700, cursor:pubProfilesLoading ? "not-allowed" : "pointer", textTransform:"uppercase", letterSpacing:1 }}
                    >
                      {pubProfilesLoading ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>

                  {pubProfilesError ? (
                    <div style={{ background:"#4a1f25", border:"1px solid #8a3a44", borderRadius:10, padding:14, marginBottom:18, color:"#f3b0b0", fontSize:14 }}>
                      {pubProfilesError}
                    </div>
                  ) : null}

                  {pubProfilesLoading && !pubProfiles.length ? <div style={{ color:"#aaa", fontSize:14, marginBottom:18 }}>Loading published profiles...</div> : null}

                  {renderStandardGroup("LOCAL", grouped.local)}
                  {renderStandardGroup("STATE", grouped.state)}
                  {renderStandardGroup("FEDERAL", grouped.federal)}

                  <div style={{ marginBottom:28 }}>
                    <div style={badgeStyle}>JUDGES</div>

                    <div style={{ color:"#ddd5c4", fontSize:14, fontWeight:700, marginBottom:8, marginTop:16, paddingBottom:6, borderBottom:"1px solid #4a5268" }}>State Judges</div>
                    <div style={{ display:"grid", gap:12 }}>
                      {stateJudges.length ? stateJudges.map(profile => renderProfileCard(profile)) : <div style={{ color:"#777f93", fontSize:14, padding:"10px 0" }}>No state judges in this section yet.</div>}
                    </div>

                    <div style={{ color:"#ddd5c4", fontSize:14, fontWeight:700, marginBottom:8, marginTop:16, paddingBottom:6, borderBottom:"1px solid #4a5268" }}>Federal Judges</div>
                    <div style={{ display:"grid", gap:12 }}>
                      {federalJudges.length ? federalJudges.map(profile => renderProfileCard(profile, { showDistrict: true })) : <div style={{ color:"#777f93", fontSize:14, padding:"10px 0" }}>No federal judges in this section yet.</div>}
                    </div>

                    {otherJudges.length ? (
                      <>
                        <div style={{ color:"#ddd5c4", fontSize:14, fontWeight:700, marginBottom:8, marginTop:16, paddingBottom:6, borderBottom:"1px solid #4a5268" }}>Other Judges</div>
                        <div style={{ display:"grid", gap:12 }}>
                          {otherJudges.map(profile => renderProfileCard(profile))}
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div style={{ marginBottom:8 }}>
                    <div style={badgeStyle}>UNCATEGORIZED</div>
                    <div style={{ display:"grid", gap:12, marginTop:14 }}>
                      {grouped.uncategorized.length ? grouped.uncategorized.map(profile => renderProfileCard(profile)) : <div style={{ color:"#777f93", fontSize:14, padding:"10px 0" }}>No uncategorized profiles.</div>}
                    </div>
                  </div>
                </div>
              );
            })() : null}
          </div>
        </div>
      ) : null}

      {adminTab === "blueprints" ? (
        <div>
          <div style={{ marginTop:0, padding:"16px 36px 0", borderBottom:"1px solid #4a5268", display:"flex", gap:0, flexWrap:isMobile ? "nowrap" : "wrap", overflowX:isMobile ? "auto" : "visible", whiteSpace:isMobile ? "nowrap" : "normal", background:"#353b48" }}>
            <button
              onClick={() => setBlueprintMode("brief")}
              style={{ padding:"12px 20px", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1, border:"none", background:"none", borderBottom: blueprintMode === "brief" ? "3px solid #b8860b" : "3px solid transparent", color: blueprintMode === "brief" ? "#b8860b" : "#aaa", cursor:"pointer", marginBottom:0 }}
            >
              Research Brief
            </button>
            <button
              onClick={() => setBlueprintMode("template")}
              style={{ padding:"12px 20px", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:1, border:"none", background:"none", borderBottom: blueprintMode === "template" ? "3px solid #b8860b" : "3px solid transparent", color: blueprintMode === "template" ? "#b8860b" : "#aaa", cursor:"pointer", marginBottom:0 }}
            >
              Paste Template
            </button>
          </div>

        <div style={{ maxWidth:1060, margin:"0 auto", padding:isMobile ? "16px 12px" : "36px 36px" }}>

          <textarea
            value={blueprintInput}
            onChange={(e) => setBlueprintInput(e.target.value)}
            placeholder={blueprintMode === "brief" ? "Describe the specific policy idea in detail — include the target population, proposed funding mechanism, and the specific ask..." : "Paste your completed Blueprint research template here..."}
            style={{ width:"100%", minHeight: blueprintMode === "brief" ? "160px" : "260px", fontSize:14, color:"#333", fontFamily:"Georgia, serif", background:"#f5f0e8", padding:14, border:"1px solid #ddd8cf", borderRadius:10, marginBottom:14, resize:"vertical" }}
          />

          <div style={{ display:"flex", gap:10 }}>
            <button
              onClick={() => handleParseBlueprint("parse")}
              disabled={blueprintParsing || !blueprintInput.trim()}
              style={{ background:"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}
            >
              Parse Blueprint
            </button>
            {parsedBlueprint ? (
              <button
                onClick={() => handleParseBlueprint("publish")}
                disabled={blueprintParsing}
                style={{ background:"#1a7a3a", color:"#fff", border:"none", borderRadius:4, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}
              >
                Publish Blueprint
              </button>
            ) : null}
          </div>

          {blueprintParsing ? <div style={{ color:"#555", fontSize:15, marginTop:14 }}>Parsing blueprint...</div> : null}
          {blueprintError ? (
            <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:14, marginTop:14, color:"#b91c1c", fontSize:14 }}>
              {blueprintError}
            </div>
          ) : null}
          {blueprintPublishSuccess ? <div style={{ color:"#3E8B5B", fontSize:14, fontWeight:900, marginTop:14 }}>{blueprintPublishSuccess}</div> : null}

          {parsedBlueprint ? (
            <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:12, padding:18, marginTop:16 }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#1a1a1a", marginBottom:8 }}>{parsedBlueprint.title}</div>
              <AdminPreviewBlock borderColor="#B4473E">{parsedBlueprint.the_problem}</AdminPreviewBlock>
              <AdminPreviewBlock borderColor="#C6A34D">{parsedBlueprint.the_ask}</AdminPreviewBlock>
              <AdminPreviewBlock borderColor="#2F5D8A">{parsedBlueprint.who_decides}</AdminPreviewBlock>
              <AdminPreviewBlock borderColor="#3E8B5B">{parsedBlueprint.other_cities}</AdminPreviewBlock>
              <div style={{ display:"grid", gap:8, marginTop:12 }}>
                <div style={{ color:"#555", fontSize:13 }}><strong>Estimated Cost:</strong> <span style={{ color:"#1a1a1a" }}>{parsedBlueprint.estimated_cost || "—"}</span></div>
                <div style={{ color:"#555", fontSize:13 }}><strong>ROI:</strong> <span style={{ color:"#1a1a1a" }}>{parsedBlueprint.roi || "—"}</span></div>
              </div>
            </div>
          ) : null}
        </div>
        </div>
      ) : null}

      {adminTab === "tools" ? (
        <div style={{ maxWidth:1060, margin:"0 auto", padding:isMobile ? "0 12px 16px" : "0 36px 36px" }}>
          <div style={{ background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:12, padding:28 }}>
            <div>
              <div style={{ color:"#b8860b", fontSize:11, fontWeight:900, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>📱 SOCIAL MEDIA CONTENT</div>
              <SocialCardsQueue pubIssues={pubIssues} pubStats={pubStats} />
            </div>

            <div style={{ borderTop:"1px solid #ddd8cf", paddingTop:24, marginTop:24 }}>
              <button
                onClick={() => setToolsTemplatesOpen((prev) => !prev)}
                style={{ width:"100%", background:"#f5f0e8", border:"1px solid #ddd8cf", borderRadius:8, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
              >
                <span style={{ color:"#1a1a1a", fontSize:15, fontWeight:700 }}>Templates</span>
                <span style={{ color:"#b8860b", fontSize:16, fontWeight:900 }}>{toolsTemplatesOpen ? "▲" : "▼"}</span>
              </button>
              {toolsTemplatesOpen ? (
                <div style={{ borderTop:"1px solid #ddd8cf", padding:"8px 0" }}>
                  {[
                    {
                      key: "issue",
                      name: "Issue Card Research Template",
                      description: "Formats raw research into issue cards and stat blocks for the Content → Import tab.",
                      text: RESEARCH_TEMPLATE,
                    },
                    {
                      key: "profile",
                      name: "Official Profile Research Template",
                      description: "Formats research into prosecutor-style official profiles for the Profiles → Paste Profile tab.",
                      text: PROFILE_RESEARCH_TEMPLATE,
                    },
                    {
                      key: "blueprint",
                      name: "Blueprint Research Template",
                      description: "Formats policy proposal research for the Blueprints → Paste Blueprint tab.",
                      text: BLUEPRINT_RESEARCH_TEMPLATE,
                    },
                  ].map((item, index, list) => (
                    <div key={item.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom: index < list.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div>
                        <div style={{ color:"#f5f0e8", fontSize:14, fontWeight:700 }}>{item.name}</div>
                        <div style={{ color:"#6b778a", fontSize:12, marginTop:3 }}>{item.description}</div>
                      </div>
                      <button
                        onClick={() => copyToolTemplate(item.key, item.text)}
                        style={{ background:"#b8860b", color:"#fff", border:"none", borderRadius:4, padding:"8px 14px", fontSize:12, fontWeight:700, flexShrink:0, marginLeft:16, cursor:"pointer" }}
                      >
                        {toolTemplateCopied[item.key] ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
