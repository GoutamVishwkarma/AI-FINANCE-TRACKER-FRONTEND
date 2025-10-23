'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually hydrate the store on the client side
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
