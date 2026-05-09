import { AI_JOB_ROUTES, AI_PRICING, envFlagEnabled, estimateCostUsd, roughTokenEstimate } from "./aiConfig.js";
import { assertBudgetAvailable, logAiUsage } from "./aiBudget.js";

function providerHasKey(provider) {
  if (provider === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === "gemini") return Boolean(process.env.GEMINI_API_KEY);
  if (provider === "deepseek") return Boolean(process.env.DEEPSEEK_API_KEY);
  return false;
}

function pickModelKey(route) {
  const primary = AI_PRICING[route.primary];
  if (primary && providerHasKey(primary.provider)) return route.primary;
  const fallback = AI_PRICING[route.fallback];
  if (fallback && providerHasKey(fallback.provider)) return route.fallback;
  return route.primary;
}

async function callAnthropic({ model, system, prompt, maxTokens }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: system || "",
      messages: [{ role: "user", content: prompt || "" }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  return {
    text: (data.content || []).map((b) => b.text || "").join("").trim(),
    raw: data,
    inputTokens: data?.usage?.input_tokens || 0,
    outputTokens: data?.usage?.output_tokens || 0,
  };
}

async function callGemini({ model, system, prompt, maxTokens }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents: [{ role: "user", parts: [{ text: prompt || "" }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.1 },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Gemini request failed");
  return {
    text: (data.candidates || []).flatMap((c) => c.content?.parts || []).map((p) => p.text || "").join("").trim(),
    raw: data,
    inputTokens: data?.usageMetadata?.promptTokenCount || 0,
    outputTokens: data?.usageMetadata?.candidatesTokenCount || 0,
  };
}

async function callDeepSeek({ model, system, prompt, maxTokens }) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.1,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt || "" },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "DeepSeek request failed");
  return {
    text: data?.choices?.[0]?.message?.content?.trim() || "",
    raw: data,
    inputTokens: data?.usage?.prompt_tokens || 0,
    outputTokens: data?.usage?.completion_tokens || 0,
  };
}

async function callProvider({ pricing, system, prompt, maxTokens }) {
  if (pricing.provider === "anthropic") return callAnthropic({ model: pricing.model, system, prompt, maxTokens });
  if (pricing.provider === "gemini") return callGemini({ model: pricing.model, system, prompt, maxTokens });
  if (pricing.provider === "deepseek") return callDeepSeek({ model: pricing.model, system, prompt, maxTokens });
  throw new Error(`Unsupported provider: ${pricing.provider}`);
}

export async function runAiTask({ supabase, workspace, jobType, requestName, system, prompt, maxTokens = 800, estimatedOutputTokens, metadata }) {
  if (process.env.ENABLE_AI_GATEWAY !== "true") {
    return { ok: false, status: 403, error: "AI gateway is wired but disabled. Set ENABLE_AI_GATEWAY=true to allow model calls." };
  }

  const route = AI_JOB_ROUTES[jobType];
  if (!route) return { ok: false, status: 400, error: `Unknown AI job type: ${jobType}` };
  if (!envFlagEnabled(route.enabled_flag)) return { ok: false, status: 403, error: `AI job type ${jobType} is disabled by ${route.enabled_flag}.` };

  const modelKey = pickModelKey(route);
  const pricing = AI_PRICING[modelKey];
  if (!pricing) return { ok: false, status: 500, error: `Missing pricing for ${modelKey}` };
  if (!providerHasKey(pricing.provider)) return { ok: false, status: 500, error: `Missing API key for ${pricing.provider}` };

  const estimatedInputTokens = roughTokenEstimate(`${system || ""}\n${prompt || ""}`);
  const estimatedOut = estimatedOutputTokens || maxTokens || 800;
  const budget = await assertBudgetAvailable({ supabase, route, modelKey, estimatedInputTokens, estimatedOutputTokens: estimatedOut });
  if (!budget.ok) return budget;

  try {
    const result = await callProvider({ pricing, system, prompt, maxTokens });
    const actualCost = estimateCostUsd({ modelKey, inputTokens: result.inputTokens, outputTokens: result.outputTokens });
    await logAiUsage({
      supabase, workspace, jobType, routeTier: route.tier, provider: pricing.provider, model: pricing.model,
      modelKey, requestName, inputTokens: result.inputTokens, outputTokens: result.outputTokens,
      estimatedCostUsd: actualCost || budget.estimatedTaskCost, status: "success", metadata,
    });
    return { ok: true, status: 200, text: result.text, provider: pricing.provider, model: pricing.model, modelKey, inputTokens: result.inputTokens, outputTokens: result.outputTokens, estimatedCostUsd: actualCost || budget.estimatedTaskCost };
  } catch (error) {
    await logAiUsage({ supabase, workspace, jobType, routeTier: route.tier, provider: pricing.provider, model: pricing.model, modelKey, requestName, inputTokens: estimatedInputTokens, outputTokens: 0, estimatedCostUsd: 0, status: "error", errorMessage: error?.message || "AI request failed", metadata });
    return { ok: false, status: 500, error: error?.message || "AI request failed" };
  }
}
