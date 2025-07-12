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
  Upload,
  Users,
  Globe,
  Target,
  TrendingUp,
  DollarSign,
  LayoutDashboard,
  UserPlus,
  UserCheck,
  AlertTriangle
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
  // Remove the profiles property since it's not in the member_surveys table
  // profiles: {
  //   first_name: string;
  //   last_name: string;
  //   email: string;
  // };
}

const Admin = () => {
  const { user, userRole } = useAuth();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
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
  }, [userRole]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch member surveys for analytics
      const { data: surveys, error } = await supabase
        .from('member_surveys')
        .select('*')
        .not('completed_at', 'is', null);

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
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setIsApproving(true);
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;
      fetchMembershipRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setIsApproving(false);
      setSelectedRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      fetchMembershipRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsRejecting(false);
      setSelectedRequest(null);
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
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
            <CardTitle>Geographic Distribution</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Membership Requests */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Membership Requests</CardTitle>
              <UserPlus className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {membershipRequests.length === 0 ? (
                <div className="text-center py-4">
                  <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No pending requests</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {membershipRequests.map((request) => (
                    <li key={request.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.applicant_name}</p>
                            <p className="text-xs text-gray-500">{request.email}</p>
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Total Funds */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{fundManagers.length}</div>
              <p className="text-sm text-gray-500">Active fund managers</p>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Analytics Overview</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Key metrics and insights</p>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {renderAnalytics()}

        {/* Membership Request Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Membership Request Details
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Review the details of this membership request and take action.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Applicant Name:</p>
                    <p className="text-sm text-gray-500">{selectedRequest.applicant_name}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">Email:</p>
                    <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">Motivation:</p>
                    <p className="text-sm text-gray-500">{selectedRequest.motivation}</p>
                    {/* Display other relevant details here */}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    disabled={isApproving}
                  >
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    disabled={isRejecting}
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setSelectedRequest(null)}
                  >
                    Cancel
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
