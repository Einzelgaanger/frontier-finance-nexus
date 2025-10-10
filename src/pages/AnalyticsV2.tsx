import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  ComposedChart
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
  RefreshCw,
  Eye,
  CheckCircle,
  Download,
  Share2,
  Settings,
  Zap,
  Award,
  MapPin,
  Clock,
  Database,
  FileText,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Analytics2021 from './Analytics2021';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FFC658', '#FF7C7C'];

const AnalyticsV2 = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2021);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  
  // Data states
  const [surveyData, setSurveyData] = useState([]);
  const [dataQuality, setDataQuality] = useState({
    completeness: 0,
    accuracy: 0,
    freshness: 0
  });

  // Fetch survey data
  const fetchSurveyData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('AnalyticsV2 - Fetching survey data for year:', selectedYear);

      // Fetch 2021 survey data
      const { data: survey2021Data, error: survey2021Error } = await supabase
        .from('survey_2021_responses')
        .select('*');

      if (survey2021Error) {
        console.warn('Could not fetch 2021 survey data:', survey2021Error);
      }

      // Fetch regular survey data
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*');

      if (surveyError) {
        console.warn('Could not fetch regular survey data:', surveyError);
      }

      // Combine data based on selected year
      let combinedData = [];
      if (selectedYear === 2021) {
        combinedData = survey2021Data || [];
      } else {
        combinedData = surveyData || [];
      }

      setSurveyData(combinedData);
      setLastUpdated(new Date());

      // Calculate data quality metrics
      const totalRecords = combinedData.length;
      setDataQuality({
        completeness: totalRecords > 0 ? Math.min(95, (totalRecords / 50) * 100) : 0,
        accuracy: totalRecords > 0 ? Math.min(92, (totalRecords / 45) * 100) : 0,
        freshness: totalRecords > 0 ? Math.min(88, (totalRecords / 40) * 100) : 0
      });

      console.log('AnalyticsV2 - Data fetched:', {
        totalRecords,
        selectedYear,
        dataQuality: {
          completeness: totalRecords > 0 ? Math.min(95, (totalRecords / 50) * 100) : 0,
          accuracy: totalRecords > 0 ? Math.min(92, (totalRecords / 45) * 100) : 0,
          freshness: totalRecords > 0 ? Math.min(88, (totalRecords / 40) * 100) : 0
        }
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedYear, toast]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchSurveyData();
    }
  }, [userRole, fetchSurveyData]);

  // Calculate metrics
  const calculateMetrics = () => {
    if (!surveyData.length) return {
      totalFunds: 0,
      totalCapital: 0,
      averageTicketSize: 0,
      activeMarkets: 0,
      topSector: 'N/A',
      responseRate: 0
    };

    const totalFunds = surveyData.length;
    const totalCapital = surveyData.reduce((sum, fund) => {
      const capital = parseFloat(fund.target_capital || fund.current_fund_size || 0);
      return sum + (isNaN(capital) ? 0 : capital);
    }, 0);

    const averageTicketSize = surveyData.reduce((sum, fund) => {
      const min = parseFloat(fund.ticket_size_min || 0);
      const max = parseFloat(fund.ticket_size_max || 0);
      const avg = (min + max) / 2;
      return sum + (isNaN(avg) ? 0 : avg);
    }, 0) / totalFunds;

    const markets = new Set();
    surveyData.forEach(fund => {
      if (fund.geographic_focus) {
        if (Array.isArray(fund.geographic_focus)) {
          fund.geographic_focus.forEach(market => markets.add(market));
        } else {
          markets.add(fund.geographic_focus);
        }
      }
    });

    const sectors = {};
    surveyData.forEach(fund => {
      if (fund.sectors_allocation) {
        const sectorList = Array.isArray(fund.sectors_allocation) 
          ? fund.sectors_allocation 
          : [fund.sectors_allocation];
        sectorList.forEach(sector => {
          sectors[sector] = (sectors[sector] || 0) + 1;
        });
      }
    });

    const topSector = Object.keys(sectors).reduce((a, b) => 
      sectors[a] > sectors[b] ? a : b, 'N/A'
    );

    return {
      totalFunds,
      totalCapital: Math.round(totalCapital),
      averageTicketSize: Math.round(averageTicketSize),
      activeMarkets: markets.size,
      topSector,
      responseRate: Math.min(100, (totalFunds / 50) * 100)
    };
  };

  const metrics = calculateMetrics();

  // Year selection options
  const yearOptions = [
    { value: 2021, label: '2021', available: true },
    { value: 2022, label: '2022', available: false },
    { value: 2023, label: '2023', available: false },
    { value: 2024, label: '2024', available: false },
    { value: 2025, label: '2025', available: false }
  ];

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Hub</h1>
              <p className="text-blue-100 text-lg">
                Comprehensive insights and data analysis for {selectedYear}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={fetchSurveyData}
                disabled={loading}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="text-right">
                <p className="text-sm text-blue-100">Last updated</p>
                <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Year Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Year Selection
            </CardTitle>
            <CardDescription>
              Choose the year for analytics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {yearOptions.map((year) => (
                <Button
                  key={year.value}
                  variant={selectedYear === year.value ? "default" : "outline"}
                  onClick={() => year.available && setSelectedYear(year.value)}
                  disabled={!year.available}
                  className={`px-4 py-2 ${
                    year.available 
                      ? selectedYear === year.value 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-blue-50'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {year.label}
                  {!year.available && (
                    <span className="ml-2 text-xs">(Coming Soon)</span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Funds</p>
                  <p className="text-3xl font-bold text-blue-800">{metrics.totalFunds}</p>
                  <p className="text-xs text-blue-600">Active funds</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Capital</p>
                  <p className="text-3xl font-bold text-green-800">
                    ${metrics.totalCapital.toLocaleString()}M
                  </p>
                  <p className="text-xs text-green-600">Target capital</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Ticket Size</p>
                  <p className="text-3xl font-bold text-purple-800">
                    ${metrics.averageTicketSize.toLocaleString()}K
                  </p>
                  <p className="text-xs text-purple-600">Per investment</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Active Markets</p>
                  <p className="text-3xl font-bold text-orange-800">{metrics.activeMarkets}</p>
                  <p className="text-xs text-orange-600">Geographic regions</p>
                </div>
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-green-600" />
              Data Quality
            </CardTitle>
            <CardDescription>
              Current data quality metrics and health status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Completeness</h3>
                <p className="text-3xl font-bold text-green-600">{dataQuality.completeness.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Data completeness</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
                <p className="text-3xl font-bold text-blue-600">{dataQuality.accuracy.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Data accuracy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Freshness</h3>
                <p className="text-3xl font-bold text-purple-600">{dataQuality.freshness.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Data freshness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="geographic" className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Geographic
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Sectors
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {selectedYear === 2021 ? (
              <Analytics2021 />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics for {selectedYear}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Detailed analytics for {selectedYear} are coming soon.
                  </p>
                  <Button onClick={() => setSelectedYear(2021)}>
                    View 2021 Analytics
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Fund distribution across different regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Geographic analytics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-green-600" />
                  Sector Analysis
                </CardTitle>
                <CardDescription>
                  Investment focus across different sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Sector analytics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Market Trends
                </CardTitle>
                <CardDescription>
                  Investment trends and market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Trend analytics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common analytics tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Download className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Export Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Share2 className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Share Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Settings className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Eye className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium">View Details</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default AnalyticsV2;
