# InviteCraft — Premium Animated Invitation SaaS

InviteCraft ([invitescraft.live](https://invitescraft.live)) is a premium, design-first digital invitation SaaS platform designed for traditional Indian celebrations. It allows users to write custom couple details and times, generate watermarked ephemeral previews, unlock templates via integrated payment, and capture guest RSVP rosters on dynamic sharing endpoints.

---

## Direct invitation unlock

On this branch, **Unlock Permanently** publishes the preview directly at `/i/[slug]`,
without opening Razorpay or the mock checkout. Login is still required, and only
the preview's owner can unlock it. The backend saves the invitation and a
zero-amount fulfilled order atomically; repeated clicks return the same URL.
Existing hosting durations remain unchanged (Basic: 6 months, Premium: 12 months,
Deluxe: no expiry). Publishing requires PostgreSQL; in-memory demo previews cannot
be published. The payment API remains available, but the preview screen no longer
calls it.

The builder asks for OTP verification again when a login token expires, preserving
the invitation fields. Keep `JWT_SECRET` stable in your ignored `backend/.env`
across local restarts so existing logins remain valid; do not generate a new
signing key on each launch. Use a strong private signing key for production.

In the builder's **Events** step, RSVP can be disabled and accommodation can be
enabled with custom booking details. Accommodation is hidden by default and
requires non-empty details when enabled. In the **Names** step, the four Royal
designs with couple profiles offer optional qualification and profession fields;
leave them blank to hide those lines. Parent names also come from the form rather
than hardcoded template text. These options apply to previews and published links.

The date-reveal card uses the first event's date and entered time, and countdowns
target that same time rather than a fixed hour. Clock times such as `6:00 PM`,
`18:00`, and `05:00 PM onwards` are supported. Descriptive or missing times are
not replaced with sample times; countdowns are hidden when no precise clock time
can be determined.

---

## Invitation background music

The builder's **Music** step offers three bundled MP3 tracks, a selected-track
audio preview, and **No Audio (Silent)**. The selected URL is saved with the
invitation and used in both previews and published links across all templates.
New invitations default to silent unless the template specifies a bundled track.

Guest playback loops and starts automatically when the browser permits audible
autoplay. Otherwise, the first click or Enter/Space interaction starts it,
including opening a template's doors or curtain. The floating music button
plays, mutes, or unmutes the track; muting does not reset playback. Music stops
when leaving the invitation. Playback errors are shown beside the control.

MP3 assets are served from `frontend/public/music/` so they deploy with the
frontend. Add future tracks there and register their labels and `/music/...`
URLs in `frontend/src/lib/music.ts`; database reseeding is not necessary.
Only deploy tracks you have permission to distribute, preserving any required
attribution or accompanying license notices.

---

## Sharing invitations on WhatsApp

Share the published `/i/[slug]` link, not the temporary `/preview/[token]` link.
Published pages include server-rendered Open Graph and Twitter metadata with
the invitation title, first event's date/time/venue, and a personalized
1200x630 PNG at `/i/[slug]/share-image`. The image uses the renderer's bundled
font, without Google Fonts requests. Disabled RSVP is not advertised in the
preview description.

The page and image must be reachable publicly over HTTPS for WhatsApp to fetch
them; `localhost` links cannot produce a preview for other people. The preview
URLs normally use the request's public host. If a reverse proxy changes that
host, set `NEXT_PUBLIC_SITE_URL=https://your-public-domain` in the frontend's
deployment environment to pin the canonical and image URLs.

Deploy these changes before sharing. WhatsApp caches previews, so previously
shared links may not update immediately. Deployment authentication, bot blocking,
or a sleeping Render backend can also prevent its crawler from loading the
metadata/image. Inactive invitations do not serve a share image.

---

## Workspace Architecture

```
/c:/Invite
├── backend/
│   ├── prisma/             # Schema definitions, seed scripts, migrations
│   └── src/
│       ├── config/         # Postgres and Redis ioredis client configurations
│       ├── middleware/     # JWT authentication and Redis IP limiters
│       ├── routes/         # REST API controller nodes
│       └── utils/          # Token signers, OTP helpers, slug creators
└── frontend/
    └── src/
        ├── app/            # App Router layouts and page bundles
        ├── components/     # Layout headers, watermarks, templates renderers
        ├── lib/            # Backend REST API wrappers
        └── types/          # Shared database and layout typing schemas
```

---

## Active Service Port Mapping

* **Next.js Web Client**: [http://localhost:3000](http://localhost:3000)
* **Express Server API**: [http://localhost:4000/api](http://localhost:4000/api)
* **PostgreSQL Engine**: `localhost:5432`
* **Redis Memory Cache**: `localhost:6379`

---

## Launch Instructions

### 1. Launch Docker Infrastructure
Spin up Database and Cache instances inside Docker:
```bash
docker-compose up -d
```

### 2. Launch Backend Development Server
Connect database ORM client, apply schemas, seed templates, and run compiler:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Launch Frontend Web Workspace
Compile layouts, fonts, static routing segments, and run client node:
```bash
cd frontend
npm install
npm run dev
```

---

## Authentication sandbox bypass
For convenient dashboard preview creation and payment authorization matching, you can log in directly using the dev fallback OTP code:
* **Mail / Phone OTP Bypass**: `123456`

---

## Production Deployment (free tier)

Stack: **Vercel** (frontend) + **Render** (backend, via `render.yaml`) + **Neon** (Postgres) + **Upstash** (Redis).

The frontend bundles its fonts through `next/font/local`, avoiding Google Fonts
network requests and font URL parsing during builds. Font files in
`frontend/src/assets/fonts/` come from the Google Fonts repository and include
their SIL Open Font License notices. Keep Vercel's build command set to
`npm run build`; no font-related environment variables or extra packages are needed.

1. Create free accounts: [Vercel](https://vercel.com), [Render](https://render.com), [Neon](https://neon.tech), [Upstash](https://upstash.com).
2. **Database**: create a Neon project, copy its connection string into `DATABASE_URL`.
3. **Redis**: create an Upstash Redis database, copy its `rediss://` TLS URL into `REDIS_URL`.
4. **Backend**: in Render, "New → Blueprint" pointed at this repo — it reads `render.yaml` and provisions the `invitecraft-backend` web service automatically. Fill in the secret env vars it prompts for (`DATABASE_URL`, `REDIS_URL`, Razorpay keys). See `backend/.env.production.example` for the full reference. Add the custom domain `api.invitescraft.live` once deployed.
5. **Frontend**: in Vercel, import this repo with **Root Directory** set to `frontend`, and set `NEXT_PUBLIC_BACKEND_URL=https://api.invitescraft.live/api`. Add the custom domain `invitescraft.live` (+ `www`).
6. **DNS**: at your domain registrar, add the records Vercel gives you for `invitescraft.live`/`www`, and a `CNAME` for `api` pointing at the target Render gives you.
7. Verify `https://api.invitescraft.live/health` returns `{"status":"ok"}`, then load `https://invitescraft.live`.

**Known free-tier tradeoffs:**
- Render's free web service sleeps after ~15 min idle; the first request afterward takes ~30–50s to wake up.
- OTP login is currently mocked (dev bypass `123456`) — wire up real SMS/email delivery before a public launch.
- Razorpay ships in test mode; switch to live keys only once KYC-verified with Razorpay.
