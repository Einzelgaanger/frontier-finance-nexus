
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AreaChart
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
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Analytics = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMetric, setSelectedMetric] = useState('target_capital');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (userRole === 'member' || userRole === 'admin') {
      fetchSurveyData();
    }
  }, [userRole, selectedYear]);

  const fetchSurveyData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('year', selectedYear)
        .not('completed_at', 'is', null);

      if (error) throw error;
      setSurveyData(data || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!surveyData.length) return {
      totalFunds: 0,
      totalCapital: 0,
      averageTicketSize: 0,
      activeMarkets: 0
    };

    const totalFunds = surveyData.length;
    const totalCapital = surveyData.reduce((sum, fund) => sum + (Number(fund.target_capital) || 0), 0);
    const averageTicketSize = surveyData.reduce((sum, fund) => {
      const avgTicket = ((Number(fund.ticket_size_min) || 0) + (Number(fund.ticket_size_max) || 0)) / 2;
      return sum + avgTicket;
    }, 0) / totalFunds;
    
    const uniqueMarkets = new Set();
    surveyData.forEach(fund => {
      if (fund.legal_domicile && Array.isArray(fund.legal_domicile)) {
        fund.legal_domicile.forEach(market => uniqueMarkets.add(market));
      }
    });

    return {
      totalFunds,
      totalCapital,
      averageTicketSize,
      activeMarkets: uniqueMarkets.size
    };
  };

  const prepareChartData = () => {
    const vehicleTypes = {};
    const fundStages = {};
    const marketData = {};

    surveyData.forEach(fund => {
      // Vehicle types
      const vehicleType = fund.vehicle_type || 'Unknown';
      vehicleTypes[vehicleType] = (vehicleTypes[vehicleType] || 0) + 1;

      // Fund stages
      if (fund.fund_stage && Array.isArray(fund.fund_stage)) {
        fund.fund_stage.forEach(stage => {
          fundStages[stage] = (fundStages[stage] || 0) + 1;
        });
      }

      // Market data
      if (fund.legal_domicile && Array.isArray(fund.legal_domicile)) {
        fund.legal_domicile.forEach(market => {
          marketData[market] = (marketData[market] || 0) + 1;
        });
      }
    });

    return {
      vehicleTypes: Object.entries(vehicleTypes).map(([name, value]) => ({ name, value })),
      fundStages: Object.entries(fundStages).map(([name, value]) => ({ name, value })),
      marketData: Object.entries(marketData).map(([name, value]) => ({ name, value }))
    };
  };

  const prepareCapitalData = () => {
    return surveyData.map((fund, index) => ({
      name: `Fund ${index + 1}`,
      target: Number(fund.target_capital) || 0,
      raised: Number(fund.capital_raised) || 0,
      deployed: Number(fund.capital_in_market) || 0
    }));
  };

  const metrics = calculateMetrics();
  const chartData = prepareChartData();
  const capitalData = prepareCapitalData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (userRole !== 'member' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Access Restricted</CardTitle>
              <CardDescription className="text-red-700">
                You need Member access to view analytics data.
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
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                Fund Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Insights and trends from fund manager survey data</p>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center sm:w-auto border-gray-300 bg-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Label className="text-sm font-medium text-gray-700">Year:</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-full sm:w-[120px] border-gray-300 bg-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026, 2027].map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Funds</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{metrics.totalFunds}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Target Capital</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">${(metrics.totalCapital / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Ticket</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">${(metrics.averageTicketSize / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Markets</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{metrics.activeMarkets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white h-auto p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="capital" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Capital
            </TabsTrigger>
            <TabsTrigger 
              value="markets" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Markets
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black text-lg sm:text-xl">Vehicle Types Distribution</CardTitle>
                  <CardDescription>Breakdown of fund vehicle structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.vehicleTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.vehicleTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black text-lg sm:text-xl">Fund Stages</CardTitle>
                  <CardDescription>Current stage distribution of funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.fundStages}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.fundStages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capital" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Capital Analysis</CardTitle>
                <CardDescription>Target vs Raised vs Deployed Capital by Fund</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capitalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, '']} />
                      <Legend />
                      <Bar dataKey="target" fill="#8884d8" name="Target Capital" />
                      <Bar dataKey="raised" fill="#82ca9d" name="Raised Capital" />
                      <Bar dataKey="deployed" fill="#ffc658" name="Deployed Capital" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Geographic Distribution</CardTitle>
                <CardDescription>Fund presence across different markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.marketData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Investment Trends</CardTitle>
                <CardDescription>Trends in fund performance and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Trend Analysis Coming Soon</h3>
                  <p className="text-sm sm:text-base text-gray-600">Historical trend analysis will be available with more data points.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
