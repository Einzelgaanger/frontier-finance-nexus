-- =====================================================
-- DATA UPLOAD SCRIPT FOR SURVEY RESPONSES
-- =====================================================
-- This script handles uploading survey data with the logic:
-- 1. If member exists: Add new survey to their profile
-- 2. If member doesn't exist: Create new member with survey
-- =====================================================

-- =====================================================
-- HELPER FUNCTION: UPSERT SURVEY DATA
-- =====================================================
-- This function handles the logic of adding surveys to existing members
-- or creating new members if they don't exist

-- Example: Upload 2022 survey data
-- Replace the values below with actual survey data from your upload

-- Step 1: Insert or update user role
INSERT INTO user_roles (user_id, email, role, assigned_at)
VALUES (
    'user-uuid-here',  -- Replace with actual user UUID
    'user@example.com', -- Replace with actual email
    'member',
    NOW()
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Step 2: Insert or update profile
INSERT INTO profiles (user_id, first_name, last_name, email, organization_name, role_title)
VALUES (
    'user-uuid-here',  -- Replace with actual user UUID
    'First Name',      -- Replace with actual first name
    'Last Name',       -- Replace with actual last name
    'user@example.com', -- Replace with actual email
    'Organization Name', -- Replace with actual organization
    'Role Title'       -- Replace with actual role
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    organization_name = EXCLUDED.organization_name,
    role_title = EXCLUDED.role_title,
    updated_at = NOW();

-- Step 3: Insert survey response (this will be unique per year)
INSERT INTO survey_2022_responses (
    user_id,
    firm_name,
    participant_name,
    geographic_focus,
    investment_vehicle_type,
    fund_stage,
    current_ftes,
    role_title,
    submission_status,
    form_data
)
VALUES (
    'user-uuid-here',  -- Replace with actual user UUID
    'Firm Name',       -- Replace with actual firm name
    'Participant Name', -- Replace with actual participant name
    'Geographic Focus', -- Replace with actual geographic focus
    'Investment Vehicle Type', -- Replace with actual vehicle type
    'Fund Stage',      -- Replace with actual fund stage
    10,                -- Replace with actual FTE count
    'Role Title',      -- Replace with actual role title
    'completed',       -- Survey status
    '{}'::jsonb        -- Replace with actual form data as JSONB
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    firm_name = EXCLUDED.firm_name,
    participant_name = EXCLUDED.participant_name,
    geographic_focus = EXCLUDED.geographic_focus,
    investment_vehicle_type = EXCLUDED.investment_vehicle_type,
    fund_stage = EXCLUDED.fund_stage,
    current_ftes = EXCLUDED.current_ftes,
    role_title = EXCLUDED.role_title,
    submission_status = EXCLUDED.submission_status,
    form_data = EXCLUDED.form_data,
    updated_at = NOW();

-- =====================================================
-- BATCH UPLOAD TEMPLATE
-- =====================================================
-- Use this template to upload multiple survey responses
-- Copy and modify for each survey year (2021, 2022, 2023, 2024)

-- Example for 2023 survey data:
/*
INSERT INTO survey_2023_responses (
    user_id,
    firm_name,
    participant_name,
    geographic_focus,
    investment_vehicle_type,
    fund_stage,
    current_ftes,
    role_title,
    submission_status,
    form_data
)
VALUES 
    ('user1-uuid', 'Firm 1', 'Participant 1', 'East Africa', 'PE Fund', 'Growth', 15, 'Managing Partner', 'completed', '{"key": "value"}'::jsonb),
    ('user2-uuid', 'Firm 2', 'Participant 2', 'West Africa', 'VC Fund', 'Early Stage', 8, 'Investment Director', 'completed', '{"key": "value"}'::jsonb),
    -- Add more rows as needed
ON CONFLICT (user_id) 
DO UPDATE SET 
    firm_name = EXCLUDED.firm_name,
    participant_name = EXCLUDED.participant_name,
    geographic_focus = EXCLUDED.geographic_focus,
    investment_vehicle_type = EXCLUDED.investment_vehicle_type,
    fund_stage = EXCLUDED.fund_stage,
    current_ftes = EXCLUDED.current_ftes,
    role_title = EXCLUDED.role_title,
    submission_status = EXCLUDED.submission_status,
    form_data = EXCLUDED.form_data,
    updated_at = NOW();
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Use these queries to verify the data upload

-- Check all unique fund managers
SELECT DISTINCT 
    p.user_id,
    p.first_name,
    p.last_name,
    p.organization_name,
    p.role_title
FROM profiles p
ORDER BY p.organization_name;

-- Check survey responses by year
SELECT 
    '2021' as survey_year,
    COUNT(*) as response_count
FROM survey_2021_responses 
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2022' as survey_year,
    COUNT(*) as response_count
FROM survey_2022_responses 
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2023' as survey_year,
    COUNT(*) as response_count
FROM survey_2023_responses 
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2024' as survey_year,
    COUNT(*) as response_count
FROM survey_2024_responses 
WHERE submission_status = 'completed';

-- Check which users have multiple survey responses
SELECT 
    user_id,
    COUNT(*) as survey_count,
    STRING_AGG(survey_year, ', ') as survey_years
FROM (
    SELECT user_id, '2021' as survey_year FROM survey_2021_responses WHERE submission_status = 'completed'
    UNION ALL
    SELECT user_id, '2022' as survey_year FROM survey_2022_responses WHERE submission_status = 'completed'
    UNION ALL
    SELECT user_id, '2023' as survey_year FROM survey_2023_responses WHERE submission_status = 'completed'
    UNION ALL
    SELECT user_id, '2024' as survey_year FROM survey_2024_responses WHERE submission_status = 'completed'
) all_surveys
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY survey_count DESC;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Data upload script ready!
-- Replace the placeholder values with actual survey data
-- and run the queries to upload your survey responses.
-- =====================================================
