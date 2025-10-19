// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Users, 
  TrendingUp,
  Eye,
  RefreshCw,
  AlertCircle,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FundManager {
  id: string;
  firm_name: string;
  participant_name: string;
  geographic_focus: string[];
  team_based: string[];
  profile_picture_url?: string;
  created_at: string;
}

const ViewerNetworkPage = () => {
  const { toast } = useToast();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // No sample data - fetch only approved members from database

  useEffect(() => {
    fetchFundManagers();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [fundManagers, searchTerm, selectedRegion]);

  const fetchFundManagers = async () => {
    setLoading(true);
    try {
      // Fetch only approved members (users with 'member' role)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'member');

      if (rolesError) throw rolesError;

      if (!userRoles || userRoles.length === 0) {
        setFundManagers([]);
        setLastUpdated(new Date());
        return;
      }

      // Get user IDs of approved members
      const memberUserIds = userRoles.map(ur => ur.user_id);

      // Fetch profiles of approved members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, profile_picture_url, created_at')
        .in('id', memberUserIds);

      if (profilesError) throw profilesError;

      // Fetch membership request details for additional info
      const { data: membershipRequests, error: requestsError } = await supabase
        .from('membership_requests')
        .select('user_id, vehicle_name, domicile_country, status')
        .in('user_id', memberUserIds)
        .eq('status', 'approved');

      if (requestsError) throw requestsError;

      // Combine data to create fund manager profiles
      const approvedMembers: FundManager[] = profiles.map(profile => {
        const request = membershipRequests.find(req => req.user_id === profile.id);
        return {
          id: profile.id,
          firm_name: request?.vehicle_name || 'N/A',
          participant_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A',
          geographic_focus: request?.domicile_country ? [request.domicile_country] : ['N/A'],
          team_based: ['N/A'], // This field is not available in membership_requests
          profile_picture_url: profile.profile_picture_url,
          created_at: profile.created_at
        };
      });

      setFundManagers(approvedMembers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching approved members:', error);
      toast({
        title: "Error",
        description: "Failed to load approved member data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterManagers = () => {
    let filtered = fundManagers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.geographic_focus.some(region => 
          region.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(manager =>
        manager.geographic_focus.some(region => 
          region.toLowerCase().includes(selectedRegion.toLowerCase())
        )
      );
    }

    setFilteredManagers(filtered);
  };

  const regions = [
    'Sub-Saharan Africa',
    'North Africa',
    'Southeast Asia',
    'South Asia',
    'Latin America',
    'Caribbean',
    'Middle East',
    'Eastern Europe'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Approved Members</h1>
          <p className="text-gray-600">Fund managers who have been approved to join the network</p>
        </div>

        {/* Simple Stats */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredManagers.length} of {fundManagers.length} approved members
          </p>
        </div>

        {/* Simple Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by firm name or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-gray-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="border-gray-300 focus:border-gray-500">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region.toLowerCase()}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        {/* Fund Manager Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Card key={manager.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {manager.firm_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {manager.participant_name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Geographic Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {manager.geographic_focus.map((region, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredManagers.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved members found</h3>
              <p className="text-gray-600 mb-4">
                {fundManagers.length === 0 
                  ? "No members have been approved yet." 
                  : "Try adjusting your search criteria to find more results."
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewerNetworkPage;
