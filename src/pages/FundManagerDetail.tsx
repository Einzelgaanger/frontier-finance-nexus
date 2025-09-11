import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  Building2, 
  Target, 
  Users, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Phone,
  Briefcase,
  TrendingUp,
  DollarSign,
  FileText,
  Award,
  Star,
  Shield,
  BarChart3
} from 'lucide-react';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  year?: number;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  // Comprehensive survey data
  survey2021?: Record<string, unknown>;
  survey2022?: Record<string, unknown>;
  survey2023?: Record<string, unknown>;
  survey2024?: Record<string, unknown>;
}

const FundManagerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  
  const [fundManager, setFundManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<{
    survey2021?: Record<string, unknown>;
    survey2022?: Record<string, unknown>;
    survey2023?: Record<string, unknown>;
    survey2024?: Record<string, unknown>;
  }>({});
  
  // State for year and section navigation
  const [selectedYear, setSelectedYear] = useState<'2021' | '2022' | '2023' | '2024'>('2021');
  const [selectedSection, setSelectedSection] = useState<number>(1);

  // Survey sections configuration
  const surveySections = {
    2021: [
      { id: 1, title: 'Background Information', icon: Users },
      { id: 2, title: 'Investment Thesis & Capital Construct', icon: Target },
      { id: 3, title: 'Portfolio Construction and Team', icon: Building2 }
    ],
    2022: [
      { id: 1, title: 'Contact Information', icon: Mail },
      { id: 2, title: 'Timeline & Legal', icon: Calendar },
      { id: 3, title: 'Geographic & Team', icon: Globe },
      { id: 4, title: 'Prior Experience', icon: Award },
      { id: 5, title: 'Legal and Currency', icon: Shield },
      { id: 6, title: 'Fund Operations', icon: DollarSign },
      { id: 7, title: 'Investment Strategy', icon: Target },
      { id: 8, title: 'Portfolio Construction', icon: BarChart3 }
    ],
    2023: [
      { id: 1, title: 'Introduction & Context', icon: Users },
      { id: 2, title: 'Organizational Background and Team', icon: Building2 },
      { id: 3, title: 'Vehicle Construct', icon: Target }
    ],
    2024: [
      { id: 1, title: 'Introduction & Context', icon: Users },
      { id: 2, title: 'Organizational Background and Team', icon: Building2 },
      { id: 3, title: 'Vehicle Construct', icon: Target }
    ]
  };


  // Fetch survey data for the fund manager
  const fetchSurveyData = async (userId: string) => {
    try {
      setSurveyLoading(true);
      
      const surveyChecks = await Promise.allSettled([
        // 2021 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_responses_2021')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
          } catch (error) {
            console.warn('2021 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // 2023 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_responses_2023')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
          } catch (error) {
            console.warn('2023 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // 2024 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_responses_2024')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
          } catch (error) {
            console.warn('2024 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // Regular survey (fallback)
        (async () => {
          try {
            return await supabase
              .from('survey_responses')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
          } catch (error) {
            console.warn('Regular survey table not accessible:', error);
            return { data: null, error: null };
          }
        })()
      ]);

      setSurveyData({
        survey2021: surveyChecks[0].status === 'fulfilled' ? surveyChecks[0].value?.data : null,
        survey2022: null, // Table doesn't exist
        survey2023: surveyChecks[1].status === 'fulfilled' ? surveyChecks[1].value?.data : null,
        survey2024: surveyChecks[2].status === 'fulfilled' ? surveyChecks[2].value?.data : null
      });
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setSurveyLoading(false);
    }
  };

  useEffect(() => {
    // Get fund manager data from navigation state or fetch from API
    if (location.state?.fundManager) {
      setFundManager(location.state.fundManager);
      // Fetch survey data
      fetchSurveyData(location.state.fundManager.user_id);
      setLoading(false);
    } else {
      // If no state, you could fetch from API using the id
      console.log('No fund manager data in state, would fetch from API with id:', id);
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!fundManager) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fund Manager Not Found</h2>
            <p className="text-gray-600 mb-6">The requested fund manager could not be found.</p>
            <Button onClick={() => navigate('/network')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Get available years from survey data
  const availableYears = Object.keys(surveyData).filter(year => surveyData[year as keyof typeof surveyData]).map(year => year.replace('survey', '')).sort();

  // Get current survey data
  const currentSurveyData = surveyData[`survey${selectedYear}` as keyof typeof surveyData];
  const currentSections = surveySections[selectedYear as keyof typeof surveySections] || [];

  // Function to render survey section content
  const renderSurveySection = (sectionId: number) => {
    if (!currentSurveyData) return null;

    const section = currentSections.find(s => s.id === sectionId);
    if (!section) return null;

    // This is a simplified version - you'd need to map the actual survey fields to sections
    // For now, showing all data in the selected section
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <section.icon className="w-5 h-5 mr-2 text-blue-600" />
          {section.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(currentSurveyData).map(([key, value]) => {
            if (key === 'user_id' || key === 'id' || !value) return null;
            return (
              <div key={key} className="space-y-1">
                <h5 className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </h5>
                <p className="text-sm text-gray-900">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">

        {/* Firm Details Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-100">
          <CardContent className="p-8">
              <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                  {fundManager.profile?.first_name?.[0] || fundManager.participant_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {fundManager.firm_name || fundManager.fund_name || 'Unnamed Firm'}
                </h2>
                <p className="text-xl text-gray-600 mb-1">
                  {fundManager.participant_name || 'Unknown Participant'}
                </p>
                {fundManager.role_title && (
                  <p className="text-lg text-gray-500">{fundManager.role_title}</p>
                )}
                
                <div className="flex items-center space-x-4 mt-4">
                  {fundManager.email_address && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{fundManager.email_address}</span>
                    </div>
                  )}

                  {fundManager.legal_domicile && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{fundManager.legal_domicile}</span>
                    </div>
                  )}

                  <Badge 
                    variant={fundManager.has_survey ? "default" : "secondary"}
                    className={`${fundManager.has_survey ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {fundManager.has_survey ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Profile Complete
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Profile Incomplete
                      </>
                    )}
                  </Badge>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

        {/* Year Navigation Tabs */}
        {availableYears.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 mr-4">Survey Year:</span>
                {availableYears.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year as '2021' | '2022' | '2023' | '2024')}
                    className={`${
                      selectedYear === year 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {year}
                      </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section Navigation */}
        {currentSections.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 mr-4">Survey Section:</span>
                {currentSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSection(section.id)}
                    className={`${
                      selectedSection === section.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                      </Button>
                ))}
                    </div>
                  </CardContent>
                </Card>
              )}

        {/* Survey Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {surveyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading survey data...</p>
            </div>
            ) : currentSurveyData ? (
              renderSurveySection(selectedSection)
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Survey Data Available</h4>
                <p className="text-gray-600">This fund manager has not completed the {selectedYear} survey yet.</p>
          </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default FundManagerDetail;