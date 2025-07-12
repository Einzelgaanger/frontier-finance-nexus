-- Update membership_requests table to match ESCP application form
-- Add new columns for the comprehensive ESCP application form

-- Add new columns for Background Information
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS vehicle_website TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS applicant_name TEXT;

-- Add new columns for Team Information
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS role_job_title TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS location TEXT;

-- Add new columns for Vehicle Information
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS thesis TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS ticket_size TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS portfolio_investments TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS capital_raised TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS supporting_documents TEXT;

-- Add new columns for ESCP Network Expectations
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS information_sharing JSONB;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS expectations TEXT;
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS how_heard_about_network TEXT;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can view own requests" ON membership_requests;
DROP POLICY IF EXISTS "Users can create requests" ON membership_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON membership_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON membership_requests;

CREATE POLICY "Users can view own requests" ON membership_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON membership_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON membership_requests FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update requests" ON membership_requests FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin'); 