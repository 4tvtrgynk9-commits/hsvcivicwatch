import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../api-shared/adminAuth";

const ANTHROPIC_API_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-20250514";

const BRIEF_SYSTEM = `You are an investigative policy researcher for HSV Civic Watch covering Huntsville Alabama and the surrounding metro area. You have been given a specific policy idea. Research it thoroughly using web search. Find local Huntsville data, find what other cities have implemented, find costs and outcomes. Generate a complete Blueprint as JSON: { title, tab, the_problem, current_reality, the_ask, who_decides, other_cities, estimated_cost, roi, sources: [{label, url}], actions: { intro, contacts: [{name, role, phone, email, officialLink}], meetings: [{title, frequency, location, why, link}], paths: [{destination, type, why, link}], actions: [{label, kind, href}] }, shock_factor, module_relevance }. tab must be one of: economic_justice, housing_infrastructure, public_safety, governance. Return ONLY valid JSON.`;

const TEMPLATE_SYSTEM = `Parse this Blueprint research template into JSON: { title, tab, the_problem, current_reality, the_ask, who_decides, other_cities, estimated_cost, roi, sources: [{label, url}], actions: { intro, contacts, meetings, paths, actions }, shock_factor, module_relevance }. tab must be one of: economic_justice, housing_infrastructure, public_safety, governance. Return ONLY valid JSON.`;

function json(res, status, body) {
  res.status(status).json(body);
}

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function anthropicFetch(system, userContent, maxTokens = 16000, { enableWebSearch = false } = {}) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userContent }],
  };

  if (enableWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_API_VERSION,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  return (data.content || [])
    .filter((item) => item?.type === "text")
    .map((item) => item.text || "")
    .join("");
}

function parseJSON(text) {
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function clampScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(10, Math.round(num)));
}

function computeHomepageScore(shock, moduleRelevance) {
  const raw = (clampScore(shock) * 0.7) + (5 * 0.2) + (clampScore(moduleRelevance) * 0.1);
  return clampScore(raw);
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBlueprint(rawBlueprint, researchBrief) {
  const blueprint = rawBlueprint && typeof rawBlueprint === "object" ? rawBlueprint : {};
  const allowedTabs = new Set(["economic_justice", "housing_infrastructure", "public_safety", "governance"]);
  const tab = cleanString(blueprint.tab);

  return {
    title: cleanString(blueprint.title),
    tab: allowedTabs.has(tab) ? tab : "governance",
    the_problem: cleanString(blueprint.the_problem),
    current_reality: cleanString(blueprint.current_reality),
    the_ask: cleanString(blueprint.the_ask),
    who_decides: cleanString(blueprint.who_decides),
    other_cities: cleanString(blueprint.other_cities),
    estimated_cost: cleanString(blueprint.estimated_cost),
    roi: cleanString(blueprint.roi),
    sources: asArray(blueprint.sources).map((item) => ({
      label: cleanString(item?.label),
      url: cleanString(item?.url),
    })).filter((item) => item.label && item.url),
    actions: {
      intro: cleanString(blueprint.actions?.intro),
      contacts: asArray(blueprint.actions?.contacts).map((item) => ({
        name: cleanString(item?.name),
        role: cleanString(item?.role),
        phone: cleanString(item?.phone),
        email: cleanString(item?.email),
        officialLink: cleanString(item?.officialLink),
      })).filter((item) => item.name || item.role || item.phone || item.email || item.officialLink),
      meetings: asArray(blueprint.actions?.meetings).map((item) => ({
        title: cleanString(item?.title),
        frequency: cleanString(item?.frequency),
        location: cleanString(item?.location),
        why: cleanString(item?.why),
        link: cleanString(item?.link),
      })).filter((item) => item.title || item.frequency || item.location || item.why || item.link),
      paths: asArray(blueprint.actions?.paths).map((item) => ({
        destination: cleanString(item?.destination),
        type: cleanString(item?.type),
        why: cleanString(item?.why),
        link: cleanString(item?.link),
      })).filter((item) => item.destination || item.type || item.why || item.link),
      actions: asArray(blueprint.actions?.actions).map((item) => ({
        label: cleanString(item?.label),
        kind: cleanString(item?.kind),
        href: cleanString(item?.href),
      })).filter((item) => item.label || item.kind || item.href),
    },
    shock_factor: clampScore(blueprint.shock_factor),
    module_relevance: clampScore(blueprint.module_relevance),
    homepage_score: computeHomepageScore(blueprint.shock_factor, blueprint.module_relevance),
    research_brief: cleanString(researchBrief),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const supabase = getAdminClient();
  if (!supabase) {
    return json(res, 500, { error: "Missing Supabase service role configuration" });
  }

  try {
    const { input, inputMode = "brief", mode = "parse", blueprintId = null } = req.body || {};

    if (!cleanString(input)) {
      return json(res, 400, { error: "Missing input" });
    }

    if (!["brief", "template"].includes(inputMode)) {
      return json(res, 400, { error: "Invalid inputMode" });
    }

    if (!["parse", "publish"].includes(mode)) {
      return json(res, 400, { error: "Invalid mode" });
    }

    const parsedText = await anthropicFetch(
      inputMode === "brief" ? BRIEF_SYSTEM : TEMPLATE_SYSTEM,
      input,
      16000,
      { enableWebSearch: inputMode === "brief" }
    );

    const blueprint = normalizeBlueprint(parseJSON(parsedText), input);

    if (mode === "parse") {
      return json(res, 200, { success: true, blueprint });
    }

    if (blueprintId) {
      const { data, error } = await supabase
        .from("blueprints")
        .update(blueprint)
        .eq("id", blueprintId)
        .select()
        .single();

      if (error) throw error;
      return json(res, 200, { success: true, id: data.id, blueprint: data });
    }

    const { data, error } = await supabase
      .from("blueprints")
      .insert(blueprint)
      .select()
      .single();

    if (error) throw error;
    return json(res, 200, { success: true, id: data.id, blueprint: data });
  } catch (error) {
    console.error("parse-blueprint failed:", error);
    return json(res, 500, { error: "Parse failed: " + error.message });
  }
}
