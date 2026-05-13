# Symponify Music

Symponify is a full-stack music streaming app with:

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB backend
- Media uploads served from the backend
- Frontend deployment on Vercel
- Backend deployment on Render

## Current Architecture

Frontend:
- React Router for app navigation
- Local player state via `PlayerContext`
- Axios for API access
- Inline style system with responsive viewport helpers

Backend:
- Express REST API
- MongoDB via Mongoose
- JWT auth
- Multer-based uploads with Cloudinary storage
- Media files hosted on Cloudinary (cloud-based, persistent)

## Local Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Install frontend dependencies:

```bash
cd client
npm install
```

3. Create env files:

- `server/.env` from `server/.env.example`
- `client/.env` from `client/.env.example` if needed

4. Start the backend:

```bash
cd server
npm run dev
```

5. Start the frontend:

```bash
cd client
npm run dev
```

## Environment Variables

Backend `server/.env`:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_ORIGIN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)

Frontend `client/.env`:

- `VITE_API_BASE_URL`

Leave `VITE_API_BASE_URL` empty for local Vite proxy. Set it only when the frontend should call a direct backend origin instead of same-origin rewrites.

## Useful Commands

Frontend:

```bash
cd client
npm run dev
npm run build
```

Backend:

```bash
cd server
npm run dev
npm start
npm run seed
```

## Seeding

The seed script inserts a small working catalog that matches bundled media paths:

```bash
cd server
npm run seed
```

## Deployment

### Vercel

Project root for Vercel should be `client/`.

Vercel rewrite support is configured in `client/vercel.json`:

- `/api/*` -> Render backend `/api/*`

(Note: Media files are now served from Cloudinary URLs, not from Render.)

### Render

Project root for Render should be `server/`.

Recommended Render settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables from `server/.env.example` (including all Cloudinary credentials)
- No need to upload media files to Render (all files are in Cloudinary)

## Verification Checklist

- `client` builds with `npm run build`
- backend files parse successfully with `node -c`
- `GET /api/health` returns `ok: true`
- Cloudinary env vars are set in `server/.env`
- login/signup works
- admin upload flow works with Cloudinary
- uploaded audio and cover files appear in Cloudinary dashboard
- Vercel rewrites for `/api/*` are active

## Notes

- The project currently uses inline styles, not TailwindCSS.
- Playlist APIs are available on the backend but the playlist UI is still limited.
- See `README_ERRORS.md` for remaining issues and follow-up recommendations.
