-- Fix the create_viewer_survey_data function to resolve ambiguous user_id reference
CREATE OR REPLACE FUNCTION create_viewer_survey_data(
  user_id UUID,
  survey_data JSONB,
  survey_year INTEGER
)
RETURNS UUID AS $$
DECLARE
  survey_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current user ID for logging
  current_user_id := auth.uid();
  
  -- Assign viewer role if not already assigned
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;

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
    user_id,
    survey_year,
    'viewer',
    NOW(),
    NOW(),
    NOW(),
    survey_data->>'vehicle_name',
    survey_data->'vehicle_websites',
    survey_data->>'vehicle_type',
    survey_data->>'vehicle_type_other',
    survey_data->>'thesis',
    survey_data->'team_members',
    (survey_data->>'team_size_min')::INTEGER,
    (survey_data->>'team_size_max')::INTEGER,
    survey_data->>'team_description',
    survey_data->'legal_domicile',
    survey_data->>'legal_domicile_other',
    survey_data->'markets_operated',
    survey_data->>'markets_operated_other',
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
    survey_data->'fund_stage',
    survey_data->>'current_status',
    survey_data->>'current_status_other',
    (survey_data->>'legal_entity_date_from')::INTEGER,
    (survey_data->>'legal_entity_date_to')::INTEGER,
    (survey_data->>'legal_entity_month_from')::INTEGER,
    (survey_data->>'legal_entity_month_to')::INTEGER,
    (survey_data->>'first_close_date_from')::INTEGER,
    (survey_data->>'first_close_date_to')::INTEGER,
    (survey_data->>'first_close_month_from')::INTEGER,
    (survey_data->>'first_close_month_to')::INTEGER,
    survey_data->'investment_instruments_priority',
    survey_data->'investment_instruments_data',
    survey_data->'sectors_allocation',
    (survey_data->>'target_return_min')::NUMERIC,
    (survey_data->>'target_return_max')::NUMERIC,
    (survey_data->>'equity_investments_made')::INTEGER,
    (survey_data->>'equity_investments_exited')::INTEGER,
    (survey_data->>'self_liquidating_made')::INTEGER,
    (survey_data->>'self_liquidating_exited')::INTEGER
  ) RETURNING id INTO survey_id;

  -- Create member_surveys entry with updated structure
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
    user_id,
    COALESCE(survey_data->>'vehicle_name', 'Unknown Fund'),
    survey_data->'vehicle_websites',
    survey_data->>'vehicle_type',
    survey_data->>'primary_investment_region',
    (survey_data->>'year_founded')::INTEGER,
    (survey_data->>'team_size')::INTEGER,
    survey_data->>'typical_check_size',
    survey_data->>'aum',
    survey_data->>'thesis',
    survey_data->'sectors_allocation',
    survey_data->'fund_stage',
    'viewer',
    NOW(),
    NOW(),
    NOW()
  );

  -- Log the activity (only if current_user_id is not null)
  IF current_user_id IS NOT NULL THEN
    INSERT INTO public.activity_logs (
      user_id,
      action,
      details
    ) VALUES (
      current_user_id,
      'viewer_survey_created',
      jsonb_build_object(
        'survey_year', survey_year,
        'target_user_id', user_id,
        'vehicle_name', survey_data->>'vehicle_name'
      )
    );
  END IF;

  RETURN survey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for admin use)
GRANT EXECUTE ON FUNCTION create_viewer_survey_data TO authenticated;
