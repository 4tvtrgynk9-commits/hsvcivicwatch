import { getAdminSession } from "./_adminAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await getAdminSession(req, { requireAal2: false });

  return res.status(200).json({
    authenticated: result.ok,
    aal: result.ok ? result.aal : null,
    requiresMfa: result.ok ? result.aal !== "aal2" : false,
    error: result.ok ? null : result.error,
  });
}
