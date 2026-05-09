import { getSupabaseAdminClient } from "../api-shared/supabaseAdmin.js";
import { requireAdminApiKey } from "../api-shared/authGuard.js";
import { getCurrentMonthSpend } from "../api-shared/aiBudget.js";
import { MONTHLY_AI_BUDGET_USD } from "../api-shared/aiConfig.js";

export default async function handler(req, res) {
  const auth = requireAdminApiKey(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase service role configuration" });

  try {
    const [budget, drafts, social, hashtags, polls] = await Promise.all([
      getCurrentMonthSpend(supabase),
      supabase
        .from("admin_draft_records")
        .select("id, workspace, draft_type, status, title, readiness_score_50, primary_score_50, public_score_10, needs_review, validation_result, score_bundle, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("social_card_queue")
        .select("id, workspace, category, source_record_type, source_ref, status, scheduled_for, posted_at, visual_style, platform_captions, hashtags, share_payload, created_at")
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
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Dashboard fetch failed" });
  }
}
