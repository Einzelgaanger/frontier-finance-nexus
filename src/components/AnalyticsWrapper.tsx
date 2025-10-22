import { useAuth } from '@/hooks/useAuth';
import AnalyticsV3 from '@/pages/AnalyticsV3';

const AnalyticsWrapper = () => {
  const { userRole, loading } = useAuth();

  // Show loading while user role is being determined
  if (loading || !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // All authenticated users can access analytics with role-based field visibility
  return <AnalyticsV3 />;
};

export default AnalyticsWrapper;
