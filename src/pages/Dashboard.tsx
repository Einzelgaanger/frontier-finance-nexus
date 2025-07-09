
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import ViewerDashboard from '@/components/dashboard/ViewerDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { userRole } = useAuth();





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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
