import { loginAdmin } from "./_adminAuth";

function normalizeLoginError(error) {
  const message = String(error?.message || "Could not sign in.");

  if (/invalid login credentials|invalid credentials|invalid password/i.test(message)) {
    return { status: 401, error: "Incorrect password for the admin account. Use Reset Password Link if you need to set a new one." };
  }

  if (/email not confirmed/i.test(message)) {
    return { status: 403, error: "The admin account email is not confirmed in Supabase Auth." };
  }

  if (/not allowed to access the admin panel/i.test(message)) {
    return { status: 403, error: "This account is not allowed to access the admin panel." };
  }

  if (/missing admin auth email configuration/i.test(message)) {
    return { status: 500, error: "Admin login is not configured on this deployment." };
  }

  if (/missing supabase url configuration|missing supabase anon key configuration/i.test(message)) {
    return { status: 500, error: "Supabase auth is not configured on this deployment." };
  }

  return { status: 500, error: message };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password = String(req.body?.password || "");
  if (!password) {
    return res.status(400).json({ error: "Missing password" });
  }

  try {
    const data = await loginAdmin(password);
    return res.status(200).json({
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    const normalized = normalizeLoginError(error);
    return res.status(normalized.status).json({ error: normalized.error });
  }
}
