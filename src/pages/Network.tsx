
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
      
      // First, try to get completed surveys from member_surveys table
      const { data: surveys, error: surveysError } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
        throw surveysError;
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

      // Convert to fund managers format
      const managersWithProfiles: FundManager[] = [];
      
      for (const item of dataToProcess) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', item.user_id)
          .single();

        if (profileError) {
          console.warn('Profile not found for user:', item.user_id);
        }

        // Parse JSON fields
        let sectorFocus: string[] = [];
        let stageFocus: string[] = [];
        let marketsOperated: any = {};

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
          
          if (item.markets_operated) {
            marketsOperated = typeof item.markets_operated === 'string'
              ? JSON.parse(item.markets_operated)
              : item.markets_operated || {};
          }
        } catch (e) {
          console.warn('Error parsing JSON fields:', e);
        }

        // Determine fund name
        const fundName = item.fund_name || item.vehicle_name || 'Unknown Fund';
        
        // Determine website
        let website = item.website;
        if (!website && item.vehicle_websites) {
          if (Array.isArray(item.vehicle_websites)) {
            website = item.vehicle_websites[0];
          } else if (typeof item.vehicle_websites === 'string') {
            try {
              const parsed = JSON.parse(item.vehicle_websites);
              website = Array.isArray(parsed) ? parsed[0] : null;
            } catch (e) {
              website = item.vehicle_websites;
            }
          }
        }

        // Determine investment region
        let investmentRegion = item.primary_investment_region;
        if (!investmentRegion && marketsOperated) {
          investmentRegion = Object.keys(marketsOperated).join(', ');
        }

        // Determine ticket size
        let ticketSize = item.typical_check_size;
        if (!ticketSize && item.ticket_size_min && item.ticket_size_max) {
          ticketSize = `$${item.ticket_size_min.toLocaleString()} - $${item.ticket_size_max.toLocaleString()}`;
        } else if (!ticketSize && item.ticket_size) {
          ticketSize = item.ticket_size;
        }

        // Determine AUM
        let aum = item.aum;
        if (!aum && item.capital_raised) {
          aum = `$${item.capital_raised.toLocaleString()}`;
        }

        managersWithProfiles.push({
          id: item.id,
          user_id: item.user_id,
          fund_name: fundName,
          website: website,
          primary_investment_region: investmentRegion,
          fund_type: item.fund_type || item.vehicle_type || 'Unknown',
          year_founded: item.year_founded || item.legal_entity_date_from || null,
          team_size: item.team_size || item.team_size_max || null,
          typical_check_size: ticketSize,
          completed_at: item.completed_at,
          aum: aum,
          investment_thesis: item.investment_thesis || item.thesis || null,
          sector_focus: sectorFocus,
          stage_focus: stageFocus,
          profiles: profile || undefined
        });
      }

      console.log('Fund managers with profiles:', managersWithProfiles);
      setFundManagers(managersWithProfiles);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      setFundManagers([]);
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

        {filteredManagers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Network;
