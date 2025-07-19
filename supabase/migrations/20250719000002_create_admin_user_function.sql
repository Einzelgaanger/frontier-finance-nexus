-- Create a simple function for admins to create users
CREATE OR REPLACE FUNCTION create_user_by_admin(
  p_email TEXT,
  p_password TEXT,
  p_first_name TEXT DEFAULT '',
  p_last_name TEXT DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_encrypted_password TEXT;
BEGIN
  -- Check if the current user is an admin
  SELECT role INTO v_user_role
  FROM user_roles
  WHERE user_id = auth.uid();
  
  IF v_user_role IS NULL OR v_user_role != 'admin' THEN
    RETURN json_build_object('error', 'Admin access required');
  END IF;
  
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RETURN json_build_object('error', 'User with this email already exists');
  END IF;
  
  -- Encrypt the password
  v_encrypted_password := crypt(p_password, gen_salt('bf'));
  
  -- Create the user
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
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmed_at,
    email_change,
    last_sign_in_at,
    phone,
    phone_confirmed_at,
    phone_change,
    email_change_confirm_status,
    banned_until,
    reauthentication_sent_at,
    reauthentication_confirm_status
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    v_encrypted_password,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('first_name', p_first_name, 'last_name', p_last_name),
    false,
    NOW(),
    '{}',
    NOW(),
    NULL,
    NULL,
    '{}',
    0,
    NULL,
    NULL,
    0
  ) RETURNING id INTO v_user_id;
  
  -- Insert the user role
  INSERT INTO user_roles (user_id, role)
  VALUES (v_user_id, 'viewer');
  
  -- Return success
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', v_user_id,
      'email', p_email,
      'role', 'viewer'
    )
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_by_admin TO authenticated; 