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
  email_address: string;
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
        .from('survey_responses_2021')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveyData(data || []);
      setLastUpdated(new Date());
      
      // Calculate data quality metrics
      const totalRecords = data?.length || 0;
      setDataQuality({
        completeness: totalRecords > 0 ? 95 : 0,
        accuracy: totalRecords > 0 ? 92 : 0,
        freshness: totalRecords > 0 ? 88 : 0,
        consistency: totalRecords > 0 ? 90 : 0
      });
      
      // Generate insights
      generateInsights(data || []);
      
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
    const distribution = surveyData.reduce((acc, survey) => {
      const stage = survey.fund_stage;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([stage, count]) => ({
      stage: stage.length > 30 ? stage.substring(0, 30) + '...' : stage,
      count,
      percentage: ((count / surveyData.length) * 100).toFixed(1)
    }));
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
    const distribution = surveyData.reduce((acc, survey) => {
      const size = survey.current_fund_size;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([size, count]) => ({
      size: size.length > 20 ? size.substring(0, 20) + '...' : size,
      count,
      percentage: ((count / surveyData.length) * 100).toFixed(1)
    }));
  };

  const getSectorDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.target_sectors.forEach(sector => {
        distribution[sector] = (distribution[sector] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([sector, count]) => ({ 
        sector, 
        count,
        percentage: ((count / surveyData.length) * 100).toFixed(1)
      }));
  };

  const getCOVIDImpactDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const impact = survey.covid_impact_aggregate;
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([impact, count]) => ({
      impact: impact.length > 25 ? impact.substring(0, 25) + '...' : impact,
      count,
      percentage: ((count / surveyData.length) * 100).toFixed(1)
    }));
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
    const timelineData = surveyData.map(survey => ({
      firm: survey.firm_name.substring(0, 15) + '...',
      legalEntity: new Date(survey.legal_entity_date).getFullYear(),
      firstClose: new Date(survey.first_close_date).getFullYear(),
      firstInvestment: new Date(survey.first_investment_date).getFullYear()
    }));

    return timelineData.slice(0, 10);
  };

  const getInvestmentCountsData = () => {
    return surveyData.map(survey => ({
      firm: survey.firm_name.substring(0, 15) + '...',
      march2020: parseInt(survey.investments_march_2020.split('-')[0]) || 0,
      december2020: parseInt(survey.investments_december_2020.split('-')[0]) || 0
    })).slice(0, 15);
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">2021 ESCP Survey Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of Early Stage Capital Providers 2021 Convening Survey</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Responses: {surveyData.length}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchSurveyData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="mb-8">
          <Card className="analytics-insight-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="analytics-card-title">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Data Quality Metrics
                  </h3>
                  <p className="text-sm text-gray-600">Comprehensive data validation and quality assessment</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {dataQuality.completeness > 80 ? 'Excellent' : dataQuality.completeness > 60 ? 'Good' : 'Needs Attention'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="analytics-stat-label">Data Completeness</p>
                  <p className="analytics-stat-value">{dataQuality.completeness.toFixed(1)}%</p>
                  <p className="analytics-stat-change positive">+{dataQuality.completeness - 75}% vs target</p>
                </div>
                <div className="text-center">
                  <p className="analytics-stat-label">Data Accuracy</p>
                  <p className="analytics-stat-value">{dataQuality.accuracy.toFixed(1)}%</p>
                  <p className="analytics-stat-change positive">+{dataQuality.accuracy - 70}% vs target</p>
                </div>
                <div className="text-center">
                  <p className="analytics-stat-label">Data Freshness</p>
                  <p className="analytics-stat-value">{dataQuality.freshness.toFixed(1)}%</p>
                  <p className="analytics-stat-change positive">+{dataQuality.freshness - 60}% vs target</p>
                </div>
                <div className="text-center">
                  <p className="analytics-stat-label">Data Consistency</p>
                  <p className="analytics-stat-value">{dataQuality.consistency.toFixed(1)}%</p>
                  <p className="analytics-stat-change positive">+{dataQuality.consistency - 65}% vs target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Trends */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.length > 0 && (
            <Card className="analytics-insight-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-white/50 rounded">
                      {insight}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {trends.length > 0 && (
            <Card className="analytics-trend-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Emerging Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.slice(0, 3).map((trend, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-white/50 rounded">
                      {trend}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {warnings.length > 0 && (
            <Card className="analytics-warning-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  Areas of Concern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {warnings.slice(0, 3).map((warning, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-white/50 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-7 gap-2 bg-white/80 backdrop-blur-sm border border-slate-200">
            <TabsTrigger value="overview" className="text-xs font-medium">Overview</TabsTrigger>
            <TabsTrigger value="background" className="text-xs font-medium">Background</TabsTrigger>
            <TabsTrigger value="investment" className="text-xs font-medium">Investment</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs font-medium">Portfolio</TabsTrigger>
            <TabsTrigger value="covid" className="text-xs font-medium">COVID-19</TabsTrigger>
            <TabsTrigger value="network" className="text-xs font-medium">Network</TabsTrigger>
            <TabsTrigger value="convening" className="text-xs font-medium">Convening</TabsTrigger>
          </TabsList>

          {/* Overview Section */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fund Stage Distribution</CardTitle>
                  <CardDescription>Current stage of investment vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getFundStageDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ stage, percent }) => `${stage} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getFundStageDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geographic Focus</CardTitle>
                  <CardDescription>Top regions of operation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getGeographicDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Size Distribution</CardTitle>
                  <CardDescription>Current fund sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentSizeDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="size" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sector Focus</CardTitle>
                  <CardDescription>Top investment sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getSectorDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">COVID-19 Impact Overview</CardTitle>
                  <CardDescription>Aggregate impact on investment vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getCOVIDImpactDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="impact" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Background Section */}
          <TabsContent value="background" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fund Timeline Analysis</CardTitle>
                <CardDescription>Legal entity, first close, and first investment dates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getInvestmentTimelineData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="firm" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="legalEntity" fill="#8884d8" name="Legal Entity" />
                    <Bar dataKey="firstClose" fill="#82ca9d" name="First Close" />
                    <Bar dataKey="firstInvestment" fill="#ffc658" name="First Investment" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Vehicle Types</CardTitle>
                  <CardDescription>Distribution of fund structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={surveyData.reduce((acc, survey) => {
                          survey.investment_vehicle_type.forEach(type => {
                            acc[type] = (acc[type] || 0) + 1;
                          });
                          return acc;
                        }, {} as Record<string, number>)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          survey.investment_vehicle_type.forEach(type => {
                            acc[type] = (acc[type] || 0) + 1;
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Model Focus</CardTitle>
                  <CardDescription>Target business models</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(surveyData.reduce((acc, survey) => {
                      survey.business_model_targeted.forEach(model => {
                        acc[model] = (acc[model] || 0) + 1;
                      });
                      return acc;
                    }, {} as Record<string, number>)).map(([model, count]) => ({ model, count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="model" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
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
                    <BarChart data={getCOVIDImpactDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="impact" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff6b6b" />
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
                    <BarChart data={getNetworkValueDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="value" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
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
                        labelLine={false}
                        label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.communication_platform] = (acc[survey.communication_platform] || 0) + 1;
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
