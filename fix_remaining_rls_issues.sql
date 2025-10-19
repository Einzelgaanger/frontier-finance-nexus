-- Fix Remaining RLS Issues
-- This script addresses the remaining RLS policies that cause authentication issues

BEGIN;

-- 1. DISABLE RLS ON ALL TABLES THAT MIGHT CAUSE AUTH ISSUES
-- Temporarily disable RLS on all tables with problematic policies
ALTER TABLE public.member_surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_field_visibility DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL PROBLEMATIC POLICIES
-- Drop policies that use get_user_role during authentication
DROP POLICY IF EXISTS "Admins can manage all member surveys" ON public.member_surveys;
DROP POLICY IF EXISTS "Admins can view all 2021 survey responses" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Admins can view all 2022 survey responses" ON public.survey_responses_2022;
DROP POLICY IF EXISTS "Admins can view all 2023 survey responses" ON public.survey_responses_2023;
DROP POLICY IF EXISTS "Admins can view all 2024 survey responses" ON public.survey_responses_2024;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.membership_requests;
DROP POLICY IF EXISTS "Admins can manage invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Admins can view all responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Members can view member responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Admins can manage field visibility" ON public.data_field_visibility;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.activity_logs;

-- 3. CREATE SIMPLER POLICIES THAT DON'T CAUSE AUTH ISSUES
-- Member surveys - simple policies
CREATE POLICY "Users can view all member surveys" 
  ON public.member_surveys 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage own member survey" 
  ON public.member_surveys 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Membership requests - simple policies
CREATE POLICY "Users can view own requests" 
  ON public.membership_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests" 
  ON public.membership_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Invitation codes - simple policies
CREATE POLICY "Users can view codes to redeem" 
  ON public.invitation_codes 
  FOR SELECT 
  USING (used_by IS NULL AND expires_at > NOW());

-- Data field visibility - simple policies
CREATE POLICY "Everyone can view field visibility" 
  ON public.data_field_visibility 
  FOR SELECT 
  USING (true);

-- Activity logs - simple policies
CREATE POLICY "System can insert logs" 
  ON public.activity_logs 
  FOR INSERT 
  WITH CHECK (true);

-- 4. RE-ENABLE RLS ON ALL TABLES
ALTER TABLE public.member_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_field_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. CREATE A SAFER get_user_role FUNCTION
-- This function handles cases where the user might not be authenticated yet
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  -- Return 'viewer' if user is not authenticated or doesn't have a role
  IF user_uuid IS NULL THEN
    RETURN 'viewer';
  END IF;
  
  -- Get role from user_roles table, default to 'viewer' if not found
  RETURN COALESCE(
    (SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1),
    'viewer'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return 'viewer' if any error occurs
    RETURN 'viewer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. UPDATE THE ORIGINAL get_user_role FUNCTION TO BE SAFER
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  -- Return 'viewer' if user is not authenticated or doesn't have a role
  IF user_uuid IS NULL THEN
    RETURN 'viewer';
  END IF;
  
  -- Get role from user_roles table, default to 'viewer' if not found
  RETURN COALESCE(
    (SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1),
    'viewer'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return 'viewer' if any error occurs
    RETURN 'viewer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. VERIFY THE FIX
-- Check that all users have roles and the function works
SELECT 
  'User roles check' as test_name,
  COUNT(*) as total_users,
  COUNT(ur.role) as users_with_roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- Test the get_user_role function
SELECT 
  'Function test' as test_name,
  public.get_user_role(NULL) as null_user_role,
  public.get_user_role('00000000-0000-0000-0000-000000000000') as invalid_user_role;

COMMIT;
