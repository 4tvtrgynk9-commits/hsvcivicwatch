import { createClient } from "@supabase/supabase-js";

const DEFAULT_ADMIN_EMAIL = "howardjt1234@gmail.com";

function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    ""
  );
}

function getSupabaseAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    ""
  );
}

function getAdminEmail() {
  return (
    process.env.ADMIN_AUTH_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.REACT_APP_ADMIN_AUTH_EMAIL ||
    process.env.REACT_APP_ADMIN_EMAIL ||
    DEFAULT_ADMIN_EMAIL ||
    ""
  ).trim();
}

function getExplicitResetRedirectUrl() {
  return (
    process.env.ADMIN_PASSWORD_RESET_REDIRECT_URL ||
    process.env.ADMIN_RESET_REDIRECT_URL ||
    ""
  ).trim();
}

function getMissingConfigError() {
  if (!getSupabaseUrl()) return "Missing Supabase URL configuration";
  if (!getSupabaseAnonKey()) return "Missing Supabase anon key configuration";
  if (!getAdminEmail()) return "Missing admin auth email configuration";
  return null;
}

function getClient() {
  const missingConfigError = getMissingConfigError();
  if (missingConfigError) {
    throw new Error(missingConfigError);
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
}

function getBearerToken(req) {
  const header = String(req.headers?.authorization || "");
  if (!header.toLowerCase().startsWith("bearer ")) return "";
  return header.slice(7).trim();
}

function parseJwtClaims(token) {
  try {
    const payload = String(token || "").split(".")[1];
    if (!payload) return {};
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : "";
    return JSON.parse(Buffer.from(normalized + padding, "base64").toString("utf8"));
  } catch {
    return {};
  }
}

function buildOrigin(req) {
  const forwardedProto = String(req.headers?.["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = forwardedProto || (process.env.NODE_ENV === "production" ? "https" : "http");
  const host =
    String(req.headers?.["x-forwarded-host"] || "").split(",")[0].trim() ||
    String(req.headers?.host || "").trim();

  if (!host) return "";
  return `${proto}://${host}`;
}

export function buildAdminResetRedirectUrl(req) {
  const explicit = getExplicitResetRedirectUrl();
  if (explicit) return explicit;

  const origin = buildOrigin(req);
  if (!origin) {
    throw new Error("Could not determine the app origin for password reset");
  }

  return `${origin}/?admin-reset=1`;
}

export async function loginAdmin(password) {
  const client = getClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: getAdminEmail(),
    password: String(password || ""),
  });

  if (error) throw error;
  if (!data?.session) throw new Error("No session returned from Supabase Auth");

  return data;
}

export async function sendAdminPasswordReset(req) {
  const client = getClient();
  const redirectTo = buildAdminResetRedirectUrl(req);
  const { error } = await client.auth.resetPasswordForEmail(getAdminEmail(), {
    redirectTo,
  });

  if (error) throw error;
  return { redirectTo };
}

export async function getAdminSession(req, { requireAal2 = false } = {}) {
  const missingConfigError = getMissingConfigError();
  if (missingConfigError) {
    return { ok: false, status: 500, error: missingConfigError };
  }

  const token = getBearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "Missing admin auth token" };
  }

  const client = getClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: error?.message || "Invalid admin session" };
  }

  const expectedEmail = getAdminEmail().toLowerCase();
  const actualEmail = String(data.user.email || "").toLowerCase();
  if (!actualEmail || actualEmail !== expectedEmail) {
    return { ok: false, status: 403, error: "This account is not allowed to access the admin panel" };
  }

  const claims = parseJwtClaims(token);
  const aal = claims?.aal || null;

  if (requireAal2 && aal !== "aal2") {
    return { ok: false, status: 403, error: "MFA verification is required for this admin action" };
  }

  return {
    ok: true,
    status: 200,
    user: data.user,
    claims,
    aal,
  };
}

export async function isAdminAuthenticated(req, options = {}) {
  const result = await getAdminSession(req, options);
  return result.ok;
}

export async function requireAdmin(req, res, options = {}) {
  const result = await getAdminSession(req, { requireAal2: true, ...options });
  if (result.ok) return result;

  res.status(result.status).json({ error: result.error });
  return null;
}

export async function logoutAdmin() {
  return true;
}
