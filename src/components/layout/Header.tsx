
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, Home, FileText, Network, BarChart3, Shield, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  showNav?: boolean;
}

const Header = ({ showNav = true }: HeaderProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "member", "viewer"] },
    { name: "Network", href: "/network", icon: Network, roles: ["admin", "member", "viewer"] },
    { name: "Survey", href: "/survey", icon: FileText, roles: ["member"] }, // Only members
    { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin"] }, // Only admins
    { name: "Admin", href: "/admin", icon: Shield, roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="CFF Logo" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-black">Collaborative for Frontier Finance</span>
          </div>

          {showNav && user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.email}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
                    {userRole}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-white">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <img src="/logo.jpg" alt="CFF Logo" className="w-8 h-8 rounded-lg" />
                          <span className="text-lg font-bold text-gray-900">Menu</span>
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <nav className="flex-1 space-y-1">
                        {filteredNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          );
                        })}
                      </nav>
                      
                      {/* User Info & Actions */}
                      <div className="border-t border-gray-200 pt-4 space-y-4">
                        {/* User Info */}
                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 mb-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                              <p className="text-xs text-gray-500 capitalize">Role: {userRole}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="space-y-2">
                          {userRole === 'member' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start border-gray-300 hover:bg-gray-50"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Settings
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSignOut}
                            className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
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
