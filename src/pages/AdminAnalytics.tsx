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
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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
  Download
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

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

    surveyData.forEach(response => {
      const value = response[fieldName];
      if (Array.isArray(value)) {
        value.forEach(item => {
          distribution[item] = (distribution[item] || 0) + 1;
        });
      } else if (value !== null && value !== undefined) {
        distribution[String(value)] = (distribution[String(value)] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: surveyData.length > 0 ? ((count / surveyData.length) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const calculateNumericStats = (fieldName: string) => {
    const values = surveyData
      .map(r => {
        const val = r[fieldName];
        return typeof val === 'number' ? val : parseFloat(val);
      })
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
            <h2 className="text-2xl font-bold text-foreground">{currentSection.title}</h2>
            <p className="text-muted-foreground">Analytics for {surveyData.length} responses</p>
          </div>
          <Button onClick={fetchSurveyData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{surveyData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fields Analyzed</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{currentSection.fields.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Survey Year</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{selectedYear}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Section</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{selectedSection}/{sections.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Field Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentSection.fields.map((field, idx) => {
            const distribution = calculateDistribution(field);
            const stats = calculateNumericStats(field);
            const hasNumericData = stats.count > 0;

            return (
              <Card key={field}>
                <CardHeader>
                  <CardTitle className="text-lg">{formatFieldName(field)}</CardTitle>
                  <CardDescription>Distribution and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasNumericData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg</p>
                          <p className="text-xl font-bold text-foreground">{stats.avg.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Min</p>
                          <p className="text-xl font-bold text-foreground">{stats.min}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Max</p>
                          <p className="text-xl font-bold text-foreground">{stats.max}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Count</p>
                          <p className="text-xl font-bold text-foreground">{stats.count}</p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill={COLORS[idx % COLORS.length]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : distribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      {distribution.length > 5 ? (
                        <BarChart data={distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill={COLORS[idx % COLORS.length]} />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No data available</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Survey Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive section-by-section analysis</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Year Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Survey Year</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="2021">2021</TabsTrigger>
                <TabsTrigger value="2022">2022</TabsTrigger>
                <TabsTrigger value="2023">2023</TabsTrigger>
                <TabsTrigger value="2024">2024</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={selectedSection === section.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <span className="font-semibold mr-2">{section.id}.</span>
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
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>Ask questions about the data</CardDescription>
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
