
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Building2, 
  Globe,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  Target,
  Award,
  Activity,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Wallet,
  ChartBar,
  PieChart,
  Network
} from 'lucide-react';

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
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-start">
        {/* Professional Header */}
        <div className="flex items-center justify-between" style={{ minHeight: 64 }}>
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

        {/* Professional Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fund Managers</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Regions</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+3</span>
                <span className="text-sm text-gray-500 ml-1">new regions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total AUM</p>
                  <p className="text-2xl font-bold text-gray-900">$2.4B</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+8.5%</span>
                <span className="text-sm text-gray-500 ml-1">from last quarter</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Network Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+34%</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+15</span>
                <span className="text-sm text-gray-500 ml-1">new members</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Level Card */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Access Level & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Network Access</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Fund Manager Profiles</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    View
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Survey Data</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    View
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Analytics Access</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Limited
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Network Updates</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Data Export</span>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Member Directory</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Access
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Contact Information</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    View
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Network Events</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Notify
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Account Status</h4>
                  <p className="text-sm text-gray-600">Visitor access granted until December 31, 2024</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Access
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewerDashboard;
