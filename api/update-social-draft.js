import { getSupabaseAdminClient } from "../api-shared/supabaseAdmin.js";
import { requireAdminApiKey } from "../api-shared/authGuard.js";

const ALLOWED_STATUS = new Set(["queued", "generated", "needs_edit", "approved", "posted", "skipped"]);

export default async function handler(req, res) {
  const auth = requireAdminApiKey(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase service role configuration" });

  const { id, status, platform_captions, hashtags, admin_notes, selected_variant } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing social draft id" });

  const patch = { updated_at: new Date().toISOString() };
  if (status) {
    if (!ALLOWED_STATUS.has(status)) return res.status(400).json({ error: "Invalid status" });
    patch.status = status;
    if (status === "posted") patch.posted_at = new Date().toISOString();
  }
  if (platform_captions) patch.platform_captions = platform_captions;
  if (hashtags) patch.hashtags = hashtags;
  if (admin_notes !== undefined) patch.admin_notes = admin_notes;
  if (selected_variant !== undefined) patch.selected_variant = selected_variant;

  const { data, error } = await supabase
    .from("social_card_queue")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, social_draft: data });
}
