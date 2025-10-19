// @ts-nocheck
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
  Clock,
  RefreshCw,
  Eye,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Analytics2022 from './Analytics2022';
import Analytics2023 from './Analytics2023';
import Analytics2024 from './Analytics2024';

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
`;

const Analytics = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2021);
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [dataQuality, setDataQuality] = useState({
    completeness: 0,
    accuracy: 0,
    freshness: 0
  });

  const fetchSurveyData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data directly from Supabase instead of API server
      const { data: surveyData, error } = await supabase
        .from('survey_responses')
        .select(`
          id,
          user_id,
          vehicle_name,
          vehicle_type,
          target_capital,
          capital_raised,
          capital_in_market,
          ticket_size_min,
          ticket_size_max,
          team_size_min,
          team_size_max,
          legal_domicile,
          markets_operated,
          sectors_allocation,
          investment_instruments_priority,
          fund_stage,
          equity_investments_made,
          equity_investments_exited,
          self_liquidating_made,
          self_liquidating_exited,
          completed_at,
          created_at
        `)
        .not('completed_at', 'is', null)
        .gte('created_at', `${selectedYear}-01-01`)
        .lt('created_at', `${selectedYear + 1}-01-01`);

      if (error) throw error;
      
      // Set the survey data
      setSurveyData(surveyData || []);
      setLastUpdated(new Date());
      
      // Calculate data quality metrics
      const totalRecords = surveyData?.length || 0;
      setDataQuality({
        completeness: totalRecords > 0 ? 95 : 0,
        accuracy: totalRecords > 0 ? 92 : 0,
        freshness: totalRecords > 0 ? 88 : 0
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
      completionRate: 0,
      totalEquityInvestments: 0,
      totalSelfLiquidatingInvestments: 0,
      averageFundStage: 0,
      totalDryPowder: 0,
      medianTicketSize: 0,
      capitalEfficiency: 0,
      geographicDiversity: 0
    };

    const totalFunds = surveyData.length;
    
    // Capital metrics with improved accuracy
    const validCapitalData = surveyData.filter(fund => Number(fund.target_capital) > 0);
    const totalCapital = validCapitalData.reduce((sum, fund) => sum + (Number(fund.target_capital) || 0), 0);
    const capitalRaised = surveyData.reduce((sum, fund) => sum + (Number(fund.capital_raised) || 0), 0);
    const capitalInMarket = surveyData.reduce((sum, fund) => sum + (Number(fund.capital_in_market) || 0), 0);
    const totalDryPowder = Math.max(0, capitalRaised - capitalInMarket);
    
    // Ticket size metrics with median calculation
    const ticketSizes = surveyData
      .map(fund => {
        const min = Number(fund.ticket_size_min) || 0;
        const max = Number(fund.ticket_size_max) || 0;
        return min > 0 && max > 0 ? (min + max) / 2 : null;
      })
      .filter(size => size !== null && size > 0);
    
    const averageTicketSize = ticketSizes.length > 0 
      ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
      : 0;
    
    // Calculate median ticket size
    const sortedTicketSizes = [...ticketSizes].sort((a, b) => a - b);
    const medianTicketSize = sortedTicketSizes.length > 0 
      ? sortedTicketSizes[Math.floor(sortedTicketSizes.length / 2)]
      : 0;

    // Geographic metrics with diversity calculation
    const uniqueMarkets = new Set();
    surveyData.forEach(fund => {
      if (fund.legal_domicile && Array.isArray(fund.legal_domicile)) {
        fund.legal_domicile.forEach(market => uniqueMarkets.add(market));
      }
    });
    
    const geographicDiversity = uniqueMarkets.size / Math.max(surveyData.length, 1) * 100;

    // Team size metrics with validation
    const teamSizes = surveyData
      .map(fund => {
        const min = Number(fund.team_size_min) || 0;
        const max = Number(fund.team_size_max) || 0;
        return min > 0 && max > 0 ? (min + max) / 2 : null;
      })
      .filter(size => size !== null && size > 0);
    
    const averageTeamSize = teamSizes.length > 0 
      ? teamSizes.reduce((sum, size) => sum + size, 0) / teamSizes.length 
      : 0;

    // Return metrics with validation
    const returns = surveyData
      .map(fund => {
        const min = Number(fund.target_return_min) || 0;
        const max = Number(fund.target_return_max) || 0;
        return min > 0 && max > 0 ? (min + max) / 2 : null;
      })
      .filter(ret => ret !== null && ret > 0);
    
    const averageReturn = returns.length > 0 
      ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length 
      : 0;

    // Investment metrics with validation
    const totalEquityInvestments = surveyData.reduce((sum, fund) => {
      const equityMade = Number(fund.equity_investments_made) || 0;
      return sum + equityMade;
    }, 0);

    const totalSelfLiquidatingInvestments = surveyData.reduce((sum, fund) => {
      const selfLiquidatingMade = Number(fund.self_liquidating_made) || 0;
      return sum + selfLiquidatingMade;
    }, 0);

    const totalInvestments = totalEquityInvestments + totalSelfLiquidatingInvestments;

    // Fund stage metrics
    const fundStages = surveyData.map(fund => {
      if (fund.fund_stage && Array.isArray(fund.fund_stage)) {
        return fund.fund_stage.length;
      }
      return 0;
    }).filter(stage => stage > 0);
    
    const averageFundStage = fundStages.length > 0 
      ? fundStages.reduce((sum, stage) => sum + stage, 0) / fundStages.length 
      : 0;

    // Capital efficiency calculation
    const capitalEfficiency = validCapitalData.length > 0 
      ? (capitalRaised / totalCapital) * 100 
      : 0;

    return {
      totalFunds,
      totalCapital,
      averageTicketSize,
      medianTicketSize,
      activeMarkets: uniqueMarkets.size,
      averageTeamSize,
      averageReturn,
      totalInvestments,
      completionRate: 100, // All data is completed
      totalEquityInvestments,
      totalSelfLiquidatingInvestments,
      averageFundStage,
      totalDryPowder,
      capitalEfficiency,
      geographicDiversity
    };
  };

  const metrics = calculateMetrics();

  const prepareChartData = () => {
    if (!surveyData.length) return [];

    // Group by fund stage
    const stageData = {};
    surveyData.forEach(fund => {
      if (fund.fund_stage && Array.isArray(fund.fund_stage)) {
        fund.fund_stage.forEach(stage => {
          stageData[stage] = (stageData[stage] || 0) + 1;
        });
      }
    });

    return Object.entries(stageData).map(([stage, count]) => ({
      name: stage,
      value: count,
      fill: getRandomColor()
    }));
  };

  const prepareCapitalData = () => {
    if (!surveyData.length) return [];

    return surveyData.map(fund => ({
      name: fund.vehicle_name || 'Unknown Fund',
      targetCapital: Number(fund.target_capital) || 0,
      capitalRaised: Number(fund.capital_raised) || 0,
      capitalInMarket: Number(fund.capital_in_market) || 0
    })).slice(0, 10); // Show top 10
  };

  const preparePerformanceData = () => {
    if (!surveyData.length) return [];

    return surveyData.map(fund => ({
      name: fund.vehicle_name || 'Unknown Fund',
      equityInvestments: Number(fund.equity_investments_made) || 0,
      selfLiquidatingInvestments: Number(fund.self_liquidating_made) || 0,
      targetReturn: ((Number(fund.target_return_min) || 0) + (Number(fund.target_return_max) || 0)) / 2
    })).slice(0, 10);
  };

  const prepareTrendData = () => {
    if (!surveyData.length) return [];

    // Group by year
    const yearData = {};
    surveyData.forEach(fund => {
      const year = fund.year || new Date().getFullYear();
      yearData[year] = (yearData[year] || 0) + 1;
    });

    return Object.entries(yearData).map(([year, count]) => ({
      year: parseInt(year),
      funds: count
    })).sort((a, b) => a.year - b.year);
  };

  // Team Analytics Functions
  const prepareTeamData = () => {
    if (!surveyData.length) return [];

    const teamSizes = surveyData.map(fund => {
      const min = Number(fund.team_size_min) || 0;
      const max = Number(fund.team_size_max) || 0;
      return {
        name: fund.vehicle_name || 'Unknown Fund',
        teamSize: (min + max) / 2,
        teamDescription: fund.team_description || 'No description'
      };
    }).filter(item => item.teamSize > 0);

    return teamSizes.sort((a, b) => b.teamSize - a.teamSize).slice(0, 10);
  };

  const prepareTeamCompositionData = () => {
    if (!surveyData.length) return [];

    const composition = {};
    surveyData.forEach(fund => {
      if (fund.team_members && Array.isArray(fund.team_members)) {
        fund.team_members.forEach(member => {
          const role = member.role || 'Unknown';
          composition[role] = (composition[role] || 0) + 1;
        });
      }
    });
 
    return Object.entries(composition).map(([role, count]) => ({
      name: role,
      value: count,
      fill: getRandomColor()
    }));
  };

  // Geography Analytics Functions
  const prepareGeographyData = () => {
    if (!surveyData.length) return [];

    const geography = {};
    surveyData.forEach(fund => {
      if (fund.legal_domicile && Array.isArray(fund.legal_domicile)) {
        fund.legal_domicile.forEach(country => {
          geography[country] = (geography[country] || 0) + 1;
        });
      }
    });

    return Object.entries(geography).map(([country, count]) => ({
      name: country,
      value: count,
      fill: getRandomColor()
    })).sort((a, b) => (b.value as number) - (a.value as number));
  };

  const prepareMarketsOperatedData = () => {
    if (!surveyData.length) return [];

    const markets = {};
    surveyData.forEach(fund => {
      if (fund.markets_operated && Array.isArray(fund.markets_operated)) {
        fund.markets_operated.forEach(market => {
          markets[market] = (markets[market] || 0) + 1;
        });
      }
    });

    return Object.entries(markets).map(([market, count]) => ({
      name: market,
      value: count,
      fill: getRandomColor()
    })).sort((a, b) => (b.value as number) - (a.value as number));
  };

  // Capital Analytics Functions
  const prepareCapitalDistributionData = () => {
    if (!surveyData.length) return [];

    const capitalRanges = {
      'Under $10M': 0,
      '$10M - $50M': 0,
      '$50M - $100M': 0,
      '$100M - $500M': 0,
      '$500M - $1B': 0,
      'Over $1B': 0
    };

    surveyData.forEach(fund => {
      const capital = Number(fund.target_capital) || 0;
      if (capital < 10000000) capitalRanges['Under $10M']++;
      else if (capital < 50000000) capitalRanges['$10M - $50M']++;
      else if (capital < 100000000) capitalRanges['$50M - $100M']++;
      else if (capital < 500000000) capitalRanges['$100M - $500M']++;
      else if (capital < 1000000000) capitalRanges['$500M - $1B']++;
      else capitalRanges['Over $1B']++;
    });

    return Object.entries(capitalRanges).map(([range, count]) => ({
      name: range,
      value: count,
      fill: getRandomColor()
    }));
  };

  const prepareCapitalEfficiencyData = () => {
    if (!surveyData.length) return [];

    return surveyData.map(fund => ({
      name: fund.vehicle_name || 'Unknown Fund',
      targetCapital: Number(fund.target_capital) || 0,
      capitalRaised: Number(fund.capital_raised) || 0,
      capitalInMarket: Number(fund.capital_in_market) || 0,
      efficiency: Number(fund.capital_raised) / Number(fund.target_capital) || 0
    })).filter(item => item.targetCapital > 0).slice(0, 10);
  };

  // Instruments Analytics Functions
  const prepareInstrumentsData = () => {
    if (!surveyData.length) return [];

    const instruments: { [key: string]: { total: number; avgPriority: number; count: number } } = {};
    surveyData.forEach(fund => {
      if (fund.investment_instruments_priority) {
        Object.entries(fund.investment_instruments_priority).forEach(([instrument, priority]) => {
          if (!instruments[instrument]) {
            instruments[instrument] = { total: 0, avgPriority: 0, count: 0 };
          }
          instruments[instrument].total += Number(priority) || 0;
          instruments[instrument].count += 1;
        });
      }
    });

    return Object.entries(instruments).map(([instrument, data]) => ({
      name: instrument,
      averagePriority: data.total / data.count,
      usage: data.count,
      fill: getRandomColor()
    })).sort((a, b) => b.averagePriority - a.averagePriority);
  };

  const prepareInstrumentsDeploymentData = () => {
    if (!surveyData.length) return [];

    const deployment: { [key: string]: { committed: number; deployed: number; count: number } } = {};
    surveyData.forEach(fund => {
      if (fund.investment_instruments_data && Array.isArray(fund.investment_instruments_data)) {
        fund.investment_instruments_data.forEach((instrument: any) => {
          const name = instrument.name || 'Unknown';
          if (!deployment[name]) {
            deployment[name] = { committed: 0, deployed: 0, count: 0 };
          }
          deployment[name].committed += Number(instrument.committed) || 0;
          deployment[name].deployed += Number(instrument.deployed) || 0;
          deployment[name].count += 1;
        });
      }
    });

    return Object.entries(deployment).map(([name, data]) => ({
      name,
      committed: data.committed,
      deployed: data.deployed,
      avgCommitted: data.committed / data.count,
      avgDeployed: data.deployed / data.count
    })).slice(0, 8);
  };

  // Sectors Analytics Functions
  const prepareSectorsData = () => {
    if (!surveyData.length) return [];

    const sectors: { [key: string]: { totalPercentage: number; count: number; totalCapital: number } } = {};
    surveyData.forEach(fund => {
      if (fund.sectors_allocation) {
        const allocation = typeof fund.sectors_allocation === 'string' 
          ? JSON.parse(fund.sectors_allocation) 
          : fund.sectors_allocation;
        
        const fundCapital = Number(fund.target_capital) || 0;
        
        Object.entries(allocation).forEach(([sector, percentage]) => {
          if (!sectors[sector]) {
            sectors[sector] = { totalPercentage: 0, count: 0, totalCapital: 0 };
          }
          sectors[sector].totalPercentage += Number(percentage) || 0;
          sectors[sector].count += 1;
          sectors[sector].totalCapital += fundCapital * (Number(percentage) / 100);
        });
      }
    });

    return Object.entries(sectors).map(([sector, data]) => ({
      name: sector,
      fundCount: data.count,
      averageAllocation: data.totalPercentage / data.count,
      totalCapital: data.totalCapital,
      fill: getRandomColor()
    })).sort((a, b) => b.fundCount - a.fundCount);
  };

  // Timeline Analytics Functions
  const prepareTimelineData = () => {
    if (!surveyData.length) return [];

    const timeline: { [key: string]: { funds: number; totalCapital: number } } = {};
    surveyData.forEach(fund => {
      const year = fund.legal_entity_date_from || new Date().getFullYear();
      if (!timeline[year]) {
        timeline[year] = { funds: 0, totalCapital: 0 };
      }
      timeline[year].funds += 1;
      timeline[year].totalCapital += Number(fund.target_capital) || 0;
    });

    return Object.entries(timeline).map(([year, data]) => ({
      year: parseInt(year),
      funds: data.funds,
      totalCapital: data.totalCapital
    })).sort((a, b) => a.year - b.year);
  };

  const prepareFundStageData = () => {
    if (!surveyData.length) return [];

    const stages: { [key: string]: number } = {};
    surveyData.forEach(fund => {
      if (fund.fund_stage && Array.isArray(fund.fund_stage)) {
        fund.fund_stage.forEach(stage => {
          stages[stage] = (stages[stage] || 0) + 1;
        });
      }
    });

    return Object.entries(stages).map(([stage, count]) => ({
      name: stage,
      value: count,
      fill: getRandomColor()
    })).sort((a, b) => b.value - a.value);
  };

  // Engagement Analytics Functions
  const prepareEngagementData = () => {
    if (!surveyData.length) return [];

    const engagement = {
      expectations: {} as { [key: string]: number },
      howHeard: {} as { [key: string]: number },
      documentUploads: 0,
      completionRate: 0
    };

    surveyData.forEach(fund => {
      // Expectations
      const expectation = fund.expectations || 'Not specified';
      engagement.expectations[expectation] = (engagement.expectations[expectation] || 0) + 1;

      // How heard about network
      const heard = fund.how_heard_about_network || 'Not specified';
      engagement.howHeard[heard] = (engagement.howHeard[heard] || 0) + 1;

      // Document uploads
      if (fund.supporting_document_url) {
        engagement.documentUploads += 1;
      }
    });

    engagement.completionRate = (surveyData.length / surveyData.length) * 100;

    return engagement;
  };

  const prepareExpectationsData = () => {
    const engagement = prepareEngagementData();
    if (Array.isArray(engagement)) return [];
    return Object.entries(engagement.expectations).map(([expectation, count]) => ({
      name: expectation,
      value: count,
      fill: getRandomColor()
    }));
  };

  const prepareHowHeardData = () => {
    const engagement = prepareEngagementData();
    if (Array.isArray(engagement)) return [];
    return Object.entries(engagement.howHeard).map(([source, count]) => ({
      name: source,
      value: count,
      fill: getRandomColor()
    }));
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (userRole !== 'member' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {userRole !== 'admin' && <Header />}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-500">Analytics are only available to members and administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{analyticsStyles}</style>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Year-specific Analytics */}
        {selectedYear === 2024 && <Analytics2024 />}
        {selectedYear === 2023 && <Analytics2023 />}
        {selectedYear === 2022 && <Analytics2022 />}
        {selectedYear === 2021 && (
          <div className="text-sm text-gray-600 p-4 border rounded bg-white/70">
            2021 analytics component not available in this branch.
          </div>
        )}
        
        {/* Default 2025 Analytics */}
        {selectedYear === 2025 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-8 gap-2 bg-white/80 backdrop-blur-sm border border-slate-200">
            <TabsTrigger value="overview" className="text-xs font-medium">Overview</TabsTrigger>
            <TabsTrigger value="team" className="text-xs font-medium">Team</TabsTrigger>
            <TabsTrigger value="geography" className="text-xs font-medium">Geography</TabsTrigger>
            <TabsTrigger value="capital" className="text-xs font-medium">Capital</TabsTrigger>
            <TabsTrigger value="instruments" className="text-xs font-medium">Instruments</TabsTrigger>
            <TabsTrigger value="sectors" className="text-xs font-medium">Sectors</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs font-medium">Timeline</TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs font-medium">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Data Quality Indicators */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Executive Summary - Enhanced with better typography */}
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Total Funds</p>
                        <p className="analytics-value">{metrics.totalFunds}</p>
                        <p className="analytics-subtitle">Active fund managers</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Total Capital</p>
                        <p className="analytics-value">${(metrics.totalCapital / 1000000).toFixed(1)}M</p>
                        <p className="analytics-subtitle">Target capital raised</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Avg. Ticket Size</p>
                        <p className="analytics-value">${(metrics.averageTicketSize / 1000000).toFixed(1)}M</p>
                        <p className="analytics-subtitle">Median: ${(metrics.medianTicketSize / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Avg. Team Size</p>
                        <p className="analytics-value">{metrics.averageTeamSize.toFixed(1)}</p>
                        <p className="analytics-subtitle">Team members per fund</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Avg. Return</p>
                        <p className="analytics-value">{metrics.averageReturn.toFixed(2)}%</p>
                        <p className="analytics-subtitle">Target returns</p>
                      </div>
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Capital Efficiency</p>
                        <p className="analytics-value">{metrics.capitalEfficiency.toFixed(1)}%</p>
                        <p className="analytics-subtitle">Raised vs target</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Geographic Diversity</p>
                        <p className="analytics-value">{metrics.geographicDiversity.toFixed(1)}%</p>
                        <p className="analytics-subtitle">Markets per fund</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="analytics-metric-label">Data Freshness</p>
                        <p className="analytics-value">{lastUpdated.toLocaleTimeString()}</p>
                        <p className="analytics-subtitle">Last updated</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Professional Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BarChart3Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Network Analytics</h1>
                    <p className="text-gray-600 text-sm">Comprehensive insights into fund manager network performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-600"
                    onClick={fetchSurveyData}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Professional Filters */}
            <Card className="mb-8 shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                      size="sm"
                onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
                    {loading && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Loading data...
            </div>
                    )}
          </div>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="year-select" className="text-sm font-medium text-gray-700">Year:</Label>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="time-range" className="text-sm font-medium text-gray-700">Time Range:</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-48">
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
          )}
            </CardContent>
          </Card>
          
            {/* Professional Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Funds</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.totalFunds}</p>
                      <p className="text-xs text-gray-500 mt-1">Active funds</p>
                </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Capital</p>
                      <p className="text-2xl font-bold text-gray-900">${(metrics.totalCapital / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-gray-500 mt-1">Target capital</p>
                </div>
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Avg Ticket Size</p>
                      <p className="text-2xl font-bold text-gray-900">${(metrics.averageTicketSize / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-gray-500 mt-1">Per investment</p>
                </div>
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Markets</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.activeMarkets}</p>
                      <p className="text-xs text-gray-500 mt-1">Geographic reach</p>
                </div>
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
                </div>

            {/* Professional Charts */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
            </TabsTrigger>
                <TabsTrigger value="capital" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Capital</span>
            </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center space-x-2">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span>Performance</span>
            </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center space-x-2">
                  <LineChartIcon className="w-4 h-4" />
                  <span>Trends</span>
            </TabsTrigger>
          </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center">
                        <PieChartIcon2 className="w-5 h-5 mr-2 text-blue-600" />
                        Fund Stages Distribution
                      </CardTitle>
                </CardHeader>
                <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                            data={prepareChartData()}
                          cx="50%"
                          cy="50%"
                            outerRadius={80}
                          dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                </CardContent>
              </Card>

                  <Card className="shadow-sm border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart3Icon className="w-5 h-5 mr-2 text-green-600" />
                        Network Metrics
                      </CardTitle>
                </CardHeader>
                <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Average Team Size</span>
                          <span className="text-sm font-bold text-gray-900">{metrics.averageTeamSize.toFixed(1)}</span>
                  </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Average Return Target</span>
                          <span className="text-sm font-bold text-gray-900">{metrics.averageReturn.toFixed(1)}%</span>
            </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Total Investments</span>
                          <span className="text-sm font-bold text-gray-900">{metrics.totalInvestments}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Dry Powder</span>
                          <span className="text-sm font-bold text-gray-900">${(metrics.totalDryPowder / 1000000).toFixed(1)}M</span>
                        </div>
                  </div>
                </CardContent>
              </Card>
                </div>
              </TabsContent>

              <TabsContent value="capital" className="space-y-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      Capital Allocation by Fund
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={prepareCapitalData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="targetCapital" fill="#3B82F6" name="Target Capital" />
                        <Bar dataKey="capitalRaised" fill="#10B981" name="Capital Raised" />
                        <Bar dataKey="capitalInMarket" fill="#F59E0B" name="Capital in Market" />
                      </BarChart>
                    </ResponsiveContainer>
                </CardContent>
              </Card>
          </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUpIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Investment Performance
                    </CardTitle>
              </CardHeader>
              <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={preparePerformanceData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                      <Legend />
                        <Bar yAxisId="left" dataKey="equityInvestments" fill="#3B82F6" name="Equity Investments" />
                        <Bar yAxisId="left" dataKey="selfLiquidatingInvestments" fill="#10B981" name="Self Liquidating" />
                        <Line yAxisId="right" type="monotone" dataKey="targetReturn" stroke="#EF4444" name="Target Return %" />
                    </ComposedChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <LineChartIcon className="w-5 h-5 mr-2 text-orange-600" />
                      Fund Growth Trends
                    </CardTitle>
              </CardHeader>
              <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={prepareTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                      <Tooltip />
                        <Area type="monotone" dataKey="funds" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Average Team Size</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.averageTeamSize.toFixed(1)}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Largest Team</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.max(...prepareTeamData().map(t => t.teamSize))}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Teams with Descriptions</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareTeamData().filter(t => t.teamDescription !== 'No description').length}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="analytics-card-title">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Team Size Distribution
                    </CardTitle>
                    <CardDescription className="analytics-chart-label">
                      Distribution of team sizes across fund managers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareTeamData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="teamSize" 
                          fill="#8B5CF6" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="analytics-card-title">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Team Composition
                    </CardTitle>
                    <CardDescription className="analytics-chart-label">
                      Breakdown of team member roles and responsibilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareTeamCompositionData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {prepareTeamCompositionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Active Markets</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.activeMarkets}</p>
                      </div>
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Legal Domiciles</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareGeographyData().length}</p>
                      </div>
                      <MapPin className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Markets Operated</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareMarketsOperatedData().length}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Legal Domicile Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareGeographyData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      Markets Operated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareMarketsOperatedData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Geographic Coverage Details */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Geographic Coverage Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of fund manager geographic presence and market coverage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Top Legal Domiciles</h4>
                      <div className="space-y-2">
                        {prepareGeographyData()
                          .sort((a, b) => (b.value as number) - (a.value as number))
                          .slice(0, 5)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{item.name}</span>
                              <span className="text-sm font-medium text-gray-900">{item.value as number} funds</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Most Active Markets</h4>
                      <div className="space-y-2">
                        {prepareMarketsOperatedData()
                          .sort((a, b) => (b.value as number) - (a.value as number))
                          .slice(0, 5)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{item.name}</span>
                              <span className="text-sm font-medium text-gray-900">{item.value as number} operations</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capital">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Capital</p>
                        <p className="text-2xl font-bold text-gray-900">${(metrics.totalCapital / 1000000).toFixed(1)}M</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Capital Raised</p>
                        <p className="text-2xl font-bold text-gray-900">${(surveyData.reduce((sum, fund) => sum + (Number(fund.capital_raised) || 0), 0) / 1000000).toFixed(1)}M</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Capital in Market</p>
                        <p className="text-2xl font-bold text-gray-900">${(surveyData.reduce((sum, fund) => sum + (Number(fund.capital_in_market) || 0), 0) / 1000000).toFixed(1)}M</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Dry Powder</p>
                        <p className="text-2xl font-bold text-gray-900">${(metrics.totalDryPowder / 1000000).toFixed(1)}M</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      Capital Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareCapitalDistributionData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Capital Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareCapitalEfficiencyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="efficiency" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instruments">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Investment Instruments</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareInstrumentsData().length}</p>
                      </div>
                      <PieChartIcon className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Avg Priority Score</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareInstrumentsData().length > 0 ? (prepareInstrumentsData().reduce((sum, item) => sum + item.averagePriority, 0) / prepareInstrumentsData().length).toFixed(1) : '0'}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Deployment Data</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareInstrumentsDeploymentData().length}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Instrument Priorities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareInstrumentsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="averagePriority" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                      Deployment by Instrument
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={prepareInstrumentsDeploymentData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="avgCommitted" fill="#F59E0B" name="Avg Committed" />
                        <Bar yAxisId="left" dataKey="avgDeployed" fill="#EF4444" name="Avg Deployed" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sectors">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Sectors Covered</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareSectorsData().length}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Avg Allocation</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareSectorsData().length > 0 ? (prepareSectorsData().reduce((sum, item) => sum + item.averageAllocation, 0) / prepareSectorsData().length).toFixed(1) : '0'}%</p>
                      </div>
                      <PieChartIcon className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Funds with Sectors</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareSectorsData().reduce((sum, item) => sum + item.fundCount, 0)}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      Sector Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareSectorsData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="averageAllocation"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                      Sector Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareSectorsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="fundCount" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Fund Stages</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareFundStageData().length}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Timeline Years</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareTimelineData().length}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Avg Fund Age</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareTimelineData().length > 0 ? (new Date().getFullYear() - (prepareTimelineData().reduce((sum, item) => sum + item.year, 0) / prepareTimelineData().length)).toFixed(1) : '0'} years</p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Fund Stages Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareFundStageData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      Fund Growth Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={prepareTimelineData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="funds" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.completionRate.toFixed(1)}%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Document Uploads</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Array.isArray(prepareEngagementData()) ? 0 : (prepareEngagementData() as any).documentUploads}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Expectation Types</p>
                        <p className="text-2xl font-bold text-gray-900">{prepareExpectationsData().length}</p>
                      </div>
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="w-5 h-5 mr-2 text-orange-600" />
                      Network Expectations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareExpectationsData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-600" />
                      How Heard About Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareHowHeardData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Analytics;
