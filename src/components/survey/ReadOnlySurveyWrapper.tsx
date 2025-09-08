import React from 'react';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Calendar, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';

interface ReadOnlySurveyWrapperProps {
  year: string;
  title: string;
  children: React.ReactNode;
}

const ReadOnlySurveyWrapper: React.FC<ReadOnlySurveyWrapperProps> = ({ 
  year, 
  title, 
  children 
}) => {
  const { getSurveyData } = useSurveyStatus();
  const navigate = useNavigate();
  const surveyData = getSurveyData(year);

  const formatDateValue = (value: string | undefined): string => {
    if (!value) return 'Not specified';
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  if (!surveyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Survey Data Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your {year} survey responses.</p>
            <Button onClick={() => navigate('/survey')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => navigate('/survey')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">Your submitted responses</p>
              <p className="text-sm text-gray-500">
                Completed on {formatDateValue(surveyData.completed_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Survey Content */}
        {children}
      </div>
    </div>
  );
};

export default ReadOnlySurveyWrapper;
