/* eslint-disable */
import React from "react";
import { buildMailto } from "./TemplateLauncher";

const SIDEBAR_BG = "#193150";
const GOLD = "#E8C35A";
const GOLD_DIM = "rgba(232,195,90,0.55)";
const BLUE = "#89C4E8";
const LAVENDER = "#B98FD8";
const RED = "#E07068";
const GREEN = "#5DBF85";

function getActionBg(kind) {
  if (kind === "gold") return "#C6A34D";
  if (kind === "red") return "#B4473E";
  if (kind === "blue") return "#2F5D8A";
  return "#3E8B5B";
}

function ActionButton({ label, href, kind }) {
  if (!href) return null;
  return (
    
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: getActionBg(kind),
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 18px",
        fontSize: 14,
        fontWeight: 800,
        textDecoration: "none",
        marginRight: 8,
        marginTop: 8,
      }}
    >
      {label}
    </a>
  );
}

function DecoderSection({ color, title, children }) {
  if (!children) return null;
  return (
    <div style={{ borderLeft: "3px solid " + color, paddingLeft: 14, marginBottom: 22 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: color,
        marginBottom: 8,
        opacity: 0.9,
      }}>
        {title}
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: color }}>
        {children}
      </div>
    </div>
  );
}

export default function CivicDecoderPanel({ analysis, onHide }) {
  if (!analysis) return null;

  const { whatsHappening, connections, whoBenefits, impact, actions } = analysis;

  const {
    intro,
    contacts = [],
    meetings = [],
    paths = [],
    actions: actionButtons = [],
  } = actions || {};

  const usableContacts = contacts.filter(function(c) {
    return c.phone || c.email || c.officialLink;
  });
  const usableMeetings = meetings.filter(function(m) {
    return m.title && m.frequency && m.frequency.toLowerCase() !== "unknown";
  });
  const usablePaths = paths.filter(function(p) {
    return p.link || p.destination;
  });
  const usableButtons = actionButtons.filter(function(a) {
    return (a.template && a.template.email) || a.href;
  });

  const hasAnything =
    intro ||
    usableContacts.length ||
    usableMeetings.length ||
    usablePaths.length ||
    usableButtons.length;

  return (
    <div style={{
      background: SIDEBAR_BG,
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 14,
      padding: "20px 22px",
      marginTop: 14,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2.5,
        color: GOLD_DIM,
        marginBottom: 22,
        textTransform: "uppercase",
      }}>
        Civic Investigator Analysis
      </div>

      <DecoderSection color={GOLD} title="What's Happening">
        {whatsHappening}
      </DecoderSection>

      <DecoderSection color={BLUE} title="The Connections">
        {connections}
      </DecoderSection>

      <DecoderSection color={LAVENDER} title="Who Benefits">
        {whoBenefits}
      </DecoderSection>

      <DecoderSection color={RED} title="The Impact">
        {impact}
      </DecoderSection>

      {hasAnything ? (
        <div style={{ borderLeft: "3px solid " + GREEN, paddingLeft: 14, marginBottom: 14 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: GREEN,
            marginBottom: 12,
            opacity: 0.9,
          }}>
            What You Can Do
          </div>

          {intro ? (
            <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.7, color: GREEN }}>
              {intro}
            </p>
          ) : null}

          {usableContacts.map(function(c, i) {
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>
                  {c.name}{c.role ? " — " + c.role : ""}
                </div>
                {c.phone ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    Phone: {c.phone}
                  </div>
                ) : null}
                {c.email ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    Email: {c.email}
                  </div>
                ) : null}
                {c.address ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    Address: {c.address}
                  </div>
                ) : null}
                {c.officialLink ? (
                  
                    href={c.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}
                  >
                    Official page
                  </a>
                ) : null}
              </div>
            );
          })}

          {usableMeetings.map(function(m, i) {
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>
                  {m.title}
                </div>
                {m.frequency ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    When: {m.frequency}
                  </div>
                ) : null}
                {m.location ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    Where: {m.location}
                  </div>
                ) : null}
                {m.link ? (
                  
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}
                  >
                    View meeting schedule
                  </a>
                ) : null}
                {m.why ? (
                  <div style={{ fontSize: 13, color: GREEN, marginTop: 4, opacity: 0.85 }}>
                    {m.why}
                  </div>
                ) : null}
              </div>
            );
          })}

          {usablePaths.map(function(p, i) {
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>
                  {p.destination}
                </div>
                {p.type ? (
                  <div style={{ fontSize: 14, color: GREEN, marginBottom: 2 }}>
                    Type: {p.type}
                  </div>
                ) : null}
                {p.why ? (
                  <div style={{ fontSize: 13, color: GREEN, marginBottom: 4, opacity: 0.85 }}>
                    {p.why}
                  </div>
                ) : null}
                {p.link ? (
                  
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}
                  >
                    Open filing path
                  </a>
                ) : null}
              </div>
            );
          })}

          {usableButtons.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
              {usableButtons.map(function(action, i) {
                var href = action.template ? buildMailto(action.template) : action.href;
                return (
                  <ActionButton
                    key={i}
                    label={action.label}
                    href={href}
                    kind={action.kind}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={onHide}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: GOLD_DIM,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Hide Investigation &#9650;
        </button>
      </div>
    </div>
  );
}