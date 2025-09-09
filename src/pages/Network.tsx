import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import MemberNetworkCards from '@/components/network/MemberNetworkCards';

const Network = () => {
  return (
    <SidebarLayout>
      <MemberNetworkCards />
    </SidebarLayout>
  );
};

export default Network;