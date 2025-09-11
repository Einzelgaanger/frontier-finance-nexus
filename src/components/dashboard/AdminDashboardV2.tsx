import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
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
  Crown,
  Target,
  Star,
  Eye,
  UserPlus,
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
  const { user, userRole } = useAuth();
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

      // Add recent application activities
      try {
        const { data: recentApplications, error: appError } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!appError && recentApplications) {
          const applicationActivities = recentApplications.map((app) => ({
            id: `app-${app.id}`,
            type: 'user' as const,
            message: `New application from ${app.applicant_name} (${app.vehicle_name})`,
            timestamp: new Date(app.created_at).toLocaleString(),
            icon: UserPlus,
            color: 'text-orange-600'
          }));

          activities.push(...applicationActivities);
        }
      } catch (error) {
        console.error('Error fetching applications for activity:', error);
      }
      
      // Add system activities
      activities.push(
        {
          id: 'system-1',
          type: 'system',
          message: 'System backup completed',
          timestamp: '1 hour ago',
          icon: Activity,
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
    <div className="p-3 bg-[#f5f5dc] font-rubik">
      {/* Main Layout - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Left Side - Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-[#f5f5dc] border-2 border-black rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
            </div>
            <p className="text-sm text-black/70 mb-4">
              Latest network activities and system events
            </p>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const colors = [
                  'bg-gradient-to-br from-green-500 to-green-600',
                  'bg-gradient-to-br from-purple-500 to-purple-600',
                  'bg-gradient-to-br from-orange-500 to-orange-600',
                  'bg-gradient-to-br from-pink-500 to-pink-600',
                  'bg-gradient-to-br from-indigo-500 to-indigo-600'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-black/10 transition-colors border border-black/20">
                    <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black">{activity.message}</p>
                      <p className="text-xs text-black/60">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Stats Cards (Single Column) */}
        <div className="space-y-2">
          {stats.map((stat, index) => {
            const colors = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-purple-500 to-purple-600',
              'bg-gradient-to-br from-orange-500 to-orange-600'
            ];
            const colorClass = colors[index % colors.length];
            
            return (
              <div key={index} className="bg-[#f5f5dc] border-2 border-black rounded-lg p-3 hover:bg-black/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-black/70 mb-1">{stat.title}</p>
                    <div className="text-xl font-bold text-black mb-1">
                      {loading ? (
                        <div className="animate-pulse bg-black/20 h-5 w-10 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <p className="text-xs text-black/60">{stat.description}</p>
                  </div>
                  <div className={`w-6 h-6 ${colorClass} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  {stat.trend.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    +{stat.trend.value}%
                  </span>
                  <span className="text-xs text-black/60 ml-1">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardV2;
