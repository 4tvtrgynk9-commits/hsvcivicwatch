import React from "react";
import { buildMailto } from "./TemplateLauncher";
import { COLORS } from "../config/theme";

function CompactBlock({ title, children }) {
  return (
    <div style={{ background: COLORS.greenSoft, border: "1px solid rgba(62,139,91,0.18)", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 13.5, fontWeight: 900, color: COLORS.green, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function MiniCard({ title, children }) {
  return (
    <div style={{ background: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
      <div style={{ fontWeight: 800, fontSize: 13.5, color: COLORS.text, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function CompactAction({ label, href, kind = "primary" }) {
  const palette = kind === "primary"
    ? { background: COLORS.green, color: "#fff", border: "1px solid rgba(62,139,91,0.22)" }
    : kind === "gold"
      ? { background: COLORS.goldSoft, color: COLORS.gold, border: `1px solid ${COLORS.borderStrong}` }
      : { background: COLORS.panelAlt, color: COLORS.text, border: `1px solid ${COLORS.border}` };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        ...palette,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 38,
        padding: "8px 12px",
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: 800,
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

export default function WhatYouCanDo({ data }) {
  if (!data) return null;
  const {
    intro,
    contacts = [],
    meetings = [],
    paths = [],
    actions = [],
    comparisons = [],
  } = data;

  return (
    <section style={{ marginTop: 2 }}>
      <div style={{ background: COLORS.greenSoft, border: "1px solid rgba(62,139,91,0.18)", borderRadius: 12, padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: COLORS.green, marginBottom: intro ? 6 : 0 }}>What You Can Do</div>
        {intro ? <p style={{ color: COLORS.green, lineHeight: 1.55, fontSize: 14.5, margin: 0 }}>{intro}</p> : null}
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {contacts.length ? (
          <CompactBlock title="Who to Contact">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 8 }}>
              {contacts.map((contact, i) => (
                <MiniCard key={i} title={contact.name}>
                  {contact.role ? <div style={{ color: COLORS.textSoft, marginBottom: 6 }}>{contact.role}</div> : null}
                  {contact.phone ? <div>Phone: {contact.phone}</div> : null}
                  {contact.email ? <div>Email: {contact.email}</div> : null}
                  {contact.officialLink ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={contact.officialLink} target="_blank" rel="noreferrer">Official link</a>
                    </div>
                  ) : null}
                </MiniCard>
              ))}
            </div>
          </CompactBlock>
        ) : null}

        {meetings.length ? (
          <CompactBlock title="Meetings, Elections, & Oversight">
            <div style={{ display: "grid", gap: 8 }}>
              {meetings.map((meeting, i) => (
                <MiniCard key={i} title={meeting.title}>
                  {meeting.dateTime ? <div><strong>When:</strong> {meeting.dateTime}</div> : null}
                  {meeting.location ? <div><strong>Where:</strong> {meeting.location}</div> : null}
                  {meeting.frequency ? <div><strong>Frequency:</strong> {meeting.frequency}</div> : null}
                  {meeting.why ? <div style={{ marginTop: 5 }}>{meeting.why}</div> : null}
                </MiniCard>
              ))}
            </div>
          </CompactBlock>
        ) : null}

        {paths.length ? (
          <CompactBlock title="Complaint, Request, & Report Paths">
            <div style={{ display: "grid", gap: 8 }}>
              {paths.map((path, i) => (
                <MiniCard key={i} title={path.destination}>
                  {path.type ? <div><strong>Type:</strong> {path.type}</div> : null}
                  {path.why ? <div style={{ marginTop: 4 }}>{path.why}</div> : null}
                  {path.link ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={path.link} target="_blank" rel="noreferrer">Open filing path</a>
                    </div>
                  ) : null}
                </MiniCard>
              ))}
            </div>
          </CompactBlock>
        ) : null}

        {actions.length ? (
          <CompactBlock title="Take Action">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {actions.map((action, i) => {
                const href = action.template ? buildMailto(action.template) : action.href;
                return <CompactAction key={i} label={action.label} href={href} kind={action.kind || "primary"} />;
              })}
            </div>
          </CompactBlock>
        ) : null}

        {comparisons.length ? (
          <CompactBlock title="What Other Places Have Done">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55, color: COLORS.text, fontSize: 13.5 }}>
              {comparisons.map((comparison, i) => <li key={i}>{comparison}</li>)}
            </ul>
          </CompactBlock>
        ) : null}
      </div>
    </section>
  );
}
