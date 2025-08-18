-- Create 2024 MSME Financing Survey responses table
CREATE TABLE IF NOT EXISTS public.survey_responses_2024 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  
  -- Section 1: Introduction & Context
  email_address TEXT NOT NULL,
  organisation_name TEXT NOT NULL,
  funds_raising_investing TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  
  -- Section 2: Organizational Background and Team
  legal_entity_achieved TEXT,
  first_close_achieved TEXT,
  first_investment_achieved TEXT,
  geographic_markets TEXT[] NOT NULL,
  geographic_markets_other TEXT,
  team_based TEXT[] NOT NULL,
  team_based_other TEXT,
  fte_staff_2022 INTEGER,
  fte_staff_current INTEGER,
  fte_staff_2024_est INTEGER,
  principals_count INTEGER,
  gender_inclusion TEXT[] NOT NULL,
  gender_inclusion_other TEXT,
  team_experience_investments JSONB NOT NULL,
  team_experience_exits JSONB NOT NULL,
  
  -- Section 3: Vehicle Construct
  legal_domicile TEXT[] NOT NULL,
  legal_domicile_other TEXT,
  currency_investments TEXT NOT NULL,
  currency_lp_commitments TEXT NOT NULL,
  fund_type_status TEXT NOT NULL,
  fund_type_status_other TEXT,
  current_funds_raised DECIMAL,
  current_amount_invested DECIMAL,
  target_fund_size DECIMAL,
  target_investments_count INTEGER,
  follow_on_investment_permitted TEXT NOT NULL,
  concessionary_capital TEXT[] NOT NULL,
  concessionary_capital_other TEXT,
  lp_capital_sources_existing JSONB NOT NULL,
  lp_capital_sources_target JSONB NOT NULL,
  gp_financial_commitment TEXT[] NOT NULL,
  gp_financial_commitment_other TEXT,
  gp_management_fee TEXT NOT NULL,
  gp_management_fee_other TEXT,
  hurdle_rate_currency TEXT NOT NULL,
  hurdle_rate_currency_other TEXT,
  hurdle_rate_percentage DECIMAL,
  target_local_currency_return DECIMAL,
  fundraising_constraints JSONB NOT NULL,
  fundraising_constraints_other TEXT,
  
  -- Section 4: Investment Thesis
  business_stages JSONB NOT NULL,
  growth_expectations JSONB NOT NULL,
  financing_needs JSONB NOT NULL,
  sector_focus JSONB NOT NULL,
  sector_focus_other TEXT,
  financial_instruments JSONB NOT NULL,
  sustainable_development_goals TEXT[] NOT NULL,
  gender_lens_investing JSONB NOT NULL,
  gender_lens_investing_other TEXT,
  
  -- Section 5: Pipeline Sourcing and Portfolio Construction
  pipeline_sourcing JSONB NOT NULL,
  pipeline_sourcing_other TEXT,
  average_investment_size TEXT NOT NULL,
  capital_raise_percentage DECIMAL,
  
  -- Section 6: Portfolio Value Creation and Exits
  portfolio_priorities JSONB NOT NULL,
  portfolio_priorities_other TEXT,
  technical_assistance_funding JSONB NOT NULL,
  technical_assistance_funding_other TEXT,
  business_development_support TEXT[] NOT NULL,
  business_development_support_other TEXT,
  investment_timeframe TEXT NOT NULL,
  exit_form TEXT[] NOT NULL,
  exit_form_other TEXT,
  
  -- Section 7: Performance to Date and Current Outlook
  equity_investments_count INTEGER,
  debt_investments_count INTEGER,
  equity_exits_count INTEGER,
  debt_exits_count INTEGER,
  equity_exits_anticipated INTEGER,
  debt_exits_anticipated INTEGER,
  other_investments TEXT,
  revenue_growth_historical DECIMAL,
  revenue_growth_expected DECIMAL,
  cash_flow_growth_historical DECIMAL,
  cash_flow_growth_expected DECIMAL,
  jobs_impact_historical_direct INTEGER,
  jobs_impact_historical_indirect INTEGER,
  jobs_impact_historical_other TEXT,
  jobs_impact_expected_direct INTEGER,
  jobs_impact_expected_indirect INTEGER,
  jobs_impact_expected_other TEXT,
  fund_priorities JSONB NOT NULL,
  fund_priorities_other TEXT,
  concerns_ranking JSONB NOT NULL,
  concerns_ranking_other TEXT,
  
  -- Section 8: Future Research
  future_research_data TEXT[] NOT NULL,
  future_research_data_other TEXT,
  one_on_one_meeting BOOLEAN DEFAULT FALSE,
  receive_survey_results BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_2024_user_id ON survey_responses_2024(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2024_organisation_name ON survey_responses_2024(organisation_name);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2024_created_at ON survey_responses_2024(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2024_completed_at ON survey_responses_2024(completed_at);

-- Enable Row Level Security
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own 2024 survey responses" ON public.survey_responses_2024
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 survey responses" ON public.survey_responses_2024
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 survey responses" ON public.survey_responses_2024
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policy for viewing all responses
CREATE POLICY "Admins can view all 2024 survey responses" ON public.survey_responses_2024
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_responses_2024_updated_at 
  BEFORE UPDATE ON public.survey_responses_2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 