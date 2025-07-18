
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  UserPlus, 
  Building2, 
  Key, 
  Users, 
  Globe, 
  FileText, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  Briefcase, 
  LineChart,
  Menu, 
  Home, 
  Settings, 
  HelpCircle, 
  LogOut, 
  TrendingUp,
  Wallet, 
  ChartBar, 
  PieChart, 
  Network,
  RefreshCw,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import { ESCPApplicationModal } from './ESCPApplicationModal';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  const loadingTips = React.useMemo(() => [
    { icon: TrendingUp, text: "Analyzing market trends..." },
    { icon: Wallet, text: "Preparing fund manager insights..." },
    { icon: ChartBar, text: "Loading investment data..." },
    { icon: PieChart, text: "Calculating portfolio metrics..." },
    { icon: Network, text: "Connecting to global network..." }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => clearInterval(tipTimer);
  }, [loadingTips.length]);

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 mb-4 shadow-sm">
            {React.createElement(loadingTips[currentTip].icon, {
              className: "w-8 h-8 text-blue-600"
            })}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading ESCP Network
          </h2>
          <p className="text-gray-600 text-lg">
            {loadingTips[currentTip].text}
          </p>
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Loading progress</span>
            <span>{progress}%</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2 mt-8">
            {loadingTips.map((tip, index) => (
              <div
                key={index}
                className={`w-full h-1 rounded-full transition-all duration-300 ${
                  index === currentTip ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewerDashboard = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">ESCP Network</h1>
                <p className="text-gray-600 text-sm">Early Stage Capital Provider Network - Global Fund Manager Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
              <Badge 
                variant="outline" 
                className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visitor Access
              </Badge>
            </div>
          </div>
        </div>

        {/* Professional Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Network Size</p>
                  <p className="text-2xl font-bold text-gray-900">120+</p>
                  <p className="text-xs text-gray-500 mt-1">Fund managers</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Geographic Reach</p>
                  <p className="text-2xl font-bold text-gray-900">30+</p>
                  <p className="text-xs text-gray-500 mt-1">Countries</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Investment Focus</p>
                  <p className="text-2xl font-bold text-gray-900">Frontier</p>
                  <p className="text-xs text-gray-500 mt-1">Markets</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Your Status</p>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                    Visitor
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Apply for membership</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Send className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Apply for ESCP Network Membership</CardTitle>
                      <CardDescription className="text-sm">
                        Join our network of emerging market fund managers
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowApplicationModal(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Application
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                      Application Process
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Complete detailed application form',
                        'Admin review and approval',
                        'Account upgrade to member status',
                        'Complete member survey'
                      ].map((step, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-sm font-medium text-green-800">
                            {i + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                      Member Benefits
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Access full network directory',
                        'Connect with fund managers',
                        'Share investment insights',
                        'Join exclusive events'
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Access & Stats */}
          <div className="space-y-6">
            {/* Access Level Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  Visitor Access Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[
                      'Browse limited directory',
                      'View public profiles',
                      'Apply for membership'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = '/network'}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Browse Directory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Application Modal */}
        <ESCPApplicationModal 
          open={showApplicationModal} 
          onClose={() => setShowApplicationModal(false)} 
        />
      </div>
    </div>
  );
};

export default ViewerDashboard;
