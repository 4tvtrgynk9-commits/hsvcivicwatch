import { getSupabaseAdminClient } from "../api-shared/supabaseAdmin.js";
import { requireAdminApiKey } from "../api-shared/authGuard.js";
import { runAiTask } from "../api-shared/aiGateway.js";

export default async function handler(req, res) {
  const auth = requireAdminApiKey(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(500).json({ error: "Missing Supabase service role configuration" });
  const { workspace, jobType, requestName, system, prompt, maxTokens, metadata } = req.body || {};
  if (!workspace || !jobType || !prompt) return res.status(400).json({ error: "Missing workspace, jobType, or prompt" });
  const result = await runAiTask({ supabase, workspace, jobType, requestName, system, prompt, maxTokens, metadata });
  return res.status(result.status || (result.ok ? 200 : 500)).json(result);
}
