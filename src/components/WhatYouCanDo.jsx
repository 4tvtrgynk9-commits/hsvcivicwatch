import React from "react";
import ContactCard from "./ContactCard";
import ActionButton from "./ActionButton";
import { buildMailto } from "./TemplateLauncher";
import { COLORS } from "../config/theme";

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
    <section style={{ marginTop: 18 }}>
      <h3 style={{ marginTop: 0, marginBottom: 12, color: COLORS.navy, fontSize: 18 }}>
        What You Can Do
      </h3>

      {intro ? (
        <p style={{ color: COLORS.text, lineHeight: 1.75, fontSize: 14.5, marginTop: 0 }}>
          {intro}
        </p>
      ) : null}

      {contacts.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Who to Contact</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
            {contacts.map((c, i) => <ContactCard key={i} contact={c} />)}
          </div>
        </div>
      ) : null}

      {meetings.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Meetings, Elections, & Oversight</div>
          <div style={{ display: "grid", gap: 10 }}>
            {meetings.map((m, i) => (
              <div key={i} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: COLORS.text }}>
                  {m.dateTime ? <div><strong>When:</strong> {m.dateTime}</div> : null}
                  {m.location ? <div><strong>Where:</strong> {m.location}</div> : null}
                  {m.frequency ? <div><strong>Frequency:</strong> {m.frequency}</div> : null}
                  {m.why ? <div style={{ marginTop: 6 }}>{m.why}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {paths.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Complaint, Request, & Report Paths</div>
          <div style={{ display: "grid", gap: 10 }}>
            {paths.map((p, i) => (
              <div key={i} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{p.destination}</div>
                <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.7 }}>
                  {p.type ? <div><strong>Type:</strong> {p.type}</div> : null}
                  {p.why ? <div>{p.why}</div> : null}
                  {p.link ? <div style={{ marginTop: 6 }}><a href={p.link} target="_blank" rel="noreferrer">Open filing path</a></div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {actions.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Take Action</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {actions.map((a, i) => {
              const href = a.template ? buildMailto(a.template) : a.href;
              return (
                <ActionButton
                  key={i}
                  label={a.label}
                  href={href}
                  kind={a.kind || "primary"}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {comparisons.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>What Other Places Have Done</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, color: COLORS.text }}>
            {comparisons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}