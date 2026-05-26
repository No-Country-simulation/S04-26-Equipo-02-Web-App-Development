import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface SessionGuardProps {
  children: ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    // checkSession is idempotent via module-level _initialized flag
    useAuthStore.getState().checkSession();
  }, []);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
