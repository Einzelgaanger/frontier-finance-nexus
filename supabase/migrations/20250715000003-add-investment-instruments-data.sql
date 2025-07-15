-- Add investment_instruments_data field to survey_responses table

-- Add the new field for detailed investment instruments data
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS investment_instruments_data JSONB;

-- Update the create_viewer_with_survey function to handle the new field
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
    expectations,
    how_heard_about_network,
    how_heard_about_network_other,
    fund_stage,
    current_status,
    legal_entity_date_from,
    legal_entity_date_to,
    first_close_date_from,
    first_close_date_to,
    investment_instruments_priority,
    investment_instruments_data,
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
    survey_data->>'expectations',
    survey_data->>'how_heard_about_network',
    survey_data->>'how_heard_about_network_other',
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
    survey_data->>'investment_instruments_data',
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
    completed_at
  ) VALUES (
    new_user_id,
    survey_data->>'vehicle_name',
    survey_data->>'vehicle_websites',
    survey_data->>'vehicle_type',
    survey_data->>'markets_operated',
    (survey_data->>'legal_entity_date_from')::INTEGER,
    (survey_data->>'team_size_max')::INTEGER,
    CASE 
      WHEN (survey_data->>'ticket_size_min')::NUMERIC IS NOT NULL AND (survey_data->>'ticket_size_max')::NUMERIC IS NOT NULL
      THEN CONCAT('$', (survey_data->>'ticket_size_min')::NUMERIC, ' - $', (survey_data->>'ticket_size_max')::NUMERIC)
      ELSE NULL
    END,
    CASE 
      WHEN (survey_data->>'capital_raised')::NUMERIC IS NOT NULL
      THEN CONCAT('$', (survey_data->>'capital_raised')::NUMERIC)
      ELSE NULL
    END,
    survey_data->>'thesis',
    survey_data->>'sectors_allocation',
    survey_data->>'fund_stage',
    'viewer',
    NOW()
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 