-- =====================================================
-- SURVEY DATA UPLOAD TEMPLATE
-- Use this template to upload survey data for all users
-- =====================================================

-- Example for 2024 Survey Data
-- Replace with your actual survey data

-- =====================================================
-- UPLOAD 2024 SURVEY DATA
-- =====================================================
INSERT INTO survey_2024_responses (
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    form_data,
    submission_status,
    completed_at
) VALUES 
-- User 1: sam@mirepaadvisors.com
(
    (SELECT id FROM auth.users WHERE email = 'sam@mirepaadvisors.com'),
    'sam@mirepaadvisors.com',
    'MIREPA Investment Advisors',
    'Fund Manager',
    'MIREPA Investment Fund',
    '{
        "email_address": "sam@mirepaadvisors.com",
        "organisation_name": "MIREPA Investment Advisors",
        "funds_raising_investing": "Fund Manager",
        "fund_name": "MIREPA Investment Fund",
        "participant_name": "Sam Mirepa",
        "role_title": "Managing Partner",
        "geographic_focus": ["East Africa", "West Africa"],
        "investment_vehicle_type": "Private Equity Fund",
        "fund_stage": "Active",
        "current_ftes": 8,
        "thesis": "Focus on growth-stage companies in East and West Africa",
        "ticket_size_min": "$500K",
        "ticket_size_max": "$2M",
        "target_capital": "$50M",
        "sector_focus": ["Technology", "Healthcare", "Financial Services"],
        "legal_domicile": "Mauritius",
        "year_founded": 2020
    }'::jsonb,
    'completed',
    NOW()
),
-- User 2: samuel@saviu.vc
(
    (SELECT id FROM auth.users WHERE email = 'samuel@saviu.vc'),
    'samuel@saviu.vc',
    'Saviu Ventures',
    'Venture Capital',
    'Saviu Fund I',
    '{
        "email_address": "samuel@saviu.vc",
        "organisation_name": "Saviu Ventures",
        "funds_raising_investing": "Venture Capital",
        "fund_name": "Saviu Fund I",
        "participant_name": "Samuel Saviu",
        "role_title": "General Partner",
        "geographic_focus": ["Sub-Saharan Africa"],
        "investment_vehicle_type": "Venture Capital Fund",
        "fund_stage": "Active",
        "current_ftes": 5,
        "thesis": "Early-stage technology investments across Africa",
        "ticket_size_min": "$50K",
        "ticket_size_max": "$500K",
        "target_capital": "$25M",
        "sector_focus": ["Technology", "Fintech", "E-commerce"],
        "legal_domicile": "Kenya",
        "year_founded": 2021
    }'::jsonb,
    'completed',
    NOW()
)
-- Add more users here...
ON CONFLICT (user_id) DO UPDATE SET
    email_address = EXCLUDED.email_address,
    organisation_name = EXCLUDED.organisation_name,
    funds_raising_investing = EXCLUDED.funds_raising_investing,
    fund_name = EXCLUDED.fund_name,
    form_data = EXCLUDED.form_data,
    submission_status = EXCLUDED.submission_status,
    completed_at = EXCLUDED.completed_at,
    updated_at = NOW();

-- =====================================================
-- UPLOAD 2023 SURVEY DATA (if you have it)
-- =====================================================
INSERT INTO survey_2023_responses (
    user_id,
    email_address,
    organisation_name,
    fund_name,
    funds_raising_investing,
    form_data,
    submission_status,
    completed_at
) VALUES 
-- Add your 2023 survey data here...
ON CONFLICT (user_id) DO UPDATE SET
    email_address = EXCLUDED.email_address,
    organisation_name = EXCLUDED.organisation_name,
    fund_name = EXCLUDED.fund_name,
    funds_raising_investing = EXCLUDED.funds_raising_investing,
    form_data = EXCLUDED.form_data,
    submission_status = EXCLUDED.submission_status,
    completed_at = EXCLUDED.completed_at,
    updated_at = NOW();

-- =====================================================
-- UPLOAD 2022 SURVEY DATA (if you have it)
-- =====================================================
INSERT INTO survey_2022_responses (
    user_id,
    email,
    name,
    role_title,
    organisation,
    legal_entity_date,
    form_data,
    submission_status,
    completed_at
) VALUES 
-- Add your 2022 survey data here...
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role_title = EXCLUDED.role_title,
    organisation = EXCLUDED.organisation,
    legal_entity_date = EXCLUDED.legal_entity_date,
    form_data = EXCLUDED.form_data,
    submission_status = EXCLUDED.submission_status,
    completed_at = EXCLUDED.completed_at,
    updated_at = NOW();

-- =====================================================
-- UPLOAD 2021 SURVEY DATA (if you have it)
-- =====================================================
INSERT INTO survey_2021_responses (
    user_id,
    email_address,
    firm_name,
    participant_name,
    role_title,
    fund_stage,
    form_data,
    submission_status,
    completed_at
) VALUES 
-- Add your 2021 survey data here...
ON CONFLICT (user_id) DO UPDATE SET
    email_address = EXCLUDED.email_address,
    firm_name = EXCLUDED.firm_name,
    participant_name = EXCLUDED.participant_name,
    role_title = EXCLUDED.role_title,
    fund_stage = EXCLUDED.fund_stage,
    form_data = EXCLUDED.form_data,
    submission_status = EXCLUDED.submission_status,
    completed_at = EXCLUDED.completed_at,
    updated_at = NOW();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check how many survey responses we have
SELECT 
    '2024 Survey Responses' as survey_year,
    COUNT(*) as total_responses
FROM survey_2024_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2023 Survey Responses' as survey_year,
    COUNT(*) as total_responses
FROM survey_2023_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2022 Survey Responses' as survey_year,
    COUNT(*) as total_responses
FROM survey_2022_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2021 Survey Responses' as survey_year,
    COUNT(*) as total_responses
FROM survey_2021_responses
WHERE submission_status = 'completed';

-- Show sample data
SELECT 
    u.email,
    s.organisation_name,
    s.fund_name,
    s.submission_status,
    s.completed_at
FROM survey_2024_responses s
JOIN auth.users u ON s.user_id = u.id
LIMIT 5;
