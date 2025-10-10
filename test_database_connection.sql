-- =====================================================
-- TEST DATABASE CONNECTION AND TABLE STRUCTURE
-- =====================================================
-- This script tests if the database tables exist and are accessible
-- =====================================================

-- Check if survey_2023_responses table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%survey%'
ORDER BY table_name;

-- Check the structure of survey_2023_responses table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'survey_2023_responses'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies for survey_2023_responses
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

-- Test a simple query to see if the table is accessible
SELECT COUNT(*) as total_records FROM survey_2023_responses;

-- Check if the table has the correct columns for the survey
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'survey_2023_responses'
AND table_schema = 'public'
AND column_name IN ('user_id', 'submission_status', 'form_data', 'email_address', 'organisation_name')
ORDER BY column_name;
