import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import Analytics from '@/pages/Analytics';
import AnalyticsV2 from '@/pages/AnalyticsV2';

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

  // Use AnalyticsV2 for admin users, Analytics for others
  if (userRole === 'admin') {
    return <AnalyticsV2 />;
  }

  return <Analytics />;
};

export default AnalyticsWrapper;
