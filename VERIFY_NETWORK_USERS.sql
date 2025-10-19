-- =====================================================
-- VERIFY NETWORK_USERS TABLE AND DATA
-- =====================================================
-- This script checks if network_users table exists and has data
-- =====================================================

-- Step 1: Check if network_users table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'network_users';

-- Step 2: Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'network_users'
ORDER BY ordinal_position;

-- Step 3: Count records in network_users
SELECT 
    'network_users' as table_name,
    COUNT(*) as record_count
FROM public.network_users;

-- Step 4: Show sample data from network_users
SELECT 
    id,
    user_id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.network_users
ORDER BY created_at DESC
LIMIT 10;

-- Step 5: Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'network_users';

-- Step 6: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'network_users';
