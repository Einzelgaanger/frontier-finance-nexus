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

interface Survey2021Data {
  id: string;
  firm_name: string;
  participant_name: string;
  role_title: string;
  team_based: string[];
  geographic_focus: string[];
  fund_stage: string;
  legal_entity_date: string;
  first_close_date: string;
  first_investment_date: string;
  investments_march_2020: string;
  investments_december_2020: string;
  investment_vehicle_type: string[];
  current_fund_size: string;
  target_fund_size: string;
  investment_timeframe: string;
  business_model_targeted: string[];
  business_stage_targeted: string[];
  financing_needs: string[];
  target_capital_sources: string[];
  target_irr_achieved: string;
  target_irr_targeted: string;
  impact_vs_financial_orientation: string;
  explicit_lens_focus: string[];
  report_sustainable_development_goals: boolean;
  gender_considerations_investment: string[];
  investment_size_your_amount: string;
  investment_size_total_raise: string;
  investment_forms: string[];
  target_sectors: string[];
  carried_interest_principals: string;
  current_ftes: string;
  investment_monetization: string[];
  exits_achieved: string;
  covid_impact_aggregate: string;
  covid_government_support: string[];
  raising_capital_2021: string[];
  network_value_rating: string;
  communication_platform: string;
  present_connection_session: boolean;
  participate_mentoring_program: string;
  present_demystifying_session: string[];
  completed_at: string;
  created_at: string;
}

const Analytics2021: React.FC = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<Survey2021Data[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    loadSurveyData();
  }, []);

  const loadSurveyData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('survey_responses_2021')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveyData(data || []);
    } catch (error) {
      console.error('Error loading 2021 survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFundStageDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const stage = survey.fund_stage;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([stage, count]) => ({
      stage: stage.length > 30 ? stage.substring(0, 30) + '...' : stage,
      count
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
      .map(([region, count]) => ({ region, count }));
  };

  const getInvestmentSizeDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const size = survey.current_fund_size;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([size, count]) => ({
      size: size.length > 20 ? size.substring(0, 20) + '...' : size,
      count
    }));
  };

  const getIRRDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const irr = survey.target_irr_targeted;
      acc[irr] = (acc[irr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([irr, count]) => ({
      irr: irr.length > 15 ? irr.substring(0, 15) + '...' : irr,
      count
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
      .map(([sector, count]) => ({ sector, count }));
  };

  const getCOVIDImpactDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const impact = survey.covid_impact_aggregate;
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([impact, count]) => ({
      impact: impact.length > 25 ? impact.substring(0, 25) + '...' : impact,
      count
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
      count
    }));
  };

  const getInvestmentTimelineData = () => {
    const timelineData = surveyData.map(survey => ({
      firm: survey.firm_name.substring(0, 15) + '...',
      legalEntity: survey.legal_entity_date,
      firstClose: survey.first_close_date,
      firstInvestment: survey.first_investment_date
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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
    <div className="min-h-screen bg-gray-50">
      <Header />
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
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="funds">Fund Analysis</SelectItem>
                  <SelectItem value="investments">Investment Analysis</SelectItem>
                  <SelectItem value="covid">COVID-19 Impact</SelectItem>
                  <SelectItem value="network">Network Analysis</SelectItem>
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
                  <CardTitle className="text-lg">Target IRR Distribution</CardTitle>
                  <CardDescription>Expected returns by fund</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getIRRDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="irr" />
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
            </div>
          </div>
        )}

        {/* Fund Analysis Section */}
        {selectedMetric === 'funds' && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Investment Analysis Section */}
        {selectedMetric === 'investments' && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* COVID-19 Impact Section */}
        {selectedMetric === 'covid' && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Network Analysis Section */}
        {selectedMetric === 'network' && (
          <div className="space-y-6">
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
                  <CardTitle className="text-lg">Presentation Interest</CardTitle>
                  <CardDescription>Willingness to present at sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { session: 'Connection/Reconnection', yes: surveyData.filter(s => s.present_connection_session).length, no: surveyData.filter(s => !s.present_connection_session).length },
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics2021; 