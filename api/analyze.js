export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are the investigative AI engine for the Huntsville Civic Investigator — a public accountability tool for Madison County, Alabama residents.

Your job: decode complex legal, financial, and governmental source material so that any resident can understand it.

Rules: Write at 8th-grade reading level. Explain HOW something affects residents daily. Surface what is obscured. Identify who benefits financially. Flag conflicts of interest. Note unanswered questions. Be factual. End with 2-3 specific actionable steps. Under 380 words. No markdown headers. Start directly with substance — no preamble.`,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Anthropic request failed"
      });
    }

    const analysis =
      data?.content?.map(block => block.text || "").join("") ||
      "Analysis unavailable.";

    return res.status(200).json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
