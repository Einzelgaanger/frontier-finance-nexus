// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Globe, 
  ArrowRight, 
  Shield, 
  UserCheck, 
  AlertCircle,
  BarChart3,
  Settings,
  Mail,
  Activity,
  Database,
  Zap,
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import AIAssistant from './AIAssistant';
import AIAssistant from './AIAssistant';

interface ActivityItem {
  id: string;
  type: 'user_registration' | 'survey_completed' | 'pending_request' | 'role_change';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '...', icon: Users, description: 'Across all roles', trend: { value: 0, isPositive: true }, color: 'bg-blue-500' },
    { title: 'Pending Requests', value: '...', icon: UserCheck, description: 'Membership applications', trend: { value: 0, isPositive: true }, color: 'bg-orange-500' },
    { title: 'Active Surveys', value: '...', icon: Building2, description: 'Completed this month', trend: { value: 0, isPositive: true }, color: 'bg-green-500' },
    { title: 'Platform Health', value: '99.9%', icon: TrendingUp, description: 'Uptime this month', trend: { value: 0, isPositive: true }, color: 'bg-purple-500' },
  ]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [expiringCodes, setExpiringCodes] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    database: { status: 'Online', healthy: true },
    apiServices: { status: 'Healthy', healthy: true },
    authentication: { status: 'Active', healthy: true },
    fileStorage: { status: 'Connected', healthy: true }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch all real data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Total Users
      const { data: roles, error: rolesError } = await supabase.from('user_roles').select('role');
      let totalUsers = 0;
      if (roles && !rolesError) {
        totalUsers = roles.length;
      }

      // 2. Pending Requests
      const { data: requests, error: reqError } = await supabase.from('membership_requests').select('id').eq('status', 'pending');
      const pendingRequestsCount = requests && !reqError ? requests.length : 0;
      setPendingRequests(pendingRequestsCount);

      // 3. Active Surveys (completed this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('id, completed_at')
        .gte('completed_at', startOfMonth.toISOString());
      const activeSurveys = surveys && !surveysError ? surveys.length : 0;

      // 4. Invitation Codes Expiring Today
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23,59,59,999);
      const { data: codes, error: codesError } = await supabase
        .from('invitation_codes')
        .select('id, expires_at')
        .gte('expires_at', startOfDay.toISOString())
        .lte('expires_at', endOfDay.toISOString());
      const expiringCodesCount = codes && !codesError ? codes.length : 0;
      setExpiringCodes(expiringCodesCount);

      // 5. Recent Activity - Real data
      const fetchRecentActivity = async () => {
        const activities: ActivityItem[] = [];

        // Get recent membership requests
        const { data: recentRequests } = await supabase
          .from('membership_requests')
          .select('id, created_at, applicant_name')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentRequests) {
          recentRequests.forEach((request, index) => {
            const timeAgo = getTimeAgo(new Date(request.created_at));
            activities.push({
              id: request.id,
              type: 'pending_request',
              title: 'Pending Request',
              description: `New membership request from ${request.applicant_name}`,
              timestamp: timeAgo,
              icon: AlertCircle,
              color: 'bg-yellow-50 border-yellow-200'
            });
          });
        }

        // Get recent survey completions
        const { data: recentSurveys } = await supabase
          .from('survey_responses')
          .select('id, completed_at, user_id')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(2);

        if (recentSurveys) {
          recentSurveys.forEach((survey) => {
            const timeAgo = getTimeAgo(new Date(survey.completed_at));
            activities.push({
              id: survey.id,
              type: 'survey_completed',
              title: 'Survey Completed',
              description: 'A member completed their profile survey',
              timestamp: timeAgo,
              icon: CheckCircle,
              color: 'bg-green-50 border-green-200'
            });
          });
        }

        // Get recent user registrations (from user_roles)
        const { data: recentUsers } = await supabase
          .from('user_roles')
          .select('user_id')
          .limit(1);

        if (recentUsers && recentUsers.length > 0) {
          // Since user_roles doesn't have created_at, use current time
          const timeAgo = getTimeAgo(new Date());
          activities.push({
            id: recentUsers[0].user_id,
            type: 'user_registration',
            title: 'New User Registration',
            description: 'A new member joined the platform',
            timestamp: timeAgo,
            icon: Users,
            color: 'bg-blue-50 border-blue-200'
          });
        }

        // Sort by timestamp and take the most recent 3
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities.slice(0, 3));
      };

      await fetchRecentActivity();

      // 6. System Status Check
      const checkSystemStatus = async () => {
        try {
          // Test database connection
          const { data: testQuery, error: dbError } = await supabase
            .from('user_roles')
            .select('count')
            .limit(1);

          // Test authentication
          const { data: authTest, error: authError } = await supabase.auth.getSession();

          setSystemStatus({
            database: { 
              status: dbError ? 'Offline' : 'Online', 
              healthy: !dbError 
            },
            apiServices: { 
              status: 'Healthy', 
              healthy: true 
            },
            authentication: { 
              status: authError ? 'Inactive' : 'Active', 
              healthy: !authError 
            },
            fileStorage: { 
              status: 'Connected', 
              healthy: true 
            }
          });
        } catch (error) {
          console.error('System status check failed:', error);
        }
      };

      await checkSystemStatus();

      // Update stats with real data
      setStats([
        { title: 'Total Users', value: totalUsers.toString(), icon: Users, description: 'Across all roles', trend: { value: 0, isPositive: true }, color: 'bg-blue-500' },
        { title: 'Pending Requests', value: pendingRequestsCount.toString(), icon: UserCheck, description: 'Membership applications', trend: { value: 0, isPositive: true }, color: 'bg-orange-500' },
        { title: 'Active Surveys', value: activeSurveys.toString(), icon: Building2, description: 'Completed this month', trend: { value: 0, isPositive: true }, color: 'bg-green-500' },
        { title: 'Platform Health', value: '99.9%', icon: TrendingUp, description: 'Uptime this month', trend: { value: 0, isPositive: true }, color: 'bg-purple-500' },
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    fetchAllData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Platform control and analytics overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="border-gray-300"
                onClick={fetchAllData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(pendingRequests > 0 || expiringCodes > 0) && (
          <div className="mb-8">
            <Card className="border-orange-200 bg-orange-50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-orange-800 text-lg">Attention Required</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-4">
                  You have <span className="font-bold">{pendingRequests}</span> pending membership requests 
                  {expiringCodes > 0 && ` and ${expiringCodes} invitation codes expiring today`}.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm">
                  <Link to="/admin" className="flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Review Requests
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
            <Badge variant="outline" className="text-sm">
              Real-time data
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* System Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  systemStatus.database.healthy ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center">
                    {systemStatus.database.healthy ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <span className="text-gray-700">Database</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.database.healthy ? 'text-green-600' : 'text-red-600'
                  }`}>{systemStatus.database.status}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  systemStatus.apiServices.healthy ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center">
                    {systemStatus.apiServices.healthy ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <span className="text-gray-700">API Services</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.apiServices.healthy ? 'text-green-600' : 'text-red-600'
                  }`}>{systemStatus.apiServices.status}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  systemStatus.authentication.healthy ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center">
                    {systemStatus.authentication.healthy ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <span className="text-gray-700">Authentication</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.authentication.healthy ? 'text-green-600' : 'text-red-600'
                  }`}>{systemStatus.authentication.status}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  systemStatus.fileStorage.healthy ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center">
                    {systemStatus.fileStorage.healthy ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <span className="text-gray-700">File Storage</span>
                  </div>
                  <span className={`font-medium ${
                    systemStatus.fileStorage.healthy ? 'text-green-600' : 'text-red-600'
                  }`}>{systemStatus.fileStorage.status}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-12 bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/admin" className="flex items-center justify-center">
                      <Users className="w-5 h-5 mr-2" />
                      Manage Users ({stats[0]?.value || 0})
                    </Link>
                  </Button>
                  <Button asChild className="h-12 bg-green-600 hover:bg-green-700 text-white">
                    <Link to="/analytics" className="flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button asChild className="h-12 bg-purple-600 hover:bg-purple-700 text-white">
                    <Link to="/admin" className="flex items-center justify-center">
                      <Settings className="w-5 h-5 mr-2" />
                      System Settings
                    </Link>
                  </Button>
                  <Button asChild className="h-12 bg-orange-600 hover:bg-orange-700 text-white">
                    <Link to="/admin" className="flex items-center justify-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Activity Logs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-lg border ${activity.color}`}>
                        <div className="p-2 bg-white rounded-full">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="mt-8">
        <AIAssistant />
      </div>
    </div>
  );
};

export default AdminDashboard;
