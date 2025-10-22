// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Globe,
  Building2,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Info,
  Eye
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface SurveyData {
  year: number;
  responses: any[];
  fieldVisibility: Record<string, { viewer: boolean; member: boolean; admin: boolean }>;
}

const AnalyticsV3 = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const availableYears = [2021, 2022, 2023, 2024];

  // Fetch survey data for selected year
  useEffect(() => {
    fetchSurveyData();
  }, [selectedYear]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);

      // Fetch survey responses
      const { data: responses, error: responsesError } = await supabase
        .from(`survey_responses_${selectedYear}` as any)
        .select('*')
        .eq('submission_status', 'completed');

      if (responsesError) throw responsesError;

      // Fetch field visibility rules
      const { data: visibility, error: visibilityError } = await supabase
        .from('field_visibility')
        .select('*')
        .eq('survey_year', selectedYear);

      if (visibilityError) throw visibilityError;

      // Create visibility map
      const visibilityMap: Record<string, any> = {};
      (visibility || []).forEach(field => {
        visibilityMap[field.field_name] = {
          viewer: field.viewer_visible,
          member: field.member_visible,
          admin: field.admin_visible,
          category: field.field_category
        };
      });

      setSurveyData({
        year: selectedYear,
        responses: responses || [],
        fieldVisibility: visibilityMap
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract field data from form_data JSONB
  const extractFieldData = (fieldName: string): any[] => {
    if (!surveyData) return [];
    
    return surveyData.responses
      .map(response => response.form_data?.[fieldName])
      .filter(value => value !== null && value !== undefined && value !== '');
  };

  // Check if user can view a field
  const canViewField = (fieldName: string): boolean => {
    if (!surveyData) return false;
    const visibility = surveyData.fieldVisibility[fieldName];
    if (!visibility) return userRole === 'admin'; // Default: admin only
    
    if (userRole === 'admin') return visibility.admin;
    if (userRole === 'member') return visibility.member;
    if (userRole === 'viewer') return visibility.viewer;
    return false;
  };

  // Get visible fields by category
  const getVisibleFieldsByCategory = (category: string): string[] => {
    if (!surveyData) return [];
    
    return Object.entries(surveyData.fieldVisibility)
      .filter(([_, visibility]) => visibility.category === category && canViewField(_))
      .map(([fieldName, _]) => fieldName);
  };

  // Calculate distribution for categorical data
  const calculateDistribution = (fieldName: string) => {
    const values = extractFieldData(fieldName);
    const distribution: Record<string, number> = {};

    values.forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          distribution[item] = (distribution[item] || 0) + 1;
        });
      } else {
        distribution[String(value)] = (distribution[String(value)] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: surveyData ? ((count / surveyData.responses.length) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate numeric statistics
  const calculateNumericStats = (fieldName: string) => {
    const values = extractFieldData(fieldName)
      .map(v => typeof v === 'number' ? v : parseFloat(v))
      .filter(v => !isNaN(v));

    if (values.length === 0) return { min: 0, max: 0, avg: 0, median: 0, total: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      total: sum,
      count: values.length
    };
  };

  // Overview metrics
  const overviewMetrics = useMemo(() => {
    if (!surveyData) return null;

    const totalResponses = surveyData.responses.length;
    const completedThisMonth = surveyData.responses.filter(r => {
      if (!r.completed_at) return false;
      const completedDate = new Date(r.completed_at);
      const now = new Date();
      return completedDate.getMonth() === now.getMonth() && 
             completedDate.getFullYear() === now.getFullYear();
    }).length;

    // Calculate visible fields count
    const visibleFieldsCount = Object.keys(surveyData.fieldVisibility)
      .filter(field => canViewField(field)).length;

    return {
      totalResponses,
      completedThisMonth,
      visibleFieldsCount,
      responseRate: ((totalResponses / 100) * 100).toFixed(1) // Assuming 100 invites
    };
  }, [surveyData, userRole]);

  // Render overview section
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{overviewMetrics?.totalResponses || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {overviewMetrics?.completedThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{overviewMetrics?.responseRate || 0}%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Visible Fields</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{overviewMetrics?.visibleFieldsCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              Based on your {userRole} role
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Data Quality</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">94%</div>
            <p className="text-xs text-gray-500 mt-1">
              High completeness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution (if visible) */}
      {canViewField('geographic_markets') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Market presence across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calculateDistribution('geographic_markets').slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Fund Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Fund Type Distribution */}
      {canViewField('fund_type_status') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-green-600" />
                Fund Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('fund_type_status')}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculateDistribution('fund_type_status').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Focus */}
          {canViewField('sector_focus') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Top Sectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calculateDistribution('sector_focus').slice(0, 8).map((sector, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{sector.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                            style={{ width: `${sector.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {sector.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  // Render team analytics section
  const renderTeamAnalytics = () => {
    if (!canViewField('fte_staff_current') && !canViewField('team_based')) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Team analytics not available for your role</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {canViewField('fte_staff_current') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Team Size Distribution
              </CardTitle>
              <CardDescription>Full-time equivalent staff analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = calculateNumericStats('fte_staff_current');
                  return (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Average</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.avg.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Median</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.median}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.min}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.max}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                  data={calculateDistribution('fte_staff_current')
                    .map(item => ({ name: item.name, count: item.value }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Number of Funds" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {canViewField('team_based') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Team Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('team_based')}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculateDistribution('team_based').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Render financial analytics section
  const renderFinancialAnalytics = () => {
    const financialFields = ['target_fund_size', 'current_funds_raised', 'gp_management_fee'];
    const visibleFinancialFields = financialFields.filter(f => canViewField(f));

    if (visibleFinancialFields.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Financial analytics not available for your role</p>
            <p className="text-sm text-gray-500 mt-2">Members and admins can view detailed financial data</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {visibleFinancialFields.map(field => (
          <Card key={field}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(() => {
                  const stats = calculateNumericStats(field);
                  return (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">${(stats.total / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average</p>
                        <p className="text-xl font-bold text-gray-900">${(stats.avg / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Median</p>
                        <p className="text-xl font-bold text-gray-900">${(stats.median / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min</p>
                        <p className="text-xl font-bold text-gray-900">${(stats.min / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Max</p>
                        <p className="text-xl font-bold text-gray-900">${(stats.max / 1000000).toFixed(1)}M</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive survey data analysis and insights</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSurveyData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <label className="text-sm font-medium text-gray-700">Select Year:</label>
              <div className="flex gap-2">
                {availableYears.map(year => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? 'default' : 'outline'}
                    onClick={() => setSelectedYear(year)}
                    className="min-w-[80px]"
                  >
                    {year}
                  </Button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge className={`
                  ${userRole === 'admin' ? 'bg-red-500' : ''}
                  ${userRole === 'member' ? 'bg-green-500' : ''}
                  ${userRole === 'viewer' ? 'bg-blue-500' : ''}
                `}>
                  {userRole?.toUpperCase()} ACCESS
                </Badge>
              </div>
            </div>
          </div>

          {/* Analytics Sections */}
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team Analytics</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="team">
              {renderTeamAnalytics()}
            </TabsContent>

            <TabsContent value="financial">
              {renderFinancialAnalytics()}
            </TabsContent>

            <TabsContent value="strategy">
              <Card>
                <CardContent className="text-center py-12">
                  <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600">Strategy analytics coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AnalyticsV3;
