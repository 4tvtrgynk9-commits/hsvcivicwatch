import { loginAdmin } from "./_adminAuth";

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
    const message = String(error?.message || "Invalid password");
    const status = /invalid|credentials/i.test(message) ? 401 : 500;
    return res.status(status).json({ error: message });
  }
}
