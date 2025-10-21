-- ============================================
-- MIGRATION STEP 1: CREATE USER ACCOUNTS
-- ============================================
-- This script helps create user accounts for survey respondents
-- who don't already have accounts in your system.
--
-- IMPORTANT: This script creates entries in the public tables only.
-- You MUST use Supabase Admin API or Edge Functions to create auth.users entries.
-- ============================================

-- ============================================
-- Option A: If users already exist in auth.users
-- ============================================
-- Skip this section and go to Option B

-- ============================================
-- Option B: Create profiles and roles for existing auth users
-- ============================================
-- Use this if auth.users entries exist but profiles/roles are missing

DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Loop through all auth users that don't have profiles
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Create profile
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
      COALESCE(user_record.raw_user_meta_data->>'last_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Create user role (default to member for survey respondents)
    INSERT INTO public.user_roles (user_id, email, role)
    VALUES (
      user_record.id,
      user_record.email,
      'member'  -- Change to 'viewer' if needed
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Created profile and role for user: %', user_record.email;
  END LOOP;
END $$;

-- ============================================
-- Option C: Manual user list insertion
-- ============================================
-- Use this template if you have a list of emails and need to create entries
-- NOTE: You still need to create auth.users entries via Supabase Admin API first!

-- Template for manual insertion (uncomment and modify):
/*
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- User 1
  v_email := 'user1@example.com';
  v_first_name := 'John';
  v_last_name := 'Doe';
  
  -- Get user_id from auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NOT NULL THEN
    -- Create profile
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (v_user_id, v_email, v_first_name, v_last_name)
    ON CONFLICT (id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;
    
    -- Create role
    INSERT INTO public.user_roles (user_id, email, role)
    VALUES (v_user_id, v_email, 'member')
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Created profile for: %', v_email;
  ELSE
    RAISE WARNING 'User not found in auth.users: %', v_email;
  END IF;
  
  -- Repeat for User 2, 3, etc.
  -- ...
  
END $$;
*/

-- ============================================
-- Verification: Check created users
-- ============================================

SELECT 
  u.email,
  p.first_name,
  p.last_name,
  ur.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 20;

-- ============================================
-- Helper: Get user_id from email
-- ============================================
-- Use this query to look up user IDs when importing survey data

/*
SELECT id, email FROM auth.users WHERE email IN (
  'user1@example.com',
  'user2@example.com',
  'user3@example.com'
);
*/

-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- 1. You CANNOT create auth.users entries via SQL directly
-- 2. Use Supabase Admin API or create-user Edge Function
-- 3. After creating auth.users, run this script to create profiles/roles
-- 4. Default password should be sent to users for reset
-- 5. Consider using invitation codes for new users
