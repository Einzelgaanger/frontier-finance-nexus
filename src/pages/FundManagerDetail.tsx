import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  MapPin, 
  DollarSign, 
  Target, 
  Calendar,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';

interface SurveyResponse {
  id: string;
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
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const FundManagerDetail = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const { toast } = useToast();

  const managerName = location.state?.managerName || 'Fund Manager';

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch survey responses
        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('user_id', userId)
          .not('completed_at', 'is', null)
          .order('year', { ascending: false });

        if (surveyError) throw surveyError;
        setSurveyResponses(surveyData || []);

        // Set the most recent year as default
        if (surveyData && surveyData.length > 0) {
          setSelectedYear(surveyData[0].year);
        }
      } catch (error) {
        console.error('Error fetching fund manager data:', error);
        toast({
          title: "Error",
          description: "Failed to load fund manager data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);

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
      .slice(0, 5)
      .map(([sector, percentage]) => ({ sector, percentage }));
  };

  const selectedResponse = surveyResponses.find(r => r.year === selectedYear);

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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/network')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>

          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                {getInitials(profile?.first_name || '', profile?.last_name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          {/* Year Selection */}
          <div className="flex flex-wrap gap-2">
            {surveyResponses.map((response) => (
              <Button
                key={response.year}
                variant={selectedYear === response.year ? "default" : "outline"}
                onClick={() => setSelectedYear(response.year)}
                className="flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {response.year}
              </Button>
            ))}
          </div>
        </div>

        {selectedResponse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fund Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Fund Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Vehicle Type:</span>
                      <p className="text-gray-900">{selectedResponse.vehicle_type?.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">{selectedResponse.current_status?.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Team Size:</span>
                      <p className="text-gray-900">{selectedResponse.team_size_min} - {selectedResponse.team_size_max} members</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Year:</span>
                      <p className="text-gray-900">{selectedResponse.year}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Investment Thesis:</span>
                    <p className="text-gray-900 mt-1">{selectedResponse.thesis}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Investment Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Ticket Size:</span>
                      <p className="text-gray-900">
                        {formatCurrency(selectedResponse.ticket_size_min)} - {formatCurrency(selectedResponse.ticket_size_max)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Target Capital:</span>
                      <p className="text-gray-900">{formatCurrency(selectedResponse.target_capital)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Capital Raised:</span>
                      <p className="text-gray-900">{formatCurrency(selectedResponse.capital_raised)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Target Returns:</span>
                      <p className="text-gray-900">{selectedResponse.target_return_min}% - {selectedResponse.target_return_max}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Focus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Legal Domicile:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedResponse.legal_domicile?.map((domicile) => (
                          <Badge key={domicile} variant="outline">
                            {domicile}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedResponse.markets_operated && Object.keys(selectedResponse.markets_operated).length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Market Focus:</span>
                        <div className="space-y-2 mt-2">
                          {Object.entries(selectedResponse.markets_operated)
                            .filter(([, percentage]) => percentage > 0)
                            .map(([market, percentage]) => (
                              <div key={market} className="flex justify-between items-center">
                                <span className="text-sm">{market}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{percentage}%</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sector Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Sector Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResponse.sectors_allocation && Object.keys(selectedResponse.sectors_allocation).length > 0 ? (
                    <div className="space-y-3">
                      {getTopSectors(selectedResponse.sectors_allocation).map(({ sector, percentage }) => (
                        <div key={sector} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{sector}</span>
                            <span className="text-gray-600">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No sector allocation data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Fund Stage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Fund Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedResponse.fund_stage?.map((stage) => (
                      <Badge key={stage} className="bg-green-100 text-green-800">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Survey History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Survey History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {surveyResponses.map((response) => (
                      <div 
                        key={response.year}
                        className={`flex items-center justify-between p-2 rounded ${
                          selectedYear === response.year ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm font-medium">{response.year}</span>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(response.completed_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!selectedResponse && surveyResponses.length > 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a year to view details</h3>
            <p className="text-gray-600">Choose from the available survey years above</p>
          </div>
        )}

        {surveyResponses.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No survey data available</h3>
            <p className="text-gray-600">This fund manager hasn't completed any surveys yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundManagerDetail; 