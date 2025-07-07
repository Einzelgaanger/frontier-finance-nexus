
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('viewer', 'member', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Create invitation codes table
CREATE TABLE public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  used_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create membership requests table
CREATE TABLE public.membership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  
  -- Section 1: Basic Vehicle Information
  vehicle_websites TEXT[],
  vehicle_type TEXT,
  thesis TEXT,
  
  -- Section 2: Team & Leadership
  team_members JSONB,
  team_size_min INTEGER,
  team_size_max INTEGER,
  team_description TEXT,
  
  -- Section 3: Geographic & Market Focus
  legal_domicile TEXT[],
  markets_operated JSONB,
  
  -- Section 4: Investment Strategy
  ticket_size_min DECIMAL,
  ticket_size_max DECIMAL,
  ticket_description TEXT,
  target_capital DECIMAL,
  capital_raised DECIMAL,
  capital_in_market DECIMAL,
  
  -- Section 5: Fund Operations
  supporting_document_url TEXT,
  information_sharing TEXT,
  expectations TEXT,
  how_heard_about_network TEXT,
  
  -- Section 6: Fund Status & Timeline
  fund_stage TEXT[],
  current_status TEXT,
  legal_entity_date_from INTEGER,
  legal_entity_date_to INTEGER,
  first_close_date_from INTEGER,
  first_close_date_to INTEGER,
  
  -- Section 7: Investment Instruments
  investment_instruments_priority JSONB,
  
  -- Section 8: Sector Focus & Returns
  sectors_allocation JSONB,
  target_return_min DECIMAL,
  target_return_max DECIMAL,
  equity_investments_made DECIMAL,
  equity_investments_exited DECIMAL,
  self_liquidating_made DECIMAL,
  self_liquidating_exited DECIMAL,
  
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, year)
);

-- Create data field visibility table
CREATE TABLE public.data_field_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_name TEXT NOT NULL UNIQUE,
  visibility_level TEXT NOT NULL DEFAULT 'public' CHECK (visibility_level IN ('public', 'member', 'admin')),
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_field_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for invitation_codes
CREATE POLICY "Admins can manage invitation codes" ON public.invitation_codes FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can view codes to redeem" ON public.invitation_codes FOR SELECT USING (used_by IS NULL AND expires_at > NOW());

-- RLS Policies for membership_requests
CREATE POLICY "Users can view own requests" ON public.membership_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON public.membership_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON public.membership_requests FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update requests" ON public.membership_requests FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for survey_responses
CREATE POLICY "Users can view own responses" ON public.survey_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own responses" ON public.survey_responses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Members can view member responses" ON public.survey_responses FOR SELECT USING (public.get_user_role(auth.uid()) IN ('member', 'admin'));
CREATE POLICY "Admins can view all responses" ON public.survey_responses FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for data_field_visibility
CREATE POLICY "Everyone can view field visibility" ON public.data_field_visibility FOR SELECT USING (true);
CREATE POLICY "Admins can manage field visibility" ON public.data_field_visibility FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for activity_logs
CREATE POLICY "Admins can view all logs" ON public.activity_logs FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "System can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign default viewer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  -- Log the registration
  INSERT INTO public.activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default data field visibility settings
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
('vehicle_websites', 'public'),
('vehicle_type', 'public'),
('thesis', 'member'),
('team_members', 'member'),
('team_size_min', 'public'),
('team_size_max', 'public'),
('legal_domicile', 'public'),
('markets_operated', 'public'),
('ticket_size_min', 'member'),
('ticket_size_max', 'member'),
('target_capital', 'admin'),
('capital_raised', 'admin'),
('capital_in_market', 'admin'),
('fund_stage', 'public'),
('current_status', 'public'),
('investment_instruments_priority', 'member'),
('sectors_allocation', 'public'),
('target_return_min', 'member'),
('target_return_max', 'member');
