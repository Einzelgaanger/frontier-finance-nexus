import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [memberStats, setMemberStats] = useState({
    networkConnections: 0,
    surveysCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch network connections count
        const { count: networkCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .neq('user_id', user.id)
          .eq('role', 'member');
        
        // Fetch surveys completed count
        const { count: surveysCount } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        setMemberStats({
          networkConnections: networkCount || 0,
          surveysCompleted: surveysCount || 0
        });
      } catch (error) {
        console.error('Error fetching member stats:', error);
        // Fallback to default values
        setMemberStats({
          networkConnections: 0,
          surveysCompleted: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, [user]);


  const quickActions = [
    { title: 'Browse Network', description: 'Connect with fund managers', icon: Users, color: 'blue', href: '/network' },
    { title: 'Complete Surveys', description: 'Share your insights', icon: FileText, color: 'purple', href: '/survey' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Member Benefits Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Member Benefits</h2>
                <p className="text-gray-600">Unlock the full potential of your CFF Network membership</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Global Network</h3>
                  <p className="text-sm text-gray-600">
                    Connect with 200+ fund managers across 25+ countries in emerging markets.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Survey Access</h3>
                  <p className="text-sm text-gray-600">
                    Complete annual surveys and access aggregated industry insights and data.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Exclusive Resources</h3>
                  <p className="text-sm text-gray-600">
                    Access exclusive reports, webinars, and professional development opportunities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Network Connections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      memberStats.networkConnections
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Surveys Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      memberStats.surveysCompleted
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left hover:shadow-md transition-all duration-300 group"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                        <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
