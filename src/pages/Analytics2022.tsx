// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
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
  ComposedChart
} from 'recharts';

interface Survey2022Data {
  id: string;
  user_id: string;
  name: string;
  role_title: string;
  email: string;
  organisation: string;
  legal_entity_date: string;
  first_close_date: string;
  first_investment_date: string;
  geographic_markets: string[];
  team_based: string[];
  current_ftes: string;
  ye2023_ftes: string;
  principals_count: string;
  new_to_investment: string;
  adjacent_finance_experience: string;
  business_management_experience: string;
  fund_investment_experience: string;
  senior_fund_experience: string;
  investments_experience: string;
  exits_experience: string;
  legal_domicile: string;
  currency_investments: string;
  currency_lp_commitments: string;
  fund_operations: string;
  current_funds_raised: string;
  current_amount_invested: string;
  target_fund_size: string;
  target_investments: string;
  follow_on_permitted: string;
  target_irr: string;
  gp_commitment: string;
  management_fee: string;
  carried_interest_hurdle: string;
  investment_stage: string;
  investment_size: string;
  investment_type: string;
  sector_focus: string;
  geographic_focus: string;
  value_add_services: string;
  average_investment_size: string;
  investment_timeframe: string;
  investments_made: string;
  anticipated_exits: string;
  receive_results: boolean;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

const Analytics2022: React.FC = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<Survey2022Data[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    loadSurveyData();
  }, []);

  const loadSurveyData = async () => {
    try {
      setLoading(true);
      // Note: survey_2022_responses table doesn't exist, using survey_responses with year filter
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('year', 2022)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Note: Using survey_responses with year filter instead of separate tables
      setSurveyData(data.filter(item => item.year === 2022) as any || []);
    } catch (error) {
      console.error('Error loading 2022 survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGeographicMarketsDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.geographic_markets.forEach(market => {
        distribution[market] = (distribution[market] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([market, count]) => ({ market, count }));
  };

  const getTeamBasedDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.team_based.forEach(location => {
        distribution[location] = (distribution[location] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }));
  };

  const getFundOperationsDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const operation = survey.fund_operations;
      acc[operation] = (acc[operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([operation, count]) => ({
      operation: operation.length > 25 ? operation.substring(0, 25) + '...' : operation,
      count
    }));
  };

  const getInvestmentStageDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const stage = survey.investment_stage;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([stage, count]) => ({
      stage: stage.length > 20 ? stage.substring(0, 20) + '...' : stage,
      count
    }));
  };

  const getSectorFocusDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const sector = survey.sector_focus;
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([sector, count]) => ({ sector, count }));
  };

  const getInvestmentSizeDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const size = survey.investment_size;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([size, count]) => ({
      size: size.length > 20 ? size.substring(0, 20) + '...' : size,
      count
    }));
  };

  const getInvestmentTypeDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const type = survey.investment_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([type, count]) => ({
      type: type.length > 25 ? type.substring(0, 25) + '...' : type,
      count
    }));
  };

  const getLegalDomicileDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const domicile = survey.legal_domicile;
      acc[domicile] = (acc[domicile] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([domicile, count]) => ({ domicile, count }));
  };

  const getExperienceDistribution = () => {
    const experienceFields = [
      'new_to_investment',
      'adjacent_finance_experience',
      'business_management_experience',
      'fund_investment_experience',
      'senior_fund_experience',
      'investments_experience',
      'exits_experience'
    ];

    return experienceFields.map(field => ({
      experience: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: surveyData.filter(survey => survey[field as keyof Survey2022Data] === 'Yes').length
    }));
  };

  const getFundSizeData = () => {
    return surveyData.map(survey => ({
      organisation: survey.organisation.substring(0, 15) + '...',
      currentFunds: survey.current_funds_raised,
      currentInvested: survey.current_amount_invested,
      targetSize: survey.target_fund_size
    })).slice(0, 15);
  };

  const getTeamSizeData = () => {
    return surveyData.map(survey => ({
      organisation: survey.organisation.substring(0, 15) + '...',
      currentFTEs: parseInt(survey.current_ftes) || 0,
      ye2023FTEs: parseInt(survey.ye2023_ftes) || 0,
      principals: parseInt(survey.principals_count) || 0
    })).slice(0, 15);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 2022 survey analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">2022 CFF Survey Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of Capital for Frontier Finance - MSME Financing Survey</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Total Responses: {surveyData.length}
              </Badge>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="organizations">Organization Analysis</SelectItem>
                  <SelectItem value="investments">Investment Analysis</SelectItem>
                  <SelectItem value="team">Team Analysis</SelectItem>
                  <SelectItem value="geography">Geographic Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        {selectedMetric === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geographic Markets</CardTitle>
                  <CardDescription>Top markets of operation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getGeographicMarketsDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="market" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Locations</CardTitle>
                  <CardDescription>Where teams are based</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getTeamBasedDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fund Operations</CardTitle>
                  <CardDescription>Current fund operational status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getFundOperationsDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ operation, percent }) => `${operation} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getFundOperationsDistribution().map((entry, index) => (
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
                  <CardTitle className="text-lg">Investment Stage Focus</CardTitle>
                  <CardDescription>Target investment stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentStageDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sector Focus</CardTitle>
                  <CardDescription>Top investment sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getSectorFocusDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sector" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Organization Analysis Section */}
        {selectedMetric === 'organizations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fund Size Analysis</CardTitle>
                <CardDescription>Current funds raised, invested, and target sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getFundSizeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="organisation" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentFunds" fill="#8884d8" name="Current Funds Raised" />
                    <Bar dataKey="currentInvested" fill="#82ca9d" name="Current Amount Invested" />
                    <Bar dataKey="targetSize" fill="#ffc658" name="Target Fund Size" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legal Domicile Distribution</CardTitle>
                  <CardDescription>Fund legal domicile locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getLegalDomicileDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ domicile, percent }) => `${domicile} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getLegalDomicileDistribution().map((entry, index) => (
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
                  <CardTitle className="text-lg">Investment Size Distribution</CardTitle>
                  <CardDescription>Typical investment sizes</CardDescription>
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
          </div>
        )}

        {/* Investment Analysis Section */}
        {selectedMetric === 'investments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investment Types</CardTitle>
                  <CardDescription>Types of investments made</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentTypeDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Experience Analysis</CardTitle>
                <CardDescription>Team experience across different areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getExperienceDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="experience" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Analysis Section */}
        {selectedMetric === 'team' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Size Analysis</CardTitle>
                <CardDescription>Current FTEs, 2023 FTEs, and principals count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getTeamSizeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="organisation" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentFTEs" fill="#8884d8" name="Current FTEs" />
                    <Bar dataKey="ye2023FTEs" fill="#82ca9d" name="2023 FTEs" />
                    <Bar dataKey="principals" fill="#ffc658" name="Principals" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Experience Distribution</CardTitle>
                  <CardDescription>Experience levels across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getExperienceDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="experience" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Location Distribution</CardTitle>
                  <CardDescription>Where teams are geographically located</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getTeamBasedDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ location, percent }) => `${location} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {getTeamBasedDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Geographic Analysis Section */}
        {selectedMetric === 'geography' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geographic Markets</CardTitle>
                  <CardDescription>Markets where organizations operate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getGeographicMarketsDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="market" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Geographic Focus</CardTitle>
                  <CardDescription>Investment focus by geography</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.geographic_focus] = (acc[survey.geographic_focus] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)).map(([focus, count]) => ({ focus, count }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ focus, percent }) => `${focus} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {Object.entries(surveyData.reduce((acc, survey) => {
                          acc[survey.geographic_focus] = (acc[survey.geographic_focus] || 0) + 1;
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
                <CardTitle className="text-lg">Geographic Distribution Summary</CardTitle>
                <CardDescription>Overview of geographic presence and focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900">Markets Operated</h3>
                    <p className="text-2xl font-bold text-blue-600">{getGeographicMarketsDistribution().length}</p>
                    <p className="text-sm text-blue-700">Unique markets</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900">Team Locations</h3>
                    <p className="text-2xl font-bold text-green-600">{getTeamBasedDistribution().length}</p>
                    <p className="text-sm text-green-700">Team bases</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900">Legal Domiciles</h3>
                    <p className="text-2xl font-bold text-purple-600">{getLegalDomicileDistribution().length}</p>
                    <p className="text-sm text-purple-700">Fund domiciles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics2022; 