import { requireAdmin } from "../api-shared/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Anthropic API key" });
  }

  try {
    const action = String(req.body?.action || "");

    if (action === "slides") {
      const prompt = String(req.body?.prompt || "").trim();
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.error?.message || "Anthropic request failed" });
      }

      const textBlock = data.content?.find(block => block.type === "text");
      if (!textBlock?.text) {
        return res.status(502).json({ error: "No text response from AI" });
      }

      const clean = textBlock.text.replace(/```json|```/g, "").trim();
      return res.status(200).json({ slides: JSON.parse(clean).slides || [] });
    }

    if (action === "image") {
      const query = String(req.body?.query || "").trim();
      if (!query) {
        return res.status(400).json({ error: "Missing query" });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Search for a real publicly accessible photo of: ${query} Huntsville Alabama. Return ONLY this JSON with no other text: {"imageUrl":"URL"} or {"imageUrl":null} if not found.`,
          }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.error?.message || "Anthropic request failed" });
      }

      const textBlock = data.content?.find(block => block.type === "text");
      if (!textBlock?.text) {
        return res.status(200).json({ imageUrl: null });
      }

      const clean = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      return res.status(200).json({ imageUrl: parsed.imageUrl || null });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Admin social request failed" });
  }
}
