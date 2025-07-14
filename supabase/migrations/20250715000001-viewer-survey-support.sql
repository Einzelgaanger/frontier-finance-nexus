-- Add viewer survey support and admin viewer creation functionality

-- Add role_badge column to survey_responses to track if survey was created by viewer or member
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS role_badge TEXT DEFAULT 'member';

-- Add role_badge to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('role_badge', 'public')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'public';

-- Update RLS policies to allow viewers to manage their own surveys
DROP POLICY IF EXISTS "Users can manage own responses" ON public.survey_responses;
CREATE POLICY "Users can manage own responses" ON public.survey_responses 
  FOR ALL USING (auth.uid() = user_id);

-- Allow viewers to view their own surveys
CREATE POLICY "Viewers can view own responses" ON public.survey_responses 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow viewers to create and update their own surveys
CREATE POLICY "Viewers can manage own responses" ON public.survey_responses 
  FOR ALL USING (auth.uid() = user_id);

-- Update member_surveys table to include role_badge
ALTER TABLE public.member_surveys ADD COLUMN IF NOT EXISTS role_badge TEXT DEFAULT 'member';

-- Add role_badge to member_surveys data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('member_surveys_role_badge', 'public')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'public';

-- Create function to update role badges when user role changes
CREATE OR REPLACE FUNCTION update_survey_role_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Update survey_responses role_badge
  UPDATE public.survey_responses 
  SET role_badge = NEW.role
  WHERE user_id = NEW.user_id;
  
  -- Update member_surveys role_badge
  UPDATE public.member_surveys 
  SET role_badge = NEW.role
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update role badges when user role changes
DROP TRIGGER IF EXISTS on_user_role_changed ON public.user_roles;
CREATE TRIGGER on_user_role_changed
  AFTER UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_role_badges();

-- Create function for admin to create viewer accounts with surveys
CREATE OR REPLACE FUNCTION create_viewer_with_survey(
  viewer_email TEXT,
  viewer_password TEXT,
  survey_data JSONB,
  survey_year INTEGER
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  survey_id UUID;
BEGIN
  -- Create the user account
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    viewer_email,
    crypt(viewer_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ) RETURNING id INTO new_user_id;

  -- Create profile for the user
  INSERT INTO public.profiles (id, email)
  VALUES (new_user_id, viewer_email);

  -- Assign viewer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'viewer');

  -- Create survey response
  INSERT INTO public.survey_responses (
    user_id,
    year,
    role_badge,
    completed_at,
    created_at,
    updated_at,
    -- Survey fields
    vehicle_name,
    vehicle_websites,
    vehicle_type,
    thesis,
    team_members,
    team_size_min,
    team_size_max,
    team_description,
    legal_domicile,
    markets_operated,
    ticket_size_min,
    ticket_size_max,
    ticket_description,
    target_capital,
    capital_raised,
    capital_in_market,
    supporting_document_url,
    information_sharing,
    expectations,
    how_heard_about_network,
    fund_stage,
    current_status,
    legal_entity_date_from,
    legal_entity_date_to,
    first_close_date_from,
    first_close_date_to,
    investment_instruments_priority,
    sectors_allocation,
    target_return_min,
    target_return_max,
    equity_investments_made,
    equity_investments_exited,
    self_liquidating_made,
    self_liquidating_exited
  ) VALUES (
    new_user_id,
    survey_year,
    'viewer',
    NOW(),
    NOW(),
    NOW(),
    survey_data->>'vehicle_name',
    CASE 
      WHEN survey_data->>'vehicle_websites' IS NOT NULL 
      THEN ARRAY[survey_data->>'vehicle_websites']
      ELSE NULL
    END,
    survey_data->>'vehicle_type',
    survey_data->>'thesis',
    survey_data->>'team_members',
    (survey_data->>'team_size_min')::INTEGER,
    (survey_data->>'team_size_max')::INTEGER,
    survey_data->>'team_description',
    CASE 
      WHEN survey_data->>'legal_domicile' IS NOT NULL 
      THEN ARRAY[survey_data->>'legal_domicile']
      ELSE NULL
    END,
    survey_data->>'markets_operated',
    (survey_data->>'ticket_size_min')::NUMERIC,
    (survey_data->>'ticket_size_max')::NUMERIC,
    survey_data->>'ticket_description',
    (survey_data->>'target_capital')::NUMERIC,
    (survey_data->>'capital_raised')::NUMERIC,
    (survey_data->>'capital_in_market')::NUMERIC,
    survey_data->>'supporting_document_url',
    survey_data->>'information_sharing',
    survey_data->>'expectations',
    survey_data->>'how_heard_about_network',
    CASE 
      WHEN survey_data->>'fund_stage' IS NOT NULL 
      THEN ARRAY[survey_data->>'fund_stage']
      ELSE NULL
    END,
    survey_data->>'current_status',
    (survey_data->>'legal_entity_date_from')::INTEGER,
    (survey_data->>'legal_entity_date_to')::INTEGER,
    (survey_data->>'first_close_date_from')::INTEGER,
    (survey_data->>'first_close_date_to')::INTEGER,
    survey_data->>'investment_instruments_priority',
    survey_data->>'sectors_allocation',
    (survey_data->>'target_return_min')::NUMERIC,
    (survey_data->>'target_return_max')::NUMERIC,
    (survey_data->>'equity_investments_made')::INTEGER,
    (survey_data->>'equity_investments_exited')::INTEGER,
    (survey_data->>'self_liquidating_made')::INTEGER,
    (survey_data->>'self_liquidating_exited')::INTEGER
  ) RETURNING id INTO survey_id;

  -- Create member_surveys entry
  INSERT INTO public.member_surveys (
    user_id,
    fund_name,
    website,
    fund_type,
    primary_investment_region,
    year_founded,
    team_size,
    typical_check_size,
    aum,
    investment_thesis,
    sector_focus,
    stage_focus,
    role_badge,
    completed_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    COALESCE(survey_data->>'vehicle_name', 'Unknown Fund'),
    survey_data->>'vehicle_websites',
    survey_data->>'vehicle_type',
    survey_data->>'primary_investment_region',
    (survey_data->>'year_founded')::INTEGER,
    (survey_data->>'team_size')::INTEGER,
    survey_data->>'typical_check_size',
    survey_data->>'aum',
    survey_data->>'investment_thesis',
    CASE 
      WHEN survey_data->>'sector_focus' IS NOT NULL 
      THEN ARRAY[survey_data->>'sector_focus']
      ELSE NULL
    END,
    CASE 
      WHEN survey_data->>'stage_focus' IS NOT NULL 
      THEN ARRAY[survey_data->>'stage_focus']
      ELSE NULL
    END,
    'viewer',
    NOW(),
    NOW(),
    NOW()
  );

  -- Log the activity
  INSERT INTO public.activity_logs (
    user_id,
    action,
    details
  ) VALUES (
    new_user_id,
    'viewer_created_with_survey',
    jsonb_build_object(
      'viewer_email', viewer_email,
      'survey_year', survey_year,
      'created_by', auth.uid()
    )
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for admin use)
GRANT EXECUTE ON FUNCTION create_viewer_with_survey TO authenticated;

-- Create function to get previous survey data for prefilling
CREATE OR REPLACE FUNCTION get_previous_survey_data(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  latest_survey JSONB;
BEGIN
  SELECT to_jsonb(sr.*) INTO latest_survey
  FROM public.survey_responses sr
  WHERE sr.user_id = user_uuid
  ORDER BY sr.created_at DESC
  LIMIT 1;
  
  RETURN latest_survey;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_previous_survey_data TO authenticated; 