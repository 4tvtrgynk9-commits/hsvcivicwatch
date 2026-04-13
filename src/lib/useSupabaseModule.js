import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// Maps module page IDs to the module name stored in Supabase
const MODULE_NAME_MAP = {
  health:             "Health System",
  utilities:          "Utilities",
  housing_crisis:     "Housing",
  criminal_justice:   "Criminal Justice",
  workers_childcare:  "Workers",
  taxation:           "Taxes",
  officials_elections:"Officials",
  equity:             "Equity",
  insurance_burdens:  "Insurance",
  boards_oversight:   "Boards",
  voting_rights:      "Voting",
  policing:           "Policing",
  data_collection:    "Data",
  money:              "Money",
  landuse:            "Land",
  environment:        "Environment",
  information_warfare:"Information",
  proposals:          "Proposals",
  action:             "Action",
};

// Convert a Supabase issue_card row into the shape IssueCard expects
function toIssueShape(row) {
  const dec = row.decoder || {};
  const act = row.actions || {};
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
      benefits:       dec.whoBenefits    || "",
      impact:         dec.impact         || "",
      actions: {
        contacts:  (act.contacts  || []).map(c => ({
          name: c.name, role: c.role || c.title || "", officialLink: c.email || ""
        })),
        meetings:  (act.meetings  || []).map(m => ({
          title: m.body || "", frequency: m.nextMeeting || "", why: m.howToSpeak || ""
        })),
        paths:     [],
        actions:   act.emailTemplate ? [{
          label:    "Email Official",
          kind:     "primary",
          template: {
            email:   act.emailTemplate.to      || "",
            subject: act.emailTemplate.subject || "",
            body:    act.emailTemplate.body    || "",
          }
        }] : [],
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
            .ilike("module", "%" + moduleName + "%")
            .order("created_at", { ascending: true }),
          supabase
            .from("stat_blocks")
            .select("*")
            .ilike("module", "%" + moduleName + "%")
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