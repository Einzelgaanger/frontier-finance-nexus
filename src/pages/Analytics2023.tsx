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

interface Survey2023Data {
  id: string;
  user_id: string;
  briefing_acknowledged: boolean;
  firm_name: string;
  role_title: string;
  team_based: string[];
  team_based_other: string;
  geographic_focus: string[];
  geographic_focus_other: string;
  fund_stage: string;
  fund_stage_other: string;
  investment_vehicle_type: string[];
  investment_vehicle_type_other: string;
  business_model_targeted: string[];
  business_model_targeted_other: string;
  target_sectors: string[];
  target_sectors_other: string;
  investment_thesis: string;
  investment_thesis_other: string;
  capital_construct: string;
  capital_construct_other: string;
  investment_criteria: string[];
  investment_criteria_other: string;
  deal_flow_sources: string[];
  deal_flow_sources_other: string;
  investment_process: string;
  investment_process_other: string;
  portfolio_size: string;
  portfolio_size_other: string;
  team_structure: string;
  team_structure_other: string;
  team_expertise: string[];
  team_expertise_other: string;
  investment_committee: string;
  investment_committee_other: string;
  portfolio_development_stage: string;
  portfolio_development_stage_other: string;
  exit_strategies: string[];
  exit_strategies_other: string;
  return_expectations: string;
  return_expectations_other: string;
  value_add_services: string[];
  value_add_services_other: string;
  covid_impact_vehicle: string;
  covid_impact_vehicle_other: string;
  covid_impact_portfolio: string;
  covid_impact_portfolio_other: string;
  covid_adaptations: string[];
  covid_adaptations_other: string;
  network_engagement_level: string;
  network_engagement_level_other: string;
  network_value_areas: Record<string, string>;
  present_connection_session: boolean;
  convening_initiatives_ranking: Record<string, string>;
  convening_initiatives_other: string;
  participate_mentoring_program: string;
  participate_mentoring_program_other: string;
  present_demystifying_session: string[];
  present_demystifying_session_other: string;
  additional_comments: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

const Analytics2023: React.FC = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<Survey2023Data[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    loadSurveyData();
  }, []);

  const loadSurveyData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('survey_responses_2023')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveyData(data || []);
    } catch (error) {
      console.error('Error loading 2023 survey data:', error);
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

  const getInvestmentVehicleDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.investment_vehicle_type.forEach(type => {
        distribution[type] = (distribution[type] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([type, count]) => ({ type, count }));
  };

  const getBusinessModelDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.business_model_targeted.forEach(model => {
        distribution[model] = (distribution[model] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([model, count]) => ({ model, count }));
  };

  const getTargetSectorsDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.target_sectors.forEach(sector => {
        distribution[sector] = (distribution[sector] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([sector, count]) => ({ sector, count }));
  };

  const getInvestmentThesisDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const thesis = survey.investment_thesis;
      acc[thesis] = (acc[thesis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([thesis, count]) => ({
      thesis: thesis.length > 30 ? thesis.substring(0, 30) + '...' : thesis,
      count
    }));
  };

  const getCapitalConstructDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const construct = survey.capital_construct;
      acc[construct] = (acc[construct] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([construct, count]) => ({
      construct: construct.length > 30 ? construct.substring(0, 30) + '...' : construct,
      count
    }));
  };

  const getInvestmentCriteriaDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.investment_criteria.forEach(criteria => {
        distribution[criteria] = (distribution[criteria] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([criteria, count]) => ({ criteria, count }));
  };

  const getDealFlowSourcesDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.deal_flow_sources.forEach(source => {
        distribution[source] = (distribution[source] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));
  };

  const getPortfolioSizeDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const size = survey.portfolio_size;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([size, count]) => ({
      size: size.length > 30 ? size.substring(0, 30) + '...' : size,
      count
    }));
  };

  const getTeamStructureDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const structure = survey.team_structure;
      acc[structure] = (acc[structure] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([structure, count]) => ({
      structure: structure.length > 30 ? structure.substring(0, 30) + '...' : structure,
      count
    }));
  };

  const getTeamExpertiseDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.team_expertise.forEach(expertise => {
        distribution[expertise] = (distribution[expertise] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([expertise, count]) => ({ expertise, count }));
  };

  const getExitStrategiesDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.exit_strategies.forEach(strategy => {
        distribution[strategy] = (distribution[strategy] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([strategy, count]) => ({ strategy, count }));
  };

  const getReturnExpectationsDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const expectation = survey.return_expectations;
      acc[expectation] = (acc[expectation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([expectation, count]) => ({
      expectation: expectation.length > 30 ? expectation.substring(0, 30) + '...' : expectation,
      count
    }));
  };

  const getValueAddServicesDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.value_add_services.forEach(service => {
        distribution[service] = (distribution[service] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([service, count]) => ({ service, count }));
  };

  const getCovidImpactVehicleDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const impact = survey.covid_impact_vehicle;
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([impact, count]) => ({
      impact: impact.length > 30 ? impact.substring(0, 30) + '...' : impact,
      count
    }));
  };

  const getCovidImpactPortfolioDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const impact = survey.covid_impact_portfolio;
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([impact, count]) => ({
      impact: impact.length > 30 ? impact.substring(0, 30) + '...' : impact,
      count
    }));
  };

  const getCovidAdaptationsDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.covid_adaptations.forEach(adaptation => {
        distribution[adaptation] = (distribution[adaptation] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([adaptation, count]) => ({ adaptation, count }));
  };

  const getNetworkEngagementDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const level = survey.network_engagement_level;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([level, count]) => ({
      level: level.length > 30 ? level.substring(0, 30) + '...' : level,
      count
    }));
  };

  const getNetworkValueAreasDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      Object.entries(survey.network_value_areas).forEach(([area, value]) => {
        if (value === 'true') {
          distribution[area] = (distribution[area] || 0) + 1;
        }
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([area, count]) => ({ area, count }));
  };

  const getMentoringProgramDistribution = () => {
    const distribution = surveyData.reduce((acc, survey) => {
      const participation = survey.participate_mentoring_program;
      acc[participation] = (acc[participation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([participation, count]) => ({
      participation: participation.length > 30 ? participation.substring(0, 30) + '...' : participation,
      count
    }));
  };

  const getDemystifyingSessionDistribution = () => {
    const distribution: Record<string, number> = {};
    surveyData.forEach(survey => {
      survey.present_demystifying_session.forEach(topic => {
        distribution[topic] = (distribution[topic] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));
  };

  const getConveningInitiativesRanking = () => {
    const rankings: Record<string, number[]> = {};
    surveyData.forEach(survey => {
      Object.entries(survey.convening_initiatives_ranking).forEach(([initiative, rank]) => {
        if (!rankings[initiative]) {
          rankings[initiative] = [];
        }
        const rankNum = parseInt(rank);
        if (!isNaN(rankNum)) {
          rankings[initiative].push(rankNum);
        }
      });
    });

    return Object.entries(rankings).map(([initiative, ranks]) => ({
      initiative,
      averageRank: ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length
    })).sort((a, b) => a.averageRank - b.averageRank);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 2023 Survey Analytics...</p>
        </div>
      </div>
    );
  }

  if (!surveyData.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No 2023 survey data available</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">2023 Survey Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of 2023 survey responses</p>
          <div className="mt-4">
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {surveyData.length} Responses
            </Badge>
          </div>
        </div>

        <div className="mb-6">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="background">Background</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="covid">COVID-19 Impact</SelectItem>
              <SelectItem value="network">Network</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{surveyData.length}</p>
                  <p className="text-sm text-gray-600">Total Responses</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {surveyData.filter(s => s.briefing_acknowledged).length}
                  </p>
                  <p className="text-sm text-gray-600">Briefing Acknowledged</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {surveyData.filter(s => s.completed_at).length}
                  </p>
                  <p className="text-sm text-gray-600">Completed Surveys</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {surveyData.filter(s => s.present_connection_session).length}
                  </p>
                  <p className="text-sm text-gray-600">Want to Present</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedMetric === 'background' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Stage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getFundStageDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ stage, count }) => `${stage}: ${count}`}
                      >
                        {getFundStageDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getGeographicDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Vehicle Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentVehicleDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Models Targeted</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBusinessModelDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="model" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedMetric === 'investment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Thesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getInvestmentThesisDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ thesis, count }) => `${thesis}: ${count}`}
                      >
                        {getInvestmentThesisDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capital Construct</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getCapitalConstructDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ construct, count }) => `${construct}: ${count}`}
                      >
                        {getCapitalConstructDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentCriteriaDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="criteria" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deal Flow Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getDealFlowSourcesDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#EC4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedMetric === 'portfolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPortfolioSizeDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ size, count }) => `${size}: ${count}`}
                      >
                        {getPortfolioSizeDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getTeamStructureDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ structure, count }) => `${structure}: ${count}`}
                      >
                        {getTeamStructureDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exit Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getExitStrategiesDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strategy" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Return Expectations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getReturnExpectationsDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ expectation, count }) => `${expectation}: ${count}`}
                      >
                        {getReturnExpectationsDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 150}, 70%, 60%)`} />
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

        {selectedMetric === 'covid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>COVID-19 Impact on Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getCovidImpactVehicleDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ impact, count }) => `${impact}: ${count}`}
                      >
                        {getCovidImpactVehicleDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 180}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>COVID-19 Impact on Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getCovidImpactPortfolioDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ impact, count }) => `${impact}: ${count}`}
                      >
                        {getCovidImpactPortfolioDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 210}, 70%, 60%)`} />
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
                <CardTitle>COVID-19 Adaptations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCovidAdaptationsDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="adaptation" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedMetric === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Engagement Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getNetworkEngagementDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ level, count }) => `${level}: ${count}`}
                      >
                        {getNetworkEngagementDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 240}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Value Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getNetworkValueAreasDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#84CC16" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mentoring Program Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getMentoringProgramDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ participation, count }) => `${participation}: ${count}`}
                      >
                        {getMentoringProgramDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 270}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Convening Initiatives Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getConveningInitiativesRanking()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="initiative" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageRank" fill="#F97316" />
                    </BarChart>
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

export default Analytics2023; 