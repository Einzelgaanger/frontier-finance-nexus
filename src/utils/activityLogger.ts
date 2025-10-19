import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

export const logActivity = async (action: string, details: Record<string, any>) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        action,
        details,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const logApplicationSubmitted = async (applicationId: string, applicantName: string, vehicleName: string) => {
  await logActivity('application_submitted', {
    application_id: applicationId,
    applicant_name: applicantName,
    vehicle_name: vehicleName
  });
};

export const logApplicationApproved = async (applicationId: string, applicantName: string, vehicleName: string) => {
  await logActivity('application_approved', {
    application_id: applicationId,
    applicant_name: applicantName,
    vehicle_name: vehicleName
  });
};

export const logApplicationRejected = async (applicationId: string, applicantName: string, vehicleName: string) => {
  await logActivity('application_rejected', {
    application_id: applicationId,
    applicant_name: applicantName,
    vehicle_name: vehicleName
  });
};
