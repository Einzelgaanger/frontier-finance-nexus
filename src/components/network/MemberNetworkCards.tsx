// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  Target, 
  TrendingUp,
  Search,
  Filter,
  Network as NetworkIcon,
  MapPin,
  Award,
  Briefcase,
  PieChart,
  BarChart3,
  Eye,
  Star,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Share2,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  Zap,
  Activity,
  Database,
  Shield,
  Mail,
  Phone,
  Link as LinkIcon,
  Heart,
  MessageCircle,
  UserPlus,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Crown,
  Gem,
  Flame,
  Rocket,
  Lightbulb,
  Handshake,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
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
  Map as MapIcon,
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
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  year?: number;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const MemberNetworkCards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedManager, setSelectedManager] = useState<FundManager | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<FundManager[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch all fund managers
  const fetchFundManagers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching member network data...');

      // Fetch from member_surveys table which has RLS policies allowing all users to view all member surveys
      const [memberSurveysResult, profilesResult, userRolesResult] = await Promise.all([
        supabase
          .from('member_surveys')
          .select(`
            id,
            user_id,
            fund_name,
            website,
            fund_type,
            primary_investment_region,
            year_founded,
            team_size,
            typical_check_size,
            aum,
            investment_thesis,
            sector_focus,
            stage_focus,
            completed_at,
            created_at
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, first_name, last_name, email'),
        supabase
          .from('user_roles')
          .select('user_id, role')
      ]);

      // Handle errors gracefully
      if (memberSurveysResult.error) {
        console.error('Error fetching member surveys:', memberSurveysResult.error);
        throw memberSurveysResult.error;
      }

      console.log('Member surveys result:', memberSurveysResult.data);
      console.log('Profiles result:', profilesResult.data);
      console.log('User roles result:', userRolesResult.data);

      // Create maps for efficient lookups
      const profilesMap = new Map();
      const userRolesMap = new Map();
      
      if (profilesResult.data) {
        profilesResult.data.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      if (userRolesResult.data) {
        userRolesResult.data.forEach(userRole => {
          userRolesMap.set(userRole.user_id, userRole.role);
        });
      }

      // Process member surveys data
      let processedManagers = [];
      
      if (memberSurveysResult.data && memberSurveysResult.data.length > 0) {
        console.log(`Processing ${memberSurveysResult.data.length} member surveys`);
        processedManagers = memberSurveysResult.data.map(survey => {
          const profile = profilesMap.get(survey.user_id);
          const userRole = userRolesMap.get(survey.user_id) || 'member';
          
          return {
            id: survey.user_id,
            user_id: survey.user_id,
            fund_name: survey.fund_name || 'Unnamed Fund',
            firm_name: survey.fund_name || 'Unnamed Fund',
            participant_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown Member',
            email_address: profile?.email || 'No email provided',
            has_survey: true, // All entries in member_surveys have completed surveys
            profile: {
              first_name: profile?.first_name || 'Unknown',
              last_name: profile?.last_name || 'Member',
              email: profile?.email || 'No email provided'
            },
            // Use member survey data
            primary_investment_region: survey.primary_investment_region || 'Global',
            fund_type: survey.fund_type || 'Investment Fund',
            year_founded: survey.year_founded || 2020,
            team_size: survey.team_size || 5,
            typical_check_size: survey.typical_check_size || '$100K - $500K',
            aum: survey.aum || '$10M - $50M',
            investment_thesis: survey.investment_thesis || 'Early-stage technology investments',
            sector_focus: survey.sector_focus || ['Technology', 'Healthcare', 'Fintech'],
            stage_focus: survey.stage_focus || ['Seed', 'Series A'],
            role_badge: userRole,
            website: survey.website || '',
            completed_at: survey.completed_at || survey.created_at,
            geographic_focus: [survey.primary_investment_region || 'Global'],
            vehicle_type: survey.fund_type || 'Investment Fund',
            fund_stage: 'Active'
          };
        });
      } else {
        console.log('No member surveys found, falling back to survey data...');
        
        // Fallback: If member_surveys is empty, try to get data from survey tables
        const [survey2021Result, surveyResult] = await Promise.all([
          supabase.from('survey_responses_2021').select('user_id, firm_name, participant_name, geographic_focus, investment_vehicle_type, fund_stage, current_ftes'),
          supabase.from('survey_responses').select('user_id')
        ]);

        if (survey2021Result.data && survey2021Result.data.length > 0) {
          console.log(`Found ${survey2021Result.data.length} survey responses as fallback`);
          processedManagers = survey2021Result.data.map(survey => {
            const profile = profilesMap.get(survey.user_id);
            const userRole = userRolesMap.get(survey.user_id) || 'member';
            
            return {
              id: survey.user_id,
              user_id: survey.user_id,
              fund_name: survey.firm_name || 'Unnamed Fund',
              firm_name: survey.firm_name || 'Unnamed Fund',
              participant_name: survey.participant_name || 'Unknown Member',
              email_address: profile?.email || 'No email provided',
              has_survey: true,
              profile: {
                first_name: survey.participant_name?.split(' ')[0] || 'Unknown',
                last_name: survey.participant_name?.split(' ').slice(1).join(' ') || 'Member',
                email: profile?.email || 'No email provided'
              },
              primary_investment_region: survey.geographic_focus?.[0] || 'Global',
              fund_type: survey.investment_vehicle_type?.[0] || 'Investment Fund',
              year_founded: 2020,
              team_size: survey.current_ftes ? parseInt(survey.current_ftes) : 5,
              typical_check_size: '$100K - $500K',
              aum: '$10M - $50M',
              investment_thesis: 'Early-stage technology investments',
              sector_focus: ['Technology', 'Healthcare', 'Fintech'],
              stage_focus: ['Seed', 'Series A'],
              role_badge: userRole,
              website: '',
              completed_at: new Date().toISOString(),
              geographic_focus: survey.geographic_focus || ['Global'],
              vehicle_type: survey.investment_vehicle_type?.[0] || 'Investment Fund',
              fund_stage: survey.fund_stage || 'Active'
            };
          });
        }
      }

      setFundManagers(processedManagers);
      setLastUpdated(new Date());
      console.log(`Loaded ${processedManagers.length} network members from member_surveys table`);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch network data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter and sort managers
  useEffect(() => {
    let filtered = [...fundManagers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.fund_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.participant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.primary_investment_region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.fund_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply region filter
    if (filterRegion !== 'all') {
      filtered = filtered.filter(manager =>
        manager.primary_investment_region?.toLowerCase().includes(filterRegion.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(manager =>
        manager.fund_type?.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    // Apply stage filter
    if (filterStage !== 'all') {
      filtered = filtered.filter(manager =>
        manager.fund_stage?.toLowerCase().includes(filterStage.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fund_name || '';
          bValue = b.fund_name || '';
          break;
        case 'region':
          aValue = a.primary_investment_region || '';
          bValue = b.primary_investment_region || '';
          break;
        case 'type':
          aValue = a.fund_type || '';
          bValue = b.fund_type || '';
          break;
        case 'team_size':
          aValue = a.team_size || 0;
          bValue = b.team_size || 0;
          break;
        default:
          aValue = a.fund_name || '';
          bValue = b.fund_name || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    setFilteredManagers(filtered);
    setCurrentPage(1);
  }, [fundManagers, searchTerm, filterRegion, filterType, filterStage, sortBy, sortOrder]);

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchFundManagers();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, fetchFundManagers]);

  // Load data on component mount
  useEffect(() => {
    fetchFundManagers();
  }, [fetchFundManagers]);

  // Calculate network statistics
  const networkStats = useMemo(() => {
    const total = fundManagers.length;
    const withSurveys = fundManagers.filter(m => m.has_survey).length;
    const regions = new Set(fundManagers.map(m => m.primary_investment_region).filter(Boolean)).size;
    const activeMembers = fundManagers.filter(m => m.role_badge === 'member').length;
    
    return {
      totalMembers: total,
      completionRate: total > 0 ? Math.round((withSurveys / total) * 100) : 0,
      topRegions: regions,
      activeMembers
    };
  }, [fundManagers]);

  // Pagination
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Quick actions
  const quickActions = [
    { icon: Download, label: 'Export Network', action: () => console.log('Export network') },
    { icon: Share2, label: 'Share Network', action: () => console.log('Share network') },
    { icon: BarChart3, label: 'View Analytics', action: () => console.log('View analytics') },
    { icon: Plus, label: 'Connect', action: () => console.log('Connect') }
  ];

  // Toggle favorite
  const toggleFavorite = (managerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(managerId)) {
        newFavorites.delete(managerId);
      } else {
        newFavorites.add(managerId);
      }
      return newFavorites;
    });
  };

  // Add to recently viewed
  const addToRecentlyViewed = (manager: FundManager) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(m => m.id !== manager.id);
      return [manager, ...filtered].slice(0, 5);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <NetworkIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Network</h2>
          <p className="text-gray-600">Fetching member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <NetworkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Member Network
                    </h1>
                    <p className="text-slate-200 text-lg font-medium">
                      Connect and collaborate with fellow ESCP members
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-medium">{networkStats.totalMembers} Network Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-cyan-300" />
                    <span className="text-sm font-medium">{networkStats.completionRate}% Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-300" />
                    <span className="text-sm font-medium">{networkStats.topRegions} Global Regions</span>
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
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                >
                  {isAutoRefresh ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isAutoRefresh ? 'Pause' : 'Auto-refresh'}
                </Button>
                
                <div className="text-right">
                  <p className="text-sm text-blue-100">Last Updated</p>
                  <p className="font-semibold text-white">{lastUpdated.toLocaleTimeString()}</p>
                </div>
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
                    <p className="text-sm font-semibold text-blue-700">Network Members</p>
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
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-700">Active Members</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{networkStats.completionRate}%</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">+8% growth</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 border-purple-200 hover:border-purple-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-700">Global Reach</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-900">{networkStats.topRegions}</p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Regions</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 border-orange-200 hover:border-orange-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-700">Engaged</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{networkStats.activeMembers}</p>
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Members</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Members</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center space-x-2">
              <Handshake className="w-4 h-4" />
              <span>Connections</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Health */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Network Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Member Engagement</span>
                      <span className="text-sm font-semibold text-gray-900">{networkStats.completionRate}%</span>
                    </div>
                    <Progress value={networkStats.completionRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Active Members</span>
                      <span className="text-sm font-semibold text-gray-900">{networkStats.activeMembers}</span>
                    </div>
                    <Progress value={(networkStats.activeMembers / networkStats.totalMembers) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Global Coverage</span>
                      <span className="text-sm font-semibold text-gray-900">{networkStats.topRegions} regions</span>
                    </div>
                    <Progress value={(networkStats.topRegions / 10) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentlyViewed.slice(0, 3).map((manager, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {manager.profile?.first_name?.[0]}{manager.profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{manager.fund_name}</p>
                        <p className="text-sm text-gray-600">{manager.primary_investment_region}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {manager.role_badge}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search members, funds, or regions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="americas">Americas</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="fund">Fund</SelectItem>
                        <SelectItem value="accelerator">Accelerator</SelectItem>
                        <SelectItem value="incubator">Incubator</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="region">Region</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                        <SelectItem value="team_size">Team Size</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedManagers.map((manager) => (
                <Card 
                  key={manager.id} 
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {manager.profile?.first_name?.[0]}{manager.profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {manager.fund_name}
                          </h3>
                          <p className="text-sm text-gray-600">{manager.participant_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(manager.id)}
                          className="p-1"
                        >
                          <Star className={`w-4 h-4 ${favorites.has(manager.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedManager(manager);
                            addToRecentlyViewed(manager);
                          }}
                          className="p-1"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{manager.primary_investment_region}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{manager.fund_type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{manager.team_size} team members</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {manager.sector_focus?.slice(0, 3).map((sector, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={manager.has_survey ? "default" : "secondary"}
                          className={manager.has_survey ? "bg-green-100 text-green-800" : ""}
                        >
                          {manager.has_survey ? 'Active' : 'Pending'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {manager.role_badge}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedManager(manager);
                          addToRecentlyViewed(manager);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Handshake className="w-5 h-5 mr-2 text-purple-600" />
                  Member Connections
                </CardTitle>
                <CardDescription>
                  Build meaningful connections with fellow ESCP members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Handshake className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect & Collaborate</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Discover opportunities to connect with fellow members, share insights, and collaborate on projects.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('members')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Handshake className="w-4 h-4 mr-2" />
                    Browse Members
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
                  <PieChart className="w-5 h-5 mr-2 text-orange-600" />
                  Network Insights
                </CardTitle>
                <CardDescription>
                  Analytics and insights about the member network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PieChart className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Network Analytics</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Detailed insights about network growth, member engagement, and collaboration opportunities.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('members')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    View Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberNetworkCards;
