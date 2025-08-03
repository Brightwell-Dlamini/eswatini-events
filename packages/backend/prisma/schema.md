// Prisma Schema for Event Management System
// Optimized for Eswatini’s 40k-ticket events, urban/rural UX, and cultural fit
// Last updated: August 1, 2025

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "mongodb"
url = env("DATABASE_URL")
}

// ==============================
// ENUMS
// ==============================
enum UserRole {
ATTENDEE
ORGANIZER
GATE_OPERATOR
SUPER_ADMIN
VENDOR
SPONSOR
VENUE_MANAGER
PERFORMER
GOVERNMENT
COMMUNITY
SUPPORT_AGENT
}

enum Permission {
EVENT_CREATE
EVENT_PUBLISH
EVENT_DELETE
TICKET_MANAGE
VENDOR_APPROVE
REFUND_PROCESS
PAYOUT_INITIATE
CONTENT_MODERATE
USER_MANAGE
SETTINGS_UPDATE
ANALYTICS_VIEW
REPORTS_GENERATE
}

enum ReportFormat {
PDF
CSV
EXCEL
JSON
}

enum ReportStatus {
QUEUED
PROCESSING
COMPLETED
FAILED
}

enum IntegrationType {
PAYMENT_GATEWAY
SOCIAL_MEDIA
ANALYTICS
EMAIL_SERVICE
SMS_GATEWAY
CLOUD_STORAGE
}

enum WebhookEvent {
TICKET_SOLD
ATTENDEE_CHECKED_IN
PAYMENT_PROCESSED
REFUND_ISSUED
EVENT_PUBLISHED
}

enum TicketStatus {
PENDING
VALID
SCANNED
REFUNDED
TRANSFERRED
CANCELLED
EXPIRED
}

enum PaymentMethod {
MOMO
MPESA
VISA
MASTERCARD
CASH
BANK_TRANSFER
WRISTBAND_TOPUP
STRIPE
PAYPAL
FLUTTERWAVE
}

enum EventType {
MUSIC
SPORTS
FESTIVAL
CONFERENCE
COMMUNITY
CORPORATE
ARTS
FOOD
RELIGIOUS
EDUCATION
WEDDING
EXPOSURE
NETWORKING
FUNDRAISER
}

enum EventStatus {
PENDING
APPROVED
REJECTED
DRAFT
PUBLISHED
CANCELLED
COMPLETED
POSTPONED
}

enum TicketType {
GENERAL_ADMISSION
VIP
EARLY_BIRD
STUDENT
SENIOR
GROUP
SEASON_PASS
BACKSTAGE
TABLE
BOOTH
MERCHANDISE
}

enum RefundPolicy {
NO_REFUNDS
FLEXIBLE
MODERATE
STRICT
CUSTOM
}

enum Language {
ENGLISH
SISWATI
FRENCH
PORTUGUESE
ZULU
}

enum SignupMethod {
EMAIL_PHONE
EMAIL_ONLY
SOCIAL
PHONE_ONLY
}

enum PlatformType {
WEB
PWA
IOS
ANDROID
SCANNER_DEVICE
}

enum NotificationChannel {
EMAIL
SMS
WHATSAPP
PUSH
IN_APP
USSD
}

enum NotificationPriority {
LOW
HIGH
CRITICAL
}

enum USSDSessionStatus {
PENDING
SELECTED
PURCHASED
FAILED
}

enum LoyaltyTier {
BRONZE
SILVER
GOLD
}

enum RewardType {
DISCOUNT
FREE_TICKET
MERCHANDISE
}

enum RateLimitType {
USER
IP
TENANT
}

enum VendorOrderStatus {
PENDING
CONFIRMED
DELIVERED
CANCELLED
}

enum FraudStatus {
CLEAR
SUSPECT
BLOCKED
}

enum ApprovalStatus {
PENDING
APPROVED
REJECTED
}

// ==============================
// CORE MODELS
// ==============================
model Tenant {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
region String
currency String @default("SZL")
supportedCurrencies String[] @default(["SZL", "ZAR"])
settings Json? // { defaultConfig: { pricing: "SZL", language: "SISWATI" } }
isActive Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Relations
events Event[] @relation("TenantEvents")
users User[] @relation("TenantUsers")
apiRateLimits APIRateLimit[] @relation("TenantRateLimits")
APIRateLimit APIRateLimit[]

@@index([region])
}

model User {
id String @id @default(auto()) @map("\_id") @db.ObjectId
email String? @unique
password String?
phone String?
countryCode String? @default("+268")
name String?
role UserRole
biometricId String?
biometricConsent Boolean? @default(false)
socialId String?
provider String?
language Language @default(ENGLISH)
profilePhoto String?
isVerified Boolean @default(false)
signupMethod SignupMethod @default(EMAIL_PHONE)
lastSeenOffline DateTime?
isOffline Boolean @default(false)
lastPlatform PlatformType?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime? @map("deleted_at")
canResellTickets Boolean @default(false)
fraudScore Float? @default(0.0) // For automated risk assessment
deviceTokens DeviceToken[]

// Relations
accounts Account[]
tenant Tenant? @relation("TenantUsers", fields: [tenantId], references: [id], onDelete: SetNull)
tenantId String? @db.ObjectId
resolvedScanConflicts ScanConflict[] @relation("ScanConflictResolver")
followers UserFollows[] @relation("Followers")
following UserFollows[] @relation("Following")
tickets Ticket[]
payments Payment[]
organizedEvents Event[] @relation("OrganizedEvents")
vendorSales Vendor[] @relation("VendorSales")
sponsorships Sponsor[] @relation("Sponsorships")
managedVenues Venue[] @relation("ManagedVenues")
operatorScans Scan[] @relation("OperatorScans")
transfersTo Transfer[] @relation("TransfersTo")
transfersFrom Transfer[] @relation("TransfersFrom")
wristbands Wristband[]
auditLogs AuditLog[]
favorites Favorite[]
notifications Notification[]
payoutAccounts PayoutAccount[]
cashierPayments Payment[] @relation("PaymentCashier")
processedRefunds Refund[] @relation("ProcessedRefunds")
createdPromos Promo[] @relation("CreatedPromos")
payouts Payout[] @relation("UserPayouts")
waitlist Waitlist[]
referrals Referral[]
createdReports Report[] @relation("ReportCreator")
ownedReports Report[] @relation("ReportOwner")
apiKeys APIKey[]
userAnalytics UserAnalytics[]
permissions RolePermission[]
apiRateLimits APIRateLimit[] @relation("UserRateLimits")
loyaltyProgram LoyaltyProgram? @relation("UserLoyalty")
ussdSessions USSDSession[]
groupBookings GroupBooking[] @relation("GroupBookingLeader")
vendorOrders VendorOrder[]
recommendations Recommendation[]
sharedEvents EventShare[]
verifications UserVerification[]
ResalePayment ResalePayment[]
resalesAsSeller Resale[] @relation("ResaleSeller")
resalesAsBuyer Resale[] @relation("ResaleBuyer")
resaleListings ResaleListing[]
communityAgent CommunityAgent?
sentMessages ChatMessage[] @relation("MessageSender")
receivedMessages ChatMessage[] @relation("MessageRecipient")
offlineActions OfflineAction[]
resaleBatches ResaleBatch[]
resaleNotifications ResaleNotification[]
PasswordResetToken PasswordResetToken[]
Session Session[]
Review Review[]
RSVP RSVP[]
Integration Integration[]
Webhook Webhook[]
APIRateLimit APIRateLimit[]
createdIntegrations Integration[] @relation("UserCreatedIntegrations")
ownedIntegrations Integration[] @relation("IntegrationOwner")
createdWebhooks Webhook[] @relation("UserCreatedWebhooks")
ownedWebhooks Webhook[] @relation("WebhookOwner")

@@index([role])
@@index([tenantId])
@@index([deletedAt])
@@index([email, signupMethod])
@@index([tenantId, role])
@@index([role, createdAt])
@@index([isVerified, createdAt])
@@index([email, phone])
}

model PasswordResetToken {
id String @id @default(auto()) @map("\_id") @db.ObjectId
token String @unique
userId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
expiresAt DateTime
createdAt DateTime @default(now())

@@index([userId])
}

model Account {
id String @id @default(auto()) @map("\_id") @db.ObjectId
userId String @db.ObjectId
type String
provider String
providerAccountId String
refresh_token String?
access_token String?
expires_at Int?
token_type String?
scope String?
id_token String?
session_state String?

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@unique([provider, providerAccountId])
@@index([userId])
}

model UserFollows {
id String @id @default(auto()) @map("\_id") @db.ObjectId
followerId String @db.ObjectId
followingId String @db.ObjectId
createdAt DateTime @default(now())

follower User @relation("Followers", fields: [followerId], references: [id])
following User @relation("Following", fields: [followingId], references: [id])

@@unique([followerId, followingId])
}

model Session {
id String @id @default(auto()) @map("\_id") @db.ObjectId
token String @unique
platform PlatformType?
ipAddress String?
userAgent String?
lastActive DateTime @default(now())
expiresAt DateTime?
createdAt DateTime @default(now())
deviceType String? // 'mobile', 'desktop', 'pwa'
offlineData Json? // For PWA offline syncing
location Json? // { city, country } from IP lookup

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
deviceTokenId String? @db.ObjectId
deviceToken DeviceToken? @relation(fields: [deviceTokenId], references: [id])

@@index([userId])
}

model DeviceToken {
id String @id @default(auto()) @map("\_id") @db.ObjectId
token String @unique
platform PlatformType
language Language @default(ENGLISH)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
sessions Session[] @relation

@@index([userId])
}

model Review {
id String @id @default(auto()) @map("\_id") @db.ObjectId
rating Int
comment String?
isApproved Boolean @default(false)
createdAt DateTime @default(now())

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([eventId])
@@index([userId])
}

model RolePermission {
id String @id @default(auto()) @map("\_id") @db.ObjectId
role UserRole
permission Permission
createdAt DateTime @default(now())

user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
userId String? @db.ObjectId

@@unique([role, permission])
@@index([userId])
}

model UserVerification {
id String @id @default(auto()) @map("\_id") @db.ObjectId
idPhoto String
status ApprovalStatus @default(PENDING)
verifiedAt DateTime?
expiresAt DateTime
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
fraudScore Float? @default(0.0) // For automated risk assessment

user User @relation(fields: [userId], references: [id])
userId String @db.ObjectId

@@index([userId])
}

model UserAnalytics {
id String @id @default(auto()) @map("\_id") @db.ObjectId
eventsAttended Int
ticketsPurchased Int
totalSpend Float
favoriteCategories String[]
deviceUsage Json?
recommendationHistory Json[]
updatedAt DateTime @updatedAt
engagementScore Float? @default(0.0)
preferredEventTypes String[] @default([])

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([userId])
}

model LoyaltyProgram {
id String @id @default(auto()) @map("\_id") @db.ObjectId
points Int @default(0)
tier LoyaltyTier @default(BRONZE)
activities Json[]
rewards Json[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
checkInStreak Int @default(0)
eventShares Int @default(0)

user User @relation("UserLoyalty", fields: [userId], references: [id], onDelete: Cascade)
userId String @unique @db.ObjectId

@@index([userId, tier])
}

// ==============================
// EVENT MANAGEMENT
// ==============================
model Event {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
localizedName String?
description String
localizedDescription String?
startTime DateTime
endTime DateTime?
imageUrl String
coverImage String?
type EventType
isOnline Boolean @default(false)
allowRefunds Boolean @default(false)
refundPolicy RefundPolicy @default(NO_REFUNDS)
customRefundPolicy String?
dynamicPricing Boolean @default(false)
status EventStatus @default(PENDING)
eventProposal String? // For SUPER_ADMIN review
capacity Int?
ageRestriction Int?
isFeatured Boolean @default(false)
socialLinks String[]
hashtags String[]
isCashless Boolean @default(false)
isFree Boolean @default(false)
minPrice Float?
maxPrice Float?
slug String @unique
isApproved Boolean @default(false)
approvalNotes String?
accessibilityFeatures String[]
accessibilityDetails Json?
ussdEnabled Boolean @default(false)
isArchived Boolean @default(false)
address String?
city String?
country String @default("Eswatini")
coordinates Json?
popularityScore Float? @default(0.0)
trendingBoost Float? @default(0.0)
seoKeywords String[]
onlineDetails Json?
doorTime DateTime?
schedule Json?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime? @map("deleted_at")
publishedAt DateTime?
culturalEngagement Json? // { communityAttendance: 500, traditionalPerformers: 10 }
liveAttendeeCount Int? @default(0)

tenant Tenant? @relation("TenantEvents", fields: [tenantId], references: [id], onDelete: SetNull)
tenantId String? @db.ObjectId
organizer User @relation("OrganizedEvents", fields: [organizerId], references: [id], onDelete: Cascade)
organizerId String @db.ObjectId
venue Venue? @relation(fields: [venueId], references: [id], onDelete: SetNull)
venueId String? @db.ObjectId
tickets Ticket[]
ticketTypes TicketTypeConfig[]
payments Payment[]
vendors Vendor[]
sponsors Sponsor[]
promos Promo[]
checkIns CheckIn[]
wristbands Wristband[]
ads Ad[]
dynamicPricingRules DynamicPricingRule[]
socialMediaPosts SocialMediaPost[]
reviews Review[]
faqs FAQ[]
taxRules TaxRule[]
payoutRules PayoutRule[]
boothAssignments BoothAssignment[]
scans Scan[]
favorites Favorite[]
notifications Notification[]
eventPayouts Payout[] @relation("EventPayouts")
eventCategories EventCategoryEvent[] @relation("EventCategories")
waitlist Waitlist[]
escrow Escrow[]
deviceCache DeviceCache[]
eventAnalytics EventAnalytics[]
ussdSessions USSDSession[]
groupBookings GroupBooking[]
vendorOrders VendorOrder[]
recommendations Recommendation[]
shares EventShare[]
cachedEvents CachedEvent[]
regionalPricing RegionalPricing[]
rewards Reward[] @relation("RewardEvent")
agentTicketStocks AgentTicketStock[]
chatMessages ChatMessage[]
resaleNotifications ResaleNotification[]
culturalConfig CulturalEventConfig? @relation("EventCulturalConfigs")
EventSearchIndex EventSearchIndex[]
RSVP RSVP[]
OfflineTicket OfflineTicket[]
Report Report[]
Webhook Webhook[]

@@index([organizerId])
@@index([startTime])
@@index([type])
@@index([deletedAt])
@@index([isFeatured])
@@index([tenantId])
@@index([popularityScore])
@@index([coordinates])
@@index([startTime, status, isFeatured])
@@index([organizerId, status])
@@index([type, status, startTime])
@@index([status, isFeatured, startTime])
@@index([tenantId, status])
@@index([city, startTime])
@@index([startTime, status])
@@index([city, type, startTime]) // For search
}

model EventCategory {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
image String?
isFeatured Boolean @default(false)
order Int @default(0)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

parentCategoryId String? @db.ObjectId
parentCategory EventCategory? @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id], onDelete: NoAction, onUpdate: NoAction)
subcategories EventCategory[] @relation("CategoryHierarchy")
events EventCategoryEvent[] @relation("EventCategories")

@@index([name])
}

model EventCategoryEvent {
id String @id @default(auto()) @map("\_id") @db.ObjectId
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation("EventCategories", fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
category EventCategory @relation("EventCategories", fields: [categoryId], references: [id], onDelete: Cascade)
categoryId String @db.ObjectId

@@index([eventId])
@@index([categoryId])
}

model EventSearchIndex {
id String @id @default(auto()) @map("\_id") @db.ObjectId
keywords String[] // For MongoDB text index
location String?
eventType EventType?
startTime DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
@@index([keywords])
}

model EventShare {
id String @id @default(auto()) @map("\_id") @db.ObjectId
platform String // WHATSAPP, X, etc.
shareUrl String // With UTM params
createdAt DateTime @default(now())
rewardPoints Int @default(0)

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([eventId, userId])
}

model EventAnalytics {
id String @id @default(auto()) @map("\_id") @db.ObjectId
totalTicketsSold Int
totalRevenue Float
attendanceRate Float
checkInTimes Json?
demographicBreakdown Json?
popularTicketTypes Json?
vendorSales Json?
resaleMetrics Json? // Consolidated from ResaleMarketplaceAnalytics
socialShares Json? // { WHATSAPP: 50, X: 20 }
agentSales Json? // CommunityAgent sales tracking
culturalEngagement Json? // { communityAttendance: 500, traditionalPerformers: 10 }
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model CachedEvent {
id String @id @default(auto()) @map("\_id") @db.ObjectId
views Int @default(0)
lastUpdated DateTime @default(now())
data Json

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model Favorite {
id String @id @default(auto()) @map("\_id") @db.ObjectId
createdAt DateTime @default(now())

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@unique([userId, eventId])
@@index([userId])
@@index([eventId])
}

model RegionalPricing {
id String @id @default(auto()) @map("\_id") @db.ObjectId
region String
discount Float @default(0.0)

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model Venue {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
capacity Int
address String
city String
country String @default("Eswatini")
coordinates Json?
images String[]
amenities String[]
isApproved Boolean @default(false)
contactName String?
contactEmail String?
contactPhone String?
openingHours Json?
parkingInfo String?
accessibilityInfo String?
accessibilityCertifications String[]
emergencyContacts Json? // Moved from Event
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

manager User @relation("ManagedVenues", fields: [managerId], references: [id], onDelete: Cascade)
managerId String @db.ObjectId
events Event[]
checkIns CheckIn[]
seatingConfigs SeatingConfig[]

@@index([managerId])
}

model SeatingConfig {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
layout Json?
isActive Boolean @default(true)
capacity Int?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

venue Venue @relation(fields: [venueId], references: [id], onDelete: Cascade)
venueId String @db.ObjectId
sections SeatSection[]

@@index([venueId])
}

model SeatSection {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
capacity Int
priceMultiplier Float? @default(1.0)
rows Json?
seats Json?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

seatingConfig SeatingConfig @relation(fields: [seatingConfigId], references: [id], onDelete: Cascade)
seatingConfigId String @db.ObjectId
dynamicPricingRules DynamicPricingRule[] @relation("SeatSectionPricingRules")

@@index([seatingConfigId])
}

model FAQ {
id String @id @default(auto()) @map("\_id") @db.ObjectId
question String
answer String
order Int @default(0)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model RSVP {
id String @id @default(auto()) @map("\_id") @db.ObjectId
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([eventId, userId])
}

// ==============================
// TICKETING
// ==============================
model TicketTypeConfig {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
localizedName String?
type TicketType
price Float
basePrice Float?
currentPrice Float?
description String?
localizedDescription String?
quantity Int?
sold Int @default(0)
reserved Int @default(0)
salesStart DateTime?
salesEnd DateTime?
isActive Boolean @default(true)
status ApprovalStatus @default(PENDING)
minPerOrder Int @default(1)
maxPerOrder Int @default(10)
isTransferable Boolean @default(true)
isRefundable Boolean @default(true)
visibility String @default("PUBLIC")
colorCode String?
seatingInfo String?
dynamicAlgorithm String?
minPrice Float?
maxPrice Float?
waitlistEnabled Boolean @default(false)
groupDiscount Float? @default(0.0) // e.g., 0.1 for 10% off 5+ tickets
resaleWaitlistThreshold Int?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
tickets Ticket[]
promoTicketTypes PromoTicketType[] @relation("PromoTicketTypes")
dynamicPricingRules DynamicPricingRule[] @relation("TicketTypePricingRules")
ussdSessions USSDSession[]
waitlist Waitlist[]
groupBookings GroupBooking[]
resaleNotifications ResaleNotification[]
OfflineTicket OfflineTicket[]

@@index([eventId])
@@index([salesEnd])
@@index([status])
}

model Ticket {
id String @id @default(auto()) @map("\_id") @db.ObjectId
ticketNumber String @unique
price Float
status TicketStatus
qrCode String
qrRegenerationCount Int @default(0)
nfcId String? @unique
isReserved Boolean @default(false)
reservedUntil DateTime?
refundAmount Float? @default(0.0)
offlineValidationCode String?
lastSynced DateTime?
transferFee Float? @default(0.0)
originalPrice Float?
isResale Boolean @default(false)
purchaseAnomalies Json?
isArchived Boolean @default(false)
requiresKYC Boolean @default(false) // Optional for tickets < SZL 500
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime? @map("deleted_at")
isResaleLocked Boolean @default(false)
resaleListings ResaleListing[]
resaleBatchId String? @db.ObjectId
resaleBatch ResaleBatch? @relation(fields: [resaleBatchId], references: [id])

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
ticketType TicketTypeConfig @relation(fields: [ticketTypeId], references: [id], onDelete: Cascade)
ticketTypeId String @db.ObjectId
payment Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)
paymentId String? @db.ObjectId
owner User? @relation(fields: [ownerId], references: [id], onDelete: SetNull)
ownerId String? @db.ObjectId
groupBooking GroupBooking? @relation(fields: [groupBookingId], references: [id], onDelete: SetNull)
groupBookingId String? @db.ObjectId
transfers Transfer[]
smsTransfers smsTransfer[]
resales Resale[]
scans Scan[]
sales Sale[]
checkIns CheckIn[]
refunds Refund[]
notifications Notification[]

@@index([eventId])
@@index([deletedAt])
@@index([ownerId])
@@index([status])
@@index([qrCode])
@@index([eventId, status, createdAt])
@@index([ownerId, status])
@@index([ticketTypeId, status])
@@index([ownerId, status, eventId])
}

model OfflineTicket {
id String @id @default(auto()) @map("\_id") @db.ObjectId
ticketNumber String @unique
qrCode String @unique
status TicketStatus @default(PENDING)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
agentId String @db.ObjectId
agent CommunityAgent @relation(fields: [agentId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
ticketTypeId String @db.ObjectId
ticketType TicketTypeConfig @relation(fields: [ticketTypeId], references: [id], onDelete: Cascade)

@@index([agentId])
@@index([eventId])
@@index([ticketTypeId])
}

model smsTransfer {
id String @id @default(auto()) @map("\_id") @db.ObjectId
ticketId String @db.ObjectId
smsPin String @unique
senderPhone String
status String @default("PENDING")
expiresAt DateTime @default(now())

completedTransferId String? @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

@@index([ticketId])
}

model Transfer {
id String @id @default(auto()) @map("\_id") @db.ObjectId
fee Float @default(0.0)
status String @default("COMPLETED")
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

smsTransferId String? @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
ticketId String @db.ObjectId
newOwner User @relation("TransfersTo", fields: [newOwnerId], references: [id], onDelete: Cascade)
newOwnerId String @db.ObjectId
oldOwner User @relation("TransfersFrom", fields: [oldOwnerId], references: [id], onDelete: Cascade)
oldOwnerId String @db.ObjectId

@@index([ticketId])
}

model Resale {
id String @id @default(auto()) @map("\_id") @db.ObjectId
ticketId String @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
sellerId String @db.ObjectId
seller User @relation("ResaleSeller", fields: [sellerId], references: [id], onDelete: Cascade)
buyerId String? @db.ObjectId
buyer User? @relation("ResaleBuyer", fields: [buyerId], references: [id])
listPrice Float
platformFee Float @default(0.1)
status String @default("LISTED")
escrowId String? @db.ObjectId
createdAt DateTime @default(now())

@@index([ticketId])
@@index([sellerId])
}

model ResaleBatch {
id String @id @default(auto()) @map("\_id") @db.ObjectId
sellerId String @db.ObjectId
seller User @relation(fields: [sellerId], references: [id], onDelete: Cascade)
tickets Ticket[]
pricingStrategy String // "SAME_PRICE", "TIERED", "BUNDLE_DISCOUNT"
batchDiscount Float? @default(0.0)
createdAt DateTime @default(now())

@@index([sellerId])
}

model ResaleListing {
id String @id @default(auto()) @map("\_id") @db.ObjectId
ticketId String @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
sellerId String @db.ObjectId
seller User @relation(fields: [sellerId], references: [id], onDelete: Cascade)
listPrice Float
platformFee Float @default(0.1)
status ApprovalStatus @default(PENDING)
expiresAt DateTime
requiresKYC Boolean @default(true)
pricingRecommendations ResalePricingRecommendation[]
payments ResalePayment[]

@@index([ticketId])
@@index([sellerId])
@@index([status])
}

model DynamicPricingRule {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
algorithm String
parameters Json
isActive Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event? @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String? @db.ObjectId
ticketType TicketTypeConfig? @relation("TicketTypePricingRules", fields: [ticketTypeId], references: [id], onDelete: Cascade)
ticketTypeId String? @db.ObjectId
seatSection SeatSection? @relation("SeatSectionPricingRules", fields: [seatSectionId], references: [id], onDelete: Cascade)
seatSectionId String? @db.ObjectId

@@index([eventId])
@@index([ticketTypeId])
@@index([seatSectionId])
}

model ResalePayment {
id String @id @default(auto()) @map("\_id") @db.ObjectId
resaleId String @db.ObjectId
amount Float
buyerId String @db.ObjectId
releasedToSeller Boolean @default(false)
releasedAt DateTime?

buyer User @relation(fields: [buyerId], references: [id], onDelete: Cascade)
listing ResaleListing @relation(fields: [listingId], references: [id], onDelete: Cascade)
listingId String @db.ObjectId

@@index([buyerId])
@@index([listingId])
}

model ResalePricingRecommendation {
id String @id @default(auto()) @map("\_id") @db.ObjectId
listingId String @db.ObjectId
listing ResaleListing @relation(fields: [listingId], references: [id], onDelete: Cascade)
recommendedPrice Float
confidenceScore Float @default(0.0)
factors Json // { demandLevel: "HIGH", daysUntilEvent: 3, xMentions: 50 }
createdAt DateTime @default(now())

@@index([listingId])
}

model Scan {
id String @id @default(auto()) @map("\_id") @db.ObjectId
location String?
deviceId String?
isManual Boolean @default(false)
isOffline Boolean @default(false)
syncStatus String? @default("SYNCED")
notes String?
conflictId String?
resolved Boolean @default(false)
offlineData Json?
retryCount Int @default(0)
createdAt DateTime @default(now())
geofence Json?

ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
ticketId String @db.ObjectId
operator User @relation("OperatorScans", fields: [operatorId], references: [id], onDelete: Cascade)
operatorId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
conflictsAsA ScanConflict[] @relation("ConflictScanA")
conflictsAsB ScanConflict[] @relation("ConflictScanB")

@@unique([conflictId, ticketId])
@@index([ticketId])
@@index([operatorId])
@@index([eventId])
}

model ScanConflict {
id String @id @default(auto()) @map("\_id") @db.ObjectId
actionTaken String @default("MERGE")
createdAt DateTime @default(now())

scanA Scan @relation("ConflictScanA", fields: [scanAId], references: [id], onDelete: Cascade)
scanAId String @db.ObjectId
scanB Scan @relation("ConflictScanB", fields: [scanBId], references: [id], onDelete: Cascade)
scanBId String @db.ObjectId
resolvedBy User? @relation("ScanConflictResolver", fields: [resolvedById], references: [id])
resolvedById String? @db.ObjectId

@@index([scanAId])
@@index([scanBId])
}

model CheckIn {
id String @id @default(auto()) @map("\_id") @db.ObjectId
isOffline Boolean @default(false)
syncStatus String? @default("SYNCED")
notes String?
offlineData Json?
retryCount Int @default(0)
createdAt DateTime @default(now())
isGroup Boolean @default(false) // For group check-ins
vipStatus Boolean @default(false) // For VIP lists

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
venue Venue @relation(fields: [venueId], references: [id], onDelete: Cascade)
venueId String @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
ticketId String @db.ObjectId
wristband Wristband? @relation(fields: [wristbandId], references: [id], onDelete: SetNull)
wristbandId String? @db.ObjectId

@@index([eventId])
@@index([ticketId])
@@index([wristbandId])
}

model Waitlist {
id String @id @default(auto()) @map("\_id") @db.ObjectId
position Int
priority Int @default(0)
autoNotify Boolean @default(true)
notifiedAt DateTime?
createdAt DateTime @default(now())
autoPurchaseResale Boolean @default(false)
maxResalePremium Float @default(1.5) // 50% above face value
paymentMethodId String? @db.ObjectId

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
ticketType TicketTypeConfig? @relation(fields: [ticketTypeId], references: [id], onDelete: SetNull)
ticketTypeId String? @db.ObjectId

@@index([eventId, ticketTypeId, priority])
}

model GroupBooking {
id String @id @default(auto()) @map("\_id") @db.ObjectId
groupName String
status String @default("PENDING")
shareLink String? @unique
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

leader User @relation("GroupBookingLeader", fields: [leaderId], references: [id], onDelete: Cascade)
leaderId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
ticketType TicketTypeConfig? @relation(fields: [ticketTypeId], references: [id], onDelete: SetNull)
ticketTypeId String? @db.ObjectId
tickets Ticket[]
notifications Notification[]

@@index([eventId, leaderId])
}

// ==============================
// PAYMENT PROCESSING
// ==============================
model Payment {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
fee Float @default(0.0)
currency String @default("SZL")
method PaymentMethod
status ApprovalStatus @default(PENDING)
reference String?
processorId String?
isRefunded Boolean @default(false)
refundAmount Float? @default(0.0)
refundReason String?
isOffline Boolean @default(false)
offlineReceiptImage String?
exchangeRate Float? @default(1.0)
foreignAmount Float?
foreignCurrency String?
riskScore Float? @default(0.0)
currencyLocked Boolean @default(false)
isArchived Boolean @default(false)
preferredCurrency String?
conversionFee Float? @default(0.0)
fraudStatus FraudStatus? @default(CLEAR)
cashHandoverReceipt String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
idempotencyKey String? @unique

event Event? @relation(fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId
user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
userId String? @db.ObjectId
cashier User? @relation("PaymentCashier", fields: [cashierId], references: [id])
cashierId String? @db.ObjectId
tickets Ticket[]
topUps TopUp[]
refunds Refund[]
payout Payout? @relation(fields: [payoutId], references: [id], onDelete: SetNull)
payoutId String? @db.ObjectId
sales Sale[]
notifications Notification[]
vendorOrders VendorOrder[]

@@index([userId])
@@index([eventId])
@@index([status])
@@index([reference])
@@index([userId, eventId, status])
@@index([preferredCurrency])
@@index([fraudStatus])
@@index([userId, status, createdAt])
@@index([eventId, status, createdAt])
@@index([method, status])
@@index([createdAt, method, status])
}

model Refund {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
reason String?
status ApprovalStatus @default(PENDING)
processedAt DateTime?
isOffline Boolean @default(false)
offlineReceiptImage String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
idempotencyKey String? @unique

payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
paymentId String @db.ObjectId
ticket Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
ticketId String @db.ObjectId
processedBy User? @relation("ProcessedRefunds", fields: [processedById], references: [id], onDelete: SetNull)
processedById String? @db.ObjectId

@@index([paymentId])
@@index([ticketId])
@@index([status])
}

model Payout {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
fee Float @default(0.0)
reference String?
status String @default("PENDING")
method PaymentMethod
processedAt DateTime?
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

vendor Vendor? @relation(fields: [vendorId], references: [id], onDelete: SetNull)
vendorId String? @db.ObjectId
user User? @relation("UserPayouts", fields: [userId], references: [id], onDelete: SetNull)
userId String? @db.ObjectId
event Event? @relation("EventPayouts", fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId
payments Payment[]
payoutAccount PayoutAccount? @relation(fields: [payoutAccountId], references: [id], onDelete: SetNull)
payoutAccountId String? @db.ObjectId
escrow Escrow[]

@@index([vendorId])
@@index([status])
}

model PayoutAccount {
id String @id @default(auto()) @map("\_id") @db.ObjectId
type String
details Json
isDefault Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
payouts Payout[]

@@index([userId])
}

model Escrow {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
releasedAt DateTime?
createdAt DateTime @default(now())
status String @default("PENDING") // PENDING, RELEASED, REFUNDED

resaleId String? @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
payout Payout? @relation(fields: [payoutId], references: [id], onDelete: SetNull)
payoutId String? @db.ObjectId

@@index([eventId])
}

model TaxRule {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
rate Float
isInclusive Boolean @default(false)
appliesTo String @default("ALL")
countryCode String? // ZA, SZ
taxType String? // VAT, SALES_TAX
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model PayoutRule {
id String @id @default(auto()) @map("\_id") @db.ObjectId
holdPeriod Int @default(24)
autoRelease Boolean @default(true)
minAmount Float?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

// ==============================
// VENDOR MANAGEMENT
// ==============================
model Vendor {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
logo String?
website String?
isApproved Boolean @default(false)
taxId String?
bankAccount Json?
payoutSchedule String?
minPayoutAmount Float? @default(500.0)
serviceFee Float? @default(0.0)
marketplaceEnabled Boolean @default(false)
cashReconciliationLogs Json?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime? @map("deleted_at")
encryptionKey String
fraudScore Float? @default(0.0) // For automated risk assessment

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation("VendorSales", fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
sales Sale[]
inventory VendorInventory[]
menuItems MenuItem[]
payouts Payout[]
boothAssignments BoothAssignment[]
vendorOrders VendorOrder[]
analytics VendorAnalytics[]

@@index([eventId])
@@index([eventId, userId])
@@index([userId])
@@index([deletedAt])
}

model VendorAnalytics {
id String @id @default(auto()) @map("\_id") @db.ObjectId
salesData Json
inventoryData Json
customerData Json
updatedAt DateTime @updatedAt

vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId

@@index([vendorId])
}

model BoothAssignment {
id String @id @default(auto()) @map("\_id") @db.ObjectId
boothNumber String
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
@@index([vendorId])
}

model VendorInventory {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
quantity Int
price Float
image String?
sku String?
isTaxable Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId
sales Sale[]

@@index([vendorId])
}

model MenuItem {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
price Float
category String?
image String?
isAvailable Boolean @default(true)
isFeatured Boolean @default(false)
isPreOrderable Boolean @default(false)
preOrderDeadline DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId
vendorOrders VendorOrder[]

@@index([vendorId])
}

model VendorOrder {
id String @id @default(auto()) @map("\_id") @db.ObjectId
quantity Int @default(1)
status VendorOrderStatus @default(PENDING)
deliveryTime DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
menuItem MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
menuItemId String @db.ObjectId
payment Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)
paymentId String? @db.ObjectId

@@index([userId, eventId])
}

model Sale {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
quantity Int @default(1)
items Json?
taxAmount Float? @default(0.0)
discountAmount Float? @default(0.0)
notes String?
createdAt DateTime @default(now())

vendor Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
vendorId String @db.ObjectId
ticket Ticket? @relation(fields: [ticketId], references: [id], onDelete: SetNull)
ticketId String? @db.ObjectId
wristband Wristband? @relation(fields: [wristbandId], references: [id], onDelete: SetNull)
wristbandId String? @db.ObjectId
inventory VendorInventory? @relation(fields: [inventoryId], references: [id], onDelete: SetNull)
inventoryId String? @db.ObjectId
payment Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)
paymentId String? @db.ObjectId

@@index([vendorId])
@@index([createdAt])
}

// ==============================
// PROMOTIONS & REWARDS
// ==============================
model Promo {
id String @id @default(auto()) @map("\_id") @db.ObjectId
code String @unique
discount Float
discountType String @default("PERCENTAGE")
description String?
maxUses Int?
uses Int @default(0)
minAmount Float?
isActive Boolean @default(true)
isPublic Boolean @default(false)
startDate DateTime?
endDate DateTime?
createdAt DateTime @default(now())
expiresAt DateTime?

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
createdBy User @relation("CreatedPromos", fields: [createdById], references: [id], onDelete: Cascade)
createdById String @db.ObjectId
ticketTypes PromoTicketType[] @relation("PromoTicketTypes")

@@index([eventId])
}

model PromoTicketType {
id String @id @default(auto()) @map("\_id") @db.ObjectId
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

promo Promo @relation("PromoTicketTypes", fields: [promoId], references: [id], onDelete: Cascade)
promoId String @db.ObjectId
ticketType TicketTypeConfig @relation("PromoTicketTypes", fields: [ticketTypeId], references: [id], onDelete: Cascade)
ticketTypeId String @db.ObjectId

@@index([promoId])
@@index([ticketTypeId])
}

model Reward {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
pointsCost Int
type RewardType
isActive Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event? @relation("RewardEvent", fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId

@@index([eventId])
}

model Referral {
id String @id @default(auto()) @map("\_id") @db.ObjectId
code String @unique
discount Float
uses Int @default(0)
createdAt DateTime @default(now())

referrer User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([userId])
}

// ==============================
// SPONSORSHIP & ADVERTISING
// ==============================
model Sponsor {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
description String?
logo String?
website String?
tier String? // GOLD, SILVER, etc.
contractStart DateTime?
contractEnd DateTime?
contactName String?
contactEmail String?
contactPhone String?
benefits String[]
promoCode String? @unique
conversions Json?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime? @map("deleted_at")

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
user User @relation("Sponsorships", fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
ads Ad[]

@@index([eventId])
@@index([userId])
@@index([deletedAt])
}

model Ad {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
content String?
imageUrl String?
targetUrl String?
impressions Int @default(0)
clicks Int @default(0)
startDate DateTime?
endDate DateTime?
isActive Boolean @default(true)
position String?
weight Int? @default(1)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

sponsor Sponsor @relation(fields: [sponsorId], references: [id], onDelete: Cascade)
sponsorId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([sponsorId])
@@index([eventId])
@@index([isActive])
}

// ==============================
// NOTIFICATIONS & COMMUNICATION
// ==============================
model Notification {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
message String
type String
isRead Boolean @default(false)
metadata Json?
channels NotificationChannel[]
isEmergency Boolean @default(false)
priority NotificationPriority @default(LOW)
createdAt DateTime @default(now())

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
event Event? @relation(fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId
ticket Ticket? @relation(fields: [ticketId], references: [id], onDelete: SetNull)
ticketId String? @db.ObjectId
payment Payment? @relation(fields: [paymentId], references: [id], onDelete: SetNull)
paymentId String? @db.ObjectId
groupBooking GroupBooking? @relation(fields: [groupBookingId], references: [id], onDelete: SetNull)
groupBookingId String? @db.ObjectId

@@index([userId])
@@index([isRead])
}

model ResaleNotification {
id String @id @default(auto()) @map("\_id") @db.ObjectId
userId String @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
ticketTypeId String? @db.ObjectId
ticketType TicketTypeConfig? @relation(fields: [ticketTypeId], references: [id])
triggerType String // "PRICE_DROP", "NEW_LISTING", "WAITLIST_MATCH", "LOW_INVENTORY"
seen Boolean @default(false)
createdAt DateTime @default(now())

@@index([userId, eventId])
}

model USSDSession {
id String @id @default(auto()) @map("\_id") @db.ObjectId
phone String
sessionId String @unique
status USSDSessionStatus @default(PENDING)
expiresAt DateTime
fallbackSmsSent Boolean @default(false)
smsGateway String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deviceId String

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
ticketType TicketTypeConfig? @relation(fields: [ticketTypeId], references: [id], onDelete: SetNull)
ticketTypeId String? @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@unique([phone, deviceId])
@@index([phone, sessionId])
@@index([eventId])
@@index([userId])
}

model USSDMenu {
id String @id @default(auto()) @map("\_id") @db.ObjectId
code String @unique // e.g., "*384*92#"
title String // "Eswa Tickets USSD"
predefinedMenus Json // Simplified menu structure
isActive Boolean @default(true)
createdAt DateTime @default(now())
communityAgents CommunityAgent[]
}

model CommunityAgent {
id String @id @default(auto()) @map("\_id") @db.ObjectId
userId String @unique @db.ObjectId
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
location String
cashBalance Float @default(0.0)
assignedMenu String @db.ObjectId
ussdMenu USSDMenu @relation(fields: [assignedMenu], references: [id], onDelete: Cascade)
agentStatus ApprovalStatus @default(PENDING)
AgentTicketStock AgentTicketStock[]
offlineTickets OfflineTicket[]

}

model AgentTicketStock {
id String @id @default(auto()) @map("\_id") @db.ObjectId
agentId String @db.ObjectId
agent CommunityAgent @relation(fields: [agentId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
qrCodes String[] // Pre-generated QR codes for cash sales
issuedCount Int @default(0)

@@index([agentId])
@@index([eventId])
}

model SocialMediaPost {
id String @id @default(auto()) @map("\_id") @db.ObjectId
content String
platform String
url String
postId String?
metrics Json?
isSponsored Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([eventId])
}

model ChatMessage {
id String @id @default(auto()) @map("\_id") @db.ObjectId
content String
isRead Boolean @default(false)
createdAt DateTime @default(now())

sender User @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
senderId String @db.ObjectId
recipient User @relation("MessageRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
recipientId String @db.ObjectId
event Event? @relation(fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId

@@index([senderId, recipientId])
@@index([createdAt])
}

// ==============================
// ANALYTICS & REPORTING
// ==============================
model Report {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
description String?
type String
format ReportFormat
status ReportStatus @default(QUEUED)
downloadUrl String?
filters Json?
scheduled Boolean @default(false)
recurrence String?
isArchived Boolean @default(false)
createdAt DateTime @default(now())
completedAt DateTime?

createdBy User @relation("ReportCreator", fields: [createdById], references: [id], onDelete: Cascade)
createdById String @db.ObjectId
owner User? @relation("ReportOwner", fields: [ownerId], references: [id], onDelete: SetNull)
ownerId String? @db.ObjectId
relatedEvent Event? @relation(fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId

@@index([createdById])
@@index([eventId])
}

model Recommendation {
id String @id @default(auto()) @map("\_id") @db.ObjectId
score Float
source String // e.g., "MANUAL", "X_API", "USER_PREFERENCES"
createdAt DateTime @default(now())
expiresAt DateTime?

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId

@@index([userId, score])
}

// ==============================
// INTEGRATIONS & WEBHOOKS
// ==============================
model Integration {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
type IntegrationType
isActive Boolean @default(true)
credentials Json
settings Json?
lastSync DateTime?
syncStatus String @default("INACTIVE")
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

createdBy User @relation("UserCreatedIntegrations", fields: [createdById], references: [id], onDelete: Cascade)
createdById String @db.ObjectId
owner User? @relation("IntegrationOwner", fields: [ownerId], references: [id], onDelete: SetNull)
ownerId String? @db.ObjectId
User User? @relation(fields: [userId], references: [id])
userId String? @db.ObjectId

@@index([createdById])
}

model Webhook {
id String @id @default(auto()) @map("\_id") @db.ObjectId
url String
events WebhookEvent[]
secret String
isActive Boolean @default(true)
lastFiredAt DateTime?
lastStatus Int?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
retryPolicy Json?
timeoutMs Int @default(5000)
signingAlgorithm String @default("sha256")
isVerified Boolean @default(false)
verificationToken String?
lastVerifiedAt DateTime?
failureCount Int @default(0)
disableUntil DateTime?
headers Json?
contentType String @default("application/json")

createdBy User @relation("UserCreatedWebhooks", fields: [createdById], references: [id], onDelete: Cascade)
createdById String @db.ObjectId
owner User? @relation("WebhookOwner", fields: [ownerId], references: [id], onDelete: SetNull)
ownerId String? @db.ObjectId
primaryEvent Event? @relation(fields: [eventId], references: [id], onDelete: SetNull)
eventId String? @db.ObjectId
webhookLogs WebhookLog[]
User User? @relation(fields: [userId], references: [id])
userId String? @db.ObjectId

@@index([createdById])
@@index([eventId])
}

model WebhookLog {
id String @id @default(auto()) @map("\_id") @db.ObjectId
statusCode Int
payload Json?
response String?
duration Int?
event String
createdAt DateTime @default(now())
errorMessage String?
stackTrace String?

webhook Webhook @relation(fields: [webhookId], references: [id], onDelete: Cascade)
webhookId String @db.ObjectId

@@index([webhookId])
}

// ==============================
// WRISTBAND MANAGEMENT
// ==============================
model Wristband {
id String @id @default(auto()) @map("\_id") @db.ObjectId
code String @unique
balance Float @default(0.0)
isActive Boolean @default(true)
isOffline Boolean @default(false)
lastSynced DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId
event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
sales Sale[]
topUps TopUp[]
checkIns CheckIn[]

@@index([userId])
@@index([eventId])
}

model TopUp {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
fee Float @default(0.0)
isOffline Boolean @default(false)
syncStatus String? @default("SYNCED")
createdAt DateTime @default(now())

wristband Wristband @relation(fields: [wristbandId], references: [id], onDelete: Cascade)
wristbandId String @db.ObjectId
payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
paymentId String @db.ObjectId

@@index([wristbandId])
@@index([paymentId])
}

// ==============================
// SYSTEM & MONITORING
// ==============================
model AuditLog {
id String @id @default(auto()) @map("\_id") @db.ObjectId
action String // Added ticket purchases, failed logins
entityType String
entityId String?
metadata Json?
ipAddress String?
userAgent String?
location Json?
deviceInfo Json?
createdAt DateTime @default(now())
user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
userId String? @db.ObjectId

@@index([createdAt])
@@index([userId])
@@index([entityType, entityId])
}

model APIKey {
id String @id @default(auto()) @map("\_id") @db.ObjectId
key String @unique
name String
expiresAt DateTime?
lastUsedAt DateTime?
ipRestrictions String[] @default([])
rateLimit Int @default(1000)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([userId])
}

model APIRateLimit {
id String @id @default(auto()) @map("\_id") @db.ObjectId
identifier String
count Int @default(1)
windowStart DateTime @default(now())
windowEnd DateTime
route String
limitType RateLimitType @default(USER)
createdAt DateTime
Tenant Tenant? @relation(fields: [tenantId], references: [id])
tenantId String? @db.ObjectId
User User? @relation(fields: [userId], references: [id])
userId String? @db.ObjectId

//relations
tenant Tenant? @relation("TenantRateLimits", fields: [tenantId], references: [id])
user User? @relation("UserRateLimits", fields: [userId], references: [id])

}

model OfflineAction {
id String @id @default(auto()) @map("\_id") @db.ObjectId
actionType String
data Json
isSynced Boolean @default(false)
syncAttempts Int @default(0)
createdAt DateTime @default(now())
lastSyncAttempt DateTime?

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String @db.ObjectId

@@index([userId, isSynced])
}

model DeviceCache {
id String @id @default(auto()) @map("\_id") @db.ObjectId
data Json
lastUpdated DateTime @default(now())
expiresAt DateTime

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
eventId String @db.ObjectId
deviceId String

@@index([eventId, deviceId])
@@index([expiresAt])
}

model CulturalEventConfig {
id String @id @default(auto()) @map("\_id") @db.ObjectId
traditionalElements String[]
communityEngagement Json
culturalSignificance String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
event Event @relation("EventCulturalConfigs", fields: [eventId], references: [id], onDelete: Cascade)
eventId String @unique @db.ObjectId

}
