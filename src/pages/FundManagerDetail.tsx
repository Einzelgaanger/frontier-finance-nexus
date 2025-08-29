
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
  ArrowRight,
  User,
  MessageSquare,
  Clock,
  AlertTriangle,
  PieChart,
  CheckCircle,
  Phone,
  RefreshCw,
  Eye,
  BarChart3,
  Network,
  Leaf,
  Monitor,
  Factory,
  Truck,
  Store,
  GraduationCap,
  Wifi,
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Survey2021Responses from '@/components/network/Survey2021Responses';
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
  investment_instruments_data?: { name: string; committed: number; deployed: number; deployedValue: number; priority: number }[]; // New field for detailed data
  
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

interface Survey2021Data {
  id: string;
  user_id?: string;
  firm_name: string;
  participant_name: string;
  role_title: string;
  team_based: string[];
  team_based_other?: string;
  geographic_focus: string[];
  geographic_focus_other?: string;
  fund_stage: string;
  fund_stage_other?: string;
  legal_entity_date: string;
  first_close_date: string;
  first_investment_date: string;
  investments_march_2020: string;
  investments_december_2020: string;
  optional_supplement?: string;
  investment_vehicle_type: string[];
  investment_vehicle_type_other?: string;
  current_fund_size: string;
  target_fund_size: string;
  investment_timeframe: string;
  business_model_targeted: string[];
  business_model_targeted_other?: string;
  business_stage_targeted: string[];
  business_stage_targeted_other?: string;
  financing_needs: string[];
  financing_needs_other?: string;
  target_capital_sources: string[];
  target_capital_sources_other?: string;
  target_irr_achieved: string;
  target_irr_targeted: string;
  impact_vs_financial_orientation: string;
  explicit_lens_focus: string[];
  explicit_lens_focus_other?: string;
  report_sustainable_development_goals: boolean;
  top_sdg_1?: string;
  top_sdg_2?: string;
  top_sdg_3?: string;
  gender_considerations_investment: string[];
  gender_considerations_investment_other?: string;
  gender_considerations_requirement?: string[];
  gender_considerations_requirement_other?: string;
  gender_fund_vehicle?: string[];
  gender_fund_vehicle_other?: string;
  investment_size_your_amount: string;
  investment_size_total_raise: string;
  investment_forms: string[];
  investment_forms_other?: string;
  target_sectors: string[];
  target_sectors_other?: string;
  carried_interest_principals: string;
  current_ftes: string;
  created_at?: string;
}

// Professional section configuration
const sectionConfig = [
  {
    key: 'vehicle_info',
    title: 'Vehicle Information',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    fields: [
      { key: 'vehicle_name', label: 'Fund Name', icon: Building2 },
      { key: 'vehicle_websites', label: 'Vehicle Websites', type: 'array', isLink: true, icon: Globe },
      { key: 'vehicle_type', label: 'Vehicle Type', icon: Briefcase },
      { key: 'vehicle_type_other', label: 'Other Vehicle Type', icon: FileText },
      { key: 'thesis', label: 'Investment Thesis', type: 'text', icon: Target },
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
      { key: 'team_members', label: 'GP Partners', type: 'team', icon: Users },
      { key: 'team_size_min', label: 'Team Size (Min)', type: 'number', icon: User },
      { key: 'team_size_max', label: 'Team Size (Max)', type: 'number', icon: Users },
      { key: 'team_description', label: 'Team Description', type: 'text', icon: MessageSquare },
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
      { key: 'legal_domicile', label: 'Legal Domicile', type: 'array', icon: MapPin },
      { key: 'markets_operated', label: 'Markets Operated', type: 'markets', icon: Globe },
      { key: 'markets_operated_other', label: 'Other Markets', icon: MapPin },
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
      { key: 'ticket_size_min', label: 'Minimum Ticket Size (USD)', type: 'currency', icon: DollarSign },
      { key: 'ticket_size_max', label: 'Maximum Ticket Size (USD)', type: 'currency', icon: DollarSign },
      { key: 'ticket_description', label: 'Ticket Size Description', type: 'text', icon: FileText },
      { key: 'target_capital', label: 'Desired Capital (USD)', type: 'currency', icon: TrendingUp },
      { key: 'capital_raised', label: 'AUM/Committed Capital (USD)', type: 'currency', icon: DollarSign },
      { key: 'capital_in_market', label: 'Deployed Capital (USD)', type: 'currency', icon: TrendingUp },
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
      { key: 'supporting_document_url', label: 'Supporting Document', type: 'url', icon: FileText },
      { key: 'expectations', label: 'Expectations', type: 'text', icon: MessageSquare },
      { key: 'how_heard_about_network', label: 'How Heard About Network', icon: Globe },
      { key: 'how_heard_about_network_other', label: 'Other (How Heard)', icon: MessageSquare },
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
      { key: 'fund_stage', label: 'Fund Stage', type: 'array', icon: Award },
      { key: 'current_status', label: 'Current Status', icon: Clock },
      { key: 'current_status_other', label: 'Other Status', icon: AlertTriangle },
      { key: 'legal_entity_date_from', label: 'Legal Entity Date From', type: 'date', icon: Calendar },
      { key: 'legal_entity_date_to', label: 'Legal Entity Date To', type: 'date', icon: Calendar },
      { key: 'first_close_date_from', label: 'First Close Date From', type: 'date', icon: Calendar },
      { key: 'first_close_date_to', label: 'First Close Date To', type: 'date', icon: Calendar },
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
      { key: 'investment_instruments_priority', label: 'Investment Instruments Priority', type: 'instruments', icon: Zap },
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
      { key: 'sectors_allocation', label: 'Sectors Allocation', type: 'sectors', icon: PieChart },
      { key: 'target_return_min', label: 'Target Return Min (%)', type: 'number', icon: TrendingUp },
      { key: 'target_return_max', label: 'Target Return Max (%)', type: 'number', icon: TrendingUp },
      { key: 'equity_investments_made', label: 'Equity Investments Made', type: 'number', icon: DollarSign },
      { key: 'equity_investments_exited', label: 'Equity Investments Exited', type: 'number', icon: CheckCircle },
      { key: 'self_liquidating_made', label: 'Self Liquidating Made', type: 'number', icon: DollarSign },
      { key: 'self_liquidating_exited', label: 'Self Liquidating Exited', type: 'number', icon: CheckCircle },
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
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [survey2021, setSurvey2021] = useState<Survey2021Data | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedTexts, setExpandedTexts] = useState<Record<string, boolean>>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
      setLoading(true);
      
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

      // Set profile even if there's an error (might be null)
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
        investment_instruments_data: survey.investment_instruments_data,
        
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

      // Determine available years and include 2021 if present (admins/members only)
      let years: number[] = Array.from(new Set(typedSurveys.map(s => s.year)));
      if (userRole === 'admin' || userRole === 'member') {
        const { data: s2021, error: s2021Error } = await supabase
          .from('survey_responses_2021')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        if (!s2021Error && s2021 && s2021.length > 0) {
          setSurvey2021(s2021[0] as unknown as Survey2021Data);
          years = Array.from(new Set([...years, 2021]));
        } else {
          setSurvey2021(null);
        }
      } else {
        setSurvey2021(null);
      }

      years.sort((a, b) => b - a);
      setAvailableYears(years);

      // Initialize active selection: prefer most recent available
      if (years.length > 0) {
        const initialYear = years[0];
        setActiveYear(initialYear);
        if (initialYear !== 2021) {
          const match = typedSurveys.find(s => s.year === initialYear) || null;
          setActiveSurvey(match);
        } else {
          setActiveSurvey(null);
        }
      } else {
        setActiveYear(null);
        setActiveSurvey(typedSurveys[0] || null);
      }
      
      setLastUpdated(new Date());
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

  const formatSurveyDate = (dateValue: any, monthValue?: any) => {
    if (!dateValue) return null;
    
    // Handle different date formats from survey
    if (typeof dateValue === 'number') {
      // If we have both year and month values
      if (monthValue && typeof monthValue === 'number' && monthValue > 0 && monthValue <= 12) {
        const date = new Date(dateValue, monthValue - 1);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      }
      
      // If it's a number like 202401 (year + month)
      const year = Math.floor(dateValue / 100);
      const month = dateValue % 100;
      if (month > 0 && month <= 12) {
        return new Date(year, month - 1).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      }
      
      // If it's just a year
      if (dateValue >= 1900 && dateValue <= 2100) {
        return dateValue.toString();
      }
    }
    
    if (typeof dateValue === 'string') {
      // If it's a string date
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      }
    }
    
    return null;
  };

  // Helper function to get sector icons
  const getSectorIcon = (sector: string) => {
    const sectorLower = sector.toLowerCase();
    
    if (sectorLower.includes('agri') || sectorLower.includes('food') || sectorLower.includes('agriculture')) {
      return <Leaf className="w-4 h-4 text-green-600" />;
    }
    if (sectorLower.includes('software') || sectorLower.includes('saas') || sectorLower.includes('tech')) {
      return <Monitor className="w-4 h-4 text-blue-600" />;
    }
    if (sectorLower.includes('energy') || sectorLower.includes('renewable') || sectorLower.includes('clean')) {
      return <Zap className="w-4 h-4 text-yellow-600" />;
    }
    if (sectorLower.includes('manufacturing') || sectorLower.includes('industrial')) {
      return <Factory className="w-4 h-4 text-gray-600" />;
    }
    if (sectorLower.includes('health') || sectorLower.includes('medical')) {
      return <Heart className="w-4 h-4 text-red-600" />;
    }
    if (sectorLower.includes('education') || sectorLower.includes('learning')) {
      return <GraduationCap className="w-4 h-4 text-purple-600" />;
    }
    if (sectorLower.includes('telecom') || sectorLower.includes('data') || sectorLower.includes('infrastructure')) {
      return <Wifi className="w-4 h-4 text-cyan-600" />;
    }
    if (sectorLower.includes('fmcg') || sectorLower.includes('consumer')) {
      return <ShoppingBag className="w-4 h-4 text-orange-600" />;
    }
    if (sectorLower.includes('logistics') || sectorLower.includes('transport') || sectorLower.includes('distribution')) {
      return <Truck className="w-4 h-4 text-indigo-600" />;
    }
    if (sectorLower.includes('retail') || sectorLower.includes('merchandising')) {
      return <Store className="w-4 h-4 text-pink-600" />;
    }
    
    // Default icon
    return <Building2 className="w-4 h-4 text-gray-600" />;
  };

  const formatFieldValue = (value: any, fieldKey: string, fieldType?: string, isLink?: boolean, survey?: SurveyResponse): React.ReactNode => {
    // Special handling for date fields that need to combine year and month
    if (fieldType === 'date' && typeof value === 'number' && survey) {
      let monthValue = null;
      
      // Get corresponding month field
      if (fieldKey === 'legal_entity_date_from') {
        monthValue = survey.legal_entity_month_from;
      } else if (fieldKey === 'legal_entity_date_to') {
        monthValue = survey.legal_entity_month_to;
      } else if (fieldKey === 'first_close_date_from') {
        monthValue = survey.first_close_month_from;
      } else if (fieldKey === 'first_close_date_to') {
        monthValue = survey.first_close_month_to;
      }
      
      const formattedDate = formatSurveyDate(value, monthValue);
      if (formattedDate) {
        return <span className="text-gray-900">{formattedDate}</span>;
      }
    }
    
    // Handle empty values - only show "Not provided" for required fields or when explicitly needed
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      // Don't show "Not provided" for optional fields that are intentionally empty
      return null;
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
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            GP Partners and their contact details
          </div>
          <div className="space-y-3">
            {value.map((member: any, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {member.name || `GP Partner ${i + 1}`}
                    </div>
                    {member.role && (
                      <div className="text-sm text-gray-600">{member.role}</div>
                    )}
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="space-y-2 ml-11">
                  {member.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800 underline">
                        {member.email}
                      </a>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`tel:${member.phone}`} className="text-blue-600 hover:text-blue-800 underline">
                        {member.phone}
                      </a>
                    </div>
                  )}
                </div>
                
                {member.bio && (
                  <div className="text-sm text-gray-600 mt-3 ml-11">
                    {member.bio}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (fieldType === 'markets' && typeof value === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([market, percentage], index) => {
            // Ensure percentage is a number
            const percentageValue = typeof percentage === 'number' ? percentage : Number(percentage) || 0;
            
            // Create different gradient colors for each market
            const gradients = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-green-500 to-emerald-500',
              'from-orange-500 to-red-500',
              'from-indigo-500 to-purple-500',
              'from-teal-500 to-blue-500',
              'from-pink-500 to-rose-500',
              'from-yellow-500 to-orange-500',
              'from-violet-500 to-purple-500',
              'from-cyan-500 to-blue-500',
              'from-emerald-500 to-green-500',
              'from-rose-500 to-pink-500'
            ];
            const gradientClass = gradients[index % gradients.length];
            
            return (
              <div key={market} className="relative w-full h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                {/* Background gradient that fills based on percentage */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradientClass} transition-all duration-500 ease-out`}
                  style={{ width: `${percentageValue}%` }}
                />
                
                {/* Content overlay */}
                <div className="relative z-10 flex items-center justify-between h-full px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white drop-shadow-sm">
                      {market}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white drop-shadow-sm">
                      {percentageValue}%
                    </span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-xs font-bold text-white">
                        {Math.round(percentageValue)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Subtle border for definition */}
                <div className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none" />
              </div>
            );
          })}
        </div>
      );
    }
    
    if (fieldType === 'instruments' && typeof value === 'object') {
      // Check if we have detailed investment instruments data
      const instrumentsData = survey?.investment_instruments_data;
      
      if (instrumentsData && Array.isArray(instrumentsData) && instrumentsData.length > 0) {
        // Sort by committed value (highest first)
        const sortedInstruments = [...instrumentsData].sort((a, b) => b.committed - a.committed);
        
        return (
          <div className="space-y-4">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Committed</p>
                    <p className="text-2xl font-bold">
                      ${sortedInstruments.reduce((sum, inst) => sum + (inst.committed || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Deployed</p>
                    <p className="text-2xl font-bold">
                      ${sortedInstruments.reduce((sum, inst) => sum + (inst.deployedValue || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Avg Deployment</p>
                    <p className="text-2xl font-bold">
                      {Math.round(sortedInstruments.reduce((sum, inst) => sum + (inst.deployed || 0), 0) / sortedInstruments.length)}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>
            
            {/* Instruments Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instrument
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Committed
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deployed %
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deployed Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedInstruments.map((instrument, index) => {
                      const deploymentPercentage = instrument.deployed || 0;
                      const deployedValue = instrument.deployedValue || 0;
                      const committedValue = instrument.committed || 0;
                      
                      return (
                        <tr key={instrument.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{instrument.name}</p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              ${committedValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {((committedValue / sortedInstruments.reduce((sum, inst) => sum + (inst.committed || 0), 0)) * 100).toFixed(1)}% of total
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${deploymentPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                                {deploymentPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              ${deployedValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {deploymentPercentage > 0 ? `${((deployedValue / committedValue) * 100).toFixed(1)}%` : '0%'} of committed
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <Badge 
                                variant={instrument.priority <= 3 ? "default" : "secondary"}
                                className={instrument.priority <= 3 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                              >
                                #{instrument.priority}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Deployment Overview */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Deployment Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                                         <span className="text-gray-600">Fully Deployed (&gt;80%)</span>
                    <span className="font-medium text-green-600">
                      {sortedInstruments.filter(inst => (inst.deployed || 0) > 80).length} instruments
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Partially Deployed (20-80%)</span>
                    <span className="font-medium text-yellow-600">
                      {sortedInstruments.filter(inst => (inst.deployed || 0) >= 20 && (inst.deployed || 0) <= 80).length} instruments
                    </span>
                  </div>
                                     <div className="flex justify-between text-sm">
                     <span className="text-gray-600">Minimally Deployed (&lt;20%)</span>
                     <span className="font-medium text-red-600">
                       {sortedInstruments.filter(inst => (inst.deployed || 0) < 20).length} instruments
                     </span>
                   </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Dry Powder</span>
                    <span className="font-medium text-blue-600">
                      ${(sortedInstruments.reduce((sum, inst) => sum + (inst.committed || 0), 0) - 
                         sortedInstruments.reduce((sum, inst) => sum + (inst.deployedValue || 0), 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Deployment</span>
                    <span className="font-medium text-purple-600">
                      {Math.round(sortedInstruments.reduce((sum, inst) => sum + (inst.deployed || 0), 0) / sortedInstruments.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Instruments Used</span>
                    <span className="font-medium text-gray-900">
                      {sortedInstruments.length} types
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Fallback to old priority-only display
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([instrument, priority]) => (
            <div key={instrument} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">{instrument}</span>
              <span className="text-sm text-gray-600">Priority: {priority}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (fieldType === 'sectors' && typeof value === 'object') {
      // Sort sectors by percentage (highest to lowest)
      const sortedSectors = Object.entries(value)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .filter(([, percentage]) => percentage > 0);
      
      const totalAllocation = sortedSectors.reduce((sum, [, percentage]) => sum + (percentage as number), 0);
      const topSector = sortedSectors[0];
      const averageAllocation = sortedSectors.length > 0 ? totalAllocation / sortedSectors.length : 0;
      
      return (
        <div className="space-y-4">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Allocation</p>
                  <p className="text-2xl font-bold">
                    {totalAllocation.toFixed(1)}%
                  </p>
                </div>
                <PieChart className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Primary Focus</p>
                  <p className="text-lg font-bold truncate">
                    {topSector ? topSector[0] : 'None'}
                  </p>
                  <p className="text-sm opacity-90">
                    {topSector ? `${topSector[1]}%` : '0%'}
                  </p>
                </div>
                <Target className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Avg Allocation</p>
                  <p className="text-2xl font-bold">
                    {averageAllocation.toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
          
          {/* Sectors Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSectors.map(([sector, percentage], index) => {
                    const percentageValue = percentage as number;
                    const sectorIcon = getSectorIcon(sector);
                    
                    return (
                      <tr key={sector} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                              {sectorIcon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{sector}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentageValue}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                              {percentageValue.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {percentageValue.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {((percentageValue / totalAllocation) * 100).toFixed(1)}% of total
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <Badge 
                              variant={index < 3 ? "default" : "secondary"}
                              className={index < 3 ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}
                            >
                              #{index + 1}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sector Analysis */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sector Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">High Focus (&gt;20%)</span>
                  <span className="font-medium text-indigo-600">
                    {sortedSectors.filter(([, percentage]) => (percentage as number) > 20).length} sectors
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Medium Focus (10-20%)</span>
                  <span className="font-medium text-emerald-600">
                    {sortedSectors.filter(([, percentage]) => (percentage as number) >= 10 && (percentage as number) <= 20).length} sectors
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Low Focus (&lt;10%)</span>
                  <span className="font-medium text-yellow-600">
                    {sortedSectors.filter(([, percentage]) => (percentage as number) < 10).length} sectors
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sectors Covered</span>
                  <span className="font-medium text-gray-900">
                    {sortedSectors.length} sectors
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Allocation</span>
                  <span className="font-medium text-violet-600">
                    {averageAllocation.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Top 3 Concentration</span>
                  <span className="font-medium text-indigo-600">
                    {sortedSectors.slice(0, 3).reduce((sum, [, percentage]) => sum + (percentage as number), 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (fieldType === 'currency' && typeof value === 'number') {
      return <span>${value.toLocaleString()}</span>;
    }
    
    if (fieldType === 'number' && typeof value === 'number') {
      return <span>{value.toLocaleString()}</span>;
    }
    
    if (fieldType === 'url' && typeof value === 'string') {
      // Special handling for supporting documents
      if (fieldKey === 'supporting_document_url') {
        const fileName = value.split('/').pop() || 'Document';
        const truncatedUrl = value.length > 50 ? value.substring(0, 50) + '...' : value;
        
        return (
          <div className="space-y-3">
            {/* Truncated URL display */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
              <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {truncatedUrl}
                </p>
              </div>
            </div>
            
            {/* Download button in prominent position */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                onClick={() => {
                  try {
                    // Simple approach like in admin - just open the link
                    const url = value.startsWith('http') ? value : `https://${value}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  } catch (error) {
                    console.error('Failed to open document:', error);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Open Document
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => {
                  try {
                    const url = value.startsWith('http') ? value : `https://${value}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  } catch (error) {
                    console.error('Failed to open link:', error);
                  }
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Online
              </Button>
            </div>
          </div>
        );
      }
      
      // Regular URL handling for other fields
      const truncatedUrl = value.length > 60 ? value.substring(0, 60) + '...' : value;
      
      return (
        <div className="flex items-center space-x-2">
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-800 underline truncate flex-1"
            title={value}
          >
            {truncatedUrl}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 flex-shrink-0"
            onClick={() => {
              try {
                window.open(value.startsWith('http') ? value : `https://${value}`, '_blank', 'noopener,noreferrer');
              } catch (error) {
                console.error('Failed to open link:', error);
              }
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      );
    }
    
    if (fieldType === 'text' && typeof value === 'string') {
      const isExpanded = expandedTexts[fieldKey];
      const shouldTruncate = value.length > 200;
      
      return (
        <div>
          <div className={`text-gray-900 ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
            {value}
          </div>
          {shouldTruncate && (
            <button
              onClick={() => setExpandedTexts(prev => ({ ...prev, [fieldKey]: !isExpanded }))}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      );
    }
    
    return <span className="text-gray-900">{String(value)}</span>;
  };

  const renderSection = (section: typeof sectionConfig[0], survey: SurveyResponse) => (
    <section key={section.key} className="mb-8">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <CardTitle className={`text-lg ${section.color}`}>{section.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.fields.map(field => {
              const value = survey[field.key as keyof SurveyResponse];
              const hasValue = value !== null && value !== undefined && value !== '' && 
                !(Array.isArray(value) && value.length === 0);
              
              // Special handling for vehicle_type_other - only show if vehicle_type is not provided or is "Other"
              if (field.key === 'vehicle_type_other') {
                const vehicleType = survey.vehicle_type;
                const shouldShowOther = !vehicleType || vehicleType === 'Other' || vehicleType === 'other';
                if (!shouldShowOther) {
                  return null; // Don't render this field
                }
              }
              
              // Special handling for markets_operated_other - only show if someone actually input something
              if (field.key === 'markets_operated_other') {
                const otherMarkets = survey.markets_operated_other;
                const hasOtherMarkets = otherMarkets && otherMarkets.trim() !== '';
                if (!hasOtherMarkets) {
                  return null; // Don't render this field
                }
              }
              
              // Special handling for current_status_other - only show if current_status is "Other"
              if (field.key === 'current_status_other') {
                const currentStatus = survey.current_status;
                const shouldShowOther = currentStatus === 'Other' || currentStatus === 'other';
                if (!shouldShowOther) {
                  return null; // Don't render this field
                }
              }
              
              const formattedValue = formatFieldValue(value, field.key, field.type, field.isLink, survey);
              
              // Don't render fields that return null (empty optional fields)
              if (formattedValue === null) {
                return null;
              }
              
              return (
                <div key={field.key} className={`p-4 rounded-lg border ${hasValue ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                  <dt className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <field.icon className="w-4 h-4 mr-2 text-gray-500" />
                    {field.label}
                    {!hasValue && <span className="ml-2 text-xs text-gray-400">(Not provided)</span>}
                  </dt>
                  <dd className="text-base text-gray-900">
                    {formattedValue}
                  </dd>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );

  if (userRole !== 'viewer' && userRole !== 'member' && userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Fund Manager Profile</h1>
                <p className="text-gray-600 text-sm">Professional fund manager details and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-600"
                onClick={fetchFundManagerData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Profile Card */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {profile?.profile_picture_url ? (
                  <Avatar className="w-16 h-16 border-2 border-gray-200 shadow-sm">
                    <AvatarImage src={profile.profile_picture_url} alt={profile.first_name} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="w-16 h-16 border-2 border-gray-200 shadow-sm bg-blue-600">
                    <AvatarFallback className="text-white text-lg font-semibold">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 break-words">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  
                  {/* Clear header information in order: Vehicle Name, Email, Website */}
                  <div className="space-y-3">
                    {/* Vehicle Name - Most prominent */}
                    {activeSurvey?.vehicle_name && (
                      <div className="flex items-center text-gray-900">
                        <Building2 className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                        <span className="text-lg font-medium break-words">{activeSurvey.vehicle_name}</span>
                      </div>
                    )}
                    
                    {/* Email */}
                    {profile?.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-3 flex-shrink-0 text-gray-600" />
                        <span className="text-base break-all">{profile.email}</span>
                      </div>
                    )}
                    
                    {/* Website */}
                    {activeSurvey?.vehicle_websites && activeSurvey.vehicle_websites.length > 0 && (
                      <div className="flex items-center text-gray-700">
                        <Globe className="w-4 h-4 mr-3 flex-shrink-0 text-gray-600" />
                        <div className="flex flex-wrap gap-2">
                          {activeSurvey.vehicle_websites.map((website, index) => (
                            <a
                              key={index}
                              href={website.startsWith('http') ? website : `https://${website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-base break-all underline font-medium"
                            >
                              {website}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Role Badge */}
                    {activeSurvey?.role_badge && (
                      <div className="flex items-center mt-3">
                        <Badge className={`capitalize text-xs px-3 py-1 font-semibold rounded-full ${
                          activeSurvey.role_badge === 'viewer' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {activeSurvey.role_badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {availableYears.length > 0 && (
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Survey Year:</span>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={activeYear || ''}
                    onChange={e => {
                      const yr = Number(e.target.value);
                      setActiveYear(yr);
                      if (yr === 2021) {
                        setActiveSurvey(null);
                      } else {
                        const selected = surveys.find(s => s.year === yr) || null;
                        setActiveSurvey(selected);
                      }
                    }}
                    aria-label="Select survey year"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading fund manager details...</h3>
                <p className="text-gray-500">Please wait while we fetch the information.</p>
              </div>
            </CardContent>
          </Card>
        ) : (activeYear === 2021 && (userRole === 'admin' || userRole === 'member')) ? (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12">
              {survey2021 ? (
                <Survey2021Responses data={survey2021} role={userRole} />
              ) : (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No 2021 survey data found</h3>
                  <p className="text-gray-500">This fund manager hasn't completed the 2021 survey.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : !activeSurvey ? (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No survey data found</h3>
                <p className="text-gray-500">This fund manager hasn't completed any surveys yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Professional Section Navigation */}
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        Section {currentSection + 1} of {totalSections}
                      </span>
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
              </CardContent>
            </Card>

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
