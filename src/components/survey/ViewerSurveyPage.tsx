import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, FileText, Users, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
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
      <div className="max-w-6xl mx-auto p-8">
        {/* Enhanced Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1 pr-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our comprehensive collection of MSME financing surveys spanning 2021-2024. 
              Each survey provides unique insights into the evolving landscape of small and growing business financing.
            </p>
          </div>
          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>4 Total Surveys</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>4 Years of Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{userRole === 'viewer' ? 'Viewer Access' : 'Member Access'}</span>
            </div>
          </div>
        </div>

        {/* Survey Cards - Single Column Layout */}
        <div className="space-y-4">
          {surveys.map((survey) => {
            const IconComponent = survey.icon;
            
            return (
              <div
                key={survey.year}
                className={`group relative w-full transition-all duration-300 hover:shadow-lg cursor-pointer rounded-lg border-2 ${survey.color}`}
                onClick={() => navigate(survey.path)}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Left side - Icon and Year */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>

                    {/* Center - Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl font-bold text-gray-800">
                          {survey.year}
                        </span>
                        <div className="inline-flex items-center px-2 py-1 bg-white/70 rounded-full">
                          <span className="text-xs font-medium text-gray-700">{survey.focus}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {survey.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-3 text-sm line-clamp-2">
                        {survey.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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

                    {/* Right side - Arrow */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                        <span className="text-lg text-gray-600 group-hover:text-gray-800">→</span>
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