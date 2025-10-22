-- Add new columns to applications table for comprehensive application form

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS applicant_name TEXT,
ADD COLUMN IF NOT EXISTS vehicle_name TEXT,
ADD COLUMN IF NOT EXISTS organization_website TEXT,
ADD COLUMN IF NOT EXISTS role_job_title TEXT,
ADD COLUMN IF NOT EXISTS team_overview TEXT,
ADD COLUMN IF NOT EXISTS investment_thesis TEXT,
ADD COLUMN IF NOT EXISTS typical_check_size TEXT,
ADD COLUMN IF NOT EXISTS number_of_investments TEXT,
ADD COLUMN IF NOT EXISTS amount_raised_to_date TEXT,
ADD COLUMN IF NOT EXISTS expectations_from_network TEXT,
ADD COLUMN IF NOT EXISTS how_heard_about_network TEXT;

-- Add comment to table explaining the comprehensive application structure
COMMENT ON TABLE public.applications IS 'CFF Network membership applications with comprehensive vehicle and team information';