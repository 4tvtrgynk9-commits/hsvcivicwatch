import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://idtzqminkklydbuooilk.supabase.co";
const supabaseKey = String(process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();

if (!supabaseKey) {
  console.warn("Missing REACT_APP_SUPABASE_ANON_KEY. Supabase requests may fail.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true,
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
