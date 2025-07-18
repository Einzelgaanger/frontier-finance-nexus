
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, Home, FileText, Network, BarChart3, Shield, User, Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Handle navigation with transition
  const handleNavigation = (to: string) => {
    if (to === activePath) return; // Don't navigate if already on the page
    
    setIsTransitioning(true);
    
    // Add a small delay for the transition effect
    setTimeout(() => {
      navigate(to);
      setIsTransitioning(false);
    }, 150);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "member", "viewer"] },
    { name: "Network", href: "/network", icon: Network, roles: ["admin", "member", "viewer"] },
    { name: "Survey", href: "/survey", icon: FileText, roles: ["member", "viewer"] }, // Members and viewers
    { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] }, // Only admins
    { name: "Admin", href: "/admin", icon: Shield, roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    // Handle exact matches and sub-routes
    if (href === "/dashboard" && activePath === "/dashboard") return true;
    if (href === "/network" && activePath === "/network") return true;
    if (href === "/survey" && activePath === "/survey") return true;
    if (href === "/analytics" && activePath === "/analytics") return true;
    if (href === "/admin" && activePath.startsWith("/admin")) return true; // Admin pages
    return false;
  };

  const getNavItemClasses = (href: string) => {
    const active = isActive(href);
    const baseClasses = "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden group";
    
    if (active) {
      return `${baseClasses} text-white bg-blue-600 shadow-md transform scale-[1.02]`;
    } else {
      return `${baseClasses} text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm hover:scale-[1.01] hover:translate-y-[-1px]`;
    }
  };

  const getMobileNavItemClasses = (href: string) => {
    const active = isActive(href);
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out relative overflow-hidden group";
    
    if (active) {
      return `${baseClasses} text-white bg-blue-600 shadow-md`;
    } else {
      return `${baseClasses} text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm`;
    }
  };

  return (
    <header className={`border-b border-gray-200 bg-white shadow-sm transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-90 scale-[0.98]' : 'opacity-100 scale-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Remove logo and name */}
          <div />

          {showNav && user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <div key={item.name} className="relative">
                      {/* Subtle background animation */}
                      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ease-in-out ${
                        active 
                          ? 'bg-blue-600 shadow-lg' 
                          : 'bg-transparent group-hover:bg-blue-50'
                      }`} />
                      
                      {/* Ripple effect on hover */}
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-blue-100/50" />
                      
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={getNavItemClasses(item.href)}
                      >
                        {/* Icon with smooth transition */}
                        <Icon className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                          active 
                            ? 'text-white transform scale-110' 
                            : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-105'
                        }`} />
                        
                        {/* Text with smooth transition */}
                        <span className={`relative z-10 transition-all duration-300 ease-in-out ${
                          active ? 'text-white font-semibold' : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                          {item.name}
                        </span>
                        
                        {/* Active indicator with smooth animation */}
                        {active && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full animate-pulse" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </nav>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-sm">
                  <User className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-110" />
                  <span className="font-medium">{user.email}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize transition-all duration-300 ease-in-out hover:bg-blue-200">
                    {userRole}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 ease-in-out hover:shadow-sm hover:scale-[1.02]"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-110" />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-sm">
                      <Menu className="w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-110" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <div className="flex flex-col h-full">
                      {/* Header - remove logo and name */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Menu</span>
                      </div>
                      
                      {/* Navigation */}
                      <nav className="flex-1 space-y-1">
                        {filteredNavItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          
                          return (
                            <div key={item.name} className="relative">
                              {/* Subtle background animation */}
                              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ease-in-out ${
                                active 
                                  ? 'bg-blue-600 shadow-md' 
                                  : 'bg-transparent group-hover:bg-blue-50'
                              }`} />
                              
                              <button
                                onClick={() => handleNavigation(item.href)}
                                className={getMobileNavItemClasses(item.href)}
                              >
                                {/* Icon with smooth transition */}
                                <Icon className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                                  active 
                                    ? 'text-white transform scale-110' 
                                    : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-105'
                                }`} />
                                
                                {/* Text with smooth transition */}
                                <span className={`relative z-10 font-medium transition-all duration-300 ease-in-out ${
                                  active ? 'text-white font-semibold' : 'text-gray-700 group-hover:text-blue-600'
                                }`}>
                                  {item.name}
                                </span>
                                
                                {/* Active indicator with smooth animation */}
                                {active && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-pulse" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </nav>
                      
                      {/* User Info & Actions */}
                      <div className="border-t border-gray-200 pt-4 space-y-4">
                        {/* User Info */}
                        <div className="px-4 py-3 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-sm">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="w-5 h-5 text-gray-600 transition-transform duration-300 ease-in-out hover:scale-110" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                              <p className="text-xs text-gray-500 capitalize">Role: {userRole}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Sign Out Button */}
                        <Button
                          variant="outline"
                          onClick={handleSignOut}
                          className="w-full border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 ease-in-out hover:shadow-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2 transition-transform duration-300 ease-in-out hover:scale-110" />
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
