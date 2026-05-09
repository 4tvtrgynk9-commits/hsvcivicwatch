import { requireAdmin } from "./_adminAuth";
import {
  alertsFromChecklist,
  anthropicJson,
  checklistForIssue,
  compactJson,
  getAdminClient,
  isMissing,
} from "./_reviewWorkflow";

const CONTENT_SYSTEM = `You generate draft HSV Civic Watch issue cards from staged agent research.
Return ONLY valid JSON: { "issueCards": [...] }.
Do not invent facts. Do not present unsourced allegations as fact. Preserve missing facts as null.
Each issue card must include: module, tab, tabs, label, title, summary, homepage_teaser, details, sources, decoder { whatsHappening, connections, whoBenefits, impact }, actions, stat_blocks, visual_config, inline_visual_config, linked_profiles.
Hide UNKNOWN/NOT FOUND/null from public fields where possible; missing values belong in checklist alerts.`;

function fallbackCard(caseRow, outputs, packet) {
  const first = outputs[0] || {};
  const raw = first.raw_output || {};
  const title = packet?.recommended_title || first.suggested_title || raw.title || caseRow.source_title || caseRow.starting_topic || caseRow.case_id;
  const sources = packet?.confirmed_sources || first.sources || raw.sources || (caseRow.source_url ? [{ label: caseRow.source_title || caseRow.source_url, url: caseRow.source_url }] : []);
  const module = packet?.recommended_module || first.suggested_module || caseRow.final_recommended_module || "equity";
  const tab = packet?.recommended_tab || first.suggested_tab || caseRow.final_recommended_tab || "overview";
  return {
    module,
    tab,
    tabs: [tab],
    label: first.suggested_issue_angle || "Research",
    title,
    summary: raw.summary || raw.suggested_summary || packet?.canonical_topic || caseRow.starting_topic || "",
    homepage_teaser: raw.homepage_teaser || "",
    details: raw.details || raw.body || compactJson(packet?.merged_facts || raw),
    sources,
    decoder: {
      whatsHappening: raw.decoder?.whatsHappening || raw.whats_happening || "",
      connections: raw.decoder?.connections || raw.connections || "",
      whoBenefits: raw.decoder?.whoBenefits || raw.who_benefits || "",
      impact: raw.decoder?.impact || raw.impact || "",
    },
    actions: raw.actions || {},
    stat_blocks: packet?.recommended_stat_blocks || first.suggested_stats || [],
    visual_config: raw.visual_config || null,
    inline_visual_config: raw.inline_visual_config || null,
    linked_profiles: raw.linked_profiles || [],
  };
}

async function generateCardsForCase(caseRow, outputs, packet) {
  let generated = null;
  try {
    generated = await anthropicJson(CONTENT_SYSTEM, compactJson({ case: caseRow, agent_outputs: outputs, merged_packet: packet }), 14000);
  } catch (error) {
    generated = { error: error.message };
  }

  const cards = Array.isArray(generated?.issueCards) && generated.issueCards.length
    ? generated.issueCards
    : [fallbackCard(caseRow, outputs, packet)];

  return cards.map((card) => {
    const normalized = {
      ...card,
      module: card.module || packet?.recommended_module || caseRow.final_recommended_module || "equity",
      tab: card.tab || packet?.recommended_tab || caseRow.final_recommended_tab || "overview",
      tabs: Array.isArray(card.tabs) && card.tabs.length ? card.tabs : [card.tab || "overview"],
      sources: Array.isArray(card.sources) ? card.sources : [],
      decoder: card.decoder || {},
      actions: card.actions || {},
      stat_blocks: card.stat_blocks || [],
      linked_profiles: card.linked_profiles || [],
    };
    const checklist = checklistForIssue(normalized);
    return {
      ...normalized,
      checklist_status: checklist,
      parser_alerts: alertsFromChecklist(checklist, {
        conflicting_claims: packet?.conflicting_claims || [],
      }),
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
      .from("research_cases")
      .select("*")
      .in("admin_review_status", ["pending", "sent_back", "needs_more_research"])
      .limit(50);
    if (casesError) throw casesError;

    for (const caseRow of cases || []) {
      summary.cases_checked += 1;
      try {
        const [{ data: outputs }, { data: packets }, { data: existing }] = await Promise.all([
          supabase.from("agent_research_outputs").select("*").eq("case_id", caseRow.case_id).order("created_at", { ascending: true }),
          supabase.from("merged_research_packets").select("*").eq("case_id", caseRow.case_id).order("created_at", { ascending: false }).limit(1),
          supabase.from("issue_card_drafts").select("id, admin_status").eq("case_id", caseRow.case_id),
        ]);

        const packet = packets?.[0] || null;
        if (!outputs?.length && !packet?.ready_for_parser) continue;

        const generatedCards = await generateCardsForCase(caseRow, outputs || [], packet);
        const existingDraft = existing?.[0] || null;

        for (const card of generatedCards) {
          const payload = {
            case_id: caseRow.case_id,
            ref_number: card.ref_number || null,
            module: card.module,
            tab: card.tab,
            tabs: card.tabs,
            label: card.label,
            title: card.title,
            summary: card.summary,
            homepage_teaser: card.homepage_teaser,
            details: card.details,
            sources: card.sources,
            decoder: card.decoder,
            actions: card.actions,
            stat_blocks: card.stat_blocks,
            visual_config: card.visual_config,
            inline_visual_config: card.inline_visual_config,
            checklist_status: card.checklist_status,
            parser_alerts: card.parser_alerts,
            linked_profiles: card.linked_profiles,
            admin_status: card.admin_status,
            updated_at: new Date().toISOString(),
          };

          if (isMissing(payload.title) || isMissing(payload.sources)) summary.needs_more_research += 1;

          if (existingDraft && existingDraft.admin_status !== "published") {
            const { error } = await supabase.from("issue_card_drafts").update(payload).eq("id", existingDraft.id);
            if (error) throw error;
            summary.drafts_updated += 1;
          } else if (!existingDraft) {
            const { error } = await supabase.from("issue_card_drafts").insert(payload);
            if (error) throw error;
            summary.drafts_created += 1;
          }
        }

        await supabase.from("research_cases").update({
          parser_status: "generated",
          admin_review_status: generatedCards.some((card) => card.admin_status === "needs_more_research") ? "needs_more_research" : "pending",
          updated_at: new Date().toISOString(),
        }).eq("case_id", caseRow.case_id);
      } catch (error) {
        summary.errors.push({ case_id: caseRow.case_id, error: error.message });
      }
    }

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ ...summary, error: error.message });
  }
}
