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
  MessageSquare,
  User,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link as RouterLink } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';
import { populateMemberSurveys } from '@/utils/populateMemberSurveys';
import CreateViewerModal from '@/components/admin/CreateViewerModal';
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
  vehicle_website?: string | null;
  domicile_country?: string | null;
  organization_name?: string | null;
  country_of_operation?: string | null;
  role_job_title?: string | null;
  team_size?: string | null;
  location?: string | null;
  thesis?: string | null;
  ticket_size?: string | null;
  portfolio_investments?: string | null;
  capital_raised?: string | null;
  supporting_documents?: string | null;
  information_sharing?: {
    topics?: string[];
    other?: string;
  } | null;
  expectations?: string | null;
  how_heard_about_network?: string | null;
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
  [key: string]: string | number | boolean | null | undefined;
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
  const [activeTab, setActiveTab] = useState('applications');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{requestId: string, newRole: 'viewer' | 'member'} | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showCreateViewerModal, setShowCreateViewerModal] = useState(false);
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

        // Generate capital trends based on actual survey completion dates
        const capitalTrends = [];
        const monthlyData: { [key: string]: number } = {};
        
        surveys.forEach(survey => {
          if (survey.created_at) {
            const date = new Date(survey.created_at);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (survey.aum) {
              const amount = parseFloat(survey.aum.replace(/[^0-9.]/g, ''));
              if (!isNaN(amount)) {
                monthlyData[monthKey] = (monthlyData[monthKey] || 0) + amount;
              }
            }
          }
        });
        
        // Fill in missing months with 0
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          capitalTrends.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            amount: Math.round(monthlyData[monthKey] || 0)
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
      await logActivity('role_changed', {
        applicant_name: request.applicant_name,
        old_role: 'viewer',
        new_role: pendingRoleChange.newRole,
        target_user_id: request.user_id
      });

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

  const handlePopulateMemberSurveys = async () => {
    try {
      await populateMemberSurveys();
      // Refresh data after population
      await fetchFundManagers();
      await fetchMembershipRequests();
      
      // Log the activity
      await logActivity('network_data_populated', {
        applicant_name: 'Admin',
        target_user_id: user?.id
      });
    } catch (error) {
      console.error('Error populating member surveys:', error);
    }
  };

  const logActivity = async (action: string, details: ActivityLogDetails) => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user?.id,
          action,
          details,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleViewApplication = async (request: MembershipRequest) => {
    setSelectedRequest(request);
    await logActivity('application_viewed', {
      applicant_name: request.applicant_name,
      target_user_id: request.user_id
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'role_changed':
        return <UserCog className="h-4 w-4 text-blue-600" />;
      case 'application_submitted':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'application_approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'application_rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'application_viewed':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'survey_completed':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'profile_updated':
        return <User className="h-4 w-4 text-orange-600" />;
      case 'network_data_populated':
        return <Building2 className="h-4 w-4 text-indigo-600" />;
      case 'login':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'logout':
        return <UserX className="h-4 w-4 text-gray-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'role_changed':
        return 'bg-blue-50 border-blue-200';
      case 'application_submitted':
        return 'bg-green-50 border-green-200';
      case 'application_approved':
        return 'bg-green-50 border-green-200';
      case 'application_rejected':
        return 'bg-red-50 border-red-200';
      case 'application_viewed':
        return 'bg-blue-50 border-blue-200';
      case 'survey_completed':
        return 'bg-purple-50 border-purple-200';
      case 'profile_updated':
        return 'bg-orange-50 border-orange-200';
      case 'network_data_populated':
        return 'bg-indigo-50 border-indigo-200';
      case 'login':
        return 'bg-blue-50 border-blue-200';
      case 'logout':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatActivityDetails = (log: ActivityLog) => {
    const details = log.details as ActivityLogDetails;
    const action = log.action.toLowerCase();
    
    switch (action) {
      case 'role_changed':
        return `${details.applicant_name || 'User'} role changed from ${details.old_role} to ${details.new_role}`;
      case 'application_submitted':
        return `Application submitted by ${details.applicant_name || 'User'}`;
      case 'application_approved':
        return `Application approved for ${details.applicant_name || 'User'}`;
      case 'application_rejected':
        return `Application rejected for ${details.applicant_name || 'User'}`;
      case 'application_viewed':
        return `Application viewed for ${details.applicant_name || 'User'}`;
      case 'survey_completed':
        return `Survey completed by ${details.applicant_name || 'User'}`;
      case 'profile_updated':
        return `Profile updated by ${details.applicant_name || 'User'}`;
      case 'network_data_populated':
        return `Network data populated by admin`;
      case 'login':
        return `User logged in`;
      case 'logout':
        return `User logged out`;
      default:
        return log.action;
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
          <p className="text-gray-600">Manage applications, members, and network activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-l-4 border-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {membershipRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Members</p>
                  <p className="text-2xl font-bold text-green-600">
                    {membershipRequests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {membershipRequests.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activities</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {activityLogs.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Membership Applications</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowCreateViewerModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Viewer
                </Button>
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
                <Card key={request.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => handleViewApplication(request)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-medium truncate flex-1">{request.applicant_name}</CardTitle>
                      <Badge 
                        variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}
                        className={`flex-shrink-0 ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs truncate">{request.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.vehicle_name}</span>
                      </div>
                      {request.vehicle_website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <a 
                            href={request.vehicle_website.startsWith('http') ? request.vehicle_website : `https://${request.vehicle_website}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {request.vehicle_website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Member Management</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Total Members: {membershipRequests.filter(r => r.status === 'approved').length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membershipRequests.filter(r => r.status === 'approved').map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-medium truncate flex-1">{request.applicant_name}</CardTitle>
                      <Badge variant="default" className="bg-green-100 text-green-800 flex-shrink-0">Member</Badge>
                    </div>
                    <CardDescription className="text-xs truncate">{request.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.vehicle_name}</span>
                      </div>
                      {request.vehicle_website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <a 
                            href={request.vehicle_website.startsWith('http') ? request.vehicle_website : `https://${request.vehicle_website}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate block"
                          >
                            {request.vehicle_website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.team_size || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.ticket_size || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Total: {activityLogs.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {activityLogs.map((log) => (
                <Card key={log.id} className={`hover:shadow-md transition-shadow ${getActivityColor(log.action)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {getActivityIcon(log.action)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{formatActivityDetails(log)}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                            {log.user_agent && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {log.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {log.action.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
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
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border-0 max-h-[90vh] overflow-y-auto">
                <div className="bg-blue-600 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white sm:mx-0">
                      <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg sm:text-xl leading-6 font-bold text-white break-words">
                        Application Details - {selectedRequest.applicant_name}
                      </h3>
                      <p className="text-blue-100 mt-2 text-sm">Review application information and supporting documents</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 sm:px-6 py-4 sm:py-6">
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Background Information</h4>
                          </div>
                          <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-3">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Name</p>
                                <p className="text-gray-600 break-words">{selectedRequest.applicant_name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Email</p>
                                <p className="text-gray-600 break-all">{selectedRequest.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Vehicle Name</p>
                                <p className="text-gray-600 break-words">{selectedRequest.vehicle_name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Vehicle Website</p>
                                {selectedRequest.vehicle_website ? (
                                  <a 
                                    href={selectedRequest.vehicle_website.startsWith('http') ? selectedRequest.vehicle_website : `https://${selectedRequest.vehicle_website}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                  >
                                    {selectedRequest.vehicle_website}
                                  </a>
                                ) : (
                                  <p className="text-gray-600">N/A</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Country</p>
                                <p className="text-gray-600 break-words">{selectedRequest.domicile_country || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Team Information</h4>
                          </div>
                          <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-3">
                              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Role/Job Title</p>
                                <p className="text-gray-600 break-words">{selectedRequest.role_job_title || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Team Size</p>
                                <p className="text-gray-600 break-words">{selectedRequest.team_size || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Location</p>
                                <p className="text-gray-600 break-words">{selectedRequest.location || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Vehicle Information</h4>
                          </div>
                          <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-3">
                              <Target className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Thesis</p>
                                <p className="text-gray-600 break-words">{selectedRequest.thesis || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Ticket Size</p>
                                <p className="text-gray-600 break-words">{selectedRequest.ticket_size || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Portfolio Investments</p>
                                <p className="text-gray-600 break-words">{selectedRequest.portfolio_investments || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Capital Raised</p>
                                <p className="text-gray-600 break-words">{selectedRequest.capital_raised || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Supporting Documents</p>
                                {selectedRequest.supporting_documents ? (
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      try {
                                        const urls = JSON.parse(selectedRequest.supporting_documents);
                                        if (Array.isArray(urls)) {
                                          return (
                                            <div className="space-y-1">
                                              {urls.map((url, index) => (
                                                url.startsWith('data:') ? (
                                                  <a
                                                    key={index}
                                                    href={url}
                                                    download={`Document_${index + 1}`}
                                                    className="text-blue-600 hover:underline block break-all"
                                                  >
                                                    Download Document {index + 1}
                                                  </a>
                                                ) : (
                                                  <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline block break-all"
                                                  >
                                                    Document {index + 1}
                                                  </a>
                                                )
                                              ))}
                                            </div>
                                          );
                                        }
                                      } catch (e) { return null; }
                                      // If it's not JSON, treat as single URL
                                      return (
                                        selectedRequest.supporting_documents.startsWith('data:') ? (
                                          <a
                                            href={selectedRequest.supporting_documents}
                                            download="Document"
                                            className="text-blue-600 hover:underline break-all"
                                          >
                                            Download Document
                                          </a>
                                        ) : (
                                          <a
                                            href={selectedRequest.supporting_documents}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline break-all"
                                          >
                                            View Document
                                          </a>
                                        )
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  <p className="text-gray-600">No documents uploaded</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Information Sharing</h4>
                          </div>
                          <div className="space-y-3 text-xs sm:text-sm">
                            {selectedRequest.information_sharing?.topics && selectedRequest.information_sharing.topics.length > 0 ? (
                              <div className="space-y-2">
                                {selectedRequest.information_sharing.topics.map((topic, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 break-words">{topic}</span>
                                  </div>
                                ))}
                                {selectedRequest.information_sharing.other && (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 break-words">Other: {selectedRequest.information_sharing.other}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500">No information sharing preferences specified</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">ESCP Network Expectations</h4>
                          </div>
                          <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex items-start gap-3">
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">Expectations</p>
                                <p className="text-gray-600 break-words">{selectedRequest.expectations || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-700">How heard about network</p>
                                <p className="text-gray-600 break-words">{selectedRequest.how_heard_about_network || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 px-4 sm:px-6 py-4 sm:py-4 sm:flex sm:flex-row-reverse">
                  {selectedRequest.status === 'pending' && (
                    <Select
                      value=""
                      onValueChange={(value) => handleRoleChange(selectedRequest.id, value as 'viewer' | 'member')}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-full sm:w-40 bg-white">
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
                    variant="outline"
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

        {/* Create Viewer Modal */}
        <CreateViewerModal
          open={showCreateViewerModal}
          onClose={() => setShowCreateViewerModal(false)}
          onSuccess={() => {
            fetchMembershipRequests();
            fetchActivityLogs();
          }}
        />
      </div>
    </div>
  );
};

export default Admin;
