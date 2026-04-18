import React, { useEffect, useMemo, useState } from "react";
import CivicDecoderPanel from "../../components/CivicDecoderPanel";
import { COLORS } from "../../config/theme";
import { OFFICIAL_PROFILES } from "./officialProfiles";

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

function scopeMatches(profile, scope) {
  if (scope === "overview") return true;
  return Array.isArray(profile.scopes) && profile.scopes.includes(scope);
}

function getPartyStyle(profile) {
  const raw = String(profile.party || "").trim().toLowerCase();
  if (raw.includes("republic")) return PARTY_STYLES.republican;
  if (raw.includes("democrat")) return PARTY_STYLES.democrat;
  if (raw.includes("independent")) return PARTY_STYLES.independent;
  if (raw.includes("libertarian")) return PARTY_STYLES.libertarian;
  if (raw.includes("nonpartisan")) return PARTY_STYLES.nonpartisan;
  if (raw.includes("under research") || raw.includes("unknown")) return PARTY_STYLES.unknown;
  if (profile.kind === "candidate") return PARTY_STYLES.candidate;
  if (profile.kind === "judge") return PARTY_STYLES.judicial;
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

function moneyTone(value) {
  if (!value) return COLORS.text;
  if (String(value).toLowerCase().includes("under research")) return COLORS.text;
  return COLORS.red;
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

function Headshot({ profile }) {
  const style = getPartyStyle(profile);
  const imageSrc = profile.headshotUrl || buildFallbackPortrait(profile);

  return (
    <img
      src={imageSrc}
      alt={profile.headshotUrl ? `${profile.name} official headshot` : `${profile.name} fallback portrait`}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.75)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        objectFit: "cover",
        background: style.soft,
      }}
    />
  );
}

function ProfileListButton({ profile, selected, onClick }) {
  const partyStyle = getPartyStyle(profile);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: selected ? partyStyle.soft : "#fff",
        border: selected ? `2px solid ${partyStyle.accent}` : `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        boxShadow: selected ? "0 10px 22px rgba(25,49,80,0.10)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: `linear-gradient(145deg,${partyStyle.accent},${partyStyle.accentDark})`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {getInitials(profile.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 900, lineHeight: 1.2 }}>{profile.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.4 }}>
            {profile.office}
            {profile.party ? <span style={{ color: partyStyle.accent, fontWeight: 800 }}> · {profile.party}</span> : null}
          </div>
        </div>
      </div>
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
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {items.map((item, index) => (
        <div key={`${item.date}-${index}`} style={{ display: "flex", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: accent, marginTop: 6 }} />
            {index < items.length - 1 ? <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} /> : null}
          </div>
          <div style={{ paddingBottom: index < items.length - 1 ? 10 : 0 }}>
            <div style={{ color: accent, fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.date}</div>
            <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900, marginTop: 4 }}>{item.title}</div>
            <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OnRecordList({ items }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14, background: "#fff" }}>
          <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{item.title}</div>
          <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.body}</div>
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
  return (
    <div>
      <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{donors.summary}</div>
      {donors.recordsLabel ? (
        <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Top donors - {donors.recordsLabel}
        </div>
      ) : null}
      <div style={{ display: "grid", gap: 10 }}>
        {(donors.donors || []).map((item, index) => (
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
              <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 800 }}>{item.name}</div>
              {item.note ? <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{item.note}</div> : null}
            </div>
            <div style={{ color: COLORS.red, fontSize: 18, fontWeight: 900 }}>{item.amount}</div>
          </div>
        ))}
      </div>
      {(donors.links || []).length > 0 ? (
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
    </div>
  );
}

function VoteList({ items }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, background: "#fff", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 900 }}>{item.title}</div>
            {item.date ? (
              <div style={{ color: COLORS.gold, fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.date}</div>
            ) : null}
          </div>
          {item.position ? (
            <div style={{ color: COLORS.red, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{item.position}</div>
          ) : null}
          <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7 }}>{item.summary}</div>
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

  return (
    <div>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          ["Phone", contact.phone],
          ["Email", contact.email],
          ["Address", contact.address],
          ["Hours", contact.officeHours],
        ]
          .filter(([, value]) => value)
          .map(([label, value]) => (
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

function ProfileCard({ profile }) {
  const partyStyle = getPartyStyle(profile);
  const availableTabs = [
    { id: "profile", label: "Profile", show: true },
    { id: "on-record", label: "On Record", show: (profile.onRecord || []).length > 0 },
    { id: "donors", label: "Donors", show: !!profile.donors },
    { id: "votes", label: "Votes", show: (profile.votes || []).length > 0 },
    { id: "contact", label: "Contact", show: true },
  ].filter((tab) => tab.show);

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || "profile");
  const [decoded, setDecoded] = useState(false);

  useEffect(() => {
    if (!availableTabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(availableTabs[0]?.id || "profile");
    }
  }, [activeTab, availableTabs]);

  let body = null;
  if (activeTab === "profile") {
    body = (
      <div>
        <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{profile.profile.summary}</div>
        <Timeline items={profile.profile.timeline || []} accent={partyStyle.accent} />
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
      style={{
        border: `2px solid ${partyStyle.accent}`,
        borderRadius: 18,
        overflow: "hidden",
        background: "#f8f3eb",
        boxShadow: "0 20px 55px rgba(25,49,80,0.16)",
      }}
    >
      <div
        style={{
          background: `linear-gradient(145deg,${partyStyle.accent},${partyStyle.accentDark})`,
          color: "#fff",
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Headshot profile={profile} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 1000, lineHeight: 1.05 }}>{profile.name}</div>
            <div style={{ marginTop: 6, color: "rgba(255,255,255,0.86)", fontSize: 15, fontWeight: 700 }}>
              {profile.office} · {profile.geography}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {profile.roleLabel}
              </span>
              <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {profile.statusLine}
              </span>
              {profile.party ? (
                <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {partyStyle.text}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          borderBottom: `1px solid ${COLORS.border}`,
          background: "#f8f0e2",
        }}
      >
        {profile.metrics.map((metric) => (
                <div key={metric.label} style={{ padding: "16px 16px 14px", borderRight: `1px solid ${COLORS.border}` }}>
                  <div style={{ color: COLORS.muted, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{metric.label}</div>
                  <div style={{ color: moneyTone(metric.value), fontSize: 18, fontWeight: 1000, lineHeight: 1.2 }}>{metric.value}</div>
          </div>
        ))}
      </div>

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

      <SectionTabs tabs={availableTabs} activeTab={activeTab} onChange={setActiveTab} accent={partyStyle.accent} />

      <div style={{ padding: 18 }}>{body}</div>

      <div style={{ padding: "0 18px 18px" }}>
        <button
          onClick={() => setDecoded((value) => !value)}
          style={{
            width: "100%",
            background: decoded ? partyStyle.accentDark : partyStyle.soft,
            color: decoded ? "#fff" : partyStyle.accentDark,
            border: decoded ? "none" : `2px solid ${partyStyle.accent}`,
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
        {decoded ? <CivicDecoderPanel analysis={profile.decoder} onHide={() => setDecoded(false)} /> : null}
      </div>
    </div>
  );
}

export default function OfficialsProfileDirectory({ activeScope = "overview" }) {
  const profiles = useMemo(() => {
    return OFFICIAL_PROFILES.filter((profile) => scopeMatches(profile, activeScope)).sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [activeScope]);

  const [selectedId, setSelectedId] = useState(profiles[0]?.id || "");

  useEffect(() => {
    if (!profiles.find((profile) => profile.id === selectedId)) {
      setSelectedId(profiles[0]?.id || "");
    }
  }, [profiles, selectedId]);

  const selectedProfile = profiles.find((profile) => profile.id === selectedId) || profiles[0] || null;

  if (!selectedProfile) return null;

  return (
    <section style={{ marginBottom: 28 }}>
      <div
        style={{
          background: "linear-gradient(145deg,#18304f,#10243d)",
          color: "#f7f3ea",
          borderRadius: 18,
          padding: "18px 20px",
          marginBottom: 18,
          boxShadow: "0 18px 36px rgba(16,36,61,0.14)",
        }}
      >
        <div style={{ color: "#e8c35a", fontSize: 11, fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8 }}>
          Officials and Candidate Profiles
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 980 }}>
          This section is now structured as a profile directory for the offices that shape Huntsville and Madison County. Each profile has a shell for timeline, on-record material, donors, votes, contact, and a shared decoder panel so the research can deepen without redesigning the page again.
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-start" }}>
        <aside
          style={{
            width: 300,
            maxWidth: "100%",
            flexShrink: 0,
            display: "grid",
            gap: 10,
          }}
        >
          {profiles.map((profile) => (
            <ProfileListButton
              key={profile.id}
              profile={profile}
              selected={profile.id === selectedProfile.id}
              onClick={() => setSelectedId(profile.id)}
            />
          ))}
        </aside>

        <div style={{ flex: "1 1 680px", minWidth: 0 }}>
          <ProfileCard profile={selectedProfile} />
        </div>
      </div>
    </section>
  );
}
