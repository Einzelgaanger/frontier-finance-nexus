import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

const SurveyNavigation: React.FC = () => {
  const location = useLocation();
  
  const surveys = [
    {
      year: '2024',
      title: '2024 ESCP Survey',
      description: 'Latest survey for Early Stage Capital Providers',
      path: '/survey/2024',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900'
    },
    {
      year: '2023',
      title: '2023 ESCP Survey',
      description: 'Previous year survey data collection',
      path: '/survey/2023',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-900'
    },
    {
      year: '2022',
      title: '2022 ESCP Survey',
      description: 'Historical survey from 2022',
      path: '/survey/2022',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900'
    },
    {
      year: '2021',
      title: '2021 ESCP Survey',
      description: 'Early Stage Capital Providers 2021 Convening Survey',
      path: '/survey/2021',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-900'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ESCP Surveys</h1>
        <p className="text-gray-600">
          Access and complete surveys for different years. Your progress is automatically saved.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surveys.map((survey) => {
          const isActive = location.pathname === survey.path;
          
          return (
            <Card 
              key={survey.year} 
              className={`${survey.color} border-2 hover:shadow-lg transition-shadow duration-200 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${survey.color.replace('bg-', 'bg-').replace('-50', '-100')}`}>
                      <Calendar className={`w-5 h-5 ${survey.textColor}`} />
                    </div>
                    <div>
                      <CardTitle className={`text-xl ${survey.textColor}`}>
                        {survey.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {survey.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">
                    {survey.year}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Multi-section survey</span>
                  </div>
                  
                  <Link to={survey.path}>
                    <Button 
                      variant={isActive ? "default" : "outline"}
                      className="flex items-center space-x-2"
                    >
                      {isActive ? 'Continue' : 'Start'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                
                {isActive && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Currently Active:</strong> You're working on this survey. 
                      Your progress is automatically saved.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Survey Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-save every 30 seconds</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Remember your last section</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Restore scroll position</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyNavigation; 