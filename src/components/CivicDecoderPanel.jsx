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

function isUrl(str) {
  if (!str) return false;
  return str.startsWith("http://") || str.startsWith("https://");
}

function linkLabel(type) {
  if (!type) return "Open link";
  var t = type.toLowerCase();
  if (t.includes("investigation")) return "Request investigation";
  if (t.includes("records")) return "Request records";
  if (t.includes("complaint")) return "File complaint";
  if (t.includes("misconduct")) return "Submit misconduct report";
  if (t.includes("election") || t.includes("vote") || t.includes("register")) return "Register to vote";
  if (t.includes("organiz")) return "Connect with organizers";
  if (t.includes("policy") || t.includes("model")) return "View policy model";
  if (t.includes("research")) return "View research";
  return "Open link";
}

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

function Block({ children, isLast }) {
  return (
    <div style={{
      borderLeft: "3px solid #5DBF85",
      paddingLeft: "1rem",
      paddingBottom: "1.2rem",
      marginBottom: "1.2rem",
      borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.07)",
    }}>
      {children}
    </div>
  );
}

function SlateRow({ label, value, href, isData }) {
  if (!value) return null;
  return (
    <div style={{ fontSize: 15, marginBottom: 6 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>{label}:</span>
      {href
        ? <a href={href} target="_blank" rel="noreferrer" style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{value}</a>
        : <span style={{ color: isData ? "#ddd5c4" : "#9aaabb", fontSize: 15 }}>{value}</span>
      }
    </div>
  );
}

function GreenLink({ href, label }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: GREEN, textDecoration: "none", display: "inline-block", marginTop: 6 }}>
      {label} <span style={{ fontSize: "11px", fontFamily: "system-ui", verticalAlign: "middle" }}>&#8599;</span>
    </a>
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

  const officials = contacts.filter(function(c) { return !c.isTipLine; });
  const tipLines = contacts.filter(function(c) { return c.isTipLine; });

  const usableMeetings = meetings.filter(function(m) {
    return m.title && m.frequency && m.frequency.toLowerCase() !== "unknown";
  });

  const usablePaths = paths.filter(function(p) {
    return p.link || (p.destination && isUrl(p.destination));
  });

  const usableButtons = actionButtons.filter(function(a) {
    return (a.template && a.template.email) || a.href;
  });

  const allBlocks = [
    ...officials.map(function(c) { return { type: "contact", data: c }; }),
    ...usableMeetings.map(function(m) { return { type: "meeting", data: m }; }),
    ...usablePaths.map(function(p) { return { type: "path", data: p }; }),
    ...(usableButtons.length ? [{ type: "buttons", data: usableButtons }] : []),
    ...(tipLines.length ? [{ type: "tiplines", data: tipLines }] : []),
  ];

  const hasAnything = intro || allBlocks.length > 0;

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

          {allBlocks.map(function(block, bi) {
            var isLast = bi === allBlocks.length - 1;

            if (block.type === "contact") {
              var c = block.data;
              return (
                <Block key={bi} isLast={isLast}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>
                    {c.name}{c.role ? " – " + c.role : ""}
                  </div>
                  {c.phone ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Phone:</span>
                      <a href={"tel:" + c.phone.replace(/[^0-9+]/g, "")} style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{c.phone}</a>
                    </div>
                  ) : null}
                  {c.email ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Email:</span>
                      <a href={"mailto:" + c.email} style={{ color: GREEN, textDecoration: "none", fontSize: 15 }}>{c.email}</a>
                    </div>
                  ) : null}
                  {c.address ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Address:</span>
                      <a href={"https://maps.google.com/?q=" + encodeURIComponent(c.address)} target="_blank" rel="noreferrer" style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{c.address}</a>
                    </div>
                  ) : null}
                  {c.officialLink ? (
                    <GreenLink href={c.officialLink} label="Official page" />
                  ) : null}
                </Block>
              );
            }

            if (block.type === "meeting") {
              var m = block.data;
              return (
                <Block key={bi} isLast={isLast}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{m.title}</div>
                  <SlateRow label="When" value={m.frequency} isData />
                  <SlateRow label="Where" value={m.location} isData />
                  <SlateRow label="Purpose" value={m.why} />
                  {m.link ? <GreenLink href={m.link} label="View meeting schedule" /> : null}
                </Block>
              );
            }

            if (block.type === "path") {
              var p = block.data;
              var url = p.link || (isUrl(p.destination) ? p.destination : null);
              var title = isUrl(p.destination) ? p.why || p.type || "Filing path" : p.destination;
              var label = linkLabel(p.type);
              return (
                <Block key={bi} isLast={isLast}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{title}</div>
                  <SlateRow label="Type" value={p.type} isData />
                  <SlateRow label="Purpose" value={p.why} />
                  {url ? <GreenLink href={url} label={label} /> : null}
                </Block>
              );
            }

            if (block.type === "buttons") {
              return (
                <Block key={bi} isLast={isLast}>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {block.data.map(function(action, ai) {
                      var href = action.template ? buildMailto(action.template) : action.href;
                      return <ActionButton key={ai} label={action.label} href={href} kind={action.kind} />;
                    })}
                  </div>
                </Block>
              );
            }

            if (block.type === "tiplines") {
              return (
                <Block key={bi} isLast={isLast}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 10 }}>Media Tip Lines</div>
                  {block.data.map(function(t, ti) {
                    var mailto = "mailto:" + t.email + (t.tipSubject ? "?subject=" + encodeURIComponent(t.tipSubject) + "&body=" + encodeURIComponent(t.tipBody || "") : "");
                    return (
                      <div key={ti} style={{ marginBottom: 8 }}>
                        <a href={mailto} style={{ fontSize: 14, color: GREEN, textDecoration: "none" }}>
                          {t.name.replace(" – News Tip Line", "")} — Email tip <span style={{ fontSize: "11px", fontFamily: "system-ui", verticalAlign: "middle" }}>&#8599;</span>
                        </a>
                      </div>
                    );
                  })}
                </Block>
              );
            }

            return null;
          })}
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
