import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { COLORS } from "../../config/theme";

const GOLD = "#C6A34D";
const BLUE = "#2F5D8A";
const LAVENDER = "#7A4FA3";
const RED = "#B4473E";
const GREEN = "#3E8B5B";
const NAVY = "#193150";

const LEVEL_ORDER = ["local", "state", "federal", "judge"];
const LEVEL_LABELS = { local: "Local", state: "State", federal: "Federal", judge: "Judiciary" };

const DECODER_TABS = [
  { id: "rise", label: "The Rise", color: GOLD },
  { id: "affiliations", label: "Affiliations", color: BLUE },
  { id: "beneficiaries", label: "Beneficiaries", color: LAVENDER },
  { id: "track_record", label: "Track Record", color: RED },
];

const ELECTIONS = [
  { office: "Governor - OPEN SEAT", date: "Nov 2026", priority: true, note: "Kay Ivey is term-limited. Governor controls major appointments affecting environment, prisons, and healthcare oversight." },
  { office: "U.S. Senate - Open (Tuberville running for Governor)", date: "Nov 2026", priority: true, note: "Rare open Senate race. This will shape Alabama's federal representation for years." },
  { office: "HCS School Board D2, D3, D4", date: "Nov 2026", priority: true, note: "Controls a $310M budget. These races are often decided by a few hundred votes." },
  { office: "Madison County Sheriff", date: "Nov 2026", priority: false, note: "Jail policy, pretrial detention, phone contracts, and enforcement priorities all run through this office." },
  { office: "Huntsville City Council D2, D3, D4", date: "Nov 2026", priority: false, note: "Council votes on roads, zoning, budgets, and appointments to key boards." },
];

function initials(name) {
  return String(name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function statusColor(s) {
  return s === "active" ? GREEN : s === "candidate" ? GOLD : s === "former" ? COLORS.muted : s === "deceased" ? "#888" : COLORS.muted;
}

function statusLabel(s) {
  return s === "active" ? "Active" : s === "candidate" ? "Candidate" : s === "former" ? "Former" : s === "deceased" ? "Deceased" : s || "Unknown";
}

function ProfileCard({ profile, onClick }) {
  const [hovered, setHovered] = useState(false);
  const sc = statusColor(profile.status);
  return (
    <button
      onClick={() => onClick(profile)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%", background: hovered ? COLORS.panelSoft : COLORS.panel, border: `1px solid ${hovered ? COLORS.borderStrong : COLORS.border}`, borderLeft: `4px solid ${sc}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 140ms ease", display: "flex", alignItems: "center", gap: 14 }}
    >
      {profile.headshot_url ? (
        <img src={profile.headshot_url} alt={profile.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${sc}` }} />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: NAVY, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, border: `2px solid ${sc}` }}>{initials(profile.name)}</div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.text, marginBottom: 2, lineHeight: 1.2 }}>{profile.name}</div>
        <div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.4 }}>{profile.office || profile.role_label || "-"}</div>
        {profile.geography ? <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{profile.geography}</div> : null}
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <span style={{ background: sc + "22", color: sc, border: `1px solid ${sc}44`, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 0.8 }}>{statusLabel(profile.status)}</span>
        {profile.party ? <span style={{ fontSize: 10, color: COLORS.muted }}>{profile.party}</span> : null}
        <span style={{ fontSize: 18, color: COLORS.muted }>&rsaquo;</span>
      </div>
    </button>
  );
}

function DecoderBlock({ color, label, content }) {
  if (!content) return <div style={{ color: COLORS.muted, fontSize: 13, fontStyle: "italic", padding: "20px 0" }}>No {label.toLowerCase()} on file yet.</div>;
  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 16 }}>
      <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.75 }}>{content}</div>
    </div>
  );
}

function PredecessorsTab({ seatId, currentProfileId }) {
  const [predecessors, setPredecessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!seatId) {
      setLoading(false);
      return;
    }
    supabase.from("official_profiles").select("id, name, office, status, term_start, term_end, headshot_url, decoder, status_line")
      .eq("seat_id", seatId).eq("status", "former").neq("id", currentProfileId)
      .order("term_end", { ascending: false })
      .then(({ data }) => { setPredecessors(data || []); setLoading(false); });
  }, [seatId, currentProfileId]);

  if (loading) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0" }}>Loading predecessors...</div>;
  if (!seatId) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0", fontStyle: "italic" }}>This profile is not linked to a seat. Link it via the admin panel to enable predecessor tracking.</div>;
  if (!predecessors.length) return <div style={{ color: COLORS.muted, fontSize: 14, padding: "20px 0", fontStyle: "italic" }}>No former officials on file for this seat.</div>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {predecessors.map((pred) => (
        <div key={pred.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
          <button
            onClick={() => setExpanded(expanded === pred.id ? null : pred.id)}
            style={{ width: "100%", background: "rgba(100,100,100,0.18)", border: "none", cursor: "pointer", textAlign: "left", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#555", color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{initials(pred.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSoft }}>{pred.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>{[pred.term_start, pred.term_end].filter(Boolean).join(" - ")}</div>
            </div>
            <span style={{ color: COLORS.muted, fontSize: 16 }}>{expanded === pred.id ? "▲" : "▼"}</span>
          </button>
          {expanded === pred.id && (
            <div style={{ padding: "14px 16px", background: "rgba(100,100,100,0.08)", borderTop: `1px solid ${COLORS.border}` }}>
              {pred.status_line ? <p style={{ color: COLORS.textSoft, fontSize: 13, marginBottom: 10 }}>{pred.status_line}</p> : null}
              {pred.decoder?.rise ? <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, marginBottom: 8 }}><div style={{ fontSize: 10, color: GOLD, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>The Rise</div><div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65 }}>{pred.decoder.rise}</div></div> : null}
              {pred.decoder?.track_record ? <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 12 }}><div style={{ fontSize: 10, color: RED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Track Record</div><div style={{ fontSize: 13, color: COLORS.textSoft, lineHeight: 1.65 }}>{pred.decoder.track_record}</div></div> : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!profile) return null;

  const allTabs = [
    { id: "overview", label: "Overview", color: NAVY },
    ...DECODER_TABS,
    { id: "predecessors", label: "Predecessors", color: COLORS.muted },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,16,28,0.60)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 18, width: "100%", maxWidth: 780, boxShadow: "0 24px 80px rgba(0,0,0,0.30)", overflow: "hidden" }}>
        <div style={{ background: NAVY, padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 18 }}>
          {profile.headshot_url ? (
            <img src={profile.headshot_url} alt={profile.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `3px solid ${GOLD}` }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0, background: "#0d1e30", color: GOLD, border: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900 }}>{initials(profile.name)}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{profile.level ? (LEVEL_LABELS[profile.level] || profile.level) : ""} Official</div>
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>{profile.name}</div>
            <div style={{ color: "rgba(247,243,234,0.70)", fontSize: 14 }}>{profile.office || profile.role_label}</div>
            {profile.geography ? <div style={{ color: "rgba(247,243,234,0.50)", fontSize: 12, marginTop: 2 }}>{profile.geography}</div> : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, width: 36, height: 36, fontSize: 20, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            {profile.status ? <span style={{ background: statusColor(profile.status) + "33", color: statusColor(profile.status), border: `1px solid ${statusColor(profile.status)}55`, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 1 }}>{statusLabel(profile.status)}</span> : null}
          </div>
        </div>

        {(profile.salary || profile.net_worth || profile.party || profile.term_start) ? (
          <div style={{ background: COLORS.panelWarm, borderBottom: `1px solid ${COLORS.border}`, padding: "10px 28px", display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["Salary", profile.salary], ["Est. Net Worth", profile.net_worth], ["Party", profile.party], ["Term", [profile.term_start, profile.term_end].filter(Boolean).join(" - ")]].filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ borderBottom: `2px solid ${COLORS.border}`, padding: "0 28px", display: "flex", gap: 0, overflowX: "auto", background: COLORS.panelSoft }}>
          {allTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? `3px solid ${t.color}` : "3px solid transparent", padding: "13px 16px", fontSize: 13, fontWeight: 700, color: activeTab === t.id ? t.color : COLORS.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "color 120ms" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px 28px", minHeight: 240 }}>
          {activeTab === "overview" && (
            <div>
              {profile.status_line ? <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.7, marginBottom: 18 }}>{profile.status_line}</p> : null}
              {Array.isArray(profile.quick_facts) && profile.quick_facts.length ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 18 }}>
                  {profile.quick_facts.map((fact, i) => (
                    <div key={i} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, marginBottom: 3 }}>{fact.label}</div>
                      <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 700 }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {profile.profile?.summary ? <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.75 }}>{profile.profile.summary}</p> : null}
              {profile.contact && (profile.contact.phone || profile.contact.email || profile.contact.website) ? (
                <div style={{ marginTop: 20, padding: "14px 16px", background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Contact</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {profile.contact.phone ? <a href={`tel:${profile.contact.phone.replace(/\D/g, "")}`} style={{ color: COLORS.text, fontSize: 14, textDecoration: "none" }}>📞 {profile.contact.phone}</a> : null}
                    {profile.contact.email ? <a href={`mailto:${profile.contact.email}`} style={{ color: GREEN, fontSize: 14, textDecoration: "none" }}>✉ {profile.contact.email}</a> : null}
                    {profile.contact.website ? <a href={profile.contact.website} target="_blank" rel="noreferrer" style={{ color: BLUE, fontSize: 14, textDecoration: "none" }}>Official site ↗</a> : null}
                    {profile.contact.finance_url ? <a href={profile.contact.finance_url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: 14, textDecoration: "none" }}>Campaign finance ↗</a> : null}
                  </div>
                </div>
              ) : null}
            </div>
          )}
          {activeTab === "rise" && <DecoderBlock color={GOLD} label="The Rise" content={profile.decoder?.rise} />}
          {activeTab === "affiliations" && <DecoderBlock color={BLUE} label="Affiliations" content={profile.decoder?.affiliations} />}
          {activeTab === "beneficiaries" && <DecoderBlock color={LAVENDER} label="Beneficiaries" content={profile.decoder?.beneficiaries} />}
          {activeTab === "track_record" && <DecoderBlock color={RED} label="Track Record" content={profile.decoder?.track_record} />}
          {activeTab === "predecessors" && <PredecessorsTab seatId={profile.seat_id} currentProfileId={profile.id} />}
        </div>
      </div>
    </div>
  );
}

export default function OfficialsElectionsPage() {
  const [tab, setTab] = useState("directory");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("official_profiles")
        .select("id, name, office, level, kind, geography, party, status, status_line, salary, net_worth, term_start, term_end, headshot_url, seat_id, decoder, profile, quick_facts, contact")
        .order("level", { ascending: true })
        .order("name", { ascending: true });
      if (err) throw err;
      setProfiles(data || []);
    } catch (e) {
      setError("Could not load profiles. " + (e?.message || ""));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const filtered = profiles.filter((p) => {
    const matchLevel = activeLevel === "all" || p.level === activeLevel;
    const q = search.toLowerCase();
    const matchSearch = !q || [p.name, p.office, p.geography, p.party].filter(Boolean).some((v) => v.toLowerCase().includes(q));
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
        <p style={{ fontSize: 16, color: COLORS.textSoft, lineHeight: 1.65 }}>Prosecutor-style dossiers on the elected and appointed officials making decisions that affect your daily life - every donor named, every vote documented, every contradiction on record.</p>
      </div>

      <div style={{ borderBottom: `2px solid ${COLORS.border}`, display: "flex", overflowX: "auto", background: COLORS.panelSoft, borderRadius: "10px 10px 0 0" }}>
        <button style={tabBtn("directory")} onClick={() => setTab("directory")}>Directory</button>
        <button style={tabBtn("elections")} onClick={() => setTab("elections")}>2026 Elections</button>
        <button style={tabBtn("voting")} onClick={() => setTab("voting")}>Voting & Registration</button>
      </div>

      <div style={{ padding: "24px 0" }}>
        {tab === "directory" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search by name, office, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: COLORS.text, outline: "none" }}
              />
              {["all", ...LEVEL_ORDER].map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  style={{ background: activeLevel === level ? NAVY : COLORS.panel, color: activeLevel === level ? GOLD : COLORS.textSoft, border: `1px solid ${activeLevel === level ? COLORS.borderStrong : COLORS.border}`, borderRadius: 8, padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.8 }}
                >
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
                  {items.map((profile) => <ProfileCard key={profile.id} profile={profile} onClick={setSelectedProfile} />)}
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
