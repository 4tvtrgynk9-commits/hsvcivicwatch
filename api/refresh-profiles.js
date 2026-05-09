import { requireAdmin } from "./_adminAuth";
import {
  alertsFromChecklist,
  anthropicJson,
  checklistForProfile,
  compactJson,
  getAdminClient,
} from "./_reviewWorkflow";

const PROFILE_SYSTEM = `You generate draft HSV Civic Watch official/candidate/board profiles from staged research.
Return ONLY valid JSON: { "profiles": [...] }.
Do not invent facts. Missing facts must be null and flagged by checklist, not shown in public preview.
Each profile must include: profile_type, full_name, display_name, title, jurisdiction, district_or_seat, term_start, term_end, next_election, contact_info, bio, career_history, education, campaign_finance, donors, ethics_disclosures, votes_actions, appointments, board_ties, business_ties, public_controversies, decoder { rise, affiliations, beneficiaries, track_record }, sources, linked_issue_cards.
Use the decoder section names The Rise, The Affiliations, The Beneficiaries, The Track Record.`;

function fallbackProfile(caseRow, outputs) {
  const first = outputs[0] || {};
  const raw = first.raw_output || {};
  return {
    profile_type: caseRow.profile_type || raw.profile_type || "official",
    full_name: raw.full_name || raw.name || caseRow.person_name,
    display_name: raw.display_name || raw.name || caseRow.person_name,
    title: raw.title || raw.office || caseRow.office_title,
    jurisdiction: raw.jurisdiction || caseRow.jurisdiction,
    district_or_seat: raw.district_or_seat || raw.seat || "",
    term_start: raw.term_start || "",
    term_end: raw.term_end || "",
    next_election: raw.next_election || raw.election_date || "",
    contact_info: raw.contact || raw.contact_info || {},
    bio: raw.bio || raw.profile || {},
    career_history: raw.career_history || raw.current_roles || [],
    education: raw.education || [],
    campaign_finance: raw.campaign_finance || raw.donors || {},
    donors: raw.donors || {},
    ethics_disclosures: raw.ethics_disclosures || raw.ethics_complaints || {},
    votes_actions: raw.votes_actions || raw.votes || raw.on_record || [],
    appointments: raw.appointments || [],
    board_ties: raw.board_ties || raw.networks?.board_seats || [],
    business_ties: raw.business_ties || raw.family?.business_ties || [],
    public_controversies: raw.public_controversies || raw.conflicts || [],
    decoder: {
      rise: raw.decoder?.rise || "",
      affiliations: raw.decoder?.affiliations || "",
      beneficiaries: raw.decoder?.beneficiaries || "",
      track_record: raw.decoder?.track_record || raw.decoder?.trackRecord || "",
    },
    sources: first.sources || raw.sources || [],
    linked_issue_cards: raw.linked_issue_cards || [],
  };
}

async function generateProfilesForCase(caseRow, outputs) {
  let generated = null;
  try {
    generated = await anthropicJson(PROFILE_SYSTEM, compactJson({ profile_case: caseRow, profile_research_outputs: outputs }), 14000);
  } catch (error) {
    generated = { error: error.message };
  }
  const profiles = Array.isArray(generated?.profiles) && generated.profiles.length ? generated.profiles : [fallbackProfile(caseRow, outputs)];
  return profiles.map((profile) => {
    const checklist = checklistForProfile(profile);
    return {
      ...profile,
      checklist_status: checklist,
      parser_alerts: alertsFromChecklist(checklist),
      admin_status: checklist.missing.length ? "needs_more_research" : "pending_review",
    };
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireAdmin(req, res))) return;

  const supabase = getAdminClient();
  const summary = { cases_checked: 0, drafts_created: 0, drafts_updated: 0, needs_more_research: 0, errors: [] };

  try {
    const { data: cases, error: casesError } = await supabase
      .from("profile_cases")
      .select("*")
      .in("admin_review_status", ["pending", "sent_back", "needs_more_research"])
      .limit(50);
    if (casesError) throw casesError;

    for (const caseRow of cases || []) {
      summary.cases_checked += 1;
      try {
        const [{ data: outputs }, { data: existing }] = await Promise.all([
          supabase.from("profile_research_outputs").select("*").eq("profile_case_id", caseRow.profile_case_id).order("created_at", { ascending: true }),
          supabase.from("profile_drafts").select("id, admin_status").eq("profile_case_id", caseRow.profile_case_id),
        ]);
        if (!outputs?.length) continue;

        const profiles = await generateProfilesForCase(caseRow, outputs || []);
        const existingDraft = existing?.[0] || null;

        for (const profile of profiles) {
          const payload = {
            profile_case_id: caseRow.profile_case_id,
            profile_type: profile.profile_type,
            full_name: profile.full_name,
            display_name: profile.display_name,
            title: profile.title,
            jurisdiction: profile.jurisdiction,
            district_or_seat: profile.district_or_seat,
            term_start: profile.term_start,
            term_end: profile.term_end,
            next_election: profile.next_election,
            contact_info: profile.contact_info,
            bio: profile.bio,
            career_history: profile.career_history,
            education: profile.education,
            campaign_finance: profile.campaign_finance,
            donors: profile.donors,
            ethics_disclosures: profile.ethics_disclosures,
            votes_actions: profile.votes_actions,
            appointments: profile.appointments,
            board_ties: profile.board_ties,
            business_ties: profile.business_ties,
            public_controversies: profile.public_controversies,
            decoder: profile.decoder,
            sources: profile.sources,
            checklist_status: profile.checklist_status,
            parser_alerts: profile.parser_alerts,
            linked_issue_cards: profile.linked_issue_cards,
            admin_status: profile.admin_status,
            updated_at: new Date().toISOString(),
          };

          if (profile.admin_status === "needs_more_research") summary.needs_more_research += 1;

          if (existingDraft && existingDraft.admin_status !== "published") {
            const { error } = await supabase.from("profile_drafts").update(payload).eq("id", existingDraft.id);
            if (error) throw error;
            summary.drafts_updated += 1;
          } else if (!existingDraft) {
            const { error } = await supabase.from("profile_drafts").insert(payload);
            if (error) throw error;
            summary.drafts_created += 1;
          }
        }

        await supabase.from("profile_cases").update({
          status: "draft_generated",
          admin_review_status: profiles.some((profile) => profile.admin_status === "needs_more_research") ? "needs_more_research" : "pending",
          updated_at: new Date().toISOString(),
        }).eq("profile_case_id", caseRow.profile_case_id);
      } catch (error) {
        summary.errors.push({ profile_case_id: caseRow.profile_case_id, error: error.message });
      }
    }

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ ...summary, error: error.message });
  }
}
