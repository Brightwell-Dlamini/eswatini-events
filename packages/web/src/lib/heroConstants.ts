// lib/heroConstants.ts
export const ANIMATION_DURATIONS = {
    fast: 0.3,
    medium: 0.6,
    slow: 1,
    textTransition: 1.5,
    bgTransition: 0.8,
};

export const EASING = {
    smooth: [0.16, 1, 0.3, 1],
    standard: [0.4, 0, 0.2, 1],
};

export type HeroTextVariation = {
    title: string;
    description: string;
};

export type Event = {
    id: string;
    name: string;
    date: string;
    location: string;
    category: string;
    image: string;
    price: number;
    ticketsLeft?: number;
    imagePriority?: boolean;
};