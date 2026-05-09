import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../api-shared/adminAuth";

function getAdminClient() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const supabase = getAdminClient();
  if (!supabase) {
    return res.status(500).json({ error: "Missing Supabase service role configuration" });
  }

  const { data, error } = await supabase
    .from("seats")
    .select("id, title, body, level, county")
    .order("level", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ seats: data || [] });
}
