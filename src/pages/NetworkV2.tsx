// @ts-nocheck
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
  RefreshCw,
  ArrowUpRight,
  FileText
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

const NetworkV2 = React.memo(() => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
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
      if (initialLoad) {
      setLoading(true);
      }
      console.log('Fetching network data...');

      // Fetch user profiles, roles and survey data
      const [userProfilesResult, userRolesResult, survey2021Result, survey2022Result, survey2023Result, survey2024Result] = await Promise.all([
        supabase.from('user_profiles').select('id, user_id, company_name, email, full_name, role_title, profile_picture_url, user_role, is_active, created_at'),
        supabase.from('user_roles' as any).select('user_id, role'),
        supabase.from('survey_responses_2021').select('id, user_id, email_address, firm_name, participant_name, role_title, company_name, completed_at'),
        supabase.from('survey_responses_2022').select('id, user_id, email_address, organisation_name, participant_name, role_title, completed_at'),
        supabase.from('survey_responses_2023').select('id, user_id, email_address, organisation_name, completed_at'),
        supabase.from('survey_responses_2024').select('id, user_id, email_address, organisation_name, completed_at')
      ]);

      // Handle errors gracefully
      if (userProfilesResult.error) {
        console.warn('Could not fetch user profiles:', userProfilesResult.error);
      }
      if (survey2021Result.error) {
        console.warn('Could not fetch 2021 survey data:', survey2021Result.error);
      }
      if (survey2022Result.error) {
        console.warn('Could not fetch 2022 survey data:', survey2022Result.error);
      }
      if (survey2023Result.error) {
        console.warn('Could not fetch 2023 survey data:', survey2023Result.error);
      }
      if (survey2024Result.error) {
        console.warn('Could not fetch 2024 survey data:', survey2024Result.error);
      }

      // Get all users from user_profiles and roles
      const allUserProfiles = userProfilesResult.data || [];
      const allUserRoles = userRolesResult.data || [];
      const survey2021Users = survey2021Result.data || [];
      const survey2022Users = survey2022Result.data || [];
      const survey2023Users = survey2023Result.data || [];
      const survey2024Users = survey2024Result.data || [];

      // Create a map of user roles for quick lookup
      const rolesMap = new Map();
      allUserRoles.forEach(roleRecord => {
        rolesMap.set(roleRecord.user_id, roleRecord.role);
      });

      // Create a map of survey data for enhanced profiles
      const surveyDataMap = new Map();
      [...survey2021Users, ...survey2022Users, ...survey2023Users, ...survey2024Users].forEach(survey => {
        if (!surveyDataMap.has(survey.user_id)) {
          surveyDataMap.set(survey.user_id, []);
        }
        surveyDataMap.get(survey.user_id).push(survey);
      });

      // Process all users to create network profiles from user_profiles
      let processedManagers = allUserProfiles.map(userProfile => {
        const userSurveys = surveyDataMap.get(userProfile.user_id) || [];
        
        // Use profile data for company information
        const companyName = userProfile.company_name || 'CFF Network User';
        const email = userProfile.email || 'No email provided';
        const fullName = userProfile.full_name || 'Network User';
        const roleTitle = userProfile.role_title || 'Network Member';
        const profilePhoto = userProfile.profile_picture_url || '';
        const userRole = rolesMap.get(userProfile.user_id) || 'viewer'; // Get role from user_roles table
        const isActive = userProfile.is_active !== false;
        
        return {
          id: userProfile.user_id || userProfile.id,
          user_id: userProfile.user_id || userProfile.id,
          fund_name: companyName,
          firm_name: companyName,
          participant_name: fullName,
          email_address: email,
          website: '', // Not available in new schema
          description: '', // Not available in new schema
          profile_photo_url: profilePhoto,
          has_survey: userSurveys.length > 0,
          surveys_completed: userSurveys.length,
          survey_data: userSurveys,
          profile: {
            first_name: fullName.split(' ')[0] || 'Unknown',
            last_name: fullName.split(' ').slice(1).join(' ') || 'User',
            email: email
          },
          geographic_focus: ['Global'], // Simplified
          vehicle_type: 'Network Participant', // Simplified
          fund_stage: 'Active', // Simplified
          team_size: 1, // Simplified
          year_founded: 2020, // Simplified
          role_title: roleTitle,
          created_at: userProfile.created_at || new Date().toISOString(),
          role_badge: userRole,
          is_active: isActive
        };
      });

      if (processedManagers.length === 0) {
        // Fallback: create realistic sample data
        console.log('No users found in system, creating realistic sample data');
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

      // Batch state updates to prevent blinking
      setFundManagers(processedManagers);
      setFilteredManagers(processedManagers);
      setLastUpdated(new Date());
      setInitialLoad(false);
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
  }, [toast, initialLoad]);

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
      <div key="network-container" className="p-6 space-y-8 min-h-screen">

        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-0">
          {/* Total Fund Managers */}
          <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 hover:border-blue-300 relative z-10">
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700">Fund Managers</p>
            </div>
                  <p className="text-2xl font-bold text-blue-900">{networkStats.total}</p>
                  <div className="flex items-center space-x-1">
                    <NetworkIcon className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">In network</span>
              </div>
            </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-102 transition-transform">
                  <Users className="w-6 h-6 text-blue-600" />
          </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Coverage */}
          <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 border-green-200 hover:border-green-300 relative z-10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-semibold text-green-700">Regions Covered</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{networkStats.regions}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-green-600">Global presence</p>
                    <div className="flex flex-wrap gap-1">
                      {networkStats.topRegions.slice(0, 2).map((region, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-200 text-green-700">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-102 transition-transform">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fund Types Variety */}
          <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 border-purple-200 hover:border-purple-300 relative z-10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <p className="text-xs font-semibold text-purple-700">Fund Types</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{networkStats.fundTypes}</p>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 font-medium">Diverse strategies</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-102 transition-transform">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Survey Completion Rate */}
          <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 border-orange-200 hover:border-orange-300 relative z-10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-xs font-semibold text-orange-700">Survey Complete</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{networkStats.withSurveys}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600">Completion Rate</span>
                      <span className="font-semibold text-orange-600">{networkStats.completionRate}%</span>
                    </div>
                    <Progress value={networkStats.completionRate} className="h-1.5" />
                </div>
              </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-102 transition-transform">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
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
         {loading && initialLoad ? (
           <div className="space-y-6">
             {/* Loading skeleton for stats cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[...Array(4)].map((_, i) => (
                 <Card key={i} className="animate-pulse border-0 shadow-lg">
                   <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                       <div className="space-y-2 flex-1">
                         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                         <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                         <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                       </div>
                       <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
          </div>
                   </CardContent>
                 </Card>
               ))}
        </div>

             {/* Loading skeleton for member cards */}
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

            {/* Clean Fund Manager Cards - Uniform Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-0">
              {paginatedManagers.map((manager, index) => {
                return (
                  <Card 
                    key={manager.id}
                    className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-gray-50 via-white to-gray-100 hover:scale-[1.02] cursor-pointer overflow-hidden relative z-10"
                    onClick={() => {
                      navigate(`/network/fund-manager/${manager.id}`, {
                        state: { fundManager: manager }
                      });
                    }}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/3 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <CardContent className="p-6 relative z-10">
                      {/* Profile Picture - Larger */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Avatar className="w-28 h-28 border-4 border-white shadow-xl ring-4 ring-blue-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-3xl">
                              {manager.profile?.first_name?.[0] || manager.participant_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {/* Subtle glow effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300"></div>
                        </div>
                      </div>
                      
                      {/* Firm Name - Compact */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-gray-800 transition-colors duration-300">
                          {manager.firm_name || manager.fund_name || 'Unnamed Firm'}
                        </h3>
                      </div>
                      
                      {/* Geographic Focus - Compact */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="p-1.5 rounded-full bg-blue-500/10">
                            <Globe className="w-3 h-3 text-blue-500" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">Geographic Focus</span>
                        </div>
                        <div className="text-center">
                          {manager.geographic_focus && manager.geographic_focus.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-1">
                              {manager.geographic_focus.slice(0, 2).map((region, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="secondary" 
                                  className="text-xs bg-blue-50 text-blue-700 border-0"
                                >
                                  {region}
                                </Badge>
                              ))}
                              {manager.geographic_focus.length > 2 && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-white/60 border-blue-200 text-blue-600"
                                >
                                  +{manager.geographic_focus.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">Not specified</p>
                          )}
                        </div>
                      </div>

                      {/* Survey Year Buttons */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="p-1.5 rounded-full bg-green-500/10">
                            <FileText className="w-3 h-3 text-green-500" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">Survey Responses</span>
                        </div>
                        <div className="flex justify-center gap-1">
                          {['2021', '2022', '2023', '2024'].map((year) => (
                            <Button
                              key={year}
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/survey-response/${manager.user_id}/${year}`);
                              }}
                              className="h-6 px-2 text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 transition-all duration-300"
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Subtle hover indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                );
              })}
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
});

export default NetworkV2;
