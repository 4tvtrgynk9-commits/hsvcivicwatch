import React, { useState, useEffect, useMemo } from "react";
import { COLORS } from "../../config/theme";
import CivicDecoderPanel from "../../components/CivicDecoderPanel";

function getKindStyle(profile) {
  const kind = String(profile?.kind || "").trim().toLowerCase();
  let badgeLabel = "Board Member";

  if (kind === "school_board") badgeLabel = "School Board";
  else if (kind === "judge") badgeLabel = "Judicial";
  else if (kind === "appointed") badgeLabel = "Appointed";
  else if (kind === "director") badgeLabel = "Director";
  else if (kind === "authority_member") badgeLabel = "Authority Member";

  return {
    accent: "#4A90C4",
    accentDark: "#2d6a96",
    soft: "rgba(74,144,196,0.10)",
    badgeLabel,
  };
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function EmptyState({ title, body, tone = "default" }) {
  return (
    <div
      style={{
        background: tone === "warning" ? "#f8f0e2" : "#fcfaf5",
        border: `1px solid ${tone === "warning" ? COLORS.gold : COLORS.border}`,
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
    </div>
  );
}

function Headshot({ profile, size }) {
  const [hasError, setHasError] = useState(false);
  const { soft, accentDark } = getKindStyle(profile);

  useEffect(() => {
    setHasError(false);
  }, [profile?.headshotUrl, profile?.name]);

  if (!profile?.headshotUrl || hasError) {
    return (
      <div
        aria-label={`${profile?.name || "Profile"} initials`}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.75)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
          flexShrink: 0,
          background: soft,
          color: accentDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size / 2.8,
          fontWeight: 900,
        }}
      >
        {getInitials(profile?.name)}
      </div>
    );
  }

  return (
    <img
      src={profile.headshotUrl}
      alt={`${profile.name} headshot`}
      onError={() => setHasError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.75)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        flexShrink: 0,
        objectFit: "cover",
      }}
    />
  );
}

function ProfileTile({ profile, onOpen }) {
  const metrics = Array.isArray(profile.metrics) ? profile.metrics.slice(0, 2) : [];
  const kindStyle = getKindStyle(profile);

  return (
    <button
      onClick={() => onOpen(profile)}
      style={{
        textAlign: "left",
        border: `1px solid ${COLORS.border}`,
        borderTop: "5px solid #4A90C4",
        borderRadius: 16,
        background: "#fff",
        padding: 18,
        cursor: "pointer",
        boxShadow: "0 14px 30px rgba(25,49,80,0.08)",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <Headshot profile={profile} size={64} />
        <div style={{ minWidth: 0 }}>
          <div style={{ color: COLORS.text, fontSize: 20, fontWeight: 1000, lineHeight: 1.1 }}>{profile.name}</div>
          {(profile.office || profile.role) ? (
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 6 }}>{profile.office || profile.role}</div>
          ) : null}
          <div
            style={{
              display: "inline-flex",
              marginTop: 10,
              background: "rgba(74,144,196,0.12)",
              color: "#4A90C4",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {kindStyle.badgeLabel}
          </div>
        </div>
      </div>

      {profile.statusLine ? (
        <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, lineHeight: 1.6, marginBottom: 14 }}>
          {profile.statusLine}
        </div>
      ) : null}

      {metrics.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {metrics.map((metric, index) => (
            <div
              key={`${metric.label}-${index}`}
              style={{
                background: "#fcfaf5",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  color: COLORS.muted,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {metric.label}
              </div>
              <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{metric.value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </button>
  );
}

function SectionTabs({ tabs, activeTab, onChange, accent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
        background: "#fcfaf5",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              border: "none",
              background: "transparent",
              color: isActive ? accent : COLORS.muted,
              borderBottom: isActive ? `3px solid ${accent}` : "3px solid transparent",
              padding: "12px 14px 10px",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ConflictsPane({ profile }) {
  const conflicts = profile?.conflicts;
  const items = Array.isArray(conflicts?.items) ? conflicts.items : [];

  if (!conflicts || (!String(conflicts.summary || "").trim() && !items.length)) {
    return (
      <EmptyState
        title="No conflicts on record"
        body="Business ties, employer relationships, donor overlaps, and contracts voted on will appear here when documented."
      />
    );
  }

  return (
    <div>
      {conflicts.summary ? (
        <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{conflicts.summary}</div>
      ) : null}
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, background: "#fff", marginBottom: 10 }}
        >
          {item.title ? <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{item.title}</div> : null}
          {item.body ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.body}</div> : null}
          {item.sourceLabel ? (
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 8 }}>
              {item.sourceLabel}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function OnRecordList({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No on-record items yet"
        body="Quotes, statements, interviews, social media posts, sworn testimony, and public comments will appear here when published."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, background: "#fff" }}>
          {item.title ? <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{item.title}</div> : null}
          {item.body ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.body}</div> : null}
          {item.sourceLabel ? (
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 8 }}>
              {item.sourceLabel}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DecisionsPane({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No decisions on record yet"
        body="Votes, rulings, contracts awarded, policies enacted or blocked, and key actions will appear here when documented."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, background: "#fff", padding: 14 }}>
          {item.title ? <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{item.title}</div> : null}
          {item.date ? (
            <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.date}</div>
          ) : null}
          {item.position ? <div style={{ color: COLORS.red, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{item.position}</div> : null}
          {item.summary ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.summary}</div> : null}
          {item.sourceLabel ? (
            <div style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8 }}>
              {item.sourceLabel}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ContactPane({ profile }) {
  const contact = profile?.contact || {};
  const rows = [
    { label: "Phone", value: contact.phone },
    { label: "Email", value: contact.email },
    { label: "Address", value: contact.address },
    { label: "Hours", value: contact.officeHours || contact.hours },
  ].filter((row) => row.value);

  const hasAnyData = rows.length > 0 || contact.website;

  if (!hasAnyData) {
    return (
      <EmptyState
        title="No contact information yet"
        body="Phone, email, address, office hours, and official links will appear here when saved for this profile."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((row) => (
        <div key={row.label} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, background: "#fff" }}>
          <div style={{ color: COLORS.muted, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            {row.label}
          </div>
          <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.7 }}>{row.value}</div>
        </div>
      ))}
      {contact.website ? (
        <a
          href={contact.website}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            background: "#fff",
            color: COLORS.navy,
            fontSize: 13,
            fontWeight: 800,
            textDecoration: "none",
            padding: "10px 12px",
          }}
        >
          Visit Official Website
        </a>
      ) : null}
    </div>
  );
}

function DecoderPane({ profile, accent, accentDark, soft }) {
  const [decoded, setDecoded] = useState(false);
  const decoder = profile?.decoder || {};
  const hasDecoder = ["rise", "affiliations", "beneficiaries", "track_record"].some(
    (key) => String(decoder[key] || "").trim()
  );

  useEffect(() => {
    setDecoded(false);
  }, [profile?.id]);

  if (!hasDecoder) return null;

  return (
    <div>
      <button
        onClick={() => setDecoded((value) => !value)}
        style={{
          background: decoded ? accentDark : soft,
          color: decoded ? "#fff" : accentDark,
          border: decoded ? "none" : `2px solid ${accent}`,
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 16,
          fontWeight: 1000,
          cursor: "pointer",
          width: "100%",
        }}
      >
        {decoded ? "Hide Decoder" : "Decode This"}
      </button>
      {decoded ? (
        <CivicDecoderPanel
          analysis={{
            whatsHappening: decoder.rise,
            connections: decoder.affiliations,
            whoBenefits: decoder.beneficiaries,
            impact: decoder.track_record,
          }}
          onHide={() => setDecoded(false)}
        />
      ) : null}
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  const { accent, accentDark, soft } = getKindStyle(profile);
  const tabs = [
    { id: "profile", label: "Profile" },
    ...(Array.isArray(profile?.votes) && profile.votes.length ? [{ id: "decisions", label: "Decisions and Votes" }] : []),
    ...(profile?.conflicts ? [{ id: "conflicts", label: "Conflicts of Interest" }] : []),
    ...(Array.isArray(profile?.onRecord) && profile.onRecord.length ? [{ id: "on-record", label: "On Record" }] : []),
    { id: "contact", label: "Contact" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "profile");

  useEffect(() => {
    setActiveTab(tabs[0]?.id || "profile");
  }, [profile?.id]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(6,13,24,0.72)",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(1080px, 100%)",
          margin: "0 auto",
          border: "2px solid #4A90C4",
          borderRadius: 18,
          overflow: "hidden",
          background: "#f8f3eb",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ position: "relative", background: "linear-gradient(145deg, #1a2f4a, #0f1f33)", color: "#fff", padding: 18 }}>
          <button
            onClick={onClose}
            aria-label="Close profile"
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 42,
              height: 42,
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 56 }}>
            <Headshot profile={profile} size={84} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 34, fontWeight: 1000, lineHeight: 1.05 }}>{profile.name}</div>
              <div style={{ color: "rgba(255,255,255,0.86)", fontSize: 15, fontWeight: 700, marginTop: 6 }}>
                {[profile.office, profile.geography].filter(Boolean).join(" · ")}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {[profile.roleLabel, profile.statusLine].filter(Boolean).map((label) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      borderRadius: 999,
                      padding: "5px 10px",
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(profile.metrics) && profile.metrics.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              borderBottom: `1px solid ${COLORS.border}`,
              background: "#f8f0e2",
            }}
          >
            {profile.metrics.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                style={{
                  padding: "16px 16px 14px",
                  borderRight: index < profile.metrics.length - 1 ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                <div
                  style={{
                    color: COLORS.muted,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {metric.label}
                </div>
                <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 1000, lineHeight: 1.2 }}>{metric.value}</div>
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(profile.quickFacts) && profile.quickFacts.length ? (
          <div style={{ padding: "14px 16px", background: "#fcfaf5", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {profile.quickFacts.map((fact, index) => (
                <div key={`${fact.label}-${index}`} style={{ fontSize: 14 }}>
                  <span style={{ color: COLORS.muted, fontWeight: 700 }}>{fact.label}: </span>
                  <span style={{ color: COLORS.text }}>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <SectionTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} accent={accent} />

        <div style={{ padding: 18 }}>
          {activeTab === "profile" ? (
            <div>
              {profile?.profile?.summary ? (
                <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{profile.profile.summary}</div>
              ) : null}
              {Array.isArray(profile?.profile?.timeline) && profile.profile.timeline.length ? (
                <div style={{ display: "grid", gap: 14 }}>
                  {profile.profile.timeline.map((item, index) => (
                    <div key={`${item.date}-${item.title}-${index}`} style={{ display: "flex", gap: 14 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4A90C4", marginTop: 4 }} />
                        {index < profile.profile.timeline.length - 1 ? (
                          <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />
                        ) : null}
                      </div>
                      <div>
                        {item.date ? (
                          <div style={{ color: "#4A90C4", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{item.date}</div>
                        ) : null}
                        {item.title ? <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900, marginTop: 4 }}>{item.title}</div> : null}
                        {item.detail ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>{item.detail}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No profile history yet" body="Summary details and timeline milestones will appear here when published." />
              )}
            </div>
          ) : null}

          {activeTab === "decisions" ? <DecisionsPane items={profile.votes || []} /> : null}
          {activeTab === "conflicts" ? <ConflictsPane profile={profile} /> : null}
          {activeTab === "on-record" ? <OnRecordList items={profile.onRecord || []} /> : null}
          {activeTab === "contact" ? <ContactPane profile={profile} /> : null}
        </div>

        <div style={{ padding: "0 18px 18px" }}>
          <DecoderPane profile={profile} accent={accent} accentDark={accentDark} soft={soft} />
        </div>
      </div>
    </div>
  );
}

export default function BoardsProfileDirectory({ activeScope, profiles, loading, error }) {
  const visibleProfiles = useMemo(() => {
    const source = Array.isArray(profiles) ? profiles : [];

    return source
      .filter((profile) => {
        if (activeScope === "overview") return true;
        return Array.isArray(profile.scopes) && profile.scopes.includes(activeScope);
      })
      .sort((a, b) => {
        if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
        const aSort = Number(a.sortOrder ?? a.sort_order ?? 0) || 0;
        const bSort = Number(b.sortOrder ?? b.sort_order ?? 0) || 0;
        if (aSort !== bSort) return aSort - bSort;
        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [activeScope, profiles]);

  const [selectedId, setSelectedId] = useState("");

  const selectedProfile = useMemo(() => {
    return visibleProfiles.find((profile) => String(profile.id) === String(selectedId)) || null;
  }, [selectedId, visibleProfiles]);

  useEffect(() => {
    if (selectedId && !visibleProfiles.some((profile) => String(profile.id) === String(selectedId))) {
      setSelectedId("");
    }
  }, [selectedId, visibleProfiles]);

  return (
    <section style={{ marginBottom: 28 }}>
      {loading ? <EmptyState title="Loading profiles" body="Requesting board profile rows from Supabase." /> : null}
      {!loading && error ? <EmptyState tone="warning" title="Profile directory not connected" body={error} /> : null}
      {!loading && !error && !visibleProfiles.length ? (
        <EmptyState title="No profiles published yet" body="Publish rows to the board_profiles table and they will appear here automatically." />
      ) : null}

      {!loading && !error && visibleProfiles.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {visibleProfiles.map((profile) => (
            <ProfileTile key={profile.id} profile={profile} onOpen={(item) => setSelectedId(item.id)} />
          ))}
        </div>
      ) : null}

      {selectedProfile ? <ProfileModal profile={selectedProfile} onClose={() => setSelectedId("")} /> : null}
    </section>
  );
}
