
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
      // Fetch survey responses for analytics
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('*');

      if (surveysError) throw surveysError;

      // Fetch user data
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (usersError) throw usersError;

      // Process data for analytics
      const processedData = processAnalyticsData(surveys || [], users || []);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (surveys, users) => {
    // Sample data processing - in real app, this would be more comprehensive
    const totalFunds = surveys.length;
    const totalCapital = surveys.reduce((sum, survey) => sum + (parseFloat(survey.target_capital) || 0), 0);
    const averageTicketSize = surveys.reduce((sum, survey) => {
      const min = parseFloat(survey.ticket_size_min) || 0;
      const max = parseFloat(survey.ticket_size_max) || 0;
      return sum + ((min + max) / 2);
    }, 0) / surveys.length || 0;
    const completedSurveys = surveys.filter(s => s.completed_at).length;

    // Mock data for charts
    const sectorDistribution = [
      { name: 'Agri/Food Value Chain', value: 25, color: '#3b82f6' },
      { name: 'Software/SaaS', value: 20, color: '#10b981' },
      { name: 'Clean Energy', value: 18, color: '#f59e0b' },
      { name: 'Manufacturing', value: 15, color: '#ef4444' },
      { name: 'Healthcare', value: 12, color: '#8b5cf6' },
      { name: 'Education', value: 10, color: '#06b6d4' }
    ];

    const geographicDistribution = [
      { region: 'East Africa', funds: 45, capital: 850 },
      { region: 'West Africa', funds: 38, capital: 720 },
      { region: 'Southern Africa', funds: 32, capital: 650 },
      { region: 'North Africa', funds: 28, capital: 480 },
      { region: 'Central Africa', funds: 22, capital: 380 }
    ];

    const fundStageDistribution = [
      { stage: 'Implementation', count: 35 },
      { stage: 'Scale', count: 28 },
      { stage: 'Pilot', count: 22 },
      { stage: 'Ideation', count: 15 }
    ];

    const monthlyGrowth = [
      { month: 'Jan', users: 12, surveys: 8 },
      { month: 'Feb', users: 18, surveys: 12 },
      { month: 'Mar', users: 25, surveys: 18 },
      { month: 'Apr', users: 32, surveys: 24 },
      { month: 'May', users: 40, surveys: 32 },
      { month: 'Jun', users: 48, surveys: 38 }
    ];

    const capitalDeployment = [
      { quarter: 'Q1', deployed: 125, raised: 150 },
      { quarter: 'Q2', deployed: 180, raised: 220 },
      { quarter: 'Q3', deployed: 240, raised: 280 },
      { quarter: 'Q4', deployed: 320, raised: 380 }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
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
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-white">
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
                <SelectTrigger className="w-[180px]">
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
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Funds</p>
                  <p className="text-2xl font-bold text-black">{formatNumber(analyticsData.totalFunds)}</p>
                  <p className="text-xs text-green-600">+12% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Target Capital</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(analyticsData.totalCapital / 1000000)}M</p>
                  <p className="text-xs text-green-600">+18% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Ticket Size</p>
                  <p className="text-2xl font-bold text-black">{formatCurrency(analyticsData.averageTicketSize)}</p>
                  <p className="text-xs text-green-600">+8% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Surveys</p>
                  <p className="text-2xl font-bold text-black">{formatNumber(analyticsData.completedSurveys)}</p>
                  <p className="text-xs text-green-600">+25% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Platform Growth</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle>Fund Stage Distribution</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Capital Deployment Trends</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle>Sector Distribution</CardTitle>
                  <CardDescription>Investment focus by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsPieChart>
                      <Pie
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
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sector Breakdown</CardTitle>
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
                          <span className="text-sm font-medium">{sector.name}</span>
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
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
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
              <p className="text-gray-600">Detailed performance metrics coming soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="text-center py-16">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-600">Advanced trend analysis coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
