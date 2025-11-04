import React, { useState, useEffect } from 'react';
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
import { Leaderboard } from './Leaderboard';

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
        
        // Fetch surveys completed count from all survey tables
        const [survey2021, survey2022, survey2023, survey2024] = await Promise.all([
          supabase.from('survey_responses_2021' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2022' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2023' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2024' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);
        
        const surveysCount = (survey2021.count || 0) + (survey2022.count || 0) + (survey2023.count || 0) + (survey2024.count || 0);
        
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

  // Prevent body scrolling like the AI page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  const quickActions = [
    { title: 'Browse Network', description: 'Connect with fund managers', icon: Users, color: 'blue', href: '/network' },
    { title: 'Complete Surveys', description: 'Share your insights', icon: FileText, color: 'purple', href: '/survey' }
  ];

  const surveyYears = [
    { year: '2021', path: '/survey/2021', available: true },
    { year: '2022', path: '/survey/2022', available: true },
    { year: '2023', path: '/survey/2023', available: true },
    { year: '2024', path: '/survey/2024', available: true }
  ];


  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
      {/* Main Content */}
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side - Stats, Quick Actions and Benefits Cards */}
          <div className="lg:col-span-7 space-y-3">
            {/* Your Activity */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-2">
                <div className="text-center mb-2">
                  <h2 className="text-sm font-bold text-gray-800">Your Activity</h2>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-600 mb-0.5">Network</p>
                    <div className="text-lg font-bold text-gray-900">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-5 w-8 rounded mx-auto"></div>
                      ) : (
                        memberStats.networkConnections
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-600 mb-0.5">Surveys</p>
                    <div className="text-lg font-bold text-gray-900">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-5 w-8 rounded mx-auto"></div>
                      ) : (
                        memberStats.surveysCompleted
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-2">
                <div className="text-center mb-2">
                  <h2 className="text-sm font-bold text-gray-800">Quick Actions</h2>
                </div>

                <div className="space-y-1.5">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-1.5 text-left hover:shadow-md transition-all duration-300 group border-2 hover:border-blue-300 bg-white/60 backdrop-blur-sm rounded-lg"
                      onClick={() => navigate(action.href)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <div className={`w-6 h-6 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                          <action.icon className={`w-3 h-3 text-${action.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-[11px]">
                            {action.title}
                          </h4>
                          <p className="text-[10px] text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Network card removed per request */}

            {/* Survey Access */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-2">
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">Survey Access</h3>
                </div>
                <p className="text-[10px] text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-tight mb-1.5">
                  Complete annual surveys and access aggregated industry insights.
                </p>
                
                {/* Survey Year Buttons */}
                <div className="grid grid-cols-4 gap-1 mb-1.5">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(survey.path)}
                      className="h-6 text-[10px] font-medium bg-white/80 hover:bg-green-50 hover:text-green-700 hover:border-green-400 transition-all"
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>4 Years Data</span>
                  <span>Trend Analysis</span>
                </div>
              </div>
            </div>

            {/* Professional Development */}
            <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
              <div className="relative p-2">
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Professional Growth</h3>
                </div>
                <p className="text-[10px] text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-tight mb-1">
                  Enhance your expertise through exclusive events and resources.
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Webinars</span>
                  <span>Workshops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Leaderboard */}
          <div className="lg:col-span-5">
            <Leaderboard />
          </div>
        </div>

        {/* AI Assistant Section - Removed, now available in dedicated PortIQ page */}
      </div>
    </div>
  );
};

export default MemberDashboard;
