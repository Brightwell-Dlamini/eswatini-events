/**
 * MVP Seed Script
 * Creates a demo organizer, gate operator, attendee, and sample Eswatini events.
 *
 * Usage (from packages/backend):
 *   npx ts-node src/scripts/seed.ts
 *
 * Requires DATABASE_URL and a running MongoDB instance.
 */

import { PrismaClient, UserRole, EventType, EventStatus, TicketType, ApprovalStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MVP data...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // --- Users ---
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eswatinievents.sz' },
    update: {},
    create: {
      name: 'Sibusiso Dlamini',
      email: 'organizer@eswatinievents.sz',
      phone: '+26876123456',
      password: passwordHash,
      role: UserRole.ORGANIZER,
      isVerified: true,
      signupMethod: 'EMAIL_PHONE',
      company: 'Eswatini Live Events',
    },
  });

  const attendee = await prisma.user.upsert({
    where: { email: 'attendee@eswatinievents.sz' },
    update: {},
    create: {
      name: 'Thandi Nkambule',
      email: 'attendee@eswatinievents.sz',
      phone: '+26876234567',
      password: passwordHash,
      role: UserRole.ATTENDEE,
      isVerified: true,
      signupMethod: 'EMAIL_PHONE',
    },
  });

  const gateOp = await prisma.user.upsert({
    where: { email: 'gate@eswatinievents.sz' },
    update: {},
    create: {
      name: 'Mthunzi Simelane',
      email: 'gate@eswatinievents.sz',
      phone: '+26876345678',
      password: passwordHash,
      role: UserRole.GATE_OPERATOR,
      isVerified: true,
      signupMethod: 'EMAIL_PHONE',
    },
  });

  console.log('Users created:', { organizer: organizer.id, attendee: attendee.id, gateOp: gateOp.id });

  // --- Sample Events ---
  const eventsData = [
    {
      name: 'Bushfire Festival 2026',
      description:
        'Southern Africa\'s premier music and arts festival. Three days of world-class performances, local talent, and cultural immersion in the heart of Eswatini.',
      startTime: new Date('2026-05-22T16:00:00Z'),
      endTime: new Date('2026-05-24T23:00:00Z'),
      address: 'House on Fire, Malkerns',
      city: 'Malkerns',
      type: EventType.FESTIVAL,
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-047417675d1b?w=800',
      capacity: 15000,
      isFeatured: true,
      ticketTypes: [
        { name: 'General Admission (3-Day)', type: TicketType.GENERAL_ADMISSION, price: 850, quantity: 10000 },
        { name: 'VIP (3-Day)', type: TicketType.VIP, price: 2200, quantity: 1500 },
        { name: 'Early Bird GA', type: TicketType.EARLY_BIRD, price: 650, quantity: 2000 },
      ],
    },
    {
      name: 'MTN Bushbucks vs Royal Leopards',
      description: 'Premier League football clash at Somhlolo National Stadium. Come support your team!',
      startTime: new Date('2026-08-15T14:00:00Z'),
      endTime: new Date('2026-08-15T17:00:00Z'),
      address: 'Somhlolo National Stadium',
      city: 'Lobamba',
      type: EventType.SPORTS,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      capacity: 20000,
      isFeatured: true,
      ticketTypes: [
        { name: 'Grandstand', type: TicketType.GENERAL_ADMISSION, price: 80, quantity: 5000 },
        { name: 'VIP Box', type: TicketType.VIP, price: 350, quantity: 200 },
      ],
    },
    {
      name: 'Sjava Live in Mbabane',
      description: 'An intimate evening with award-winning artist Sjava. Soulful performances and special guests.',
      startTime: new Date('2026-09-20T19:00:00Z'),
      endTime: new Date('2026-09-20T23:00:00Z'),
      address: 'Convention Centre, Ezulwini',
      city: 'Ezulwini',
      type: EventType.MUSIC,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      capacity: 2500,
      isFeatured: false,
      ticketTypes: [
        { name: 'General', type: TicketType.GENERAL_ADMISSION, price: 250, quantity: 2000 },
        { name: 'VIP Meet & Greet', type: TicketType.VIP, price: 750, quantity: 100 },
      ],
    },
    {
      name: 'Umhlanga Reed Dance Cultural Experience',
      description:
        'Witness the traditional Umhlanga ceremony and celebrate Swazi culture with music, dance, and local cuisine.',
      startTime: new Date('2026-08-30T09:00:00Z'),
      endTime: new Date('2026-08-30T17:00:00Z'),
      address: 'Ludzidzini Royal Residence',
      city: 'Lobamba',
      type: EventType.COMMUNITY,
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      capacity: 5000,
      isFeatured: true,
      ticketTypes: [
        { name: 'Spectator Pass', type: TicketType.GENERAL_ADMISSION, price: 50, quantity: 4000 },
      ],
    },
  ];

  for (const ev of eventsData) {
    const slug = slugify(ev.name, { lower: true, strict: true });

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Event already exists: ${ev.name}`);
      continue;
    }

    const event = await prisma.event.create({
      data: {
        name: ev.name,
        description: ev.description,
        startTime: ev.startTime,
        endTime: ev.endTime,
        address: ev.address,
        city: ev.city,
        country: 'Eswatini',
        type: ev.type,
        status: EventStatus.PUBLISHED,
        imageUrl: ev.imageUrl,
        capacity: ev.capacity,
        isFeatured: ev.isFeatured,
        organizerId: organizer.id,
        slug,
        publishedAt: new Date(),
        isFree: false,
        dynamicPricing: false,
        isApproved: true,
        ussdEnabled: false,
        isArchived: false,
        allowRefunds: false,
        refundPolicy: 'NO_REFUNDS',
        isOnline: false,
      },
    });

    for (const tt of ev.ticketTypes) {
      await prisma.ticketTypeConfig.create({
        data: {
          name: tt.name,
          type: tt.type,
          price: tt.price,
          basePrice: tt.price,
          currentPrice: tt.price,
          quantity: tt.quantity,
          eventId: event.id,
          status: ApprovalStatus.APPROVED,
          isActive: true,
          minPerOrder: 1,
          maxPerOrder: 10,
        },
      });
    }

    console.log(`Created event: ${ev.name} (${event.id})`);
  }

  console.log('\nSeed complete.');
  console.log('Demo credentials (password for all: Password123!):');
  console.log('  Organizer : organizer@eswatinievents.sz');
  console.log('  Attendee  : attendee@eswatinievents.sz');
  console.log('  Gate Op   : gate@eswatinievents.sz');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
