
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Building2, Globe, Users, TrendingUp, MapPin, DollarSign, Target, Calendar, Award, ArrowRight, Eye, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

interface FundManager {
  id: string;
  user_id: string;
  year: number | null;
  vehicle_type: string;
  thesis: string;
  team_size_min: number | null;
  team_size_max: number | null;
  legal_domicile: string[];
  markets_operated: Record<string, number>;
  ticket_size_min: number | null;
  ticket_size_max: number | null;
  target_capital: number | null;
  capital_raised: number | null;
  fund_stage: string[];
  current_status: string;
  sectors_allocation: Record<string, number>;
  target_return_min: number | null;
  target_return_max: number | null;
  completed_at: string | null;
  has_survey: boolean;
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
        console.log('Fetching fund managers for role:', userRole);
        
        // Get all completed survey responses first
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('*')
          .not('completed_at', 'is', null)
          .order('created_at', { ascending: false });

        if (surveyError) throw surveyError;
        console.log('Completed surveys found:', surveyData?.length || 0);

        // Get all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;
        console.log('Profiles found:', profilesData?.length || 0);

        // Create a map of user_id to profile data
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        let combinedData: FundManager[] = [];

        if (surveyData && surveyData.length > 0) {
          // Show fund managers with completed surveys
          combinedData = surveyData.map(survey => {
            const profile = profilesMap.get(survey.user_id);
            return {
              id: survey.id,
              user_id: survey.user_id,
              profiles: profile,
              year: survey.year || null,
              vehicle_type: survey.vehicle_type || 'Not specified',
              thesis: survey.thesis || 'No investment thesis available',
              team_size_min: survey.team_size_min || null,
              team_size_max: survey.team_size_max || null,
              legal_domicile: survey.legal_domicile ? 
                (Array.isArray(survey.legal_domicile) ? survey.legal_domicile : 
                  (typeof survey.legal_domicile === 'string' ? JSON.parse(survey.legal_domicile) : [])) : 
                [],
              markets_operated: survey.markets_operated ? 
                (typeof survey.markets_operated === 'object' ? survey.markets_operated : 
                  (typeof survey.markets_operated === 'string' ? JSON.parse(survey.markets_operated) : {})) : 
                {},
              ticket_size_min: survey.ticket_size_min || null,
              ticket_size_max: survey.ticket_size_max || null,
              target_capital: survey.target_capital || null,
              capital_raised: survey.capital_raised || null,
              fund_stage: survey.fund_stage ? 
                (Array.isArray(survey.fund_stage) ? survey.fund_stage : 
                  (typeof survey.fund_stage === 'string' ? JSON.parse(survey.fund_stage) : [])) : 
                [],
              current_status: survey.current_status || 'Not specified',
              sectors_allocation: survey.sectors_allocation ? 
                (typeof survey.sectors_allocation === 'object' ? survey.sectors_allocation : 
                  (typeof survey.sectors_allocation === 'string' ? JSON.parse(survey.sectors_allocation) : {})) : 
                {},
              target_return_min: survey.target_return_min || null,
              target_return_max: survey.target_return_max || null,
              completed_at: survey.completed_at || null,
              has_survey: true
            };
          });
        } else if (userRole === 'viewer') {
          // For viewers, show all profiles as basic entries if no completed surveys exist
          console.log('No completed surveys found, showing basic profiles for viewers');
          combinedData = profilesData?.map(profile => ({
            id: profile.id,
            user_id: profile.id,
            profiles: profile,
            year: null,
            vehicle_type: 'Not specified',
            thesis: 'Profile not completed',
            team_size_min: null,
            team_size_max: null,
            legal_domicile: [],
            markets_operated: {},
            ticket_size_min: null,
            ticket_size_max: null,
            target_capital: null,
            capital_raised: null,
            fund_stage: [],
            current_status: 'Not specified',
            sectors_allocation: {},
            target_return_min: null,
            target_return_max: null,
            completed_at: null,
            has_survey: false
          })) || [];
        }

        console.log('Combined data prepared:', combinedData.length);
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
  }, [toast, userRole]);

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
          
          {/* Role-based notice */}
          {userRole === 'viewer' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Viewer Access</h3>
                  <p className="text-sm text-blue-700">
                    You're currently viewing public data only. 
                    <span className="font-medium"> Contact an admin to complete a survey and become a member</span> for access to detailed fund performance, investment strategies, and team composition data.
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredManagers.map((manager) => (
            <Card 
              key={manager.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border-gray-200 hover:border-blue-300 bg-white"
              onClick={() => handleManagerClick(manager)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      {getInitials(manager.profiles?.first_name || '', manager.profiles?.last_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                      {manager.profiles?.first_name} {manager.profiles?.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {manager.vehicle_type?.replace('_', ' ').toUpperCase()}
                      </span>
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {manager.thesis}
                </p>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {manager.legal_domicile?.slice(0, 2).join(', ')}
                    {manager.legal_domicile?.length > 2 && ` +${manager.legal_domicile.length - 2}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-700 font-medium">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatCurrency(manager.target_capital)}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {manager.year}
                  </Badge>
                </div>

                {manager.sectors_allocation && (
                  <div className="flex flex-wrap gap-1">
                    {getTopSectors(manager.sectors_allocation).map((sector, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600">
                        {sector.sector}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Role-based data indicators */}
                {userRole === 'viewer' && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Public data only</span>
                      <span className="sm:hidden">Public</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">
                      Viewer
                    </Badge>
                  </div>
                )}

                {userRole === 'member' && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Member access</span>
                      <span className="sm:hidden">Member</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-200 text-green-600 bg-green-50">
                      Member
                    </Badge>
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
