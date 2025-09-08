import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { NetworkCard } from '@/components/network/NetworkCard';

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

  // Network statistics
  const networkStats = {
    total: filteredManagers.length,
    withSurveys: filteredManagers.filter(m => m.has_survey).length,
    regions: new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)).size,
    fundTypes: new Set(filteredManagers.map(m => m.vehicle_type || m.fund_stage).filter(Boolean)).size,
    avgTeamSize: Math.round(
      filteredManagers
        .map(m => m.team_size || m.team_size_max)
        .filter(Boolean)
        .reduce((sum, size) => sum + (size as number), 0) / 
      filteredManagers.filter(m => m.team_size || m.team_size_max).length || 0
    )
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Network Directory</h1>
              <p className="text-blue-100 text-lg">
                Connect with fund managers and investment professionals worldwide
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={fetchFundManagers}
                disabled={loading}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm text-blue-100">Last updated</p>
                <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Members</p>
                  <p className="text-2xl font-bold text-blue-800">{networkStats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">With Surveys</p>
                  <p className="text-2xl font-bold text-green-800">{networkStats.withSurveys}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Regions</p>
                  <p className="text-2xl font-bold text-purple-800">{networkStats.regions}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Fund Types</p>
                  <p className="text-2xl font-bold text-orange-800">{networkStats.fundTypes}</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-700">Avg Team Size</p>
                  <p className="text-2xl font-bold text-cyan-800">{networkStats.avgTeamSize}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Search & Filters
                </CardTitle>
                <CardDescription>
                  Find specific fund managers using advanced filters
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, firm, role, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {getRegions().map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by fund type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fund Types</SelectItem>
                      {getFundTypes().map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStage} onValueChange={setFilterStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      {getFundStages().map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex space-x-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
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
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing {filteredManagers.length} of {fundManagers.length} members
            </p>
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
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Members Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredManagers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <NetworkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more members.
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredManagers.map((manager) => (
              <NetworkCard
                key={manager.id}
                manager={manager}
                userRole={userRole}
                showDetails={userRole === 'admin' || userRole === 'member'}
              />
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default NetworkV2;
