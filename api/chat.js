// /api/chat.js
// Vercel serverless function — proxies chat requests to Groq.
// The real Groq API key lives only in Vercel's Environment Variables (GROQ_API_KEY),
// never in the browser or in this repo.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set on the server." });
  }

  const { messages, temperature = 0.7 } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Request must include a 'messages' array." });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      return res.status(groqRes.status).json({ error: `Groq error: ${text}` });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
