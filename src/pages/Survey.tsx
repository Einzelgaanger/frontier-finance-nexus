import React from 'react';
import Header from '@/components/layout/Header';
import SurveyNavigation from '@/components/survey/SurveyNavigation';

const Survey: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SurveyNavigation />
    </div>
  );
};

export default Survey;
