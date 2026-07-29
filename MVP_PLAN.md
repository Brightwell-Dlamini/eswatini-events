# Eswatini Events — Two-Week MVP Plan

**Goal:** Ship a complete, fully working Minimum Viable Product in 14 days.

**Core value proposition:** Discover events in Eswatini → Purchase tickets → Receive QR code → Validate at the gate.

---

## In Scope (MVP)

1. **Authentication**
   - Email/password registration & login
   - Google OAuth
   - JWT + refresh tokens + Redis session
   - Roles used: `ATTENDEE`, `ORGANIZER`, `GATE_OPERATOR`

2. **Event Management (Organizer)**
   - Create / edit / publish / unpublish events
   - Define ticket types (name, price, quantity, sales window)
   - Basic dashboard (own events + ticket sales count/revenue)

3. **Event Discovery (Public / Attendee)**
   - List published events (filter by city, type, date)
   - Event detail page with ticket types and pricing

4. **Ticket Purchase**
   - Select ticket type + quantity
   - Create payment record
   - Generate tickets with unique QR codes on successful payment
   - Support methods: `MOMO`, `CASH`, `VISA`, `MASTERCARD` (simulated gateway for MVP)

5. **Ticket Validation**
   - Gate operator scans QR / enters ticket number
   - Mark as `SCANNED` (idempotent, cached in Redis)

6. **Basic Infrastructure**
   - Health check
   - Structured logging
   - Rate limiting on auth
   - CORS configured for frontend

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

These features remain in the Prisma schema for future phases but will not be implemented or required for the MVP launch.

---

## Technical Decisions for MVP

| Area | Decision |
|------|----------|
| Database | MongoDB via Prisma (existing) |
| Cache / Sessions | Redis |
| Auth | JWT (1h) + refresh (7d) |
| Payments | Simulated success for all methods except explicit failure paths; real MoMo integration deferred to post-MVP |
| Ticket generation | On successful payment (not pre-created inventory rows) |
| Ticket type approval | Auto-approved for organizer-created types in MVP |
| Scanner | Authenticated web endpoint first; dedicated scanner-app later |
| Frontend data | Replace mocks with live API calls |

---

## Two-Week Schedule

### Week 1 — Backend Foundation & Core Flows

| Day | Focus |
|-----|--------|
| 1 | Scope lock (this document). Fix ticket purchase flow so tickets are created on payment. Auto-approve ticket types. Seed script. |
| 2 | Harden auth, events, ticket-types routes. Add capacity checks & inventory decrement. |
| 3 | Complete payments route (idempotency, proper status transitions). QR generation improvements. |
| 4 | Validation / scan endpoint robustness + basic organizer analytics endpoint. |
| 5 | Integration tests for happy path + critical failure paths. CI green. |

### Week 2 — Frontend, Scanner, Polish & Launch

| Day | Focus |
|-----|--------|
| 6–7 | Wire web app to live APIs (events list, detail, purchase). Remove reliance on mockData where possible. |
| 8 | Organizer create/edit/publish + ticket-type management UI. |
| 9 | Purchase confirmation page + “My Tickets” with QR display. Simple web scanner page for GATE_OPERATOR. |
| 10–11 | End-to-end testing, bug fixes, basic responsive polish, error states. |
| 12–13 | Deployment (backend EC2 + frontend Vercel), environment secrets, smoke tests. |
| 14 | Documentation, seed data for demo, handover / launch checklist. |

---

## Success Criteria (Definition of Done)

- [ ] A new user can register as ATTENDEE or ORGANIZER.
- [ ] An organizer can create an event, add ticket types, and publish it.
- [ ] A published event appears in the public listing.
- [ ] An attendee can purchase one or more tickets and receive QR codes.
- [ ] A gate operator can validate a ticket by number / QR and mark it scanned.
- [ ] Re-scanning the same ticket is rejected.
- [ ] Core flow works on a deployed environment (not only localhost).
- [ ] No critical security issues in auth or payment handling for the simulated gateway.

---

## Immediate Next Actions (Day 1)

1. Commit this plan.
2. Rewrite purchase flow: create tickets from `TicketTypeConfig` on successful payment.
3. Auto-approve ticket types created by organizers.
4. Add a minimal seed script with sample Eswatini events.
5. Verify health + auth + events list still function.

---

*Last updated: 29 July 2026*
