// /api/outlook.js
// Vercel serverless function — fetches Henry's real Outlook emails and calendar
// events via Composio, using a server-side connection. The Composio API key
// lives only in Vercel's Environment Variables (COMPOSIO_API_KEY), never in
// the browser or in this repo.
//
// Requires the "outlook" toolkit to already be connected on Henry's Composio
// account, and the npm package "@composio/core" (see package.json).

import { Composio } from "@composio/core";

// This identifies Henry as the "user" inside Composio's system — since this
// is a single-person app, a fixed string is fine here.
const COMPOSIO_USER_ID = "cortex-henry";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "COMPOSIO_API_KEY is not set on the server." });
  }

  const composio = new Composio({ apiKey });

  try {
    const [emailsResult, eventsResult] = await Promise.allSettled([
      composio.tools.execute("OUTLOOK_LIST_MESSAGES", {
        userId: COMPOSIO_USER_ID,
        arguments: { max_results: 8 },
      }),
      composio.tools.execute("OUTLOOK_LIST_EVENTS", {
        userId: COMPOSIO_USER_ID,
        arguments: { max_results: 8 },
      }),
    ]);

    const emails =
      emailsResult.status === "fulfilled"
        ? normalizeEmails(emailsResult.value)
        : [];
    const events =
      eventsResult.status === "fulfilled"
        ? normalizeEvents(eventsResult.value)
        : [];

    const errors = [];
    if (emailsResult.status === "rejected") errors.push(`emails: ${emailsResult.reason?.message || "failed"}`);
    if (eventsResult.status === "rejected") errors.push(`events: ${eventsResult.reason?.message || "failed"}`);

    return res.status(200).json({ emails, events, errors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function normalizeEmails(result) {
  const raw = result?.data?.messages || result?.data?.value || [];
  return raw.map((m) => ({
    id: m.id || m.messageId,
    subject: m.subject || "(no subject)",
    from: m.from?.emailAddress?.name || m.sender || m.from || "Unknown sender",
    preview: (m.bodyPreview || m.snippet || "").slice(0, 140),
    receivedAt: m.receivedDateTime || m.date || null,
    isRead: m.isRead !== false,
  }));
}

function normalizeEvents(result) {
  const raw = result?.data?.events || result?.data?.value || [];
  return raw.map((e) => ({
    id: e.id,
    subject: e.subject || "(no title)",
    start: e.start?.dateTime || e.start || null,
    end: e.end?.dateTime || e.end || null,
    location: e.location?.displayName || e.location || "",
  }));
}
