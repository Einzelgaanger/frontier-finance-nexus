import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, FileText, Users, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const surveys = [
    {
      year: '2024',
      title: '2024 MSME Financing Survey',
      description: 'Comprehensive analysis of Small and Growing Business (SGB) financing landscape across Africa and MENA regions. This survey examines the role of Local Capital Providers (LCPs) - indigenous fund managers using innovative approaches to invest in MSMEs. Covers business models, market conditions, and future trends in venture capital, PE, growth funds, and fintech sectors.',
      path: '/survey/2024',
      sections: 8,
      estimatedTime: '15-20 min',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400',
      icon: Globe,
      focus: 'SGB Financing Landscape'
    },
    {
      year: '2023',
      title: '2023 MSME Financing Survey',
      description: 'Assessment of Local Capital Providers using alternative investment structures to finance small and growing businesses. This survey explores the heterogeneous group of indigenous fund managers providing capital to MSMEs in local markets, examining their investment strategies, portfolio construction, and impact on economic development across emerging markets.',
      path: '/survey/2023',
      sections: 7,
      estimatedTime: '12-15 min',
      color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400',
      icon: Users,
      focus: 'Local Capital Providers'
    },
    {
      year: '2022',
      title: '2022 CFF Survey',
      description: 'Capital for Frontier Finance comprehensive survey analyzing MSME financing ecosystem across Africa and MENA regions. This survey investigates the "missing middle" financing gap, exploring how micro, small, and medium enterprises access capital beyond microfinance but below traditional bank loans and private equity thresholds.',
      path: '/survey/2022',
      sections: 6,
      estimatedTime: '10-12 min',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:border-purple-400',
      icon: FileText,
      focus: 'Missing Middle Finance'
    },
    {
      year: '2021',
      title: '2021 ESCP Survey',
      description: 'Early Stage Capital Providers convening survey focusing on SGB financing and investment strategies. This foundational survey examines investment thesis, capital constructs, portfolio development, and the impact of COVID-19 on early-stage capital providers. Includes feedback on network membership and convening objectives.',
      path: '/survey/2021',
      sections: 7,
      estimatedTime: '12-15 min',
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:border-orange-400',
      icon: Clock,
      focus: 'Early Stage Capital'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Survey Collection</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>4 Surveys</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{userRole === 'viewer' ? 'Viewer Access' : 'Member Access'}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Comprehensive MSME financing surveys spanning 2021-2024, providing insights into small and growing business financing landscapes.
          </p>
        </div>

        {/* Survey Cards - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {surveys.map((survey) => {
            const IconComponent = survey.icon;
            
            return (
              <div
                key={survey.year}
                className={`group relative transition-all duration-300 hover:shadow-lg cursor-pointer rounded-lg border-2 ${survey.color}`}
                onClick={() => navigate(survey.path)}
              >
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-4 h-4 text-gray-700" />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-gray-800">{survey.year}</span>
                        <div className="inline-flex items-center px-2 py-0.5 bg-white/70 rounded-full ml-2">
                          <span className="text-xs font-medium text-gray-700">{survey.focus}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                      <span className="text-sm text-gray-600 group-hover:text-gray-800">→</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">
                    {survey.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
                    {survey.description}
                  </p>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{survey.sections} sections</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{survey.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;