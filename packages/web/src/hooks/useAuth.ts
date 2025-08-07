import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'ORGANIZER' | 'ATTENDEE' | 'VENDOR';
    permissions: string[];
    profilePhoto?: string;
    isVerified?: boolean;
    lastSeenOffline?: string;
    fraudScore?: number;
    biometricId?: string;
    biometricConsent?: boolean;
}

export const useAuth = () => {
    const router = useRouter();
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['user'],
        queryFn: async () => {
            // Simulate API call to fetch user
            return {
                id: '1',
                name: 'Siyabonga Dlamini',
                email: 'siyabonga@eswatickets.com',
                phone: '+26812345678',
                role: 'ORGANIZER',
                permissions: ['CREATE_EVENT', 'MANAGE_TICKETS', 'VIEW_ANALYTICS'],
                profilePhoto: '/profiles/siyabonga.jpg',
                isVerified: true,
                fraudScore: 0.0
            } as User;
        }
    });

    const hasPermission = (permission: string) => {
        return user?.permissions?.includes(permission) || false;
    };

    if (!isLoading && (!user || user.role !== 'ORGANIZER')) {
        router.push('/organizer/login');
    }

    return { user, isLoading, hasPermission };
};