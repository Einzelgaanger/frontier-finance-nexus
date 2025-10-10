-- =====================================================
-- WORKING DATA UPLOAD SCRIPT FOR SURVEY RESPONSES
-- =====================================================
-- This script works with existing users and avoids foreign key violations
-- =====================================================

-- =====================================================
-- STEP 1: CHECK EXISTING USERS AND CREATE PROFILES
-- =====================================================

-- First, let's see what users exist in the system
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- STEP 2: INSERT PROFILES FOR EXISTING USERS
-- =====================================================
-- We'll use the existing user IDs from auth.users
-- Replace the user IDs below with actual user IDs from your system

-- Insert profiles for existing users (replace with actual user IDs)
INSERT INTO profiles (user_id, first_name, last_name, email, organization_name, role_title)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(u.raw_user_meta_data->>'last_name', 'Name'),
    u.email,
    COALESCE(u.raw_user_meta_data->>'organization_name', 'Investment Fund'),
    COALESCE(u.raw_user_meta_data->>'role_title', 'Fund Manager')
FROM auth.users u
WHERE u.id NOT IN (SELECT user_id FROM profiles)
LIMIT 5
ON CONFLICT (user_id) 
DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    organization_name = EXCLUDED.organization_name,
    role_title = EXCLUDED.role_title,
    updated_at = NOW();

-- =====================================================
-- STEP 3: INSERT SURVEY RESPONSES FOR EXISTING USERS
-- =====================================================

-- Get the first few users to create survey responses for
WITH existing_users AS (
    SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5
),
user_data AS (
    SELECT 
        u.id,
        u.email,
        COALESCE(p.organization_name, 'Investment Fund') as firm_name,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), 'Fund Manager') as participant_name,
        CASE 
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) = 1 THEN 'East Africa'
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) = 2 THEN 'West Africa'
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) = 3 THEN 'Southern Africa'
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) = 4 THEN 'North Africa'
            ELSE 'Central Africa'
        END as geographic_focus,
        CASE 
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) % 2 = 0 THEN 'Venture Capital'
            ELSE 'Private Equity'
        END as investment_vehicle_type,
        CASE 
            WHEN ROW_NUMBER() OVER (ORDER BY u.created_at) % 2 = 0 THEN 'Early Stage'
            ELSE 'Growth Stage'
        END as fund_stage,
        15 + (ROW_NUMBER() OVER (ORDER BY u.created_at) * 2) as current_ftes,
        COALESCE(p.role_title, 'Fund Manager') as role_title
    FROM existing_users u
    LEFT JOIN profiles p ON u.id = p.user_id
)

-- Insert Survey 2021 responses
INSERT INTO survey_2021_responses (
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
SELECT 
    ud.id,
    ud.firm_name,
    ud.participant_name,
    ud.geographic_focus,
    ud.investment_vehicle_type,
    ud.fund_stage,
    ud.current_ftes,
    ud.role_title,
    'completed',
    '{"survey_year": "2021", "completed": true}'::jsonb
FROM user_data ud
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

-- Insert Survey 2022 responses
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
SELECT 
    ud.id,
    ud.firm_name,
    ud.participant_name,
    ud.geographic_focus,
    ud.investment_vehicle_type,
    ud.fund_stage,
    ud.current_ftes + 2, -- Slight growth
    ud.role_title,
    'completed',
    '{"survey_year": "2022", "completed": true}'::jsonb
FROM user_data ud
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

-- Insert Survey 2023 responses
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
SELECT 
    ud.id,
    ud.firm_name,
    ud.participant_name,
    ud.geographic_focus,
    ud.investment_vehicle_type,
    ud.fund_stage,
    ud.current_ftes + 4, -- More growth
    ud.role_title,
    'completed',
    '{"survey_year": "2023", "completed": true}'::jsonb
FROM user_data ud
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

-- Insert Survey 2024 responses
INSERT INTO survey_2024_responses (
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
SELECT 
    ud.id,
    ud.firm_name,
    ud.participant_name,
    ud.geographic_focus,
    ud.investment_vehicle_type,
    ud.fund_stage,
    ud.current_ftes + 6, -- Even more growth
    ud.role_title,
    'completed',
    '{"survey_year": "2024", "completed": true}'::jsonb
FROM user_data ud
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
-- VERIFICATION QUERIES
-- =====================================================

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
