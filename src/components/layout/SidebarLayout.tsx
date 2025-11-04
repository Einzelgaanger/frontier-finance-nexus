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
  BookOpen,
  Home,
  Users,
  ClipboardList,
  Sparkles,
  Newspaper,
  LineChart,
  LockKeyhole,
  UserCircle,
  PlusCircle
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
      icon: Home, 
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Your overview and insights" : userRole === "member" ? "Your member dashboard and activity" : "Overview and analytics",
      badge: null,
      color: "blue"
    },
    { 
      name: "Network", 
      href: "/network", 
      icon: Users, 
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Browse approved fund managers" : "Fund manager directory",
      badge: null,
      color: "green"
    },
    { 
      name: "Application", 
      href: "/application", 
      icon: ClipboardList, 
      roles: ["viewer"],
      description: "Submit membership application",
      badge: null,
      color: "orange"
    },
    { 
      name: "PortIQ", 
      href: "/portiq", 
      icon: Sparkles, 
      roles: ["admin", "member", "viewer"],
      description: "AI Assistant for data insights",
      badge: null,
      color: "purple"
    },
    { 
      name: "Blogs", 
      href: "/blogs", 
      icon: Newspaper, 
      roles: ["admin", "member", "viewer"],
      description: "Share insights and connect",
      badge: null,
      color: "teal"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: LineChart, 
      roles: ["admin"],
      description: "Data insights and reports",
      badge: null,
      color: "red"
    },
    { 
      name: "Admin Panel", 
      href: "/admin", 
      icon: LockKeyhole, 
      roles: ["admin"],
      description: "User and system management",
      badge: null,
      color: "black"
    },
    { 
      name: "My Profile", 
      href: "/profile", 
      icon: UserCircle, 
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
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          "w-56",
          "bg-slate-900 shadow-2xl overflow-hidden font-rubik border-r border-slate-700/50"
        )}
      >
        <div className="flex flex-col h-screen overflow-hidden">
          {/* CFF Logo at Top */}
          <div className="p-4 border-b border-slate-700/50">
            <img 
              src="/CFF LOGO.png" 
              alt="CFF Logo" 
              className="h-12 w-auto object-contain mx-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-hidden min-h-0">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isPortIQ = item.name === "PortIQ";
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    active 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-cyan-600/20 hover:text-white"
                  )}
                  title={item.name}
                >
                  {isPortIQ ? (
                    <img 
                      src="/robot.png" 
                      alt="PortIQ" 
                      className="w-5 h-5 flex-shrink-0 object-contain"
                    />
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Email and Profile Picture at Bottom */}
          <div className="p-4 border-t border-slate-700/50 space-y-3">
            {/* Email */}
            <div className="px-4">
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="text-sm text-white truncate">{user?.email}</p>
            </div>
            
            {/* Profile Picture */}
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-white capitalize">
                  {userRole || 'Viewer'}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-w-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 lg:ml-56">
        {/* Top Header */}
        <header className="border-b-2 border-black px-6 py-4 transition-colors bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-rubik sticky top-0 z-50">
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
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Welcome
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Your gateway to the global fund manager community and comprehensive market intelligence
                      </p>
                    </>
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
                  ) : location.pathname === '/blogs' ? (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Community Blogs
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Share insights and connect with fellow fund managers
                      </p>
                    </>
                  ) : location.pathname === '/profile' ? (
                    <>
                      <h2 className="text-2xl font-bold text-white transition-colors">
                        Company Profile
                      </h2>
                      <p className="text-sm text-white/70 transition-colors">
                        Update your company information
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
            
            {/* Header Actions */}
            {location.pathname === '/blogs' && (
              <Button 
                onClick={() => {
                  const event = new CustomEvent('openCreateBlogModal');
                  window.dispatchEvent(event);
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white rounded-full px-4"
              >
                <PlusCircle className="h-5 w-5" />
                Create Post
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
