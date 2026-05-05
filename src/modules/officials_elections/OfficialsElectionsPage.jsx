import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { COLORS } from "../../config/theme";

const GOLD = "#C6A34D";
const BLUE = "#2F5D8A";
const LAVENDER = "#7A4FA3";
const RED = "#B4473E";
const GREEN = "#3E8B5B";
const NAVY = "#193150";

function initials(name) {
  return String(name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function partyBadge(party) {
  const p = String(party || "").toLowerCase();
  if (p.includes("republican")) return { label: "Republican", heroBg: "#8B2020", tagBg: "#8B2020", tagColor: "#fff" };
  if (p.includes("democrat")) return { label: "Democrat", heroBg: "#2B4F8A", tagBg: "#2B4F8A", tagColor: "#fff" };
  if (p.includes("libertarian")) return { label: "Libertarian", heroBg: "#7a5c00", tagBg: "#7a5c00", tagColor: "#fff" };
  if (p.includes("independent")) return { label: "Independent", heroBg: "#5a3a7a", tagBg: "#5a3a7a", tagColor: "#fff" };
  if (!party) return { label: null, heroBg: "#193150", tagBg: "#193150", tagColor: "#fff" };
  return { label: party, heroBg: "#193150", tagBg: "#193150", tagColor: "#fff" };
}

function heroBackground(profile) {
  const s = String(profile.status || "").toLowerCase();
  if (s === "former" || s === "deceased") return "#9da3a8";
  const pb = partyBadge(profile.party);
  return pb.heroBg;
}

function photoBorderColor(profile) {
  const s = String(profile.status || "").toLowerCase();
  if (s === "deceased") return "#111";
  if (s === "candidate") return "#C6A34D";
  return "#193150";
}

function statusTags(profile) {
  const s = String(profile.status || "").toLowerCase();
  const pb = partyBadge(profile.party);
  const partyTag = pb.label ? { label: pb.label, bg: pb.tagBg, color: pb.tagColor, border: "1px solid rgba(255,255,255,0.35)" } : null;
  const currentTag = { label: "Current", bg: "transparent", color: "#fff", border: "1.5px solid #C6A34D" };
  const candidateTag = { label: "Candidate", bg: "#C6A34D", color: "#3a2600", border: "none" };
  const formerTag = { label: "Former", bg: "#e8e8e8", color: "#4b5563", border: "none" };
  const deceasedTag = { label: "Deceased", bg: "#111", color: "#e8e8e8", border: "none" };
  if (s === "deceased") return [deceasedTag, formerTag, partyTag].filter(Boolean);
  if (s === "former") return [partyTag, formerTag].filter(Boolean);
  if (s === "candidate") return [partyTag, candidateTag].filter(Boolean);
  return [partyTag, currentTag].filter(Boolean);
}

function StatusTagPill({ tag }) {
  return (
    <span style={{ background: tag.bg, color: tag.color, border: tag.border || "none", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
      {tag.label}
    </span>
  );
}


function statusColor(s) {
  return s === "active" || s === "current" ? GREEN : s === "candidate" ? GOLD : "#888";
}

function statusLabel(s) {
  return s === "active" ? "Active" : s === "candidate" ? "Candidate" : s === "former" ? "Former" : s === "deceased" ? "Deceased" : s || "Unknown";
}

function countComplaintsAndInvestigations(profile) {
  const conflictItems = Array.isArray(profile.conflicts?.items) ? profile.conflicts.items.length : 0;
  const ethicsText = profile.ethics_complaints;
  const ethicsCount = ethicsText && ethicsText !== "NONE" && ethicsText !== "NOT DISCLOSED" ? 1 : 0;
  return conflictItems + ethicsCount;
}

const LEVEL_ORDER = ["local", "state", "federal", "judge"];
const LEVEL_LABELS = { local: "Local", state: "State", federal: "Federal", judge: "Judiciary" };

const ELECTIONS = [
  { office: "Governor — OPEN SEAT", date: "Nov 2026", priority: true, note: "Kay Ivey is term-limited. Governor controls major appointments affecting environment, prisons, and healthcare oversight." },
  { office: "U.S. Senate — Open (Tuberville running for Governor)", date: "Nov 2026", priority: true, note: "Rare open Senate race. This will shape Alabama's federal representation for years." },
  { office: "HCS School Board D2, D3, D4", date: "Nov 2026", priority: true, note: "Controls a $310M budget. These races are often decided by a few hundred votes." },
  { office: "Madison County Sheriff", date: "Nov 2026", priority: false, note: "Jail policy, pretrial detention, phone contracts, and enforcement priorities all run through this office." },
  { office: "Huntsville City Council D2, D3, D4", date: "Nov 2026", priority: false, note: "Council votes on roads, zoning, budgets, and appointments to key boards." },
];

const DIRECTORY_TABS = [
  { id: "current_officials", label: "Current Officials" },
  { id: "candidates", label: "2026 Candidates" },
  { id: "elections", label: "2026 Elections" },
  { id: "voting", label: "Voting & Registration" },
];

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeProfileRecord(record) {
  const data = record?.data && typeof record.data === "object" ? record.data : {};
  const decoder = { ...(data.decoder || {}), ...(record.decoder || {}) };
  const contact = { ...(data.contact || {}), ...(record.contact || {}) };
  const donors = { ...(data.donors || {}), ...(record.donors || {}) };
  const conflicts = { ...(data.conflicts || {}), ...(record.conflicts || {}) };
  const merged = {
    ...data,
    ...record,
    decoder,
    contact,
    donors,
    conflicts,
    profile: record.profile || data.profile || {},
    quick_facts: record.quick_facts || data.quick_facts || [],
    metrics: record.metrics || data.metrics || [],
    on_record: record.on_record || data.on_record || [],
    votes: record.votes || data.votes || [],
  };

  return {
    ...merged,
    current_roles: asArray(merged.current_roles).map((item) => ({
      title: cleanString(item?.title),
      kind: cleanString(item?.kind),
      jurisdiction: cleanString(item?.jurisdiction),
      start_year: cleanString(item?.start_year),
      election_date: cleanString(item?.election_date),
      is_candidate: Boolean(item?.is_candidate),
      is_primary: Boolean(item?.is_primary),
    })).filter((item) => item.title),
    former_offices: asArray(merged.former_offices).filter((item) => item?.title),
  };
}

function getCandidateRoles(profile) {
  return asArray(profile.current_roles).filter((role) => role.is_candidate);
}

function getNonCandidateRoles(profile) {
  return asArray(profile.current_roles).filter((role) => !role.is_candidate);
}

function getPrimaryRole(profile) {
  return asArray(profile.current_roles).find((role) => role.is_primary) || asArray(profile.current_roles)[0] || null;
}

function cleanTruncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const chunk = text.slice(0, maxLen);
  const lastPeriod = Math.max(
    chunk.lastIndexOf(". "),
    chunk.lastIndexOf("! "),
    chunk.lastIndexOf("? ")
  );
  if (lastPeriod > maxLen * 0.5) return text.slice(0, lastPeriod + 1);
  return chunk.trimEnd();
}

function FormerOffices({ offices }) {
  const [open, setOpen] = useState(false);
  if (!offices?.length) return null;
  return (
    <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ background: "transparent", border: "none", color: "#9aaabb", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, padding: 0 }}>
        Former Offices {open ? "▲" : "▼"}
      </button>
      {open ? (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {offices.map((o, i) => (
            <div key={i} style={{ fontSize: 13, color: "#ddd5c4" }}>
              {o.title} · {o.jurisdiction} · {o.start_year}{o.end_year ? `–${o.end_year}` : "–present"}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DecoderSummary({ profile }) {
  const sections = [
    { key: "rise", label: "The Rise", color: GOLD },
    { key: "affiliations", label: "The Affiliations", color: BLUE },
    { key: "beneficiaries", label: "The Beneficiaries", color: LAVENDER },
    { key: "track_record", label: "The Track Record", color: RED },
  ];

  return (
    <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
      {sections.map(({ key, label, color }) => (
        profile.decoder?.[key] ? (
          <div key={key} style={{ background: "rgba(10,16,28,0.22)", borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textSoft }}>{profile.decoder[key]}</div>
          </div>
        ) : null
      ))}
    </div>
  );
}

function ProfileCard({ profile, onClick, variant = "current" }) {
  const [hovered, setHovered] = useState(false);
  const heroBg = heroBackground(profile);
  const photoB = photoBorderColor(profile);
  const tags = statusTags(profile);
  const criminalClean = !profile.criminal_record || profile.criminal_record === "NONE" || profile.criminal_record === "None" || profile.criminal_record === "No criminal record";
  const isCandidateTab = variant === "candidate";
  const candidateRoles = getCandidateRoles(profile);
  const currentNonCandidateRoles = getNonCandidateRoles(profile);
  const primaryRoleObject = getPrimaryRole(profile);
  const primaryRole = primaryRoleObject?.title || profile.office || profile.role_label || "—";
  const showFormerOffices = profile.former_offices?.length && (!isCandidateTab || profile.status === "candidate");

  return (
    <button
      onClick={() => onClick(profile)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", border: "3px solid #193150", borderRadius: 12, padding: 0, overflow: "hidden", background: "transparent", cursor: "pointer", textAlign: "left", transition: "all 140ms ease" }}
    >
      <div style={{ background: heroBg, padding: "14px 16px", display: "flex", gap: 12 }}>
        {profile.headshot_url
          ? <img src={profile.headshot_url} alt={profile.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `3px solid ${photoB}`, opacity: profile.status === "deceased" ? 0.55 : 1 }} />
          : <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: NAVY, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, border: `3px solid ${photoB}`, opacity: profile.status === "deceased" ? 0.55 : 1 }}>{initials(profile.name)}</div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: profile.status === "deceased" ? "rgba(255,255,255,0.72)" : "#fff", marginBottom: 3 }}>{profile.name}</div>
          {isCandidateTab ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6 }}>
              {candidateRoles.length ? candidateRoles.map((role, index) => (
                <div key={`${role.title}-${index}`} style={{ fontSize: 12, color: "#fff", opacity: profile.status === "deceased" ? 0.6 : 0.88 }}>
                  {role.title} {role.election_date ? `· ${role.election_date}` : ""}
                </div>
              )) : <div style={{ fontSize: 12, color: "#fff", opacity: profile.status === "deceased" ? 0.6 : 0.88 }}>{primaryRole}</div>}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#fff", opacity: profile.status === "deceased" ? 0.6 : 0.88, marginBottom: 6 }}>
              {[primaryRole, profile.geography].filter(Boolean).join(" · ")}
            </div>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tags.map((tag, i) => <StatusTagPill key={i} tag={tag} />)}
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 16px", background: hovered ? COLORS.panelSoft : COLORS.panel, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {profile.geography ? <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{profile.geography}</div> : null}
        {isCandidateTab && currentNonCandidateRoles.length ? (
          <div style={{ display: "grid", gap: 6, marginTop: 8, marginBottom: 8 }}>
            {currentNonCandidateRoles.map((role, index) => (
              <div key={`${role.title}-${index}`} style={{ background: COLORS.goldSoft, color: NAVY, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 700 }}>
                CURRENT: {role.title}, {role.jurisdiction}{role.start_year ? ` (${role.start_year}–present)` : ""}
              </div>
            ))}
          </div>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12, color: COLORS.textSoft }}>
          {profile.salary ? <span>💰 {profile.salary}</span> : null}
          {profile.net_worth ? <span style={{ color: GOLD, fontWeight: 700 }}>Est. {profile.net_worth}</span> : null}
          {profile.residency ? <span>🏠 {profile.residency}</span> : null}
          <span style={{ color: criminalClean ? GREEN : RED, fontWeight: 700 }}>⚖️ {criminalClean ? "No criminal record" : profile.criminal_record}</span>
        </div>
        <DecoderSummary profile={profile} />
        {showFormerOffices ? <FormerOffices offices={profile.former_offices} /> : null}
        </div>
        <span style={{ fontSize: 20, color: COLORS.muted, flexShrink: 0, alignSelf: "center" }}>›</span>
      </div>
    </button>
  );
}

function PredecessorsTab({ seatId, currentProfileId }) {
  const [predecessors, setPredecessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!seatId) { setLoading(false); return; }
    supabase.from("official_profiles")
      .select("id, name, office, status, term_start, term_end, headshot_url, decoder, status_line, party")
      .eq("seat_id", seatId).eq("status", "former").neq("id", currentProfileId)
      .order("term_end", { ascending: false })
      .then(({ data }) => { setPredecessors(data || []); setLoading(false); });
  }, [seatId, currentProfileId]);

  if (loading) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0" }}>Loading predecessors...</div>;
  if (!seatId) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0", fontStyle: "italic" }}>This profile is not linked to a seat. Link it via the admin panel to enable predecessor tracking.</div>;
  if (!predecessors.length) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0", fontStyle: "italic" }}>No former officials on file for this seat yet.</div>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {predecessors.map((pred) => {
        const pb = partyBadge(pred.party);
        return (
          <div key={pred.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
            <button
              onClick={() => setExpanded(expanded === pred.id ? null : pred.id)}
              style={{ width: "100%", background: "rgba(100,100,100,0.18)", border: "none", cursor: "pointer", textAlign: "left", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#555", color: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{initials(pred.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSoft }}>{pred.name}</span>
                  {pb ? <span style={{ background: pb.bg, color: pb.color, fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999 }}>{pb.label}</span> : null}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{[pred.term_start, pred.term_end].filter(Boolean).join(" – ")}</div>
              </div>
              <span style={{ color: COLORS.muted, fontSize: 16 }}>{expanded === pred.id ? "▲" : "▼"}</span>
            </button>
            {expanded === pred.id && (
              <div style={{ padding: "14px 16px", background: "rgba(100,100,100,0.08)", borderTop: `1px solid ${COLORS.border}` }}>
                {pred.status_line ? <p style={{ color: COLORS.textSoft, fontSize: 13, marginBottom: 12, lineHeight: 1.65 }}>{pred.status_line}</p> : null}
                {pred.decoder?.rise ? <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, marginBottom: 10 }}><div style={{ fontSize: 10, color: GOLD, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>The Rise</div><div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65 }}>{pred.decoder.rise}</div></div> : null}
                {pred.decoder?.track_record ? <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 12 }}><div style={{ fontSize: 10, color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Track Record</div><div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65 }}>{pred.decoder.track_record}</div></div> : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  const heroBg = heroBackground(profile);
  const photoB = photoBorderColor(profile);
  const tags = statusTags(profile);
  const [activeTab, setActiveTab] = useState("profile");
  const [decoderOpen, setDecoderOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (activeTab === "predecessors") setDecoderOpen(false);
  }, [activeTab]);

  if (!profile) return null;

  const pb = partyBadge(profile.party);
  const complaintsCount = countComplaintsAndInvestigations(profile);
  const hasDecoder = profile.decoder && (profile.decoder.rise || profile.decoder.affiliations || profile.decoder.beneficiaries || profile.decoder.track_record);

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "on_record", label: "On Record" },
    { id: "donors", label: "Donors" },
    { id: "contact", label: "Contact" },
    { id: "predecessors", label: "Predecessors" },
  ];

  const socialLinks = [
    { key: "twitter", label: "Twitter/X", icon: "𝕏" },
    { key: "facebook", label: "Facebook", icon: "f" },
    { key: "instagram", label: "Instagram", icon: "📷" },
    { key: "linkedin", label: "LinkedIn", icon: "in" },
  ];

  const decoderSections = [
    { key: "rise", label: "The Rise", color: GOLD },
    { key: "affiliations", label: "The Affiliations", color: BLUE },
    { key: "beneficiaries", label: "The Beneficiaries", color: LAVENDER },
    { key: "track_record", label: "The Track Record", color: RED },
  ];

  const contactItems = [
    { label: "Phone", value: profile.contact?.phone, href: profile.contact?.phone ? `tel:${profile.contact.phone.replace(/\D/g, "")}` : null },
    { label: "Email", value: profile.contact?.email, href: profile.contact?.email ? `mailto:${profile.contact.email}` : null },
    { label: "Address", value: profile.contact?.address, href: profile.contact?.address ? `https://maps.google.com/?q=${encodeURIComponent(profile.contact.address)}` : null },
    { label: "Office Hours", value: profile.contact?.office_hours, href: null },
    { label: "Official Website", value: profile.contact?.website, href: profile.contact?.website },
    { label: "Campaign Website", value: profile.contact?.campaign_website, href: profile.contact?.campaign_website },
    { label: "Campaign Finance", value: profile.contact?.finance_url, href: profile.contact?.finance_url },
  ].filter((item) => item.value);

  const handleShareProfile = async () => {
    const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const shortUrl = "https://hsvcivicwatch.org/p/" + slug;
    const smsText = (
      profile.name + "\n" + profile.office + "\n\n" +
      (profile.status_line || "").slice(0, 200) + "\n\n" + shortUrl
    );
    const socialSummary = profile.status_line || cleanTruncate(profile.profile?.summary || "", 200);
    const socialText = (
      profile.name.toUpperCase() + " — " + profile.office + "\n\n" +
      socialSummary + "\n\n" +
      "Full prosecutor-style dossier:\n" + shortUrl + "\n\n" +
      "#HuntsvilleAL #CivicWatch #MadisonCounty"
    );
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.name} — ${profile.office || profile.role_label || "Officials & Elections"}`,
          text: smsText,
          url: shortUrl
        });
        return;
      }
    } catch (e) {
      return;
    }
    try {
      await navigator.clipboard.writeText(socialText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch (e) {}
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,16,28,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 18, width: "100%", maxWidth: 820, boxShadow: "0 24px 80px rgba(0,0,0,0.35)", overflow: "hidden", marginBottom: 40 }}>
        <div style={{ background: heroBg, padding: "22px 26px", display: "flex", alignItems: "flex-start", gap: 18 }}>
          {profile.headshot_url
            ? <img src={profile.headshot_url} alt={profile.name} style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `3px solid ${photoB}`, opacity: profile.status === "deceased" ? 0.6 : 1 }} />
            : <div style={{ width: 76, height: 76, borderRadius: "50%", flexShrink: 0, background: "#0d1e30", color: GOLD, border: `3px solid ${photoB}`, opacity: profile.status === "deceased" ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>{initials(profile.name)}</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{tags.map((tag, i) => <StatusTagPill key={i} tag={tag} />)}</div>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              {profile.level ? (LEVEL_LABELS[profile.level] || profile.level) : ""} Official
            </div>
            <div style={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1.15, marginBottom: 6 }}>{profile.name}</div>
            <div style={{ color: "rgba(247,243,234,0.75)", fontSize: 14, marginBottom: 8 }}>{profile.office || profile.role_label}</div>
            {profile.geography ? <div style={{ color: "rgba(247,243,234,0.50)", fontSize: 12, marginBottom: 10 }}>{profile.geography}</div> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {pb ? <span style={{ background: pb.bg, color: pb.color, border: `1px solid ${pb.color}55`, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{pb.label}</span> : null}
              {socialLinks.map(({ key, label, icon }) =>
                profile.contact?.[key] ? (
                  <a
                    key={key}
                    href={profile.contact[key]}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textDecoration: "none" }}
                  >
                    {icon} {label} ↗
                  </a>
                ) : null
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={handleShareProfile} style={{ background: COLORS.green || "#3E8B5B", border: "none", borderRadius: 8, padding: "0 14px", height: 36, fontSize: 13, fontWeight: 900, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>{shareCopied ? "Copied!" : "Share"}</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, width: 36, height: 36, fontSize: 20, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
          </div>
        </div>

        {(profile.salary || profile.net_worth || profile.party || profile.term_start) ? (
          <div style={{ background: COLORS.panelWarm, borderBottom: `1px solid ${COLORS.border}`, padding: "10px 26px", display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["Salary", profile.salary], ["Est. Net Worth", profile.net_worth], ["Party", profile.party], ["Term", [profile.term_start, profile.term_end].filter(Boolean).join(" – ")], ["Residency", profile.residency]].filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ borderBottom: `2px solid ${COLORS.border}`, padding: "0 26px", display: "flex", overflowX: "auto", background: COLORS.panelSoft }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? `3px solid ${GOLD}` : "3px solid transparent", padding: "13px 16px", fontSize: 13, fontWeight: 700, color: activeTab === t.id ? GOLD : COLORS.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "color 120ms" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "22px 26px" }}>
          {activeTab === "profile" && (
            <div>
              {complaintsCount > 0 ? (
                <div style={{ marginBottom: 18 }}>
                  <button
                    onClick={() => setComplaintsOpen(!complaintsOpen)}
                    style={{ background: RED, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, fontSize: 11, fontWeight: 900, padding: "2px 8px" }}>{complaintsCount}</span>
                    Complaints & Investigations
                    <span>{complaintsOpen ? "▲" : "▼"}</span>
                  </button>
                  {complaintsOpen && (
                    <div style={{ marginTop: 10, background: COLORS.redSoft, border: `1px solid ${RED}44`, borderRadius: 10, padding: "14px 18px" }}>
                      {profile.ethics_complaints && profile.ethics_complaints !== "NONE" && profile.ethics_complaints !== "NOT DISCLOSED" ? (
                        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${RED}22` }}>
                          <div style={{ fontSize: 11, color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Ethics Complaints</div>
                          <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.65 }}>{profile.ethics_complaints}</div>
                        </div>
                      ) : null}
                      {Array.isArray(profile.conflicts?.items) && profile.conflicts.items.map((item, i) => (
                        <div key={i} style={{ marginBottom: i < profile.conflicts.items.length - 1 ? 12 : 0, paddingBottom: i < profile.conflicts.items.length - 1 ? 12 : 0, borderBottom: i < profile.conflicts.items.length - 1 ? `1px solid ${RED}22` : "none" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65, marginBottom: 4 }}>{item.body}</div>
                          {item.sourceLabel ? <div style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic" }}>Source: {item.sourceLabel}</div> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {profile.status_line ? <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.75, marginBottom: 18 }}>{profile.status_line}</p> : null}
              {profile.profile?.summary ? <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.75, marginBottom: 18 }}>{profile.profile.summary}</p> : null}

              {Array.isArray(profile.quick_facts) && profile.quick_facts.length ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10, marginBottom: 18 }}>
                  {profile.quick_facts.map((fact, i) => (
                    <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, marginBottom: 3 }}>{fact.label}</div>
                      <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 700 }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {Array.isArray(profile.metrics) && profile.metrics.length ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
                  {profile.metrics.map((m, i) => (
                    <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 700 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {activeTab === "on_record" && (
            <div style={{ display: "grid", gap: 12 }}>
              {[...(Array.isArray(profile.votes) ? profile.votes : []), ...(Array.isArray(profile.on_record) ? profile.on_record : [])].length === 0
                ? <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic", padding: "20px 0" }}>No on-record items yet.</div>
                : [...(Array.isArray(profile.votes) ? profile.votes : []), ...(Array.isArray(profile.on_record) ? profile.on_record : [])].map((item, i) => (
                  <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{item.title}</span>
                      {item.date ? <span style={{ fontSize: 11, color: COLORS.muted }}>{item.date}</span> : null}
                      {item.position ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: item.position.toLowerCase().includes("yes") || item.position.toLowerCase().includes("support") ? COLORS.greenSoft : COLORS.redSoft, color: item.position.toLowerCase().includes("yes") || item.position.toLowerCase().includes("support") ? GREEN : RED }}>{item.position}</span> : null}
                    </div>
                    {item.summary || item.body ? <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65, marginBottom: 4 }}>{item.summary || item.body}</div> : null}
                    {item.sourceLabel ? <div style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic" }}>Source: {item.sourceLabel}</div> : null}
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === "donors" && (
            <div>
              {!profile.donors?.total_raised && !profile.donors?.summary && (!Array.isArray(profile.donors?.top_donors) || !profile.donors.top_donors.length)
                ? <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic", padding: "20px 0" }}>No donor data on file yet.</div>
                : (
                  <>
                    {profile.donors?.summary ? <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.7, marginBottom: 16 }}>{profile.donors.summary}</p> : null}
                    {profile.donors?.total_raised ? <div style={{ fontSize: 28, fontWeight: 900, color: GOLD, marginBottom: 16 }}>{profile.donors.total_raised} <span style={{ fontSize: 13, color: COLORS.muted, fontWeight: 400 }}>total raised</span></div> : null}
                    {Array.isArray(profile.donors?.top_donors) && profile.donors.top_donors.length ? (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Top Donors</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {profile.donors.top_donors.map((d, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px" }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{d.name}</div>
                                {d.note ? <div style={{ fontSize: 12, color: COLORS.muted }}>{d.note}</div> : null}
                              </div>
                              <span style={{ fontSize: 15, fontWeight: 900, color: GOLD }}>{d.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {Array.isArray(profile.donors?.pacs) && profile.donors.pacs.length ? (
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>PAC Support</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {profile.donors.pacs.map((p, i) => (
                            <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px" }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{p.name}</div>
                              {p.funder ? <div style={{ fontSize: 12, color: COLORS.muted }}>Funded by: {p.funder}</div> : null}
                              {p.agenda ? <div style={{ fontSize: 12, color: COLORS.textSoft, marginTop: 3 }}>{p.agenda}</div> : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {profile.donors?.dark_money ? <div style={{ background: COLORS.redSoft, border: `1px solid ${RED}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}><div style={{ fontSize: 11, color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Dark Money</div><div style={{ fontSize: 13, color: COLORS.text }}>{profile.donors.dark_money}</div></div> : null}
                    {Array.isArray(profile.donors?.links) && profile.donors.links.length ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {profile.donors.links.map((l, i) => <a key={i} href={l.href} target="_blank" rel="noreferrer" style={{ background: NAVY, color: GOLD, fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 8, textDecoration: "none" }}>{l.label} ↗</a>)}
                      </div>
                    ) : null}
                  </>
                )
              }
            </div>
          )}

          {activeTab === "contact" && (
            <div style={{ display: "grid", gap: 12 }}>
              {contactItems.map((item, i) => (
                <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{item.label}</span>
                  {item.href ? <a href={item.href} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: GREEN, fontWeight: 700, textDecoration: "none" }}>{item.value} ↗</a> : <span style={{ fontSize: 14, color: COLORS.text }}>{item.value}</span>}
                </div>
              ))}
              {[
                { label: "Twitter / X", key: "twitter" },
                { label: "Facebook", key: "facebook" },
                { label: "Instagram", key: "instagram" },
                { label: "LinkedIn", key: "linkedin" },
              ].filter((s) => profile.contact?.[s.key]).map((s, i) => (
                <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</span>
                  <a href={profile.contact[s.key]} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: BLUE, fontWeight: 700, textDecoration: "none" }}>{profile.contact[s.key]} ↗</a>
                </div>
              ))}
              {!profile.contact || Object.values(profile.contact).every((v) => !v) ? <div style={{ color: COLORS.muted, fontSize: 14, fontStyle: "italic", padding: "20px 0" }}>No contact information on file yet.</div> : null}
            </div>
          )}

          {activeTab === "predecessors" && (
            <PredecessorsTab seatId={profile.seat_id} currentProfileId={profile.id} />
          )}

          {activeTab !== "predecessors" && hasDecoder ? (
            <div style={{ marginTop: 24, borderTop: `1px solid ${COLORS.border}`, paddingTop: 18 }}>
              <button
                onClick={() => setDecoderOpen(!decoderOpen)}
                style={{ background: GOLD, color: NAVY, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: decoderOpen ? 16 : 0 }}
              >
                {decoderOpen ? "Hide Decoder ▲" : "Decode This 🔍"}
              </button>
              {decoderOpen && (
                <div style={{ background: NAVY, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: "rgba(198,163,77,0.55)", marginBottom: 22, textTransform: "uppercase" }}>Civic Investigator Analysis</div>
                  {decoderSections.map(({ key, label, color }) => (
                    profile.decoder?.[key] ? (
                      <div key={key} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 14, marginBottom: 22 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color, marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 15, lineHeight: 1.7, color }}>
                          {profile.decoder[key]}
                        </div>
                      </div>
                    ) : null
                  ))}
                  <button
                    onClick={() => setDecoderOpen(false)}
                    style={{ background: "transparent", border: "none", color: "rgba(198,163,77,0.55)", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginTop: 4 }}
                  >
                    Hide Decoder ▲
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function OfficialsElectionsPage() {
  const [tab, setTab] = useState("current_officials");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data, error: err } = await supabase
        .from("official_profiles")
        .select("id, name, office, level, kind, geography, party, status, status_line, salary, net_worth, residency, criminal_record, term_start, term_end, headshot_url, seat_id, decoder, profile, quick_facts, metrics, contact, on_record, votes, donors, conflicts, ethics_complaints, data")
        .order("level", { ascending: true })
        .order("name", { ascending: true });
      if (err) throw err;
      setProfiles((data || []).map(normalizeProfileRecord));
    } catch (e) { setError("Could not load profiles. " + (e?.message || "")); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const directoryProfiles = profiles.filter((p) => {
    if (tab === "current_officials") return getNonCandidateRoles(p).length > 0;
    if (tab === "candidates") return getCandidateRoles(p).length > 0;
    return true;
  });

  const filtered = directoryProfiles.filter((p) => {
    const matchLevel = activeLevel === "all" || p.level === activeLevel;
    const q = search.toLowerCase();
    const roleSearch = asArray(p.current_roles).flatMap((role) => [role.title, role.jurisdiction, role.election_date]).filter(Boolean);
    const matchSearch = !q || [p.name, p.office, p.geography, p.party, p.residency, ...roleSearch].filter(Boolean).some((v) => v.toLowerCase().includes(q));
    return matchLevel && matchSearch;
  });

  const grouped = LEVEL_ORDER.reduce((acc, level) => {
    const items = filtered.filter((p) => p.level === level);
    if (items.length) acc[level] = items;
    return acc;
  }, {});

  const tabBtn = (id) => ({
    background: "none", border: "none",
    borderBottom: tab === id ? `3px solid ${GOLD}` : "3px solid transparent",
    color: tab === id ? GOLD : COLORS.muted,
    padding: "14px 18px", fontSize: 13, fontWeight: 700,
    cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
    transition: "color 120ms", whiteSpace: "nowrap",
  });

  return (
    <div>
      {selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Officials & Elections</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: COLORS.text, lineHeight: 1.15, marginBottom: 8 }}>Who Runs Huntsville</h1>
        <p style={{ fontSize: 16, color: COLORS.textSoft, lineHeight: 1.65 }}>Prosecutor-style dossiers on the elected and appointed officials making decisions that affect your daily life — every donor named, every vote documented, every contradiction on record.</p>
      </div>

      <div style={{ borderBottom: `2px solid ${COLORS.border}`, display: "flex", overflowX: "auto", background: COLORS.panelSoft, borderRadius: "10px 10px 0 0" }}>
        {DIRECTORY_TABS.map((item) => (
          <button key={item.id} style={tabBtn(item.id)} onClick={() => setTab(item.id)}>{item.label}</button>
        ))}
      </div>

      <div style={{ padding: "24px 0" }}>
        {(tab === "current_officials" || tab === "candidates") && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <input type="text" placeholder={tab === "candidates" ? "Search by name, candidacy, party, or location..." : "Search by name, office, party, or location..."} value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: COLORS.text, outline: "none" }} />
              {["all", ...LEVEL_ORDER].map((level) => (
                <button key={level} onClick={() => setActiveLevel(level)}
                  style={{ background: activeLevel === level ? NAVY : COLORS.panel, color: activeLevel === level ? GOLD : COLORS.textSoft, border: `1px solid ${activeLevel === level ? COLORS.borderStrong : COLORS.border}`, borderRadius: 8, padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  {level === "all" ? "All" : LEVEL_LABELS[level] || level}
                </button>
              ))}
            </div>
            {loading && <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted, fontSize: 15 }}>Loading profiles...</div>}
            {error && <div style={{ background: COLORS.redSoft, border: `1px solid ${RED}44`, borderRadius: 10, padding: "14px 18px", color: RED, fontSize: 14, marginBottom: 18 }}>{error}</div>}
            {!loading && !error && profiles.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◆</div>
                <div style={{ fontSize: 16, marginBottom: 8 }}>No profiles published yet.</div>
                <div style={{ fontSize: 13 }}>Publish official profiles through the admin panel to populate this directory.</div>
              </div>
            )}
            {!loading && !error && profiles.length > 0 && filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.muted, fontSize: 15 }}>No profiles match your search.</div>}
            {Object.entries(grouped).map(([level, items]) => (
              <div key={level} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${COLORS.border}` }}>
                  <span style={{ background: NAVY, color: GOLD, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1 }}>{LEVEL_LABELS[level] || level}</span>
                  <span style={{ color: COLORS.muted, fontSize: 13 }}>{items.length} profile{items.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {items.map((profile) => <ProfileCard key={profile.id} profile={profile} onClick={setSelectedProfile} variant={tab === "candidates" ? "candidate" : "current"} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "elections" && (
          <div>
            <div style={{ background: COLORS.redSoft, border: `1px solid ${RED}44`, borderLeft: `4px solid ${RED}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>2026 Is A High-Impact Year</div>
              <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>Governor, U.S. Senate, sheriff, council, and school board races can all directly affect Madison County life.</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {ELECTIONS.map((e, i) => (
                <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${e.priority ? RED : NAVY}`, borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>
                      {e.priority && <span style={{ fontSize: 9, fontWeight: 700, color: RED, background: COLORS.redSoft, padding: "2px 7px", borderRadius: 8, marginRight: 8, border: `1px solid ${RED}44` }}>HIGH PRIORITY</span>}
                      {e.office}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, background: COLORS.goldSoft, padding: "2px 9px", borderRadius: 8, border: `1px solid ${GOLD}55`, flexShrink: 0 }}>{e.date}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.6 }}>{e.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "voting" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
              {[["37,000", "Unregistered Eligible", "Madison County residents who can vote but haven't registered", RED], ["11%", "School Board Turnout", "Low turnout controls a $310M budget", COLORS.orange], ["< 200 votes", "Local Race Margin", "Many local races decided by a handful of votes", COLORS.orange], ["15 days", "Registration Deadline", "Before any Alabama election", BLUE]].map(([v, l, s, c], i) => (
                <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 12px" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, margin: "4px 0 2px" }}>{l}</div>
                  <div style={{ fontSize: 12, color: COLORS.textSoft, lineHeight: 1.4 }}>{s}</div>
                </div>
              ))}
            </div>
            {[
              { step: "1. Register to Vote", detail: "Online through Alabama Votes. Registration closes 15 days before each election.", link: "https://myinfo.alabamavotes.gov", linkText: "Register Now ↗" },
              { step: "2. Check Your Registration", detail: "If you moved, changed your name, or haven't voted in years, verify your status now.", link: "https://myinfo.alabamavotes.gov/voterview/", linkText: "Check Registration ↗" },
              { step: "3. Find Your Polling Place", detail: "Polling places can change. Verify before election day.", link: "https://myinfo.alabamavotes.gov/voterview/", linkText: "Find Polling Place ↗" },
              { step: "4. Alabama Voter ID Rules", detail: "Alabama requires photo ID. Free voter IDs are available if you do not already have one.", link: "https://www.alabamavoterID.com/", linkText: "Voter ID Info ↗" },
            ].map((s, i) => (
              <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${GREEN}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{s.step}</div>
                <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.7, marginBottom: 10 }}>{s.detail}</div>
                <a href={s.link} target="_blank" rel="noreferrer" style={{ background: NAVY, color: GOLD, fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>{s.linkText}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
