-- First, drop the existing survey_responses_2024 table to recreate with complete schema
DROP TABLE IF EXISTS public.survey_responses_2024;

-- Create comprehensive survey_responses_2024 table with all fields from the full survey
CREATE TABLE public.survey_responses_2024 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Introduction & Context (Questions 1-5)
  email_address TEXT NOT NULL,
  investment_networks TEXT[] DEFAULT '{}',
  investment_networks_other TEXT,
  organisation_name TEXT NOT NULL,
  funds_raising_investing TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  
  -- Organizational Background and Team (Questions 6-14)
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
  
  -- Vehicle Construct (Questions 15-32)
  legal_domicile TEXT[] DEFAULT '{}',
  legal_domicile_other TEXT,
  domicile_reason TEXT[] DEFAULT '{}',
  domicile_reason_other TEXT,
  regulatory_impact JSONB DEFAULT '{}',
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
  target_lp_sources JSONB DEFAULT '{}',
  gp_financial_commitment TEXT[] DEFAULT '{}',
  gp_financial_commitment_other TEXT,
  gp_management_fee TEXT,
  gp_management_fee_other TEXT,
  hurdle_rate_currency TEXT,
  hurdle_rate_percentage NUMERIC,
  target_return_above_govt_debt NUMERIC,
  fundraising_barriers JSONB DEFAULT '{}',
  
  -- Investment Thesis (Questions 33-40)
  business_stages JSONB DEFAULT '{}',
  revenue_growth_mix JSONB DEFAULT '{}',
  financing_needs JSONB DEFAULT '{}',
  sector_target_allocation JSONB DEFAULT '{}',
  investment_considerations JSONB DEFAULT '{}',
  financial_instruments_ranking JSONB DEFAULT '{}',
  top_sdgs TEXT[] DEFAULT '{}',
  additional_sdgs TEXT,
  gender_lens_investing JSONB DEFAULT '{}',
  
  -- Pipeline Sourcing and Portfolio Construction (Questions 41-43)
  pipeline_sources_quality JSONB DEFAULT '{}',
  sgb_financing_trends JSONB DEFAULT '{}',
  typical_investment_size TEXT,
  
  -- Portfolio Value Creation and Exits (Questions 44-55)
  post_investment_priorities JSONB DEFAULT '{}',
  technical_assistance_funding JSONB DEFAULT '{}',
  business_development_approach TEXT[] DEFAULT '{}',
  business_development_approach_other TEXT,
  unique_offerings JSONB DEFAULT '{}',
  typical_investment_timeframe TEXT,
  investment_monetisation_forms TEXT[] DEFAULT '{}',
  investment_monetisation_other TEXT,
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
  portfolio_performance_other TEXT,
  direct_jobs_current INTEGER,
  indirect_jobs_current INTEGER,
  direct_jobs_anticipated INTEGER,
  indirect_jobs_anticipated INTEGER,
  employment_impact_other TEXT,
  fund_priorities_next_12m JSONB DEFAULT '{}',
  
  -- Future Research (Questions 56-59)
  data_sharing_willingness TEXT[] DEFAULT '{}',
  data_sharing_other TEXT,
  survey_sender TEXT,
  receive_results BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own 2024 survey responses" 
ON public.survey_responses_2024 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 survey responses" 
ON public.survey_responses_2024 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 survey responses" 
ON public.survey_responses_2024 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all 2024 survey responses" 
ON public.survey_responses_2024 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- Create updated_at trigger
CREATE TRIGGER update_survey_responses_2024_updated_at
BEFORE UPDATE ON public.survey_responses_2024
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();