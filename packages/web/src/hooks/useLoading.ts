'use client';

import { useState, useCallback } from 'react';

export const useLoading = () => {
    const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

    const startLoading = useCallback((key: string) => {
        setLoadingStates(prev => {
            const next = new Set(prev);
            next.add(key);
            return next;
        });
    }, []);

    const stopLoading = useCallback((key: string) => {
        setLoadingStates(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const isLoading = useCallback((key?: string) => {
        if (key) return loadingStates.has(key);
        return loadingStates.size > 0;
    }, [loadingStates]);

    return { startLoading, stopLoading, isLoading };
};