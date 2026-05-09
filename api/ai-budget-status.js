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
    const current = await getCurrentMonthSpend(supabase);
    const { data: logs, error } = await supabase.from("ai_usage_logs").select("*").eq("month_key", current.month_key).order("created_at", { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    return res.status(200).json({ month_key: current.month_key, monthly_budget_usd: MONTHLY_AI_BUDGET_USD, estimated_spend_usd: Number(current.estimated_spend_usd.toFixed(6)), remaining_usd: Number(Math.max(0, MONTHLY_AI_BUDGET_USD - current.estimated_spend_usd).toFixed(6)), gateway_enabled: process.env.ENABLE_AI_GATEWAY === "true", logs: logs || [] });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Budget status failed" });
  }
}
