import { logoutAdmin } from "./_adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await logoutAdmin();
  return res.status(200).json({ success: true });
}
