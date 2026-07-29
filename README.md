# Eswatini Events

Event discovery and ticketing platform for Eswatini.

**MVP Status:** Core flows implemented — auth, event CRUD, ticket purchase with QR, gate validation, organizer dashboard basics.

---

## Architecture

| Package | Stack | Port |
|---------|-------|------|
| `packages/backend` | Express + Prisma (MongoDB) + Redis + Socket.IO | 4000 |
| `packages/web` | Next.js 15 App Router | 3000 |
| `packages/attendee-app` | Stub (future PWA) | — |
| `packages/scanner-app` | Stub (use `/scanner` web page for MVP) | — |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)

### 1. Clone & install

```bash
git clone https://github.com/Brightwell-Dlamini/eswatini-events.git
cd eswatini-events
yarn install
```

### 2. Backend environment

Create `packages/backend/.env`:

```env
DATABASE_URL="mongodb://localhost:27017/eswatini-events"
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_USERNAME=
# REDIS_PASSWORD=
JWT_SECRET=change-me-to-a-long-random-string
JWT_REFRESH_SECRET=change-me-too
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Generate Prisma client & seed

```bash
cd packages/backend
npx prisma generate
npx ts-node src/scripts/seed.ts
```

Demo accounts (password for all: `Password123!`):

| Role | Email |
|------|-------|
| Organizer | organizer@eswatinievents.sz |
| Attendee | attendee@eswatinievents.sz |
| Gate Operator | gate@eswatinievents.sz |

### 4. Start backend

```bash
cd packages/backend
yarn dev
```

### 5. Start frontend

```bash
cd packages/web
# Create .env.local if needed:
# NEXT_PUBLIC_API_URL=http://localhost:4000
yarn dev
```

Open http://localhost:3000

---

## MVP User Flows

### Attendee
1. Register / login at `/auth/register` or `/auth/login`
2. Browse events at `/events`
3. Open an event → select tickets → pay (simulated MoMo/Visa/Cash)
4. View QR codes at `/tickets`

### Organizer
1. Register as ORGANIZER
2. Create event at `/organizer/events/new` (add ticket types, publish)
3. View own events at `/organizer/events` and dashboard at `/organizer/dashboard`

### Gate Operator
1. Login as GATE_OPERATOR
2. Open `/scanner`
3. Enter or scan ticket number → validate

---

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register |
| POST | `/auth/login` | — | Login |
| GET | `/auth/me` | Bearer | Current user |
| GET | `/events` | — | Published events |
| GET | `/events/:id` | — | Event detail (+ ticket types) |
| POST | `/events` | ORGANIZER | Create event |
| POST | `/events/:id/publish` | ORGANIZER | Publish |
| GET | `/events/organizer/mine` | ORGANIZER | Own events |
| POST | `/ticket-types` | ORGANIZER | Create ticket type |
| GET | `/ticket-types/event/:id` | — | List ticket types |
| POST | `/payments/purchase` | ATTENDEE | Buy tickets |
| GET | `/tickets/my` | Auth | My tickets |
| POST | `/tickets/validate` | GATE_OPERATOR / ORGANIZER | Scan ticket |
| GET | `/analytics/organizer/summary` | ORGANIZER | Dashboard stats |

---

## Scope

See [MVP_PLAN.md](./MVP_PLAN.md) for the full two-week plan, in-scope / out-of-scope features, and success criteria.

**Out of scope for this MVP:** resale, USSD, community agents, wristbands, multi-tenancy, dynamic pricing, loyalty, vendor marketplace, government approvals.

---

## Deployment Notes

- Backend: existing GitHub Actions workflow deploys to EC2 via PM2 (`packages/backend`)
- Frontend: deploy `packages/web` to Vercel; set `NEXT_PUBLIC_API_URL` to the backend URL
- Ensure MongoDB, Redis, and JWT secrets are configured in production secrets

---

## License

MIT
