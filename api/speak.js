// /api/speak.js
// Vercel serverless function — proxies text-to-speech requests to Fish Audio.
// The real Fish Audio API key lives only in Vercel's Environment Variables
// (FISHAUDIO_API_KEY), never in the browser or in this repo.
// The voice ID is fixed here too, so it's never something the client controls.

const CORTEX_VOICE_ID = "612b878b113047d9a770c069c8b4fdfe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.FISHAUDIO_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "FISHAUDIO_API_KEY is not set on the server." });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Request must include 'text' (string)." });
  }

  try {
    const fishRes = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        text,
        reference_id: CORTEX_VOICE_ID,
        format: "mp3",
      }),
    });

    if (!fishRes.ok) {
      const errText = await fishRes.text();
      return res.status(fishRes.status).json({ error: `Fish Audio error: ${errText}` });
    }

    const arrayBuffer = await fishRes.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
