// CORTEX AI Engine — talks to our own /api/chat proxy (Vercel serverless function),
// which holds the real Groq key server-side. No API key ever lives in the browser.

const CortexAI = (() => {
  async function ask(messages, { temperature = 0.7 } = {}) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, temperature }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Chat request failed (${res.status})`);
    }
    return data.reply ?? "";
  }

  return { ask };
})();
