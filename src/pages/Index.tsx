
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, BarChart3, Search, Database, FileText, TrendingUp, Globe, Building2, Mail, Phone, MapPin, ExternalLink, Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white scrollbar-hide">
      {/* Hero Section with Background Image - Full Screen */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content - Centered in the full screen */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Collaborative for Frontier Finance Fund Manager Database Platform
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for emerging market fund managers to connect, share data, 
              and access valuable insights through our secure database network.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Join the Network</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
              <Link to="/network">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Browse Directory</span>
                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/auth.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">Platform Features</h2>
            <p className="text-xl text-white/90 animate-fade-in-delay">Everything you need to manage and analyze fund data</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fund Directory */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-400/30 hover:border-blue-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all duration-500">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">Fund Manager Directory</h3>
                <p className="text-blue-100/90 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed">
                  Browse and connect with emerging market fund managers across different regions and sectors.
                </p>
                <div className="mt-6 flex items-center text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
                  <span className="text-sm font-medium">Explore Network</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Data Collection */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-400/30 hover:border-green-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up-delay-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-green-500/25 group-hover:scale-110 transition-all duration-500">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-200 transition-colors duration-300">Comprehensive Surveys</h3>
                <p className="text-green-100/90 group-hover:text-green-100 transition-colors duration-300 leading-relaxed">
                  Complete detailed questionnaires covering investment strategy, team composition, and fund performance.
                </p>
                <div className="mt-6 flex items-center text-green-200 group-hover:text-green-100 transition-colors duration-300">
                  <span className="text-sm font-medium">Start Survey</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-400/30 hover:border-purple-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up-delay-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-purple-500/25 group-hover:scale-110 transition-all duration-500">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">Advanced Analytics</h3>
                <p className="text-purple-100/90 group-hover:text-purple-100 transition-colors duration-300 leading-relaxed">
                  Access detailed analytics and insights on fund performance, sector trends, and market data.
                </p>
                <div className="mt-6 flex items-center text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                  <span className="text-sm font-medium">View Insights</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md border border-orange-400/30 hover:border-orange-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up-delay-3">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-orange-500/25 group-hover:scale-110 transition-all duration-500">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-200 transition-colors duration-300">Global Coverage</h3>
                <p className="text-orange-100/90 group-hover:text-orange-100 transition-colors duration-300 leading-relaxed">
                  Connect with funds operating across Africa, Asia, Latin America, and other emerging markets.
                </p>
                <div className="mt-6 flex items-center text-orange-200 group-hover:text-orange-100 transition-colors duration-300">
                  <span className="text-sm font-medium">Explore Regions</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Secure Platform */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-400/30 hover:border-red-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up-delay-4">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-red-500/25 group-hover:scale-110 transition-all duration-500">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-200 transition-colors duration-300">Enterprise Security</h3>
                <p className="text-red-100/90 group-hover:text-red-100 transition-colors duration-300 leading-relaxed">
                  Role-based access control with bank-level security ensuring your sensitive data stays protected.
                </p>
                <div className="mt-6 flex items-center text-red-200 group-hover:text-red-100 transition-colors duration-300">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Network Growth */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-md border border-indigo-400/30 hover:border-indigo-300/50 transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-slide-up-delay-5">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-indigo-500/25 group-hover:scale-110 transition-all duration-500">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-200 transition-colors duration-300">Growing Network</h3>
                <p className="text-indigo-100/90 group-hover:text-indigo-100 transition-colors duration-300 leading-relaxed">
                  Join a rapidly expanding community of fund managers and institutional investors.
                </p>
                <div className="mt-6 flex items-center text-indigo-200 group-hover:text-indigo-100 transition-colors duration-300">
                  <span className="text-sm font-medium">Join Network</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-blue-950 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo.jpg" alt="CFF Logo" className="w-12 h-12 rounded-lg shadow-lg" />
                <span className="text-2xl font-bold text-white">Collaborative for Frontier Finance</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Connecting emerging market fund managers through comprehensive data collection and analytics.
              </p>
                                        <div className="space-y-4 mb-6">
                <a 
                  href="mailto:info@cff.org" 
                  className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">info@cff.org</span>
                </a>
                <a 
                  href="tel:+15551234567" 
                  className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">+1 (555) 123-4567</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=Global+Network+Office" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Global Network Office</span>
                </a>
              </div>
            </div>
            
            {/* Platform Links */}
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/auth" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/network" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <Globe className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Fund Directory
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Support & Social */}
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Support
              </h3>
              <ul className="space-y-3 mb-8">
                <li>
                  <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <Shield className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Privacy Policy
                  </a>
                </li>
              </ul>
              
              {/* Social Media */}
              <div>
                <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-300 text-sm mb-4 md:mb-0">
                © 2025 Collaborative for Frontier Finance. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Terms of Service</a>
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Privacy Policy</a>
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
