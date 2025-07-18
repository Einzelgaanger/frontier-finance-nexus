
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
  Download,
  Star,
  Award,
  Zap,
  Rocket,
  Shield,
  Heart,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurveyResponse {
  id: string;
  user_id: string;
  year: number;
  completed_at: string;
  
  // Section 1: Vehicle Information
  vehicle_name: string;
  vehicle_websites?: string[];
  vehicle_type?: string;
  vehicle_type_other?: string;
  thesis?: string;
  
  // Section 2: Team & Leadership
  team_members?: any[]; // JSONB array
  team_size_min?: number;
  team_size_max?: number;
  team_description?: string;
  
  // Section 3: Geographic & Market Focus
  legal_domicile?: string[];
  markets_operated?: Record<string, number>; // JSONB object
  markets_operated_other?: string;
  
  // Section 4: Investment Strategy
  ticket_size_min?: number;
  ticket_size_max?: number;
  ticket_description?: string;
  target_capital?: number;
  capital_raised?: number;
  capital_in_market?: number;
  
  // Section 5: Fund Operations
  supporting_document_url?: string;
  information_sharing?: string;
  expectations?: string;
  how_heard_about_network?: string;
  
  // Section 6: Fund Status & Timeline
  fund_stage?: string[];
  current_status?: string;
  current_status_other?: string;
  legal_entity_date_from?: number;
  legal_entity_date_to?: number;
  legal_entity_month_from?: number;
  legal_entity_month_to?: number;
  first_close_date_from?: number;
  first_close_date_to?: number;
  first_close_month_from?: number;
  first_close_month_to?: number;
  
  // Section 7: Investment Instruments
  investment_instruments_priority?: Record<string, number>; // JSONB object
  
  // Section 8: Sector Focus & Returns
  sectors_allocation?: Record<string, number>; // JSONB object
  target_return_min?: number;
  target_return_max?: number;
  equity_investments_made?: number;
  equity_investments_exited?: number;
  self_liquidating_made?: number;
  self_liquidating_exited?: number;
  
  // Legacy fields (for backward compatibility)
  location?: string;
  team_size_description?: string;
  portfolio_count?: number;
  capital_raised_description?: string;
  ticket_size?: string;
  vehicle_website?: string;
  
  // Role badge
  role_badge?: string;
}

interface FundManagerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string;
}

// 1. Remove gradients/colors/icons that look unprofessional
// 2. Use a formal color palette and icon set
// 3. Organize and render all survey data in clear, ordered sections, matching the survey/application popup
// 4. Properly format all data types
// 5. Add year selection if not present
// 6. Use 'Not provided' for missing data
// 7. Remove all gradients and childish UI elements

// ---
// Replace sectionConfig with a formal, professional config (no gradients, formal icons/colors)
const sectionConfig = [
  {
    key: 'vehicle_info',
    title: 'Vehicle Information',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    fields: [
      { key: 'vehicle_name', label: 'Fund Name' },
      { key: 'vehicle_websites', label: 'Vehicle Websites', type: 'array', isLink: true },
      { key: 'vehicle_type', label: 'Vehicle Type' },
      { key: 'vehicle_type_other', label: 'Other Vehicle Type' },
      { key: 'thesis', label: 'Investment Thesis', type: 'text' },
    ],
  },
  {
    key: 'team',
    title: 'Team & Leadership',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    fields: [
      { key: 'team_members', label: 'Team Members', type: 'team' },
      { key: 'team_size_min', label: 'Team Size (Min)', type: 'number' },
      { key: 'team_size_max', label: 'Team Size (Max)', type: 'number' },
      { key: 'team_description', label: 'Team Description', type: 'text' },
    ],
  },
  {
    key: 'geography',
    title: 'Geographic & Market Focus',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    fields: [
      { key: 'legal_domicile', label: 'Legal Domicile', type: 'array' },
      { key: 'markets_operated', label: 'Markets Operated', type: 'markets' },
      { key: 'markets_operated_other', label: 'Other Markets' },
    ],
  },
  {
    key: 'investment_strategy',
    title: 'Investment Strategy',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    fields: [
      { key: 'ticket_size_min', label: 'Minimum Ticket Size (USD)', type: 'currency' },
      { key: 'ticket_size_max', label: 'Maximum Ticket Size (USD)', type: 'currency' },
      { key: 'ticket_description', label: 'Ticket Size Description', type: 'text' },
      { key: 'target_capital', label: 'Desired Capital (USD)', type: 'currency' },
      { key: 'capital_raised', label: 'AUM/Committed Capital (USD)', type: 'currency' },
      { key: 'capital_in_market', label: 'Deployed Capital (USD)', type: 'currency' },
    ],
  },
  {
    key: 'fund_operations',
    title: 'Fund Operations',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    fields: [
      { key: 'supporting_document_url', label: 'Supporting Document', type: 'url' },
      { key: 'expectations', label: 'Expectations', type: 'text' },
      { key: 'how_heard_about_network', label: 'How Heard About Network' },
      { key: 'how_heard_about_network_other', label: 'Other (How Heard)' },
    ],
  },
  {
    key: 'fund_status',
    title: 'Fund Status & Timeline',
    icon: Calendar,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    fields: [
      { key: 'fund_stage', label: 'Fund Stage', type: 'array' },
      { key: 'current_status', label: 'Current Status' },
      { key: 'current_status_other', label: 'Other Status' },
      { key: 'legal_entity_date_from', label: 'Legal Entity Date From', type: 'date' },
      { key: 'legal_entity_date_to', label: 'Legal Entity Date To', type: 'date' },
      { key: 'first_close_date_from', label: 'First Close Date From', type: 'date' },
      { key: 'first_close_date_to', label: 'First Close Date To', type: 'date' },
    ],
  },
  {
    key: 'investment_instruments',
    title: 'Investment Instruments',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    fields: [
      { key: 'investment_instruments_priority', label: 'Investment Instruments Priority', type: 'instruments' },
    ],
  },
  {
    key: 'sector_returns',
    title: 'Sector Focus & Returns',
    icon: TrendingUp,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    fields: [
      { key: 'sectors_allocation', label: 'Sectors Allocation', type: 'sectors' },
      { key: 'target_return_min', label: 'Target Return Min (%)', type: 'number' },
      { key: 'target_return_max', label: 'Target Return Max (%)', type: 'number' },
      { key: 'equity_investments_made', label: 'Equity Investments Made', type: 'number' },
      { key: 'equity_investments_exited', label: 'Equity Investments Exited', type: 'number' },
      { key: 'self_liquidating_made', label: 'Self Liquidating Made', type: 'number' },
      { key: 'self_liquidating_exited', label: 'Self Liquidating Exited', type: 'number' },
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
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedTexts, setExpandedTexts] = useState<Record<string, boolean>>({});

  // Determine which sections to show based on user role
  const getVisibleSections = () => {
    if (userRole === 'admin') {
      return sectionConfig;
    } else if (userRole === 'member') {
      return sectionConfig.slice(0, 4); // Only first 4 sections for members
    } else {
      return sectionConfig.slice(0, 4); // Only first 4 sections for viewers
    }
  };

  const visibleSections = getVisibleSections();
  const totalSections = visibleSections.length;

  useEffect(() => {
    if (userId && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [userId, userRole]);

  const fetchFundManagerData = async () => {
    try {
      console.log('Fetching data for userId:', userId);
      
      // Fetch profile with better error handling
      let profileData = null;
      let profileError = null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        profileData = data;
        profileError = error;
      } catch (err) {
        console.error('Profile fetch error:', err);
        profileError = err;
      }

      console.log('Profile data:', profileData, 'Profile error:', profileError);

      // Set profile even if there's an error (might be null)
      setProfile(profileData);

      // Fetch surveys
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('year', { ascending: false });

      console.log('Survey data:', surveyData, 'Survey error:', surveyError);

      if (surveyError) throw surveyError;

      // Type assertion to match our interface
      const typedSurveys = (surveyData || []).map(survey => ({
        id: survey.id,
        user_id: survey.user_id,
        year: survey.year,
        completed_at: survey.completed_at,
        
        // Section 1: Vehicle Information
        vehicle_name: survey.vehicle_name,
        vehicle_websites: survey.vehicle_websites,
        vehicle_type: survey.vehicle_type,
        vehicle_type_other: survey.vehicle_type_other,
        thesis: survey.thesis,
        
        // Section 2: Team & Leadership
        team_members: survey.team_members,
        team_size_min: survey.team_size_min,
        team_size_max: survey.team_size_max,
        team_description: survey.team_description,
        
        // Section 3: Geographic & Market Focus
        legal_domicile: survey.legal_domicile,
        markets_operated: survey.markets_operated,
        markets_operated_other: survey.markets_operated_other,
        
        // Section 4: Investment Strategy
        ticket_size_min: survey.ticket_size_min,
        ticket_size_max: survey.ticket_size_max,
        ticket_description: survey.ticket_description,
        target_capital: survey.target_capital,
        capital_raised: survey.capital_raised,
        capital_in_market: survey.capital_in_market,
        
        // Section 5: Fund Operations
        supporting_document_url: survey.supporting_document_url,
        information_sharing: survey.information_sharing,
        expectations: survey.expectations,
        how_heard_about_network: survey.how_heard_about_network,
        
        // Section 6: Fund Status & Timeline
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
        
        // Section 7: Investment Instruments
        investment_instruments_priority: survey.investment_instruments_priority,
        
        // Section 8: Sector Focus & Returns
        sectors_allocation: survey.sectors_allocation,
        target_return_min: survey.target_return_min,
        target_return_max: survey.target_return_max,
        equity_investments_made: survey.equity_investments_made,
        equity_investments_exited: survey.equity_investments_exited,
        self_liquidating_made: survey.self_liquidating_made,
        self_liquidating_exited: survey.self_liquidating_exited,
        
        // Legacy fields
        location: survey.location,
        team_size_description: survey.team_size_description,
        portfolio_count: survey.portfolio_count,
        capital_raised_description: survey.capital_raised_description,
        ticket_size: survey.ticket_size,
        vehicle_website: survey.vehicle_website,
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

  const handleNextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const formatDate = (year: number, month?: number) => {
    if (!year) return 'Not provided';
    if (month) {
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return year.toString();
  };

  const formatFieldValue = (value: any, fieldKey: string, fieldType?: string, isLink?: boolean): React.ReactNode => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-gray-400 italic">Not provided</span>;
    }
    
    if (fieldType === 'array' && Array.isArray(value)) {
      if (isLink) {
        return (
          <ul className="list-disc ml-4">
            {value.map((url: string, i: number) => (
              <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{url}</a></li>
            ))}
          </ul>
        );
      }
      return <span>{value.join(', ')}</span>;
    }
    
    if (fieldType === 'team' && Array.isArray(value)) {
      return (
        <ul className="list-disc ml-4">
          {value.map((member: any, i: number) => (
            <li key={i}>
              <span className="font-medium">{member.name}</span>
              {member.role && <> ({member.role})</>}
              {member.email && <>, <a href={`mailto:${member.email}`} className="text-blue-700 underline">{member.email}</a></>}
              {member.phone && <>, {member.phone}</>}
              {member.experience && <><br /><span className="text-gray-500">{member.experience}</span></>}
            </li>
          ))}
        </ul>
      );
    }
    
    if (fieldType === 'markets' && value && typeof value === 'object') {
      // Sort by percentage in descending order
      const sortedEntries = Object.entries(value).sort((a, b) => (b[1] as number) - (a[1] as number));
      return (
        <ul className="list-disc ml-4">
          {sortedEntries.map(([country, percent]: [string, any], i) => (
            <li key={i}>{country}: <span className="font-medium">{percent}%</span></li>
          ))}
        </ul>
      );
    }
    
    if (fieldType === 'instruments' && value && typeof value === 'object') {
      // Sort by priority in descending order
      const sortedEntries = Object.entries(value).sort((a, b) => (b[1] as number) - (a[1] as number));
      return (
        <ol className="list-decimal ml-4">
          {sortedEntries.map(([instrument, priority], i) => (
            <li key={i}>{instrument} <span className="text-gray-500">(Priority: {priority})</span></li>
          ))}
        </ol>
      );
    }
    
    if (fieldType === 'sectors' && value && typeof value === 'object') {
      // Sort by percentage in descending order
      const sortedEntries = Object.entries(value).sort((a, b) => (b[1] as number) - (a[1] as number));
      return (
        <ul className="list-disc ml-4">
          {sortedEntries.map(([sector, percent]: [string, any], i) => (
            <li key={i}>{sector}: <span className="font-medium">{percent}%</span></li>
          ))}
        </ul>
      );
    }
    
    if (fieldType === 'url' && typeof value === 'string') {
      // Handle base64 document format
      try {
        const doc = JSON.parse(value);
        if (doc.fileName && doc.data) {
          return (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {doc.fileName}
              </span>
              <span className="text-xs text-gray-500">
                ({Math.round(doc.fileSize / 1024)}KB)
              </span>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = doc.data;
                  link.download = doc.fileName;
                  link.click();
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Download
              </button>
            </div>
          );
        }
      } catch (e) {
        // Fallback to regular URL
        return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{value}</a>;
      }
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{value}</a>;
    }
    
    if (fieldType === 'currency' && typeof value === 'number') {
      return <span>${value.toLocaleString()}</span>;
    }
    
    if (fieldType === 'number' && typeof value === 'number') {
      return <span>{value}</span>;
    }
    
    if (fieldType === 'date' && typeof value === 'number') {
      const year = Math.floor(value / 10000);
      const month = Math.floor((value % 10000) / 100);
      return formatDate(year, month);
    }
    
    if (fieldType === 'text' && typeof value === 'string') {
      const isExpanded = expandedTexts[fieldKey] || false;
      const textToShow = isExpanded ? value : value.substring(0, 200); // Show first 200 characters
      const showMoreButton = value.length > 200;

      return (
        <div>
          <span className="text-gray-600 line-clamp-4">{textToShow}</span>
          {showMoreButton && (
            <button 
              onClick={() => setExpandedTexts(prev => ({ ...prev, [fieldKey]: !isExpanded }))}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      );
    }
    
    if (typeof value === 'string') {
      return <span>{value}</span>;
    }
    
    return <span className="text-gray-400 italic">Not provided</span>;
  };

  const renderSection = (section: typeof sectionConfig[0], survey: SurveyResponse) => (
    <section key={section.key} className="mb-8">
      <div className={`rounded-lg border ${section.borderColor} ${section.bgColor} p-6 shadow-sm`}>
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg ${section.bgColor} ${section.borderColor} border`}>
            {section.icon && <section.icon className={`w-6 h-6 ${section.color}`} />}
          </div>
          <h2 className={`text-xl font-bold ${section.color} ml-3`}>{section.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {section.fields.map(field => {
            const value = survey[field.key as keyof SurveyResponse];
            const hasValue = value !== null && value !== undefined && value !== '' && 
              !(Array.isArray(value) && value.length === 0);
            
            return (
              <div key={field.key} className={`p-4 rounded-lg border ${hasValue ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                <dt className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  {field.label}
                  {!hasValue && <span className="ml-2 text-xs text-gray-400">(Not provided)</span>}
                </dt>
                <dd className="text-base text-gray-900">
                  {formatFieldValue(value, field.key, field.type, field.isLink)}
                </dd>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  if (userRole !== 'viewer' && userRole !== 'member' && userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {profile?.profile_picture_url ? (
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.profile_picture_url} alt={profile.first_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <AvatarFallback className="text-white text-xl font-bold">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profile?.email}</span>
                  </div>
                  {activeSurvey?.role_badge && (
                    <Badge className={`capitalize text-xs px-3 py-1 font-semibold rounded-full ${
                      activeSurvey.role_badge === 'viewer' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {activeSurvey.role_badge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {surveys.length > 1 && (
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Survey Year:</span>
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={activeSurvey?.year || ''}
                  onChange={e => {
                    const selected = surveys.find(s => s.year === Number(e.target.value));
                    if (selected) setActiveSurvey(selected);
                  }}
                  aria-label="Select survey year"
                >
                  {surveys.map(s => (
                    <option key={s.id} value={s.year}>{s.year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading fund manager details...</h3>
              <p className="text-gray-500">Please wait while we fetch the information.</p>
            </div>
          </div>
        ) : !activeSurvey ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No survey data found</h3>
              <p className="text-gray-500">This fund manager hasn't completed any surveys yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Section Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Section {currentSection + 1} of {totalSections}
                    </span>
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {visibleSections[currentSection]?.title}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousSection}
                    disabled={currentSection === 0}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextSection}
                    disabled={currentSection === totalSections - 1}
                    className="flex items-center space-x-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Section Indicators */}
              <div className="flex space-x-2">
                {visibleSections.map((section, index) => (
                  <button
                    key={section.key}
                    onClick={() => setCurrentSection(index)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === currentSection
                        ? `${section.bgColor} ${section.borderColor} border text-gray-900`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Section */}
            <div className="transition-all duration-300 ease-in-out">
              {renderSection(visibleSections[currentSection], activeSurvey)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundManagerDetail;
