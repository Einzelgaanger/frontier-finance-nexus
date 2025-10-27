-- Update field visibility to give viewers more significant information
-- Viewers should see enough to understand the fund and potentially want to join

-- 2024 Survey: Add viewer access to key fields
UPDATE field_visibility 
SET viewer_visible = true 
WHERE survey_year = 2024 
  AND field_name IN (
    'legal_domicile',
    'currency_investments',
    'fund_type_status',
    'typical_investment_size',
    'investment_considerations',
    'financing_needs',
    'revenue_growth_mix',
    'business_stages',
    'sector_target_allocation',
    'top_sdgs',
    'gender_lens_investing',
    'pipeline_sources_quality',
    'post_investment_priorities',
    'unique_offerings',
    'equity_investments_made',
    'debt_investments_made'
  );

-- 2023 Survey: Add viewer access to key fields
UPDATE field_visibility 
SET viewer_visible = true 
WHERE survey_year = 2023 
  AND field_name IN (
    'legal_domicile',
    'fund_type_status',
    'financial_instruments',
    'sector_focus',
    'business_stages',
    'sustainable_development_goals',
    'gender_lens_investing',
    'average_investment_size',
    'investment_timeframe',
    'exit_form'
  );

-- 2022 Survey: Add viewer access to key fields
UPDATE field_visibility 
SET viewer_visible = true 
WHERE survey_year = 2022 
  AND field_name IN (
    'legal_domicile',
    'fund_operations',
    'financial_instruments',
    'sector_activities',
    'business_stages',
    'gender_lens_investing',
    'investment_size',
    'typical_investment_timeframe',
    'investment_monetization_exit_forms'
  );

-- 2021 Survey: Add viewer access to key fields
UPDATE field_visibility 
SET viewer_visible = true 
WHERE survey_year = 2021 
  AND field_name IN (
    'geographic_focus',
    'fund_stage',
    'investment_vehicle_type',
    'investment_timeframe',
    'target_fund_size',
    'investment_forms',
    'target_sectors',
    'business_stage_targeted',
    'business_model_targeted',
    'impact_vs_financial_orientation'
  );

-- Verify the changes
SELECT 
  survey_year,
  COUNT(*) as total_fields,
  SUM(CASE WHEN viewer_visible = true THEN 1 ELSE 0 END) as viewer_visible_count,
  SUM(CASE WHEN member_visible = true THEN 1 ELSE 0 END) as member_visible_count,
  SUM(CASE WHEN admin_visible = true THEN 1 ELSE 0 END) as admin_visible_count
FROM field_visibility
WHERE survey_year IS NOT NULL
GROUP BY survey_year
ORDER BY survey_year;