import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// Maps module page IDs to the module name stored in Supabase
const MODULE_NAME_MAP = {
  health:             "health",
  utilities:          "utilities",
  housing_crisis:     "housing_crisis",
  criminal_justice:   "criminal_justice",
  workers_childcare:  "workers_childcare",
  taxation:           "taxation",
  officials_elections:"officials_elections",
  equity:             "equity",
  insurance_burdens:  "insurance_burdens",
  boards_oversight:   "boards_oversight",
  voting_rights:      "voting_rights",
  policing:           "policing",
  data_collection:    "data_collection",
  money:              "money",
  landuse:            "landuse",
  environment:        "environment",
  information_warfare:"information_warfare",
  proposals:          "proposals",
  action:             "action",
};

// Convert a Supabase issue_card row into the shape IssueCard expects
function toIssueShape(row) {
  const dec = row.decoder || {};
  const act = dec.actions || row.actions || {};

  // Build media outreach contacts from outlets
  const mediaContacts = act.mediaOutreach?.applies && act.mediaOutreach?.outlets
    ? act.mediaOutreach.outlets.map(o => ({
        name: o.name || "",
        role: "News Tip Line",
        phone: "",
        email: o.tipEmail || "",
        address: "",
        officialLink: "",
        isTipLine: true,
        tipSubject: o.subject || "",
        tipBody: o.body || "",
      }))
    : [];

  return {
    id:      row.ref_number || row.id,
    label:   row.label   || "",
    title:   row.title   || "",
    summary: row.summary || "",
    details: row.details || "",
    sources: row.sources || [],
    _fromSupabase: true,
    decoder: {
      whatsHappening: dec.whatsHappening || "",
      connections:    dec.connections    || "",
      whoBenefits:    dec.whoBenefits    || "",
      impact:         dec.impact         || "",
      actions: {
        intro:    act.intro    || "",
        contacts: [
          ...(act.contacts || []).map(c => ({
            name: c.name || "", role: c.role || "", phone: c.phone || "",
            email: c.email || "", address: c.address || "", officialLink: c.officialLink || ""
          })),
          ...mediaContacts,
        ],
        meetings: (act.meetings || []).map(m => ({
          title: m.title || "", frequency: m.frequency || "", location: m.location || "",
          why: m.why || "", link: m.link || ""
        })),
        paths: (act.paths || []).map(p => ({
          destination: p.destination || "", type: p.type || "", why: p.why || "", link: p.link || ""
        })),
        actions: (act.actions || []).map(a => ({
          label: a.label || "", kind: a.kind || "primary",
          href: a.href || "",
          template: a.template ? {
            email:   a.template.email   || "",
            subject: a.template.subject || "",
            body:    a.template.body    || "",
          } : null
        })),
      }
    }
  };
}

// Convert a Supabase stat_block row into the [label, value, context, color] tuple
// your VisualSwitcher stats array expects
function toStatTuple(row) {
  const d = row.data || row;
  const colorMap = {
    red:    "#dc2626",
    gold:   "#b8860b",
    purple: "#6c3483",
    green:  "#1e8449",
    blue:   "#1a5276",
  };
  const color = colorMap[d.color] || "#dc2626";
  if (d.type === "key-number")  return [d.label || "", d.value || "", d.context || "", color];
  if (d.type === "pay-clock")   return [d.label || "", "$" + ((d.annualAmount||0)/1e6).toFixed(1) + "M/yr", d.context || "", color];
  if (d.type === "comparison-bar") return [d.title || "", d.leftValue + " vs " + d.rightValue, d.context || "", color];
  return [d.title || d.label || "", "", d.context || "", color];
}

export default function useSupabaseModule(pageId) {
  const [liveIssues, setLiveIssues]   = useState([]);
  const [liveStats,  setLiveStats]    = useState([]);
  const [loading,    setLoading]      = useState(true);

  useEffect(() => {
    if (!supabase || !pageId) { setLoading(false); return; }
    const moduleName = MODULE_NAME_MAP[pageId];
    if (!moduleName) { setLoading(false); return; }

    async function fetch() {
      setLoading(true);
      try {
        const [{ data: issues }, { data: stats }] = await Promise.all([
          supabase
            .from("issue_cards")
            .select("*")
            .eq("module", moduleName)
            .order("created_at", { ascending: true }),
          supabase
            .from("stat_blocks")
            .select("*")
            .eq("module", moduleName)
            .order("strength_score", { ascending: false }),
        ]);
        setLiveIssues((issues || []).map(toIssueShape));
        setLiveStats((stats  || []).map(toStatTuple));
      } catch (e) {
        console.error("useSupabaseModule fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [pageId]);

  return { liveIssues, liveStats, loading };
}