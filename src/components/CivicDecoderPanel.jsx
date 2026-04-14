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
    <a
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
        <div style={{ marginBottom: 14 }}>
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
              <div key={i} style={{ borderLeft: "3px solid #5DBF85", paddingLeft: "1rem", paddingBottom: "1.2rem", marginBottom: "1.2rem", borderBottom: i < usableContacts.length - 1 || usableMeetings.length || usablePaths.length || usableButtons.length ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>
                  {c.name}{c.role ? " – " + c.role : ""}
                </div>
                {c.phone ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Phone</span><span style={{ color: "#ddd5c4" }}>{c.phone}</span></div>
                ) : null}
                {c.email ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Email</span><span style={{ color: "#ddd5c4" }}>{c.email}</span></div>
                ) : null}
                {c.address ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Address</span><span style={{ color: "#ddd5c4" }}>{c.address}</span></div>
                ) : null}
                {c.officialLink ? (
                  <a href={c.officialLink} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: GREEN, textDecoration: "none", display: "inline-block", marginTop: 4 }}>Official page ↗</a>
                ) : null}
              </div>
            );
          })}

          {usableMeetings.map(function(m, i) {
            return (
              <div key={i} style={{ borderLeft: "3px solid #5DBF85", paddingLeft: "1rem", paddingBottom: "1.2rem", marginBottom: "1.2rem", borderBottom: i < usableMeetings.length - 1 || usablePaths.length || usableButtons.length ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{m.title}</div>
                {m.frequency ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>When</span><span style={{ color: "#ddd5c4" }}>{m.frequency}</span></div>
                ) : null}
                {m.location ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Where</span><span style={{ color: "#ddd5c4" }}>{m.location}</span></div>
                ) : null}
                {m.link ? (
                  <a href={m.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: GREEN, textDecoration: "none", display: "inline-block", marginTop: 4 }}>View meeting schedule ↗</a>
                ) : null}
                {m.why ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Why</span><span style={{ color: "#9aaabb" }}>{m.why}</span></div>
                ) : null}
              </div>
            );
          })}

          {usablePaths.map(function(p, i) {
            return (
              <div key={i} style={{ borderLeft: "3px solid #5DBF85", paddingLeft: "1rem", paddingBottom: "1.2rem", marginBottom: "1.2rem", borderBottom: i < usablePaths.length - 1 || usableButtons.length ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{p.destination}</div>
                {p.type ? (
                  <div style={{ fontSize: 13, marginBottom: 2 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Type</span><span style={{ color: "#9aaabb" }}>{p.type}</span></div>
                ) : null}
                {p.why ? (
                  <div style={{ fontSize: 13, marginBottom: 4 }}><span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 48, display: "inline-block" }}>Goal</span><span style={{ color: "#9aaabb" }}>{p.why}</span></div>
                ) : null}
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: GREEN, textDecoration: "none", display: "inline-block", marginTop: 4 }}>Open filing path ↗</a>
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
