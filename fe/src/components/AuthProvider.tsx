'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}