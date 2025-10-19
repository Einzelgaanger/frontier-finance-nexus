-- =====================================================
-- NUCLEAR AUTH FIX - REMOVE ALL CUSTOM FUNCTIONS
-- This will remove ALL custom functions that might interfere
-- =====================================================

-- Step 1: Get list of ALL custom functions
DO $$
DECLARE
    func_record RECORD;
    drop_statement TEXT;
BEGIN
    -- Loop through all custom functions and drop them
    FOR func_record IN 
        SELECT 
            routine_name,
            routine_type,
            specific_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name NOT LIKE 'pg_%'
        AND routine_name NOT LIKE 'information_schema_%'
        AND routine_name NOT LIKE 'sql_%'
    LOOP
        BEGIN
            -- Try to drop the function
            EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.routine_name || ' CASCADE';
            RAISE NOTICE 'Dropped function: %', func_record.routine_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop function %: %', func_record.routine_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 2: Drop ALL custom triggers
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT 
            trigger_name,
            event_object_table
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

-- Step 3: Drop ALL custom policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT 
            schemaname,
            tablename,
            policyname
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

-- Step 4: Verify cleanup
SELECT 
    'REMAINING FUNCTIONS:' as status,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name NOT LIKE 'pg_%'
AND routine_name NOT LIKE 'information_schema_%'
AND routine_name NOT LIKE 'sql_%';

SELECT 
    'REMAINING TRIGGERS:' as status,
    COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name NOT LIKE 'pg_%';

SELECT 
    'REMAINING POLICIES:' as status,
    COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname NOT LIKE 'pg_%';

-- Step 5: Test basic functionality
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Nuclear cleanup complete! All custom functions, triggers, and policies removed.' as status;
