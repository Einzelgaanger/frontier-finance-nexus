import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
  BarChart3,
  ArrowLeft
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
  first_name?: string;
  last_name?: string;
  phone?: string;
  linkedin?: string;
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

interface FundManagerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  fund_name?: string;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  phone?: string;
  linkedin?: string;
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
  profile_picture_url?: string;
}

const FundManagerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [fundManager, setFundManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<{
    survey2021?: Record<string, unknown>;
    survey2022?: Record<string, unknown>;
    survey2023?: Record<string, unknown>;
    survey2024?: Record<string, unknown>;
  }>({});
  const [selectedYear, setSelectedYear] = useState<'2021' | '2022' | '2023' | '2024'>('2021');
  const [selectedSection, setSelectedSection] = useState<number>(1);

  // Survey sections configuration
  const surveySections = {
    2021: [
      { id: 1, title: "Introduction & Context", questions: 14 },
      { id: 2, title: "Investment Focus", questions: 8 },
      { id: 3, title: "Vehicle Construct", questions: 18 },
      { id: 4, title: "Investment Process", questions: 12 },
      { id: 5, title: "Portfolio Management", questions: 10 },
      { id: 6, title: "Risk Management", questions: 8 },
      { id: 7, title: "ESG & Impact", questions: 6 },
      { id: 8, title: "Technology & Innovation", questions: 4 },
      { id: 9, title: "Market Outlook", questions: 6 },
      { id: 10, title: "Collaboration & Network", questions: 4 }
    ],
    2022: [
      { id: 1, title: "Introduction & Context", questions: 14 },
      { id: 2, title: "Investment Focus", questions: 8 },
      { id: 3, title: "Vehicle Construct", questions: 18 },
      { id: 4, title: "Investment Process", questions: 12 },
      { id: 5, title: "Portfolio Management", questions: 10 },
      { id: 6, title: "Risk Management", questions: 8 },
      { id: 7, title: "ESG & Impact", questions: 6 },
      { id: 8, title: "Technology & Innovation", questions: 4 },
      { id: 9, title: "Market Outlook", questions: 6 },
      { id: 10, title: "Collaboration & Network", questions: 4 }
    ],
    2023: [
      { id: 1, title: "Introduction & Context", questions: 14 },
      { id: 2, title: "Investment Focus", questions: 8 },
      { id: 3, title: "Vehicle Construct", questions: 18 },
      { id: 4, title: "Investment Process", questions: 12 },
      { id: 5, title: "Portfolio Management", questions: 10 },
      { id: 6, title: "Risk Management", questions: 8 },
      { id: 7, title: "ESG & Impact", questions: 6 },
      { id: 8, title: "Technology & Innovation", questions: 4 },
      { id: 9, title: "Market Outlook", questions: 6 },
      { id: 10, title: "Collaboration & Network", questions: 4 }
    ],
    2024: [
      { id: 1, title: "Introduction & Context", questions: 14 },
      { id: 2, title: "Investment Focus", questions: 8 },
      { id: 3, title: "Vehicle Construct", questions: 18 },
      { id: 4, title: "Investment Process", questions: 12 },
      { id: 5, title: "Portfolio Management", questions: 10 },
      { id: 6, title: "Risk Management", questions: 8 },
      { id: 7, title: "ESG & Impact", questions: 6 },
      { id: 8, title: "Technology & Innovation", questions: 4 },
      { id: 9, title: "Market Outlook", questions: 6 },
      { id: 10, title: "Collaboration & Network", questions: 4 }
    ]
  };

  // Fetch survey data for the fund manager
  const fetchSurveyData = async (userId: string) => {
    try {
      setSurveyLoading(true);
      console.log('Fetching survey data for user:', userId);

      const surveyPromises = [
        // 2021 Survey
        (async () => {
          try {
            const { data, error } = await supabase
              .from('survey_2021_responses')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            return { year: '2021', data, error };
          } catch (error) {
            return { year: '2021', data: null, error };
          }
        })(),
        // 2023 Survey
        (async () => {
          try {
            const { data, error } = await supabase
              .from('survey_2023_responses')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            return { year: '2023', data, error };
          } catch (error) {
            return { year: '2023', data: null, error };
          }
        })(),
        // 2024 Survey
        (async () => {
          try {
            const { data, error } = await supabase
              .from('survey_2024_responses')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            return { year: '2024', data, error };
          } catch (error) {
            return { year: '2024', data: null, error };
          }
        })(),
        // General Survey
        (async () => {
          try {
            const { data, error } = await supabase
              .from('survey_responses')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            return { year: 'general', data, error };
          } catch (error) {
            return { year: 'general', data: null, error };
          }
        })()
      ];

      const results = await Promise.allSettled(surveyPromises);
      
      const surveyData: Record<string, Record<string, unknown>> = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { year, data, error } = result.value;
          if (data && !error) {
            surveyData[`survey${year}`] = data;
          }
        }
      });

      setSurveyData(surveyData);
      console.log('Survey data fetched:', surveyData);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setSurveyLoading(false);
    }
  };

  const fetchFundManagerData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching fund manager data for user:', id);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        return;
      }

      // Process the data
      const processedProfile: FundManagerProfile = {
        id: profileData.id,
        user_id: profileData.id,
        fund_name: (profileData as Record<string, unknown>).fund_name as string || 'Unnamed Fund',
        firm_name: (profileData as Record<string, unknown>).firm_name as string,
        participant_name: (profileData as Record<string, unknown>).participant_name as string,
        role_title: (profileData as Record<string, unknown>).role_title as string,
        email_address: profileData.email,
        phone: (profileData as Record<string, unknown>).phone as string,
        website: (profileData as Record<string, unknown>).website as string,
        linkedin: (profileData as Record<string, unknown>).linkedin as string,
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        profile_picture_url: profileData.profile_picture_url
      };

      setFundManager(processedProfile as FundManager);
      
      // Fetch survey data
      await fetchSurveyData(id);
    } catch (error) {
      console.error('Error fetching fund manager data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fund manager data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [id, userRole, fetchFundManagerData]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!fundManager) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Manager Not Found</h1>
            <p className="text-gray-600 mb-6">The requested fund manager could not be found.</p>
            <Button onClick={() => navigate('/network')} className="inline-flex items-center">
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
  const currentSections = surveySections[selectedYear as '2021' | '2022' | '2023' | '2024'] || [];

  // Function to render survey section content
  const renderSurveySection = (sectionId: number) => {
    if (!currentSurveyData) return null;

    const section = currentSections.find(s => s.id === sectionId);
    if (!section) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        <p className="text-sm text-gray-600">
          This section contains {section.questions} questions about {section.title.toLowerCase()}.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Survey data for {selectedYear} - {section.title} section is available.
          </p>
        </div>
      </div>
    );
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-[#f5f5dc] min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {fundManager.participant_name?.charAt(0) || fundManager.first_name?.charAt(0) || 'F'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {fundManager.participant_name || `${fundManager.first_name} ${fundManager.last_name}`}
                </h1>
                <p className="text-lg text-gray-600">{fundManager.role_title}</p>
                <p className="text-sm text-gray-500">{fundManager.firm_name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Survey Navigation */}
        {availableYears.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Survey Responses</CardTitle>
                <CardDescription>
                  View survey responses by year and section
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Year Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Select Year</h3>
                  <div className="flex space-x-2">
                    {availableYears.map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedYear(year as '2021' | '2022' | '2023' | '2024')}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Section Selection */}
                {currentSections.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Select Section</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {currentSections.map((section) => (
                        <Button
                          key={section.id}
                          variant={selectedSection === section.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSection(section.id)}
                          className="text-xs"
                        >
                          {section.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Content */}
                {currentSurveyData && (
                  <div className="mt-6">
                    {renderSurveySection(selectedSection)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fund Manager Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Firm</p>
                  <p className="text-sm text-gray-900">{fundManager.firm_name || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{fundManager.email_address || 'Not specified'}</p>
                </div>
              </div>
              {fundManager.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-900">{fundManager.phone}</p>
                  </div>
                </div>
              )}
              {fundManager.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website</p>
                    <a 
                      href={fundManager.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {fundManager.website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investment Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black">Investment Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fundManager.geographic_focus && fundManager.geographic_focus.length > 0 && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Geographic Focus</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {fundManager.geographic_focus.map((region, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {fundManager.target_sectors && fundManager.target_sectors.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Target Sectors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {fundManager.target_sectors.map((sector, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {fundManager.fund_stage && (
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fund Stage</p>
                    <p className="text-sm text-gray-900">{fundManager.fund_stage}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default FundManagerDetail;