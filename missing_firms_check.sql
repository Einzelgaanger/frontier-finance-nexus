-- SQL query to find missing firm names from the 2021 survey responses table
-- This query will show which firms from the provided list are NOT in the database

WITH expected_firms AS (
  SELECT unnest(ARRAY[
    'iungo capital',
    'Secha Capital',
    'Kinyungu Ventures',
    'FyreFem Fund Managers',
    'Uberis',
    'Jenga Capital',
    'Vakayi Capital',
    'Truvalu',
    'Amam Ventures',
    'Kapita',
    'VestedWorld',
    'Balloon Ventures',
    'Gemini Capital Partners',
    'ViKtoria Business Angels Network',
    'Microtraction',
    'Teranga Capital',
    'Nordic Impact Funds',
    'Ibtikar Fund',
    'Ankur Capital',
    'Grassroots Business Fund',
    'Ortus Africa Capital',
    'ADAP Capital LLC',
    'Village Capital',
    'Outlierz Ventures',
    'Beacon Fund',
    'RENEW',
    'Villgro Africa',
    'Kenya Climate Ventures',
    'SYCOMORE-VENTURE',
    'Mirepa Capital Ltd',
    'WIC CAPITAL',
    'LoftyInc Capital Management',
    'Impact Capital Advisors',
    'Opes-Lcef Fund',
    'Wangara Green Ventures',
    'First Followers Capital',
    'Comoé Capital',
    'CcHUB Growth Capital Limited',
    'Sahelinvest',
    'CO_Capital',
    'Sangam Ventures',
    'Miarakap',
    'i2i Ventures'
  ]) AS firm_name
),
existing_firms AS (
  SELECT DISTINCT firm_name
  FROM survey_responses_2021
  WHERE firm_name IS NOT NULL
)
SELECT 
  ef.firm_name AS missing_firm,
  'NOT FOUND' AS status
FROM expected_firms ef
LEFT JOIN existing_firms ex ON LOWER(TRIM(ef.firm_name)) = LOWER(TRIM(ex.firm_name))
WHERE ex.firm_name IS NULL
ORDER BY ef.firm_name;

-- Additional query to show all firms that ARE in the database for comparison
-- Uncomment the following query if you want to see what firms are actually present:

/*
SELECT 
  firm_name,
  COUNT(*) as response_count
FROM survey_responses_2021
WHERE firm_name IS NOT NULL
GROUP BY firm_name
ORDER BY firm_name;
*/

-- Query to check for potential matches with slight variations in spelling
-- This might help identify firms that are in the database but with different spelling:

/*
WITH expected_firms AS (
  SELECT unnest(ARRAY[
    'iungo capital',
    'Secha Capital',
    'Kinyungu Ventures',
    'FyreFem Fund Managers',
    'Uberis',
    'Jenga Capital',
    'Vakayi Capital',
    'Truvalu',
    'Amam Ventures',
    'Kapita',
    'VestedWorld',
    'Balloon Ventures',
    'Gemini Capital Partners',
    'ViKtoria Business Angels Network',
    'Microtraction',
    'Teranga Capital',
    'Nordic Impact Funds',
    'Ibtikar Fund',
    'Ankur Capital',
    'Grassroots Business Fund',
    'Ortus Africa Capital',
    'ADAP Capital LLC',
    'Village Capital',
    'Outlierz Ventures',
    'Beacon Fund',
    'RENEW',
    'Villgro Africa',
    'Kenya Climate Ventures',
    'SYCOMORE-VENTURE',
    'Mirepa Capital Ltd',
    'WIC CAPITAL',
    'LoftyInc Capital Management',
    'Impact Capital Advisors',
    'Opes-Lcef Fund',
    'Wangara Green Ventures',
    'First Followers Capital',
    'Comoé Capital',
    'CcHUB Growth Capital Limited',
    'Sahelinvest',
    'CO_Capital',
    'Sangam Ventures',
    'Miarakap',
    'i2i Ventures'
  ]) AS firm_name
)
SELECT 
  ef.firm_name AS expected_firm,
  sr.firm_name AS actual_firm_in_db,
  'POTENTIAL MATCH' AS status
FROM expected_firms ef
CROSS JOIN survey_responses_2021 sr
WHERE sr.firm_name IS NOT NULL
  AND (
    LOWER(ef.firm_name) LIKE '%' || LOWER(sr.firm_name) || '%'
    OR LOWER(sr.firm_name) LIKE '%' || LOWER(ef.firm_name) || '%'
  )
  AND LOWER(TRIM(ef.firm_name)) != LOWER(TRIM(sr.firm_name))
ORDER BY ef.firm_name, sr.firm_name;
*/
