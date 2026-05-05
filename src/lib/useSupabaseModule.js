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

function uniqueTabs(values = []) {
  return Array.from(new Set(values.map(v => String(v || "").trim()).filter(Boolean)));
}

function extractTabs(source) {
  if (!source || typeof source !== "object") return [];
  const data = source.data && typeof source.data === "object" ? source.data : {};
  const rawTabs = [
    ...(Array.isArray(source.tabs) ? source.tabs : []),
    ...(Array.isArray(data.tabs) ? data.tabs : []),
    source.tab,
    data.tab,
  ];
  return uniqueTabs(rawTabs);
}

// Convert a Supabase issue_card row into the shape IssueCard expects
function toIssueShape(row) {
  const dec = row.decoder || {};
  const act = dec.actions || row.actions || {};
  const tabs = extractTabs(row);

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
    tab: tabs[0] || row.tab || null,
    tabs,
    show_on_overview: row.show_on_overview || false,
    visual_score: row.visual_score || 0,
    visual_config: row.visual_config || null,
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
export function toStatTuple(row) {
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
  const [liveIssues, setLiveIssues]       = useState([]);
  const [liveStats, setLiveStats]         = useState([]);
  const [liveStatBlocks, setLiveStatBlocks] = useState([]);
  const [loading, setLoading]             = useState(true);

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
        const issueRows = issues || [];
        const issueByRef = new Map(
          issueRows
            .filter(row => row?.ref_number)
            .map(row => [row.ref_number, row])
        );

        const normalizedStats = (stats || []).map((row) => {
          const linkedIssue = row.issue_card_ref ? issueByRef.get(row.issue_card_ref) : null;
          const parentTabs = extractTabs(linkedIssue);
          const ownTabs = extractTabs(row);
          const effectiveTabs = parentTabs.length ? parentTabs : ownTabs;
          const effectiveTab = effectiveTabs[0] || row.tab || row.data?.tab || "overview";
          const nextData = {
            ...(row.data || {}),
            module: row.module || row.data?.module || moduleName,
            type: row.type || row.data?.type,
            color: row.color || row.data?.color,
            tab: effectiveTab,
            tabs: effectiveTabs,
          };

        return {
          ...row,
          card_ref: row.card_ref || row.issue_card_ref || null,
          visual_config: row.visual_config || nextData.visual_config || null,
          tab: effectiveTab,
          effectiveTab,
          effectiveTabs,
            data: nextData,
          };
        });

        setLiveIssues(issueRows.map(toIssueShape));
        setLiveStatBlocks(normalizedStats);
        setLiveStats(normalizedStats.map(toStatTuple));
      } catch (e) {
        console.error("useSupabaseModule fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [pageId]);

  return { liveIssues, liveStats, liveStatBlocks, loading };
}
