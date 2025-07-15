
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Users, DollarSign, Calendar, ExternalLink, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NetworkCard } from '@/components/network/NetworkCard';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
  const [approvedMembers, setApprovedMembers] = useState<any[]>([]); // For viewer
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [viewerLoading, setViewerLoading] = useState(true);
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
      // Always use fallback: fetch all completed surveys and approved membership_requests, filter in JS
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });
      const { data: approved, error: approvedError } = await supabase
        .from('membership_requests')
        .select('user_id')
        .eq('status', 'approved');
      if (!surveys || !approved) {
        console.log('No surveys or approved members found', { surveys, approved });
        setFundManagers([]);
        setLoading(false);
        return;
      }
      const approvedIds = new Set(approved.map(r => r.user_id));
      let managersWithProfiles: FundManager[] = [];
      for (const item of surveys) {
        if (!item || !item.user_id || !approvedIds.has(item.user_id)) continue;
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', item.user_id)
          .single();
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
          role_badge: item.role_badge || 'member',
          profiles: profile || null
        };
        managersWithProfiles.push(manager);
      }
      console.log('Approved managers with completed surveys:', managersWithProfiles);
      setFundManagers(managersWithProfiles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      setFundManagers([]);
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
            <p className="mt-4 text-gray-600">Loading network directory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'viewer') {
    const approvedMembers = membershipRequests.filter((r: any) => r.status === 'approved');
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Approved Members Directory</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Total Approved: {approvedMembers.length}
              </Badge>
            </div>
          </div>

          {viewerError && (
            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {viewerError}
            </div>
          )}

          {viewerLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading approved members...</p>
            </div>
          ) : (
            <>
              {approvedMembers.length === 0 ? (
                <Card className="text-center py-12 bg-white">
                  <CardContent>
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved members found</h3>
                    <p className="text-base text-gray-500 mb-4">No approved members are available yet. Check back later.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedMembers.map((member: any) => (
                    <Card 
                      key={member.id} 
                      className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[280px]"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-lg font-semibold truncate text-gray-900 group-hover:text-blue-600">
                            {member.applicant_name || 'Unknown Member'}
                          </CardTitle>
                          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 text-xs">
                            Approved Member
                          </Badge>
                        </div>
                        <CardDescription className="text-sm text-gray-500">
                          {member.email || 'No email provided'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            <span className="truncate">{member.vehicle_name || 'Unknown Fund'}</span>
                          </div>
                          {member.vehicle_website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-green-500" />
                              <a
                                href={member.vehicle_website.startsWith('http') ? member.vehicle_website : `https://${member.vehicle_website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                                onClick={e => e.stopPropagation()}
                              >
                                {member.vehicle_website}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold-500" />
                            <span className="truncate">{member.team_size || 'N/A'} team members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="truncate">{member.ticket_size || 'N/A'} ticket size</span>
                          </div>
                          {member.investment_thesis && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Investment Thesis</p>
                                  <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed break-words">
                                    {member.investment_thesis}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {member.team_overview && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-start gap-2">
                                <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Team Overview</p>
                                  <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed break-words">
                                    {member.team_overview}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {member.completed_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="truncate text-xs text-gray-500">
                                Approved: {new Date(member.completed_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Network Directory</h1>
          {userRole !== 'viewer' && (
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
              <Input
                type="text"
                placeholder="Search by name, region, or type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {getRegions().map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getFundTypes().map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Debug Info - Only show for admins */}
        {userRole === 'admin' && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>Total fund managers: {fundManagers.length}</p>
                <p>Filtered managers: {filteredManagers.length}</p>
                <p>User role: {userRole}</p>
                <p>Loading state: {loading ? 'true' : 'false'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Funds</CardTitle>
              <Building2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{filteredManagers.length}</div>
              <p className="text-sm text-gray-500">Active fund managers</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Regions</CardTitle>
              <Globe className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{getRegions().length}</div>
              <p className="text-sm text-gray-500">Geographic coverage</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Fund Types</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{getFundTypes().length}</div>
              <p className="text-sm text-gray-500">Investment strategies</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Your Access</CardTitle>
              <Badge 
                variant={userRole === 'admin' ? 'default' : 'secondary'}
                className={userRole === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
              >
                {userRole === 'admin' ? 'Admin' : 'Member'}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {userRole === 'admin' ? 'Full access to all data' : 'Enhanced member access'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fund Managers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Card
              key={manager.id}
              className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[280px]"
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
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {manager.role_badge === 'viewer' ? 'Viewer' : 'Member'}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-500">
                  {manager.profiles?.email || 'Unknown'}
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
                    <Users className="w-4 h-4 text-gold-500" />
                    <span className="truncate">{manager.team_size || 'N/A'} team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="truncate">{manager.typical_check_size || 'N/A'} ticket size</span>
                  </div>
                  {manager.investment_thesis && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
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
                      <Target className="w-4 h-4 text-gold-500" />
                      <span className="truncate">AUM: {manager.aum}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;

