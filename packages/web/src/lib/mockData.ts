

import { Artist, Event, MainEvents, TextVariation, User, } from '@/lib/types';

import {
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    GlobeAltIcon,
    LightBulbIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';



// Mock user data
export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '76123456',
        role: 'VENDOR',
        isVerified: true,
        profilePhoto: null,
    },
];

export const HeroEvents: Event[] = [
    {
        id: 1,
        name: 'MTN Bushfire Festival',
        date: '2025-11-30',
        location: 'Malkerns Valley',
        image:
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 12,
        imagePriority: true,
        category: 'Music Festival',
        price: 500,
    },
    {
        id: 2,
        name: 'Eswatini vs Nigeria',
        date: '2025-07-19',
        location: 'Somhlolo Stadium',
        image:
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1605&q=80',
        ticketsLeft: 43,
        imagePriority: false,
        category: 'Sports',
        price: 250,
    },
    {
        id: 3,
        name: 'Art Exhibition Opening',
        date: '2025-09-20',
        location: 'Mbabane Art Gallery',
        image:
            'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1804&q=80',
        ticketsLeft: null,
        imagePriority: false,
        category: 'Art',
        price: 0,
    },
    {
        id: 4,
        name: 'Tech Conference',
        date: '2025-12-22',
        location: 'Royal Swazi Convention Center',
        image:
            'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 8,
        imagePriority: false,
        category: 'Conference',
        price: 1200,
    },
    {
        id: 5,
        name: 'Jazz Night',
        date: '2025-03-25',
        location: 'House on Fire',
        image:
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 15,
        imagePriority: false,
        category: 'Music',
        price: 300,
    },
    {
        id: 6,
        name: 'Food Festival',
        date: '2025-04-05',
        location: 'Mantenga Cultural Village',
        image:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: null,
        imagePriority: false,
        category: 'Food',
        price: 0,
    },
    {
        id: 7,
        name: 'Community Yoga',
        date: '2026-03-20',
        location: 'Botanical Gardens',
        image:
            'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
        ticketsLeft: null,
        imagePriority: false,
        category: 'Wellness',
        price: 0,
    },
    {
        id: 8,
        name: 'Film Premiere',
        date: '2025-10-10',
        location: 'Swazi Cineplex',
        image:
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 56,
        imagePriority: false,
        category: 'Cinema',
        price: 150,
    },
];
export const backgroundImages = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg',
    '/images/hero-bg-3.jpg',
];

// Text variations
export const textVariation = [
    {
        title: 'Eswatini Comes Alive!',
        description:
            'Experience the heartbeat of Africas hidden gem with seamless ticketing for traditional dances, music festivals, and local sports events.',
    },
    {
        title: 'Made for EmaSwati, by EmaSwati',
        description:
            "We're built for Eswatini, not adapted from foreign systems. Our platform understands local needs, from payment preferences to event cultures.",
    },
    {
        title: 'Where Africa Celebrates',
        description:
            "Discover, book, and experience the best events in Eswatini. From cultural festivals to sports matches, we've got your ticket to unforgettable moments.",
    },

    {
        title: 'Innovative Event Solutions',
        description:
            'Cutting-edge technology meets local needs with NFC wristbands, USSD ticketing, and AI-powered recommendations tailored for Eswatini.',
    },
];
export const textVariations: TextVariation[] = [
    {
        title: 'Eswatini Comes Alive!',
        description:
            'Experience the heartbeat of Africas hidden gem with seamless ticketing for traditional dances, music festivals, and local sports events.',
    },
    {
        title: 'Made for EmaSwati, by EmaSwati',
        description:
            "We're built for Eswatini, not adapted from foreign systems. Our platform understands local needs, from payment preferences to event cultures.",
    },
    {
        title: 'Where Africa Celebrates',
        description:
            "Discover, book, and experience the best events in Eswatini. From cultural festivals to sports matches, we've got your ticket to unforgettable moments.",
    },
    {
        title: 'Innovative Event Solutions',
        description:
            'Cutting-edge technology meets local needs with NFC wristbands, USSD ticketing, and AI-powered recommendations tailored for Eswatini.',
    },
];


export const AboutStats = [
    { id: 1, name: 'Events powered', value: '50+', trend: '↑ 12%' },
    { id: 2, name: 'Ticket transactions', value: '55k+', trend: '↑ 23%' },
    { id: 3, name: 'Local vendors', value: '200+', trend: '↑ 8%' },
    { id: 4, name: 'Platform savings', value: '40%', trend: '↑ 5%' },
];

export const values = [
    {
        name: 'Eswatini Pride',
        description:
            'Prioritizing local payments, promotions, and artist partnerships to celebrate our national identity.',
        icon: MapPinIcon,
        color: 'bg-red-600',
    },
    {
        name: 'Inclusivity',
        description:
            'From rural locals to international tourists, we design for all demographics and connectivity levels.',
        icon: UserGroupIcon,
        color: 'bg-blue-600',
    },
    {
        name: 'Innovation',
        description:
            'Blending global technology with local solutions like USSD ticketing and NFC wristbands.',
        icon: LightBulbIcon,
        color: 'bg-purple-600',
    },
    {
        name: 'Transparency',
        description:
            'Comprehensive audit logs and secure transactions build trust in every ticket purchased.',
        icon: ShieldCheckIcon,
        color: 'bg-emerald-600',
    },
    {
        name: 'Affordability',
        description: '5-8% ticketing fees compared to foreign platforms charging 10-15%.',
        icon: CurrencyDollarIcon,
        color: 'bg-amber-500',
    },
    {
        name: 'Community',
        description: 'Free listings for cultural events and support for local community initiatives.',
        icon: HeartIcon,
        color: 'bg-pink-500',
    },
];

export const team = [
    {
        name: 'Mr. Siyabonga Dlamini',
        role: 'Founder & CEO',
        bio: "Visionary leader with a passion for technology and Eswatini's cultural heritage. Founded Eswa Tickets to create a platform that serves local needs first.",
        image: '/team-ceo.jpg',
        social: {
            twitter: '#',
            linkedin: '#',
        },
    },
    {
        name: 'Tech & Product Team',
        role: 'Innovation Experts',
        bio: 'Building cutting-edge solutions like USSD ticketing, NFC wristbands, and AI-powered features while ensuring the platform works flawlessly on 2G networks.',
        image: '/team-tech.jpg',
        social: {
            twitter: '#',
            linkedin: '#',
        },
    },
    {
        name: 'Community Team',
        role: 'Local Champions',
        bio: "Working directly with event organizers, vendors, and local communities to ensure the platform meets real needs and supports Eswatini's cultural events.",
        image: '/team-community.jpg',
        social: {
            twitter: '#',
            linkedin: '#',
        },
    },
];

export const testimonials = [
    {
        quote:
            'Eswa Tickets transformed our festival operations. The USSD ticketing reached rural attendees we never could before.',
        name: 'MTN Bushfire Team',
        role: 'Major Festival Organizers',
    },
    {
        quote:
            'Finally a platform that understands our local needs. The cash payment option was a game-changer for our community events.',
        name: 'Sidvokodvo Riders',
        role: 'Local Event Organizers',
    },
    {
        quote:
            'As an international visitor, I was impressed by how seamless the ticket purchasing and entry process was.',
        name: 'Sarah Johnson',
        role: 'Tourist from UK',
    },
];

export const timelineItems = [
    {
        year: '2025',
        title: 'Platform Launch',
        description: 'Launched with USSD and mobile money support',
        icon: GlobeAltIcon,
    },
    {
        year: '2026',
        title: 'MTN Bushfire Partnership',
        description: "Powered ticketing for Africa's premier music festival",
        icon: CalendarIcon,
    },
    {
        year: '2027',
        title: 'Regional Expansion',
        description: 'Expanded services to Lesotho and Mozambique',
        icon: MapPinIcon,
    },
];
export const UpcomingEvents: Event[] = [
    {
        id: 1,
        name: 'MTN Bushfire Festival',
        date: '2025-07-30',
        location: 'Malkerns Valley',
        image:
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 12,
        imagePriority: true,
        category: 'Music Festival',
        price: 500,
    },
    {
        id: 2,
        name: 'Eswatini vs Nigeria',
        date: '2025-07-19',
        location: 'Somhlolo Stadium',
        image:
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1605&q=80',
        ticketsLeft: 43,
        imagePriority: false,
        category: 'Sports',
        price: 250,
    },
    {
        id: 3,
        name: 'Art Exhibition Opening',
        date: '2025-07-20',
        location: 'Mbabane Art Gallery',
        image:
            'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1804&q=80',
        ticketsLeft: null, // Free event
        imagePriority: false,
        category: 'Art',
        price: 0,
    },
    {
        id: 4,
        name: 'Tech Conference',
        date: '2025-03-22',
        location: 'Royal Swazi Convention Center',
        image:
            'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 8,
        imagePriority: false,
        category: 'Conference',
        price: 1200,
    },
    {
        id: 5,
        name: 'Jazz Night',
        date: '2025-03-25',
        location: 'House on Fire',
        image:
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 15,
        imagePriority: false,
        category: 'Music',
        price: 300,
    },
    {
        id: 6,
        name: 'Food Festival',
        date: '2025-04-05',
        location: 'Mantenga Cultural Village',
        image:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: null, // Free event
        imagePriority: false,
        category: 'Food',
        price: 0
    },
    {
        id: 7,
        name: 'Community Yoga',
        date: '2025-03-20',
        location: 'Botanical Gardens',
        image:
            'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
        ticketsLeft: null,
        imagePriority: false,
        category: 'Wellness',
        price: 0,
    },
    {
        id: 8,
        name: 'Film Premiere',
        date: '2025-04-10',
        location: 'Swazi Cineplex',
        image:
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ticketsLeft: 56,
        imagePriority: false,
        category: 'Cinema',
        price: 150,
    },
];
export const AllEvents: MainEvents[] = [
    {
        id: 6,
        title: 'Eswatini International Trade Fair',
        description:
            'Largest trade exhibition showcasing local and international businesses',
        date: 'August 30 - September 9, 2025',
        location: 'Mavuso Trade Centre',
        image: '/images/bushfire.jpg',
        price: 10,
        category: 'Business',
        isPopular: true,
        rating: 4.3,
        ticketsLeft: 145,
        totalTickets: 5000,
        ticketsSold: 4855,
    },


    {
        id: 4,
        title: 'MTN Bushfire Festival',
        description:
            "Africa's most internationally celebrated festival of music and arts",
        date: 'May 24-26, 2025',
        location: 'Malkerns Valley',
        image: '/images/bushfire.jpg',
        price: 500,
        earlyBirdPrice: 35,
        earlyBirdCutoff: '2025-03-01',
        category: 'Music Festival',
        isTrending: true,
        rating: 4.8,
        ticketsLeft: 12,
        totalTickets: 15000,
        ticketsSold: 4870,
    }, {
        id: 8,
        title: 'Incwala Ceremony',
        description:
            'The most sacred national ritual, a kingship ceremony dating back centuries',
        date: 'December 2024',
        location: 'Lobamba',
        image: '/images/bushfire.jpg',
        price: 0,
        category: 'Cultural',
        isFree: true,
        isTrending: true,
        rating: 4.9,
        ticketsLeft: 0,
        totalTickets: 0,
        ticketsSold: 0,
    },

    {
        id: 5,
        title: 'Sibebe Survivor Challenge',
        description:
            "Hike up Africa's largest granite dome with live music at the summit",
        date: 'September 7, 2025',
        location: 'Sibebe Rock',
        image: '/images/bushfire.jpg',
        price: 25,
        earlyBirdPrice: 15,
        earlyBirdCutoff: '2025-06-01',
        category: 'Adventure',
        isTrending: true,
        rating: 4.9,
        ticketsLeft: 8,
        totalTickets: 300,
        ticketsSold: 292,
    },

    {
        id: 7,
        title: 'Marula Festival',
        description:
            'Celebration of the marula fruit harvest with traditional music and dance',
        date: 'February 2025',
        location: 'Hlane Royal National Park',
        image: '/images/bushfire.jpg',
        price: 0,
        category: 'Cultural',
        isFree: true,
        isPopular: true,
        rating: 4.7,
        ticketsLeft: 0,
        totalTickets: 0,
        ticketsSold: 0,
    },


    {
        id: 3,
        title: 'Swazi Rally',
        description:
            "Annual motorsport event featuring rally racing through Eswatini's landscapes",
        date: 'July 12-13, 2025',
        location: 'Various Locations',
        image: '/images/bushfire.jpg',
        price: 15,
        earlyBirdPrice: 10,
        earlyBirdCutoff: '2025-05-01',
        category: 'Sports',
        isTrending: false,
        rating: 4.6,
        ticketsLeft: 87,
        totalTickets: 1000,
        ticketsSold: 913,
    },
    {
        id: 2,
        title: 'Umhlanga Reed Dance',
        description:
            'Annual ceremony where young women cut reeds and present them to the Queen Mother',
        date: 'August 2024',
        location: 'Ludzidzini Royal Village',
        image: '/images/bushfire.jpg',
        price: 0,
        category: 'Cultural',
        isFree: true,
        isTrending: true,
        rating: 4.8,
        ticketsLeft: 0,
        totalTickets: 0,
        ticketsSold: 0,
    },


    {
        id: 1,
        title: 'Mbabane Jazz Festival',
        description:
            'Celebration of jazz music featuring local and international artists',
        date: 'October 18-20, 2025',
        location: 'Mbabane Theatre Club',
        image: '/images/bushfire.jpg',
        price: 300,
        earlyBirdPrice: 20,
        earlyBirdCutoff: '2025-08-01',
        category: 'Music',
        isPopular: true,
        rating: 4.5,
        ticketsLeft: 42,
        totalTickets: 500,
        ticketsSold: 458,
    },

    {
        id: 9,
        title: 'Hlane Moonlight Festival',
        description:
            'Nighttime wildlife viewing and cultural performances in Hlane National Park',
        date: 'June 14, 2025',
        location: 'Hlane Royal National Park',
        image: '/images/bushfire.jpg',
        price: 350,
        earlyBirdPrice: 25,
        earlyBirdCutoff: '2025-04-15',
        category: 'Nature',
        isTrending: true,
        rating: 4.7,
        ticketsLeft: 23,
        totalTickets: 200,
        ticketsSold: 177,
    },

    {
        id: 10,
        title: 'Mantenga Cultural Village Experience',
        description:
            'Daily showcase of Swazi culture, dance, and traditional lifestyle',
        date: 'Daily',
        location: 'Mantenga Falls',
        image: '/images/bushfire.jpg',
        price: 150,
        category: 'Cultural',
        isPopular: true,
        rating: 4.8,
        ticketsLeft: 0,
        totalTickets: 0,
        ticketsSold: 0,
    },

    {
        id: 11,
        title: 'Swazi Fashion Week',
        description:
            "Showcasing the best of Eswatini's fashion designers and models",
        date: 'November 7-9, 2025',
        location: 'Ezulwini Valley',
        image: '/images/bushfire.jpg',
        price: 400,
        earlyBirdPrice: 30,
        earlyBirdCutoff: '2025-09-01',
        category: 'Fashion',
        isTrending: false,
        rating: 4.4,
        ticketsLeft: 56,
        totalTickets: 300,
        ticketsSold: 244,
    },

    {
        id: 12,
        title: 'Ngwane Film Festival',
        description: 'Annual celebration of African cinema and storytelling',
        date: 'September 25-29, 2025',
        location: 'Manzini',
        image: '/images/bushfire.jpg',
        price: 200,
        earlyBirdPrice: 15,
        earlyBirdCutoff: '2025-07-01',
        category: 'Film',
        isTrending: true,
        rating: 4.6,
        ticketsLeft: 34,
        totalTickets: 500,
        ticketsSold: 466,
    },
];

export const topArtists: Artist[] = [
    {
        id: '1',
        name: 'Lryikal Busta',
        image: '/images/artists/busta.jpg',
        genre: 'Rap',
        rating: 4.9,
        upcomingEvents: 3,
        isLocal: true,
        socialMedia: {
            twitter: '@busta',
            instagram: '@busta'
        }, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ],

    },
    {
        id: '2',
        name: 'KrTc',
        image: '/images/artists/krtc.jpg',
        genre: 'Hip Hop',
        rating: 4.8,
        upcomingEvents: 2,
        isLocal: false,
        socialMedia: {
            twitter: '@KrTc',
            instagram: '@KrTc'
        }, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
    },
    {
        id: '3',
        name: 'Uncle Waffles',
        image: '/images/artists/waffles.jpg',
        genre: 'Piano',
        rating: 4.7,
        upcomingEvents: 1,
        isLocal: true,
        socialMedia: {
            twitter: '@waffles'
        }, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
    },
    {
        id: '4',
        name: 'Velemseni',
        image: '/images/artists/velemseni.webp',
        genre: 'Afro-Soul',
        rating: 4.6,
        upcomingEvents: 4,
        isLocal: true, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
    },
    {
        id: '5',
        name: 'Sands Of Time',
        image: '/images/artists/sands.jpeg',
        genre: 'Afro Beats',
        rating: 4.5,
        upcomingEvents: 2,
        isLocal: true, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
    },
    {
        id: '6',
        name: 'Qibho Interlektual',
        image: '/images/artists/qibho.jpg',
        genre: 'Hip Hop',
        rating: 4.4,
        upcomingEvents: 3,
        isLocal: true, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
    },
    {
        id: '7',
        name: 'Nothando Hlophe',
        image: '/images/artists/nothando.jpg',
        genre: 'Gospel',
        rating: 4.8,
        upcomingEvents: 1,
        isLocal: false, nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ], location: "South Africa"
    },
    {
        id: '8',
        name: 'Sjava',
        image: '/images/artists/sjava.jpg',
        genre: 'Traditional',
        rating: 4.7,
        upcomingEvents: 2,
        isLocal: false,

        nextThreeShows: [
            {
                id: 'show1',
                date: '2023-12-15T20:00:00',
                venue: 'Club XYZ',
                city: 'Mbabane'
            },
        ]
        , location: "South Africa"
    }
];
export const registerText = {
    title: 'Create Account',
    description: 'Join Eswatini Events to book tickets faster and manage all your events in one place.',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    phoneLabel: 'Phone Number (Optional)',
    passwordLabel: 'Password',
    termsText: 'I agree to the',
    termsLink: 'Terms',
    andText: 'and',
    privacyLink: 'Privacy Policy',
    createAccount: 'Create Account',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    benefitsTitle: 'Why Join Eswatini Events?',
    benefits: [
        'Instant ticket delivery via WhatsApp/SMS',
        'Manage all your tickets in one place',
        'Exclusive early access to popular events',
        'Secure payments with MTN MoMo',
        'Get event recommendations just for you',
    ],
};

export const loginText = {
    welcomeBack: 'Welcome Back',
    signInDescription: 'Sign in to access your tickets and event history.',
    emailLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '*******',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    orContinue: 'Or continue with',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    benefits: [
        'View all your upcoming events',
        'Access tickets anytime, anywhere',
        'Get event reminders and updates',
        'Quick re-entry with saved QR codes',
        'Exclusive offers for members',
    ],
    title: 'Your Events, One Place',
    ForgotPassword: 'Forgot password?'
};