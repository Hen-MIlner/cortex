// CORTEX — global config
// API keys are NOT stored here or anywhere in the browser.
// They live server-side as Vercel Environment Variables:
//   GROQ_API_KEY        -> used by /api/chat.js
//   FISHAUDIO_API_KEY    -> used by /api/speak.js

const CORTEX_CONFIG = {
  appName: "CORTEX",
  userName: "Henry",

  voiceId: "612b878b113047d9a770c069c8b4fdfe", // Henry's chosen CORTEX voice (used server-side too)

  // Composio — integrations. Henry controls exactly which connectors are allowed.
  // Only toolkits listed here (and switched on) will ever be offered/used.
  composio: {
    allowedToolkits: [
      // { slug: "github", enabled: true, label: "GitHub" },
      // { slug: "outlook", enabled: true, label: "Outlook" },
      // Add/remove entries here — nothing outside this list is ever called.
    ],
  },

  storageKeys: {
    tasks: "cortex_tasks",
    projects: "cortex_projects",
    notes: "cortex_notes",
    memories: "cortex_memories",
    settings: "cortex_settings",
    chatHistory: "cortex_chat_history",
  },
};
