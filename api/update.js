import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "./_adminAuth";

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

const DIRECT_TABLES = {
  official_profiles: [
    "name",
    "office",
    "level",
    "kind",
    "geography",
    "party",
    "status_line",
    "decoder",
  ],
};

const ISSUE_CARD_FIELDS = [
  "module",
  "tab",
  "tabs",
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
  if (cleaned.tabs !== undefined) {
    cleaned.tabs = Array.isArray(cleaned.tabs)
      ? Array.from(new Set(cleaned.tabs.map(v => String(v).trim()).filter(Boolean)))
      : [];
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

function sanitizeDirectTablePayload(table, payload) {
  const allowed = DIRECT_TABLES[table] || [];
  const cleaned = {};

  for (const key of allowed) {
    if (payload[key] !== undefined) cleaned[key] = payload[key];
  }

  ["name", "office", "level", "kind", "geography", "party", "status_line"].forEach((key) => {
    if (cleaned[key] !== undefined) {
      cleaned[key] = cleaned[key] ? String(cleaned[key]).trim() : "";
    }
  });

  if (cleaned.decoder !== undefined && cleaned.decoder && typeof cleaned.decoder === "object") {
    cleaned.decoder = {
      rise: cleaned.decoder.rise || "",
      affiliations: cleaned.decoder.affiliations || "",
      beneficiaries: cleaned.decoder.beneficiaries || "",
      track_record: cleaned.decoder.track_record || "",
    };
  }

  return cleaned;
}


function getPrefix(moduleName) {
  const key = String(moduleName || "").trim().toLowerCase();
  const MAP = {
    equity: "EQ",
    health: "HS",
    utilities: "UT",
    housing_crisis: "HO",
    criminal_justice: "CJ",
    workers_childcare: "WK",
    taxation: "TX",
    officials_elections: "OF",
    boards_oversight: "BO",
    voting_rights: "VT",
    policing: "PO",
    data_collection: "DA",
    insurance_burdens: "IN",
    money: "MO",
    landuse: "LA",
    environment: "EN",
    information_warfare: "IW",
    proposals: "PR",
    action: "AC",
  };
  return MAP[key] || "XX";
}

async function generateRefNumber(supabase, moduleName, type) {
  const prefix = getPrefix(moduleName);
  const table = type === "issue" ? "issue_cards" : "stat_blocks";
  const suffix = type === "issue" ? "IC" : "SB";
  const { data, error } = await supabase
    .from(table)
    .select("ref_number")
    .like("ref_number", `${prefix}-${suffix}-%`);

  if (error) throw new Error(error.message);

  let maxNum = 0;
  for (const row of data || []) {
    const m = String(row.ref_number || "").match(new RegExp(`^${prefix}-${suffix}-(\\d+)$`));
    if (m) maxNum = Math.max(maxNum, Number(m[1]));
  }
  return `${prefix}-${suffix}-${maxNum + 1}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const supabase = getClient();
  if (!supabase) {
    return json(res, 500, {
      error: "Missing Supabase service role configuration",
    });
  }

  try {
    const { itemType, id, updates, table, fields } = req.body || {};

    if (table) {
      if (!DIRECT_TABLES[table]) {
        return json(res, 400, { error: "Invalid table" });
      }

      if (!id) {
        return json(res, 400, { error: "Missing id" });
      }

      if (!fields || typeof fields !== "object") {
        return json(res, 400, { error: "Missing fields payload" });
      }

      const cleaned = sanitizeDirectTablePayload(table, fields);
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
        table,
        item: data,
      });
    }

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

    if (itemType === "issue_card") {
      const { data: existing, error: existingError } = await supabase
        .from("issue_cards")
        .select("*")
        .eq("id", id)
        .single();

      if (existingError || !existing) {
        return json(res, 500, { error: existingError?.message || "Issue card not found" });
      }

      const nextModule = cleaned.module || existing.module;
      const baseTabs = Array.isArray(cleaned.tabs)
        ? cleaned.tabs
        : (Array.isArray(existing.tabs) && existing.tabs.length
            ? existing.tabs
            : (existing.tab ? [existing.tab] : ["overview"]));
      const nextPrimaryTab = cleaned.tab || baseTabs[0] || existing.tab || "overview";
      const nextTabs = Array.from(new Set([...(baseTabs || []), nextPrimaryTab])).filter(Boolean);
      const moduleChanged = nextModule !== existing.module;

      cleaned.tab = nextPrimaryTab;
      cleaned.tabs = nextTabs.length ? nextTabs : ["overview"];

      if (moduleChanged) {
        cleaned.ref_number = await generateRefNumber(supabase, nextModule, "issue");
      }

      const { data: updatedIssue, error: issueError } = await supabase
        .from("issue_cards")
        .update(cleaned)
        .eq("id", id)
        .select("*")
        .single();

      if (issueError) {
        return json(res, 500, { error: issueError.message });
      }

      const oldIssueRef = existing.ref_number;
      const newIssueRef = updatedIssue.ref_number;

      const { data: linkedStats, error: linkedStatsError } = await supabase
        .from("stat_blocks")
        .select("*")
        .eq("issue_card_ref", oldIssueRef);

      if (linkedStatsError) {
        return json(res, 500, { error: linkedStatsError.message });
      }

      for (const stat of linkedStats || []) {
        const statPatch = {
          module: nextModule,
          tab: nextPrimaryTab,
          issue_card_ref: newIssueRef,
        };

        const nextData = {
          ...(stat.data || {}),
          module: nextModule,
          tab: nextPrimaryTab,
          tabs: cleaned.tabs,
          issue_card_ref: newIssueRef,
        };

        statPatch.data = nextData;

        if (moduleChanged) {
          statPatch.ref_number = await generateRefNumber(supabase, nextModule, "stat");
        }

        const { error: statUpdateError } = await supabase
          .from("stat_blocks")
          .update(statPatch)
          .eq("id", stat.id);

        if (statUpdateError) {
          return json(res, 500, { error: statUpdateError.message });
        }
      }

      const { data: refreshedStats } = await supabase
        .from("stat_blocks")
        .select("*")
        .eq("issue_card_ref", newIssueRef)
        .order("strength_score", { ascending: false });

      return json(res, 200, {
        success: true,
        itemType,
        item: updatedIssue,
        cascaded_stats: refreshedStats || [],
      });
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
