-- Create table for 2021 survey responses
CREATE TABLE IF NOT EXISTS survey_responses_2021 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Section 1: Background Information
  firm_name TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  team_based TEXT[] NOT NULL,
  team_based_other TEXT,
  geographic_focus TEXT[] NOT NULL,
  geographic_focus_other TEXT,
  fund_stage TEXT NOT NULL,
  legal_entity_date TEXT NOT NULL,
  first_close_date TEXT NOT NULL,
  first_investment_date TEXT NOT NULL,
  
  -- Section 2: Investment Thesis & Capital Construct
  investments_march_2020 TEXT NOT NULL,
  investments_december_2020 TEXT NOT NULL,
  optional_supplement TEXT,
  investment_vehicle_type TEXT[] NOT NULL,
  investment_vehicle_type_other TEXT,
  current_fund_size TEXT NOT NULL,
  target_fund_size TEXT NOT NULL,
  investment_timeframe TEXT NOT NULL,
  business_model_targeted TEXT[] NOT NULL,
  business_model_targeted_other TEXT,
  business_stage_targeted TEXT[] NOT NULL,
  business_stage_targeted_other TEXT,
  financing_needs TEXT[] NOT NULL,
  financing_needs_other TEXT,
  target_capital_sources TEXT[] NOT NULL,
  target_capital_sources_other TEXT,
  target_irr_achieved TEXT NOT NULL,
  target_irr_targeted TEXT NOT NULL,
  impact_vs_financial_orientation TEXT NOT NULL,
  explicit_lens_focus TEXT[] NOT NULL,
  explicit_lens_focus_other TEXT,
  report_sustainable_development_goals BOOLEAN NOT NULL,
  top_sdg_1 TEXT,
  top_sdg_2 TEXT,
  top_sdg_3 TEXT,
  gender_considerations_investment TEXT[] NOT NULL,
  gender_considerations_investment_other TEXT,
  gender_considerations_requirement TEXT[] NOT NULL,
  gender_considerations_requirement_other TEXT,
  gender_fund_vehicle TEXT[] NOT NULL,
  gender_fund_vehicle_other TEXT,
  
  -- Section 3: Portfolio Construction and Team
  investment_size_your_amount TEXT NOT NULL,
  investment_size_total_raise TEXT NOT NULL,
  investment_forms TEXT[] NOT NULL,
  investment_forms_other TEXT,
  target_sectors TEXT[] NOT NULL,
  target_sectors_other TEXT,
  carried_interest_principals TEXT NOT NULL,
  current_ftes TEXT NOT NULL,
  
  -- Section 4: Portfolio Development & Investment Return Monetization
  portfolio_needs_ranking JSONB NOT NULL,
  portfolio_needs_other TEXT,
  investment_monetization TEXT[] NOT NULL,
  investment_monetization_other TEXT,
  exits_achieved TEXT NOT NULL,
  fund_capabilities_ranking JSONB NOT NULL,
  fund_capabilities_other TEXT,
  
  -- Section 5: Impact of COVID-19 on Vehicle and Portfolio
  covid_impact_aggregate TEXT NOT NULL,
  covid_impact_portfolio JSONB NOT NULL,
  covid_government_support TEXT[] NOT NULL,
  covid_government_support_other TEXT,
  raising_capital_2021 TEXT[] NOT NULL,
  raising_capital_2021_other TEXT,
  fund_vehicle_considerations TEXT[] NOT NULL,
  fund_vehicle_considerations_other TEXT,
  
  -- Section 6: Feedback on ESCP Network Membership
  network_value_rating TEXT NOT NULL,
  working_groups_ranking JSONB NOT NULL,
  new_working_group_suggestions TEXT,
  webinar_content_ranking JSONB NOT NULL,
  new_webinar_suggestions TEXT,
  communication_platform TEXT NOT NULL,
  network_value_areas JSONB NOT NULL,
  present_connection_session BOOLEAN NOT NULL,
  convening_initiatives_ranking JSONB NOT NULL,
  convening_initiatives_other TEXT,
  
  -- Section 7: 2021 Convening Objectives & Goals
  participate_mentoring_program TEXT,
  present_demystifying_session TEXT[] NOT NULL,
  present_demystifying_session_other TEXT,
  additional_comments TEXT,
  
  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_2021_user_id ON survey_responses_2021(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2021_created_at ON survey_responses_2021(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2021_completed_at ON survey_responses_2021(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2021_firm_name ON survey_responses_2021(firm_name);

-- Enable RLS
ALTER TABLE survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own 2021 survey responses" ON survey_responses_2021
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 survey responses" ON survey_responses_2021
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 survey responses" ON survey_responses_2021
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow admins to view all responses
CREATE POLICY "Admins can view all 2021 survey responses" ON survey_responses_2021
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin'); 