
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Building2, Globe, Users, MapPin, ArrowRight, Eye, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  website: string;
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
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundManagers = async () => {
      try {
        console.log('Fetching fund managers for role:', userRole);
        
        if (userRole === 'viewer') {
          // Viewers only see basic info: fund name and website from completed surveys
          const { data: surveyData, error: surveyError } = await supabase
            .from('member_surveys')
            .select(`
              user_id,
              fund_name,
              website,
              profiles!inner(first_name, last_name, email)
            `)
            .not('completed_at', 'is', null);

          if (surveyError) throw surveyError;

          const viewerData: FundManager[] = surveyData?.map(survey => ({
            id: survey.user_id,
            user_id: survey.user_id,
            fund_name: survey.fund_name || 'Fund Name Not Available',
            website: survey.website || '',
            profiles: survey.profiles
          })) || [];

          setFundManagers(viewerData);
          setFilteredManagers(viewerData);
        } else {
          // Members and admins see full data
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .order('created_at', { ascending: false });

          if (profilesError) throw profilesError;

          const { data: surveyData, error: surveyError } = await supabase
            .from('member_surveys')
            .select('*')
            .order('created_at', { ascending: false });

          if (surveyError) throw surveyError;

          const surveyMap = new Map();
          surveyData?.forEach(survey => {
            surveyMap.set(survey.user_id, survey);
          });

          const combinedData: FundManager[] = profilesData?.map(profile => {
            const survey = surveyMap.get(profile.id);
            return {
              id: profile.id,
              user_id: profile.id,
              fund_name: survey?.fund_name || 'Fund Name Not Available',
              website: survey?.website || '',
              profiles: profile
            };
          }) || [];

          setFundManagers(combinedData);
          setFilteredManagers(combinedData);
        }
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
        manager.fund_name?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredManagers(filtered);
  }, [searchTerm, fundManagers]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleManagerClick = (manager: FundManager) => {
    if (userRole === 'viewer') {
      toast({
        title: "Access Restricted",
        description: "Apply for membership to view full fund manager profiles.",
        variant: "destructive",
      });
      return;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 flex items-center">
            <Globe className="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
            ESCP Network Directory
          </h1>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              {userRole === 'viewer' ? 'Limited view - ' : ''}{fundManagers.length} fund managers in the network
            </p>
            {userRole === 'viewer' && (
              <Badge variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Viewer Access
              </Badge>
            )}
          </div>
          
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

        {/* Access Notice for Viewers */}
        {userRole === 'viewer' && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Limited Access</h3>
                  <p className="text-sm text-orange-800 mb-3">
                    As a visitor, you can only view fund names and websites. Apply for membership to access full profiles, investment details, and analytics.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => navigate('/dashboard')}
                  >
                    Apply for Membership
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fund Managers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredManagers.map((manager) => (
            <Card 
              key={manager.id} 
              className={`group transition-all duration-300 border-gray-200 bg-white shadow-sm hover:shadow-md ${
                userRole !== 'viewer' ? 'cursor-pointer hover:-translate-y-1 hover:border-blue-300' : ''
              }`}
              onClick={() => handleManagerClick(manager)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                      {getInitials(manager.profiles?.first_name || '', manager.profiles?.last_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {manager.profiles?.first_name} {manager.profiles?.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Fund Manager</span>
                    </CardDescription>
                  </div>
                  {userRole !== 'viewer' && (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                    {manager.fund_name}
                  </h4>
                  {userRole === 'viewer' && (
                    <p className="text-xs text-gray-500 mb-2">
                      Apply for membership to view full details
                    </p>
                  )}
                </div>
                
                {manager.website && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Globe className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                    <a 
                      href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all text-xs sm:text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {userRole === 'viewer' && (
                  <div className="pt-2 border-t border-gray-100">
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      <Lock className="w-3 h-3 mr-1" />
                      Limited View
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
