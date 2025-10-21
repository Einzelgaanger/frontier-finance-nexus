-- ============================================
-- COMPREHENSIVE DATA FIELD VISIBILITY SETTINGS
-- ============================================
-- This script defines visibility levels for ALL survey fields across all years
-- Visibility levels:
--   - 'public': Visible to everyone (viewers, members, admins)
--   - 'member': Visible to members and admins only
--   - 'admin': Visible to admins only
-- ============================================

-- Clear existing visibility settings (optional - uncomment if you want fresh start)
-- TRUNCATE TABLE public.data_field_visibility CASCADE;

-- ============================================
-- MEMBER SURVEYS (Network Profile)
-- ============================================
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Public: Basic organizational information
('fund_name', 'public'),
('website', 'public'),
('fund_type', 'public'),
('primary_investment_region', 'public'),
('year_founded', 'public'),
('team_size', 'public'),
('sector_focus', 'public'),
('stage_focus', 'public'),
('fund_structure', 'public'),
('regulatory_jurisdiction', 'public'),
('current_fund_status', 'public'),
('secondary_regions', 'public'),
('investment_instruments', 'public'),
('legal_entity_name', 'public'),
('social_media_links', 'public'),
('role_badge', 'public'),

-- Member: Investment details and strategy
('typical_check_size', 'member'),
('aum', 'member'),
('investment_thesis', 'member'),
('fundraising_target', 'member'),
('amount_raised_to_date', 'member'),
('number_of_investments', 'member'),
('regional_allocation', 'member'),
('typical_ownership_sought', 'member'),
('value_add_services', 'member'),
('notable_exits', 'member'),
('key_team_members', 'member'),
('diversity_metrics', 'member'),

-- Admin: Sensitive contact and performance data
('contact_information', 'admin'),
('historical_returns', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- 2021 SURVEY RESPONSES
-- ============================================
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Section 1: Background Information
('2021_firm_name', 'public'),
('2021_participant_name', 'admin'),
('2021_role_title', 'public'),
('2021_team_based', 'public'),
('2021_team_based_other', 'public'),
('2021_geographic_focus', 'public'),
('2021_geographic_focus_other', 'public'),
('2021_fund_stage', 'public'),
('2021_legal_entity_date', 'member'),
('2021_first_close_date', 'member'),
('2021_first_investment_date', 'member'),

-- Section 2: Investment Thesis & Capital Construct
('2021_investments_march_2020', 'member'),
('2021_investments_december_2020', 'member'),
('2021_optional_supplement', 'member'),
('2021_investment_vehicle_type', 'public'),
('2021_investment_vehicle_type_other', 'public'),
('2021_current_fund_size', 'member'),
('2021_target_fund_size', 'member'),
('2021_investment_timeframe', 'member'),
('2021_business_model_targeted', 'public'),
('2021_business_model_targeted_other', 'public'),
('2021_business_stage_targeted', 'public'),
('2021_business_stage_targeted_other', 'public'),
('2021_financing_needs', 'member'),
('2021_financing_needs_other', 'member'),
('2021_target_capital_sources', 'admin'),
('2021_target_capital_sources_other', 'admin'),
('2021_target_irr_achieved', 'admin'),
('2021_target_irr_targeted', 'member'),
('2021_impact_vs_financial_orientation', 'member'),
('2021_explicit_lens_focus', 'public'),
('2021_explicit_lens_focus_other', 'public'),
('2021_report_sustainable_development_goals', 'public'),
('2021_top_sdg_1', 'public'),
('2021_top_sdg_2', 'public'),
('2021_top_sdg_3', 'public'),
('2021_gender_considerations_investment', 'public'),
('2021_gender_considerations_investment_other', 'public'),
('2021_gender_considerations_requirement', 'member'),
('2021_gender_considerations_requirement_other', 'member'),
('2021_gender_fund_vehicle', 'member'),
('2021_gender_fund_vehicle_other', 'member'),

-- Section 3: Portfolio Construction and Team
('2021_investment_size_your_amount', 'member'),
('2021_investment_size_total_raise', 'member'),
('2021_investment_forms', 'member'),
('2021_investment_forms_other', 'member'),
('2021_target_sectors', 'public'),
('2021_target_sectors_other', 'public'),
('2021_carried_interest_principals', 'admin'),
('2021_current_ftes', 'member'),

-- Section 4: Portfolio Development & Investment Return Monetization
('2021_portfolio_needs_ranking', 'member'),
('2021_portfolio_needs_other', 'member'),
('2021_investment_monetization', 'member'),
('2021_investment_monetization_other', 'member'),
('2021_exits_achieved', 'member'),
('2021_fund_capabilities_ranking', 'member'),
('2021_fund_capabilities_other', 'member'),

-- Section 5: Impact of COVID-19
('2021_covid_impact_aggregate', 'member'),
('2021_covid_impact_portfolio', 'member'),
('2021_covid_government_support', 'member'),
('2021_covid_government_support_other', 'member'),
('2021_raising_capital_2021', 'admin'),
('2021_raising_capital_2021_other', 'admin'),
('2021_fund_vehicle_considerations', 'member'),
('2021_fund_vehicle_considerations_other', 'member'),

-- Section 6: Network Feedback
('2021_network_value_rating', 'admin'),
('2021_working_groups_ranking', 'admin'),
('2021_new_working_group_suggestions', 'admin'),
('2021_webinar_content_ranking', 'admin'),
('2021_new_webinar_suggestions', 'admin'),
('2021_communication_platform', 'admin'),
('2021_network_value_areas', 'admin'),
('2021_present_connection_session', 'admin'),
('2021_convening_initiatives_ranking', 'admin'),
('2021_convening_initiatives_other', 'admin'),

-- Section 7: 2021 Convening
('2021_participate_mentoring_program', 'admin'),
('2021_present_demystifying_session', 'admin'),
('2021_present_demystifying_session_other', 'admin'),
('2021_additional_comments', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- 2022 SURVEY RESPONSES
-- ============================================
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Contact Information
('2022_name', 'admin'),
('2022_role_title', 'public'),
('2022_email', 'admin'),
('2022_organisation', 'public'),

-- Timeline
('2022_legal_entity_date', 'member'),
('2022_first_close_date', 'member'),
('2022_first_investment_date', 'member'),

-- Geographic and Team
('2022_geographic_markets', 'public'),
('2022_team_based', 'public'),
('2022_current_ftes', 'member'),
('2022_ye2023_ftes', 'member'),
('2022_principals_count', 'member'),

-- Prior Experience
('2022_new_to_investment', 'member'),
('2022_adjacent_finance_experience', 'member'),
('2022_business_management_experience', 'member'),
('2022_fund_investment_experience', 'member'),
('2022_senior_fund_experience', 'member'),
('2022_investments_experience', 'member'),
('2022_exits_experience', 'member'),

-- Legal and Currency
('2022_legal_domicile', 'member'),
('2022_currency_investments', 'member'),
('2022_currency_lp_commitments', 'admin'),

-- Fund Operations
('2022_fund_operations', 'member'),
('2022_current_funds_raised', 'admin'),
('2022_current_amount_invested', 'member'),
('2022_target_fund_size', 'member'),
('2022_target_investments', 'member'),
('2022_follow_on_permitted', 'member'),
('2022_target_irr', 'admin'),
('2022_gp_commitment', 'admin'),
('2022_management_fee', 'admin'),
('2022_carried_interest_hurdle', 'admin'),

-- Investment Strategy
('2022_investment_stage', 'public'),
('2022_investment_size', 'member'),
('2022_investment_type', 'public'),
('2022_sector_focus', 'public'),
('2022_geographic_focus', 'public'),
('2022_value_add_services', 'member'),

-- Portfolio Construction
('2022_average_investment_size', 'member'),
('2022_investment_timeframe', 'member'),
('2022_investments_made', 'member'),
('2022_anticipated_exits', 'member'),

-- Preferences
('2022_receive_results', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- 2023 SURVEY RESPONSES
-- ============================================
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Section 1: Introduction & Context
('2023_email_address', 'admin'),
('2023_organisation_name', 'public'),
('2023_funds_raising_investing', 'public'),
('2023_fund_name', 'public'),

-- Section 2: Organizational Background and Team
('2023_legal_entity_achieved', 'member'),
('2023_first_close_achieved', 'member'),
('2023_first_investment_achieved', 'member'),
('2023_geographic_markets', 'public'),
('2023_geographic_markets_other', 'public'),
('2023_team_based', 'public'),
('2023_team_based_other', 'public'),
('2023_fte_staff_2022', 'member'),
('2023_fte_staff_current', 'member'),
('2023_fte_staff_2024_est', 'member'),
('2023_principals_count', 'member'),
('2023_gender_inclusion', 'public'),
('2023_gender_inclusion_other', 'public'),
('2023_team_experience_investments', 'member'),
('2023_team_experience_exits', 'member'),

-- Section 3: Vehicle Construct
('2023_legal_domicile', 'member'),
('2023_legal_domicile_other', 'member'),
('2023_currency_investments', 'member'),
('2023_currency_lp_commitments', 'admin'),
('2023_fund_type_status', 'public'),
('2023_fund_type_status_other', 'public'),
('2023_current_funds_raised', 'admin'),
('2023_current_amount_invested', 'member'),
('2023_target_fund_size', 'member'),
('2023_target_investments_count', 'member'),
('2023_follow_on_investment_permitted', 'member'),
('2023_concessionary_capital', 'member'),
('2023_concessionary_capital_other', 'member'),
('2023_lp_capital_sources_existing', 'admin'),
('2023_lp_capital_sources_target', 'admin'),
('2023_gp_financial_commitment', 'admin'),
('2023_gp_financial_commitment_other', 'admin'),
('2023_gp_management_fee', 'admin'),
('2023_gp_management_fee_other', 'admin'),
('2023_hurdle_rate_currency', 'admin'),
('2023_hurdle_rate_currency_other', 'admin'),
('2023_hurdle_rate_percentage', 'admin'),
('2023_target_local_currency_return', 'member'),
('2023_fundraising_constraints', 'member'),
('2023_fundraising_constraints_other', 'member'),

-- Section 4: Investment Thesis
('2023_business_stages', 'public'),
('2023_growth_expectations', 'member'),
('2023_financing_needs', 'member'),
('2023_sector_focus', 'public'),
('2023_sector_focus_other', 'public'),
('2023_financial_instruments', 'member'),
('2023_sustainable_development_goals', 'public'),
('2023_gender_lens_investing', 'public'),
('2023_gender_lens_investing_other', 'public'),

-- Section 5: Pipeline Sourcing and Portfolio Construction
('2023_pipeline_sourcing', 'member'),
('2023_pipeline_sourcing_other', 'member'),
('2023_average_investment_size', 'member'),
('2023_capital_raise_percentage', 'member'),

-- Section 6: Portfolio Value Creation and Exits
('2023_portfolio_priorities', 'member'),
('2023_portfolio_priorities_other', 'member'),
('2023_technical_assistance_funding', 'member'),
('2023_technical_assistance_funding_other', 'member'),
('2023_business_development_support', 'member'),
('2023_business_development_support_other', 'member'),
('2023_investment_timeframe', 'member'),
('2023_exit_form', 'member'),
('2023_exit_form_other', 'member'),

-- Section 7: Performance to Date and Current Outlook
('2023_equity_investments_count', 'member'),
('2023_debt_investments_count', 'member'),
('2023_equity_exits_count', 'member'),
('2023_debt_exits_count', 'member'),
('2023_equity_exits_anticipated', 'member'),
('2023_debt_exits_anticipated', 'member'),
('2023_other_investments', 'member'),
('2023_revenue_growth_historical', 'admin'),
('2023_revenue_growth_expected', 'member'),
('2023_cash_flow_growth_historical', 'admin'),
('2023_cash_flow_growth_expected', 'member'),
('2023_jobs_impact_historical_direct', 'member'),
('2023_jobs_impact_historical_indirect', 'member'),
('2023_jobs_impact_historical_other', 'member'),
('2023_jobs_impact_expected_direct', 'member'),
('2023_jobs_impact_expected_indirect', 'member'),
('2023_jobs_impact_expected_other', 'member'),
('2023_fund_priorities', 'member'),
('2023_fund_priorities_other', 'member'),
('2023_concerns_ranking', 'member'),
('2023_concerns_ranking_other', 'member'),

-- Section 8: Future Research
('2023_future_research_data', 'admin'),
('2023_future_research_data_other', 'admin'),
('2023_one_on_one_meeting', 'admin'),
('2023_receive_survey_results', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- 2024 SURVEY RESPONSES
-- ============================================
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Introduction & Context
('2024_email_address', 'admin'),
('2024_investment_networks', 'public'),
('2024_investment_networks_other', 'public'),
('2024_organisation_name', 'public'),
('2024_funds_raising_investing', 'public'),
('2024_fund_name', 'public'),

-- Organizational Background and Team
('2024_legal_entity_achieved', 'member'),
('2024_first_close_achieved', 'member'),
('2024_first_investment_achieved', 'member'),
('2024_geographic_markets', 'public'),
('2024_geographic_markets_other', 'public'),
('2024_team_based', 'public'),
('2024_team_based_other', 'public'),
('2024_fte_staff_2023_actual', 'member'),
('2024_fte_staff_current', 'member'),
('2024_fte_staff_2025_forecast', 'member'),
('2024_investment_approval', 'member'),
('2024_investment_approval_other', 'member'),
('2024_principals_total', 'member'),
('2024_principals_women', 'public'),
('2024_gender_inclusion', 'public'),
('2024_gender_inclusion_other', 'public'),
('2024_team_experience_investments', 'member'),
('2024_team_experience_exits', 'member'),

-- Vehicle Construct
('2024_legal_domicile', 'member'),
('2024_legal_domicile_other', 'member'),
('2024_domicile_reason', 'member'),
('2024_domicile_reason_other', 'member'),
('2024_regulatory_impact', 'member'),
('2024_currency_investments', 'member'),
('2024_currency_lp_commitments', 'admin'),
('2024_currency_hedging_strategy', 'admin'),
('2024_currency_hedging_details', 'admin'),
('2024_fund_type_status', 'public'),
('2024_fund_type_status_other', 'public'),
('2024_hard_commitments_2022', 'admin'),
('2024_hard_commitments_current', 'admin'),
('2024_amount_invested_2022', 'member'),
('2024_amount_invested_current', 'member'),
('2024_target_fund_size_2022', 'member'),
('2024_target_fund_size_current', 'member'),
('2024_target_number_investments', 'member'),
('2024_follow_on_permitted', 'member'),
('2024_concessionary_capital', 'member'),
('2024_concessionary_capital_other', 'member'),
('2024_existing_lp_sources', 'admin'),
('2024_target_lp_sources', 'admin'),
('2024_gp_financial_commitment', 'admin'),
('2024_gp_financial_commitment_other', 'admin'),
('2024_gp_management_fee', 'admin'),
('2024_gp_management_fee_other', 'admin'),
('2024_hurdle_rate_currency', 'admin'),
('2024_hurdle_rate_percentage', 'admin'),
('2024_target_return_above_govt_debt', 'member'),
('2024_fundraising_barriers', 'member'),

-- Investment Thesis
('2024_business_stages', 'public'),
('2024_revenue_growth_mix', 'member'),
('2024_financing_needs', 'member'),
('2024_sector_target_allocation', 'public'),
('2024_investment_considerations', 'member'),
('2024_financial_instruments_ranking', 'member'),
('2024_top_sdgs', 'public'),
('2024_additional_sdgs', 'public'),
('2024_gender_lens_investing', 'public'),

-- Pipeline Sourcing and Portfolio Construction
('2024_pipeline_sources_quality', 'member'),
('2024_sgb_financing_trends', 'member'),
('2024_typical_investment_size', 'member'),

-- Portfolio Value Creation and Exits
('2024_post_investment_priorities', 'member'),
('2024_technical_assistance_funding', 'member'),
('2024_business_development_approach', 'member'),
('2024_business_development_approach_other', 'member'),
('2024_unique_offerings', 'member'),
('2024_typical_investment_timeframe', 'member'),
('2024_investment_monetisation_forms', 'member'),
('2024_investment_monetisation_other', 'member'),
('2024_equity_investments_made', 'member'),
('2024_debt_investments_made', 'member'),
('2024_equity_exits_achieved', 'member'),
('2024_debt_repayments_achieved', 'member'),
('2024_equity_exits_anticipated', 'member'),
('2024_debt_repayments_anticipated', 'member'),
('2024_other_investments_supplement', 'member'),
('2024_portfolio_revenue_growth_12m', 'admin'),
('2024_portfolio_revenue_growth_next_12m', 'member'),
('2024_portfolio_cashflow_growth_12m', 'admin'),
('2024_portfolio_cashflow_growth_next_12m', 'member'),
('2024_portfolio_performance_other', 'member'),
('2024_direct_jobs_current', 'member'),
('2024_indirect_jobs_current', 'member'),
('2024_direct_jobs_anticipated', 'member'),
('2024_indirect_jobs_anticipated', 'member'),
('2024_employment_impact_other', 'member'),
('2024_fund_priorities_next_12m', 'member'),

-- Future Research
('2024_data_sharing_willingness', 'admin'),
('2024_data_sharing_other', 'admin'),
('2024_survey_sender', 'admin'),
('2024_receive_results', 'admin')

ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level;

-- ============================================
-- VERIFICATION: View all visibility settings
-- ============================================
SELECT 
  visibility_level,
  COUNT(*) as field_count
FROM public.data_field_visibility
GROUP BY visibility_level
ORDER BY visibility_level;

-- Show sample of each visibility level
SELECT 
  field_name,
  visibility_level
FROM public.data_field_visibility
ORDER BY visibility_level, field_name
LIMIT 50;
