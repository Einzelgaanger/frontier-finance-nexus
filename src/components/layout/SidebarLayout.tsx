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
  Send,
  User,
  Brain,
  BookOpen
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
      name: "Application", 
      href: "/application", 
      icon: Send, 
      roles: ["viewer"],
      description: "Submit membership application",
      badge: null,
      color: "orange"
    },
    { 
      name: "PortIQ", 
      href: "/portiq", 
      icon: Brain, 
      roles: ["admin", "member", "viewer"],
      description: "AI Assistant for data insights",
      badge: null,
      color: "purple"
    },
    { 
      name: "Blogs", 
      href: "/blogs", 
      icon: BookOpen, 
      roles: ["admin", "member", "viewer"],
      description: "Share insights and connect",
      badge: null,
      color: "teal"
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
    { 
      name: "My Profile", 
      href: "/profile", 
      icon: User, 
      roles: ["admin", "member", "viewer"],
      description: "Manage your company information and profile",
      badge: null,
      color: "indigo"
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
    if (href === "/profile" && location.pathname === "/profile") return true;
    if (href === "/network" && location.pathname === "/network") return true;
    if (href === "/analytics" && location.pathname === "/analytics") return true;
    if (href === "/admin" && location.pathname.startsWith("/admin")) return true;
    if (href === "/portiq" && location.pathname === "/portiq") return true;
    if (href === "/application" && location.pathname === "/application") return true;
    if (href === "/blogs" && location.pathname === "/blogs") return true;
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
          "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 shadow-2xl overflow-hidden font-rubik border-r border-slate-700/50"
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>
        
        <div className="flex flex-col h-screen overflow-hidden relative">
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1.5 overflow-hidden min-h-0">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const colors = getSmoothColorClasses(item.color, active);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex flex-col items-center px-2 py-3 rounded-xl transition-all duration-500 group relative transform overflow-hidden",
                    active 
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30" 
                      : "hover:bg-gradient-to-br hover:from-slate-700/30 hover:to-slate-800/30",
                    "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5"
                  )}
                  title={item.name}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                  )}
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500 rounded-xl"></div>
                  
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:scale-110 mb-2 relative z-10",
                    active 
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/30" 
                      : "bg-gradient-to-br from-slate-700/50 to-slate-800/50 group-hover:from-blue-600/30 group-hover:to-purple-600/30"
                  )}>
                    <Icon className={cn(
                      "transition-colors w-4 h-4 relative z-10",
                      active ? "text-white" : "text-blue-300 group-hover:text-white"
                    )} />
                  </div>
                  <div className="text-center relative z-10">
                    <p className={cn(
                      "font-medium text-[10px] transition-colors leading-tight",
                      active ? "text-white" : "text-slate-300 group-hover:text-white"
                    )}>
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-2 border-t border-slate-700/50">
            <button
              onClick={handleSignOut}
              className="w-full flex flex-col items-center px-2 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden hover:bg-gradient-to-br hover:from-red-900/20 hover:to-red-800/20 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5"
              title="Sign Out"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-500 rounded-xl"></div>
              
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 transition-all duration-500 shadow-md group-hover:shadow-xl group-hover:scale-110 mb-2 group-hover:from-red-600/30 group-hover:to-orange-600/30 relative z-10">
                <LogOut className="text-red-300 group-hover:text-white w-4 h-4 transition-colors relative z-10" />
              </div>
              <div className="text-center relative z-10">
                <p className="font-medium text-[10px] text-slate-300 group-hover:text-white transition-colors leading-tight">
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
                        Your gateway to global fund management excellence.
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
                        {location.pathname === '/portiq' && 'PortIQ - AI Assistant'}
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        {location.pathname.startsWith('/survey') && 'Complete and view survey responses'}
                        {location.pathname === '/network' && 'Browse and connect with fund managers'}
                        {location.pathname === '/analytics' && 'Data insights and comprehensive reports'}
                        {location.pathname.startsWith('/admin') && 'Manage users, content, and system settings'}
                        {location.pathname === '/portiq' && 'Your intelligent assistant for data insights and analysis'}
                      </p>
                    </>
                  )}
                </div>
            </div>
            
            {/* Right side - User info for all pages */}
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
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
