
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
  Briefcase,
  FileText,
  Download
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
  // Add all the new survey fields
  vehicle_type?: string;
  vehicle_type_other?: string;
  team_members?: string;
  team_size_min?: number;
  team_size_max?: number;
  team_description?: string;
  legal_domicile?: string;
  legal_domicile_other?: string;
  markets_operated?: string;
  markets_operated_other?: string;
  ticket_size_min?: number;
  ticket_size_max?: number;
  ticket_description?: string;
  target_capital?: number;
  capital_raised?: number;
  capital_in_market?: number;
  supporting_document_url?: string;
  information_sharing?: string;
  fund_stage?: string;
  current_status?: string;
  current_status_other?: string;
  legal_entity_date_from?: string;
  legal_entity_date_to?: string;
  legal_entity_month_from?: string;
  legal_entity_month_to?: string;
  first_close_date_from?: string;
  first_close_date_to?: string;
  first_close_month_from?: string;
  first_close_month_to?: string;
  investment_instruments_priority?: string;
  sectors_allocation?: string;
  target_return_min?: number;
  target_return_max?: number;
  equity_investments_made?: number;
  equity_investments_exited?: number;
  self_liquidating_made?: number;
  self_liquidating_exited?: number;
}

interface FundManagerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string;
}

const sectionConfig = [
  {
    key: 'vehicle_info',
    title: 'Vehicle Information',
    icon: Building2,
    fields: [
      { key: 'vehicle_name', label: 'Fund Name' },
      { key: 'vehicle_website', label: 'Vehicle Website' },
      { key: 'vehicle_type', label: 'Vehicle Type' },
      { key: 'vehicle_type_other', label: 'Other Vehicle Type' },
      { key: 'thesis', label: 'Investment Thesis' },
    ],
  },
  {
    key: 'team',
    title: 'Team & Leadership',
    icon: Users,
    fields: [
      { key: 'team_members', label: 'Team Members' },
      { key: 'team_size_min', label: 'Team Size (Min)' },
      { key: 'team_size_max', label: 'Team Size (Max)' },
      { key: 'team_description', label: 'Team Description' },
    ],
  },
  {
    key: 'geography',
    title: 'Geographic & Market Focus',
    icon: Globe,
    fields: [
      { key: 'legal_domicile', label: 'Legal Domicile' },
      { key: 'legal_domicile_other', label: 'Other Domicile' },
      { key: 'markets_operated', label: 'Markets Operated' },
      { key: 'markets_operated_other', label: 'Other Markets' },
    ],
  },
  {
    key: 'investment_strategy',
    title: 'Investment Strategy',
    icon: Target,
    fields: [
      { key: 'ticket_size_min', label: 'Minimum Ticket Size (USD)' },
      { key: 'ticket_size_max', label: 'Maximum Ticket Size (USD)' },
      { key: 'ticket_description', label: 'Ticket Size Description' },
      { key: 'target_capital', label: 'Target Capital (USD)' },
      { key: 'capital_raised', label: 'Capital Raised (USD)' },
      { key: 'capital_in_market', label: 'Capital in Market (USD)' },
    ],
  },
  {
    key: 'fund_operations',
    title: 'Fund Operations',
    icon: Briefcase,
    fields: [
      { key: 'supporting_document_url', label: 'Supporting Document' },
      { key: 'information_sharing', label: 'Information Sharing Preference' },
      { key: 'expectations', label: 'Expectations' },
      { key: 'how_heard_about_network', label: 'How Heard About Network' },
    ],
  },
  {
    key: 'fund_status',
    title: 'Fund Status & Timeline',
    icon: Calendar,
    fields: [
      { key: 'fund_stage', label: 'Fund Stage' },
      { key: 'current_status', label: 'Current Status' },
      { key: 'current_status_other', label: 'Other Status' },
      { key: 'legal_entity_date_from', label: 'Legal Entity Date From' },
      { key: 'legal_entity_date_to', label: 'Legal Entity Date To' },
      { key: 'legal_entity_month_from', label: 'Legal Entity Month From' },
      { key: 'legal_entity_month_to', label: 'Legal Entity Month To' },
      { key: 'first_close_date_from', label: 'First Close Date From' },
      { key: 'first_close_date_to', label: 'First Close Date To' },
      { key: 'first_close_month_from', label: 'First Close Month From' },
      { key: 'first_close_month_to', label: 'First Close Month To' },
    ],
  },
  {
    key: 'investment_instruments',
    title: 'Investment Instruments',
    icon: DollarSign,
    fields: [
      { key: 'investment_instruments_priority', label: 'Investment Instruments (Priority Order)' },
    ],
  },
  {
    key: 'sector_returns',
    title: 'Sector Focus & Returns',
    icon: TrendingUp,
    fields: [
      { key: 'sectors_allocation', label: 'Sectors Allocation' },
      { key: 'target_return_min', label: 'Target Return Min (%)' },
      { key: 'target_return_max', label: 'Target Return Max (%)' },
      { key: 'equity_investments_made', label: 'Equity Investments Made' },
      { key: 'equity_investments_exited', label: 'Equity Investments Exited' },
      { key: 'self_liquidating_made', label: 'Self-Liquidating Made' },
      { key: 'self_liquidating_exited', label: 'Self-Liquidating Exited' },
    ],
  },
];

const FundManagerDetail = () => {
  const { userId } = useParams();
  const { userRole, user } = useAuth();
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
        how_heard_about_network: survey.how_heard_about_network,
        // Add all the new survey fields
        vehicle_type: survey.vehicle_type,
        vehicle_type_other: survey.vehicle_type_other,
        team_members: survey.team_members,
        team_size_min: survey.team_size_min,
        team_size_max: survey.team_size_max,
        team_description: survey.team_description,
        legal_domicile: survey.legal_domicile,
        legal_domicile_other: survey.legal_domicile_other,
        markets_operated: survey.markets_operated,
        markets_operated_other: survey.markets_operated_other,
        ticket_size_min: survey.ticket_size_min,
        ticket_size_max: survey.ticket_size_max,
        ticket_description: survey.ticket_description,
        target_capital: survey.target_capital,
        capital_raised: survey.capital_raised,
        capital_in_market: survey.capital_in_market,
        supporting_document_url: survey.supporting_document_url,
        information_sharing: survey.information_sharing,
        fund_stage: survey.fund_stage,
        current_status: survey.current_status,
        current_status_other: survey.current_status_other,
        legal_entity_date_from: survey.legal_entity_date_from,
        legal_entity_date_to: survey.legal_entity_date_to,
        legal_entity_month_from: survey.legal_entity_month_from,
        legal_entity_month_to: survey.legal_entity_month_to,
        first_close_date_from: survey.first_close_date_from,
        first_close_date_to: survey.first_close_date_to,
        first_close_month_from: survey.first_close_month_from,
        first_close_month_to: survey.first_close_month_to,
        investment_instruments_priority: survey.investment_instruments_priority,
        sectors_allocation: survey.sectors_allocation,
        target_return_min: survey.target_return_min,
        target_return_max: survey.target_return_max,
        equity_investments_made: survey.equity_investments_made,
        equity_investments_exited: survey.equity_investments_exited,
        self_liquidating_made: survey.self_liquidating_made,
        self_liquidating_exited: survey.self_liquidating_exited,
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

  const formatFieldValue = (value: any, fieldKey: string): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    
    if (fieldKey.includes('_url') && value) {
      return 'Document uploaded';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return String(value);
  };

  const renderField = (field: { key: string; label: string }, survey: SurveyResponse) => {
    const value = (survey as any)[field.key];
    const formattedValue = formatFieldValue(value, field.key);
    
    return (
      <div key={field.key} className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-b-0">
        <div className="flex-1">
          <dt className="text-sm font-medium text-gray-700 mb-1">{field.label}</dt>
          <dd className="text-sm text-gray-900">
            {field.key.includes('_url') && value ? (
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>View Document</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              formattedValue
            )}
          </dd>
        </div>
      </div>
    );
  };

  const renderSection = (section: typeof sectionConfig[0], survey: SurveyResponse) => {
    const IconComponent = section.icon;
    
    return (
      <Card key={section.key} className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-blue-600" />
            <span>{section.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            {section.fields.map(field => renderField(field, survey))}
          </dl>
        </CardContent>
      </Card>
    );
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

  if (!profile && surveys.length === 0) {
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

  if (surveys.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Fund Manager Not Found</CardTitle>
              <CardDescription>
                This fund manager has not completed any surveys.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;
  const memberSections = sectionConfig.slice(0, 4); // First 4 sections for members

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.profile_picture_url} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {profile?.first_name?.[0]?.toUpperCase() || 'U'}
                  {profile?.last_name?.[0]?.toUpperCase() || ''}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Fund Manager'}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {activeSurvey?.vehicle_name}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile?.email || 'Unknown'}</span>
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
                {!profile && (
                  <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                    Profile information is not available, but survey data is shown below.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add a year selector if multiple surveys exist */}
        {surveys.length > 1 && (
          <div className="mb-6 flex items-center gap-2">
            <label htmlFor="survey-year" className="text-sm font-medium text-gray-700">Select Year:</label>
            <select
              id="survey-year"
              className="border rounded px-2 py-1 text-base"
              value={activeSurvey?.year || ''}
              onChange={e => {
                const year = Number(e.target.value);
                const found = surveys.find(s => s.year === year);
                if (found) setActiveSurvey(found);
              }}
            >
              {surveys.map(s => (
                <option key={s.id} value={s.year}>{s.year}</option>
              ))}
            </select>
          </div>
        )}

        {/* Survey Data */}
        {activeSurvey && (
          <>
            {userRole === 'admin' ? (
              // Admin view: All 8 sections in tabs
              <Tabs defaultValue="vehicle_info" className="mb-8">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                  {sectionConfig.map(section => (
                    <TabsTrigger key={section.key} value={section.key} className="text-xs">
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {sectionConfig.map(section => (
                  <TabsContent key={section.key} value={section.key} className="mt-6">
                    {renderSection(section, activeSurvey)}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              // Member/Viewer view: First 4 sections as full sections (no tabs)
              <div className="space-y-6">
                {memberSections.map(section => renderSection(section, activeSurvey))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FundManagerDetail;
