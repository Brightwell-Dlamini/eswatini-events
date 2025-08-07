export const EVENT_TYPES = [
    { value: 'MUSIC', label: 'Music' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'FESTIVAL', label: 'Festival' },
    { value: 'CONFERENCE', label: 'Conference' },
    { value: 'COMMUNITY', label: 'Community' },
    { value: 'CORPORATE', label: 'Corporate' },
    { value: 'ARTS', label: 'Arts' },
    { value: 'FOOD', label: 'Food' },
    { value: 'RELIGIOUS', label: 'Religious' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'WEDDING', label: 'Wedding' },
    { value: 'EXPOSURE', label: 'Exposure' },
    { value: 'NETWORKING', label: 'Networking' },
    { value: 'FUNDRAISER', label: 'Fundraiser' },
];

export const TICKET_TYPES = [
    { value: 'GENERAL_ADMISSION', label: 'General Admission' },
    { value: 'VIP', label: 'VIP' },
    { value: 'EARLY_BIRD', label: 'Early Bird' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'GROUP', label: 'Group' },
    { value: 'SEASON_PASS', label: 'Season Pass' },
    { value: 'BACKSTAGE', label: 'Backstage' },
    { value: 'TABLE', label: 'Table' },
    { value: 'BOOTH', label: 'Booth' },
    { value: 'MERCHANDISE', label: 'Merchandise' },
];

export const REFUND_POLICIES = [
    { value: 'NO_REFUNDS', label: 'No Refunds' },
    { value: 'FLEXIBLE', label: 'Flexible' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'STRICT', label: 'Strict' },
    { value: 'CUSTOM', label: 'Custom' },
];

export const EVENT_STATUSES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'POSTPONED', label: 'Postponed' },
];

export const PAYMENT_METHODS = [
    { value: 'MOMO', label: 'MoMo' },
    { value: 'MPESA', label: 'M-Pesa' },
    { value: 'VISA', label: 'Visa' },
    { value: 'MASTERCARD', label: 'Mastercard' },
    { value: 'CASH', label: 'Cash' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'WRISTBAND_TOPUP', label: 'Wristband Topup' },
    { value: 'STRIPE', label: 'Stripe' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'FLUTTERWAVE', label: 'Flutterwave' },
];

export const TICKET_STATUSES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'VALID', label: 'Valid' },
    { value: 'SCANNED', label: 'Scanned' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'TRANSFERRED', label: 'Transferred' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'EXPIRED', label: 'Expired' },
];
// frontend/app/lib/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';