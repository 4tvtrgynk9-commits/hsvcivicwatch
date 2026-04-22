import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "./_adminAuth";

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

function clampScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(10, Math.round(num)));
}

function computeHomepageScore(shock, recencyBoost, moduleRelevance) {
  const raw = (clampScore(shock) * 0.7) + (clampScore(recencyBoost) * 0.2) + (clampScore(moduleRelevance) * 0.1);
  return clampScore(raw);
}

function getRecencyBoost(createdAt) {
  const timestamp = Date.parse(createdAt || "");
  if (!Number.isFinite(timestamp)) return 1;
  const periods = Math.floor((Date.now() - timestamp) / (30 * 24 * 60 * 60 * 1000));
  return Math.max(1, 10 - periods);
}

async function flagStaleProfiles(supabase, tableName, cutoffIso, errors) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("id")
      .eq("status", "active")
      .lt("updated_at", cutoffIso);

    if (error) throw error;
    if (!data?.length) return 0;

    const ids = data.map((row) => row.id).filter(Boolean);
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ flagged_stale: true })
      .in("id", ids);

    if (updateError) throw updateError;
    return ids.length;
  } catch (error) {
    console.error(`Stale flagging failed for ${tableName}:`, error);
    errors.push(`${tableName}: ${error.message}`);
    return 0;
  }
}

export default async function handler(req, res) {
  const supabase = getAdminClient();
  if (!supabase) {
    return json(res, 500, { error: "Missing Supabase service role configuration" });
  }

  if (req.method === "GET") {
    const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
    if (!process.env.CRON_SECRET || req.headers.authorization !== expected) {
      return json(res, 401, { error: "Unauthorized" });
    }
  } else if (req.method === "POST") {
    if (!(await requireAdmin(req, res))) return;
  } else {
    return json(res, 405, { error: "Method not allowed" });
  }

  const errors = [];
  let graduated = 0;
  let stale_flagged = 0;
  let rescored = 0;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const cutoffIso = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)).toISOString();

    const { data: candidates, error: candidatesError } = await supabase
      .from("official_profiles")
      .select("id")
      .eq("status", "candidate")
      .not("election_date", "is", null)
      .lt("election_date", today);

    if (candidatesError) {
      errors.push(`official_profiles graduation: ${candidatesError.message}`);
    } else if (candidates?.length) {
      const ids = candidates.map((row) => row.id).filter(Boolean);
      const { error: updateError } = await supabase
        .from("official_profiles")
        .update({ status: "needs_review" })
        .in("id", ids);

      if (updateError) errors.push(`official_profiles graduation update: ${updateError.message}`);
      else graduated = ids.length;
    }

    stale_flagged += await flagStaleProfiles(supabase, "official_profiles", cutoffIso, errors);
    stale_flagged += await flagStaleProfiles(supabase, "board_profiles", cutoffIso, errors);
    stale_flagged += await flagStaleProfiles(supabase, "school_profiles", cutoffIso, errors);

    let from = 0;
    const pageSize = 50;

    while (true) {
      const { data: rows, error } = await supabase
        .from("issue_cards")
        .select("id, created_at, shock_factor, shock_score, module_relevance, module_relevance_score")
        .range(from, from + pageSize - 1)
        .order("created_at", { ascending: true });

      if (error) {
        errors.push(`issue_cards rescore: ${error.message}`);
        break;
      }

      if (!rows?.length) break;

      for (const row of rows) {
        const recencyBoost = getRecencyBoost(row.created_at);
        const homepage_score = computeHomepageScore(
          row.shock_factor ?? row.shock_score,
          recencyBoost,
          row.module_relevance ?? row.module_relevance_score
        );

        const { error: updateError } = await supabase
          .from("issue_cards")
          .update({ homepage_score })
          .eq("id", row.id);

        if (updateError) {
          errors.push(`issue_cards ${row.id}: ${updateError.message}`);
        } else {
          rescored += 1;
        }
      }

      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return json(res, 200, { graduated, stale_flagged, rescored, errors });
  } catch (error) {
    console.error("cron-weekly failed:", error);
    errors.push(error.message);
    return json(res, 500, { graduated, stale_flagged, rescored, errors });
  }
}
