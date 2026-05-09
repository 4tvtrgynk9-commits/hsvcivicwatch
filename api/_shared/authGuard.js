export function requireAdminApiKey(req) {
  const required = process.env.ADMIN_API_KEY || "";

  if (!required) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        status: 500,
        error: "ADMIN_API_KEY is required in production for protected admin API routes.",
      };
    }
    return { ok: true };
  }

  const provided = req.headers["x-admin-api-key"] || req.headers["X-Admin-Api-Key"] || "";
  if (provided !== required) {
    return { ok: false, status: 401, error: "Unauthorized admin API request." };
  }
  return { ok: true };
}
