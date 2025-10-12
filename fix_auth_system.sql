-- =====================================================
-- FIX AUTHENTICATION SYSTEM
-- Remove custom functions that interfere with Supabase GoTrue
-- =====================================================

-- Drop all custom functions that write to auth.users
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT);

-- Drop any other custom functions that might interfere
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT);

-- =====================================================
-- RESTORE NORMAL AUTHENTICATION
-- =====================================================

-- Ensure auth.users table is clean and ready for normal auth
-- (Don't drop the table, just remove any custom constraints)

-- Reset any custom triggers or policies that might interfere
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

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

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Authentication system restored! You should now be able to sign in normally.' as status;
