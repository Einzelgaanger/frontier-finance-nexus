
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
  DollarSign,
  ArrowRight,
  Star,
  Zap,
  Target,
  Users2,
  Globe2,
  Building,
  Lightbulb,
  Rocket,
  Handshake
} from 'lucide-react';
import { ESCPApplicationModal } from './ESCPApplicationModal';
import { supabase } from '@/integrations/supabase/client';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Network className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading ESCP Network</h2>
          <p className="text-gray-600">Preparing your dashboard...</p>
        </div>
        
        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          {React.createElement(loadingTips[currentTip].icon, { className: "w-4 h-4" })}
          <span>{loadingTips[currentTip].text}</span>
        </div>
      </div>
    </div>
  );
};

const ViewerDashboard = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Auto-rotate through animation steps
      const interval = setInterval(() => {
        setCurrentAnimationStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const animationSteps = [
    {
      icon: FileText,
      title: "Complete Application",
      description: "Fill out our comprehensive form with your fund details and investment thesis",
      color: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: ShieldCheck,
      title: "Admin Review",
      description: "Our team conducts thorough due diligence and reviews your application",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: UserPlus,
      title: "Account Upgrade",
      description: "Upon approval, your account is upgraded to full member status",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: ChartBar,
      title: "Member Survey",
      description: "Participate in annual surveys to contribute to industry insights",
      color: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-beige-100 to-stone-50">
      <div className="h-full flex">
        {/* Left Side - Content */}
        <div className="w-1/2 flex flex-col justify-start pt-16 pl-12">
          <div className="max-w-lg">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-800 mb-4 leading-tight">
                Join the <span className="font-medium text-indigo-600">ESCP Network</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with emerging market fund managers worldwide and unlock new investment opportunities through our exclusive network.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-700">Full network access to fund managers</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-700">Global investment insights and data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-700">Exclusive networking events</span>
              </div>
            </div>

            {/* Application Button */}
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 rounded-xl"
              onClick={() => setShowApplicationModal(true)}
            >
              <FileText className="w-6 h-6 mr-3" />
              Start Your Application
            </Button>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div className="w-1/2 flex items-start justify-center pt-16 pr-12">
          <div className="relative w-full max-w-lg">
            {/* Animated Content */}
            <div className="relative">
              {animationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentAnimationStep 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-95 rotate-2'
                  }`}
                >
                  <div className={`${step.color} rounded-3xl p-10 shadow-xl border border-white/50`}>
                    <div className="text-center">
                      <div className={`w-24 h-24 ${step.color.replace('bg-', 'bg-').replace('-100', '-200')} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                        <step.icon className={`w-12 h-12 ${step.iconColor}`} />
                      </div>
                      <h3 className="text-3xl font-medium text-gray-800 mb-6">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed text-center">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-3 mt-10">
              {animationSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAnimationStep(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentAnimationStep 
                      ? 'bg-indigo-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Application Modal */}
      <ESCPApplicationModal 
        open={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
      />
    </div>
  );
};

export default ViewerDashboard;
