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

  // Show admin network page for admins
  if (userRole === 'admin') {
    return <NetworkV2 />;
  }

  // Show member network page for members (same as admin for now)
  return <MemberNetwork />;
};

export default Network;
