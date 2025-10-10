import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface SurveyResponse2023 {
  id: string;
  email_address: string;
  organisation_name: string;
  fund_name: string;
  fund_stage: string;
  geographic_focus: string[];
  investment_vehicle_type: string;
  business_model: string;
  sectors: string[];
  investment_thesis: string;
  capital_construct: string;
  investment_criteria: string[];
  deal_flow_sources: string[];
  portfolio_size: string;
  team_structure: string;
  team_expertise: string;
  exit_strategies: string[];
  return_expectations: string;
  value_add_services: string[];
  covid_19_impacts: string[];
  network_engagement: string[];
  mentoring: string[];
  demystifying_sessions: string[];
  convening_initiatives: string[];
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export default function Analytics2023() {
  const [data, setData] = useState<SurveyResponse2023[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: responses, error } = await supabase
        .from('survey_2023_responses')
        .select('*');

      if (error) throw error;
      setData(responses as any || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistribution = (field: keyof SurveyResponse2023) => {
    const distribution: { [key: string]: number } = {};
    
    data.forEach(response => {
      const value = response[field];
      if (Array.isArray(value)) {
        value.forEach(item => {
          distribution[item] = (distribution[item] || 0) + 1;
        });
      } else if (value) {
        distribution[value] = (distribution[value] || 0) + 1;
      }
    });
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const calculatePercentageDistribution = (field: keyof SurveyResponse2023) => {
    const distribution = calculateDistribution(field);
    const total = data.length;
    
    return distribution.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
    }));
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{new Set(data.map(d => d.organisation_name)).size}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{new Set(data.map(d => d.fund_name)).size}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length > 0 ? '100%' : '0%'}</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackgroundAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fund Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('fund_stage')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculateDistribution('geographic_focus')}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {calculateDistribution('geographic_focus').map((entry, index) => (
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
          <CardTitle>Investment Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('investment_vehicle_type')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvestmentAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sector Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('sectors')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Thesis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculateDistribution('investment_thesis')}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#FF8042"
                dataKey="value"
              >
                {calculateDistribution('investment_thesis').map((entry, index) => (
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
          <CardTitle>Investment Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('investment_criteria').map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.name}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPortfolioAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Size Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('portfolio_size')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884D8" />
            </BarChart>
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
                data={calculateDistribution('team_structure')}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#82CA9D"
                dataKey="value"
              >
                {calculateDistribution('team_structure').map((entry, index) => (
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
          <CardTitle>Exit Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('exit_strategies').map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.name}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCovidImpactAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>COVID-19 Impacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('covid_19_impacts').map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.name}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('network_engagement')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFC658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderNetworkAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentoring Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('mentoring').map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.name}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demystifying Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('demystifying_sessions')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convening Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('convening_initiatives').map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">{item.name}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">2023 ESCP Survey Analytics</h2>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select metric" />
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

      {selectedMetric === 'overview' && renderOverview()}
      {selectedMetric === 'background' && renderBackgroundAnalytics()}
      {selectedMetric === 'investment' && renderInvestmentAnalytics()}
      {selectedMetric === 'portfolio' && renderPortfolioAnalytics()}
      {selectedMetric === 'covid' && renderCovidImpactAnalytics()}
      {selectedMetric === 'network' && renderNetworkAnalytics()}
    </div>
  );
} 