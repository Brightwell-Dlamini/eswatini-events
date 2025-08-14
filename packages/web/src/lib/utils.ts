export function formatCurrency(amount: number, currency: string = 'SZL'): string {
    return new Intl.NumberFormat('en-SZ', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    };

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
}

export function truncate(text: string, length: number = 50): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

export function generateRandomId(prefix: string = ''): string {
    return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

export function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        DRAFT: 'bg-gray-100 text-gray-800',
        PUBLISHED: 'bg-blue-100 text-blue-800',
        CANCELLED: 'bg-red-100 text-red-800',
        COMPLETED: 'bg-purple-100 text-purple-800',
        POSTPONED: 'bg-orange-100 text-orange-800',
        VALID: 'bg-green-100 text-green-800',
        SCANNED: 'bg-blue-100 text-blue-800',
        REFUNDED: 'bg-red-100 text-red-800',
        TRANSFERRED: 'bg-purple-100 text-purple-800',
        EXPIRED: 'bg-gray-100 text-gray-800',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-800';
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
// lib/utils.ts


