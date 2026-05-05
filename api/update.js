const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ISSUE_FIELDS = [
  "label","title","summary","details","sources","tab","module",
  "decoder_what","decoder_connections","decoder_who_benefits","decoder_impact",
  "actions","visual_config","visual_score","shock_factor",
  "module_relevance","homepage_score","show_on_overview",
];

const STAT_FIELDS = [
  "label","title","value","unit","context","color","type",
  "module","tab","strength_score","issue_card_ref",
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { itemType, id, updates } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing id" });
  if (!updates || typeof updates !== "object") return res.status(400).json({ error: "Missing updates" });

  const allowedFields = itemType === "stat_block" ? STAT_FIELDS : ISSUE_FIELDS;
  const safeUpdates = {};
  for (const key of allowedFields) {
    if (key in updates) safeUpdates[key] = updates[key];
  }
  if (!Object.keys(safeUpdates).length) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const table = itemType === "stat_block" ? "stat_blocks" : "issue_cards";

  const { data, error } = await supabase
    .from(table)
    .update(safeUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  let cascaded_stats = [];
  if (itemType === "issue_card" && data.ref_number) {
    const { data: linked } = await supabase
      .from("stat_blocks")
      .select("*")
      .eq("issue_card_ref", data.ref_number);
    cascaded_stats = linked || [];
  }

  return res.status(200).json({ item: data, cascaded_stats });
};
