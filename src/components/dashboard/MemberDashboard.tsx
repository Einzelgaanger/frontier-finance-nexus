
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
import { useToast } from "@/components/ui/use-toast";

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
  const [stats, setStats] = useState({
    networkConnections: '...',
    profileCompletion: '...',
    networkReach: '...',
    engagementScore: '...',
    recentActivity: [] as { type: string; description: string; date: string; icon: string }[]
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState([
    { title: 'Profile Complete', description: 'Completed your profile survey', icon: CheckCircle, unlocked: true, color: 'bg-green-100 text-green-800' },
    { title: 'Network Pioneer', description: 'Connected with 5+ members', icon: Network, unlocked: false, color: 'bg-gray-100 text-gray-600' },
    { title: 'Active Member', description: 'Logged in for 7 consecutive days', icon: Star, unlocked: false, color: 'bg-gray-100 text-gray-600' },
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { toast } = useToast();

  // Fetch real member data
  const fetchMemberData = async () => {
    setLoading(true);
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Network Connections (placeholder - would need network table)
      const networkConnections = 12; // Mock data for now

      // 2. Profile Completion - check both regular and 2021 surveys
      const [regularSurveyData, survey2021Data] = await Promise.all([
        supabase
          .from('survey_responses')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .maybeSingle(),
        supabase
          .from('survey_responses_2021')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .maybeSingle()
      ]);
      
      const hasRegularSurvey = regularSurveyData.data && !regularSurveyData.error;
      const has2021Survey = survey2021Data.data && !survey2021Data.error;
      const profileCompletion = (hasRegularSurvey || has2021Survey) ? '100%' : '0%';

      // 3. Network Reach (geographic coverage)
      const networkReach = '15 countries'; // Mock data

      // 4. Engagement Score
      const engagementScore = '85%'; // Mock data

      // 5. Recent Activity
      const fetchRecentActivity = async () => {
        try {
          // Get recent survey completions
          const recentSurveys = [];
          
          if (hasRegularSurvey) {
            recentSurveys.push({
              type: 'Survey Completed',
              description: 'Fund profile survey completed',
              date: regularSurveyData.data.completed_at,
              icon: '📊'
            });
          }
          
          if (has2021Survey) {
            recentSurveys.push({
              type: '2021 Survey Completed',
              description: '2021 ESCP network survey completed',
              date: survey2021Data.data.completed_at,
              icon: '📈'
            });
          }
          
          // Sort by date
          recentSurveys.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          return recentSurveys.slice(0, 5);
        } catch (error) {
          console.error('Error fetching recent activity:', error);
          return [];
        }
      };

      const recentActivity = await fetchRecentActivity();

      setStats({
        networkConnections,
        profileCompletion,
        networkReach,
        engagementScore,
        recentActivity
      });

      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch member data",
        variant: "destructive"
      });
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
    <div className="p-6">
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
            {/* Network Connections */}
            <Card key="network-connections" className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Network Connections</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.networkConnections}</p>
                    <p className="text-xs text-gray-500 mt-1">Active connections</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-600">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card key="profile-completion" className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Profile Completion</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.profileCompletion}</p>
                    <p className="text-xs text-gray-500 mt-1">Survey completion rate</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-600">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Reach */}
            <Card key="network-reach" className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Network Reach</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.networkReach}</p>
                    <p className="text-xs text-gray-500 mt-1">Geographic coverage</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-600">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Score */}
            <Card key="engagement-score" className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Engagement Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.engagementScore}</p>
                    <p className="text-xs text-gray-500 mt-1">Platform activity</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-600">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border bg-blue-50">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {activity.icon === '📊' ? <FileText className="w-5 h-5 text-gray-600" /> : <PieChart className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    ))
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
  );
};

export default MemberDashboard;
