import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';

const SurveyNavigation: React.FC = () => {
  const location = useLocation();
  const { surveyStatuses, loading, isSurveyCompleted } = useSurveyStatus();
  
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
          const isCompleted = isSurveyCompleted(survey.year);
          const surveyStatus = surveyStatuses.find(s => s.year === survey.year);
          
          return (
            <Card 
              key={survey.year} 
              className={`${survey.color} border-2 hover:shadow-lg transition-shadow duration-200 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${survey.color.replace('bg-', 'bg-').replace('-50', '-100')}`}>
                      {isCompleted ? (
                        <CheckCircle className={`w-5 h-5 ${survey.textColor}`} />
                      ) : (
                        <Calendar className={`w-5 h-5 ${survey.textColor}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className={`text-xl ${survey.textColor}`}>
                          {survey.title}
                        </CardTitle>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {survey.description}
                      </p>
                      {isCompleted && surveyStatus?.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed on {new Date(surveyStatus.completedAt).toLocaleDateString()}
                        </p>
                      )}
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
                    <span>{isCompleted ? 'View Responses' : 'Multi-section survey'}</span>
                  </div>
                  
                  <Link to={survey.path}>
                    <Button 
                      variant={isCompleted ? "secondary" : (isActive ? "default" : "outline")}
                      className={`flex items-center space-x-2 ${
                        isCompleted ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : ''
                      }`}
                    >
                      {isCompleted ? 'View Responses' : (isActive ? 'Continue' : 'Start')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                
                {isActive && !isCompleted && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Currently Active:</strong> You're working on this survey. 
                      Your progress is automatically saved.
                    </p>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Survey Completed:</strong> Click "View Responses" to review your submitted answers.
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