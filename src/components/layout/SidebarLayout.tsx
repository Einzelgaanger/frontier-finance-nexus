import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  BarChart3,
  Shield,
  Network,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  ArrowLeft,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  icon: any;
  color: string;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const handleNavigation = (to: string) => {
    navigate(to);
    setSidebarOpen(false);
  };


  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Your overview and insights" : userRole === "member" ? "Your member dashboard and activity" : "Overview and analytics",
      badge: null,
      color: "blue"
    },
    { 
      name: "Network", 
      href: "/network", 
      icon: Network, 
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Browse approved fund managers" : "Fund manager directory",
      badge: null,
      color: "green"
    },
    { 
      name: "Surveys", 
      href: "/survey", 
      icon: FileText, 
      roles: ["member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "View survey data and insights" : "Complete and view surveys",
      badge: null,
      color: "purple"
    },
    { 
      name: "Application", 
      href: "/application", 
      icon: Send, 
      roles: ["viewer"],
      description: "Submit membership application",
      badge: null,
      color: "orange"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: BarChart3, 
      roles: ["admin"],
      description: "Data insights and reports",
      badge: null,
      color: "red"
    },
    { 
      name: "Admin Panel", 
      href: "/admin", 
      icon: Shield, 
      roles: ["admin"],
      description: "User and system management",
      badge: null,
      color: "black"
    },
  ];


  const filteredNavItems = navigationItems.filter(item => 
    userRole ? item.roles.includes(userRole) : item.roles.includes('viewer')
  );

  // Helper function to get clean color classes
  const getSmoothColorClasses = (color: string, isActive: boolean = false) => {
    return {
      icon: isActive ? 'text-black' : 'text-[#f5f5dc]',
      iconBg: isActive ? 'bg-[#f5f5dc]' : 'bg-[#f5f5dc]/20',
      text: isActive ? 'text-[#f5f5dc] font-semibold' : 'text-[#f5f5dc]',
      bg: isActive ? 'bg-[#f5f5dc]/20' : 'bg-transparent',
      hover: 'hover:bg-[#f5f5dc]/10 hover:shadow-lg hover:scale-[1.02]',
      border: 'border-transparent',
      accent: 'bg-[#f5f5dc]'
    };
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/dashboard") return true;
    if (href === "/survey" && location.pathname.startsWith("/survey")) return true;
    if (href === "/network" && location.pathname === "/network") return true;
    if (href === "/analytics" && location.pathname === "/analytics") return true;
    if (href === "/admin" && location.pathname.startsWith("/admin")) return true;
    return false;
  };


  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 's':
            e.preventDefault();
            navigate('/survey');
            break;
          case 'n':
            e.preventDefault();
            navigate('/network');
            break;
          case 'a':
            e.preventDefault();
            navigate('/analytics');
            break;
          case 'p':
            e.preventDefault();
            navigate('/admin');
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, sidebarCollapsed]);

  return (
    <div className="min-h-screen transition-all duration-300 bg-[#f5f5dc]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "w-24",
          "bg-black shadow-2xl overflow-hidden font-rubik"
        )}
      >
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-hidden bg-black min-h-0">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const colors = getSmoothColorClasses(item.color, active);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex flex-col items-center px-2 py-3 rounded-xl transition-all duration-500 group relative transform",
                    colors.bg,
                    colors.hover,
                    colors.border,
                    active && "shadow-xl ring-2 ring-beige/30"
                  )}
                  title={item.name}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-500 shadow-md group-hover:shadow-lg group-hover:scale-110 mb-1.5",
                    colors.iconBg,
                    active && "shadow-xl"
                  )}>
                    <Icon className={cn("transition-colors w-4 h-4", colors.icon)} />
                  </div>
                  <div className="text-center">
                    <p className={cn("font-normal text-xs transition-colors", colors.text)}>
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex flex-col items-center px-2 py-3 rounded-xl transition-all duration-500 group hover:bg-[#f5f5dc]/10 hover:shadow-lg hover:scale-[1.02]"
              title="Sign Out"
            >
              <div className="p-1.5 rounded-xl bg-[#f5f5dc]/20 transition-all duration-500 shadow-md group-hover:shadow-lg group-hover:scale-110 mb-1.5">
                <LogOut className="text-[#f5f5dc] w-4 h-4" />
              </div>
              <div className="text-center">
                <p className="font-normal text-xs text-[#f5f5dc]">
                  Sign Out
                </p>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-w-0 bg-[#f5f5dc] ml-24">
        {/* Top Header */}
        <header className="border-b-2 border-black px-6 py-2 transition-colors bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-rubik sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* CFF Logo */}
              <div className="flex items-center">
                <img 
                  src="/CFF LOGO.png" 
                  alt="CFF Logo" 
                  className="h-12 w-auto object-contain mr-4"
                />
              </div>
              
                <div>
                  {location.pathname === '/dashboard' && userRole === 'admin' ? (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Welcome back, Administrator
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Here's what's happening with your network today
                      </p>
                    </>
                  ) : location.pathname === '/dashboard' && userRole === 'viewer' ? (
                    <></>
                  ) : location.pathname === '/dashboard' && userRole === 'member' ? (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Welcome back, {user?.email?.split('@')[0] || 'Member'}!
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Welcome to the CFF Network member portal. Access your surveys, connect with peers, and explore insights.
                      </p>
                    </>
                  ) : location.pathname.startsWith('/network/fund-manager/') ? (
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/network')}
                        className="flex items-center space-x-2 border-white/30 text-white hover:bg-white/20 bg-white/5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Network</span>
                      </Button>
                      <div className="h-6 w-px bg-white/30"></div>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Fund Manager Details
                      </h2>
                    </div>
                  ) : location.pathname === '/application' ? (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Membership Application
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Join the CFF Network and connect with global fund managers
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        {location.pathname.startsWith('/survey') && 'Surveys'}
                        {location.pathname === '/network' && 'Network Directory'}
                        {location.pathname === '/analytics' && 'Analytics Hub'}
                        {location.pathname.startsWith('/admin') && 'Admin Panel'}
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        {location.pathname.startsWith('/survey') && 'Complete and view survey responses'}
                        {location.pathname === '/network' && 'Browse and connect with fund managers'}
                        {location.pathname === '/analytics' && 'Data insights and comprehensive reports'}
                        {location.pathname.startsWith('/admin') && 'Manage users, content, and system settings'}
                      </p>
                    </>
                  )}
                </div>
            </div>
            
            {/* Right side - User info for dashboard */}
            {location.pathname === '/dashboard' && (
              <div className="flex items-center space-x-4">
                {/* Email and Role (2 rows) */}
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.email}
                  </p>
                  {/* Role Badge */}
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userRole === 'admin' 
                        ? 'bg-red-500/20 text-red-300 border border-red-400/30' 
                        : userRole === 'member' 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    }`}>
                      {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'Viewer'}
                    </span>
                  </div>
                </div>
                {/* Profile Picture - furthest right */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            )}
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#f5f5dc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
