# Symponify Music

A React + Express + MongoDB music app with a warm minimal UI.

## Structure

- `client/` Vite + React frontend
- `server/` Express + MongoDB backend

## Run

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Create `server/.env` from `server/.env.example` before starting the backend.

Optional frontend env:

```bash
VITE_API_BASE_URL=
```

Leave it empty for local Vite proxy or same-origin deployments. Set it to your deployed backend origin when needed.

## Seed songs

```bash
cd server
npm run seed
```
