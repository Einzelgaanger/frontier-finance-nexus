
import { useState, useEffect, useCallback } from 'react';
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
  AreaChart,
  ScatterChart,
  Scatter,
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
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('all');

  const fetchSurveyData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null);

      // Apply year filter
      if (selectedYear) {
        query = query.eq('year', selectedYear);
      }

      // Apply time range filter
      if (timeRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (timeRange) {
          case 'last_30_days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last_90_days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'last_6_months':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query.gte('completed_at', startDate.toISOString());
        }
      }

      const { data, error } = await query;

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
  }, [selectedYear, timeRange, toast]);

  useEffect(() => {
    if (userRole === 'member' || userRole === 'admin') {
      fetchSurveyData();
    }
  }, [userRole, fetchSurveyData]);

  const calculateMetrics = () => {
    if (!surveyData.length) return {
      totalFunds: 0,
      totalCapital: 0,
      averageTicketSize: 0,
      activeMarkets: 0,
      averageTeamSize: 0,
      averageReturn: 0,
      totalInvestments: 0,
      completionRate: 0
    };

    const totalFunds = surveyData.length;
    
    // Capital metrics
    const totalCapital = surveyData.reduce((sum, fund) => sum + (Number(fund.target_capital) || 0), 0);
    const capitalRaised = surveyData.reduce((sum, fund) => sum + (Number(fund.capital_raised) || 0), 0);
    const capitalInMarket = surveyData.reduce((sum, fund) => sum + (Number(fund.capital_in_market) || 0), 0);
    
    // Ticket size metrics
    const ticketSizes = surveyData.map(fund => {
      const min = Number(fund.ticket_size_min) || 0;
      const max = Number(fund.ticket_size_max) || 0;
      return (min + max) / 2;
    }).filter(size => size > 0);
    
    const averageTicketSize = ticketSizes.length > 0 
      ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
      : 0;

    // Geographic metrics
    const uniqueMarkets = new Set();
    surveyData.forEach(fund => {
      if (fund.legal_domicile && Array.isArray(fund.legal_domicile)) {
        fund.legal_domicile.forEach(market => uniqueMarkets.add(market));
      }
    });

    // Team size metrics
    const teamSizes = surveyData.map(fund => {
      const min = Number(fund.team_size_min) || 0;
      const max = Number(fund.team_size_max) || 0;
      return (min + max) / 2;
    }).filter(size => size > 0);
    
    const averageTeamSize = teamSizes.length > 0 
      ? teamSizes.reduce((sum, size) => sum + size, 0) / teamSizes.length 
      : 0;

    // Return metrics
    const returns = surveyData.map(fund => {
      const min = Number(fund.target_return_min) || 0;
      const max = Number(fund.target_return_max) || 0;
      return (min + max) / 2;
    }).filter(ret => ret > 0);
    
    const averageReturn = returns.length > 0 
      ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length 
      : 0;

    // Investment metrics
    const totalInvestments = surveyData.reduce((sum, fund) => {
      const equityMade = Number(fund.equity_investments_made) || 0;
      const selfLiquidatingMade = Number(fund.self_liquidating_made) || 0;
      return sum + equityMade + selfLiquidatingMade;
    }, 0);

    return {
      totalFunds,
      totalCapital,
      capitalRaised,
      capitalInMarket,
      averageTicketSize,
      activeMarkets: uniqueMarkets.size,
      averageTeamSize,
      averageReturn,
      totalInvestments,
      completionRate: 100 // All data is completed since we filter for completed_at
    };
  };

  const prepareChartData = () => {
    const vehicleTypes = {};
    const fundStages = {};
    const marketData = {};
    const sectorData = {};
    const investmentInstruments = {};
    const fundStatuses = {};

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

      // Sector data
      if (fund.sectors_allocation && typeof fund.sectors_allocation === 'object') {
        Object.entries(fund.sectors_allocation).forEach(([sector, allocation]) => {
          sectorData[sector] = (sectorData[sector] || 0) + (Number(allocation) || 0);
        });
      }

      // Investment instruments
      if (fund.investment_instruments_priority && typeof fund.investment_instruments_priority === 'object') {
        Object.entries(fund.investment_instruments_priority).forEach(([instrument, priority]) => {
          investmentInstruments[instrument] = (investmentInstruments[instrument] || 0) + (Number(priority) || 0);
        });
      }

      // Fund statuses
      const status = fund.current_status || 'Unknown';
      fundStatuses[status] = (fundStatuses[status] || 0) + 1;
    });

    return {
      vehicleTypes: Object.entries(vehicleTypes).map(([name, value]) => ({ name, value })),
      fundStages: Object.entries(fundStages).map(([name, value]) => ({ name, value })),
      marketData: Object.entries(marketData).map(([name, value]) => ({ name, value })),
      sectorData: Object.entries(sectorData).map(([name, value]) => ({ name, value })),
      investmentInstruments: Object.entries(investmentInstruments).map(([name, value]) => ({ name, value })),
      fundStatuses: Object.entries(fundStatuses).map(([name, value]) => ({ name, value }))
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

  const preparePerformanceData = () => {
    return surveyData.map((fund, index) => ({
      name: `Fund ${index + 1}`,
      ticketSize: ((Number(fund.ticket_size_min) || 0) + (Number(fund.ticket_size_max) || 0)) / 2,
      teamSize: ((Number(fund.team_size_min) || 0) + (Number(fund.team_size_max) || 0)) / 2,
      targetReturn: ((Number(fund.target_return_min) || 0) + (Number(fund.target_return_max) || 0)) / 2,
      capitalEfficiency: Number(fund.capital_in_market) / (Number(fund.capital_raised) || 1)
    }));
  };

  const prepareTrendData = () => {
    const yearData: Record<number, {
      year: number;
      funds: number;
      totalCapital: number;
      averageTicket: number;
      averageReturn: number;
    }> = {};
    
    surveyData.forEach(fund => {
      const year = fund.year;
      if (!yearData[year]) {
        yearData[year] = {
          year,
          funds: 0,
          totalCapital: 0,
          averageTicket: 0,
          averageReturn: 0
        };
      }
      
      yearData[year].funds += 1;
      yearData[year].totalCapital += Number(fund.target_capital) || 0;
      
      const ticketSize = ((Number(fund.ticket_size_min) || 0) + (Number(fund.ticket_size_max) || 0)) / 2;
      yearData[year].averageTicket += ticketSize;
      
      const returnRate = ((Number(fund.target_return_min) || 0) + (Number(fund.target_return_max) || 0)) / 2;
      yearData[year].averageReturn += returnRate;
    });

    return Object.values(yearData).map(data => ({
      ...data,
      averageTicket: data.averageTicket / data.funds,
      averageReturn: data.averageReturn / data.funds
    }));
  };

  const metrics = calculateMetrics();
  const chartData = prepareChartData();
  const capitalData = prepareCapitalData();
  const performanceData = preparePerformanceData();
  const trendData = prepareTrendData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

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
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Comprehensive insights from {metrics.totalFunds} fund managers
              </p>
            </div>
            
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Label className="text-sm font-medium text-gray-700">Year:</Label>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger className="w-full sm:w-[120px] border-gray-300 bg-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {[2024, 2025, 2026, 2027].map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Label className="text-sm font-medium text-gray-700">Time Range:</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-[140px] border-gray-300 bg-white">
                      <Clock className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                      <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                      <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Capital</p>
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

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Team Size</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{metrics.averageTeamSize.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Return</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{metrics.averageReturn.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{metrics.totalInvestments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Capital Deployed</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">${(metrics.capitalInMarket / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white h-auto p-1">
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
              value="geography" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Geography
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Performance
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black text-lg sm:text-xl">Sector Allocation</CardTitle>
                  <CardDescription>Investment focus across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.sectorData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black text-lg sm:text-xl">Investment Instruments</CardTitle>
                  <CardDescription>Preferred investment instruments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.investmentInstruments} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
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
                    <ComposedChart data={capitalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, '']} />
                      <Legend />
                      <Bar dataKey="target" fill="#8884d8" name="Target Capital" />
                      <Bar dataKey="raised" fill="#82ca9d" name="Raised Capital" />
                      <Bar dataKey="deployed" fill="#ffc658" name="Deployed Capital" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-4 sm:space-y-6">
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

          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Performance Metrics</CardTitle>
                <CardDescription>Fund performance correlation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ticketSize" name="Ticket Size ($)" />
                      <YAxis dataKey="targetReturn" name="Target Return (%)" />
                      <Tooltip formatter={(value, name) => [
                        name === 'ticketSize' ? `$${(Number(value) / 1000).toFixed(0)}K` : `${value}%`,
                        name === 'ticketSize' ? 'Ticket Size' : 'Target Return'
                      ]} />
                      <Scatter dataKey="targetReturn" fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Year-over-Year Trends</CardTitle>
                <CardDescription>Evolution of fund metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="funds" fill="#8884d8" name="Number of Funds" />
                      <Line yAxisId="right" type="monotone" dataKey="averageReturn" stroke="#82ca9d" name="Avg Return (%)" />
                    </ComposedChart>
                  </ResponsiveContainer>
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
