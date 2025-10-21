-- ============================================
-- COMPLETE SURVEY SCHEMA WITH PROPER COLUMNS
-- Based on Excel structure analysis
-- ============================================
-- This migration creates properly structured survey tables
-- with actual columns instead of relying only on JSONB
-- ============================================

-- ============================================
-- 2021 SURVEY - Complete Schema
-- ============================================

-- Drop existing if needed (for clean migration)
DROP TABLE IF EXISTS public.survey_responses_2021 CASCADE;

CREATE TABLE public.survey_responses_2021 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Section 1: Background Information
  email_address TEXT NOT NULL,
  firm_name TEXT,
  participant_name TEXT,
  role_title TEXT,
  team_based TEXT[], -- Array: Where is your team based?
  geographic_focus TEXT[], -- Array: Geographic focus
  fund_stage TEXT,
  
  -- Section 2: Timeline
  legal_entity_date TEXT,
  first_close_date TEXT,
  first_investment_date TEXT,
  
  -- Section 3: Investment Metrics
  investments_march_2020 TEXT,
  investments_december_2020 TEXT,
  optional_supplement TEXT,
  investment_vehicle_type TEXT[],
  current_fund_size TEXT,
  target_fund_size TEXT,
  investment_timeframe TEXT,
  
  -- Section 4: Investment Thesis
  business_model_targeted TEXT[],
  business_stage_targeted TEXT[],
  financing_needs TEXT[],
  target_capital_sources TEXT[],
  target_irr_achieved TEXT,
  target_irr_targeted TEXT,
  impact_vs_financial_orientation TEXT,
  
  -- Section 5: Impact & SDGs
  explicit_lens_focus TEXT[],
  report_sustainable_development_goals TEXT,
  top_sdg_1 TEXT,
  top_sdg_2 TEXT,
  top_sdg_3 TEXT,
  
  -- Section 6: Gender Lens
  gender_considerations_investment TEXT[],
  gender_considerations_requirement TEXT[],
  gender_fund_vehicle TEXT[],
  
  -- Section 7: Portfolio
  investment_size_your_amount TEXT,
  investment_size_total_raise TEXT,
  investment_forms TEXT[],
  target_sectors TEXT[],
  carried_interest_principals INTEGER,
  current_ftes INTEGER,
  
  -- Section 8: Portfolio Development
  portfolio_needs_ranking JSONB, -- Ranking question
  investment_monetization TEXT[],
  exits_achieved TEXT,
  fund_capabilities_ranking JSONB, -- Ranking question
  
  -- Section 9: COVID-19 Impact
  covid_impact_aggregate TEXT,
  covid_impact_portfolio JSONB, -- Multiple impact areas
  covid_government_support TEXT[],
  raising_capital_2021 TEXT[],
  fund_vehicle_considerations TEXT[],
  
  -- Section 10: Network Feedback (Admin only)
  network_value_rating TEXT,
  working_groups_ranking JSONB,
  new_working_group_suggestions TEXT,
  webinar_content_ranking JSONB,
  new_webinar_suggestions TEXT,
  communication_platform TEXT,
  network_value_areas JSONB,
  present_connection_session TEXT,
  convening_initiatives_ranking JSONB,
  participate_mentoring_program TEXT,
  present_demystifying_session TEXT[],
  additional_comments TEXT,
  
  -- Metadata
  form_data JSONB DEFAULT '{}', -- Backup of all raw data
  submission_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT survey_responses_2021_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own 2021 responses" 
ON public.survey_responses_2021 FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 responses" 
ON public.survey_responses_2021 FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 responses" 
ON public.survey_responses_2021 FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all 2021 responses" 
ON public.survey_responses_2021 FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- Indexes
CREATE INDEX idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX idx_survey_2021_email ON public.survey_responses_2021(email_address);
CREATE INDEX idx_survey_2021_firm ON public.survey_responses_2021(firm_name);

-- ============================================
-- 2022 SURVEY - Complete Schema
-- ============================================

DROP TABLE IF EXISTS public.survey_responses_2022 CASCADE;

CREATE TABLE public.survey_responses_2022 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Contact & Basic Info
  email TEXT NOT NULL,
  name TEXT,
  role_title TEXT,
  organisation TEXT,
  
  -- Timeline
  legal_entity_date TEXT,
  first_close_date TEXT,
  first_investment_date TEXT,
  
  -- Geographic & Team
  geographic_markets TEXT[],
  team_based TEXT[],
  current_ftes INTEGER,
  ye2023_ftes INTEGER,
  principals_count INTEGER,
  
  -- Team Experience
  new_to_investment BOOLEAN,
  adjacent_finance_experience TEXT,
  business_management_experience TEXT,
  fund_investment_experience TEXT,
  senior_fund_experience TEXT,
  investments_experience INTEGER,
  exits_experience INTEGER,
  
  -- Gender Orientation
  gender_orientation TEXT[],
  
  -- Legal & Currency
  legal_domicile TEXT[],
  currency_investments TEXT,
  currency_lp_commitments TEXT,
  
  -- Fund Operations
  fund_operations TEXT,
  current_funds_raised NUMERIC,
  current_amount_invested NUMERIC,
  target_fund_size NUMERIC,
  target_investments INTEGER,
  follow_on_permitted TEXT,
  target_irr NUMERIC,
  
  -- GP Commitment & Fees
  gp_commitment TEXT[],
  management_fee TEXT,
  carried_interest_hurdle TEXT,
  
  -- Concessionary Capital
  concessionary_capital TEXT[],
  
  -- LP Capital Sources
  lp_capital_sources_existing JSONB,
  lp_capital_sources_target JSONB,
  
  -- Fundraising Barriers
  fundraising_barriers JSONB, -- Ranking question
  
  -- Investment Strategy
  investment_stage JSONB, -- Percentage allocation
  enterprise_types TEXT[],
  financing_needs JSONB, -- Percentage allocation
  sector_focus JSONB, -- Ranking/percentage
  financial_instruments JSONB, -- Percentage allocation
  
  -- SDGs & Gender Lens
  top_sdgs TEXT[],
  gender_lens_investing JSONB, -- Consideration vs requirement
  
  -- Technology Role
  technology_role TEXT,
  
  -- Pipeline & Portfolio
  pipeline_sourcing JSONB, -- Percentage allocation
  average_investment_size TEXT,
  portfolio_priorities JSONB, -- Ranking question
  investment_timeframe TEXT,
  investment_monetization_forms TEXT[],
  
  -- Performance
  equity_exits INTEGER,
  debt_repayments INTEGER,
  investments_made INTEGER,
  other_investments TEXT,
  anticipated_exits TEXT,
  revenue_growth_historical NUMERIC,
  revenue_growth_expected NUMERIC,
  cashflow_growth_historical NUMERIC,
  cashflow_growth_expected NUMERIC,
  jobs_impact_direct INTEGER,
  jobs_impact_indirect INTEGER,
  jobs_impact_expected_direct INTEGER,
  jobs_impact_expected_indirect INTEGER,
  
  -- Fund Priorities
  fund_priorities JSONB, -- Ranking question
  domestic_concerns JSONB, -- Ranking question
  international_concerns JSONB, -- Ranking question
  
  -- Preferences
  receive_results BOOLEAN DEFAULT false,
  
  -- Metadata
  form_data JSONB DEFAULT '{}',
  submission_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT survey_responses_2022_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same pattern as 2021)
CREATE POLICY "Users can view their own 2022 responses" 
ON public.survey_responses_2022 FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 responses" 
ON public.survey_responses_2022 FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 responses" 
ON public.survey_responses_2022 FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all 2022 responses" 
ON public.survey_responses_2022 FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- Indexes
CREATE INDEX idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX idx_survey_2022_email ON public.survey_responses_2022(email);
CREATE INDEX idx_survey_2022_org ON public.survey_responses_2022(organisation);

-- ============================================
-- Updated Trigger
-- ============================================
CREATE TRIGGER update_survey_responses_2021_updated_at
BEFORE UPDATE ON public.survey_responses_2021
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_2022_updated_at
BEFORE UPDATE ON public.survey_responses_2022
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Notes:
-- - 2023 and 2024 schemas will be similar
-- - This provides proper queryable columns
-- - form_data JSONB kept as backup
-- - Multi-select tables can still be used for normalized storage
-- ============================================
