// app/components/FeaturedEvents.tsx
'use client';

import { AllEvents } from '@/lib/mockData';
import { FeaturedEvents } from './AllEvents/FeaturedEvents';

export default function Page() {
  return <FeaturedEvents events={AllEvents} />;
}
