import { useAuth } from '@/hooks/useAuth';
import { Suspense, lazy } from 'react';

// Lazy load components to prevent both from loading
const Network = lazy(() => import('@/pages/Network'));
const NetworkV2 = lazy(() => import('@/pages/NetworkV2'));

const NetworkWrapper = () => {
  const { userRole, loading } = useAuth();

  // Show loading while user role is being determined
  if (loading || !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use NetworkV2 for admin users, Network for others
  if (userRole === 'admin') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <NetworkV2 />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Network />
    </Suspense>
  );
};

export default NetworkWrapper;
