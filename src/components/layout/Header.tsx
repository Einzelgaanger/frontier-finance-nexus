
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Home, FileText, Network, BarChart3, Shield, User, Eye, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Simple navigation handler
  const handleNavigation = (to: string) => {
    console.log('Navigating to:', to);
    navigate(to);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "member", "viewer"] },
    { name: "Network", href: "/network", icon: Network, roles: ["admin", "member", "viewer"] },
    { name: "Survey", href: "/survey", icon: FileText, roles: ["member", "viewer"] },
    { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] },
    { name: "Admin", href: "/admin", icon: Shield, roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === "/dashboard" && activePath === "/dashboard") return true;
    if (href === "/network" && activePath === "/network") return true;
    if (href === "/survey" && activePath === "/survey") return true;
    if (href === "/analytics" && activePath === "/analytics") return true;
    if (href === "/admin" && activePath.startsWith("/admin")) return true;
    return false;
  };

  // Role-based badge configuration
  const getRoleBadgeConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          icon: Shield,
          className: 'px-3 py-1 bg-red-50 text-red-700 border-red-200',
          popupClassName: 'bg-red-600 text-white',
          description: 'Full system access and management capabilities',
          features: [
            'Manage all users and permissions',
            'Access comprehensive analytics',
            'Moderate network content',
            'Configure system settings',
            'View all survey responses',
            'Manage member applications'
          ]
        };
      case 'member':
        return {
          label: 'Member',
          icon: User,
          className: 'px-3 py-1 bg-green-50 text-green-700 border-green-200',
          popupClassName: 'bg-green-600 text-white',
          description: 'Full access to network and survey features',
          features: [
            'Complete network directory access',
            'Submit and manage surveys',
            'View detailed member profiles',
            'Access member-only resources',
            'Participate in network discussions',
            'Download reports and data'
          ]
        };
      case 'viewer':
      default:
        return {
          label: 'Visitor',
          icon: Eye,
          className: 'px-3 py-1 bg-blue-50 text-blue-700 border-blue-200',
          popupClassName: 'bg-blue-600 text-white',
          description: 'Limited access to network resources',
          features: [
            'Browse limited directory of fund managers',
            'View public profiles and basic information',
            'Apply for full membership access',
            'Access public network resources'
          ]
        };
    }
  };

  const roleConfig = getRoleBadgeConfig(userRole || 'viewer');

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm rounded-bl-xl rounded-br-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - CFF Logo */}
          <div className="flex items-center">
            <img 
              src="/CFF LOGO.png" 
              alt="CFF Logo" 
              className="h-12 w-auto object-contain"
            />
            {userRole !== 'admin' && (
              <div className="ml-4 text-left">
                <p className="text-sm text-black font-medium leading-tight max-w-xs">
                  Your gateway to the global fund manager community
                </p>
              </div>
            )}
          </div>

          {showNav && user && (
            <>
              {/* Right side - Navigation and User Info */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Navigation Container */}
                <div className="bg-gray-100 rounded-2xl px-3 py-1.5 shadow-md border border-gray-200">
                  <nav className="flex items-center space-x-2">
                    {filteredNavItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden group ${
                            active 
                              ? 'text-blue-700 bg-white shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                          }`}
                        >
                          {/* Icon */}
                          <Icon className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                            active 
                              ? 'text-blue-600' 
                              : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                          
                          {/* Text */}
                          <span className="relative z-10">
                            {item.name}
                          </span>
                          
                          {/* Hover Underline Effect */}
                          <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out transform -translate-x-1/2 ${
                            active 
                              ? 'w-full' 
                              : 'group-hover:w-full'
                          }`} />
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Email Display */}
                <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-800 text-xs break-all max-w-xs">{user.email || ''}</span>
                  
                  {/* Role-based Access Badge with Hover Popup */}
                  <div className={`relative ${userRole === 'admin' ? '' : 'group'}`}>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 ${roleConfig.className} cursor-help`}
                    >
                      <roleConfig.icon className="w-4 h-4 mr-2" />
                      {roleConfig.label}
                    </Badge>
                    
                    {/* Hover Popup Card */}
                    <div className="absolute right-0 top-full mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-[9999]">
                      <Card className="shadow-xl border-gray-200 bg-white">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center">
                            <div className={`w-8 h-8 ${roleConfig.className.split(' ')[1]} rounded-lg flex items-center justify-center mr-3`}>
                              <roleConfig.icon className={`w-4 h-4 ${roleConfig.className.split(' ')[2]}`} />
                            </div>
                            Current Access Level
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className={`text-center p-3 ${roleConfig.className.split(' ')[1]} rounded-lg border ${roleConfig.className.split(' ')[3]}`}>
                            <Badge className={`px-3 py-1 text-base ${roleConfig.popupClassName} mb-2`}>
                              <roleConfig.icon className="w-4 h-4 mr-2" />
                              {roleConfig.label}
                            </Badge>
                            <p className={`text-sm ${roleConfig.className.split(' ')[2]} font-medium`}>
                              {roleConfig.description}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <h5 className="font-semibold text-gray-800 text-center mb-3">What You Can Do Now</h5>
                            {roleConfig.features.map((feature, i) => (
                              <div key={i} className="flex items-center text-gray-700 p-2 bg-gray-50 rounded-lg">
                                <div className={`w-2 h-2 ${roleConfig.className.split(' ')[2].replace('text-', 'bg-').replace('-700', '-500')} rounded-full mr-3 flex-shrink-0`}></div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-center pt-2">
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                              onClick={() => navigate('/network')}
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Browse Directory
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                {/* User Info Section */}
                <div className="flex items-center space-x-4">
                  {/* Email and Role (2 rows) */}
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-700 break-all max-w-xs">
                      {user?.email || ''}
                    </p>
                    {/* Role Badge */}
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userRole === 'admin' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : userRole === 'member' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {userRole === 'admin' ? 'Administrator' : 
                         userRole === 'member' ? 'Member' : 'Visitor'}
                      </span>
                    </div>
                  </div>
                  {/* Profile Picture - furthest right */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>

                {/* Sign Out Button */}
                <Button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-105 border-0 text-xs"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-sm rounded-xl">
                      <Menu className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-110" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <div className="flex flex-col h-full">
                      {/* Mobile Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-900">Menu</span>
                          {/* Mobile User Info */}
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                              {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-700 truncate max-w-20">
                                {user?.email?.split('@')[0]}
                              </p>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                userRole === 'admin' 
                                  ? 'bg-red-100 text-red-700' 
                                  : userRole === 'member' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {userRole === 'admin' ? 'Admin' : 
                                 userRole === 'member' ? 'Member' : 'Visitor'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Navigation */}
                      <nav className="flex-1 space-y-2">
                        {filteredNavItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          
                          return (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation(item.href)}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out relative overflow-hidden group ${
                                active 
                                  ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              {/* Icon */}
                              <Icon className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                                active 
                                  ? 'text-blue-600' 
                                  : 'text-gray-500 group-hover:text-gray-700'
                              }`} />
                              
                              {/* Text */}
                              <span className="relative z-10 font-medium">
                                {item.name}
                              </span>
                              
                              {/* Active indicator */}
                              {active && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                              )}
                            </button>
                          );
                        })}
                      </nav>
                      
                      {/* Mobile User Info & Actions */}
                      <div className="border-t border-gray-200 pt-4 space-y-4">
                        {/* User Info */}
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`px-2 py-1 text-xs ${roleConfig.className}`}>
                                  <roleConfig.icon className="w-3 h-3 mr-1" />
                                  {roleConfig.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mobile Sign Out Button */}
                        <Button
                          onClick={handleSignOut}
                          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
