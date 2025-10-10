-- =====================================================
-- FIXED DATA UPLOAD SCRIPT FOR SURVEY RESPONSES
-- =====================================================
-- This script handles uploading survey data with proper UUIDs and real data
-- =====================================================

-- =====================================================
-- STEP 1: CREATE SAMPLE FUND MANAGERS WITH REAL DATA
-- =====================================================

-- Insert sample user roles with proper UUIDs
INSERT INTO user_roles (user_id, email, role, assigned_at)
VALUES 
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'abeautifulmind.ke@gmail.com', 'member', NOW()),
    ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@alphafund.com', 'member', NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@betafund.com', 'member', NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@gammainvest.com', 'member', NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'sarah.jones@deltacapital.com', 'member', NOW())
ON CONFLICT (user_id) 
DO UPDATE SET 
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Insert sample profiles
INSERT INTO profiles (user_id, first_name, last_name, email, organization_name, role_title)
VALUES 
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Abraham', 'Beautiful', 'abeautifulmind.ke@gmail.com', 'Beautiful Ventures', 'Managing Partner'),
    ('550e8400-e29b-41d4-a716-446655440001', 'John', 'Doe', 'john.doe@alphafund.com', 'Alpha Investment Fund', 'Managing Partner'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jane', 'Smith', 'jane.smith@betafund.com', 'Beta Capital Partners', 'Investment Director'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Mike', 'Wilson', 'mike.wilson@gammainvest.com', 'Gamma Investment Group', 'Senior Partner'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Sarah', 'Jones', 'sarah.jones@deltacapital.com', 'Delta Capital Management', 'Fund Manager')
ON CONFLICT (user_id) 
DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    organization_name = EXCLUDED.organization_name,
    role_title = EXCLUDED.role_title,
    updated_at = NOW();

-- =====================================================
-- STEP 2: INSERT SURVEY 2021 RESPONSES
-- =====================================================
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
VALUES 
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 15, 'Managing Partner', 'completed', '{"survey_year": "2021", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'Alpha Investment Fund', 'John Doe', 'West Africa', 'Venture Capital', 'Early Stage', 12, 'Managing Partner', 'completed', '{"survey_year": "2021", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Capital Partners', 'Jane Smith', 'Southern Africa', 'Private Equity', 'Growth Stage', 18, 'Investment Director', 'completed', '{"survey_year": "2021", "completed": true}'::jsonb)
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
-- STEP 3: INSERT SURVEY 2022 RESPONSES
-- =====================================================
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
VALUES 
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 18, 'Managing Partner', 'completed', '{"survey_year": "2022", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'Alpha Investment Fund', 'John Doe', 'West Africa', 'Venture Capital', 'Early Stage', 15, 'Managing Partner', 'completed', '{"survey_year": "2022", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gamma Investment Group', 'Mike Wilson', 'North Africa', 'Private Equity', 'Growth Stage', 20, 'Senior Partner', 'completed', '{"survey_year": "2022", "completed": true}'::jsonb)
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
-- STEP 4: INSERT SURVEY 2023 RESPONSES
-- =====================================================
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
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 20, 'Managing Partner', 'completed', '{"survey_year": "2023", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'Alpha Investment Fund', 'John Doe', 'West Africa', 'Venture Capital', 'Early Stage', 18, 'Managing Partner', 'completed', '{"survey_year": "2023", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Capital Partners', 'Jane Smith', 'Southern Africa', 'Private Equity', 'Growth Stage', 22, 'Investment Director', 'completed', '{"survey_year": "2023", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440004', 'Delta Capital Management', 'Sarah Jones', 'Central Africa', 'Venture Capital', 'Early Stage', 14, 'Fund Manager', 'completed', '{"survey_year": "2023", "completed": true}'::jsonb)
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
-- STEP 5: INSERT SURVEY 2024 RESPONSES
-- =====================================================
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
VALUES 
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 25, 'Managing Partner', 'completed', '{"survey_year": "2024", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440001', 'Alpha Investment Fund', 'John Doe', 'West Africa', 'Venture Capital', 'Early Stage', 20, 'Managing Partner', 'completed', '{"survey_year": "2024", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Capital Partners', 'Jane Smith', 'Southern Africa', 'Private Equity', 'Growth Stage', 25, 'Investment Director', 'completed', '{"survey_year": "2024", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gamma Investment Group', 'Mike Wilson', 'North Africa', 'Private Equity', 'Growth Stage', 28, 'Senior Partner', 'completed', '{"survey_year": "2024", "completed": true}'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440004', 'Delta Capital Management', 'Sarah Jones', 'Central Africa', 'Venture Capital', 'Early Stage', 16, 'Fund Manager', 'completed', '{"survey_year": "2024", "completed": true}'::jsonb)
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
