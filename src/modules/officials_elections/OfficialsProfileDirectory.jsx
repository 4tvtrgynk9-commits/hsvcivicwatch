import React, { useEffect, useMemo, useState } from "react";
import CivicDecoderPanel from "../../components/CivicDecoderPanel";
import { COLORS } from "../../config/theme";

const PARTY_STYLES = {
  republican: {
    accent: "#c0392b",
    accentDark: "#8f2117",
    soft: "#f6dfdc",
    text: "Republican",
    fallbackLabel: "GOP",
  },
  democrat: {
    accent: "#1a5276",
    accentDark: "#123a54",
    soft: "#dcecf7",
    text: "Democrat",
    fallbackLabel: "DEM",
  },
  independent: {
    accent: "#1e8449",
    accentDark: "#145734",
    soft: "#dceddf",
    text: "Independent",
    fallbackLabel: "IND",
  },
  libertarian: {
    accent: "#b8860b",
    accentDark: "#7d5d09",
    soft: "#f5edd7",
    text: "Libertarian",
    fallbackLabel: "LIB",
  },
  nonpartisan: {
    accent: "#b8860b",
    accentDark: "#7b5b08",
    soft: "#f8edd8",
    text: "Nonpartisan",
    fallbackLabel: "NP",
  },
  candidate: {
    accent: "#cf7b2f",
    accentDark: "#945317",
    soft: "#f7e8d8",
    text: "Candidate",
    fallbackLabel: "CAN",
  },
  judicial: {
    accent: "#6c3483",
    accentDark: "#4d235d",
    soft: "#eee1f4",
    text: "Judicial",
    fallbackLabel: "JDG",
  },
  unknown: {
    accent: "#5e6d80",
    accentDark: "#364252",
    soft: "#e5e8ec",
    text: "Under research",
    fallbackLabel: "N/A",
  },
};

function getPartyStyle(profile) {
  const raw = String(profile.party || "").trim().toLowerCase();
  if (raw.includes("republic")) return PARTY_STYLES.republican;
  if (raw.includes("democrat")) return PARTY_STYLES.democrat;
  if (raw.includes("independent")) return PARTY_STYLES.independent;
  if (raw.includes("libertarian")) return PARTY_STYLES.libertarian;
  if (raw.includes("nonpartisan")) return PARTY_STYLES.nonpartisan;
  if (raw.includes("under research") || raw.includes("unknown")) return PARTY_STYLES.unknown;
  if (profile.kind === "candidate") return PARTY_STYLES.candidate;
  if (profile.kind === "judge" || profile.kind === "judicial") return PARTY_STYLES.judicial;
  return PARTY_STYLES.unknown;
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

function buildFallbackPortrait(profile) {
  const style = getPartyStyle(profile);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${profile.name} fallback portrait">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${style.accent}"/>
          <stop offset="100%" stop-color="${style.accentDark}"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg)"/>
      <circle cx="60" cy="40" r="18" fill="rgba(255,255,255,0.9)"/>
      <path d="M24 104c8-23 22-34 36-34s28 11 36 34" fill="rgba(255,255,255,0.82)"/>
      <rect x="17" y="87" width="86" height="18" rx="9" fill="rgba(0,0,0,0.14)"/>
      <text x="60" y="100" font-size="13" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">
        ${style.fallbackLabel}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Headshot({ profile, size = 72 }) {
  const style = getPartyStyle(profile);
  const imageSrc = profile.headshotUrl || buildFallbackPortrait(profile);

  return (
    <img
      src={imageSrc}
      alt={profile.headshotUrl ? `${profile.name} official headshot` : `${profile.name} fallback portrait`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.75)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        objectFit: "cover",
        background: style.soft,
        flexShrink: 0,
      }}
    />
  );
}

function EmptyState({ title, body, tone = "default" }) {
  const borderColor = tone === "warning" ? COLORS.gold : COLORS.border;
  const background = tone === "warning" ? "#f8f0e2" : "#fcfaf5";

  return (
    <div
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
    </div>
  );
}

function ProfileTile({ profile, onOpen }) {
  const style = getPartyStyle(profile);
  const metrics = Array.isArray(profile.metrics) ? profile.metrics.slice(0, 2) : [];
  const facts = Array.isArray(profile.quickFacts) ? profile.quickFacts.slice(0, 2) : [];

  return (
    <button
      onClick={() => onOpen(profile)}
      style={{
        textAlign: "left",
        border: `1px solid ${COLORS.border}`,
        borderTop: `5px solid ${style.accent}`,
        borderRadius: 16,
        background: "#fff",
        padding: 18,
        cursor: "pointer",
        boxShadow: "0 14px 30px rgba(25,49,80,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <Headshot profile={profile} size={64} />
        <div style={{ minWidth: 0 }}>
          <div style={{ color: COLORS.text, fontSize: 20, fontWeight: 1000, lineHeight: 1.1 }}>{profile.name}</div>
          {profile.office ? <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 6 }}>{profile.office}</div> : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {profile.party ? (
              <span
                style={{
                  background: style.soft,
                  color: style.accentDark,
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {profile.party}
              </span>
            ) : null}
            {profile.roleLabel ? (
              <span
                style={{
                  background: "#f5f0e8",
                  color: COLORS.text,
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {profile.roleLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {profile.statusLine ? (
        <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 700, lineHeight: 1.6, marginBottom: 14 }}>
          {profile.statusLine}
        </div>
      ) : null}

      {metrics.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
          {metrics.map((metric) => (
            <div key={metric.label} style={{ background: "#fcfaf5", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 12px 10px" }}>
              <div style={{ color: COLORS.muted, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {metric.label}
              </div>
              <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900, lineHeight: 1.3 }}>{metric.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {facts.length > 0 ? (
        <div style={{ display: "grid", gap: 6 }}>
          {facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} style={{ fontSize: 13, lineHeight: 1.5 }}>
              <span style={{ color: COLORS.muted, fontWeight: 800 }}>{fact.label}: </span>
              <span style={{ color: COLORS.text }}>{fact.value}</span>
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
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              border: "none",
              background: "transparent",
              color: active ? accent : COLORS.muted,
              borderBottom: active ? `3px solid ${accent}` : "3px solid transparent",
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

function Timeline({ items, accent }) {
  if (!items.length) {
    return <EmptyState title="No timeline entries yet" body="Publish dated milestones here to build the profile history for this office." />;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {items.map((item, index) => (
        <div key={`${item.date}-${item.title}-${index}`} style={{ display: "flex", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: accent, marginTop: 6 }} />
            {index < items.length - 1 ? <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} /> : null}
          </div>
          <div style={{ paddingBottom: index < items.length - 1 ? 10 : 0 }}>
            {item.date ? (
              <div style={{ color: accent, fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.date}</div>
            ) : null}
            {item.title ? <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900, marginTop: 4 }}>{item.title}</div> : null}
            {item.detail ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>{item.detail}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function OnRecordList({ items }) {
  if (!items.length) {
    return <EmptyState title="No on-record items yet" body="Quotes, statements, interviews, newsletters, filings, and sworn testimony will appear here when published." />;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, background: "#fff" }}>
          {item.title ? <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{item.title}</div> : null}
          {item.body ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.body}</div> : null}
          {item.sourceLabel ? (
            <div style={{ marginTop: 8, color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {item.sourceLabel}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DonorList({ donors }) {
  if (!donors) {
    return <EmptyState title="No donor data yet" body="Campaign finance summaries, top contributors, PAC support, and filing links will render here when stored in Supabase." />;
  }

  return (
    <div>
      {donors.summary ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{donors.summary}</div> : null}
      {donors.recordsLabel ? (
        <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          {donors.recordsLabel}
        </div>
      ) : null}
      {donors.donors.length > 0 ? (
        <div style={{ display: "grid", gap: 10 }}>
          {donors.donors.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              style={{
                background: index % 2 === 0 ? "#fff2f0" : "#fff",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                {item.name ? <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 800 }}>{item.name}</div> : null}
                {item.note ? <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{item.note}</div> : null}
              </div>
              {item.amount ? <div style={{ color: COLORS.red, fontSize: 18, fontWeight: 900 }}>{item.amount}</div> : null}
            </div>
          ))}
        </div>
      ) : null}
      {donors.links.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {donors.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: "#fff",
                color: COLORS.navy,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                padding: "10px 12px",
              }}
            >
              {link.label} &#8599;
            </a>
          ))}
        </div>
      ) : null}
      {!donors.summary && donors.donors.length === 0 && donors.links.length === 0 ? (
        <div style={{ marginTop: 4 }}>
          <EmptyState title="No donor data yet" body="Campaign finance summaries, top contributors, PAC support, and filing links will render here when stored in Supabase." />
        </div>
      ) : null}
    </div>
  );
}

function VoteList({ items }) {
  if (!items.length) {
    return <EmptyState title="No vote history yet" body="Recorded votes, public positions, case decisions, or other trackable actions will appear here once they are added." />;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, background: "#fff", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            {item.title ? <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{item.title}</div> : null}
            {item.date ? (
              <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.date}</div>
            ) : null}
          </div>
          {item.position ? <div style={{ color: COLORS.red, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{item.position}</div> : null}
          {item.summary ? <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.summary}</div> : null}
          {item.sourceLabel ? (
            <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.sourceLabel}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ContactPane({ profile }) {
  const contact = profile.contact || {};
  const linkStyle = {
    color: COLORS.navy,
    fontWeight: 800,
    textDecoration: "none",
  };

  const rows = [
    ["Phone", contact.phone],
    ["Email", contact.email],
    ["Address", contact.address],
    ["Hours", contact.officeHours],
  ].filter(([, value]) => value);

  const hasLinks = contact.website || contact.financeUrl;

  if (!rows.length && !hasLinks) {
    return <EmptyState title="No contact information yet" body="Phone, email, address, office hours, and record links will appear here when they are saved for this profile." />;
  }

  return (
    <div>
      <div style={{ display: "grid", gap: 12 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 10 }}>
            <div style={{ color: COLORS.muted, fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.7 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {contact.website ? (
          <a href={contact.website} target="_blank" rel="noreferrer" style={{ ...linkStyle, border: `1px solid ${COLORS.border}`, borderRadius: 10, background: "#fff", padding: "10px 12px" }}>
            Official site &#8599;
          </a>
        ) : null}
        {contact.financeUrl ? (
          <a href={contact.financeUrl} target="_blank" rel="noreferrer" style={{ ...linkStyle, border: `1px solid ${COLORS.border}`, borderRadius: 10, background: "#fff", padding: "10px 12px" }}>
            Finance records &#8599;
          </a>
        ) : null}
      </div>
    </div>
  );
}

function DecoderPane({ profile, accent, accentDark, soft }) {
  const decoder = profile.decoder || {};
  const hasDecoder =
    decoder.whatsHappening || decoder.connections || decoder.whoBenefits || decoder.impact || Object.keys(decoder.actions || {}).length > 0;
  const [decoded, setDecoded] = useState(false);

  if (!hasDecoder) return null;

  return (
    <div style={{ padding: "0 18px 18px" }}>
      <button
        onClick={() => setDecoded((value) => !value)}
        style={{
          width: "100%",
          background: decoded ? accentDark : soft,
          color: decoded ? "#fff" : accentDark,
          border: decoded ? "none" : `2px solid ${accent}`,
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 16,
          fontWeight: 1000,
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
      >
        {decoded ? "Hide Decoder" : "Decode This"}
      </button>
      {decoded ? <CivicDecoderPanel analysis={decoder} onHide={() => setDecoded(false)} /> : null}
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  const style = getPartyStyle(profile);
  const availableTabs = [
    { id: "profile", label: "Profile", show: true },
    { id: "on-record", label: "On Record", show: (profile.onRecord || []).length > 0 },
    { id: "donors", label: "Donors", show: !!profile.donors },
    { id: "votes", label: "Votes", show: (profile.votes || []).length > 0 },
    { id: "contact", label: "Contact", show: true },
  ].filter((tab) => tab.show);
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || "profile");

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!availableTabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id || "profile");
    }
  }, [activeTab, availableTabs]);

  let body = null;
  if (activeTab === "profile") {
    body = (
      <div>
        {profile.profile?.summary ? (
          <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{profile.profile.summary}</div>
        ) : (
          <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>
            No summary has been published for this profile yet.
          </div>
        )}
        <Timeline items={profile.profile?.timeline || []} accent={style.accent} />
      </div>
    );
  } else if (activeTab === "on-record") {
    body = <OnRecordList items={profile.onRecord || []} />;
  } else if (activeTab === "donors") {
    body = <DonorList donors={profile.donors} />;
  } else if (activeTab === "votes") {
    body = <VoteList items={profile.votes || []} />;
  } else if (activeTab === "contact") {
    body = <ContactPane profile={profile} />;
  }

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
          border: `2px solid ${style.accent}`,
          borderRadius: 18,
          overflow: "hidden",
          background: "#f8f3eb",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            background: `linear-gradient(145deg,${style.accent},${style.accentDark})`,
            color: "#fff",
            padding: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <Headshot profile={profile} size={84} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 34, fontWeight: 1000, lineHeight: 1.05 }}>{profile.name}</div>
              <div style={{ marginTop: 6, color: "rgba(255,255,255,0.86)", fontSize: 15, fontWeight: 700 }}>
                {[profile.office, profile.geography].filter(Boolean).join(" · ")}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {profile.roleLabel ? (
                  <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {profile.roleLabel}
                  </span>
                ) : null}
                {profile.statusLine ? (
                  <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {profile.statusLine}
                  </span>
                ) : null}
                {profile.party ? (
                  <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {style.text}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.16)",
                color: "#fff",
                width: 42,
                height: 42,
                borderRadius: 999,
                fontSize: 24,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {profile.metrics.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              borderBottom: `1px solid ${COLORS.border}`,
              background: "#f8f0e2",
            }}
          >
            {profile.metrics.map((metric, index) => (
              <div key={`${metric.label}-${index}`} style={{ padding: "16px 16px 14px", borderRight: `1px solid ${COLORS.border}` }}>
                <div style={{ color: COLORS.muted, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{metric.label}</div>
                <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 1000, lineHeight: 1.2 }}>{metric.value}</div>
              </div>
            ))}
          </div>
        ) : null}

        {profile.quickFacts.length > 0 ? (
          <div style={{ padding: "14px 16px", background: "#fcfaf5", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {profile.quickFacts.map((fact) => (
                <div key={`${fact.label}-${fact.value}`} style={{ fontSize: 14 }}>
                  <span style={{ color: COLORS.muted, fontWeight: 700 }}>{fact.label}: </span>
                  <span style={{ color: COLORS.text }}>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <SectionTabs tabs={availableTabs} activeTab={activeTab} onChange={setActiveTab} accent={style.accent} />
        <div style={{ padding: 18 }}>{body}</div>
        <DecoderPane profile={profile} accent={style.accent} accentDark={style.accentDark} soft={style.soft} />
      </div>
    </div>
  );
}

export default function OfficialsProfileDirectory({ activeScope = "overview", profiles = [], loading = false, error = "" }) {
  const visibleProfiles = useMemo(() => profiles, [profiles]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (!visibleProfiles.find((profile) => profile.id === selectedId)) {
      setSelectedId("");
    }
  }, [visibleProfiles, selectedId]);

  const selectedProfile = visibleProfiles.find((profile) => profile.id === selectedId) || null;

  return (
    <section style={{ marginBottom: 28 }}>
      {loading ? (
        <EmptyState title="Loading profiles" body="The directory is requesting official profile rows from Supabase." />
      ) : null}

      {!loading && error ? (
        <div style={{ marginBottom: 16 }}>
          <EmptyState
            title="Profile directory is not connected yet"
            body={`Supabase returned: ${error}. Create the official_profiles table and publish rows to populate this layout.`}
            tone="warning"
          />
        </div>
      ) : null}

      {!loading && visibleProfiles.length === 0 ? (
        <EmptyState
          title={activeScope === "overview" ? "No profiles published yet" : `No ${activeScope} profiles published yet`}
          body="This layout is ready, but there are no profile rows for the current scope. Add officials, judges, or candidates in Supabase and they will appear here automatically."
        />
      ) : null}

      {visibleProfiles.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {visibleProfiles.map((profile) => (
            <ProfileTile key={profile.id} profile={profile} onOpen={(nextProfile) => setSelectedId(nextProfile.id)} />
          ))}
        </div>
      ) : null}

      {selectedProfile ? <ProfileModal profile={selectedProfile} onClose={() => setSelectedId("")} /> : null}
    </section>
  );
}
