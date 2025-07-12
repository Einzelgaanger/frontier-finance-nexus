
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Building2, Globe, Users, Calendar, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    if (userRole === 'viewer' || userRole === 'member' || userRole === 'admin') {
      fetchFundManagers();
    }
  }, [userRole]);

  useEffect(() => {
    filterManagers();
  }, [fundManagers, searchTerm, filterType, filterLocation]);

  const fetchFundManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('member_surveys')
        .select(`
          id,
          user_id,
          fund_name,
          website,
          profiles!inner(first_name, last_name, email)
        `)
        .not('completed_at', 'is', null);

      if (error) throw error;

      // Handle the case where profiles might be an error object
      const cleanedData = (data || []).map(item => ({
        ...item,
        profiles: item.profiles && typeof item.profiles === 'object' && !item.profiles.error 
          ? item.profiles 
          : { first_name: 'Unknown', last_name: 'User', email: 'No email' }
      }));

      setFundManagers(cleanedData);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      toast({
        title: "Error",
        description: "Failed to load fund managers",
        variant: "destructive"
      });
      setFundManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterManagers = () => {
    let filtered = fundManagers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(manager => 
        manager.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${manager.profiles.first_name} ${manager.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  };

  if (userRole !== 'viewer' && userRole !== 'member' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Access Restricted</CardTitle>
              <CardDescription className="text-red-700">
                You need at least Viewer access to view the network.
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
            <p className="mt-4 text-gray-600">Loading network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Fund Manager Network</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Connect with {filteredManagers.length} fund managers in our network
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by fund name or manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vc">VC</SelectItem>
                    <SelectItem value="pe">PE</SelectItem>
                    <SelectItem value="angel">Angel</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund Managers Grid */}
        {filteredManagers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fund Managers Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No fund managers have completed their surveys yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredManagers.map((manager) => (
              <Card key={manager.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {manager.profiles.first_name?.[0]?.toUpperCase() || 'U'}
                        {manager.profiles.last_name?.[0]?.toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{manager.fund_name}</CardTitle>
                      <CardDescription className="text-sm">
                        {manager.profiles.first_name} {manager.profiles.last_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Fund Manager</span>
                    </div>
                    
                    {manager.website && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a 
                          href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 truncate"
                        >
                          <span className="truncate">{manager.website}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <Link to={`/network/fund-manager/${manager.user_id}`}>
                        <Button size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
