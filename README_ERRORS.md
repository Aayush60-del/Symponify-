# README_ERRORS.md

## Remaining Unresolved Issues

### 1. No automated integration test suite
- Status: unresolved
- Root cause: the repository does not currently include a test framework or seeded integration environment for API + MongoDB + media flows.
- Impact: regressions in auth, uploads, playlists, and player behavior still depend on manual verification.
- Suggested fix:
  - add Vitest or React Testing Library for frontend
  - add Supertest for backend
  - add a temporary test Mongo database
- Files involved:
  - `client/package.json`
  - `server/package.json`

### 2. Playback uses direct static file serving, not streaming/range-aware endpoints
- Status: partially unresolved
- Root cause: audio is served through `express.static`, which is simple and works, but no custom logic exists for advanced streaming control, analytics, or signed access.
- Impact:
  - limited observability
  - no future-ready authorization around media delivery
- Suggested fix:
  - consider dedicated streaming endpoints with range request handling and stronger access policy
- Files involved:
  - `server/server.js`
  - `server/routes/songs.js`

### 3. Playlist UI is still minimal on the frontend
- Status: unresolved on frontend
- Root cause: backend playlist CRUD now exists, but the client does not expose full playlist management screens yet.
- Impact: playlist support is not feature-complete from the user perspective.
- Suggested fix:
  - add playlist list/create/update/delete UI
  - add “save to playlist” controls in song rows/player
- Files involved:
  - `server/routes/playlists.js`
  - `client/src/pages/`
  - `client/src/components/`

### 4. Security hardening is improved but still basic
- Status: partially unresolved
- Root cause:
  - no dedicated rate limiter
  - no CSRF model because auth is token-in-storage based
  - no password reset/email verification flow
- Impact:
  - brute-force protection is weak
  - account lifecycle is basic
- Suggested fix:
  - add rate limiting middleware
  - add auth audit logging
  - add password reset and email verification if accounts matter long-term
- Files involved:
  - `server/server.js`
  - `server/routes/auth.js`

### 5. Live environment could still drift from repository media/state
- Status: ongoing deployment risk
- Root cause: media files and MongoDB records can diverge if uploads happen outside a clean deployment workflow.
- Impact:
  - cover/audio URLs may point to legacy folders
  - Render deploys can work while older DB records still reference old naming
- Suggested fix:
  - create an admin migration script to normalize `audioUrl` and `coverUrl`
  - document upload/media conventions
- Files involved:
  - `server/routes/songs.js`
  - `server/server.js`
  - MongoDB `Songs_col` / `Albums_col`

## Verification Limits During This Audit

Verified locally:
- backend syntax with `node -c`
- frontend production build with `npm run build`

Not fully verified in this workspace:
- live MongoDB connectivity with your production credentials
- full Render runtime behavior after every code change
- full Vercel edge caching behavior
- manual playback across multiple mobile browsers

## Reproduction Notes For Follow-up AI

1. Start backend with a valid `server/.env`.
2. Start frontend with `npm run dev`.
3. Test login, guest mode, admin access.
4. Upload a song with audio + cover.
5. Rename albums and replace song media.
6. Verify `GET /api/songs`, `GET /api/songs/albums`, `GET /api/playlists`.
7. On deployed Vercel, verify `/songs/...` and `/api/...` rewrites.
