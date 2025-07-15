-- Create member_surveys table for network visibility
CREATE TABLE IF NOT EXISTS public.member_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fund_name TEXT NOT NULL,
  website TEXT,
  fund_type TEXT,
  primary_investment_region TEXT,
  year_founded INTEGER,
  team_size INTEGER,
  typical_check_size TEXT,
  aum TEXT,
  investment_thesis TEXT,
  sector_focus TEXT[],
  stage_focus TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Enable RLS on member_surveys table
ALTER TABLE public.member_surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_surveys
DROP POLICY IF EXISTS "Users can view all member surveys" ON public.member_surveys;
CREATE POLICY "Users can view all member surveys" ON public.member_surveys FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own member survey" ON public.member_surveys;
CREATE POLICY "Users can manage own member survey" ON public.member_surveys FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all member surveys" ON public.member_surveys;
CREATE POLICY "Admins can manage all member surveys" ON public.member_surveys FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Add vehicle_name column to survey_responses table
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

-- Add member_surveys fields to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
('fund_name', 'public'),
('website', 'public'),
('fund_type', 'public'),
('primary_investment_region', 'public'),
('year_founded', 'public'),
('team_size', 'public'),
('typical_check_size', 'member'),
('aum', 'member'),
('investment_thesis', 'member'),
('sector_focus', 'public'),
('stage_focus', 'public'),
('vehicle_name', 'public')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = EXCLUDED.visibility_level; 


