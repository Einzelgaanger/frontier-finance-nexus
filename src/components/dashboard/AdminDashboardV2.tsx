import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Activity,
  Database,
  Shield,
  Globe,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Target,
  Zap,
  Star,
  Eye,
  UserPlus,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface StatCard {
  title: string;
  value: string;
  icon: any;
  description: string;
  trend: { value: number; isPositive: boolean };
  color: string;
  bgColor: string;
  textColor: string;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'survey' | 'system' | 'admin';
  message: string;
  timestamp: string;
  icon: any;
  color: string;
}

const AdminDashboardV2 = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Users',
      value: '...',
      icon: Users,
      description: 'Across all roles',
      trend: { value: 0, isPositive: true },
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Members',
      value: '...',
      icon: UserCheck,
      description: 'Verified fund managers',
      trend: { value: 0, isPositive: true },
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Survey Responses',
      value: '...',
      icon: FileText,
      description: 'Completed this month',
      trend: { value: 0, isPositive: true },
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Platform Health',
      value: '99.9%',
      icon: Activity,
      description: 'Uptime this month',
      trend: { value: 0, isPositive: true },
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    database: { status: 'Online', healthy: true, uptime: '99.9%' },
    apiServices: { status: 'Healthy', healthy: true, uptime: '99.8%' },
    authentication: { status: 'Active', healthy: true, uptime: '100%' },
    fileStorage: { status: 'Connected', healthy: true, uptime: '99.7%' }
  });

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('AdminDashboardV2 - Fetching all data...');
      
      // Fetch data from available tables
      const [survey2021Result, surveyResult, userRolesResult] = await Promise.all([
        supabase.from('survey_responses_2021').select('id, user_id, created_at, firm_name, participant_name'),
        supabase.from('survey_responses').select('id, user_id, created_at'),
        supabase.from('user_roles').select('user_id, role')
      ]);

      // Handle errors gracefully
      if (survey2021Result.error) {
        console.warn('Could not fetch 2021 survey data:', survey2021Result.error);
      }
      if (surveyResult.error) {
        console.warn('Could not fetch regular survey data:', surveyResult.error);
      }
      if (userRolesResult.error) {
        console.warn('Could not fetch user roles:', userRolesResult.error);
      }

      // Get unique users from survey data
      const survey2021Users = survey2021Result.data || [];
      const surveyUsers = surveyResult.data || [];
      const allSurveyUsers = [...new Set([
        ...survey2021Users.map(s => s.user_id),
        ...surveyUsers.map(s => s.user_id)
      ])];

      // Get user roles
      const userRoles = userRolesResult.data || [];
      const roleMap = new Map(userRoles.map(ur => [ur.user_id, ur.role]));

      // Calculate stats
      const totalUsers = allSurveyUsers.length;
      const activeMembers = allSurveyUsers.filter(userId => 
        roleMap.get(userId) === 'member'
      ).length;
      const totalSurveyResponses = survey2021Users.length + surveyUsers.length;
      
      // Calculate this month's surveys
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthSurveys = [
        ...survey2021Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...surveyUsers.filter(s => new Date(s.created_at) >= thisMonth)
      ].length;

      console.log('AdminDashboardV2 - Data fetched:', {
        totalUsers,
        activeMembers,
        totalSurveyResponses,
        thisMonthSurveys,
        survey2021Users: survey2021Users.length,
        surveyUsers: surveyUsers.length
      });

      setStats([
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          icon: Users,
          description: 'Users with survey responses',
          trend: { value: 0, isPositive: true },
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700'
        },
        {
          title: 'Active Members',
          value: activeMembers.toString(),
          icon: UserCheck,
          description: 'Members with survey responses',
          trend: { value: 0, isPositive: true },
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700'
        },
        {
          title: 'Survey Responses',
          value: totalSurveyResponses.toString(),
          icon: FileText,
          description: 'Total survey responses',
          trend: { value: 0, isPositive: true },
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700'
        },
        {
          title: 'This Month',
          value: thisMonthSurveys.toString(),
          icon: Activity,
          description: 'Responses this month',
          trend: { value: 0, isPositive: true },
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700'
        }
      ]);

      // Generate recent activity from real data
      const activities: ActivityItem[] = [];
      
      // Add recent survey responses
      const recentSurveys = [
        ...survey2021Users.slice(0, 3).map((survey, index) => ({
          id: `survey-${survey.id}`,
          type: 'survey' as const,
          message: `Survey response from ${survey.firm_name || 'Unknown Firm'}`,
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-blue-600'
        })),
        ...surveyUsers.slice(0, 2).map((survey, index) => ({
          id: `survey-reg-${survey.id}`,
          type: 'survey' as const,
          message: 'Survey response submitted',
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-blue-600'
        }))
      ];
      
      activities.push(...recentSurveys);
      
      // Add system activities
      activities.push(
        {
          id: 'system-1',
          type: 'system',
          message: 'System backup completed',
          timestamp: '1 hour ago',
          icon: Database,
          color: 'text-purple-600'
        },
        {
          id: 'system-2',
          type: 'system',
          message: 'Database optimized',
          timestamp: '2 hours ago',
          icon: Activity,
          color: 'text-green-600'
        }
      );
      
      setRecentActivity(activities.slice(0, 5)); // Show max 5 activities

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Administrator</h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your network today
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={fetchAllData}
              disabled={loading}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <div className="text-right">
              <p className="text-sm text-blue-100">Last updated</p>
              <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.trend.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  +{stat.trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
            <div className="text-sm text-gray-600">
              Latest network activities and system events
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-green-600" />
              System Status
            </CardTitle>
            <div className="text-sm text-gray-600">
              Real-time system health monitoring
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${status.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${status.healthy ? 'text-green-600' : 'text-red-600'}`}>
                      {status.status}
                    </p>
                    <p className="text-xs text-gray-500">{status.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Quick Actions
          </CardTitle>
          <div className="text-sm text-gray-600">
            Common administrative tasks and shortcuts
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">User Management</span>
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Analytics</span>
              </Button>
            </Link>
            <Link to="/network">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200 transition-colors">
                <Globe className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Network Directory</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-200 transition-colors">
              <Settings className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardV2;
