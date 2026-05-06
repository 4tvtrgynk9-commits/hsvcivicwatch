import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { COLORS } from "../../config/theme";
import { generateSlug } from "../../lib/slug";

const TAB_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "on_record", label: "On Record" },
  { id: "donors", label: "Donors" },
  { id: "ethics", label: "Ethics & Complaints" },
  { id: "predecessors", label: "Predecessors" },
  { id: "contact", label: "Contact" },
];

const MEDIA_OUTLETS = [
  ["WAFF 48", "news@waff.com"],
  ["WAAY 31", "newsroom@waaytv.com"],
  ["WHNT 19", "news@whnt.com"],
  ["AL.com", "news@al.com"],
  ["WZDX 54", "tips@rocketcitynow.com"],
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function isEmptyRecord(value) {
  if (!value) return true;
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (["", "none", "no", "n/a", "not disclosed", "unknown"].includes(text)) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.values(value).every(isEmptyRecord);
  return false;
}

function initials(name) {
  const parts = String(name || "").split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return `${parts[0][0] || ""}${parts[parts.length - 1]?.[0] || ""}`.toUpperCase();
}

function cleanObjectText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(cleanObjectText).filter(Boolean).join(", ");
  if (typeof value === "object") return Object.values(value).map(cleanObjectText).filter(Boolean).join(" — ");
  return String(value);
}

function getStatusData(official) {
  const partyLower = (official.party || "").toLowerCase();
  const kindLower = (official.kind || "").toLowerCase();
  const isRepublican = partyLower.includes("rep");
  const isDemocrat = partyLower.includes("dem");
  const isIndependent = partyLower.includes("ind");
  const isCurrent = kindLower === "elected" || kindLower === "appointed" || kindLower === "current";
  const isCandidate = kindLower === "candidate";
  const isFormer = kindLower === "former";
  const isDeceased = kindLower === "deceased";

  const heroBg = (isFormer || isDeceased)
    ? (isDeceased ? "#b8bec4" : "#cdd2d6")
    : isRepublican ? "#9e3535"
    : isDemocrat ? "#3a6ab0"
    : isIndependent ? "#5c3d8a"
    : "#193150";

  const photoBorder = isDeceased ? "#000" : isCandidate ? "#C6A34D" : "#193150";
  const heroTextColor = (isFormer || isDeceased) ? "#193150" : "#fff";
  const heroOfficeColor = (isFormer || isDeceased) ? "rgba(25,49,80,0.65)" : "rgba(247,243,234,0.72)";

  const partyPillStyle = isRepublican
    ? { background: "#e8453a", color: "#fff", border: "1px solid #ff6b60" }
    : isDemocrat
      ? { background: "#4a90d9", color: "#fff", border: "1px solid #74b0f0" }
      : isIndependent
        ? { background: "#8a5fd4", color: "#fff", border: "1px solid #b08af0" }
        : { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)" };

  return {
    isCurrent,
    isCandidate,
    isFormer,
    isDeceased,
    heroBg,
    photoBorder,
    heroTextColor,
    heroOfficeColor,
    partyPillStyle,
    currentPillStyle: { background: "transparent", color: "#fff", border: "1px solid #C6A34D" },
    candidatePillStyle: { background: "#c9940a", color: "#fff", border: "1px solid #e8b030" },
    formerPillStyle: { background: "transparent", color: "#193150", border: "1px solid #193150" },
    deceasedPillStyle: { background: "#000", color: "#fff", border: "1px solid #333" },
  };
}

function SectionHeader({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: COLORS.gold, marginBottom: 12 }}>{children}</div>;
}

function FieldBlock({ label, children }) {
  if (!children) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: COLORS.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function EducationValue({ value }) {
  const text = cleanString(value);
  if (!text) return null;
  const items = text.includes(";") ? text.split(";").map((item) => item.trim()).filter(Boolean) : [];
  if (!items.length) return <span>{text}</span>;
  return (
    <div style={{ display: "grid", gap: 4 }}>
      {items.map((item, index) => <div key={index}>• {item}</div>)}
    </div>
  );
}

function FamilyValue({ value }) {
  if (isEmptyRecord(value)) return null;
  if (typeof value === "string") return <span>{value}</span>;
  const family = asObject(value);
  const spouse = family.spouse_name || family.spouse || family.spouseName;
  const businessTies = family.business_ties || family.businessTies;
  const parentsSiblings = family.parents_siblings || family.parentsSiblings;
  const children = family.children_count || family.childrenCount;
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {spouse ? <div><strong style={{ fontWeight: 700 }}>Spouse:</strong> {spouse}</div> : null}
      {businessTies ? <div style={{ fontSize: 14, lineHeight: 1.6 }}><strong style={{ fontWeight: 700 }}>Business ties:</strong> {businessTies}</div> : null}
      {parentsSiblings ? <div style={{ fontSize: 14, lineHeight: 1.6 }}><strong style={{ fontWeight: 700 }}>Parents/Siblings:</strong> {parentsSiblings}</div> : null}
      {children ? <div style={{ fontSize: 14, lineHeight: 1.6 }}><strong style={{ fontWeight: 700 }}>Children:</strong> {children}</div> : null}
    </div>
  );
}

function NetworksValue({ value }) {
  if (isEmptyRecord(value)) return null;
  if (typeof value === "string") return <p style={{ fontSize: 15, lineHeight: 1.75, color: COLORS.text, margin: 0 }}>{value}</p>;
  const networks = asObject(value);
  const namedOrbit = asArray(networks.named_orbit);
  const organizationalTies = networks.organizational_ties;
  const professionalNetwork = networks.professional_network;
  return (
    <div style={{ display: "grid", gap: 12, color: COLORS.text }}>
      {networks.born_into ? <div style={{ fontSize: 15, lineHeight: 1.7 }}><strong>Born into:</strong> {networks.born_into}</div> : null}
      {namedOrbit.length ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: COLORS.muted, marginBottom: 6 }}>Key relationships:</div>
          <div style={{ display: "grid", gap: 5 }}>
            {namedOrbit.map((item, index) => (
              <div key={index} style={{ fontSize: 15, lineHeight: 1.6 }}>
                {[item.name, item.amount, item.relationship || item.role].filter(Boolean).join(" — ")}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {organizationalTies ? <div style={{ fontSize: 15, lineHeight: 1.7 }}><strong>Organizational ties:</strong> {cleanObjectText(organizationalTies)}</div> : null}
      {professionalNetwork ? <div style={{ fontSize: 15, lineHeight: 1.7 }}><strong>Professional network:</strong> {cleanObjectText(professionalNetwork)}</div> : null}
      {networks.elite_connections ? <div style={{ fontSize: 15, lineHeight: 1.7 }}><strong>Elite connections:</strong> {cleanObjectText(networks.elite_connections)}</div> : null}
      {networks.board_seats ? <div style={{ fontSize: 15, lineHeight: 1.7 }}><strong>Board seats:</strong> {cleanObjectText(networks.board_seats)}</div> : null}
    </div>
  );
}

function getEthicsRows(value) {
  if (Array.isArray(value)) return value;
  if (isEmptyRecord(value)) return [];
  if (typeof value === "string") return [{ type: "Ethics Complaint", description: value }];
  if (typeof value === "object") return asArray(value.items).length ? value.items : [value];
  return [];
}

const CONTRACTOR_KEYWORDS = [
  "Wellpath",
  "Securus",
  "NCIC",
  "Summit",
  "Southern Health",
  "Correct Care",
  "jail contractor",
  "healthcare contractor",
  "phone contractor",
];

function getContractorName(text) {
  const match = CONTRACTOR_KEYWORDS.find((keyword) => new RegExp(keyword, "i").test(text));
  return match || "Contractor accountability";
}

function getContractorMentions(official) {
  const sourceText = [official.decoder?.affiliations, official.decoder?.track_record].filter(Boolean).join("\n");
  if (!sourceText) return [];
  const chunks = sourceText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return chunks
    .filter((item) => CONTRACTOR_KEYWORDS.some((keyword) => new RegExp(keyword, "i").test(item)))
    .map((text) => ({ name: getContractorName(text), text }));
}

function OfficialProfileHero({ official }) {
  const [copied, setCopied] = useState(false);
  const status = getStatusData(official);
  const pillBaseStyle = { fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, borderRadius: 999, padding: "4px 9px" };
  const termYear = parseInt((official.term_start || "").match(/\d{4}/)?.[0]);
  const yearsInOffice = Number.isFinite(termYear) ? new Date().getFullYear() - termYear : null;
  const yearsLabel = yearsInOffice !== null ? ` (${yearsInOffice}+ yrs)` : "";
  const termLine = status.isCurrent && official.term_start
    ? `In office since ${official.term_start}${yearsLabel}`
    : status.isFormer && official.term_start
      ? `Served ${[official.term_start, official.term_end].filter(Boolean).join(" – ")}`
      : "";
  const salaryLine = official.salary ? `Salary: ${official.salary}` : "";
  const infoLine = [termLine, salaryLine].filter(Boolean).join(" · ");
  const shareSlug = official.slug || generateSlug(official.name);

  const copyProfileUrl = async () => {
    const url = `${window.location.origin}/officials/${shareSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div style={{ background: status.heroBg, padding: "24px 28px", display: "flex", gap: 20, alignItems: "center", position: "relative" }}>
      <button onClick={copyProfileUrl} style={{ position: "absolute", top: 16, right: 56, background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
        {copied ? "Link copied!" : "Share ↗"}
      </button>
      {official.headshot_url ? (
        <img src={official.headshot_url} alt={official.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${status.photoBorder}`, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#0d1e30", border: `3px solid ${status.photoBorder}`, color: "#C6A34D", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {initials(official.name)}
        </div>
      )}
      <div style={{ minWidth: 0, paddingRight: 136 }}>
        <div style={{ color: status.heroTextColor, fontSize: 26, fontWeight: 900, lineHeight: 1.15, marginBottom: 6 }}>{official.name || "Unnamed profile"}</div>
        <div style={{ color: status.heroOfficeColor, fontSize: 14, marginBottom: 10 }}>{official.office || official.role_label || "Office not listed"}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: infoLine ? 9 : 0 }}>
          {status.isDeceased ? (
            <>
              <span style={{ ...pillBaseStyle, ...status.deceasedPillStyle }}>Deceased</span>
              {official.party ? <span style={{ ...pillBaseStyle, ...status.partyPillStyle }}>{official.party}</span> : null}
              <span style={{ ...pillBaseStyle, ...status.formerPillStyle }}>Former</span>
            </>
          ) : status.isFormer ? (
            <>
              {official.party ? <span style={{ ...pillBaseStyle, ...status.partyPillStyle }}>{official.party}</span> : null}
              <span style={{ ...pillBaseStyle, ...status.formerPillStyle }}>Former</span>
            </>
          ) : status.isCandidate ? (
            <>
              {official.party ? <span style={{ ...pillBaseStyle, ...status.partyPillStyle }}>{official.party}</span> : null}
              <span style={{ ...pillBaseStyle, ...status.candidatePillStyle }}>Candidate</span>
            </>
          ) : status.isCurrent ? (
            <>
              {official.party ? <span style={{ ...pillBaseStyle, ...status.partyPillStyle }}>{official.party}</span> : null}
              <span style={{ ...pillBaseStyle, ...status.currentPillStyle }}>Current</span>
            </>
          ) : (
            official.party ? <span style={{ ...pillBaseStyle, ...status.partyPillStyle }}>{official.party}</span> : null
          )}
        </div>
        {infoLine ? <div style={{ color: status.heroOfficeColor, fontSize: 14, fontWeight: 700 }}>{infoLine}</div> : null}
      </div>
    </div>
  );
}

function DataStrip({ official }) {
  const geographyValue = String(official.geography || "").trim();
  const showGeography = geographyValue && !["local", "state", "federal", "judge"].includes(geographyValue.toLowerCase());
  const items = [
    ["Salary", official.salary],
    ["Est. Net Worth", official.net_worth],
    ["Geography", showGeography ? geographyValue : ""],
  ].filter(([, value]) => value);

  if (!items.length) return null;

  return (
    <div style={{ background: "#e8ddcb", borderBottom: "1px solid #d2c3ab", padding: "12px 28px", display: "flex", flexWrap: "wrap", gap: 24 }}>
      {items.map(([label, value]) => (
        <div key={label}>
          <div style={{ color: "#746b5f", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          <div style={{ color: "#193150", fontSize: 14, fontWeight: 900 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ official }) {
  const [decoderOpen, setDecoderOpen] = useState(false);
  const summary = official.profile?.summary || official.status_line;
  const details = official.profile?.details;
  const showMilitary = !isEmptyRecord(official.military_service);
  const showFamily = !isEmptyRecord(official.family);
  const showBackground = official.education || showMilitary || showFamily;
  const showNetworks = !isEmptyRecord(official.networks);
  const decoderSections = [
    ["rise", "THE RISE", "#E8C35A"],
    ["affiliations", "THE AFFILIATIONS", "#89C4E8"],
    ["beneficiaries", "THE BENEFICIARIES", "#B98FD8"],
    ["track_record", "THE TRACK RECORD", "#E07068"],
  ];
  const hasDecoder = decoderSections.some(([key]) => official.decoder?.[key]);

  return (
    <div>
      {summary ? <p style={{ fontSize: 16, lineHeight: 1.75, color: COLORS.text, margin: "0 0 20px" }}>{summary}</p> : null}
      {details ? <p style={{ fontSize: 15, lineHeight: 1.75, color: COLORS.text, margin: "0 0 20px" }}>{details}</p> : null}
      {showBackground ? (
        <div style={{ marginBottom: 22 }}>
          <SectionHeader>Background</SectionHeader>
          <FieldBlock label="Education"><EducationValue value={official.education} /></FieldBlock>
          {showMilitary ? <FieldBlock label="Military Service">{official.military_service}</FieldBlock> : null}
          {showFamily ? <FieldBlock label="Family"><FamilyValue value={official.family} /></FieldBlock> : null}
        </div>
      ) : null}
      {showNetworks ? (
        <div style={{ marginBottom: 22 }}>
          <SectionHeader>Networks & Affiliations</SectionHeader>
          <NetworksValue value={official.networks} />
        </div>
      ) : null}
      {hasDecoder ? (
        <>
          <button onClick={() => setDecoderOpen((value) => !value)} style={{ background: COLORS.gold, color: COLORS.navy, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: decoderOpen ? 16 : 0 }}>
            {decoderOpen ? "Hide Decoder ▲" : "Decode This 🔍"}
          </button>
          {decoderOpen ? (
            <div style={{ background: COLORS.navy, borderRadius: 14, padding: "20px 22px" }}>
              {decoderSections.map(([key, label, color]) => official.decoder?.[key] ? (
                <div key={key} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 14, marginBottom: 22 }}>
                  <div style={{ color, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{label}</div>
                  <div style={{ color, fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{official.decoder[key]}</div>
                </div>
              ) : null)}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function OnRecordTab({ official }) {
  const onRecord = official.on_record;
  const recordItems = Array.isArray(onRecord) ? onRecord : [];
  const votes = asArray(official.votes);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {typeof onRecord === "string" && onRecord ? <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.75, margin: 0 }}>{onRecord}</p> : null}
      {recordItems.map((item, index) => (
        <blockquote key={index} style={{ margin: 0, background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.gold}`, borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.7 }}>{item.quote || item.body || item.summary || item.title}</div>
          {[item.attribution, item.date, item.sourceLabel].filter(Boolean).length ? (
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 8 }}>{[item.attribution, item.date, item.sourceLabel].filter(Boolean).join(" · ")}</div>
          ) : null}
        </blockquote>
      ))}
      {votes.map((vote, index) => {
        const position = cleanString(vote.position || vote.vote || vote.voted);
        const yes = /yes|aye|support|for/i.test(position);
        const no = /no|nay|oppose|against/i.test(position);
        return (
          <div key={index} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{vote.bill || vote.measure || vote.title || "Vote Record"}</div>
              {position ? <div style={{ color: yes ? COLORS.gold : no ? COLORS.red : COLORS.muted, fontSize: 14, fontWeight: 900 }}>{position}</div> : null}
            </div>
            {vote.date ? <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 6 }}>{vote.date}</div> : null}
            {vote.description || vote.summary ? <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65 }}>{vote.description || vote.summary}</div> : null}
          </div>
        );
      })}
      {!recordItems.length && typeof onRecord !== "string" && !votes.length ? <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No on-record items yet.</div> : null}
    </div>
  );
}

function DonorsTab({ official }) {
  const donors = official.donors || {};
  const cycles = asArray(donors.totals_by_cycle);
  const topIndividuals = asArray(donors.top_individuals);
  const topPacs = asArray(donors.top_pacs);
  const hasDonorData = donors.grand_total || donors.individual_total || donors.pac_total || donors.summary || cycles.length || topIndividuals.length || topPacs.length;

  if (!hasDonorData) {
    return <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No donor data on file yet.</div>;
  }

  const donorRow = (donor, index, items) => (
    <div key={`${donor.name || "donor"}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: index < items.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#193150", lineHeight: 1.35 }}>{donor.name || "Unnamed donor"}</div>
        {donor.relationship ? <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.45, marginTop: 3 }}>{donor.relationship}</div> : null}
      </div>
      {donor.amount ? <div style={{ fontSize: 15, fontWeight: 900, color: "#193150", textAlign: "right", flexShrink: 0 }}>{donor.amount}</div> : null}
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: COLORS.panelWarm, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" }}>
        {donors.grand_total ? <div style={{ fontSize: 28, fontWeight: 900, color: "#193150", lineHeight: 1 }}>{donors.grand_total}</div> : null}
        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>total raised — all cycles</div>
        {cycles.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {cycles.map((item, index) => (
              <span key={`${item.cycle || "cycle"}-${index}`} style={{ background: COLORS.navy, color: COLORS.gold, border: `1px solid ${COLORS.gold}`, borderRadius: 999, padding: "5px 10px", fontSize: 13, fontWeight: 900 }}>
                {[item.cycle, item.total].filter(Boolean).join(": ")}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {(donors.individual_total || donors.pac_total) ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {donors.individual_total ? (
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Individual Donors</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#193150" }}>{donors.individual_total}</div>
            </div>
          ) : null}
          {donors.pac_total ? (
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>PAC/Committee Donors</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#193150" }}>{donors.pac_total}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {topIndividuals.length ? (
        <div>
          <SectionHeader>Top Individual Donors</SectionHeader>
          <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "2px 14px" }}>
            {topIndividuals.map(donorRow)}
          </div>
        </div>
      ) : null}

      {topPacs.length ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: "#B98FD8", marginBottom: 12 }}>Top PAC & Committee Donors</div>
          <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "2px 14px" }}>
            {topPacs.map(donorRow)}
          </div>
        </div>
      ) : null}

      {donors.summary ? <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.text, margin: 0 }}>{donors.summary}</p> : null}

      <div style={{ fontSize: 11, color: COLORS.muted }}>
        Source: FEC.gov / <a href="https://fcpa.alabama.gov" target="_blank" rel="noreferrer" style={{ color: COLORS.muted, textDecoration: "underline" }}>FCPA.Alabama.gov</a>
      </div>
    </div>
  );
}

function EthicsTab({ official }) {
  const ethics = official.ethics_complaints;
  const ethicsObject = asObject(ethics);
  const complaints = getEthicsRows(ethics);
  const contractorMentions = getContractorMentions(official);
  const criminalRecord = isEmptyRecord(official.criminal_record) ? "" : official.criminal_record;
  const currentYear = new Date().getFullYear();

  const renderStatusPill = (status) => {
    if (!status) return null;
    const lower = String(status).toLowerCase();
    const color = lower.includes("resolved") ? COLORS.green : lower.includes("pending") ? COLORS.red : COLORS.gold;
    const background = lower.includes("resolved") ? COLORS.greenSoft : lower.includes("pending") ? COLORS.redSoft : COLORS.goldSoft;
    return <span style={{ color, background, borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.7 }}>{status}</span>;
  };

  const renderComplaints = () => {
    if (typeof ethics === "string") {
      const clean = ethics.trim();
      const isNone = /(^|\b)(none|no ethics|no complaints|not located|no record)(\b|$)/i.test(clean);
      return (
        <div style={{ background: isNone ? COLORS.panel : COLORS.redSoft, border: `1px solid ${isNone ? COLORS.border : `${COLORS.red}55`}`, borderLeft: `4px solid ${isNone ? COLORS.gold : COLORS.red}`, borderRadius: 10, padding: "12px 16px", color: COLORS.text, fontSize: 14, lineHeight: 1.65, fontWeight: 700 }}>
          {isNone ? "✓ " : "⚑ "}{clean}
        </div>
      );
    }

    if (ethicsObject.items && asArray(ethicsObject.items).length === 0) {
      return (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", color: COLORS.muted, fontSize: 14, lineHeight: 1.65 }}>
          {ethicsObject.summary || `No ethics complaints located in public records as of ${currentYear}`}
        </div>
      );
    }

    if (complaints.length) {
      const count = ethicsObject.count || complaints.length;
      return (
        <>
          <div style={{ background: COLORS.redSoft, border: `1px solid ${COLORS.red}55`, borderLeft: `4px solid ${COLORS.red}`, borderRadius: 10, padding: "12px 16px", color: COLORS.red, fontSize: 14, fontWeight: 900 }}>
            ⚑ {count} ethics complaint{Number(count) === 1 ? "" : "s"} on record
          </div>
          {complaints.map((complaint, index) => (
            <div key={index} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{complaint.type || "Complaint"}</div>
                {renderStatusPill(complaint.status)}
              </div>
              {[complaint.filed_by, complaint.date].filter(Boolean).length ? (
                <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 8 }}>
                  {[complaint.filed_by ? `Filed by ${complaint.filed_by}` : "", complaint.date].filter(Boolean).join(" · ")}
                </div>
              ) : null}
              <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65 }}>{complaint.description || "Complaint details on file."}</div>
            </div>
          ))}
        </>
      );
    }

    return <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No ethics complaints on record</div>;
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {renderComplaints()}
      {contractorMentions.length ? (
        <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
          <SectionHeader>Contractor Accountability</SectionHeader>
          {contractorMentions.map((mention, index) => (
            <div key={`${mention.name}-${index}`} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${COLORS.red}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ color: COLORS.red, fontSize: 14, fontWeight: 900, marginBottom: 6 }}>{mention.name}</div>
              <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65 }}>{mention.text}</div>
            </div>
          ))}
        </div>
      ) : null}
      {criminalRecord ? (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
          <SectionHeader>Criminal Record</SectionHeader>
          <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65 }}>{criminalRecord}</div>
        </div>
      ) : null}
    </div>
  );
}

function PredecessorsTab({ official, onSelectOfficial }) {
  const [predecessors, setPredecessors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!official.seat_id || !official.id) return undefined;
    setLoading(true);
    supabase
      .from("official_profiles")
      .select("*")
      .eq("seat_id", official.seat_id)
      .neq("id", official.id)
      .order("term_start", { ascending: false })
      .then(({ data }) => {
        if (alive) setPredecessors(data || []);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [official.id, official.seat_id]);

  if (!official.seat_id) return <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No predecessor records on file</div>;
  if (loading) return <div style={{ color: COLORS.muted, fontSize: 14 }}>Loading predecessors...</div>;
  if (!predecessors.length) return <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No predecessor records on file</div>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {predecessors.map((person) => (
        <button key={person.id} onClick={() => onSelectOfficial(person)} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", textAlign: "left", cursor: "pointer" }}>
          {person.headshot_url ? (
            <img src={person.headshot_url} alt={person.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${COLORS.navy}`, flexShrink: 0 }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.navy, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>{initials(person.name)}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{person.name}</div>
            <div style={{ color: COLORS.muted, fontSize: 14 }}>{person.office}</div>
            <div style={{ color: COLORS.text, fontSize: 14 }}>{[person.term_start, person.term_end].filter(Boolean).join(" – ")}</div>
          </div>
          {person.party ? <span style={{ color: COLORS.navy, background: COLORS.goldSoft, border: `1px solid ${COLORS.gold}`, borderRadius: 999, padding: "3px 8px", fontSize: 11, fontWeight: 900 }}>{person.party}</span> : null}
        </button>
      ))}
    </div>
  );
}

function ContactTab({ official }) {
  const contact = official.contact || {};
  const items = [
    ["Phone", contact.phone, contact.phone ? `tel:${String(contact.phone).replace(/\D/g, "")}` : ""],
    ["Email", contact.email, contact.email ? `mailto:${contact.email}` : ""],
    ["Address", contact.address, contact.address ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}` : ""],
    ["Official Website", contact.website, contact.website],
    ["Campaign Website", contact.campaign_website, contact.campaign_website],
    ["Office Hours", contact.office_hours, ""],
  ].filter(([, value]) => value);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.length ? items.map(([label, value, href]) => (
        <div key={label} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: COLORS.muted, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
          {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ color: COLORS.gold, fontSize: 15, fontWeight: 900, textDecoration: "none" }}>{value} {href.startsWith("http") ? "↗" : ""}</a> : <span style={{ color: COLORS.text, fontSize: 15, fontWeight: 700 }}>{value}</span>}
        </div>
      )) : <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No contact information on file yet.</div>}
      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
        <SectionHeader>Tip a reporter about this official</SectionHeader>
        <div style={{ display: "grid", gap: 6 }}>
          {MEDIA_OUTLETS.map(([name, email]) => (
            <div key={name} style={{ color: COLORS.text, fontSize: 15 }}>
              <strong>{name}:</strong> <a href={`mailto:${email}`} style={{ color: COLORS.gold, fontWeight: 900, textDecoration: "none" }}>{email}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OfficialProfile({ official, onClose, onSelectOfficial }) {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!official) return null;

  const tabStyle = (id) => ({
    padding: "10px 16px",
    fontWeight: 700,
    fontSize: 13,
    border: "none",
    borderRight: `1px solid ${COLORS.border}`,
    background: activeTab === id ? COLORS.navy : "#f0ebe2",
    color: activeTab === id ? COLORS.gold : COLORS.muted,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, backdropFilter: "blur(3px)" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(680px, 100vw)", background: "#fbf7f0", overflowY: "auto", zIndex: 201, boxShadow: "-8px 0 40px rgba(0,0,0,0.25)" }}>
        <button onClick={onClose} aria-label="Close profile" style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 22, lineHeight: 1, cursor: "pointer" }}>×</button>
        <OfficialProfileHero official={official} />
        <DataStrip official={official} />

        <div style={{ display: "flex", borderBottom: `2px solid ${COLORS.border}`, overflowX: "auto", background: "#f0ebe2" }}>
          {TAB_ITEMS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>{tab.label}</button>
          ))}
        </div>

        <div style={{ background: COLORS.bg, padding: "24px 28px 32px" }}>
          {activeTab === "profile" ? <ProfileTab official={official} /> : null}
          {activeTab === "on_record" ? <OnRecordTab official={official} /> : null}
          {activeTab === "donors" ? <DonorsTab official={official} /> : null}
          {activeTab === "ethics" ? <EthicsTab official={official} /> : null}
          {activeTab === "predecessors" ? <PredecessorsTab official={official} onSelectOfficial={onSelectOfficial} /> : null}
          {activeTab === "contact" ? <ContactTab official={official} /> : null}
        </div>
      </div>
    </>
  );
}
