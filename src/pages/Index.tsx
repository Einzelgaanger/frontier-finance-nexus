import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Shield, BarChart3, Globe, Building2, Target, CheckCircle, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Fund Manager Network",
      description: "Connect with 150+ active fund managers across emerging markets with comprehensive profiles and investment data.",
      highlight: "150+ Active Funds"
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description: "Secure platform with viewer, member, and admin access levels ensuring appropriate data visibility.",
      highlight: "Enterprise Security"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive analytics dashboard with sector analysis, geographic distribution, and performance metrics.",
      highlight: "Real-time Insights"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Platform covers 25+ countries across Africa and emerging markets with localized data and insights.",
      highlight: "25+ Countries"
    }
  ];

  const stats = [
    { number: "$2.4B", label: "Assets Under Management", icon: TrendingUp },
    { number: "150+", label: "Fund Managers", icon: Users },
    { number: "25", label: "Countries", icon: Globe },
    { number: "85", label: "Active Funds", icon: Building2 }
  ];

  const accessLevels = [
    {
      title: "Viewer Access",
      description: "Basic access to fund directory",
      price: "Free",
      features: [
        "Public fund directory",
        "Basic fund information",
        "Geographic distribution",
        "Sector overviews"
      ],
      badge: "Current Access",
      badgeColor: "bg-gray-100 text-gray-800"
    },
    {
      title: "Member Access",
      description: "Full platform functionality",
      price: "By Invitation",
      features: [
        "Complete fund database",
        "Detailed investment data",
        "Survey participation",
        "Network connections",
        "Advanced filtering"
      ],
      badge: "Most Popular",
      badgeColor: "bg-blue-100 text-blue-800",
      highlighted: true
    },
    {
      title: "Admin Access",
      description: "Platform administration",
      price: "Restricted",
      features: [
        "User management",
        "Analytics dashboard",
        "Data exports",
        "Platform configuration",
        "Activity monitoring"
      ],
      badge: "Admin Only",
      badgeColor: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Collaborative Frontier</span>
            </div>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Premier Fund Manager
              <span className="block text-blue-600 mt-2">Database Platform</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with emerging market fund managers through our comprehensive database platform. 
              Access detailed investment data, analytics, and networking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Join the Network
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/network">
                <Button size="lg" variant="outline" className="border-gray-300 text-black px-8 py-3">
                  Explore Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Platform Overview</h2>
            <p className="text-gray-600">Connecting fund managers across emerging markets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift bg-white">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to connect with fund managers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift professional-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="w-12 h-12 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-800">{feature.highlight}</Badge>
                  </div>
                  <CardTitle className="text-xl text-black">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Levels */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Access Levels</h2>
            <p className="text-xl text-gray-600">Choose the right level of access for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accessLevels.map((level, index) => (
              <Card key={index} className={`hover-lift ${level.highlighted ? 'border-2 border-blue-500 professional-shadow-lg' : 'professional-shadow'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-xl text-black">{level.title}</CardTitle>
                      <CardDescription className="text-gray-600">{level.description}</CardDescription>
                    </div>
                    <Badge className={level.badgeColor}>{level.badge}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-black">{level.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Join the Network?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with viewer access to explore our fund directory, then request membership 
            for full platform access and networking opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/network">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 px-8 py-3">
                Explore Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Collaborative Frontier</span>
            </div>
            <div className="text-gray-400">
              © 2024 Collaborative Frontier Finance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
