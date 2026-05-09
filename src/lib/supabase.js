import { createClient } from "@supabase/supabase-js";

const HSV_SUPABASE_URL = "https://idtzqminkklydbuooilk.supabase.co";

function cleanSupabaseUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) return HSV_SUPABASE_URL;

  const cleaned = raw
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/g, "");

  if (/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cleaned)) {
    return cleaned;
  }

  return HSV_SUPABASE_URL;
}

const supabaseUrl = cleanSupabaseUrl(process.env.REACT_APP_SUPABASE_URL);
const supabaseKey = String(process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();

if (!supabaseKey) {
  // Keep this visible for debugging without exposing secrets.
  console.warn("Missing REACT_APP_SUPABASE_ANON_KEY. Supabase requests may fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
