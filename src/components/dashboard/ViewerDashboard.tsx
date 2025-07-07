
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { Users, Building2, TrendingUp, Globe, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ViewerDashboard = () => {
  const stats = [
    { title: "Fund Managers", value: "150+", icon: Users, description: "Active in network" },
    { title: "Total AUM", value: "$2.4B", icon: TrendingUp, description: "Assets under management" },
    { title: "Countries", value: "25", icon: Globe, description: "Geographic coverage" },
    { title: "Active Funds", value: "85", icon: Building2, description: "Currently fundraising" },
  ];

  const features = [
    {
      title: "Fund Manager Directory",
      description: "Browse public profiles of fund managers in our network",
      icon: Users
    },
    {
      title: "Market Insights",
      description: "Access limited market data and trends",
      icon: TrendingUp
    },
    {
      title: "Network Overview",
      description: "See the scope of our global fund manager community",
      icon: Globe
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Collaborative Frontier
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          The premier platform connecting fund managers across emerging markets. 
          Join our exclusive network to access comprehensive data and insights.
        </p>
        
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-yellow-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-blue-800">
              <Star className="w-5 h-5 mr-2" />
              Upgrade to Member Access
            </CardTitle>
            <CardDescription className="text-center">
              Get full access to our fund manager network, detailed profiles, and exclusive insights
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
              Request Membership
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Available Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Can Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" size="lg" asChild>
          <Link to="/network">
            <Users className="w-4 h-4 mr-2" />
            Browse Network
          </Link>
        </Button>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
          Request Membership
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ViewerDashboard;
