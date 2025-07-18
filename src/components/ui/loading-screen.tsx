import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Wallet, ChartBar, PieChart, Network,
  LineChart, BarChart, DollarSign, Globe, Building2
} from 'lucide-react';

interface LoadingScreenProps {
  fullscreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullscreen = true }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  const loadingTips = React.useMemo(() => [
    { icon: Building2, text: "Loading financial insights..." },
    { icon: TrendingUp, text: "Analyzing market data..." },
    { icon: Globe, text: "Connecting to global network..." },
    { icon: DollarSign, text: "Processing investments..." },
    { icon: BarChart, text: "Generating analytics..." },
    { icon: LineChart, text: "Updating market trends..." },
    { icon: Network, text: "Syncing network data..." }
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
    }, 50); // Faster progress for better UX

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 1500); // Faster tip rotation

    return () => clearInterval(tipTimer);
  }, [loadingTips.length]);

  const containerClasses = fullscreen
    ? "fixed inset-0 z-50"
    : "absolute inset-0 z-10";

  return (
    <div className={`${containerClasses} bg-gradient-to-br from-blue-900/5 to-green-900/5 backdrop-blur-sm flex items-center justify-center`}>
      <div className="max-w-md w-full mx-4 backdrop-blur-md bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200/50">
        {/* Animated Logo/Icon */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-green-500/10 mb-4 p-4">
            {React.createElement(loadingTips[currentTip].icon, {
              className: "w-10 h-10 text-blue-600 animate-bounce"
            })}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-20 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
            Please Wait
          </h2>
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            {loadingTips[currentTip].text}
          </p>
        </div>
        
        {/* Progress Section */}
        <div className="space-y-4">
          {/* Glowing Progress Bar */}
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-2 w-full [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-green-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-lg" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600">Loading...</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          
          {/* Progress Indicators */}
          <div className="grid grid-cols-7 gap-1 mt-6">
            {loadingTips.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentTip 
                    ? 'bg-gradient-to-r from-blue-500 to-green-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
