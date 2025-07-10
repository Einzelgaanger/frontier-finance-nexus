
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
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '...', icon: Users, description: 'Across all roles', trend: { value: 0, isPositive: true } },
    { title: 'Pending Requests', value: '...', icon: UserCheck, description: 'Membership applications' },
    { title: 'Active Surveys', value: '...', icon: Building2, description: 'Completed this month', trend: { value: 0, isPositive: true } },
    { title: 'Platform Health', value: '99.9%', icon: TrendingUp, description: 'Uptime this month' },
  ]);
  const [userDistribution, setUserDistribution] = useState({ viewers: 0, members: 0, admins: 0 });
  const [platformActivity, setPlatformActivity] = useState({ activeToday: 0, surveysCompleted: 0, newRegistrations: 0 });
  const [pendingRequests, setPendingRequests] = useState(0);
  const [expiringCodes, setExpiringCodes] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState<Array<{ type: string; message: string; time: string }>>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Total Users & User Distribution
      const { data: roles, error: rolesError } = await supabase.from('user_roles').select('role');
      let totalUsers = 0, viewers = 0, members = 0, admins = 0;
      if (roles && !rolesError) {
        totalUsers = roles.length;
        viewers = roles.filter(r => r.role === 'viewer').length;
        members = roles.filter(r => r.role === 'member').length;
        admins = roles.filter(r => r.role === 'admin').length;
        setUserDistribution({ viewers, members, admins });
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

      // 4. New Registrations (today)
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      let newRegistrations = 0;
      // Try to get from profiles (if available)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at')
        .gte('created_at', startOfDay.toISOString());
      if (profiles && !profilesError) newRegistrations = profiles.length;

      // 5. Surveys Completed (all time)
      const { data: allSurveys, error: allSurveysError } = await supabase
        .from('survey_responses')
        .select('id')
        .not('completed_at', 'is', null);
      const surveysCompleted = allSurveys && !allSurveysError ? allSurveys.length : 0;

      // 6. Active Users Today (not tracked, set to 0 or use activity_logs if available)
      let activeToday = 0;
      const { data: logs, error: logsError } = await supabase
        .from('activity_logs')
        .select('user_id, created_at')
        .gte('created_at', startOfDay.toISOString());
      if (logs && !logsError) activeToday = new Set(logs.map(l => l.user_id)).size;

      setStats([
        { title: 'Total Users', value: totalUsers.toString(), icon: Users, description: 'Across all roles', trend: { value: 0, isPositive: true } },
        { title: 'Pending Requests', value: pendingRequestsCount.toString(), icon: UserCheck, description: 'Membership applications' },
        { title: 'Active Surveys', value: activeSurveys.toString(), icon: Building2, description: 'Completed this month', trend: { value: 0, isPositive: true } },
        { title: 'Platform Health', value: '99.9%', icon: TrendingUp, description: 'Uptime this month' },
      ]);
      setUserDistribution({ viewers, members, admins });
      setPlatformActivity({ activeToday, surveysCompleted, newRegistrations });

      // Invitation Codes Expiring Today
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23,59,59,999);
      const { data: codes, error: codesError } = await supabase
        .from('invitation_codes')
        .select('id, expires_at')
        .gte('expires_at', startOfDay.toISOString())
        .lte('expires_at', endOfDay.toISOString());
      const expiringCodesCount = codes && !codesError ? codes.length : 0;
      setExpiringCodes(expiringCodesCount);

      // Recent Alerts - Only show real alerts
      const alerts = [];
      if (pendingRequestsCount > 0) alerts.push({ type: 'warning', message: `${pendingRequestsCount} membership requests awaiting approval`, time: 'Just now' });
      if (expiringCodesCount > 0) alerts.push({ type: 'warning', message: `${expiringCodesCount} invitation codes expiring today`, time: 'Just now' });
      setRecentAlerts(alerts);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Complete platform control and analytics. Monitor users, manage data, and oversee system health.
        </p>
        
        {/* Urgent Actions Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <CardTitle className="text-red-800">Attention Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              You have {pendingRequests} pending membership requests and {expiringCodes} invitation codes expiring today.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="bg-red-600 hover:bg-red-700">
                <Link to="/admin" className="flex items-center">
                  Review Requests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                <Link to="/admin" className="flex items-center">
                  Manage Codes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent System Alerts</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'warning' ? 'bg-yellow-500' :
                      alert.type === 'success' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-gray-900 font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Viewers</span>
                <span className="font-medium">{userDistribution.viewers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Members</span>
                <span className="font-medium">{userDistribution.members}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admins</span>
                <span className="font-medium">{userDistribution.admins}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users Today</span>
                <span className="font-medium">{platformActivity.activeToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Surveys Completed</span>
                <span className="font-medium">{platformActivity.surveysCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Registrations</span>
                <span className="font-medium">{platformActivity.newRegistrations}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
