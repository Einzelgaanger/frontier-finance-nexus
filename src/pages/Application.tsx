import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ApplicationForm from '@/components/application/ApplicationForm';

const Application: React.FC = () => {
  return (
    <SidebarLayout>
      <div className="p-6">
        <ApplicationForm />
      </div>
    </SidebarLayout>
  );
};

export default Application;
