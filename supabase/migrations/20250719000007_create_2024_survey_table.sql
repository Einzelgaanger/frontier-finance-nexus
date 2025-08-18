-- Create 2024 MSME Financing Survey responses table
CREATE TABLE IF NOT EXISTS public.survey_responses_2024 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  
  -- Section 1: Introduction & Context (Questions 1-5)
  email_address TEXT NOT NULL,
  investment_networks TEXT[] NOT NULL,
  investment_networks_other TEXT,
  organisation_name TEXT NOT NULL,
  funds_raising_investing TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  
  -- Section 2: Organizational Background and Team (Questions 6-10)
  legal_entity_achieved TEXT,
  first_close_achieved TEXT,
  first_investment_achieved TEXT,
  geographic_markets TEXT[] NOT NULL,
  geographic_markets_other TEXT,
  team_based TEXT[] NOT NULL,
  team_based_other TEXT,
  fte_staff_2023_actual INTEGER,
  fte_staff_current INTEGER,
  fte_staff_2025_forecast INTEGER,
  investment_approval TEXT[] NOT NULL,
  investment_approval_other TEXT,
  principals_total INTEGER,
  principals_women INTEGER,
  gender_inclusion TEXT[] NOT NULL,
  gender_inclusion_other TEXT,
  team_experience_investments JSONB,
  team_experience_exits JSONB
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