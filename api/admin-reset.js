import { sendAdminPasswordReset } from "./_adminAuth";

function normalizeResetError(error) {
  const message = String(error?.message || "Could not send admin password reset.");

  if (/missing admin auth email configuration/i.test(message)) {
    return "Admin password reset is not configured on this deployment.";
  }

  if (/missing supabase url configuration|missing supabase anon key configuration/i.test(message)) {
    return "Supabase auth is not configured on this deployment.";
  }

  if (/rate limit|too many/i.test(message)) {
    return "Too many reset attempts. Wait a moment and try again.";
  }

  return message;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await sendAdminPasswordReset(req);
    return res.status(200).json({
      success: true,
      redirectTo: data.redirectTo,
      message: "Reset link sent to the admin recovery inbox.",
    });
  } catch (error) {
    return res.status(500).json({
      error: normalizeResetError(error),
    });
  }
}
