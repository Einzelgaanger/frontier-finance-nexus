// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Area
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
  MessageSquare,
  Send,
  Bot,
  RefreshCw,
  Download,
  Activity,
  Briefcase,
  PieChart as PieChartIcon
} from 'lucide-react';

const CHART_COLORS = [
  'hsl(221.2 83.2% 53.3%)', // primary
  'hsl(142.1 76.2% 36.3%)', // green
  'hsl(262.1 83.3% 57.8%)', // purple  
  'hsl(346.8 77.2% 49.8%)', // pink
  'hsl(24.6 95% 53.1%)', // orange
  'hsl(199.89 89.26% 48.43%)', // cyan
  'hsl(47.9 95.8% 53.1%)', // yellow
  'hsl(280.7 83.3% 50%)', // violet
];

// Section configurations for each year
const SURVEY_SECTIONS = {
  2021: [
    { id: 1, title: 'Background Information', fields: ['email_address', 'firm_name', 'participant_name', 'role_title', 'team_based', 'geographic_focus', 'fund_stage'] },
    { id: 2, title: 'Investment Thesis & Capital', fields: ['investment_vehicle_type', 'current_fund_size', 'target_fund_size', 'investment_timeframe'] },
    { id: 3, title: 'Portfolio & Team', fields: ['investment_forms', 'target_sectors', 'carried_interest_principals', 'current_ftes'] },
    { id: 4, title: 'Portfolio Development', fields: ['investment_monetization', 'exits_achieved'] },
    { id: 5, title: 'COVID-19 Impact', fields: ['covid_impact_aggregate', 'covid_government_support'] },
    { id: 6, title: 'Network Feedback', fields: ['network_value_rating', 'communication_platform'] },
    { id: 7, title: 'Convening Objectives', fields: ['participate_mentoring_program', 'additional_comments'] },
  ],
  2022: [
    { id: 1, title: 'Organization Details', fields: ['name', 'organisation', 'email', 'role_title'] },
    { id: 2, title: 'Fund Information', fields: ['legal_domicile', 'fund_operations', 'current_funds_raised', 'target_fund_size'] },
    { id: 3, title: 'Investment Strategy', fields: ['financial_instruments', 'sector_activities', 'business_stages'] },
    { id: 4, title: 'Team & Operations', fields: ['current_ftes', 'principals_count', 'team_based'] },
    { id: 5, title: 'Portfolio Performance', fields: ['investments_made_to_date', 'equity_exits_achieved', 'revenue_growth_recent_12_months'] },
    { id: 6, title: 'Market Factors', fields: ['domestic_factors_concerns', 'international_factors_concerns'] },
  ],
  2023: [
    { id: 1, title: 'Basic Information', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
    { id: 2, title: 'Fund Structure', fields: ['legal_domicile', 'fund_type_status', 'current_funds_raised', 'target_fund_size'] },
    { id: 3, title: 'Investment Approach', fields: ['financial_instruments', 'sector_focus', 'business_stages'] },
    { id: 4, title: 'Team Composition', fields: ['fte_staff_current', 'principals_count', 'team_based'] },
    { id: 5, title: 'Performance Metrics', fields: ['revenue_growth_historical', 'cash_flow_growth_historical', 'jobs_impact_historical_direct'] },
    { id: 6, title: 'Strategic Priorities', fields: ['fund_priorities', 'concerns_ranking'] },
  ],
  2024: [
    { id: 1, title: 'Organization Profile', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
    { id: 2, title: 'Fund Details', fields: ['legal_domicile', 'fund_type_status', 'hard_commitments_current', 'target_fund_size_current'] },
    { id: 3, title: 'Investment Focus', fields: ['sector_target_allocation', 'business_stages', 'financial_instruments_ranking'] },
    { id: 4, title: 'Operations', fields: ['fte_staff_current', 'principals_total', 'team_based'] },
    { id: 5, title: 'Portfolio Outcomes', fields: ['equity_investments_made', 'portfolio_revenue_growth_12m', 'direct_jobs_current'] },
    { id: 6, title: 'Strategic Focus', fields: ['fund_priorities_next_12m', 'fundraising_barriers'] },
  ],
};

export default function AdminAnalytics() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedSection, setSelectedSection] = useState(1);
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchSurveyData();
  }, [selectedYear]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(`survey_responses_${selectedYear}` as any)
        .select('*')
        .eq('submission_status', 'completed');

      if (error) throw error;
      setSurveyData(data || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load survey data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDistribution = (fieldName: string) => {
    const distribution: Record<string, number> = {};
    let totalCount = 0;

    surveyData.forEach(response => {
      const value = response[fieldName];
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item !== null && item !== undefined && item !== '') {
            distribution[String(item)] = (distribution[String(item)] || 0) + 1;
            totalCount++;
          }
        });
      } else if (value !== null && value !== undefined && value !== '') {
        distribution[String(value)] = (distribution[String(value)] || 0) + 1;
        totalCount++;
      }
    });

    // Use actual count for percentage calculation, not surveyData.length
    return Object.entries(distribution)
      .map(([name, count]) => ({
        name: name.length > 30 ? name.substring(0, 27) + '...' : name,
        value: count,
        percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const calculateNumericStats = (fieldName: string) => {
    const values = surveyData
      .map(r => {
        const val = r[fieldName];
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
          return isNaN(parsed) ? null : parsed;
        }
        return null;
      })
      .filter((v): v is number => v !== null && !isNaN(v) && isFinite(v));

    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      median,
      total: sum,
      count: values.length
    };
  };

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are an analytics assistant helping with survey data analysis. Current context: Year ${selectedYear}, Section ${selectedSection} (${SURVEY_SECTIONS[selectedYear as keyof typeof SURVEY_SECTIONS]?.[selectedSection - 1]?.title}). Total responses: ${surveyData.length}. Provide insights, trends, and answer questions about the survey data.`
            },
            ...chatMessages,
            { role: 'user', content: userMessage }
          ]
        }
      });

      if (error) throw error;

      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('AI chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive'
      });
    } finally {
      setChatLoading(false);
    }
  };

  const renderSectionAnalytics = () => {
    const sections = SURVEY_SECTIONS[selectedYear as keyof typeof SURVEY_SECTIONS] || [];
    const currentSection = sections[selectedSection - 1];
    
    if (!currentSection) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{currentSection.title}</h2>
            <p className="text-muted-foreground mt-1">Analyzing {surveyData.length} survey responses</p>
          </div>
          <Button onClick={fetchSurveyData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards with Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{surveyData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed surveys</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Fields Analyzed</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{currentSection.fields.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Data points</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Survey Year</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{selectedYear}</div>
              <p className="text-xs text-muted-foreground mt-1">Current dataset</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Section Progress</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{selectedSection} / {sections.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sections reviewed</p>
            </CardContent>
          </Card>
        </div>

        {/* Field Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentSection.fields.map((field, idx) => {
            const distribution = calculateDistribution(field);
            const stats = calculateNumericStats(field);
            const hasNumericData = stats !== null && stats.count > 0;

            return (
              <Card key={field} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{formatFieldName(field)}</CardTitle>
                      <CardDescription className="mt-1">
                        {hasNumericData ? `${stats.count} numeric values` : `${distribution.reduce((sum, d) => sum + d.value, 0)} responses`}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {hasNumericData ? 'Numeric' : 'Categorical'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {hasNumericData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Average</p>
                          <p className="text-xl font-bold">{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Median</p>
                          <p className="text-xl font-bold">{stats.median.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Min</p>
                          <p className="text-xl font-bold">{stats.min.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Max</p>
                          <p className="text-xl font-bold">{stats.max.toLocaleString()}</p>
                        </div>
                      </div>
                      {distribution.length > 0 && (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 11 }} 
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Bar dataKey="value" fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  ) : distribution.length > 0 ? (
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={280}>
                        {distribution.length > 6 ? (
                          <BarChart data={distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 10 }} 
                              angle={-45} 
                              textAnchor="end" 
                              height={100}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Bar dataKey="value" fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                              outerRadius={90}
                              dataKey="value"
                            >
                              {distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {distribution.slice(0, 5).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                              />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.value}</span>
                              <Badge variant="secondary">{item.percentage}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <PieChartIcon className="h-12 w-12 mb-3 opacity-20" />
                      <p className="text-sm">No data available for this field</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  if (userRole !== 'admin') {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
        </div>
      </SidebarLayout>
    );
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  const sections = SURVEY_SECTIONS[selectedYear as keyof typeof SURVEY_SECTIONS] || [];

  return (
    <SidebarLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              Survey Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Comprehensive insights and data visualization</p>
          </div>
          <Button variant="default" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Year Selection */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Select Survey Year
            </CardTitle>
            <CardDescription>Choose which year's survey data to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="2021" className="text-base">2021</TabsTrigger>
                <TabsTrigger value="2022" className="text-base">2022</TabsTrigger>
                <TabsTrigger value="2023" className="text-base">2023</TabsTrigger>
                <TabsTrigger value="2024" className="text-base">2024</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <Card className="lg:col-span-1 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Survey Sections
              </CardTitle>
              <CardDescription>Navigate through sections</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={selectedSection === section.id ? 'default' : 'ghost'}
                      className={`w-full justify-start transition-all ${
                        selectedSection === section.id 
                          ? 'shadow-md' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <span className="font-bold mr-3 text-primary">{section.id}.</span>
                      {section.title}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Analytics Content */}
          <div className="lg:col-span-2 space-y-6">
            {renderSectionAnalytics()}
          </div>

          {/* AI Assistant */}
          <Card className="lg:col-span-1 border-none shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get insights from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4 pr-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Ask me anything about the survey data!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about trends, insights..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  disabled={chatLoading}
                />
                <Button onClick={sendChatMessage} disabled={chatLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
