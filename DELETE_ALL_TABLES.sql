-- =====================================================
-- NUCLEAR OPTION - DELETE EVERYTHING
-- This will find and delete ALL tables in your database
-- USE WITH EXTREME CAUTION - THIS CANNOT BE UNDONE
-- =====================================================

-- First, let's see what tables actually exist
SELECT 'Current tables in database:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Now delete ALL tables dynamically
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Get all tables in public schema
    FOR r IN (
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    ) LOOP
        -- Drop each table
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', r.table_name;
    END LOOP;
END $$;

-- Delete all functions
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT routine_name, specific_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'FUNCTION'
    ) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.routine_name) || ' CASCADE';
        RAISE NOTICE 'Dropped function: %', r.routine_name;
    END LOOP;
END $$;

-- Delete all views
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT table_name 
        FROM information_schema.views 
        WHERE table_schema = 'public'
    ) LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
        RAISE NOTICE 'Dropped view: %', r.table_name;
    END LOOP;
END $$;

-- Delete all sequences
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    ) LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
        RAISE NOTICE 'Dropped sequence: %', r.sequence_name;
    END LOOP;
END $$;

-- Delete all custom types
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT typname 
        FROM pg_type 
        WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND typtype = 'e'  -- enum types
    ) LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        RAISE NOTICE 'Dropped type: %', r.typname;
    END LOOP;
END $$;

-- Clear all user data from auth.users
DELETE FROM auth.users;

-- Final verification
SELECT 'Remaining tables after deletion:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Success message
SELECT 'NUCLEAR DELETION COMPLETE! All tables, functions, views, and data have been removed.' as result;
