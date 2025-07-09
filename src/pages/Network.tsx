
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Building2, Globe, Users, TrendingUp, MapPin, DollarSign, Target, Calendar, Award, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

interface FundManager {
  id: string;
  user_id: string;
  year: number;
  vehicle_type: string;
  thesis: string;
  team_size_min: number;
  team_size_max: number;
  legal_domicile: string[];
  markets_operated: Record<string, number>;
  ticket_size_min: number;
  ticket_size_max: number;
  target_capital: number;
  capital_raised: number;
  fund_stage: string[];
  current_status: string;
  sectors_allocation: Record<string, number>;
  target_return_min: number;
  target_return_max: number;
  completed_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Network = () => {
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundManagers = async () => {
      try {
        // First, get all completed survey responses
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('*')
          .not('completed_at', 'is', null)
          .order('created_at', { ascending: false });

        if (surveyError) throw surveyError;

        // Then, get all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email');

        if (profilesError) throw profilesError;

        // Create a map of user_id to profile data
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        // Combine the data
        const combinedData = surveyData?.map(survey => ({
          ...survey,
          profiles: profilesMap.get(survey.user_id)
        })) || [];

        setFundManagers(combinedData);
        setFilteredManagers(combinedData);
      } catch (error) {
        console.error('Error fetching fund managers:', error);
        toast({
          title: "Error",
          description: "Failed to load fund managers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFundManagers();
  }, [toast]);

  useEffect(() => {
    const filtered = fundManagers.filter(manager => {
      const searchLower = searchTerm.toLowerCase();
      return (
        manager.profiles?.first_name?.toLowerCase().includes(searchLower) ||
        manager.profiles?.last_name?.toLowerCase().includes(searchLower) ||
        manager.vehicle_type?.toLowerCase().includes(searchLower) ||
        manager.thesis?.toLowerCase().includes(searchLower) ||
        manager.legal_domicile?.some(d => d.toLowerCase().includes(searchLower))
      );
    });
    setFilteredManagers(filtered);
  }, [searchTerm, fundManagers]);

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getTopSectors = (sectors: Record<string, number>) => {
    if (!sectors) return [];
    return Object.entries(sectors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sector, percentage]) => ({ sector, percentage }));
  };

  const handleManagerClick = (manager: FundManager) => {
    // Navigate to a detailed view with year selection
    navigate(`/network/fund-manager/${manager.user_id}`, { 
      state: { 
        managerName: `${manager.profiles?.first_name} ${manager.profiles?.last_name}`,
        userId: manager.user_id 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Globe className="w-8 h-8 mr-3 text-blue-600" />
            Fund Manager Network
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with {fundManagers.length} fund managers across emerging markets
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search fund managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Fund Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Card 
              key={manager.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => handleManagerClick(manager)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(manager.profiles?.first_name || '', manager.profiles?.last_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {manager.profiles?.first_name} {manager.profiles?.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      {manager.vehicle_type?.replace('_', ' ').toUpperCase()}
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {manager.thesis}
                </p>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {manager.legal_domicile?.slice(0, 2).join(', ')}
                  {manager.legal_domicile?.length > 2 && ` +${manager.legal_domicile.length - 2}`}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatCurrency(manager.target_capital)}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {manager.year}
                  </Badge>
                </div>

                {manager.sectors_allocation && (
                  <div className="flex flex-wrap gap-1">
                    {getTopSectors(manager.sectors_allocation).map((sector, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {sector.sector}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredManagers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
