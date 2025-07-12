
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Globe, 
  Users, 
  Calendar, 
  Target, 
  DollarSign, 
  TrendingUp,
  Mail,
  ExternalLink,
  MapPin,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurveyResponse {
  id: string;
  vehicle_name: string;
  thesis: string;
  ticket_size: string;
  location: string;
  team_size_description: string;
  portfolio_count: number;
  capital_raised_description: string;
  expectations: string;
  year: number;
  completed_at: string;
  vehicle_website?: string;
  how_heard_about_network: string;
}

interface FundManagerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string;
}

const FundManagerDetail = () => {
  const { userId } = useParams();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FundManagerProfile | null>(null);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [activeSurvey, setActiveSurvey] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    if (userId && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [userId, userRole]);

  const fetchFundManagerData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      // Fetch surveys
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('year', { ascending: false });

      if (surveyError) throw surveyError;

      // Type assertion to match our interface
      const typedSurveys = (surveyData || []).map(survey => ({
        id: survey.id,
        vehicle_name: survey.vehicle_name,
        thesis: survey.thesis,
        ticket_size: survey.ticket_size,
        location: survey.location,
        team_size_description: survey.team_size_description,
        portfolio_count: survey.portfolio_count,
        capital_raised_description: survey.capital_raised_description,
        expectations: survey.expectations,
        year: survey.year,
        completed_at: survey.completed_at,
        vehicle_website: survey.vehicle_website,
        how_heard_about_network: survey.how_heard_about_network
      })) as SurveyResponse[];

      setSurveys(typedSurveys);
      
      if (typedSurveys.length > 0) {
        setActiveSurvey(typedSurveys[0]);
      }
    } catch (error) {
      console.error('Error fetching fund manager data:', error);
      toast({
        title: "Error",
        description: "Failed to load fund manager details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
                You need at least Viewer access to view fund manager details.
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
            <p className="mt-4 text-gray-600">Loading fund manager details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || surveys.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Fund Manager Not Found</CardTitle>
              <CardDescription>
                This fund manager profile is not available or has not completed any surveys.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.profile_picture_url} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile.first_name?.[0]?.toUpperCase() || 'U'}
                  {profile.last_name?.[0]?.toUpperCase() || ''}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {activeSurvey?.vehicle_name}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {activeSurvey?.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{activeSurvey.location}</span>
                    </div>
                  )}
                  {activeSurvey?.vehicle_website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={activeSurvey.vehicle_website.startsWith('http') ? activeSurvey.vehicle_website : `https://${activeSurvey.vehicle_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Data */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {activeSurvey && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Ticket Size</p>
                          <p className="text-xl font-bold text-gray-900">{activeSurvey.ticket_size}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Briefcase className="w-8 h-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Portfolio</p>
                          <p className="text-xl font-bold text-gray-900">{activeSurvey.portfolio_count} investments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Survey Year</p>
                          <p className="text-xl font-bold text-gray-900">{activeSurvey.year}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Investment Thesis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Thesis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{activeSurvey.thesis}</p>
                  </CardContent>
                </Card>

                {/* Team & Operations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{activeSurvey.team_size_description}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Capital Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{activeSurvey.capital_raised_description}</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {activeSurvey && (
              <Card>
                <CardHeader>
                  <CardTitle>Network Expectations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What they expect from the network:</h4>
                    <p className="text-gray-700 leading-relaxed">{activeSurvey.expectations}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How they heard about us:</h4>
                    <Badge variant="secondary">{activeSurvey.how_heard_about_network}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Survey History</CardTitle>
                <CardDescription>All submitted surveys by this fund manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div 
                      key={survey.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        activeSurvey?.id === survey.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveSurvey(survey)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{survey.vehicle_name}</h3>
                          <p className="text-sm text-gray-600">Year: {survey.year}</p>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(survey.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={activeSurvey?.id === survey.id ? "default" : "secondary"}>
                          {activeSurvey?.id === survey.id ? "Active" : "View"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FundManagerDetail;
