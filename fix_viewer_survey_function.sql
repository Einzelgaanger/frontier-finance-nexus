-- Fix viewer survey submission to handle duplicate entries gracefully
DROP FUNCTION IF EXISTS create_viewer_survey_data(UUID, JSONB, INTEGER);

CREATE OR REPLACE FUNCTION create_viewer_survey_data(
  p_user_id UUID,
  p_survey_data JSONB,
  p_survey_year INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_survey_id UUID;
  v_current_user_id UUID;
  v_existing_survey_id UUID;
BEGIN
  -- Get the current user ID for logging
  v_current_user_id := auth.uid();
  
  -- Check if survey already exists for this user and year
  SELECT id INTO v_existing_survey_id 
  FROM public.survey_responses 
  WHERE user_id = p_user_id AND year = p_survey_year;
  
  -- If survey already exists, update it to completed status and return the ID
  IF v_existing_survey_id IS NOT NULL THEN
    -- Update the existing survey to mark it as completed
    UPDATE public.survey_responses 
    SET 
      completed_at = NOW(),
      updated_at = NOW(),
      vehicle_name = p_survey_data->>'vehicle_name',
      vehicle_websites = (p_survey_data->'vehicle_websites')::TEXT[],
      vehicle_type = p_survey_data->>'vehicle_type',
      vehicle_type_other = p_survey_data->>'vehicle_type_other',
      thesis = p_survey_data->>'thesis',
      team_members = p_survey_data->'team_members',
      team_size_min = (p_survey_data->>'team_size_min')::INTEGER,
      team_size_max = (p_survey_data->>'team_size_max')::INTEGER,
      team_description = p_survey_data->>'team_description',
      legal_domicile = (p_survey_data->'legal_domicile')::TEXT[],
      legal_domicile_other = p_survey_data->>'legal_domicile_other',
      markets_operated = p_survey_data->'markets_operated',
      markets_operated_other = p_survey_data->>'markets_operated_other',
      ticket_size_min = (p_survey_data->>'ticket_size_min')::NUMERIC,
      ticket_size_max = (p_survey_data->>'ticket_size_max')::NUMERIC,
      ticket_description = p_survey_data->>'ticket_description',
      target_capital = (p_survey_data->>'target_capital')::NUMERIC,
      capital_raised = (p_survey_data->>'capital_raised')::NUMERIC,
      capital_in_market = (p_survey_data->>'capital_in_market')::NUMERIC,
      supporting_document_url = p_survey_data->>'supporting_document_url',
      expectations = p_survey_data->>'expectations',
      how_heard_about_network = p_survey_data->>'how_heard_about_network',
      how_heard_about_network_other = p_survey_data->>'how_heard_about_network_other',
      fund_stage = (p_survey_data->'fund_stage')::TEXT[],
      current_status = p_survey_data->>'current_status',
      current_status_other = p_survey_data->>'current_status_other',
      legal_entity_date_from = (p_survey_data->>'legal_entity_date_from')::INTEGER,
      legal_entity_date_to = (p_survey_data->>'legal_entity_date_to')::INTEGER,
      legal_entity_month_from = (p_survey_data->>'legal_entity_month_from')::INTEGER,
      legal_entity_month_to = (p_survey_data->>'legal_entity_month_to')::INTEGER,
      first_close_date_from = (p_survey_data->>'first_close_date_from')::INTEGER,
      first_close_date_to = (p_survey_data->>'first_close_date_to')::INTEGER,
      first_close_month_from = (p_survey_data->>'first_close_month_from')::INTEGER,
      first_close_month_to = (p_survey_data->>'first_close_month_to')::INTEGER,
      investment_instruments_priority = p_survey_data->'investment_instruments_priority',
      investment_instruments_data = p_survey_data->'investment_instruments_data',
      sectors_allocation = p_survey_data->'sectors_allocation',
      target_return_min = (p_survey_data->>'target_return_min')::NUMERIC,
      target_return_max = (p_survey_data->>'target_return_max')::NUMERIC,
      equity_investments_made = (p_survey_data->>'equity_investments_made')::INTEGER,
      equity_investments_exited = (p_survey_data->>'equity_investments_exited')::INTEGER,
      self_liquidating_made = (p_survey_data->>'self_liquidating_made')::INTEGER,
      self_liquidating_exited = (p_survey_data->>'self_liquidating_exited')::INTEGER
    WHERE id = v_existing_survey_id;
    
    -- Also update or create member_surveys entry for network visibility
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
      p_user_id,
      COALESCE(p_survey_data->>'vehicle_name', 'Unknown Fund'),
      (p_survey_data->'vehicle_websites')::TEXT[],
      p_survey_data->>'vehicle_type',
      p_survey_data->>'primary_investment_region',
      (p_survey_data->>'year_founded')::INTEGER,
      (p_survey_data->>'team_size')::INTEGER,
      p_survey_data->>'typical_check_size',
      p_survey_data->>'aum',
      p_survey_data->>'thesis',
      p_survey_data->'sectors_allocation',
      (p_survey_data->'fund_stage')::TEXT[],
      'viewer',
      NOW(),
      NOW(),
      NOW()
    ) ON CONFLICT (user_id) DO UPDATE SET
      fund_name = EXCLUDED.fund_name,
      website = EXCLUDED.website,
      fund_type = EXCLUDED.fund_type,
      primary_investment_region = EXCLUDED.primary_investment_region,
      year_founded = EXCLUDED.year_founded,
      team_size = EXCLUDED.team_size,
      typical_check_size = EXCLUDED.typical_check_size,
      aum = EXCLUDED.aum,
      investment_thesis = EXCLUDED.investment_thesis,
      sector_focus = EXCLUDED.sector_focus,
      stage_focus = EXCLUDED.stage_focus,
      role_badge = EXCLUDED.role_badge,
      completed_at = EXCLUDED.completed_at,
      updated_at = NOW();
    
    RETURN v_existing_survey_id;
  END IF;
  
  -- Assign viewer role if not already assigned
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Ensure profile exists with correct email
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    p_user_id,
    COALESCE(p_survey_data->>'email', 'viewer@example.com'),
    COALESCE(p_survey_data->>'vehicle_name', 'Viewer'),
    'User'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();

  -- Create survey response with updated structure
  INSERT INTO public.survey_responses (
    user_id,
    year,
    role_badge,
    completed_at,
    created_at,
    updated_at,
    vehicle_name,
    vehicle_websites,
    vehicle_type,
    vehicle_type_other,
    thesis,
    team_members,
    team_size_min,
    team_size_max,
    team_description,
    legal_domicile,
    legal_domicile_other,
    markets_operated,
    markets_operated_other,
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
    current_status_other,
    legal_entity_date_from,
    legal_entity_date_to,
    legal_entity_month_from,
    legal_entity_month_to,
    first_close_date_from,
    first_close_date_to,
    first_close_month_from,
    first_close_month_to,
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
    p_user_id,
    p_survey_year,
    'viewer',
    NOW(),
    NOW(),
    NOW(),
    p_survey_data->>'vehicle_name',
    (p_survey_data->'vehicle_websites')::TEXT[],
    p_survey_data->>'vehicle_type',
    p_survey_data->>'vehicle_type_other',
    p_survey_data->>'thesis',
    p_survey_data->'team_members',
    (p_survey_data->>'team_size_min')::INTEGER,
    (p_survey_data->>'team_size_max')::INTEGER,
    p_survey_data->>'team_description',
    (p_survey_data->'legal_domicile')::TEXT[],
    p_survey_data->>'legal_domicile_other',
    p_survey_data->'markets_operated',
    p_survey_data->>'markets_operated_other',
    (p_survey_data->>'ticket_size_min')::NUMERIC,
    (p_survey_data->>'ticket_size_max')::NUMERIC,
    p_survey_data->>'ticket_description',
    (p_survey_data->>'target_capital')::NUMERIC,
    (p_survey_data->>'capital_raised')::NUMERIC,
    (p_survey_data->>'capital_in_market')::NUMERIC,
    p_survey_data->>'supporting_document_url',
    p_survey_data->>'expectations',
    p_survey_data->>'how_heard_about_network',
    p_survey_data->>'how_heard_about_network_other',
    (p_survey_data->'fund_stage')::TEXT[],
    p_survey_data->>'current_status',
    p_survey_data->>'current_status_other',
    (p_survey_data->>'legal_entity_date_from')::INTEGER,
    (p_survey_data->>'legal_entity_date_to')::INTEGER,
    (p_survey_data->>'legal_entity_month_from')::INTEGER,
    (p_survey_data->>'legal_entity_month_to')::INTEGER,
    (p_survey_data->>'first_close_date_from')::INTEGER,
    (p_survey_data->>'first_close_date_to')::INTEGER,
    (p_survey_data->>'first_close_month_from')::INTEGER,
    (p_survey_data->>'first_close_month_to')::INTEGER,
    p_survey_data->'investment_instruments_priority',
    p_survey_data->'investment_instruments_data',
    p_survey_data->'sectors_allocation',
    (p_survey_data->>'target_return_min')::NUMERIC,
    (p_survey_data->>'target_return_max')::NUMERIC,
    (p_survey_data->>'equity_investments_made')::INTEGER,
    (p_survey_data->>'equity_investments_exited')::INTEGER,
    (p_survey_data->>'self_liquidating_made')::INTEGER,
    (p_survey_data->>'self_liquidating_exited')::INTEGER
  ) RETURNING id INTO v_survey_id;

  -- Create member_surveys entry with updated structure (only if survey was created)
  IF v_survey_id IS NOT NULL THEN
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
      p_user_id,
      COALESCE(p_survey_data->>'vehicle_name', 'Unknown Fund'),
      (p_survey_data->'vehicle_websites')::TEXT[],
      p_survey_data->>'vehicle_type',
      p_survey_data->>'primary_investment_region',
      (p_survey_data->>'year_founded')::INTEGER,
      (p_survey_data->>'team_size')::INTEGER,
      p_survey_data->>'typical_check_size',
      p_survey_data->>'aum',
      p_survey_data->>'thesis',
      p_survey_data->'sectors_allocation',
      (p_survey_data->'fund_stage')::TEXT[],
      'viewer',
      NOW(),
      NOW(),
      NOW()
    );
  END IF;

  -- Log the activity (only if current_user_id is not null)
  IF v_current_user_id IS NOT NULL THEN
    INSERT INTO public.activity_logs (
      user_id,
      action,
      details
    ) VALUES (
      v_current_user_id,
      'viewer_survey_created',
      jsonb_build_object(
        'survey_year', p_survey_year,
        'target_user_id', p_user_id,
        'vehicle_name', p_survey_data->>'vehicle_name',
        'is_new_survey', v_survey_id IS NOT NULL
      )
    );
  END IF;

  RETURN v_survey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for admin use)
GRANT EXECUTE ON FUNCTION create_viewer_survey_data TO authenticated; 