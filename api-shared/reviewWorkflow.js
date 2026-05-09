import { createClient } from "@supabase/supabase-js";

export const ANTHROPIC_API_VERSION = "2023-06-01";
export const MODEL = "claude-sonnet-4-20250514";

export function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  if (!url || !key) throw new Error("Missing Supabase service-role configuration");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function compactJson(value) {
  try {
    return JSON.stringify(value ?? null).slice(0, 24000);
  } catch {
    return String(value || "").slice(0, 24000);
  }
}

export function parseJsonFromText(text) {
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  const first = clean.indexOf("{");
  const last = clean.lastIndexOf("}");
  return JSON.parse(first >= 0 && last >= first ? clean.slice(first, last + 1) : clean);
}

export async function anthropicJson(system, userContent, maxTokens = 12000) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_API_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  const text = (data.content || []).map((item) => item.text || "").join("");
  return parseJsonFromText(text);
}

export function isMissing(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return ["", "unknown", "not found", "null", "n/a"].includes(String(value).trim().toLowerCase());
}

export function checklistForIssue(card = {}) {
  const checks = {
    module: !isMissing(card.module),
    tab: !isMissing(card.tab),
    label: !isMissing(card.label),
    title: !isMissing(card.title),
    summary: !isMissing(card.summary),
    details: !isMissing(card.details),
    sources: !isMissing(card.sources),
    "decoder.whatsHappening": !isMissing(card.decoder?.whatsHappening),
    "decoder.connections": !isMissing(card.decoder?.connections),
    "decoder.whoBenefits": !isMissing(card.decoder?.whoBenefits),
    "decoder.impact": !isMissing(card.decoder?.impact),
    actions: !isMissing(card.actions),
    contact_info_checked: !isMissing(card.actions?.contacts),
    meeting_info_checked: !isMissing(card.actions?.meetings),
    records_request_path_checked: !isMissing(card.actions?.recordsRequest || card.actions?.paths),
    complaint_routes_checked: !isMissing(card.actions?.complaint || card.actions?.paths),
    investigation_routes_checked: !isMissing(card.actions?.investigation || card.actions?.paths),
    election_info_checked: !isMissing(card.actions?.elections),
    stat_blocks_checked: !isMissing(card.stat_blocks),
    visual_config_checked: !isMissing(card.visual_config || card.inline_visual_config),
    linked_profiles_suggested: !isMissing(card.linked_profiles),
  };
  return {
    checks,
    missing: Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key),
  };
}

export function checklistForProfile(profile = {}) {
  const checks = {
    full_name: !isMissing(profile.full_name),
    current_title: !isMissing(profile.title),
    jurisdiction: !isMissing(profile.jurisdiction),
    district_or_seat: !isMissing(profile.district_or_seat),
    profile_type: !isMissing(profile.profile_type),
    term_dates: !isMissing(profile.term_start) || !isMissing(profile.term_end),
    next_election: !isMissing(profile.next_election),
    contact_info: !isMissing(profile.contact_info),
    official_bio: !isMissing(profile.bio),
    career_history: !isMissing(profile.career_history),
    education: !isMissing(profile.education),
    campaign_finance: !isMissing(profile.campaign_finance),
    top_donors: !isMissing(profile.donors),
    ethics_disclosures: !isMissing(profile.ethics_disclosures),
    votes_actions: !isMissing(profile.votes_actions),
    appointments: !isMissing(profile.appointments),
    board_ties: !isMissing(profile.board_ties),
    business_ties: !isMissing(profile.business_ties),
    public_controversies: !isMissing(profile.public_controversies),
    sources: !isMissing(profile.sources),
    linked_issue_cards: !isMissing(profile.linked_issue_cards),
  };
  return {
    checks,
    missing: Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key),
  };
}

export function alertsFromChecklist(checklist, extra = {}) {
  const alerts = [];
  for (const field of checklist?.missing || []) {
    alerts.push({ type: "missing_field", severity: "warning", message: `${field} needs review.` });
  }
  for (const claim of extra.conflicting_claims || []) {
    alerts.push({ type: "conflicting_source", severity: "warning", message: String(claim?.message || claim).slice(0, 320) });
  }
  return alerts;
}

export function normalizeProfileDraftForPublic(draft = {}) {
  return {
    id: draft.id,
    name: draft.display_name || draft.full_name,
    office: draft.title,
    kind: draft.profile_type,
    jurisdiction: draft.jurisdiction,
    geography: draft.district_or_seat,
    term_start: draft.term_start,
    term_end: draft.term_end,
    election_date: draft.next_election,
    contact: draft.contact_info || {},
    education: Array.isArray(draft.education) ? draft.education.map(String).join("; ") : draft.education,
    donors: draft.donors || draft.campaign_finance || {},
    ethics_complaints: draft.ethics_disclosures || {},
    votes: Array.isArray(draft.votes_actions) ? draft.votes_actions : [],
    decoder: {
      rise: draft.decoder?.rise || draft.decoder?.theRise || draft.bio?.summary || "",
      affiliations: draft.decoder?.affiliations || draft.decoder?.theAffiliations || "",
      beneficiaries: draft.decoder?.beneficiaries || draft.decoder?.theBeneficiaries || "",
      track_record: draft.decoder?.track_record || draft.decoder?.trackRecord || "",
    },
  };
}
