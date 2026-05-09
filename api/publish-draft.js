import { requireAdmin } from "./_adminAuth";
import { getAdminClient } from "./_reviewWorkflow";

const MODULE_PREFIX = {
  equity: "EQ", utilities: "UT", health: "HS", insurance_burdens: "IN",
  workers_childcare: "WK", taxation: "TX", housing_crisis: "HO",
  officials_elections: "OF", boards_oversight: "BO", voting_rights: "VT",
  criminal_justice: "CJ", policing: "PO", data_collection: "DA", money: "MO",
  landuse: "LA", environment: "EN", information_warfare: "IW", proposals: "PR", action: "AC",
};

const OFFICIAL_KINDS = new Set(["elected", "appointed", "candidate", "former", "deceased", "judge", "sheriff", "tax_official", "official"]);
const BOARD_KINDS = new Set(["board_member", "director", "authority_member", "board", "appointed_body"]);
const SCHOOL_KINDS = new Set(["superintendent", "asst_superintendent", "principal", "vice_principal", "resource_officer", "district_staff"]);

function prefixFor(module) {
  return MODULE_PREFIX[String(module || "").trim().toLowerCase()] || String(module || "XX").slice(0, 2).toUpperCase();
}

function slugify(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || null;
}

async function nextRef(supabase, table, module, suffix) {
  const prefix = prefixFor(module);
  const { data } = await supabase.from(table).select("ref_number").like("ref_number", `${prefix}-${suffix}-%`);
  return `${prefix}-${suffix}-${(data?.length || 0) + 1}`;
}

function targetProfileTable(kindValue) {
  const kind = String(kindValue || "").toLowerCase();
  if (BOARD_KINDS.has(kind)) return "board_profiles";
  if (SCHOOL_KINDS.has(kind)) return "school_profiles";
  if (OFFICIAL_KINDS.has(kind)) return "official_profiles";
  return "official_profiles";
}

async function publishIssueDraft(supabase, draftId) {
  const { data: draft, error: draftError } = await supabase.from("issue_card_drafts").select("*").eq("id", draftId).single();
  if (draftError) throw draftError;
  if (draft.admin_status === "published") return { already_published: true, draft };

  const ref_number = draft.ref_number || await nextRef(supabase, "issue_cards", draft.module, "IC");
  const issuePayload = {
    case_id: draft.case_id,
    module: draft.module,
    tab: draft.tab || "overview",
    tabs: Array.isArray(draft.tabs) ? draft.tabs : [draft.tab || "overview"],
    label: draft.label,
    title: draft.title,
    summary: draft.summary,
    homepage_teaser: draft.homepage_teaser || "",
    details: draft.details,
    sources: draft.sources || [],
    decoder: draft.decoder || {},
    actions: draft.actions || {},
    visual_config: draft.visual_config || draft.inline_visual_config || null,
    inline_visual_config: draft.inline_visual_config || null,
    visual_score: draft.visual_config || draft.inline_visual_config ? 8 : 0,
    inline_visual_score: draft.inline_visual_config ? 8 : null,
    ref_number,
    published_at: new Date().toISOString(),
  };
  const { data: issue, error: issueError } = await supabase.from("issue_cards").insert(issuePayload).select().single();
  if (issueError) throw issueError;

  const statBlocks = Array.isArray(draft.stat_blocks) ? draft.stat_blocks : [];
  const insertedStats = [];
  for (const block of statBlocks) {
    const statRef = await nextRef(supabase, "stat_blocks", block.module || draft.module, "SB");
    const { data, error } = await supabase.from("stat_blocks").insert({
      module: block.module || draft.module,
      tab: block.tab || draft.tab || "overview",
      type: block.type || block.data?.type || "key-number",
      color: block.color || block.data?.color || "gold",
      data: { ...block, module: block.module || draft.module, tab: block.tab || draft.tab || "overview" },
      ref_number: statRef,
      issue_card_ref: ref_number,
      card_ref: ref_number,
      strength_score: block.strength_score || null,
      visual_config: block.visual_config || null,
    }).select().single();
    if (!error && data) insertedStats.push(data);
  }

  const linkedProfiles = Array.isArray(draft.linked_profiles) ? draft.linked_profiles : [];
  for (const link of linkedProfiles.filter((item) => item?.approved || item?.admin_approved)) {
    await supabase.from("profile_issue_links").insert({
      profile_id: link.profile_id || null,
      issue_card_id: issue.id,
      profile_ref: link.profile_ref || link.name || null,
      issue_ref: ref_number,
      relationship_type: link.relationship_type || "named official",
      role_in_issue: link.role_in_issue || link.role || null,
      source: link.source || null,
    });
  }

  await supabase.from("issue_card_drafts").update({
    admin_status: "published",
    ref_number,
    updated_at: new Date().toISOString(),
  }).eq("id", draft.id);

  return { issue, stat_blocks: insertedStats, ref_number };
}

async function publishProfileDraft(supabase, draftId) {
  const { data: draft, error: draftError } = await supabase.from("profile_drafts").select("*").eq("id", draftId).single();
  if (draftError) throw draftError;
  if (draft.admin_status === "published") return { already_published: true, draft };

  const table = targetProfileTable(draft.profile_type);
  const name = draft.display_name || draft.full_name;
  const payload = {
    module: table === "official_profiles" ? "officials_elections" : "boards_oversight",
    profile_case_id: draft.profile_case_id,
    slug: slugify(name),
    name,
    office: draft.title,
    geography: draft.jurisdiction || draft.district_or_seat,
    kind: draft.profile_type || "official",
    role_label: draft.title,
    status_line: [draft.jurisdiction, draft.next_election ? `Next election: ${draft.next_election}` : ""].filter(Boolean).join(" · "),
    quick_facts: [
      draft.district_or_seat ? { label: "District / Seat", value: draft.district_or_seat } : null,
      draft.term_start || draft.term_end ? { label: "Term", value: [draft.term_start, draft.term_end].filter(Boolean).join(" - ") } : null,
    ].filter(Boolean),
    profile: draft.bio || {},
    donors: draft.donors || draft.campaign_finance || {},
    votes: Array.isArray(draft.votes_actions) ? draft.votes_actions : [],
    contact: draft.contact_info || {},
    decoder: {
      rise: draft.decoder?.rise || "",
      affiliations: draft.decoder?.affiliations || "",
      beneficiaries: draft.decoder?.beneficiaries || "",
      track_record: draft.decoder?.track_record || draft.decoder?.trackRecord || "",
    },
    data: {
      profile_case_id: draft.profile_case_id,
      career_history: draft.career_history,
      education: draft.education,
      campaign_finance: draft.campaign_finance,
      ethics_disclosures: draft.ethics_disclosures,
      appointments: draft.appointments,
      board_ties: draft.board_ties,
      business_ties: draft.business_ties,
      public_controversies: draft.public_controversies,
      sources: draft.sources,
    },
  };

  const { data: existing } = await supabase.from(table).select("id").eq("slug", payload.slug).maybeSingle();
  const query = existing?.id
    ? supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq("id", existing.id)
    : supabase.from(table).insert(payload);
  const { data: rows, error } = await query.select();
  if (error) throw error;
  const profile = Array.isArray(rows) ? rows[0] : rows;

  const links = Array.isArray(draft.linked_issue_cards) ? draft.linked_issue_cards : [];
  for (const link of links.filter((item) => item?.approved || item?.admin_approved)) {
    await supabase.from("profile_issue_links").insert({
      profile_id: profile?.id || null,
      issue_card_id: link.issue_card_id || null,
      profile_ref: payload.slug || name,
      issue_ref: link.issue_ref || link.ref_number || null,
      relationship_type: link.relationship_type || "named official",
      role_in_issue: link.role_in_issue || link.role || null,
      source: link.source || null,
    });
  }

  await supabase.from("profile_drafts").update({
    admin_status: "published",
    updated_at: new Date().toISOString(),
  }).eq("id", draft.id);

  return { profile, table };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireAdmin(req, res))) return;

  try {
    const { type, id } = req.body || {};
    if (!id) return res.status(400).json({ error: "Missing draft id" });
    const supabase = getAdminClient();
    const result = type === "profile"
      ? await publishProfileDraft(supabase, id)
      : await publishIssueDraft(supabase, id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
