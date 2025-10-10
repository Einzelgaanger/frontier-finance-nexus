-- =====================================================
-- FIX EXISTING TABLES AND POLICIES
-- =====================================================
-- This script handles existing tables and policies gracefully
-- =====================================================

-- Check what tables currently exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%survey%'
ORDER BY table_name;

-- Check if survey_2023_responses table exists and is accessible
SELECT 
    COUNT(*) as record_count,
    'survey_2023_responses' as table_name
FROM survey_2023_responses;

-- Check RLS policies for survey_2023_responses
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'survey_2023_responses';

-- Test a simple query to see if the table is accessible
SELECT 
    id,
    user_id,
    email_address,
    submission_status
FROM survey_2023_responses
LIMIT 5;

-- Check if the table has the correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'survey_2023_responses'
AND table_schema = 'public'
ORDER BY ordinal_position;
