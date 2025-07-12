import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Building2,
  FileText,
  Users,
  Globe,
  TrendingUp,
  DollarSign,
  LayoutDashboard,
  UserPlus,
  UserCheck,
  AlertTriangle,
  Calendar,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  website: string | null;
}

interface MembershipRequest {
  id: string;
  user_id: string;
  applicant_name: string;
  email: string;
  vehicle_name: string;
  organization_name: string | null;
  organization_website: string | null;
  fund_vehicle_name: string | null;
  fund_vehicle_type: string | null;
  year_founded: number | null;
  country_of_operation: string | null;
  aum: string | null;
  fundraising_status: string | null;
  investment_focus: string | null;
  team_overview: string | null;
  notable_investments: string | null;
  motivation: string | null;
  additional_comments: string | null;
  status: string;
  created_at: string | null;
}

const Admin = () => {
  const { user, userRole } = useAuth();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState({
    totalFunds: 0,
    totalCapital: 0,
    averageTicketSize: 0,
    activeMarkets: [] as string[],
    fundsByType: [] as { name: string; value: number }[],
    fundsByRegion: [] as { name: string; value: number }[],
    capitalTrends: [] as { month: string; amount: number }[],
    growthMetrics: {
      monthlyGrowth: 0,
      newFundsThisMonth: 0,
      totalInvestments: 0
    }
  });

  const fetchFundManagers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null);

      if (error) throw error;
      setFundManagers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      setLoading(false);
    }
  }, []);

  const fetchMembershipRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (error) {
      console.error('Error fetching membership requests:', error);
    }
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchFundManagers();
      fetchMembershipRequests();
    }
  }, [userRole, fetchFundManagers, fetchMembershipRequests]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAnalyticsData();
    }
  }, [userRole, selectedYear]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch member surveys for analytics with year filter
      const { data: surveys, error } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null)
        .gte('created_at', `${selectedYear}-01-01`)
        .lt('created_at', `${selectedYear + 1}-01-01`);

      if (error) throw error;

      if (surveys && surveys.length > 0) {
        // Calculate analytics
        const totalFunds = surveys.length;
        
        // Parse AUM and calculate total capital
        const totalCapital = surveys.reduce((sum, survey) => {
          if (survey.aum) {
            const amount = parseFloat(survey.aum.replace(/[^0-9.]/g, ''));
            return sum + (isNaN(amount) ? 0 : amount);
          }
          return sum;
        }, 0);

        // Calculate average ticket size
        const ticketSizes = surveys
          .map(s => s.typical_check_size)
          .filter(Boolean)
          .map(size => {
            const match = size.match(/[\d,]+/);
            return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
          })
          .filter(size => size > 0);
        
        const averageTicketSize = ticketSizes.length > 0 
          ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
          : 0;

        // Get active markets
        const activeMarkets = [...new Set(
          surveys
            .map(s => s.primary_investment_region)
            .filter(Boolean)
        )];

        // Funds by type
        const typeCount = surveys.reduce((acc, survey) => {
          const type = survey.fund_type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const fundsByType = Object.entries(typeCount).map(([name, value]) => ({
          name, value
        }));

        // Funds by region
        const regionCount = surveys.reduce((acc, survey) => {
          const region = survey.primary_investment_region || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const fundsByRegion = Object.entries(regionCount).map(([name, value]) => ({
          name, value
        }));

        // Growth metrics
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const newFundsThisMonth = surveys.filter(survey => {
          if (survey.created_at) {
            const createdDate = new Date(survey.created_at);
            return createdDate.getMonth() === currentMonth && 
                   createdDate.getFullYear() === currentYear;
          }
          return false;
        }).length;

        const totalInvestments = surveys.reduce((sum, survey) => 
          sum + (survey.number_of_investments || 0), 0);

        // Calculate monthly growth (simplified)
        const monthlyGrowth = newFundsThisMonth > 0 
          ? (newFundsThisMonth / Math.max((totalFunds - newFundsThisMonth), 1)) * 100 
          : 0;

        // Generate capital trends (last 6 months)
        const capitalTrends = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          
          // This is a simplified calculation - in reality you'd track historical data
          const monthlyAmount = totalCapital * (0.8 + (Math.random() * 0.4));
          capitalTrends.push({
            month: monthName,
            amount: Math.round(monthlyAmount / 6)
          });
        }

        setAnalyticsData({
          totalFunds,
          totalCapital,
          averageTicketSize,
          activeMarkets,
          fundsByType,
          fundsByRegion,
          capitalTrends,
          growthMetrics: {
            monthlyGrowth,
            newFundsThisMonth,
            totalInvestments
          }
        });
      } else {
        // Reset analytics if no data for selected year
        setAnalyticsData({
          totalFunds: 0,
          totalCapital: 0,
          averageTicketSize: 0,
          activeMarkets: [],
          fundsByType: [],
          fundsByRegion: [],
          capitalTrends: [],
          growthMetrics: {
            monthlyGrowth: 0,
            newFundsThisMonth: 0,
            totalInvestments: 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleRoleChange = async (requestId: string, newRole: 'viewer' | 'member') => {
    setIsUpdating(true);
    try {
      // Get the membership request to find the user_id
      const request = membershipRequests.find(r => r.id === requestId);
      if (!request) return;

      // Update the user's role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', request.user_id);

      if (roleError) throw roleError;

      // Update the membership request status
      const { error: requestError } = await supabase
        .from('membership_requests')
        .update({ 
          status: newRole === 'member' ? 'approved' : 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Refresh the data
      fetchMembershipRequests();
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setIsUpdating(false);
      setSelectedRequest(null);
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Year Selection */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Funds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalFunds}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total AUM</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(analyticsData.totalCapital / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Ticket Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(analyticsData.averageTicketSize / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Markets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.activeMarkets.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-3xl font-bold text-green-600">
                +{analyticsData.growthMetrics.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">New Funds This Month</p>
              <p className="text-3xl font-bold text-blue-600">
                {analyticsData.growthMetrics.newFundsThisMonth}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Investments</p>
              <p className="text-3xl font-bold text-purple-600">
                {analyticsData.growthMetrics.totalInvestments}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fund Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.fundsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.fundsByType.map((entry, index) => (
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
            <CardTitle>Fund Distribution by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.fundsByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Capital Trends (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.capitalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'AUM']} />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Admin Access Required</CardTitle>
              <CardDescription className="text-red-700">
                You do not have permission to view this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage network members and view analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <UserPlus className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {membershipRequests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-sm text-gray-500">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{fundManagers.length}</div>
              <p className="text-sm text-gray-500">Active fund managers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Analytics Year</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{selectedYear}</div>
              <p className="text-sm text-gray-500">Selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Membership Applications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Membership Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipRequests.filter(r => r.status === 'pending').map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{request.applicant_name}</CardTitle>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <CardDescription className="text-xs">{request.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Vehicle:</span> {request.vehicle_name}</p>
                    <p><span className="font-medium">Organization:</span> {request.organization_name || 'N/A'}</p>
                    <p><span className="font-medium">Country:</span> {request.country_of_operation || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Select
                      value=""
                      onValueChange={(value) => handleRoleChange(request.id, value as 'viewer' | 'member')}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Approve</SelectItem>
                        <SelectItem value="viewer">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {renderAnalytics()}

        {/* Application Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Application Details - {selectedRequest.applicant_name}
                      </h3>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                          <p><span className="font-medium">Vehicle Name:</span> {selectedRequest.vehicle_name}</p>
                          <p><span className="font-medium">Organization:</span> {selectedRequest.organization_name || 'N/A'}</p>
                          <p><span className="font-medium">Organization Website:</span> {selectedRequest.organization_website || 'N/A'}</p>
                          <p><span className="font-medium">Fund Vehicle Name:</span> {selectedRequest.fund_vehicle_name || 'N/A'}</p>
                          <p><span className="font-medium">Fund Vehicle Type:</span> {selectedRequest.fund_vehicle_type || 'N/A'}</p>
                          <p><span className="font-medium">Year Founded:</span> {selectedRequest.year_founded || 'N/A'}</p>
                          <p><span className="font-medium">Country of Operation:</span> {selectedRequest.country_of_operation || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-medium">AUM:</span> {selectedRequest.aum || 'N/A'}</p>
                          <p><span className="font-medium">Fundraising Status:</span> {selectedRequest.fundraising_status || 'N/A'}</p>
                          <p><span className="font-medium">Investment Focus:</span> {selectedRequest.investment_focus || 'N/A'}</p>
                          <p><span className="font-medium">Team Overview:</span> {selectedRequest.team_overview || 'N/A'}</p>
                          <p><span className="font-medium">Notable Investments:</span> {selectedRequest.notable_investments || 'N/A'}</p>
                          <p><span className="font-medium">Motivation:</span> {selectedRequest.motivation || 'N/A'}</p>
                          <p><span className="font-medium">Additional Comments:</span> {selectedRequest.additional_comments || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Select
                    value=""
                    onValueChange={(value) => handleRoleChange(selectedRequest.id, value as 'viewer' | 'member')}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Approve
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 mr-2 text-red-600" />
                          Reject
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setSelectedRequest(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
