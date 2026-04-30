import React from "react";
import { buildMailto } from "./TemplateLauncher";
import { COLORS } from "../config/theme";

function CompactBlock({ title, children }) {
  return (
    <div
      style={{
        background: COLORS.greenSoft,
        border: "1px solid rgba(62,139,91,0.18)",
        borderRadius: 12,
        padding: 11,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: COLORS.green,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function MiniCard({ title, children }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 13.5,
          color: COLORS.text,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: COLORS.text,
          lineHeight: 1.48,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CompactAction({ label, href, kind = "primary" }) {
  const palette =
    kind === "primary"
      ? { background: COLORS.green, color: "#fff", border: "1px solid rgba(62,139,91,0.22)" }
      : kind === "gold"
        ? { background: COLORS.goldSoft, color: COLORS.gold, border: `1px solid ${COLORS.borderStrong}` }
        : { background: COLORS.panel, color: COLORS.text, border: `1px solid ${COLORS.border}` };

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

const v = (val) => (!val || String(val).trim().toUpperCase() === "UNKNOWN") ? null : val;

const PATH_TYPE_LABELS = {
  records_request: "Request Records",
  investigation_request: "Request Investigation",
  complaint: "File a Complaint",
  misconduct_report: "Report Misconduct",
  elections: "Election Path",
  media_outreach: "Media Outreach",
};

const getPathTypeLabel = (type) => {
  const cleanType = v(type);
  if (!cleanType) return null;
  return PATH_TYPE_LABELS[cleanType] || cleanType;
};

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
      <div
        style={{
          background: COLORS.greenSoft,
          border: "1px solid rgba(62,139,91,0.18)",
          borderRadius: 12,
          padding: 11,
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 900,
            color: COLORS.green,
            marginBottom: intro ? 6 : 0,
          }}
        >
          What You Can Do
        </div>
        {intro ? (
          <p
            style={{
              color: COLORS.green,
              lineHeight: 1.52,
              fontSize: 14,
              margin: 0,
            }}
          >
            {intro}
          </p>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 9, marginTop: 9 }}>
        {contacts.length ? (
          <CompactBlock title="Who to Contact">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 8,
              }}
            >
              {contacts.map((contact, i) => (
                <MiniCard key={i} title={contact.name}>
                  {v(contact.role) ? <div style={{ color: COLORS.textSoft, marginBottom: 6 }}>{v(contact.role)}</div> : null}
                  {v(contact.phone) ? <div>Phone: {v(contact.phone)}</div> : null}
                  {v(contact.email) ? <div>Email: {v(contact.email)}</div> : null}
                  {v(contact.officialLink) ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={v(contact.officialLink)} target="_blank" rel="noreferrer">
                        Official link
                      </a>
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
                  {v(meeting.dateTime) ? (
                    <div>
                      <strong>When:</strong> {v(meeting.dateTime)}
                    </div>
                  ) : null}
                  {v(meeting.location) ? (
                    <div>
                      <strong>Where:</strong> {v(meeting.location)}
                    </div>
                  ) : null}
                  {v(meeting.frequency) ? (
                    <div>
                      <strong>Frequency:</strong> {v(meeting.frequency)}
                    </div>
                  ) : null}
                  {v(meeting.why) ? <div style={{ marginTop: 5 }}>{v(meeting.why)}</div> : null}
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
                  {getPathTypeLabel(path.type) ? (
                    <div>
                      <strong>Type:</strong> {getPathTypeLabel(path.type)}
                    </div>
                  ) : null}
                  {v(path.why) ? <div style={{ marginTop: 4 }}>{v(path.why)}</div> : null}
                  {v(path.link) ? (
                    <div style={{ marginTop: 6 }}>
                      <a href={v(path.link)} target="_blank" rel="noreferrer">
                        {path.type === "investigation_request" ? "Request investigation" :
                         path.type === "records_request" ? "Request records" :
                         path.type === "complaint" ? "File a complaint" :
                         path.type === "misconduct_report" ? "Report misconduct" :
                         path.type === "media_outreach" ? "Contact media" :
                         "Open filing path"}
                      </a>
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
                return (
                  <CompactAction
                    key={i}
                    label={action.label}
                    href={href}
                    kind={action.kind || "primary"}
                  />
                );
              })}
            </div>
          </CompactBlock>
        ) : null}

        {comparisons.length ? (
          <CompactBlock title="What Other Places Have Done">
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                lineHeight: 1.52,
                color: COLORS.text,
                fontSize: 13.5,
              }}
            >
              {comparisons.map((comparison, i) => (
                <li key={i}>{comparison}</li>
              ))}
            </ul>
          </CompactBlock>
        ) : null}
      </div>
    </section>
  );
}