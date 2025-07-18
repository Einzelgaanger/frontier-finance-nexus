import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  fullscreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullscreen = true }) => {
  const containerClasses = fullscreen
    ? "fixed inset-0 z-50"
    : "absolute inset-0 z-10";

  return (
    <div className={`${containerClasses} bg-white flex items-center justify-center`}>
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          {/* Spinning icon with light effect */}
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          
          {/* Light effect going around the icon */}
          <div className="absolute inset-0 w-12 h-12">
            <div className="w-full h-full rounded-full border-2 border-transparent border-t-blue-400 animate-spin"></div>
          </div>
        </div>
        
        <p className="text-gray-600 mt-4 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 