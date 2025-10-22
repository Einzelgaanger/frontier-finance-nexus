import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ViewerNetworkPageNew from '@/components/network/ViewerNetworkPageNew';
import MemberNetworkPageNew from '@/components/network/MemberNetworkPageNew';

const Network = () => {
  const { userRole } = useAuth();

  // Show viewer-specific network page for viewers (non-clickable cards)
  if (userRole === 'viewer') {
    return (
      <SidebarLayout>
        <ViewerNetworkPageNew />
      </SidebarLayout>
    );
  }

  // Show member/admin network page (clickable cards with surveys)
  // Members see first 4 sections, admins see all sections
  return (
    <SidebarLayout>
      <MemberNetworkPageNew />
    </SidebarLayout>
  );
};

export default Network;
