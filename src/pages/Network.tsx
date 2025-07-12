
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, Globe, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  website: string;
  profiles: {
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
  const [filterSector, setFilterSector] = useState('all');

  useEffect(() => {
    if (userRole === 'member' || userRole === 'admin') {
      fetchFundManagers();
    }
  }, [userRole]);

  useEffect(() => {
    filterManagers();
  }, [fundManagers, searchTerm, filterRegion, filterSector]);

  const fetchFundManagers = async () => {
    try {
      console.log('Fetching fund managers...');
      
      // First get member surveys with proper join
      const { data: surveys, error: surveysError } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null);

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
        throw surveysError;
      }

      // Then get profiles for each user
      const managersWithProfiles = [];
      
      for (const survey of surveys || []) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', survey.user_id)
          .single();

        if (!profileError && profile) {
          managersWithProfiles.push({
            id: survey.id,
            user_id: survey.user_id,
            fund_name: survey.fund_name || 'Unknown Fund',
            website: survey.website || '',
            profiles: profile
          });
        }
      }

      console.log('Fund managers fetched:', managersWithProfiles);
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
        (manager.profiles?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  };

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Member Access Required</CardTitle>
              <CardDescription className="text-amber-700">
                You need to be an approved member to access the network directory.
              </CardDescription>
            </CardHeader>
          </Card>
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
              placeholder="Search by fund name or manager..."
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
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="south-america">South America</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSector} onValueChange={setFilterSector}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
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
            <Card key={manager.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{manager.fund_name}</CardTitle>
                    <CardDescription>
                      {manager.profiles?.first_name} {manager.profiles?.last_name}
                    </CardDescription>
                  </div>
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{manager.profiles?.email}</span>
                  </div>
                  
                  {manager.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <a 
                        href={manager.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {manager.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Link to={`/fund-manager/${manager.user_id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredManagers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRegion !== 'all' || filterSector !== 'all'
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
