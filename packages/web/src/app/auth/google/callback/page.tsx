'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/site/Shell';

export default function GoogleCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);
  return (
    <Shell hideFooter>
      <div className="py-24 text-center text-sm text-zinc-500">Completing sign-in…</div>
    </Shell>
  );
}
