export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
    try {
      const { statBlocks, module } = req.body;
      if (!statBlocks?.length) return res.status(400).json({ error: "No stat blocks provided" });
  
      const system = `You are a civic impact scorer for HSV Civic Watch.
  Score each stat block from 1-10 based on how jaw-dropping, controversial, upsetting, or action-inspiring it is to an everyday Huntsville resident reading it for the first time.
  A 10 means someone would stop scrolling, feel outrage or urgency, and want to share it or read more.
  A 1 means it is dry, expected, or has low emotional or civic impact.
  Return ONLY a JSON array of objects: [{ "ref_number": "...", "score": N }]
  No markdown. No explanation.`;
  
      const userContent = `Score these stat blocks for the ${module} module:\n${JSON.stringify(statBlocks, null, 2)}`;
  
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: userContent }],
        }),
      });
  
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data?.error?.message });
  
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const scores = JSON.parse(clean);
  
      return res.status(200).json({ scores });
    } catch (error) {
      return res.status(500).json({ error: "Scoring failed: " + error.message });
    }
  }
  