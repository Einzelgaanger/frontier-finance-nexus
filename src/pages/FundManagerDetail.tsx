import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  Award,
  Eye,
  Lock,
  AlertCircle,
  Briefcase,
  PieChart,
  BarChart3,
  Shield,
  FileText
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
  // Admin-only fields
  supporting_document_url?: string;
  team_members?: any[];
  team_description?: string;
  expectations?: string;
  legal_entity_date_from?: number;
  legal_entity_date_to?: number;
  first_close_date_from?: number;
  first_close_date_to?: number;
  legal_entity_month_from?: number;
  legal_entity_month_to?: number;
  first_close_month_from?: number;
  first_close_month_to?: number;
  ticket_description?: string;
  capital_in_market?: number;
  vehicle_type_other?: string;
  vehicle_websites?: string | string[];
  investment_instruments_priority?: any[];
  equity_investments_made?: number;
  equity_investments_exited?: number;
  self_liquidating_made?: number;
  self_liquidating_exited?: number;
  how_heard_about_network?: string;
  information_sharing?: string;
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
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: surveyData, error: surveyError } = await supabase
          .from('survey_responses')
          .select('*')
          .eq('user_id', userId)
          .not('completed_at', 'is', null)
          .order('year', { ascending: false });

        if (surveyError) throw surveyError;
        setSurveyResponses((surveyData || []) as SurveyResponse[]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/network')}
            className="mb-6 hover:bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>

          {/* Hero Profile Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-20 h-20 ring-4 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                    {getInitials(profile?.first_name || '', profile?.last_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <p className="text-gray-600 text-lg">{profile?.email}</p>
                  <div className="flex items-center space-x-4 pt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-sm ${userRole === 'viewer' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-green-200 text-green-600 bg-green-50'}`}
                    >
                      {userRole === 'viewer' ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Viewing Public Data
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3 mr-1" />
                          Member Access
                        </>
                      )}
                    </Badge>
                    {surveyResponses.length > 0 && (
                      <Badge variant="secondary" className="text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {surveyResponses.length} Survey{surveyResponses.length > 1 ? 's' : ''} Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-based Access Notice */}
          {userRole === 'viewer' && (
            <Card className="mt-6 border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Limited Data Access</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      You're viewing public information only. To access detailed fund performance data, 
                      investment strategies, and team composition, please contact an administrator to become a member.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Year Selection Pills */}
          {surveyResponses.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="text-sm font-medium text-gray-700 self-center">Survey Years:</span>
              {surveyResponses.map((response) => (
                <Button
                  key={response.year}
                  variant={selectedYear === response.year ? "default" : "outline"}
                  onClick={() => setSelectedYear(response.year)}
                  className={`transition-all ${
                    selectedYear === response.year 
                      ? 'shadow-lg scale-105' 
                      : 'hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {response.year}
                </Button>
              ))}
            </div>
          )}
        </div>

        {selectedResponse && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Main Content - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-8">
              {/* Fund Overview Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Building2 className="w-6 h-6 mr-3 text-blue-600" />
                    Fund Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Vehicle Type</span>
                          <p className="font-semibold text-gray-900">
                            {selectedResponse.vehicle_type?.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Status</span>
                          <p className="font-semibold text-gray-900">
                            {selectedResponse.current_status?.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Team Size</span>
                          <p className="font-semibold text-gray-900">
                            {selectedResponse.team_size_min} - {selectedResponse.team_size_max} members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Survey Year</span>
                          <p className="font-semibold text-gray-900">{selectedResponse.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Investment Thesis
                    </h4>
                    <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap overflow-hidden">
                      {selectedResponse.thesis}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Strategy Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <BarChart3 className="w-6 h-6 mr-3 text-green-600" />
                    Investment Strategy
                    {userRole === 'viewer' && (
                      <Badge variant="outline" className="ml-3 text-xs border-blue-200 text-blue-600">
                        Limited Access
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-gray-500">Ticket Size</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(selectedResponse.ticket_size_min)} - {formatCurrency(selectedResponse.ticket_size_max)}
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Target className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-500">Target Capital</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(selectedResponse.target_capital)}
                        </p>
                      </div>
                    </div>
                    {userRole !== 'viewer' ? (
                      <div className="space-y-4">
                        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-700">Capital Raised</span>
                          </div>
                          <p className="text-lg font-bold text-green-800">
                            {formatCurrency(selectedResponse.capital_raised)}
                          </p>
                        </div>
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Award className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-700">Target Returns</span>
                          </div>
                          <p className="text-lg font-bold text-blue-800">
                            {selectedResponse.target_return_min}% - {selectedResponse.target_return_max}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-blue-900">Member-Only Data</h4>
                            <p className="text-sm text-blue-700">
                              Upgrade to member access to view capital raised and target returns
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Focus Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Globe className="w-6 h-6 mr-3 text-purple-600" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                      Legal Domicile
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResponse.legal_domicile?.map((domicile) => (
                        <Badge key={domicile} variant="secondary" className="px-3 py-1">
                          {domicile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedResponse.markets_operated && Object.keys(selectedResponse.markets_operated).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Market Allocation</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedResponse.markets_operated)
                          .filter(([, percentage]) => percentage > 0)
                          .slice(0, userRole === 'viewer' ? 3 : undefined)
                          .map(([market, percentage]) => (
                            <div key={market} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{market}</span>
                              <div className="flex items-center space-x-3">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-purple-600 min-w-[3rem]">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      {userRole === 'viewer' && Object.keys(selectedResponse.markets_operated).length > 3 && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                          <Lock className="w-4 h-4 inline mr-1" />
                          Showing top 3 markets. Become a member to see all {Object.keys(selectedResponse.markets_operated).length} markets.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              {/* Sector Allocation */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="w-5 h-5 mr-2 text-orange-600" />
                    Sector Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedResponse.sectors_allocation && Object.keys(selectedResponse.sectors_allocation).length > 0 ? (
                    <div className="space-y-4">
                      {getTopSectors(selectedResponse.sectors_allocation)
                        .slice(0, userRole === 'viewer' ? 3 : undefined)
                        .map(({ sector, percentage }) => (
                          <div key={sector} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900">{sector}</span>
                              <span className="text-sm font-bold text-orange-600">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      {userRole === 'viewer' && Object.keys(selectedResponse.sectors_allocation).length > 3 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          <Lock className="w-3 h-3 inline mr-1" />
                          +{Object.keys(selectedResponse.sectors_allocation).length - 3} more sectors
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No sector data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Fund Stage */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    Fund Stage
                    {userRole === 'viewer' && (
                      <Badge variant="outline" className="ml-2 text-xs border-blue-200 text-blue-600">
                        Limited
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedResponse.fund_stage?.slice(0, userRole === 'viewer' ? 2 : undefined).map((stage) => (
                      <Badge key={stage} className="w-full justify-center py-2 bg-green-100 text-green-800 hover:bg-green-200">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                  {userRole === 'viewer' && selectedResponse.fund_stage && selectedResponse.fund_stage.length > 2 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <Lock className="w-3 h-3 inline mr-1" />
                      +{selectedResponse.fund_stage.length - 2} more stages
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Survey History */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Survey History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {surveyResponses.map((response) => (
                      <div 
                        key={response.year}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                          selectedYear === response.year 
                            ? 'bg-blue-100 border-2 border-blue-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedYear(response.year)}
                      >
                        <span className="font-semibold text-gray-900">{response.year}</span>
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

        {/* Admin-Only Sections */}
        {userRole === 'admin' && selectedResponse && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-purple-600" />
              Admin-Only Data
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="w-6 h-6 mr-3 text-blue-600" />
                    Team Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedResponse.team_description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Team Description</h4>
                      <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{selectedResponse.team_description}</p>
                    </div>
                  )}
                  
                  {selectedResponse.team_members && selectedResponse.team_members.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Team Members</h4>
                      <div className="space-y-2">
                        {selectedResponse.team_members.map((member, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-600">{member.role}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                            {member.phone && <div className="text-sm text-gray-500">{member.phone}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Fund Details */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Building2 className="w-6 h-6 mr-3 text-green-600" />
                    Additional Fund Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedResponse.vehicle_websites && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vehicle Websites</h4>
                      <div className="space-y-1">
                        {Array.isArray(selectedResponse.vehicle_websites) 
                          ? selectedResponse.vehicle_websites.map((url, index) => (
                              <a key={index} href={url} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:text-blue-800 text-sm block">
                                {url}
                              </a>
                            ))
                          : <a href={selectedResponse.vehicle_websites} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:text-blue-800 text-sm">
                              {selectedResponse.vehicle_websites}
                            </a>
                        }
                      </div>
                    </div>
                  )}

                  {selectedResponse.vehicle_type_other && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Other Vehicle Type</h4>
                      <p className="text-gray-700">{selectedResponse.vehicle_type_other}</p>
                    </div>
                  )}

                  {selectedResponse.ticket_description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ticket Size Description</h4>
                      <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{selectedResponse.ticket_description}</p>
                    </div>
                  )}

                  {selectedResponse.capital_in_market && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Capital in Market</h4>
                      <p className="text-gray-700 font-semibold">{formatCurrency(selectedResponse.capital_in_market)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investment History */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <TrendingUp className="w-6 h-6 mr-3 text-orange-600" />
                    Investment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedResponse.equity_investments_made || 0}</div>
                      <div className="text-sm text-gray-600">Equity Made</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedResponse.equity_investments_exited || 0}</div>
                      <div className="text-sm text-gray-600">Equity Exited</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedResponse.self_liquidating_made || 0}</div>
                      <div className="text-sm text-gray-600">Self-Liquidating Made</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedResponse.self_liquidating_exited || 0}</div>
                      <div className="text-sm text-gray-600">Self-Liquidating Exited</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Globe className="w-6 h-6 mr-3 text-indigo-600" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedResponse.how_heard_about_network && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How Heard About Network</h4>
                      <p className="text-gray-700">{selectedResponse.how_heard_about_network}</p>
                    </div>
                  )}

                  {selectedResponse.information_sharing && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Information Sharing</h4>
                      <p className="text-gray-700">{selectedResponse.information_sharing}</p>
                    </div>
                  )}

                  {selectedResponse.expectations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expectations</h4>
                      <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{selectedResponse.expectations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Supporting Documents */}
              {selectedResponse.supporting_document_url && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:col-span-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="w-6 h-6 mr-3 text-red-600" />
                      Supporting Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-red-600" />
                        <div>
                          <h4 className="font-semibold text-red-900">Supporting Document</h4>
                          <a 
                            href={selectedResponse.supporting_document_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800 text-sm underline"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Empty States */}
        {!selectedResponse && surveyResponses.length > 0 && (
          <Card className="text-center py-16 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Survey Year</h3>
              <p className="text-gray-600">Choose from the available survey years above to view detailed information</p>
            </CardContent>
          </Card>
        )}

        {surveyResponses.length === 0 && (
          <Card className="text-center py-16 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Survey Data Available</h3>
              <p className="text-gray-600">This fund manager hasn't completed any surveys yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FundManagerDetail;
