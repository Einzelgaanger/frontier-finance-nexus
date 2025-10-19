-- Simple fix for RLS policies - no snippets needed
-- Just run this directly in Supabase SQL editor

-- Drop and recreate policies for survey_2023_responses
DROP POLICY IF EXISTS "Users can view their own 2023 survey responses." ON survey_2023_responses;
DROP POLICY IF EXISTS "Users can insert their own 2023 survey responses." ON survey_2023_responses;
DROP POLICY IF EXISTS "Users can update their own 2023 survey responses." ON survey_2023_responses;

-- Recreate policies
CREATE POLICY "Users can view their own 2023 survey responses."
ON survey_2023_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 survey responses."
ON survey_2023_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 survey responses."
ON survey_2023_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Test the fix
SELECT 'RLS policies fixed for survey_2023_responses' as status;
