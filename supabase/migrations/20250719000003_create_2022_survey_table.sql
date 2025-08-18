-- Create table for 2022 survey responses
CREATE TABLE IF NOT EXISTS survey_responses_2022 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Contact Information
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT NOT NULL,
  
  -- Timeline
  legal_entity_date TEXT NOT NULL,
  first_close_date TEXT NOT NULL,
  first_investment_date TEXT NOT NULL,
  
  -- Geographic and Team
  geographic_markets TEXT[] NOT NULL,
  team_based TEXT[] NOT NULL,
  current_ftes TEXT NOT NULL,
  ye2023_ftes TEXT NOT NULL,
  principals_count TEXT NOT NULL,
  
  -- Prior Experience
  new_to_investment TEXT NOT NULL,
  adjacent_finance_experience TEXT NOT NULL,
  business_management_experience TEXT NOT NULL,
  fund_investment_experience TEXT NOT NULL,
  senior_fund_experience TEXT NOT NULL,
  investments_experience TEXT NOT NULL,
  exits_experience TEXT NOT NULL,
  
  -- Legal and Currency
  legal_domicile TEXT NOT NULL,
  currency_investments TEXT NOT NULL,
  currency_lp_commitments TEXT NOT NULL,
  
  -- Fund Operations
  fund_operations TEXT NOT NULL,
  current_funds_raised TEXT NOT NULL,
  current_amount_invested TEXT NOT NULL,
  target_fund_size TEXT NOT NULL,
  target_investments TEXT NOT NULL,
  follow_on_permitted TEXT NOT NULL,
  target_irr TEXT NOT NULL,
  gp_commitment TEXT NOT NULL,
  management_fee TEXT NOT NULL,
  carried_interest_hurdle TEXT NOT NULL,
  
  -- Investment Strategy
  investment_stage TEXT NOT NULL,
  investment_size TEXT NOT NULL,
  investment_type TEXT NOT NULL,
  sector_focus TEXT NOT NULL,
  geographic_focus TEXT NOT NULL,
  value_add_services TEXT NOT NULL,
  
  -- Portfolio Construction
  average_investment_size TEXT NOT NULL,
  investment_timeframe TEXT NOT NULL,
  investments_made TEXT NOT NULL,
  anticipated_exits TEXT NOT NULL,
  
  -- Preferences
  receive_results BOOLEAN DEFAULT false,
  
  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_2022_user_id ON survey_responses_2022(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2022_created_at ON survey_responses_2022(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_2022_completed_at ON survey_responses_2022(completed_at);

-- Enable RLS
ALTER TABLE survey_responses_2022 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own 2022 survey responses" ON survey_responses_2022
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 survey responses" ON survey_responses_2022
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 survey responses" ON survey_responses_2022
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow admins to view all responses
CREATE POLICY "Admins can view all 2022 survey responses" ON survey_responses_2022
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin'); 