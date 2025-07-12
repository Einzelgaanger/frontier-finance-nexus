
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NetworkCard } from '@/components/network/NetworkCard';

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

      if (!surveys || surveys.length === 0) {
        console.log('No completed surveys found');
        setFundManagers([]);
        setLoading(false);
        return;
      }

      // Get profiles for each user
      const managersWithProfiles: FundManager[] = [];
      
      for (const survey of surveys) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', survey.user_id)
          .single();

        if (profileError) {
          console.warn('Profile not found for user:', survey.user_id);
        }

        managersWithProfiles.push({
          id: survey.id,
          user_id: survey.user_id,
          fund_name: survey.fund_name || 'Unknown Fund',
          website: survey.website,
          primary_investment_region: survey.primary_investment_region,
          fund_type: survey.fund_type,
          year_founded: survey.year_founded,
          team_size: survey.team_size,
          typical_check_size: survey.typical_check_size,
          completed_at: survey.completed_at,
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

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Directory</h1>
            <p className="text-gray-600">Discover fund managers in the ESCP Network</p>
          </div>

          {/* Show limited network view for viewers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundManagers.slice(0, 6).map((manager) => (
              <NetworkCard 
                key={manager.id} 
                fund={manager} 
                userRole={userRole}
                showDetails={false}
              />
            ))}
          </div>

          {fundManagers.length > 6 && (
            <Card className="mt-8 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800">Unlock Full Network Access</CardTitle>
                <CardDescription className="text-amber-700">
                  Become a member to view detailed profiles and connect with all {fundManagers.length} fund managers in our network.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    );
  }

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
              placeholder="Search by fund name, manager, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="east africa">East Africa</SelectItem>
              <SelectItem value="west africa">West Africa</SelectItem>
              <SelectItem value="southern africa">Southern Africa</SelectItem>
              <SelectItem value="north africa">North Africa</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="venture capital">Venture Capital</SelectItem>
              <SelectItem value="private equity">Private Equity</SelectItem>
              <SelectItem value="impact fund">Impact Fund</SelectItem>
              <SelectItem value="angel network">Angel Network</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredManagers.length} of {fundManagers.length} fund managers
          </p>
        </div>

        {/* Fund Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <NetworkCard 
              key={manager.id} 
              fund={manager} 
              userRole={userRole}
              showDetails={true}
            />
          ))}
        </div>

        {filteredManagers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRegion !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No fund managers have completed their profiles yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
