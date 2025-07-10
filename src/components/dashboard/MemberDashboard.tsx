
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { Users, Building2, TrendingUp, Globe, ArrowRight, FileText, User, CheckCircle } from "lucide-react";
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

        // Fetch total fund managers in network
        const { data: fundManagers, error: networkError } = await supabase
          .from('survey_responses')
          .select('user_id')
          .not('completed_at', 'is', null);

        if (networkError) throw networkError;
        setTotalFundManagers(fundManagers?.length || 0);

        // Update stats
        setStats([
          { title: "Network Access", value: "Full", icon: Users, description: "Complete fund directory" },
          { title: "Survey Status", value: `${completionPercentage}%`, icon: FileText, description: "Profile completion" },
          { title: "Total Fund Managers", value: String(fundManagers?.length || 0), icon: Building2, description: "In network" },
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
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome Back, Member! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          You have full access to our fund manager network. Complete your profile to maximize networking opportunities.
        </p>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
