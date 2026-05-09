import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://idtzqminkklydbuooilk.supabase.co";

export function normalizeSupabaseKey(value) {
  return String(value || "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

export function getSupabaseAnonKey() {
  return normalizeSupabaseKey(process.env.REACT_APP_SUPABASE_ANON_KEY || "");
}

export function isBlockedFrontendKey(value) {
  const key = normalizeSupabaseKey(value);
  if (!key) return true;

  // Never allow secret/service-role style keys in frontend.
  if (key.startsWith("sb_secret_")) return true;
  if (/service[_-]?role/i.test(key)) return true;

  return false;
}

export const supabaseAnonKey = getSupabaseAnonKey();

let supabaseClient = null;
let supabaseClientInitError = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!supabaseAnonKey) {
    supabaseClientInitError =
      "Frontend Supabase anon/publishable key is missing. Set REACT_APP_SUPABASE_ANON_KEY in Vercel.";
    throw new Error(supabaseClientInitError);
  }

  if (isBlockedFrontendKey(supabaseAnonKey)) {
    supabaseClientInitError =
      "Supabase anon/publishable key is missing or unsafe. Check REACT_APP_SUPABASE_ANON_KEY in Vercel.";
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
    const message = String(error?.message || error || "");
    supabaseClientInitError = /Invalid API key/i.test(message)
      ? "Supabase anon/publishable key is invalid. Check REACT_APP_SUPABASE_ANON_KEY and SUPABASE_ANON_KEY in Vercel."
      : "Frontend Supabase client failed to initialize. Check REACT_APP_SUPABASE_ANON_KEY in Vercel.";
    throw new Error(supabaseClientInitError);
  }
}

export function getSupabaseClientInitError() {
  return supabaseClientInitError;
}

export const supabase = getSupabaseClient();
