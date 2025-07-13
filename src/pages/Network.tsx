
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Users, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NetworkCard } from '@/components/network/NetworkCard';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    fetchFundManagers();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [fundManagers, searchTerm, filterRegion, filterType]);

  const fetchFundManagers = async () => {
    try {
      console.log('Fetching fund managers...');
      
      // For viewers, show approved applications from membership_requests
      if (userRole === 'viewer') {
        const { data: approvedApplications, error: applicationsError } = await supabase
          .from('membership_requests')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (applicationsError) {
          console.error('Error fetching approved applications:', applicationsError);
          throw applicationsError;
        }

        console.log('Approved applications fetched:', approvedApplications);

        // Convert approved applications to fund manager format for viewers
        const managersWithProfiles: FundManager[] = [];
        
        for (const app of approvedApplications) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', app.user_id)
              .single();

            if (profileError) {
              console.warn('Profile not found for user:', app.user_id);
            }

            const manager: FundManager = {
              id: app.id,
              user_id: app.user_id,
              fund_name: app.vehicle_name || 'Unknown Fund',
              website: app.vehicle_website,
              primary_investment_region: app.domicile_country,
              fund_type: 'Approved Member',
              year_founded: null,
              team_size: null,
              typical_check_size: app.ticket_size,
              completed_at: app.created_at,
              aum: app.capital_raised,
              investment_thesis: app.thesis,
              sector_focus: [],
              stage_focus: [],
              profiles: profile || null
            };

            managersWithProfiles.push(manager);
          } catch (error) {
            console.warn('Error processing approved application:', app.id, error);
          }
        }

        setFundManagers(managersWithProfiles);
        setLoading(false);
        return;
      }

      // For members and admins, fetch from both member_surveys and survey_responses
      const { data: surveys, error: surveysError } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
      }

      console.log('Surveys fetched:', surveys);

      // Always try to get from survey_responses table as well
      const { data: responses, error: responsesError } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (responsesError) {
        console.error('Error fetching survey responses:', responsesError);
      }

      console.log('Survey responses fetched:', responses);

      // Use member_surveys if available, otherwise use survey_responses
      let dataToProcess = surveys && surveys.length > 0 ? surveys : responses;
      
      if (!dataToProcess || dataToProcess.length === 0) {
        console.log('No completed surveys found');
        setFundManagers([]);
        setLoading(false);
        return;
      }

      // Log the first item to see its structure
      if (dataToProcess.length > 0) {
        console.log('First data item structure:', dataToProcess[0]);
        console.log('Available fields:', Object.keys(dataToProcess[0]));
      }

      // Convert to fund managers format
      const managersWithProfiles: FundManager[] = [];
      
      for (const item of dataToProcess) {
        try {
          // Validate required fields
          if (!item || !item.user_id) {
            console.warn('Skipping item with missing user_id:', item);
            continue;
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', item.user_id)
            .single();

          if (profileError) {
            console.warn('Profile not found for user:', item.user_id);
          }

          // Parse JSON fields with better error handling
          let sectorFocus: string[] = [];
          let stageFocus: string[] = [];

          try {
            // Handle different data structures
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
          } catch (e) {
            console.warn('Error parsing JSON fields for item:', item.id, e);
          }

          // Determine fund name with fallback
          let fundName = 'Unknown Fund';
          if (item.fund_name) {
            fundName = item.fund_name;
          } else if (item.vehicle_name) {
            fundName = item.vehicle_name;
          } else if (item.name) {
            fundName = item.name;
          }

          // Determine website
          let website = null;
          if (item.website) {
            website = item.website;
          } else if (item.vehicle_website) {
            website = item.vehicle_website;
          }

          // Determine investment region
          let investmentRegion = null;
          if (item.primary_investment_region) {
            investmentRegion = item.primary_investment_region;
          } else if (item.domicile_country) {
            investmentRegion = item.domicile_country;
          } else if (item.location) {
            investmentRegion = item.location;
          }

          // Determine fund type
          let fundType = null;
          if (item.fund_type) {
            fundType = item.fund_type;
          } else if (item.vehicle_type) {
            fundType = item.vehicle_type;
          }

          // Determine team size
          let teamSize = null;
          if (item.team_size) {
            teamSize = typeof item.team_size === 'number' ? item.team_size : parseInt(item.team_size);
          }

          // Determine typical check size
          let typicalCheckSize = null;
          if (item.typical_check_size) {
            typicalCheckSize = item.typical_check_size;
          } else if (item.ticket_size) {
            typicalCheckSize = item.ticket_size;
          }

          // Determine AUM
          let aum = null;
          if (item.aum) {
            aum = item.aum;
          } else if (item.capital_raised) {
            aum = item.capital_raised;
          }

          // Determine investment thesis
          let investmentThesis = null;
          if (item.investment_thesis) {
            investmentThesis = item.investment_thesis;
          } else if (item.thesis) {
            investmentThesis = item.thesis;
          }

          const manager: FundManager = {
            id: item.id,
            user_id: item.user_id,
            fund_name: fundName,
            website: website,
            primary_investment_region: investmentRegion,
            fund_type: fundType,
            year_founded: item.year_founded,
            team_size: teamSize,
            typical_check_size: typicalCheckSize,
            completed_at: item.completed_at,
            aum: aum,
            investment_thesis: investmentThesis,
            sector_focus: sectorFocus,
            stage_focus: stageFocus,
            profiles: profile || null
          };

          managersWithProfiles.push(manager);
        } catch (error) {
          console.warn('Error processing item:', item?.id, error);
        }
      }

      console.log('Final managers with profiles:', managersWithProfiles);
      setFundManagers(managersWithProfiles);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Directory</h1>
          <p className="text-gray-600">Connect with fund managers in the ESCP Network</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search fund managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-48">
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
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {getFundTypes().map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{filteredManagers.length}</div>
              <p className="text-sm text-gray-500">Active fund managers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Regions</CardTitle>
              <Globe className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{getRegions().length}</div>
              <p className="text-sm text-gray-500">Geographic coverage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Fund Types</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{getFundTypes().length}</div>
              <p className="text-sm text-gray-500">Investment strategies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Access</CardTitle>
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
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
        {filteredManagers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManagers.map((manager) => (
              <NetworkCard 
                key={manager.id} 
                fund={manager} 
                userRole={userRole}
                showDetails={userRole !== 'viewer'}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
              <p className="text-gray-500 mb-4">
                {fundManagers.length === 0 
                  ? "No fund managers have completed their surveys yet. Check back later or contact an admin to populate network data."
                  : "Try adjusting your search criteria or filters."
                }
              </p>
              {userRole === 'admin' && fundManagers.length === 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    As an admin, you can populate network data from existing survey responses.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/admin'}
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Go to Admin Panel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Network;
