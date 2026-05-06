const { createClient } = require("@supabase/supabase-js");

const ALLOWED_FIELDS = [
  "module",
  "tab",
  "type",
  "color",
  "value",
  "label",
  "sublabel",
  "strength_score",
  "show_on_overview",
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, updates } = req.body || {};
    if (!id) return res.status(400).json({ error: "Missing stat block id" });
    if (!updates || typeof updates !== "object") return res.status(400).json({ error: "Missing updates" });

    const safeUpdates = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in updates) safeUpdates[key] = updates[key];
    }
    if (!Object.keys(safeUpdates).length) return res.status(400).json({ error: "No valid fields" });

    const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase service configuration");

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("stat_blocks")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ success: true, statBlock: data });
  } catch (error) {
    console.error("update stat block error:", error);
    return res.status(500).json({ error: error.message || "Update failed" });
  }
};
