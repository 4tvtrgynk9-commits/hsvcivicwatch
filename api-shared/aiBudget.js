import { MONTHLY_AI_BUDGET_USD, estimateCostUsd } from "./aiConfig.js";

export function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export async function getCurrentMonthSpend(supabase) {
  const key = monthKey();
  if (!supabase) return { estimated_spend_usd: 0, month_key: key };

  const { data, error } = await supabase
    .from("ai_usage_logs")
    .select("estimated_cost_usd")
    .eq("month_key", key);

  if (error) throw new Error(error.message);

  const estimated_spend_usd = (data || []).reduce(
    (sum, row) => sum + Number(row.estimated_cost_usd || 0),
    0
  );

  return { estimated_spend_usd, month_key: key };
}

export async function assertBudgetAvailable({ supabase, route, modelKey, estimatedInputTokens, estimatedOutputTokens }) {
  const current = await getCurrentMonthSpend(supabase);
  const estimatedTaskCost = estimateCostUsd({
    modelKey,
    inputTokens: estimatedInputTokens,
    outputTokens: estimatedOutputTokens,
  });

  if (estimatedTaskCost > Number(route.max_task_cost_usd || 999)) {
    return { ok: false, status: 402, error: `Estimated task cost $${estimatedTaskCost.toFixed(4)} exceeds route cap $${route.max_task_cost_usd}.` };
  }

  if (current.estimated_spend_usd + estimatedTaskCost > MONTHLY_AI_BUDGET_USD) {
    return { ok: false, status: 402, error: `Monthly AI cap exceeded. Current $${current.estimated_spend_usd.toFixed(4)} + task $${estimatedTaskCost.toFixed(4)} > cap $${MONTHLY_AI_BUDGET_USD}.` };
  }

  return { ok: true, current, estimatedTaskCost };
}

export async function logAiUsage({ supabase, workspace, jobType, routeTier, provider, model, modelKey, requestName, inputTokens, outputTokens, estimatedCostUsd, status, errorMessage, metadata }) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("ai_usage_logs")
    .insert({
      month_key: monthKey(),
      workspace: workspace || null,
      job_type: jobType || null,
      route_tier: routeTier || null,
      provider: provider || null,
      model: model || null,
      model_key: modelKey || null,
      request_name: requestName || null,
      input_tokens: Number(inputTokens || 0),
      output_tokens: Number(outputTokens || 0),
      estimated_cost_usd: Number(estimatedCostUsd || 0),
      status: status || "unknown",
      error_message: errorMessage || null,
      metadata: metadata || {},
    })
    .select("*")
    .single();

  if (error) {
    console.error("AI usage log failed:", error.message);
    return null;
  }
  return data;
}
