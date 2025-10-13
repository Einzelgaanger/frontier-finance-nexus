import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import MemberNetwork from '@/pages/MemberNetwork';
import ViewerNetworkPage from '@/components/network/ViewerNetworkPage';
import NetworkV2 from '@/pages/NetworkV2';

const Network = () => {
  const { userRole } = useAuth();

  // Show viewer-specific network page for viewers
  if (userRole === 'viewer') {
    return (
      <SidebarLayout>
        <ViewerNetworkPage />
      </SidebarLayout>
    );
  }

  // Show member network page for both admins and members
  // Admin gets full survey access through SurveyResponseViewer
  return <MemberNetwork />;
};

export default Network;
