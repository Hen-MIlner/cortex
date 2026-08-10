# CORTEX — AI Operating System

Henry's personal AI operating system. Deployed on Vercel — the frontend is static, and two small serverless functions hold the real API keys so they never reach the browser.

## Structure

```
cortex/
├── index.html              Dashboard
├── chat/                   Chat with CORTEX
├── tasks/                  Task list
├── school/                 School timetable & resources
├── milne-designs/          Milne Designs workspace
├── github/                 GitHub view
├── outlook/                Outlook view
├── settings/                Voice test + Composio connector controls
├── api/
│   ├── chat.js              Serverless function — proxies Groq, holds GROQ_API_KEY
│   └── speak.js             Serverless function — proxies Fish Audio, holds FISHAUDIO_API_KEY
└── assets/
    ├── css/                 Shared design system
    └── js/                  Shared logic (memory, AI engine, voice, nav)
```

## Deploying on Vercel

1. Push this repo to GitHub (public repo is fine — no keys live in the code).
2. Go to vercel.com → **Add New Project** → import the GitHub repo.
3. Before the first deploy, open **Environment Variables** and add:
   - `GROQ_API_KEY` → your Groq key
   - `FISHAUDIO_API_KEY` → your Fish Audio key
4. Click **Deploy**. Vercel gives you a live link like `https://cortex-yourname.vercel.app`.
5. Every time you push to GitHub, Vercel redeploys automatically.

Your keys live only in Vercel's encrypted environment variables — never in the repo, never sent to the browser, never visible in page source.

## Notes

- Task/note/memory data still persists per-device via `localStorage` — it does not sync across devices.
- The voice ID is fixed in `/api/speak.js`, so it can't be changed from the browser.
