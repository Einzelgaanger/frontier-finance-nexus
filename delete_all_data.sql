-- ============================================
-- DELETE ALL DATA FROM DATABASE
-- This script removes all data while preserving table structures
-- ============================================
-- WARNING: This action is irreversible!
-- Make sure you have a backup before running this script.
-- ============================================

-- Disable triggers temporarily to avoid cascading issues
SET session_replication_role = 'replica';

-- Delete all data from tables (order matters due to foreign key constraints)
-- Start with tables that reference others

-- 1. Delete activity logs (references users)
TRUNCATE TABLE public.activity_logs CASCADE;

-- 2. Delete all survey-related tables
-- 2021 Survey tables
TRUNCATE TABLE public.survey_2021_business_model_targeted CASCADE;
TRUNCATE TABLE public.survey_2021_business_stage_targeted CASCADE;
TRUNCATE TABLE public.survey_2021_covid_government_support CASCADE;
TRUNCATE TABLE public.survey_2021_explicit_lens_focus CASCADE;
TRUNCATE TABLE public.survey_2021_financing_needs CASCADE;
TRUNCATE TABLE public.survey_2021_fund_vehicle_considerations CASCADE;
TRUNCATE TABLE public.survey_2021_gender_considerations_investment CASCADE;
TRUNCATE TABLE public.survey_2021_gender_considerations_requirement CASCADE;
TRUNCATE TABLE public.survey_2021_gender_fund_vehicle CASCADE;
TRUNCATE TABLE public.survey_2021_geographic_focus CASCADE;
TRUNCATE TABLE public.survey_2021_investment_forms CASCADE;
TRUNCATE TABLE public.survey_2021_investment_monetization CASCADE;
TRUNCATE TABLE public.survey_2021_investment_vehicle_type CASCADE;
TRUNCATE TABLE public.survey_2021_present_demystifying_session CASCADE;
TRUNCATE TABLE public.survey_2021_raising_capital_2021 CASCADE;
TRUNCATE TABLE public.survey_2021_target_capital_sources CASCADE;
TRUNCATE TABLE public.survey_2021_target_sectors CASCADE;
TRUNCATE TABLE public.survey_2021_team_based CASCADE;
TRUNCATE TABLE public.survey_2021_responses CASCADE;

-- 2022 Survey tables
TRUNCATE TABLE public.survey_2022_concessionary_capital CASCADE;
TRUNCATE TABLE public.survey_2022_enterprise_types CASCADE;
TRUNCATE TABLE public.survey_2022_gender_orientation CASCADE;
TRUNCATE TABLE public.survey_2022_geographic_markets CASCADE;
TRUNCATE TABLE public.survey_2022_investment_monetization_exit_forms CASCADE;
TRUNCATE TABLE public.survey_2022_team_based CASCADE;
TRUNCATE TABLE public.survey_2022_responses CASCADE;

-- 2023 Survey tables
TRUNCATE TABLE public.survey_2023_business_development_approach CASCADE;
TRUNCATE TABLE public.survey_2023_concessionary_capital CASCADE;
TRUNCATE TABLE public.survey_2023_exit_form CASCADE;
TRUNCATE TABLE public.survey_2023_future_research_data CASCADE;
TRUNCATE TABLE public.survey_2023_gender_inclusion CASCADE;
TRUNCATE TABLE public.survey_2023_geographic_markets CASCADE;
TRUNCATE TABLE public.survey_2023_gp_financial_commitment CASCADE;
TRUNCATE TABLE public.survey_2023_legal_domicile CASCADE;
TRUNCATE TABLE public.survey_2023_sustainable_development_goals CASCADE;
TRUNCATE TABLE public.survey_2023_team_based CASCADE;
TRUNCATE TABLE public.survey_2023_responses CASCADE;

-- 2024 Survey tables
TRUNCATE TABLE public.survey_2024_business_development_approach CASCADE;
TRUNCATE TABLE public.survey_2024_concessionary_capital CASCADE;
TRUNCATE TABLE public.survey_2024_data_sharing_willingness CASCADE;
TRUNCATE TABLE public.survey_2024_domicile_reason CASCADE;
TRUNCATE TABLE public.survey_2024_gender_inclusion CASCADE;
TRUNCATE TABLE public.survey_2024_geographic_markets CASCADE;
TRUNCATE TABLE public.survey_2024_gp_financial_commitment CASCADE;
TRUNCATE TABLE public.survey_2024_investment_approval CASCADE;
TRUNCATE TABLE public.survey_2024_investment_monetisation_forms CASCADE;
TRUNCATE TABLE public.survey_2024_investment_networks CASCADE;
TRUNCATE TABLE public.survey_2024_legal_domicile CASCADE;
TRUNCATE TABLE public.survey_2024_team_based CASCADE;
TRUNCATE TABLE public.survey_2024_responses CASCADE;

-- 3. Delete member surveys (references users)
TRUNCATE TABLE public.member_surveys CASCADE;

-- 4. Delete applications (references users)
TRUNCATE TABLE public.applications CASCADE;

-- 5. Delete membership requests (references users)
TRUNCATE TABLE public.membership_requests CASCADE;

-- 6. Delete invitation codes (references users)
TRUNCATE TABLE public.invitation_codes CASCADE;

-- 7. Delete user-related tables
TRUNCATE TABLE public.user_roles CASCADE;
TRUNCATE TABLE public.user_profiles CASCADE;
TRUNCATE TABLE public.network_users CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 8. Delete backup table
TRUNCATE TABLE public.user_backup CASCADE;

-- 9. Delete data field visibility (standalone table)
TRUNCATE TABLE public.data_field_visibility CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- ============================================
-- RESTORE COMPREHENSIVE DATA FIELD VISIBILITY SETTINGS
-- ============================================
-- NOTE: For complete visibility settings covering ALL survey years (2021-2024),
-- run the separate file: insert_comprehensive_field_visibility.sql
-- 
-- This section only restores basic member_surveys visibility settings.
-- For production use, execute the comprehensive script instead.
-- ============================================

INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Member Surveys - Public fields
('fund_name', 'public'),
('website', 'public'),
('fund_type', 'public'),
('primary_investment_region', 'public'),
('year_founded', 'public'),
('team_size', 'public'),
('sector_focus', 'public'),
('stage_focus', 'public'),
('fund_structure', 'public'),
('regulatory_jurisdiction', 'public'),
('current_fund_status', 'public'),
('secondary_regions', 'public'),
('investment_instruments', 'public'),
('legal_entity_name', 'public'),
('social_media_links', 'public'),
('role_badge', 'public'),

-- Member Surveys - Member-visible fields
('typical_check_size', 'member'),
('aum', 'member'),
('investment_thesis', 'member'),
('fundraising_target', 'member'),
('amount_raised_to_date', 'member'),
('number_of_investments', 'member'),
('regional_allocation', 'member'),
('typical_ownership_sought', 'member'),
('value_add_services', 'member'),
('notable_exits', 'member'),
('key_team_members', 'member'),
('diversity_metrics', 'member'),

-- Member Surveys - Admin-only fields
('contact_information', 'admin'),
('historical_returns', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- IMPORTANT: Survey-Specific Visibility
-- ============================================
-- The above only covers member_surveys table.
-- For survey_responses_2021, survey_responses_2022, survey_responses_2023, 
-- and survey_responses_2024 field visibility, run:
--   insert_comprehensive_field_visibility.sql
-- 
-- That script defines visibility for 300+ fields across all survey years.

-- ============================================
-- Verification: Check row counts
-- ============================================

SELECT 'activity_logs' as table_name, COUNT(*) as row_count FROM public.activity_logs
UNION ALL
SELECT 'applications', COUNT(*) FROM public.applications
UNION ALL
SELECT 'data_field_visibility', COUNT(*) FROM public.data_field_visibility
UNION ALL
SELECT 'invitation_codes', COUNT(*) FROM public.invitation_codes
UNION ALL
SELECT 'member_surveys', COUNT(*) FROM public.member_surveys
UNION ALL
SELECT 'membership_requests', COUNT(*) FROM public.membership_requests
UNION ALL
SELECT 'network_users', COUNT(*) FROM public.network_users
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'user_backup', COUNT(*) FROM public.user_backup
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM public.user_profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM public.user_roles
UNION ALL
SELECT 'survey_2021_responses', COUNT(*) FROM public.survey_2021_responses
UNION ALL
SELECT 'survey_2022_responses', COUNT(*) FROM public.survey_2022_responses
UNION ALL
SELECT 'survey_2023_responses', COUNT(*) FROM public.survey_2023_responses
UNION ALL
SELECT 'survey_2024_responses', COUNT(*) FROM public.survey_2024_responses
ORDER BY table_name;
