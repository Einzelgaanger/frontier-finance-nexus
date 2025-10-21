-- Allow viewers and members to see all survey responses
-- This enables the Network page to show all participants

-- Drop existing restrictive policies and create new ones for all survey tables

-- Survey Responses 2021
DROP POLICY IF EXISTS "Members and viewers can view all 2021 responses" ON public.survey_responses_2021;
CREATE POLICY "Members and viewers can view all 2021 responses" 
  ON public.survey_responses_2021
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'member', 'viewer')
  );

-- Survey Responses 2022
DROP POLICY IF EXISTS "Members and viewers can view all 2022 responses" ON public.survey_responses_2022;
CREATE POLICY "Members and viewers can view all 2022 responses" 
  ON public.survey_responses_2022
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'member', 'viewer')
  );

-- Survey Responses 2023
DROP POLICY IF EXISTS "Members and viewers can view all 2023 responses" ON public.survey_responses_2023;
CREATE POLICY "Members and viewers can view all 2023 responses" 
  ON public.survey_responses_2023
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'member', 'viewer')
  );

-- Survey Responses 2024
DROP POLICY IF EXISTS "Members and viewers can view all 2024 responses" ON public.survey_responses_2024;
CREATE POLICY "Members and viewers can view all 2024 responses" 
  ON public.survey_responses_2024
  FOR SELECT 
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'member', 'viewer')
  );

-- Note: Users can still only INSERT/UPDATE their own responses
-- The existing policies for INSERT and UPDATE remain unchanged
