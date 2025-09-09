import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Calendar, 
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
  Eye,
  Edit3,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';

const SurveyNavigation: React.FC = () => {
  const location = useLocation();
  const { surveyStatuses, loading, isSurveyCompleted } = useSurveyStatus();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  const surveys = [
    {
      year: '2024',
      title: '2024 ESCP Network Survey',
      description: 'Latest comprehensive survey for Early Stage Capital Providers',
      path: '/survey/2024',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      icon: Rocket,
      status: 'active',
      sections: 8,
      estimatedTime: '15-20 min',
      features: ['Real-time analytics', 'Advanced reporting', 'AI insights']
    },
    {
      year: '2023',
      title: '2023 ESCP Network Survey',
      description: 'Previous year comprehensive data collection and analysis',
      path: '/survey/2023',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-100',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-900',
      icon: TrendingUp,
      status: 'completed',
      sections: 7,
      estimatedTime: '12-15 min',
      features: ['Portfolio insights', 'Market trends', 'Impact metrics']
    },
    {
      year: '2022',
      title: '2022 ESCP Network Survey',
      description: 'Historical survey data from 2022 for trend analysis',
      path: '/survey/2022',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      icon: BarChart3,
      status: 'completed',
      sections: 6,
      estimatedTime: '10-12 min',
      features: ['Historical data', 'Trend analysis', 'Benchmarking']
    },
    {
      year: '2021',
      title: '2021 ESCP Convening Survey',
      description: 'Early Stage Capital Providers 2021 Convening Survey',
      path: '/survey/2021',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      icon: Globe,
      status: 'completed',
      sections: 7,
      estimatedTime: '12-15 min',
      features: ['Foundation data', 'Baseline metrics', 'Network insights']
    }
  ];

  // Calculate overall progress
  const completedSurveys = surveys.filter(survey => isSurveyCompleted(survey.year)).length;
  const totalSurveys = surveys.length;
  const overallProgress = (completedSurveys / totalSurveys) * 100;

  // Quick actions
  const quickActions = [
    { icon: Download, label: 'Export All Data', action: () => console.log('Export all') },
    { icon: Share2, label: 'Share Progress', action: () => console.log('Share progress') },
    { icon: BarChart3, label: 'View Analytics', action: () => console.log('View analytics') },
    { icon: Plus, label: 'New Survey', action: () => console.log('New survey') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Ultra-Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Survey Center
                    </h1>
                    <p className="text-purple-100 text-lg font-medium">
                      Complete surveys and contribute to network insights
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-medium">{completedSurveys}/{totalSurveys} Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-cyan-300" />
                    <span className="text-sm font-medium">{Math.round(overallProgress)}% Overall Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-300" />
                    <span className="text-sm font-medium">Auto-save enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Quick Actions
                </Button>
                
                <div className="text-right">
                  <p className="text-sm text-purple-100">Last Activity</p>
                  <p className="font-semibold text-white">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {completedSurveys} of {totalSurveys} surveys completed
              </Badge>
            </div>
            <div className="space-y-3">
              <Progress value={overallProgress} className="h-3" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Survey completion rate</span>
                <span className="font-semibold">{Math.round(overallProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        {showQuickActions && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/70 hover:bg-white/90 border-gray-200"
                  >
                    <action.icon className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Survey Cards */}
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
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {survey.title}
                          </h3>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {isActive && !isCompleted && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Play className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {survey.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{survey.sections} sections</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{survey.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{survey.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {survey.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress Bar for Active Surveys */}
                  {isActive && !isCompleted && (
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
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Completed on {new Date(surveyStatus.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>View your responses</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Edit3 className="w-4 h-4" />
                          <span>{isActive ? 'Continue where you left off' : 'Start new survey'}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link to={survey.path}>
                      <Button 
                        className={`flex items-center space-x-2 ${
                          isCompleted 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : isActive 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <Eye className="w-4 h-4" />
                            View Responses
                          </>
                        ) : (
                          <>
                            {isActive ? 'Continue' : 'Start Survey'}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Features Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Advanced Survey Features</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our surveys are designed with cutting-edge technology to provide the best user experience and data quality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Auto-Save</h4>
                <p className="text-sm text-gray-600">Your progress is automatically saved every 30 seconds</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Smart Resume</h4>
                <p className="text-sm text-gray-600">Continue exactly where you left off, even across sessions</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Secure & Private</h4>
                <p className="text-sm text-gray-600">Your data is encrypted and protected with enterprise security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyNavigation; 