
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ViewerDashboard from '@/components/dashboard/ViewerDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import AdminDashboardV2 from '@/components/dashboard/AdminDashboardV2';
import NetworkV2 from '@/pages/NetworkV2';
import { useEffect } from 'react';

const Dashboard = () => {
  const { userRole, loading, refreshUserRole } = useAuth();

  // Refresh user role when component mounts to ensure latest role is loaded
  useEffect(() => {
    refreshUserRole();
  }, [refreshUserRole]);

  // Show loading while user role is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render any dashboard content until we have a confirmed role
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use sidebar layout for all authenticated users
  return (
    <SidebarLayout>
      {userRole === 'admin' && <AdminDashboardV2 />}
      {userRole === 'viewer' && <ViewerDashboard />}
      {userRole === 'member' && <MemberDashboard />}
    </SidebarLayout>
  );
};

export default Dashboard;
