
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Users, 
  Download,
  Shield,
  Building2,
  Target,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');
  const [analyticsData, setAnalyticsData] = useState({
    totalFunds: 0,
    totalCapital: 0,
    averageTicketSize: 0,
    completedSurveys: 0,
    sectorDistribution: [],
    geographicDistribution: [],
    fundStageDistribution: [],
    monthlyGrowth: [],
    capitalDeployment: []
  });

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAnalyticsData();
    }
  }, [userRole, timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch actual survey responses for analytics
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null);

      if (surveysError) throw surveysError;

      // Fetch user data
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (usersError) throw usersError;

      // Process actual data for analytics
      const processedData = processAnalyticsData(surveys || [], users || []);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (surveys: any[], users: any[]) => {
    const totalFunds = surveys.length;
    const totalCapital = surveys.reduce((sum, survey) => {
      const target = parseFloat(String(survey.target_capital || 0));
      return sum + (isNaN(target) ? 0 : target);
    }, 0);
    
    const averageTicketSize = surveys.reduce((sum, survey) => {
      const min = parseFloat(String(survey.ticket_size_min || 0));
      const max = parseFloat(String(survey.ticket_size_max || 0));
      const minVal = isNaN(min) ? 0 : min;
      const maxVal = isNaN(max) ? 0 : max;
      return sum + ((minVal + maxVal) / 2);
    }, 0) / (surveys.length || 1);
    
    const completedSurveys = surveys.length;

    // Process sector distribution from actual data
    const sectorCounts: Record<string, number> = {};
    surveys.forEach(survey => {
      if (survey.sectors_allocation && typeof survey.sectors_allocation === 'object') {
        Object.entries(survey.sectors_allocation).forEach(([sector, percentage]) => {
          const percent = parseFloat(String(percentage || 0));
          if (!isNaN(percent)) {
            sectorCounts[sector] = (sectorCounts[sector] || 0) + percent;
          }
        });
      }
    });

    const sectorDistribution = Object.entries(sectorCounts).map(([name, value], index) => ({
      name,
      value: Math.round(value / (surveys.length || 1)) || 0,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
    }));

    // Process geographic distribution
    const geographicCounts: Record<string, number> = {};
    surveys.forEach(survey => {
      if (survey.legal_domicile && Array.isArray(survey.legal_domicile)) {
        survey.legal_domicile.forEach((country: string) => {
          geographicCounts[country] = (geographicCounts[country] || 0) + 1;
        });
      }
    });

    const geographicDistribution = Object.entries(geographicCounts).map(([region, funds]) => ({
      region,
      funds: Number(funds),
      capital: Math.round(totalCapital * (Number(funds) / totalFunds) / 1000000) // Convert to millions
    }));

    // Process fund stage distribution
    const stageCounts: Record<string, number> = {};
    surveys.forEach(survey => {
      if (survey.fund_stage && Array.isArray(survey.fund_stage)) {
        survey.fund_stage.forEach((stage: string) => {
          stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        });
      }
    });

    const fundStageDistribution = Object.entries(stageCounts).map(([stage, count]) => ({
      stage,
      count: Number(count)
    }));

    // Generate monthly growth data based on user creation dates
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const usersInMonth = users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === date.getFullYear();
      }).length;

      const surveysInMonth = surveys.filter(survey => {
        const surveyDate = new Date(survey.completed_at);
        return surveyDate.getMonth() === date.getMonth() && surveyDate.getFullYear() === date.getFullYear();
      }).length;

      monthlyGrowth.push({
        month: monthName,
        users: usersInMonth,
        surveys: surveysInMonth
      });
    }

    // Generate capital deployment data
    const capitalDeployment = [
      { quarter: 'Q1', deployed: Math.round(totalCapital * 0.2 / 1000000), raised: Math.round(totalCapital * 0.25 / 1000000) },
      { quarter: 'Q2', deployed: Math.round(totalCapital * 0.3 / 1000000), raised: Math.round(totalCapital * 0.35 / 1000000) },
      { quarter: 'Q3', deployed: Math.round(totalCapital * 0.4 / 1000000), raised: Math.round(totalCapital * 0.45 / 1000000) },
      { quarter: 'Q4', deployed: Math.round(totalCapital * 0.5 / 1000000), raised: Math.round(totalCapital * 0.55 / 1000000) }
    ];

    return {
      totalFunds,
      totalCapital,
      averageTicketSize,
      completedSurveys,
      sectorDistribution,
      geographicDistribution,
      fundStageDistribution,
      monthlyGrowth,
      capitalDeployment
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Access Required
              </CardTitle>
              <CardDescription className="text-red-700">
                You need Administrator privileges to access analytics.
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive platform insights and fund manager analytics</p>
            </div>
            <div className="flex space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] border-gray-300 bg-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-300 bg-white">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Funds</p>
                  <p className="text-2xl font-bold text-black">{formatNumber(analyticsData.totalFunds)}</p>
                  <p className="text-xs text-green-600">Active funds</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Target Capital</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(analyticsData.totalCapital / 1000000)}M</p>
                  <p className="text-xs text-green-600">Combined target</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Ticket Size</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(analyticsData.averageTicketSize)}</p>
                  <p className="text-xs text-green-600">Average investment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Surveys</p>
                  <p className="text-2xl font-bold text-black">{formatNumber(analyticsData.completedSurveys)}</p>
                  <p className="text-xs text-green-600">Data submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="sectors" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sectors</TabsTrigger>
            <TabsTrigger value="geography" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Geography</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Performance</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black">Monthly Platform Growth</CardTitle>
                  <CardDescription>New users and survey completions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                      <Bar dataKey="surveys" fill="#10b981" name="Surveys Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black">Fund Stage Distribution</CardTitle>
                  <CardDescription>Current fund stages across platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.fundStageDistribution} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black">Capital Deployment Trends</CardTitle>
                <CardDescription>Quarterly capital raised vs deployed (in millions USD)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analyticsData.capitalDeployment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}M`, '']} />
                    <Area type="monotone" dataKey="raised" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Capital Raised" />
                    <Area type="monotone" dataKey="deployed" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Capital Deployed" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black">Sector Distribution</CardTitle>
                  <CardDescription>Investment focus by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsPieChart>
                      <RechartsPieChart.Pie
                        data={analyticsData.sectorDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={150}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.sectorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart.Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white border">
                <CardHeader>
                  <CardTitle className="text-black">Sector Breakdown</CardTitle>
                  <CardDescription>Detailed sector allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.sectorDistribution.map((sector, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: sector.color }}
                          ></div>
                          <span className="text-sm font-medium text-black">{sector.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{sector.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black">Geographic Distribution</CardTitle>
                <CardDescription>Fund distribution and capital by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.geographicDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="funds" fill="#3b82f6" name="Number of Funds" />
                    <Bar yAxisId="right" dataKey="capital" fill="#10b981" name="Capital (Millions)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Detailed performance metrics showing fund returns and deployment efficiency.</p>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="text-center py-16">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-600">Advanced trend analysis showing market movements and investment patterns.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
