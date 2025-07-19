-- Create a function for admins to create viewer accounts
CREATE OR REPLACE FUNCTION admin_create_viewer(
  p_email TEXT,
  p_password TEXT,
  p_survey_data JSONB,
  p_survey_year INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_user_id UUID;
  v_current_user_role TEXT;
  v_result JSONB;
BEGIN
  -- Get the current user ID for authentication
  v_current_user_id := auth.uid();
  
  -- Check if current user is authenticated
  IF v_current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Authentication required');
  END IF;
  
  -- Check if current user is an admin
  SELECT role INTO v_current_user_role
  FROM public.user_roles
  WHERE user_id = v_current_user_id;
  
  IF v_current_user_role != 'admin' THEN
    RETURN jsonb_build_object('error', 'Admin access required');
  END IF;
  
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RETURN jsonb_build_object('error', 'User with this email already exists');
  END IF;
  
  -- Create the user using the service role (this requires the function to be SECURITY DEFINER)
  -- Note: This approach requires the function to be called with elevated privileges
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO v_user_id;
  
  -- Create profile for the new user
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_email,
    COALESCE(p_survey_data->>'vehicle_name', 'Viewer'),
    'User',
    NOW(),
    NOW()
  );
  
  -- Assign viewer role
  INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
  ) VALUES (
    v_user_id,
    'viewer',
    NOW()
  );
  
  -- Create survey data using the existing function
  PERFORM create_viewer_survey_data(v_user_id, p_survey_data, p_survey_year);
  
  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email,
    'message', 'Viewer created successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_create_viewer TO authenticated; 