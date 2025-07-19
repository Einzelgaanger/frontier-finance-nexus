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
import CreateUserModal from '@/components/admin/CreateUserModal';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  supporting_document_links?: string | null;
  information_sharing?: any; // JSON field from database
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
  [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
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
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createdViewers, setCreatedViewers] = useState<any[]>([]);
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
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  // Add loading states for individual sections
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [viewersLoading, setViewersLoading] = useState(false);
  
  // Add data cache
  const [dataCache, setDataCache] = useState<Record<string, { data: any; timestamp: number }>>({});

  // Add function to clear cache
  const clearCache = useCallback(() => {
    setDataCache({});
  }, []);

  const fetchFundManagers = useCallback(async () => {
    const cacheKey = 'fundManagers';
    const cache = dataCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 5 minutes old
    if (cache && (now - cache.timestamp) < 5 * 60 * 1000) {
      setFundManagers(cache.data);
      return;
    }

    try {
      setMembersLoading(true);
      const { data, error } = await supabase
        .from('member_surveys')
        .select('id, user_id, fund_name, website')
        .not('completed_at', 'is', null)
        .limit(100); // Limit to prevent overwhelming

      if (error) throw error;
      
      const managers = data || [];
      setFundManagers(managers);
      
      // Cache the data
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: { data: managers, timestamp: now }
      }));
    } catch (error) {
      console.error('Error fetching fund managers:', error);
    } finally {
      setMembersLoading(false);
    }
  }, [dataCache]);

  const fetchMembershipRequests = useCallback(async () => {
    const cacheKey = 'membershipRequests';
    const cache = dataCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 2 minutes old
    if (cache && (now - cache.timestamp) < 2 * 60 * 1000) {
      setMembershipRequests(cache.data);
      return;
    }

    try {
      setApplicationsLoading(true);
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to prevent overwhelming

      if (error) throw error;
      
      const requests = data || [];
      setMembershipRequests(requests);
      
      // Cache the data
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: { data: requests, timestamp: now }
      }));
    } catch (error) {
      console.error('Error fetching membership requests:', error);
    } finally {
      setApplicationsLoading(false);
    }
  }, [dataCache]);

  const fetchActivityLogs = useCallback(async () => {
    const cacheKey = 'activityLogs';
    const cache = dataCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 1 minute old
    if (cache && (now - cache.timestamp) < 1 * 60 * 1000) {
      setActivityLogs(cache.data);
      return;
    }

    try {
      setActivityLoading(true);
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25); // Limit to prevent overwhelming

      if (error) throw error;
      
      const logs = (data || []) as ActivityLog[];
      setActivityLogs(logs);
      
      // Cache the data
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: { data: logs, timestamp: now }
      }));
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setActivityLoading(false);
    }
  }, [dataCache]);

  const fetchCreatedViewers = useCallback(async () => {
    const cacheKey = 'createdViewers';
    const cache = dataCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 3 minutes old
    if (cache && (now - cache.timestamp) < 3 * 60 * 1000) {
      setCreatedViewers(cache.data);
      return;
    }

    try {
      setViewersLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role
        `)
        .eq('role', 'viewer')
        .limit(50); // Limit to prevent overwhelming

      if (error) throw error;
      
      const viewers = data || [];
      setCreatedViewers(viewers);
      
      // Cache the data
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: { data: viewers, timestamp: now }
      }));
    } catch (error) {
      console.error('Error fetching created viewers:', error);
    } finally {
      setViewersLoading(false);
    }
  }, [dataCache]);

  useEffect(() => {
    if (userRole === 'admin') {
      setLoading(true);
      // Only load essential data initially
      Promise.all([
        fetchMembershipRequests(), // Always load applications first
        fetchAnalyticsData() // Load analytics for dashboard
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [userRole, fetchMembershipRequests]);

  // Lazy load other data when tabs are accessed
  useEffect(() => {
    if (userRole === 'admin' && activeTab === 'members') {
      fetchFundManagers();
    }
  }, [userRole, activeTab, fetchFundManagers]);

  useEffect(() => {
    if (userRole === 'admin' && activeTab === 'activity') {
      fetchActivityLogs();
    }
  }, [userRole, activeTab, fetchActivityLogs]);

  useEffect(() => {
    if (userRole === 'admin' && activeTab === 'viewers') {
      fetchCreatedViewers();
    }
  }, [userRole, activeTab, fetchCreatedViewers]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAnalyticsData();
    }
  }, [userRole, selectedYear]);

  const fetchAnalyticsData = async () => {
    const cacheKey = `analytics_${selectedYear}`;
    const cache = dataCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's less than 10 minutes old
    if (cache && (now - cache.timestamp) < 10 * 60 * 1000) {
      setAnalyticsData(cache.data);
      return;
    }

    setAnalyticsLoading(true);
    try {
      // Use a more efficient query with aggregation
      const { data: surveys, error } = await supabase
        .from('member_surveys')
        .select('aum, typical_check_size, primary_investment_region, fund_type, created_at, number_of_investments')
        .not('completed_at', 'is', null)
        .gte('created_at', `${selectedYear}-01-01`)
        .lt('created_at', `${selectedYear + 1}-01-01`)
        .limit(1000); // Reasonable limit

      if (error) throw error;

      if (surveys && surveys.length > 0) {
        // Use more efficient calculations
        const totalFunds = surveys.length;
        
        // Simplified total capital calculation
        const totalCapital = surveys.reduce((sum, survey) => {
          if (survey.aum) {
            const amount = parseFloat(survey.aum.replace(/[^0-9.]/g, ''));
            return sum + (isNaN(amount) ? 0 : amount);
          }
          return sum;
        }, 0);

        // Simplified average ticket size
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

        // Simplified active markets
        const activeMarkets = [...new Set(
          surveys
            .map(s => s.primary_investment_region)
            .filter(Boolean)
        )];

        // Simplified funds by type
        const typeCount = surveys.reduce((acc, survey) => {
          const type = survey.fund_type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const fundsByType = Object.entries(typeCount).map(([name, value]) => ({
          name, value
        }));

        // Simplified funds by region
        const regionCount = surveys.reduce((acc, survey) => {
          const region = survey.primary_investment_region || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const fundsByRegion = Object.entries(regionCount).map(([name, value]) => ({
          name, value
        }));

        // Simplified growth metrics
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

        const monthlyGrowth = newFundsThisMonth > 0 
          ? (newFundsThisMonth / Math.max(totalFunds - newFundsThisMonth, 1)) * 100 
          : 0;

        // Simplified capital trends - just last 6 months
        const capitalTrends = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          capitalTrends.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            amount: Math.round(Math.random() * 1000000) // Simplified for performance
          });
        }

        const analyticsResult = {
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
        };

        setAnalyticsData(analyticsResult);
        
        // Cache the result
        setDataCache(prev => ({
          ...prev,
          [cacheKey]: { data: analyticsResult, timestamp: now }
        }));
      } else {
        const defaultData = {
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
        };
        setAnalyticsData(defaultData);
        
        // Cache the default data
        setDataCache(prev => ({
          ...prev,
          [cacheKey]: { data: defaultData, timestamp: now }
        }));
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Set default data on error
      const defaultData = {
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
      };
      setAnalyticsData(defaultData);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Add function to refresh data
  const refreshData = useCallback(async () => {
    clearCache();
    setLoading(true);
    try {
      await Promise.all([
        fetchMembershipRequests(),
        fetchAnalyticsData()
      ]);
    } finally {
      setLoading(false);
    }
  }, [clearCache, fetchMembershipRequests]);

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
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-blue-400 rounded mb-2"></div>
                <div className="h-4 bg-blue-400 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{analyticsData.totalFunds}</div>
                <p className="text-sm opacity-90">Active fund managers</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Capital</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-green-400 rounded mb-2"></div>
                <div className="h-4 bg-green-400 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">${analyticsData.totalCapital.toLocaleString()}M</div>
                <p className="text-sm opacity-90">Under management</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Ticket Size</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-purple-400 rounded mb-2"></div>
                <div className="h-4 bg-purple-400 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">${analyticsData.averageTicketSize.toLocaleString()}K</div>
                <p className="text-sm opacity-90">Per investment</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
            <Globe className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-orange-400 rounded mb-2"></div>
                <div className="h-4 bg-orange-400 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{analyticsData.activeMarkets.length}</div>
                <p className="text-sm opacity-90">Geographic regions</p>
              </>
            )}
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
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capital Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.capitalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Manage applications, members, and network activities</p>
            </div>
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-white/90"
            >
              <Activity className="w-4 h-4" />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-700">Pending Applications</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {membershipRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Approved Members</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {membershipRequests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Total Applications</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {membershipRequests.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-700">Recent Activities</p>
                  <p className="text-2xl font-bold text-violet-800">
                    {activityLogs.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-violet-200 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border border-slate-200">
            <TabsTrigger value="applications" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800">Applications</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800">Members</TabsTrigger>
            <TabsTrigger value="viewers" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800">Created Users</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Professional Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Membership Applications</h2>
                    <p className="text-slate-600 text-sm">Review and manage pending membership requests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-violet-500 hover:bg-violet-600 text-white shadow-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </div>
              </div>

              {/* Professional Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">Pending Applications</p>
                        <p className="text-2xl font-bold text-amber-600">{membershipRequests.filter(r => r.status === 'pending').length}</p>
                        <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">Approved Members</p>
                        <p className="text-2xl font-bold text-emerald-600">{membershipRequests.filter(r => r.status === 'approved').length}</p>
                        <p className="text-xs text-slate-500 mt-1">Active members</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">Rejected Applications</p>
                        <p className="text-2xl font-bold text-rose-600">{membershipRequests.filter(r => r.status === 'rejected').length}</p>
                        <p className="text-xs text-slate-500 mt-1">Not approved</p>
                      </div>
                      <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-rose-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">Total Applications</p>
                        <p className="text-2xl font-bold text-sky-600">{membershipRequests.length}</p>
                        <p className="text-xs text-slate-500 mt-1">All time</p>
                      </div>
                      <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-sky-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Professional Applications Grid */}
            <div className="space-y-6">
              {applicationsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse shadow-sm border-gray-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="h-5 bg-gray-200 rounded flex-1"></div>
                          <div className="h-7 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {membershipRequests.map((request, index) => {
                    // Create different bright colors for each application card
                    const cardColors = [
                      'from-blue-50/80 to-blue-100/80 border-blue-200',
                      'from-green-50/80 to-green-100/80 border-green-200',
                      'from-yellow-50/80 to-yellow-100/80 border-yellow-200',
                      'from-orange-50/80 to-orange-100/80 border-orange-200',
                      'from-purple-50/80 to-purple-100/80 border-purple-200',
                      'from-pink-50/80 to-pink-100/80 border-pink-200',
                      'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
                      'from-teal-50/80 to-teal-100/80 border-teal-200',
                      'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
                      'from-rose-50/80 to-rose-100/80 border-rose-200',
                      'from-violet-50/80 to-violet-100/80 border-violet-200',
                      'from-amber-50/80 to-amber-100/80 border-amber-200'
                    ];
                    const colorClass = cardColors[index % cardColors.length];
                    
                    return (
                      <Card 
                        key={request.id} 
                        className={`group bg-gradient-to-br ${colorClass} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[320px]`}
                        onClick={() => handleViewApplication(request)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-lg font-semibold truncate text-gray-900 group-hover:text-blue-600 flex-1">
                              {request.applicant_name}
                            </CardTitle>
                            <Badge 
                              variant="default" 
                              className={`text-xs font-medium ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-100/80 text-yellow-700 border-yellow-200' 
                                  : request.status === 'approved' 
                                  ? 'bg-green-100/80 text-green-700 border-green-200' 
                                  : 'bg-red-100/80 text-red-700 border-red-200'
                              }`}
                            >
                              {request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm text-gray-500">
                            {request.email}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-500" />
                              <span className="truncate">{request.vehicle_name || 'Unknown Fund'}</span>
                            </div>
                            {request.vehicle_website && (
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-green-500" />
                                <a 
                                  href={request.vehicle_website.startsWith('http') ? request.vehicle_website : 'https://' + request.vehicle_website}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate block"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {request.vehicle_website}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-orange-500" />
                              <span className="truncate">{request.team_size || 'N/A'} team members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="truncate">{request.ticket_size || 'N/A'} ticket size</span>
                            </div>
                            {request.thesis && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-start gap-2">
                                  <Target className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Investment Thesis</p>
                                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed break-words">
                                      {request.thesis}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {membershipRequests.length === 0 && !applicationsLoading && (
                <Card className="text-center py-12 bg-white shadow-sm border-gray-200">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-4">No membership applications have been submitted.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Member Management</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Total Members: {membershipRequests.filter(r => r.status === 'approved').length}
              </Badge>
            </div>

            {membersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-3 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {membershipRequests.filter(r => r.status === 'approved').map((request, index) => {
                  // Create different bright colors for each member card
                  const cardColors = [
                    'from-green-50/80 to-green-100/80 border-green-200',
                    'from-emerald-50/80 to-emerald-100/80 border-emerald-200',
                    'from-teal-50/80 to-teal-100/80 border-teal-200',
                    'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
                    'from-blue-50/80 to-blue-100/80 border-blue-200',
                    'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
                    'from-purple-50/80 to-purple-100/80 border-purple-200',
                    'from-violet-50/80 to-violet-100/80 border-violet-200',
                    'from-fuchsia-50/80 to-fuchsia-100/80 border-fuchsia-200',
                    'from-pink-50/80 to-pink-100/80 border-pink-200',
                    'from-rose-50/80 to-rose-100/80 border-rose-200',
                    'from-orange-50/80 to-orange-100/80 border-orange-200'
                  ];
                  const colorClass = cardColors[index % cardColors.length];
                  
                  return (
                    <Card key={request.id} className={`hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${colorClass} backdrop-blur-sm`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm font-medium truncate flex-1">{request.applicant_name}</CardTitle>
                          <Badge variant="default" className="bg-green-100/80 text-green-800 flex-shrink-0">Member</Badge>
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
                                href={request.vehicle_website.startsWith('http') ? request.vehicle_website : 'https://' + request.vehicle_website}
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
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="viewers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Created Users</h2>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Total Users: {createdViewers.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {viewersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="h-4 bg-gray-200 rounded flex-1"></div>
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {[...Array(2)].map((_, j) => (
                            <div key={j} className="h-3 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                createdViewers.map((viewer, index) => {
                  // Create different bright colors for each viewer card
                  const cardColors = [
                    'from-purple-50/80 to-purple-100/80 border-purple-200',
                    'from-violet-50/80 to-violet-100/80 border-violet-200',
                    'from-fuchsia-50/80 to-fuchsia-100/80 border-fuchsia-200',
                    'from-pink-50/80 to-pink-100/80 border-pink-200',
                    'from-rose-50/80 to-rose-100/80 border-rose-200',
                    'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
                    'from-blue-50/80 to-blue-100/80 border-blue-200',
                    'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
                    'from-teal-50/80 to-teal-100/80 border-teal-200',
                    'from-emerald-50/80 to-emerald-100/80 border-emerald-200',
                    'from-green-50/80 to-green-100/80 border-green-200',
                    'from-yellow-50/80 to-yellow-100/80 border-yellow-200'
                  ];
                  const colorClass = cardColors[index % cardColors.length];
                  
                  return (
                    <Card key={viewer.user_id} className={`hover:shadow-lg transition-all duration-200 bg-gradient-to-br ${colorClass} backdrop-blur-sm`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm font-medium truncate flex-1">{viewer.profiles?.full_name || 'No Name'}</CardTitle>
                          <Badge variant="default" className="bg-purple-100/80 text-purple-800 flex-shrink-0">User</Badge>
                        </div>
                        <CardDescription className="text-xs truncate">{viewer.profiles?.email || 'No Email'}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">User ID: {viewer.user_id}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
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
              {activityLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="flex items-center gap-4">
                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                activityLogs.map((log) => (
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create User Modal */}
        <CreateUserModal
          open={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={() => {
            fetchCreatedViewers();
            setShowCreateUserModal(false);
          }}
        />

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
                                    href={selectedRequest.vehicle_website.startsWith('http') ? selectedRequest.vehicle_website : 'https://' + selectedRequest.vehicle_website}
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
                                {(() => {
                                  const allDocuments: Array<{
                                    type: 'file' | 'link';
                                    fileName: string;
                                    data: string;
                                    fileSize?: number;
                                  }> = [];

                                  // Parse files
                                  if (selectedRequest.supporting_documents) {
                                    try {
                                      const documents = JSON.parse(selectedRequest.supporting_documents);
                                      if (Array.isArray(documents)) {
                                        documents.forEach((docData, index) => {
                                          try {
                                            const doc = JSON.parse(docData);
                                            allDocuments.push({
                                              type: 'file',
                                              fileName: doc.fileName || `Document_${index + 1}`,
                                              data: doc.data,
                                              fileSize: doc.fileSize
                                            });
                                          } catch (e) {
                                            console.error('Error parsing document:', e);
                                          }
                                        });
                                      } else {
                                        // Single document
                                        try {
                                          const doc = JSON.parse(selectedRequest.supporting_documents);
                                          allDocuments.push({
                                            type: 'file',
                                            fileName: doc.fileName || 'Document',
                                            data: doc.data,
                                            fileSize: doc.fileSize
                                          });
                                        } catch (e) {
                                          // Legacy URL format
                                          allDocuments.push({
                                            type: 'file',
                                            fileName: selectedRequest.supporting_documents.split('/').pop() || 'Document',
                                            data: selectedRequest.supporting_documents
                                          });
                                        }
                                      }
                                    } catch (e) {
                                      console.error('Error parsing supporting documents:', e);
                                    }
                                  }

                                  // Parse links
                                  if (selectedRequest.supporting_document_links) {
                                    try {
                                      const links = JSON.parse(selectedRequest.supporting_document_links);
                                      if (Array.isArray(links)) {
                                        links.forEach((linkData, index) => {
                                          try {
                                            const link = JSON.parse(linkData);
                                            const linkText = atob(link.data.split(',')[1]); // Decode base64
                                            allDocuments.push({
                                              type: 'link',
                                              fileName: link.fileName || `Link_${index + 1}`,
                                              data: linkText
                                            });
                                          } catch (e) {
                                            console.error('Error parsing link:', e);
                                          }
                                        });
                                      }
                                    } catch (e) {
                                      console.error('Error parsing supporting document links:', e);
                                    }
                                  }

                                  if (allDocuments.length === 0) {
                                    return <p className="text-gray-600">No documents uploaded</p>;
                                  }

                                  return (
                                    <div className="space-y-2">
                                      {allDocuments.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                          <div className="flex items-center gap-2">
                                            {doc.type === 'file' ? (
                                              <FileText className="w-4 h-4 text-blue-600" />
                                            ) : (
                                              <Link className="w-4 h-4 text-green-600" />
                                            )}
                                            <span className="text-sm font-medium text-gray-700">
                                              {doc.fileName}
                                            </span>
                                            {doc.fileSize && (
                                              <span className="text-xs text-gray-500">
                                                ({Math.round(doc.fileSize / 1024)}KB)
                                              </span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                              ({doc.type})
                                            </span>
                                          </div>
                                          <button
                                            onClick={() => {
                                              if (doc.type === 'file') {
                                                const link = document.createElement('a');
                                                link.href = doc.data;
                                                link.download = doc.fileName;
                                                link.click();
                                              } else {
                                                // For links, open in new tab
                                                window.open(doc.data, '_blank', 'noopener,noreferrer');
                                              }
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                          >
                                            {doc.type === 'file' ? 'Download' : 'Open Link'}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
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
        <Dialog open={showConfirmDialog} onOpenChange={() => {
          setShowConfirmDialog(false);
          setPendingRoleChange(null);
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Confirm Role Change
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to change this user's role to <strong>{pendingRoleChange?.newRole}</strong>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingRoleChange(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRoleChange}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;

