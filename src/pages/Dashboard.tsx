
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import ViewerDashboard from "@/components/dashboard/ViewerDashboard";
import MemberDashboard from "@/components/dashboard/MemberDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Dashboard = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <ViewerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
