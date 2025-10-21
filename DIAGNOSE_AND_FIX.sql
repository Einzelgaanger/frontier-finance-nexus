-- ============================================================================
-- DIAGNOSE AND FIX SURVEY DATA ACCESS
-- ============================================================================

-- STEP 1: Check if data exists (run as service_role or postgres user)
SELECT 'Step 1: Checking data...' as step;
SELECT COUNT(*) as total_rows FROM public.survey_responses_2024;
SELECT COUNT(*) as total_rows_2023 FROM public.survey_responses_2023;
SELECT COUNT(*) as total_rows_2022 FROM public.survey_responses_2022;
SELECT COUNT(*) as total_rows_2021 FROM public.survey_responses_2021;

-- STEP 2: Check RLS status
SELECT 'Step 2: Checking RLS status...' as step;
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename LIKE 'survey_responses_%'
ORDER BY tablename;

-- STEP 3: Check existing policies
SELECT 'Step 3: Checking existing policies...' as step;
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename LIKE 'survey_responses_%'
ORDER BY tablename, policyname;

-- STEP 4: Drop all existing SELECT policies for survey_responses tables
SELECT 'Step 4: Dropping old policies...' as step;

-- 2021
DROP POLICY IF EXISTS "Users can view their own 2021 survey responses" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Admins can view all 2021 survey responses" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Members and viewers can view all 2021 responses" ON public.survey_responses_2021;

-- 2022
DROP POLICY IF EXISTS "Users can view their own 2022 survey responses" ON public.survey_responses_2022;
DROP POLICY IF EXISTS "Admins can view all 2022 survey responses" ON public.survey_responses_2022;
DROP POLICY IF EXISTS "Members and viewers can view all 2022 responses" ON public.survey_responses_2022;

-- 2023
DROP POLICY IF EXISTS "Users can view their own 2023 survey responses" ON public.survey_responses_2023;
DROP POLICY IF EXISTS "Admins can view all 2023 survey responses" ON public.survey_responses_2023;
DROP POLICY IF EXISTS "Members and viewers can view all 2023 responses" ON public.survey_responses_2023;

-- 2024
DROP POLICY IF EXISTS "Users can view their own 2024 survey responses" ON public.survey_responses_2024;
DROP POLICY IF EXISTS "Admins can view all 2024 survey responses" ON public.survey_responses_2024;
DROP POLICY IF EXISTS "Members and viewers can view all 2024 responses" ON public.survey_responses_2024;

-- STEP 5: Create simple permissive policies
SELECT 'Step 5: Creating new permissive policies...' as step;

-- 2021
CREATE POLICY "Allow authenticated users to view 2021 responses" 
  ON public.survey_responses_2021
  FOR SELECT 
  TO authenticated
  USING (true);

-- 2022
CREATE POLICY "Allow authenticated users to view 2022 responses" 
  ON public.survey_responses_2022
  FOR SELECT 
  TO authenticated
  USING (true);

-- 2023
CREATE POLICY "Allow authenticated users to view 2023 responses" 
  ON public.survey_responses_2023
  FOR SELECT 
  TO authenticated
  USING (true);

-- 2024
CREATE POLICY "Allow authenticated users to view 2024 responses" 
  ON public.survey_responses_2024
  FOR SELECT 
  TO authenticated
  USING (true);

-- STEP 6: Verify new policies
SELECT 'Step 6: Verifying new policies...' as step;
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename LIKE 'survey_responses_%'
  AND cmd = 'SELECT'
ORDER BY tablename;

SELECT 'DONE! All authenticated users can now view survey responses.' as status;
