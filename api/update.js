import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

const TABLES = {
  issue_card: "issue_cards",
  stat_block: "stat_blocks",
};

const ISSUE_CARD_FIELDS = [
  "module",
  "tab",
  "label",
  "title",
  "summary",
  "homepage_teaser",
  "details",
  "decoder",
];

const STAT_BLOCK_FIELDS = [
  "module",
  "tab",
  "type",
  "color",
  "data",
];

function json(res, status, body) {
  res.status(status).json(body);
}

function getClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sanitizeIssueCardPayload(payload) {
  const cleaned = {};
  for (const key of ISSUE_CARD_FIELDS) {
    if (payload[key] !== undefined) cleaned[key] = payload[key];
  }

  if (cleaned.module !== undefined && typeof cleaned.module === "string") {
    cleaned.module = cleaned.module.trim();
  }
  if (cleaned.tab !== undefined) {
    cleaned.tab = cleaned.tab ? String(cleaned.tab).trim() : null;
  }
  if (cleaned.label !== undefined && typeof cleaned.label === "string") {
    cleaned.label = cleaned.label.trim();
  }
  if (cleaned.title !== undefined && typeof cleaned.title === "string") {
    cleaned.title = cleaned.title.trim();
  }
  if (cleaned.summary !== undefined && typeof cleaned.summary === "string") {
    cleaned.summary = cleaned.summary.trim();
  }
  if (cleaned.homepage_teaser !== undefined && typeof cleaned.homepage_teaser === "string") {
    cleaned.homepage_teaser = cleaned.homepage_teaser.trim();
  }
  if (cleaned.details !== undefined && typeof cleaned.details === "string") {
    cleaned.details = cleaned.details.trim();
  }
  if (cleaned.decoder !== undefined && cleaned.decoder && typeof cleaned.decoder === "object") {
    cleaned.decoder = {
      whatsHappening: cleaned.decoder.whatsHappening || "",
      connections: cleaned.decoder.connections || "",
      whoBenefits: cleaned.decoder.whoBenefits || "",
      impact: cleaned.decoder.impact || "",
    };
  }

  return cleaned;
}

function sanitizeStatBlockPayload(payload) {
  const cleaned = {};
  for (const key of STAT_BLOCK_FIELDS) {
    if (payload[key] !== undefined) cleaned[key] = payload[key];
  }

  if (cleaned.module !== undefined && typeof cleaned.module === "string") {
    cleaned.module = cleaned.module.trim();
  }
  if (cleaned.tab !== undefined) {
    cleaned.tab = cleaned.tab ? String(cleaned.tab).trim() : null;
  }
  if (cleaned.type !== undefined && typeof cleaned.type === "string") {
    cleaned.type = cleaned.type.trim();
  }
  if (cleaned.color !== undefined && typeof cleaned.color === "string") {
    cleaned.color = cleaned.color.trim();
  }
  if (cleaned.data !== undefined && (!cleaned.data || typeof cleaned.data !== "object")) {
    cleaned.data = {};
  }

  return cleaned;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const supabase = getClient();
  if (!supabase) {
    return json(res, 500, {
      error: "Missing Supabase service role configuration",
    });
  }

  try {
    const { itemType, id, updates } = req.body || {};

    if (!itemType || !TABLES[itemType]) {
      return json(res, 400, { error: "Invalid itemType" });
    }

    if (!id) {
      return json(res, 400, { error: "Missing id" });
    }

    if (!updates || typeof updates !== "object") {
      return json(res, 400, { error: "Missing updates payload" });
    }

    const table = TABLES[itemType];
    const cleaned =
      itemType === "issue_card"
        ? sanitizeIssueCardPayload(updates)
        : sanitizeStatBlockPayload(updates);

    if (!Object.keys(cleaned).length) {
      return json(res, 400, { error: "No editable fields provided" });
    }

    const { data, error } = await supabase
      .from(table)
      .update(cleaned)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return json(res, 500, { error: error.message });
    }

    return json(res, 200, {
      success: true,
      itemType,
      item: data,
    });
  } catch (error) {
    return json(res, 500, {
      error: error?.message || "Update failed",
    });
  }
}
