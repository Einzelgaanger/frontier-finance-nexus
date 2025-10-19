-- =====================================================
-- NUCLEAR AUTH WORKING RESET - FIXED VERSION
-- Handles Supabase column constraints properly
-- =====================================================

-- Step 1: Backup current user data (optional)
CREATE TABLE IF NOT EXISTS user_backup AS 
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.first_name,
    p.last_name,
    ur.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- Step 2: Remove ALL custom functions
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

-- Step 3: Remove ALL custom triggers
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

-- Step 4: Remove ALL custom policies
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

-- Step 5: Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses DISABLE ROW LEVEL SECURITY;

-- Step 6: Clear ALL data (NUCLEAR OPTION)
-- WARNING: This will remove ALL users and data
DELETE FROM public.survey_2024_responses;
DELETE FROM public.survey_2023_responses;
DELETE FROM public.survey_2022_responses;
DELETE FROM public.survey_2021_responses;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM auth.users;

-- Step 7: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- Step 8: Create clean RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Profiles policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- User roles policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_roles' 
        AND policyname = 'Users can view own role'
    ) THEN
        CREATE POLICY "Users can view own role" ON public.user_roles
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Survey policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'survey_2021_responses' 
        AND policyname = 'Users can view own survey'
    ) THEN
        CREATE POLICY "Users can view own survey" ON public.survey_2021_responses
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'survey_2022_responses' 
        AND policyname = 'Users can view own survey'
    ) THEN
        CREATE POLICY "Users can view own survey" ON public.survey_2022_responses
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'survey_2023_responses' 
        AND policyname = 'Users can view own survey'
    ) THEN
        CREATE POLICY "Users can view own survey" ON public.survey_2023_responses
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'survey_2024_responses' 
        AND policyname = 'Users can view own survey'
    ) THEN
        CREATE POLICY "Users can view own survey" ON public.survey_2024_responses
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    RAISE NOTICE 'All policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating policies: %', SQLERRM;
END $$;

-- Step 9: Create a test admin user (without confirmed_at)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    false
);

-- Step 10: Create profile for test admin
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
    'admin@test.com',
    'Admin',
    'User',
    NOW(),
    NOW()
);

-- Step 11: Create role for test admin
INSERT INTO public.user_roles (
    user_id,
    email,
    role,
    assigned_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
    'admin@test.com',
    'admin',
    NOW()
);

-- Step 12: Final verification
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Nuclear auth reset complete! Test with admin@test.com / @ESCPNetwork2025#' as status;
