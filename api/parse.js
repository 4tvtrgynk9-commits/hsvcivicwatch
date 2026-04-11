export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { rawPaste } = req.body;
  
      if (!rawPaste || !rawPaste.trim()) {
        return res.status(400).json({ error: "No content provided" });
      }
  
      const system = `You are a structured data parser for HSV Civic Watch.
  Parse all ISSUE CARD and STAT BLOCK sections and return a single JSON object:
  {
    "issueCards": [...],
    "statBlocks": [...]
  }
  Issue card shape: { module, label, title, summary, details, sources, decoder: { whatsHappening, connections, benefits, impact }, actions: { contacts, meetings, recordsRequest, complaint, investigationRequest, misconductReport, elections, mediaOutreach, emailTemplate } }
  Stat block shape: { module, tab, type, color, value, label, context, title, unit, note, leftLabel, leftValue, rightLabel, rightValue, slices, points, bars, annualAmount, zones }
  Return ONLY valid JSON. No markdown. No explanation. null for missing fields.`;
  
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system,
          messages: [{ role: "user", content: rawPaste }],
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error?.message || "Anthropic request failed",
        });
      }
  
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
  
      return res.status(200).json(parsed);
    } catch (error) {
      return res.status(500).json({ error: "Parse failed: " + error.message });
    }
  }
  