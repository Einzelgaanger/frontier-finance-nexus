import { useAuth } from '@/hooks/useAuth';
import Admin from '@/pages/Admin';
import AdminV2 from '@/pages/AdminV2';

const AdminWrapper = () => {
  const { userRole, loading } = useAuth();

  // Show loading while user role is being determined
  if (loading || !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use AdminV2 for admin users, Admin for others
  if (userRole === 'admin') {
    return <AdminV2 />;
  }

  return <Admin />;
};

export default AdminWrapper;
