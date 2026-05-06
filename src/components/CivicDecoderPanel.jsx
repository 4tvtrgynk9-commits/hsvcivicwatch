/* eslint-disable */
import React from "react";
import { buildMailto } from "./TemplateLauncher";

const SIDEBAR_BG = "#193150";
const GOLD = "#E8C35A";
const GOLD_DIM = "rgba(232,195,90,0.55)";
const BLUE = "#89C4E8";
const LAVENDER = "#C9A8E8";
const RED = "#E07068";
const GREEN = "#5DBF85";

const v = val => (!val || String(val).trim().toUpperCase() === "UNKNOWN") ? null : val;

function isUrl(str) {
  var clean = v(str);
  if (!clean) return false;
  return String(clean).startsWith("http://") || String(clean).startsWith("https://");
}

function linkLabel(type) {
  if (!v(type)) return "Open Filing Path";
  var t = String(v(type)).toLowerCase().replace(/[^a-z_]/g, "");
  if (t === "records_request") return "Request Records";
  if (t === "investigation_request") return "Request Investigation";
  if (t === "complaint") return "File a Complaint";
  if (t === "misconduct_report") return "Report Misconduct";
  if (t === "media_outreach") return "Send a Tip";
  if (t === "investigation") return "Request Investigation";
  if (t === "records") return "Request Records";
  if (t === "misconduct") return "Report Misconduct";
  if (t === "elections" || t === "election" || t === "vote" || t === "register") return "Register to vote";
  if (t === "media") return "Send a Tip";
  if (t.includes("organiz")) return "Connect with organizers";
  if (t.includes("policy") || t.includes("model")) return "View policy model";
  if (t.includes("research")) return "View research";
  return "Open Filing Path";
}

function getActionBg(kind) {
  if (kind === "gold") return "#C6A34D";
  if (kind === "red") return "#B4473E";
  if (kind === "blue") return "#2F5D8A";
  return "#3E8B5B";
}

function ActionButton({ label, href, kind }) {
  var cleanHref = v(href);
  var cleanLabel = v(label);
  if (!cleanHref || !cleanLabel) return null;
  return (
    <a
      href={cleanHref}
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
      {cleanLabel}
    </a>
  );
}

function DecoderSection({ color, title, children }) {
  var content = v(children);
  if (!content) return null;
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
        {content}
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
  var cleanValue = v(value);
  var cleanHref = v(href);
  if (!cleanValue) return null;
  return (
    <div style={{ fontSize: 15, marginBottom: 6 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>{label}:</span>
      {cleanHref
        ? <a href={cleanHref} target="_blank" rel="noreferrer" style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{cleanValue}</a>
        : <span style={{ color: isData ? "#ddd5c4" : "#9aaabb", fontSize: 15 }}>{cleanValue}</span>
      }
    </div>
  );
}

function GreenLink({ href, label }) {
  var cleanHref = v(href);
  var cleanLabel = v(label);
  if (!cleanHref || !cleanLabel) return null;
  return (
    <a href={cleanHref} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: GREEN, textDecoration: "none", display: "inline-block", marginTop: 6 }}>
      {cleanLabel} <span style={{ fontSize: "11px", fontFamily: "system-ui", verticalAlign: "middle" }}>&#8599;</span>
    </a>
  );
}

export default function CivicDecoderPanel({ analysis, onHide }) {
  if (!analysis) return null;

  const { whatsHappening, connections, whoBenefits, impact, actions } = analysis;
  const actionData = actions && typeof actions === "object" ? actions : {};

  const {
    intro,
    contacts: rawContacts = [],
    meetings: rawMeetings = [],
    paths: rawPaths = [],
    actions: rawActionButtons = [],
  } = actionData;

  const contacts = Array.isArray(rawContacts) ? rawContacts : [];
  const meetings = Array.isArray(rawMeetings) ? rawMeetings : [];
  const paths = Array.isArray(rawPaths) ? rawPaths : [];
  const actionButtons = Array.isArray(rawActionButtons) ? rawActionButtons : [];

  const officials = contacts.filter(function(c) {
    return !c.isTipLine && (v(c.name) || v(c.role) || v(c.phone) || v(c.email) || v(c.address) || v(c.officialLink));
  });
  const tipLines = contacts.filter(function(c) {
    return c.isTipLine && v(c.email);
  });

  const usableMeetings = meetings.filter(function(m) {
    return v(m.title) && v(m.frequency);
  });

  const usablePaths = paths.filter(function(p) {
    var destination = v(p.destination);
    return v(p.link) || (destination && isUrl(destination));
  });

  const usableButtons = actionButtons.filter(function(a) {
    return (a.template && v(a.template.email) && v(a.label)) || (v(a.href) && v(a.label));
  });

  const allBlocks = [
    ...officials.map(function(c) { return { type: "contact", data: c }; }),
    ...usableMeetings.map(function(m) { return { type: "meeting", data: m }; }),
    ...usablePaths.map(function(p) { return { type: "path", data: p }; }),
    ...(usableButtons.length ? [{ type: "buttons", data: usableButtons }] : []),
    ...(tipLines.length ? [{ type: "tiplines", data: tipLines }] : []),
  ];

  const hasAnything = v(intro) || allBlocks.length > 0;

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

          {v(intro) ? (
            <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.7, color: GREEN }}>
              {v(intro)}
            </p>
          ) : null}

          {allBlocks.map(function(block, bi) {
            var isLast = bi === allBlocks.length - 1;

            if (block.type === "contact") {
              var c = block.data;
              var contactTitle = [v(c.name), v(c.role)].filter(Boolean).join(" - ");
              return (
                <Block key={bi} isLast={isLast}>
                  {contactTitle ? (
                    <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>
                      {contactTitle}
                    </div>
                  ) : null}
                  {v(c.phone) ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Phone:</span>
                      <a href={"tel:" + String(v(c.phone)).replace(/[^0-9+]/g, "")} style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{v(c.phone)}</a>
                    </div>
                  ) : null}
                  {v(c.email) ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Email:</span>
                      <a href={"mailto:" + v(c.email)} style={{ color: GREEN, textDecoration: "none", fontSize: 15 }}>{v(c.email)}</a>
                    </div>
                  ) : null}
                  {v(c.address) ? (
                    <div style={{ fontSize: 15, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9aaabb", minWidth: 56, display: "inline-block" }}>Address:</span>
                      <a href={"https://maps.google.com/?q=" + encodeURIComponent(v(c.address))} target="_blank" rel="noreferrer" style={{ color: "#ddd5c4", textDecoration: "none", fontSize: 15 }}>{v(c.address)}</a>
                    </div>
                  ) : null}
                  {v(c.officialLink) ? (
                    <GreenLink href={v(c.officialLink)} label="Official page" />
                  ) : null}
                </Block>
              );
            }

            if (block.type === "meeting") {
              var m = block.data;
              return (
                <Block key={bi} isLast={isLast}>
                  {v(m.title) ? <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{v(m.title)}</div> : null}
                  <SlateRow label="When" value={m.frequency} isData />
                  <SlateRow label="Where" value={m.location} isData />
                  <SlateRow label="Purpose" value={m.why} />
                  {v(m.link) ? <GreenLink href={v(m.link)} label="View meeting schedule" /> : null}
                </Block>
              );
            }

            if (block.type === "path") {
              var p = block.data;
              var destination = v(p.destination);
              var url = v(p.link) || (destination && isUrl(destination) ? destination : null);
              var title = destination && isUrl(destination) ? v(p.why) || v(p.type) || "Filing path" : destination;
              var label = linkLabel(p.type);
              return (
                <Block key={bi} isLast={isLast}>
                  {v(title) ? <div style={{ fontWeight: 500, fontSize: 14, color: "#ffffff", marginBottom: 6 }}>{v(title)}</div> : null}
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
                    var cleanEmail = v(t.email);
                    if (!cleanEmail) return null;
                    var params = [];
                    if (v(t.tipSubject)) params.push("subject=" + encodeURIComponent(v(t.tipSubject)));
                    if (v(t.tipBody)) params.push("body=" + encodeURIComponent(v(t.tipBody)));
                    var mailto = "mailto:" + cleanEmail + (params.length ? "?" + params.join("&") : "");
                    var tipName = v(t.name) ? String(v(t.name)).replace(" - News Tip Line", "").replace(" – News Tip Line", "") : "Email tip";
                    return (
                      <div key={ti} style={{ marginBottom: 8 }}>
                        <a href={mailto} style={{ fontSize: 14, color: GREEN, textDecoration: "none" }}>
                          {tipName} - Email tip <span style={{ fontSize: "11px", fontFamily: "system-ui", verticalAlign: "middle" }}>&#8599;</span>
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
