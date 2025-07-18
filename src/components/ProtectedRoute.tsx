
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useLoadingStore } from '@/store/loading-store';
import LoadingScreen from '@/components/ui/loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'viewer' | 'member' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const { isLoading } = useLoadingStore();

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const roleHierarchy = { viewer: 0, member: 1, admin: 2 };
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
