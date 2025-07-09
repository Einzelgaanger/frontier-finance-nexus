
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut } from "lucide-react";
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
    { name: "Dashboard", href: "/dashboard", roles: ["admin", "member", "viewer"] },
    { name: "Survey", href: "/survey", roles: ["member", "viewer"] },
    { name: "Network", href: "/network", roles: ["admin", "member", "viewer"] },
    { name: "Analytics", href: "/analytics", roles: ["admin", "member", "viewer"] },
    { name: "Admin", href: "/admin", roles: ["admin"] },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="CFF Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-black">Collaborative for Frontier Finance</span>
          </div>

          {showNav && user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  {user.email} ({userRole})
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-lg font-semibold">Menu</span>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                      </div>
                      
                      <nav className="flex-1 space-y-2">
                        {filteredNavItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </nav>
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="px-3 py-2 text-sm text-gray-600">
                          {user.email}
                        </div>
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Role: {userRole}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
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
