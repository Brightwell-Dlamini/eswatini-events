# Eswatini Events — Two-Week MVP Plan

**Goal:** Ship a complete, fully working Minimum Viable Product in 14 days.

**Core value proposition:** Discover events in Eswatini → Purchase tickets → Receive QR code → Validate at the gate.

**Status: Core MVP implemented (29 July 2026)**

---

## In Scope (MVP) — Implemented

1. **Authentication** ✅
   - Email/password registration & login
   - JWT + refresh tokens + Redis session
   - Roles: `ATTENDEE`, `ORGANIZER`, `GATE_OPERATOR`
   - Google OAuth routes present (existing)

2. **Event Management (Organizer)** ✅
   - Create / edit / publish / unpublish / archive events
   - Define ticket types (auto-approved)
   - Organizer events list + create page
   - Analytics summary endpoint

3. **Event Discovery** ✅
   - Public list of published events (live API)
   - Event detail with ticket types and pricing
   - Filter by type + search

4. **Ticket Purchase** ✅
   - Select ticket type + quantity
   - Create payment + tickets with QR on purchase
   - Capacity checks, idempotency key support
   - Methods: MOMO, VISA, MASTERCARD, CASH (simulated)

5. **Ticket Validation** ✅
   - `/scanner` page for GATE_OPERATOR / ORGANIZER
   - Redis-cached validation, idempotent
   - Scan audit record

6. **Infrastructure** ✅
   - Health check, logging, rate limiting, CORS
   - Seed script with demo accounts + sample events
   - README + this plan

---

## Explicitly Out of Scope

- Resale marketplace / secondary market
- Dynamic pricing algorithms
- USSD / feature-phone flows
- Community agents / offline cash agents
- Wristbands / cashless
- Multi-tenancy / multi-region
- Loyalty / rewards / referrals
- Vendor marketplace / booths
- Sponsorships / ads
- Government approval workflows
- Advanced analytics & reports
- Offline-first PWA sync
- Seat maps / reserved seating
- Waitlists / group bookings
- Chat / messaging
- Biometrics / KYC beyond basic verification flag
- Real MoMo/card gateway (simulated for MVP)

---

## Success Criteria

- [x] A new user can register as ATTENDEE or ORGANIZER
- [x] An organizer can create an event, add ticket types, and publish it
- [x] A published event appears in the public listing
- [x] An attendee can purchase tickets and receive QR codes
- [x] A gate operator can validate a ticket and mark it scanned
- [x] Re-scanning the same ticket is rejected
- [ ] Core flow works on a deployed environment (requires your MongoDB/Redis/secrets + deploy)
- [x] No critical security gaps in auth or simulated payment handling for MVP scope

---

## How to Run Locally

See [README.md](./README.md).

```bash
# Backend
cd packages/backend
# set .env with DATABASE_URL, REDIS_*, JWT_SECRET, JWT_REFRESH_SECRET
npx prisma generate
yarn seed
yarn dev

# Frontend
cd packages/web
# NEXT_PUBLIC_API_URL=http://localhost:4000
yarn dev
```

Demo logins (password: `Password123!`):
- organizer@eswatinievents.sz
- attendee@eswatinievents.sz
- gate@eswatinievents.sz

---

## Remaining Optional Polish (post-MVP)

1. Wire organizer dashboard charts to `/analytics/organizer/summary` (page still has some mock chart data)
2. Replace remaining landing-page mock carousels with live featured events if desired
3. Integrate real MoMo / card payment provider
4. Deploy frontend to Vercel + confirm EC2 backend secrets
5. Expand automated integration tests beyond existing auth tests
6. Build dedicated scanner-app / attendee-app packages when needed

---

*Last updated: 29 July 2026*
