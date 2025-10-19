import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import SurveyNavigation from '@/components/survey/SurveyNavigation';
import SurveyPage from '@/components/survey/SurveyPage';

const Survey: React.FC = () => {
  const { userRole } = useAuth();

  // Show enhanced survey page for both viewers and members
  if (userRole === 'viewer' || userRole === 'member') {
    return (
      <SidebarLayout>
        <SurveyPage />
      </SidebarLayout>
    );
  }

  // Show regular survey page for admins
  return (
    <SidebarLayout>
      <SurveyNavigation />
    </SidebarLayout>
  );
};

export default Survey;
