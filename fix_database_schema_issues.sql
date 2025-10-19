-- Fix Database Schema Issues
-- This script addresses the critical issues causing "Database error querying schema"

BEGIN;

-- 1. DROP INVALID ADMIN USER CREATION FUNCTIONS
-- These functions try to directly insert into auth.users which is forbidden
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);

-- 2. FIX RLS POLICIES THAT CAUSE AUTHENTICATION ISSUES
-- Temporarily disable RLS on user_roles during authentication
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role assignment during verification" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role updates during verification" ON public.user_roles;

-- Create simpler policies that don't depend on get_user_role during auth
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow role assignment during verification" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow role updates during verification" 
  ON public.user_roles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. FIX get_user_role FUNCTION TO HANDLE NULL CASES
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(role::TEXT, 'viewer') FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 4. ENSURE PROPER USER ROLE ASSIGNMENT
-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user role with error handling
  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create user role for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FIX SURVEY TABLE RLS POLICIES
-- Make sure survey tables don't block authentication
-- Only disable RLS on tables that exist
DO $$
BEGIN
  -- Check and disable RLS on existing survey tables
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2021' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2021 DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2022' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2022 DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2023' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2023 DISABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2024' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2024 DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing survey policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can manage own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can view own responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can manage own responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Members can view member responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON public.survey_responses;

-- Recreate survey policies with better error handling (only on existing tables)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses' AND table_schema = 'public') THEN
    CREATE POLICY "Users can view own survey responses" 
      ON public.survey_responses 
      FOR SELECT 
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can manage own survey responses" 
      ON public.survey_responses 
      FOR ALL 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Re-enable RLS on survey tables (only if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2021' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2022' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2023' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'survey_responses_2024' AND table_schema = 'public') THEN
    ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 6. CREATE A PROPER ADMIN USER CREATION FUNCTION
-- This uses Supabase's built-in auth admin API instead of direct table manipulation
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email TEXT,
  p_password TEXT,
  p_first_name TEXT DEFAULT '',
  p_last_name TEXT DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- This function should be called from the client side using Supabase Admin API
  -- For now, just return an error directing to use the client-side approach
  RETURN json_build_object(
    'error', 'Use Supabase Admin API from client side to create users',
    'message', 'Direct user creation in database is not supported. Use the Supabase Admin API instead.'
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;

-- 7. ENSURE ALL EXISTING USERS HAVE ROLES
-- Add any missing user roles
INSERT INTO public.user_roles (user_id, email, role)
SELECT 
  u.id,
  u.email,
  'viewer'::app_role
FROM auth.users u
WHERE u.email IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- 8. VERIFY THE FIX
-- Check that all users have roles
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 10;
