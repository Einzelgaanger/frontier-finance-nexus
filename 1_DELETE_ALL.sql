-- =====================================================
-- COMPLETE DATABASE CLEANUP SCRIPT
-- This script will delete ALL data and tables
-- USE WITH EXTREME CAUTION - THIS CANNOT BE UNDONE
-- =====================================================

-- Step 1: Drop all 2024 survey-related tables
DROP TABLE IF EXISTS public.survey_2024_business_development_approach CASCADE;
DROP TABLE IF EXISTS public.survey_2024_concessionary_capital CASCADE;
DROP TABLE IF EXISTS public.survey_2024_data_sharing_willingness CASCADE;
DROP TABLE IF EXISTS public.survey_2024_domicile_reason CASCADE;
DROP TABLE IF EXISTS public.survey_2024_gender_inclusion CASCADE;
DROP TABLE IF EXISTS public.survey_2024_geographic_markets CASCADE;
DROP TABLE IF EXISTS public.survey_2024_gp_financial_commitment CASCADE;
DROP TABLE IF EXISTS public.survey_2024_investment_approval CASCADE;
DROP TABLE IF EXISTS public.survey_2024_investment_monetisation_forms CASCADE;
DROP TABLE IF EXISTS public.survey_2024_investment_networks CASCADE;
DROP TABLE IF EXISTS public.survey_2024_legal_domicile CASCADE;
DROP TABLE IF EXISTS public.survey_2024_team_based CASCADE;
DROP TABLE IF EXISTS public.survey_2024_responses CASCADE;

-- Step 2: Drop all 2023 survey-related tables
DROP TABLE IF EXISTS public.survey_2023_business_development_approach CASCADE;
DROP TABLE IF EXISTS public.survey_2023_concessionary_capital CASCADE;
DROP TABLE IF EXISTS public.survey_2023_exit_form CASCADE;
DROP TABLE IF EXISTS public.survey_2023_future_research_data CASCADE;
DROP TABLE IF EXISTS public.survey_2023_gender_inclusion CASCADE;
DROP TABLE IF EXISTS public.survey_2023_geographic_markets CASCADE;
DROP TABLE IF EXISTS public.survey_2023_gp_financial_commitment CASCADE;
DROP TABLE IF EXISTS public.survey_2023_legal_domicile CASCADE;
DROP TABLE IF EXISTS public.survey_2023_sustainable_development_goals CASCADE;
DROP TABLE IF EXISTS public.survey_2023_team_based CASCADE;
DROP TABLE IF EXISTS public.survey_2023_responses CASCADE;

-- Step 3: Drop all 2022 survey-related tables
DROP TABLE IF EXISTS public.survey_2022_concessionary_capital CASCADE;
DROP TABLE IF EXISTS public.survey_2022_enterprise_types CASCADE;
DROP TABLE IF EXISTS public.survey_2022_gender_orientation CASCADE;
DROP TABLE IF EXISTS public.survey_2022_geographic_markets CASCADE;
DROP TABLE IF EXISTS public.survey_2022_investment_monetization_exit_forms CASCADE;
DROP TABLE IF EXISTS public.survey_2022_team_based CASCADE;
DROP TABLE IF EXISTS public.survey_2022_responses CASCADE;

-- Step 4: Drop all 2021 survey-related tables
DROP TABLE IF EXISTS public.survey_2021_business_model_targeted CASCADE;
DROP TABLE IF EXISTS public.survey_2021_business_stage_targeted CASCADE;
DROP TABLE IF EXISTS public.survey_2021_covid_government_support CASCADE;
DROP TABLE IF EXISTS public.survey_2021_explicit_lens_focus CASCADE;
DROP TABLE IF EXISTS public.survey_2021_financing_needs CASCADE;
DROP TABLE IF EXISTS public.survey_2021_fund_vehicle_considerations CASCADE;
DROP TABLE IF EXISTS public.survey_2021_gender_considerations_investment CASCADE;
DROP TABLE IF EXISTS public.survey_2021_gender_considerations_requirement CASCADE;
DROP TABLE IF EXISTS public.survey_2021_gender_fund_vehicle CASCADE;
DROP TABLE IF EXISTS public.survey_2021_geographic_focus CASCADE;
DROP TABLE IF EXISTS public.survey_2021_investment_forms CASCADE;
DROP TABLE IF EXISTS public.survey_2021_investment_monetization CASCADE;
DROP TABLE IF EXISTS public.survey_2021_investment_vehicle_type CASCADE;
DROP TABLE IF EXISTS public.survey_2021_present_demystifying_session CASCADE;
DROP TABLE IF EXISTS public.survey_2021_raising_capital_2021 CASCADE;
DROP TABLE IF EXISTS public.survey_2021_target_capital_sources CASCADE;
DROP TABLE IF EXISTS public.survey_2021_target_sectors CASCADE;
DROP TABLE IF EXISTS public.survey_2021_team_based CASCADE;
DROP TABLE IF EXISTS public.survey_2021_responses CASCADE;

-- Step 5: Drop policies first, then generic survey tables
DO $$ 
BEGIN
    -- Drop 2021 policies
    DROP POLICY IF EXISTS "Users can view own 2021 surveys" ON public.survey_responses_2021;
    DROP POLICY IF EXISTS "Users can insert own 2021 surveys" ON public.survey_responses_2021;
    DROP POLICY IF EXISTS "Users can update own 2021 surveys" ON public.survey_responses_2021;
    DROP POLICY IF EXISTS "Admins and members can view all 2021 surveys" ON public.survey_responses_2021;
EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
END $$;

DROP TABLE IF EXISTS public.survey_responses_2024 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2023 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2022 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2021 CASCADE;
DROP TABLE IF EXISTS public.survey_responses CASCADE;
DROP TABLE IF EXISTS public.member_surveys CASCADE;

-- Step 6: Drop membership and application tables
DROP TABLE IF EXISTS public.membership_requests CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.invitation_codes CASCADE;

-- Step 7: Drop field visibility tables
DROP TABLE IF EXISTS public.field_visibility CASCADE;
DROP TABLE IF EXISTS public.comprehensive_field_visibility CASCADE;
DROP TABLE IF EXISTS public.data_field_visibility CASCADE;

-- Step 8: Drop user-related tables
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.network_users CASCADE;
DROP TABLE IF EXISTS public.user_backup CASCADE;

-- Step 9: Drop activity logs
DROP TABLE IF EXISTS public.activity_logs CASCADE;

-- Step 10: Drop any remaining functions
DROP FUNCTION IF EXISTS public.get_viewer_survey_data CASCADE;
DROP FUNCTION IF EXISTS public.create_user_with_role CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;

-- Step 11: Drop any triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Step 12: Clean up auth.users table (Supabase managed, but we can delete data)
-- WARNING: This will delete all user accounts
DELETE FROM auth.users;

-- Verify cleanup
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database cleanup completed successfully';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Remaining tables in public schema: %', table_count;
    RAISE NOTICE 'All survey tables have been removed';
    RAISE NOTICE 'All user data has been removed';
    RAISE NOTICE 'All functions and triggers have been removed';
    RAISE NOTICE '========================================';
END $$;
