import { sendAdminPasswordReset } from "./_adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await sendAdminPasswordReset(req);
    return res.status(200).json({
      success: true,
      redirectTo: data.redirectTo,
    });
  } catch (error) {
    return res.status(500).json({
      error: String(error?.message || "Could not send admin password reset"),
    });
  }
}
