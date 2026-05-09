export const MONTHLY_AI_BUDGET_USD = Number(process.env.MAX_AI_MONTHLY_USD || 30);

export const AI_PRICING = {
  anthropic_sonnet: {
    provider: "anthropic",
    model: process.env.ANTHROPIC_STRONG_MODEL || "claude-sonnet-4-6",
    input_per_mtok: 3.0,
    output_per_mtok: 15.0,
  },
  anthropic_haiku: {
    provider: "anthropic",
    model: process.env.ANTHROPIC_MEDIUM_MODEL || "claude-haiku-4-5-20251001",
    input_per_mtok: 1.0,
    output_per_mtok: 5.0,
  },
  gemini_flash_lite: {
    provider: "gemini",
    model: process.env.GEMINI_CHEAP_MODEL || "gemini-2.5-flash-lite",
    input_per_mtok: 0.10,
    output_per_mtok: 0.40,
  },
  deepseek_v4_flash: {
    provider: "deepseek",
    model: process.env.DEEPSEEK_CHEAP_MODEL || "deepseek-v4-flash",
    input_per_mtok: 0.14,
    output_per_mtok: 0.28,
  },
};

export const AI_JOB_ROUTES = {
  database_clerk: {
    tier: "cheap",
    primary: "gemini_flash_lite",
    fallback: "deepseek_v4_flash",
    max_task_cost_usd: 0.05,
    enabled_flag: "ENABLE_CHEAP_CLERK_MODEL",
  },
  schema_normalizer: {
    tier: "cheap",
    primary: "gemini_flash_lite",
    fallback: "deepseek_v4_flash",
    max_task_cost_usd: 0.05,
    enabled_flag: "ENABLE_CHEAP_CLERK_MODEL",
  },
  medium_review: {
    tier: "medium",
    primary: "anthropic_haiku",
    fallback: "gemini_flash_lite",
    max_task_cost_usd: 0.25,
    enabled_flag: "ENABLE_AI_GATEWAY",
  },
  risk_review: {
    tier: "strong",
    primary: "anthropic_sonnet",
    fallback: "anthropic_haiku",
    max_task_cost_usd: 0.75,
    enabled_flag: "ENABLE_CLAUDE_RISK_REVIEW",
  },
  estimate_review: {
    tier: "strong",
    primary: "anthropic_sonnet",
    fallback: "anthropic_haiku",
    max_task_cost_usd: 0.75,
    enabled_flag: "ENABLE_CLAUDE_RISK_REVIEW",
  },
  missing_field_research: {
    tier: "strong_manual",
    primary: "anthropic_sonnet",
    fallback: "anthropic_haiku",
    max_task_cost_usd: 1.25,
    enabled_flag: "ENABLE_AI_MISSING_FIELD_RESEARCH",
  },
  social_generation: {
    tier: "manual",
    primary: "anthropic_haiku",
    fallback: "gemini_flash_lite",
    max_task_cost_usd: 0.40,
    enabled_flag: "ENABLE_AI_SOCIAL_GENERATION",
  },
};

export function estimateCostUsd({ modelKey, inputTokens = 0, outputTokens = 0 }) {
  const pricing = AI_PRICING[modelKey];
  if (!pricing) return 0;
  return (Number(inputTokens || 0) / 1_000_000) * pricing.input_per_mtok +
    (Number(outputTokens || 0) / 1_000_000) * pricing.output_per_mtok;
}

export function roughTokenEstimate(text) {
  return Math.ceil(String(text || "").length / 3.5);
}

export function envFlagEnabled(flagName) {
  if (!flagName) return true;
  return String(process.env[flagName] || "").toLowerCase() === "true";
}
