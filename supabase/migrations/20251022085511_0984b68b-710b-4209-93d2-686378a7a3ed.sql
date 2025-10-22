-- =====================================================
-- DROP EXISTING SURVEY TABLES
-- =====================================================
DROP TABLE IF EXISTS survey_responses_2021 CASCADE;
DROP TABLE IF EXISTS survey_responses_2022 CASCADE;
DROP TABLE IF EXISTS survey_responses_2023 CASCADE;
DROP TABLE IF EXISTS survey_responses_2024 CASCADE;

-- =====================================================
-- CREATE NEW COMPREHENSIVE SURVEY TABLES
-- =====================================================

-- ====================================================================
-- 2021 SURVEY TABLE
-- ====================================================================
CREATE TABLE public.survey_responses_2021 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Section 1: Background Information
  email_address TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  team_based TEXT[] DEFAULT '{}',
  team_based_other TEXT,
  geographic_focus TEXT[] DEFAULT '{}',
  geographic_focus_other TEXT,
  fund_stage TEXT,
  fund_stage_other TEXT,
  legal_entity_date TEXT,
  first_close_date TEXT,
  first_investment_date TEXT,
  
  -- Section 2: Investment Thesis & Capital Construct
  investments_march_2020 TEXT,
  investments_december_2020 TEXT,
  optional_supplement TEXT,
  investment_vehicle_type TEXT[] DEFAULT '{}',
  investment_vehicle_type_other TEXT,
  current_fund_size TEXT,
  target_fund_size TEXT,
  investment_timeframe TEXT,
  investment_timeframe_other TEXT,
  business_model_targeted TEXT[] DEFAULT '{}',
  business_model_targeted_other TEXT,
  business_stage_targeted TEXT[] DEFAULT '{}',
  business_stage_targeted_other TEXT,
  financing_needs TEXT[] DEFAULT '{}',
  financing_needs_other TEXT,
  target_capital_sources TEXT[] DEFAULT '{}',
  target_capital_sources_other TEXT,
  target_irr_achieved TEXT,
  target_irr_targeted TEXT,
  impact_vs_financial_orientation TEXT,
  impact_vs_financial_orientation_other TEXT,
  explicit_lens_focus TEXT[] DEFAULT '{}',
  explicit_lens_focus_other TEXT,
  report_sustainable_development_goals BOOLEAN DEFAULT false,
  top_sdg_1 TEXT,
  top_sdg_2 TEXT,
  top_sdg_3 TEXT,
  top_sdgs JSONB DEFAULT '{}',
  other_sdgs TEXT[] DEFAULT '{}',
  gender_considerations_investment TEXT[] DEFAULT '{}',
  gender_considerations_investment_other TEXT,
  gender_considerations_requirement TEXT[] DEFAULT '{}',
  gender_considerations_requirement_other TEXT,
  gender_fund_vehicle TEXT[] DEFAULT '{}',
  gender_fund_vehicle_other TEXT,
  
  -- Section 3: Portfolio Construction and Team
  investment_size_your_amount TEXT,
  investment_size_total_raise TEXT,
  investment_forms TEXT[] DEFAULT '{}',
  investment_forms_other TEXT,
  target_sectors TEXT[] DEFAULT '{}',
  target_sectors_other TEXT,
  carried_interest_principals TEXT,
  current_ftes TEXT,
  
  -- Section 4: Portfolio Development & Investment Return Monetization
  portfolio_needs_ranking JSONB DEFAULT '{}',
  portfolio_needs_other TEXT,
  investment_monetization TEXT[] DEFAULT '{}',
  investment_monetization_other TEXT,
  exits_achieved TEXT,
  exits_achieved_other TEXT,
  fund_capabilities_ranking JSONB DEFAULT '{}',
  fund_capabilities_other TEXT,
  
  -- Section 5: Impact of COVID-19
  covid_impact_aggregate TEXT,
  covid_impact_portfolio JSONB DEFAULT '{}',
  covid_government_support TEXT[] DEFAULT '{}',
  covid_government_support_other TEXT,
  raising_capital_2021 TEXT[] DEFAULT '{}',
  raising_capital_2021_other TEXT,
  fund_vehicle_considerations TEXT[] DEFAULT '{}',
  fund_vehicle_considerations_other TEXT,
  
  -- Section 6: Network Feedback
  network_value_rating TEXT,
  working_groups_ranking JSONB DEFAULT '{}',
  new_working_group_suggestions TEXT,
  webinar_content_ranking JSONB DEFAULT '{}',
  new_webinar_suggestions TEXT,
  communication_platform TEXT,
  communication_platform_other TEXT,
  network_value_areas JSONB DEFAULT '{}',
  present_connection_session TEXT,
  present_connection_session_other TEXT,
  convening_initiatives_ranking JSONB DEFAULT '{}',
  convening_initiatives_other TEXT,
  
  -- Section 7: Convening Objectives
  participate_mentoring_program TEXT,
  participate_mentoring_program_other TEXT,
  present_demystifying_session TEXT[] DEFAULT '{}',
  present_demystifying_session_other TEXT,
  additional_comments TEXT,
  
  -- Full form data as backup
  form_data JSONB DEFAULT '{}'
);

-- ====================================================================
-- 2022 SURVEY TABLE
-- ====================================================================
CREATE TABLE public.survey_responses_2022 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Basic Information
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT NOT NULL,
  legal_entity_date TEXT,
  first_close_date TEXT,
  first_investment_date TEXT,
  geographic_markets TEXT[] DEFAULT '{}',
  geographic_markets_other TEXT,
  team_based TEXT[] DEFAULT '{}',
  team_based_other TEXT,
  
  -- Team Information
  current_ftes TEXT,
  ye2023_ftes TEXT,
  principals_count TEXT,
  gp_experience JSONB DEFAULT '{}',
  gp_experience_other_description TEXT,
  gender_orientation TEXT[] DEFAULT '{}',
  gender_orientation_other TEXT,
  investments_experience TEXT,
  exits_experience TEXT,
  
  -- Fund Structure
  legal_domicile TEXT,
  legal_domicile_other TEXT,
  currency_investments TEXT,
  currency_lp_commitments TEXT,
  fund_operations TEXT,
  fund_operations_other TEXT,
  current_funds_raised TEXT,
  current_amount_invested TEXT,
  target_fund_size TEXT,
  target_investments TEXT,
  follow_on_permitted TEXT,
  target_irr TEXT,
  target_irr_other TEXT,
  concessionary_capital TEXT[] DEFAULT '{}',
  concessionary_capital_other TEXT,
  lp_capital_sources JSONB DEFAULT '{}',
  lp_capital_sources_other_description TEXT,
  gp_commitment TEXT,
  management_fee TEXT,
  management_fee_other TEXT,
  carried_interest_hurdle TEXT,
  carried_interest_hurdle_other TEXT,
  fundraising_constraints JSONB DEFAULT '{}',
  fundraising_constraints_other_description TEXT,
  
  -- Investment Thesis
  business_stages JSONB DEFAULT '{}',
  business_stages_other_description TEXT,
  enterprise_types TEXT[] DEFAULT '{}',
  financing_needs JSONB DEFAULT '{}',
  financing_needs_other_description TEXT,
  sector_activities JSONB DEFAULT '{}',
  sector_activities_other_description TEXT,
  financial_instruments JSONB DEFAULT '{}',
  financial_instruments_other_description TEXT,
  sdg_targets JSONB DEFAULT '{}',
  gender_lens_investing JSONB DEFAULT '{}',
  gender_lens_investing_other_description TEXT,
  technology_role_investment_thesis TEXT,
  
  -- Pipeline and Portfolio
  pipeline_sourcing JSONB DEFAULT '{}',
  pipeline_sourcing_other_description TEXT,
  average_investment_size_per_company TEXT,
  portfolio_value_creation_priorities JSONB DEFAULT '{}',
  portfolio_value_creation_other_description TEXT,
  typical_investment_timeframe TEXT,
  investment_monetization_exit_forms TEXT[] DEFAULT '{}',
  investment_monetization_exit_forms_other TEXT,
  
  -- Performance Metrics
  equity_exits_achieved INTEGER,
  debt_repayments_achieved INTEGER,
  investments_made_to_date INTEGER,
  other_investments_supplement TEXT,
  anticipated_exits_12_months TEXT,
  revenue_growth_recent_12_months NUMERIC,
  cash_flow_growth_recent_12_months NUMERIC,
  revenue_growth_next_12_months NUMERIC,
  cash_flow_growth_next_12_months NUMERIC,
  portfolio_performance_other_description TEXT,
  direct_jobs_created_cumulative INTEGER,
  direct_jobs_anticipated_change INTEGER,
  indirect_jobs_created_cumulative INTEGER,
  indirect_jobs_anticipated_change INTEGER,
  jobs_impact_other_description TEXT,
  
  -- Priorities and Concerns
  fund_priority_areas JSONB DEFAULT '{}',
  fund_priority_areas_other_description TEXT,
  domestic_factors_concerns JSONB DEFAULT '{}',
  domestic_factors_concerns_other_description TEXT,
  international_factors_concerns JSONB DEFAULT '{}',
  international_factors_concerns_other_description TEXT,
  
  -- Additional Fields
  investment_stage TEXT,
  investment_size TEXT,
  investment_type TEXT,
  sector_focus TEXT,
  geographic_focus TEXT,
  value_add_services TEXT,
  receive_results BOOLEAN DEFAULT false,
  
  -- Full form data as backup
  form_data JSONB DEFAULT '{}'
);

-- ====================================================================
-- 2023 SURVEY TABLE
-- ====================================================================
CREATE TABLE public.survey_responses_2023 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Section 1: Introduction
  email_address TEXT NOT NULL,
  organisation_name TEXT NOT NULL,
  funds_raising_investing TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  
  -- Section 2: Organizational Background
  legal_entity_achieved TEXT,
  first_close_achieved TEXT,
  first_investment_achieved TEXT,
  geographic_markets TEXT[] DEFAULT '{}',
  geographic_markets_other TEXT,
  team_based TEXT[] DEFAULT '{}',
  team_based_other TEXT,
  fte_staff_2022 INTEGER,
  fte_staff_current INTEGER,
  fte_staff_2024_est INTEGER,
  principals_count INTEGER,
  gender_inclusion TEXT[] DEFAULT '{}',
  gender_inclusion_other TEXT,
  team_experience_investments JSONB DEFAULT '{}',
  team_experience_exits JSONB DEFAULT '{}',
  team_experience_other TEXT,
  
  -- Section 3: Vehicle Construct
  legal_domicile TEXT[] DEFAULT '{}',
  legal_domicile_other TEXT,
  currency_investments TEXT,
  currency_lp_commitments TEXT,
  fund_type_status TEXT,
  fund_type_status_other TEXT,
  current_funds_raised NUMERIC,
  current_amount_invested NUMERIC,
  target_fund_size NUMERIC,
  target_investments_count INTEGER,
  follow_on_investment_permitted TEXT,
  concessionary_capital TEXT[] DEFAULT '{}',
  concessionary_capital_other TEXT,
  lp_capital_sources_existing JSONB DEFAULT '{}',
  lp_capital_sources_target JSONB DEFAULT '{}',
  gp_financial_commitment TEXT[] DEFAULT '{}',
  gp_financial_commitment_other TEXT,
  gp_management_fee TEXT,
  gp_management_fee_other TEXT,
  hurdle_rate_currency TEXT,
  hurdle_rate_currency_other TEXT,
  hurdle_rate_percentage NUMERIC,
  target_local_currency_return_methods JSONB DEFAULT '{}',
  target_local_currency_return NUMERIC,
  fundraising_constraints JSONB DEFAULT '{}',
  fundraising_constraints_other TEXT,
  
  -- Section 4: Investment Thesis
  business_stages JSONB DEFAULT '{}',
  growth_expectations JSONB DEFAULT '{}',
  financing_needs JSONB DEFAULT '{}',
  sector_focus JSONB DEFAULT '{}',
  sector_focus_other TEXT,
  financial_instruments JSONB DEFAULT '{}',
  sustainable_development_goals TEXT[] DEFAULT '{}',
  sdg_ranking JSONB DEFAULT '{}',
  gender_lens_investing JSONB DEFAULT '{}',
  gender_lens_investing_other TEXT,
  
  -- Section 5: Pipeline Sourcing
  pipeline_sourcing JSONB DEFAULT '{}',
  pipeline_sourcing_other TEXT,
  average_investment_size TEXT,
  average_investment_size_per_company TEXT,
  capital_raise_percentage NUMERIC,
  portfolio_funding_mix JSONB DEFAULT '{}',
  portfolio_funding_mix_other TEXT,
  
  -- Section 6: Portfolio Value Creation
  portfolio_priorities JSONB DEFAULT '{}',
  portfolio_priorities_other TEXT,
  portfolio_value_creation_priorities JSONB DEFAULT '{}',
  portfolio_value_creation_other TEXT,
  technical_assistance_funding JSONB DEFAULT '{}',
  technical_assistance_funding_other TEXT,
  business_development_approach TEXT[] DEFAULT '{}',
  business_development_approach_other TEXT,
  business_development_support TEXT[] DEFAULT '{}',
  business_development_support_other TEXT,
  investment_timeframe TEXT,
  exit_form TEXT[] DEFAULT '{}',
  exit_form_other TEXT,
  
  -- Section 7: Performance
  equity_exits_anticipated INTEGER,
  debt_exits_anticipated INTEGER,
  other_investments_description TEXT,
  other_investments TEXT,
  portfolio_performance JSONB DEFAULT '{}',
  portfolio_performance_other_description TEXT,
  jobs_impact JSONB DEFAULT '{}',
  jobs_impact_other_description TEXT,
  fund_priorities JSONB DEFAULT '{}',
  fund_priorities_other_description TEXT,
  revenue_growth_historical NUMERIC,
  revenue_growth_expected NUMERIC,
  cash_flow_growth_historical NUMERIC,
  cash_flow_growth_expected NUMERIC,
  jobs_impact_historical_direct INTEGER,
  jobs_impact_historical_indirect INTEGER,
  jobs_impact_historical_other TEXT,
  jobs_impact_expected_direct INTEGER,
  jobs_impact_expected_indirect INTEGER,
  jobs_impact_expected_other TEXT,
  concerns_ranking JSONB DEFAULT '{}',
  concerns_ranking_other TEXT,
  
  -- Section 8: Future Research
  future_research_data TEXT[] DEFAULT '{}',
  future_research_data_other TEXT,
  one_on_one_meeting TEXT,
  receive_survey_results BOOLEAN DEFAULT false,
  
  -- Full form data as backup
  form_data JSONB DEFAULT '{}'
);

-- ====================================================================
-- 2024 SURVEY TABLE
-- ====================================================================
CREATE TABLE public.survey_responses_2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadata
  submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Section 1: Introduction
  email_address TEXT NOT NULL,
  investment_networks TEXT[] DEFAULT '{}',
  investment_networks_other TEXT,
  organisation_name TEXT NOT NULL,
  funds_raising_investing TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  
  -- Section 2: Organizational Background
  legal_entity_achieved TEXT,
  first_close_achieved TEXT,
  first_investment_achieved TEXT,
  geographic_markets TEXT[] DEFAULT '{}',
  geographic_markets_other TEXT,
  team_based TEXT[] DEFAULT '{}',
  team_based_other TEXT,
  fte_staff_2023_actual INTEGER,
  fte_staff_current INTEGER,
  fte_staff_2025_forecast INTEGER,
  investment_approval TEXT[] DEFAULT '{}',
  investment_approval_other TEXT,
  principals_total INTEGER,
  principals_women INTEGER,
  gender_inclusion TEXT[] DEFAULT '{}',
  gender_inclusion_other TEXT,
  team_experience_investments JSONB DEFAULT '{}',
  team_experience_exits JSONB DEFAULT '{}',
  
  -- Section 3: Vehicle Construct
  legal_domicile TEXT[] DEFAULT '{}',
  legal_domicile_other TEXT,
  domicile_reason TEXT[] DEFAULT '{}',
  domicile_reason_other TEXT,
  regulatory_impact JSONB DEFAULT '{}',
  regulatory_impact_other TEXT,
  currency_investments TEXT,
  currency_lp_commitments TEXT,
  currency_hedging_strategy TEXT,
  currency_hedging_details TEXT,
  fund_type_status TEXT,
  fund_type_status_other TEXT,
  hard_commitments_2022 NUMERIC,
  hard_commitments_current NUMERIC,
  amount_invested_2022 NUMERIC,
  amount_invested_current NUMERIC,
  target_fund_size_2022 NUMERIC,
  target_fund_size_current NUMERIC,
  target_number_investments INTEGER,
  follow_on_permitted TEXT,
  concessionary_capital TEXT[] DEFAULT '{}',
  concessionary_capital_other TEXT,
  existing_lp_sources JSONB DEFAULT '{}',
  existing_lp_sources_other_description TEXT,
  target_lp_sources JSONB DEFAULT '{}',
  target_lp_sources_other_description TEXT,
  gp_financial_commitment TEXT[] DEFAULT '{}',
  gp_financial_commitment_other TEXT,
  gp_management_fee TEXT,
  gp_management_fee_other TEXT,
  hurdle_rate_currency TEXT,
  hurdle_rate_currency_other TEXT,
  hurdle_rate_percentage NUMERIC,
  target_return_above_govt_debt NUMERIC,
  fundraising_barriers JSONB DEFAULT '{}',
  fundraising_barriers_other_description TEXT,
  
  -- Section 4: Investment Thesis
  business_stages JSONB DEFAULT '{}',
  revenue_growth_mix JSONB DEFAULT '{}',
  financing_needs JSONB DEFAULT '{}',
  sector_target_allocation JSONB DEFAULT '{}',
  investment_considerations JSONB DEFAULT '{}',
  investment_considerations_other TEXT,
  financial_instruments_ranking JSONB DEFAULT '{}',
  top_sdgs TEXT[] DEFAULT '{}',
  additional_sdgs TEXT,
  gender_lens_investing JSONB DEFAULT '{}',
  
  -- Section 5: Pipeline Sourcing
  pipeline_sources_quality JSONB DEFAULT '{}',
  pipeline_sources_quality_other_description TEXT,
  pipeline_sources_quality_other_score NUMERIC,
  sgb_financing_trends JSONB DEFAULT '{}',
  typical_investment_size TEXT,
  
  -- Section 6: Portfolio Value Creation
  post_investment_priorities JSONB DEFAULT '{}',
  post_investment_priorities_other_description TEXT,
  post_investment_priorities_other_score NUMERIC,
  technical_assistance_funding JSONB DEFAULT '{}',
  business_development_approach TEXT[] DEFAULT '{}',
  business_development_approach_other TEXT,
  unique_offerings JSONB DEFAULT '{}',
  unique_offerings_other_description TEXT,
  unique_offerings_other_score NUMERIC,
  typical_investment_timeframe TEXT,
  investment_monetisation_forms TEXT[] DEFAULT '{}',
  investment_monetisation_other TEXT,
  
  -- Section 7: Performance
  equity_investments_made INTEGER,
  debt_investments_made INTEGER,
  equity_exits_achieved INTEGER,
  debt_repayments_achieved INTEGER,
  equity_exits_anticipated INTEGER,
  debt_repayments_anticipated INTEGER,
  other_investments_supplement TEXT,
  portfolio_revenue_growth_12m NUMERIC,
  portfolio_revenue_growth_next_12m NUMERIC,
  portfolio_cashflow_growth_12m NUMERIC,
  portfolio_cashflow_growth_next_12m NUMERIC,
  portfolio_performance_other_description TEXT,
  portfolio_performance_other_category TEXT,
  portfolio_performance_other_value NUMERIC,
  direct_jobs_current INTEGER,
  indirect_jobs_current INTEGER,
  direct_jobs_anticipated INTEGER,
  indirect_jobs_anticipated INTEGER,
  employment_impact_other_description TEXT,
  employment_impact_other_category TEXT,
  employment_impact_other_value INTEGER,
  fund_priorities_next_12m JSONB DEFAULT '{}',
  fund_priorities_other_description TEXT,
  fund_priorities_other_category TEXT,
  
  -- Section 8: Future Research
  data_sharing_willingness TEXT[] DEFAULT '{}',
  data_sharing_other TEXT,
  survey_sender TEXT,
  receive_results BOOLEAN DEFAULT false,
  
  -- Full form data as backup
  form_data JSONB DEFAULT '{}'
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- 2021 indexes
CREATE INDEX idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX idx_survey_2021_status ON public.survey_responses_2021(submission_status);
CREATE INDEX idx_survey_2021_email ON public.survey_responses_2021(email_address);
CREATE INDEX idx_survey_2021_firm ON public.survey_responses_2021(firm_name);
CREATE INDEX idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);

-- 2022 indexes
CREATE INDEX idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX idx_survey_2022_status ON public.survey_responses_2022(submission_status);
CREATE INDEX idx_survey_2022_email ON public.survey_responses_2022(email);
CREATE INDEX idx_survey_2022_organisation ON public.survey_responses_2022(organisation);
CREATE INDEX idx_survey_2022_completed_at ON public.survey_responses_2022(completed_at);

-- 2023 indexes
CREATE INDEX idx_survey_2023_user_id ON public.survey_responses_2023(user_id);
CREATE INDEX idx_survey_2023_status ON public.survey_responses_2023(submission_status);
CREATE INDEX idx_survey_2023_email ON public.survey_responses_2023(email_address);
CREATE INDEX idx_survey_2023_organisation ON public.survey_responses_2023(organisation_name);
CREATE INDEX idx_survey_2023_completed_at ON public.survey_responses_2023(completed_at);

-- 2024 indexes
CREATE INDEX idx_survey_2024_user_id ON public.survey_responses_2024(user_id);
CREATE INDEX idx_survey_2024_status ON public.survey_responses_2024(submission_status);
CREATE INDEX idx_survey_2024_email ON public.survey_responses_2024(email_address);
CREATE INDEX idx_survey_2024_organisation ON public.survey_responses_2024(organisation_name);
CREATE INDEX idx_survey_2024_completed_at ON public.survey_responses_2024(completed_at);

-- =====================================================
-- CREATE ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- 2021 Policies
CREATE POLICY "Users can manage their own 2021 survey"
  ON public.survey_responses_2021
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Completed 2021 surveys viewable by members and admins"
  ON public.survey_responses_2021
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('member', 'admin')
    )
  );

-- 2022 Policies
CREATE POLICY "Users can manage their own 2022 survey"
  ON public.survey_responses_2022
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Completed 2022 surveys viewable by members and admins"
  ON public.survey_responses_2022
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('member', 'admin')
    )
  );

-- 2023 Policies
CREATE POLICY "Users can manage their own 2023 survey"
  ON public.survey_responses_2023
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Completed 2023 surveys viewable by members and admins"
  ON public.survey_responses_2023
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('member', 'admin')
    )
  );

-- 2024 Policies
CREATE POLICY "Users can manage their own 2024 survey"
  ON public.survey_responses_2024
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Completed 2024 surveys viewable by members and admins"
  ON public.survey_responses_2024
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('member', 'admin')
    )
  );

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_survey_2021_updated_at
  BEFORE UPDATE ON public.survey_responses_2021
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2022_updated_at
  BEFORE UPDATE ON public.survey_responses_2022
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2023_updated_at
  BEFORE UPDATE ON public.survey_responses_2023
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2024_updated_at
  BEFORE UPDATE ON public.survey_responses_2024
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();