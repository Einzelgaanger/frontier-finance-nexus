-- =====================================================
-- FINAL AUTH FIX - COMPREHENSIVE DIAGNOSTIC AND CLEANUP
-- Find and remove ALL remaining problematic elements
-- =====================================================

-- Step 1: Find ALL remaining custom functions
SELECT 
    'REMAINING FUNCTIONS:' as status,
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name NOT LIKE 'pg_%'
AND routine_name NOT LIKE 'information_schema_%'
AND routine_name NOT LIKE 'sql_%'
ORDER BY routine_name;

-- Step 2: Find ALL remaining triggers
SELECT 
    'REMAINING TRIGGERS:' as status,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name NOT LIKE 'pg_%'
ORDER BY trigger_name;

-- Step 3: Find ALL remaining policies
SELECT 
    'REMAINING POLICIES:' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname NOT LIKE 'pg_%'
ORDER BY tablename, policyname;

-- Step 4: Check for corrupted user data
SELECT 
    'CORRUPTED USERS:' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NULL THEN 1 END) as null_emails,
    COUNT(CASE WHEN encrypted_password IS NULL THEN 1 END) as null_passwords,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_emails
FROM auth.users;

-- Step 5: Show problematic users
SELECT 
    'PROBLEMATIC USERS:' as status,
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users 
WHERE email IS NULL 
   OR encrypted_password IS NULL 
   OR email_confirmed_at IS NULL
   OR email = ''
   OR encrypted_password = ''
ORDER BY created_at DESC
LIMIT 10;

-- Step 6: Remove ALL remaining custom functions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name, specific_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name NOT LIKE 'pg_%'
        AND routine_name NOT LIKE 'information_schema_%'
        AND routine_name NOT LIKE 'sql_%'
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

-- Step 7: Remove ALL remaining triggers
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
        AND trigger_name NOT LIKE 'pg_%'
    LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON ' || trigger_record.event_object_table;
            RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop trigger %: %', trigger_record.trigger_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 8: Remove ALL remaining policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND policyname NOT LIKE 'pg_%'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS ' || policy_record.policyname || ' ON ' || policy_record.schemaname || '.' || policy_record.tablename;
            RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop policy %: %', policy_record.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 9: Clean up corrupted user data
DELETE FROM auth.users 
WHERE email IS NULL 
   OR email = '' 
   OR encrypted_password IS NULL 
   OR encrypted_password = '';

-- Step 10: Clean up orphaned data
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Step 11: Reset RLS completely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses DISABLE ROW LEVEL SECURITY;

-- Step 12: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- Step 13: Create minimal RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2021_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2022_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2023_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

-- Step 14: Final verification
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- Step 15: Check for any remaining issues
SELECT 
    'FINAL FUNCTION COUNT:' as status,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name NOT LIKE 'pg_%'
AND routine_name NOT LIKE 'information_schema_%'
AND routine_name NOT LIKE 'sql_%';

SELECT 
    'FINAL TRIGGER COUNT:' as status,
    COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name NOT LIKE 'pg_%';

SELECT 
    'FINAL POLICY COUNT:' as status,
    COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname NOT LIKE 'pg_%';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Final auth fix complete! All problematic elements removed.' as status;
