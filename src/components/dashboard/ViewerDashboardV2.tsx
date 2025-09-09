import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  UserPlus, 
  Building2, 
  Users, 
  Globe, 
  FileText, 
  ShieldCheck, 
  ChartBar, 
  Network,
  RefreshCw,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
  Star,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Crown,
  Gem,
  Flame,
  Activity,
  Home,
  BarChart3,
  Bell,
  Settings2,
  User,
  LogIn,
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
import { ESCPApplicationModal } from './ESCPApplicationModal';
import { supabase } from '@/integrations/supabase/client';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  const loadingTips = React.useMemo(() => [
    { icon: TrendingUp, text: "Analyzing market trends..." },
    { icon: DollarSign, text: "Preparing fund manager insights..." },
    { icon: ChartBar, text: "Loading investment data..." },
    { icon: BarChart3, text: "Calculating portfolio metrics..." },
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

const ViewerDashboardV2 = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [networkStats, setNetworkStats] = useState({
    totalMembers: 0,
    activeFunds: 0,
    totalAUM: 0,
    regions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [featuredMembers, setFeaturedMembers] = useState([]);

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

  // Mock data for demonstration
  useEffect(() => {
    if (!isLoading) {
      setNetworkStats({
        totalMembers: 127,
        activeFunds: 89,
        totalAUM: 2500000000,
        regions: 23
      });
      
      setRecentActivity([
        { id: 1, type: 'new_member', message: 'New member joined from Africa', time: '2 hours ago' },
        { id: 2, type: 'survey_completed', message: '2024 survey completed by 15 members', time: '4 hours ago' },
        { id: 3, type: 'fund_launched', message: 'New $50M fund launched in Asia', time: '1 day ago' }
      ]);
      
      setFeaturedMembers([
        { id: 1, name: 'Sarah Chen', fund: 'Emerging Markets Capital', region: 'Asia', aum: '$150M' },
        { id: 2, name: 'Marcus Johnson', fund: 'African Growth Partners', region: 'Africa', aum: '$75M' },
        { id: 3, name: 'Elena Rodriguez', fund: 'Latin America Ventures', region: 'Americas', aum: '$200M' }
      ]);
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
    <div className="p-6 space-y-8">
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
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    ESCP Network
                  </h1>
                  <p className="text-purple-100 text-lg font-medium">
                    Discover the world's leading emerging market fund managers
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">{networkStats.totalMembers} Active Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm font-medium">{networkStats.regions} Global Regions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">${(networkStats.totalAUM / 1000000000).toFixed(1)}B AUM</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setShowApplicationModal(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Network
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 hover:border-blue-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-700">Total Members</p>
                </div>
                <p className="text-3xl font-bold text-blue-900">{networkStats.totalMembers}</p>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 border-green-200 hover:border-green-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">Active Funds</p>
                </div>
                <p className="text-3xl font-bold text-green-900">{networkStats.activeFunds}</p>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">Growing network</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 border-purple-200 hover:border-purple-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-700">Total AUM</p>
                </div>
                <p className="text-3xl font-bold text-purple-900">${(networkStats.totalAUM / 1000000000).toFixed(1)}B</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">+8% growth</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 border-orange-200 hover:border-orange-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-700">Global Reach</p>
                </div>
                <p className="text-3xl font-bold text-orange-900">{networkStats.regions}</p>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">Countries</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center space-x-2">
            <Network className="w-4 h-4" />
            <span>Network</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="join" className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Join</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Members */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Featured Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.fund}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{member.region}</Badge>
                        <span className="text-xs text-gray-500">{member.aum}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Network className="w-5 h-5 mr-2 text-blue-600" />
                Network Directory
              </CardTitle>
              <CardDescription>
                Explore our global network of fund managers and investment professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Network className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Access Full Network</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Join the network to access detailed profiles, contact information, and investment opportunities.
                </p>
                <Button 
                  onClick={() => setShowApplicationModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Market Insights
              </CardTitle>
              <CardDescription>
                Access exclusive data and analytics from our network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exclusive Insights</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get access to comprehensive market data, investment trends, and network analytics.
                </p>
                <Button 
                  onClick={() => setShowApplicationModal(true)}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Access Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Join Tab */}
        <TabsContent value="join" className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 via-beige-100 to-stone-50 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side - Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="max-w-2xl">
                  {/* Hero Section */}
                  <div className="mb-8">
                    <h2 className="text-4xl font-light text-gray-800 mb-4 leading-tight">
                      Join the <span className="font-medium text-indigo-600">ESCP Network</span>
                    </h2>
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
              <div className="flex-1 flex items-center justify-center">
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
                        <div className={`${step.color} rounded-3xl p-8 shadow-xl border border-white/50`}>
                          <div className="text-center">
                            <div className={`w-20 h-20 ${step.color.replace('bg-', 'bg-').replace('-100', '-200')} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                              <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                            </div>
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">
                              {step.title}
                            </h3>
                            <p className="text-base text-gray-600 leading-relaxed text-center">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center space-x-3 mt-8">
                    {animationSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAnimationStep(index)}
                      title={`Go to step ${index + 1}`}
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
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Application Modal */}
      <ESCPApplicationModal 
        open={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
      />
    </div>
  );
};

export default ViewerDashboardV2;
