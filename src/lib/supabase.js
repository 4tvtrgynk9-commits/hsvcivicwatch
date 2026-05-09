import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://idtzqminkklydbuooilk.supabase.co";

export function getSupabaseAnonKey() {
  return (process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();
}

export const supabaseAnonKey = getSupabaseAnonKey();

let supabaseClient = null;
let supabaseClientInitError = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!supabaseAnonKey) {
    supabaseClientInitError =
      "Frontend Supabase anon key is missing. Set REACT_APP_SUPABASE_ANON_KEY in Vercel.";
    throw new Error(supabaseClientInitError);
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    return supabaseClient;
  } catch (error) {
    supabaseClientInitError =
      "Admin build is still using a bad Supabase client. Check deployed commit.";
    throw new Error(supabaseClientInitError);
  }
}

export function getSupabaseClientInitError() {
  return supabaseClientInitError;
}

export const supabase = getSupabaseClient();
