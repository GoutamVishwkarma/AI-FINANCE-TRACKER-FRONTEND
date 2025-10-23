'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
