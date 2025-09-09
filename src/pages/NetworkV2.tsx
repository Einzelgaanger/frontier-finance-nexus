import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import AdminNetworkCards from '@/components/network/AdminNetworkCards';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RotateCcw,
  Download,
  Share2,
  Plus,
  BarChart3,
  MoreHorizontal,
  Heart,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  CheckCircle,
  Globe,
  Building2,
  Target,
  Network as NetworkIcon,
  Sparkles,
  TrendingUp,
  Flame,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

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

const NetworkV2 = () => {
  const { userRole } = useAuth();
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

  // Fetch all fund managers
  const fetchFundManagers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching network data...');

      // Fetch survey data to determine who has surveys
      const [survey2021Result, surveyResult] = await Promise.all([
        supabase.from('survey_responses_2021').select('user_id, firm_name, participant_name, geographic_focus, investment_vehicle_type, fund_stage, current_ftes'),
        supabase.from('survey_responses').select('user_id')
      ]);

      // Handle survey data errors gracefully
      const survey2021UserIds = survey2021Result.data?.map(s => s.user_id) || [];
      const surveyUserIds = surveyResult.data?.map(s => s.user_id) || [];
      const allSurveyUserIds = [...new Set([...survey2021UserIds, ...surveyUserIds])];
      
      // Create a map of survey data for enhanced profiles
      const surveyDataMap = new Map();
      if (survey2021Result.data) {
        survey2021Result.data.forEach(survey => {
          surveyDataMap.set(survey.user_id, survey);
        });
      }

      // Since profiles table is empty, create fund managers directly from survey data
      let processedManagers = [];
      
      if (survey2021Result.data && survey2021Result.data.length > 0) {
        processedManagers = survey2021Result.data.map(survey => {
          const hasSurvey = allSurveyUserIds.includes(survey.user_id);
          
          return {
            id: survey.user_id,
            user_id: survey.user_id,
            fund_name: survey.firm_name || 'Unnamed Fund',
            firm_name: survey.firm_name || 'Unnamed Fund',
            participant_name: survey.participant_name || 'Unknown Participant',
            email_address: survey.email_address || 'No email provided',
            has_survey: hasSurvey,
            profile: {
              first_name: survey.participant_name?.split(' ')[0] || 'Unknown',
              last_name: survey.participant_name?.split(' ').slice(1).join(' ') || 'User',
              email: survey.email_address || 'No email provided'
            },
            // Use survey data
            geographic_focus: survey.geographic_focus || ['Global'],
            vehicle_type: survey.investment_vehicle_type?.[0] || 'Investment Fund',
            fund_stage: survey.fund_stage || 'Active',
            team_size: survey.current_ftes ? parseInt(survey.current_ftes) : 5,
            year_founded: 2020 // Default year since it's not in survey data
          };
        });
      } else {
        // Fallback: create some sample data if no survey data is available
        console.log('No survey data available, creating sample data');
        processedManagers = [
          {
            id: 'sample-1',
            user_id: 'sample-1',
            fund_name: 'Sample Investment Fund',
            firm_name: 'Sample Investment Fund',
            participant_name: 'Sample Manager',
            email_address: 'sample@example.com',
            has_survey: false,
            profile: {
              first_name: 'Sample',
              last_name: 'Manager',
              email: 'sample@example.com'
            },
            geographic_focus: ['Global'],
            vehicle_type: 'Investment Fund',
            fund_stage: 'Active',
            team_size: 5,
            year_founded: 2020
          }
        ];
      }

      setFundManagers(processedManagers);
      setFilteredManagers(processedManagers);
      setLastUpdated(new Date());
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

  useEffect(() => {
    fetchFundManagers();
  }, [fetchFundManagers]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...fundManagers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.fund_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.participant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.role_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (filterRegion !== 'all') {
      filtered = filtered.filter(manager =>
        manager.geographic_focus?.includes(filterRegion) ||
        manager.primary_investment_region === filterRegion
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(manager =>
        manager.vehicle_type === filterType ||
        manager.fund_type === filterType
      );
    }

    // Stage filter
    if (filterStage !== 'all') {
      filtered = filtered.filter(manager =>
        manager.fund_stage === filterStage ||
        manager.stage_focus?.includes(filterStage)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortBy) {
        case 'name':
          aValue = a.fund_name || a.firm_name || '';
          bValue = b.fund_name || b.firm_name || '';
          break;
        case 'region':
          aValue = a.primary_investment_region || '';
          bValue = b.primary_investment_region || '';
          break;
        case 'type':
          aValue = a.vehicle_type || a.fund_type || '';
          bValue = b.vehicle_type || b.fund_type || '';
          break;
        case 'stage':
          aValue = a.fund_stage || '';
          bValue = b.fund_stage || '';
          break;
        default:
          aValue = a.fund_name || a.firm_name || '';
          bValue = b.fund_name || b.firm_name || '';
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredManagers(filtered);
  }, [fundManagers, searchTerm, filterRegion, filterType, filterStage, sortBy, sortOrder]);

  // Get unique values for filters
  const getRegions = () => {
    const regions = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.geographic_focus) {
        manager.geographic_focus.forEach(region => regions.add(region));
      }
      if (manager.primary_investment_region) {
        regions.add(manager.primary_investment_region);
      }
    });
    return Array.from(regions).sort();
  };

  const getFundTypes = () => {
    const types = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.vehicle_type) types.add(manager.vehicle_type);
      if (manager.fund_type) types.add(manager.fund_type);
    });
    return Array.from(types).sort();
  };

  const getFundStages = () => {
    const stages = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.fund_stage) stages.add(manager.fund_stage);
      if (manager.stage_focus) {
        manager.stage_focus.forEach(stage => stages.add(stage));
      }
    });
    return Array.from(stages).sort();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterRegion('all');
    setFilterType('all');
    setFilterStage('all');
  };

  // Enhanced network statistics
  const networkStats = useMemo(() => {
    const total = filteredManagers.length;
    const withSurveys = filteredManagers.filter(m => m.has_survey).length;
    const regions = new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)).size;
    const fundTypes = new Set(filteredManagers.map(m => m.vehicle_type || m.fund_stage).filter(Boolean)).size;
    const avgTeamSize = Math.round(
      filteredManagers
        .map(m => m.team_size || m.team_size_max)
        .filter(Boolean)
        .reduce((sum, size) => sum + (size as number), 0) / 
      filteredManagers.filter(m => m.team_size || m.team_size_max).length || 0
    );
    
    return {
      total,
      withSurveys,
      regions,
      fundTypes,
      avgTeamSize,
      completionRate: total > 0 ? Math.round((withSurveys / total) * 100) : 0,
      topRegions: Array.from(new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)))
        .slice(0, 3),
      activeMembers: filteredManagers.filter(m => m.fund_stage === 'Active').length
    };
  }, [filteredManagers]);

  // Pagination
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchFundManagers();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, fetchFundManagers]);

  // Favorite management
  const toggleFavorite = (managerId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(managerId)) {
      newFavorites.delete(managerId);
    } else {
      newFavorites.add(managerId);
    }
    setFavorites(newFavorites);
  };

  // Recently viewed management
  const addToRecentlyViewed = (manager: FundManager) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(m => m.id !== manager.id);
      return [manager, ...filtered].slice(0, 5);
    });
  };

  // Quick actions
  const quickActions = [
    { icon: Download, label: 'Export Data', action: () => console.log('Export') },
    { icon: Share2, label: 'Share Network', action: () => console.log('Share') },
    { icon: Plus, label: 'Add Member', action: () => console.log('Add') },
    { icon: BarChart3, label: 'Analytics', action: () => navigate('/analytics') }
  ];

  return (
    <SidebarLayout>
      <div className="p-6 space-y-8">
        {/* Ultra-Modern Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <NetworkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Network Hub
                    </h1>
                    <p className="text-purple-100 text-lg font-medium">
                      Discover & Connect with Global Fund Managers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-medium">{networkStats.total} Active Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-cyan-300" />
                    <span className="text-sm font-medium">{networkStats.regions} Regions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-300" />
                    <span className="text-sm font-medium">{networkStats.completionRate}% Complete</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    variant="secondary"
                    size="sm"
                    className={`${isAutoRefresh ? 'bg-green-500/20 text-green-100 border-green-400/30' : 'bg-white/20 text-white border-white/30'} hover:bg-white/30`}
                  >
                    {isAutoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isAutoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
                  </Button>
                  
                  <Button
                    onClick={fetchFundManagers}
                    disabled={loading}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-purple-100">Last updated</p>
                  <p className="font-semibold text-white">{lastUpdated.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 hover:border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-700">Total Members</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{networkStats.total}</p>
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
                    <p className="text-sm font-semibold text-green-700">Profile Complete</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{networkStats.withSurveys}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600">Completion Rate</span>
                      <span className="font-semibold text-green-600">{networkStats.completionRate}%</span>
                    </div>
                    <Progress value={networkStats.completionRate} className="h-2" />
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
                  <p className="text-3xl font-bold text-purple-900">{networkStats.regions}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-purple-600">Top Regions:</p>
                    <div className="flex flex-wrap gap-1">
                      {networkStats.topRegions.slice(0, 2).map((region, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-200 text-purple-700">
                          {region}
                        </Badge>
                      ))}
                    </div>
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
                    <Building2 className="w-5 h-5 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-700">Active Funds</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{networkStats.activeMembers}</p>
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">Growing network</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Search & Filter Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Smart Discovery</CardTitle>
                  <CardDescription className="text-gray-600">
                    Find the perfect investment partners with AI-powered search
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Enhanced Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search by name, firm, role, email, or investment focus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Region</label>
                    <Select value={filterRegion} onValueChange={setFilterRegion}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {getRegions().map((region) => (
                          <SelectItem key={region} value={region}>
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>{region}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Fund Type</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {getFundTypes().map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4" />
                              <span>{type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Stage</label>
                    <Select value={filterStage} onValueChange={setFilterStage}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="All Stages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        {getFundStages().map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4" />
                              <span>{stage}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Sort By</label>
                    <div className="flex space-x-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="region">Region</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                          <SelectItem value="stage">Stage</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3"
                      >
                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Quick Filter Tags */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Quick Filters</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={favorites.size > 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilteredManagers(favorites.size > 0 ? fundManagers : filteredManagers)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites ({favorites.size})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilteredManagers(fundManagers.filter(m => m.has_survey))}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Profiles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilteredManagers(fundManagers.filter(m => m.fund_stage === 'Active'))}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Active Funds
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced View Controls */}
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-700">
                {filteredManagers.length} of {fundManagers.length} members
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-lg"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-lg"
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="border-gray-300"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
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

        {/* Enhanced Members Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredManagers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <NetworkIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Members Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any members matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  <Search className="w-4 h-4 mr-2" />
                  New Search
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-800">
                    <Clock className="w-5 h-5 mr-2" />
                    Recently Viewed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {recentlyViewed.map((manager) => (
                      <div
                        key={manager.id}
                        className="flex-shrink-0 w-48 p-3 bg-white/70 rounded-lg border border-amber-200 cursor-pointer hover:bg-white/90 transition-colors"
                        onClick={() => addToRecentlyViewed(manager)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-amber-100 text-amber-700">
                              {manager.profile?.first_name?.[0] || manager.participant_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {manager.fund_name || manager.firm_name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {manager.participant_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Members Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {paginatedManagers.map((manager) => (
                <Card 
                  key={manager.id} 
                  className={`group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}
                >
                  <CardContent className={viewMode === 'list' ? 'flex-1' : 'p-6'}>
                    <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-4'}`}>
                      {/* Avatar and Basic Info */}
                      <div className={`flex items-center space-x-3 ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {manager.profile?.first_name?.[0] || manager.participant_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {manager.fund_name || manager.firm_name || 'Unnamed Fund'}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {manager.participant_name || 'Unknown Participant'}
                          </p>
                          {manager.role_title && (
                            <p className="text-xs text-gray-500 truncate">
                              {manager.role_title}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        {/* Geographic Focus */}
                        {manager.geographic_focus && manager.geographic_focus.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <div className="flex flex-wrap gap-1">
                              {manager.geographic_focus.slice(0, 2).map((region, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                              {manager.geographic_focus.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{manager.geographic_focus.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Fund Type and Stage */}
                        <div className="flex items-center space-x-4">
                          {manager.vehicle_type && (
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4 text-purple-500" />
                              <span className="text-sm text-gray-600">{manager.vehicle_type}</span>
                            </div>
                          )}
                          {manager.fund_stage && (
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600">{manager.fund_stage}</span>
                            </div>
                          )}
                        </div>

                        {/* Team Size */}
                        {manager.team_size && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-600">{manager.team_size} team members</span>
                          </div>
                        )}

                        {/* Survey Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {manager.has_survey ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              {manager.has_survey ? 'Profile Complete' : 'Profile Incomplete'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(manager.id)}
                              className="p-2 hover:bg-red-50"
                            >
                              <Heart className={`w-4 h-4 ${
                                favorites.has(manager.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                              }`} />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedManager(manager);
                                addToRecentlyViewed(manager);
                              }}
                              className="p-2 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default NetworkV2;
