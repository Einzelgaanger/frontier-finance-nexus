-- Fix admin dashboard statistics and ensure proper data visibility
-- This migration ensures admins can see all survey data including documents

-- Update RLS policies to ensure admins have full access to all survey data
DROP POLICY IF EXISTS "Admins can view all survey responses" ON survey_responses;
CREATE POLICY "Admins can view all survey responses" ON survey_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Ensure admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Add supporting_document_url field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'supporting_document_url'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN supporting_document_url TEXT;
    END IF;
END $$;

-- Add team_members field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'team_members'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN team_members JSONB;
    END IF;
END $$;

-- Add team_description field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'team_description'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN team_description TEXT;
    END IF;
END $$;

-- Add expectations field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'expectations'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN expectations TEXT;
    END IF;
END $$;

-- Add legal_entity_date_from field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'legal_entity_date_from'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN legal_entity_date_from INTEGER;
    END IF;
END $$;

-- Add legal_entity_date_to field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'legal_entity_date_to'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN legal_entity_date_to INTEGER;
    END IF;
END $$;

-- Add first_close_date_from field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'first_close_date_from'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN first_close_date_from INTEGER;
    END IF;
END $$;

-- Add first_close_date_to field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'first_close_date_to'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN first_close_date_to INTEGER;
    END IF;
END $$;

-- Add legal_entity_month_from field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'legal_entity_month_from'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN legal_entity_month_from INTEGER;
    END IF;
END $$;

-- Add legal_entity_month_to field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'legal_entity_month_to'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN legal_entity_month_to INTEGER;
    END IF;
END $$;

-- Add first_close_month_from field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'first_close_month_from'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN first_close_month_from INTEGER;
    END IF;
END $$;

-- Add first_close_month_to field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'first_close_month_to'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN first_close_month_to INTEGER;
    END IF;
END $$;

-- Add ticket_description field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'ticket_description'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN ticket_description TEXT;
    END IF;
END $$;

-- Add capital_in_market field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'capital_in_market'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN capital_in_market NUMERIC;
    END IF;
END $$;

-- Add vehicle_type_other field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'vehicle_type_other'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN vehicle_type_other TEXT;
    END IF;
END $$;

-- Add vehicle_websites field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'vehicle_websites'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN vehicle_websites TEXT;
    END IF;
END $$;

-- Add investment_instruments_priority field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'investment_instruments_priority'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN investment_instruments_priority JSONB;
    END IF;
END $$;

-- Add equity_investments_made field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'equity_investments_made'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN equity_investments_made INTEGER;
    END IF;
END $$;

-- Add equity_investments_exited field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'equity_investments_exited'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN equity_investments_exited INTEGER;
    END IF;
END $$;

-- Add self_liquidating_made field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'self_liquidating_made'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN self_liquidating_made INTEGER;
    END IF;
END $$;

-- Add self_liquidating_exited field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'self_liquidating_exited'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN self_liquidating_exited INTEGER;
    END IF;
END $$;

-- Add how_heard_about_network field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'how_heard_about_network'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN how_heard_about_network TEXT;
    END IF;
END $$;

-- Add information_sharing field to survey_responses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        AND column_name = 'information_sharing'
    ) THEN
        ALTER TABLE survey_responses ADD COLUMN information_sharing TEXT;
    END IF;
END $$;

-- Ensure data_field_visibility table has all necessary fields for admin access
INSERT INTO data_field_visibility (field_name, visibility_level, created_at, updated_at)
VALUES 
  ('supporting_document_url', 'admin', NOW(), NOW()),
  ('team_members', 'admin', NOW(), NOW()),
  ('team_description', 'admin', NOW(), NOW()),
  ('expectations', 'admin', NOW(), NOW()),
  ('legal_entity_date_from', 'admin', NOW(), NOW()),
  ('legal_entity_date_to', 'admin', NOW(), NOW()),
  ('first_close_date_from', 'admin', NOW(), NOW()),
  ('first_close_date_to', 'admin', NOW(), NOW()),
  ('legal_entity_month_from', 'admin', NOW(), NOW()),
  ('legal_entity_month_to', 'admin', NOW(), NOW()),
  ('first_close_month_from', 'admin', NOW(), NOW()),
  ('first_close_month_to', 'admin', NOW(), NOW()),
  ('ticket_description', 'admin', NOW(), NOW()),
  ('capital_in_market', 'admin', NOW(), NOW()),
  ('vehicle_type_other', 'admin', NOW(), NOW()),
  ('vehicle_websites', 'admin', NOW(), NOW()),
  ('investment_instruments_priority', 'admin', NOW(), NOW()),
  ('equity_investments_made', 'admin', NOW(), NOW()),
  ('equity_investments_exited', 'admin', NOW(), NOW()),
  ('self_liquidating_made', 'admin', NOW(), NOW()),
  ('self_liquidating_exited', 'admin', NOW(), NOW()),
  ('how_heard_about_network', 'admin', NOW(), NOW()),
  ('information_sharing', 'admin', NOW(), NOW())
ON CONFLICT (field_name) DO NOTHING;

-- Create a function to get accurate user statistics for admin dashboard
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE(
  viewers_count BIGINT,
  members_count BIGINT,
  admins_count BIGINT,
  surveys_completed BIGINT,
  new_registrations_today BIGINT,
  active_users_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH role_counts AS (
    SELECT 
      COUNT(*) FILTER (WHERE role = 'viewer') as viewers,
      COUNT(*) FILTER (WHERE role = 'member') as members,
      COUNT(*) FILTER (WHERE role = 'admin') as admins
    FROM user_roles
  ),
  survey_counts AS (
    SELECT COUNT(*) as completed
    FROM survey_responses
    WHERE completed_at IS NOT NULL
  ),
  today_registrations AS (
    SELECT COUNT(*) as new_today
    FROM profiles
    WHERE created_at >= CURRENT_DATE
  ),
  today_activity AS (
    SELECT COUNT(DISTINCT user_id) as active_today
    FROM survey_responses
    WHERE updated_at >= CURRENT_DATE
  )
  SELECT 
    rc.viewers,
    rc.members,
    rc.admins,
    sc.completed,
    tr.new_today,
    ta.active_today
  FROM role_counts rc
  CROSS JOIN survey_counts sc
  CROSS JOIN today_registrations tr
  CROSS JOIN today_activity ta;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 