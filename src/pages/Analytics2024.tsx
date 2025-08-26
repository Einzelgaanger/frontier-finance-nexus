import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface SurveyResponse2024 {
  id: string;
  email_address: string;
  investment_networks: string[];
  investment_networks_other: string;
  organisation_name: string;
  funds_raising_investing: string;
  fund_name: string;
  legal_entity_achieved: string;
  first_close_achieved: string;
  first_investment_achieved: string;
  geographic_markets: string[];
  geographic_markets_other: string;
  team_based: string[];
  team_based_other: string;
  fte_staff_2023_actual: number;
  fte_staff_current: number;
  fte_staff_2025_forecast: number;
  investment_approval: string[];
  investment_approval_other: string;
  principals_total: number;
  principals_women: number;
  gender_inclusion: string[];
  gender_inclusion_other: string;
  team_experience_investments: Record<string, string>;
  team_experience_exits: Record<string, string>;
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export default function Analytics2024() {
  const [data, setData] = useState<SurveyResponse2024[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: responses, error } = await supabase
        .from('survey_responses_2024')
        .select('*');

      if (error) throw error;
      setData(responses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistribution = (field: keyof SurveyResponse2024) => {
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

  const calculatePercentageDistribution = (field: keyof SurveyResponse2024) => {
    const distribution = calculateDistribution(field);
    const total = data.length;
    
    return distribution.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
    }));
  };

  const calculateNumericStats = (field: keyof SurveyResponse2024) => {
    const values = data
      .map(response => response[field])
      .filter(value => typeof value === 'number' && !isNaN(value)) as number[];
    
    if (values.length === 0) return { min: 0, max: 0, avg: 0, total: 0 };
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      total: values.reduce((sum, val) => sum + val, 0)
    };
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

  const renderIntroductionAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Networks</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('investment_networks')}>
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
          <CardTitle>Funds Raising/Investing</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculateDistribution('funds_raising_investing')}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {calculateDistribution('funds_raising_investing').map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizationalAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Timeline Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-3">Legal Entity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('legal_entity_achieved')}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {calculateDistribution('legal_entity_achieved').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">First Close</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('first_close_achieved')}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {calculateDistribution('first_close_achieved').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">First Investment</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('first_investment_achieved')}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {calculateDistribution('first_investment_achieved').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Markets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateDistribution('geographic_markets')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={calculateDistribution('team_based')}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#FFBB28"
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

      <Card>
        <CardHeader>
          <CardTitle>Staff Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-medium mb-2">December 2023</h4>
              <div className="text-2xl font-bold text-blue-600">
                {calculateNumericStats('fte_staff_2023_actual').avg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average FTEs</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium mb-2">Current</h4>
              <div className="text-2xl font-bold text-green-600">
                {calculateNumericStats('fte_staff_current').avg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average FTEs</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium mb-2">2025 Forecast</h4>
              <div className="text-2xl font-bold text-purple-600">
                {calculateNumericStats('fte_staff_2025_forecast').avg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average FTEs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Approval Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('investment_approval').map((item) => (
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
          <CardTitle>Principals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <h4 className="font-medium mb-2">Total Principals</h4>
              <div className="text-2xl font-bold text-blue-600">
                {calculateNumericStats('principals_total').avg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average per fund</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium mb-2">Women Principals</h4>
              <div className="text-2xl font-bold text-pink-600">
                {calculateNumericStats('principals_women').avg.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average per fund</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gender Inclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {calculateDistribution('gender_inclusion').map((item) => (
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
        <h2 className="text-3xl font-bold">2024 MSME Financing Survey Analytics</h2>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="introduction">Introduction & Context</SelectItem>
            <SelectItem value="organizational">Organizational Background</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedMetric === 'overview' && renderOverview()}
      {selectedMetric === 'introduction' && renderIntroductionAnalytics()}
      {selectedMetric === 'organizational' && renderOrganizationalAnalytics()}
    </div>
  );
} 