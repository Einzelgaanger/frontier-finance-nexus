-- =====================================================
-- FIX RLS POLICIES FOR SURVEY TABLES
-- =====================================================
-- This script fixes RLS policies that might be causing 406 errors
-- =====================================================

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view their own 2022 survey responses." ON survey_2022_responses;
DROP POLICY IF EXISTS "Users can insert their own 2022 survey responses." ON survey_2022_responses;
DROP POLICY IF EXISTS "Users can update their own 2022 survey responses." ON survey_2022_responses;

DROP POLICY IF EXISTS "Users can view their own 2023 survey responses." ON survey_2023_responses;
DROP POLICY IF EXISTS "Users can insert their own 2023 survey responses." ON survey_2023_responses;
DROP POLICY IF EXISTS "Users can update their own 2023 survey responses." ON survey_2023_responses;

DROP POLICY IF EXISTS "Users can view their own 2024 survey responses." ON survey_2024_responses;
DROP POLICY IF EXISTS "Users can insert their own 2024 survey responses." ON survey_2024_responses;
DROP POLICY IF EXISTS "Users can update their own 2024 survey responses." ON survey_2024_responses;

-- Recreate policies for survey_2022_responses
CREATE POLICY "Users can view their own 2022 survey responses."
ON survey_2022_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 survey responses."
ON survey_2022_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 survey responses."
ON survey_2022_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Recreate policies for survey_2023_responses
CREATE POLICY "Users can view their own 2023 survey responses."
ON survey_2023_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 survey responses."
ON survey_2023_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 survey responses."
ON survey_2023_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Recreate policies for survey_2024_responses
CREATE POLICY "Users can view their own 2024 survey responses."
ON survey_2024_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 survey responses."
ON survey_2024_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 survey responses."
ON survey_2024_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Test the policies
SELECT 'RLS policies recreated successfully' as status;
