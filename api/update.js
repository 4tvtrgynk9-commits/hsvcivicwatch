const { createClient } = require("@supabase/supabase-js");

const ALLOWED_FIELDS = [
  "title","label","summary","details","sources",
  "module","tab","shock_factor","module_relevance","visual_score",
  "decoder_what","decoder_connections","decoder_who_benefits","decoder_impact",
  "show_on_overview","homepage_score",
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id, updates } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing card id" });
  if (!updates || typeof updates !== "object") return res.status(400).json({ error: "Missing updates" });

  const safeUpdates = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in updates) safeUpdates[key] = updates[key];
  }
  if (!Object.keys(safeUpdates).length) return res.status(400).json({ error: "No valid fields" });

  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("issue_cards")
    .update(safeUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) { console.error(error); return res.status(500).json({ error: error.message }); }
  return res.status(200).json({ success: true, card: data });
};
