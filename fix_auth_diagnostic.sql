-- =====================================================
-- COMPREHENSIVE AUTH DIAGNOSTIC AND FIX
-- Find and remove ALL functions that might interfere with auth
-- =====================================================

-- Step 1: Find ALL custom functions that might interfere
SELECT 
    'PROBLEMATIC FUNCTIONS FOUND:' as status,
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (
    routine_name LIKE '%user%' OR
    routine_name LIKE '%auth%' OR
    routine_name LIKE '%create%' OR
    routine_name LIKE '%admin%'
);

-- Step 2: Find ALL triggers that might interfere
SELECT 
    'PROBLEMATIC TRIGGERS FOUND:' as status,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND (
    trigger_name LIKE '%user%' OR
    trigger_name LIKE '%auth%' OR
    trigger_name LIKE '%create%'
);

-- Step 3: Find ALL policies that might interfere
SELECT 
    'PROBLEMATIC POLICIES FOUND:' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND (
    policyname LIKE '%user%' OR
    policyname LIKE '%auth%' OR
    tablename LIKE '%user%' OR
    tablename LIKE '%auth%'
);

-- Step 4: Drop ALL potentially problematic functions
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT, TEXT);

-- Step 5: Drop ALL potentially problematic triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_updated ON public.profiles;
DROP TRIGGER IF EXISTS handle_new_user ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON public.user_roles;
DROP TRIGGER IF EXISTS on_auth_user_updated ON public.user_roles;
DROP TRIGGER IF EXISTS handle_new_user ON public.user_roles;

-- Step 6: Check for any remaining problematic functions
SELECT 
    'REMAINING FUNCTIONS AFTER CLEANUP:' as status,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (
    routine_name LIKE '%user%' OR
    routine_name LIKE '%auth%' OR
    routine_name LIKE '%create%' OR
    routine_name LIKE '%admin%'
);

-- Step 7: Check auth system accessibility
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;

-- Step 8: Test if we can query user_roles
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;

-- Step 9: Test if we can query profiles
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Diagnostic complete! Check the results above for any remaining issues.' as status;
