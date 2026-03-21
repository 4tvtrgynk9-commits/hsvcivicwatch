export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You summarize civic information about Madison County, Alabama for everyday residents. 
You are given data already gathered about a specific issue. Your job is to connect the dots and explain what it means.
Write 2-3 short paragraphs. No headers. No bullet points. No legal or government terms without explaining them.
If you must use a technical term, immediately explain it in simple words in the same sentence.
Keep it under 175 words. Be direct and factual. Focus on: what this means for someone who lives here, who is benefiting from this arrangement, and what residents can actually do.`,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Summary unavailable.';
    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: 'Summary failed. Try again.' });
  }
}
