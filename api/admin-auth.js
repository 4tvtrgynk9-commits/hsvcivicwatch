import { loginAdmin, logoutAdmin, sendAdminPasswordReset, getAdminSession } from "./_adminAuth.js";

function normalizeLoginError(error) {
  const message = String(error?.message || "Could not sign in.");
  if (/invalid login credentials|invalid credentials|invalid password/i.test(message)) return { status: 401, error: "Incorrect password for the admin account. Use Reset Password Link if you need to set a new one." };
  if (/email not confirmed/i.test(message)) return { status: 403, error: "The admin account email is not confirmed in Supabase Auth." };
  if (/not allowed to access the admin panel/i.test(message)) return { status: 403, error: "This account is not allowed to access the admin panel." };
  if (/missing admin auth email configuration/i.test(message)) return { status: 500, error: "Admin login is not configured on this deployment." };
  if (/missing supabase url configuration|missing supabase anon key configuration/i.test(message)) return { status: 500, error: "Supabase auth is not configured on this deployment." };
  return { status: 500, error: message };
}

function normalizeResetError(error) {
  const message = String(error?.message || "Could not send admin password reset.");
  if (/missing admin auth email configuration/i.test(message)) return "Admin password reset is not configured on this deployment.";
  if (/missing supabase url configuration|missing supabase anon key configuration/i.test(message)) return "Supabase auth is not configured on this deployment.";
  if (/rate limit|too many/i.test(message)) return "Too many reset attempts. Wait a moment and try again.";
  return message;
}

export default async function handler(req, res) {
  const action = req.query.action || req.body?.action || "";

  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const password = String(req.body?.password || "");
    if (!password) return res.status(400).json({ error: "Missing password" });
    try {
      const data = await loginAdmin(password);
      return res.status(200).json({ session: data.session, user: data.user });
    } catch (error) {
      const n = normalizeLoginError(error);
      return res.status(n.status).json({ error: n.error });
    }
  }

  if (action === "logout") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    await logoutAdmin();
    return res.status(200).json({ success: true });
  }

  if (action === "reset") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    try {
      const data = await sendAdminPasswordReset(req);
      return res.status(200).json({ success: true, redirectTo: data.redirectTo, message: "Reset link sent to the admin recovery inbox." });
    } catch (error) {
      return res.status(500).json({ error: normalizeResetError(error) });
    }
  }

  if (action === "session") {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const result = await getAdminSession(req, { requireAal2: false });
    return res.status(200).json({ authenticated: result.ok, aal: result.ok ? result.aal : null, requiresMfa: result.ok ? result.aal !== "aal2" : false, error: result.ok ? null : result.error });
  }

  return res.status(400).json({ error: "Missing or invalid action" });
}
