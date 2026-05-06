import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  ["WHNT 19", "Online at whnt.com/contact"],
  ["AL.com", "news@al.com"],
  ["WZDX 54", "Online at rocketcitynow.com/contact-us"],
];

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function initials(name) {
  const parts = String(name || "").split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return `${parts[0][0] || ""}${parts[parts.length - 1]?.[0] || ""}`.toUpperCase();
}

function slugToName(slug) {
  return String(slug || "").replace(/-/g, " ").trim();
}

function normalizeOfficial(record) {
  const data = asObject(record?.data);
  return {
    ...data,
    ...record,
    profile: asObject(record?.profile || data.profile),
    decoder: { ...asObject(data.decoder), ...asObject(record?.decoder) },
    contact: { ...asObject(data.contact), ...asObject(record?.contact) },
    donors: record?.donors || data.donors || null,
    on_record: record?.on_record || data.on_record || null,
    votes: record?.votes || data.votes || null,
    ethics_complaints: record?.ethics_complaints || data.ethics_complaints || null,
    networks: record?.networks || data.networks || null,
    family: record?.family || data.family || null,
  };
}

function proseValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => proseValue(item)).filter(Boolean).join("\n\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => v && !(Array.isArray(v) && !v.length))
      .map(([key, v]) => `${key.replace(/_/g, " ")}: ${proseValue(v)}`)
      .join("\n");
  }
  return String(value);
}

function isEmptyRecord(value) {
  if (!value) return true;
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (["", "none", "no", "n/a", "not disclosed", "unknown"].includes(text)) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.values(value).every(isEmptyRecord);
  return false;
}

function amountNumber(value) {
  const number = parseFloat(String(value || "").replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  if (!value) return "";
  if (typeof value === "string" && value.includes("$")) return value;
  const number = amountNumber(value);
  return number ? `$${number.toLocaleString()}` : String(value);
}

function getDonorRows(donors) {
  if (Array.isArray(donors)) return donors;
  if (Array.isArray(donors?.top_donors)) return donors.top_donors.map((item) => ({ ...item, category: item.category || "Top Donors" }));
  return [];
}

function getEthicsRows(value) {
  if (Array.isArray(value)) return value;
  if (isEmptyRecord(value)) return [];
  if (typeof value === "string") return [{ type: "Ethics Complaint", description: value }];
  if (typeof value === "object") return asArray(value.items).length ? value.items : [value];
  return [];
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

function FieldRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "11px 14px" }}>
      <div style={{ color: COLORS.muted, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.6, fontWeight: 700, whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
}

function SectionHeader({ children }) {
  return <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}

function OfficialProfileHero({ official, pageSlug }) {
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
  const shareSlug = pageSlug || generateSlug(official.name);

  const copyProfileUrl = async () => {
    const url = `${window.location.origin}/officials/${shareSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div style={{ background: status.heroBg, borderRadius: "14px 14px 0 0", padding: "24px 28px", display: "flex", gap: 20, alignItems: "center", position: "relative" }}>
      <button onClick={copyProfileUrl} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 800, padding: "7px 10px", cursor: "pointer" }}>
        {copied ? "Link copied!" : "Share"}
      </button>
      {official.headshot_url ? (
        <img src={official.headshot_url} alt={official.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${status.photoBorder}`, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#0d1e30", border: `3px solid ${status.photoBorder}`, color: "#C6A34D", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {initials(official.name)}
        </div>
      )}
      <div style={{ minWidth: 0, paddingRight: 86 }}>
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
        {infoLine ? <div style={{ color: status.heroOfficeColor, fontSize: 12, fontWeight: 700 }}>{infoLine}</div> : null}
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
          <div style={{ color: "#746b5f", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          <div style={{ color: "#193150", fontSize: 13, fontWeight: 900 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ official }) {
  const [decoderOpen, setDecoderOpen] = useState(false);
  const summary = official.profile?.summary || official.status_line;
  const details = official.profile?.details;
  const familyText = proseValue(official.family);
  const networksText = proseValue(official.networks);
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
      {details ? <p style={{ fontSize: 15, lineHeight: 1.75, color: COLORS.textSoft, margin: "0 0 20px" }}>{details}</p> : null}
      {(official.education || official.military_service || familyText) ? (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Background</SectionHeader>
          <div style={{ display: "grid", gap: 10 }}>
            <FieldRow label="Education" value={official.education} />
            <FieldRow label="Military Service" value={official.military_service} />
            <FieldRow label="Family" value={familyText} />
          </div>
        </div>
      ) : null}
      {networksText ? (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Networks & Affiliations</SectionHeader>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: COLORS.text, margin: 0, whiteSpace: "pre-wrap" }}>{networksText}</p>
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
                  <div style={{ color, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{label}</div>
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
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 8 }}>{[item.attribution, item.date, item.sourceLabel].filter(Boolean).join(" · ")}</div>
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
              {position ? <div style={{ color: yes ? COLORS.green : no ? COLORS.red : COLORS.muted, fontSize: 13, fontWeight: 900 }}>{position}</div> : null}
            </div>
            {vote.date ? <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>{vote.date}</div> : null}
            {vote.description || vote.summary ? <div style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 1.65 }}>{vote.description || vote.summary}</div> : null}
          </div>
        );
      })}
      {!recordItems.length && typeof onRecord !== "string" && !votes.length ? <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No on-record items yet.</div> : null}
    </div>
  );
}

function DonorsTab({ official }) {
  const donors = official.donors;
  const rows = getDonorRows(donors);
  const computedTotal = rows.reduce((sum, item) => sum + amountNumber(item.amount), 0);
  const totalRaised = donors?.total_raised || (computedTotal ? formatMoney(computedTotal) : "");
  const grouped = rows.reduce((acc, item) => {
    const key = item.category || "Donors";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  if (!rows.length && !donors?.summary && !totalRaised) {
    return <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No donor data on file yet.</div>;
  }

  return (
    <div>
      {donors?.summary ? <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.7, margin: "0 0 14px" }}>{donors.summary}</p> : null}
      {totalRaised ? <div style={{ color: COLORS.gold, fontSize: 26, fontWeight: 900, marginBottom: 18 }}>{totalRaised} <span style={{ color: COLORS.muted, fontSize: 13, fontWeight: 700 }}>total raised</span></div> : null}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 18 }}>
          <SectionHeader>{category}</SectionHeader>
          <div style={{ display: "grid", gap: 8 }}>
            {items.map((donor, index) => (
              <div key={index} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 900 }}>{donor.name || "Unnamed donor"}</div>
                  {donor.note || donor.category ? <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>{donor.note || donor.category}</div> : null}
                </div>
                {donor.amount ? <div style={{ color: COLORS.gold, fontSize: 15, fontWeight: 900, flexShrink: 0 }}>{formatMoney(donor.amount)}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EthicsTab({ official }) {
  const complaints = getEthicsRows(official.ethics_complaints);
  const criminalRecord = isEmptyRecord(official.criminal_record) ? "" : official.criminal_record;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {complaints.length ? (
        <div style={{ background: COLORS.redSoft, border: `1px solid ${COLORS.red}55`, borderLeft: `4px solid ${COLORS.red}`, borderRadius: 10, padding: "12px 16px", color: COLORS.red, fontSize: 14, fontWeight: 900 }}>⚑ Ethics complaints on record</div>
      ) : (
        <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No ethics complaints on record</div>
      )}
      {complaints.map((complaint, index) => (
        <div key={index} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 7 }}>
            <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{complaint.type || complaint.title || "Complaint"}</div>
            {complaint.status ? <span style={{ color: COLORS.red, background: COLORS.redSoft, borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 900 }}>{complaint.status}</span> : null}
            {complaint.filing_date || complaint.date ? <span style={{ color: COLORS.muted, fontSize: 12 }}>{complaint.filing_date || complaint.date}</span> : null}
          </div>
          <div style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 1.65 }}>{complaint.description || complaint.body || proseValue(complaint)}</div>
        </div>
      ))}
      {criminalRecord ? (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
          <SectionHeader>Criminal Record</SectionHeader>
          <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.65 }}>{criminalRecord}</div>
        </div>
      ) : null}
    </div>
  );
}

function PredecessorsTab({ official }) {
  const [predecessors, setPredecessors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!official.seat_id || !official.id) return undefined;
    setLoading(true);
    supabase
      .from("official_profiles")
      .select("id, name, office, kind, party, term_start, term_end, headshot_url")
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
      {predecessors.map((person) => {
        const pageSlug = generateSlug(person.name);
        return (
          <a key={person.id} href={`/officials/${pageSlug}`} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
            {person.headshot_url ? (
              <img src={person.headshot_url} alt={person.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${COLORS.navy}` }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.navy, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0 }}>{initials(person.name)}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{person.name}</div>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>{person.office}</div>
              <div style={{ color: COLORS.textSoft, fontSize: 12 }}>{[person.term_start, person.term_end].filter(Boolean).join(" – ")}</div>
            </div>
            {person.party ? <span style={{ color: COLORS.navy, background: COLORS.goldSoft, border: `1px solid ${COLORS.gold}`, borderRadius: 999, padding: "3px 8px", fontSize: 10, fontWeight: 900 }}>{person.party}</span> : null}
          </a>
        );
      })}
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
          {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ color: COLORS.green, fontSize: 14, fontWeight: 900, textDecoration: "none" }}>{value} {href.startsWith("http") ? "↗" : ""}</a> : <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 700 }}>{value}</span>}
        </div>
      )) : <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic" }}>No contact information on file yet.</div>}
      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
        <SectionHeader>Tip a reporter about this official</SectionHeader>
        <div style={{ display: "grid", gap: 6 }}>
          {MEDIA_OUTLETS.map(([name, contactValue]) => (
            <div key={name} style={{ color: COLORS.textSoft, fontSize: 13 }}>
              <strong style={{ color: COLORS.text }}>{name}:</strong> {contactValue.includes("@") ? <a href={`mailto:${contactValue}`} style={{ color: COLORS.green, fontWeight: 800, textDecoration: "none" }}>{contactValue}</a> : contactValue}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OfficialProfile({ slug, onBack }) {
  const [official, setOfficial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const fetchOfficial = useCallback(async () => {
    setLoading(true);
    setError("");
    setOfficial(null);
    try {
      let record = null;
      const slugResult = await supabase
        .from("official_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!slugResult.error && slugResult.data) {
        record = slugResult.data;
      }

      if (!record) {
        const generatedName = slugToName(slug);
        const { data, error: nameError } = await supabase
          .from("official_profiles")
          .select("*")
          .ilike("name", generatedName)
          .limit(1)
          .maybeSingle();
        if (nameError) throw nameError;
        record = data;
      }

      setOfficial(record ? normalizeOfficial(record) : null);
    } catch (e) {
      setError(e?.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchOfficial();
  }, [fetchOfficial]);

  const status = useMemo(() => official ? getStatusData(official) : null, [official]);
  const pageSlug = official ? (official.slug || generateSlug(official.name) || slug) : slug;

  const tabStyle = (id) => ({
    padding: "10px 18px",
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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 28px" }}>
      <button onClick={() => onBack ? onBack("officials_elections") : window.history.back()} style={{ background: "transparent", border: "none", color: COLORS.navy, fontSize: 13, fontWeight: 900, cursor: "pointer", padding: "0 0 14px" }}>
        ← Officials & Elections
      </button>

      {loading ? (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "44px 24px", color: COLORS.muted, textAlign: "center" }}>Loading profile...</div>
      ) : error ? (
        <div style={{ background: COLORS.redSoft, border: `1px solid ${COLORS.red}55`, borderRadius: 12, padding: "18px 20px", color: COLORS.red, fontWeight: 800 }}>{error}</div>
      ) : !official ? (
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "44px 24px", textAlign: "center" }}>
          <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Profile not found</div>
          <div style={{ color: COLORS.muted, fontSize: 14 }}>No official profile matched this link.</div>
        </div>
      ) : (
        <div style={{ border: `3px solid ${COLORS.navy}`, borderRadius: 14, overflow: "hidden", background: COLORS.bg, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
          <OfficialProfileHero official={official} status={status} pageSlug={pageSlug} />
          <DataStrip official={official} />

          <div style={{ display: "flex", borderBottom: `2px solid ${COLORS.border}`, overflowX: "auto", background: "#f0ebe2" }}>
            {TAB_ITEMS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>{tab.label}</button>
            ))}
          </div>

          <div style={{ background: COLORS.bg, padding: "24px 28px 28px" }}>
            {activeTab === "profile" ? <ProfileTab official={official} /> : null}
            {activeTab === "on_record" ? <OnRecordTab official={official} /> : null}
            {activeTab === "donors" ? <DonorsTab official={official} /> : null}
            {activeTab === "ethics" ? <EthicsTab official={official} /> : null}
            {activeTab === "predecessors" ? <PredecessorsTab official={official} /> : null}
            {activeTab === "contact" ? <ContactTab official={official} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
