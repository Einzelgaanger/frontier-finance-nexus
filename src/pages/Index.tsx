
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, BarChart3, Search, Database, FileText, TrendingUp, Globe, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image - Full Screen */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Navigation - Positioned absolutely over the background */}
        <nav className="relative z-20 border-b border-white/20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <img src="/logo.jpg" alt="CFF Logo" className="w-12 h-12 rounded-lg" />
                <span className="text-2xl font-bold text-white">Collaborative for Frontier Finance</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content - Centered in the remaining space */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Fund Manager Database Platform
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for emerging market fund managers to connect, share data, 
              and access valuable insights through our secure database network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Join the Network
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/network">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black bg-white/10 backdrop-blur-sm">
                  Browse Directory
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage and analyze fund data</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fund Directory */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-black">Fund Manager Directory</CardTitle>
                <CardDescription>
                  Browse and connect with emerging market fund managers across different regions and sectors.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Data Collection */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-black">Comprehensive Surveys</CardTitle>
                <CardDescription>
                  Complete detailed questionnaires covering investment strategy, team composition, and fund performance.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Analytics */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-black">Advanced Analytics</CardTitle>
                <CardDescription>
                  Access detailed analytics and insights on fund performance, sector trends, and market data.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Geographic Coverage */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-black">Global Coverage</CardTitle>
                <CardDescription>
                  Connect with funds operating across Africa, Asia, Latin America, and other emerging markets.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Secure Platform */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-black">Enterprise Security</CardTitle>
                <CardDescription>
                  Role-based access control with bank-level security ensuring your sensitive data stays protected.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Network Growth */}
            <Card className="bg-white border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-black">Growing Network</CardTitle>
                <CardDescription>
                  Join a rapidly expanding community of fund managers and institutional investors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.jpg" alt="CFF Logo" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-white">Collaborative for Frontier Finance</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting emerging market fund managers through comprehensive data collection and analytics.
              </p>
              <p className="text-gray-500 text-sm">
                Use your work email for fund verification during registration.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/auth" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/network" className="text-gray-400 hover:text-white">Fund Directory</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Collaborative for Frontier Finance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
