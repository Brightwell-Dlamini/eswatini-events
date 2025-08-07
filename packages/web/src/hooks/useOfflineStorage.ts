import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export const useOfflineStorage = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const saveOffline = (key: string, data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }
    };

    const syncOfflineData = async () => {
        if (!isOffline && typeof window !== 'undefined') {
            const keys = Object.keys(localStorage);
            for (const key of keys) {
                if (key.startsWith('event-draft-') || key.startsWith('ticket-draft-')) {
                    const data = JSON.parse(localStorage.getItem(key)!);
                    if (key.startsWith('event-draft-')) await api.createEvent(data);
                    else if (key.startsWith('ticket-draft-')) await api.createTicketType(data);
                    localStorage.removeItem(key);
                }
            }
        }
    };

    return { isOffline, saveOffline, syncOfflineData };
};