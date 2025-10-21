-- Check how many users are in the database
SELECT 'Total Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT '2021 Surveys', COUNT(*) FROM survey_2021_responses
UNION ALL
SELECT '2022 Surveys', COUNT(*) FROM survey_2022_responses
UNION ALL
SELECT '2023 Surveys', COUNT(*) FROM survey_2023_responses
UNION ALL
SELECT '2024 Surveys', COUNT(*) FROM survey_2024_responses;

-- Show sample profiles
SELECT id, email, first_name, last_name 
FROM profiles 
LIMIT 10;
