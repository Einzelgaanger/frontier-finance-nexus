
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

  // Viewer Dashboard
  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ViewerDashboard />
        </div>
      </div>
    );
  }

  // Member Dashboard
  if (userRole === 'member') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MemberDashboard />
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  // Fallback - should not happen but just in case
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ViewerDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
