import { parseStructuredPacket, validateRecord } from "./_shared/parserCore.js";
import { computeScoreBundle } from "./_shared/scoring.js";
import { getSupabaseAdminClient } from "./_shared/supabaseAdmin.js";
import { requireAdminApiKey } from "./_shared/authGuard.js";

async function insertChildren(supabase, table, draftId, workspace, rows) {
  if (!rows?.length) return;
  const { error } = await supabase.from(table).insert(rows.map((row) => ({ draft_id: draftId, workspace, ...row })));
  if (error) throw new Error(error.message);
}

async function insertDraftBundle(supabase, item) {
  const { draft, validation, scores } = item;
  const { data: draftRow, error } = await supabase.from("admin_draft_records").insert({
    workspace: draft.workspace,
    draft_type: draft.draft_type,
    status: validation.ok ? "parsed" : "needs_review",
    title: draft.title || null,
    raw_text: draft.raw_text || "",
    parsed_payload: draft.parsed_payload || {},
    public_payload: validation.publicPayload || {},
    validation_result: validation,
    score_bundle: scores,
    readiness_score_50: scores.readiness_score_50 ?? null,
    primary_score_50: scores.civic_impact_score_50 ?? scores.internal_absurdity_score_50 ?? null,
    public_score_10: scores.public_absurdity_score_10 ?? null,
    needs_review: Boolean((validation.warnings || []).length || (validation.errors || []).length),
  }).select("*").single();
  if (error) throw new Error(error.message);
  await insertChildren(supabase, "content_source_records", draftRow.id, draft.workspace, draft.source_records);
  await insertChildren(supabase, "content_claim_records", draftRow.id, draft.workspace, draft.claim_records);
  await insertChildren(supabase, "content_estimate_records", draftRow.id, draft.workspace, draft.estimate_records);
  await insertChildren(supabase, "content_relationship_records", draftRow.id, draft.workspace, draft.relationship_records);
  return draftRow;
}

export default async function handler(req, res) {
  const auth = requireAdminApiKey(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase service role configuration" });
  const { workspace, rawText, dryRun } = req.body || {};
  if (!workspace || !rawText) return res.status(400).json({ error: "Missing workspace or rawText" });
  try {
    const packet = parseStructuredPacket({ workspace, rawText });
    const processed = packet.drafts.map((draft) => {
      const validation = validateRecord({ workspace: draft.workspace, draftType: draft.draft_type, payload: draft.parsed_payload, sources: draft.source_records, claims: draft.claim_records });
      const scores = computeScoreBundle({ workspace: draft.workspace, draftType: draft.draft_type, payload: draft.parsed_payload, sources: draft.source_records, claims: draft.claim_records, validation });
      return { draft, validation, scores };
    });
    if (dryRun) return res.status(200).json({ success: true, dryRun: true, workspace, draft_count: processed.length, drafts: processed });
    const inserted = [];
    for (const item of processed) inserted.push(await insertDraftBundle(supabase, item));
    return res.status(200).json({ success: true, workspace, draft_count: inserted.length, drafts: inserted });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Parse structured packet failed" });
  }
}
