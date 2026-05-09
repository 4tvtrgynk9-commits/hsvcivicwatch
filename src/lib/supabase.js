import { createClient } from "@supabase/supabase-js";

const HSV_SUPABASE_URL = "https://idtzqminkklydbuooilk.supabase.co";

function isValidSupabaseProjectUrl(value) {
  if (!value || typeof value !== "string") return false;

  const trimmed = value.trim();

  if (!trimmed) return false;
  if (trimmed.includes("/rest/v1")) return false;
  if (trimmed.includes("supabase.com/dashboard")) return false;
  if (trimmed.startsWith("eyJ")) return false;

  try {
    const url = new URL(trimmed);

    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (!url.hostname.endsWith(".supabase.co")) return false;

    return true;
  } catch {
    return false;
  }
}

export function resolveSupabaseUrl(rawUrl) {
  return isValidSupabaseProjectUrl(rawUrl) ? rawUrl.trim() : HSV_SUPABASE_URL;
}

export function getSupabaseAnonKey() {
  return (
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();
}

export const supabaseUrl = resolveSupabaseUrl(
  process.env.REACT_APP_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL
);

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
      "Frontend Supabase client failed to initialize. Check the public anon key configuration.";
    throw new Error(supabaseClientInitError);
  }
}

export function getSupabaseClientInitError() {
  return supabaseClientInitError;
}

export const supabase = getSupabaseClient();
