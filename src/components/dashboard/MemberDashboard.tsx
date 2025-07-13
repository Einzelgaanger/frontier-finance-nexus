
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "./StatsCard";
import { Users, Building2, TrendingUp, Globe, ArrowRight, FileText, User, CheckCircle, BarChart3, Calendar, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: "Network Access", value: "Loading...", icon: Users, description: "Complete fund directory" },
    { title: "Survey Status", value: "Loading...", icon: FileText, description: "Profile completion" },
    { title: "Total Fund Managers", value: "Loading...", icon: Building2, description: "In network" },
    { title: "Your Surveys", value: "Loading...", icon: TrendingUp, description: "Completed" },
  ]);
  const [surveyCompletion, setSurveyCompletion] = useState(0);
  const [totalFundManagers, setTotalFundManagers] = useState(0);
  const [userSurveys, setUserSurveys] = useState(0);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);

  const [quickActions, setQuickActions] = useState([
    {
      title: "Complete Your Profile",
      description: "Finish your survey to unlock full networking potential",
      icon: FileText,
      action: "Continue Survey",
      link: "/survey",
      status: "incomplete"
    },
    {
      title: "Browse Fund Network",
      description: "Explore our complete database of fund managers",
      icon: Users,
      action: "View Network",
      link: "/network",
      status: "available"
    },
    {
      title: "Update Profile",
      description: "Keep your information current for better visibility",
      icon: User,
      action: "Edit Profile",
      link: "/profile",
      status: "available"
    }
  ]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user) return;

      try {
        // Fetch user's survey completion status
        const { data: userSurveys, error: surveyError } = await supabase
          .from('survey_responses')
          .select('id, completed_at, year')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        if (surveyError) throw surveyError;
        
        const completedSurveys = userSurveys || [];
        setUserSurveys(completedSurveys.length);
        setHasCompletedSurvey(completedSurveys.length > 0);

        // Calculate survey completion percentage (simplified - either 0% or 100%)
        const completionPercentage = completedSurveys.length > 0 ? 100 : 0;
        setSurveyCompletion(completionPercentage);

        // Fetch total fund managers in network (unique users with completed surveys)
        const { data: fundManagers, error: networkError } = await supabase
          .from('survey_responses')
          .select('user_id')
          .not('completed_at', 'is', null);

        if (networkError) throw networkError;
        
        // Count unique fund managers
        const uniqueFundManagers = new Set(fundManagers?.map(fm => fm.user_id) || []);
        const totalFundManagersCount = uniqueFundManagers.size;
        setTotalFundManagers(totalFundManagersCount);

        // Fetch member_surveys count as well for more accurate data
        const { data: memberSurveys, error: memberSurveysError } = await supabase
          .from('member_surveys')
          .select('user_id')
          .not('completed_at', 'is', null);

        if (!memberSurveysError && memberSurveys) {
          const uniqueMemberSurveys = new Set(memberSurveys.map(ms => ms.user_id));
          const totalFromMemberSurveys = uniqueMemberSurveys.size;
          
          // Use the higher count for better representation
          const finalCount = Math.max(totalFundManagersCount, totalFromMemberSurveys);
          setTotalFundManagers(finalCount);
        }

        // Update stats with accurate data
        setStats([
          { title: "Network Access", value: "Full", icon: Users, description: "Complete fund directory" },
          { title: "Survey Status", value: `${completionPercentage}%`, icon: FileText, description: "Profile completion" },
          { title: "Total Fund Managers", value: String(totalFundManagersCount), icon: Building2, description: "In network" },
          { title: "Your Surveys", value: String(completedSurveys.length), icon: TrendingUp, description: "Completed" },
        ]);

        // Update quick actions based on survey completion
        setQuickActions([
          {
            title: completedSurveys.length > 0 ? "Update Your Profile" : "Complete Your Profile",
            description: completedSurveys.length > 0 
              ? "Update your survey data for better visibility" 
              : "Finish your survey to unlock full networking potential",
            icon: FileText,
            action: completedSurveys.length > 0 ? "Update Survey" : "Continue Survey",
            link: "/survey",
            status: completedSurveys.length > 0 ? "available" : "incomplete"
          },
          {
            title: "Browse Fund Network",
            description: "Explore our complete database of fund managers",
            icon: Users,
            action: "View Network",
            link: "/network",
            status: "available"
          },
          {
            title: "Update Profile",
            description: "Keep your information current for better visibility",
            icon: User,
            action: "Edit Profile",
            link: "/profile",
            status: "available"
          }
        ]);

      } catch (error) {
        console.error('Error fetching member data:', error);
        // Set default values on error
        setStats([
          { title: "Network Access", value: "Full", icon: Users, description: "Complete fund directory" },
          { title: "Survey Status", value: "0%", icon: FileText, description: "Profile completion" },
          { title: "Total Fund Managers", value: "0", icon: Building2, description: "In network" },
          { title: "Your Surveys", value: "0", icon: TrendingUp, description: "Completed" },
        ]);
      }
    };

    fetchMemberData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 bg-blue-100 rounded-full">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Welcome Back, Member! 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              You have full access to our fund manager network. Complete your profile to maximize networking opportunities.
            </p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
            hasCompletedSurvey 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {hasCompletedSurvey ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="font-medium">
              {hasCompletedSurvey ? 'Profile Complete' : 'Profile Incomplete'}
            </span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{surveyCompletion}% Complete</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
            Your Dashboard
          </h2>
          <Badge variant="outline" className="text-sm">
            <Calendar className="w-3 h-3 mr-1" />
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-600" />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-200 hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-lg">Network Directory</CardTitle>
              <CardDescription>Browse our complete fund manager database</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/network">
                  Explore Network
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-3 text-orange-600" />
          Recent Activity
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {userSurveys > 0 ? (
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Survey Completed</p>
                    <p className="text-sm text-gray-600">You have completed {userSurveys} survey{userSurveys > 1 ? 's' : ''} - your profile is visible in the network</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Complete Your Profile</p>
                    <p className="text-sm text-gray-600">Start your first survey to increase your network visibility</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Network Access</p>
                  <p className="text-sm text-gray-600">You have full access to {totalFundManagers} fund managers in the network</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
