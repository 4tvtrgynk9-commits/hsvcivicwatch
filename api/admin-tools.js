
import { getSupabaseAdminClient } from "../api-shared/supabaseAdmin.js";
import { requireAdminApiKey } from "../api-shared/authGuard.js";
import { getCurrentMonthSpend } from "../api-shared/aiBudget.js";
import { MONTHLY_AI_BUDGET_USD } from "../api-shared/aiConfig.js";
import { runAiTask } from "../api-shared/aiGateway.js";
import {
  buildHsvIssueSocialDraft,
  buildHsvRotation,
  buildVeritasSocialDraft,
  VERITAS_EVERY_THREE_DAYS_CATEGORIES,
  buildHsvHashtags,
  buildVeritasHashtags,
  uniqueTags,
} from "../api-shared/socialTemplates.js";

async function dashboard(req, res, supabase) {
  const [budget, drafts, social, hashtags, polls] = await Promise.all([
    getCurrentMonthSpend(supabase),
    supabase
      .from("admin_draft_records")
      .select("id, workspace, draft_type, status, title, readiness_score_50, primary_score_50, public_score_10, needs_review, validation_result, score_bundle, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("social_card_queue")
      .select("id, workspace, category, source_record_type, source_record_id, source_ref, status, scheduled_for, posted_at, visual_style, platform_captions, hashtags, share_payload, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("social_hashtag_sets")
      .select("id, workspace, scope, platform, content_type, recommended_final_set, trending_tags, avoid_tags, reasoning_summary, expires_at, approved_by_admin, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("content_poll_records")
      .select("id, workspace, poll_type, linked_record_type, linked_record_id, question, option_a, option_b, correct_answer, reveal_text, status, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  for (const result of [drafts, social, hashtags, polls]) {
    if (result.error) throw new Error(result.error.message);
  }

  return res.status(200).json({
    success: true,
    budget: {
      month_key: budget.month_key,
      monthly_budget_usd: MONTHLY_AI_BUDGET_USD,
      estimated_spend_usd: Number(budget.estimated_spend_usd.toFixed(6)),
      remaining_usd: Number(Math.max(0, MONTHLY_AI_BUDGET_USD - budget.estimated_spend_usd).toFixed(6)),
      gateway_enabled: process.env.ENABLE_AI_GATEWAY === "true",
    },
    drafts: drafts.data || [],
    social_queue: social.data || [],
    hashtag_sets: hashtags.data || [],
    polls: polls.data || [],
  });
}

async function insertDrafts(supabase, drafts) {
  if (!drafts.length) return [];
  const { data, error } = await supabase
    .from("social_card_queue")
    .insert(drafts.map((draft) => ({
      workspace: draft.workspace,
      category: draft.category,
      source_record_type: draft.source_record_type,
      source_record_id: draft.source_record_id,
      source_ref: draft.source_ref,
      status: draft.status || "generated",
      scheduled_for: draft.scheduled_for || null,
      visual_style: draft.visual_style || {},
      slide_payload: draft.slide_payload || {},
      media_payload: draft.media_payload || {},
      platform_captions: draft.platform_captions || {},
      hashtags: draft.hashtags || {},
      share_payload: draft.share_payload || {},
    })))
    .select("*");

  if (error) throw new Error(error.message);
  return data || [];
}

async function generateSocialDrafts(req, res, supabase) {
  const { workspace, scheduled_for, limit, dryRun, sourceItems } = req.body || {};
  if (!workspace) return res.status(400).json({ error: "Missing workspace" });

  let drafts = [];

  if (workspace === "hsv") {
    const { data: cards, error } = await supabase
      .from("issue_cards")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const eligible = (cards || []).filter((card) => {
      const type = String(card.content_type || card.type || "").toLowerCase();
      return type !== "evidence of change" && type !== "bright_file";
    });

    const selected = buildHsvRotation(eligible).slice(0, Math.max(1, Number(limit || 1)));
    drafts = selected.map((card) => buildHsvIssueSocialDraft(card, { scheduled_for }));
  } else {
    if (Array.isArray(sourceItems) && sourceItems.length) {
      drafts = sourceItems.map((item) =>
        buildVeritasSocialDraft(item, item.category || "scandal_front_page", { scheduled_for })
      );
    } else {
      drafts = VERITAS_EVERY_THREE_DAYS_CATEGORIES.map((category) =>
        buildVeritasSocialDraft({
          id: `placeholder_${category}`,
          slug: `placeholder-${category}`,
          headline: `Placeholder ${category.replace(/_/g, " ")}`,
          teaser: "Replace this with a published Veritas record before posting.",
          record_type: category,
        }, category, { scheduled_for })
      );
    }
  }

  const result = dryRun ? drafts : await insertDrafts(supabase, drafts);
  return res.status(200).json({
    success: true,
    workspace,
    dryRun: Boolean(dryRun),
    draft_count: result.length,
    drafts: result,
  });
}

async function updateSocialDraft(req, res, supabase) {
  const { id, status, platform_captions, hashtags, admin_notes, selected_variant } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing social draft id" });

  const allowed = new Set(["queued", "generated", "needs_edit", "approved", "posted", "skipped"]);
  const patch = { updated_at: new Date().toISOString() };

  if (status) {
    if (!allowed.has(status)) return res.status(400).json({ error: "Invalid status" });
    patch.status = status;
    if (status === "posted") patch.posted_at = new Date().toISOString();
  }

  if (platform_captions) patch.platform_captions = platform_captions;
  if (hashtags) patch.hashtags = hashtags;
  if (admin_notes !== undefined) patch.admin_notes = admin_notes;
  if (selected_variant !== undefined) patch.selected_variant = selected_variant;

  const { data, error } = await supabase
    .from("social_card_queue")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return res.status(200).json({ success: true, social_draft: data });
}

function hashtagSystemPrompt() {
  return `You are the Hashtag Scout for a publication social desk. Return JSON only. Do not invent facts. Do not introduce new allegations. Do not use unrelated viral hashtags. Recommend tags only when they fit the post topic, location, public figure, agency, category, or current media cycle. HSV prioritizes Huntsville, Madison County, Tennessee Valley, North Alabama, Redstone Arsenal, Alabama, Southeast, and civic topics including worker rights, annexation, zoning, development, voting rights, polling places, utilities, and schools. Veritas prioritizes national scandal, accountability, satire, public figure, agency, policy, and media-cycle hashtags. Return 8 to 15 recommended tags and avoid_tags when appropriate.`;
}

function hashtagUserPrompt(input) {
  return JSON.stringify({
    task: "posting_now_hashtag_scout",
    instruction: "Find relevant day-of-posting hashtags for this post. Use only relevant current trends.",
    input,
    output_schema: {
      brand: ["#..."],
      local_or_national: ["#..."],
      topic: ["#..."],
      current_trend: ["#..."],
      avoid_tags: ["#..."],
      recommended_final_set: ["#..."],
      reasoning_summary: "short string",
      expires_hours: 24,
    },
  }, null, 2);
}

async function saveHashtagSet(supabase, input, text, fallback) {
  let parsed = null;
  try {
    parsed = JSON.parse(String(text || "").replace(/```json|```/g, "").trim());
  } catch {
    parsed = null;
  }

  const finalSet = uniqueTags(parsed?.recommended_final_set || fallback || []);

  const row = {
    workspace: input.workspace,
    scope: input.workspace === "hsv" ? "hsv_local" : "veritas_national",
    platform: input.platform || "instagram",
    content_type: input.content_type || null,
    linked_record_id: input.linked_record_id || null,
    brand_tags: parsed?.brand || [],
    topic_tags: parsed?.topic || [],
    local_or_national_tags: parsed?.local_or_national || [],
    trending_tags: parsed?.current_trend || [],
    avoid_tags: parsed?.avoid_tags || [],
    recommended_final_set: finalSet,
    reasoning_summary: parsed?.reasoning_summary || "",
    raw_result: parsed || { raw_text: text },
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const { data, error } = await supabase
    .from("social_hashtag_sets")
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function hashtagScout(req, res, supabase) {
  const input = req.body || {};
  if (!input.workspace) return res.status(400).json({ error: "Missing workspace" });

  const fallback = input.workspace === "hsv"
    ? buildHsvHashtags(input.module || input.content_type || "", input.extra_hashtags || [])
    : buildVeritasHashtags(input.category || input.content_type || "scandal_front_page", input.extra_hashtags || []);

  if (input.dryRun) {
    return res.status(200).json({
      success: true,
      dryRun: true,
      fallback_only: true,
      recommended_final_set: fallback,
    });
  }

  const result = await runAiTask({
    supabase,
    workspace: input.workspace,
    jobType: "hashtag_trend_scout",
    requestName: `${input.workspace}_hashtag_scout_${input.content_type || "post"}`,
    system: hashtagSystemPrompt(),
    prompt: hashtagUserPrompt(input),
    maxTokens: 700,
    metadata: {
      content_type: input.content_type || null,
      platform: input.platform || "instagram",
      linked_record_id: input.linked_record_id || null,
      posting_now: true,
    },
  });

  if (!result.ok) {
    return res.status(result.status || 500).json({
      ...result,
      fallback_hashtags: fallback,
    });
  }

  const saved = await saveHashtagSet(supabase, input, result.text, fallback);

  return res.status(200).json({
    success: true,
    workspace: input.workspace,
    provider: result.provider,
    model: result.model,
    estimatedCostUsd: result.estimatedCostUsd,
    hashtag_set: saved,
  });
}

async function aiTask(req, res, supabase) {
  const { workspace, jobType, requestName, system, prompt, maxTokens, metadata } = req.body || {};
  if (!workspace || !jobType || !prompt) {
    return res.status(400).json({ error: "Missing workspace, jobType, or prompt" });
  }

  const result = await runAiTask({
    supabase,
    workspace,
    jobType,
    requestName,
    system,
    prompt,
    maxTokens,
    metadata,
  });

  return res.status(result.status || (result.ok ? 200 : 500)).json(result);
}

function normalizeDraftArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function structuredIssuePayloadToReviewDraft(row) {
  const payload = row.parsed_payload || {};
  const validation = row.validation_result || {};
  const warnings = normalizeDraftArray(validation.warnings);
  const errors = normalizeDraftArray(validation.errors);
  const needsReview = Boolean(row.needs_review || warnings.length || errors.length);

  return {
    module: payload.module || "equity",
    tab: payload.tab || "overview",
    tabs: Array.isArray(payload.tabs) && payload.tabs.length ? payload.tabs : [payload.tab || "overview"],
    label: payload.label || payload.content_type || "Structured Packet",
    title: payload.title || row.title || "Untitled structured draft",
    summary: payload.summary || "",
    homepage_teaser: payload.homepage_teaser || "",
    details: payload.details || payload.body || "",
    sources: Array.isArray(payload.sources) && payload.sources.length
      ? payload.sources
      : normalizeDraftArray(row.source_records),
    decoder: {
      whatsHappening: payload.decoder?.whatsHappening || payload.decoder?.whats_happening || "",
      connections: payload.decoder?.connections || "",
      whoBenefits: payload.decoder?.whoBenefits || payload.decoder?.who_benefits || "",
      impact: payload.decoder?.impact || "",
    },
    actions: payload.actions || (payload.actions_raw ? { raw: payload.actions_raw } : {}),
    stat_blocks: [],
    visual_config: payload.visual_config || null,
    inline_visual_config: payload.inline_visual_config || null,
    checklist_status: {
      checks: {},
      missing: warnings.map((item) => String(item)),
    },
    parser_alerts: [
      ...warnings.map((message) => ({ type: "structured_warning", severity: "warning", message: String(message) })),
      ...errors.map((message) => ({ type: "structured_error", severity: "error", message: String(message) })),
    ],
    linked_profiles: [],
    admin_status: needsReview ? "needs_more_research" : "pending_review",
    updated_at: new Date().toISOString(),
  };
}

async function sendDraftToReviewQueue(req, res, supabase) {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing admin draft record id" });

  const { data: row, error: rowError } = await supabase
    .from("admin_draft_records")
    .select("*")
    .eq("id", id)
    .single();

  if (rowError) throw new Error(rowError.message);
  if (!row) return res.status(404).json({ error: "Admin draft record not found" });

  if (row.workspace !== "hsv") {
    return res.status(400).json({ error: "Only HSV structured drafts can be sent to the review queue right now." });
  }

  if (row.draft_type !== "hsv_issue_card") {
    return res.status(400).json({ error: `Draft type ${row.draft_type} is not review-queue enabled yet.` });
  }

  const reviewDraft = structuredIssuePayloadToReviewDraft(row);

  const { data: inserted, error: insertError } = await supabase
    .from("issue_card_drafts")
    .insert(reviewDraft)
    .select("*")
    .single();

  if (insertError) throw new Error(insertError.message);

  await supabase
    .from("admin_draft_records")
    .update({ status: "sent_to_review", needs_review: false })
    .eq("id", id);

  return res.status(200).json({
    success: true,
    type: "issue",
    review_draft: inserted,
    message: "Structured draft was sent to Review Content.",
  });
}

export default async function handler(req, res) {
  const auth = requireAdminApiKey(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase service role configuration" });

  const action = req.query.action || req.body?.action || "";

  try {
    if (req.method === "GET" && action === "dashboard") return dashboard(req, res, supabase);
    if (req.method === "GET" && action === "budget-status") return dashboard(req, res, supabase);
    if (req.method === "POST" && action === "generate-social-drafts") return generateSocialDrafts(req, res, supabase);
    if (req.method === "POST" && action === "update-social-draft") return updateSocialDraft(req, res, supabase);
    if (req.method === "POST" && action === "hashtag-scout") return hashtagScout(req, res, supabase);
    if (req.method === "POST" && action === "ai-task") return aiTask(req, res, supabase);
    if (req.method === "POST" && action === "send-draft-to-review") return sendDraftToReviewQueue(req, res, supabase);

    return res.status(400).json({ error: "Missing or invalid admin-tools action" });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Admin tools request failed" });
  }
}
