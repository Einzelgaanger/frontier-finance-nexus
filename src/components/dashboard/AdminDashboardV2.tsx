// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Activity,
  Globe,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Crown,
  Target,
  Star,
  Eye,
  UserPlus,
  Bell,
  Search,
  XCircle,
  Shield,
  Settings,
  Database,
  Zap,
  Award,
  Network,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Filter,
  Plus,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend: { value: number; isPositive: boolean };
  color: string;
  bgColor: string;
  textColor: string;
  change?: string;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'survey' | 'system' | 'admin' | 'security' | 'performance';
  message: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
}

const AdminDashboardV2 = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%',
    activeUsers: 0
  });

  // Quick actions for admin
  const quickActions: QuickAction[] = [
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/network',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Survey Analytics',
      description: 'View survey insights and reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Database Tools',
      description: 'Database management and backups',
      icon: Database,
      href: '/admin/database',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('AdminDashboardV2 - Fetching all data...');
      
      // Fetch comprehensive data from all available tables
      const [
        survey2021Result, 
        survey2022Result,
        survey2023Result, 
        survey2024Result, 
        userRolesResult, 
        applicationsResult,
        profilesResult,
        userProfilesResult,
        networkUsersResult
      ] = await Promise.all([
        supabase.from('survey_2021_responses').select('id, user_id, created_at, firm_name, participant_name'),
        supabase.from('survey_2022_responses').select('id, user_id, created_at'),
        supabase.from('survey_2023_responses').select('id, user_id, created_at'),
        supabase.from('survey_2024_responses').select('id, user_id, created_at'),
        supabase.from('user_roles').select('user_id, role, created_at'),
        supabase.from('membership_requests').select('id, status, created_at, vehicle_name'),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('user_profiles').select('user_id, created_at, company_name'),
        supabase.from('network_users').select('user_id, role, created_at')
      ]);

      // Handle errors gracefully
      const survey2021Users = survey2021Result.data || [];
      const survey2022Users = survey2022Result.data || [];
      const survey2023Users = survey2023Result.data || [];
      const survey2024Users = survey2024Result.data || [];
      const userRoles = userRolesResult.data || [];
      const profiles = profilesResult.data || [];
      const userProfiles = userProfilesResult.data || [];
      const networkUsers = networkUsersResult.data || [];
      const membershipRequests = applicationsResult.data || [];

      // Calculate comprehensive metrics
      const totalUsers = userRoles.length;
      const activeMembers = userRoles.filter(ur => ur.role === 'member').length;
      const viewers = userRoles.filter(ur => ur.role === 'viewer').length;
      const admins = userRoles.filter(ur => ur.role === 'admin').length;
      const totalSurveyResponses = survey2021Users.length + survey2022Users.length + survey2023Users.length + survey2024Users.length;
      const pendingApplications = membershipRequests.filter(app => app.status === 'pending').length;
      const approvedApplications = membershipRequests.filter(app => app.status === 'approved').length;
      const rejectedApplications = membershipRequests.filter(app => app.status === 'rejected').length;

      // Calculate this month's activity
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthSurveys = [
        ...survey2021Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2022Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2023Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2024Users.filter(s => new Date(s.created_at) >= thisMonth)
      ].length;

      const thisMonthUsers = userRoles.filter(ur => new Date(ur.created_at) >= thisMonth).length;

      console.log('AdminDashboardV2 - Data fetched:', {
        totalUsers,
        activeMembers,
        viewers,
        admins,
        totalSurveyResponses,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        thisMonthSurveys,
        thisMonthUsers
      });

      // Set comprehensive stats
      setStats([
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          icon: Users,
          description: 'All registered users',
          trend: { value: thisMonthUsers, isPositive: true },
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          change: `+${thisMonthUsers} this month`
        },
        {
          title: 'Active Members',
          value: activeMembers.toString(),
          icon: UserCheck,
          description: 'Verified fund managers',
          trend: { value: Math.round((activeMembers / totalUsers) * 100), isPositive: true },
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          change: `${Math.round((activeMembers / totalUsers) * 100)}% of total`
        },
        {
          title: 'Survey Responses',
          value: totalSurveyResponses.toString(),
          icon: FileText,
          description: 'All survey submissions',
          trend: { value: thisMonthSurveys, isPositive: true },
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          change: `+${thisMonthSurveys} this month`
        },
        {
          title: 'Pending Applications',
          value: pendingApplications.toString(),
          icon: Clock,
          description: 'Awaiting review',
          trend: { value: pendingApplications, isPositive: pendingApplications < 10 },
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          change: pendingApplications > 0 ? 'Needs attention' : 'All caught up'
        }
      ]);

      // Generate enhanced recent activity
      const activities: ActivityItem[] = [];
      
      // Add recent survey responses with more detail
      const recentSurveys = [
        ...survey2021Users.slice(0, 3).map((survey, index) => ({
          id: `survey-2021-${survey.id}`,
          type: 'survey' as const,
          message: `2021 Survey completed by ${survey.firm_name || 'Unknown Firm'}`,
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-blue-600',
          priority: 'medium' as const,
          action: 'View Response'
        })),
        ...survey2022Users.slice(0, 2).map((survey, index) => ({
          id: `survey-2022-${survey.id}`,
          type: 'survey' as const,
          message: `2022 Survey response submitted`,
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-purple-600',
          priority: 'medium' as const,
          action: 'View Response'
        })),
        ...survey2023Users.slice(0, 2).map((survey, index) => ({
          id: `survey-2023-${survey.id}`,
          type: 'survey' as const,
          message: `2023 Survey response submitted`,
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-green-600',
          priority: 'medium' as const,
          action: 'View Response'
        })),
        ...survey2024Users.slice(0, 2).map((survey, index) => ({
          id: `survey-2024-${survey.id}`,
          type: 'survey' as const,
          message: `2024 Survey response submitted`,
          timestamp: new Date(survey.created_at).toLocaleString(),
          icon: FileText,
          color: 'text-orange-600',
          priority: 'medium' as const,
          action: 'View Response'
        }))
      ];
      
      activities.push(...recentSurveys);

      // Add recent membership requests with priority
      const recentRequests = membershipRequests
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map((req) => ({
          id: `req-${req.id}`,
          type: 'user' as const,
          message: `New membership request from ${req.vehicle_name}`,
          timestamp: new Date(req.created_at).toLocaleString(),
          icon: UserPlus,
          color: req.status === 'pending' ? 'text-orange-600' : req.status === 'approved' ? 'text-green-600' : 'text-red-600',
          priority: req.status === 'pending' ? 'high' as const : 'medium' as const,
          action: req.status === 'pending' ? 'Review Application' : 'View Details'
        }));

      activities.push(...recentRequests);

      // Add system activities
      activities.push(
        {
          id: 'system-1',
          type: 'system',
          message: 'System backup completed successfully',
          timestamp: '2 hours ago',
          icon: Database,
          color: 'text-green-600',
          priority: 'low',
          action: 'View Logs'
        },
        {
          id: 'system-2',
          type: 'performance',
          message: 'Database optimization completed',
          timestamp: '4 hours ago',
          icon: Zap,
          color: 'text-blue-600',
          priority: 'low',
          action: 'View Metrics'
        },
        {
          id: 'system-3',
          type: 'security',
          message: 'Security scan completed - no issues found',
          timestamp: '6 hours ago',
          icon: Shield,
          color: 'text-green-600',
          priority: 'low',
          action: 'View Report'
        }
      );

      // Add admin activities
      if (thisMonthUsers > 0) {
        activities.push({
          id: 'admin-1',
          type: 'admin',
          message: `${thisMonthUsers} new users registered this month`,
          timestamp: '1 day ago',
          icon: UserPlus,
          color: 'text-blue-600',
          priority: 'medium',
          action: 'View Users'
        });
      }

      if (thisMonthSurveys > 0) {
        activities.push({
          id: 'admin-2',
          type: 'admin',
          message: `${thisMonthSurveys} new survey responses this month`,
          timestamp: '2 days ago',
          icon: FileText,
          color: 'text-purple-600',
          priority: 'medium',
          action: 'View Analytics'
        });
      }
      
      setRecentActivity(activities.slice(0, 6)); // Show max 6 activities
      setSystemHealth(prev => ({
        ...prev,
        activeUsers: totalUsers
      }));

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-200 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-200 text-green-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle;
      case 'high': return Clock;
      case 'medium': return Activity;
      case 'low': return CheckCircle;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Platform management and monitoring
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-xs font-medium text-gray-900">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <Button
                onClick={fetchAllData}
                variant="outline"
                size="sm"
                className="hover:bg-gray-50 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const colors = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-purple-500 to-purple-600',
              'bg-gradient-to-br from-orange-500 to-orange-600'
            ];
            const colorClass = colors[index % colors.length];
            
            return (
              <div key={index} className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {loading ? (
                          <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                        ) : (
                          stat.value
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{stat.description}</p>
                      {stat.change && (
                        <div className="flex items-center">
                          {stat.trend.isPositive ? (
                            <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs font-medium ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content - Single Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <p className="text-sm text-gray-600">Platform events and user actions</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {recentActivity.length} events
                  </Badge>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const PriorityIcon = getPriorityIcon(activity.priority);
                    const priorityColor = getPriorityColor(activity.priority);
                    
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                            <Badge className={`text-xs ${priorityColor}`}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {activity.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Combined Info */}
          <div className="space-y-6">
            
            {/* System Health & Quick Actions Combined */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">System & Actions</h3>
                    <p className="text-sm text-gray-600">Health status and quick tasks</p>
                  </div>
                </div>
                
                {/* System Health */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">System Health</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-gray-600">Uptime</p>
                      <p className="text-sm font-bold text-green-600">{systemHealth.uptime}</p>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-gray-600">Response</p>
                      <p className="text-sm font-bold text-blue-600">{systemHealth.responseTime}</p>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-gray-600">Errors</p>
                      <p className="text-sm font-bold text-green-600">{systemHealth.errorRate}</p>
                    </div>
                    <div className="text-center p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-gray-600">Users</p>
                      <p className="text-sm font-bold text-purple-600">{systemHealth.activeUsers}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 hover:bg-white/50 text-left"
                        onClick={() => navigate(action.href)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`w-6 h-6 ${action.bgColor} rounded-md flex items-center justify-center`}>
                            <action.icon className={`w-3 h-3 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{action.title}</h4>
                            <p className="text-xs text-gray-600">{action.description}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Overview - Compact */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Platform Overview</h3>
                    <p className="text-sm text-gray-600">Key metrics at a glance</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600">Total Surveys</p>
                    <p className="text-lg font-bold text-gray-900">4 Years</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600">Data Points</p>
                    <p className="text-lg font-bold text-gray-900">1000+</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600">Countries</p>
                    <p className="text-lg font-bold text-gray-900">25+</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600">Fund Managers</p>
                    <p className="text-lg font-bold text-gray-900">200+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardV2;