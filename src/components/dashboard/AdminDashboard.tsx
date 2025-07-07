
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

const AdminDashboard = () => {
  const stats = [
    { 
      title: "Total Users", 
      value: "1,247", 
      icon: Users, 
      description: "Across all roles",
      trend: { value: 12, isPositive: true }
    },
    { 
      title: "Pending Requests", 
      value: "23", 
      icon: UserCheck, 
      description: "Membership applications" 
    },
    { 
      title: "Active Surveys", 
      value: "156", 
      icon: Building2, 
      description: "Completed this month",
      trend: { value: 8, isPositive: true }
    },
    { 
      title: "Platform Health", 
      value: "99.2%", 
      icon: TrendingUp, 
      description: "Uptime this month" 
    },
  ];

  const adminActions = [
    {
      title: "User Management",
      description: "Manage user roles, permissions, and access levels",
      icon: Users,
      action: "Manage Users",
      link: "/admin/users",
      status: "normal",
      badge: "1,247 users"
    },
    {
      title: "Membership Requests",
      description: "Review and approve pending membership applications",
      icon: UserCheck,
      action: "Review Requests",
      link: "/admin/requests",
      status: "urgent",
      badge: "23 pending"
    },
    {
      title: "Analytics Dashboard",
      description: "View comprehensive platform analytics and insights",
      icon: BarChart3,
      action: "View Analytics",
      link: "/admin/analytics",
      status: "normal"
    },
    {
      title: "Data Management",
      description: "Control data visibility and field permissions",
      icon: Settings,
      action: "Manage Data",
      link: "/admin/data",
      status: "normal"
    },
    {
      title: "System Monitoring",
      description: "Monitor platform performance and user activity",
      icon: Shield,
      action: "View Monitoring",
      link: "/admin/monitoring",
      status: "normal"
    },
    {
      title: "Invitation Codes",
      description: "Generate and manage invitation codes",
      icon: Mail,
      action: "Manage Codes",
      link: "/admin/invitations",
      status: "normal"
    }
  ];

  const recentAlerts = [
    { type: "warning", message: "23 membership requests awaiting approval", time: "2 hours ago" },
    { type: "info", message: "Monthly analytics report generated", time: "6 hours ago" },
    { type: "success", message: "System backup completed successfully", time: "12 hours ago" },
    { type: "warning", message: "5 invitation codes expiring today", time: "1 day ago" }
  ];

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
              You have 23 pending membership requests and 5 invitation codes expiring today.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="bg-red-600 hover:bg-red-700">
                <Link to="/admin/requests" className="flex items-center">
                  Review Requests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                <Link to="/admin/invitations">Manage Codes</Link>
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

      {/* Admin Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Administrative Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <action.icon className="w-8 h-8 text-blue-600" />
                  {action.status === "urgent" && (
                    <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Urgent
                    </div>
                  )}
                  {action.badge && action.status !== "urgent" && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {action.badge}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className={`w-full ${action.status === 'urgent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
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
                <span className="font-medium">892 (71.5%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Members</span>
                <span className="font-medium">332 (26.6%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admins</span>
                <span className="font-medium">23 (1.9%)</span>
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
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Surveys Completed</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Registrations</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
