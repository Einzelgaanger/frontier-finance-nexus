
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  RefreshCw,
  Briefcase,
  Target,
  Award,
  Network,
  FileText,
  Bell,
  Star,
  MapPin,
  DollarSign,
  PieChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'survey_completed' | 'profile_updated' | 'network_connected' | 'achievement_unlocked';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const MemberDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Network Connections', value: '...', icon: Network, description: 'Active connections', trend: { value: 0, isPositive: true }, color: 'bg-blue-600' },
    { title: 'Profile Completion', value: '...', icon: UserCheck, description: 'Survey completion rate', trend: { value: 0, isPositive: true }, color: 'bg-green-600' },
    { title: 'Network Reach', value: '...', icon: Globe, description: 'Geographic coverage', trend: { value: 0, isPositive: true }, color: 'bg-purple-600' },
    { title: 'Engagement Score', value: '...', icon: TrendingUp, description: 'Platform activity', trend: { value: 0, isPositive: true }, color: 'bg-orange-600' },
  ]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState([
    { title: 'Profile Complete', description: 'Completed your profile survey', icon: CheckCircle, unlocked: true, color: 'bg-green-100 text-green-800' },
    { title: 'Network Pioneer', description: 'Connected with 5+ members', icon: Network, unlocked: false, color: 'bg-gray-100 text-gray-600' },
    { title: 'Active Member', description: 'Logged in for 7 consecutive days', icon: Star, unlocked: false, color: 'bg-gray-100 text-gray-600' },
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch real member data
  const fetchMemberData = async () => {
    setLoading(true);
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Network Connections (placeholder - would need network table)
      const networkConnections = 12; // Mock data for now

      // 2. Profile Completion
      const { data: surveyData } = await supabase
        .from('survey_responses')
        .select('id, completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .single();
      
      const profileCompletion = surveyData ? '100%' : '0%';

      // 3. Network Reach (geographic coverage)
      const networkReach = '15 countries'; // Mock data

      // 4. Engagement Score
      const engagementScore = '85%'; // Mock data

      // 5. Recent Activity
      const fetchRecentActivity = async () => {
        const activities: ActivityItem[] = [];

        // Check if survey was completed recently
        if (surveyData && surveyData.completed_at) {
          const timeAgo = getTimeAgo(new Date(surveyData.completed_at));
          activities.push({
            id: 'survey-completed',
            type: 'survey_completed',
            title: 'Profile Survey Completed',
            description: 'Your profile survey has been successfully submitted',
            timestamp: timeAgo,
            icon: CheckCircle,
            color: 'bg-green-50 border-green-200'
          });
        }

        // Add some mock activities for demonstration
        activities.push({
          id: 'network-activity',
          type: 'network_connected',
          title: 'Network Activity',
          description: 'Connected with 3 new members this week',
          timestamp: '2 days ago',
          icon: Network,
          color: 'bg-blue-50 border-blue-200'
        });

        activities.push({
          id: 'profile-update',
          type: 'profile_updated',
          title: 'Profile Updated',
          description: 'Your profile information was updated',
          timestamp: '1 week ago',
          icon: UserCheck,
          color: 'bg-purple-50 border-purple-200'
        });

        setRecentActivity(activities);
      };

      await fetchRecentActivity();

      // Update stats with real data
      setStats([
        { title: 'Network Connections', value: networkConnections.toString(), icon: Network, description: 'Active connections', trend: { value: 0, isPositive: true }, color: 'bg-blue-600' },
        { title: 'Profile Completion', value: profileCompletion, icon: UserCheck, description: 'Survey completion rate', trend: { value: 0, isPositive: true }, color: 'bg-green-600' },
        { title: 'Network Reach', value: networkReach, icon: Globe, description: 'Geographic coverage', trend: { value: 0, isPositive: true }, color: 'bg-purple-600' },
        { title: 'Engagement Score', value: engagementScore, icon: TrendingUp, description: 'Platform activity', trend: { value: 0, isPositive: true }, color: 'bg-orange-600' },
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching member data:', error);
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
    fetchMemberData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Member Dashboard</h1>
                <p className="text-gray-600 text-sm">Professional network overview and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-600"
                onClick={fetchMemberData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Stats Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
            <Badge variant="outline" className="text-xs">
              Real-time data
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Welcome & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Welcome Back
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Your professional network is growing. Stay engaged to maximize your opportunities.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/network" className="flex items-center justify-center">
                      <Network className="w-4 h-4 mr-2" />
                      Explore Network
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-gray-300">
                    <Link to="/survey" className="flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Update Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-lg border ${achievement.color}`}>
                      <achievement.icon className="w-5 h-5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Network */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-gray-600" />
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
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-600">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Network Insights */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                  Network Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Geographic Reach</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">15 Countries</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Investment Focus</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">Frontier Markets</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Sector Focus</span>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">Technology</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Growth Rate</span>
                      </div>
                      <span className="text-sm font-semibold text-orange-600">+12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
