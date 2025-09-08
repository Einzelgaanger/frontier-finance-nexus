-- Query to see all unique fund_stage values in the 2021 survey responses
SELECT 
  fund_stage,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses_2021)), 1) as percentage
FROM survey_responses_2021 
GROUP BY fund_stage 
ORDER BY count DESC;

-- Also show total count
SELECT COUNT(*) as total_responses FROM survey_responses_2021;
