import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  XCircle,
  File,
  Clock,
  Activity,
  Archive,
  UserX,
  UserCog,
  Briefcase,
  MapPin,
  Link,
  Target,
  Award,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link as RouterLink } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';
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
  vehicle_website: string | null;
  role_job_title: string | null;
  team_size: string | null;
  location: string | null;
  thesis: string | null;
  ticket_size: string | null;
  portfolio_investments: string | null;
  capital_raised: string | null;
  supporting_documents: string | null;
  information_sharing: {
    fundraising_experience: boolean;
    getting_started_experience: boolean;
    fund_economics: boolean;
    due_diligence_expertise: boolean;
    portfolio_support: boolean;
    market_data: boolean;
    local_market_insights: boolean;
    co_investing_opportunities: boolean;
    other: boolean;
    other_text: string;
  } | null;
  expectations: string | null;
  how_heard_about_network: string | null;
  status: string;
  created_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface ActivityLogDetails {
  applicant_name?: string;
  old_role?: string;
  new_role?: string;
  target_user_id?: string;
}

interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  details: ActivityLogDetails;
  created_at: string;
  user_agent: string | null;
}

const Admin = () => {
  const { user, userRole } = useAuth();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{requestId: string, newRole: 'viewer' | 'member'} | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
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

  const fetchActivityLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivityLogs((data || []) as ActivityLog[]);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchFundManagers();
      fetchMembershipRequests();
      fetchActivityLogs();
    }
  }, [userRole, fetchFundManagers, fetchMembershipRequests, fetchActivityLogs]);

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
          ? (newFundsThisMonth / Math.max(totalFunds - newFundsThisMonth, 1)) * 100 
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
    setPendingRoleChange({ requestId, newRole });
    setShowConfirmDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    setIsUpdating(true);
    try {
      const request = membershipRequests.find(r => r.id === pendingRoleChange.requestId);
      if (!request) throw new Error('Request not found');

      // Update membership request status
      const { error: updateError } = await supabase
        .from('membership_requests')
        .update({
          status: pendingRoleChange.newRole === 'member' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', pendingRoleChange.requestId);

      if (updateError) throw updateError;

      // Update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: pendingRoleChange.newRole })
        .eq('user_id', request.user_id);

      if (roleError) throw roleError;

      // Log the activity
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id,
          action: 'role_changed',
          details: {
            applicant_name: request.applicant_name,
            old_role: 'viewer',
            new_role: pendingRoleChange.newRole,
            target_user_id: request.user_id
          }
        });

      if (logError) console.error('Error logging activity:', logError);

      // Refresh data
      await fetchMembershipRequests();
      await fetchActivityLogs();

      setShowConfirmDialog(false);
      setPendingRoleChange(null);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalFunds}</div>
            <p className="text-sm opacity-90">Active fund managers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Capital</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalCapital.toLocaleString()}M</div>
            <p className="text-sm opacity-90">Under management</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Ticket Size</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.averageTicketSize.toLocaleString()}K</div>
            <p className="text-sm opacity-90">Per investment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
            <Globe className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeMarkets.length}</div>
            <p className="text-sm opacity-90">Geographic regions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funds by Type</CardTitle>
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
            <CardTitle>Capital Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.capitalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage applications, members, and network analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <UserPlus className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {membershipRequests.filter(r => r.status === 'pending').length}
                  </div>
                  <p className="text-sm opacity-90">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fundManagers.length}</div>
                  <p className="text-sm opacity-90">Active fund managers</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Analytics Year</CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedYear}</div>
                  <p className="text-sm opacity-90">Selected period</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <LayoutDashboard className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" size="sm" asChild>
                    <RouterLink to="/analytics">View Analytics</RouterLink>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {renderAnalytics()}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Membership Applications</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending: {membershipRequests.filter(r => r.status === 'pending').length}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Approved: {membershipRequests.filter(r => r.status === 'approved').length}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Rejected: {membershipRequests.filter(r => r.status === 'rejected').length}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membershipRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-l-4" style={{
                  borderLeftColor: request.status === 'pending' ? '#f59e0b' : 
                                 request.status === 'approved' ? '#10b981' : '#ef4444'
                }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{request.applicant_name}</CardTitle>
                      <Badge 
                        variant={request.status === 'pending' ? 'secondary' : 
                                request.status === 'approved' ? 'default' : 'destructive'}
                        className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                 request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                 'bg-red-100 text-red-800'}
                      >
                        {request.status === 'pending' ? 'Pending' : 
                         request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{request.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Vehicle:</span> {request.vehicle_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Organization:</span> {request.organization_name || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Country:</span> {request.country_of_operation || 'N/A'}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <Select
                          value=""
                          onValueChange={(value) => handleRoleChange(request.id, value as 'viewer' | 'member')}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Make Member</SelectItem>
                            <SelectItem value="viewer">Keep Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Member Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membershipRequests.filter(r => r.status === 'approved').map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{request.applicant_name}</CardTitle>
                      <Badge variant="default" className="bg-green-100 text-green-800">Member</Badge>
                    </div>
                    <CardDescription className="text-xs">{request.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Vehicle:</span> {request.vehicle_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Organization:</span> {request.organization_name || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Country:</span> {request.country_of_operation || 'N/A'}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        className="flex-1"
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
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Keep Member</SelectItem>
                          <SelectItem value="viewer">Make Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
            </div>

            <div className="space-y-4">
              {activityLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {log.details && (
                        <div className="text-sm text-gray-600">
                          {(log.details as ActivityLogDetails)?.applicant_name && (
                            <p>User: {(log.details as ActivityLogDetails).applicant_name}</p>
                          )}
                          {(log.details as ActivityLogDetails)?.old_role && (log.details as ActivityLogDetails)?.new_role && (
                            <p>Role: {(log.details as ActivityLogDetails).old_role} → {(log.details as ActivityLogDetails).new_role}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Application Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Application Details - {selectedRequest.applicant_name}
                      </h3>
                      <div className="mt-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                <h4 className="font-medium text-gray-900">Background Information</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Name:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.applicant_name}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Email:</p>
                                  <p className="text-gray-600 break-all">{selectedRequest.email}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Vehicle Name:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.vehicle_name}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Vehicle Website:</p>
                                  <p className="text-gray-600 break-all">{selectedRequest.vehicle_website || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <h4 className="font-medium text-gray-900">Team Information</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Role/Job Title:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.role_job_title || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Team Size:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.team_size || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Location:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.location || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-4 w-4 text-purple-600" />
                                <h4 className="font-medium text-gray-900">Vehicle Information</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Thesis:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.thesis || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Ticket Size:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.ticket_size || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Portfolio Investments:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.portfolio_investments || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Capital Raised:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.capital_raised || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Supporting Documents:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.supporting_documents || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-orange-600" />
                                <h4 className="font-medium text-gray-900">Information Sharing</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                {selectedRequest.information_sharing ? (
                                  <div className="space-y-1">
                                    {selectedRequest.information_sharing.fundraising_experience && <p>• Fundraising Experience</p>}
                                    {selectedRequest.information_sharing.getting_started_experience && <p>• Experience of getting started/launching</p>}
                                    {selectedRequest.information_sharing.fund_economics && <p>• Fund Economics (eg vehicle structuring)</p>}
                                    {selectedRequest.information_sharing.due_diligence_expertise && <p>• Due Diligence Expertise/Investment Readiness</p>}
                                    {selectedRequest.information_sharing.portfolio_support && <p>• Portfolio Support/Technical Assistance</p>}
                                    {selectedRequest.information_sharing.market_data && <p>• Market Data (eg termsheets, valuations)</p>}
                                    {selectedRequest.information_sharing.local_market_insights && <p>• Local Market Insights (Geographical or sector expertise)</p>}
                                    {selectedRequest.information_sharing.co_investing_opportunities && <p>• Co-investing Opportunities</p>}
                                    {selectedRequest.information_sharing.other && (
                                      <p>• Other: {selectedRequest.information_sharing.other_text}</p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-gray-500">No information sharing preferences specified</p>
                                )}
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="h-4 w-4 text-yellow-600" />
                                <h4 className="font-medium text-gray-900">ESCP Network Expectations</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Expectations:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.expectations || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">How heard about network:</p>
                                  <p className="text-gray-600 break-words">{selectedRequest.how_heard_about_network || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {selectedRequest.status === 'pending' && (
                    <Select
                      value=""
                      onValueChange={(value) => handleRoleChange(selectedRequest.id, value as 'viewer' | 'member')}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Make Member
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Keep as Viewer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
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

        {/* Confirmation Dialog */}
        {showConfirmDialog && pendingRoleChange && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Role Change
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to change this user's role to <strong>{pendingRoleChange.newRole}</strong>?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    onClick={confirmRoleChange}
                    disabled={isUpdating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isUpdating ? 'Updating...' : 'Confirm'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setPendingRoleChange(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
