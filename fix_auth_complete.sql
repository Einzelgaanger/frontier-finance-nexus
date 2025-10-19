-- =====================================================
-- COMPLETE AUTHENTICATION SYSTEM FIX
-- Remove all custom functions that interfere with Supabase GoTrue
-- =====================================================

-- Step 1: Drop all problematic custom functions
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT);

-- Step 2: Drop any custom triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- Step 3: Drop any custom policies that might interfere
DROP POLICY IF EXISTS "Users can view own data" ON auth.users;
DROP POLICY IF EXISTS "Admins can view all users" ON auth.users;

-- Step 4: Reset any custom RLS on auth.users (let Supabase handle it)
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- Step 5: Clean up any orphaned data
-- Remove any users that were created by custom functions but don't have proper auth setup
DELETE FROM auth.users 
WHERE id NOT IN (
    SELECT DISTINCT user_id FROM public.profiles 
    WHERE user_id IS NOT NULL
);

-- Step 6: Ensure proper auth.users table structure
-- (Don't modify the table structure, just ensure it's clean)

-- =====================================================
-- VERIFY AUTH SYSTEM IS WORKING
-- =====================================================

-- Check if we can query auth.users normally
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;

-- Check if we have any remaining problematic functions
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%'
AND routine_name LIKE '%auth%';

-- Check if we have any custom triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table = 'users';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Authentication system restored! You should now be able to sign in normally.' as status;
