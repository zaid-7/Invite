# InviteCraft — Premium Animated Invitation SaaS

InviteCraft ([invitescraft.live](https://invitescraft.live)) is a premium, design-first digital invitation SaaS platform designed for traditional Indian celebrations. It allows users to write custom couple details and times, generate watermarked ephemeral previews, unlock templates via integrated payment, and capture guest RSVP rosters on dynamic sharing endpoints.

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
