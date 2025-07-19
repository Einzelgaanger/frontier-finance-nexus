
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NetworkCard } from '@/components/network/NetworkCard';
import { Link, useNavigate } from 'react-router-dom';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
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
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Network = () => {
  const { userRole } = useAuth();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [approvedMembers, setApprovedMembers] = useState<any[]>([]);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [viewerLoading, setViewerLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchFundManagers();
    if (userRole === 'viewer') {
      fetchApprovedMembers();
      fetchMembershipRequests();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'viewer') {
      setFilteredManagers(fundManagers);
    } else {
      filterManagers();
    }
  }, [fundManagers, searchTerm, filterRegion, filterType]);

  const fetchFundManagers = async () => {
    try {
      setLoading(true);
      
      // Fetch from both survey_responses and member_surveys tables
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });
        
      const { data: memberSurveys, error: memberSurveysError } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (surveysError) throw surveysError;
      if (memberSurveysError) throw memberSurveysError;

      // Get approved membership requests for reference
      const { data: approved, error: approvedError } = await supabase
        .from('membership_requests')
        .select('user_id')
        .eq('status', 'approved');
        
      if (approvedError) throw approvedError;

      const approvedIds = new Set(approved?.map(r => r.user_id) || []);
      
      let managersWithProfiles: FundManager[] = [];
      
      // Process survey_responses (members and viewers)
      for (const item of surveys || []) {
        if (!item || !item.user_id) continue;
        
        let profile = null;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', item.user_id)
            .maybeSingle();
          
          if (!profileError && profileData && profileData.email) {
            profile = profileData;
          } else {
            console.log('Profile not found or no email for user:', item.user_id, 'Profile error:', profileError);
          }
        } catch (profileErr) {
          console.error('Error fetching profile for user:', item.user_id, profileErr);
        }
        
        let sectorFocus: string[] = [];
        let stageFocus: string[] = [];
        try {
          if (item.sectors_allocation) {
            sectorFocus = typeof item.sectors_allocation === 'string' 
              ? Object.keys(JSON.parse(item.sectors_allocation))
              : Object.keys(item.sectors_allocation || {});
          } else if (item.sector_focus) {
            sectorFocus = typeof item.sector_focus === 'string'
              ? JSON.parse(item.sector_focus)
              : item.sector_focus || [];
          }
          if (item.fund_stage) {
            stageFocus = typeof item.fund_stage === 'string'
              ? JSON.parse(item.fund_stage)
              : item.fund_stage || [];
          } else if (item.stage_focus) {
            stageFocus = typeof item.stage_focus === 'string'
              ? JSON.parse(item.stage_focus)
              : item.stage_focus || [];
          }
        } catch {}
        
        const manager: FundManager = {
          id: item.id,
          user_id: item.user_id,
          fund_name: item.vehicle_name || 'Unknown Fund',
          website: item.vehicle_websites?.[0] || null,
          primary_investment_region: item.legal_domicile?.join(', ') || 'Unknown',
          fund_type: item.vehicle_type || 'Unknown',
          year_founded: item.legal_entity_date_from || null,
          team_size: item.team_size_max || null,
          typical_check_size: item.ticket_size_min && item.ticket_size_max 
            ? `$${item.ticket_size_min.toLocaleString()} - $${item.ticket_size_max.toLocaleString()}`
            : null,
          completed_at: item.completed_at,
          aum: item.capital_raised ? `$${item.capital_raised.toLocaleString()}` : null,
          investment_thesis: item.thesis || null,
          sector_focus: sectorFocus,
          stage_focus: stageFocus,
          role_badge: item.role_badge || (approvedIds.has(item.user_id) ? 'member' : 'viewer'),
          profiles: profile || null
        };
        managersWithProfiles.push(manager);
      }
      
      // Process member_surveys (viewers and members)
      for (const item of memberSurveys || []) {
        if (!item || !item.user_id) continue;
        
        let profile = null;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', item.user_id)
            .maybeSingle();
          
          if (!profileError && profileData && profileData.email) {
            profile = profileData;
          } else {
            console.log('Profile not found or no email for user:', item.user_id, 'Profile error:', profileError);
          }
        } catch (profileErr) {
          console.error('Error fetching profile for user:', item.user_id, profileErr);
        }
        
        const manager: FundManager = {
          id: item.id,
          user_id: item.user_id,
          fund_name: item.fund_name || 'Unknown Fund',
          website: item.website || null,
          primary_investment_region: item.primary_investment_region || 'Unknown',
          fund_type: item.fund_type || 'Unknown',
          year_founded: item.year_founded || null,
          team_size: item.team_size || null,
          typical_check_size: item.typical_check_size || null,
          completed_at: item.completed_at,
          aum: item.aum || null,
          investment_thesis: item.investment_thesis || null,
          sector_focus: item.sector_focus || [],
          stage_focus: item.stage_focus || [],
          role_badge: item.role_badge || (approvedIds.has(item.user_id) ? 'member' : 'viewer'),
          profiles: profile || null
        };
        managersWithProfiles.push(manager);
      }
      
      // Remove duplicates based on user_id, keeping the most recent one
      const uniqueManagers = managersWithProfiles
        .sort((a, b) => new Date(b.completed_at || '').getTime() - new Date(a.completed_at || '').getTime())
        .filter((manager, index, self) => 
          index === self.findIndex(m => m.user_id === manager.user_id)
        );
      
      setFundManagers(uniqueManagers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      setFundManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedMembers = async () => {
    setLoading(true);
    setViewerError(null);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApprovedMembers(data || []);
    } catch (err) {
      setViewerError('Failed to load approved members. Please try again.');
      setApprovedMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipRequests = async () => {
    setViewerLoading(true);
    setViewerError(null);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (err) {
      setViewerError('Failed to load members. Please try again.');
      setMembershipRequests([]);
    } finally {
      setViewerLoading(false);
    }
  };

  const filterManagers = () => {
    let filtered = fundManagers;

    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.profiles?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.profiles?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.primary_investment_region || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRegion !== 'all') {
      filtered = filtered.filter(manager =>
        (manager.primary_investment_region || '').toLowerCase().includes(filterRegion.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(manager =>
        (manager.fund_type || '').toLowerCase().includes(filterType.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  };

  const getRegions = () => {
    const regions = [...new Set(fundManagers.map(m => m.primary_investment_region).filter(Boolean))];
    return regions.sort();
  };

  const getFundTypes = () => {
    const types = [...new Set(fundManagers.map(m => m.fund_type).filter(Boolean))];
    return types.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading professional network...</p>
          </div>
        </div>
      </div>
    );
  }

  // Viewer-specific network page
  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Professional Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                  <NetworkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-800">ESCP Network Directory</h1>
                  <p className="text-slate-600 text-sm">Discover approved fund managers and investment opportunities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-300 text-slate-600 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  onClick={fetchApprovedMembers}
                  disabled={viewerLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${viewerLoading ? 'animate-spin' : ''}`} />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Button>
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 bg-emerald-100/80 text-emerald-700 border-emerald-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visitor Access
                </Badge>
              </div>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Approved Members</p>
                    <p className="text-2xl font-bold text-emerald-800">{approvedMembers.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-200/60 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm border border-teal-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-700">Geographic Reach</p>
                    <p className="text-2xl font-bold text-teal-800">30+</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-200/60 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50/80 to-cyan-100/80 backdrop-blur-sm border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-700">Investment Focus</p>
                    <p className="text-2xl font-bold text-cyan-800">Frontier</p>
                  </div>
                  <div className="w-10 h-10 bg-cyan-200/60 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/80 backdrop-blur-sm border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-700">Network Growth</p>
                    <p className="text-2xl font-bold text-sky-800">+12%</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-200/60 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {viewerError && (
            <Card className="mb-6 border-rose-200 bg-gradient-to-r from-rose-50/80 to-rose-100/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4">
                <p className="text-rose-700 text-sm">{viewerError}</p>
              </CardContent>
            </Card>
          )}

          {viewerLoading ? (
            <Card className="text-center py-12 bg-gradient-to-r from-slate-50/80 to-emerald-50/80 backdrop-blur-sm shadow-sm border border-slate-200">
              <CardContent>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading approved members...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {approvedMembers.length === 0 ? (
                <Card className="text-center py-12 bg-gradient-to-r from-slate-50/80 to-emerald-50/80 backdrop-blur-sm shadow-sm border border-slate-200">
                  <CardContent>
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No approved members found</h3>
                    <p className="text-base text-slate-600 mb-4">No approved members are available yet. Check back later.</p>
                    <Button 
                      variant="outline" 
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-white/70 backdrop-blur-sm"
                      onClick={fetchApprovedMembers}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedMembers.map((member: any, index: number) => {
                    // Create different bright colors for each card
                    const cardColors = [
                      'from-blue-50/80 to-blue-100/80 border-blue-200',
                      'from-green-50/80 to-green-100/80 border-green-200',
                      'from-yellow-50/80 to-yellow-100/80 border-yellow-200',
                      'from-orange-50/80 to-orange-100/80 border-orange-200',
                      'from-purple-50/80 to-purple-100/80 border-purple-200',
                      'from-pink-50/80 to-pink-100/80 border-pink-200',
                      'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
                      'from-teal-50/80 to-teal-100/80 border-teal-200',
                      'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
                      'from-rose-50/80 to-rose-100/80 border-rose-200',
                      'from-violet-50/80 to-violet-100/80 border-violet-200',
                      'from-amber-50/80 to-amber-100/80 border-amber-200'
                    ];
                    const colorClass = cardColors[index % cardColors.length];
                    
                    return (
                      <Card 
                        key={member.id} 
                        className={`group bg-gradient-to-br ${colorClass} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[320px]`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-lg font-semibold truncate text-slate-800 group-hover:text-blue-600 transition-colors">
                              {member.applicant_name || 'Unknown Member'}
                            </CardTitle>
                            <Badge variant="default" className="bg-emerald-100/80 text-emerald-700 border-emerald-200 text-xs shadow-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved Member
                            </Badge>
                          </div>
                          <CardDescription className="text-sm text-slate-600">
                            {member.email || 'No email provided'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-slate-600" />
                              </div>
                              <span className="truncate font-medium">{member.vehicle_name || 'Unknown Fund'}</span>
                            </div>
                            {member.vehicle_website && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Globe className="w-4 h-4 text-slate-600" />
                                </div>
                                <a
                                  href={member.vehicle_website.startsWith('http') ? member.vehicle_website : `https://${member.vehicle_website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline truncate font-medium"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {member.vehicle_website}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-slate-600" />
                              </div>
                              <span className="truncate">{member.team_size || 'N/A'} team members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-slate-600" />
                              </div>
                              <span className="truncate">{member.ticket_size || 'N/A'} ticket size</span>
                            </div>
                            {member.investment_thesis && (
                              <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="w-4 h-4 text-slate-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-700 mb-1">Investment Thesis</p>
                                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed break-words">
                                      {member.investment_thesis}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {member.team_overview && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-slate-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-700 mb-1">Team Overview</p>
                                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed break-words">
                                      {member.team_overview}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {member.completed_at && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-slate-600" />
                                </div>
                                <span className="truncate text-xs text-slate-500">
                                  Approved: {new Date(member.completed_at).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <NetworkIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">Network</h1>
                <p className="text-slate-600 text-sm">Connect with fund managers and explore investment opportunities</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 text-slate-600 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                onClick={fetchFundManagers}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search fund managers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm border-slate-200"
                  />
                </div>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200">
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
                  <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Total Fund Managers</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {filteredManagers.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-200/60 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm border border-teal-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-700">Active Members</p>
                  <p className="text-2xl font-bold text-teal-800">
                    {filteredManagers.filter(m => m.role_badge === 'member').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-teal-200/60 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50/80 to-cyan-100/80 backdrop-blur-sm border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-700">Regions Covered</p>
                  <p className="text-2xl font-bold text-cyan-800">
                    {new Set(filteredManagers.map(m => m.primary_investment_region)).size}
                  </p>
                </div>
                <div className="w-10 h-10 bg-cyan-200/60 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/80 backdrop-blur-sm border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-700">Fund Types</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {new Set(filteredManagers.map(m => m.fund_type)).size}
                  </p>
                </div>
                <div className="w-10 h-10 bg-sky-200/60 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Professional Fund Managers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager, index) => {
            // Create different bright colors for each card
            const cardColors = [
              'from-blue-50/80 to-blue-100/80 border-blue-200',
              'from-green-50/80 to-green-100/80 border-green-200',
              'from-yellow-50/80 to-yellow-100/80 border-yellow-200',
              'from-orange-50/80 to-orange-100/80 border-orange-200',
              'from-purple-50/80 to-purple-100/80 border-purple-200',
              'from-pink-50/80 to-pink-100/80 border-pink-200',
              'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
              'from-teal-50/80 to-teal-100/80 border-teal-200',
              'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
              'from-rose-50/80 to-rose-100/80 border-rose-200',
              'from-violet-50/80 to-violet-100/80 border-violet-200',
              'from-amber-50/80 to-amber-100/80 border-amber-200'
            ];
            const colorClass = cardColors[index % cardColors.length];
            
            return (
              <Card
                key={manager.id}
                className={`group bg-gradient-to-br ${colorClass} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[280px]`}
                onClick={() => navigate(`/network/fund-manager/${manager.user_id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold truncate text-gray-900 group-hover:text-blue-600">
                      {manager.fund_name || 'Unknown Fund'}
                    </CardTitle>
                    <Badge 
                      variant="default" 
                      className={`text-xs ${
                        manager.role_badge === 'viewer' 
                          ? 'bg-blue-100/80 text-blue-700 border-blue-200' 
                          : 'bg-green-100/80 text-green-700 border-green-200'
                      }`}
                    >
                      {manager.role_badge === 'viewer' ? 'Viewer' : 'Member'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    {manager.profiles?.email || 'Email not available'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="truncate">{manager.primary_investment_region || 'Unknown Region'}</span>
                    </div>
                    {manager.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-500" />
                        <a
                          href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                          onClick={e => e.stopPropagation()}
                        >
                          {manager.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="truncate">{manager.team_size || 'N/A'} team members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="truncate">{manager.typical_check_size || 'N/A'} ticket size</span>
                    </div>
                    {manager.investment_thesis && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 mb-1">Investment Thesis</p>
                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed break-words">
                              {manager.investment_thesis}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {userRole === 'admin' && manager.aum && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className="truncate">AUM: {manager.aum}</span>
                      </div>
                    )}
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

export default Network;

