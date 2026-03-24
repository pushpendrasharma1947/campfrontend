# Campus Kart — Scaffold

This workspace contains a minimal Node/Express backend with a static React frontend (served from `backend/public`). It includes a Postgres connection helper and a mocked AI-chat endpoint at `POST /api/chat`.

Quick start (backend):

1. cd into the backend folder

```powershell
cd "c:\Users\sharm\OneDrive\Desktop\campus kart\backend"
npm install
cp .env.example .env
# Edit .env to set DATABASE_URL
npm run dev
```

Open http://localhost:4000 in your browser. The frontend is a simple React app that talks to `/api/chat`.

Next steps:
- Provide a Postgres `DATABASE_URL` and run the SQL in `backend/migrations/001_create_messages.sql`.
- Replace mock AI logic in `backend/routes/chat.js` with calls to your chosen AI provider.
- Add CI, Dockerfile, and deployment configs as needed for Heroku/Render.
