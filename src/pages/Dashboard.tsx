
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ViewerDashboard from "@/components/dashboard/ViewerDashboard";
import MemberDashboard from "@/components/dashboard/MemberDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Simulate user roles - in real app this would come from auth
const MOCK_USER = {
  id: "1",
  email: "user@example.com",
  role: "member" // viewer, member, admin
};

const Dashboard = () => {
  const [user, setUser] = useState(MOCK_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setUser(null);
    // In real app, clear auth state and redirect
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <ViewerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
