-- =====================================================
-- DELETE 2021 SURVEY TABLE ONLY
-- This script removes only the 2021 survey table and its associated objects
-- User profiles and other survey years remain intact
-- =====================================================

-- Drop RLS policies for 2021 survey
DROP POLICY IF EXISTS "Users can view own 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Users can insert own 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Users can update own 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Users can delete own 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Admins can view all 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Admins can update all 2021 surveys" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Admins can delete all 2021 surveys" ON public.survey_responses_2021;

-- Drop trigger for 2021 survey
DROP TRIGGER IF EXISTS update_survey_2021_updated_at ON public.survey_responses_2021;

-- Drop indexes for 2021 survey
DROP INDEX IF EXISTS public.idx_survey_2021_user_id;
DROP INDEX IF EXISTS public.idx_survey_2021_company_name;
DROP INDEX IF EXISTS public.idx_survey_2021_email;
DROP INDEX IF EXISTS public.idx_survey_2021_firm_name;
DROP INDEX IF EXISTS public.idx_survey_2021_completed_at;
DROP INDEX IF EXISTS public.idx_survey_2021_timestamp;

-- Drop the 2021 survey table
DROP TABLE IF EXISTS public.survey_responses_2021 CASCADE;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2021 Survey Table Deleted Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Deleted:';
    RAISE NOTICE '  ✓ survey_responses_2021 table';
    RAISE NOTICE '  ✓ All RLS policies for 2021';
    RAISE NOTICE '  ✓ All indexes for 2021';
    RAISE NOTICE '  ✓ All triggers for 2021';
    RAISE NOTICE '';
    RAISE NOTICE 'Preserved:';
    RAISE NOTICE '  ✓ user_profiles table';
    RAISE NOTICE '  ✓ Other survey year tables (2022, 2023, 2024)';
    RAISE NOTICE '  ✓ Helper functions';
    RAISE NOTICE '========================================';
END $$;
