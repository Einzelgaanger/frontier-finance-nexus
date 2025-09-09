import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import SurveyNavigation from '@/components/survey/SurveyNavigation';
import ViewerSurveyNavigation from '@/components/survey/ViewerSurveyNavigation';

const Survey: React.FC = () => {
  const { userRole } = useAuth();

  // Show viewer-specific survey page for viewers
  if (userRole === 'viewer') {
    return (
      <SidebarLayout>
        <ViewerSurveyNavigation />
      </SidebarLayout>
    );
  }

  // Show regular survey page for members and admins
  return (
    <SidebarLayout>
      <SurveyNavigation />
    </SidebarLayout>
  );
};

export default Survey;
