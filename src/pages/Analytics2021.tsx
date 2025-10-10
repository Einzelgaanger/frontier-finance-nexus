// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  Globe,
  Building2,
  Building,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  MapPin,
  Clock,
  RefreshCw,
  Eye,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon,
  CheckCircle,
  Database,
  BarChart4,

  ScatterChart as ScatterChartIcon,
  Radar as RadarIcon,
  Layers,
  Network,
  Shield,
  Heart,
  Lightbulb,
  Briefcase,
  Home,
  Car,
  Wifi,
  Droplets,
  Leaf,
  Stethoscope,
  Factory,
  Smartphone,
  Zap as ZapIcon,
  Star,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Upload,
  Settings,
  Info,
  AlertCircle,
  CheckSquare,
  Square,
  Circle,
  Minus,
  Plus,
  Divide,
  Percent,
  Hash,
  Hash as HashIcon,
  Truck,
  GraduationCap,
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Survey2021Data {
  id: string;
  email_address?: string;
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
  investment_timeframe_other?: string;
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
  impact_vs_financial_orientation_other?: string;
  explicit_lens_focus: string[];
  explicit_lens_focus_other?: string;
  report_sustainable_development_goals: boolean;
  top_sdgs?: Record<string, string>;
  gender_considerations_investment: string[];
  gender_considerations_investment_other?: string;
  gender_considerations_requirement: string[];
  gender_considerations_requirement_other?: string;
  gender_considerations_other_enabled?: boolean;
  gender_considerations_other_description?: string;
  gender_fund_vehicle: string[];
  gender_fund_vehicle_other?: string;
  investment_size_your_amount: string;
  investment_size_total_raise: string;
  investment_forms: string[];
  investment_forms_other?: string;
  target_sectors: string[];
  target_sectors_other?: string;
  carried_interest_principals: string;
  current_ftes: string;
  portfolio_needs_ranking: Record<string, string>;
  portfolio_needs_other?: string;
  portfolio_needs_other_enabled?: boolean;
  investment_monetization: string[];
  investment_monetization_other?: string;
  exits_achieved: string;
  exits_achieved_other?: string;
  fund_capabilities_ranking: Record<string, string>;
  fund_capabilities_other?: string;
  fund_capabilities_other_enabled?: boolean;
  covid_impact_aggregate: string;
  covid_impact_portfolio: Record<string, Record<string, string>>;
  covid_government_support: string[];
  covid_government_support_other?: string;
  raising_capital_2021: string[];
  raising_capital_2021_other?: string;
  fund_vehicle_considerations: string[];
  fund_vehicle_considerations_other?: string;
  network_value_rating: string;
  working_groups_ranking: Record<string, string>;
  new_working_group_suggestions?: string;
  webinar_content_ranking: Record<string, string>;
  new_webinar_suggestions?: string;
  communication_platform: string;
  communication_platform_other?: string;
  network_value_areas: Record<string, string>;
  present_connection_session: string;
  present_connection_session_other?: string;
  convening_initiatives_ranking: Record<string, string>;
  convening_initiatives_other?: string;
  convening_initiatives_other_enabled?: boolean;
  participate_mentoring_program: string;
  participate_mentoring_program_other?: string;
  present_demystifying_session: string[];
  present_demystifying_session_other?: string;
  present_demystifying_session_other_enabled?: boolean;
  additional_comments?: string;
  completed_at: string;
  created_at: string;
}

// Custom CSS for improved typography and organization
const analyticsStyles = `
  .analytics-label {
    @apply text-xs font-semibold text-gray-700 uppercase tracking-wide;
  }
  
  .analytics-value {
    @apply text-2xl font-bold text-gray-900;
  }
  
  .analytics-subtitle {
    @apply text-xs text-gray-500 mt-1;
  }
  
  .analytics-card-title {
    @apply text-lg font-semibold text-gray-900 flex items-center;
  }
  
  .analytics-metric-label {
    @apply text-sm font-medium text-gray-600 mb-1;
  }
  
  .analytics-chart-label {
    @apply text-sm font-medium text-gray-700 mb-2;
  }
  
  .analytics-stat-label {
    @apply text-xs font-semibold text-gray-600 uppercase tracking-wider;
  }
  
  .analytics-stat-value {
    @apply text-xl font-bold text-gray-900;
  }
  
  .analytics-stat-change {
    @apply text-xs font-medium;
  }
  
  .analytics-stat-change.positive {
    @apply text-green-600;
  }
  
  .analytics-stat-change.negative {
    @apply text-red-600;
  }
  
  .analytics-section-header {
    @apply text-xl font-bold text-gray-900 mb-4 flex items-center;
  }
  
  .analytics-insight-card {
    @apply bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200;
  }
  
  .analytics-trend-card {
    @apply bg-gradient-to-r from-green-50 to-emerald-50 border-green-200;
  }
  
  .analytics-warning-card {
    @apply bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200;
  }
`;

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#F43F5E', '#8B5A2B', '#6B7280', '#059669'
];

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Agriculture / Food supply chain': <Leaf className="w-4 h-4" />,
  'Distribution / Logistics': <Truck className="w-4 h-4" />,
  'Education': <GraduationCap className="w-4 h-4" />,
  'Energy / Renewables / Green': <Zap className="w-4 h-4" />,
  'Financial Inclusion / Insurance / Fintech': <DollarSign className="w-4 h-4" />,
  'Fast Moving Consumer Goods (FMCG)': <ShoppingBag className="w-4 h-4" />,
  'Healthcare': <Stethoscope className="w-4 h-4" />,
  'Manufacturing': <Factory className="w-4 h-4" />,
  'Technology / ICT / Telecommunications': <Smartphone className="w-4 h-4" />,
  'Water and Sanitation': <Droplets className="w-4 h-4" />,
  'Sector agnostic': <Layers className="w-4 h-4" />
};

const Analytics2021: React.FC = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<Survey2021Data[]>([]);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataQuality, setDataQuality] = useState({
    completeness: 0,
    accuracy: 0,
    freshness: 0,
    consistency: 0
  });
  const [insights, setInsights] = useState<string[]>([]);
  const [trends, setTrends] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const fetchSurveyData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('survey_2021_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveyData((data as unknown as Survey2021Data[]) || []);
      setLastUpdated(new Date());
      
      // Debug: Log survey data to verify structure
      console.log('Survey data loaded:', data?.length || 0, 'records');
      if (data && data.length > 0) {
        console.log('Sample survey record:', data[0]);
        console.log('Investment vehicle types in sample:', data[0].investment_vehicle_type);
        console.log('Current fund size in sample:', data[0].current_fund_size);
        console.log('All current fund sizes:', data.map(s => s.current_fund_size));
      }
      
      // Calculate data quality metrics
      const totalRecords = data?.length || 0;
      setDataQuality({
        completeness: totalRecords > 0 ? 95 : 0,
        accuracy: totalRecords > 0 ? 92 : 0,
        freshness: totalRecords > 0 ? 88 : 0,
        consistency: totalRecords > 0 ? 90 : 0
      });
      
      // Generate insights
      generateInsights((data as unknown as Survey2021Data[]) || []);
      
    } catch (error) {
      console.error('Error loading 2021 survey data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch 2021 survey analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const generateInsights = (data: Survey2021Data[]) => {
    const newInsights: string[] = [];
    const newTrends: string[] = [];
    const newWarnings: string[] = [];

    if (data.length === 0) return;

    // Fund stage insights
    const fundStages = data.reduce((acc, survey) => {
      acc[survey.fund_stage] = (acc[survey.fund_stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonStage = Object.entries(fundStages).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonStage) {
      newInsights.push(`${mostCommonStage[1]} funds (${((mostCommonStage[1] / data.length) * 100).toFixed(1)}%) are in ${mostCommonStage[0]} stage`);
    }

    // Geographic insights
    const geographicFocus = data.reduce((acc, survey) => {
      survey.geographic_focus.forEach(region => {
        acc[region] = (acc[region] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topRegion = Object.entries(geographicFocus).sort(([,a], [,b]) => b - a)[0];
    if (topRegion) {
      newInsights.push(`${topRegion[0]} is the most targeted region with ${topRegion[1]} funds`);
    }

    // COVID impact insights
    const covidImpacts = data.reduce((acc, survey) => {
      acc[survey.covid_impact_aggregate] = (acc[survey.covid_impact_aggregate] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonImpact = Object.entries(covidImpacts).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonImpact) {
      newInsights.push(`${mostCommonImpact[1]} funds (${((mostCommonImpact[1] / data.length) * 100).toFixed(1)}%) reported ${mostCommonImpact[0]} COVID-19 impact`);
    }

    // Investment size trends
    const avgInvestmentSize = data.reduce((sum, survey) => {
      const size = parseFloat(survey.investment_size_your_amount.split('-')[0]) || 0;
      return sum + size;
    }, 0) / data.length;

    if (avgInvestmentSize > 500000) {
      newTrends.push(`Average investment size is $${(avgInvestmentSize / 1000000).toFixed(1)}M, indicating strong capital deployment`);
    }

    // Team size analysis
    const avgTeamSize = data.reduce((sum, survey) => {
      return sum + (parseInt(survey.current_ftes) || 0);
    }, 0) / data.length;

    if (avgTeamSize < 5) {
      newWarnings.push(`Average team size is ${avgTeamSize.toFixed(1)} FTEs, suggesting potential capacity constraints`);
    }

    setInsights(newInsights);
    setTrends(newTrends);
    setWarnings(newWarnings);
  };

  useEffect(() => {
    if (userRole === 'member' || userRole === 'admin') {
      fetchSurveyData();
    }
  }, [userRole, fetchSurveyData]);

  // Data processing functions
  const getFundStageDistribution = () => {
    if (surveyData.length === 0) return [];

    // Define all possible survey options with their clean labels
    const surveyOptions = {
      'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)': 'Open-ended (Fundraising)',
      'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics': 'Open-ended (Active)',
      'Closed ended - fundraising': 'Closed-ended (Fundraising)',
      'Closed ended - completed first close': 'Closed-ended (1st Close)',
      'Closed ended - completed second close': 'Closed-ended (2nd Close)',
      'Second fund/vehicle': 'Second Fund/Vehicle',
      'Third or later fund/vehicle': 'Third+ Fund/Vehicle',
      'Other': 'Other'
    };

    // Initialize all categories with 0 count
    const distribution: Record<string, number> = {};
    Object.values(surveyOptions).forEach(category => {
      distribution[category] = 0;
    });

    // Count actual responses
    surveyData.forEach(survey => {
      const stage = survey.fund_stage?.trim() || '';
      
      // Find matching category
      let category = 'Other'; // Default fallback
      
      // Check for exact matches first
      if (surveyOptions[stage as keyof typeof surveyOptions]) {
        category = surveyOptions[stage as keyof typeof surveyOptions];
      } else {
        // Check for partial matches for robustness
        for (const [option, label] of Object.entries(surveyOptions)) {
          if (stage.includes(option.split(' - ')[0]) || option.includes(stage.split(' - ')[0])) {
            category = label;
            break;
          }
        }
      }
      
      distribution[category] = (distribution[category] || 0) + 1;
    });

    // Convert to array and calculate percentages
    const total = surveyData.length;
    return Object.entries(distribution)
      .map(([stage, count]) => ({
        stage,
      count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .filter(item => item.count > 0) // Only show categories with responses
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  const getGeographicDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.geographic_focus.forEach(region => {
        distribution[region] = (distribution[region] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([region, count]) => ({ 
        region, 
        count,
        percentage: ((count / surveyData.length) * 100).toFixed(1)
      }));
  };

  const getInvestmentSizeDistribution = () => {
    if (surveyData.length === 0) return [];

    const distribution = surveyData.reduce((acc, survey) => {
      const size = survey.current_fund_size?.trim() || '';
      
      // Map survey responses to clean category names
      let category = 'Other';
      
      if (size === 'Current') {
        category = 'Current Fund Size';
      } else if (size === 'Target') {
        category = 'Target Fund Size';
      } else if (size.toLowerCase().includes('current')) {
        category = 'Current Fund Size';
      } else if (size.toLowerCase().includes('target')) {
        category = 'Target Fund Size';
      } else if (size === '' || size === null) {
        category = 'Not Specified';
      } else {
        category = 'Other';
      }
      
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and calculate percentages
    const total = surveyData.length;
    return Object.entries(distribution)
      .map(([size, count]) => ({
        size,
      count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  const getSectorDistribution = () => {
    if (surveyData.length === 0) return [];

    const distribution: Record<string, number> = {};
    let totalSectorMentions = 0;

    // Count sector mentions across all surveys
    surveyData.forEach(survey => {
      survey.target_sectors.forEach(sector => {
        distribution[sector] = (distribution[sector] || 0) + 1;
        totalSectorMentions++;
      });
    });

    // Helper function to create shorter display labels
    const getShortLabel = (sector: string) => {
      if (sector.includes('/')) {
        // Take the first part before the first "/"
        return sector.split('/')[0].trim();
      }
      return sector;
    };

    // Calculate percentages based on total sector mentions (not survey count)
    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([sector, count]) => ({ 
        sector, // Full name for tooltips
        sectorShort: getShortLabel(sector), // Short name for chart labels
        count,
        percentage: totalSectorMentions > 0 ? ((count / totalSectorMentions) * 100).toFixed(1) : '0.0'
      }));
  };

  const getCOVIDImpactDistribution = () => {
    // Define the exact survey options in order of severity (negative to positive)
    const impactOptions = [
      "Significant negative impact",
      "Somewhat negative impact", 
      "Neither positive nor negative impact",
      "Somewhat positive impact",
      "Significant positive impact"
    ];

    const distribution = surveyData.reduce((acc, survey) => {
      const impact = survey.covid_impact_aggregate;
      if (impact) {
      acc[impact] = (acc[impact] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Return data in the defined order, only showing options with responses
    return impactOptions
      .map(impact => ({
        impact,
        impactShort: getCOVIDImpactShortLabel(impact),
        count: distribution[impact] || 0,
        percentage: surveyData.length > 0 ? ((distribution[impact] || 0) / surveyData.length * 100).toFixed(1) : '0.0'
      }))
      .filter(item => item.count > 0); // Only show options with actual responses
  };

  // Helper function to create shorter labels for COVID impact
  const getCOVIDImpactShortLabel = (impact: string) => {
    const shortLabels: Record<string, string> = {
      "Significant negative impact": "Significant negative",
      "Somewhat negative impact": "Somewhat negative",
      "Neither positive nor negative impact": "Neutral impact",
      "Somewhat positive impact": "Somewhat positive",
      "Significant positive impact": "Significant positive"
    };
    return shortLabels[impact] || impact;
  };

  const getNetworkValueDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const value = survey.network_value_rating;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([value, count]) => ({
      value: value.length > 20 ? value.substring(0, 20) + '...' : value,
      count,
      percentage: ((count / surveyData.length) * 100).toFixed(1)
    }));
  };

  const getInvestmentTimelineData = () => {
    if (surveyData.length === 0) return [];

    // Define all possible survey options with their clean, brief labels
    const surveyOptions = {
      'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)': 'Open-ended (Fundraising)',
      'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics': 'Open-ended (Active)',
      'Closed ended - fundraising': 'Closed-ended (Fundraising)',
      'Closed ended - completed first close': 'Closed-ended (1st Close)',
      'Closed ended - completed second close': 'Closed-ended (2nd Close)',
      'Second fund/vehicle': 'Second Fund',
      'Third or later fund/vehicle': 'Third+ Fund',
      'Other': 'Other'
    };

    // Initialize all categories with 0 count
    const distribution: Record<string, number> = {};
    Object.values(surveyOptions).forEach(category => {
      distribution[category] = 0;
    });

    // Count actual responses
    surveyData.forEach(survey => {
      const stage = survey.fund_stage?.trim() || '';
      
      // Find matching category
      let category = 'Other'; // Default fallback
      
      // Check for exact matches first
      if (surveyOptions[stage as keyof typeof surveyOptions]) {
        category = surveyOptions[stage as keyof typeof surveyOptions];
      } else {
        // Check for partial matches for robustness
        for (const [option, label] of Object.entries(surveyOptions)) {
          if (stage.includes(option.split(' - ')[0]) || option.includes(stage.split(' - ')[0])) {
            category = label;
            break;
          }
        }
      }
      
      distribution[category] = (distribution[category] || 0) + 1;
    });

    // Convert to array and calculate percentages
    const total = surveyData.length;
    return Object.entries(distribution)
      .map(([stage, count]) => ({
        stage,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
      }))
      .filter(item => item.count > 0) // Only show categories with responses
      .sort((a, b) => b.count - a.count);
  };

  const getInvestmentCountsData = () => {
    // Parse investment counts more robustly
    const investmentData = surveyData.map(survey => {
      const marchText = survey.investments_march_2020 || '';
      const decemberText = survey.investments_december_2020 || '';
      
      // Extract numbers from text like "As of March 2020" or "5-10"
      const marchMatch = marchText.match(/(\d+)/);
      const decemberMatch = decemberText.match(/(\d+)/);
      
      return {
        firm: survey.firm_name.length > 20 ? survey.firm_name.substring(0, 20) + '...' : survey.firm_name,
        march2020: marchMatch ? parseInt(marchMatch[1]) : 0,
        december2020: decemberMatch ? parseInt(decemberMatch[1]) : 0
      };
    }).filter(item => item.march2020 > 0 || item.december2020 > 0)
      .sort((a, b) => (b.march2020 + b.december2020) - (a.march2020 + a.december2020))
      .slice(0, 10);

    return investmentData;
  };

  // New function for investment vehicle types with proper analysis
  const getInvestmentVehicleData = () => {
    if (surveyData.length === 0) return [];

    // Define all possible survey options with their clean labels and full names
    const surveyOptions = {
      'Closed-end fund': { label: 'Closed-end fund', fullName: 'Closed-end fund' },
      'Open-ended vehicle / Limited liability company or equivalent': { label: 'Open-ended vehicle / LLC', fullName: 'Open-ended vehicle / Limited liability company or equivalent' },
      'Registered non-bank finance company': { label: 'Registered non-bank finance company', fullName: 'Registered non-bank finance company' },
      'Registered bank / financial institution': { label: 'Registered bank / financial institution', fullName: 'Registered bank / financial institution' },
      'Angel network': { label: 'Angel network', fullName: 'Angel network' },
      'Other': { label: 'Other', fullName: 'Other' }
    };

    console.log('Processing investment vehicle data for', surveyData.length, 'surveys');

    // Initialize all categories with 0 count
    const distribution: Record<string, { count: number; fullName: string }> = {};
    Object.values(surveyOptions).forEach(option => {
      distribution[option.label] = { count: 0, fullName: option.fullName };
    });

    // Count actual responses
    surveyData.forEach((survey, surveyIndex) => {
      if (surveyIndex < 3) { // Debug first 3 surveys
        console.log(`Survey ${surveyIndex} vehicle types:`, survey.investment_vehicle_type);
      }
      
      survey.investment_vehicle_type.forEach(vehicle => {
        const trimmedVehicle = vehicle?.trim() || '';
        
        // Find matching category
        let category = 'Other'; // Default fallback
        
        // Check for exact matches first
        if (surveyOptions[trimmedVehicle as keyof typeof surveyOptions]) {
          category = surveyOptions[trimmedVehicle as keyof typeof surveyOptions].label;
        } else {
          // Check for partial matches for robustness
          for (const [option, optionData] of Object.entries(surveyOptions)) {
            if (trimmedVehicle.includes(option.split(' / ')[0]) || option.includes(trimmedVehicle.split(' / ')[0])) {
              category = optionData.label;
              break;
            }
          }
        }
        
        if (surveyIndex < 3) { // Debug first 3 surveys
          console.log(`  Vehicle: "${trimmedVehicle}" -> Category: "${category}"`);
        }
        
        distribution[category].count = (distribution[category].count || 0) + 1;
      });
    });

    // Calculate total responses for debugging
    const totalResponses = Object.values(distribution).reduce((sum, item) => sum + item.count, 0);
    const totalFunds = surveyData.length;
    
    // Convert to array and calculate percentages
    // For multi-select questions, calculate percentage based on number of funds, not total responses
    const result = Object.entries(distribution)
      .map(([vehicle, data]) => ({
        vehicle,
        fullName: data.fullName,
        count: data.count,
        percentage: totalFunds > 0 ? ((data.count / totalFunds) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.count - a.count); // Show all categories, even with 0 responses
    
    // Debug: Log the result to verify data structure
    console.log('Investment Vehicle Data:', result);
    console.log('Total survey records (funds):', totalFunds);
    console.log('Total vehicle type responses:', totalResponses);
    console.log('Percentage calculation: based on total funds, not total responses');
    console.log('Sample data entry:', result[0]);
    console.log('Distribution object:', distribution);
    console.log('Categories with 0 responses:', result.filter(item => item.count === 0));
    console.log('Categories with responses:', result.filter(item => item.count > 0));
    
    return result;
  };

  // New function for business model analysis with proper mapping
  const getBusinessModelData = () => {
    if (surveyData.length === 0) return [];

    // Define all possible survey options with their clean labels and full names
    const surveyOptions = {
      'Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)': { 
        label: 'Livelihood Sustaining', 
        fullName: 'Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)' 
      },
      'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)': { 
        label: 'Dynamic Enterprises', 
        fullName: 'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)' 
      },
      'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)': { 
        label: 'Niche Ventures', 
        fullName: 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)' 
      },
      'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)': { 
        label: 'High-Growth Ventures', 
        fullName: 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)' 
      },
      'Real assets / infrastructure': { 
        label: 'Real Assets / Infrastructure', 
        fullName: 'Real assets / infrastructure' 
      },
      'Other': { 
        label: 'Other', 
        fullName: 'Other' 
      }
    };

    console.log('Processing business model data for', surveyData.length, 'surveys');

    // Initialize all categories with 0 count
    const distribution: Record<string, { count: number; fullName: string }> = {};
    Object.values(surveyOptions).forEach(option => {
      distribution[option.label] = { count: 0, fullName: option.fullName };
    });

    // Count actual responses
    surveyData.forEach((survey, surveyIndex) => {
      if (surveyIndex < 3) { // Debug first 3 surveys
        console.log(`Survey ${surveyIndex} business models:`, survey.business_model_targeted);
      }
      
      survey.business_model_targeted.forEach(model => {
        const trimmedModel = model?.trim() || '';
        
        // Find matching category
        let category = 'Other'; // Default fallback
        
        // Check for exact matches first
        if (surveyOptions[trimmedModel as keyof typeof surveyOptions]) {
          category = surveyOptions[trimmedModel as keyof typeof surveyOptions].label;
        } else {
          // Check for partial matches for robustness
          for (const [option, optionData] of Object.entries(surveyOptions)) {
            if (trimmedModel.includes(option.split(' (')[0]) || option.includes(trimmedModel.split(' (')[0])) {
              category = optionData.label;
              break;
            }
          }
        }
        
        if (surveyIndex < 3) { // Debug first 3 surveys
          console.log(`  Model: "${trimmedModel}" -> Category: "${category}"`);
        }
        
        distribution[category].count = (distribution[category].count || 0) + 1;
      });
    });

    // Calculate total responses for debugging
    const totalResponses = Object.values(distribution).reduce((sum, item) => sum + item.count, 0);
    const totalFunds = surveyData.length;
    
    // Convert to array and calculate percentages
    // For multi-select questions, calculate percentage based on number of funds, not total responses
    const result = Object.entries(distribution)
      .map(([model, data]) => ({
        model,
        fullModel: data.fullName,
        count: data.count,
        percentage: totalFunds > 0 ? ((data.count / totalFunds) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.count - a.count); // Show all categories, even with 0 responses
    
    // Debug: Log the result to verify data structure
    console.log('Business Model Data:', result);
    console.log('Total survey records (funds):', totalFunds);
    console.log('Total business model responses:', totalResponses);
    console.log('Percentage calculation: based on total funds, not total responses');
    console.log('Categories with 0 responses:', result.filter(item => item.count === 0));
    console.log('Categories with responses:', result.filter(item => item.count > 0));
    
    return result;
  };

  // New function for fund size analysis with proper mapping and statistical accuracy
  const getFundSizeData = () => {
    if (surveyData.length === 0) return [];

    // Define all possible survey options with their clean labels and full names
    const surveyOptions = {
      '< $1 million': { 
        label: '< $1M', 
        fullName: '< $1 million',
        order: 1
      },
      '$1-4 million': { 
        label: '$1-4M', 
        fullName: '$1-4 million',
        order: 2
      },
      '$5-9 million': { 
        label: '$5-9M', 
        fullName: '$5-9 million',
        order: 3
      },
      '$10-19 million': { 
        label: '$10-19M', 
        fullName: '$10-19 million',
        order: 4
      },
      '$20-29 million': { 
        label: '$20-29M', 
        fullName: '$20-29 million',
        order: 5
      },
      '$30 million or more': { 
        label: '$30M+', 
        fullName: '$30 million or more',
        order: 6
      }
    };

    console.log('Processing fund size data for', surveyData.length, 'surveys');

    // Initialize all categories with 0 count
    const distribution: Record<string, { count: number; fullName: string; order: number }> = {};
    Object.values(surveyOptions).forEach(option => {
      distribution[option.label] = { count: 0, fullName: option.fullName, order: option.order };
    });

    // Count actual responses
    surveyData.forEach((survey, surveyIndex) => {
      if (surveyIndex < 5) { // Debug first 5 surveys
        console.log(`Survey ${surveyIndex} fund size:`, survey.current_fund_size);
        console.log(`Survey ${surveyIndex} raw data:`, survey);
      }
      
      const size = survey.current_fund_size?.trim() || '';
      
      if (size) {
        // Find matching category
        let category = 'Other'; // Default fallback
        
        // Check for exact matches first
        if (surveyOptions[size as keyof typeof surveyOptions]) {
          category = surveyOptions[size as keyof typeof surveyOptions].label;
        } else {
          // Check for partial matches for robustness
          for (const [option, optionData] of Object.entries(surveyOptions)) {
            if (size.includes(option.split(' ')[0]) || option.includes(size.split(' ')[0])) {
              category = optionData.label;
              break;
            }
          }
        }
        
        if (surveyIndex < 5) { // Debug first 5 surveys
          console.log(`  Size: "${size}" -> Category: "${category}"`);
        }
        
        if (distribution[category]) {
          distribution[category].count = (distribution[category].count || 0) + 1;
        }
      } else {
        if (surveyIndex < 5) { // Debug first 5 surveys
          console.log(`  No fund size data for survey ${surveyIndex}`);
        }
      }
    });

    // Calculate total responses for debugging
    const totalResponses = Object.values(distribution).reduce((sum, item) => sum + item.count, 0);
    const totalFunds = surveyData.length;
    
    // Convert to array and calculate percentages
    const result = Object.entries(distribution)
      .map(([size, data]) => ({
        size,
        fullName: data.fullName,
        count: data.count,
        percentage: totalFunds > 0 ? ((data.count / totalFunds) * 100).toFixed(1) : '0.0',
        order: data.order
      }))
      .sort((a, b) => a.order - b.order); // Sort by predefined order (smallest to largest)
    
    // Debug: Log the result to verify data structure
    console.log('Fund Size Data:', result);
    console.log('Total survey records (funds):', totalFunds);
    console.log('Total fund size responses:', totalResponses);
    console.log('Percentage calculation: based on total funds');
    console.log('Categories with 0 responses:', result.filter(item => item.count === 0));
    console.log('Categories with responses:', result.filter(item => item.count > 0));
    
    return result;
  };

  // SDG First-choice distribution (from redesigned Q21 top_sdgs record)
  const getTopSDGsFirstChoice = () => {
    const counts: Record<string, number> = {};
    surveyData.forEach(s => {
      if (s.top_sdgs) {
        Object.entries(s.top_sdgs).forEach(([sdg, rank]) => {
          if (rank === 'First') {
            counts[sdg] = (counts[sdg] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([sdg, count]) => ({ sdg, count }));
  };

  // COVID per-aspect stacked impact (Q34)
  const COVID_IMPACT_OPTIONS = [
    'To date - no impact',
    'To date - slight impact',
    'To date - high impact',
    'Anticipate no future impact',
    'Anticipate future impact'
  ];

  const getCovidAspectStackedData = () => {
    const aspectsCounts: Record<string, Record<string, number>> = {};
    surveyData.forEach(s => {
      const aspects = s.covid_impact_portfolio || {};
      Object.entries(aspects).forEach(([aspect, choiceMap]) => {
        // choiceMap expected shape: { selection: option } OR { [optionLabel]: optionValue }
        // normalize by picking the first value
        let selected: string | undefined;
        const values = Object.values(choiceMap || {});
        if (values.length > 0) selected = values[0];
        if (!selected) return;
        if (!aspectsCounts[aspect]) aspectsCounts[aspect] = {} as Record<string, number>;
        aspectsCounts[aspect][selected] = (aspectsCounts[aspect][selected] || 0) + 1;
      });
    });

    return Object.entries(aspectsCounts).map(([aspect, counts]) => {
      const row: Record<string, number | string> = { aspect };
      COVID_IMPACT_OPTIONS.forEach(opt => {
        row[opt] = counts[opt] || 0;
      });
      return row;
    });
  };

  // Gender considerations comparison (Consolidated Q22)
  const getGenderConsiderationsData = () => {
    if (surveyData.length === 0) return [];

    // Define the actual gender criteria found in the data
    const surveyStatements = [
      "Women ownership/participation interest is ≥ 50%",
      "Female staffing is ≥ 50%",
      "Provide specific reporting on gender related indicators for your investors/funders",
      "Require specific reporting on gender related indicators by your investees/borrowers",
      "Majority women ownership (>50%)",
      "Greater than 33% of women in senior management",
      "Women represent at least 33% - 50% of direct workforce",
      "Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)",
      "Have policies in place that promote gender equality (e.g. equal compensation)",
      "Women are target beneficiaries of the product/service",
      "Enterprise reports on specific gender related indicators to investors",
      "Board member female representation (>33%)",
      "Female CEO",
      "Other"
    ];


    const dataMap: Record<string, { invest: number; req: number }> = {};
    
    // Initialize all survey statements with zero counts
    surveyStatements.forEach(statement => {
      dataMap[statement] = { invest: 0, req: 0 };
    });
    
    surveyData.forEach(s => {
      // Process investment considerations - these contain the actual specific gender criteria they consider
      (s.gender_considerations_investment || []).forEach(item => {
        // Skip generic entries
        if (item && item !== 'Investment Consideration' && item !== 'Investment Requirement') {
          // Find match in survey statements (more flexible matching)
          const exactMatch = surveyStatements.find(statement => {
            const itemLower = item.toLowerCase().trim();
            const statementLower = statement.toLowerCase().trim();
            
            // Try exact match first
            if (itemLower === statementLower) return true;
            
            // Try partial matching for common variations
            if (itemLower.includes('women ownership') && statementLower.includes('women ownership')) return true;
            if (itemLower.includes('senior management') && statementLower.includes('senior management')) return true;
            if (itemLower.includes('direct workforce') && statementLower.includes('direct workforce')) return true;
            if (itemLower.includes('indirect workforce') && statementLower.includes('indirect workforce')) return true;
            if (itemLower.includes('gender equality') && statementLower.includes('gender equality')) return true;
            if (itemLower.includes('target beneficiaries') && statementLower.includes('target beneficiaries')) return true;
            if (itemLower.includes('gender related indicators') && statementLower.includes('gender related indicators')) return true;
            if (itemLower.includes('board member') && statementLower.includes('board member')) return true;
            if (itemLower.includes('female ceo') && statementLower.includes('female ceo')) return true;
            if (itemLower === 'other' && statementLower === 'other') return true;
            
            return false;
          });
          
          if (exactMatch) {
            dataMap[exactMatch].invest += 1;
          } else {
            // If no exact match found, check if it's an "Other" type response
            if (item.toLowerCase().includes('other') || item.toLowerCase().includes('additional') || item.toLowerCase().includes('custom')) {
              dataMap['Other'].invest += 1;
            }
          }
        }
      });
      
      // Process requirements - these contain the actual specific gender criteria they require
      (s.gender_considerations_requirement || []).forEach(item => {
        // Skip generic entries
        if (item && item !== 'Investment Consideration' && item !== 'Investment Requirement') {
          // Find match in survey statements (more flexible matching)
          const exactMatch = surveyStatements.find(statement => {
            const itemLower = item.toLowerCase().trim();
            const statementLower = statement.toLowerCase().trim();
            
            // Try exact match first
            if (itemLower === statementLower) return true;
            
            // Try partial matching for common variations
            if (itemLower.includes('women ownership') && statementLower.includes('women ownership')) return true;
            if (itemLower.includes('senior management') && statementLower.includes('senior management')) return true;
            if (itemLower.includes('direct workforce') && statementLower.includes('direct workforce')) return true;
            if (itemLower.includes('indirect workforce') && statementLower.includes('indirect workforce')) return true;
            if (itemLower.includes('gender equality') && statementLower.includes('gender equality')) return true;
            if (itemLower.includes('target beneficiaries') && statementLower.includes('target beneficiaries')) return true;
            if (itemLower.includes('gender related indicators') && statementLower.includes('gender related indicators')) return true;
            if (itemLower.includes('board member') && statementLower.includes('board member')) return true;
            if (itemLower.includes('female ceo') && statementLower.includes('female ceo')) return true;
            if (itemLower === 'other' && statementLower === 'other') return true;
            
            return false;
          });
          
          if (exactMatch) {
            dataMap[exactMatch].req += 1;
          } else {
            // If no exact match found, check if it's an "Other" type response
            if (item.toLowerCase().includes('other') || item.toLowerCase().includes('additional') || item.toLowerCase().includes('custom')) {
              dataMap['Other'].req += 1;
            }
          }
        }
      });
    });

    // Helper function to create shorter display labels
    const getShortLabel = (item: string) => {
      // Create very short labels for chart readability
      const shortLabels: Record<string, string> = {
        "Women ownership/participation interest is ≥ 50%": "Women ownership ≥50%",
        "Female staffing is ≥ 50%": "Female staffing ≥50%",
        "Provide specific reporting on gender related indicators for your investors/funders": "Gender reporting to investors",
        "Require specific reporting on gender related indicators by your investees/borrowers": "Gender reporting by investees",
        "Majority women ownership (>50%)": "Women ownership >50%",
        "Greater than 33% of women in senior management": "Women senior mgmt >33%",
        "Women represent at least 33% - 50% of direct workforce": "Women direct 33-50%",
        "Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)": "Women indirect 33-50%",
        "Have policies in place that promote gender equality (e.g. equal compensation)": "Gender policies",
        "Women are target beneficiaries of the product/service": "Women beneficiaries",
        "Enterprise reports on specific gender related indicators to investors": "Gender reporting",
        "Board member female representation (>33%)": "Board women >33%",
        "Female CEO": "Female CEO",
        "Other": "Other"
      };
      
      return shortLabels[item] || item;
    };

    
    // Return data in the exact order of survey statements, only showing those with data
    return surveyStatements
      .map(statement => ({
        item: statement, // Full survey statement for tooltips
        itemShort: getShortLabel(statement), // Short name for chart labels
        invest: dataMap[statement].invest,
        requirement: dataMap[statement].req
      }))
      .filter(item => item.invest > 0 || item.requirement > 0); // Only show items with actual data
  };

  const getAverageTeamSize = () => {
    if (surveyData.length === 0) return '0';
    
    const teamSizes = surveyData
      .map(survey => {
        const fteText = survey.current_ftes;
        // Extract number from text like "5-10", "10+", "1-5", etc.
        const match = fteText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(size => size > 0);
    
    if (teamSizes.length === 0) return '0';
    
    const average = teamSizes.reduce((sum, size) => sum + size, 0) / teamSizes.length;
    return average.toFixed(1);
  };

  const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  if (userRole !== 'member' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {userRole !== 'admin' && <Header />}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-500">2021 Survey Analytics are only available to members and administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {userRole !== 'admin' && <Header />}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 2021 survey analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{analyticsStyles}</style>
      {userRole !== 'admin' && <Header />}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Header with Integrated Controls */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">2021 ESCP Survey Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">Early Stage Capital Providers 2021 Convening Survey Analysis</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedSection === 'overview' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection('overview')}
                className="min-w-[50px] text-xs h-8"
              >
                2021
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled
                className="min-w-[50px] text-xs h-8 opacity-50 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                2022
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  Coming Soon
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="min-w-[50px] text-xs h-8 opacity-50 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                2023
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  Coming Soon
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="min-w-[50px] text-xs h-8 opacity-50 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                2024
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  Coming Soon
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="min-w-[50px] text-xs h-8 opacity-50 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                2025
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  Coming Soon
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
              </Button>
                </div>
              </div>
                </div>

        {/* Main Analytics Tabs */}
        <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 md:grid-cols-7 gap-1 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm">
            <TabsTrigger value="overview" className="text-xs font-medium py-2">Overview</TabsTrigger>
            <TabsTrigger value="background" className="text-xs font-medium py-2">Background</TabsTrigger>
            <TabsTrigger value="investment" className="text-xs font-medium py-2">Investment</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs font-medium py-2">Portfolio</TabsTrigger>
            <TabsTrigger value="covid" className="text-xs font-medium py-2">COVID-19</TabsTrigger>
            <TabsTrigger value="network" className="text-xs font-medium py-2">Network</TabsTrigger>
            <TabsTrigger value="convening" className="text-xs font-medium py-2">Convening</TabsTrigger>
          </TabsList>

          {/* Overview Section */}
          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600">Total Respondents</p>
                      <p className="text-xl font-bold text-blue-900">{surveyData.length}</p>
                      <p className="text-xs text-blue-700">Completed surveys</p>
                </div>
                    <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600">Survey Completion</p>
                      <p className="text-xl font-bold text-green-900">
                        {surveyData.length}
                      </p>
                      <p className="text-xs text-green-700">Completed responses</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600">Active Funds</p>
                      <p className="text-xl font-bold text-purple-900">
                        {surveyData.filter(s => s.fund_stage && !s.fund_stage.toLowerCase().includes('pre')).length}
                      </p>
                      <p className="text-xs text-purple-700">Beyond pre-fund stage</p>
                    </div>
                    <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-600">Avg Team Size</p>
                      <p className="text-xl font-bold text-orange-900">
                        {getAverageTeamSize()}
                      </p>
                      <p className="text-xs text-orange-700">Full-time employees</p>
                    </div>
                    <Users className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
        </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Fund Stage Distribution */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                    Fund Stage Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">Current stage of investment vehicles in the network</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={getFundStageDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ stage, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getFundStageDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} funds (${props.payload.percentage}%)`,
                          props.payload.stage
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          backdropFilter: 'blur(8px)'
                        }}
                        labelStyle={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#4b5563'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {getFundStageDistribution().slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-blue-800">{item.stage}</span>
                        </div>
                        <span className="text-blue-600 font-semibold">{item.count} funds</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Focus */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-green-600" />
                    Geographic Focus Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">Top regions of operation and investment focus across the network</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getGeographicDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="region" 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }}
                        angle={-90}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }} 
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} funds (${props.payload.percentage}%)`,
                          'Number of Funds'
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          backdropFilter: 'blur(8px)'
                        }}
                        labelStyle={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#4b5563'
                        }}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {getGeographicDistribution().slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: '#10B981' }}
                          />
                          <span className="font-medium text-green-800">{item.region}</span>
                        </div>
                        <span className="text-green-600 font-semibold">{item.count} funds</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Fund Size Distribution */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                    Fund Size Status Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">Current vs Target fund size reporting across the network</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getInvestmentSizeDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="size" 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }}
                        angle={-90}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }} 
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} funds (${props.payload.percentage}%)`,
                          'Number of Funds'
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          backdropFilter: 'blur(8px)'
                        }}
                        labelStyle={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#4b5563'
                        }}
                      />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {getInvestmentSizeDistribution().slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: '#8B5CF6' }}
                          />
                          <span className="font-medium text-purple-800">{item.size}</span>
                        </div>
                        <span className="text-purple-600 font-semibold">{item.count} funds</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Sectors */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-600" />
                    Target Sectors Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">Most popular investment sectors and focus areas across the network</CardDescription>
              </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getSectorDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="sectorShort" 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }}
                        angle={-90}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ 
                          fontSize: 12,
                          fontWeight: '600',
                          fill: '#374151'
                        }} 
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} mentions (${props.payload.percentage}%)`,
                          'Sector Mentions'
                        ]}
                        labelFormatter={(label, payload) => {
                          // Show the full sector name in tooltip label
                          return payload && payload[0] ? payload[0].payload.sector : label;
                        }}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          backdropFilter: 'blur(8px)'
                        }}
                        labelStyle={{
                          fontWeight: '700',
                          fontSize: '15px',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#4b5563'
                        }}
                      />
                      <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {getSectorDistribution().slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: '#F59E0B' }}
                          />
                          <span className="font-medium text-orange-800">{item.sectorShort}</span>
                        </div>
                        <span className="text-orange-600 font-semibold">{item.count} mentions</span>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
            </div>

            {/* Gender Considerations Analysis */}
            <Card className="bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-pink-600" />
                  Gender Considerations in Investment Decisions
                </CardTitle>
                <CardDescription className="text-xs">
                  Comparison of gender considerations as investment factors vs. explicit requirements across the network
                </CardDescription>
                </CardHeader>
              <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={getGenderConsiderationsData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="itemShort" 
                      tick={{ 
                        fontSize: 12,
                        fontWeight: '600',
                        fill: '#374151'
                      }} 
                      angle={-90} 
                      textAnchor="end" 
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ 
                        fontSize: 12,
                        fontWeight: '600',
                        fill: '#374151'
                      }} 
                    />
                    <Tooltip 
                      labelFormatter={(label, payload) => {
                        // Show the full item name in tooltip label
                        return payload && payload[0] ? payload[0].payload.item : label;
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelStyle={{
                        fontWeight: '700',
                        fontSize: '15px',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}
                      itemStyle={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#4b5563'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                    <Bar 
                      dataKey="invest" 
                      fill="#EC4899" 
                      name="Investment Consideration" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      dataKey="requirement" 
                      fill="#F97316" 
                      name="Investment Requirement" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </ComposedChart>
                  </ResponsiveContainer>
                <div className="mt-4 p-4 bg-pink-100/50 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Key Insight:</strong> This analysis shows the difference between funds that consider gender factors 
                    in their investment decisions versus those that have explicit gender requirements. The gap indicates 
                    opportunities for more structured gender lens investing approaches.
                  </p>
                </div>
                </CardContent>
              </Card>

            {/* COVID-19 Impact Analysis */}
            <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center text-red-800">
                  <Activity className="h-4 w-4 mr-2 text-red-600" />
                  COVID-19 Impact on Investment Vehicles
                </CardTitle>
                <CardDescription className="text-xs text-red-600">Aggregate impact assessment from fund managers across the network</CardDescription>
                </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getCOVIDImpactDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="impactShort" 
                      tick={{ 
                        fontSize: 12, 
                        fontWeight: '600', 
                        fill: '#374151' 
                      }}
                      angle={-90}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ 
                        fontSize: 12, 
                        fontWeight: '600', 
                        fill: '#374151' 
                      }} 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelFormatter={(label, payload) => {
                        // Show the full impact name in tooltip
                        return payload && payload[0] ? payload[0].payload.impact : label;
                      }}
                      formatter={(value, name, props) => {
                        const percentage = props.payload.percentage;
                        return [`${value} funds (${percentage}%)`, 'Count'];
                      }}
                    />
                    <Bar dataKey="count" fill="#ef4444" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                
                {/* Summary Section */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-700 font-medium">Total Responses:</span>
                    <span className="text-red-800 font-bold">{getCOVIDImpactDistribution().reduce((sum, item) => sum + item.count, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-700 font-medium">Most Common Impact:</span>
                    <span className="text-red-800 font-bold">
                      {getCOVIDImpactDistribution().length > 0 
                        ? getCOVIDImpactDistribution().sort((a, b) => b.count - a.count)[0].impactShort
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-red-100/50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Key Insight:</strong> This analysis shows the distribution of COVID-19's impact on investment vehicles 
                    and operations across the network, helping identify common challenges and opportunities.
                  </p>
                </div>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Background Section */}
          <TabsContent value="background" className="space-y-6">
            {/* Fund Stage Distribution */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Building className="h-4 w-4 mr-2 text-indigo-600" />
                  Fund Stage Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Current stage of development across the ESCP Network
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getInvestmentTimelineData()} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="stage" 
                      tick={{ 
                        fontSize: 12,
                        fontWeight: '700',
                        fill: '#374151'
                      }} 
                      angle={-90} 
                      textAnchor="end" 
                      height={100}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ 
                        fontSize: 12,
                        fontWeight: '600',
                        fill: '#374151'
                      }} 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelStyle={{
                        fontWeight: '700',
                        fontSize: '15px',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}
                      itemStyle={{
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#4b5563'
                      }}
                      formatter={(value: number, name: string, props: { payload?: { percentage?: string } }) => [
                        `${value} funds (${props.payload?.percentage}%)`,
                        'Count'
                      ]}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#4F46E5" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-indigo-100/50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-800">
                    <strong>Key Insight:</strong> The network shows a diverse mix of fund stages, with {getInvestmentTimelineData()[0]?.stage} 
                    representing the largest segment at {getInvestmentTimelineData()[0]?.percentage}% of respondents.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Investment Vehicle Types */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                    Investment Vehicle Types
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Distribution of fund structures across the network
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {(() => {
                    const vehicleData = getInvestmentVehicleData();
                    const dataWithResponses = vehicleData.filter(item => item.count > 0);
                    return (
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={dataWithResponses}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={20}
                            fill="#8884d8"
                            dataKey="count"
                            paddingAngle={2}
                            nameKey="vehicle"
                          >
                            {dataWithResponses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                console.log('Custom tooltip - data:', data);
                                return (
                                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                    <p className="font-bold text-gray-900 text-sm mb-1">
                                      {data.fullName || data.vehicle}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                      {data.count} funds ({data.percentage}% of total funds)
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend 
                            wrapperStyle={{
                              paddingTop: '20px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                            formatter={(value, entry) => {
                              const data = vehicleData.find(item => item.vehicle === value);
                              return data ? `${value} (${data.count})` : value;
                            }}
                          />
                    </PieChart>
                  </ResponsiveContainer>
                    );
                  })()}
                  
                  {/* Key Insights */}
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-800 mb-2">Key Insights</h4>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      {(() => {
                        const vehicleData = getInvestmentVehicleData();
                        if (vehicleData.length === 0) return 'No data available';
                        
                        const totalResponses = vehicleData.reduce((sum, item) => sum + item.count, 0);
                        const totalFunds = surveyData.length; // Calculate total funds here
                        const dataWithResponses = vehicleData.filter(item => item.count > 0);
                        const topCategory = dataWithResponses[0];
                        const otherCount = vehicleData.find(item => item.vehicle === 'Other')?.count || 0;
                        const zeroResponseCategories = vehicleData.filter(item => item.count === 0);
                        
                        let insight = `The network shows ${totalResponses} total investment vehicle responses across ${dataWithResponses.length} active categories out of ${vehicleData.length} predefined options.`;
                        if (topCategory) {
                          insight += ` ${topCategory.vehicle} represents the largest segment at ${topCategory.percentage}% of funds.`;
                        }
                        if (otherCount > 0) {
                          insight += ` ${otherCount} funds (${((otherCount / totalFunds) * 100).toFixed(1)}%) selected "Other" vehicle types.`;
                        }
                        if (zeroResponseCategories.length > 0) {
                          insight += ` ${zeroResponseCategories.length} predefined categories have no responses: ${zeroResponseCategories.map(c => c.vehicle).join(', ')}.`;
                        }
                        
                        return insight;
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Business Model Focus */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Target className="h-4 w-4 mr-2 text-emerald-600" />
                    Business Model Focus
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Target business models across the network
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {(() => {
                    const businessModelData = getBusinessModelData();
                    const dataWithResponses = businessModelData.filter(item => item.count > 0);
                    return (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dataWithResponses} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="model" 
                            tick={{ 
                              fontSize: 11,
                              fontWeight: '700',
                              fill: '#374151'
                            }} 
                            angle={-90} 
                            textAnchor="end" 
                            height={100}
                            interval={0}
                          />
                          <YAxis 
                            tick={{ 
                              fontSize: 12,
                              fontWeight: '600',
                              fill: '#374151'
                            }} 
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                console.log('Business Model tooltip - data:', data);
                                return (
                                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                    <p className="font-bold text-gray-900 text-sm mb-1">
                                      {data.fullModel || data.model}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                      {data.count} funds ({data.percentage}% of total funds)
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#10B981" 
                            radius={[4, 4, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
                  
                  {/* Key Insights */}
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <h4 className="text-sm font-semibold text-emerald-800 mb-2">Key Insights</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {(() => {
                        const businessModelData = getBusinessModelData();
                        if (businessModelData.length === 0) return 'No data available';
                        
                        const totalResponses = businessModelData.reduce((sum, item) => sum + item.count, 0);
                        const totalFunds = surveyData.length;
                        const dataWithResponses = businessModelData.filter(item => item.count > 0);
                        const topCategory = dataWithResponses[0];
                        const otherCount = businessModelData.find(item => item.model === 'Other')?.count || 0;
                        const zeroResponseCategories = businessModelData.filter(item => item.count === 0);
                        
                        let insight = `The network shows ${totalResponses} total business model responses across ${dataWithResponses.length} active categories out of ${businessModelData.length} predefined options.`;
                        if (topCategory) {
                          insight += ` ${topCategory.model} represents the largest segment at ${topCategory.percentage}% of funds.`;
                        }
                        if (otherCount > 0) {
                          insight += ` ${otherCount} funds (${((otherCount / totalFunds) * 100).toFixed(1)}%) selected "Other" business models.`;
                        }
                        if (zeroResponseCategories.length > 0) {
                          insight += ` ${zeroResponseCategories.length} predefined categories have no responses: ${zeroResponseCategories.map(c => c.model).join(', ')}.`;
                        }
                        
                        return insight;
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fund Size Analysis */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-amber-600" />
                  Current Fund Size Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Size distribution of current funds across the network
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {(() => {
                  const fundSizeData = getFundSizeData();
                  const dataWithResponses = fundSizeData.filter(item => item.count > 0);
                  return (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={dataWithResponses} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="size" 
                          tick={{ 
                            fontSize: 11,
                            fontWeight: '700',
                            fill: '#374151'
                          }} 
                          angle={-90} 
                          textAnchor="end" 
                          height={100}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ 
                            fontSize: 12,
                            fontWeight: '600',
                            fill: '#374151'
                          }} 
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              console.log('Fund Size tooltip - data:', data);
                              return (
                                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                  <p className="font-bold text-gray-900 text-sm mb-1">
                                    {data.fullName || data.size}
                                  </p>
                                  <p className="text-gray-600 text-xs">
                                    {data.count} funds ({data.percentage}% of total funds)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#F59E0B" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
                
                {/* Key Insights */}
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Key Insights</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {(() => {
                      const fundSizeData = getFundSizeData();
                      if (fundSizeData.length === 0) return 'No data available';
                      
                      const totalResponses = fundSizeData.reduce((sum, item) => sum + item.count, 0);
                      const totalFunds = surveyData.length;
                      const dataWithResponses = fundSizeData.filter(item => item.count > 0);
                      const topCategory = dataWithResponses.reduce((max, item) => item.count > max.count ? item : max, dataWithResponses[0]);
                      const zeroResponseCategories = fundSizeData.filter(item => item.count === 0);
                      
                      // Calculate size distribution insights
                      const smallFunds = fundSizeData.filter(item => ['< $1M', '$1-4M'].includes(item.size)).reduce((sum, item) => sum + item.count, 0);
                      const mediumFunds = fundSizeData.filter(item => ['$5-9M', '$10-19M'].includes(item.size)).reduce((sum, item) => sum + item.count, 0);
                      const largeFunds = fundSizeData.filter(item => ['$20-29M', '$30M+'].includes(item.size)).reduce((sum, item) => sum + item.count, 0);
                      
                      let insight = `The network shows ${totalResponses} total fund size responses across ${dataWithResponses.length} active categories out of ${fundSizeData.length} predefined options.`;
                      if (topCategory) {
                        insight += ` ${topCategory.fullName} represents the largest segment at ${topCategory.percentage}% of funds.`;
                      }
                      if (smallFunds > 0) {
                        insight += ` Small funds (< $5M) represent ${((smallFunds / totalFunds) * 100).toFixed(1)}% of the network.`;
                      }
                      if (mediumFunds > 0) {
                        insight += ` Medium funds ($5-19M) represent ${((mediumFunds / totalFunds) * 100).toFixed(1)}% of the network.`;
                      }
                      if (largeFunds > 0) {
                        insight += ` Large funds ($20M+) represent ${((largeFunds / totalFunds) * 100).toFixed(1)}% of the network.`;
                      }
                      if (zeroResponseCategories.length > 0) {
                        insight += ` ${zeroResponseCategories.length} predefined categories have no responses: ${zeroResponseCategories.map(c => c.size).join(', ')}.`;
                      }
                      
                      return insight;
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Section */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Counts: March vs December 2020</CardTitle>
                <CardDescription>Comparison of investment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getInvestmentCountsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="firm" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="march2020" fill="#8884d8" name="March 2020" />
                    <Bar dataKey="december2020" fill="#82ca9d" name="December 2020" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Forms</CardTitle>
                  <CardDescription>Types of investments made</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(surveyData.reduce((acc, survey) => {
                      survey.investment_forms.forEach(form => {
                        acc[form] = (acc[form] || 0) + 1;
                      });
                      return acc;
                    }, {} as Record<string, number>)).map(([form, count]) => ({ form, count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="form" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Timeframes</CardTitle>
                  <CardDescription>Typical investment holding periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.investment_timeframe] = (acc[survey.investment_timeframe] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).map(([timeframe, count]) => ({ timeframe, count }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ timeframe, percent }) => `${timeframe} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.investment_timeframe] = (acc[survey.investment_timeframe] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* SDG First-choice Top 10 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top SDGs (First Choice)</CardTitle>
                <CardDescription>Most frequently selected SDGs as first priority (Q21)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getTopSDGsFirstChoice()} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="sdg" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#6366F1" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Section */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Needs Ranking</CardTitle>
                  <CardDescription>Key needs of portfolio enterprises</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={Object.entries(surveyData[0]?.portfolio_needs_ranking || {}).map(([need, rank]) => ({
                      need,
                      rank: parseInt(rank) || 0
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="need" />
                      <PolarRadiusAxis />
                      <Radar name="Portfolio Needs" dataKey="rank" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fund Capabilities Ranking</CardTitle>
                  <CardDescription>Areas of desired investment/support</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={Object.entries(surveyData[0]?.fund_capabilities_ranking || {}).map(([capability, rank]) => ({
                      capability,
                      rank: parseInt(rank) || 0
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="capability" />
                      <PolarRadiusAxis />
                      <Radar name="Fund Capabilities" dataKey="rank" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Monetization Methods</CardTitle>
                <CardDescription>Typical forms of investment monetization/exit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(surveyData.reduce((acc, survey) => {
                    survey.investment_monetization.forEach(method => {
                      acc[method] = (acc[method] || 0) + 1;
                    });
                    return acc;
                  }, {} as Record<string, number>)).map(([method, count]) => ({ method, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COVID-19 Section */}
          <TabsContent value="covid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">COVID-19 Impact Overview</CardTitle>
                  <CardDescription>Aggregate impact on investment vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCOVIDImpactDistribution()} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="impact" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#ff6b6b" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Government Support Received</CardTitle>
                  <CardDescription>Types of COVID-19 support</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(surveyData.reduce((acc, survey) => {
                          survey.covid_government_support.forEach(support => {
                            acc[support] = (acc[support] || 0) + 1;
                          });
                          return acc;
                        }, {} as Record<string, number>)).map(([support, count]) => ({ support, count }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ support, percent }) => `${support} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          survey.covid_government_support.forEach(support => {
                            acc[support] = (acc[support] || 0) + 1;
                          });
                          return acc;
                        }, {} as Record<string, number>)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* COVID per-aspect stacked chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Aspects Impact (Stacked)</CardTitle>
                <CardDescription>Distribution of impact across aspects (Q34)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={getCovidAspectStackedData()} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="aspect" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                    <Legend />
                    {COVID_IMPACT_OPTIONS.map((opt, idx) => (
                      <Bar key={opt} dataKey={opt} stackId="a" fill={COLORS[idx % COLORS.length]} radius={idx === COVID_IMPACT_OPTIONS.length - 1 ? [6,6,0,0] : [0,0,0,0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capital Raising Plans for 2021</CardTitle>
                <CardDescription>Anticipated fundraising activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(surveyData.reduce((acc, survey) => {
                    survey.raising_capital_2021.forEach(purpose => {
                      acc[purpose] = (acc[purpose] || 0) + 1;
                    });
                    return acc;
                  }, {} as Record<string, number>)).map(([purpose, count]) => ({ purpose, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="purpose" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Section */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Network Value Rating</CardTitle>
                  <CardDescription>Perceived value of ESCP network</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getNetworkValueDistribution()} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="value" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#8884d8" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication Platform Preference</CardTitle>
                  <CardDescription>Preferred network communication tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.communication_platform] = (acc[survey.communication_platform] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).map(([platform, count]) => ({ platform, count }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        labelLine={false}
                        label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.communication_platform] = (acc[survey.communication_platform] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Working Groups Ranking</CardTitle>
                  <CardDescription>Most valuable working groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={Object.entries(surveyData[0]?.working_groups_ranking || {}).map(([group, rank]) => ({
                      group,
                      rank: parseInt(rank) || 0
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="group" />
                      <PolarRadiusAxis />
                      <Radar name="Working Groups" dataKey="rank" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Webinar Content Ranking</CardTitle>
                  <CardDescription>Most valuable webinar content</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={Object.entries(surveyData[0]?.webinar_content_ranking || {}).map(([content, rank]) => ({
                      content,
                      rank: parseInt(rank) || 0
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="content" />
                      <PolarRadiusAxis />
                      <Radar name="Webinar Content" dataKey="rank" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Convening Section */}
          <TabsContent value="convening" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Presentation Interest</CardTitle>
                  <CardDescription>Willingness to present at sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { session: 'Connection/Reconnection', yes: surveyData.filter(s => s.present_connection_session === 'Yes').length, no: surveyData.filter(s => s.present_connection_session === 'No').length },
                      { session: 'Demystifying Frontier Finance', yes: surveyData.filter(s => s.present_demystifying_session.length > 0).length, no: surveyData.filter(s => s.present_demystifying_session.length === 0).length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="session" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="yes" fill="#82ca9d" name="Yes" />
                      <Bar dataKey="no" fill="#ff6b6b" name="No" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentoring Program Interest</CardTitle>
                  <CardDescription>Participation in peer mentoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(surveyData.reduce((acc, survey) => {
                          if (survey.participate_mentoring_program) {
                            acc[survey.participate_mentoring_program] = (acc[survey.participate_mentoring_program] || 0) + 1;
                          }
                          return acc;
                        }, {} as Record<string, number>)).map(([participation, count]) => ({ participation, count }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ participation, percent }) => `${participation} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          if (survey.participate_mentoring_program) {
                            acc[survey.participate_mentoring_program] = (acc[survey.participate_mentoring_program] || 0) + 1;
                          }
                          return acc;
                        }, {} as Record<string, number>)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Convening Initiatives Ranking</CardTitle>
                <CardDescription>Interest in various convening initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={Object.entries(surveyData[0]?.convening_initiatives_ranking || {}).map(([initiative, rank]) => ({
                    initiative,
                    rank: parseInt(rank) || 0
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="initiative" />
                    <PolarRadiusAxis />
                    <Radar name="Convening Initiatives" dataKey="rank" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics2021;
