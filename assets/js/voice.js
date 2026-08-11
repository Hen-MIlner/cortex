// CORTEX Voice — talks to our own /api/speak proxy (Vercel serverless function),
// which holds the real Fish Audio key server-side and applies Henry's fixed
// voice ID. No API key ever lives in the browser.

const CortexVoice = (() => {
  async function speak(text) {
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Speak request failed (${res.status})`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    return audio;
  }

  return { speak };
})();
