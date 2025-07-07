
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "./StatsCard";
import { Users, Building2, TrendingUp, Globe, ArrowRight, Star, Eye, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MembershipRequestModal } from "./MembershipRequestModal";

const ViewerDashboard = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const stats = [
    { title: "Fund Managers", value: "150+", icon: Users, description: "Active in network" },
    { title: "Total AUM", value: "$2.4B", icon: TrendingUp, description: "Assets under management" },
    { title: "Countries", value: "25", icon: Globe, description: "Geographic coverage" },
    { title: "Active Funds", value: "85", icon: Building2, description: "Currently fundraising" },
  ];

  const accessLevels = [
    {
      title: "Public Fund Directory",
      description: "Browse basic fund manager information available to all users",
      icon: Eye,
      status: "available",
      fields: ["Fund Name", "Location", "Fund Stage", "Sector Focus"]
    },
    {
      title: "Member Network Access",
      description: "Full access to detailed fund manager profiles and data",
      icon: Users,
      status: "locked",
      fields: ["Investment Thesis", "Team Details", "Ticket Sizes", "Portfolio Returns"]
    },
    {
      title: "Survey & Profile System",
      description: "Complete detailed survey and access networking features",
      icon: Building2,
      status: "locked",
      fields: ["Personal Profile", "Survey Completion", "Network Connections"]
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
          Upgrade to Member access to unlock the full network and detailed insights.
        </p>
        
        <Card className="max-w-2xl mx-auto border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-blue-800">
              <Star className="w-5 h-5 mr-2" />
              Upgrade to Member Access
            </CardTitle>
            <CardDescription className="text-center text-blue-700">
              Get full access to our fund manager network, detailed profiles, and exclusive insights
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowRequestModal(true)}
            >
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

      {/* Access Levels */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Access Levels & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accessLevels.map((level, index) => (
            <Card key={index} className={`relative ${level.status === 'locked' ? 'opacity-75' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <level.icon className={`w-8 h-8 ${level.status === 'available' ? 'text-green-600' : 'text-gray-400'}`} />
                  {level.status === 'locked' && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <CardTitle className="text-lg">{level.title}</CardTitle>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Includes access to:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {level.fields.map((field, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${level.status === 'available' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" size="lg" asChild className="border-gray-300">
          <Link to="/network">
            <Users className="w-4 h-4 mr-2" />
            Browse Public Directory
          </Link>
        </Button>
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowRequestModal(true)}
        >
          Request Membership
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <MembershipRequestModal 
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
};

export default ViewerDashboard;
