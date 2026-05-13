# AGENTS.md

## Project Overview

Symponify is a monorepo with:

- `client/`: React + Vite SPA
- `server/`: Express + MongoDB API
- `server/public/songs/`: deployed static audio and cover assets
- `Songs/`: legacy local media sources used for some fallback paths

## Architecture

Frontend:
- `src/App.jsx`: route shell and auth gating
- `src/context/PlayerContext.jsx`: player, liked songs, auth user sync
- `src/components/`: layout, cards, player, navigation
- `src/pages/`: Home, Search, Library, Liked Songs, Login, Add Song, Manage Songs
- `src/lib/api.js`: Axios instance

Backend:
- `server.js`: app bootstrap, CORS, request logging, static media, route mounting
- `config/db.js`: MongoDB connection
- `routes/auth.js`: login, register, admin access, current user
- `routes/songs.js`: songs, albums, uploads, likes, media handling
- `routes/playlists.js`: playlist CRUD
- `middleware/`: auth and upload handling
- `utils/`: validation and media utilities

## Setup Commands

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## Build Commands

Frontend:

```bash
cd client
npm run build
```

Backend start:

```bash
cd server
npm start
```

## Lint / Test Commands

There is no dedicated lint or automated test framework configured yet.

Safe checks:

```bash
cd server
node -c server.js
node -c routes/auth.js
node -c routes/songs.js
node -c routes/playlists.js
```

```bash
cd client
npm run build
```

## Deployment Workflow

Frontend:
- Deploy `client/` to Vercel
- Ensure `client/vercel.json` rewrites `/api/*` and `/songs/*`

Backend:
- Deploy `server/` to Render
- Set env vars from `server/.env.example`
- Confirm media files exist in `server/public/songs`

## Environment Setup

Backend required env:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_ORIGIN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Frontend optional env:
- `VITE_API_BASE_URL`

## Repository-Specific Rules

- Prefer `rg` for search.
- Use `apply_patch` for file edits.
- Do not remove or overwrite media files casually.
- Treat `Songs/` as legacy local inputs, not the primary deployed media source.
- Preserve Vercel `/api` and `/songs` rewrite behavior.
- Keep admin-only routes guarded on both frontend and backend.
- When touching media paths, verify both local and deployed URLs.

## Coding Conventions

- Keep files ASCII-first where practical.
- Use escaped Unicode sequences when source encoding is unstable.
- Prefer small reusable utilities for validation and media path logic.
- Add concise comments only when the logic is non-obvious.
- Preserve the existing Symponify design language.

## Debugging Checklist

1. Check `client/vercel.json` rewrites.
2. Check Render env vars, especially `CLIENT_ORIGIN`, `JWT_SECRET`, `MONGO_URI`.
3. Verify `GET /api/health`.
4. Verify `GET /api/songs/albums`.
5. Verify direct media URLs under `/songs/...`.
6. If images fail only on Vercel, test the same `/songs/...` path on both Vercel and Render.
7. If auth fails, clear `localStorage` token/user and test `/api/auth/login` again.
8. If uploads fail, inspect song title folder generation and file extensions.
