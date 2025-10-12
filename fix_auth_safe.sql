-- =====================================================
-- SAFE AUTHENTICATION SYSTEM FIX
-- Remove only the problematic custom functions (no table modifications)
-- =====================================================

-- Step 1: Drop all problematic custom functions that write to auth.users
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT);

-- Step 2: Drop any custom triggers on public tables (not auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_updated ON public.profiles;
DROP TRIGGER IF EXISTS handle_new_user ON public.profiles;

-- Step 3: Check if we have any remaining problematic functions
SELECT 
    'Remaining functions that might interfere:' as status,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%'
AND routine_name LIKE '%auth%';

-- Step 4: Check if we have any custom triggers
SELECT 
    'Custom triggers found:' as status,
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('profiles', 'user_roles');

-- Step 5: Verify auth system is accessible
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Custom functions removed! Authentication should work normally now.' as status;
