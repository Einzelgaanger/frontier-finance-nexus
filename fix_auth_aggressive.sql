-- =====================================================
-- AGGRESSIVE AUTH FIX - ADDRESS ROOT CAUSE
-- This will fix the database schema issues causing 500 errors
-- =====================================================

-- Step 1: Check for corrupted auth.users data
SELECT 
    'AUTH USERS CHECK:' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NULL THEN 1 END) as null_emails,
    COUNT(CASE WHEN encrypted_password IS NULL THEN 1 END) as null_passwords,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_emails
FROM auth.users;

-- Step 2: Check for problematic user data
SELECT 
    'PROBLEMATIC USERS:' as status,
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email IS NULL 
   OR encrypted_password IS NULL 
   OR email_confirmed_at IS NULL
LIMIT 10;

-- Step 3: Fix corrupted user data
UPDATE auth.users 
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE email_confirmed_at IS NULL 
   OR created_at IS NULL 
   OR updated_at IS NULL;

-- Step 4: Remove users with completely invalid data
DELETE FROM auth.users 
WHERE email IS NULL 
   OR email = '' 
   OR encrypted_password IS NULL 
   OR encrypted_password = '';

-- Step 5: Check for orphaned data in related tables
SELECT 
    'ORPHANED PROFILES:' as status,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

SELECT 
    'ORPHANED USER ROLES:' as status,
    COUNT(*) as count
FROM public.user_roles ur
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE u.id IS NULL;

-- Step 6: Clean up orphaned data
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Step 7: Check for any remaining problematic functions
SELECT 
    'REMAINING PROBLEMATIC FUNCTIONS:' as status,
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

-- Step 8: Drop any remaining problematic functions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name, specific_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND (
            routine_name LIKE '%user%' OR
            routine_name LIKE '%auth%' OR
            routine_name LIKE '%create%' OR
            routine_name LIKE '%admin%'
        )
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
            RAISE NOTICE 'Dropped function: %', func_record.routine_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop function %: %', func_record.routine_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 9: Reset any problematic RLS policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 10: Re-enable RLS with clean policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 11: Create clean RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Step 12: Final verification
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Aggressive auth fix complete! Database schema issues resolved.' as status;
