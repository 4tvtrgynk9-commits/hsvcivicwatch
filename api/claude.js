// Vercel serverless function — holds your API key server-side
// Residents never see your key. All AI calls route through here.
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
        max_tokens: 1000,
        system: 'You investigate Madison County, Alabama civic issues. Be direct. Name names. Follow money. Format: THE FACTS | WHO BENEFITS | WHO GETS HURT | THE CONNECTIONS | WHAT CAN CHANGE. Under 400 words. Plain language.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Investigation unavailable.';
    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: 'Investigation failed. Try again.' });
  }
}
