-- =====================================================
-- DIAGNOSE 406 ERROR
-- =====================================================
-- This script helps identify why the 406 error is occurring
-- =====================================================

-- 1. Check if survey_2023_responses table exists
SELECT 
    'Table exists' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'survey_2023_responses';

-- 2. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'survey_2023_responses'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'survey_2023_responses';

-- 4. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'survey_2023_responses';

-- 5. Test basic access (this should work if RLS is correct)
SELECT COUNT(*) as total_records FROM survey_2023_responses;

-- 6. Test the exact query that's failing
SELECT *
FROM survey_2023_responses
WHERE user_id = '477a7c9a-5479-4a22-bdc2-c926ba488f6f'
AND submission_status = 'completed';

-- 7. Check if user exists in auth.users
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE id = '477a7c9a-5479-4a22-bdc2-c926ba488f6f';
