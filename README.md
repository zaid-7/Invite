# Mandap — Premium Animated Invitation SaaS

Mandap is a premium, design-first digital invitation SaaS platform designed for traditional Indian celebrations. It allows users to write custom couple details and times, generate watermarked ephemeral previews, unlock templates via integrated payment, and capture guest RSVP rosters on dynamic sharing endpoints.

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
