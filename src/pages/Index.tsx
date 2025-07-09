
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, BarChart3, Search, Database, FileText, TrendingUp, Globe, Building2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Frontier Finance</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Fund Manager
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Database Platform
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with emerging market fund managers through our comprehensive data collection and analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                  Join the Network
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/network">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                  Browse Directory
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-6 h-6 text-white/60 mx-auto" />
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-lg text-blue-100">Everything you need to manage and analyze fund data</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fund Directory */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Fund Manager Directory</CardTitle>
                <CardDescription className="text-blue-100">
                  Browse and connect with emerging market fund managers across different regions and sectors.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Data Collection */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Comprehensive Surveys</CardTitle>
                <CardDescription className="text-blue-100">
                  Complete detailed questionnaires covering investment strategy, team composition, and fund performance.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Analytics */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-blue-100">
                  Access detailed analytics and insights on fund performance, sector trends, and market data.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Geographic Coverage */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Global Coverage</CardTitle>
                <CardDescription className="text-blue-100">
                  Connect with funds operating across Africa, Asia, Latin America, and other emerging markets.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Secure Platform */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Enterprise Security</CardTitle>
                <CardDescription className="text-blue-100">
                  Role-based access control with bank-level security ensuring your sensitive data stays protected.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Network Growth */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Growing Network</CardTitle>
                <CardDescription className="text-blue-100">
                  Join a rapidly expanding community of fund managers and institutional investors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-md py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Frontier Finance</span>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting emerging market fund managers through comprehensive data collection and analytics.
              </p>
              <p className="text-gray-400 text-sm">
                Use your work email for fund verification during registration.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/auth" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/network" className="text-gray-300 hover:text-white transition-colors">Fund Directory</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Frontier Finance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Index;
