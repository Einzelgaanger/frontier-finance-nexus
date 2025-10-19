// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  FileText, 
  ArrowRight, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Globe,
  Shield,
  Rocket,
  Lightbulb,
  Heart,
  Bookmark,
  Download,
  Share2,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle,
  Lock,
  Unlock,
  EyeOff,
  Maximize,
  Minimize,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  X,
  Menu,
  Crown,
  LogOut,
  ArrowLeft,
  Save,
  Send,
  FolderCloud,
  FolderCloudUpload,
  FolderCloudDownload,
  FolderCloudSync,
  FolderCloudPaste,
  FolderCloudCut,
  FolderCloudDuplicate,
  FolderCloudShare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ViewerSurveyNavigation = () => {
  const location = useLocation();
  const [surveyStatuses, setSurveyStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const surveys = [
    {
      year: 2021,
      title: "ESCP Network Survey 2021",
      description: "Comprehensive survey covering investment strategies, market outlook, and emerging trends in 2021.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      path: "/survey/2021",
      features: ["Investment Strategies", "Market Analysis", "Risk Assessment", "ESG Practices"],
      status: "available",
      completionRate: 0,
      participants: 45,
      lastUpdated: "2021-12-15"
    },
    {
      year: 2022,
      title: "ESCP Network Survey 2022",
      description: "Deep dive into post-pandemic recovery, digital transformation, and sustainable investing trends.",
      icon: Rocket,
      color: "from-green-500 to-emerald-500",
      path: "/survey/2022",
      features: ["Digital Transformation", "Sustainability", "Recovery Analysis", "Technology Trends"],
      status: "available",
      completionRate: 0,
      participants: 52,
      lastUpdated: "2022-12-20"
    },
    {
      year: 2023,
      title: "ESCP Network Survey 2023",
      description: "Focus on AI integration, climate finance, and emerging market opportunities in a changing world.",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      path: "/survey/2023",
      features: ["AI Integration", "Climate Finance", "Emerging Markets", "Innovation"],
      status: "available",
      completionRate: 0,
      participants: 48,
      lastUpdated: "2023-12-18"
    },
    {
      year: 2024,
      title: "ESCP Network Survey 2024",
      description: "Latest insights on geopolitical impacts, fintech evolution, and the future of emerging market investing.",
      icon: Target,
      color: "from-orange-500 to-red-500",
      path: "/survey/2024",
      features: ["Geopolitical Analysis", "Fintech Evolution", "Future Outlook", "Global Trends"],
      status: "active",
      completionRate: 0,
      participants: 38,
      lastUpdated: "2024-11-30"
    }
  ];

  // Check if a survey is completed
  const isSurveyCompleted = (year: number) => {
    const surveyStatus = surveyStatuses.find(s => s.year === year);
    return surveyStatus?.completedAt != null;
  };

  // Initialize with empty survey statuses (no completed surveys)
  useEffect(() => {
    setSurveyStatuses([]);
  }, []);

  // Remove loading state to prevent flash
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-6">
  //       <div className="max-w-6xl mx-auto">
  //         <div className="flex items-center justify-center h-64">
  //           <div className="text-center">
  //             <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
  //             <p className="text-gray-600">Loading surveys...</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {surveys.map((survey) => {
            const isActive = location.pathname === survey.path;
            const isCompleted = isSurveyCompleted(survey.year);
            const surveyStatus = surveyStatuses.find(s => s.year === survey.year);
            const IconComponent = survey.icon;
            
            return (
              <Card 
                key={survey.year} 
                className={`group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white ${
                  isActive ? 'ring-2 ring-blue-500 scale-105' : ''
                } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${survey.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {survey.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {survey.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {survey.status === 'active' && !isCompleted && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {survey.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress Bar for Active Surveys */}
                  {survey.status === 'active' && !isCompleted && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-blue-600">In Progress</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  )}

                  {/* Completion Info */}
                  {isCompleted && surveyStatus?.completedAt && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed on {new Date(surveyStatus.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Survey Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{survey.participants}</div>
                      <div className="text-xs text-gray-500">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{survey.completionRate}%</div>
                      <div className="text-xs text-gray-500">Completion Rate</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Link to={survey.path}>
                      <Button 
                        className={`w-full group-hover:scale-105 transition-transform ${
                          isCompleted 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : survey.status === 'active'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                        disabled={survey.status === 'inactive'}
                      >
                        {isCompleted ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                          </>
                        ) : survey.status === 'active' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue Survey
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Coming Soon
                          </>
                        )}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewerSurveyNavigation;