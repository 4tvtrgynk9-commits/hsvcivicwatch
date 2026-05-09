const { createClient } = require("@supabase/supabase-js");

function recencyBoost(createdAt) {
  const created = createdAt ? new Date(createdAt).getTime() : 0;
  if (!created || Number.isNaN(created)) return 1;
  const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  if (ageDays <= 7) return 10;
  if (ageDays <= 30) return 7;
  if (ageDays <= 90) return 4;
  return 1;
}

function scoreCard(card) {
  const shock = Number(card.shock_factor) || 0;
  const relevance = Number(card.module_relevance) || 0;
  const raw = (shock * 0.70) + (recencyBoost(card.created_at) * 0.20) + (relevance * 0.10);
  return Math.round(Math.max(1, Math.min(10, raw)) * 100) / 100;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase service configuration");

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: allCards, error: fetchError } = await supabase
      .from("issue_cards")
      .select("id, shock_factor, module_relevance, created_at");
    if (fetchError) throw fetchError;

    await Promise.all((allCards || []).map(async (card) => {
      const { error } = await supabase
        .from("issue_cards")
        .update({ homepage_score: scoreCard(card) })
        .eq("id", card.id);
      if (error) throw error;
    }));

    return res.status(200).json({
      success: true,
      updatedCount: (allCards || []).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("rerank error:", error);
    return res.status(500).json({ error: error.message || "Re-rank failed" });
  }
};
