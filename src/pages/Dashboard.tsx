
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import ViewerDashboard from '@/components/dashboard/ViewerDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { userRole, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'viewer' && <ViewerDashboard />}
        {userRole === 'member' && <MemberDashboard />}
        {userRole === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
