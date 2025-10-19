-- =====================================================
-- DIAGNOSE AUTH ISSUES - SIMPLE DIAGNOSTIC
-- =====================================================

-- Check 1: Basic auth.users table
SELECT 'AUTH USERS CHECK:' as check_type, COUNT(*) as count FROM auth.users;

-- Check 2: Check for any users
SELECT 'EXISTING USERS:' as check_type, email, created_at FROM auth.users LIMIT 5;

-- Check 3: Check user_roles table
SELECT 'USER ROLES CHECK:' as check_type, COUNT(*) as count FROM public.user_roles;

-- Check 4: Check profiles table  
SELECT 'PROFILES CHECK:' as check_type, COUNT(*) as count FROM public.profiles;

-- Check 5: Check for problematic functions
SELECT 'PROBLEMATIC FUNCTIONS:' as check_type, routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%' 
AND routine_name NOT LIKE 'pg_%';

-- Check 6: Check for triggers on auth.users
SELECT 'TRIGGERS ON AUTH.USERS:' as check_type, trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- Check 7: Check RLS policies
SELECT 'RLS POLICIES:' as check_type, schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_roles', 'profiles');

-- Check 8: Test basic auth query
SELECT 'AUTH QUERY TEST:' as check_type, 
CASE 
  WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN 'SUCCESS'
  ELSE 'FAILED'
END as result;
