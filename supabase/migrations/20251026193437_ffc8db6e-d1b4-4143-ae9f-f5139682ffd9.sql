-- Change Survey 2024 questions 54 and 55 fields from numeric to text
-- This allows flexible input like ">50%", "approximately 30%", etc.
-- Existing numeric data will be automatically cast to text

-- Question 54 fields (revenue_growth_mix)
ALTER TABLE survey_responses_2024 
ALTER COLUMN portfolio_revenue_growth_12m TYPE text USING portfolio_revenue_growth_12m::text;

ALTER TABLE survey_responses_2024 
ALTER COLUMN portfolio_revenue_growth_next_12m TYPE text USING portfolio_revenue_growth_next_12m::text;

-- Question 55 fields (business_stages allocation)
ALTER TABLE survey_responses_2024 
ALTER COLUMN portfolio_cashflow_growth_12m TYPE text USING portfolio_cashflow_growth_12m::text;

ALTER TABLE survey_responses_2024 
ALTER COLUMN portfolio_cashflow_growth_next_12m TYPE text USING portfolio_cashflow_growth_next_12m::text;

-- Also change the "other" value fields if they exist
ALTER TABLE survey_responses_2024 
ALTER COLUMN portfolio_performance_other_value TYPE text USING portfolio_performance_other_value::text;