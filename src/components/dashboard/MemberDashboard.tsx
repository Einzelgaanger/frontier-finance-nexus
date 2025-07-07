
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { Users, Building2, TrendingUp, Globe, ArrowRight, FileText, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const MemberDashboard = () => {
  const stats = [
    { title: "Network Access", value: "Full", icon: Users, description: "Complete fund directory" },
    { title: "Survey Status", value: "85%", icon: FileText, description: "Profile completion" },
    { title: "Connections", value: "23", icon: Building2, description: "Network contacts" },
    { title: "Profile Views", value: "156", icon: TrendingUp, description: "This month" },
  ];

  const quickActions = [
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
  ];

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
        
        {/* Profile Completion Alert */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-yellow-600 mr-2" />
              <CardTitle className="text-yellow-800">Profile Completion: 85%</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-4">
              Complete your survey to unlock advanced networking features and increase your profile visibility.
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Link to="/survey" className="flex items-center">
                Complete Survey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <action.icon className="w-8 h-8 text-blue-600" />
                  {action.status === "incomplete" && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                  {action.status === "available" && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className={`w-full ${action.status === 'incomplete' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                >
                  <Link to={action.link}>
                    {action.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Network Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { action: "Profile viewed by", entity: "East Africa Growth Fund", time: "2 hours ago" },
                { action: "New connection request from", entity: "Sahara Ventures", time: "1 day ago" },
                { action: "Survey updated", entity: "Investment preferences", time: "3 days ago" },
                { action: "Profile viewed by", entity: "Nile Capital Partners", time: "1 week ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <span className="text-gray-600">{activity.action} </span>
                    <span className="font-medium text-gray-900">{activity.entity}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
