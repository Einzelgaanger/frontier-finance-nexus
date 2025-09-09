import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ViewerSurveyNavigation from '@/components/survey/ViewerSurveyNavigation';

const ViewerSurvey: React.FC = () => {
  return (
    <SidebarLayout>
      <ViewerSurveyNavigation />
    </SidebarLayout>
  );
};

export default ViewerSurvey;
