import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  RotateCw,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle as HelpCircleIcon,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star as StarIcon,
  StarOff,
  BookmarkPlus,
  BookmarkMinus,
  Share,
  Copy,
  Edit,
  Trash2,
  Archive,
  ArchiveRestore,
  Pin,
  PinOff,
  Flag,
  FlagOff,
  Tag,
  Tags,
  Hash,
  AtSign,
  Percent,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  Yen,
  Rupee,
  Bitcoin,
  CreditCard,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart,
  BarChart2,
  BarChart3 as BarChart3Icon,
  LineChart as LineChartIcon,
  AreaChart,
  Scatter,
  Radar,
  Gauge,
  Activity as ActivityIcon,
  Pulse,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Flash,
  Thunder,
  Lightning,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Sunrise,
  Sunset,
  Compass,
  Map,
  MapPin as MapPinIcon,
  Navigation,
  Route,
  Waypoints,
  Flag as FlagIcon,
  FlagOff as FlagOffIcon,
  Pin as PinIcon,
  PinOff as PinOffIcon,
  Target as TargetIcon,
  Crosshair,
  Focus,
  Aim,
  Scope,
  Telescope,
  Microscope,
  Camera,
  Video,
  Image,
  ImageIcon,
  Palette,
  Brush,
  Pen,
  Pencil,
  Highlighter,
  Eraser,
  Paintbrush,
  PaintBucket,
  Scissors,
  Cut,
  Copy as CopyIcon,
  Paste,
  Clipboard,
  ClipboardList,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardPaste,
  ClipboardX,
  File,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileZip,
  FileJson,
  FileXml,
  FileCss,
  FileHtml,
  FileJs,
  FileTs,
  FileJsx,
  FileTsx,
  FileVue,
  FileReact,
  FileAngular,
  FileSvelte,
  FileSolid,
  FileQwik,
  FileAstro,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderLock,
  FolderUnlock,
  FolderUp,
  FolderDown,
  FolderLeft,
  FolderRight,
  FolderSearch,
  FolderHeart,
  FolderStar,
  FolderBookmark,
  FolderPin,
  FolderArchive,
  FolderTrash,
  FolderRestore,
  FolderSync,
  FolderRefresh,
  FolderRotate,
  FolderRotateCw,
  FolderRotateCcw,
  FolderMove,
  FolderCopy,
  FolderPaste,
  FolderCut,
  FolderDuplicate,
  FolderShare,
  FolderDownload,
  FolderUpload,
  FolderCloud,
  FolderCloudUpload,
  FolderCloudDownload,
  FolderCloudSync,
  FolderCloudRefresh,
  FolderCloudRotate,
  FolderCloudRotateCw,
  FolderCloudRotateCcw,
  FolderCloudMove,
  FolderCloudCopy,
  FolderCloudPaste,
  FolderCloudCut,
  FolderCloudDuplicate,
  FolderCloudShare
} from 'lucide-react';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';
import { useAuth } from '@/hooks/useAuth';

const ViewerSurveyNavigation: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();
  const { surveyStatuses, loading, isSurveyCompleted } = useSurveyStatus();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewerStats, setViewerStats] = useState({
    totalSurveys: 0,
    completedSurveys: 0,
    inProgressSurveys: 0,
    availableSurveys: 0
  });
  
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
      status: 'available',
      sections: 8,
      estimatedTime: '15-20 min',
      features: ['Real-time analytics', 'Advanced reporting', 'AI insights'],
      viewerAccess: 'full'
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
      status: 'available',
      sections: 7,
      estimatedTime: '12-15 min',
      features: ['Portfolio insights', 'Market trends', 'Impact metrics'],
      viewerAccess: 'full'
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
      status: 'available',
      sections: 6,
      estimatedTime: '10-12 min',
      features: ['Historical data', 'Trend analysis', 'Benchmarking'],
      viewerAccess: 'full'
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
      status: 'available',
      sections: 7,
      estimatedTime: '12-15 min',
      features: ['Foundation data', 'Baseline metrics', 'Network insights'],
      viewerAccess: 'full'
    }
  ];

  // Calculate viewer-specific stats
  useEffect(() => {
    const totalSurveys = surveys.length;
    const completedSurveys = surveys.filter(survey => isSurveyCompleted(survey.year)).length;
    const inProgressSurveys = surveys.filter(survey => {
      const surveyStatus = surveyStatuses.find(s => s.year === survey.year);
      return surveyStatus && !surveyStatus.completedAt && surveyStatus.startedAt;
    }).length;
    const availableSurveys = totalSurveys - completedSurveys - inProgressSurveys;

    setViewerStats({
      totalSurveys,
      completedSurveys,
      inProgressSurveys,
      availableSurveys
    });
  }, [surveys, surveyStatuses, isSurveyCompleted]);

  // Calculate overall progress
  const overallProgress = viewerStats.totalSurveys > 0 ? (viewerStats.completedSurveys / viewerStats.totalSurveys) * 100 : 0;

  // Quick actions for viewers
  const quickActions = [
    { icon: Download, label: 'Export My Data', action: () => console.log('Export viewer data') },
    { icon: Share2, label: 'Share Progress', action: () => console.log('Share progress') },
    { icon: BarChart3, label: 'View Analytics', action: () => console.log('View analytics') },
    { icon: Plus, label: 'Start New Survey', action: () => console.log('Start new survey') }
  ];

  // Viewer-specific features
  const viewerFeatures = [
    {
      icon: Eye,
      title: 'View-Only Access',
      description: 'Browse and explore survey data without full member privileges',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lock,
      title: 'Limited Participation',
      description: 'Complete surveys to contribute to network insights and data',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your survey completion and contribution progress',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Data Privacy',
      description: 'Your responses are secure and used only for network insights',
      color: 'from-orange-500 to-red-500'
    }
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
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Survey Center
                    </h1>
                    <p className="text-purple-100 text-lg font-medium">
                      Contribute to network insights through surveys
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-medium">{viewerStats.completedSurveys}/{viewerStats.totalSurveys} Completed</span>
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
              <h2 className="text-xl font-bold text-gray-900">Your Survey Progress</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {viewerStats.completedSurveys} of {viewerStats.totalSurveys} surveys completed
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="surveys" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Surveys</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Viewer Features */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Viewer Features
                  </CardTitle>
                  <CardDescription>
                    Your role in the ESCP network and survey participation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {viewerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Survey Stats */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Survey Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{viewerStats.completedSurveys}</div>
                      <div className="text-sm text-blue-800">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{viewerStats.inProgressSurveys}</div>
                      <div className="text-sm text-orange-800">In Progress</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{viewerStats.availableSurveys}</div>
                      <div className="text-sm text-green-800">Available</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{viewerStats.totalSurveys}</div>
                      <div className="text-sm text-purple-800">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Surveys Tab */}
          <TabsContent value="surveys" className="space-y-6">
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
                              {!isActive && !isCompleted && (
                                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Available
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
                              <Edit className="w-4 h-4" />
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
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Your Progress Overview
                </CardTitle>
                <CardDescription>
                  Track your survey completion and contribution to the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Overall Completion</h3>
                      <span className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-4" />
                    <p className="text-sm text-gray-600">
                      {viewerStats.completedSurveys} of {viewerStats.totalSurveys} surveys completed
                    </p>
                  </div>

                  {/* Individual Survey Progress */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Individual Surveys</h3>
                    {surveys.map((survey) => {
                      const isCompleted = isSurveyCompleted(survey.year);
                      const surveyStatus = surveyStatuses.find(s => s.year === survey.year);
                      const progress = isCompleted ? 100 : (surveyStatus?.startedAt ? 25 : 0);
                      
                      return (
                        <div key={survey.year} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{survey.title}</h4>
                            <span className="text-sm font-semibold text-gray-600">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{isCompleted ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}</span>
                            {isCompleted && surveyStatus?.completedAt && (
                              <span>Completed on {new Date(surveyStatus.completedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Survey Insights
                </CardTitle>
                <CardDescription>
                  View analytics and insights from your survey participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Survey Analytics</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Complete surveys to unlock detailed analytics and insights about your responses and network trends.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('surveys')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Surveys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Features Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Viewer Survey Features</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                As a viewer, you can participate in surveys to contribute to network insights while maintaining appropriate access levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">View-Only Access</h4>
                <p className="text-sm text-gray-600">Browse survey data with appropriate viewer permissions</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Contribute Data</h4>
                <p className="text-sm text-gray-600">Complete surveys to add your insights to the network</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Secure & Private</h4>
                <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewerSurveyNavigation;
