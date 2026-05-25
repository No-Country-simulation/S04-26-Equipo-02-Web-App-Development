import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: ('PROFESSIONAL' | 'COMPANY' | 'ADMIN')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner className="h-8 w-8 text-brand-sage" />
        <p className="text-sm font-semibold text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin bypassa todos los filtros de rol
  if (user?.role === 'ADMIN') {
    return children ? <>{children}</> : <Outlet />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}