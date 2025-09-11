import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle
} from 'lucide-react';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';

const SurveyNavigation: React.FC = () => {
  const location = useLocation();
  const { surveyStatuses, isSurveyCompleted } = useSurveyStatus();
  
  const surveys = [
    {
      year: '2024',
      title: '2024 ESCP Network Survey',
      description: 'Latest comprehensive survey for Early Stage Capital Providers',
      path: '/survey/2024',
      sections: 8,
      estimatedTime: '15-20 min'
    },
    {
      year: '2023',
      title: '2023 ESCP Network Survey',
      description: 'Previous year comprehensive data collection and analysis',
      path: '/survey/2023',
      sections: 7,
      estimatedTime: '12-15 min'
    },
    {
      year: '2022',
      title: '2022 ESCP Network Survey',
      description: 'Historical survey data from 2022 for trend analysis',
      path: '/survey/2022',
      sections: 6,
      estimatedTime: '10-12 min'
    },
    {
      year: '2021',
      title: '2021 ESCP Convening Survey',
      description: 'Early Stage Capital Providers 2021 Convening Survey',
      path: '/survey/2021',
      sections: 7,
      estimatedTime: '12-15 min'
    }
  ];

  // Calculate overall progress
  const completedSurveys = surveys.filter(survey => isSurveyCompleted(survey.year)).length;
  const totalSurveys = surveys.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Surveys</h1>
          <p className="text-gray-600">
            {completedSurveys} of {totalSurveys} surveys completed
          </p>
        </div>

        {/* Simple Survey List */}
        <div className="space-y-4">
          {surveys.map((survey) => {
            const isActive = location.pathname === survey.path;
            const isCompleted = isSurveyCompleted(survey.year);
            const surveyStatus = surveyStatuses.find(s => s.year === survey.year);
            
            return (
              <Card 
                key={survey.year} 
                className={`border ${
                  isActive ? 'border-blue-500' : 'border-gray-200'
                } ${isCompleted ? 'bg-green-50' : 'bg-white'}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {survey.title}
                        </h3>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {isActive && !isCompleted && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {survey.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{survey.sections} sections</span>
                        <span>{survey.estimatedTime}</span>
                        <span>{survey.year}</span>
                      </div>
                    </div>
                    
                    <Link to={survey.path}>
                      <Button 
                        variant={isCompleted ? "outline" : "default"}
                        className="ml-4"
                      >
                        {isCompleted ? 'View' : (isActive ? 'Continue' : 'Start')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurveyNavigation; 