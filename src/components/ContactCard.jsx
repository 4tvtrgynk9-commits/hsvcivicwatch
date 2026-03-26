import React from "react";
import { COLORS } from "../config/theme";

export default function ContactCard({ contact }) {
  if (!contact) return null;
  return (
    <div style={{
      background: "white",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: 14
    }}>
      <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.text }}>{contact.name}</div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{contact.role}</div>
      <div style={{ fontSize: 13, color: COLORS.text, marginTop: 10, lineHeight: 1.7 }}>
        {contact.phone ? <div>Phone: {contact.phone}</div> : null}
        {contact.email ? <div>Email: {contact.email}</div> : null}
        {contact.officialLink ? <div><a href={contact.officialLink} target="_blank" rel="noreferrer">Official link</a></div> : null}
      </div>
    </div>
  );
}