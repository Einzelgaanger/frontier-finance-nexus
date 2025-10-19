-- Simple fix for 406 error - no snippets needed
-- Just run this directly in Supabase SQL editor

-- Check if survey_2023_responses table exists
SELECT 
    'survey_2023_responses' as table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_2023_responses' AND table_schema = 'public') 
        THEN 'EXISTS' 
        ELSE 'NOT FOUND' 
    END as status;

-- Check table structure
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'survey_2023_responses'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test basic access
SELECT COUNT(*) as total_records FROM survey_2023_responses;

-- Test the specific query that's failing
SELECT 
    id,
    user_id,
    email_address,
    submission_status
FROM survey_2023_responses
WHERE user_id = '477a7c9a-5479-4a22-bdc2-c926ba488f6f'
AND submission_status = 'completed';
