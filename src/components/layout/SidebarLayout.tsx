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
  User,
  Crown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye
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
      description: "Overview and analytics",
      badge: null,
      shortcut: "D",
      color: "blue"
    },
    { 
      name: "Network", 
      href: "/network", 
      icon: Network, 
      roles: ["admin", "member", "viewer"],
      description: "Fund manager directory",
      badge: "12",
      shortcut: "N",
      color: "green"
    },
    { 
      name: "Survey", 
      href: "/survey", 
      icon: FileText, 
      roles: ["member", "viewer"],
      description: "Complete surveys and assessments",
      badge: null,
      shortcut: "S",
      color: "orange"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: BarChart3, 
      roles: ["admin"],
      description: "Data insights and reports",
      badge: null,
      shortcut: "A",
      color: "red"
    },
    { 
      name: "Admin Panel", 
      href: "/admin", 
      icon: Shield, 
      roles: ["admin"],
      description: "User and system management",
      badge: "5",
      shortcut: "P",
      color: "black"
    },
  ];


  const filteredNavItems = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  // Helper function to get smooth color classes
  const getSmoothColorClasses = (color: string, isActive: boolean = false) => {
    const colorMap = {
      blue: {
        icon: 'text-blue-500',
        iconBg: 'bg-blue-50',
        text: 'text-gray-700',
        bg: isActive ? 'bg-blue-50' : 'bg-transparent',
        hover: 'hover:bg-gray-50',
        border: 'border-transparent',
        accent: 'bg-blue-500'
      },
      green: {
        icon: 'text-green-500',
        iconBg: 'bg-green-50',
        text: 'text-gray-700',
        bg: isActive ? 'bg-green-50' : 'bg-transparent',
        hover: 'hover:bg-gray-50',
        border: 'border-transparent',
        accent: 'bg-green-500'
      },
      orange: {
        icon: 'text-orange-500',
        iconBg: 'bg-orange-50',
        text: 'text-gray-700',
        bg: isActive ? 'bg-orange-50' : 'bg-transparent',
        hover: 'hover:bg-gray-50',
        border: 'border-transparent',
        accent: 'bg-orange-500'
      },
      red: {
        icon: 'text-red-500',
        iconBg: 'bg-red-50',
        text: 'text-gray-700',
        bg: isActive ? 'bg-red-50' : 'bg-transparent',
        hover: 'hover:bg-gray-50',
        border: 'border-transparent',
        accent: 'bg-red-500'
      },
      black: {
        icon: 'text-gray-700',
        iconBg: 'bg-gray-50',
        text: 'text-gray-700',
        bg: isActive ? 'bg-gray-50' : 'bg-transparent',
        hover: 'hover:bg-gray-50',
        border: 'border-transparent',
        accent: 'bg-gray-700'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/dashboard") return true;
    if (href === "/network" && location.pathname === "/network") return true;
    if (href === "/survey" && location.pathname === "/survey") return true;
    if (href === "/analytics" && location.pathname === "/analytics") return true;
    if (href === "/admin" && location.pathname.startsWith("/admin")) return true;
    return false;
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          icon: Crown,
          className: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
          description: 'Full system access',
          color: 'text-red-500'
        };
      case 'member':
        return {
          label: 'Member',
          icon: User,
          className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
          description: 'Network access',
          color: 'text-emerald-500'
        };
      case 'viewer':
      default:
        return {
          label: 'Visitor',
          icon: Eye,
          className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          description: 'Limited access',
          color: 'text-blue-500'
        };
    }
  };


  const roleConfig = getRoleConfig(userRole || 'viewer');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 'n':
            e.preventDefault();
            navigate('/network');
            break;
          case 's':
            e.preventDefault();
            navigate('/survey');
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
    <div className="min-h-screen flex transition-all duration-300 bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-16" : "w-72",
        "bg-white border-r border-gray-100 shadow-sm"
      )}>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 transition-all duration-300">
            {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                  <h1 className="text-lg font-semibold text-gray-900 transition-colors">
                    ESCP Network
                  </h1>
                  <p className="text-xs text-gray-500 transition-colors">
                    Admin Portal
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const colors = getSmoothColorClasses(item.color, active);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    colors.bg,
                    colors.hover,
                    active && "shadow-sm",
                    sidebarCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <div className={cn(
                    "flex items-center transition-all duration-200",
                    sidebarCollapsed ? "justify-center" : "space-x-3"
                  )}>
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      colors.iconBg,
                      active && "shadow-sm",
                      sidebarCollapsed ? "p-2.5" : "p-2"
                    )}>
                      <Icon className={cn("transition-colors", colors.icon, sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                    </div>
                    {!sidebarCollapsed && (
                      <>
                        <div className="text-left">
                          <p className={cn("font-medium text-sm transition-colors", colors.text)}>
                            {item.name}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                      <kbd className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                        {item.shortcut}
                      </kbd>
                    </div>
                  )}
                  {active && (
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-r-full", colors.accent)} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="relative">
            <button
              onClick={handleSignOut}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-red-50",
                sidebarCollapsed ? "justify-center" : "justify-between"
              )}
              title={sidebarCollapsed ? "Sign Out" : undefined}
            >
              <div className={cn(
                "flex items-center transition-all duration-200",
                sidebarCollapsed ? "justify-center" : "space-x-3"
              )}>
                <div className={cn(
                  "p-2 rounded-lg bg-red-50 transition-all duration-200",
                  sidebarCollapsed ? "p-2.5" : "p-2"
                )}>
                  <LogOut className={cn("text-red-500", sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                </div>
                {!sidebarCollapsed && (
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-700">
                      Sign Out
                    </p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* User Info */}
          <div className="relative">
            <button
              onClick={() => console.log('User info clicked')}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-blue-50",
                sidebarCollapsed ? "justify-center" : "justify-between"
              )}
              title={sidebarCollapsed ? `${user?.email} - ${roleConfig.label}` : undefined}
            >
              <div className={cn(
                "flex items-center transition-all duration-200",
                sidebarCollapsed ? "justify-center" : "space-x-3"
              )}>
                <div className={cn(
                  "p-2 rounded-lg bg-blue-50 transition-all duration-200",
                  sidebarCollapsed ? "p-2.5" : "p-2"
                )}>
                  <User className={cn("text-blue-500", sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                </div>
                {!sidebarCollapsed && (
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-700 truncate">
                      {user?.email}
                    </p>
                    <Badge className="mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      <roleConfig.icon className="w-3 h-3 mr-1" />
                      {roleConfig.label}
                    </Badge>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="border-b border-gray-200 px-6 py-4 flex-shrink-0 transition-colors bg-white">
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
                <h2 className="text-2xl font-bold text-gray-900 transition-colors">
                  {location.pathname === '/dashboard' && 'Dashboard'}
                  {location.pathname === '/network' && 'Network Directory'}
                  {location.pathname === '/survey' && 'Survey Center'}
                  {location.pathname === '/analytics' && 'Analytics Hub'}
                  {location.pathname.startsWith('/admin') && 'Admin Panel'}
                </h2>
                <p className="text-sm text-gray-500 transition-colors">
                  {location.pathname === '/dashboard' && 'Overview of your network and activities'}
                  {location.pathname === '/network' && 'Browse and connect with fund managers'}
                  {location.pathname === '/survey' && 'Complete and manage surveys'}
                  {location.pathname === '/analytics' && 'Data insights and comprehensive reports'}
                  {location.pathname.startsWith('/admin') && 'Manage users, content, and system settings'}
                </p>
              </div>
            </div>
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
